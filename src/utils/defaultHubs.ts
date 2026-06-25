import { Hub } from '../types';

export const DEFAULT_HUBS: Hub[] = [
  {
    id: 'astana',
    name: 'Астана хабы',
    lat: 51.169,
    lng: 71.449,
    x: 35,
    y: 35,
    address: 'Өндіріс көшесі, 112, Астана қ.',
    reservoirs: [
      { id: 'T-AST-01', name: 'Резервуар А-01', fuel: 'АИ-95 Premium', volume: 1650, capacity: 2000, waterLevel: 2.1, temperature: 14.5, density: 742, pressure: 101.3, isOpen: true, lastUpdated: '12:00' },
      { id: 'T-AST-02', name: 'Резервуар А-02', fuel: 'АИ-92 Standard', volume: 1850, capacity: 2000, waterLevel: 1.4, temperature: 15.1, density: 730, pressure: 101.1, isOpen: true, lastUpdated: '12:45' },
      { id: 'T-AST-03', name: 'Резервуар А-03', fuel: 'ДТ Летний', volume: 2400, capacity: 3000, waterLevel: 4.2, temperature: 16.8, density: 835, pressure: 101.9, isOpen: true, lastUpdated: '11:30' },
      { id: 'T-AST-04', name: 'Резервуар А-04', fuel: 'Jet A-1', volume: 1100, capacity: 1500, waterLevel: 0.8, temperature: 10.2, density: 775, pressure: 100.8, isOpen: true, lastUpdated: '13:00' },
      { id: 'T-AST-05', name: 'Резервуар А-05', fuel: 'ТС-1', volume: 600, capacity: 1000, waterLevel: 6.8, temperature: 12.3, density: 780, pressure: 101.4, isOpen: false, lastUpdated: '10:55' },
    ]
  },
  {
    id: 'almaty',
    name: 'Алматы хабы (Бас филиал)',
    lat: 43.238,
    lng: 76.889,
    x: 65,
    y: 75,
    address: 'Райымбек даңғылы, 417А, Алматы қ.',
    reservoirs: [
      { id: 'T-ALA-01', name: 'Резервуар №01', fuel: 'Jet A-1', volume: 2750, capacity: 3000, waterLevel: 1.1, temperature: 13.4, density: 775, pressure: 101.1, isOpen: true, lastUpdated: '14:26' },
      { id: 'T-ALA-02', name: 'Резервуар №02', fuel: 'ТС-1', volume: 1800, capacity: 3000, waterLevel: 2.3, temperature: 14.1, density: 780, pressure: 101.3, isOpen: true, lastUpdated: '14:26' },
      { id: 'T-ALA-03', name: 'Резервуар №03', fuel: 'АИ-95 Premium', volume: 1600, capacity: 2000, waterLevel: 5.5, temperature: 16.2, density: 745, pressure: 101.5, isOpen: true, lastUpdated: '14:26' },
      { id: 'T-ALA-04', name: 'Резервуар №04', fuel: 'АИ-92 Standard', volume: 1420, capacity: 2000, waterLevel: 3.4, temperature: 15.8, density: 730, pressure: 101.2, isOpen: true, lastUpdated: '14:26' },
      { id: 'T-ALA-05', name: 'Резервуар №05', fuel: 'ДТ Летний', volume: 850, capacity: 1000, waterLevel: 0.5, temperature: 18.1, density: 840, pressure: 102.1, isOpen: true, lastUpdated: '14:26' },
      { id: 'T-ALA-06', name: 'Резервуар №06', fuel: 'ДТ-З Зимний', volume: 440, capacity: 1000, waterLevel: 1.2, temperature: 4.5, density: 835, pressure: 102.4, isOpen: true, lastUpdated: '14:26' },
      { id: 'T-ALA-07', name: 'Резервуар №07', fuel: 'АИ-92 Standard', volume: 910, capacity: 1000, waterLevel: 8.4, temperature: 17.5, density: 730, pressure: 101.4, isOpen: true, lastUpdated: '14:26' },
      { id: 'T-ALA-08', name: 'Резервуар №08', fuel: 'АИ-95 Premium', volume: 720, capacity: 1000, waterLevel: 0.9, temperature: 16.5, density: 745, pressure: 101.3, isOpen: true, lastUpdated: '14:26' },
      { id: 'T-ALA-09', name: 'Резервуар №09', fuel: 'Jet A-1', volume: 830, capacity: 1000, waterLevel: 1.5, temperature: 13.9, density: 775, pressure: 101.2, isOpen: true, lastUpdated: '14:26' },
      { id: 'T-ALA-10', name: 'Резервуар №10', fuel: 'ТС-1', volume: 550, capacity: 1000, waterLevel: 0.2, temperature: 14.0, density: 780, pressure: 101.5, isOpen: true, lastUpdated: '14:26' },
      { id: 'T-ALA-11', name: 'Резервуар №11', fuel: 'РТ Керосин', volume: 780, capacity: 1000, waterLevel: 2.1, temperature: 13.8, density: 782, pressure: 101.6, isOpen: false, lastUpdated: '14:26' },
      { id: 'T-ALA-12', name: 'Резервуар №12', fuel: 'АИ-92 Standard', volume: 880, capacity: 1000, waterLevel: 1.0, temperature: 17.2, density: 730, pressure: 101.3, isOpen: true, lastUpdated: '14:26' },
      { id: 'T-ALA-13', name: 'Резервуар №13', fuel: 'ДТ Летний', volume: 920, capacity: 1000, waterLevel: 4.8, temperature: 18.5, density: 840, pressure: 102.2, isOpen: true, lastUpdated: '14:26' }
    ]
  },
  {
    id: 'dostyk',
    name: 'Достық хабы (Шығыс шекара)',
    lat: 45.250,
    lng: 82.300,
    x: 80,
    y: 40,
    address: 'Шығыс шекара секторы, Достық ауылы',
    reservoirs: [
      { id: 'T-DOS-01', name: 'Резервуар Д-01', fuel: 'ТС-1', volume: 1950, capacity: 2000, waterLevel: 0.5, temperature: 11.2, density: 780, pressure: 101.2, isOpen: true, lastUpdated: '15:10' },
      { id: 'T-DOS-02', name: 'Резервуар Д-02', fuel: 'РТ Керосин', volume: 1800, capacity: 2000, waterLevel: 1.8, temperature: 11.9, density: 782, pressure: 101.5, isOpen: true, lastUpdated: '15:20' },
      { id: 'T-DOS-03', name: 'Резервуар Д-03', fuel: 'ДТ-З Зимний', volume: 1440, capacity: 1500, waterLevel: 7.2, temperature: -2.4, density: 835, pressure: 103.1, isOpen: true, lastUpdated: '14:55' },
      { id: 'T-DOS-04', name: 'Резервуар Д-04', fuel: 'АИ-92 Standard', volume: 850, capacity: 1000, waterLevel: 1.1, temperature: 16.4, density: 730, pressure: 101.4, isOpen: true, lastUpdated: '15:30' },
      { id: 'T-DOS-05', name: 'Резервуар Д-05', fuel: 'АИ-95 Premium', volume: 920, capacity: 1000, waterLevel: 0.9, temperature: 15.9, density: 745, pressure: 101.2, isOpen: false, lastUpdated: '13:40' }
    ]
  }
];
