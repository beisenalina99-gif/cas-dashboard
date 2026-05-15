import React, { useState } from 'react';
import MapWidget from './MapWidget';
import { AGRI_MARKERS, DISTRICTS, HEAT_AGRI } from '../data/mapData';
import ChartSwitcher from './ChartSwitcher';

function KPICard({ label, value, unit, trend, trendDir, sub, color }: any) {
  return (
    <div className={`kpi-card ${color}`}>
      <div className="kpi-label">{label}</div>
      <div className={`kpi-value ${color}`}>
        {value}
        <span style={{ fontSize: '13px', fontWeight: 400, marginLeft: '2px' }}>{unit}</span>
      </div>
      {trend && (
        <div className={`kpi-trend ${trendDir}`}>
          {trendDir === 'up' ? '↑' : trendDir === 'down' ? '↓' : '→'} {trend}
        </div>
      )}
      {sub && <div className="kpi-sub">{sub}</div>}
    </div>
  );
}

const yieldByYear = [
  { y: '2020', u: 2.8 }, { y: '2021', u: 3.1 }, { y: '2022', u: 3.2 },
  { y: '2023', u: 3.5 }, { y: '2024', u: 3.7 },
];

const subsidyByCrop = [
  { crop: 'Пшеница', b: 1.42 }, { crop: 'Ячмень', b: 0.88 }, { crop: 'Кукуруза', b: 0.64 },
  { crop: 'Масличные', b: 0.42 }, { crop: 'Кормовые', b: 0.38 }, { crop: 'Прочие', b: 0.29 },
];

export default function AgriDashboard() {
  const [tab, setTab] = useState('map');

  const agriMarkers = AGRI_MARKERS.map(m => ({
    ...m,
    kpis: (m.kpis || []).filter(k => !/ветеринар/i.test(k.label)),
  }));

  return (
    <div>
      <div className="page-header">
        <h1>Управление сельского хозяйства — Жамбылская область</h1>
        <span className="live-dot">Live</span>
      </div>
      <div className="page-body">
        <div className="kpi-grid">
          <KPICard color="yellow" label="Посевная площадь" value="824" unit="тыс. га" trend="+12 тыс. га к 2023" trendDir="up" sub="Зерновые и технические" />
          <KPICard color="green" label="Сбор зерновых" value="1.84" unit="млн т" trend="+4.2% к 2023" trendDir="up" sub="В весе после доработки" />
          <KPICard color="orange" label="Объём субсидий" value="3.83" unit="млрд тг" trend="+18% к 2023" trendDir="up" sub="По культурам и поливу" />
          <KPICard color="blue" label="Фермеры в цифр. мониторинге" value="34" unit="%" trend="+12 п.п. к 2023" trendDir="up" sub="8 420 хозяйств" />
          <KPICard color="teal" label="Цифровизация АПК" value="72" unit="% охват" trend="ГИС-поля + датчики" trendDir="up" sub="Пилотные проекты" />
        </div>

        <div className="tab-bar">
          {['map', 'crops'].map(t => (
            <button key={t} type="button" className={`tab-btn ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>
              {t === 'map' ? '🗺 Карта полей и субсидий' : 'Растениеводство и субсидии'}
            </button>
          ))}
        </div>

        {tab === 'map' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: '16px' }}>
            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
              <div style={{ padding: '12px 16px', borderBottom: '1.5px solid rgba(21,94,164,0.12)' }}>
                <span style={{ fontSize: '13px', fontWeight: 600, color: '#1a1a2e' }}>Поля, неосвоенные земли и слой оплаченных субсидий (мок)</span>
              </div>
              <MapWidget
                districts={DISTRICTS}
                markers={agriMarkers}
                heatmap={HEAT_AGRI}
                geoJsonUrl="/data/districts.geojson"
                legendTitle="Интенсивность / субсидии"
                legendItems={[
                  { color: '#2dce89', label: 'Поля / хозяйства' },
                  { color: '#0fa8c4', label: 'Теплицы' },
                ]}
                height={420}
                zoom={8}
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div className="card" style={{ padding: '14px' }}>
                <div className="section-title">Активные культуры</div>
                {['Пшеница', 'Ячмень', 'Кукуруза', 'Подсолнечник', 'Сахарная свёкла'].map((c, i) => (
                  <div key={c} style={{ padding: '6px 0', borderBottom: '1px solid rgba(21,94,164,0.1)', fontSize: '11px', display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#1a1a2e', fontWeight: 500 }}>{c}</span>
                    <span style={{ color: '#155EA4', fontWeight: 600 }}>{[312, 184, 96, 42, 28][i]} тыс. га</span>
                  </div>
                ))}
              </div>
              <div className="card" style={{ padding: '14px' }}>
                <div className="section-title">Неосвоенный фонд</div>
                <div style={{ fontSize: '28px', fontWeight: 700, color: '#d4a000' }}>142 тыс. га</div>
                <div style={{ fontSize: '10px', color: '#8292a5', marginTop: '4px' }}>Включая запас под орошение</div>
              </div>
            </div>
          </div>
        )}

        {tab === 'crops' && (
          <div className="grid-2">
            <ChartSwitcher
              title="Урожайность зерновых по годам (т/га)"
              data={yieldByYear}
              xKey="y"
              series={[{ key: 'u', name: 'Урожайность', color: '#2dce89' }]}
              defaultType="line"
              height={220}
            />
            <ChartSwitcher
              title="Субсидии по культурам (млрд тг)"
              data={subsidyByCrop}
              xKey="crop"
              series={[{ key: 'b', name: 'Субсидии', color: '#155EA4' }]}
              defaultType="bar"
              height={220}
            />
          </div>
        )}
      </div>
    </div>
  );
}
