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

const grpData = [
  { y: '2019', grp: 1842, ifo: 103.2 }, { y: '2020', grp: 1780, ifo: 96.6 },
  { y: '2021', grp: 2140, ifo: 106.8 }, { y: '2022', grp: 2480, ifo: 109.4 },
  { y: '2023', grp: 2820, ifo: 107.1 }, { y: '2024e', grp: 3120, ifo: 108.4 },
];

const budgetExpenses = [
  { group: 'Образование', amount: 84.2 }, { group: 'Здравоохранение', amount: 62.8 },
  { group: 'ЖКХ', amount: 48.4 }, { group: 'Транспорт', amount: 38.1 },
  { group: 'АПК', amount: 24.6 }, { group: 'Прочее', amount: 41.9 },
];

const revenueStructure = [
  { name: 'Налоговые доходы', value: 64, color: '#155EA4' },
  { name: 'Трансферты', value: 28, color: '#7b61ff' },
  { name: 'Неналоговые', value: 8, color: '#2dce89' },
];

const investData = [
  { q: 'I кв', invest: 48.2 }, { q: 'II кв', invest: 62.8 },
  { q: 'III кв', invest: 71.4 }, { q: 'IV кв (пл)', invest: 84.0 },
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

export default function EconomyDashboard() {
  const [tab, setTab] = useState('map');

  const ECONOMY_DISTRICTS = DISTRICTS.map((d, i) => ({
    ...d,
    stats: [
      { label: 'ВРП на душу', value: ['2 840', '1 240', '1 840', '1 480', '980', '1 120', '840', '1 380'][i] + ' тыс. тг' },
      { label: 'Инвестиции', value: ['48.2', '8.4', '12.1', '6.8', '4.2', '3.1', '2.4', '7.8'][i] + ' млрд тг' },
      { label: 'Бюджет освоен', value: ['92%', '71%', '84%', '88%', '76%', '81%', '79%', '85%'][i] },
    ],
  }));

  return (
    <div>
      <div className="page-header">
        <h1>Управление экономики и бюджетного планирования</h1>
        <span className="live-dot">Live</span>
      </div>
      <div className="page-body">
        <div className="kpi-grid">
          <KPICard color="blue" label="ВРП (оценка 2024)" value="3 120" unit="млрд тг" trend="+10.7% ИФО" trendDir="up" sub="ВРП/душу: 368 тыс. тг" />
          <KPICard color="green" label="Инвестиции в ОК" value="266.4" unit="млрд тг" trend="+18% к 2023" trendDir="up" sub="14 инвестпроектов" />
          <KPICard color="orange" label="Доля теневой эк." value="18.4" unit="%" trend="−2.1% к 2023" trendDir="up" sub="Расчётная оценка" />
          <KPICard color="yellow" label="Доля МСБ в ВРП" value="28" unit="%" trend="+3% к 2023" trendDir="up" sub="Цель: 35% к 2027" />
          <KPICard color="teal" label="Несырьевой экспорт" value="84.2" unit="млрд тг" trend="+12% к 2023" trendDir="up" sub="Фосфор, аммофос" />
        </div>

        <div className="tab-bar">
          {['map', 'grp', 'budget', 'demography'].map(t => (
            <button key={t} className={`tab-btn ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>
              {t === 'map' ? '🗺 ВРП по районам' : t === 'grp' ? 'Динамика ВРП' : t === 'budget' ? 'Бюджет' : 'Демография'}
            </button>
          ))}
        </div>

        {tab === 'map' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: '16px' }}>
            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
              <div style={{ padding: '12px 16px', borderBottom: '1.5px solid rgba(21,94,164,0.12)' }}>
                <span style={{ fontSize: '13px', fontWeight: 600, color: '#1a1a2e' }}>Карта районов — ВРП на душу населения и инвестиции</span>
              </div>
              <MapWidget districts={ECONOMY_DISTRICTS} legendTitle="ВРП на душу / бюджет"
                legendItems={[
                  { color: '#2dce89', label: 'Высокий ВРП' },
                  { color: '#d4a000', label: 'Средний ВРП' },
                  { color: '#f5365c', label: 'Низкий ВРП' },
                ]} height={420} zoom={8} geoJsonUrl="/data/districts.geojson" />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div className="card" style={{ padding: '14px' }}>
                <div className="section-title">Ключевые макро</div>
                {[
                  { label: 'ВРП (оценка)', value: '3 120 млрд тг', color: '#155EA4' },
                  { label: 'ИФО ВРП', value: '108.4%', color: '#2dce89' },
                  { label: 'Доля в ВВП РК', value: '2.8%', color: '#7b61ff' },
                  { label: 'Рост доходов бюдж.', value: '+14.2%', color: '#2dce89' },
                  { label: 'Транзитные грузы', value: '18.4 млн т', color: '#0fa8c4' },
                ].map((it, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 0', borderBottom: '1px solid rgba(21,94,164,0.1)', fontSize: '12px' }}>
                    <span style={{ color: '#4a5568' }}>{it.label}</span>
                    <span style={{ fontWeight: 600, color: it.color }}>{it.value}</span>
                  </div>
                ))}
              </div>
              <div className="card" style={{ padding: '14px' }}>
                <div className="section-title">Инвестпроекты 2024</div>
                {[
                  { name: 'Фосфорный завод II', invest: '48 млрд тг', status: 'in_progress' },
                  { name: 'Индустр. зона Тараз', invest: '24 млрд тг', status: 'completed' },
                  { name: 'АПК хаб Байзак', invest: '8.4 млрд тг', status: 'in_progress' },
                  { name: 'IT-парк Тараз', invest: '4.2 млрд тг', status: 'planned' },
                ].map((item, i) => (
                  <div key={i} style={{ padding: '6px 0', borderBottom: '1px solid rgba(21,94,164,0.1)' }}>
                    <div style={{ fontSize: '11px', fontWeight: 500, color: '#1a1a2e' }}>{item.name}</div>
                    <div style={{ fontSize: '10px', color: item.status === 'completed' ? '#2dce89' : item.status === 'in_progress' ? '#155EA4' : '#8292a5', marginTop: '2px' }}>
                      {item.invest} · {item.status === 'completed' ? 'Завершён' : item.status === 'in_progress' ? 'В работе' : 'Запланировано'}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {tab === 'grp' && (
          <div className="grid-2">
            <div className="card">
              <div className="section-title">Динамика ВРП (млрд тг)</div>
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={grpData}>
                  <defs>
                    <linearGradient id="gGRP" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#155EA4" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#155EA4" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="y" tick={{ fontSize: 10, fill: '#8292a5' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: '#8292a5' }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CT />} />
                  <Area type="monotone" dataKey="grp" name="ВРП (млрд тг)" stroke="#155EA4" fill="url(#gGRP)" strokeWidth={2} dot={{ fill: '#155EA4', r: 3 }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="card">
              <div className="section-title">Инвестиции в ОК по кварталам (млрд тг)</div>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={investData}>
                  <XAxis dataKey="q" tick={{ fontSize: 10, fill: '#8292a5' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: '#8292a5' }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CT />} />
                  <Bar dataKey="invest" name="Инвестиции (млрд тг)" fill="#2dce89" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {tab === 'budget' && (
          <div className="grid-2">
            <div className="card">
              <div className="section-title">Расходы бюджета по направлениям (млрд тг)</div>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={budgetExpenses} layout="vertical">
                  <XAxis type="number" tick={{ fontSize: 10, fill: '#8292a5' }} axisLine={false} tickLine={false} />
                  <YAxis type="category" dataKey="group" tick={{ fontSize: 11, fill: '#4a5568' }} axisLine={false} tickLine={false} width={100} />
                  <Tooltip content={<CT />} />
                  <Bar dataKey="amount" name="Расходы (млрд тг)" fill="#155EA4" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="card">
              <div className="section-title">Структура доходов бюджета</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <ResponsiveContainer width={140} height={140}>
                  <PieChart>
                    <Pie data={revenueStructure} cx="50%" cy="50%" innerRadius={38} outerRadius={62} dataKey="value" strokeWidth={0}>
                      {revenueStructure.map((e, i) => <Cell key={i} fill={e.color} />)}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div style={{ flex: 1 }}>
                  {revenueStructure.map((it, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: it.color, display: 'inline-block' }} />
                        <span style={{ fontSize: '11px', color: '#4a5568' }}>{it.name}</span>
                      </div>
                      <span style={{ fontSize: '13px', fontWeight: 600, color: it.color }}>{it.value}%</span>
                    </div>
                  ))}
                  <div style={{ borderTop: '1px solid rgba(21,94,164,0.1)', paddingTop: '8px', marginTop: '8px' }}>
                    <div style={{ fontSize: '11px', color: '#4a5568' }}>Коэф. самостоятельности</div>
                    <div style={{ fontSize: '22px', fontWeight: 700, color: '#155EA4' }}>0.64</div>
                    <div style={{ fontSize: '10px', color: '#8292a5' }}>Цель: 0.75 к 2027</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {tab === 'demography' && (
          <div className="grid-3">
            {[
              { label: 'Население области', value: '1 184 тыс.', color: '#155EA4' },
              { label: 'Городское нас.', value: '51%', color: '#7b61ff' },
              { label: 'Сельское нас.', value: '49%', color: '#2dce89' },
              { label: 'Рождаемость', value: '21.4/1000', color: '#2dce89' },
              { label: 'Смертность', value: '7.8/1000', color: '#f5365c' },
              { label: 'Естеств. прирост', value: '13.6/1000', color: '#2dce89' },
              { label: 'Миграц. отток', value: '−2 840 чел.', color: '#d4a000' },
              { label: 'Молодёжь (14–35)', value: '31%', color: '#fb6340' },
              { label: 'Пенсионеры', value: '12.4%', color: '#8292a5' },
            ].map((item, i) => (
              <div key={i} className="card" style={{ textAlign: 'center' }}>
                <div className="kpi-label">{item.label}</div>
                <div style={{ fontSize: '24px', fontWeight: 700, color: item.color, marginTop: '8px' }}>{item.value}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
