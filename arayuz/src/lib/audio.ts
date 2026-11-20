// Web Audio API - Kozmik 432 Hz Mistik Ses & Ortam Tınısı Motoru

let sharedCtx: AudioContext | null = null;

const getAudioContext = (): AudioContext | null => {
  if (typeof window === 'undefined') return null;
  if (!sharedCtx || sharedCtx.state === 'closed') {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioCtx) {
      sharedCtx = new AudioCtx();
    }
  }
  if (sharedCtx && sharedCtx.state === 'suspended') {
    sharedCtx.resume().catch(() => {});
  }
  return sharedCtx;
};

// -------------------------------------------------------------
// 1. ANLIK SESLER (TON & ÇAN)
// -------------------------------------------------------------
export const playTone = (
  freq: number,
  type: OscillatorType = 'sine',
  duration: number = 1.0,
  soundEnabled: boolean = true
): void => {
  if (!soundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);

    gain.gain.setValueAtTime(0.035, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch (e) {}
};

export const playCosmicChime = (soundEnabled: boolean = true): void => {
  if (!soundEnabled) return;
  const chord = [432, 540, 648, 864];
  chord.forEach((freq, i) => {
    setTimeout(() => playTone(freq, 'sine', 2.0, soundEnabled), i * 150);
  });
};

// -------------------------------------------------------------
// 2. SÜREKLİ ARKA PLAN KOZMİK TINI (432 HZ BİNAURAL AMBİYANS)
// -------------------------------------------------------------
interface AmbientNodes {
  ctx: AudioContext;
  masterGain: GainNode;
  oscillators: OscillatorNode[];
  lfo: OscillatorNode;
}

let activeAmbient: AmbientNodes | null = null;

export const startCosmicAmbient = (targetVolume = 0.018): void => {
  if (typeof window === 'undefined') return;
  if (activeAmbient) return; // Zaten çalıyor

  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    // Ana Ses Kazancı (Master Gain) - Yumuşak giriş (fade-in)
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0.0001, ctx.currentTime);
    masterGain.gain.exponentialRampToValueAtTime(targetVolume, ctx.currentTime + 3.0);

    // Düşük Geçiren Filtre (Lowpass Filter) - Kadifemsi, sıcak, kulak yormayan tını (380 Hz)
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(380, ctx.currentTime);

    // Kozmik Nefes LFO (0.04 Hz = 25 saniyede bir hafifçe dalgalanan fısıltı)
    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    lfo.frequency.setValueAtTime(0.04, ctx.currentTime);
    lfoGain.gain.setValueAtTime(0.003, ctx.currentTime);
    lfo.connect(lfoGain);
    lfoGain.connect(masterGain.gain);

    // Kutsal Kozmik Akor:
    // 108 Hz: Derin Kök Sub-Bass (Sıcak zemin)
    // 216 Hz: Sıcak Orta Frekans (Kalp Rezonansı)
    // 432 Hz: Ana Kozmik Rezonans Frekansı (Çok hafif, fısıltı seviyesi)
    // 648 Hz: Göksel 5'li (Ethereal ışıltı, ultra hafif)
    const freqs = [108, 216, 432, 648];
    const oscs: OscillatorNode[] = [];

    freqs.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const oscGain = ctx.createGain();

      osc.type = 'sine';
      // Hafif mikro-detune (binaural derinlik)
      const detune = idx === 2 ? 0.2 : idx === 3 ? -0.15 : 0;
      osc.frequency.setValueAtTime(freq + detune, ctx.currentTime);

      const individualVolume = idx === 0 ? 0.35 : idx === 1 ? 0.25 : idx === 2 ? 0.10 : 0.04;
      oscGain.gain.setValueAtTime(individualVolume, ctx.currentTime);

      osc.connect(oscGain);
      oscGain.connect(filter);
      osc.start();
      oscs.push(osc);
    });

    filter.connect(masterGain);
    masterGain.connect(ctx.destination);
    lfo.start();

    activeAmbient = {
      ctx,
      masterGain,
      oscillators: oscs,
      lfo
    };
  } catch (e) {}
};

export const stopCosmicAmbient = (): void => {
  if (!activeAmbient) return;
  try {
    const { ctx, masterGain, oscillators, lfo } = activeAmbient;
    // 2 saniyelik yumuşak çıkış (fade-out)
    masterGain.gain.setValueAtTime(masterGain.gain.value, ctx.currentTime);
    masterGain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 1.8);

    setTimeout(() => {
      oscillators.forEach(osc => {
        try { osc.stop(); osc.disconnect(); } catch (e) {}
      });
      try { lfo.stop(); lfo.disconnect(); } catch (e) {}
      try { masterGain.disconnect(); } catch (e) {}
      activeAmbient = null;
    }, 2000);
  } catch (e) {
    activeAmbient = null;
  }
};

export const toggleCosmicAmbient = (enable: boolean): void => {
  if (enable) {
    startCosmicAmbient(0.018);
  } else {
    stopCosmicAmbient();
  }
};
