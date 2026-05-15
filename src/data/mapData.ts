export type MarkerType =
  | 'hospital' | 'clinic' | 'pharmacy' | 'ambulance'
  | 'school' | 'kindergarten' | 'college'
  | 'police' | 'fire'
  | 'accident' | 'incident'
  | 'farm' | 'field' | 'greenhouse'
  | 'factory' | 'power' | 'gas' | 'water_tower' | 'heat_station'
  | 'camera' | 'sensor' | 'weather_station'
  | 'park' | 'forest' | 'reservoir'
  | 'procurement' | 'office'
  | 'social_risk' | 'rehab_center'
  | 'land_plot';

export interface MapMarker {
  id: string;
  lat: number;
  lng: number;
  type: MarkerType;
  name: string;
  status?: 'ok' | 'warning' | 'critical';
  kpis?: { label: string; value: string; color?: string }[];
}

export interface MapDistrict {
  id: string;
  name: string;
  coords: [number, number][];
  value: number;
  status: 'ok' | 'warning' | 'critical';
  stats?: { label: string; value: string }[];
}

export interface HeatPoint {
  lat: number;
  lng: number;
  intensity: number;
}

export const CENTER: [number, number] = [44.222, 72.868];

export const DISTRICTS: MapDistrict[] = [
  {
    id: 'taraz',
    name: 'г. Тараз',
    coords: [[44.17, 72.78], [44.17, 72.96], [44.27, 72.96], [44.27, 72.78]],
    value: 78,
    status: 'warning',
    stats: [
      { label: 'Население', value: '378 тыс.' },
      { label: 'Обращений 109', value: '318 / сут.' },
      { label: 'Инцидентов', value: '14 акт.' },
      { label: 'Безработица', value: '3.4%' },
      { label: 'Бюджет освоен', value: '92%' },
    ],
  },
  {
    id: 'baizak',
    name: 'Байзакский р-н',
    coords: [[44.27, 72.42], [44.27, 72.78], [44.52, 72.78], [44.52, 72.42]],
    value: 42,
    status: 'critical',
    stats: [
      { label: 'Население', value: '84 тыс.' },
      { label: 'Обращений 109', value: '48 / сут.' },
      { label: 'Инцидентов', value: '7 акт.' },
      { label: 'Безработица', value: '5.1%' },
      { label: 'Бюджет освоен', value: '71%' },
    ],
  },
  {
    id: 'zhambyl',
    name: 'Жамбылский р-н',
    coords: [[44.27, 72.96], [44.27, 73.34], [44.52, 73.34], [44.52, 72.96]],
    value: 81,
    status: 'ok',
    stats: [
      { label: 'Население', value: '61 тыс.' },
      { label: 'Обращений 109', value: '32 / сут.' },
      { label: 'Инцидентов', value: '3 акт.' },
      { label: 'Безработица', value: '3.8%' },
      { label: 'Бюджет освоен', value: '88%' },
    ],
  },
  {
    id: 'merke',
    name: 'Меркенский р-н',
    coords: [[44.0, 71.88], [44.0, 72.42], [44.27, 72.42], [44.27, 71.88]],
    value: 65,
    status: 'warning',
    stats: [
      { label: 'Население', value: '72 тыс.' },
      { label: 'Обращений 109', value: '41 / сут.' },
      { label: 'Инцидентов', value: '5 акт.' },
      { label: 'Безработица', value: '4.2%' },
      { label: 'Бюджет освоен', value: '84%' },
    ],
  },
  {
    id: 'zhualy',
    name: 'Жуалынский р-н',
    coords: [[43.72, 71.88], [43.72, 72.42], [44.0, 72.42], [44.0, 71.88]],
    value: 38,
    status: 'critical',
    stats: [
      { label: 'Население', value: '54 тыс.' },
      { label: 'Обращений 109', value: '28 / сут.' },
      { label: 'Инцидентов', value: '9 акт.' },
      { label: 'Безработица', value: '5.8%' },
      { label: 'Бюджет освоен', value: '68%' },
    ],
  },
  {
    id: 'sarysu',
    name: 'Сарысуский р-н',
    coords: [[43.72, 73.34], [43.72, 74.18], [44.52, 74.18], [44.52, 73.34]],
    value: 88,
    status: 'ok',
    stats: [
      { label: 'Население', value: '38 тыс.' },
      { label: 'Обращений 109', value: '14 / сут.' },
      { label: 'Инцидентов', value: '1 акт.' },
      { label: 'Безработица', value: '2.8%' },
      { label: 'Бюджет освоен', value: '95%' },
    ],
  },
  {
    id: 'moiynkum',
    name: 'Мойынқумский р-н',
    coords: [[44.52, 72.42], [44.52, 73.34], [45.22, 73.34], [45.22, 72.42]],
    value: 72,
    status: 'ok',
    stats: [
      { label: 'Население', value: '29 тыс.' },
      { label: 'Обращений 109', value: '11 / сут.' },
      { label: 'Инцидентов', value: '2 акт.' },
      { label: 'Безработица', value: '3.1%' },
      { label: 'Бюджет освоен', value: '90%' },
    ],
  },
  {
    id: 'ryskulov',
    name: 'Т. Рыскуловский р-н',
    coords: [[43.72, 72.42], [43.72, 73.34], [44.0, 73.34], [44.0, 72.42]],
    value: 60,
    status: 'warning',
    stats: [
      { label: 'Население', value: '67 тыс.' },
      { label: 'Обращений 109', value: '38 / сут.' },
      { label: 'Инцидентов', value: '6 акт.' },
      { label: 'Безработица', value: '4.4%' },
      { label: 'Бюджет освоен', value: '82%' },
    ],
  },
];

const D = (id: string, lat: number, lng: number, type: MarkerType, name: string,
  status: MapMarker['status'], kpis: MapMarker['kpis']): MapMarker =>
  ({ id, lat, lng, type, name, status, kpis });

export const HEALTH_MARKERS: MapMarker[] = [
  D('h1', 44.215, 72.870, 'hospital', 'ГБ №1 г. Тараз', 'ok', [
    { label: 'Коек', value: '480' }, { label: 'Загрузка', value: '82%', color: '#ffd600' },
    { label: 'Врачей', value: '124' }, { label: 'Нагрузка', value: '1.4', color: '#ffd600' },
  ]),
  D('h2', 44.228, 72.892, 'hospital', 'Детская ОБ Тараз', 'warning', [
    { label: 'Коек', value: '280' }, { label: 'Загрузка', value: '94%', color: '#f5365c' },
    { label: 'Врачей', value: '86' }, { label: 'Нагрузка', value: '1.8', color: '#f5365c' },
  ]),
  D('h3', 44.198, 72.851, 'hospital', 'Онкодиспансер', 'critical', [
    { label: 'Коек', value: '180' }, { label: 'Загрузка', value: '112%', color: '#f5365c' },
    { label: 'Дефицит пр.', value: '14 позиций', color: '#f5365c' }, { label: 'Операций/мес', value: '84' },
  ]),
  D('h4', 44.380, 72.640, 'hospital', 'ЦРБ Байзакского р-на', 'critical', [
    { label: 'Коек', value: '120' }, { label: 'Загрузка', value: '108%', color: '#f5365c' },
    { label: 'Нагрузка', value: '2.1', color: '#f5365c' }, { label: 'Требуется врачей', value: '3' },
  ]),
  D('h5', 44.380, 73.160, 'hospital', 'ЦРБ Жамбылского р-на', 'ok', [
    { label: 'Коек', value: '98' }, { label: 'Загрузка', value: '74%', color: '#2dce89' },
    { label: 'Нагрузка', value: '0.9', color: '#2dce89' }, { label: 'Врачей', value: '42' },
  ]),
  D('h6', 44.148, 72.180, 'hospital', 'ЦРБ Меркенского р-на', 'warning', [
    { label: 'Коек', value: '88' }, { label: 'Загрузка', value: '88%', color: '#ffd600' },
    { label: 'Нагрузка', value: '1.4', color: '#ffd600' }, { label: 'Врачей', value: '34' },
  ]),
  D('h7', 43.870, 72.210, 'hospital', 'ЦРБ Жуалынского р-на', 'critical', [
    { label: 'Коек', value: '80' }, { label: 'Загрузка', value: '118%', color: '#f5365c' },
    { label: 'Нагрузка', value: '1.6', color: '#f5365c' }, { label: 'Требуется врачей', value: '3' },
  ]),
  D('h8', 44.105, 73.840, 'hospital', 'ЦРБ Сарысуского р-на', 'ok', [
    { label: 'Коек', value: '72' }, { label: 'Загрузка', value: '68%', color: '#2dce89' },
    { label: 'Нагрузка', value: '0.7', color: '#2dce89' }, { label: 'Врачей', value: '28' },
  ]),
  D('c1', 44.220, 72.862, 'clinic', 'Поликлиника №3, Тараз', 'ok', [
    { label: 'Приём/день', value: '420' }, { label: 'Очередь', value: '~18 мин' },
    { label: 'Участковых', value: '18' },
  ]),
  D('c2', 44.235, 72.880, 'clinic', 'Поликлиника №7, Тараз', 'warning', [
    { label: 'Приём/день', value: '380' }, { label: 'Очередь', value: '~42 мин', color: '#ffd600' },
    { label: 'Участковых', value: '14' },
  ]),
  D('c3', 44.208, 72.845, 'clinic', 'Городской КВД', 'ok', [
    { label: 'Приём/день', value: '180' }, { label: 'Очередь', value: '~12 мин' },
  ]),
  D('ph1', 44.218, 72.872, 'pharmacy', 'Аптека ОСМС №1', 'ok', [
    { label: 'Препаратов', value: '1 240' }, { label: 'Дефицит позиций', value: '8', color: '#ffd600' },
  ]),
  D('ph2', 44.232, 72.898, 'pharmacy', 'Аптека ОСМС №2', 'critical', [
    { label: 'Препаратов', value: '980' }, { label: 'Дефицит позиций', value: '21', color: '#f5365c' },
  ]),
];

export const EDUCATION_MARKERS: MapMarker[] = [
  D('s1', 44.212, 72.875, 'school', 'ШГ №1 им. Абая', 'ok', [
    { label: 'Учеников', value: '1 240' }, { label: 'Загрузка', value: '96%', color: '#2dce89' },
    { label: 'Смен', value: '2' }, { label: 'Учителей', value: '84' },
  ]),
  D('s2', 44.225, 72.888, 'school', 'СОШ №12 Тараз', 'critical', [
    { label: 'Учеников', value: '1 680' }, { label: 'Загрузка', value: '128%', color: '#f5365c' },
    { label: 'Смен', value: '3', color: '#f5365c' }, { label: 'Учителей', value: '92' },
  ]),
  D('s3', 44.195, 72.858, 'school', 'НИШ Тараз', 'ok', [
    { label: 'Учеников', value: '980' }, { label: 'Загрузка', value: '84%', color: '#2dce89' },
    { label: 'Смен', value: '1' }, { label: 'Учителей', value: '78' },
  ]),
  D('s4', 44.398, 72.640, 'school', 'СОШ №3 Байзакский', 'critical', [
    { label: 'Учеников', value: '840' }, { label: 'Загрузка', value: '112%', color: '#f5365c' },
    { label: 'Смен', value: '3', color: '#f5365c' }, { label: 'Аварийное состояние', value: 'Да', color: '#f5365c' },
  ]),
  D('s5', 44.145, 72.180, 'school', 'СОШ №1 Меркенский', 'warning', [
    { label: 'Учеников', value: '620' }, { label: 'Загрузка', value: '92%', color: '#ffd600' },
    { label: 'Смен', value: '2' }, { label: 'Учителей', value: '48' },
  ]),
  D('s6', 43.856, 72.190, 'school', 'СОШ №2 Жуалынский', 'critical', [
    { label: 'Учеников', value: '480' }, { label: 'Загрузка', value: '104%', color: '#f5365c' },
    { label: 'Аварийное состояние', value: 'Да', color: '#f5365c' }, { label: 'Смен', value: '2' },
  ]),
  D('s7', 44.385, 73.160, 'school', 'СОШ №1 Жамбылский', 'ok', [
    { label: 'Учеников', value: '540' }, { label: 'Загрузка', value: '82%', color: '#2dce89' },
    { label: 'Смен', value: '1' }, { label: 'Учителей', value: '42' },
  ]),
  D('k1', 44.218, 72.868, 'kindergarten', 'ДС №4 "Балбөбек"', 'ok', [
    { label: 'Детей', value: '180' }, { label: 'Загрузка', value: '88%', color: '#2dce89' },
    { label: 'Воспитателей', value: '18' },
  ]),
  D('k2', 44.232, 72.882, 'kindergarten', 'ДС №11 "Айгөлек"', 'warning', [
    { label: 'Детей', value: '220' }, { label: 'Загрузка', value: '112%', color: '#ffd600' },
    { label: 'Очередь', value: '84 чел.', color: '#ffd600' },
  ]),
  D('k3', 44.400, 72.620, 'kindergarten', 'ДС Байзакский №2', 'critical', [
    { label: 'Детей', value: '140' }, { label: 'Загрузка', value: '122%', color: '#f5365c' },
    { label: 'Очередь', value: '210 чел.', color: '#f5365c' },
  ]),
  D('co1', 44.222, 72.872, 'college', 'Жамбылский политехн. колледж', 'ok', [
    { label: 'Студентов', value: '2 840' }, { label: 'Специальностей', value: '28' },
    { label: 'Трудоустройство', value: '72%', color: '#2dce89' },
  ]),
];

export const ENERGY_MARKERS: MapMarker[] = [
  D('ps1', 44.220, 72.870, 'power', 'ПС-220кВ "Тараз"', 'ok', [
    { label: 'Мощность', value: '250 МВт' }, { label: 'Загрузка', value: '74%', color: '#2dce89' },
    { label: 'Износ', value: '42%' },
  ]),
  D('ps2', 44.380, 72.580, 'power', 'ПС-110кВ "Байзак"', 'warning', [
    { label: 'Мощность', value: '80 МВт' }, { label: 'Загрузка', value: '89%', color: '#ffd600' },
    { label: 'Износ', value: '68%', color: '#ffd600' },
  ]),
  D('ps3', 43.880, 72.200, 'power', 'ПС-110кВ "Жуалы"', 'critical', [
    { label: 'Мощность', value: '60 МВт' }, { label: 'Загрузка', value: '102%', color: '#f5365c' },
    { label: 'Износ', value: '78%', color: '#f5365c' },
  ]),
  D('gas1', 44.217, 72.867, 'gas', 'ГРС Тараз-1', 'ok', [
    { label: 'Давление', value: '4.2 МПа' }, { label: 'Подача', value: '1.84 м³/с' },
    { label: 'Износ', value: '38%', color: '#2dce89' },
  ]),
  D('gas2', 44.135, 72.195, 'gas', 'ГРС Меркенская', 'warning', [
    { label: 'Давление', value: '3.8 МПа' }, { label: 'Подача', value: '0.42 м³/с' },
    { label: 'Износ', value: '61%', color: '#ffd600' },
  ]),
  D('wt1', 44.215, 72.878, 'water_tower', 'НС-3 Водоканал Тараз', 'warning', [
    { label: 'Давление', value: '3.2 атм' }, { label: 'Износ труб', value: '72%', color: '#f5365c' },
    { label: 'Аварий/мес', value: '8', color: '#ffd600' },
  ]),
  D('hs1', 44.225, 72.875, 'heat_station', 'Котельная ЦТП №12', 'critical', [
    { label: 'Подача тепла', value: '82%', color: '#f5365c' }, { label: 'Износ', value: '74%', color: '#f5365c' },
    { label: 'Жалоб/мес', value: '48', color: '#f5365c' },
  ]),
  D('hs2', 44.385, 72.640, 'heat_station', 'Котельная Байзак', 'ok', [
    { label: 'Подача тепла', value: '96%', color: '#2dce89' }, { label: 'Износ', value: '48%' },
    { label: 'Жалоб/мес', value: '4' },
  ]),
  D('sie1', 44.286, 73.010, 'power', 'СЭС "Жамбыл-Солнце"', 'ok', [
    { label: 'Мощность', value: '48 МВт' }, { label: 'Выработка', value: '142 млн кВт·ч/год' },
    { label: 'КПД', value: '91%', color: '#2dce89' },
  ]),
];

export const TRANSPORT_MARKERS: MapMarker[] = [
  D('cam1', 44.218, 72.872, 'camera', 'Камера пр. Абая 12', 'ok', [
    { label: 'Статус', value: 'Онлайн' }, { label: 'Нарушений/день', value: '24' },
    { label: 'Превышений скор.', value: '18' },
  ]),
  D('cam2', 44.225, 72.888, 'camera', 'Камера ул. Толе би 45', 'ok', [
    { label: 'Статус', value: 'Онлайн' }, { label: 'Нарушений/день', value: '36' },
    { label: 'Распознавание', value: '98.4%' },
  ]),
  D('cam3', 44.208, 72.862, 'camera', 'Камера А-2 въезд', 'warning', [
    { label: 'Статус', value: 'Помехи', color: '#ffd600' }, { label: 'Нарушений/день', value: '84' },
    { label: 'Превышений скор.', value: '62' },
  ]),
  D('acc1', 44.216, 72.871, 'accident', 'ДТП-зона: пр. Жибек жолы', 'critical', [
    { label: 'ДТП за год', value: '42' }, { label: 'Погибло', value: '3', color: '#f5365c' },
    { label: 'Тип', value: 'Наезд на пешехода', color: '#f5365c' },
  ]),
  D('acc2', 44.222, 72.880, 'accident', 'ДТП-зона: А-2 км 124', 'critical', [
    { label: 'ДТП за год', value: '18' }, { label: 'Погибло', value: '8', color: '#f5365c' },
    { label: 'Тип', value: 'Выезд на встречку', color: '#f5365c' },
  ]),
  D('acc3', 44.198, 72.857, 'accident', 'ДТП-зона: пл. Ленина', 'warning', [
    { label: 'ДТП за год', value: '12' }, { label: 'Ранено', value: '14', color: '#ffd600' },
    { label: 'Тип', value: 'Столкновение' },
  ]),
  D('cam4', 44.395, 72.642, 'camera', 'Байзак: ул. Достык', 'ok', [
    { label: 'Статус', value: 'Онлайн' }, { label: 'Нарушений/день', value: '12' },
  ]),
  D('cam5', 43.870, 72.215, 'camera', 'Жуалы: ул. Центральная', 'critical', [
    { label: 'Статус', value: 'Не работает', color: '#f5365c' }, { label: 'Причина', value: 'Вандализм', color: '#f5365c' },
  ]),
  D('acc4', 43.875, 72.210, 'accident', 'ДТП-зона: Байзак–Жуалы', 'warning', [
    { label: 'ДТП за год', value: '9' }, { label: 'Тип', value: 'Опрокидывание' },
  ]),
];

export const AGRI_MARKERS: MapMarker[] = [
  D('f1', 44.420, 72.680, 'farm', 'КХ "Жамбыл Агро"', 'ok', [
    { label: 'Площадь', value: '2 840 га' }, { label: 'КРС', value: '420 гол.' },
    { label: 'Урожай', value: '4.2 т/га', color: '#2dce89' }, { label: 'Цифр. мониторинг', value: 'Да', color: '#2dce89' },
  ]),
  D('f2', 44.450, 72.980, 'farm', 'ТОО "Отырар Астык"', 'ok', [
    { label: 'Площадь', value: '1 240 га' }, { label: 'Культура', value: 'Пшеница' },
    { label: 'Урожай', value: '3.8 т/га', color: '#2dce89' },
  ]),
  D('f3', 43.870, 72.300, 'farm', 'КФХ "Жуалы Астык"', 'warning', [
    { label: 'Площадь', value: '480 га' }, { label: 'Культура', value: 'Ячмень' },
    { label: 'Субсидии', value: 'Оформлены' }, { label: 'Мониторинг', value: 'Частично', color: '#ffd600' },
  ]),
  D('f4', 44.140, 72.200, 'farm', 'ТОО "Меркен Овощи"', 'ok', [
    { label: 'Площадь', value: '320 га' }, { label: 'Культура', value: 'Свёкла, морковь' },
    { label: 'Полив', value: 'Капельный, 100%', color: '#2dce89' },
  ]),
  D('gh1', 44.218, 72.870, 'greenhouse', 'Теплицы АПК "Тараз Гринхаус"', 'ok', [
    { label: 'Площадь', value: '4.8 га' }, { label: 'Культура', value: 'Томат, огурец' },
    { label: 'Выход продукции', value: '840 т/год', color: '#2dce89' },
  ]),
  D('f5', 44.820, 72.900, 'farm', 'КХ "Мойынкум Мал"', 'ok', [
    { label: 'Площадь', value: '8 400 га' }, { label: 'Лошади', value: '240 гол.' },
    { label: 'Верблюды', value: '42 гол.' },
  ]),
  D('f6', 43.840, 73.050, 'farm', 'КХ "Рыскулов Астык"', 'warning', [
    { label: 'Площадь', value: '1 840 га' }, { label: 'Культура', value: 'Ячмень' },
    { label: 'Нарушений', value: '2', color: '#ffd600' },
  ]),
];

export const LAND_MARKERS: MapMarker[] = [
  D('lp1', 44.215, 72.875, 'land_plot', 'Участок ИЖС №А-142', 'ok', [
    { label: 'Площадь', value: '0.12 га' }, { label: 'Статус', value: 'Оформлен' },
    { label: 'Кадастровая ст.', value: '4.8 млн тг' },
  ]),
  D('lp2', 44.228, 72.890, 'land_plot', 'Участок ИЖС №А-228', 'warning', [
    { label: 'Площадь', value: '0.10 га' }, { label: 'Статус', value: 'В оформлении', color: '#ffd600' },
    { label: 'Срок ожидания', value: '28 дней', color: '#ffd600' },
  ]),
  D('lp3', 44.200, 72.855, 'land_plot', 'Участок под бизнес №Б-84', 'ok', [
    { label: 'Площадь', value: '0.48 га' }, { label: 'Статус', value: 'Оформлен' },
    { label: 'Вид использования', value: 'Торговля' },
  ]),
  D('lp4', 44.408, 72.648, 'land_plot', 'Спорный участок Байзак-14', 'critical', [
    { label: 'Площадь', value: '2.4 га' }, { label: 'Статус', value: 'Судебный спор', color: '#f5365c' },
    { label: 'В суде с', value: '2023-04-12', color: '#f5365c' },
  ]),
  D('lp5', 43.868, 72.220, 'land_plot', 'Пастбище общее №П-22', 'ok', [
    { label: 'Площадь', value: '1 240 га' }, { label: 'Статус', value: 'Зарегистрировано' },
    { label: 'Арендаторов', value: '8' },
  ]),
  D('lp6', 44.102, 73.850, 'land_plot', 'Свободный участок №С-48', 'ok', [
    { label: 'Площадь', value: '0.20 га' }, { label: 'Статус', value: 'Доступен для выдачи', color: '#2dce89' },
    { label: 'Целевое назначение', value: 'ИЖС' },
  ]),
];

export const ECOLOGY_MARKERS: MapMarker[] = [
  D('sen1', 44.218, 72.870, 'sensor', 'Датчик воздуха №1 — Центр Тараз', 'warning', [
    { label: 'AQI', value: '82', color: '#ffd600' }, { label: 'PM2.5', value: '28.4 мкг/м³', color: '#ffd600' },
    { label: 'PM10', value: '48.2 мкг/м³' }, { label: 'Обновление', value: '15 мин назад' },
  ]),
  D('sen2', 44.228, 72.888, 'sensor', 'Датчик воздуха №2 — Пром.зона', 'critical', [
    { label: 'AQI', value: '124', color: '#f5365c' }, { label: 'PM2.5', value: '48.2 мкг/м³', color: '#f5365c' },
    { label: 'PM10', value: '84.6 мкг/м³', color: '#f5365c' }, { label: 'Превышение ПДК', value: '1.7×', color: '#f5365c' },
  ]),
  D('fac1', 44.232, 72.896, 'factory', 'Завод "ТаразФосфор"', 'critical', [
    { label: 'Выбросы', value: '42.4 тыс. т/год', color: '#f5365c' }, { label: 'Жалоб', value: '284' },
    { label: 'Нарушений', value: '3 акт.', color: '#f5365c' },
  ]),
  D('fac2', 44.210, 72.860, 'factory', 'Завод "ЖамбылГипс"', 'warning', [
    { label: 'Выбросы', value: '18.2 тыс. т/год', color: '#ffd600' }, { label: 'Жалоб', value: '84' },
    { label: 'Нарушений', value: '1 акт.', color: '#ffd600' },
  ]),
  D('sen3', 44.148, 72.195, 'sensor', 'Датчик воздуха — Меркенский', 'ok', [
    { label: 'AQI', value: '45', color: '#2dce89' }, { label: 'PM2.5', value: '12.1 мкг/м³', color: '#2dce89' },
    { label: 'Статус', value: 'Хорошо', color: '#2dce89' },
  ]),
  D('sen4', 44.385, 72.640, 'sensor', 'Датчик воздуха — Байзакский', 'warning', [
    { label: 'AQI', value: '62', color: '#ffd600' }, { label: 'PM2.5', value: '18.4 мкг/м³', color: '#ffd600' },
    { label: 'Статус', value: 'Умеренно' },
  ]),
  D('res1', 44.380, 72.980, 'reservoir', 'Водохранилище Кировское', 'ok', [
    { label: 'Объём', value: '0.84 км³' }, { label: 'Заполненность', value: '78%', color: '#2dce89' },
    { label: 'Качество воды', value: 'Норма', color: '#2dce89' },
  ]),
  D('for1', 43.872, 72.218, 'forest', 'Жуалынский лесной массив', 'ok', [
    { label: 'Площадь', value: '12 400 га' }, { label: 'Пожарная опасность', value: 'Низкая', color: '#2dce89' },
  ]),
  D('wth1', 44.222, 72.870, 'weather_station', 'МС Тараз', 'ok', [
    { label: 'Темп.', value: '+22°C' }, { label: 'Влажность', value: '48%' },
    { label: 'Ветер', value: '4.2 м/с, ЮЗ' }, { label: 'Давление', value: '710 мм рт.ст.' },
  ]),
];

export const SOCIAL_MARKERS: MapMarker[] = [
  D('sr1', 44.222, 72.872, 'social_risk', 'Зона соцриска "мкр. Камажай"', 'critical', [
    { label: 'Семей', value: '142' }, { label: 'Детей', value: '384', color: '#f5365c' },
    { label: 'Уровень риска', value: 'Высокий', color: '#f5365c' }, { label: 'Соцработников', value: '4' },
  ]),
  D('sr2', 44.218, 72.865, 'social_risk', 'Зона соцриска "Тастак"', 'warning', [
    { label: 'Семей', value: '87' }, { label: 'Детей', value: '218', color: '#ffd600' },
    { label: 'Уровень риска', value: 'Средний', color: '#ffd600' }, { label: 'Соцработников', value: '3' },
  ]),
  D('sr3', 44.390, 72.650, 'social_risk', 'Зона соцриска Байзакский', 'critical', [
    { label: 'Семей', value: '123' }, { label: 'Детей', value: '298', color: '#f5365c' },
    { label: 'Уровень риска', value: 'Высокий', color: '#f5365c' },
  ]),
  D('rc1', 44.220, 72.875, 'rehab_center', 'Реабилитационный центр №1', 'ok', [
    { label: 'Мест', value: '120' }, { label: 'Занято', value: '98' },
    { label: 'Профессий', value: '14' }, { label: 'Трудоустройство', value: '68%', color: '#2dce89' },
  ]),
  D('rc2', 44.400, 72.630, 'rehab_center', 'РЦ Байзакского р-на', 'warning', [
    { label: 'Мест', value: '60' }, { label: 'Занято', value: '58' },
    { label: 'Очередь', value: '24 чел.', color: '#ffd600' },
  ]),
  D('sr4', 43.870, 72.210, 'social_risk', 'Зона соцриска Жуалынский', 'critical', [
    { label: 'Семей', value: '168' }, { label: 'Детей', value: '412', color: '#f5365c' },
    { label: 'Уровень риска', value: 'Высокий', color: '#f5365c' },
  ]),
];

export const PROCUREMENT_MARKERS: MapMarker[] = [
  D('po1', 44.222, 72.870, 'office', 'ГКП "Управление закупок" Тараз', 'ok', [
    { label: 'Закупок с нач.года', value: '1 284' }, { label: 'Объём', value: '8.4 млрд тг' },
    { label: 'Экономия', value: '0.62 млрд тг', color: '#2dce89' }, { label: 'Нарушений', value: '2' },
  ]),
  D('po2', 44.390, 72.640, 'office', 'Отдел закупок — Байзакский р-н', 'warning', [
    { label: 'Закупок с нач.года', value: '284' }, { label: 'Объём', value: '1.2 млрд тг' },
    { label: 'Несостоявш.', value: '18%', color: '#ffd600' }, { label: 'Нарушений', value: '4', color: '#ffd600' },
  ]),
  D('po3', 44.385, 73.155, 'office', 'Отдел закупок — Жамбылский р-н', 'ok', [
    { label: 'Закупок с нач.года', value: '142' }, { label: 'Объём', value: '0.48 млрд тг' },
    { label: 'Экономия', value: '4.8%', color: '#2dce89' },
  ]),
  D('po4', 44.140, 72.185, 'office', 'Отдел закупок — Меркенский р-н', 'ok', [
    { label: 'Закупок с нач.года', value: '168' }, { label: 'Объём', value: '0.62 млрд тг' },
    { label: 'Несостоявш.', value: '8%' },
  ]),
  D('po5', 43.860, 72.210, 'office', 'Отдел закупок — Жуалынский р-н', 'critical', [
    { label: 'Закупок с нач.года', value: '98' }, { label: 'Объём', value: '0.32 млрд тг' },
    { label: 'Несостоявш.', value: '28%', color: '#f5365c' }, { label: 'Нарушений', value: '6', color: '#f5365c' },
  ]),
];

export const HEAT_INCIDENTS: HeatPoint[] = [
  { lat: 44.218, lng: 72.870, intensity: 0.9 },
  { lat: 44.225, lng: 72.882, intensity: 0.7 },
  { lat: 44.210, lng: 72.862, intensity: 0.6 },
  { lat: 44.232, lng: 72.895, intensity: 0.8 },
  { lat: 44.200, lng: 72.878, intensity: 0.5 },
  { lat: 44.395, lng: 72.644, intensity: 0.7 },
  { lat: 44.402, lng: 72.638, intensity: 0.6 },
  { lat: 43.870, lng: 72.215, intensity: 0.8 },
  { lat: 43.862, lng: 72.208, intensity: 0.7 },
  { lat: 44.148, lng: 72.192, intensity: 0.5 },
  { lat: 44.852, lng: 72.880, intensity: 0.3 },
  { lat: 44.105, lng: 73.848, intensity: 0.2 },
  { lat: 43.850, lng: 73.070, intensity: 0.4 },
  { lat: 44.215, lng: 72.873, intensity: 0.8 },
  { lat: 44.220, lng: 72.866, intensity: 0.9 },
];

export const HEAT_HEALTH: HeatPoint[] = [
  { lat: 44.218, lng: 72.870, intensity: 0.85 },
  { lat: 44.228, lng: 72.892, intensity: 0.95 },
  { lat: 44.198, lng: 72.851, intensity: 0.9 },
  { lat: 44.380, lng: 72.640, intensity: 0.8 },
  { lat: 43.870, lng: 72.210, intensity: 0.85 },
  { lat: 44.148, lng: 72.180, intensity: 0.6 },
  { lat: 44.385, lng: 73.160, intensity: 0.3 },
  { lat: 44.105, lng: 73.840, intensity: 0.2 },
  { lat: 44.215, lng: 72.875, intensity: 0.7 },
  { lat: 44.232, lng: 72.882, intensity: 0.8 },
];

export const HEAT_ACCIDENTS: HeatPoint[] = [
  { lat: 44.216, lng: 72.871, intensity: 0.9 },
  { lat: 44.222, lng: 72.880, intensity: 0.85 },
  { lat: 44.198, lng: 72.857, intensity: 0.7 },
  { lat: 44.395, lng: 72.640, intensity: 0.6 },
  { lat: 43.875, lng: 72.210, intensity: 0.7 },
  { lat: 44.385, lng: 73.155, intensity: 0.3 },
  { lat: 44.148, lng: 72.190, intensity: 0.5 },
  { lat: 44.215, lng: 72.868, intensity: 0.8 },
];

export const HEAT_ECOLOGY: HeatPoint[] = [
  { lat: 44.218, lng: 72.870, intensity: 0.7 },
  { lat: 44.228, lng: 72.888, intensity: 1.0 },
  { lat: 44.232, lng: 72.896, intensity: 0.95 },
  { lat: 44.210, lng: 72.860, intensity: 0.6 },
  { lat: 44.148, lng: 72.195, intensity: 0.3 },
  { lat: 44.385, lng: 72.640, intensity: 0.45 },
  { lat: 43.870, lng: 72.215, intensity: 0.2 },
  { lat: 44.285, lng: 73.010, intensity: 0.1 },
];

export const HEAT_SOCIAL: HeatPoint[] = [
  { lat: 44.222, lng: 72.872, intensity: 0.9 },
  { lat: 44.218, lng: 72.865, intensity: 0.75 },
  { lat: 44.390, lng: 72.650, intensity: 0.85 },
  { lat: 43.870, lng: 72.210, intensity: 0.9 },
  { lat: 44.148, lng: 72.195, intensity: 0.5 },
  { lat: 44.385, lng: 73.155, intensity: 0.2 },
  { lat: 44.105, lng: 73.840, intensity: 0.15 },
  { lat: 43.850, lng: 73.060, intensity: 0.4 },
];

export const HEAT_AGRI: HeatPoint[] = [
  { lat: 44.42, lng: 72.68, intensity: 0.85 },
  { lat: 44.45, lng: 72.98, intensity: 0.7 },
  { lat: 43.87, lng: 72.30, intensity: 0.55 },
  { lat: 44.14, lng: 72.20, intensity: 0.5 },
  { lat: 44.82, lng: 72.90, intensity: 0.4 },
  { lat: 43.84, lng: 73.05, intensity: 0.45 },
  { lat: 44.30, lng: 73.05, intensity: 0.35 },
];

export const EMPLOYMENT_MARKERS: MapMarker[] = [
  D('cz1', 44.221, 72.874, 'office', 'ЦЗН г. Тараз', 'ok', [
    { label: 'Вакансий', value: '1 420' }, { label: 'Трудоустроено/мес', value: '284' },
  ]),
  D('cz2', 44.392, 72.642, 'office', 'ЦЗН Байзакский р-н', 'warning', [
    { label: 'Вакансий', value: '180' }, { label: 'Очередь', value: '84 чел.', color: '#d4a000' },
  ]),
  D('cz3', 44.146, 72.188, 'office', 'ЦЗН Меркенский р-н', 'ok', [
    { label: 'Вакансий', value: '210' }, { label: 'Ярмарки вакансий', value: '4 / год' },
  ]),
  D('cz4', 43.868, 72.212, 'office', 'ЦЗН Жуалынский р-н', 'critical', [
    { label: 'Вакансий', value: '92' }, { label: 'Безработица р-на', value: '5.8%', color: '#f5365c' },
  ]),
];

export const SOCIAL_MAP_MARKERS: MapMarker[] = [...SOCIAL_MARKERS, ...EMPLOYMENT_MARKERS];

export const ENERGY_PATHS: { positions: [number, number][]; color: string; weight?: number }[] = [
  { positions: [[44.215, 72.82], [44.28, 72.92], [44.35, 73.02]], color: '#2dce89', weight: 3 },
  { positions: [[44.215, 72.82], [44.18, 72.72], [44.12, 72.55]], color: '#ffd600', weight: 3 },
  { positions: [[44.38, 72.58], [44.45, 72.75], [44.52, 72.88]], color: '#f5365c', weight: 3 },
  { positions: [[44.217, 72.867], [44.30, 72.95], [44.38, 73.05]], color: '#ffd600', weight: 2 },
  { positions: [[44.135, 72.195], [44.05, 72.05], [43.95, 71.95]], color: '#2dce89', weight: 2 },
];

export const VET_MAP_MARKERS: MapMarker[] = [
  D('v1', 44.21, 72.87, 'office', 'Вет. пункт №1, Тараз', 'ok', [
    { label: 'Нагрузка', value: '84%' }, { label: 'Вакцинаций/мес.', value: '1 240' },
  ]),
  D('v2', 44.38, 72.60, 'office', 'Вет. пункт Байзакский', 'warning', [
    { label: 'Нагрузка', value: '112%' }, { label: 'Требует усиления', value: 'Да', color: '#d4a000' },
  ]),
  D('v3', 44.15, 73.08, 'office', 'Вет. пункт Жамбылский', 'ok', [
    { label: 'Нагрузка', value: '72%' },
  ]),
  D('v4', 44.25, 72.78, 'incident', 'Карантинная зона — бруцеллёз', 'critical', [
    { label: 'Статус', value: 'Карантин', color: '#f5365c' }, { label: 'Дата', value: '12.08.2024' },
  ]),
  D('v5', 44.31, 73.10, 'incident', 'Скотомогильник №4', 'warning', [
    { label: 'Состояние', value: 'Удовлетворительно' }, { label: 'Проверка', value: 'Просрочена', color: '#d4a000' },
  ]),
  D('v6', 44.19, 72.56, 'office', 'Вет. пункт Меркенский', 'ok', [
    { label: 'Нагрузка', value: '68%' },
  ]),
];

export const HEAT_DER: HeatPoint[] = [
  { lat: 44.22, lng: 72.87, intensity: 0.75 },
  { lat: 44.23, lng: 72.89, intensity: 0.82 },
  { lat: 44.39, lng: 72.64, intensity: 0.55 },
  { lat: 43.87, lng: 72.21, intensity: 0.68 },
];
