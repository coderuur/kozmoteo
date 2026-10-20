import React from 'react';

export const DICTIONARY: Record<string, string> = {
  "Tevhid": "Allah'ın bir ve tek olması, her şeyin yaratıcısı olması inancı.",
  "Nirvana": "Acıların ve arzuların tamamen yok olduğu, mutlak huzur ve aydınlanma durumu.",
  "Logos": "Evreni yöneten rasyonel yasa, ilahi akıl.",
  "Reenkarnasyon": "Ruhun ölümden sonra başka bir bedende yeniden dünyaya gelmesi.",
  "Karma": "Evrendeki neden-sonuç yasası; ne ekersen onu biçersin.",
  "Agnostisizm": "Tanrının veya doğaüstü varlıkların bilinmez olduğunu savunan görüş.",
  "Dogma": "Sorgulanmadan, tartışılamadan kabul edilmesi istenen mutlak inanç.",
  "Şeriat": "İslami kurallar ve yasalar bütünü.",
  "Ahiret": "Ölümden sonraki sonsuz yaşam."
};

export const renderWithTooltips = (text: string): React.ReactNode[] => {
  const keys = Object.keys(DICTIONARY);
  const regex = new RegExp(`(${keys.join('|')})`, 'gi');
  const parts = text.split(regex);
  return parts.map((part, i) => {
    const term = keys.find(k => k.toLowerCase() === part.toLowerCase());
    if (term) {
      return (
        <span
          key={i}
          title={DICTIONARY[term]}
          style={{
            borderBottom: '1px dotted #D4AF37',
            cursor: 'help',
            color: '#D4AF37',
            transition: 'color 0.2s'
          }}
        >
          {part}
        </span>
      );
    }
    return part;
  });
};

export const compressVectorTo5D = (vec: number[]): number[] => {
  if (vec.length === 0) return [0, 0, 0, 0, 0];
  const chunkSize = vec.length / 5;
  return Array.from({ length: 5 }, (_, i) => {
    const chunk = vec.slice(i * chunkSize, (i + 1) * chunkSize);
    return chunk.reduce((a, b) => a + b, 0) / chunkSize;
  });
};
