export interface NewsItem {
  id: string;
  title: string;
  date: string;
  summary: string;
  category: string;
  imageUrl?: string;
  titleTranslations?: { kz: string; ru: string; en: string };
  summaryTranslations?: { kz: string; ru: string; en: string };
}

export interface Metric {
  id: string;
  title: string;
  value: string;
  trend: 'up' | 'down' | 'neutral';
  percentage: string;
}

export interface CalculationResult {
  month: string;
  volume: number;
  revenue: number;
}

export interface SpotRate {
  id: string;
  name: string;
  standard: string;
  statusLabel: string;
  price: number;
  trend: 'up' | 'down' | 'neutral';
  percentage: string;
}

export interface DeliveryRequest {
  id: string;
  station: string;
  fuel: string;
  amountTons: number;
  date: string;
  status: 'pending' | 'approved' | 'rejected';
  fuelId: string;
}

export interface SystemAlert {
  id: string;
  type: 'info' | 'warning' | 'error';
  text: string;
  date: string;
  isRead: boolean;
  username?: string;
  isGlobal?: boolean;
}

export interface RoutineTask {
  id: string;
  text: string;
  isCompleted: boolean;
  date: string;
}

export interface CompetitorRate {
  id: string;
  brand: string;
  ai92: number;
  ai95: number;
  dt: number;
}

export interface PriceHistoryLog {
  id: string;
  date: string;
  fuel: string;
  oldPrice: number;
  newPrice: number;
  changedBy: string;
  type: 'spot' | 'retail' | 'wholesale';
}

export interface ManagedPrice {
  id: string;
  category: string;       // Санат (мысалы: 'singapore', 'argus', 'smartme' немесе қолмен жазылған кез келген санат атауы)
  name: string;           // Өнім немесе марка атауы
  description: string;    // Сипаттамасы (Биржалық немесе өңірлік деректер бойынша анықтама)
  priceRetail: number;    // Бөлшек бағасы (₸ / тоннамен) - Кез келген санат үшін Тек осы баға басты индекс ретінде жүреді
  priceWholesale: number; // Көтерме бағасы (₸ / тоннамен) (Тек 'smartme' санаты үшін қолданылады)
  standard: string;       // Сапа стандарты (мысалы: 'EURO-5')
}

export interface Reservoir {
  id: string;
  name: string;
  fuel: string;
  volume: number;
  capacity: number;
  waterLevel: number;
  temperature: number;
  density: number;
  pressure: number;
  isOpen: boolean;
  lastUpdated: string;
}

export interface Hub {
  id: string;
  name: string;
  lat: number;
  lng: number;
  reservoirs: Reservoir[];
  x?: number;
  y?: number;
  address?: string;
}


