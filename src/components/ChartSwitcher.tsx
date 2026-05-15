import React, { useMemo, useState } from 'react';
import {
  Bar,
  BarChart,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

export type ChartSwitcherType = 'line' | 'bar' | 'pie' | 'table' | 'heatmap';

export interface ChartSeries {
  key: string;
  name: string;
  color?: string;
}

export interface ChartSwitcherProps {
  title?: string;
  /** Row-oriented data for line / bar / table */
  data?: Record<string, string | number>[];
  xKey?: string;
  series?: ChartSeries[];
  /** For pie mode */
  pieRows?: { name: string; value: number; color?: string }[];
  /** Heatmap: labels + matrix rows aligned to data order or explicit */
  heatmapRowLabels?: string[];
  heatmapColLabels?: string[];
  heatmapMatrix?: number[][];
  defaultType?: ChartSwitcherType;
  height?: number;
  className?: string;
}

const COLORS = ['#155EA4', '#2dce89', '#fb6340', '#d4a000', '#7b61ff', '#f5365c', '#0fa8c4', '#a0aec0'];

const CT = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: '#fff', border: '1.5px solid rgba(21,94,164,0.2)', borderRadius: '8px', padding: '10px 14px', fontSize: '12px', boxShadow: '0 4px 12px rgba(21,94,164,0.1)' }}>
      <p style={{ color: '#155EA4', marginBottom: '4px', fontWeight: 600 }}>{label}</p>
      {payload.map((p: any, i: number) => (
        <p key={i} style={{ color: p.color }}>
          {p.name}: <b>{p.value}</b>
        </p>
      ))}
    </div>
  );
};

function heatColor(v: number, min: number, max: number) {
  if (max <= min) return 'rgba(21,94,164,0.25)';
  const t = (v - min) / (max - min);
  const g = Math.round(45 + (1 - t) * 180);
  const r = Math.round(245 * t + 21 * (1 - t));
  const b = Math.round(92 * (1 - t) + 164 * t);
  return `rgba(${r},${g},${b},0.85)`;
}

export default function ChartSwitcher({
  title,
  data = [],
  xKey = 'name',
  series = [],
  pieRows,
  heatmapRowLabels,
  heatmapColLabels,
  heatmapMatrix,
  defaultType = 'line',
  height = 220,
  className,
}: ChartSwitcherProps) {
  const initial: ChartSwitcherType = pieRows?.length && !series.length && !data.length ? 'pie' : defaultType;
  const [mode, setMode] = useState<ChartSwitcherType>(initial);

  const options: { id: ChartSwitcherType; label: string }[] = useMemo(() => {
    const o: { id: ChartSwitcherType; label: string }[] = [];
    if (pieRows?.length) o.push({ id: 'pie', label: 'Круговой' });
    if (series.length && data.length) {
      o.push({ id: 'line', label: 'Линейный' }, { id: 'bar', label: 'Столбчатый' });
    }
    if (data.length) o.push({ id: 'table', label: 'Таблица' });
    if (heatmapMatrix?.length && heatmapColLabels?.length) o.push({ id: 'heatmap', label: 'Тепловая карта' });
    return o;
  }, [series.length, data.length, pieRows?.length, heatmapMatrix?.length, heatmapColLabels?.length]);

  const tableKeys = useMemo(() => {
    if (!data[0]) return [];
    return Object.keys(data[0]);
  }, [data]);

  const { minH, maxH } = useMemo(() => {
    if (!heatmapMatrix?.length) return { minH: 0, maxH: 1 };
    let min = Infinity;
    let max = -Infinity;
    heatmapMatrix.forEach(row => row.forEach(v => {
      min = Math.min(min, v);
      max = Math.max(max, v);
    }));
    if (!Number.isFinite(min)) min = 0;
    if (!Number.isFinite(max)) max = 1;
    return { minH: min, maxH: max };
  }, [heatmapMatrix]);

  const effMode = (options.some(o => o.id === mode) ? mode : options[0]?.id) || 'pie';

  return (
    <div className={className} style={{ background: '#EBDBD8', border: '1.5px solid rgba(21,94,164,0.18)', borderRadius: '12px', padding: '14px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', gap: '10px', flexWrap: 'wrap' }}>
        {title && <div className="section-title" style={{ marginBottom: 0 }}>{title}</div>}
        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#4a5568' }}>
          <span>Визуализация</span>
          <select
            value={effMode}
            onChange={e => setMode(e.target.value as ChartSwitcherType)}
            style={{
              padding: '6px 10px',
              borderRadius: '8px',
              border: '1.5px solid #155EA4',
              background: '#fff',
              color: '#1a1a2e',
              fontSize: '12px',
              cursor: 'pointer',
            }}
          >
            {options.map(o => (
              <option key={o.id} value={o.id}>{o.label}</option>
            ))}
          </select>
        </label>
      </div>

      {effMode === 'line' && series.length > 0 && (
        <ResponsiveContainer width="100%" height={height}>
          <LineChart data={data}>
            <XAxis dataKey={xKey} tick={{ fontSize: 10, fill: '#8292a5' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 10, fill: '#8292a5' }} axisLine={false} tickLine={false} />
            <Tooltip content={<CT />} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            {series.map((s, i) => (
              <Line key={s.key} type="monotone" dataKey={s.key} name={s.name} stroke={s.color || COLORS[i % COLORS.length]} strokeWidth={2} dot={{ r: 2 }} />
            ))}
          </LineChart>
        </ResponsiveContainer>
      )}

      {effMode === 'bar' && series.length > 0 && (
        <ResponsiveContainer width="100%" height={height}>
          <BarChart data={data}>
            <XAxis dataKey={xKey} tick={{ fontSize: 10, fill: '#8292a5' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 10, fill: '#8292a5' }} axisLine={false} tickLine={false} />
            <Tooltip content={<CT />} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            {series.map((s, i) => (
              <Bar key={s.key} dataKey={s.key} name={s.name} fill={s.color || COLORS[i % COLORS.length]} radius={[4, 4, 0, 0]} />
            ))}
          </BarChart>
        </ResponsiveContainer>
      )}

      {effMode === 'pie' && pieRows && pieRows.length > 0 && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
          <ResponsiveContainer width={200} height={Math.min(height, 200)}>
            <PieChart>
              <Pie data={pieRows} cx="50%" cy="50%" innerRadius={48} outerRadius={72} dataKey="value" strokeWidth={0}>
                {pieRows.map((e, i) => (
                  <Cell key={i} fill={e.color || COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ flex: 1, minWidth: '140px' }}>
            {pieRows.map((it, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '12px' }}>
                <span style={{ color: '#4a5568' }}>{it.name}</span>
                <b style={{ color: it.color || COLORS[i % COLORS.length] }}>{it.value}%</b>
              </div>
            ))}
          </div>
        </div>
      )}

      {effMode === 'table' && data.length > 0 && (
        <div style={{ overflowX: 'auto', maxHeight: height + 80 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px' }}>
            <thead>
              <tr>
                {tableKeys.map(k => (
                  <th key={k} style={{ textAlign: 'left', padding: '8px', borderBottom: '2px solid #155EA4', color: '#155EA4', background: '#fff' }}>{k}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((row, ri) => (
                <tr key={ri} style={{ background: ri % 2 ? '#f9f4f3' : '#fff' }}>
                  {tableKeys.map(k => (
                    <td key={k} style={{ padding: '6px 8px', borderBottom: '1px solid rgba(21,94,164,0.12)', color: '#1a1a2e' }}>{String(row[k] ?? '')}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {effMode === 'heatmap' && heatmapMatrix && heatmapColLabels && (
        <div style={{ overflow: 'auto', maxHeight: height + 120 }}>
          <table style={{ borderCollapse: 'collapse', fontSize: '10px' }}>
            <thead>
              <tr>
                <th style={{ padding: '6px', background: '#fff' }} />
                {heatmapColLabels.map(c => (
                  <th key={c} style={{ padding: '6px', minWidth: '48px', background: '#fff', color: '#155EA4' }}>{c}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {heatmapMatrix.map((row, ri) => (
                <tr key={ri}>
                  <td style={{ padding: '6px', fontWeight: 600, color: '#4a5568', whiteSpace: 'nowrap', background: '#f3eeec' }}>
                    {heatmapRowLabels?.[ri] ?? ri}
                  </td>
                  {row.map((v, ci) => (
                    <td
                      key={ci}
                      style={{
                        padding: '8px',
                        textAlign: 'center',
                        color: '#1a1a2e',
                        fontWeight: 600,
                        background: heatColor(v, minH, maxH),
                        border: '1px solid rgba(255,255,255,0.35)',
                      }}
                    >
                      {v}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
