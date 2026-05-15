/** ЦАС Жамбылская область — агрегированные мок-данные для дашбордов */

export const JAMBYL_DISTRICT_OPTIONS = [
  { id: 'taraz', name: 'г. Тараз' },
  { id: 'baizak', name: 'Байзакский' },
  { id: 'zhambyl', name: 'Жамбылский' },
  { id: 'zhualy', name: 'Жуалынский' },
  { id: 'merke', name: 'Меркенский' },
  { id: 'sarysu', name: 'Сарысуский' },
  { id: 'moiynkum', name: 'Мойынқумский' },
  { id: 'ryskulov', name: 'Т. Рыскуловский' },
  { id: 'shu', name: 'Шуский' },
  { id: 'talas', name: 'Таласский' },
  { id: 'korday', name: 'Кордайский' },
  { id: 'zhanatas', name: 'Жанатасская Г.А.' },
] as const;

export const APPEALS109_KPI = {
  total: 431_657,
  completed: 403_306,
  inProgress: 12_063,
  distribution: 886,
  deleted: 15_400,
  unresolvedShare: 6.57,
  slaText: '4 дня 22 ч 31 мин',
  worstAddress: 'проспект Толе би',
  worstAddressCount: 3318,
};

export const APPEALS_REASONS_PIE = [
  { name: 'СПРАВОЧНАЯ ИНФОРМАЦИЯ', value: 36.4, color: '#155EA4' },
  { name: 'ЭЛЕКТРОСНАБЖЕНИЕ', value: 10.9, color: '#fb6340' },
  { name: 'COVID-19', value: 8.6, color: '#7b61ff' },
  { name: 'ОБЩЕСТВЕННОЕ РАЗВИТИЕ', value: 6.5, color: '#2dce89' },
  { name: 'ВЕТСЕРВИС', value: 6.2, color: '#d4a000' },
  { name: 'УЛИЧНОЕ ОСВЕЩЕНИЕ', value: 3.9, color: '#0fa8c4' },
  { name: 'ВОДОСНАБЖЕНИЕ', value: 3.8, color: '#11cdef' },
  { name: 'ДОРОЖНАЯ ИНФРАСТРУКТУРА', value: 2.9, color: '#f5365c' },
  { name: 'Прочее', value: 20.8, color: '#a0aec0' },
];

export const APPEALS_TYPES_PIE = [
  { name: 'консультация', value: 56.8, color: '#155EA4' },
  { name: 'инцидент', value: 40.8, color: '#fb6340' },
  { name: 'жалоба', value: 1.6, color: '#f5365c' },
  { name: 'предложение', value: 0.6, color: '#2dce89' },
  { name: 'благодарность', value: 0.2, color: '#d4a000' },
];

/** Количество обращений по районам (убывание) */
export const APPEALS_BY_DISTRICT = [
  { district: 'г. Тараз', count: 128420 },
  { district: 'Жуалынский', count: 42180 },
  { district: 'Байзакский', count: 38420 },
  { district: 'Т. Рыскуловский', count: 35210 },
  { district: 'Меркенский', count: 31840 },
  { district: 'Жамбылский', count: 28620 },
  { district: 'Шуский', count: 24100 },
  { district: 'Сарысуский', count: 19880 },
  { district: 'Мойынқумский', count: 17240 },
  { district: 'Кордайский', count: 15420 },
  { district: 'Таласский', count: 12880 },
  { district: 'Жанатасская Г.А.', count: 8447 },
];

const daySeed = (i: number) => {
  const base = 900 + (i % 17) * 120 + ((i * 13) % 400);
  return base;
};

export const APPEALS_TIMELINE_DAILY = Array.from({ length: 45 }, (_, i) => ({
  day: `${String((i % 28) + 1).padStart(2, '0')}.${String(((Math.floor(i / 28) + 3) % 12) + 1).padStart(2, '0')}`,
  appeals: daySeed(i),
}));

export interface AnomalyRow {
  category: string;
  factDay: number;
  usualDay: number;
  winter: number;
  spring: number;
  summer: number;
  autumn: number;
  deviationPct: number;
  status: string;
}

function mulberry32(a: number) {
  return function () {
    let t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const CATEGORIES = [
  'ЖКХ — отопление',
  'ЖКХ — вода',
  'Освещение',
  'Дороги',
  'Мусор / ТБО',
  'Электроснабжение',
  'Благоустройство',
  'Шум',
  'Вандализм',
  'Транспорт',
  'Образование',
  'Здравоохранение',
  'Соцзащита',
  'Безопасность',
  'Связь и интернет',
];

export function buildAnomalyDataset(count = 4200): AnomalyRow[] {
  const rnd = mulberry32(0xca5);
  const rows: AnomalyRow[] = [];
  for (let i = 0; i < count; i++) {
    const cat = `${CATEGORIES[i % CATEGORIES.length]} (${1 + ((i * 7) % 4)} квартал)`;
    const usual = 8 + Math.floor(rnd() * 40);
    const seasonal = {
      winter: usual * (0.7 + rnd() * 0.5),
      spring: usual * (0.85 + rnd() * 0.4),
      summer: usual * (0.9 + rnd() * 0.55),
      autumn: usual * (0.8 + rnd() * 0.45),
    };
    const fact = Math.max(0, Math.round(usual * (0.4 + rnd() * 2.2)));
    const deviationPct = usual > 0 ? Math.round(((fact - usual) / usual) * 1000) / 10 : 0;
    const absDev = Math.abs(fact - usual);
    let status = 'Норма';
    if (deviationPct > 200 || absDev > 20) status = 'Сильная аномалия';
    else if (deviationPct > 100) status = 'Выше нормы';
    else if (deviationPct > 50) status = 'Немного выше';
    rows.push({
      category: cat,
      factDay: fact,
      usualDay: Math.round(usual * 10) / 10,
      winter: Math.round(seasonal.winter * 10) / 10,
      spring: Math.round(seasonal.spring * 10) / 10,
      summer: Math.round(seasonal.summer * 10) / 10,
      autumn: Math.round(seasonal.autumn * 10) / 10,
      deviationPct,
      status,
    });
  }
  return rows.sort((a, b) => Math.abs(b.deviationPct) - Math.abs(a.deviationPct));
}

export const ANOMALIES_MOCK = buildAnomalyDataset(4200);

export const APPEALS_BUBBLES = [
  { lat: 44.218, lng: 72.872, count: 3318, title: 'проспект Толе би', detail: '3318 обращений за период' },
  { lat: 44.225, lng: 72.888, count: 1820, title: 'ул. Толе би / Абая', detail: '1820 обращений' },
  { lat: 44.208, lng: 72.858, count: 1240, title: 'мкр. Камажай', detail: '1240 обращений' },
  { lat: 44.232, lng: 72.895, count: 980, title: 'пр. Жибек жолы', detail: '980 обращений' },
  { lat: 44.395, lng: 72.644, count: 640, title: 'с. Байзак центр', detail: '640 обращений' },
  { lat: 43.87, lng: 72.215, count: 720, title: 'Жуалы — центр', detail: '720 обращений' },
  { lat: 44.148, lng: 72.192, count: 410, title: 'Мерке', detail: '410 обращений' },
  { lat: 44.105, lng: 73.84, count: 280, title: 'Сарысу', detail: '280 обращений' },
  { lat: 44.852, lng: 72.88, count: 220, title: 'Мойынқум', detail: '220 обращений' },
  { lat: 44.385, lng: 73.155, count: 360, title: 'Жамбылский р-н', detail: '360 обращений' },
];

export const APPEALS_HEAT = APPEALS_BUBBLES.flatMap(b =>
  Array.from({ length: 6 }, (_, k) => ({
    lat: b.lat + (k - 3) * 0.008,
    lng: b.lng + (k % 2) * 0.006,
    intensity: Math.min(1, 0.35 + b.count / 4000),
  })),
);

export const REPEAT_APPEALS = [
  { key: '+7 726 ***-42-18', address: 'ул. Абая, 12', cnt: 5, period: '7 дней' },
  { key: '+7 747 ***-91-03', address: 'пр. Толе би, 84', cnt: 4, period: '7 дней' },
  { key: '+7 701 ***-22-66', address: 'мкр. Астана, 3/2', cnt: 3, period: '7 дней' },
  { key: '+7 775 ***-08-14', address: 'с. Каратау, ул. Мира, 2', cnt: 3, period: '7 дней' },
  { key: '+7 707 ***-55-90', address: 'ул. Байзак батыра, 40', cnt: 3, period: '7 дней' },
];

export const MOCK_PASSPORT = {
  iin: '900101300123',
  fio: 'Иванов Иван Иванович',
  birth: '01.01.1990',
  address: 'г. Тараз, пр. Жибек жолы, 24, кв. 15',
  family: 'Супруга, 2 детей (7 и 11 лет)',
  convictions: 'Нет судимостей',
  diseases: 'Гипертония I ст. (диспансерный учёт)',
  appeals109: 6,
  employment: 'Официально трудоустроен, ТОО «Жамбыл Логистик»',
  disability: 'Нет',
  phone: '+7 707 123 45 67',
};

export interface MockAppealRecord {
  id: string;
  date: string;
  topic: string;
  status: string;
  district: string;
}

export function mockAppealsForPhone(phone: string): MockAppealRecord[] {
  void phone;
  const topics = ['Электроснабжение', 'Вода', 'Мусор', 'Справка', 'Дороги', 'Освещение'];
  const stats = ['Завершено', 'В работе', 'На распределении'];
  return Array.from({ length: 37 }, (_, i) => ({
    id: `109-${2025}${String(i + 1).padStart(5, '0')}`,
    date: `2025-${String((i % 9) + 1).padStart(2, '0')}-${String((i % 27) + 1).padStart(2, '0')} ${String(9 + (i % 8)).padStart(2, '0')}:${String((i * 5) % 60).padStart(2, '0')}`,
    topic: topics[i % topics.length],
    status: stats[i % stats.length],
    district: JAMBYL_DISTRICT_OPTIONS[i % JAMBYL_DISTRICT_OPTIONS.length].name,
  })).sort((a, b) => b.date.localeCompare(a.date));
}

/** Дерево показателей для конструктора (сокращённый прототип, структура как в ЦАС) */
export const REPORT_INDICATOR_GROUPS = [
  {
    id: 'gov',
    label: 'Аппарат акима',
    children: [
      { id: 'g1', label: 'Исполнение поручений Главы государства, %' },
      { id: 'g2', label: 'Индекс удовлетворённости населения услугами' },
      { id: 'g3', label: 'Доля обращений 109, закрытых в срок SLA' },
    ],
  },
  {
    id: 'health',
    label: 'Управление здравоохранения',
    children: [
      { id: 'h1', label: 'Коэффициент детской смертности на 1000 родившихся' },
      { id: 'h2', label: 'Смертность от злокачественных новообразований на 100 тыс.' },
      { id: 'h3', label: 'Ранняя выявляемость онкологии 0–1 ст., %' },
      { id: 'h4', label: 'Доля дистанционных медицинских услуг, %' },
    ],
  },
  {
    id: 'edu',
    label: 'Управление образования',
    children: [
      { id: 'e1', label: 'Охват дошкольным образованием, %' },
      { id: 'e2', label: 'Доля трёхсменных школ, %' },
      { id: 'e3', label: 'Доля аварийных зданий школ, %' },
    ],
  },
  {
    id: 'econ',
    label: 'Экономика и бюджет',
    children: [
      { id: 'ec1', label: 'ВРП на душу населения, тыс. тг' },
      { id: 'ec2', label: 'Исполнение областного бюджета, %' },
      { id: 'ec3', label: 'Инвестиции в основной капитал, млрд тг' },
    ],
  },
];

export const CAS_BASELINE_VALUES: Record<string, number> = {
  g1: 94.2,
  g2: 72.5,
  g3: 88.0,
  h1: 8.4,
  h2: 62.1,
  h3: 68.0,
  h4: 31.0,
  e1: 96.2,
  e2: 8.4,
  e3: 4.1,
  ec1: 892.4,
  ec2: 97.8,
  ec3: 124.6,
};
