import React from 'react';

interface RadarChartProps {
  vector1: number[];
  vector2: number[];
  label1: string;
  label2: string;
  color1: string;
  color2: string;
  pastVector?: number[] | null;
}

export const RadarChart: React.FC<RadarChartProps> = ({
  vector1,
  vector2,
  label1,
  label2,
  color1,
  color2,
  pastVector = null
}) => {
  const size = 300;
  const center = size / 2;
  const radius = center - 40;
  const labels = ["Tektanrıcılık", "Ritüelizm", "Ölüm Sonrası", "Metin/Dogma", "Doğa Bütünlüğü"];

  const getCoordinates = (vector: number[]) =>
    vector.map((val, i) => ({
      x: center + radius * val * Math.cos((Math.PI * 2 * i) / 5 - Math.PI / 2),
      y: center + radius * val * Math.sin((Math.PI * 2 * i) / 5 - Math.PI / 2),
    }));

  const pts1 = getCoordinates(vector1);
  const pts2 = getCoordinates(vector2);
  const ptsPast = pastVector && pastVector.length > 0 ? getCoordinates(pastVector) : null;

  return (
    <div style={{ marginTop: '20px', marginBottom: '20px' }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ margin: '0 auto', display: 'block' }}>
        {[0.2, 0.4, 0.6, 0.8, 1].map((r, i) => (
          <circle key={i} cx={center} cy={center} r={radius * r} fill="none" stroke="#2a2a30" strokeWidth="1" />
        ))}
        {labels.map((label, i) => {
          const angle = (Math.PI * 2 * i) / 5 - Math.PI / 2;
          const x = center + radius * Math.cos(angle);
          const y = center + radius * Math.sin(angle);
          return (
            <g key={i}>
              <line x1={center} y1={center} x2={x} y2={y} stroke="#2a2a30" />
              <text x={x} y={y} fill="#9ca3af" fontSize="11" textAnchor="middle" dy={y < center ? "-10" : "20"}>
                {label}
              </text>
            </g>
          );
        })}
        <polygon
          points={pts2.map(p => `${p.x},${p.y}`).join(' ')}
          fill={`${color2}33`}
          stroke={color2}
          strokeWidth="2"
          strokeDasharray="3"
        />
        {ptsPast && (
          <polygon
            points={ptsPast.map(p => `${p.x},${p.y}`).join(' ')}
            fill="none"
            stroke="#e0245e"
            strokeWidth="1.5"
            strokeDasharray="3"
          />
        )}
        <polygon
          points={pts1.map(p => `${p.x},${p.y}`).join(' ')}
          fill="none"
          stroke={color1}
          strokeWidth="2"
        />
      </svg>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', fontSize: '11px', marginTop: '10px', flexWrap: 'wrap' }}>
        <span style={{ color: color1 }}>-- {label1}</span>
        <span style={{ color: color2 }}>■ {label2}</span>
        {ptsPast && <span style={{ color: '#e0245e' }}>.. Önceki Profiliniz</span>}
      </div>
    </div>
  );
};
