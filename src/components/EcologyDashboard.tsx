import React, { useState } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import MapWidget from './MapWidget';
import { DISTRICTS, ECOLOGY_MARKERS, HEAT_ECOLOGY } from '../data/mapData';

const CT = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: '#fff', border: '1.5px solid rgba(21,94,164,0.2)', borderRadius: '8px', padding: '10px 14px', fontSize: '12px', boxShadow: '0 4px 12px rgba(21,94,164,0.1)' }}>
      <p style={{ color: '#155EA4', marginBottom: '4px', fontWeight: 600 }}>{label}</p>
      {payload.map((p: any, i: number) => <p key={i} style={{ color: p.color }}>{p.name}: <b>{p.value}</b></p>)}
    </div>
  );
};

const aqiData = [
  { m: 'Янв', aqi: 82 }, { m: 'Фев', aqi: 78 }, { m: 'Мар', aqi: 65 },
  { m: 'Апр', aqi: 58 }, { m: 'Май', aqi: 48 }, { m: 'Июн', aqi: 42 },
  { m: 'Июл', aqi: 55 }, { m: 'Авг', aqi: 61 },
];

const emissionsData = [
  { industry: 'Промышленность', amount: 84.2 }, { industry: 'Транспорт', amount: 48.6 },
  { industry: 'ЖКХ', amount: 32.4 }, { industry: 'Сельхоз', amount: 18.8 }, { industry: 'Прочее', amount: 12.2 },
];

const sensors = [
  { location: 'г. Тараз, центр', aqi: 82, pm25: 28.4, status: 'moderate' },
  { location: 'г. Тараз, пром. зона', aqi: 124, pm25: 48.2, status: 'unhealthy' },
  { location: 'Меркенский р-н', aqi: 45, pm25: 12.1, status: 'good' },
  { location: 'Байзакский р-н', aqi: 62, pm25: 18.4, status: 'moderate' },
  { location: 'Жамбылский р-н', aqi: 38, pm25: 9.2, status: 'good' },
];

const AQI_COLOR: Record<string, string> = { good: '#2dce89', moderate: '#d4a000', unhealthy: '#f5365c' };
const AQI_LABEL: Record<string, string> = { good: 'Хорошо', moderate: 'Умеренно', unhealthy: 'Вредно' };

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

export default function EcologyDashboard() {
  const [tab, setTab] = useState('map');

  return (
    <div>
      <div className="page-header">
        <h1>Управление природных ресурсов — Жамбылская область</h1>
        <span className="live-dot">Live</span>
      </div>
      <div className="page-body">
        <div className="kpi-grid">
          <KPICard color="green" label="AQI (средний)" value="62" unit="" trend="Умеренный уровень" trendDir="neutral" sub="Обновлено 15 мин назад" />
          <KPICard color="yellow" label="PM2.5 (центр Тараза)" value="28.4" unit="мкг/м³" trend="Норма: ≤25" trendDir="down" sub="Незначит. превышение" />
          <KPICard color="red" label="Выбросы ЗВ" value="196.2" unit="тыс. т" trend="−4.2% к 2023" trendDir="up" sub="Пром. зоны: 84.2 тыс. т" />
          <KPICard color="teal" label="Индекс эко-благополучия" value="54" unit="/100" trend="Средний" trendDir="neutral" sub="Цель: 70 к 2027" />
          <KPICard color="orange" label="Жалоб на экологию" value="1 842" unit="ед." trend="+8% к 2023" trendDir="down" sub="Нерешённых: 284" />
        </div>

        <div className="tab-bar">
          {['map', 'air', 'emissions'].map(t => (
            <button key={t} className={`tab-btn ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>
              {t === 'map' ? '🗺 Экологическая карта' : t === 'air' ? 'Качество воздуха' : 'Выбросы'}
            </button>
          ))}
        </div>

        {tab === 'map' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: '16px' }}>
            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
              <div style={{ padding: '12px 16px', borderBottom: '1.5px solid rgba(21,94,164,0.12)' }}>
                <span style={{ fontSize: '13px', fontWeight: 600, color: '#1a1a2e' }}>Тепловая карта загрязнения воздуха — датчики, заводы, природные ресурсы</span>
              </div>
              <MapWidget
                districts={DISTRICTS}
                markers={ECOLOGY_MARKERS}
                heatmap={HEAT_ECOLOGY}
                legendTitle="Загрязнение воздуха"
                height={420}
                zoom={8} geoJsonUrl="/data/districts.geojson"
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div className="card" style={{ padding: '14px' }}>
                <div className="section-title">Легенда</div>
                {[
                  { c: '#0fa8c4', l: 'Датчики качества воздуха' },
                  { c: '#fb6340', l: 'Промышленные предприятия' },
                  { c: '#0fa8c4', l: 'Водохранилища' },
                  { c: '#2dce89', l: 'Лесные массивы' },
                  { c: '#0fa8c4', l: 'Метеостанции' },
                ].map((it, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '7px' }}>
                    <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: it.c, display: 'inline-block' }} />
                    <span style={{ fontSize: '11px', color: '#4a5568' }}>{it.l}</span>
                  </div>
                ))}
              </div>
              <div className="card" style={{ padding: '14px' }}>
                <div className="section-title">Статус датчиков</div>
                {sensors.map((s, i) => (
                  <div key={i} style={{ padding: '7px 0', borderBottom: '1px solid rgba(21,94,164,0.1)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px' }}>
                      <span style={{ color: '#1a1a2e', fontWeight: 500 }}>{s.location}</span>
                      <span style={{ color: AQI_COLOR[s.status], fontWeight: 700 }}>{s.aqi}</span>
                    </div>
                    <div style={{ color: AQI_COLOR[s.status], fontSize: '10px', marginTop: '1px' }}>
                      {AQI_LABEL[s.status]} · PM2.5: {s.pm25} мкг/м³
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {tab === 'air' && (
          <div className="grid-2">
            <div className="card">
              <div className="section-title">Динамика AQI (2024)</div>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={aqiData}>
                  <XAxis dataKey="m" tick={{ fontSize: 10, fill: '#8292a5' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: '#8292a5' }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CT />} />
                  <Line type="monotone" dataKey="aqi" name="AQI" stroke="#d4a000" strokeWidth={2} dot={{ fill: '#d4a000', r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="card">
              <div className="section-title">Мониторинг загрязнения</div>
              {[
                { label: 'Превышений ПДК (год)', value: '2 случая', color: '#f5365c' },
                { label: 'AQI (ср. по области)', value: '62', color: '#d4a000' },
                { label: 'AQI в пром. зоне', value: '124', color: '#f5365c' },
                { label: 'Жалоб на экологию', value: '1 842', color: '#d4a000' },
                { label: 'Нерешённых жалоб', value: '284', color: '#f5365c' },
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '9px 0', borderBottom: '1px solid rgba(21,94,164,0.1)', fontSize: '13px' }}>
                  <span style={{ color: '#4a5568' }}>{item.label}</span>
                  <span style={{ fontWeight: 600, color: item.color }}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'emissions' && (
          <div className="grid-2">
            <div className="card">
              <div className="section-title">Структура выбросов (тыс. т/год)</div>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={emissionsData} layout="vertical">
                  <XAxis type="number" tick={{ fontSize: 10, fill: '#8292a5' }} axisLine={false} tickLine={false} />
                  <YAxis type="category" dataKey="industry" tick={{ fontSize: 11, fill: '#4a5568' }} axisLine={false} tickLine={false} width={100} />
                  <Tooltip content={<CT />} />
                  <Bar dataKey="amount" name="Выбросы (тыс. т)" fill="#fb6340" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="card">
              <div className="section-title">Природные ресурсы</div>
              {[
                { label: 'Выбросы ЗВ', value: '196.2 тыс. т', color: '#fb6340' },
                { label: 'Снижение к 2023', value: '4.2%', color: '#2dce89' },
                { label: 'Индекс эко-благополучия', value: '54/100', color: '#0fa8c4' },
                { label: 'Водохранилищ', value: '12', color: '#0fa8c4' },
                { label: 'Лесного фонда', value: '312 тыс. га', color: '#2dce89' },
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
