import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import MapWidget from './MapWidget';
import { DISTRICTS, LAND_MARKERS } from '../data/mapData';

const CT = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: '#fff', border: '1.5px solid rgba(21,94,164,0.2)', borderRadius: '8px', padding: '10px 14px', fontSize: '12px', boxShadow: '0 4px 12px rgba(21,94,164,0.1)' }}>
      <p style={{ color: '#155EA4', marginBottom: '4px', fontWeight: 600 }}>{label}</p>
      {payload.map((p: any, i: number) => <p key={i} style={{ color: p.color }}>{p.name}: <b>{p.value}</b></p>)}
    </div>
  );
};

const issuanceData = [
  { q: 'I кв', igs: 284, biz: 142 }, { q: 'II кв', igs: 318, biz: 168 },
  { q: 'III кв', igs: 298, biz: 154 }, { q: 'IV кв (план)', igs: 340, biz: 180 },
];

const landBalance = [
  { name: 'Сельхозназначение', value: 8420, color: '#2dce89' },
  { name: 'Населённые пункты', value: 124, color: '#155EA4' },
  { name: 'Промышленность', value: 84, color: '#fb6340' },
  { name: 'Лесной фонд', value: 312, color: '#7b61ff' },
  { name: 'Водный фонд', value: 48, color: '#0fa8c4' },
  { name: 'Прочее', value: 214, color: '#a0aec0' },
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

export default function LandDashboard() {
  const [tab, setTab] = useState('map');

  return (
    <div>
      <div className="page-header">
        <h1>Управление земельных отношений — Жамбылская область</h1>
        <span className="live-dot">Live</span>
      </div>
      <div className="page-body">
        <div className="kpi-grid">
          <KPICard color="purple" label="Заявок подано" value="4 840" unit="ед." trend="+12% к 2023" trendDir="up" sub="С нач. 2024 года" />
          <KPICard color="green" label="Участков выдано" value="2 140" unit="ед." trend="44% от заявок" trendDir="neutral" sub="ИЖС: 1 240, Бизнес: 900" />
          <KPICard color="yellow" label="Ср. срок предоставления" value="18" unit="дней" trend="−6 дн. к 2023" trendDir="up" sub="Цель: ≤12 дней" />
          <KPICard color="blue" label="Общий зем. фонд" value="14 424" unit="тыс. га" trend="" trendDir="neutral" sub="Сельхоз: 8 420 тыс. га" />
          <KPICard color="teal" label="Свободных участков" value="1 284" unit="ед." trend="Доступны сейчас" trendDir="neutral" sub="Обновлено сегодня" />
        </div>

        <div className="tab-bar">
          {['map', 'balance', 'issuance'].map(t => (
            <button key={t} className={`tab-btn ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>
              {t === 'map' ? '🗺 Кадастровая карта' : t === 'balance' ? 'Земельный баланс' : 'Выдача участков'}
            </button>
          ))}
        </div>

        {tab === 'map' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: '16px' }}>
            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
              <div style={{ padding: '12px 16px', borderBottom: '1.5px solid rgba(21,94,164,0.12)' }}>
                <span style={{ fontSize: '13px', fontWeight: 600, color: '#1a1a2e' }}>Кадастровая карта — участки ИЖС, бизнес, пастбища</span>
                <span style={{ fontSize: '11px', color: '#8292a5', marginLeft: '8px' }}>Клик по пину — кадастровые данные</span>
              </div>
              <MapWidget
                districts={DISTRICTS}
                markers={LAND_MARKERS}
                legendTitle="Земельные участки"
                legendItems={[
                  { color: '#d4a000', label: 'ИЖС / оформленные' },
                  { color: '#d4a000', label: 'В оформлении' },
                  { color: '#f5365c', label: 'Спорные' },
                  { color: '#2dce89', label: 'Свободные' },
                ]}
                height={420}
                zoom={8} geoJsonUrl="/data/districts.geojson"
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div className="card" style={{ padding: '14px' }}>
                <div className="section-title">Индикатор бюрократии</div>
                <div style={{ textAlign: 'center', padding: '8px 0' }}>
                  <div style={{ fontSize: '42px', fontWeight: 700, color: '#d4a000' }}>18</div>
                  <div style={{ fontSize: '13px', color: '#4a5568' }}>дней (ср. срок)</div>
                  <div className="progress-bar" style={{ marginTop: '10px' }}>
                    <div style={{ height: '100%', borderRadius: '4px', width: '60%', background: '#d4a000' }} />
                  </div>
                  <div style={{ fontSize: '10px', color: '#8292a5', marginTop: '4px' }}>Цель: ≤12 дней к 2025</div>
                </div>
              </div>
              <div className="card" style={{ padding: '14px' }}>
                <div className="section-title">ИИ-инсайт</div>
                <div className="alert-item critical">
                  <div className="alert-dot critical" />
                  <div><div style={{ color: '#1a1a2e', fontWeight: 500, fontSize: '11px' }}>Байзак: судебный спор</div><div style={{ color: '#8292a5', fontSize: '10px' }}>Участок Байзак-14 (2.4 га) в суде с 2023</div></div>
                </div>
                <div className="alert-item warning">
                  <div className="alert-dot warning" />
                  <div><div style={{ color: '#1a1a2e', fontWeight: 500, fontSize: '11px' }}>2 240 заявок в работе</div><div style={{ color: '#8292a5', fontSize: '10px' }}>Более 20 дней без решения</div></div>
                </div>
                <div className="alert-item info">
                  <div className="alert-dot info" />
                  <div><div style={{ color: '#1a1a2e', fontWeight: 500, fontSize: '11px' }}>Сарысу: 6 свободных участков</div><div style={{ color: '#8292a5', fontSize: '10px' }}>Доступны для выдачи ИЖС</div></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {tab === 'balance' && (
          <div className="grid-2">
            <div className="card">
              <div className="section-title">Земельный баланс (тыс. га)</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <ResponsiveContainer width={180} height={200}>
                  <PieChart>
                    <Pie data={landBalance} cx="50%" cy="50%" outerRadius={85} dataKey="value" strokeWidth={0}>
                      {landBalance.map((e, i) => <Cell key={i} fill={e.color} />)}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div style={{ flex: 1 }}>
                  {landBalance.map((it, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ width: '10px', height: '10px', borderRadius: '3px', background: it.color, display: 'inline-block' }} />
                        <span style={{ fontSize: '11px', color: '#4a5568' }}>{it.name}</span>
                      </div>
                      <span style={{ fontSize: '12px', fontWeight: 600, color: it.color }}>{it.value.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="card">
              <div className="section-title">Детализация сельхозугодий</div>
              {[
                { label: 'Сенокосы', value: '284 тыс. га' }, { label: 'Пастбища (круглогод.)', value: '4 820 тыс. га' },
                { label: 'Пастбища (сезонные)', value: '1 240 тыс. га' }, { label: 'Временные угодья', value: '312 тыс. га' },
                { label: 'Свободные участки', value: '1 284 ед.' },
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '9px 0', borderBottom: '1px solid rgba(21,94,164,0.1)', fontSize: '12px' }}>
                  <span style={{ color: '#4a5568' }}>{item.label}</span>
                  <span style={{ fontWeight: 600, color: '#1a1a2e' }}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'issuance' && (
          <div className="grid-2">
            <div className="card">
              <div className="section-title">Динамика выдачи участков (ИЖС и бизнес)</div>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={issuanceData} barGap={4}>
                  <XAxis dataKey="q" tick={{ fontSize: 10, fill: '#8292a5' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: '#8292a5' }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CT />} />
                  <Bar dataKey="igs" name="ИЖС" fill="#7b61ff" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="biz" name="Бизнес" fill="#0fa8c4" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="card">
              <div className="section-title">Показатели выдачи</div>
              {[
                { label: 'Заявок подано', value: '4 840', color: '#7b61ff' },
                { label: 'Выдано ИЖС', value: '1 240', color: '#2dce89' },
                { label: 'Выдано под бизнес', value: '900', color: '#0fa8c4' },
                { label: 'Отказов', value: '312 (6.4%)', color: '#f5365c' },
                { label: 'В работе', value: '2 388', color: '#d4a000' },
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '9px 0', borderBottom: '1px solid rgba(21,94,164,0.1)', fontSize: '13px' }}>
                  <span style={{ color: '#4a5568' }}>{item.label}</span>
                  <span style={{ fontWeight: 600, color: item.color }}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
