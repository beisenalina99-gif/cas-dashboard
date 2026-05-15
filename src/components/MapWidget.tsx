import React, { useEffect, useRef, useState, useCallback } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { MapMarker, MapDistrict, HeatPoint, MarkerType } from '../data/mapData';
import { CENTER } from '../data/mapData';

declare global {
  interface Window {
    L: typeof L & {
      heatLayer: (pts: [number, number, number][], opts?: Record<string, unknown>) => L.Layer;
    };
  }
}

const ICON_SVG: Record<string, string> = {
  hospital: `<path fill="white" d="M10 3h4v4h4v4h-4v4h-4v-4H6V7h4V3z"/>`,
  clinic: `<circle cx="12" cy="12" r="3" fill="white"/><path fill="white" d="M12 2v3M12 19v3M2 12h3M19 12h3"/>`,
  pharmacy: `<path fill="white" d="M9 4h6l1 2H8L9 4zm-3 3h12l-1 11H7L6 7zm4 3v5m3-5v5"/>`,
  ambulance: `<path fill="white" d="M3 10v4l1 2h1v1h2v-1h8v1h2v-1h1l1-2v-4l-3-5H6L3 10zm9-2h2v2h2v2h-2v2h-2v-2h-2v-2h2V8z"/>`,
  school: `<path fill="white" d="M12 3L2 8l10 5 10-5-10-5zM2 13v4c0 1.1 4.5 3 10 3s10-1.9 10-3v-4l-10 5-10-5z"/>`,
  kindergarten: `<path fill="white" d="M12 2a5 5 0 100 10A5 5 0 0012 2zm-7 11c-1.1 0-2 .9-2 2v5h18v-5c0-1.1-.9-2-2-2H5z"/>`,
  college: `<path fill="white" d="M12 3L1 9l11 6 9-4.9V17h2V9L12 3zm-5 9.8V17l5 3 5-3v-4.2l-5 2.7-5-2.7z"/>`,
  police: `<path fill="white" d="M12 2L4 5v6c0 5.5 3.4 10.7 8 12 4.6-1.3 8-6.5 8-12V5l-8-3z"/>`,
  fire: `<path fill="white" d="M17.7 10.6c-.5-2.6-3.1-4.6-4.7-7.6-.3 2.1-1.3 3.6-2.4 4.5-.6-1.5-.6-3.2 0-4.9-3.1 2-4.6 5.6-3.9 9 .4 2.1 1.7 4 3.3 5.4C9.5 16.4 9 15.5 9 14.3c0-2.3 2-4 2-4 .4 2.5 2.6 4 3.5 6.5.2.5.3 1.1.3 1.7 0 2.2-1.8 4-4 4-2.2 0-4-1.8-4-4 0-.7.2-1.3.5-1.9C5.6 15.2 4 12.6 4 9.5 4 5.4 7.1 2 11.2 1.2L12 1l.8.2C16.9 2 20 5.4 20 9.5c0 3.1-1.6 5.7-4.3 7.1.3.6.3 1.3.3 1.9 0 2.2-1.8 4-4 4-.9 0-1.7-.3-2.4-.8"/>`,
  accident: `<path fill="white" d="M12 2L2 19h20L12 2zm0 3l7.5 13h-15L12 5zm-1 5v4h2V10h-2zm0 5v2h2v-2h-2z"/>`,
  incident: `<path fill="white" d="M12 2L2 19h20L12 2zm0 3l7.5 13h-15L12 5zm-1 5v4h2V10h-2zm0 5v2h2v-2h-2z"/>`,
  farm: `<path fill="white" d="M12 3C7 3 3 7 3 12c0 2.4.9 4.6 2.4 6.2L12 22l6.6-3.8C20.1 16.6 21 14.4 21 12c0-5-4-9-9-9zm0 2c1.3 0 2.5.3 3.6.9L12 8 8.4 5.9C9.5 5.3 10.7 5 12 5zm-6.5 3.4L9 10l-3 1.8V9.1C6 7.8 6.4 7.1 5.5 8.4zm13 0C17.6 7.1 18 7.8 18 9.1v2.7L15 10l3.5-1.6z"/>`,
  field: `<path fill="white" d="M3 3v18h18V3H3zm2 2h5v5H5V5zm0 7h5v5H5v-5zm7-7h5v5h-5V5zm0 7h5v5h-5v-5z"/>`,
  greenhouse: `<path fill="white" d="M12 2L2 8v13h20V8L12 2zm0 2.5l8 4.9V9H4v-.6l8-3.9zM4 19v-8h16v8H4zm3-5h10v2H7v-2z"/>`,
  factory: `<path fill="white" d="M4 4v16h16V4H4zm9 2v3l-3-2v2l-3-2v9h2v-5h4v5h2V6h-2z"/>`,
  power: `<path fill="white" d="M7 2v13h3v7l7-12h-4l4-8z"/>`,
  gas: `<path fill="white" d="M6 2h12l2 5-2 5H6L4 7l2-5zm0 12v6h2v-4h8v4h2v-6H6z"/>`,
  water_tower: `<path fill="white" d="M7 2h10v5H7V2zm-2 5h14l1 3H4l1-3zm1 4v11h2V11H6zm8 0v11h2V11h-2zm-4 2v9h2v-9h-2z"/>`,
  heat_station: `<path fill="white" d="M13 2.05V5.1c3.4.5 6 3.4 6 6.9 0 3-1.7 5.7-4.3 7.1L13 17.2V20h-2v-2.8l-1.7 1.8C6.7 17.7 5 15 5 12c0-3.5 2.6-6.4 6-6.9V2.05h2zm0 10.95a1 1 0 01-2 0V8h2v5z"/>`,
  camera: `<path fill="white" d="M12 7a5 5 0 100 10A5 5 0 0012 7zm0 2a3 3 0 110 6 3 3 0 010-6zM2 5l3 2.5V7h14v10H5v-.5L2 19V5z"/>`,
  sensor: `<circle cx="12" cy="12" r="4" fill="white"/><path fill="none" stroke="white" strokeWidth="1.5" d="M5 12a7 7 0 0014 0M3 12a9 9 0 0018 0"/>`,
  weather_station: `<path fill="white" d="M12 2a2 2 0 010 4 2 2 0 010-4zm0 5l4 8H8l4-8zm-7 9h14v2H5v-2z"/>`,
  park: `<path fill="white" d="M12 2C8 2 5 5 5 9c0 2.4 1.1 4.5 2.9 5.9L12 22l4.1-7.1C17.9 13.5 19 11.4 19 9c0-4-3-7-7-7zm0 3a4 4 0 110 8 4 4 0 010-8z"/>`,
  forest: `<path fill="white" d="M12 2l-5 8h3L7 17h5v3h2v-3h5l-3-7h3l-5-8z"/>`,
  reservoir: `<path fill="white" d="M12 2C8.7 2 6 4.7 6 8c0 3 2 5.6 5 6.7V18H8v2h8v-2h-3v-3.3c3-1.1 5-3.7 5-6.7 0-3.3-2.7-6-6-6zm0 2a4 4 0 110 8 4 4 0 010-8z"/>`,
  procurement: `<path fill="white" d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 3l3 3-1.4 1.4L13 9.8V15h-2V9.8l-1.6 1.6L8 10l4-4z"/>`,
  office: `<path fill="white" d="M12 2L4 6v14h6v-4h4v4h6V6L12 2zm0 2.2l6 3V18h-3v-4H9v4H6V7.2l6-3z"/>`,
  social_risk: `<path fill="white" d="M12 2C9.2 2 7 4.2 7 7s2.2 5 5 5 5-2.2 5-5-2.2-5-5-5zm0 12c-5.3 0-8 2.7-8 4v2h16v-2c0-1.3-2.7-4-8-4zm5 3l-1 1-1-1v-2h2v2z"/>`,
  rehab_center: `<path fill="white" d="M12 2a5 5 0 110 10A5 5 0 0112 2zM4 20v-2c0-2 2-4 8-4s8 2 8 4v2H4zm8-10a3 3 0 100-6 3 3 0 000 6z"/>`,
  land_plot: `<path fill="white" d="M12 2L2 7l10 5 10-5-10-5zM2 12l10 5 10-5M2 17l10 5 10-5"/>`,
};

const TYPE_COLOR: Record<MarkerType, string> = {
  hospital: '#f5365c',
  clinic: '#fb6340',
  pharmacy: '#7b61ff',
  ambulance: '#f5365c',
  school: '#ffd600',
  kindergarten: '#ffd600',
  college: '#ffd600',
  police: '#1a8cff',
  fire: '#f5365c',
  accident: '#f5365c',
  incident: '#fb6340',
  farm: '#2dce89',
  field: '#2dce89',
  greenhouse: '#11cdef',
  factory: '#fb6340',
  power: '#ffd600',
  gas: '#fb6340',
  water_tower: '#11cdef',
  heat_station: '#fb6340',
  camera: '#1a8cff',
  sensor: '#11cdef',
  weather_station: '#11cdef',
  park: '#2dce89',
  forest: '#2dce89',
  reservoir: '#11cdef',
  procurement: '#7b61ff',
  office: '#7b61ff',
  social_risk: '#f5365c',
  rehab_center: '#2dce89',
  land_plot: '#ffd600',
};

const STATUS_COLOR = {
  ok: { fill: 'rgba(45,206,137,0.15)', stroke: '#2dce89' },
  warning: { fill: 'rgba(255,214,0,0.15)', stroke: '#ffd600' },
  critical: { fill: 'rgba(245,54,92,0.15)', stroke: '#f5365c' },
};

function createIcon(type: MarkerType, status?: MapMarker['status']): L.DivIcon {
  const color = TYPE_COLOR[type] || '#1a8cff';
  const svg = ICON_SVG[type] || ICON_SVG['sensor'];
  const ring = status === 'critical' ? '#f5365c' : status === 'warning' ? '#ffd600' : '#2dce89';
  const html = `<div style="
    width:32px;height:32px;border-radius:50%;
    background:${color};
    border:2.5px solid ${ring};
    display:flex;align-items:center;justify-content:center;
    box-shadow:0 2px 8px ${color}55,0 0 0 3px ${ring}22;
    cursor:pointer;
  ">
    <svg viewBox="0 0 24 24" width="16" height="16" xmlns="http://www.w3.org/2000/svg">
      ${svg}
    </svg>
  </div>`;
  return L.divIcon({ html, className: '', iconSize: [32, 32], iconAnchor: [16, 16], popupAnchor: [0, -18] });
}

function buildPopup(marker: MapMarker): string {
  const c = TYPE_COLOR[marker.type] || '#1a8cff';
  const kpiRows = (marker.kpis || [])
    .map(k => `<div style="display:flex;justify-content:space-between;padding:5px 0;border-bottom:1px solid #e8ecf0;font-size:12px;">
      <span style="color:#6b7280">${k.label}</span>
      <span style="font-weight:600;color:${k.color || '#1a1a2e'}">${k.value}</span>
    </div>`)
    .join('');
  return `<div style="
    font-family:Inter,system-ui,sans-serif;
    min-width:220px;max-width:280px;
    border-top:3px solid ${c};
    border-radius:0 0 8px 8px;
  ">
    <div style="font-size:13px;font-weight:700;color:#1a1a2e;padding:10px 12px 6px;">${marker.name}</div>
    <div style="padding:0 12px 10px">${kpiRows}</div>
  </div>`;
}

interface LegendItem { color: string; label: string }

export interface MapBubblePoint {
  lat: number;
  lng: number;
  count: number;
  title: string;
  detail: string;
}

export interface MapPathOverlay {
  positions: [number, number][];
  color: string;
  weight?: number;
}

interface MapWidgetProps {
  markers?: MapMarker[];
  districts?: MapDistrict[];
  heatmap?: HeatPoint[];
  legendTitle?: string;
  legendItems?: LegendItem[];
  showHeatGradient?: boolean;
  height?: number | string;
  zoom?: number;
  center?: [number, number];
  onDistrictSelect?: (d: MapDistrict | null) => void;
  /** Подложка районов из GeoJSON (обводка #155EA4) */
  geoJsonUrl?: string | null;
  /** Круговые маркеры (размер от count) */
  bubblePoints?: MapBubblePoint[];
  onMarkerClick?: (m: MapMarker) => void;
  /** Линии на карте (ЛЭП, газ и т.д.) */
  pathOverlays?: MapPathOverlay[];
}

function stadiaTileUrl(): string {
  const key = import.meta.env.VITE_STADIA_API_KEY as string | undefined;
  const base = 'https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png';
  return key ? `${base}?api_key=${encodeURIComponent(key)}` : base;
}

export default function MapWidget({
  markers = [],
  districts = [],
  heatmap = [],
  legendTitle = 'Интенсивность',
  legendItems,
  showHeatGradient = true,
  height = 400,
  zoom = 9,
  center = CENTER,
  onDistrictSelect,
  geoJsonUrl = null,
  bubblePoints = [],
  onMarkerClick,
  pathOverlays = [],
}: MapWidgetProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const distLayerRef = useRef<L.LayerGroup | null>(null);
  const markLayerRef = useRef<L.LayerGroup | null>(null);
  const geoLayerRef = useRef<L.LayerGroup | null>(null);
  const pathLayerRef = useRef<L.LayerGroup | null>(null);
  const heatLayerRef = useRef<L.Layer | null>(null);
  const mapIdRef = useRef(`map-${Math.random().toString(36).slice(2, 9)}`);
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      center,
      zoom,
      zoomControl: true,
      attributionControl: false,
    });

    const osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});
    stadia.addTo(map);
    let usedFallback = false;
    stadia.on('tileerror', () => {
      if (usedFallback) return;
      usedFallback = true;
      map.removeLayer(stadia);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        subdomains: 'abcd',
        attribution: '&copy; OpenStreetMap &copy; CARTO',
      }).addTo(map);
    });

    L.control
      .attribution({ prefix: false })
      .addAttribution('&copy; OpenStreetMap &copy; Stadia Maps')
      .addTo(map);

    mapRef.current = map;
    geoLayerRef.current = L.layerGroup().addTo(map);
    pathLayerRef.current = L.layerGroup().addTo(map);
    distLayerRef.current = L.layerGroup().addTo(map);
    markLayerRef.current = L.layerGroup().addTo(map);

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    const dLayer = distLayerRef.current;
    if (!map || !dLayer) return;
    dLayer.clearLayers();

    districts.forEach(d => {
      const sc = STATUS_COLOR[d.status];
      const poly = L.polygon(d.coords as L.LatLngExpression[], {
        color: sc.stroke,
        fillColor: sc.fill,
        fillOpacity: 0.3,
        weight: 2,
        opacity: 0.7,
      });

      poly.on('mouseover', () => {
        poly.setStyle({ fillOpacity: 0.5, weight: 3 });
        poly.bindTooltip(`<b>${d.name}</b>`, { sticky: true }).openTooltip();
      });
      poly.on('mouseout', () => {
        poly.setStyle({ fillOpacity: 0.3, weight: 2 });
        poly.closeTooltip();
      });
      poly.on('click', () => {
        setSelected(d.id);
        onDistrictSelect?.(d);
        const bounds = poly.getBounds();
        map.flyToBounds(bounds, { padding: [24, 24], duration: 0.6 });
      });

      poly.addTo(dLayer);

      const center2 = poly.getBounds().getCenter();
      L.marker(center2, {
        icon: L.divIcon({
          html: `<div style="
            background:white;border:1.5px solid ${sc.stroke};
            border-radius:4px;padding:2px 6px;font-size:10px;
            font-family:Inter,sans-serif;font-weight:600;
            color:${sc.stroke};white-space:nowrap;
            box-shadow:0 1px 4px rgba(0,0,0,0.15);
          ">${d.name}</div>`,
          className: '',
          iconAnchor: [40, 10],
        }),
      }).addTo(dLayer);
    });
  }, [districts, selected]);

  useEffect(() => {
    const layer = geoLayerRef.current;
    const map = mapRef.current;
    if (!layer || !map) return;
    layer.clearLayers();
    if (!geoJsonUrl) return;
    let cancelled = false;
    fetch(geoJsonUrl)
      .then(r => r.json())
      .then(data => {
        if (cancelled) return;
        L.geoJSON(data as never, {
          style: () => ({
            color: '#155EA4',
            weight: 2,
            opacity: 0.85,
            fillColor: '#155EA4',
            fillOpacity: 0.06,
          }),
        }).addTo(layer);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [geoJsonUrl]);

  useEffect(() => {
    const layer = pathLayerRef.current;
    if (!layer) return;
    layer.clearLayers();
    pathOverlays.forEach(p => {
      L.polyline(p.positions as L.LatLngExpression[], {
        color: p.color,
        weight: p.weight ?? 3,
        opacity: 0.85,
      }).addTo(layer);
    });
  }, [pathOverlays]);

  useEffect(() => {
    const map = mapRef.current;
    const mLayer = markLayerRef.current;
    if (!map || !mLayer) return;
    mLayer.clearLayers();

    bubblePoints.forEach(b => {
      const r = Math.max(6, Math.min(32, 4 + Math.sqrt(b.count) * 0.45));
      const c = L.circleMarker([b.lat, b.lng], {
        radius: r,
        stroke: true,
        color: '#155EA4',
        weight: 2,
        fillColor: '#155EA4',
        fillOpacity: 0.35,
      });
      c.bindPopup(
        `<div style="font-family:Inter,sans-serif;padding:8px 10px;min-width:180px;">
          <div style="font-weight:700;color:#155EA4;font-size:13px">${b.title}</div>
          <div style="font-size:12px;color:#1a1a2e;margin-top:6px">${b.detail}</div>
          <div style="font-size:11px;color:#8292a5;margin-top:4px">Обращений: ${b.count.toLocaleString('ru-RU')}</div>
        </div>`,
        { className: 'cas-popup', maxWidth: 280 },
      );
      c.addTo(mLayer);
    });

    markers.forEach(m => {
      const icon = createIcon(m.type, m.status);
      const marker = L.marker([m.lat, m.lng], { icon });
      marker.bindPopup(buildPopup(m), { maxWidth: 300, className: 'cas-popup' });
      marker.on('click', () => onMarkerClick?.(m));
      marker.addTo(mLayer);
    });
  }, [markers, bubblePoints, onMarkerClick]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    if (heatLayerRef.current) {
      map.removeLayer(heatLayerRef.current);
      heatLayerRef.current = null;
    }
    if (!heatmap.length) return;

    const pts = heatmap.map(p => [p.lat, p.lng, p.intensity] as [number, number, number]);

    const tryAdd = () => {
      if (typeof window.L?.heatLayer === 'function') {
        heatLayerRef.current = window.L.heatLayer(pts, {
          radius: 50,
          blur: 28,
          maxZoom: 12,
          gradient: { 0.2: '#2dce89', 0.5: '#ffd600', 0.75: '#fb6340', 1.0: '#f5365c' },
        });
        heatLayerRef.current.addTo(map);
      } else {
        setTimeout(tryAdd, 300);
      }
    };
    tryAdd();

    return () => {
      if (heatLayerRef.current && map) {
        map.removeLayer(heatLayerRef.current);
        heatLayerRef.current = null;
      }
    };
  }, [heatmap]);

  return (
    <div style={{ position: 'relative', height, borderRadius: '12px', overflow: 'hidden', border: '2px solid #155EA4' }}>
      <div ref={containerRef} id={mapIdRef.current} style={{ height: '100%', width: '100%' }} />

      <div style={{
        position: 'absolute', top: 10, right: 10, zIndex: 999,
        background: 'rgba(255,255,255,0.97)',
        borderRadius: '10px', padding: '10px 14px',
        boxShadow: '0 2px 12px rgba(0,0,0,0.18)',
        fontFamily: 'Inter,system-ui,sans-serif',
        minWidth: '140px',
        border: '1px solid #e8ecf0',
      }}>
        <div style={{ fontSize: '11px', fontWeight: 700, color: '#1a1a2e', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          {legendTitle}
        </div>
        {legendItems ? (
          legendItems.map((li, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '5px' }}>
              <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: li.color, display: 'inline-block', flexShrink: 0 }} />
              <span style={{ fontSize: '11px', color: '#374151' }}>{li.label}</span>
            </div>
          ))
        ) : showHeatGradient ? (
          <>
            <div style={{
              height: '10px', borderRadius: '5px',
              background: 'linear-gradient(to right, #2dce89, #ffd600, #fb6340, #f5365c)',
              marginBottom: '5px',
            }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9px', color: '#6b7280' }}>
              <span>Низкий</span><span>Средний</span><span>Высокий</span>
            </div>
          </>
        ) : null}
        <div style={{ borderTop: '1px solid #f0f0f0', marginTop: '8px', paddingTop: '7px' }}>
          {[
            { c: '#2dce89', l: 'Норма' },
            { c: '#ffd600', l: 'Внимание' },
            { c: '#f5365c', l: 'Критично' },
          ].map(it => (
            <div key={it.l} style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
              <span style={{ width: '12px', height: '5px', borderRadius: '3px', background: it.c, display: 'inline-block', flexShrink: 0 }} />
              <span style={{ fontSize: '11px', color: '#374151' }}>{it.l}</span>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .cas-popup .leaflet-popup-content-wrapper {
          padding: 0; border-radius: 8px;
          box-shadow: 0 4px 24px rgba(0,0,0,0.18);
          border: none; overflow: hidden;
        }
        .cas-popup .leaflet-popup-content { margin: 0; }
        .cas-popup .leaflet-popup-tip { background: white; }
        .leaflet-control-zoom { border: none !important; box-shadow: 0 2px 8px rgba(0,0,0,0.15) !important; }
        .leaflet-control-zoom a {
          background: white !important; color: #1a1a2e !important;
          font-size: 16px !important; border: none !important;
          border-bottom: 1px solid #eee !important;
        }
        .leaflet-control-zoom a:hover { background: #f5f5f5 !important; }
      `}</style>
    </div>
  );
}
