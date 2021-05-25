import './style.css';
import Sound1 from './sound/bubble_01.mp3';
import Sound2 from './sound/bubble_02.mp3';
import fishLeft from './sprites/fish_red_swim_left.png';
import fishRight from './sprites/fish_red_swim_right.png';

// Sound Setup
const bubbleSound = document.createElement('audio');

// Canvas setup
const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');

canvas.width = 800;
canvas.height = 500;

let score = 0;
let gameFrame = 0;
ctx.font = '50px Georgia';

// Mouse interactivity
let canvasPosition = canvas.getBoundingClientRect();
const mouse = {
   x: canvas.width / 2,
   y: canvas.height / 2,
   click: false,
};

canvas.addEventListener('mousedown', event => {
   mouse.click = true;
   mouse.x = event.x - canvasPosition.left;
   mouse.y = event.y - canvasPosition.top;
});

canvas.addEventListener('mouseup', () => {
   mouse.click = false;
});

// Player
const playerLeft = new Image();
playerLeft.src = fishLeft;
const playerRight = new Image();
playerRight.src = fishRight;

class Player {
   constructor() {
      this.x = canvas.height / 2;
      this.y = canvas.width / 2;
      this.radius = 45;
      this.angle = 0;
      this.frameX = 0;
      this.frameY = 0;
      this.frameXR = 3;
      this.frameYR = 2;
      this.frame = 0;
      this.spriteWidth = 498;
      this.spriteHeight = 327;
      this.staggerFrames = 5;
   }

   update() {
      const dx = this.x - mouse.x;
      const dy = this.y - mouse.y;
      const theta = Math.atan2(dy, dx);
      this.angle = theta;
      if (mouse.x != this.x) {
         this.x -= dx / 20;
      }

      if (mouse.y != this.y) {
         this.y -= dy / 20;
      }
   }

   draw() {
      if (mouse.click) {
         ctx.lineWidth = 0.2;
         ctx.beginPath();
         ctx.moveTo(this.x, this.y);
         ctx.lineTo(mouse.x, mouse.y);
         ctx.stroke();
      }
      // ctx.fillStyle = 'red';
      // ctx.beginPath();
      // ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      // ctx.fill();
      // ctx.closePath();

      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.angle);
      if (this.x >= mouse.x) {
         ctx.drawImage(
            playerLeft,
            this.frameX * this.spriteWidth,
            this.frameY * this.spriteHeight,
            this.spriteWidth,
            this.spriteHeight,
            0 - 60,
            0 - 45,
            this.spriteWidth / 4,
            this.spriteHeight / 4
         );
      } else {
         ctx.drawImage(
            playerRight,
            this.frameXR * this.spriteWidth,
            this.frameYR * this.spriteHeight,
            this.spriteWidth,
            this.spriteHeight,
            0 - 60,
            0 - 40,
            this.spriteWidth / 4,
            this.spriteHeight / 4
         );
      }
      ctx.restore();

      if (this.frame % this.staggerFrames == 0) {
         this.frameX++;
         this.frameXR--;
         if (this.frameX == 4) {
            this.frameY++;
            this.frameYR--;
            this.frameX = 0;
            this.frameXR = 3;
         }
         if (this.frame % 12 == 0) {
            this.frame = this.frameX = this.frameY = 0;
            this.frameXR = 3;
            this.frameYR = 2;
         }
      }
      this.frame++;
   }
}

const player = new Player();

// Bubbles
const bubblesArray = [];

class Bubble {
   constructor() {
      this.radius = Math.max(Math.floor(Math.random() * 50), 30);
      this.x = Math.random() * canvas.width;
      this.y = canvas.height + this.radius * 2;
      this.speed = Math.random() * 5 + 1;
      this.distance;
      this.counted = false;
      this.sound = Math.random() <= 0.5 ? 'sound1' : 'sound2';
   }
   update() {
      this.y -= this.speed;
      const dx = this.x - player.x;
      const dy = this.y - player.y;
      this.distance = Math.sqrt(dx * dx + dy * dy);
   }
   draw() {
      ctx.fillStyle = 'blue';
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.closePath();
      ctx.stroke();
   }
}

function handleBubbles() {
   if (gameFrame % 50 === 0) {
      bubblesArray.push(new Bubble());
   }

   bubblesArray.forEach(bubble => {
      bubble.update();
      bubble.draw();
   });

   bubblesArray.forEach(bubble => {
      if (bubble.y < 0 - bubble.radius * 2) {
         const index = bubblesArray.indexOf(bubble);
         bubblesArray.splice(index, 1);
      } else if (bubble.distance < bubble.radius + player.radius) {
         if (!bubble.counted) {
            if (bubble.sound == 'sound1') {
               bubbleSound.src = Sound1;
               bubbleSound.play();
            } else {
               bubbleSound.src = Sound2;
               bubbleSound.play();
            }
            score++;
            bubble.counted = true;
            const index = bubblesArray.indexOf(bubble);
            bubblesArray.splice(index, 1);
         }
      }
   });
}
// Animation loop

function animate() {
   ctx.clearRect(0, 0, canvas.width, canvas.height);
   handleBubbles();
   player.update();
   player.draw();
   ctx.fillStyle = 'black';
   ctx.fillText('score: ' + score, 10, 50);
   gameFrame++;
   requestAnimationFrame(animate);
}

animate();
