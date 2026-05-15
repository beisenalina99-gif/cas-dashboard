import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import MapWidget from './MapWidget';
import { DISTRICTS, PROCUREMENT_MARKERS } from '../data/mapData';

const CT = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: '#fff', border: '1.5px solid rgba(21,94,164,0.2)', borderRadius: '8px', padding: '10px 14px', fontSize: '12px', boxShadow: '0 4px 12px rgba(21,94,164,0.1)' }}>
      <p style={{ color: '#155EA4', marginBottom: '4px', fontWeight: 600 }}>{label}</p>
      {payload.map((p: any, i: number) => <p key={i} style={{ color: p.color }}>{p.name}: <b>{p.value}</b></p>)}
    </div>
  );
};

const procMethods = [
  { name: 'Запрос ценовых предл.', value: 48, color: '#155EA4' },
  { name: 'Тендер', value: 28, color: '#7b61ff' },
  { name: 'Конкурс', value: 14, color: '#2dce89' },
  { name: 'Из одного источника', value: 7, color: '#d4a000' },
  { name: 'Прочее', value: 3, color: '#a0aec0' },
];

const topBuyers = [
  { name: 'Упр. здравоохранения', amount: 4.8 }, { name: 'Упр. образования', amount: 3.9 },
  { name: 'Упр. ЖКХ', amount: 2.8 }, { name: 'Упр. дорог', amount: 2.4 }, { name: 'Акимат г. Тараз', amount: 1.8 },
];

const contracts = [
  { id: 'ГЗ-2024-1842', buyer: 'Упр. здравоохранения', subject: 'Медикаменты', amount: 284.2, status: 'completed', score: 94 },
  { id: 'ГЗ-2024-1841', buyer: 'Упр. образования', subject: 'Учебное оборудование', amount: 148.4, status: 'in_progress', score: 78 },
  { id: 'ГЗ-2024-1839', buyer: 'Упр. ЖКХ', subject: 'Трубы ПВХ', amount: 94.8, status: 'completed', score: 88 },
  { id: 'ГЗ-2024-1837', buyer: 'Упр. дорог', subject: 'Асфальтобетон', amount: 428.6, status: 'in_progress', score: 61 },
  { id: 'ГЗ-2024-1835', buyer: 'Акимат Тараз', subject: 'IT-оборудование', amount: 82.4, status: 'failed', score: 40 },
];

const STATUS_COLOR: Record<string, string> = { completed: '#2dce89', in_progress: '#d4a000', failed: '#f5365c' };
const STATUS_LABEL: Record<string, string> = { completed: 'Исполнен', in_progress: 'В работе', failed: 'Проблемный' };

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

export default function ProcurementDashboard() {
  const [tab, setTab] = useState('map');

  return (
    <div>
      <div className="page-header">
        <h1>Управление государственных закупок — Жамбылская область</h1>
        <span className="live-dot">Live</span>
      </div>
      <div className="page-body">
        <div className="kpi-grid">
          <KPICard color="blue" label="Общий объём закупок" value="24.8" unit="млрд тг" trend="+12% к 2023" trendDir="up" sub="С нач. 2024 года" />
          <KPICard color="green" label="Экономия бюджета" value="1.84" unit="млрд тг" trend="7.4% снижение цены" trendDir="up" sub="Среднее снижение 7.4%" />
          <KPICard color="orange" label="Несостоявшихся" value="12.4" unit="%" trend="−3.2% к 2023" trendDir="up" sub="Из 4 280 процедур" />
          <KPICard color="yellow" label="Отменённых" value="4.8" unit="%" trend="Мониторинг" trendDir="neutral" sub="206 процедур" />
          <KPICard color="red" label="Проблемных контрактов" value="28" unit="ед." trend="Требуют внимания" trendDir="down" sub="Инд. отв-ти: 61" />
        </div>

        <div className="tab-bar">
          {['map', 'overview', 'top', 'contracts'].map(t => (
            <button key={t} className={`tab-btn ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>
              {t === 'map' ? '🗺 Карта отделов' : t === 'overview' ? 'Обзор' : t === 'top' ? 'ТОП заказчиков' : 'Реестр'}
            </button>
          ))}
        </div>

        {tab === 'map' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: '16px' }}>
            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
              <div style={{ padding: '12px 16px', borderBottom: '1.5px solid rgba(21,94,164,0.12)' }}>
                <span style={{ fontSize: '13px', fontWeight: 600, color: '#1a1a2e' }}>Карта отделов госзакупок по районам — объёмы и нарушения</span>
              </div>
              <MapWidget
                districts={DISTRICTS}
                markers={PROCUREMENT_MARKERS}
                legendTitle="Отделы госзакупок"
                legendItems={[
                  { color: '#7b61ff', label: 'Отделы госзакупок' },
                  { color: '#2dce89', label: 'Норма' },
                  { color: '#d4a000', label: 'Внимание (нарушения)' },
                  { color: '#f5365c', label: 'Критично' },
                ]}
                height={420}
                zoom={8} geoJsonUrl="/data/districts.geojson"
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div className="card" style={{ padding: '14px' }}>
                <div className="section-title">Статус по районам</div>
                {[
                  { name: 'г. Тараз', volume: '8.4 млрд тг', status: 'ok', violations: 2 },
                  { name: 'Байзакский', volume: '1.2 млрд тг', status: 'warning', violations: 4 },
                  { name: 'Жамбылский', volume: '0.48 млрд тг', status: 'ok', violations: 0 },
                  { name: 'Меркенский', volume: '0.62 млрд тг', status: 'ok', violations: 1 },
                  { name: 'Жуалынский', volume: '0.32 млрд тг', status: 'critical', violations: 6 },
                ].map((item, i) => (
                  <div key={i} style={{ padding: '7px 0', borderBottom: '1px solid rgba(21,94,164,0.1)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px' }}>
                      <span style={{ color: '#1a1a2e', fontWeight: 500 }}>{item.name}</span>
                      <span style={{ color: item.status === 'ok' ? '#2dce89' : item.status === 'warning' ? '#d4a000' : '#f5365c', fontSize: '10px' }}>
                        {item.violations > 0 ? `${item.violations} нарушений` : '● Норма'}
                      </span>
                    </div>
                    <div style={{ color: '#8292a5', fontSize: '10px', marginTop: '1px' }}>{item.volume}</div>
                  </div>
                ))}
              </div>
              <div className="card" style={{ padding: '14px' }}>
                <div className="section-title">ИИ-мониторинг</div>
                <div className="alert-item critical">
                  <div className="alert-dot critical" />
                  <div><div style={{ color: '#1a1a2e', fontWeight: 500, fontSize: '11px' }}>Жуалынский: 28% несостоявш.</div><div style={{ color: '#8292a5', fontSize: '10px' }}>Превышение нормы в 2.5 раза</div></div>
                </div>
                <div className="alert-item warning">
                  <div className="alert-dot warning" />
                  <div><div style={{ color: '#1a1a2e', fontWeight: 500, fontSize: '11px' }}>ГЗ-2024-1837: низкий индекс</div><div style={{ color: '#8292a5', fontSize: '10px' }}>Инд. ответственности: 61/100</div></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {tab === 'overview' && (
          <div className="grid-2">
            <div className="card">
              <div className="section-title">Способы закупок (%)</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <ResponsiveContainer width={160} height={160}>
                  <PieChart>
                    <Pie data={procMethods} cx="50%" cy="50%" innerRadius={44} outerRadius={72} dataKey="value" strokeWidth={0}>
                      {procMethods.map((e, i) => <Cell key={i} fill={e.color} />)}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div style={{ flex: 1 }}>
                  {procMethods.map((it, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '7px' }}>
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
              <div className="section-title">Сводные показатели</div>
              {[
                { label: 'Состоявшихся процедур', value: '3 751', color: '#2dce89' },
                { label: 'Несостоявшихся', value: '529', color: '#f5365c' },
                { label: 'Отменённых', value: '206', color: '#d4a000' },
                { label: 'Выделено бюджета', value: '26.4 млрд тг', color: '#7b61ff' },
                { label: 'Потрачено', value: '24.8 млрд тг', color: '#0fa8c4' },
                { label: 'Экономия', value: '1.84 млрд тг', color: '#2dce89' },
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 0', borderBottom: '1px solid rgba(21,94,164,0.1)', fontSize: '12px' }}>
                  <span style={{ color: '#4a5568' }}>{item.label}</span>
                  <span style={{ fontWeight: 600, color: item.color }}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'top' && (
          <div className="card">
            <div className="section-title">ТОП-5 заказчиков по объёму (млрд тг)</div>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={topBuyers} layout="vertical">
                <XAxis type="number" tick={{ fontSize: 10, fill: '#8292a5' }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 10, fill: '#4a5568' }} axisLine={false} tickLine={false} width={160} />
                <Tooltip content={<CT />} />
                <Bar dataKey="amount" name="Объём (млрд тг)" fill="#155EA4" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {tab === 'contracts' && (
          <div className="card">
            <div className="section-title">Реестр контрактов (последние)</div>
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Номер</th><th>Заказчик</th><th>Предмет</th>
                    <th style={{ textAlign: 'right' }}>Сумма (млн тг)</th>
                    <th style={{ textAlign: 'center' }}>Инд. ответств.</th>
                    <th>Статус</th>
                  </tr>
                </thead>
                <tbody>
                  {contracts.map((c, i) => (
                    <tr key={i}>
                      <td style={{ fontSize: '11px', color: '#8292a5', fontFamily: 'monospace' }}>{c.id}</td>
                      <td style={{ fontSize: '12px' }}>{c.buyer}</td>
                      <td style={{ fontSize: '12px' }}>{c.subject}</td>
                      <td style={{ textAlign: 'right', fontWeight: 600 }}>{c.amount.toFixed(1)}</td>
                      <td style={{ textAlign: 'center' }}>
                        <span style={{ fontWeight: 700, fontSize: '13px', color: c.score >= 80 ? '#2dce89' : c.score >= 60 ? '#d4a000' : '#f5365c' }}>{c.score}</span>
                      </td>
                      <td>
                        <span style={{ fontSize: '11px', fontWeight: 500, color: STATUS_COLOR[c.status], background: `${STATUS_COLOR[c.status]}20`, padding: '3px 10px', borderRadius: '20px' }}>
                          {STATUS_LABEL[c.status]}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
