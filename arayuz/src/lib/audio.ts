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

    gain.gain.setValueAtTime(0.08, ctx.currentTime);
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

export const startCosmicAmbient = (targetVolume = 0.05): void => {
  if (typeof window === 'undefined') return;
  if (activeAmbient) return; // Zaten çalıyor

  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    // Ana Ses Kazancı (Master Gain) - Yumuşak giriş (fade-in)
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0.0001, ctx.currentTime);
    masterGain.gain.exponentialRampToValueAtTime(targetVolume, ctx.currentTime + 3.0);

    // Düşük Geçiren Filtre (Lowpass Filter) - İpeksi, yumuşak, kulak yormayan tını
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(650, ctx.currentTime);

    // Kozmik Nefes LFO (0.05 Hz = 20 saniyede bir nefes alıp veren kozmik dalga)
    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    lfo.frequency.setValueAtTime(0.05, ctx.currentTime);
    lfoGain.gain.setValueAtTime(0.015, ctx.currentTime);
    lfo.connect(lfoGain);
    lfoGain.connect(masterGain.gain);

    // Kutsal Kozmik Akor:
    // 432 Hz: Ana Kozmik Rezonans Frekansı
    // 108 Hz: Derin Kök Sub-Bass (Topraklanma)
    // 216 Hz: Sıcak Orta Frekans (Kalp Rezonansı)
    // 648 Hz: Göksel 5'li (Ethereal Işık)
    const freqs = [108, 216, 432, 648];
    const oscs: OscillatorNode[] = [];

    freqs.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const oscGain = ctx.createGain();

      osc.type = 'sine';
      // Hafif mikro-detune (0.4 Hz fark ile büyüleyici binaural zenginlik)
      const detune = idx === 2 ? 0.35 : idx === 3 ? -0.25 : 0;
      osc.frequency.setValueAtTime(freq + detune, ctx.currentTime);

      const individualVolume = idx === 0 ? 0.4 : idx === 1 ? 0.3 : idx === 2 ? 0.25 : 0.15;
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
    startCosmicAmbient(0.05);
  } else {
    stopCosmicAmbient();
  }
};
