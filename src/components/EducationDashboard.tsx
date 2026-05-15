import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import MapWidget from './MapWidget';
import { DISTRICTS, EDUCATION_MARKERS } from '../data/mapData';

const CT = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: '#fff', border: '1.5px solid rgba(21,94,164,0.2)', borderRadius: '8px', padding: '10px 14px', fontSize: '12px', boxShadow: '0 4px 12px rgba(21,94,164,0.1)' }}>
      <p style={{ color: '#155EA4', marginBottom: '4px', fontWeight: 600 }}>{label}</p>
      {payload.map((p: any, i: number) => (
        <p key={i} style={{ color: p.color }}>{p.name}: <b>{p.value}</b></p>
      ))}
    </div>
  );
};

const queueData = [
  { district: 'г. Тараз', queue: 2840 }, { district: 'Байзак.', queue: 480 },
  { district: 'Жамбыл.', queue: 320 }, { district: 'Мерк.', queue: 240 },
  { district: 'Жуалын.', queue: 380 }, { district: 'Сарысу.', queue: 120 },
];

const schoolsData = [
  { district: 'г. Тараз', total: 84, threeshifts: 3, emergency: 1, load: 98 },
  { district: 'Байзакский', total: 42, threeshifts: 2, emergency: 2, load: 112 },
  { district: 'Жамбылский', total: 38, threeshifts: 1, emergency: 0, load: 88 },
  { district: 'Меркенский', total: 31, threeshifts: 0, emergency: 1, load: 92 },
  { district: 'Жуалынский', total: 28, threeshifts: 1, emergency: 2, load: 104 },
  { district: 'Сарысуский', total: 22, threeshifts: 0, emergency: 0, load: 78 },
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

export default function EducationDashboard() {
  const [tab, setTab] = useState('map');

  return (
    <div>
      <div className="page-header">
        <h1>Управление образования — Жамбылская область</h1>
        <span className="live-dot">Live</span>
      </div>
      <div className="page-body">
        <div className="kpi-grid">
          <KPICard color="yellow" label="Всего школ" value="245" unit="ед." trend="+3 новых в 2024" trendDir="up" sub="Учащихся: 218 400" />
          <KPICard color="blue" label="Детских садов" value="312" unit="ед." trend="+18 за год" trendDir="up" sub="Охват: 84%" />
          <KPICard color="orange" label="Очередь в садики" value="4 380" unit="чел." trend="−12% к 2023" trendDir="up" sub="Ваучеров: 2 140" />
          <KPICard color="green" label="Охват дошк. образованием" value="84" unit="%" trend="+8% к 2023" trendDir="up" sub="Цель: 100% к 2027" />
          <KPICard color="red" label="Трёхсменных школ" value="7" unit="ед." trend="−2 к 2023" trendDir="up" sub="Требуют приоритета" />
        </div>

        <div className="tab-bar">
          {['map', 'schools', 'preschool'].map(t => (
            <button key={t} className={`tab-btn ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>
              {t === 'map' ? '🗺 Карта объектов' : t === 'schools' ? 'Школы' : 'Дошкольное'}
            </button>
          ))}
        </div>

        {tab === 'map' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: '16px' }}>
            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
              <div style={{ padding: '12px 16px', borderBottom: '1.5px solid rgba(21,94,164,0.12)' }}>
                <span style={{ fontSize: '13px', fontWeight: 600, color: '#1a1a2e' }}>Карта образовательных объектов</span>
                <span style={{ fontSize: '11px', color: '#8292a5', marginLeft: '8px' }}>Школы, детсады, колледжи — нажмите для KPI</span>
              </div>
              <MapWidget
                districts={DISTRICTS}
                markers={EDUCATION_MARKERS}
                legendTitle="Загрузка учебных заведений"
                legendItems={[
                  { color: '#d4a000', label: 'Школы' },
                  { color: '#d4a000', label: 'Детские сады' },
                  { color: '#d4a000', label: 'Колледжи' },
                ]}
                height={420}
                zoom={8} geoJsonUrl="/data/districts.geojson"
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div className="card" style={{ padding: '14px' }}>
                <div className="section-title">Легенда</div>
                {[
                  { c: '#d4a000', l: 'Школы' },
                  { c: '#d4a000', l: 'Детские сады' },
                  { c: '#d4a000', l: 'Колледжи' },
                ].map((it, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: it.c, display: 'inline-block' }} />
                    <span style={{ fontSize: '12px', color: '#4a5568' }}>{it.l}</span>
                  </div>
                ))}
              </div>
              <div className="card" style={{ padding: '14px' }}>
                <div className="section-title">ИИ-приоритеты строительства</div>
                {[
                  { name: 'СОШ №12 Тараз', issue: '3-сменная, загрузка 128%', color: '#f5365c' },
                  { name: 'СОШ №3 Байзакский', issue: 'Аварийное, 3 смены', color: '#f5365c' },
                  { name: 'СОШ №2 Жуалынский', issue: 'Аварийное состояние', color: '#f5365c' },
                  { name: 'ДС Байзакский №2', issue: 'Очередь 210 детей', color: '#d4a000' },
                  { name: 'ДС №11 Тараз', issue: 'Загрузка 112%', color: '#d4a000' },
                ].map((item, i) => (
                  <div key={i} style={{ padding: '7px 0', borderBottom: '1px solid rgba(21,94,164,0.1)' }}>
                    <div style={{ fontSize: '11px', fontWeight: 500, color: '#1a1a2e' }}>{item.name}</div>
                    <div style={{ fontSize: '10px', color: item.color, marginTop: '2px' }}>{item.issue}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {tab === 'schools' && (
          <>
            <div className="card mb-16">
              <div className="section-title">Рейтинг школ по загрузке</div>
              <div className="table-wrapper">
                <table>
                  <thead>
                    <tr>
                      <th>Район</th>
                      <th style={{ textAlign: 'center' }}>Всего</th>
                      <th style={{ textAlign: 'center' }}>3-сменных</th>
                      <th style={{ textAlign: 'center' }}>Аварийных</th>
                      <th style={{ textAlign: 'center' }}>Загрузка</th>
                      <th>Статус</th>
                    </tr>
                  </thead>
                  <tbody>
                    {schoolsData.map((s, i) => (
                      <tr key={i}>
                        <td style={{ fontWeight: 500 }}>{s.district}</td>
                        <td style={{ textAlign: 'center' }}>{s.total}</td>
                        <td style={{ textAlign: 'center', color: s.threeshifts > 0 ? '#f5365c' : '#2dce89', fontWeight: 600 }}>{s.threeshifts}</td>
                        <td style={{ textAlign: 'center', color: s.emergency > 0 ? '#f5365c' : '#2dce89', fontWeight: 600 }}>{s.emergency}</td>
                        <td style={{ textAlign: 'center' }}>
                          <span style={{ color: s.load > 100 ? '#f5365c' : s.load > 90 ? '#d4a000' : '#2dce89', fontWeight: 600 }}>{s.load}%</span>
                        </td>
                        <td>
                          <span className={`traffic-light ${s.load > 100 || s.threeshifts > 1 ? 'red' : s.load > 90 || s.threeshifts > 0 ? 'yellow' : 'green'}`}>
                            {s.load > 100 || s.threeshifts > 1 ? '● Критично' : s.load > 90 ? '● Внимание' : '● Норма'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="card">
              <div className="section-title">Индекс загрузки по районам (%)</div>
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={schoolsData}>
                  <XAxis dataKey="district" tick={{ fontSize: 9, fill: '#8292a5' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: '#8292a5' }} axisLine={false} tickLine={false} domain={[0, 130]} />
                  <Tooltip content={<CT />} />
                  <Bar dataKey="load" name="Загрузка %" fill="#d4a000" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </>
        )}

        {tab === 'preschool' && (
          <div className="grid-2">
            <div className="card">
              <div className="section-title">Очередь в детсады по районам</div>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={queueData} layout="vertical">
                  <XAxis type="number" tick={{ fontSize: 10, fill: '#8292a5' }} axisLine={false} tickLine={false} />
                  <YAxis type="category" dataKey="district" tick={{ fontSize: 11, fill: '#4a5568' }} axisLine={false} tickLine={false} width={70} />
                  <Tooltip content={<CT />} />
                  <Bar dataKey="queue" name="Очередь" fill="#d4a000" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="card">
              <div className="section-title">Показатели дошкольного образования</div>
              {[
                { label: 'Всего детсадов', value: '312 ед.', color: '#d4a000' },
                { label: 'Гос.', value: '184 ед.', color: '#155EA4' },
                { label: 'Частных', value: '128 ед.', color: '#7b61ff' },
                { label: 'Детей в садиках', value: '42 840 чел.', color: '#2dce89' },
                { label: 'В очереди', value: '4 380 чел.', color: '#f5365c' },
                { label: 'Ваучеров выдано', value: '2 140 ед.', color: '#0fa8c4' },
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 0', borderBottom: '1px solid rgba(21,94,164,0.1)', fontSize: '12px' }}>
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
