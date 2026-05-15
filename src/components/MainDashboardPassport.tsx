import React, { useState, useCallback } from 'react';
import { MOCK_PASSPORT, mockAppealsForPhone, type MockAppealRecord } from '../data/mockData';

const WMS_MOCK = 'https://e-jambyl.kz/geoserver/wms?SERVICE=WMS&REQUEST=GetFeatureInfo&LAYERS=cas:appeals109';

type KdpState = 'idle' | 'PENDING' | 'VALID' | 'INVALID' | 'TIMEOUT' | 'done';

export default function MainDashboardPassport() {
  const [iin, setIin] = useState('');
  const [err, setErr] = useState('');
  const [profile, setProfile] = useState<typeof MOCK_PASSPORT | null>(null);
  const [appeals, setAppeals] = useState<MockAppealRecord[]>([]);
  const [appPage, setAppPage] = useState(0);
  const [loadingAppeals, setLoadingAppeals] = useState(false);
  const [modal, setModal] = useState(false);
  const [kdpIin, setKdpIin] = useState('');
  const [kdpGoal, setKdpGoal] = useState('');
  const [kdpStatus, setKdpStatus] = useState<KdpState>('idle');
  const [kdpPassportActive, setKdpPassportActive] = useState(false);

  const search = () => {
    setErr('');
    if (!/^\d{12}$/.test(iin)) {
      setErr('ИИН должен содержать ровно 12 цифр');
      setProfile(null);
      setAppeals([]);
      return;
    }
    setProfile({ ...MOCK_PASSPORT, iin });
    setAppPage(0);
    setLoadingAppeals(true);
    void fetchAppealsMock(MOCK_PASSPORT.phone).then(list => {
      setAppeals(list);
      setLoadingAppeals(false);
    });
  };

  const pageAppeals = appeals.slice(appPage * 10, appPage * 10 + 10);
  const appPages = Math.ceil(appeals.length / 10) || 1;

  const sendKdp = useCallback(() => {
    setKdpStatus('PENDING');
    window.setTimeout(() => setKdpStatus('VALID'), 700);
    window.setTimeout(() => {
      const ok = /^\d{12}$/.test(kdpIin) && kdpGoal.trim().length > 3;
      if (!ok) {
        setKdpStatus('INVALID');
        window.setTimeout(() => setKdpStatus('idle'), 2000);
        return;
      }
      setKdpStatus('done');
      setKdpPassportActive(true);
      setModal(false);
    }, 2200);
  }, [kdpIin, kdpGoal]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      <div className="card" style={{ padding: '16px', background: '#EBDBD8', borderColor: 'rgba(21,94,164,0.2)' }}>
        <div className="section-title">Поиск по ИИН</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center', marginTop: '10px' }}>
          <input
            value={iin}
            onChange={e => setIin(e.target.value.replace(/\D/g, '').slice(0, 12))}
            placeholder="12 цифр ИИН"
            style={{ padding: '10px 12px', borderRadius: '8px', border: '1.5px solid #155EA4', width: '200px', fontSize: '14px' }}
          />
          <button type="button" className="tab-btn active" onClick={search} style={{ padding: '10px 18px', cursor: 'pointer' }}>Поиск</button>
          {err && <span style={{ color: '#f5365c', fontSize: '12px' }}>{err}</span>}
        </div>
      </div>

      {profile && (
        <>
          <div className="grid-2">
            <div className="card" style={{ background: '#EBDBD8' }}>
              <div className="section-title">Профиль гражданина</div>
              <div style={{ fontSize: '13px', lineHeight: 1.7, marginTop: '8px', color: '#1a1a2e' }}>
                <div><b>ФИО:</b> {profile.fio}</div>
                <div><b>ИИН:</b> {profile.iin}</div>
                <div><b>Дата рождения:</b> {profile.birth}</div>
                <div><b>Адрес:</b> {profile.address}</div>
                <div><b>Состав семьи:</b> {profile.family}</div>
                <div><b>Судимости:</b> {profile.convictions}</div>
                <div><b>Заболевания:</b> {profile.diseases}</div>
                <div><b>Обращения в 109:</b> {profile.appeals109}</div>
                <div><b>Занятость:</b> {profile.employment}</div>
                <div><b>Инвалидность:</b> {profile.disability}</div>
                <div><b>Телефон:</b> {profile.phone}</div>
              </div>
              <button type="button" className="tab-btn" style={{ marginTop: '12px', cursor: 'pointer' }} onClick={() => setModal(true)}>Записать на приём (КДП)</button>
            </div>
            <div className="card" style={{ background: '#EBDBD8' }}>
              <div className="section-title">ИИ-анализ профиля (прототип)</div>
              <p style={{ fontSize: '12px', color: '#4a5568', lineHeight: 1.65, marginTop: '8px' }}>
                <b>Возможная цель визита:</b> получение справки для работодателя или сопровождение по вопросу ЖКХ (история обращений по электроснабжению).{' '}
                <b>Риски:</b> хроническое заболевание в диспансерном учёте — рекомендован приоритетный приём; судимости отсутствуют; социальный профиль стабильный.
              </p>
              <div style={{ marginTop: '14px', padding: '12px', background: '#fff', borderRadius: '10px', border: '1px solid rgba(21,94,164,0.15)' }}>
                <div style={{ fontSize: '11px', color: '#155EA4', fontWeight: 700 }}>Интеграция 109 (мок WMS)</div>
                <div style={{ fontSize: '10px', color: '#8292a5', wordBreak: 'break-all', marginTop: '4px' }}>{WMS_MOCK}</div>
                {loadingAppeals ? <div style={{ marginTop: '8px', fontSize: '12px' }}>Загрузка обращений…</div> : (
                  <>
                    <table style={{ width: '100%', fontSize: '11px', marginTop: '10px', borderCollapse: 'collapse' }}>
                      <thead>
                        <tr style={{ color: '#155EA4' }}>
                          <th style={{ textAlign: 'left', padding: '4px' }}>№</th>
                          <th style={{ textAlign: 'left', padding: '4px' }}>Дата</th>
                          <th style={{ textAlign: 'left', padding: '4px' }}>Тема</th>
                          <th style={{ textAlign: 'left', padding: '4px' }}>Статус</th>
                          <th style={{ textAlign: 'left', padding: '4px' }}>Район</th>
                        </tr>
                      </thead>
                      <tbody>
                        {pageAppeals.map(a => (
                          <tr key={a.id}>
                            <td style={{ padding: '4px', borderTop: '1px solid #eee' }}>{a.id}</td>
                            <td style={{ padding: '4px', borderTop: '1px solid #eee' }}>{a.date}</td>
                            <td style={{ padding: '4px', borderTop: '1px solid #eee' }}>{a.topic}</td>
                            <td style={{ padding: '4px', borderTop: '1px solid #eee' }}>{a.status}</td>
                            <td style={{ padding: '4px', borderTop: '1px solid #eee' }}>{a.district}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px' }}>
                      <button type="button" className="tab-btn" disabled={appPage <= 0} onClick={() => setAppPage(p => Math.max(0, p - 1))}>←</button>
                      <span style={{ fontSize: '11px' }}>{appPage + 1} / {appPages}</span>
                      <button type="button" className="tab-btn" disabled={appPage >= appPages - 1} onClick={() => setAppPage(p => Math.min(appPages - 1, p + 1))}>→</button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '22px' }}>
            <span title="КДП получено" style={{ opacity: kdpPassportActive ? 1 : 0.35 }}>🪪</span>
            <span style={{ fontSize: '12px', color: '#4a5568' }}>{kdpPassportActive ? 'КДП получено — паспорт визита активен' : 'КДП не получено — пройдите бизнес-процесс'}</span>
          </div>
        </>
      )}

      {modal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
          <div className="card" style={{ maxWidth: '420px', width: '100%', background: '#fff' }}>
            <div className="section-title">Запись на приём — КДП</div>
            <label style={{ display: 'block', marginTop: '12px', fontSize: '12px', color: '#4a5568' }}>ИИН</label>
            <input value={kdpIin} onChange={e => setKdpIin(e.target.value.replace(/\D/g, '').slice(0, 12))} style={{ width: '100%', marginTop: '4px', padding: '8px', borderRadius: '8px', border: '1px solid #155EA4' }} />
            <label style={{ display: 'block', marginTop: '10px', fontSize: '12px', color: '#4a5568' }}>Цель запроса</label>
            <textarea value={kdpGoal} onChange={e => setKdpGoal(e.target.value)} rows={3} style={{ width: '100%', marginTop: '4px', padding: '8px', borderRadius: '8px', border: '1px solid rgba(21,94,164,0.25)', resize: 'vertical' }} />
            <div style={{ marginTop: '10px', fontSize: '11px', color: '#155EA4' }}>
              Статус:{' '}
              {kdpStatus === 'idle' && 'ожидание'}
              {kdpStatus === 'PENDING' && 'PENDING — отправка СМС'}
              {kdpStatus === 'VALID' && 'VALID — проверка данных'}
              {kdpStatus === 'INVALID' && 'INVALID — проверьте ИИН и цель'}
              {kdpStatus === 'TIMEOUT' && 'TIMEOUT'}
              {kdpStatus === 'done' && 'КДП получено'}
            </div>
            <div style={{ display: 'flex', gap: '10px', marginTop: '14px' }}>
              <button type="button" className="tab-btn active" style={{ flex: 1, cursor: 'pointer' }} onClick={sendKdp} disabled={kdpStatus === 'PENDING'}>Отправить СМС для получения КДП</button>
              <button type="button" className="tab-btn" style={{ cursor: 'pointer' }} onClick={() => { setModal(false); setKdpStatus('idle'); }}>Закрыть</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

async function fetchAppealsMock(phone: string): Promise<MockAppealRecord[]> {
  void phone;
  await new Promise(r => setTimeout(r, 600));
  return mockAppealsForPhone(phone);
}
