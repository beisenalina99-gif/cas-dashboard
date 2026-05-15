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

const touristFlow = [
  { m: 'Янв', internal: 18400, external: 4200 }, { m: 'Фев', internal: 16800, external: 3800 },
  { m: 'Мар', internal: 22400, external: 6200 }, { m: 'Апр', internal: 28400, external: 8800 },
  { m: 'Май', internal: 34200, external: 12400 }, { m: 'Июн', internal: 48200, external: 18400 },
  { m: 'Июл', internal: 62400, external: 24200 }, { m: 'Авг', internal: 58200, external: 22400 },
];

const medalsData = [
  { sport: 'Дзюдо', gold: 4, silver: 2, bronze: 6 },
  { sport: 'Борьба', gold: 3, silver: 4, bronze: 5 },
  { sport: 'Тяж. атлетика', gold: 2, silver: 3, bronze: 4 },
  { sport: 'Лёгкая атл.', gold: 1, silver: 2, bronze: 3 },
  { sport: 'Бокс', gold: 2, silver: 1, bronze: 2 },
];

const sportCoverage = [
  { name: 'Занимаются спортом', value: 28, color: '#155EA4' },
  { name: 'Не занимаются', value: 72, color: '#d5c8c5' },
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

export default function TourismDashboard() {
  const [tab, setTab] = useState('map');

  const TOURISM_MARKERS = [
    { id: 't1', lat: 44.21, lng: 72.86, type: 'park' as const, name: 'Таразский медресе (XII в.)', status: 'ok' as const, kpis: [{ label: 'Туристов/год', value: '48 200' }, { label: 'Статус', value: 'ЮНЕСКО' }] },
    { id: 't2', lat: 44.18, lng: 72.90, type: 'park' as const, name: 'Мавзолей Давутбека', status: 'ok' as const, kpis: [{ label: 'Туристов/год', value: '24 400' }] },
    { id: 't3', lat: 44.23, lng: 72.84, type: 'office' as const, name: 'Спорткомплекс «Тараз»', status: 'ok' as const, kpis: [{ label: 'Спортсменов', value: '1 840' }, { label: 'Тренеров', value: '124' }] },
    { id: 't4', lat: 44.20, lng: 72.92, type: 'office' as const, name: 'Стадион «Центральный»', status: 'ok' as const, kpis: [{ label: 'Вместимость', value: '14 200' }] },
    { id: 't5', lat: 44.36, lng: 72.58, type: 'forest' as const, name: 'Нац. парк «Аксу-Джабаглы»', status: 'ok' as const, kpis: [{ label: 'Туристов/год', value: '18 400' }, { label: 'Площадь', value: '74 тыс. га' }] },
    { id: 't6', lat: 44.25, lng: 72.78, type: 'office' as const, name: 'Гостиница «Тараз»', status: 'ok' as const, kpis: [{ label: 'Мест', value: '280' }, { label: 'Загрузка', value: '72%' }] },
  ];

  return (
    <div>
      <div className="page-header">
        <h1>Управление туризма, физической культуры и спорта</h1>
        <span className="live-dot">Live</span>
      </div>
      <div className="page-body">
        <div className="kpi-grid">
          <KPICard color="teal" label="Туристов за 8 мес." value="328 400" unit="" trend="+24% к 2023" trendDir="up" sub="Въездных: 100 400" />
          <KPICard color="blue" label="Занимаются спортом" value="28" unit="%" trend="+3% к 2023" trendDir="up" sub="Цель: 40% к 2027" />
          <KPICard color="yellow" label="Медалей (8 мес.)" value="42" unit="ед." trend="12 золотых" trendDir="up" sub="Респ. + межд. сор-ния" />
          <KPICard color="green" label="Мест размещения" value="1 840" unit="ед." trend="+280 к 2023" trendDir="up" sub="18 гостиниц, 42 хостела" />
          <KPICard color="orange" label="Занятых в туризме" value="4 820" unit="чел." trend="+12% к 2023" trendDir="up" sub="Доходы: 8.4 млрд тг" />
        </div>

        <div className="tab-bar">
          {['map', 'tourism', 'sport', 'medals'].map(t => (
            <button key={t} className={`tab-btn ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>
              {t === 'map' ? '🗺 Карта объектов' : t === 'tourism' ? 'Туристический поток' : t === 'sport' ? 'Спортивная инфраструктура' : 'Медальный зачёт'}
            </button>
          ))}
        </div>

        {tab === 'map' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: '16px' }}>
            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
              <div style={{ padding: '12px 16px', borderBottom: '1.5px solid rgba(21,94,164,0.12)' }}>
                <span style={{ fontSize: '13px', fontWeight: 600, color: '#1a1a2e' }}>Карта туристических объектов и спортивных сооружений</span>
              </div>
              <MapWidget districts={DISTRICTS} markers={TOURISM_MARKERS} legendTitle="Туризм и спорт"
                legendItems={[
                  { color: '#2dce89', label: 'Туристические объекты' },
                  { color: '#7b61ff', label: 'Спортивные сооружения' },
                  { color: '#7b61ff', label: 'Гостиницы' },
                ]} height={420} zoom={8} geoJsonUrl="/data/districts.geojson" />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div className="card" style={{ padding: '14px' }}>
                <div className="section-title">ТОП туробъекты</div>
                {[
                  { name: 'Таразский медресе', visits: '48 200', color: '#2dce89' },
                  { name: 'Мавзолей Давутбека', visits: '24 400', color: '#2dce89' },
                  { name: 'Нац. парк «Аксу-Джабаглы»', visits: '18 400', color: '#2dce89' },
                  { name: 'Балтабай горячие источники', visits: '12 800', color: '#d4a000' },
                ].map((item, i) => (
                  <div key={i} style={{ padding: '6px 0', borderBottom: '1px solid rgba(21,94,164,0.1)' }}>
                    <div style={{ fontSize: '11px', fontWeight: 500, color: '#1a1a2e' }}>{item.name}</div>
                    <div style={{ fontSize: '10px', color: item.color, marginTop: '1px' }}>{item.visits} туристов/год</div>
                  </div>
                ))}
              </div>
              <div className="card" style={{ padding: '14px' }}>
                <div className="section-title">Спорт — охват</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <ResponsiveContainer width={70} height={70}>
                    <PieChart>
                      <Pie data={sportCoverage} cx="50%" cy="50%" innerRadius={18} outerRadius={34} dataKey="value" strokeWidth={0}>
                        {sportCoverage.map((e, i) => <Cell key={i} fill={e.color} />)}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div>
                    <div style={{ fontSize: '28px', fontWeight: 700, color: '#155EA4' }}>28%</div>
                    <div style={{ fontSize: '10px', color: '#8292a5' }}>Систематически занимаются</div>
                    <div style={{ fontSize: '10px', color: '#8292a5', marginTop: '2px' }}>Детей в секциях: 48%</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {tab === 'tourism' && (
          <div className="grid-2">
            <div className="card">
              <div className="section-title">Динамика туристического потока</div>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={touristFlow}>
                  <XAxis dataKey="m" tick={{ fontSize: 10, fill: '#8292a5' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: '#8292a5' }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CT />} />
                  <Line type="monotone" dataKey="internal" name="Внутренние" stroke="#155EA4" strokeWidth={2} dot={{ fill: '#155EA4', r: 3 }} />
                  <Line type="monotone" dataKey="external" name="Въездные" stroke="#2dce89" strokeWidth={2} dot={{ fill: '#2dce89', r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="card">
              <div className="section-title">Показатели туризма</div>
              {[
                { label: 'Туристов (8 мес.)', value: '328 400', color: '#155EA4' },
                { label: 'Въездных', value: '100 400', color: '#2dce89' },
                { label: 'Доходы от туризма', value: '8.4 млрд тг', color: '#2dce89' },
                { label: 'Инвестиции', value: '4.2 млрд тг', color: '#7b61ff' },
                { label: 'Мест размещения', value: '1 840 ед.', color: '#0fa8c4' },
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '9px 0', borderBottom: '1px solid rgba(21,94,164,0.1)', fontSize: '12px' }}>
                  <span style={{ color: '#4a5568' }}>{item.label}</span>
                  <span style={{ fontWeight: 600, color: item.color }}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'sport' && (
          <div className="grid-2">
            <div className="card">
              <div className="section-title">Спортивная инфраструктура</div>
              {[
                { label: 'Спортивных объектов', value: '284 ед.', color: '#155EA4' },
                { label: 'Стадионов', value: '12', color: '#155EA4' },
                { label: 'Бассейнов', value: '18', color: '#0fa8c4' },
                { label: 'Спортзалов в школах', value: '180', color: '#7b61ff' },
                { label: 'Спортсменов', value: '12 480', color: '#2dce89' },
                { label: 'Тренеров', value: '1 240', color: '#fb6340' },
                { label: 'Обеспеченность', value: '0.24 объекта/1000', color: '#d4a000' },
                { label: 'Новых объектов в 2024', value: '8 ед.', color: '#2dce89' },
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 0', borderBottom: '1px solid rgba(21,94,164,0.1)', fontSize: '12px' }}>
                  <span style={{ color: '#4a5568' }}>{item.label}</span>
                  <span style={{ fontWeight: 600, color: item.color }}>{item.value}</span>
                </div>
              ))}
            </div>
            <div className="card">
              <div className="section-title">Члены нац. сборных</div>
              {[
                { sport: 'Дзюдо', members: 14, color: '#155EA4' },
                { sport: 'Борьба', members: 12, color: '#7b61ff' },
                { sport: 'Тяжёлая атлетика', members: 8, color: '#2dce89' },
                { sport: 'Лёгкая атлетика', members: 6, color: '#fb6340' },
                { sport: 'Бокс', members: 5, color: '#d4a000' },
              ].map((item, i) => (
                <div key={i} style={{ marginBottom: '10px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                    <span style={{ color: '#4a5568' }}>{item.sport}</span>
                    <span style={{ color: item.color, fontWeight: 600 }}>{item.members} чел.</span>
                  </div>
                  <div className="progress-bar">
                    <div style={{ height: '100%', borderRadius: '4px', width: `${(item.members / 14) * 100}%`, background: item.color }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'medals' && (
          <div className="grid-2">
            <div className="card">
              <div className="section-title">Медали по видам спорта (2024)</div>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={medalsData} barGap={2}>
                  <XAxis dataKey="sport" tick={{ fontSize: 9, fill: '#8292a5' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: '#8292a5' }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CT />} />
                  <Bar dataKey="gold" name="Золото" fill="#d4a000" radius={[3, 3, 0, 0]} />
                  <Bar dataKey="silver" name="Серебро" fill="#8292a5" radius={[3, 3, 0, 0]} />
                  <Bar dataKey="bronze" name="Бронза" fill="#fb6340" radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="card">
              <div className="section-title">Медальный зачёт</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', marginBottom: '16px' }}>
                {[
                  { type: '🥇 Золото', count: 12, color: '#d4a000' },
                  { type: '🥈 Серебро', count: 12, color: '#8292a5' },
                  { type: '🥉 Бронза', count: 20, color: '#fb6340' },
                ].map((m, i) => (
                  <div key={i} style={{ textAlign: 'center', background: '#f3eeec', borderRadius: '8px', padding: '12px', border: '1px solid rgba(21,94,164,0.1)' }}>
                    <div style={{ fontSize: '11px', color: '#4a5568', marginBottom: '6px' }}>{m.type}</div>
                    <div style={{ fontSize: '28px', fontWeight: 700, color: m.color }}>{m.count}</div>
                  </div>
                ))}
              </div>
              {[
                { label: 'Всего медалей', value: '44 ед.', color: '#155EA4' },
                { label: 'Индекс результативности', value: '3.5 мед./100 спортсменов', color: '#2dce89' },
                { label: 'Бюджет на спорт', value: '2.8 млрд тг', color: '#7b61ff' },
                { label: 'Эфф. расходов', value: '15.7 медалей/млрд тг', color: '#2dce89' },
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
