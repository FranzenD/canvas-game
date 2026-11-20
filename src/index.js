import './style.css';
import bubbleOne from './sound/bubble_01.mp3';
import bubbleTwo from './sound/bubble_02.mp3';
import fishLeft from './sprites/fish_red_swim_left.png';
import fishRight from './sprites/fish_red_swim_right.png';
import { WIDTH, HEIGHT, createGame, pointerPosition, updateGame } from './game.mjs';

const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
const score = document.getElementById('score');
const soundButton = document.getElementById('sound');
const soundStatus = document.getElementById('sound-status');
const game = createGame();
canvas.width = WIDTH;
canvas.height = HEIGHT;

let target = { x: game.player.x, y: game.player.y };
let activePointer = null;

function aim(event) {
   target = pointerPosition(event.clientX, event.clientY, canvas.getBoundingClientRect());
}

canvas.addEventListener('pointerdown', event => {
   if (activePointer !== null || event.button !== 0) return;
   activePointer = event.pointerId;
   canvas.setPointerCapture(event.pointerId);
   aim(event);
});

canvas.addEventListener('pointermove', event => {
   if (event.pointerId === activePointer) aim(event);
});

function endPointer(event) {
   if (event.pointerId === activePointer) activePointer = null;
}

for (const type of ['pointerup', 'pointercancel', 'lostpointercapture']) {
   canvas.addEventListener(type, endPointer);
}

let audio;
let effects;
let soundEnabled = false;

soundButton.addEventListener('click', async () => {
   soundEnabled = !soundEnabled;
   soundButton.setAttribute('aria-pressed', String(soundEnabled));
   if (!soundEnabled) return;

   soundButton.disabled = true;
   soundStatus.textContent = '';
   try {
      audio ??= new AudioContext();
      await audio.resume();
      effects ??= await Promise.all([bubbleOne, bubbleTwo].map(async url => {
         const response = await fetch(url);
         if (!response.ok) throw new Error('Could not load bubble sound');
         return audio.decodeAudioData(await response.arrayBuffer());
      }));
   } catch {
      soundEnabled = false;
      soundButton.setAttribute('aria-pressed', 'false');
      soundStatus.textContent = 'Sound could not be enabled.';
   } finally {
      soundButton.disabled = false;
   }
});

function playSound(index) {
   if (!soundEnabled || !effects || audio.state !== 'running') return;
   const source = audio.createBufferSource();
   source.buffer = effects[index];
   source.connect(audio.destination);
   source.start();
}

const leftSprite = new Image();
leftSprite.src = fishLeft;
const rightSprite = new Image();
rightSprite.src = fishRight;

function drawPlayer() {
   const { player } = game;
   if (activePointer !== null) {
      ctx.lineWidth = 0.2;
      ctx.beginPath();
      ctx.moveTo(player.x, player.y);
      ctx.lineTo(target.x, target.y);
      ctx.stroke();
   }

   const sprite = player.facingLeft ? leftSprite : rightSprite;
   if (!sprite.naturalWidth) return;
   ctx.save();
   ctx.translate(player.x, player.y);
   ctx.rotate(player.angle);
   ctx.drawImage(sprite, 0, 0, 498, 327, -60, player.facingLeft ? -45 : -40, 498 / 4, 327 / 4);
   ctx.restore();
}

let lastTime;

function animate(time) {
   const seconds = Math.min((time - (lastTime ?? time)) / 1000, 0.05);
   lastTime = time;
   const hits = updateGame(game, target, seconds);
   hits.forEach(playSound);
   if (hits.length) score.textContent = game.score;

   ctx.clearRect(0, 0, WIDTH, HEIGHT);
   ctx.fillStyle = 'blue';
   for (const bubble of game.bubbles) {
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(bubble.x, bubble.y, bubble.radius, 0, 2 * Math.PI);
      ctx.fill();
      ctx.stroke();
   }
   drawPlayer();
   requestAnimationFrame(animate);
}

document.addEventListener('visibilitychange', () => {
   lastTime = undefined;
});
requestAnimationFrame(animate);
