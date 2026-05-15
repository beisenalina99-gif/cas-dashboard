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

const gantData = [
  { name: 'Школа №18, Тараз', start: 0, duration: 18, done: 14, status: 'in_progress' },
  { name: 'ДС «Жулдыз», Байзак', start: 2, duration: 12, done: 12, status: 'completed' },
  { name: 'ФАП Меркенский р-н', start: 4, duration: 8, done: 3, status: 'in_progress' },
  { name: 'Мост А-2 км 148', start: 6, duration: 24, done: 0, status: 'delayed' },
  { name: 'СКО Жуалынский', start: 1, duration: 10, done: 0, status: 'planned' },
];

const checksData = [
  { m: 'Янв', checks: 48, prescriptions: 12 }, { m: 'Фев', checks: 42, prescriptions: 9 },
  { m: 'Мар', checks: 61, prescriptions: 18 }, { m: 'Апр', checks: 54, prescriptions: 14 },
  { m: 'Май', checks: 58, prescriptions: 11 }, { m: 'Июн', checks: 63, prescriptions: 16 },
  { m: 'Июл', checks: 71, prescriptions: 21 }, { m: 'Авг', checks: 68, prescriptions: 19 },
];

const housingWear = [
  { district: 'г. Тараз', wear: 58, total: 124 },
  { district: 'Байзакский', wear: 72, total: 48 },
  { district: 'Жамбылский', wear: 44, total: 32 },
  { district: 'Меркенский', wear: 61, total: 28 },
  { district: 'Жуалынский', wear: 68, total: 24 },
  { district: 'Сарысуский', wear: 38, total: 18 },
];

const statusColors: Record<string, string> = { completed: '#2dce89', in_progress: '#155EA4', delayed: '#f5365c', planned: '#8292a5' };
const statusLabels: Record<string, string> = { completed: 'Введён', in_progress: 'В работе', delayed: 'Долгострой', planned: 'Запланировано' };

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

export default function ConstructionDashboard() {
  const [tab, setTab] = useState('map');

  const CONSTRUCTION_MARKERS = [
    { id: 'c1', lat: 44.22, lng: 72.87, type: 'factory' as const, name: 'Школа №18 (стр.)', status: 'warning' as const, kpis: [{ label: 'Готовность', value: '78%' }, { label: 'Срок ввода', value: 'Дек 2024' }] },
    { id: 'c2', lat: 44.38, lng: 72.6, type: 'office' as const, name: 'ФАП Байзакский', status: 'ok' as const, kpis: [{ label: 'Готовность', value: '100%' }, { label: 'Статус', value: 'Введён' }] },
    { id: 'c3', lat: 44.19, lng: 72.84, type: 'office' as const, name: 'ДС «Жулдыз»', status: 'ok' as const, kpis: [{ label: 'Готовность', value: '100%' }] },
    { id: 'c4', lat: 44.21, lng: 72.91, type: 'factory' as const, name: 'Мост А-2 (долгострой)', status: 'critical' as const, kpis: [{ label: 'Задержка', value: '14 мес.' }, { label: 'Предписаний', value: '3' }] },
    { id: 'c5', lat: 44.15, lng: 72.76, type: 'office' as const, name: 'ГАСК — Офис Тараз', status: 'ok' as const, kpis: [{ label: 'Проверок (мес)', value: '68' }, { label: 'Штрафов', value: '4.2 млн тг' }] },
    { id: 'c6', lat: 44.31, lng: 73.1, type: 'factory' as const, name: 'СОШ №3 Жамбыл', status: 'warning' as const, kpis: [{ label: 'Готовность', value: '45%' }, { label: 'Предписаний', value: '2' }] },
  ];

  return (
    <div>
      <div className="page-header">
        <h1>Архитектура, Строительство и ГАСК — Жамбылская область</h1>
        <span className="live-dot">Live</span>
      </div>
      <div className="page-body">
        <div className="kpi-grid">
          <KPICard color="blue" label="Объектов строится" value="84" unit="ед." trend="+12 к 2023" trendDir="up" sub="Соцобъектов: 48" />
          <KPICard color="red" label="Долгостроев" value="7" unit="ед." trend="−3 к 2023" trendDir="up" sub="Задержка &gt;6 мес." />
          <KPICard color="green" label="Введено в 2024" value="31" unit="ед." trend="74% от плана" trendDir="up" sub="Соцобъектов: 22" />
          <KPICard color="orange" label="Проверок ГАСК" value="421" unit="ед." trend="8 мес. 2024" trendDir="neutral" sub="Предписаний: 110" />
          <KPICard color="yellow" label="Обеспеченность жильём" value="18.4" unit="м²/чел." trend="+0.6 к 2023" trendDir="up" sub="Цель: 22 м² к 2027" />
        </div>

        <div className="tab-bar">
          {['map', 'gant', 'gask', 'housing'].map(t => (
            <button key={t} className={`tab-btn ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>
              {t === 'map' ? '🗺 Карта строек' : t === 'gant' ? 'Объекты / сроки' : t === 'gask' ? 'ГАСК' : 'Жилой фонд'}
            </button>
          ))}
        </div>

        {tab === 'map' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: '16px' }}>
            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
              <div style={{ padding: '12px 16px', borderBottom: '1.5px solid rgba(21,94,164,0.12)' }}>
                <span style={{ fontSize: '13px', fontWeight: 600, color: '#1a1a2e' }}>ГИС-карта строек, долгостроев и проверок ГАСК</span>
                <span style={{ fontSize: '11px', color: '#8292a5', marginLeft: '8px' }}>Клик — карточка объекта</span>
              </div>
              <MapWidget districts={DISTRICTS} markers={CONSTRUCTION_MARKERS} legendTitle="Строительные объекты"
                legendItems={[
                  { color: '#155EA4', label: 'В строительстве' },
                  { color: '#2dce89', label: 'Введены' },
                  { color: '#f5365c', label: 'Долгострой' },
                  { color: '#8292a5', label: 'Офисы ГАСК' },
                ]} height={420} zoom={8} geoJsonUrl="/data/districts.geojson" />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div className="card" style={{ padding: '14px' }}>
                <div className="section-title">Долгострои — срочно</div>
                {[
                  { name: 'Мост А-2 км 148', delay: '14 мес.', budget: '1.84 млрд тг', color: '#f5365c' },
                  { name: 'Школа №4 Жуалы', delay: '9 мес.', budget: '480 млн тг', color: '#f5365c' },
                  { name: 'ФАП Сарысу', delay: '6 мес.', budget: '84 млн тг', color: '#d4a000' },
                  { name: 'Детсад №7 Байзак', delay: '7 мес.', budget: '240 млн тг', color: '#f5365c' },
                ].map((item, i) => (
                  <div key={i} style={{ padding: '7px 0', borderBottom: '1px solid rgba(21,94,164,0.1)' }}>
                    <div style={{ fontSize: '11px', fontWeight: 500, color: '#1a1a2e' }}>{item.name}</div>
                    <div style={{ fontSize: '10px', color: item.color, marginTop: '2px' }}>
                      Задержка: <b>{item.delay}</b> · Бюджет: {item.budget}
                    </div>
                  </div>
                ))}
              </div>
              <div className="card" style={{ padding: '14px' }}>
                <div className="section-title">Лицензии ГАСК</div>
                {[
                  { label: 'СМР', value: '284', color: '#155EA4' },
                  { label: 'Проектирование', value: '142', color: '#7b61ff' },
                  { label: 'Изыскания', value: '98', color: '#0fa8c4' },
                  { label: 'Незаконных строек (выявл.)', value: '18', color: '#f5365c' },
                ].map((it, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid rgba(21,94,164,0.1)', fontSize: '11px' }}>
                    <span style={{ color: '#4a5568' }}>{it.label}</span>
                    <span style={{ fontWeight: 600, color: it.color }}>{it.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {tab === 'gant' && (
          <div className="card">
            <div className="section-title">Ключевые объекты — план-факт ввода (мес.)</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '8px' }}>
              {gantData.map((r, i) => (
                <div key={i} style={{ padding: '12px', background: '#f3eeec', borderRadius: '8px', border: '1px solid rgba(21,94,164,0.1)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <div style={{ fontSize: '13px', fontWeight: 500, color: '#1a1a2e' }}>{r.name}</div>
                    <span style={{ fontSize: '11px', fontWeight: 600, color: statusColors[r.status], background: `${statusColors[r.status]}22`, padding: '3px 10px', borderRadius: '20px' }}>
                      {statusLabels[r.status]}
                    </span>
                  </div>
                  <div className="progress-bar">
                    <div style={{ height: '100%', borderRadius: '4px', width: `${Math.min((r.done / r.duration) * 100, 100)}%`, background: statusColors[r.status] }} />
                  </div>
                  <div style={{ fontSize: '10px', color: '#8292a5', marginTop: '4px' }}>
                    Выполнено {r.done} из {r.duration} мес. · {Math.round((r.done / r.duration) * 100)}%
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'gask' && (
          <div className="grid-2">
            <div className="card">
              <div className="section-title">Динамика проверок и предписаний</div>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={checksData} barGap={3}>
                  <XAxis dataKey="m" tick={{ fontSize: 10, fill: '#8292a5' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: '#8292a5' }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CT />} />
                  <Bar dataKey="checks" name="Проверок" fill="#155EA4" radius={[3, 3, 0, 0]} />
                  <Bar dataKey="prescriptions" name="Предписаний" fill="#f5365c" radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="card">
              <div className="section-title">Сводка ГАСК</div>
              {[
                { label: 'Проверок (8 мес.)', value: '421', color: '#155EA4' },
                { label: 'Предписаний выдано', value: '110', color: '#d4a000' },
                { label: 'Адм. штрафов (сумма)', value: '38.4 млн тг', color: '#f5365c' },
                { label: 'Незаконных строек', value: '18', color: '#f5365c' },
                { label: 'Охват проверками', value: '62%', color: '#2dce89' },
                { label: 'Лицензий выдано', value: '524', color: '#7b61ff' },
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid rgba(21,94,164,0.1)', fontSize: '12px' }}>
                  <span style={{ color: '#4a5568' }}>{item.label}</span>
                  <span style={{ fontWeight: 600, color: item.color }}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'housing' && (
          <div className="grid-2">
            <div className="card">
              <div className="section-title">Износ жилого фонда по районам (%)</div>
              {housingWear.map((w, i) => (
                <div key={i} style={{ marginBottom: '11px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                    <span style={{ color: '#4a5568' }}>{w.district} <span style={{ color: '#8292a5', fontSize: '10px' }}>({w.total} домов)</span></span>
                    <span style={{ color: w.wear >= 70 ? '#f5365c' : w.wear >= 55 ? '#d4a000' : '#2dce89', fontWeight: 600 }}>{w.wear}%</span>
                  </div>
                  <div className="progress-bar">
                    <div style={{ height: '100%', borderRadius: '4px', width: `${w.wear}%`, background: w.wear >= 70 ? '#f5365c' : w.wear >= 55 ? '#d4a000' : '#2dce89' }} />
                  </div>
                </div>
              ))}
            </div>
            <div className="card">
              <div className="section-title">Жилищные показатели</div>
              {[
                { label: 'Обеспеченность жильём', value: '18.4 м²/чел.', color: '#155EA4' },
                { label: 'Ветхих домов', value: '284 ед.', color: '#f5365c' },
                { label: 'Требуют капремонта', value: '18% фонда', color: '#d4a000' },
                { label: 'Ср. износ фонда', value: '57%', color: '#d4a000' },
                { label: 'Дорог в хор. состоянии', value: '64%', color: '#2dce89' },
                { label: 'Актуальных ГП районов', value: '6/10', color: '#7b61ff' },
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '9px 0', borderBottom: '1px solid rgba(21,94,164,0.1)', fontSize: '12px' }}>
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
