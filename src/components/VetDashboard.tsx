import React, { useState } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import MapWidget from './MapWidget';
import { DISTRICTS, VET_MAP_MARKERS } from '../data/mapData';

const CT = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: '#fff', border: '1.5px solid rgba(21,94,164,0.2)', borderRadius: '8px', padding: '10px 14px', fontSize: '12px', boxShadow: '0 4px 12px rgba(21,94,164,0.1)' }}>
      <p style={{ color: '#155EA4', marginBottom: '4px', fontWeight: 600 }}>{label}</p>
      {payload.map((p: any, i: number) => <p key={i} style={{ color: p.color }}>{p.name}: <b>{p.value}</b></p>)}
    </div>
  );
};

const livestockTrend = [
  { y: '2020', krs: 312, sheep: 1840, horses: 148 }, { y: '2021', krs: 328, sheep: 1920, horses: 156 },
  { y: '2022', krs: 341, sheep: 1980, horses: 159 }, { y: '2023', krs: 358, sheep: 2040, horses: 162 },
  { y: '2024', krs: 372, sheep: 2120, horses: 164 },
];

const vaccMonthly = [
  { m: 'Янв', fact: 84 }, { m: 'Фев', fact: 88 }, { m: 'Мар', fact: 92 },
  { m: 'Апр', fact: 96 }, { m: 'Май', fact: 94 }, { m: 'Июн', fact: 91 },
  { m: 'Июл', fact: 89 }, { m: 'Авг', fact: 93 },
];

const livestockTypes = [
  { name: 'КРС', value: 372, color: '#2dce89' },
  { name: 'МРС (овцы)', value: 2120, color: '#d4a000' },
  { name: 'Лошади', value: 164, color: '#155EA4' },
  { name: 'Верблюды', value: 12, color: '#fb6340' },
  { name: 'Свиньи', value: 48, color: '#7b61ff' },
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

export default function VetDashboard() {
  const [tab, setTab] = useState('map');

  return (
    <div>
      <div className="page-header">
        <h1>Управление ветеринарии — Жамбылская область</h1>
        <span className="live-dot">Live</span>
      </div>
      <div className="page-body">
        <div className="kpi-grid">
          <KPICard color="green" label="Поголовье КРС" value="372" unit="тыс. гол." trend="+14 тыс. к 2023" trendDir="up" sub="Официальная статистика" />
          <KPICard color="green" label="Поголовье овец" value="2 120" unit="тыс. гол." trend="стабильно" trendDir="neutral" sub="МРС" />
          <KPICard color="blue" label="Поголовье лошадей" value="164" unit="тыс. гол." trend="+1.2% к 2023" trendDir="up" sub="Официальная статистика" />
          <KPICard color="teal" label="Уровень вакцинации" value="93" unit="%" trend="+4% к 2023" trendDir="up" sub="Цель: 98% к 2025" />
          <KPICard color="red" label="Вспышек (активных)" value="2" unit="ед." trend="Карантин 2 зоны" trendDir="down" sub="Бруцеллёз, ящур" />
          <KPICard color="yellow" label="Сумма компенсаций" value="428" unit="млн тг" trend="+8% к 2023" trendDir="neutral" sub="Падёж и принудительный забой" />
        </div>

        <div className="tab-bar">
          {['map', 'livestock', 'vaccination', 'epizootic'].map(t => (
            <button key={t} className={`tab-btn ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>
              {t === 'map' ? '🗺 Карта ветпунктов' : t === 'livestock' ? 'Поголовье' : t === 'vaccination' ? 'Вакцинация' : 'Эпизоотия'}
            </button>
          ))}
        </div>

        {tab === 'map' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: '16px' }}>
            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
              <div style={{ padding: '12px 16px', borderBottom: '1.5px solid rgba(21,94,164,0.12)' }}>
                <span style={{ fontSize: '13px', fontWeight: 600, color: '#1a1a2e' }}>Ветеринарные пункты, скотомогильники и карантинные зоны</span>
              </div>
              <MapWidget districts={DISTRICTS} markers={VET_MAP_MARKERS} legendTitle="Ветеринария"
                legendItems={[
                  { color: '#7b61ff', label: 'Ветеринарные пункты' },
                  { color: '#f5365c', label: 'Карантинные зоны' },
                  { color: '#d4a000', label: 'Скотомогильники' },
                ]} height={420} zoom={8} geoJsonUrl="/data/districts.geojson" />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div className="card" style={{ padding: '14px' }}>
                <div className="section-title">Карантинные зоны</div>
                {[
                  { name: 'Байзакский р-н (бруцеллёз)', date: '12.08.2024', color: '#f5365c' },
                  { name: 'Жуалынский р-н (ящур)', date: '04.07.2024', color: '#f5365c' },
                ].map((item, i) => (
                  <div key={i} style={{ padding: '8px 0', borderBottom: '1px solid rgba(21,94,164,0.1)' }}>
                    <div style={{ fontSize: '11px', fontWeight: 500, color: '#1a1a2e' }}>{item.name}</div>
                    <div style={{ fontSize: '10px', color: item.color, marginTop: '2px' }}>С {item.date} — активный карантин</div>
                  </div>
                ))}
                <div className="alert-item critical" style={{ marginTop: '10px' }}>
                  <div className="alert-dot critical" />
                  <div style={{ fontSize: '11px', color: '#1a1a2e' }}>Скотомогильник №4: проверка просрочена на 48 дней</div>
                </div>
              </div>
              <div className="card" style={{ padding: '14px' }}>
                <div className="section-title">Индекс эпизоотики</div>
                <div style={{ textAlign: 'center', padding: '8px 0' }}>
                  <div style={{ fontSize: '42px', fontWeight: 700, color: '#2dce89' }}>78</div>
                  <div style={{ fontSize: '12px', color: '#4a5568' }}>из 100 (удовл.)</div>
                  <div className="progress-bar" style={{ marginTop: '8px' }}>
                    <div style={{ height: '100%', borderRadius: '4px', width: '78%', background: '#2dce89' }} />
                  </div>
                  <div style={{ fontSize: '10px', color: '#8292a5', marginTop: '4px' }}>Вакцинировано / поголовье × 100</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {tab === 'livestock' && (
          <div className="grid-2">
            <div className="card">
              <div className="section-title">Динамика поголовья (тыс. голов)</div>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={livestockTrend}>
                  <XAxis dataKey="y" tick={{ fontSize: 10, fill: '#8292a5' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: '#8292a5' }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CT />} />
                  <Line type="monotone" dataKey="krs" name="КРС" stroke="#2dce89" strokeWidth={2} dot={{ fill: '#2dce89', r: 3 }} />
                  <Line type="monotone" dataKey="horses" name="Лошади" stroke="#155EA4" strokeWidth={2} dot={{ fill: '#155EA4', r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="card">
              <div className="section-title">Поголовье по видам (тыс. гол.)</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <ResponsiveContainer width={120} height={120}>
                  <PieChart>
                    <Pie data={livestockTypes} cx="50%" cy="50%" outerRadius={56} dataKey="value" strokeWidth={0}>
                      {livestockTypes.map((e, i) => <Cell key={i} fill={e.color} />)}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div style={{ flex: 1 }}>
                  {livestockTypes.map((it, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '7px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: it.color, display: 'inline-block' }} />
                        <span style={{ fontSize: '11px', color: '#4a5568' }}>{it.name}</span>
                      </div>
                      <span style={{ fontSize: '12px', fontWeight: 600, color: it.color }}>{it.value.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {tab === 'vaccination' && (
          <div className="grid-2">
            <div className="card">
              <div className="section-title">Охват вакцинацией по месяцам (%)</div>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={vaccMonthly}>
                  <XAxis dataKey="m" tick={{ fontSize: 10, fill: '#8292a5' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: '#8292a5' }} axisLine={false} tickLine={false} domain={[75, 100]} />
                  <Tooltip content={<CT />} />
                  <Bar dataKey="fact" name="Охват %" fill="#2dce89" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="card">
              <div className="section-title">Вакцинация по видам</div>
              {[
                { label: 'КРС от бруцеллёза', value: '96%', color: '#2dce89' },
                { label: 'МРС от бруцеллёза', value: '94%', color: '#2dce89' },
                { label: 'КРС от ящура', value: '91%', color: '#2dce89' },
                { label: 'Лошади от ИНАН', value: '88%', color: '#d4a000' },
                { label: 'КРС от сибирской язвы', value: '98%', color: '#2dce89' },
              ].map((item, i) => (
                <div key={i} style={{ marginBottom: '10px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                    <span style={{ color: '#4a5568' }}>{item.label}</span>
                    <span style={{ color: item.color, fontWeight: 600 }}>{item.value}</span>
                  </div>
                  <div className="progress-bar">
                    <div style={{ height: '100%', borderRadius: '4px', width: item.value, background: item.color }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'epizootic' && (
          <div className="grid-2">
            <div className="card">
              <div className="section-title">Эпизоотическая обстановка</div>
              {[
                { label: 'Активных вспышек', value: '2', color: '#f5365c' },
                { label: 'Карантинных зон', value: '2', color: '#f5365c' },
                { label: 'Подозрений на заразные болезни', value: '8', color: '#d4a000' },
                { label: 'Скотомогильников всего', value: '124 ед.', color: '#8292a5' },
                { label: 'В неуд. состоянии', value: '12 ед.', color: '#d4a000' },
                { label: 'Проверок в год', value: '248', color: '#155EA4' },
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '9px 0', borderBottom: '1px solid rgba(21,94,164,0.1)', fontSize: '12px' }}>
                  <span style={{ color: '#4a5568' }}>{item.label}</span>
                  <span style={{ fontWeight: 600, color: item.color }}>{item.value}</span>
                </div>
              ))}
            </div>
            <div className="card">
              <div className="section-title">Компенсации за падёж</div>
              {[
                { m: 'Янв–Фев', amount: 4.2 }, { m: 'Мар–Апр', amount: 6.8 },
                { m: 'Май–Июн', amount: 8.4 }, { m: 'Июл–Авг', amount: 9.0 },
              ].map((item, i) => (
                <div key={i} style={{ marginBottom: '10px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                    <span style={{ color: '#4a5568' }}>{item.m}</span>
                    <span style={{ color: '#d4a000', fontWeight: 600 }}>{item.amount} млн тг</span>
                  </div>
                  <div className="progress-bar">
                    <div style={{ height: '100%', borderRadius: '4px', width: `${(item.amount / 10) * 100}%`, background: '#d4a000' }} />
                  </div>
                </div>
              ))}
              <div style={{ borderTop: '1px solid rgba(21,94,164,0.1)', paddingTop: '10px', marginTop: '8px', display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                <span style={{ color: '#4a5568', fontWeight: 500 }}>Итого 2024:</span>
                <span style={{ fontWeight: 700, color: '#f5365c' }}>28.4 млн тг</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
