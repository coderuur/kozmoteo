export const playTone = (
  freq: number,
  type: OscillatorType = 'sine',
  duration: number = 1.0,
  soundEnabled: boolean = true
): void => {
  if (!soundEnabled || typeof window === 'undefined') return;
  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    gain.gain.setValueAtTime(0.12, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch (e) {
    // AudioContext might be blocked until user interaction
  }
};

export const playCosmicChime = (soundEnabled: boolean = true): void => {
  if (!soundEnabled) return;
  const chord = [432, 540, 648, 864];
  chord.forEach((freq, i) => {
    setTimeout(() => playTone(freq, 'sine', 1.8, soundEnabled), i * 160);
  });
};
