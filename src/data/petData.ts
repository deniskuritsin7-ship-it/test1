export interface PetDayData {
  logistics: string;
  logisticsPct: string;
  logisticsPctColor: string;
  eaten: string;
  eatenPct: string;
  eatenPctColor: string;
}

export interface PetRow {
  name: string;
  location: string;
  hungerBadge: string;
  hungerBadgeColor: string;
  days: Record<string, PetDayData>;
  isFull?: boolean;
}

export const mainTabs = [
  'Комиссия',
  'Фиксированный корм',
  'Тарифы на корм',
  'Калькулятор корма',
  'Стоимость возврата корма',
];

export const subTabs = ['Тарифы на еду', 'Тарифы на прогулки'];

export const petOptions = ['Собака', 'Котяра', 'Попугай', 'Хомяк', 'Жираф ⚡'];
export const shippingOptions = ['Ручное кормление', 'Автокормушка', 'Попросить друга'];
export const volumeOptions = ['0,01 - 0,2', '0,21 - 0,4', '0,41 - 0,6', '0,61 - 0,8', 'Более 1 кг'];

export const dates = [
  '2026-09-21', '2026-09-22', '2026-09-23', '2026-09-24', '2026-09-25',
  '2026-09-26', '2026-09-27', '2026-09-28', '2026-09-29', '2026-09-30'
];

export const dateLabels: Record<string, string> = {
  '2026-09-21': '21 сентября, понедельник',
  '2026-09-22': '22 сентября, вторник',
  '2026-09-23': '23 сентября, среда',
  '2026-09-24': '24 сентября, четверг',
  '2026-09-25': '25 сентября, пятница',
  '2026-09-26': '26 сентября, суббота',
  '2026-09-27': '27 сентября, воскресенье',
  '2026-09-28': '28 сентября, понедельник',
  '2026-09-29': '29 сентября, вторник',
  '2026-09-30': '30 сентября, среда',
};

export const generateDayData = (
  baseLogistics1: number,
  baseLogistics2: number,
  baseEaten1: number,
  baseEaten2: number,
  seed: number
): PetDayData => {
  const variation = (base: number, s: number) => Math.round(base * (0.7 + (s % 60) / 100));
  const l1 = variation(baseLogistics1, seed);
  const l2 = variation(baseLogistics2, seed + 1);
  const e1 = variation(baseEaten1 * 10, seed + 2) / 10;
  const e2 = variation(baseEaten2 * 10, seed + 3) / 10;
  const logisticsPct = Math.round(((l1 + l2) / (baseLogistics1 + baseLogistics2)) * 100);
  const eatenPct = Math.round(((e1 + e2) / (baseEaten1 + baseEaten2)) * 100);
  return {
    logistics: `${l1} / ${l2}`,
    logisticsPct: `${logisticsPct}%`,
    logisticsPctColor: logisticsPct > 120 ? 'bg-red-50 text-red-500' : 'bg-green-100 text-green-700',
    eaten: `${e1.toFixed(1)} / ${e2.toFixed(1)}`,
    eatenPct: `${eatenPct}%`,
    eatenPctColor: eatenPct > 120 ? 'bg-red-50 text-red-500' : 'bg-green-100 text-green-700',
  };
};

export const allPets: PetRow[] = [
  { name: 'Собака', location: 'У тебя дома', hungerBadge: '×2', hungerBadgeColor: 'bg-gray-100 text-gray-700', days: Object.fromEntries(dates.map((d, i) => [d, generateDayData(100, 80, 1, 0.8, i * 7)])) },
  { name: 'Котяра', location: 'У тебя дома', hungerBadge: 'Съест всё', hungerBadgeColor: 'bg-green-100 text-green-700', days: Object.fromEntries(dates.map((d, i) => [d, generateDayData(80, 70, 0.8, 0.8, i * 11 + 3)])) },
  { name: 'Попугай', location: 'У бабушки', hungerBadge: '×5', hungerBadgeColor: 'bg-gray-100 text-gray-700', days: Object.fromEntries(dates.map((d, i) => [d, generateDayData(60, 51, 1, 1, i * 13 + 5)])) },
  { name: 'Хомяк', location: 'У тебя дома', hungerBadge: '×1', hungerBadgeColor: 'bg-gray-100 text-gray-700', days: Object.fromEntries(dates.map((d, i) => [d, generateDayData(40, 35, 0.5, 0.5, i * 9 + 2)])) },
  { name: 'Жираф ⚡', location: 'Африка', hungerBadge: 'Пока сыт', hungerBadgeColor: 'bg-yellow-100 text-yellow-700', days: {}, isFull: true },
];
