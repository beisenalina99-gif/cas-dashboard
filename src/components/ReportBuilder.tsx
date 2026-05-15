import React, { useMemo, useState, useRef } from 'react';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import PptxGenJS from 'pptxgenjs';
import html2canvas from 'html2canvas';
import { CAS_BASELINE_VALUES, JAMBYL_DISTRICT_OPTIONS, REPORT_INDICATOR_GROUPS } from '../data/mockData';

const AI_HINTS: Record<string, string> = {
  xlsx: 'ИИ: для оперативной сводки и сверки с первичкой в Excel.',
  pdf: 'ИИ: для официальной выписки и архива — компактный PDF.',
  pptx: 'ИИ: для презентации на совещание — структура по слайдам.',
  mind: 'ИИ: для стратегической сессии — связи между показателями.',
};

type DRow = { indicator: string; cas: number; file: number; abs: number; pct: string; reason: string };

function flattenSelection(sel: Record<string, boolean>) {
  const rows: { id: string; label: string }[] = [];
  REPORT_INDICATOR_GROUPS.forEach(g => g.children.forEach(c => {
    if (sel[c.id]) rows.push({ id: c.id, label: c.label });
  }));
  return rows;
}

export default function ReportBuilder() {
  const [sel, setSel] = useState<Record<string, boolean>>({});
  const [district, setDistrict] = useState('all');
  const [d1, setD1] = useState('2025-01-01');
  const [d2, setD2] = useState('2025-05-14');
  const [dialog, setDialog] = useState(false);
  const [diff, setDiff] = useState<DRow[] | null>(null);
  const mindRef = useRef<HTMLDivElement>(null);

  const toggle = (id: string) => setSel(s => ({ ...s, [id]: !s[id] }));

  const selectedRows = useMemo(() => flattenSelection(sel), [sel]);

  const buildSheetRows = () => selectedRows.map(r => ({
    Показатель: r.label,
    Код: r.id,
    Значение: CAS_BASELINE_VALUES[r.id] ?? '',
    Район: district === 'all' ? 'Область' : JAMBYL_DISTRICT_OPTIONS.find(x => x.id === district)?.name,
    'Дата с': d1,
    'Дата по': d2,
  }));

  const downloadXlsx = () => {
    const ws = XLSX.utils.json_to_sheet(buildSheetRows());
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Отчёт ЦАС');
    XLSX.writeFile(wb, `cas-report-${district}.xlsx`);
  };

  const downloadPdf = () => {
    const doc = new jsPDF({ unit: 'pt', format: 'a4' });
    doc.setFontSize(14);
    doc.text('ЦАС — сформированный отчёт', 48, 48);
    doc.setFontSize(10);
    let y = 72;
    selectedRows.forEach(r => {
      const v = CAS_BASELINE_VALUES[r.id];
      doc.text(`${r.label}: ${v ?? '—'}`, 48, y);
      y += 16;
      if (y > 720) { doc.addPage(); y = 48; }
    });
    doc.save(`cas-report-${district}.pdf`);
  };

  const downloadPptx = async () => {
    const pptx = new PptxGenJS();
    const slide = pptx.addSlide();
    slide.addText('Цифровая аналитическая система', { x: 0.5, y: 0.4, fontSize: 24, color: '155EA4' });
    slide.addText(`Период: ${d1} — ${d2} · ${district === 'all' ? 'Вся область' : district}`, { x: 0.5, y: 1.1, fontSize: 14 });
    let y = 1.6;
    selectedRows.slice(0, 12).forEach(r => {
      const v = CAS_BASELINE_VALUES[r.id];
      slide.addText(`• ${r.label}: ${v ?? '—'}`, { x: 0.5, y, fontSize: 12 });
      y += 0.35;
    });
    await pptx.writeFile({ fileName: `cas-report-${district}.pptx` });
  };

  const exportMindPng = async () => {
    if (!mindRef.current) return;
    const canvas = await html2canvas(mindRef.current, { backgroundColor: '#ffffff', scale: 2 });
    const a = document.createElement('a');
    a.href = canvas.toDataURL('image/png');
    a.download = `cas-mindmap-${district}.png`;
    a.click();
  };

  const parseUpload = async (file: File) => {
    const name = file.name.toLowerCase();
    const rows: DRow[] = [];
    if (name.endsWith('.xlsx') || name.endsWith('.xls')) {
      const buf = await file.arrayBuffer();
      const wb = XLSX.read(buf);
      const sh = wb.Sheets[wb.SheetNames[0]];
      const json = XLSX.utils.sheet_to_json<Record<string, unknown>>(sh);
      json.forEach((row, i) => {
        const id = String(row['Код'] ?? row['id'] ?? '').trim();
        if (!id || !(id in CAS_BASELINE_VALUES)) return;
        const fileVal = Number(row['Значение'] ?? row['value'] ?? row['Факт']);
        if (Number.isNaN(fileVal)) return;
        const cas = CAS_BASELINE_VALUES[id];
        const abs = Math.round((fileVal - cas) * 100) / 100;
        const pct = cas !== 0 ? `${Math.round((abs / cas) * 1000) / 10}%` : '—';
        rows.push({
          indicator: String(row['Показатель'] ?? id),
          cas,
          file: fileVal,
          abs,
          pct,
          reason: 'Расхождение периодов учёта (мок).',
        });
      });
      if (!rows.length) {
        selectedRows.forEach((r, idx) => {
          const cas = CAS_BASELINE_VALUES[r.id] ?? 0;
          const fileVal = Math.round(cas * (0.97 + (idx % 5) * 0.015) * 100) / 100;
          const abs = Math.round((fileVal - cas) * 100) / 100;
          rows.push({
            indicator: r.label,
            cas,
            file: fileVal,
            abs,
            pct: `${Math.round((abs / cas) * 1000) / 10}%`,
            reason: 'Автосопоставление по шаблону (мок).',
          });
        });
      }
    } else if (name.endsWith('.pdf')) {
      selectedRows.slice(0, 8).forEach((r, i) => {
        const cas = CAS_BASELINE_VALUES[r.id] ?? 0;
        const fileVal = cas * (1 + (i % 3) * 0.01);
        const abs = Math.round((fileVal - cas) * 100) / 100;
        rows.push({
          indicator: r.label,
          cas,
          file: fileVal,
          abs,
          pct: cas ? `${Math.round((abs / cas) * 1000) / 10}%` : '—',
          reason: 'PDF: извлечение ограничено прототипом (мок).',
        });
      });
    }
    setDiff(rows.length ? rows : null);
  };

  return (
    <div>
      <div className="page-header">
        <h1>Конструктор отчётов ЦАС</h1>
        <span className="live-dot">Prototype</span>
      </div>
      <div className="page-body">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '16px', alignItems: 'start' }}>
          <div className="card" style={{ background: '#EBDBD8', borderColor: 'rgba(21,94,164,0.2)' }}>
            <div className="section-title">Показатели по управлениям</div>
            <div style={{ maxHeight: '520px', overflowY: 'auto', marginTop: '10px' }}>
              {REPORT_INDICATOR_GROUPS.map(g => (
                <div key={g.id} style={{ marginBottom: '14px' }}>
                  <div style={{ fontWeight: 700, color: '#155EA4', fontSize: '12px', marginBottom: '6px' }}>{g.label}</div>
                  {g.children.map(c => (
                    <label key={c.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', marginBottom: '4px', cursor: 'pointer' }}>
                      <input type="checkbox" checked={!!sel[c.id]} onChange={() => toggle(c.id)} />
                      <span>{c.label}</span>
                    </label>
                  ))}
                </div>
              ))}
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div className="card" style={{ background: '#EBDBD8' }}>
              <div className="section-title">Фильтры</div>
              <label style={{ display: 'block', fontSize: '11px', marginTop: '8px', color: '#4a5568' }}>Район</label>
              <select value={district} onChange={e => setDistrict(e.target.value)} style={{ width: '100%', marginTop: '4px', padding: '8px', borderRadius: '8px', border: '1px solid #155EA4' }}>
                <option value="all">Вся область</option>
                {JAMBYL_DISTRICT_OPTIONS.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
              </select>
              <label style={{ display: 'block', fontSize: '11px', marginTop: '10px', color: '#4a5568' }}>Период</label>
              <div style={{ display: 'flex', gap: '6px', marginTop: '4px' }}>
                <input type="date" value={d1} onChange={e => setD1(e.target.value)} style={{ flex: 1, padding: '6px', borderRadius: '6px', border: '1px solid rgba(21,94,164,0.25)' }} />
                <input type="date" value={d2} onChange={e => setD2(e.target.value)} style={{ flex: 1, padding: '6px', borderRadius: '6px', border: '1px solid rgba(21,94,164,0.25)' }} />
              </div>
              <button type="button" className="tab-btn active" style={{ width: '100%', marginTop: '14px', padding: '10px', cursor: 'pointer' }} onClick={() => setDialog(true)} disabled={!selectedRows.length}>
                Сформировать отчёт
              </button>
            </div>
            <div className="card" style={{ background: '#EBDBD8', fontSize: '12px', color: '#4a5568' }}>
              <div className="section-title">Загрузка внешнего отчёта</div>
              <input type="file" accept=".xlsx,.xls,.pdf" onChange={e => { const f = e.target.files?.[0]; if (f) void parseUpload(f); }} style={{ marginTop: '8px', width: '100%' }} />
              <p style={{ marginTop: '8px', lineHeight: 1.5 }}>После загрузки Excel или PDF будет выполнено сопоставление с выбранными показателями (прототип).</p>
            </div>
          </div>
        </div>

        {diff && diff.length > 0 && (
          <div className="card" style={{ marginTop: '16px', background: '#fff' }}>
            <div className="section-title">Расхождения с данными ЦАС</div>
            <div style={{ overflowX: 'auto', marginTop: '10px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px' }}>
                <thead>
                  <tr style={{ background: '#f3eeec', color: '#155EA4' }}>
                    {['Показатель', 'ЦАС', 'В отчёте', '|Δ|', 'Δ%', 'Предполагаемая причина'].map(h => (
                      <th key={h} style={{ textAlign: 'left', padding: '8px' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {diff.map((r, i) => (
                    <tr key={i}>
                      <td style={{ padding: '6px', borderTop: '1px solid #eee' }}>{r.indicator}</td>
                      <td style={{ padding: '6px', borderTop: '1px solid #eee' }}>{r.cas}</td>
                      <td style={{ padding: '6px', borderTop: '1px solid #eee' }}>{r.file}</td>
                      <td style={{ padding: '6px', borderTop: '1px solid #eee' }}>{r.abs}</td>
                      <td style={{ padding: '6px', borderTop: '1px solid #eee' }}>{r.pct}</td>
                      <td style={{ padding: '6px', borderTop: '1px solid #eee', color: '#4a5568' }}>{r.reason}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div className="card" style={{ marginTop: '16px', background: '#fff' }}>
          <div className="section-title">Mind map выбранных показателей</div>
          <div ref={mindRef} style={{ marginTop: '12px', padding: '16px', background: '#faf7f6', borderRadius: '12px', border: '1px solid rgba(21,94,164,0.15)' }}>
            <div style={{ fontWeight: 800, color: '#155EA4', marginBottom: '12px' }}>ЦАС Жамбылская область</div>
            {REPORT_INDICATOR_GROUPS.map(g => (
              <div key={g.id} style={{ marginLeft: '12px', marginBottom: '8px', borderLeft: '3px solid #155EA4', paddingLeft: '10px' }}>
                <div style={{ fontWeight: 700, fontSize: '13px' }}>{g.label}</div>
                <ul style={{ margin: '4px 0 0 14px', fontSize: '12px', color: '#4a5568' }}>
                  {g.children.filter(c => sel[c.id]).map(c => <li key={c.id}>{c.label}</li>)}
                </ul>
              </div>
            ))}
          </div>
          <button type="button" className="tab-btn" style={{ marginTop: '10px', cursor: 'pointer' }} onClick={() => void exportMindPng()}>Экспорт mind map как PNG</button>
        </div>
      </div>

      {dialog && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 400, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
          <div className="card" style={{ maxWidth: '520px', width: '100%', maxHeight: '90vh', overflowY: 'auto' }}>
            <div className="section-title">Выберите формат</div>
            {(['xlsx', 'pdf', 'pptx', 'mind'] as const).map(fmt => (
              <div key={fmt} style={{ marginTop: '12px', padding: '12px', border: '1px solid rgba(21,94,164,0.2)', borderRadius: '10px', background: '#f9f4f3' }}>
                <div style={{ fontWeight: 700, color: '#155EA4' }}>{fmt === 'xlsx' ? 'Excel' : fmt === 'pdf' ? 'PDF' : fmt === 'pptx' ? 'PowerPoint' : 'Mind Map'}</div>
                <div style={{ fontSize: '11px', color: '#4a5568', marginTop: '4px' }}>{AI_HINTS[fmt]}</div>
                <button
                  type="button"
                  className="tab-btn active"
                  style={{ marginTop: '8px', cursor: 'pointer' }}
                  onClick={() => {
                    if (fmt === 'xlsx') downloadXlsx();
                    if (fmt === 'pdf') downloadPdf();
                    if (fmt === 'pptx') void downloadPptx();
                    if (fmt === 'mind') void exportMindPng();
                    setDialog(false);
                  }}
                >
                  Скачать
                </button>
              </div>
            ))}
            <button type="button" className="tab-btn" style={{ marginTop: '12px', cursor: 'pointer' }} onClick={() => setDialog(false)}>Отмена</button>
          </div>
        </div>
      )}
    </div>
  );
}
