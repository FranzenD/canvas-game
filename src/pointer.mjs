import { WIDTH, HEIGHT } from './game.mjs';

export function pointerPosition(clientX, clientY, rect) {
   return {
      x: Math.max(0, Math.min(WIDTH, (clientX - rect.left) * WIDTH / rect.width)),
      y: Math.max(0, Math.min(HEIGHT, (clientY - rect.top) * HEIGHT / rect.height)),
   };
}

export function bindPointerControls(canvas, initialTarget) {
   let target = { ...initialTarget };
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

   return {
      get target() { return target; },
      get isActive() { return activePointer !== null; },
   };
}
