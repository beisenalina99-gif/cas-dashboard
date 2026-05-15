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

const confessions = [
  { name: 'Ислам', value: 68, color: '#155EA4' },
  { name: 'Православие', value: 18, color: '#7b61ff' },
  { name: 'Протестанты', value: 8, color: '#2dce89' },
  { name: 'Католицизм', value: 4, color: '#fb6340' },
  { name: 'Прочие', value: 2, color: '#a0aec0' },
];

const extremismData = [
  { m: 'Янв', detected: 4, removed: 4 }, { m: 'Фев', detected: 3, removed: 3 },
  { m: 'Мар', detected: 6, removed: 5 }, { m: 'Апр', detected: 5, removed: 5 },
  { m: 'Май', detected: 4, removed: 4 }, { m: 'Июн', detected: 7, removed: 6 },
  { m: 'Июл', detected: 5, removed: 5 }, { m: 'Авг', detected: 4, removed: 4 },
];

const explanatoryEvents = [
  { q: 'I кв', events: 48, covered: 12400 }, { q: 'II кв', events: 62, covered: 15800 },
  { q: 'III кв', events: 71, covered: 18200 }, { q: 'IV кв (план)', events: 80, covered: 22000 },
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

export default function ReligionDashboard() {
  const [tab, setTab] = useState('map');

  const RELIGION_MARKERS = [
    { id: 'r1', lat: 44.21, lng: 72.87, type: 'office' as const, name: 'Мечеть Тараз Ата (Центральная)', status: 'ok' as const, kpis: [{ label: 'Прихожан/нед.', value: '4 200' }, { label: 'Расст. до школы', value: '480 м' }] },
    { id: 'r2', lat: 44.23, lng: 72.90, type: 'office' as const, name: 'Свято-Никольская церковь', status: 'ok' as const, kpis: [{ label: 'Прихожан/нед.', value: '840' }, { label: 'Расст. до школы', value: '320 м' }] },
    { id: 'r3', lat: 44.19, lng: 72.84, type: 'office' as const, name: 'Мечеть мкр. Мынбулак', status: 'warning' as const, kpis: [{ label: 'Расст. до школы', value: '180 м ⚠️' }, { label: '< 300 м', value: 'Нарушение' }] },
    { id: 'r4', lat: 44.22, lng: 72.92, type: 'office' as const, name: 'Протестантская церковь', status: 'ok' as const, kpis: [{ label: 'Прихожан/нед.', value: '420' }] },
    { id: 'r5', lat: 44.38, lng: 72.60, type: 'office' as const, name: 'Мечеть Байзакская', status: 'ok' as const, kpis: [{ label: 'Прихожан/нед.', value: '1 200' }] },
    { id: 'r6', lat: 44.15, lng: 73.08, type: 'office' as const, name: 'Мечеть Жамбылская р-н', status: 'ok' as const, kpis: [{ label: 'Прихожан/нед.', value: '980' }] },
  ];

  return (
    <div>
      <div className="page-header">
        <h1>Управление по делам религий — Жамбылская область</h1>
        <span className="live-dot">Live</span>
      </div>
      <div className="page-body">
        <div className="kpi-grid">
          <KPICard color="blue" label="Рел. объединений" value="284" unit="ед." trend="+12 к 2023" trendDir="neutral" sub="По 5 конфессиям" />
          <KPICard color="green" label="Культовых зданий" value="312" unit="ед." trend="Мечети: 248, церкви: 48" trendDir="neutral" sub="Молельных домов: 16" />
          <KPICard color="orange" label="Охват разъяснит. работой" value="66 400" unit="чел." trend="+18% к 2023" trendDir="up" sub="261 мероприятие" />
          <KPICard color="yellow" label="Соблюдение нормы 300 м" value="94" unit="%" trend="18 объектов нарушают" trendDir="neutral" sub="Требуют внимания" />
          <KPICard color="red" label="Экстремистский контент" value="38" unit="случаев" trend="Удалено: 36" trendDir="up" sub="8 мес. 2024" />
        </div>

        <div className="tab-bar">
          {['map', 'confessions', 'extremism', 'explanatory'].map(t => (
            <button key={t} className={`tab-btn ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>
              {t === 'map' ? '🗺 Карта объектов' : t === 'confessions' ? 'Конфессии' : t === 'extremism' ? 'Экстремизм' : 'Разъяснит. работа'}
            </button>
          ))}
        </div>

        {tab === 'map' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: '16px' }}>
            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
              <div style={{ padding: '12px 16px', borderBottom: '1.5px solid rgba(21,94,164,0.12)' }}>
                <span style={{ fontSize: '13px', fontWeight: 600, color: '#1a1a2e' }}>Карта религиозных объектов — буферная зона 300 м от школ</span>
                <span style={{ fontSize: '11px', color: '#8292a5', marginLeft: '8px' }}>Жёлтый = нарушение нормы 300 м</span>
              </div>
              <MapWidget districts={DISTRICTS} markers={RELIGION_MARKERS} legendTitle="Религиозные объекты"
                legendItems={[
                  { color: '#155EA4', label: 'Мечети' },
                  { color: '#7b61ff', label: 'Православные церкви' },
                  { color: '#2dce89', label: 'Протестантские' },
                  { color: '#d4a000', label: 'Нарушение нормы 300 м' },
                ]} height={420} zoom={8} geoJsonUrl="/data/districts.geojson" />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div className="card" style={{ padding: '14px' }}>
                <div className="section-title">Объекты &lt; 300 м от школ</div>
                {[
                  { name: 'Мечеть мкр. Мынбулак', dist: '180 м', school: 'СОШ №24', color: '#f5365c' },
                  { name: 'Молельный дом Байзак', dist: '210 м', school: 'СОШ №3', color: '#f5365c' },
                  { name: 'Мечеть ул. Акын-Сара', dist: '245 м', school: 'ДС №8', color: '#d4a000' },
                  { name: 'Молельный дом Жуалы', dist: '280 м', school: 'СОШ №1', color: '#d4a000' },
                ].map((item, i) => (
                  <div key={i} style={{ padding: '7px 0', borderBottom: '1px solid rgba(21,94,164,0.1)' }}>
                    <div style={{ fontSize: '11px', fontWeight: 500, color: '#1a1a2e' }}>{item.name}</div>
                    <div style={{ fontSize: '10px', color: item.color, marginTop: '2px' }}>
                      {item.dist} до {item.school}
                    </div>
                  </div>
                ))}
              </div>
              <div className="card" style={{ padding: '14px' }}>
                <div className="section-title">Индекс напряжённости</div>
                <div style={{ textAlign: 'center', padding: '6px 0' }}>
                  <div style={{ fontSize: '42px', fontWeight: 700, color: '#2dce89' }}>12</div>
                  <div style={{ fontSize: '12px', color: '#4a5568' }}>из 100 (низкий)</div>
                  <div className="progress-bar" style={{ marginTop: '8px' }}>
                    <div style={{ height: '100%', borderRadius: '4px', width: '12%', background: '#2dce89' }} />
                  </div>
                  <div style={{ fontSize: '10px', color: '#8292a5', marginTop: '4px' }}>Межконфессиональная стабильность</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {tab === 'confessions' && (
          <div className="grid-2">
            <div className="card">
              <div className="section-title">Структура религиозных объединений</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <ResponsiveContainer width={160} height={180}>
                  <PieChart>
                    <Pie data={confessions} cx="50%" cy="50%" innerRadius={44} outerRadius={72} dataKey="value" strokeWidth={0}>
                      {confessions.map((e, i) => <Cell key={i} fill={e.color} />)}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div style={{ flex: 1 }}>
                  {confessions.map((it, i) => (
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
              <div className="section-title">Детализация по конфессиям</div>
              {[
                { label: 'Зарегистрированных объединений', value: '284 ед.', color: '#155EA4' },
                { label: 'Культовых зданий', value: '312 ед.', color: '#7b61ff' },
                { label: 'Рел. организаций образования', value: '18 ед.', color: '#fb6340' },
                { label: 'Обучающихся в них', value: '1 840 чел.', color: '#d4a000' },
                { label: 'Миссионеров', value: '48', color: '#f5365c' },
                { label: 'Литературы прошедшей экспертизу', value: '284 наим.', color: '#2dce89' },
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid rgba(21,94,164,0.1)', fontSize: '12px' }}>
                  <span style={{ color: '#4a5568' }}>{item.label}</span>
                  <span style={{ fontWeight: 600, color: item.color }}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'extremism' && (
          <div className="grid-2">
            <div className="card">
              <div className="section-title">Динамика выявления экстремистского контента</div>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={extremismData}>
                  <XAxis dataKey="m" tick={{ fontSize: 10, fill: '#8292a5' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: '#8292a5' }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CT />} />
                  <Line type="monotone" dataKey="detected" name="Выявлено" stroke="#f5365c" strokeWidth={2} dot={{ fill: '#f5365c', r: 3 }} />
                  <Line type="monotone" dataKey="removed" name="Удалено" stroke="#2dce89" strokeWidth={2} dot={{ fill: '#2dce89', r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="card">
              <div className="section-title">Экстремизм — показатели</div>
              {[
                { label: 'Выявлено случаев (8 мес.)', value: '38', color: '#f5365c' },
                { label: 'Удалено материалов', value: '36', color: '#2dce89' },
                { label: 'В обработке', value: '2', color: '#d4a000' },
                { label: 'Информационных материалов', value: '142 ед.', color: '#155EA4' },
                { label: 'Видеороликов', value: '48 ед.', color: '#7b61ff' },
                { label: 'Инфографик', value: '64 ед.', color: '#0fa8c4' },
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '9px 0', borderBottom: '1px solid rgba(21,94,164,0.1)', fontSize: '12px' }}>
                  <span style={{ color: '#4a5568' }}>{item.label}</span>
                  <span style={{ fontWeight: 600, color: item.color }}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'explanatory' && (
          <div className="grid-2">
            <div className="card">
              <div className="section-title">Разъяснительные мероприятия (ед. / охват)</div>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={explanatoryEvents} barGap={4}>
                  <XAxis dataKey="q" tick={{ fontSize: 10, fill: '#8292a5' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: '#8292a5' }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CT />} />
                  <Bar dataKey="events" name="Мероприятий" fill="#155EA4" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="card">
              <div className="section-title">Разъяснительная работа</div>
              {[
                { label: 'Мероприятий (8 мес.)', value: '261 ед.', color: '#155EA4' },
                { label: 'Охват населения', value: '66 400 чел.', color: '#2dce89' },
                { label: 'Видеоролики', value: '48 ед.', color: '#7b61ff' },
                { label: 'Инфографик', value: '64 ед.', color: '#0fa8c4' },
                { label: 'Статей в СМИ', value: '184 ед.', color: '#fb6340' },
                { label: 'Охват молодёжи', value: '24 200 чел.', color: '#d4a000' },
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid rgba(21,94,164,0.1)', fontSize: '12px' }}>
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
