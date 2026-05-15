import React, { useState } from 'react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
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

const budgetDynamics = [
  { m: 'Янв', income: 28.4, expense: 24.2 }, { m: 'Фев', income: 24.8, expense: 22.4 },
  { m: 'Мар', income: 34.2, expense: 30.8 }, { m: 'Апр', income: 31.6, expense: 28.4 },
  { m: 'Май', income: 36.8, expense: 33.2 }, { m: 'Июн', income: 38.4, expense: 35.6 },
  { m: 'Июл', income: 42.1, expense: 38.4 }, { m: 'Авг', income: 44.8, expense: 40.2 },
];

const expenseGroups = [
  { group: 'Образование', plan: 84.2, fact: 77.4 },
  { group: 'Здравоохранение', plan: 62.8, fact: 58.2 },
  { group: 'ЖКХ', plan: 48.4, fact: 36.8 },
  { group: 'Транспорт', plan: 38.1, fact: 36.2 },
  { group: 'АПК', plan: 24.6, fact: 20.6 },
];

const revenueStructure = [
  { name: 'Налоговые', value: 64, color: '#155EA4' },
  { name: 'Трансферты', value: 28, color: '#7b61ff' },
  { name: 'Неналоговые', value: 8, color: '#2dce89' },
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

export default function FinanceDashboard() {
  const [tab, setTab] = useState('map');

  const FINANCE_DISTRICTS = DISTRICTS.map((d, i) => ({
    ...d,
    stats: [
      { label: 'Бюджет освоен', value: ['92%', '71%', '84%', '88%', '76%', '81%', '79%', '85%'][i] || '80%' },
      { label: 'Собств. доходы', value: (['48.2', '8.4', '12.1', '6.8', '4.2', '3.1', '2.4', '7.8'][i] || '5.0') + ' млрд тг' },
      { label: 'Нарушений', value: (['2', '6', '1', '3', '8', '2', '4', '3'][i] || '2') + ' ед.' },
    ],
  }));

  return (
    <div>
      <div className="page-header">
        <h1>Управление финансов — Жамбылская область</h1>
        <span className="live-dot">Live</span>
      </div>
      <div className="page-body">
        <div className="kpi-grid">
          <KPICard color="blue" label="Исполнение бюджета" value="87.4" unit="%" trend="+3.2% к 2023" trendDir="up" sub="Факт: 281 млрд тг" />
          <KPICard color="green" label="Собственные доходы" value="184.2" unit="млрд тг" trend="+14.2% к 2023" trendDir="up" sub="Налоговые: 158.4 млрд" />
          <KPICard color="red" label="Финансовых нарушений" value="29" unit="случаев" trend="Сумма: 2.4 млрд тг" trendDir="down" sub="Возмещено: 1.8 млрд" />
          <KPICard color="orange" label="Дебиторская задолж." value="18.4" unit="млрд тг" trend="+2.1% к 2023" trendDir="down" sub="Требует мониторинга" />
          <KPICard color="teal" label="Коэф. самостоятельности" value="0.64" unit="" trend="Цель: 0.75 к 2027" trendDir="neutral" sub="Собств. доходы / расходы" />
        </div>

        <div className="tab-bar">
          {['map', 'dynamics', 'expenses', 'violations'].map(t => (
            <button key={t} className={`tab-btn ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>
              {t === 'map' ? '🗺 Карта по районам' : t === 'dynamics' ? 'Доходы / расходы' : t === 'expenses' ? 'Расходы' : 'Нарушения'}
            </button>
          ))}
        </div>

        {tab === 'map' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: '16px' }}>
            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
              <div style={{ padding: '12px 16px', borderBottom: '1.5px solid rgba(21,94,164,0.12)' }}>
                <span style={{ fontSize: '13px', fontWeight: 600, color: '#1a1a2e' }}>Финансовая самостоятельность районов — исполнение бюджета</span>
              </div>
              <MapWidget districts={FINANCE_DISTRICTS} legendTitle="Исполнение бюджета"
                legendItems={[
                  { color: '#2dce89', label: '> 90% освоено' },
                  { color: '#d4a000', label: '70–90% освоено' },
                  { color: '#f5365c', label: '< 70% освоено' },
                ]} height={420} zoom={8} geoJsonUrl="/data/districts.geojson" />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div className="card" style={{ padding: '14px' }}>
                <div className="section-title">Ключевые показатели</div>
                {[
                  { label: 'Доходов план', value: '322 млрд тг', color: '#155EA4' },
                  { label: 'Доходов факт', value: '281 млрд тг', color: '#2dce89' },
                  { label: 'Расходов план', value: '340 млрд тг', color: '#7b61ff' },
                  { label: 'Расходов факт', value: '297 млрд тг', color: '#2dce89' },
                  { label: 'Трансферты', value: '96.8 млрд тг', color: '#d4a000' },
                ].map((it, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 0', borderBottom: '1px solid rgba(21,94,164,0.1)', fontSize: '12px' }}>
                    <span style={{ color: '#4a5568' }}>{it.label}</span>
                    <span style={{ fontWeight: 600, color: it.color }}>{it.value}</span>
                  </div>
                ))}
              </div>
              <div className="card" style={{ padding: '14px' }}>
                <div className="section-title">Индекс качества управления</div>
                <div style={{ textAlign: 'center', padding: '6px 0' }}>
                  <div style={{ fontSize: '42px', fontWeight: 700, color: '#2dce89' }}>78</div>
                  <div style={{ fontSize: '12px', color: '#4a5568' }}>из 100 (хороший)</div>
                  <div className="progress-bar" style={{ marginTop: '8px' }}>
                    <div style={{ height: '100%', borderRadius: '4px', width: '78%', background: '#2dce89' }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {tab === 'dynamics' && (
          <div className="grid-2">
            <div className="card">
              <div className="section-title">Динамика доходов и расходов (млрд тг)</div>
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={budgetDynamics}>
                  <defs>
                    <linearGradient id="gInc" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2dce89" stopOpacity={0.2} /><stop offset="95%" stopColor="#2dce89" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="gExp" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#155EA4" stopOpacity={0.2} /><stop offset="95%" stopColor="#155EA4" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="m" tick={{ fontSize: 10, fill: '#8292a5' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: '#8292a5' }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CT />} />
                  <Area type="monotone" dataKey="income" name="Доходы" stroke="#2dce89" fill="url(#gInc)" strokeWidth={2} dot={false} />
                  <Area type="monotone" dataKey="expense" name="Расходы" stroke="#155EA4" fill="url(#gExp)" strokeWidth={2} dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="card">
              <div className="section-title">Структура доходов</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <ResponsiveContainer width={130} height={130}>
                  <PieChart>
                    <Pie data={revenueStructure} cx="50%" cy="50%" innerRadius={36} outerRadius={58} dataKey="value" strokeWidth={0}>
                      {revenueStructure.map((e, i) => <Cell key={i} fill={e.color} />)}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div style={{ flex: 1 }}>
                  {revenueStructure.map((it, i) => (
                    <div key={i} style={{ marginBottom: '10px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: it.color, display: 'inline-block' }} />
                          <span style={{ color: '#4a5568' }}>{it.name}</span>
                        </div>
                        <span style={{ fontWeight: 600, color: it.color }}>{it.value}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {tab === 'expenses' && (
          <div className="card">
            <div className="section-title">Расходы по функциональным группам — план vs факт (млрд тг)</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '12px' }}>
              {expenseGroups.map((e, i) => {
                const pct = (e.fact / e.plan) * 100;
                return (
                  <div key={i}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '5px' }}>
                      <span style={{ color: '#4a5568', fontWeight: 500 }}>{e.group}</span>
                      <div style={{ display: 'flex', gap: '12px' }}>
                        <span style={{ color: '#8292a5' }}>план: {e.plan}</span>
                        <span style={{ color: pct >= 90 ? '#2dce89' : pct >= 75 ? '#d4a000' : '#f5365c', fontWeight: 600 }}>
                          факт: {e.fact} ({pct.toFixed(0)}%)
                        </span>
                      </div>
                    </div>
                    <div className="progress-bar">
                      <div style={{ height: '100%', borderRadius: '4px', width: `${pct}%`, background: pct >= 90 ? '#2dce89' : pct >= 75 ? '#d4a000' : '#f5365c' }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {tab === 'violations' && (
          <div className="grid-2">
            <div className="card">
              <div className="section-title">Финансовые нарушения</div>
              {[
                { label: 'Всего нарушений', value: '29 случаев', color: '#f5365c' },
                { label: 'Сумма ущерба', value: '2.4 млрд тг', color: '#f5365c' },
                { label: 'Возмещено', value: '1.8 млрд тг (75%)', color: '#2dce89' },
                { label: 'Дебиторская задолж.', value: '18.4 млрд тг', color: '#d4a000' },
                { label: 'Кредиторская задолж.', value: '4.2 млрд тг', color: '#d4a000' },
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '9px 0', borderBottom: '1px solid rgba(21,94,164,0.1)', fontSize: '12px' }}>
                  <span style={{ color: '#4a5568' }}>{item.label}</span>
                  <span style={{ fontWeight: 600, color: item.color }}>{item.value}</span>
                </div>
              ))}
            </div>
            <div className="card">
              <div className="section-title">ИИ-инсайты</div>
              <div className="alert-item critical">
                <div className="alert-dot critical" />
                <div><div style={{ color: '#1a1a2e', fontWeight: 500 }}>Жуалынский р-н: освоение 76% при норме 85%</div><div style={{ color: '#8292a5', fontSize: '10px' }}>Риск неосвоения к концу года</div></div>
              </div>
              <div className="alert-item warning">
                <div className="alert-dot warning" />
                <div><div style={{ color: '#1a1a2e', fontWeight: 500 }}>ЖКХ: расход 76% при плане 85%</div><div style={{ color: '#8292a5', fontSize: '10px' }}>Потребуется ускорение в IV кв.</div></div>
              </div>
              <div className="alert-item info">
                <div className="alert-dot info" />
                <div><div style={{ color: '#1a1a2e', fontWeight: 500 }}>Налоговые поступления +14.2%</div><div style={{ color: '#8292a5', fontSize: '10px' }}>Превышение плана на 8.4 млрд тг</div></div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
