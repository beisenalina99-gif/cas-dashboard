import React, { useMemo, useState } from 'react';
import MapWidget, { type MapPathOverlay } from './MapWidget';
import type { HeatPoint, MapMarker } from '../data/mapData';
import { CENTER } from '../data/mapData';
import { JAMBYL_DISTRICT_OPTIONS } from '../data/mockData';

const panelStyle: React.CSSProperties = {
  background: '#EBDBD8',
  border: '1.5px solid rgba(21,94,164,0.18)',
  borderRadius: '12px',
  padding: '12px 14px',
};

export interface DashboardShellProps {
  filterBarTitle?: string;
  mapCardTitle?: string;
  kpiRow?: React.ReactNode;
  /** Markers + optional heat for unified map */
  markers?: MapMarker[];
  heatmap?: HeatPoint[];
  legendTitle?: string;
  legendItems?: { color: string; label: string }[];
  mapHeight?: number;
  /** Right column charts */
  charts?: React.ReactNode;
  /** Full-width under map */
  bottom?: React.ReactNode;
  /** GeoJSON district outline */
  geoJsonUrl?: string;
  /** Callback when user clicks a marker (drill-down) */
  onMarkerSelect?: (m: MapMarker | null) => void;
  selectedMarker?: MapMarker | null;
  bubblePoints?: { lat: number; lng: number; count: number; title: string; detail: string }[];
  showHeat?: boolean;
  pathOverlays?: MapPathOverlay[];
}

export default function DashboardShell({
  filterBarTitle = 'Фильтры',
  mapCardTitle = 'Карта',
  kpiRow,
  markers = [],
  heatmap = [],
  legendTitle = 'Интенсивность',
  legendItems,
  mapHeight = 400,
  charts,
  bottom,
  geoJsonUrl = '/data/districts.geojson',
  onMarkerSelect,
  selectedMarker,
  bubblePoints,
  showHeat = true,
  pathOverlays = [],
}: DashboardShellProps) {
  const [district, setDistrict] = useState<string>('all');
  const [dateFrom, setDateFrom] = useState('2025-01-01');
  const [dateTo, setDateTo] = useState('2025-05-14');

  const heat = useMemo(() => (showHeat ? heatmap : []), [showHeat, heatmap]);

  return (
    <div>
      <div style={{ ...panelStyle, marginBottom: '12px', display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center' }}>
        <span style={{ fontSize: '12px', fontWeight: 700, color: '#155EA4' }}>{filterBarTitle}</span>
          <label style={{ fontSize: '11px', color: '#4a5568', display: 'flex', alignItems: 'center', gap: '6px' }}>
            Район
            <select
              value={district}
              onChange={e => setDistrict(e.target.value)}
              style={{ padding: '5px 8px', borderRadius: '6px', border: '1px solid #155EA4', fontSize: '11px' }}
            >
              <option value="all">Вся область</option>
              {JAMBYL_DISTRICT_OPTIONS.map(d => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>
          </label>
          <label style={{ fontSize: '11px', color: '#4a5568', display: 'flex', alignItems: 'center', gap: '6px' }}>
            С
            <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} style={{ padding: '4px', borderRadius: '6px', border: '1px solid rgba(21,94,164,0.3)', fontSize: '11px' }} />
          </label>
          <label style={{ fontSize: '11px', color: '#4a5568', display: 'flex', alignItems: 'center', gap: '6px' }}>
            По
            <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} style={{ padding: '4px', borderRadius: '6px', border: '1px solid rgba(21,94,164,0.3)', fontSize: '11px' }} />
          </label>
      </div>

      {kpiRow}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr min(380px, 34%)', gap: '14px', marginTop: '14px', alignItems: 'start' }}>
        <div className="card" style={{ padding: 0, overflow: 'hidden', background: '#fff', borderColor: 'rgba(21,94,164,0.2)' }}>
          <div style={{ padding: '10px 14px', borderBottom: '1.5px solid rgba(21,94,164,0.12)', fontSize: '12px', fontWeight: 600, color: '#1a1a2e' }}>
            {mapCardTitle}{selectedMarker ? ` — ${selectedMarker.name}` : ''}
          </div>
          <MapWidget
            districts={[]}
            markers={markers}
            heatmap={heat}
            legendTitle={legendTitle}
            legendItems={legendItems}
            height={mapHeight}
            zoom={8}
            center={CENTER}
            geoJsonUrl={geoJsonUrl}
            bubblePoints={bubblePoints}
            onMarkerClick={onMarkerSelect}
            pathOverlays={pathOverlays}
          />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {charts}
          {selectedMarker && (
            <div style={{ ...panelStyle, background: '#fff' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, color: '#155EA4', marginBottom: '8px' }}>Детали объекта</div>
              <div style={{ fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>{selectedMarker.name}</div>
              {(selectedMarker.kpis || []).map((k, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', padding: '4px 0', borderBottom: '1px solid rgba(21,94,164,0.08)' }}>
                  <span style={{ color: '#4a5568' }}>{k.label}</span>
                  <span style={{ fontWeight: 600, color: k.color || '#1a1a2e' }}>{k.value}</span>
                </div>
              ))}
              <button
                type="button"
                onClick={() => onMarkerSelect?.(null)}
                style={{ marginTop: '10px', width: '100%', padding: '6px', borderRadius: '8px', border: '1px solid #155EA4', background: '#fff', color: '#155EA4', cursor: 'pointer', fontSize: '11px' }}
              >
                Закрыть панель
              </button>
            </div>
          )}
        </div>
      </div>

      {bottom && <div style={{ marginTop: '14px' }}>{bottom}</div>}
    </div>
  );
}
