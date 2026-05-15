import React, { useState } from 'react';
import MapWidget from './MapWidget';
import ChartSwitcher from './ChartSwitcher';
import { DISTRICTS, HEALTH_MARKERS, HEAT_HEALTH } from '../data/mapData';

const oncologyData = [
  { y: '2019', stage01: 52, stage234: 48 }, { y: '2020', stage01: 55, stage234: 45 },
  { y: '2021', stage01: 58, stage234: 42 }, { y: '2022', stage01: 61, stage234: 39 },
  { y: '2023', stage01: 65, stage234: 35 }, { y: '2024', stage01: 68, stage234: 32 },
];

const drugDeficit = [
  { cat: 'Онко', deficit: 14 }, { cat: 'Кардио', deficit: 8 },
  { cat: 'Диабет', deficit: 6 }, { cat: 'Психиатрия', deficit: 11 }, { cat: 'Педиатрия', deficit: 5 },
];

const insuranceData = [
  { name: 'Застрахованы', value: 78, color: '#2dce89' },
  { name: 'Не застрахованы', value: 22, color: '#f5365c' },
];

const loadIndex = [
  { district: 'г. Тараз', load: 1.8, status: 'red' },
  { district: 'Байзакский', load: 1.2, status: 'yellow' },
  { district: 'Жамбылский', load: 0.9, status: 'green' },
  { district: 'Меркенский', load: 1.4, status: 'yellow' },
  { district: 'Жуалынский', load: 1.6, status: 'red' },
  { district: 'Сарысуский', load: 0.7, status: 'green' },
];

const STATUS_C: Record<string, string> = { red: '#f5365c', yellow: '#d4a000', green: '#2dce89' };

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

export default function HealthDashboard() {
  const [tab, setTab] = useState('map');

  return (
    <div>
      <div className="page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <h1>Управление здравоохранения — Жамбылская область</h1>
          <span className="live-dot">Live</span>
        </div>
      </div>
      <div className="page-body">
        <div className="kpi-grid">
          <KPICard color="green" label="Ранняя выявляемость онко 0–1 ст." value="68" unit="%" trend="+6% к 2023" trendDir="up" sub="Цель: 72%" />
          <KPICard color="orange" label="Смертность онко" value="62.1" unit="/100 тыс" trend="−4.3" trendDir="up" sub="Тренд снижения" />
          <KPICard color="red" label="Детская смертность до 5 лет" value="8.4" unit="/1000" trend="−1.2 к 2023" trendDir="up" sub="Цель: ≤7,0 к 2026" />
          <KPICard color="blue" label="Доля дист. услуг" value="31" unit="%" trend="+9% к 2023" trendDir="up" sub="Эл. записей: 142 тыс." />
          <KPICard color="teal" label="Доля застрахованных" value="78" unit="%" trend="+5% к 2023" trendDir="up" sub="Незастрах.: 281 тыс." />
          <KPICard color="purple" label="Дефицит препаратов" value="44" unit="ед." trend="−8 поз. к I кв." trendDir="up" sub="Критич.: онко 14" />
        </div>

        <div className="tab-bar">
          {['map', 'overview', 'drugs', 'staff'].map(t => (
            <button key={t} className={`tab-btn ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>
              {t === 'map' ? '🗺 Карта объектов' : t === 'overview' ? 'Статистика' : t === 'drugs' ? 'Лекарства' : 'Кадры'}
            </button>
          ))}
        </div>

        {tab === 'map' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: '16px' }}>
            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
              <div style={{ padding: '12px 16px', borderBottom: '1.5px solid rgba(21,94,164,0.12)' }}>
                <span style={{ fontSize: '13px', fontWeight: 600, color: '#1a1a2e' }}>Медицинские объекты и нагрузка</span>
                <span style={{ fontSize: '11px', color: '#8292a5', marginLeft: '10px' }}>Кликайте на пин для просмотра KPI</span>
              </div>
              <MapWidget
                districts={DISTRICTS}
                markers={HEALTH_MARKERS}
                heatmap={HEAT_HEALTH}
                legendTitle="Нагрузка на мед. систему"
                height={420}
                zoom={8} geoJsonUrl="/data/districts.geojson"
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div className="card" style={{ padding: '14px' }}>
                <div className="section-title">Легенда объектов</div>
                {[
                  { c: '#f5365c', l: 'Больницы / ЦРБ' },
                  { c: '#fb6340', l: 'Поликлиники' },
                  { c: '#7b61ff', l: 'Аптеки ОСМС' },
                ].map((it, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: it.c, display: 'inline-block' }} />
                    <span style={{ fontSize: '12px', color: '#4a5568' }}>{it.l}</span>
                  </div>
                ))}
              </div>
              <div className="card" style={{ padding: '14px' }}>
                <div className="section-title">Критические объекты</div>
                {[
                  { name: 'Онкодиспансер', issue: 'Перегрузка 112%', color: '#f5365c' },
                  { name: 'ДОБ Тараз', issue: 'Перегрузка 94%', color: '#f5365c' },
                  { name: 'ЦРБ Байзакский', issue: 'Нагрузка 2.1', color: '#f5365c' },
                  { name: 'ЦРБ Жуалынский', issue: 'Нагрузка 1.6', color: '#d4a000' },
                  { name: 'Аптека ОСМС №2', issue: '21 позиция дефицита', color: '#d4a000' },
                ].map((item, i) => (
                  <div key={i} style={{ padding: '7px 0', borderBottom: '1px solid rgba(21,94,164,0.1)', fontSize: '11px' }}>
                    <div style={{ color: '#1a1a2e', fontWeight: 500 }}>{item.name}</div>
                    <div style={{ color: item.color, marginTop: '2px' }}>{item.issue}</div>
                  </div>
                ))}
              </div>
              <div className="card" style={{ padding: '14px' }}>
                <div className="section-title">Тепловая карта</div>
                <div style={{ fontSize: '11px', color: '#4a5568', lineHeight: '1.6' }}>
                  Отображает концентрацию нагрузки на первичное звено по районам.
                  <span style={{ color: '#f5365c' }}> Красные зоны</span> — перегрузка системы.
                </div>
              </div>
            </div>
          </div>
        )}

        {tab === 'overview' && (
          <>
            <div className="grid-2 mb-16">
              <ChartSwitcher
                title="Динамика выявляемости онкологии (0–1 стадия vs 2–4, %)"
                data={oncologyData}
                xKey="y"
                series={[
                  { key: 'stage01', name: '0–1 стадия %', color: '#2dce89' },
                  { key: 'stage234', name: '2–4 стадия %', color: '#f5365c' },
                ]}
                defaultType="line"
                height={200}
              />
              <div className="card">
                <div className="section-title">Индекс нагрузки на первичное звено</div>
                {loadIndex.map((d, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                    <span style={{ fontSize: '11px', color: '#1a1a2e', width: '110px', flexShrink: 0 }}>{d.district}</span>
                    <div style={{ flex: 1, margin: '0 10px' }}>
                      <div className="progress-bar">
                        <div style={{ height: '100%', borderRadius: '4px', width: `${Math.min((d.load / 2) * 100, 100)}%`, background: STATUS_C[d.status] }} />
                      </div>
                    </div>
                    <span style={{ fontSize: '12px', fontWeight: 600, color: STATUS_C[d.status], width: '30px', textAlign: 'right' }}>{d.load}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid-3">
              <div className="card">
                <div className="section-title">Ключевые показатели</div>
                {[
                  { label: 'Беременных под наблюдением', value: '14 820 чел.' },
                  { label: 'Вакцинация младенцев', value: '97.2%' },
                  { label: 'Профосмотров', value: '218 400 ед.' },
                  { label: 'Онлайн-консультаций', value: '43 200 ед.' },
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid rgba(21,94,164,0.1)', fontSize: '12px' }}>
                    <span style={{ color: '#4a5568' }}>{item.label}</span>
                    <span style={{ fontWeight: 600, color: '#1a1a2e' }}>{item.value}</span>
                  </div>
                ))}
              </div>
              <ChartSwitcher
                title="Охват ОСМС"
                pieRows={insuranceData.map(x => ({ name: x.name, value: x.value, color: x.color }))}
                defaultType="pie"
                height={200}
              />
              <div className="card">
                <div className="section-title">ИИ-инсайты</div>
                <div className="alert-item critical">
                  <div className="alert-dot critical" />
                  <div><div style={{ color: '#1a1a2e', fontWeight: 500 }}>Жуалынский р-н: перегрузка поликлиник</div><div style={{ color: '#8292a5', fontSize: '10px' }}>Нагрузка 1.6 — нужно 3 терапевта</div></div>
                </div>
                <div className="alert-item warning">
                  <div className="alert-dot warning" />
                  <div><div style={{ color: '#1a1a2e', fontWeight: 500 }}>Дефицит онкопрепаратов</div><div style={{ color: '#8292a5', fontSize: '10px' }}>14 позиций &gt;30 дней отсутствуют</div></div>
                </div>
              </div>
            </div>
          </>
        )}

        {tab === 'drugs' && (
          <div className="grid-2">
            <ChartSwitcher
              title="Дефицит препаратов по категориям"
              data={drugDeficit.map(d => ({ name: d.cat, deficit: d.deficit }))}
              xKey="name"
              series={[{ key: 'deficit', name: 'Позиций в дефиците', color: '#f5365c' }]}
              defaultType="bar"
              height={240}
            />
            <div className="card">
              <div className="section-title">Лекарственное обеспечение</div>
              {[
                { label: 'Доля обеспеченных', value: '91%', color: '#2dce89' },
                { label: 'Не обеспечены', value: '3 200 чел.', color: '#f5365c' },
                { label: 'Ср. время ожидания', value: '14 дней', color: '#d4a000' },
                { label: 'Дефицит препаратов', value: '44 позиции', color: '#fb6340' },
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid rgba(21,94,164,0.1)', fontSize: '13px' }}>
                  <span style={{ color: '#4a5568' }}>{item.label}</span>
                  <span style={{ fontWeight: 600, color: item.color }}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'staff' && (
          <div className="grid-3">
            {[
              { label: 'Всего врачей', value: '4 218', color: '#155EA4' },
              { label: 'Специалистов', value: '2 140', color: '#7b61ff' },
              { label: 'Гос. медорганизаций', value: '84', color: '#2dce89' },
              { label: 'Частных медорганизаций', value: '312', color: '#0fa8c4' },
              { label: 'Тренингов проведено', value: '148', color: '#fb6340' },
              { label: 'Реализованных проектов', value: '23', color: '#d4a000' },
            ].map((item, i) => (
              <div key={i} className="card" style={{ textAlign: 'center' }}>
                <div className="kpi-label">{item.label}</div>
                <div style={{ fontSize: '28px', fontWeight: 700, color: item.color, marginTop: '8px' }}>{item.value}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
