import React, { useMemo, useState } from 'react';
import MapWidget from './MapWidget';
import ChartSwitcher from './ChartSwitcher';
import {
  ANOMALIES_MOCK,
  APPEALS109_KPI,
  APPEALS_BY_DISTRICT,
  APPEALS_HEAT,
  APPEALS_BUBBLES,
  APPEALS_REASONS_PIE,
  APPEALS_TYPES_PIE,
  APPEALS_TIMELINE_DAILY,
  REPEAT_APPEALS,
} from '../data/mockData';

function KPICard({ label, value, unit, sub, color }: { label: string; value: string; unit?: string; sub?: string; color: string }) {
  return (
    <div className={`kpi-card ${color}`}>
      <div className="kpi-label">{label}</div>
      <div className={`kpi-value ${color}`}>
        {value}
        {unit && <span style={{ fontSize: '13px', fontWeight: 400, marginLeft: '2px' }}>{unit}</span>}
      </div>
      {sub && <div className="kpi-sub">{sub}</div>}
    </div>
  );
}

export default function MainDashboardAppeals109() {
  const [anomPage, setAnomPage] = useState(0);
  const pageSize = 25;
  const anomSlice = useMemo(() => {
    const start = anomPage * pageSize;
    return ANOMALIES_MOCK.slice(start, start + pageSize);
  }, [anomPage]);
  const anomPages = Math.ceil(ANOMALIES_MOCK.length / pageSize);

  const repeatCount = 1842;
  const tensionScore = APPEALS109_KPI.unresolvedShare * 0.4 + (repeatCount / APPEALS109_KPI.total) * 100 * 0.35 + 8 * 0.25;
  const tensionColor = tensionScore > 18 ? '#f5365c' : tensionScore > 12 ? '#d4a000' : '#2dce89';
  const tensionLabel = tensionScore > 18 ? 'Повышенное' : tensionScore > 12 ? 'Умеренное' : 'Нормальное';

  const districtChartData = APPEALS_BY_DISTRICT.map(d => ({ name: d.district, count: d.count }));
  const timelineData = APPEALS_TIMELINE_DAILY.map(d => ({ name: d.day, appeals: d.appeals }));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'stretch' }}>
        <div style={{ flex: '1 1 220px', background: '#EBDBD8', border: '1.5px solid rgba(21,94,164,0.2)', borderRadius: '12px', padding: '14px' }}>
          <div style={{ fontSize: '11px', color: '#155EA4', fontWeight: 700, marginBottom: '8px' }}>Уровень социального напряжения</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '22px', height: '72px', borderRadius: '8px', background: `linear-gradient(180deg, ${tensionColor} 0%, ${tensionColor}88 100%)`, boxShadow: `0 0 12px ${tensionColor}55` }} />
            <div>
              <div style={{ fontSize: '22px', fontWeight: 800, color: tensionColor }}>{tensionLabel}</div>
              <div style={{ fontSize: '11px', color: '#4a5568', marginTop: '4px', lineHeight: 1.45 }}>
                Индекс: нерешённые ({APPEALS109_KPI.unresolvedShare}%) · повторные за 7 дней · вес аномалий
              </div>
            </div>
          </div>
        </div>
        <div style={{ flex: '1 1 200px', background: '#EBDBD8', border: '1.5px solid rgba(21,94,164,0.2)', borderRadius: '12px', padding: '14px' }}>
          <div style={{ fontSize: '11px', color: '#155EA4', fontWeight: 700, marginBottom: '6px' }}>Повторные обращения (7 дней)</div>
          <div style={{ fontSize: '32px', fontWeight: 800, color: '#155EA4' }}>{repeatCount.toLocaleString('ru-RU')}</div>
          <div style={{ fontSize: '11px', color: '#8292a5' }}>Телефон / адрес с &gt; 1 обращением</div>
        </div>
      </div>

      <div className="kpi-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))' }}>
        <KPICard color="blue" label="Всего обращений" value={APPEALS109_KPI.total.toLocaleString('ru-RU')} sub="109, накопительно" />
        <KPICard color="green" label="Завершено" value={APPEALS109_KPI.completed.toLocaleString('ru-RU')} />
        <KPICard color="yellow" label="В работе" value={APPEALS109_KPI.inProgress.toLocaleString('ru-RU')} />
        <KPICard color="teal" label="На распределении" value={APPEALS109_KPI.distribution.toLocaleString('ru-RU')} />
        <KPICard color="orange" label="Удалено" value={APPEALS109_KPI.deleted.toLocaleString('ru-RU')} />
        <KPICard color="red" label="Доля нерешённых" value={String(APPEALS109_KPI.unresolvedShare)} unit="%" />
        <KPICard color="purple" label="Среднее время решения (SLA)" value={APPEALS109_KPI.slaText} unit="" />
        <KPICard color="blue" label="Самый проблемный адрес" value={APPEALS109_KPI.worstAddress} sub={`${APPEALS109_KPI.worstAddressCount.toLocaleString('ru-RU')} обращений`} />
      </div>

      <div className="grid-2">
        <ChartSwitcher title="Причины обращений" pieRows={APPEALS_REASONS_PIE} defaultType="pie" height={200} />
        <ChartSwitcher title="Типы обращений" pieRows={APPEALS_TYPES_PIE} defaultType="pie" height={200} />
      </div>

      <ChartSwitcher
        title="Количество обращений по районам"
        data={districtChartData}
        xKey="name"
        series={[{ key: 'count', name: 'Обращений', color: '#155EA4' }]}
        defaultType="bar"
        height={240}
      />

      <ChartSwitcher
        title="Хронология поступления обращений"
        data={timelineData}
        xKey="name"
        series={[{ key: 'appeals', name: 'Обращений в день', color: '#2dce89' }]}
        defaultType="line"
        height={200}
      />

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '12px 16px', borderBottom: '1.5px solid rgba(21,94,164,0.12)', fontWeight: 600, fontSize: '13px', color: '#1a1a2e' }}>
          Карта обращений по адресам и тепловая плотность
        </div>
        <MapWidget
          districts={[]}
          markers={[]}
          heatmap={APPEALS_HEAT}
          bubblePoints={APPEALS_BUBBLES.map(b => ({
            lat: b.lat,
            lng: b.lng,
            count: b.count,
            title: b.title,
            detail: b.detail,
          }))}
          geoJsonUrl="/data/districts.geojson"
          legendTitle="Плотность обращений"
          height={400}
          zoom={8}
        />
      </div>

      <div className="card" style={{ padding: '14px' }}>
        <div className="section-title">Список аномалий ({ANOMALIES_MOCK.length.toLocaleString('ru-RU')} записей)</div>
        <div style={{ overflowX: 'auto', maxHeight: '420px', marginTop: '10px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px' }}>
            <thead>
              <tr style={{ background: '#f3eeec', position: 'sticky', top: 0 }}>
                {['Категория', 'Факт/день', 'Обычно', 'Зима', 'Весна', 'Лето', 'Осень', 'Откл. %', 'Статус'].map(h => (
                  <th key={h} style={{ textAlign: 'left', padding: '8px', borderBottom: '2px solid #155EA4', color: '#155EA4', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {anomSlice.map((r, i) => (
                <tr key={i} style={{ background: i % 2 ? '#faf7f6' : '#fff' }}>
                  <td style={{ padding: '6px 8px', borderBottom: '1px solid #eee', maxWidth: '220px' }}>{r.category}</td>
                  <td style={{ padding: '6px 8px' }}>{r.factDay}</td>
                  <td style={{ padding: '6px 8px' }}>{r.usualDay}</td>
                  <td style={{ padding: '6px 8px' }}>{r.winter}</td>
                  <td style={{ padding: '6px 8px' }}>{r.spring}</td>
                  <td style={{ padding: '6px 8px' }}>{r.summer}</td>
                  <td style={{ padding: '6px 8px' }}>{r.autumn}</td>
                  <td style={{ padding: '6px 8px', fontWeight: 600 }}>{r.deviationPct}%</td>
                  <td style={{ padding: '6px 8px', color: r.status === 'Сильная аномалия' ? '#f5365c' : r.status === 'Выше нормы' ? '#fb6340' : r.status === 'Немного выше' ? '#d4a000' : '#2dce89' }}>{r.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px' }}>
          <button type="button" className="tab-btn" disabled={anomPage <= 0} onClick={() => setAnomPage(p => Math.max(0, p - 1))}>← Назад</button>
          <span style={{ fontSize: '12px', color: '#4a5568' }}>Стр. {anomPage + 1} / {anomPages}</span>
          <button type="button" className="tab-btn" disabled={anomPage >= anomPages - 1} onClick={() => setAnomPage(p => Math.min(anomPages - 1, p + 1))}>Вперёд →</button>
        </div>
      </div>

      <div className="card" style={{ padding: '14px' }}>
        <div className="section-title">Повторные обращения (телефон / адрес)</div>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px', marginTop: '10px' }}>
          <thead>
            <tr style={{ background: '#f3eeec' }}>
              {['Телефон', 'Адрес', 'Обращений', 'Период'].map(h => (
                <th key={h} style={{ textAlign: 'left', padding: '8px', color: '#155EA4' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {REPEAT_APPEALS.map((r, i) => (
              <tr key={i}>
                <td style={{ padding: '8px', borderBottom: '1px solid #eee' }}>{r.key}</td>
                <td style={{ padding: '8px', borderBottom: '1px solid #eee' }}>{r.address}</td>
                <td style={{ padding: '8px', borderBottom: '1px solid #eee', fontWeight: 700 }}>{r.cnt}</td>
                <td style={{ padding: '8px', borderBottom: '1px solid #eee' }}>{r.period}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
