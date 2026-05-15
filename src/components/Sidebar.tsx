import React from 'react';

const NAV = [
  { id: 'main',         label: 'Главная панель акима',      icon: '⬡' },
  { id: 'health',       label: 'Здравоохранение',           icon: '♥' },
  { id: 'social',       label: 'Занятость и соцпрограммы',  icon: '◈' },
  { id: 'education',    label: 'Образование',               icon: '◉' },
  { id: 'energy',       label: 'Энергетика и ЖКХ',          icon: '⚡' },
  { id: 'transport',    label: 'Транспорт и дороги',        icon: '◎' },
  { id: 'agri',         label: 'Сельское хозяйство',        icon: '◆' },
  { id: 'vet',          label: 'Ветеринария',               icon: '◈' },
  { id: 'land',         label: 'Земельные отношения',       icon: '◇' },
  { id: 'ecology',      label: 'Природные ресурсы',         icon: '○' },
  { id: 'construction', label: 'Строительство и ГАСК',      icon: '◫' },
  { id: 'economy',      label: 'Экономика и бюджет',        icon: '◈' },
  { id: 'entrepreneur', label: 'Предпринимательство',       icon: '◆' },
  { id: 'finance',      label: 'Управление финансов',       icon: '◇' },
  { id: 'digital',      label: 'Цифровизация и архивы',     icon: '◎' },
  { id: 'tourism',      label: 'Туризм и спорт',            icon: '○' },
  { id: 'religion',     label: 'По делам религий',          icon: '◈' },
  { id: 'der',          label: 'Экон. расследования (ДЭР)', icon: '◫' },
  { id: 'procurement',  label: 'Госзакупки',                icon: '◫' },
  { id: 'reports',      label: 'Конструктор отчётов',       icon: '▤' },
];

interface SidebarProps {
  active: string;
  setActive: (id: string) => void;
  open: boolean;
  setOpen: (v: boolean) => void;
}

const ACCENT = '#155EA4';
const ACCENT_DARK = '#0e4a82';
const ACTIVE_BG = 'rgba(255,255,255,0.14)';
const HOVER_BG  = 'rgba(255,255,255,0.08)';

export default function Sidebar({ active, setActive, open, setOpen }: SidebarProps) {
  return (
    <div style={{
      position: 'fixed', left: 0, top: 0, bottom: 0, zIndex: 200,
      width: open ? '240px' : '60px',
      background: `linear-gradient(180deg, ${ACCENT} 0%, ${ACCENT_DARK} 100%)`,
      borderRight: 'none',
      boxShadow: '2px 0 16px rgba(21,94,164,0.22)',
      transition: 'width 0.25s ease',
      overflow: 'hidden',
      display: 'flex', flexDirection: 'column',
    }}>
      <div style={{
        height: '56px', display: 'flex', alignItems: 'center',
        padding: open ? '0 16px' : '0',
        justifyContent: open ? 'space-between' : 'center',
        borderBottom: '1px solid rgba(255,255,255,0.12)',
        flexShrink: 0,
        background: 'rgba(0,0,0,0.1)',
      }}>
        {open && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '30px', height: '30px', borderRadius: '8px',
              background: 'rgba(255,255,255,0.18)',
              border: '1.5px solid rgba(255,255,255,0.35)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '15px', flexShrink: 0, color: '#fff',
            }}>⬡</div>
            <div>
              <div style={{ fontSize: '13px', fontWeight: 700, color: '#ffffff', letterSpacing: '-0.2px' }}>ЦАС</div>
              <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.6)' }}>Жамбылская обл.</div>
            </div>
          </div>
        )}
        <button onClick={() => setOpen(!open)} style={{
          background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)',
          color: '#ffffff', cursor: 'pointer', fontSize: '14px',
          padding: '5px 8px', display: 'flex', alignItems: 'center',
          borderRadius: '6px', flexShrink: 0, lineHeight: 1,
          transition: 'background 0.15s',
        }}>
          {open ? '←' : '→'}
        </button>
      </div>

      <nav style={{ flex: 1, overflowY: 'auto', padding: '6px 0', overflowX: 'hidden' }}>
        {NAV.map(item => {
          const isActive = active === item.id;
          return (
            <button key={item.id} onClick={() => setActive(item.id)} style={{
              width: '100%', display: 'flex', alignItems: 'center',
              gap: '11px', padding: open ? '8px 16px' : '8px 0',
              justifyContent: open ? 'flex-start' : 'center',
              background: isActive ? ACTIVE_BG : 'transparent',
              border: 'none',
              borderLeft: isActive ? '3.5px solid #ffffff' : '3.5px solid transparent',
              borderRadius: '0', cursor: 'pointer',
              transition: 'all 0.15s', textAlign: 'left',
              color: isActive ? '#ffffff' : 'rgba(255,255,255,0.65)',
              fontFamily: 'Inter, sans-serif',
              whiteSpace: 'nowrap',
            }}
            onMouseEnter={e => { if (!isActive) (e.currentTarget as HTMLButtonElement).style.background = HOVER_BG; }}
            onMouseLeave={e => { if (!isActive) (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
            >
              <span style={{
                fontSize: '14px', flexShrink: 0,
                color: isActive ? '#ffffff' : 'rgba(255,255,255,0.55)',
                width: open ? 'auto' : '60px', textAlign: 'center',
              }}>
                {item.icon}
              </span>
              {open && (
                <span style={{
                  overflow: 'hidden', textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap', fontSize: '11.5px', fontWeight: isActive ? 600 : 400,
                }}>
                  {item.label}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {open && (
        <div style={{
          padding: '10px 16px',
          borderTop: '1px solid rgba(255,255,255,0.12)',
          flexShrink: 0,
          background: 'rgba(0,0,0,0.1)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#6effc0', fontWeight: 500 }}>
            <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#2dce89', display: 'inline-block', boxShadow: '0 0 6px #2dce89' }}></span>
            Система активна
          </div>
          <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.45)', marginTop: '3px' }}>
            {new Date().toLocaleString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
      )}
    </div>
  );
}
