import bubbleOne from './sound/bubble_01.mp3';
import bubbleTwo from './sound/bubble_02.mp3';

export function bindBubbleAudio(soundButton, soundStatus) {
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

   return playSound;
}
