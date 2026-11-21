import './style.css';
import { createGame, updateGame } from './game.mjs';
import { bindPointerControls } from './pointer.mjs';
import { createRenderer } from './renderer.js';
import { bindBubbleAudio } from './audio.js';

const canvas = document.getElementById('canvas1');
const score = document.getElementById('score');
const game = createGame();
const render = createRenderer(canvas);
const pointer = bindPointerControls(canvas, { x: game.player.x, y: game.player.y });
const playSound = bindBubbleAudio(
   document.getElementById('sound'),
   document.getElementById('sound-status'),
);

let lastTime;

function animate(time) {
   const seconds = Math.min((time - (lastTime ?? time)) / 1000, 0.05);
   lastTime = time;
   const { target, isActive } = pointer;
   const hits = updateGame(game, target, seconds);
   hits.forEach(playSound);
   if (hits.length) score.textContent = game.score;

   render(game, target, isActive);
   requestAnimationFrame(animate);
}

document.addEventListener('visibilitychange', () => {
   lastTime = undefined;
});
requestAnimationFrame(animate);
