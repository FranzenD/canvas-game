import fishLeft from './sprites/fish_red_swim_left.png';
import fishRight from './sprites/fish_red_swim_right.png';
import { WIDTH, HEIGHT } from './game.mjs';

export function createRenderer(canvas) {
   const ctx = canvas.getContext('2d');
   canvas.width = WIDTH;
   canvas.height = HEIGHT;

   const leftSprite = new Image();
   leftSprite.src = fishLeft;
   const rightSprite = new Image();
   rightSprite.src = fishRight;

   function drawPlayer(player, target, isPointerActive) {
      if (isPointerActive) {
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

   return function render(game, target, isPointerActive) {
      ctx.clearRect(0, 0, WIDTH, HEIGHT);
      ctx.fillStyle = 'blue';
      for (const bubble of game.bubbles) {
         ctx.lineWidth = 1;
         ctx.beginPath();
         ctx.arc(bubble.x, bubble.y, bubble.radius, 0, 2 * Math.PI);
         ctx.fill();
         ctx.stroke();
      }
      drawPlayer(game.player, target, isPointerActive);
   };
}
