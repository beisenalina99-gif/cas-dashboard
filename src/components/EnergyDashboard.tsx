import React, { useState } from 'react';
import MapWidget from './MapWidget';
import { DISTRICTS, ENERGY_MARKERS, ENERGY_PATHS } from '../data/mapData';
import ChartSwitcher from './ChartSwitcher';

const energyBalance = [
  { m: 'Янв', produced: 4.2, consumed: 3.8 }, { m: 'Фев', produced: 3.9, consumed: 3.6 },
  { m: 'Мар', produced: 4.5, consumed: 4.0 }, { m: 'Апр', produced: 4.8, consumed: 4.1 },
  { m: 'Май', produced: 5.1, consumed: 4.3 }, { m: 'Июн', produced: 5.4, consumed: 4.6 },
  { m: 'Июл', produced: 5.8, consumed: 4.9 }, { m: 'Авг', produced: 5.6, consumed: 4.7 },
];

const vieData = [
  { name: 'Солнечная', value: 42, color: '#d4a000' },
  { name: 'Ветровая', value: 35, color: '#155EA4' },
  { name: 'Гидро', value: 23, color: '#0fa8c4' },
];

const wearIndex = [
  { system: 'Теплосети', wear: 68 }, { system: 'Водопровод', wear: 72 },
  { system: 'Канализация', wear: 64 }, { system: 'Электросети', wear: 48 }, { system: 'Газопровод', wear: 38 },
];

const accidentsMonthly = [
  { m: 'Янв', n: 142 }, { m: 'Фев', n: 128 }, { m: 'Мар', n: 118 }, { m: 'Апр', n: 104 },
  { m: 'Май', n: 98 }, { m: 'Июн', n: 112 }, { m: 'Июл', n: 108 }, { m: 'Авг', n: 102 },
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

export default function EnergyDashboard() {
  const [tab, setTab] = useState('map');

  return (
    <div>
      <div className="page-header">
        <h1>Управление энергетики и ЖКХ — Жамбылская область</h1>
        <span className="live-dot">Live</span>
      </div>
      <div className="page-body">
        <div className="kpi-grid">
          <KPICard color="blue" label="Выработка э/э" value="4.2" unit="млрд кВт·ч" trend="+3.1% к 2023" trendDir="up" sub="За 8 мес. 2024" />
          <KPICard color="orange" label="Уровень газификации" value="94" unit="%" trend="+2% к 2023" trendDir="up" sub="Газифицировано НП: 186" />
          <KPICard color="yellow" label="Доля ВИЭ" value="18" unit="%" trend="+4% к 2023" trendDir="up" sub="Выработка: 840 млн кВт·ч" />
          <KPICard color="red" label="Износ сетей (средн.)" value="58" unit="%" trend="+3% к 2022" trendDir="down" sub="Требует модернизации" />
          <KPICard color="orange" label="Аварий за месяц" value="112" unit="ед." trend="−18% к 2023" trendDir="up" sub="ЖКХ + теплосети + эл." />
          <KPICard color="green" label="Вывоз ТБО" value="264" unit="тыс. т" trend="96% выполнено" trendDir="up" sub="За 8 мес. 2024" />
        </div>

        <div className="tab-bar">
          {['map', 'energy', 'wear'].map(t => (
            <button key={t} className={`tab-btn ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>
              {t === 'map' ? '🗺 Карта инфраструктуры' : t === 'energy' ? 'Энергетика и ВИЭ' : 'Износ сетей'}
            </button>
          ))}
        </div>

        {tab === 'map' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: '16px' }}>
            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
              <div style={{ padding: '12px 16px', borderBottom: '1.5px solid rgba(21,94,164,0.12)' }}>
                <span style={{ fontSize: '13px', fontWeight: 600, color: '#1a1a2e' }}>Карта энергетической и коммунальной инфраструктуры</span>
              </div>
              <MapWidget
                districts={DISTRICTS}
                markers={ENERGY_MARKERS}
                pathOverlays={ENERGY_PATHS}
                geoJsonUrl="/data/districts.geojson"
                legendTitle="Состояние объектов"
                legendItems={[
                  { color: '#d4a000', label: 'Подстанции' },
                  { color: '#fb6340', label: 'ГРС / Газовые' },
                  { color: '#0fa8c4', label: 'Водоснабжение' },
                  { color: '#fb6340', label: 'Котельные' },
                  { color: '#d4a000', label: 'СЭС / ВИЭ' },
                ]}
                height={420}
                zoom={8}
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div className="card" style={{ padding: '14px' }}>
                <div className="section-title">Критические объекты</div>
                {[
                  { name: 'Котельная ЦТП №12', issue: 'Подача 82%, износ 74%', color: '#f5365c' },
                  { name: 'ПС-110кВ "Жуалы"', issue: 'Перегрузка 102%, износ 78%', color: '#f5365c' },
                  { name: 'ПС-110кВ "Байзак"', issue: 'Загрузка 89%, износ 68%', color: '#d4a000' },
                  { name: 'НС-3 Водоканал', issue: '8 аварий/мес, износ 72%', color: '#d4a000' },
                  { name: 'ГРС Меркенская', issue: 'Износ 61%', color: '#d4a000' },
                ].map((item, i) => (
                  <div key={i} style={{ padding: '7px 0', borderBottom: '1px solid rgba(21,94,164,0.1)' }}>
                    <div style={{ fontSize: '11px', fontWeight: 500, color: '#1a1a2e' }}>{item.name}</div>
                    <div style={{ fontSize: '10px', color: item.color, marginTop: '2px' }}>{item.issue}</div>
                  </div>
                ))}
              </div>
              <div className="card" style={{ padding: '14px' }}>
                <div className="section-title">Тепловая карта износа</div>
                {wearIndex.map((w, i) => (
                  <div key={i} style={{ marginBottom: '9px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '3px' }}>
                      <span style={{ color: '#4a5568' }}>{w.system}</span>
                      <span style={{ color: w.wear >= 70 ? '#f5365c' : w.wear >= 50 ? '#d4a000' : '#2dce89', fontWeight: 600 }}>{w.wear}%</span>
                    </div>
                    <div className="progress-bar">
                      <div style={{ height: '100%', borderRadius: '4px', width: `${w.wear}%`, background: w.wear >= 70 ? '#f5365c' : w.wear >= 50 ? '#d4a000' : '#2dce89' }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {tab === 'energy' && (
          <div className="grid-2">
            <ChartSwitcher
              title="Баланс выработки и потребления (млрд кВт·ч)"
              data={energyBalance}
              xKey="m"
              series={[
                { key: 'produced', name: 'Выработка', color: '#2dce89' },
                { key: 'consumed', name: 'Потребление', color: '#155EA4' },
              ]}
              defaultType="line"
              height={200}
            />
            <ChartSwitcher title="Доля ВИЭ в выработке" pieRows={vieData.map(v => ({ name: v.name, value: v.value, color: v.color }))} defaultType="pie" height={200} />
          </div>
        )}

        {tab === 'wear' && (
          <div className="grid-2">
            <div className="card">
              <div className="section-title">Индекс износа коммунальной инфраструктуры (%)</div>
              {wearIndex.map((w, i) => (
                <div key={i} style={{ marginBottom: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '5px' }}>
                    <span style={{ color: '#4a5568' }}>{w.system}</span>
                    <span style={{ color: w.wear >= 70 ? '#f5365c' : w.wear >= 50 ? '#d4a000' : '#2dce89', fontWeight: 600 }}>{w.wear}%</span>
                  </div>
                  <div className="progress-bar">
                    <div style={{ height: '100%', borderRadius: '4px', width: `${w.wear}%`, background: w.wear >= 70 ? '#f5365c' : w.wear >= 50 ? '#d4a000' : '#2dce89' }} />
                  </div>
                </div>
              ))}
              <div style={{ marginTop: '12px', padding: '10px', background: '#f3eeec', borderRadius: '8px', textAlign: 'center', border: '1px solid rgba(21,94,164,0.1)' }}>
                <div style={{ fontSize: '11px', color: '#4a5568' }}>Средневзвешенный износ</div>
                <div style={{ fontSize: '28px', fontWeight: 700, color: '#f5365c', marginTop: '4px' }}>58%</div>
              </div>
            </div>
            <ChartSwitcher
              title="Динамика аварий по месяцам"
              data={accidentsMonthly}
              xKey="m"
              series={[{ key: 'n', name: 'Аварий', color: '#fb6340' }]}
              defaultType="bar"
              height={220}
            />
          </div>
        )}
      </div>
    </div>
  );
}
