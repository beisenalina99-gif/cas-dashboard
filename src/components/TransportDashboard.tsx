import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import MapWidget from './MapWidget';
import { DISTRICTS, TRANSPORT_MARKERS, HEAT_ACCIDENTS } from '../data/mapData';

const CT = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: '#fff', border: '1.5px solid rgba(21,94,164,0.2)', borderRadius: '8px', padding: '10px 14px', fontSize: '12px', boxShadow: '0 4px 12px rgba(21,94,164,0.1)' }}>
      <p style={{ color: '#155EA4', marginBottom: '4px', fontWeight: 600 }}>{label}</p>
      {payload.map((p: any, i: number) => <p key={i} style={{ color: p.color }}>{p.name}: <b>{p.value}</b></p>)}
    </div>
  );
};

const dtpData = [
  { m: 'Янв', total: 42, deadly: 8 }, { m: 'Фев', total: 38, deadly: 6 },
  { m: 'Мар', total: 51, deadly: 9 }, { m: 'Апр', total: 48, deadly: 7 },
  { m: 'Май', total: 44, deadly: 6 }, { m: 'Июн', total: 39, deadly: 5 },
  { m: 'Июл', total: 36, deadly: 4 }, { m: 'Авг', total: 33, deadly: 4 },
];

const routes = [
  { id: '№1', from: 'мкр. Мынбулак', to: 'ж/д вокзал', buses: 12, pax: 8400 },
  { id: '№5', from: 'мкр. Астана', to: 'рынок Кооперативный', buses: 8, pax: 6200 },
  { id: '№7', from: 'мкр. Тас-Арык', to: 'центр', buses: 10, pax: 5800 },
  { id: '№12', from: 'ул. Казыбек би', to: 'пром. зона', buses: 6, pax: 3400 },
  { id: '№15', from: 'мкр. Акбастау', to: 'ж/д вокзал', buses: 7, pax: 4200 },
];

const roadWork = [
  { section: 'А-2 Шымкент–Тараз (km 124–148)', length: 24, status: 'completed', pct: 100 },
  { section: 'Ул. Толе би (реконструкция)', length: 3.2, status: 'in_progress', pct: 78 },
  { section: 'Байзак–Жамбыл (км 12–28)', length: 16, status: 'in_progress', pct: 45 },
  { section: 'Мерке–Сарысу (км 4–19)', length: 15, status: 'planned', pct: 0 },
];

const STATUS_COLOR: Record<string, string> = { completed: '#2dce89', in_progress: '#d4a000', planned: '#8292a5' };
const STATUS_LABEL: Record<string, string> = { completed: 'Завершено', in_progress: 'В работе', planned: 'Запланировано' };

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

export default function TransportDashboard() {
  const [tab, setTab] = useState('map');

  return (
    <div>
      <div className="page-header">
        <h1>Управление транспорта и автомобильных дорог</h1>
        <span className="live-dot">Live</span>
      </div>
      <div className="page-body">
        <div className="kpi-grid">
          <KPICard color="teal" label="Маршрутов" value="48" unit="ед." trend="Охват всех р-нов" trendDir="neutral" sub="Автобусов: 312 ед." />
          <KPICard color="blue" label="Камер видеонаблюдения" value="284" unit="ед." trend="+24 в 2024" trendDir="up" sub="Онлайн: 276 (97%)" />
          <KPICard color="red" label="ДТП за 8 мес." value="331" unit="ед." trend="−8% к 2023" trendDir="up" sub="Погибло: 49 чел." />
          <KPICard color="orange" label="Пострадавших в ДТП" value="432" unit="чел." trend="−12% к 2023" trendDir="up" sub="Тяжело: 98 чел." />
          <KPICard color="green" label="Дорог отремонтировано" value="148" unit="км" trend="2024 год" trendDir="up" sub="Построено: 24 км" />
        </div>

        <div className="tab-bar">
          {['map', 'safety', 'routes', 'roads'].map(t => (
            <button key={t} className={`tab-btn ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>
              {t === 'map' ? '🗺 Карта ДТП и камер' : t === 'safety' ? 'Безопасность' : t === 'routes' ? 'Маршруты' : 'Дорожные работы'}
            </button>
          ))}
        </div>

        {tab === 'map' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: '16px' }}>
            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
              <div style={{ padding: '12px 16px', borderBottom: '1.5px solid rgba(21,94,164,0.12)' }}>
                <span style={{ fontSize: '13px', fontWeight: 600, color: '#1a1a2e' }}>Тепловая карта ДТП, камеры наблюдения и аварийно-опасные участки</span>
              </div>
              <MapWidget
                districts={DISTRICTS}
                markers={TRANSPORT_MARKERS}
                heatmap={HEAT_ACCIDENTS}
                legendTitle="Аварийность дорог"
                height={420}
                zoom={8} geoJsonUrl="/data/districts.geojson"
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div className="card" style={{ padding: '14px' }}>
                <div className="section-title">Легенда</div>
                {[
                  { c: '#155EA4', l: 'Камеры видеонаблюдения' },
                  { c: '#f5365c', l: 'Аварийно-опасные зоны' },
                ].map((it, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: it.c, display: 'inline-block' }} />
                    <span style={{ fontSize: '12px', color: '#4a5568' }}>{it.l}</span>
                  </div>
                ))}
                <div style={{ borderTop: '1px solid rgba(21,94,164,0.1)', paddingTop: '8px', marginTop: '4px' }}>
                  <div style={{ fontSize: '11px', color: '#4a5568', lineHeight: '1.5' }}>
                    Тепловая карта: концентрация ДТП по районам. <span style={{ color: '#f5365c' }}>Красный</span> — высокая аварийность.
                  </div>
                </div>
              </div>
              <div className="card" style={{ padding: '14px' }}>
                <div className="section-title">Аварийно-опасные участки</div>
                {[
                  { road: 'А-2 км 124–128', dtps: 18, color: '#f5365c' },
                  { road: 'пр. Жибек жолы', dtps: 12, color: '#f5365c' },
                  { road: 'Объездная, км 4–9', dtps: 9, color: '#d4a000' },
                  { road: 'Байзак–Кордай, км 22', dtps: 7, color: '#d4a000' },
                ].map((item, i) => (
                  <div key={i} style={{ padding: '7px 0', borderBottom: '1px solid rgba(21,94,164,0.1)', display: 'flex', justifyContent: 'space-between', fontSize: '11px' }}>
                    <span style={{ color: '#1a1a2e' }}>{item.road}</span>
                    <span style={{ color: item.color, fontWeight: 600 }}>{item.dtps} ДТП</span>
                  </div>
                ))}
              </div>
              <div className="card" style={{ padding: '14px' }}>
                <div className="section-title">Камеры — статус</div>
                {[
                  { label: 'Активных', value: '276', color: '#2dce89' },
                  { label: 'Офлайн', value: '8', color: '#f5365c' },
                  { label: 'Нарушений сегодня', value: '184', color: '#d4a000' },
                ].map((it, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 0', borderBottom: '1px solid rgba(21,94,164,0.1)', fontSize: '12px' }}>
                    <span style={{ color: '#4a5568' }}>{it.label}</span>
                    <span style={{ fontWeight: 600, color: it.color }}>{it.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {tab === 'safety' && (
          <div className="grid-2">
            <div className="card">
              <div className="section-title">Динамика ДТП (2024)</div>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={dtpData} barGap={2}>
                  <XAxis dataKey="m" tick={{ fontSize: 10, fill: '#8292a5' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: '#8292a5' }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CT />} />
                  <Bar dataKey="total" name="Всего ДТП" fill="#fb6340" radius={[3, 3, 0, 0]} />
                  <Bar dataKey="deadly" name="Погибло" fill="#f5365c" radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="card">
              <div className="section-title">Показатели безопасности</div>
              {[
                { label: 'ДТП за 8 мес.', value: '331', color: '#fb6340' },
                { label: 'Погибших', value: '49', color: '#f5365c' },
                { label: 'Пострадавших', value: '432', color: '#d4a000' },
                { label: 'Снижение к 2023', value: '8%', color: '#2dce89' },
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid rgba(21,94,164,0.1)', fontSize: '13px' }}>
                  <span style={{ color: '#4a5568' }}>{item.label}</span>
                  <span style={{ fontWeight: 600, color: item.color }}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'routes' && (
          <div className="card">
            <div className="section-title">Маршрутная сеть — пассажиропоток</div>
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Маршрут</th><th>Откуда</th><th>Куда</th>
                    <th style={{ textAlign: 'center' }}>Автобусов</th>
                    <th style={{ textAlign: 'right' }}>Пасс./день</th>
                  </tr>
                </thead>
                <tbody>
                  {routes.map((r, i) => (
                    <tr key={i}>
                      <td><span style={{ background: 'rgba(21,94,164,0.1)', color: '#155EA4', padding: '2px 8px', borderRadius: '4px', fontWeight: 600, fontSize: '12px' }}>{r.id}</span></td>
                      <td style={{ fontSize: '12px' }}>{r.from}</td>
                      <td style={{ fontSize: '12px' }}>{r.to}</td>
                      <td style={{ textAlign: 'center', fontWeight: 600 }}>{r.buses}</td>
                      <td style={{ textAlign: 'right', fontWeight: 600, color: r.pax > 7000 ? '#2dce89' : r.pax > 5000 ? '#d4a000' : '#4a5568' }}>{r.pax.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === 'roads' && (
          <div className="card">
            <div className="section-title">Дорожно-строительные работы 2024</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {roadWork.map((r, i) => (
                <div key={i} style={{ padding: '12px', background: '#f3eeec', borderRadius: '8px', border: '1px solid rgba(21,94,164,0.1)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: 500, color: '#1a1a2e' }}>{r.section}</div>
                      <div style={{ fontSize: '11px', color: '#8292a5', marginTop: '2px' }}>{r.length} км</div>
                    </div>
                    <span style={{ fontSize: '11px', fontWeight: 600, color: STATUS_COLOR[r.status], background: `${STATUS_COLOR[r.status]}20`, padding: '3px 10px', borderRadius: '20px' }}>
                      {STATUS_LABEL[r.status]}
                    </span>
                  </div>
                  <div className="progress-bar">
                    <div style={{ height: '100%', borderRadius: '4px', width: `${r.pct}%`, background: STATUS_COLOR[r.status] }} />
                  </div>
                  <div style={{ fontSize: '11px', color: STATUS_COLOR[r.status], marginTop: '4px', textAlign: 'right' }}>{r.pct}%</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
