import React, { useState, useEffect } from 'react';
import MapWidget from './MapWidget';
import ChartSwitcher from './ChartSwitcher';
import MainDashboardAppeals109 from './MainDashboardAppeals109';
import MainDashboardPassport from './MainDashboardPassport';
import { DISTRICTS, HEAT_INCIDENTS, MapDistrict } from '../data/mapData';

const monthData = [
  { m: 'Янв', calls109: 1240, resolved: 1180 },
  { m: 'Фев', calls109: 1090, resolved: 1050 },
  { m: 'Мар', calls109: 1680, resolved: 1560 },
  { m: 'Апр', calls109: 1590, resolved: 1520 },
  { m: 'Май', calls109: 1320, resolved: 1290 },
  { m: 'Июн', calls109: 1100, resolved: 1080 },
  { m: 'Июл', calls109: 980, resolved: 965 },
  { m: 'Авг', calls109: 1020, resolved: 1000 },
];

const incidentTypes = [
  { name: 'ЖКХ', value: 38, color: '#fb6340' },
  { name: 'Дороги', value: 22, color: '#d4a000' },
  { name: 'Освещение', value: 15, color: '#155EA4' },
  { name: 'Безопасность', value: 14, color: '#f5365c' },
  { name: 'Прочее', value: 11, color: '#a0aec0' },
];

const budgetData = [
  { dept: 'Здравоохранение', fact: 92 },
  { dept: 'Образование', fact: 88 },
  { dept: 'ЖКХ', fact: 76 },
  { dept: 'Дороги', fact: 95 },
  { dept: 'АПК', fact: 84 },
];

const DISTRICT_INCIDENTS: Record<string, { active: number; today: number; dtp: number; resolved: number }> = {
  taraz: { active: 14, today: 318, dtp: 7, resolved: 304 },
  baizak: { active: 7, today: 48, dtp: 2, resolved: 41 },
  zhambyl: { active: 3, today: 32, dtp: 1, resolved: 29 },
  merke: { active: 5, today: 41, dtp: 1, resolved: 36 },
  zhualy: { active: 9, today: 28, dtp: 3, resolved: 19 },
  sarysu: { active: 1, today: 14, dtp: 0, resolved: 14 },
  moiynkum: { active: 2, today: 11, dtp: 0, resolved: 11 },
  ryskulov: { active: 6, today: 38, dtp: 2, resolved: 32 },
};

const ALL_ALERTS = [
  { type: 'critical', text: 'ИИ-прогноз: рост жалоб на теплосети завтра (+340%) из-за похолодания', time: '2 мин назад', district: 'taraz' },
  { type: 'warning', text: 'Авария на водопроводе — ул. Толе би, 45. В работе 2 бригады', time: '14 мин назад', district: 'taraz' },
  { type: 'warning', text: 'Задержка вывоза ТБО в Байзакском районе. Нерешённых: 47', time: '31 мин назад', district: 'baizak' },
  { type: 'critical', text: 'Жуалынский р-н: перебои с электроснабжением в 3 сёлах', time: '45 мин назад', district: 'zhualy' },
  { type: 'info', text: 'Введена новая школа на 600 мест — мкр. Астана', time: '1 ч назад', district: 'taraz' },
  { type: 'info', text: 'Газификация Меркенского района: 96% завершение', time: '2 ч назад', district: 'merke' },
  { type: 'warning', text: 'Сарысуский р-н: временное ограничение водоснабжения', time: '3 ч назад', district: 'sarysu' },
];

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

export default function MainDashboard() {
  const [time, setTime] = useState(new Date());
  const [selectedDistrict, setSelectedDistrict] = useState<MapDistrict | null>(null);
  const [mainTab, setMainTab] = useState<'overview' | '109' | 'passport'>('overview');

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 30000);
    return () => clearInterval(t);
  }, []);

  const distId = selectedDistrict?.id || null;
  const ops = distId ? DISTRICT_INCIDENTS[distId] : { active: 24, today: 318, dtp: 7, resolved: 580 };
  const alerts = distId ? ALL_ALERTS.filter(a => a.district === distId) : ALL_ALERTS;

  return (
    <div>
      <div className="page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <h1>Сводный экран акима — Жамбылская область</h1>
          <span className="live-dot">Live</span>
        </div>
        <div style={{ fontSize: '12px', color: '#4a5568' }}>
          {time.toLocaleString('ru-RU', { weekday: 'short', day: '2-digit', month: 'long', hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>

      <div className="page-body">
        <div className="tab-bar" style={{ marginBottom: '16px' }}>
          {[
            { id: 'overview' as const, label: 'Обзор' },
            { id: '109' as const, label: 'Обращения 109' },
            { id: 'passport' as const, label: 'Цифровой паспорт' },
          ].map(t => (
            <button key={t.id} type="button" className={`tab-btn ${mainTab === t.id ? 'active' : ''}`} onClick={() => setMainTab(t.id)}>
              {t.label}
            </button>
          ))}
        </div>

        {mainTab === '109' && <MainDashboardAppeals109 />}
        {mainTab === 'passport' && <MainDashboardPassport />}

        {mainTab === 'overview' && (
          <>
            <div className="kpi-grid">
              <KPICard color="blue" label="Освоение бюджета" value="92" unit="%" trend="+6% к плану" trendDir="up" sub="+14,15 млрд тг инвестпроектов" />
              <KPICard color="green" label="Новые рабочие места" value="1 250" unit="" trend="+180 за квартал" trendDir="up" sub="Постоянные, 2024" />
              <KPICard color="orange" label="Семьи в зоне риска" value="−12" unit="%" trend="Снижение" trendDir="up" sub="897 семей сняты с учёта" />
              <KPICard color="yellow" label="Охват интернетом" value="94" unit="%" trend="Цель 98% к 2028" trendDir="neutral" sub="187 из 198 НП" />
              <KPICard color="purple" label="IT-проекты запущены" value="8" unit="/10" trend="80% выполнение" trendDir="neutral" sub="2 проекта в разработке" />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '16px', marginBottom: '16px' }}>
              <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                <div style={{ padding: '12px 16px', borderBottom: '1.5px solid rgba(21,94,164,0.12)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '13px', fontWeight: 600, color: '#1a1a2e' }}>Карта инцидентов области</span>
                    {selectedDistrict && (
                      <span style={{ fontSize: '11px', background: 'rgba(21,94,164,0.1)', color: '#155EA4', padding: '2px 8px', borderRadius: '20px' }}>
                        {selectedDistrict.name}
                      </span>
                    )}
                  </div>
                  <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                    {selectedDistrict && (
                      <button
                        type="button"
                        onClick={() => setSelectedDistrict(null)}
                        style={{ fontSize: '10px', padding: '3px 8px', borderRadius: '20px', background: '#f3eeec', color: '#4a5568', border: '1px solid rgba(21,94,164,0.15)', cursor: 'pointer' }}
                      >
                        Сбросить ×
                      </button>
                    )}
                    <span style={{ fontSize: '10px', color: '#8292a5' }}>Кликните на район ↓</span>
                  </div>
                </div>
                <MapWidget
                  districts={DISTRICTS}
                  heatmap={HEAT_INCIDENTS}
                  legendTitle="Инциденты"
                  height={380}
                  zoom={8}
                  onDistrictSelect={setSelectedDistrict}
                  geoJsonUrl="/data/districts.geojson"
                />
              </div>

              <div className="card" style={{ padding: '14px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div className="flex-between">
                  <span style={{ fontSize: '12px', fontWeight: 700, color: '#155EA4', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    {selectedDistrict ? selectedDistrict.name : 'Вся область'}
                  </span>
                  <span className="live-dot" style={{ fontSize: '10px' }}>Live</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
                  {[
                    { label: 'Активных инцидентов', value: ops.active, color: '#f5365c' },
                    { label: 'Обращений 109 сегодня', value: ops.today, color: '#155EA4' },
                    { label: 'ДТП за 24ч', value: ops.dtp, color: '#d4a000' },
                    { label: 'Решено сегодня', value: ops.resolved, color: '#2dce89' },
                  ].map(s => (
                    <div key={s.label} style={{ background: '#f3eeec', borderRadius: '8px', padding: '9px', textAlign: 'center', border: '1px solid rgba(21,94,164,0.1)' }}>
                      <div style={{ fontSize: '20px', fontWeight: 700, color: s.color }}>{s.value}</div>
                      <div style={{ fontSize: '9px', color: '#8292a5', marginTop: '2px', lineHeight: '1.3' }}>{s.label}</div>
                    </div>
                  ))}
                </div>

                {selectedDistrict?.stats && (
                  <div style={{ background: '#f3eeec', borderRadius: '8px', padding: '10px', border: '1px solid rgba(21,94,164,0.1)' }}>
                    <div style={{ fontSize: '10px', color: '#155EA4', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px', fontWeight: 700 }}>Показатели района</div>
                    {selectedDistrict.stats.map((s, i) => (
                      <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', padding: '4px 0', borderBottom: '1px solid rgba(21,94,164,0.1)' }}>
                        <span style={{ color: '#4a5568' }}>{s.label}</span>
                        <span style={{ color: '#1a1a2e', fontWeight: 600 }}>{s.value}</span>
                      </div>
                    ))}
                  </div>
                )}

                <div style={{ flex: 1, overflowY: 'auto', maxHeight: '200px' }}>
                  {(alerts.length ? alerts : ALL_ALERTS).map((a, i) => (
                    <div key={i} className={`alert-item ${a.type}`}>
                      <div className={`alert-dot ${a.type}`} />
                      <div style={{ flex: 1 }}>
                        <div style={{ color: '#1a1a2e', lineHeight: '1.4', fontSize: '11px' }}>{a.text}</div>
                        <div style={{ color: '#8292a5', fontSize: '10px', marginTop: '2px' }}>{a.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid-3 mb-16">
              <ChartSwitcher
                title="Динамика обращений 109"
                data={monthData}
                xKey="m"
                series={[
                  { key: 'calls109', name: 'Принято', color: '#155EA4' },
                  { key: 'resolved', name: 'Решено', color: '#2dce89' },
                ]}
                defaultType="line"
                height={180}
              />
              <ChartSwitcher title="Типология обращений" pieRows={incidentTypes.map(x => ({ name: x.name, value: x.value, color: x.color }))} defaultType="pie" height={200} />
              <ChartSwitcher
                title="Освоение бюджета по отраслям"
                data={budgetData}
                xKey="dept"
                series={[{ key: 'fact', name: '% освоения', color: '#155EA4' }]}
                defaultType="bar"
                height={180}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
