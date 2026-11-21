import assert from 'node:assert/strict';
import test from 'node:test';
import { BUBBLE_INTERVAL, createGame, updateGame } from '../src/game.mjs';
import { pointerPosition } from '../src/pointer.mjs';

test('the fish starts at the center', () => {
   const { player } = createGame();
   assert.equal(player.x, 400);
   assert.equal(player.y, 250);
});

test('simultaneous collisions score once per bubble and expired bubbles disappear', () => {
   const game = createGame();
   game.untilSpawn = BUBBLE_INTERVAL;
   game.bubbles.push(
      { x: 400, y: 250, radius: 30, speed: 60, sound: 0 },
      { x: 400, y: 250, radius: 30, speed: 60, sound: 1 },
      { x: 10, y: -70, radius: 30, speed: 60, sound: 0 },
   );

   assert.deepEqual(updateGame(game, game.player, 1 / 60), [0, 1]);
   assert.equal(game.score, 2);
   assert.equal(game.bubbles.length, 0);
   assert.deepEqual(updateGame(game, game.player, 1 / 60), []);
   assert.equal(game.score, 2);
});

test('pointer coordinates follow the current position and scale of the canvas', () => {
   assert.deepEqual(pointerPosition(150, 95, { left: 50, top: 20, width: 400, height: 250 }), {
      x: 200,
      y: 150,
   });
   assert.deepEqual(pointerPosition(150, 95, { left: 100, top: 20, width: 200, height: 125 }), {
      x: 200,
      y: 300,
   });
});

function simulate(rate) {
   const game = createGame();
   game.bubbles.push({ x: 0, y: 450, radius: 30, speed: 100, sound: 0 });
   for (let frame = 0; frame < rate; frame++) {
      updateGame(game, { x: 700, y: 250 }, 1 / rate);
   }
   return game;
}

test('movement and spawning match at 60 and 120 updates per second', () => {
   const game60 = simulate(60);
   const game120 = simulate(120);
   assert.equal(game60.bubbles.length, 3);
   assert.equal(game120.bubbles.length, 3);
   assert.ok(Math.abs(game60.player.x - game120.player.x) < 1e-9);
   assert.ok(Math.abs(game60.bubbles[0].y - game120.bubbles[0].y) < 1e-9);
   assert.ok(Math.abs(game60.untilSpawn - game120.untilSpawn) < 1e-9);
});
