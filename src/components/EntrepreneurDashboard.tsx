import React, { useState } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import MapWidget from './MapWidget';
import { DISTRICTS } from '../data/mapData';

const CT = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: '#fff', border: '1.5px solid rgba(21,94,164,0.2)', borderRadius: '8px', padding: '10px 14px', fontSize: '12px', boxShadow: '0 4px 12px rgba(21,94,164,0.1)' }}>
      <p style={{ color: '#155EA4', marginBottom: '4px', fontWeight: 600 }}>{label}</p>
      {payload.map((p: any, i: number) => <p key={i} style={{ color: p.color }}>{p.name}: <b>{p.value}</b></p>)}
    </div>
  );
};

const supportData = [
  { m: 'Янв', grants: 12, guarantees: 28, subsidies: 45 }, { m: 'Фев', grants: 14, guarantees: 31, subsidies: 42 },
  { m: 'Мар', grants: 18, guarantees: 42, subsidies: 58 }, { m: 'Апр', grants: 16, guarantees: 38, subsidies: 52 },
  { m: 'Май', grants: 21, guarantees: 44, subsidies: 61 }, { m: 'Июн', grants: 24, guarantees: 48, subsidies: 68 },
  { m: 'Июл', grants: 19, guarantees: 41, subsidies: 55 }, { m: 'Авг', grants: 22, guarantees: 47, subsidies: 64 },
];

const industryData = [
  { name: 'Химия (фосфор)', value: 34, color: '#155EA4' },
  { name: 'Машиностроение', value: 18, color: '#7b61ff' },
  { name: 'Пищевая', value: 22, color: '#2dce89' },
  { name: 'Строительные мат.', value: 14, color: '#fb6340' },
  { name: 'Прочее', value: 12, color: '#a0aec0' },
];

const funnelData = [
  { stage: 'Заявок подано', count: 1840 },
  { stage: 'Прошли проверку', count: 1240 },
  { stage: 'Одобрено', count: 842 },
  { stage: 'Выдано', count: 784 },
];

function KPICard({ label, value, unit, trend, trendDir, sub, color }: any) {
  return (
    <div className={`kpi-card ${color}`}>
      <div className="kpi-label">{label}</div>
      <div className={`kpi-value ${color}`}>{value}<span style={{ fontSize: '13px', fontWeight: 400, marginLeft: '2px' }}>{unit}</span></div>
      {trend && <div className={`kpi-trend ${trendDir}`}>{trendDir === 'up' ? '↑' : trendDir === 'down' ? '↓' : '→'} {trend}</div>}
      {sub && <div className="kpi-sub">{sub}</div>}
    </div>
  );
}

export default function EntrepreneurDashboard() {
  const [tab, setTab] = useState('map');

  const FACTORY_MARKERS = [
    { id: 'f1', lat: 44.20, lng: 72.89, type: 'factory' as const, name: 'Казфосфат — Жамбылский завод', status: 'ok' as const, kpis: [{ label: 'Выпуск', value: '84 тыс. т/мес.' }, { label: 'Занятых', value: '3 200 чел.' }] },
    { id: 'f2', lat: 44.24, lng: 72.85, type: 'factory' as const, name: 'ТОО «Аммофос»', status: 'ok' as const, kpis: [{ label: 'Выпуск', value: '42 тыс. т/мес.' }] },
    { id: 'f3', lat: 44.18, lng: 72.82, type: 'office' as const, name: 'Индустриальная зона «Тараз»', status: 'warning' as const, kpis: [{ label: 'Резидентов', value: '28' }, { label: 'Рабочих мест', value: '1 840' }] },
    { id: 'f4', lat: 44.22, lng: 72.94, type: 'office' as const, name: 'IT-хаб «Цифровой Тараз»', status: 'ok' as const, kpis: [{ label: 'IT-компаний', value: '42' }, { label: 'Специалистов', value: '280' }] },
    { id: 'f5', lat: 44.38, lng: 72.55, type: 'factory' as const, name: 'ТОО «Байзак Агропром»', status: 'ok' as const, kpis: [{ label: 'Субсидий получено', value: '48 млн тг' }] },
    { id: 'f6', lat: 44.15, lng: 73.1, type: 'factory' as const, name: 'Карьер «Жамбыл»', status: 'warning' as const, kpis: [{ label: 'Объём добычи', value: '2.4 млн т' }] },
  ];

  return (
    <div>
      <div className="page-header">
        <h1>Предпринимательство и индустриально-инновационное развитие</h1>
        <span className="live-dot">Live</span>
      </div>
      <div className="page-body">
        <div className="kpi-grid">
          <KPICard color="blue" label="Выпуск МСП" value="842" unit="млрд тг" trend="+16% к 2023" trendDir="up" sub="Доля МСП в ВРП: 28%" />
          <KPICard color="green" label="Действующих ИП" value="48 420" unit="ед." trend="+8% к 2023" trendDir="up" sub="Юрлиц: 12 840" />
          <KPICard color="yellow" label="Выдано грантов" value="184" unit="ед." trend="+22% к 2023" trendDir="up" sub="Сумма: 1.84 млрд тг" />
          <KPICard color="teal" label="IT-специалистов" value="280" unit="чел." trend="+48% к 2022" trendDir="up" sub="IT-компаний: 42" />
          <KPICard color="orange" label="Несырьевой экспорт" value="84.2" unit="млрд тг" trend="+12% к 2023" trendDir="up" sub="Фосфор, химия" />
        </div>

        <div className="tab-bar">
          {['map', 'support', 'industry', 'funnel'].map(t => (
            <button key={t} className={`tab-btn ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>
              {t === 'map' ? '🗺 Карта объектов' : t === 'support' ? 'Меры поддержки' : t === 'industry' ? 'Промышленность' : 'Воронка поддержки'}
            </button>
          ))}
        </div>

        {tab === 'map' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: '16px' }}>
            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
              <div style={{ padding: '12px 16px', borderBottom: '1.5px solid rgba(21,94,164,0.12)' }}>
                <span style={{ fontSize: '13px', fontWeight: 600, color: '#1a1a2e' }}>Карта промышленных зон, предприятий и IT-хабов</span>
              </div>
              <MapWidget districts={DISTRICTS} markers={FACTORY_MARKERS} legendTitle="Объекты промышленности"
                legendItems={[
                  { color: '#fb6340', label: 'Промышленные объекты' },
                  { color: '#7b61ff', label: 'Индустриальные зоны' },
                  { color: '#155EA4', label: 'IT-хабы' },
                ]} height={420} zoom={8} geoJsonUrl="/data/districts.geojson" />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div className="card" style={{ padding: '14px' }}>
                <div className="section-title">Крупные предприятия</div>
                {[
                  { name: 'Казфосфат', output: '84 тыс. т/мес.', workers: 3200, status: 'ok' },
                  { name: 'Аммофос', output: '42 тыс. т/мес.', workers: 1840, status: 'ok' },
                  { name: 'Джамбул Гипс', output: '18 тыс. т/мес.', workers: 480, status: 'warning' },
                  { name: 'Цианид натрия', output: '8 тыс. т/мес.', workers: 320, status: 'ok' },
                ].map((item, i) => (
                  <div key={i} style={{ padding: '7px 0', borderBottom: '1px solid rgba(21,94,164,0.1)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px' }}>
                      <span style={{ color: '#1a1a2e', fontWeight: 500 }}>{item.name}</span>
                      <span style={{ color: item.status === 'ok' ? '#2dce89' : '#d4a000', fontSize: '10px' }}>● {item.status === 'ok' ? 'Норма' : 'Внимание'}</span>
                    </div>
                    <div style={{ color: '#8292a5', fontSize: '10px', marginTop: '1px' }}>{item.output} · {item.workers.toLocaleString()} чел.</div>
                  </div>
                ))}
              </div>
              <div className="card" style={{ padding: '14px' }}>
                <div className="section-title">Индекс деловой активности МСБ</div>
                <div style={{ textAlign: 'center', padding: '8px 0' }}>
                  <div style={{ fontSize: '42px', fontWeight: 700, color: '#2dce89' }}>72.4</div>
                  <div style={{ fontSize: '12px', color: '#4a5568' }}>из 100 баллов</div>
                  <div className="progress-bar" style={{ marginTop: '10px' }}>
                    <div style={{ height: '100%', borderRadius: '4px', width: '72.4%', background: '#2dce89' }} />
                  </div>
                  <div style={{ fontSize: '10px', color: '#8292a5', marginTop: '4px' }}>Цель: 80 к 2026</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {tab === 'support' && (
          <div className="grid-2">
            <div className="card">
              <div className="section-title">Динамика мер господдержки (ед.)</div>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={supportData} barGap={2}>
                  <XAxis dataKey="m" tick={{ fontSize: 10, fill: '#8292a5' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: '#8292a5' }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CT />} />
                  <Bar dataKey="grants" name="Гранты" fill="#155EA4" radius={[3, 3, 0, 0]} />
                  <Bar dataKey="guarantees" name="Гарантии" fill="#7b61ff" radius={[3, 3, 0, 0]} />
                  <Bar dataKey="subsidies" name="Субсидии" fill="#2dce89" radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="card">
              <div className="section-title">Меры поддержки предпринимателей</div>
              {[
                { label: 'Обучено предпринимателей', value: '2 840 чел.', color: '#155EA4' },
                { label: 'Консультаций оказано', value: '12 480', color: '#7b61ff' },
                { label: 'Возмещено на сертификацию', value: '48.4 млн тг', color: '#2dce89' },
                { label: 'Поддержано в моногородах', value: '184 проекта', color: '#fb6340' },
                { label: 'Снижение энергоёмкости', value: '−6.4%', color: '#2dce89' },
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid rgba(21,94,164,0.1)', fontSize: '12px' }}>
                  <span style={{ color: '#4a5568' }}>{item.label}</span>
                  <span style={{ fontWeight: 600, color: item.color }}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'industry' && (
          <div className="grid-2">
            <div className="card">
              <div className="section-title">Структура промышленного производства</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <ResponsiveContainer width={160} height={180}>
                  <PieChart>
                    <Pie data={industryData} cx="50%" cy="50%" innerRadius={44} outerRadius={72} dataKey="value" strokeWidth={0}>
                      {industryData.map((e, i) => <Cell key={i} fill={e.color} />)}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div style={{ flex: 1 }}>
                  {industryData.map((it, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: it.color, display: 'inline-block' }} />
                        <span style={{ fontSize: '11px', color: '#4a5568' }}>{it.name}</span>
                      </div>
                      <span style={{ fontSize: '12px', fontWeight: 600, color: it.color }}>{it.value}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="card">
              <div className="section-title">Промышленные показатели</div>
              {[
                { label: 'Объём производства', value: '2 840 млрд тг', color: '#155EA4' },
                { label: 'ИПП обработки', value: '112.4%', color: '#2dce89' },
                { label: 'Горнодобывающая', value: '1 240 млрд тг', color: '#7b61ff' },
                { label: 'Обрабатывающая', value: '1 180 млрд тг', color: '#fb6340' },
                { label: 'Хим. промышленность', value: '680 млрд тг', color: '#155EA4' },
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '9px 0', borderBottom: '1px solid rgba(21,94,164,0.1)', fontSize: '12px' }}>
                  <span style={{ color: '#4a5568' }}>{item.label}</span>
                  <span style={{ fontWeight: 600, color: item.color }}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'funnel' && (
          <div className="card">
            <div className="section-title">Воронка: Поддержка предпринимателей (8 мес. 2024)</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '600px', margin: '16px auto' }}>
              {funnelData.map((stage, i) => {
                const pct = (stage.count / funnelData[0].count) * 100;
                const colors = ['#155EA4', '#7b61ff', '#2dce89', '#d4a000'];
                return (
                  <div key={i} style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '12px', color: '#4a5568', marginBottom: '4px' }}>{stage.stage}</div>
                    <div style={{ background: '#f3eeec', borderRadius: '6px', overflow: 'hidden', height: '40px', position: 'relative' }}>
                      <div style={{ background: colors[i], height: '100%', width: `${pct}%`, borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'width 0.3s' }}>
                        <span style={{ color: '#fff', fontSize: '14px', fontWeight: 700 }}>{stage.count.toLocaleString()}</span>
                      </div>
                    </div>
                    <div style={{ fontSize: '10px', color: '#8292a5', marginTop: '2px' }}>{pct.toFixed(0)}% от заявок</div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
