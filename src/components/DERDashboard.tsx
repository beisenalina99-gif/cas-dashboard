import React, { useState } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import MapWidget from './MapWidget';
import { DISTRICTS, HEAT_DER } from '../data/mapData';

const CT = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: '#fff', border: '1.5px solid rgba(21,94,164,0.2)', borderRadius: '8px', padding: '10px 14px', fontSize: '12px', boxShadow: '0 4px 12px rgba(21,94,164,0.1)' }}>
      <p style={{ color: '#155EA4', marginBottom: '4px', fontWeight: 600 }}>{label}</p>
      {payload.map((p: any, i: number) => <p key={i} style={{ color: p.color }}>{p.name}: <b>{p.value}</b></p>)}
    </div>
  );
};

const caseDynamics = [
  { m: 'Янв', registered: 18, solved: 14 }, { m: 'Фев', registered: 14, solved: 12 },
  { m: 'Мар', registered: 22, solved: 16 }, { m: 'Апр', registered: 19, solved: 15 },
  { m: 'Май', registered: 24, solved: 18 }, { m: 'Июн', registered: 21, solved: 17 },
  { m: 'Июл', registered: 26, solved: 20 }, { m: 'Авг', registered: 23, solved: 19 },
];

const crimeCategories = [
  { name: 'Уклонение от налогов', value: 28, color: '#155EA4' },
  { name: 'Мошенничество', value: 22, color: '#f5365c' },
  { name: 'Незак. предпринимат.', value: 18, color: '#d4a000' },
  { name: 'Контрабанда', value: 14, color: '#7b61ff' },
  { name: 'Фин. пирамиды', value: 8, color: '#fb6340' },
  { name: 'Прочее', value: 10, color: '#a0aec0' },
];

const damageData = [
  { q: 'I кв', damage: 284, reimbursed: 218 }, { q: 'II кв', damage: 348, reimbursed: 284 },
  { q: 'III кв', damage: 412, reimbursed: 340 }, { q: 'IV кв (пл)', damage: 380, reimbursed: 320 },
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

export default function DERDashboard() {
  const [tab, setTab] = useState('map');

  const DER_DISTRICTS = DISTRICTS.map((d, i) => ({
    ...d,
    stats: [
      { label: 'Дел возбуждено', value: ['48', '12', '8', '14', '24', '6', '4', '18'][i] },
      { label: 'Раскрываемость', value: ['78%', '72%', '84%', '76%', '68%', '88%', '82%', '74%'][i] },
      { label: 'Ущерб выявлен', value: ['184', '28', '18', '42', '86', '12', '8', '64'][i] + ' млн тг' },
    ],
  }));

  return (
    <div>
      <div className="page-header">
        <h1>Департамент экономических расследований (ДЭР)</h1>
        <span className="live-dot">Live</span>
      </div>
      <div className="page-body">
        <div className="kpi-grid">
          <KPICard color="red" label="Возбуждено дел" value="167" unit="ед." trend="+8% к 2023" trendDir="down" sub="8 мес. 2024" />
          <KPICard color="orange" label="Раскрываемость" value="76" unit="%" trend="+4% к 2023" trendDir="up" sub="Закончено произв.: 127" />
          <KPICard color="yellow" label="Выявленный ущерб" value="1 444" unit="млн тг" trend="Всего за 8 мес." trendDir="down" sub="Возмещено: 1 162 млн тг (80%)" />
          <KPICard color="blue" label="Нарушений в ГЗ" value="42" unit="ед." trend="Совм. с госзакупками" trendDir="down" sub="Сумма: 284 млн тг" />
          <KPICard color="teal" label="Проф. мероприятий" value="184" unit="ед." trend="Охват: 28 400 чел." trendDir="up" sub="Информматериалов: 312" />
        </div>

        <div className="tab-bar">
          {['map', 'dynamics', 'categories', 'damage'].map(t => (
            <button key={t} className={`tab-btn ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>
              {t === 'map' ? '🗺 Тепловая карта' : t === 'dynamics' ? 'Динамика дел' : t === 'categories' ? 'Виды преступлений' : 'Ущерб и возмещение'}
            </button>
          ))}
        </div>

        {tab === 'map' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: '16px' }}>
            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
              <div style={{ padding: '12px 16px', borderBottom: '1.5px solid rgba(21,94,164,0.12)' }}>
                <span style={{ fontSize: '13px', fontWeight: 600, color: '#1a1a2e' }}>Тепловая карта экономических правонарушений по районам</span>
                <span style={{ fontSize: '11px', color: '#8292a5', marginLeft: '8px' }}>Клик по району — детализация</span>
              </div>
              <MapWidget districts={DER_DISTRICTS} heatmap={HEAT_DER} legendTitle="Уровень экон. преступности"
                legendItems={[
                  { color: '#2dce89', label: 'Низкий' },
                  { color: '#d4a000', label: 'Средний' },
                  { color: '#f5365c', label: 'Высокий' },
                ]} height={420} zoom={8} geoJsonUrl="/data/districts.geojson" />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div className="card" style={{ padding: '14px' }}>
                <div className="section-title">Приоритетные районы</div>
                {[
                  { name: 'г. Тараз', cases: 48, damage: '184 млн тг', color: '#f5365c' },
                  { name: 'Жуалынский р-н', cases: 24, damage: '86 млн тг', color: '#f5365c' },
                  { name: 'Байзакский р-н', cases: 12, damage: '28 млн тг', color: '#d4a000' },
                  { name: 'Меркенский р-н', cases: 14, damage: '42 млн тг', color: '#d4a000' },
                ].map((item, i) => (
                  <div key={i} style={{ padding: '7px 0', borderBottom: '1px solid rgba(21,94,164,0.1)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px' }}>
                      <span style={{ color: '#1a1a2e', fontWeight: 500 }}>{item.name}</span>
                      <span style={{ color: item.color, fontWeight: 600 }}>{item.cases} дел</span>
                    </div>
                    <div style={{ color: '#8292a5', fontSize: '10px', marginTop: '1px' }}>Ущерб: {item.damage}</div>
                  </div>
                ))}
              </div>
              <div className="card" style={{ padding: '14px' }}>
                <div className="section-title">Индекс экон. безопасности</div>
                <div style={{ textAlign: 'center', padding: '8px 0' }}>
                  <div style={{ fontSize: '42px', fontWeight: 700, color: '#2dce89' }}>68</div>
                  <div style={{ fontSize: '12px', color: '#4a5568' }}>из 100</div>
                  <div className="progress-bar" style={{ marginTop: '8px' }}>
                    <div style={{ height: '100%', borderRadius: '4px', width: '68%', background: '#2dce89' }} />
                  </div>
                  <div style={{ fontSize: '10px', color: '#8292a5', marginTop: '4px' }}>Раскрываем. + возмещение + профил.</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {tab === 'dynamics' && (
          <div className="grid-2">
            <div className="card">
              <div className="section-title">Динамика возбуждённых и раскрытых дел</div>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={caseDynamics}>
                  <XAxis dataKey="m" tick={{ fontSize: 10, fill: '#8292a5' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: '#8292a5' }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CT />} />
                  <Line type="monotone" dataKey="registered" name="Возбуждено" stroke="#f5365c" strokeWidth={2} dot={{ fill: '#f5365c', r: 3 }} />
                  <Line type="monotone" dataKey="solved" name="Раскрыто" stroke="#2dce89" strokeWidth={2} dot={{ fill: '#2dce89', r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="card">
              <div className="section-title">Показатели раследования</div>
              {[
                { label: 'Дел возбуждено (8 мес.)', value: '167', color: '#f5365c' },
                { label: 'Закончено произв.', value: '127 (76%)', color: '#2dce89' },
                { label: 'В производстве', value: '40', color: '#d4a000' },
                { label: 'Привлечено к ответств.', value: '98 лиц', color: '#155EA4' },
                { label: 'Проф. мероприятий', value: '184 ед.', color: '#7b61ff' },
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid rgba(21,94,164,0.1)', fontSize: '12px' }}>
                  <span style={{ color: '#4a5568' }}>{item.label}</span>
                  <span style={{ fontWeight: 600, color: item.color }}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'categories' && (
          <div className="grid-2">
            <div className="card">
              <div className="section-title">Структура экономических преступлений (%)</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <ResponsiveContainer width={160} height={180}>
                  <PieChart>
                    <Pie data={crimeCategories} cx="50%" cy="50%" innerRadius={44} outerRadius={72} dataKey="value" strokeWidth={0}>
                      {crimeCategories.map((e, i) => <Cell key={i} fill={e.color} />)}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div style={{ flex: 1 }}>
                  {crimeCategories.map((it, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '7px' }}>
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
            <div className="card">
              <div className="section-title">Факты нарушений</div>
              {[
                { label: 'Незак. оборот нефтепродуктов', value: '12 фактов', color: '#d4a000' },
                { label: 'Незак. оборот алкоголя', value: '8 фактов', color: '#d4a000' },
                { label: 'Финансовые пирамиды', value: '3 факта', color: '#f5365c' },
                { label: 'Фальшивомонетничество', value: '2 факта', color: '#f5365c' },
                { label: 'Экон. контрабанда', value: '18 фактов', color: '#7b61ff' },
                { label: 'Нарушений в госзакупках', value: '42 факта', color: '#155EA4' },
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid rgba(21,94,164,0.1)', fontSize: '12px' }}>
                  <span style={{ color: '#4a5568' }}>{item.label}</span>
                  <span style={{ fontWeight: 600, color: item.color }}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'damage' && (
          <div className="grid-2">
            <div className="card">
              <div className="section-title">Ущерб и возмещение по кварталам (млн тг)</div>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={damageData} barGap={4}>
                  <XAxis dataKey="q" tick={{ fontSize: 10, fill: '#8292a5' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: '#8292a5' }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CT />} />
                  <Bar dataKey="damage" name="Ущерб (млн тг)" fill="#f5365c" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="reimbursed" name="Возмещено (млн тг)" fill="#2dce89" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="card">
              <div className="section-title">Сводка ущерба</div>
              {[
                { label: 'Выявлено ущерба (8 мес.)', value: '1 444 млн тг', color: '#f5365c' },
                { label: 'Возмещено', value: '1 162 млн тг', color: '#2dce89' },
                { label: '% возмещения', value: '80%', color: '#2dce89' },
                { label: 'Не возмещено', value: '282 млн тг', color: '#d4a000' },
                { label: 'Уровень латентности (расч.)', value: '~2.8x', color: '#f5365c' },
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
