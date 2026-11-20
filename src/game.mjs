export const WIDTH = 800;
export const HEIGHT = 500;
export const BUBBLE_INTERVAL = 50 / 60;

export function createGame() {
   return {
      player: { x: WIDTH / 2, y: HEIGHT / 2, radius: 45, angle: 0, facingLeft: true },
      bubbles: [],
      score: 0,
      untilSpawn: 0,
   };
}

export function pointerPosition(clientX, clientY, rect) {
   return {
      x: Math.max(0, Math.min(WIDTH, (clientX - rect.left) * WIDTH / rect.width)),
      y: Math.max(0, Math.min(HEIGHT, (clientY - rect.top) * HEIGHT / rect.height)),
   };
}

function createBubble() {
   const radius = Math.max(Math.floor(Math.random() * 50), 30);
   return {
      radius,
      x: Math.random() * WIDTH,
      y: HEIGHT + radius * 2,
      speed: (Math.random() * 5 + 1) * 60,
      sound: Math.random() < 0.5 ? 0 : 1,
   };
}

export function updateGame(game, target, seconds) {
   const { player } = game;
   const dx = player.x - target.x;
   const dy = player.y - target.y;
   // Match the original easing at 60 Hz.
   const movement = 1 - Math.pow(0.95, seconds * 60);
   if (Math.hypot(dx, dy) > 0.01) {
      player.angle = Math.atan2(dy, dx);
      player.facingLeft = dx >= 0;
   }
   player.x -= dx * movement;
   player.y -= dy * movement;

   game.untilSpawn -= seconds;
   while (game.untilSpawn <= 0) {
      const bubble = createBubble();
      // Existing bubbles advance a full step, so compensate for a mid-step spawn.
      bubble.y += bubble.speed * (seconds + game.untilSpawn);
      game.bubbles.push(bubble);
      game.untilSpawn += BUBBLE_INTERVAL;
   }

   const sounds = [];
   game.bubbles = game.bubbles.filter(bubble => {
      bubble.y -= bubble.speed * seconds;
      if (bubble.y < -bubble.radius * 2) return false;

      const dx = bubble.x - player.x;
      const dy = bubble.y - player.y;
      const reach = bubble.radius + player.radius;
      if (dx * dx + dy * dy >= reach * reach) return true;

      game.score++;
      sounds.push(bubble.sound);
      return false;
   });
   return sounds;
}
