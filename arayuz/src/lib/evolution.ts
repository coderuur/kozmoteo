// =====================================================================
// KOZMO-TEO v2.0: FELSEFİ EVRİM HARİTASI
// =====================================================================

export interface EvolutionEntry {
  timestamp: number;         // Unix ms
  archetype: string;
  belief_name: string;
  similarity_percentage: number;
  vector_5d: number[];
  test_type: string;
}

export interface EvolutionDelta {
  dimension: string;
  change: number;           // pozitif = yükseldi, negatif = düştü
  direction: 'up' | 'down' | 'stable';
}

export interface EvolutionAnalysis {
  totalEntries: number;
  firstEntry: EvolutionEntry;
  latestEntry: EvolutionEntry;
  archetypeJourney: string[];
  biggestShift: EvolutionDelta;
  dominantTheme: string;
  evolutionStory: string;
  stageName: string;        // "Tohumlanma", "Kırılma", "Dönüşüm" vs.
}

const DIMENSION_LABELS = [
  'Tektanrıcılık',
  'Ritüelizm',
  'Ölüm Sonrası',
  'Dogmatizm',
  'Doğa/Panteizm'
];

const LOCAL_KEY = 'kozmo_evolution_log';
const MAX_ENTRIES = 50;

// --- CRUD ---

export const saveEvolutionEntry = (entry: Omit<EvolutionEntry, 'timestamp'>): void => {
  try {
    const log = getEvolutionLog();
    const newEntry: EvolutionEntry = { ...entry, timestamp: Date.now() };
    log.push(newEntry);
    // Son MAX_ENTRIES kaydı tut
    const trimmed = log.slice(-MAX_ENTRIES);
    localStorage.setItem(LOCAL_KEY, JSON.stringify(trimmed));
  } catch (e) {}
};

export const getEvolutionLog = (): EvolutionEntry[] => {
  try {
    const raw = localStorage.getItem(LOCAL_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as EvolutionEntry[];
  } catch (e) {
    return [];
  }
};

export const clearEvolutionLog = (): void => {
  localStorage.removeItem(LOCAL_KEY);
};

// --- ANALİZ ---

export const analyzeEvolution = (log: EvolutionEntry[]): EvolutionAnalysis | null => {
  if (log.length < 2) return null;

  const sorted = [...log].sort((a, b) => a.timestamp - b.timestamp);
  const first = sorted[0];
  const latest = sorted[sorted.length - 1];

  // Boyut bazlı delta
  const deltas: EvolutionDelta[] = DIMENSION_LABELS.map((label, i) => {
    const change = latest.vector_5d[i] - first.vector_5d[i];
    return {
      dimension: label,
      change: parseFloat(change.toFixed(3)),
      direction: Math.abs(change) < 0.05 ? 'stable' : change > 0 ? 'up' : 'down'
    };
  });

  const biggestShift = deltas.reduce((prev, cur) =>
    Math.abs(cur.change) > Math.abs(prev.change) ? cur : prev
  );

  // Dominant boyut (son testte en yüksek)
  const latestVec = latest.vector_5d;
  const dominantIdx = latestVec.indexOf(Math.max(...latestVec));
  const dominantTheme = DIMENSION_LABELS[dominantIdx];

  // Arketip yolculuğu (tekrarları sıkıştır)
  const archetypeJourney: string[] = [];
  sorted.forEach(e => {
    if (archetypeJourney[archetypeJourney.length - 1] !== e.archetype) {
      archetypeJourney.push(e.archetype);
    }
  });

  // Evre adı
  const totalShift = deltas.reduce((s, d) => s + Math.abs(d.change), 0);
  let stageName = 'Tohumlanma';
  if (sorted.length >= 3 && totalShift > 1.5) stageName = 'Dönüşüm';
  else if (sorted.length >= 2 && totalShift > 0.8) stageName = 'Kırılma';
  else if (sorted.length >= 5) stageName = 'Kristalleşme';

  // Hikaye metni
  const evolutionStory = buildEvolutionStory(first, latest, biggestShift, archetypeJourney, stageName, sorted.length);

  return {
    totalEntries: sorted.length,
    firstEntry: first,
    latestEntry: latest,
    archetypeJourney,
    biggestShift,
    dominantTheme,
    evolutionStory,
    stageName
  };
};

const buildEvolutionStory = (
  first: EvolutionEntry,
  latest: EvolutionEntry,
  biggestShift: EvolutionDelta,
  journey: string[],
  stage: string,
  count: number
): string => {
  const daysDiff = Math.round((latest.timestamp - first.timestamp) / 86400000);
  const dayText = daysDiff === 0 ? 'bugün' : daysDiff === 1 ? '1 gün önce' : `${daysDiff} gün önce`;

  let story = `${dayText} başladığında sen **${first.archetype}** arketipinin frekansındaydın. `;

  if (journey.length > 1) {
    story += `${count} testte şu yolculuğu yaptın: ${journey.join(' → ')}. `;
  }

  if (biggestShift.direction !== 'stable') {
    const dir = biggestShift.direction === 'up' ? 'yoğunlaştı' : 'hafifledi';
    story += `En büyük dönüşüm **${biggestShift.dimension}** boyutunda yaşandı; bu eksen ${dir}. `;
  }

  story += {
    'Tohumlanma': 'Yolculuğun daha yeni başlıyor; her yeni test zihninin bir katmanını daha açıyor.',
    'Kırılma': 'Bilinçaltında bir şeyler değişiyor. Eski kalıplar kırılmaya başladı.',
    'Dönüşüm': 'Kimliğin aktif bir dönüşümde. Bunun adı evrim, kaçış değil.',
    'Kristalleşme': 'Uzun bir yolculuktan sonra düşüncelerin kristalleşiyor. Öz benliğin netleşiyor.'
  }[stage] ?? '';

  return story;
};

// Canvas üzerinde timeline çizmek için veri formatı
export const getTimelinePoints = (log: EvolutionEntry[]): {
  x: number; // 0..1 normalize
  y: number; // 0..1 normalize
  archetype: string;
  date: string;
  pct: number;
}[] => {
  if (log.length === 0) return [];
  const sorted = [...log].sort((a, b) => a.timestamp - b.timestamp);
  const minT = sorted[0].timestamp;
  const maxT = sorted[sorted.length - 1].timestamp;
  const tRange = maxT - minT || 1;

  return sorted.map(entry => ({
    x: (entry.timestamp - minT) / tRange,
    y: 1 - entry.similarity_percentage / 100,
    archetype: entry.archetype,
    date: new Date(entry.timestamp).toLocaleDateString('tr-TR', { day: '2-digit', month: 'short' }),
    pct: entry.similarity_percentage
  }));
};
