import React, { useState } from 'react';
import MapWidget from './MapWidget';
import { DISTRICTS, SOCIAL_MAP_MARKERS, HEAT_SOCIAL } from '../data/mapData';
import ChartSwitcher from './ChartSwitcher';

const unemploymentData = [
  { m: 'Янв', rate: 5.2 }, { m: 'Фев', rate: 5.0 }, { m: 'Мар', rate: 4.8 },
  { m: 'Апр', rate: 4.6 }, { m: 'Май', rate: 4.3 }, { m: 'Июн', rate: 4.1 },
  { m: 'Июл', rate: 4.0 }, { m: 'Авг', rate: 3.9 },
];

const disabilityGroups = [
  { name: 'I группа', value: 2840, color: '#f5365c' },
  { name: 'II группа', value: 8120, color: '#d4a000' },
  { name: 'III группа', value: 12340, color: '#fb6340' },
  { name: 'Дети', value: 3210, color: '#7b61ff' },
];

const youthProgramsData = [
  { program: '«Жастар»', participants: 4820 },
  { program: '«Тәуелсіздік ұрпақтары»', participants: 2840 },
  { program: 'Субсидирование молодёжи', participants: 1840 },
  { program: 'Жильё молодым спец.', participants: 980 },
  { program: 'Переезд в сёла', participants: 640 },
];

const youthSupportTypes = [
  { name: 'Гранты', value: 28, color: '#155EA4' },
  { name: 'Жилищные сертификаты', value: 22, color: '#7b61ff' },
  { name: 'Подъёмные (переезд)', value: 18, color: '#2dce89' },
  { name: 'Занятость', value: 32, color: '#fb6340' },
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

export default function SocialDashboard() {
  const [tab, setTab] = useState('map');

  return (
    <div>
      <div className="page-header">
        <h1>Управление занятости и социальных программ</h1>
        <span className="live-dot">Live</span>
      </div>
      <div className="page-body">
        <div className="kpi-grid">
          <KPICard color="green" label="Новые рабочие места" value="1 250" unit="" trend="+180 за кварт." trendDir="up" sub="Постоянные, 2024" />
          <KPICard color="blue" label="Уровень безработицы" value="3.9" unit="%" trend="−1.3% к 2023" trendDir="up" sub="Занятых: 512 тыс." />
          <KPICard color="yellow" label="Лиц с инвалидностью" value="26 510" unit="чел." trend="+1.2% к 2023" trendDir="neutral" sub="3.2% от населения" />
          <KPICard color="orange" label="Неблагополучных семей" value="691" unit="семей" trend="−12% к 2023" trendDir="up" sub="Детей из них: 1 842" />
          <KPICard color="purple" label="Молодёжь в программах" value="10 120" unit="чел." trend="+18% к 2023" trendDir="up" sub="Индекс вовлечённости: 28%" />
          <KPICard color="blue" label="Участников «Жастар»" value="4 820" unit="чел." trend="+12% к 2023" trendDir="up" sub="2024" />
          <KPICard color="teal" label="Грантов «Тәуелсіздік ұрпақтары»" value="284" unit="ед." trend="План перевыполнен" trendDir="up" sub="На сумму 1,42 млрд тг" />
          <KPICard color="green" label="Молодых спец. на селе (поддержка)" value="68" unit="%" trend="+4 п.п. к 2023" trendDir="up" sub="Гранты + жильё" />
        </div>

        <div className="tab-bar">
          {['map', 'employment', 'disability', 'youth'].map(t => (
            <button key={t} className={`tab-btn ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>
              {t === 'map' ? '🗺 Карта рисков' : t === 'employment' ? 'Рынок труда' : t === 'disability' ? 'Инвалидность' : '🎯 Молодёжная политика'}
            </button>
          ))}
        </div>

        {tab === 'map' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: '16px' }}>
            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
              <div style={{ padding: '12px 16px', borderBottom: '1.5px solid rgba(21,94,164,0.12)' }}>
                <span style={{ fontSize: '13px', fontWeight: 600, color: '#1a1a2e' }}>Карта зон социального риска и реабилитационных центров</span>
              </div>
              <MapWidget
                districts={DISTRICTS}
                markers={SOCIAL_MAP_MARKERS}
                heatmap={HEAT_SOCIAL}
                geoJsonUrl="/data/districts.geojson"
                legendTitle="Уровень соц. риска"
                height={420}
                zoom={8}
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div className="card" style={{ padding: '14px' }}>
                <div className="section-title">Легенда</div>
                {[
                  { c: '#f5365c', l: 'Зоны социального риска' },
                  { c: '#2dce89', l: 'Реабилитационные центры' },
                ].map((it, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: it.c, display: 'inline-block' }} />
                    <span style={{ fontSize: '12px', color: '#4a5568' }}>{it.l}</span>
                  </div>
                ))}
              </div>
              <div className="card" style={{ padding: '14px' }}>
                <div className="section-title">Зоны высокого риска</div>
                {[
                  { name: 'мкр. Камажай, Тараз', families: 142, children: 384, color: '#f5365c' },
                  { name: 'Жуалынский р-н', families: 168, children: 412, color: '#f5365c' },
                  { name: 'Байзакский р-н', families: 123, children: 298, color: '#f5365c' },
                  { name: 'Тастак, Тараз', families: 87, children: 218, color: '#d4a000' },
                ].map((item, i) => (
                  <div key={i} style={{ padding: '7px 0', borderBottom: '1px solid rgba(21,94,164,0.1)' }}>
                    <div style={{ fontSize: '11px', fontWeight: 500, color: '#1a1a2e' }}>{item.name}</div>
                    <div style={{ fontSize: '10px', color: '#4a5568', marginTop: '2px' }}>
                      Семей: <span style={{ color: item.color, fontWeight: 600 }}>{item.families}</span>
                      {' · '}Детей: <span style={{ color: item.color, fontWeight: 600 }}>{item.children}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {tab === 'employment' && (
          <div className="grid-2">
            <ChartSwitcher
              title="Динамика безработицы"
              data={unemploymentData}
              xKey="m"
              series={[{ key: 'rate', name: 'Безработица %', color: '#2dce89' }]}
              defaultType="line"
              height={200}
            />
            <div className="card">
              <div className="section-title">Показатели занятости</div>
              {[
                { label: 'Занятых всего', value: '512 тыс.', color: '#2dce89' },
                { label: 'Безработных', value: '21 тыс.', color: '#f5365c' },
                { label: 'Новых мест (2024)', value: '1 250', color: '#2dce89' },
                { label: 'Молодёжных', value: '175 (14%)', color: '#d4a000' },
                { label: 'Средняя зарплата', value: '248 400 тг', color: '#155EA4' },
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid rgba(21,94,164,0.1)', fontSize: '13px' }}>
                  <span style={{ color: '#4a5568' }}>{item.label}</span>
                  <span style={{ fontWeight: 600, color: item.color }}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'disability' && (
          <div className="grid-2">
            <ChartSwitcher
              title="Пирамида инвалидности по группам (чел.)"
              data={disabilityGroups.map(d => ({ name: d.name, count: d.value }))}
              xKey="name"
              series={[{ key: 'count', name: 'Количество', color: '#155EA4' }]}
              defaultType="bar"
              height={220}
            />
            <ChartSwitcher
              title="Охват ТСР (структура мер поддержки)"
              pieRows={[
                { name: 'ТСР выдано', value: 78, color: '#2dce89' },
                { name: 'В очереди', value: 14, color: '#d4a000' },
                { name: 'Отказано', value: 8, color: '#f5365c' },
              ]}
              defaultType="pie"
              height={200}
            />
            <div className="card">
              <div className="section-title">Реабилитация и ТСР</div>
              {[
                { label: 'Выдано ТСР', value: '78%', color: '#2dce89' },
                { label: 'В очереди на ТСР', value: '~5 832 чел.', color: '#d4a000' },
                { label: 'Прошли реабилитацию', value: '4 280', color: '#2dce89' },
                { label: 'Реабилитационных центров', value: '12', color: '#155EA4' },
                { label: 'Получают спецуслуги', value: '8 140', color: '#7b61ff' },
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '9px 0', borderBottom: '1px solid rgba(21,94,164,0.1)', fontSize: '13px' }}>
                  <span style={{ color: '#4a5568' }}>{item.label}</span>
                  <span style={{ fontWeight: 600, color: item.color }}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'youth' && (
          <>
            <div className="kpi-grid" style={{ marginBottom: '16px' }}>
              <KPICard color="blue" label="Программа «Жастар»" value="4 820" unit="чел." trend="+840 к 2023" trendDir="up" sub="Жамбылская область" />
              <KPICard color="purple" label="«Тәуелсіздік ұрпақтары»" value="2 840" unit="чел." trend="+320 к 2023" trendDir="up" sub="Молодёжных грантов: 284" />
              <KPICard color="green" label="Жилищных сертификатов" value="184" unit="ед." trend="+24 к 2023" trendDir="up" sub="Сумма: 2.8 млрд тг" />
              <KPICard color="orange" label="Переезд в сёла" value="640" unit="чел." trend="Молодые специалисты" trendDir="neutral" sub="Подъёмные: 1.2 млн тг/чел." />
              <KPICard color="teal" label="Индекс вовлечённости" value="28" unit="%" trend="+6% к 2023" trendDir="up" sub="Молодёжь 14–35 лет" />
            </div>
            <div className="grid-2">
              <ChartSwitcher
                title="Динамика выданных грантов и сертификатов"
                data={[
                  { m: 'I кв', grants: 62, certs: 48 },
                  { m: 'II кв', grants: 74, certs: 52 },
                  { m: 'III кв', grants: 68, certs: 44 },
                  { m: 'IV кв', grants: 80, certs: 40 },
                ]}
                xKey="m"
                series={[
                  { key: 'grants', name: 'Гранты', color: '#155EA4' },
                  { key: 'certs', name: 'Сертификаты', color: '#7b61ff' },
                ]}
                defaultType="bar"
                height={220}
              />
              <ChartSwitcher title="Виды поддержки молодёжи" pieRows={youthSupportTypes.map(y => ({ name: y.name, value: y.value, color: y.color }))} defaultType="pie" height={200} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
