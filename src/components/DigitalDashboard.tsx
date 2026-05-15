import React, { useState } from 'react';
import { AreaChart, Area, BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
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

const servicesData = [
  { m: 'Янв', online: 18420, offline: 4820 }, { m: 'Фев', online: 19840, offline: 4420 },
  { m: 'Мар', online: 22180, offline: 4180 }, { m: 'Апр', online: 24820, offline: 3980 },
  { m: 'Май', online: 26480, offline: 3640 }, { m: 'Июн', online: 28120, offline: 3280 },
  { m: 'Июл', online: 29480, offline: 3080 }, { m: 'Авг', online: 31240, offline: 2840 },
];

const eko109Types = [
  { name: 'ЖКХ', value: 38, color: '#fb6340' },
  { name: 'Дороги', value: 22, color: '#d4a000' },
  { name: 'Освещение', value: 15, color: '#155EA4' },
  { name: 'Благоустройство', value: 14, color: '#7b61ff' },
  { name: 'Прочее', value: 11, color: '#a0aec0' },
];

const coverageData = [
  { district: 'г. Тараз', g4: 98, g5: 64, speed: 48 },
  { district: 'Байзакский', g4: 84, g5: 12, speed: 18 },
  { district: 'Жамбылский', g4: 78, g5: 8, speed: 14 },
  { district: 'Меркенский', g4: 72, g5: 0, speed: 12 },
  { district: 'Жуалынский', g4: 64, g5: 0, speed: 10 },
  { district: 'Сарысуский', g4: 58, g5: 0, speed: 8 },
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

export default function DigitalDashboard() {
  const [tab, setTab] = useState('map');

  const DIGITAL_MARKERS = [
    { id: 'd1', lat: 44.21, lng: 72.88, type: 'sensor' as const, name: 'Вышка 5G — центр Тараза', status: 'ok' as const, kpis: [{ label: 'Покрытие', value: '5G' }, { label: 'Скорость', value: '240 Мбит/с' }] },
    { id: 'd2', lat: 44.24, lng: 72.85, type: 'sensor' as const, name: 'БС 4G — мкр. Астана', status: 'ok' as const, kpis: [{ label: 'Покрытие', value: '4G' }, { label: 'Скорость', value: '48 Мбит/с' }] },
    { id: 'd3', lat: 44.18, lng: 72.91, type: 'office' as const, name: 'ЦОН Тараз', status: 'ok' as const, kpis: [{ label: 'Услуг/день', value: '284' }, { label: 'Ср. время', value: '12 мин' }] },
    { id: 'd4', lat: 44.38, lng: 72.6, type: 'office' as const, name: 'ЦОН Байзак', status: 'warning' as const, kpis: [{ label: 'Нарушений сроков', value: '8%' }] },
    { id: 'd5', lat: 44.22, lng: 72.79, type: 'office' as const, name: 'Архив Тараз', status: 'ok' as const, kpis: [{ label: 'Оцифровано', value: '42%' }, { label: 'Ед. хранения', value: '1.84 млн' }] },
    { id: 'd6', lat: 44.20, lng: 72.93, type: 'sensor' as const, name: 'Вышка 5G — ж-д вокзал', status: 'ok' as const, kpis: [{ label: 'Покрытие', value: '5G' }] },
  ];

  return (
    <div>
      <div className="page-header">
        <h1>Управление цифровизации и архивов</h1>
        <span className="live-dot">Live</span>
      </div>
      <div className="page-body">
        <div className="kpi-grid">
          <KPICard color="blue" label="Госуслуг онлайн" value="89" unit="%" trend="+9% к 2023" trendDir="up" sub="Оказано: 284 тыс. услуг" />
          <KPICard color="green" label="НП с интернетом" value="94" unit="%" trend="187 из 198 НП" trendDir="up" sub="4G: 184, 5G: 12 НП" />
          <KPICard color="orange" label="Обращений 109 (мес.)" value="31 240" unit="" trend="+4% к пред. мес." trendDir="neutral" sub="Нерешённых: 8.4%" />
          <KPICard color="yellow" label="Оцифровано архивов" value="42" unit="%" trend="+8% к 2023" trendDir="up" sub="1.84 млн ед. хранения" />
          <KPICard color="teal" label="Ср. время ответа 109" value="18" unit="мин" trend="−4 мин к 2023" trendDir="up" sub="Цель: ≤12 мин к 2025" />
        </div>

        <div className="tab-bar">
          {['map', 'services', 'coverage', 'archive'].map(t => (
            <button key={t} className={`tab-btn ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>
              {t === 'map' ? '🗺 Карта связи' : t === 'services' ? 'Госуслуги / 109' : t === 'coverage' ? 'Покрытие связи' : 'Архивы / Культура'}
            </button>
          ))}
        </div>

        {tab === 'map' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: '16px' }}>
            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
              <div style={{ padding: '12px 16px', borderBottom: '1.5px solid rgba(21,94,164,0.12)' }}>
                <span style={{ fontSize: '13px', fontWeight: 600, color: '#1a1a2e' }}>Карта покрытия 4G/5G — базовые станции и ЦОНы</span>
              </div>
              <MapWidget districts={DISTRICTS} markers={DIGITAL_MARKERS} legendTitle="Цифровая инфраструктура"
                legendItems={[
                  { color: '#0fa8c4', label: 'Базовые станции 4G/5G' },
                  { color: '#7b61ff', label: 'Центры обслуживания (ЦОН)' },
                  { color: '#7b61ff', label: 'Архивы' },
                ]} height={420} zoom={8} geoJsonUrl="/data/districts.geojson" />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div className="card" style={{ padding: '14px' }}>
                <div className="section-title">Индекс цифровой зрелости</div>
                {coverageData.slice(0, 4).map((d, i) => (
                  <div key={i} style={{ marginBottom: '9px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '3px' }}>
                      <span style={{ color: '#4a5568' }}>{d.district}</span>
                      <span style={{ color: d.g4 >= 90 ? '#2dce89' : d.g4 >= 75 ? '#d4a000' : '#f5365c', fontWeight: 600 }}>{d.g4}%</span>
                    </div>
                    <div className="progress-bar">
                      <div style={{ height: '100%', borderRadius: '4px', width: `${d.g4}%`, background: d.g4 >= 90 ? '#2dce89' : d.g4 >= 75 ? '#d4a000' : '#f5365c' }} />
                    </div>
                  </div>
                ))}
              </div>
              <div className="card" style={{ padding: '14px' }}>
                <div className="section-title">Нарушения ЦОН (сроки)</div>
                {[
                  { name: 'г. Тараз', violations: '1.2%', color: '#2dce89' },
                  { name: 'Байзакский р-н', violations: '8.4%', color: '#f5365c' },
                  { name: 'Меркенский р-н', violations: '4.1%', color: '#d4a000' },
                  { name: 'Жуалынский р-н', violations: '6.8%', color: '#d4a000' },
                ].map((it, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid rgba(21,94,164,0.1)', fontSize: '11px' }}>
                    <span style={{ color: '#4a5568' }}>{it.name}</span>
                    <span style={{ color: it.color, fontWeight: 600 }}>{it.violations}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {tab === 'services' && (
          <div className="grid-2">
            <div className="card">
              <div className="section-title">Онлайн vs офлайн услуги (ед./мес.)</div>
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={servicesData}>
                  <defs>
                    <linearGradient id="gOnline" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#155EA4" stopOpacity={0.2} /><stop offset="95%" stopColor="#155EA4" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="m" tick={{ fontSize: 10, fill: '#8292a5' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: '#8292a5' }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CT />} />
                  <Area type="monotone" dataKey="online" name="Онлайн" stroke="#155EA4" fill="url(#gOnline)" strokeWidth={2} dot={false} />
                  <Area type="monotone" dataKey="offline" name="Офлайн" stroke="#f5365c" fill="rgba(245,54,92,0.08)" strokeWidth={2} dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="card">
              <div className="section-title">Типология обращений 109</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <ResponsiveContainer width={100} height={100}>
                  <PieChart>
                    <Pie data={eko109Types} cx="50%" cy="50%" innerRadius={26} outerRadius={46} dataKey="value" strokeWidth={0}>
                      {eko109Types.map((e, i) => <Cell key={i} fill={e.color} />)}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div style={{ flex: 1 }}>
                  {eko109Types.map((it, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: it.color, display: 'inline-block' }} />
                        <span style={{ fontSize: '10px', color: '#4a5568' }}>{it.name}</span>
                      </div>
                      <span style={{ fontSize: '11px', fontWeight: 600, color: it.color }}>{it.value}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {tab === 'coverage' && (
          <div className="card">
            <div className="section-title">Покрытие 4G/5G и скорость интернета по районам</div>
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Район</th>
                    <th style={{ textAlign: 'center' }}>4G покрытие</th>
                    <th style={{ textAlign: 'center' }}>5G покрытие</th>
                    <th style={{ textAlign: 'center' }}>Ср. скорость</th>
                    <th>Статус</th>
                  </tr>
                </thead>
                <tbody>
                  {coverageData.map((d, i) => (
                    <tr key={i}>
                      <td style={{ fontWeight: 500 }}>{d.district}</td>
                      <td style={{ textAlign: 'center', color: d.g4 >= 90 ? '#2dce89' : d.g4 >= 75 ? '#d4a000' : '#f5365c', fontWeight: 600 }}>{d.g4}%</td>
                      <td style={{ textAlign: 'center', color: d.g5 > 0 ? '#2dce89' : '#8292a5', fontWeight: 600 }}>{d.g5 > 0 ? `${d.g5}%` : 'Нет'}</td>
                      <td style={{ textAlign: 'center' }}>{d.speed} Мбит/с</td>
                      <td>
                        <span style={{ fontSize: '11px', fontWeight: 500, color: d.g4 >= 90 ? '#2dce89' : d.g4 >= 75 ? '#d4a000' : '#f5365c' }}>
                          {d.g4 >= 90 ? '● Норма' : d.g4 >= 75 ? '● Внимание' : '● Критично'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === 'archive' && (
          <div className="grid-2">
            <div className="card">
              <div className="section-title">Архивы и культура</div>
              {[
                { label: 'Архивных дел всего', value: '1.84 млн ед.', color: '#155EA4' },
                { label: 'Оцифровано', value: '42% (772 тыс.)', color: '#2dce89' },
                { label: 'Посещаемость библиотек', value: '184 / 1000 чел.', color: '#7b61ff' },
                { label: 'Посещаемость музеев', value: '48 / 1000 чел.', color: '#fb6340' },
                { label: 'Посещаемость театров', value: '28 / 1000 чел.', color: '#0fa8c4' },
                { label: 'Культурных мероприятий', value: '1 248 / год', color: '#2dce89' },
                { label: 'Участников кружков', value: '48 420 чел.', color: '#d4a000' },
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid rgba(21,94,164,0.1)', fontSize: '12px' }}>
                  <span style={{ color: '#4a5568' }}>{item.label}</span>
                  <span style={{ fontWeight: 600, color: item.color }}>{item.value}</span>
                </div>
              ))}
            </div>
            <div className="card">
              <div className="section-title">Уровень цифровизации архива (%)</div>
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <div style={{ fontSize: '56px', fontWeight: 700, color: '#155EA4' }}>42%</div>
                <div style={{ fontSize: '13px', color: '#4a5568' }}>772 тыс. из 1.84 млн ед.</div>
                <div className="progress-bar" style={{ marginTop: '16px' }}>
                  <div style={{ height: '100%', borderRadius: '4px', width: '42%', background: '#155EA4' }} />
                </div>
                <div style={{ fontSize: '11px', color: '#8292a5', marginTop: '8px' }}>Цель: 80% к 2027</div>
              </div>
              <div style={{ background: '#f3eeec', borderRadius: '8px', padding: '10px', marginTop: '12px', border: '1px solid rgba(21,94,164,0.1)' }}>
                <div className="alert-item warning" style={{ marginBottom: 0 }}>
                  <div className="alert-dot warning" />
                  <div style={{ fontSize: '11px', color: '#1a1a2e' }}>Байзакский р-н: интернет менее 70% НП — цифровизация затруднена</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
