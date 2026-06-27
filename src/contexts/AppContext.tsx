import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations, Lang, Role } from '../locales/translations';
import { SpotRate, DeliveryRequest, SystemAlert, RoutineTask, CompetitorRate, PriceHistoryLog, NewsItem, ManagedPrice } from '../types';
import { mockNews } from '../data';

export interface AppUser {
  username: string;
  fullName: string;
  role: Role;
  email: string;
  allowedTanks?: string[]; // Allowed Tank IDs
  permissionLevel?: 'view' | 'edit' | 'open_close' | 'full'; // Allowed permission action level
  password?: string; // Optional user password for simulated login
  emailNotificationsEnabled?: boolean; // Real-time email setting
  profileImage?: string; // Base64 profile avatar
}

export interface AuditLog {
  id: string;
  user: string;
  email: string;
  role: string;
  action: string;
  timestamp: string;
  fieldChanged?: string;
  oldValue?: string;
  newValue?: string;
  operationType?: 'CREATE' | 'READ' | 'UPDATE' | 'DELETE' | 'LOGIN' | 'LOGOUT';
}

export interface AdminEmail {
  id: string;
  from: string;
  to: string;
  subject: string;
  body: string;
  date: string;
}

interface AppContextType {
  lang: Lang;
  setLang: (l: Lang) => void;
  theme: 'light' | 'dark';
  setTheme: (t: 'light' | 'dark') => void;
  role: Role;
  setRole: (r: Role) => void;
  t: (key: keyof typeof translations.en) => string;
  
  // Auth states
  currentUser: AppUser | null;
  setCurrentUser: (u: AppUser | null) => void;
  loginUser: (username: string, password: string) => { success: boolean; error?: string };
  logoutUser: () => void;
  
  // Audit Logs
  auditLogs: AuditLog[];
  logUserAction: (
    actionText: string,
    fieldChanged?: string,
    oldValue?: string,
    newValue?: string,
    operationType?: 'CREATE' | 'READ' | 'UPDATE' | 'DELETE' | 'LOGIN' | 'LOGOUT'
  ) => void;
  
  // Simulated emails sent to admin
  adminEmails: AdminEmail[];
  deleteAdminEmail: (id: string) => void;
  
  // Spot Rates States & Actions (Top of Hero)
  spotRates: SpotRate[];
  addSpotRate: (rate: Omit<SpotRate, 'id'>) => void;
  updateSpotRate: (id: string, rate: Partial<SpotRate>) => void;
  deleteSpotRate: (id: string) => void;
  
  // Delivery Requests (Рұқсаттама жүйесі)
  deliveryRequests: DeliveryRequest[];
  addDeliveryRequest: (req: Omit<DeliveryRequest, 'id' | 'date' | 'status'>) => void;
  updateDeliveryStatus: (id: string, status: 'approved' | 'rejected') => void;
  
  // System Alerts (Орталықтандырылған дабыл)
  alerts: SystemAlert[];
  addAlert: (alert: Omit<SystemAlert, 'id' | 'date' | 'isRead'>) => void;
  markAlertAsRead: (id: string) => void;
  clearAllAlerts: () => void;
  
  // Routine Tasks (Тапсырмалар жүйесі)
  tasks: RoutineTask[];
  addTask: (text: string) => void;
  toggleTask: (id: string) => void;
  deleteTask: (id: string) => void;
  
  // Competitor Rates (Бәсекелестер мониторингі)
  competitorRates: CompetitorRate[];
  updateCompetitorRate: (id: string, updates: Partial<CompetitorRate>) => void;
  
  // Price Logs (Бағалар шежіресі)
  priceHistoryLogs: PriceHistoryLog[];
  addPriceHistoryLog: (log: Omit<PriceHistoryLog, 'id' | 'date'>) => void;
  
  // News Custom management
  news: NewsItem[];
  addNewsItem: (item: Omit<NewsItem, 'id'> & { date?: string }) => void;
  updateNewsItem: (id: string, updates: Partial<NewsItem>) => void;
  deleteNewsItem: (id: string) => void;
  updateNewsList: (list: NewsItem[]) => void;

  // Calculational Commercial Offers Archive (Есептеулер архиві)
  calculationsArchive: any[];
  saveCalculation: (calc: any) => void;
  deleteCalculation: (id: string) => void;

  // Tanks Virtual Volumes with booking limits
  tanksState: any[];
  setTanksState: React.Dispatch<React.SetStateAction<any[]>>;
  addTank: (id: string, fuel: string, volume: number, capacity: number) => void;
  updateTank: (id: string, updates: Partial<any>) => void;
  deleteTank: (id: string) => void;
  bookVolume: (tankId: string, volumeM3: number) => boolean;
  toggleTankStatus: (id: string) => void;
  waterLevels: { [tankId: string]: number }; // In cm
  updateWaterLevel: (tankId: string, level: number) => void;
  updateUserTanksAndPermissions: (username: string, allowedTanks: string[], permissionLevel: 'view' | 'edit' | 'open_close' | 'full') => void;

  // New CMS & Admin Center properties
  usersList: AppUser[];
  updateUserRole: (username: string, nextRole: Role) => void;
  updateUserDetails: (username: string, updates: Partial<AppUser>) => void;
  addUser: (user: AppUser) => void;
  deleteUser: (username: string) => void;
  priceDisplayUnit: 'liter' | 'ton';
  setPriceDisplayUnit: (unit: 'liter' | 'ton') => void;
  stationsList: any[];
  addStation: (stationName: string, stationId: string, tanks: any[]) => void;
  updateStation: (id: string, updates: any) => void;
  deleteStation: (id: string) => void;
  regionRates: Record<'Almaty' | 'Astana' | 'Shymkent' | 'Atyrau', { name: string; category: 'auto' | 'aviation'; standard: string; price: number }[]>;
  updateRegionRate: (region: string, fuelName: string, price: number) => void;
  addRegionRateFuel: (region: string, fuel: any) => void;
  deleteRegionRateFuel: (region: string, fuelName: string) => void;
  bannersState: {
    heroTitleKz: string;
    heroTitleRu: string;
    heroTitleEn: string;
    heroDescKz: string;
    heroDescRu: string;
    heroDescEn: string;
    heroImage: string;
    autoplay?: boolean;
    autoplaySpeed?: number;
    showIndicators?: boolean;
    showArrows?: boolean;
    animationEffect?: 'fade' | 'slide' | 'zoom';
    slides?: {
      id: string;
      titleKz: string;
      titleRu: string;
      titleEn: string;
      descKz: string;
      descRu: string;
      descEn: string;
      bgType: 'image' | 'gradient';
      bgImage: string;
      bgGradient: string;
      overlayOpacity: number;
      buttonTextKz: string;
      buttonTextRu: string;
      buttonTextEn: string;
      buttonLink: string;
      isActive: boolean;
      textAlign: 'left' | 'center' | 'right';
    }[];
  };
  updateBannersState: (updates: any) => void;
  clearAuditLogs: () => void;

  // Managed Prices (Singapore, Argus, Wholesale, Retail)
  managedPrices: ManagedPrice[];
  addManagedPrice: (price: Omit<ManagedPrice, 'id'>) => void;
  updateManagedPrice: (id: string, updates: Partial<ManagedPrice>) => void;
  deleteManagedPrice: (id: string) => void;

  // Editable Leaders & Contacts
  leadersList: any[];
  updateLeadersList: (list: any[]) => void;
  contactsState: any;
  updateContactsState: (updates: any) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const defaultTanks = [
  { id: 'T-01', fuel: 'Jet A-1', volume: 4500, capacity: 5000, color: 'bg-emerald-500', stroke: '#10b981', isOpen: true },
  { id: 'T-02', fuel: 'ТС-1', volume: 3200, capacity: 4000, color: 'bg-blue-500', stroke: '#3b82f6', isOpen: true },
  { id: 'T-03', fuel: 'РТ', volume: 1800, capacity: 3000, color: 'bg-purple-500', stroke: '#a855f7', isOpen: true },
  { id: 'T-04', fuel: 'АИ-92', volume: 2100, capacity: 3000, color: 'bg-amber-500', stroke: '#f59e0b', isOpen: true },
  { id: 'T-05', fuel: 'ДТ (Жазғы)', volume: 3800, capacity: 5000, color: 'bg-rose-500', stroke: '#e11d48', isOpen: true },
];

const defaultCompetitorRates: CompetitorRate[] = [
  { id: 'c1', brand: 'QazaqOil', ai92: 204, ai95: 251, dt: 294 },
  { id: 'c2', brand: 'Helios', ai92: 205, ai95: 253, dt: 295 },
  { id: 'c3', brand: 'Sinooil', ai92: 203, ai95: 250, dt: 293 },
  { id: 'c4', brand: 'Compass', ai92: 206, ai95: 254, dt: 297 },
];

const defaultRoutineTasks: RoutineTask[] = [
  { id: 't_1', text: '№2 резервуардың су деңгейін (подтоварная вода) тексеру', isCompleted: false, date: '11 Маусым, 2026' },
  { id: 't_2', text: 'АП-04 жанар-жағармай бекетінің СНТ құжаттарын жабу', isCompleted: true, date: '10 Маусым, 2026' },
  { id: 't_3', text: 'Жүйелік бағалар бойынша Argus синхрондауын бақылау', isCompleted: false, date: '11 Маусым, 2026' },
  { id: 't_4', text: 'Сапа паспорттарының зауыттық сәйкестігін тіркеу', isCompleted: false, date: '11 Маусым, 2026' },
];

const defaultAlerts: SystemAlert[] = [
  { id: 'a_1', type: 'warning', text: 'Shym-02 бекетінде кассалық ауытқу тіркелді: Отын қалдықтары баған есептегішінен 42 литрге кем.', isRead: false, date: '11 Маусым, 22:15' }
];

const ACCOUNT_PASSWORDS: { [key: string]: string } = {
  admin: 'admin123',
  user1: 'user123',
  user2: 'user456',
  user3: 'user357',
};

const ACCOUNT_DETAILS: { [key: string]: AppUser } = {
  admin: { username: 'admin', fullName: 'Ахметжанов Мақсат Ақанұлы', role: 'admin', email: 'hobbydrn@gmail.com', allowedTanks: ['T-01', 'T-02', 'T-03', 'T-04', 'T-05'], permissionLevel: 'full' },
  user1: { username: 'user1', fullName: 'Бауыржан Саят', role: 'user', email: 'sayat@mercuryenergy.kz', allowedTanks: ['T-01', 'T-02', 'T-03'], permissionLevel: 'edit' },
  user2: { username: 'user2', fullName: 'Әсем Сәдуақас', role: 'user', email: 'asem@mercuryenergy.kz', allowedTanks: ['T-01', 'T-02'], permissionLevel: 'view' },
  user3: { username: 'user3', fullName: 'Данияр Назарбаев', role: 'user', email: 'daniyar@mercuryenergy.kz', allowedTanks: ['T-01', 'T-02', 'T-03', 'T-04', 'T-05'], permissionLevel: 'edit' },
};

const defaultStations = [
  {
    id: 'ALA-04',
    name: 'Almaty - Turksib',
    tanks: [
      { fuel: 'AI-95 Premium', volume: 45, capacity: 60, color: 'bg-blue-500', stroke: '#3b82f6' },
      { fuel: 'AI-92 Standard', volume: 38, capacity: 60, color: 'bg-amber-500', stroke: '#f59e0b' },
      { fuel: 'Diesel SDF', volume: 51, capacity: 80, color: 'bg-emerald-500', stroke: '#10b981' },
    ],
  },
  {
    id: 'AST-12',
    name: 'Astana - Left Bank',
    tanks: [
      { fuel: 'AI-95 Premium', volume: 55, capacity: 60, color: 'bg-blue-500', stroke: '#3b82f6' },
      { fuel: 'AI-92 Standard', volume: 22, capacity: 60, color: 'bg-amber-500', stroke: '#f59e0b' },
      { fuel: 'Diesel SDF', volume: 72, capacity: 80, color: 'bg-emerald-500', stroke: '#10b981' },
    ],
  },
  {
    id: 'SHY-02',
    name: 'Shymkent - Center',
    tanks: [
      { fuel: 'AI-95 Premium', volume: 29, capacity: 60, color: 'bg-blue-500', stroke: '#3b82f6' },
      { fuel: 'AI-92 Standard', volume: 49, capacity: 60, color: 'bg-amber-500', stroke: '#f59e0b' },
      { fuel: 'Diesel SDF', volume: 35, capacity: 80, color: 'bg-emerald-500', stroke: '#10b981' },
    ],
  },
];

const defaultRegionRates = {
  Almaty: [
    { name: 'АИ-92', category: 'auto', standard: 'EURO-5', price: 245 },
    { name: 'АИ-95', category: 'auto', standard: 'EURO-5', price: 275 },
    { name: 'ДИЗЕЛЬ (ДТ)', category: 'auto', standard: 'EURO-5', price: 320 },
    { name: 'JET A-1', category: 'aviation', standard: 'JIG-2', price: 325 },
    { name: 'ТС-1', category: 'aviation', standard: 'GOST', price: 310 },
    { name: 'РТ КЕРОСИН', category: 'aviation', standard: 'GOST', price: 322 },
  ],
  Astana: [
    { name: 'АИ-92', category: 'auto', standard: 'EURO-5', price: 250 },
    { name: 'АИ-95', category: 'auto', standard: 'EURO-5', price: 280 },
    { name: 'ДИЗЕЛЬ (ДТ)', category: 'auto', standard: 'EURO-5', price: 325 },
    { name: 'JET A-1', category: 'aviation', standard: 'JIG-2', price: 330 },
    { name: 'ТС-1', category: 'aviation', standard: 'GOST', price: 315 },
    { name: 'РТ КЕРОСИН', category: 'aviation', standard: 'GOST', price: 327 },
  ],
  Shymkent: [
    { name: 'АИ-92', category: 'auto', standard: 'EURO-5', price: 242 },
    { name: 'АИ-95', category: 'auto', standard: 'EURO-5', price: 273 },
    { name: 'ДИЗЕЛЬ (ДТ)', category: 'auto', standard: 'EURO-5', price: 318 },
    { name: 'JET A-1', category: 'aviation', standard: 'JIG-2', price: 328 },
    { name: 'ТС-1', category: 'aviation', standard: 'GOST', price: 312 },
    { name: 'РТ КЕРОСИН', category: 'aviation', standard: 'GOST', price: 325 },
  ],
};

const defaultManagedPrices: ManagedPrice[] = [
  {
    id: 'mp_sing_1',
    category: 'singapore',
    name: 'Singapore Jet A-1 Index',
    description: 'Сингапур биржасындағы авиаотынның эталондық индексі.',
    priceRetail: 512000,
    priceWholesale: 512000,
    standard: 'ASTM D1655 / JIG-2'
  },
  {
    id: 'mp_sing_2',
    category: 'singapore',
    name: 'Singapore Gasoline 92 RON',
    description: 'Сингапур биржасындағы АИ-92 маркалы бензиннің котировкасы.',
    priceRetail: 367000,
    priceWholesale: 367000,
    standard: 'EURO-5'
  },
  {
    id: 'mp_sing_3',
    category: 'singapore',
    name: 'Singapore Fuel Oil Index',
    description: 'Мазут отынының Сингапур деңгейіндеге биржалық индексі.',
    priceRetail: 245000,
    priceWholesale: 245000,
    standard: 'High Sulfur 380 cSt'
  },
  {
    id: 'mp_arg_1',
    category: 'argus',
    name: 'Argus AI-92 (DAP Almaty)',
    description: 'Argus Media жариялаған Алматы жеткізу станциясы бойынша АИ-92 көтерме бағасы.',
    priceRetail: 285500,
    priceWholesale: 285500,
    standard: 'EURO-5'
  },
  {
    id: 'mp_arg_2',
    category: 'argus',
    name: 'Argus AI-95 (DAP Almaty)',
    description: 'Argus Media жариялаған Алматы бойынша АИ-95 котировкасы.',
    priceRetail: 338000,
    priceWholesale: 338000,
    standard: 'EURO-5'
  },
  {
    id: 'mp_arg_3',
    category: 'argus',
    name: 'Argus DT (DAP Almaty)',
    description: 'Argus Media жариялаған жазғы дизель отынының өңірлік индексі.',
    priceRetail: 362000,
    priceWholesale: 362000,
    standard: 'EURO-5'
  },
  {
    id: 'mp_arg_4',
    category: 'argus',
    name: 'Argus Jet A-1 (DAP Almaty)',
    description: 'Argus Media жариялаған Jet A-1 авиакеросин индексі.',
    priceRetail: 495000,
    priceWholesale: 495000,
    standard: 'JIG-2'
  },
  {
    id: 'mp_sm_1',
    category: 'smartme',
    name: 'Jet A-1 SmartME',
    description: 'Mercury Energy мұнай базасынан Jet A-1 авиакеросинін көтерме және бөлшек босату бағасы.',
    priceRetail: 525000,
    priceWholesale: 525000,
    standard: 'JIG-2 Compliance'
  },
  {
    id: 'mp_sm_2',
    category: 'smartme',
    name: 'ТС-1 Авиа SmartME',
    description: 'Mercury Energy ТС-1 маркалы авиациялық отынның бағасы.',
    priceRetail: 410000,
    priceWholesale: 410000,
    standard: 'ГОСТ 10227'
  },
  {
    id: 'mp_sm_3',
    category: 'smartme',
    name: 'АИ-92 SmartME',
    description: 'Еуро-5 стандартындағы АИ-92 бензинінің бөлшек және көтерме сату бағасы.',
    priceRetail: 280821,
    priceWholesale: 275000,
    standard: 'EURO-5'
  },
  {
    id: 'mp_sm_4',
    category: 'smartme',
    name: 'АИ-95 SmartME',
    description: 'EURO-5 АИ-95 премиум бензинінің бөлшек және көтерме босату бағасы.',
    priceRetail: 338255,
    priceWholesale: 325000,
    standard: 'EURO-5'
  },
  {
    id: 'mp_sm_5',
    category: 'smartme',
    name: 'ДТ Жазғы SmartME',
    description: 'Жазғы экологиялық дизель отынының бөлшек және көтерме сату бағасы.',
    priceRetail: 351190,
    priceWholesale: 345000,
    standard: 'EURO-5'
  }
];

const defaultLeaders = [
  {
    id: 'leader_0',
    name: {
      kz: 'Ахметжанов Мақсат Аканович',
      ru: 'Ахметжанов Мақсат Аканович',
      en: 'Maksat Akanovich Akhmetzhanov'
    },
    title: {
      kz: '«Mercury Energy» ЖШС Бас директоры',
      ru: 'Генеральный директор ТОО «Mercury Energy»',
      en: 'General Director of Mercury Energy LLP'
    },
    sub: {
      kz: 'Бас директор (CEO) • PhD • Академик',
      ru: 'Генеральный директор • PhD • Академик',
      en: 'Chief Executive Officer (CEO) • PhD'
    },
    imageUrl: '/src/assets/images/leader_maksat_1781524570334.jpg',
    iconName: 'CircleUser',
    color: 'bg-blue-600',
    email: 'm.akhmetzhanov@mercuryenergy.kz',
    specs: [
      { label: { kz: 'Еңбектер', ru: 'Труды', en: 'Works' }, value: '30+' },
      { label: { kz: 'Scopus', ru: 'Scopus', en: 'Scopus' }, value: '12' }
    ],
    bio: {
      kz: 'Ахметжанов Мақсат Ақанұлы – басқару саласында бай тәжірибесі бар жетекші. Ол ҚР Ғылым және жоғары білім министрлігі Ғылым комитетінің «Ақпараттық және есептеуіш технологиялар институты» РМК Бас директорының орынбасары лауазымдарын атқарған. Жобаларды басқаруда кең ауқымды сараптамаға ие. Мақсат Ақанұлы 2011 жылы әл-Фараби атындағы Қазақ ұлттық университетін бакалавриат, 2013 жылы жаратылыстану ғылымдарының магистрі дәрежесімен бітірген. 2016 жылы Математикалық және компьютерлік модельдеу мамандығы бойынша PhD докторы дәрежесін алды. Халықаралық ақпараттандыру академиясының академигі. 30-дан астам ғылыми еңбектердің авторы, оның ішінде 12-сі Scopus және 7-уі Web of Science негізінде жасалған мақалалар, сондай-ақ 10 авторлық куәлік пен пайдалы модельге 1 патент иегері.',
      ru: 'Ахметжанов Максат Аканович – руководитель с богатым опытом управления. Ранее занимал должность заместителя генерального директора РГП «Институт информационных и вычислительных технологий» Комитета науки Министерства науки и высшего образования РК. Обладает широкой экспертизой в управлении комплексными проектами. Окончил Казахский национальный университет имени аль-Фараби (бакалавриат в 2011 г., магистратура естественных наук в 2013 г.). В 2016 г. получил степень доктора PhD по специальности «Математическое и компьютерное моделирование». Академик Международной академии информатизации. Автор более 30 научных трудов (включая 12 статей в Scopus, 7 статей в Web of Science, 10 авторских свидетельств и 1 патент на полезную модель).',
      en: 'Maksat Akanovich Ahmetzhanov is an executive with extensive experience in corporate governance. He previously served as the Deputy Director General of the \'Institute of Information and Computing Technologies\' under the Committee of Science of the Ministry of Science and Higher Education of Republic of Kazakhstan. He holds deep expertise in project execution. Maksat Akanovich Ahmetzhanov graduated from Al-Farabi Kazakh National University with a bachelor\'s degree in 2011 and received his Master of Natural Sciences in 2013. In 2016, he earned his PhD in Mathematical and Computer Modeling. He is an academician of the International Academy of Informatization and has published over 30 scientific works, including 12 Scopus-indexed and 7 Web of Science articles, alongside 10 author\'s certificates and 1 utility model patent.'
    }
  },
  {
    id: 'leader_1',
    name: {
      kz: 'Тәжібаев Талғат',
      ru: 'Тажибаев Талгат',
      en: 'Tazhibaev Talgat'
    },
    title: {
      kz: 'Қауіпті мұнай өнімдерін қорғау бөлімінің басшысы',
      ru: 'Технический директор по контролю качества',
      en: 'Head of Hazardous Petroleum Products Protection'
    },
    sub: {
      kz: '«Құрметті Авиатор» • JIG Сарапшысы',
      ru: '«Почетный авиатор» • Эксперт JIG-2',
      en: 'Honored Aviator • JIG Auditor'
    },
    imageUrl: '/src/assets/images/leader_talgat_1781524593365.jpg',
    iconName: 'Award',
    color: 'bg-amber-550',
    email: 't.tazhibaev@mercuryenergy.kz',
    specs: [
      { label: { kz: 'Тәжірибесі', ru: 'Стаж', en: 'Practice' }, value: '20+ жыл' },
      { label: { kz: 'Сертификат', ru: 'Сертификат', en: 'Cert' }, value: 'JIG-2 / SKY' }
    ],
    bio: {
      kz: 'Тәжібаев Талғат Тағыбергенұлы Бас инженер лауазымын атқарады, ол авиациялық отынмен қамтамасыз ету саласында 20 жылдан астам тәжірибесі бар білікті маман. Кәсіби жолы Қазақстанның Атырау, Ақтөбе және Астана сияқты ең ірі әуежайларындағы жанар-жағармай құю кешендерін басқаруды қамтиды. Салағы көпжылдық еңбек барысында Талғат Тағыбергенұлы азаматтық авиацияны отынмен қамтамасыз етуді ұйымдастыру, авиаотынды үздіксіз жеткізу, сапалы бақылау және әуе кемелерін құю саласындағы халықаралық стандарттарды қамтамасыз ету бойынша бірегей тәжірибе жинақтады. Талғат Тағыбергенұлы үнемі біліктілігін арттырып, түрлі тренингтерден өтеді, соның ішінде 2024 жылғы 9 желтоқсанда Астанада JIG инспекторларымен және SKYHANSA-мен бірлесіп ұйымдастырылған авиаотынды пайдалану жөніндегі семинар бар. Оның еңбегі мемлекеттік деңгейде атап өтіліп, «Құрметті авиатор» құрметті атағымен марапатталды, бұл оның елдің авиациялық саласын дамытуға қосқан зор үлесін растайды.',
      ru: 'Тажибаев Талгат Тагибергенович занимает должность Главного инженера. Он является высококлассным техническим специалистом в сфере авиатопливообеспечения с опытом работы более 20 лет. Его карьерный путь включает руководство топливно-заправочными комплексами в крупнейших аэропортах Казахстана (Атырау, Актобе и Астана). Имеет уникальный опыт заправки воздушных судов гражданской авиации, бесперебойного снабжения авиатопливом, контроля качества и обеспечения жестких международных требований Joint Inspection Group. Регулярно проходит профессиональные стажировки, включая обучение с международными инспекторами JIG и SKYHANSA в декабре 2024 года. За значительный вклад в развитие отечественной авиационной инженерии награжден почетным государственным званием «Құрметті авиатор».',
      en: 'Talgat Tagibergenovich serves as the Chief Engineer and Head of Hazardous Petroleum Products Protection, presenting over 20 years of technical expertise in aviation fueling systems. His professional trajectory includes managerial leadership of fuel-refueling complexes at Kazakhstan\'s premier airports, including Atyrau, Aktobe, and Astana. Throughout his distinguished tenure, Talgat Tagibergenovich has specialized in strategic airport logistics, quality control metrics, and absolute compliance with international aircraft refueling regulations. He consistently improves his technical credentials, notably participating in joint seminars with JIG auditors and SKYHANSA in Astana. Confirming his outstanding industry footprint, he was honored with the governmental title \'Kurmetti Aviator\' (Honored Aviator).'
    }
  },
  {
    id: 'leader_2',
    name: {
      kz: 'Шашкова Вера',
      ru: 'Шашкова Вера',
      en: 'Shashkova Vera'
    },
    title: {
      kz: 'Зертхана меңгерушісі',
      ru: 'Руководитель испытательной лаборатории топлива',
      en: 'Head of the Quality Control Laboratory'
    },
    sub: {
      kz: 'Республикалық комиссия мүшесі',
      ru: 'Член Республиканской комиссии по авиатопливу',
      en: 'National Commission Member • Expert'
    },
    imageUrl: '/src/assets/images/leader_vera_1781524613441.jpg',
    iconName: 'FlaskConical',
    color: 'bg-emerald-600',
    email: 'v.shashkova@mercuryenergy.kz',
    specs: [
      { label: { kz: 'Салалық өтілі', ru: 'Профстаж', en: 'Lab Operations' }, value: '20+ жыл' },
      { label: { kz: 'Мәртебесі', ru: 'Респ. комиссия', en: 'Federal Status' }, value: 'Ақпараттық' }
    ],
    bio: {
      kz: 'Шашкова Вера Алексеевнаның авиаотын саласында 20 жылдық жұмыс өтілі бар. Астана халықаралық әуежайында зертхана меңгерушісі болып жұмыс істеген. Азаматтық авиацияда үлкен тәжірибесі бар. Вера Алексеевна Авиациялық отын бойынша республикалық комиссияның мүшесі болып табылады. Вера Алексеевна Шашкова үнемі біліктілігін арттырып, түрлі тренингтерден өтеді, соның ішінде 2024 жылғы 9 желтоқсанда Астанада JIG инспекторларымен және SKYHANSA-мен бірлесіп ұйымдастырылған авиаотынды пайдалану жөніндегі семинар бар.',
      ru: 'Шашкова Вера Алексеевна имеет более 20 лет стажа в авиационной химико-технологической отрасли. Возглавляла испытательную лабораторию Международного аэропорта Астаны. Обладает глубоким практическим опытом контроля соответствия нефтепродуктов в гражданской авиации. Является действующим членом Республиканской комиссии по авиационному топливу. Регулярно совершенствует навыки технической экспертизы, включая участие в сертифицированных JIG и SKYHANSA семинарах по авиатопливным операциям.',
      en: 'Vera Alekseevna brings over 20 years of active laboratory governance and chemical engineering expertise to the aviation fuel industry. She previously directed the fuel testing laboratory at Astana International Airport and possesses extensive background in civil aviation fuel verification. Vera Alekseevna is a prominent member of the Republican Aviation Fuel Commission. She actively participates in advanced JIG certifications, including specialist workshops delivered by JIG inspectors and SKYHANSA in Astana.'
    }
  }
];

const defaultContactsData = {
  aboutTitleKz: 'Компания жайлы',
  aboutTitleRu: 'О компании',
  aboutTitleEn: 'About Company',
  
  aboutSubtitleKz: 'Мұнай өнімдері мен авиаотын нарығындағы сенімді және технологиялық серіктес',
  aboutSubtitleRu: 'Надежный и технологичный партнер на рынке нефтепродуктов и авиатоплива',
  aboutSubtitleEn: 'A reliable and advanced partner in the petroleum and jet fuel logistics sector',
  
  aboutDescKz: '«Smart Mercury Energy» — Қазақстанның энергетикалық және логистикалық секторында кешенді инфрақұрылымы бар, сенімді және серпінді дамып келе жатқан жетекші компаниялардың бірі. Біздің басты мақсатымыз – мұнай өнімдері мен авиациялық отынды JIG-2 халықаралық стандарттары бойынша қабылдау, сақтау, заманауи сараптамалық бақылаудан өткізу, жөнелту және тасымалдау кәсіпорындарын басқару.',
  aboutDescRu: '«Smart Mercury Energy» — одна из ведущих, стабильно развивающихся компаний в энергетическом и логистическом секторе Казахстана. Наша деятельность сосредоточена на безопасном приеме, хранении, многоступенчатом лабораторном контроле качества, высокотехнологичной перевалке и поставке светлых нефтепродуктов и сертифицированного авиакеросина в соответствии с JIG-2.',
  aboutDescEn: 'Smart Mercury Energy is one of the leading, sustainably growing companies in the energy and logistics sector of Kazakhstan. Our core activities center on the secure receipt, bulk storage, multi-stage laboratory analysis, global JIG-2 standard compliant handling, and shipping of commercial transport fuels and certified aviation kerosene.',
  
  // Stats
  statVolKz: 'Сыйымдылық',
  statVolRu: 'Объем парка',
  statVolEn: 'Total Storage',
  statVolValue: '19 000 м³',
  
  statTanksKz: 'Резервуарлар',
  statTanksRu: 'Резервуары',
  statTanksEn: 'Tanks Count',
  statTanksValue: '13 резервуар',
  
  statLaunchKz: 'Іске қосылуы',
  statLaunchRu: 'Год запуска',
  statLaunchEn: 'Launched In',
  statLaunchValue: '2018 жыл',
  
  statDistKz: 'Әуежайға дейін',
  statDistRu: 'До аэропорта',
  statDistEn: 'To Airport',
  statDistValue: '6 км қашықтық',
  
  // Address, contacts info
  addressValKz: 'Алматы қаласы, Түрксіб ауданы, Свободная көшесі, 136/2',
  addressValRu: 'г. Алматы, Турксибский район, ул. Свободная, 136/2',
  addressValEn: '136/2 Svobodnaya Street, Turksibsky District, Almaty, Kazakhstan',
  
  phone: '+7 (727) 355-10-10',
  email: 'info@mercuryenergy.kz',
  
  hoursValKz: 'Дүйсенбі - Жұма: 09:00 - 18:00',
  hoursValRu: 'Понедельник - Пятница: 09:00 - 18:00',
  hoursValEn: 'Monday - Friday: 09:00 - 18:00',
  
  // FeedBack labels
  feedbackTitleKz: 'Кері байланыс',
  feedbackTitleRu: 'Обратная связь',
  feedbackTitleEn: 'Feedback',
  
  feedbackDescKz: 'Сұрақтарыңыз немесе ұсыныстарыңыз болса, хабарласыңыз.',
  feedbackDescRu: 'Свяжитесь с нами по любым вопросам или сотрудничеству.',
  feedbackDescEn: 'Contact us for any questions or commercial inquiries.',

  aboutImageUrl: '/src/assets/images/almaty_oil_depot_aerial_1781524403784.jpg',

  infoSystemTitleKz: 'MERCURY ENERGY • Ресми баға саясаты',
  infoSystemTitleRu: 'MERCURY ENERGY • Официальная ценовая политика',
  infoSystemTitleEn: 'MERCURY ENERGY • Official Price Policy',
  infoSystemDescKz: 'Біз серіктестерімізге ең тиімді көтерме және бөлшек бағаларды, Сингапур және Argus халықаралық баға көрсеткіштерімен салыстырылған нақты деректерді ұсынамыз. Барлық деректер нақты уақытта жаңартылып отырады.',
  infoSystemDescRu: 'Мы предоставляем нашим партнерам самые выгодные оптовые и розничные котировки, основанные на международных индексах Сингапура и Argus. Все данные обновляются в реальном времени.',
  infoSystemDescEn: 'We offer our partners the most competitive wholesale and retail rates, aligned with international Singapore and Argus benchmarks. All data is updated in real time.',
  infoSystemImage: ''
};

const defaultBanners = {
  heroTitleKz: 'SmartME \nMercury Energy',
  heroTitleRu: 'SmartME \nMercury Energy',
  heroTitleEn: 'SmartME \nMercury Energy',
  heroDescKz: 'Алматы өңіріндегі авиациялық және автокөлік отындарының сапасын бақылау, сақтау және тасымалдау жөніндегі жетекші ресми энергетикалық хаб. JIG-2 халықаралық стандарттарына толық сәйкес келетін қауіпсіз, сертификатталған сараптамалық қызмет.',
  heroDescRu: 'Ведущий официальный энергетический хаб по контролю качества, хранению и транспортировке авиационного и автомобильного топлива в Алматинском регионе. Безопасные услуги, сертифицированные согласно международным стандартам JIG-2.',
  heroDescEn: 'The leading official energy enterprise for petroleum logistics, high-capacity depot storage, and aviation fuel quality control in the Almaty region. Offering safety-vetted services fully compliant with JIG-2 international aviation audit standards.',
  heroImage: '/src/assets/images/energy_terminal_bg_1781522513129.jpg',
  autoplay: true,
  autoplaySpeed: 5,
  showIndicators: true,
  showArrows: true,
  animationEffect: 'fade' as const,
  slides: [
    {
      id: 'slide_default_1',
      titleKz: 'SmartME \nMercury Energy',
      titleRu: 'SmartME \nMercury Energy',
      titleEn: 'SmartME \nMercury Energy',
      descKz: 'Алматы өңіріндегі авиациялық және автокөлік отындарының сапасын бақылау, сақтау және тасымалдау жөніндегі жетекші энергетикалық хаб.',
      descRu: 'Ведущий энергетический хаб по контролю качества, хранению и транспортировке авиационного и автомобильного топлива в Алматинском регионе.',
      descEn: 'The leading energy enterprise for petroleum logistics, high-capacity depot storage, and aviation fuel quality control in the Almaty region.',
      bgType: 'image' as const,
      bgImage: '/src/assets/images/energy_terminal_bg_1781522513129.jpg',
      bgGradient: 'from-blue-950 via-slate-900 to-indigo-950',
      overlayOpacity: 0.85,
      buttonTextKz: 'Станцияларды бақылау',
      buttonTextRu: 'Мониторинг станций',
      buttonTextEn: 'Monitor Stations',
      buttonLink: '/stations',
      isActive: true,
      textAlign: 'left' as const
    },
    {
      id: 'slide_default_2',
      titleKz: 'Ресми тарифі мен \nнарықтық бағалары',
      titleRu: 'Официальные тарифы \nи рыночные цены',
      titleEn: 'Official Tariffs & \nMarket Fuel Indexes',
      descKz: 'Сингапур биржасының және Argus халықаралық агенттігінің ақпараттық бағалары мен SmartME ішкі корпоративтік бағаларын толық бақылау.',
      descRu: 'Полный мониторинг котировок Сингапурской биржи, международных индексов Argus и внутренних тарифов SmartME.',
      descEn: 'Full monitoring of Singapore Exchange quotes, international Argus price index records, and SmartME local corporate tariffs.',
      bgType: 'gradient' as const,
      bgImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
      bgGradient: 'from-[#0b132b] via-[#1c2541] to-[#3a506b]',
      overlayOpacity: 0.9,
      buttonTextKz: 'Бағаларды Көру',
      buttonTextRu: 'Посмотреть Цены',
      buttonTextEn: 'View Prices',
      buttonLink: '/prices',
      isActive: true,
      textAlign: 'center' as const
    },
    {
      id: 'slide_default_3',
      titleKz: 'Резервуар паркі \nнақты уақытта',
      titleRu: 'Резервуарный парк \nв реальном времени',
      titleEn: 'Real-time Tank \nDepot Analytics',
      descKz: 'Отын деңгейлерінің, су мөлшерінің және резервуарлардың температуралық көрсеткіштерінің автоматты түрде жаңарып отыратын жүйесі.',
      descRu: 'Автоматически обновляемая система показателей уровней топлива, подтоварной воды и температурных датчиков.',
      descEn: 'Automatically synchronized metrics showing fuel levels, water presence, and temperature sensors across all depot reservoirs.',
      bgType: 'image' as const,
      bgImage: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=800&q=80',
      bgGradient: 'from-slate-950 via-indigo-950 to-blue-950',
      overlayOpacity: 0.85,
      buttonTextKz: 'Резервуарлар (Танктер)',
      buttonTextRu: 'Резервуары (Танки)',
      buttonTextEn: 'View Depot Tanks',
      buttonLink: '/tanks',
      isActive: true,
      textAlign: 'right' as const
    }
  ]
};

const generateId = (prefix: string = '') => {
  return `${prefix}${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
};

const safeLocalStorageSet = (key: string, value: string) => {
  try {
    localStorage.setItem(key, value);
  } catch (e) {
    console.warn(`[LocalStorage Quota Exceeded] Could not write to "${key}". Keeps state in-memory only.`, e);
  }
};

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Lang>('kz');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  // Current logged in user (starts with admin so everyone can preview seamlessly)
  const [currentUser, setCurrentUser] = useState<AppUser | null>(() => {
    const stored = localStorage.getItem('curr_user_session');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        return ACCOUNT_DETAILS.admin;
      }
    }
    return ACCOUNT_DETAILS.admin;
  });

  const [role, setRole] = useState<Role>(currentUser?.role || 'admin');

  // Users state
  const [usersList, setUsersList] = useState<AppUser[]>(() => {
    const stored = localStorage.getItem('users-list-cms');
    if (stored) return JSON.parse(stored);
    return Object.values(ACCOUNT_DETAILS);
  });

  const [priceDisplayUnit, setPriceDisplayUnit] = useState<'liter' | 'ton'>(() => {
    const stored = localStorage.getItem('price-display-unit-cms');
    return (stored === 'ton' || stored === 'liter') ? stored : 'liter';
  });

  useEffect(() => {
    safeLocalStorageSet('price-display-unit-cms', priceDisplayUnit);
  }, [priceDisplayUnit]);

  useEffect(() => {
    safeLocalStorageSet('users-list-cms', JSON.stringify(usersList));
  }, [usersList]);

  // Gas Stations CMS state
  const [stationsList, setStationsList] = useState<any[]>(() => {
    const stored = localStorage.getItem('stations-list-cms');
    if (stored) return JSON.parse(stored);
    return defaultStations;
  });

  useEffect(() => {
    safeLocalStorageSet('stations-list-cms', JSON.stringify(stationsList));
  }, [stationsList]);

  // Dynamic Region Rates state
  const [regionRates, setRegionRates] = useState<any>(() => {
    const stored = localStorage.getItem('region-rates-cms');
    if (stored) return JSON.parse(stored);
    return defaultRegionRates;
  });

  useEffect(() => {
    safeLocalStorageSet('region-rates-cms', JSON.stringify(regionRates));
  }, [regionRates]);

  // Homepage Banners CMS State
  const [bannersState, setBannersState] = useState<any>(() => {
    const stored = localStorage.getItem('banners-cms');
    if (stored) return JSON.parse(stored);
    return defaultBanners;
  });

  useEffect(() => {
    safeLocalStorageSet('banners-cms', JSON.stringify(bannersState));
  }, [bannersState]);

  // Dynamic Leaders State
  const [leadersList, setLeadersList] = useState<any[]>(() => {
    const stored = localStorage.getItem('leaders-cms');
    if (stored) return JSON.parse(stored);
    return defaultLeaders;
  });

  useEffect(() => {
    safeLocalStorageSet('leaders-cms', JSON.stringify(leadersList));
  }, [leadersList]);

  const updateLeadersList = (list: any[]) => {
    setLeadersList(list);
    logUserAction('Басшылық құрамы тізімін өзгертті');
  };

  // Dynamic Contacts State
  const [contactsState, setContactsState] = useState<any>(() => {
    const stored = localStorage.getItem('contacts-cms');
    if (stored) return JSON.parse(stored);
    return defaultContactsData;
  });

  useEffect(() => {
    safeLocalStorageSet('contacts-cms', JSON.stringify(contactsState));
  }, [contactsState]);

  const updateContactsState = (updates: any) => {
    setContactsState(updates);
    logUserAction('Байланыс және компания деректерін өзгертті');
  };

  // Sync role and session storage
  useEffect(() => {
    if (currentUser) {
      setRole(currentUser.role);
      safeLocalStorageSet('curr_user_session', JSON.stringify(currentUser));
    } else {
      setRole('guest');
      localStorage.removeItem('curr_user_session');
    }
  }, [currentUser]);

  // Backwards compatibility role selector
  const changeRoleSafely = (newRole: Role) => {
    if (newRole === 'admin') {
      setCurrentUser(ACCOUNT_DETAILS.admin);
    } else if (newRole === 'user') {
      setCurrentUser(ACCOUNT_DETAILS.user1);
    } else {
      setCurrentUser(null);
    }
    setRole(newRole);
  };

  // Login handler
  const loginUser = (username: string, pass: string) => {
    // Check dynamic usersState
    const foundUser = usersList.find(u => u.username.toLowerCase() === username.toLowerCase());
    if (foundUser) {
      const actualPassword = foundUser.password || ACCOUNT_PASSWORDS[foundUser.username] || 'user123';
      if (pass === actualPassword) {
        setCurrentUser(foundUser);
        logUserAction(`Платформаға сәтті кірді (${foundUser.username})`);
        return { success: true };
      }
    } else if (ACCOUNT_PASSWORDS[username] && ACCOUNT_PASSWORDS[username] === pass) {
      // Fallback fallback for static
      const user = ACCOUNT_DETAILS[username];
      setCurrentUser(user);
      logUserAction(`Платформаға сәтті кірді (${username})`);
      return { success: true };
    }
    return { success: false, error: 'Логин немесе пароль қате!' };
  };

  const logoutUser = () => {
    if (currentUser) {
      logUserAction(`Платформадан шықты (${currentUser.username})`);
    }
    setCurrentUser(null);
    setRole('guest');
  };

  // Audit Logs persistence
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
    const stored = localStorage.getItem('audit-logs-custom');
    if (stored) return JSON.parse(stored);
    return [
      { id: 'al_0', user: 'Ахметжанов Мақсат Ақанұлы', email: 'hobbydrn@gmail.com', role: 'admin', action: 'Жүйе бағаларын өзектілендіру', timestamp: '15.06.2026, 21:15' },
      { id: 'al_1', user: 'Бауыржан Саят', email: 'sayat@mercuryenergy.kz', role: 'user', action: 'Жаңа отын жеткізуге өтінім жолдау', timestamp: '15.06.2026, 20:45' },
      { id: 'al_2', user: 'Әсем Сәдуақас', email: 'asem@mercuryenergy.kz', role: 'user', action: 'Мұнайбаза резервуар броньдауын тексеру', timestamp: '15.06.2026, 19:30' },
    ];
  });

  useEffect(() => {
    safeLocalStorageSet('audit-logs-custom', JSON.stringify(auditLogs));
  }, [auditLogs]);

  // Simulated email alerts
  const [adminEmails, setAdminEmails] = useState<AdminEmail[]>(() => {
    const stored = localStorage.getItem('admin-emails-custom');
    if (stored) return JSON.parse(stored);
    return [
      {
        id: 'em_init_1',
        from: 'system@mercuryenergy.kz',
        to: 'hobbydrn@gmail.com',
        subject: 'Жүйелік есеп: Сәтті логин тіркелді',
        body: 'Құрметті Бас директор Ахметжанов Мақсат Ақанұлы, жүйеге жаңа кіріс тіркелді. Уақыты: 15.06.2026, 21:15.',
        date: '15.06.2026, 21:15'
      }
    ];
  });

  useEffect(() => {
    safeLocalStorageSet('admin-emails-custom', JSON.stringify(adminEmails));
  }, [adminEmails]);

  // Action Logger + Email Sender Simulator
  const logUserAction = (
    actionText: string,
    fieldChanged?: string,
    oldValue?: string,
    newValue?: string,
    operationType?: 'CREATE' | 'READ' | 'UPDATE' | 'DELETE' | 'LOGIN' | 'LOGOUT'
  ) => {
    const uName = currentUser ? currentUser.fullName : 'Қонақ (Guest)';
    const uEmail = currentUser ? currentUser.email : 'guest@mercuryenergy.kz';
    const uRole = currentUser ? currentUser.role : 'guest';
    const uUsername = currentUser ? currentUser.username : undefined;
    const nowStr = new Date().toLocaleDateString('kk-KZ', { day: '2-digit', month: '2-digit', year: 'numeric' }) + ', ' + new Date().toLocaleTimeString('kk-KZ', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

    const newLog: AuditLog = {
      id: generateId('al_'),
      user: uName,
      email: uEmail,
      role: uRole,
      action: actionText,
      timestamp: nowStr,
      fieldChanged,
      oldValue,
      newValue,
      operationType
    };

    setAuditLogs(prev => [newLog, ...prev]);

    // Live app alert for Admin and/or User
    const isGlobalAction = uRole === 'admin' && (actionText.toLowerCase().includes('баға') || actionText.toLowerCase().includes('тариф') || actionText.toLowerCase().includes('өзгертті') || actionText.toLowerCase().includes('жаңартты'));
    
    const formattedAlert = `[ӨЗГЕРІС] ${uName} (${uEmail}) • Әрекет: ${actionText} • ${nowStr}`;
    addAlert({
      type: 'info',
      text: formattedAlert,
      username: uUsername,
      isGlobal: isGlobalAction
    });

    // Simulated Email to Admin (always)
    const adminMail: AdminEmail = {
      id: generateId('em_'),
      from: 'alerts@mercuryenergy.kz',
      to: 'hobbydrn@gmail.com',
      subject: `Шұғыл хабарлама: Платформада өзгеріс тіркелді (${uName})`,
      body: `Құрметті Бас директор, Ахметжанов Мақсат Ақанұлы!\n\nMercury Energy басқару жүйесінде жаңа қозғалыс/өзгеріс анықталды:\n\n• Тұлға: ${uName}\n• Поштасы: ${uEmail}\n• Деңгейі: ${uRole}\n• Орындаған іс-әрекеті: ${actionText}\n• Уақыт сәті: ${nowStr}\n${fieldChanged ? `• Өзгерген өріс: ${fieldChanged}\n• Ескі мәні: ${oldValue}\n• Жаңа мәні: ${newValue}\n` : ''}\nҚұжат қосымша Жеке Кабинеттегі іс-әрекеттер тарихына ресми енгізілді.\n\nҚұрметпен,\nMercury Energy Ақпараттық Роботы`,
      date: nowStr
    };

    const nextMails = [adminMail];

    // Simulated Email to all users with notifications enabled (including self if enabled)
    usersList.forEach(u => {
      // If user has email notifications enabled AND (either it is a global action or it's their own action)
      if (u.emailNotificationsEnabled && (isGlobalAction || u.username === uUsername)) {
        const userMail: AdminEmail = {
          id: generateId('em_'),
          from: 'alerts@mercuryenergy.kz',
          to: u.email,
          subject: isGlobalAction 
            ? `Ақпараттық хабарлама: Бағалар мен тарифтер жаңартылды`
            : `Жеке хабарлама: Сіздің әрекетіңіз тіркелді`,
          body: `Құрметті ${u.fullName}!\n\nMercury Energy жүйесінде келесі маңызды өзгеріс орын алды:\n\n• Орындаушы: ${uName}\n• Әрекет: ${actionText}\n• Уақыт: ${nowStr}\n${fieldChanged ? `• Өзгерген өріс: ${fieldChanged}\n• Ескі мәні: ${oldValue}\n• Жаңа мәні: ${newValue}\n` : ''}\nБұл хабарлама сіздің пошта арқылы хабарлама алу рұқсатыңыз негізінде жіберілді.\n\nҚұрметпен,\nMercury Energy Жүйесі`,
          date: nowStr
        };
        nextMails.push(userMail);
      }
    });

    setAdminEmails(prev => [...nextMails, ...prev]);
  };

  const deleteAdminEmail = (id: string) => {
    setAdminEmails(prev => prev.filter(e => e.id !== id));
  };

  // New Admin & CMS Action Handlers Implementation
  const updateUserRole = (username: string, nextRole: Role) => {
    setUsersList(prev => prev.map(u => {
      if (u.username === username) {
        return { ...u, role: nextRole };
      }
      return u;
    }));
    if (currentUser && currentUser.username === username) {
      setCurrentUser(prev => prev ? { ...prev, role: nextRole } : null);
    }
    logUserAction(`Пайдаланушы рөлі өзгертілді: ${username} -> ${nextRole}`);
  };

  const updateUserDetails = (username: string, updates: Partial<AppUser>) => {
    setUsersList(prev => prev.map(u => {
      if (u.username === username) {
        return { ...u, ...updates };
      }
      return u;
    }));
    if (currentUser && currentUser.username === username) {
      setCurrentUser(prev => prev ? { ...prev, ...updates } : null);
    }
    logUserAction(
      `Пайдаланушы мәліметтері жаңартылды (${username})`,
      Object.keys(updates).join(', '),
      'Ескі мәндер',
      JSON.stringify(updates),
      'UPDATE'
    );
  };

  const updateUserTanksAndPermissions = (username: string, allowedTanks: string[], permissionLevel: 'view' | 'edit' | 'open_close' | 'full') => {
    setUsersList(prev => prev.map(u => {
      if (u.username === username) {
        return { ...u, allowedTanks, permissionLevel };
      }
      return u;
    }));
    if (currentUser && currentUser.username === username) {
      setCurrentUser(prev => prev ? { ...prev, allowedTanks, permissionLevel } : null);
    }
    logUserAction(`Пайдаланушы рұқсат деңгейі өзгертілді (${username}): деңгейі [${permissionLevel}], рұқсат етілген резервуарлар: [${allowedTanks.join(', ')}]`);
  };

  const addUser = (newUser: AppUser) => {
    setUsersList(prev => {
      if (prev.some(u => u.username.toLowerCase() === newUser.username.toLowerCase())) {
        return prev;
      }
      return [...prev, newUser];
    });
    logUserAction(`Әкімші жаңа пайдаланушы тіркеді: @${newUser.username} (${newUser.fullName}), рөл: [${newUser.role}], құқық шегі: [${newUser.permissionLevel || 'view'}]`);
  };

  const deleteUser = (username: string) => {
    setUsersList(prev => prev.filter(u => u.username !== username));
    logUserAction(`Әкімші пайдаланушыны жүйеден өшірді: @${username}`);
  };

  const toggleTankStatus = (id: string) => {
    const target = tanksState.find(t => t.id === id);
    if (target) {
      const nextState = !target.isOpen;
      setTanksState(prev => prev.map(t => t.id === id ? { ...t, isOpen: nextState } : t));
      logUserAction(`Резервуар мәртебесі өзгертілді (${id}): ${nextState ? 'АШЫЛДЫ (OPEN)' : 'ЖАБЫЛДЫ (CLOSED)'}`);
    }
  };

  const addTank = (id: string, fuel: string, volume: number, capacity: number) => {
    const newTank = {
      id,
      fuel,
      volume: Number(volume) || 0,
      capacity: Number(capacity) || 1000,
      color: id === 'T-01' ? 'bg-emerald-500' : id === 'T-02' ? 'bg-blue-500' : id === 'T-03' ? 'bg-purple-500' : id === 'T-04' ? 'bg-amber-500' : 'bg-rose-500', 
      stroke: id === 'T-01' ? '#10b981' : id === 'T-02' ? '#3b82f6' : id === 'T-03' ? '#a855f7' : id === 'T-04' ? '#f59e0b' : '#e11d48'
    };
    setTanksState(prev => {
      if (prev.some(t => t.id === id)) return prev;
      return [...prev, newTank];
    });
    setWaterLevels(prev => ({ ...prev, [id]: 0.0 }));
    logUserAction(`Жаңа резервуар мұнайбазаға қосылды: ${id} (${fuel}), сыйымдылығы ${capacity} м³`);
  };

  const updateTank = (id: string, updates: Partial<any>) => {
    setTanksState(prev => prev.map(t => {
      if (t.id === id) {
        const updated = { ...t, ...updates };
        if (updates.volume !== undefined) updated.volume = Number(updates.volume);
        if (updates.capacity !== undefined) updated.capacity = Number(updates.capacity);
        return updated;
      }
      return t;
    }));
    logUserAction(`Резервуар параметрлері жаңартылды: ${id}`);
  };

  const deleteTank = (id: string) => {
    setTanksState(prev => prev.filter(t => t.id !== id));
    logUserAction(`Резервуар өшірілді: ${id}`);
  };

  const addStation = (stationName: string, stationId: string, tanks: any[]) => {
    const newStation = {
      id: stationId,
      name: stationName,
      tanks: tanks.map(t => ({
        fuel: t.fuel || 'AI-92 Standard',
        volume: Number(t.volume) || 0,
        capacity: Number(t.capacity) || 60,
        color: t.color || 'bg-amber-500',
        stroke: t.stroke || '#f59e0b'
      }))
    };
    setStationsList(prev => [...prev, newStation]);
    logUserAction(`Жаңа жанармай бекеті (ЖҚС) қосылды: ${stationName} (${stationId})`);
  };

  const updateStation = (id: string, updates: any) => {
    setStationsList(prev => prev.map(s => {
      if (s.id === id) {
        return { ...s, ...updates };
      }
      return s;
    }));
    logUserAction(`Жанармай бекетінің деректері жаңартылды: ${id}`);
  };

  const deleteStation = (id: string) => {
    setStationsList(prev => prev.filter(s => s.id !== id));
    logUserAction(`Жанармай бекеті жүйеден өшірілді: ${id}`);
  };

  const updateRegionRate = (region: string, fuelName: string, price: number, standard?: string) => {
    setRegionRates(prev => {
      const regionData = prev[region] || [];
      const updated = regionData.map((f: any) => {
        if (f.name === fuelName) {
          const nextFuel = { ...f, price: Number(price) };
          if (standard !== undefined) {
             nextFuel.standard = standard;
          }
          return nextFuel;
        }
        return f;
      });
      return { ...prev, [region]: updated };
    });
    logUserAction(`${region} өңірінде ${fuelName} бағасы ${price} KZT-ге жаңартылды ${standard ? ('(' + standard + ')') : ''}`);
  };

  const addRegionRateFuel = (region: string, fuel: any) => {
    setRegionRates(prev => {
      const regionData = prev[region] || [];
      const isExist = regionData.some((f: any) => f.name.toLowerCase() === fuel.name.toLowerCase());
      if (isExist) return prev;
      return { ...prev, [region]: [...regionData, {
        name: fuel.name,
        category: fuel.category || 'auto',
        standard: fuel.standard || 'EURO-5',
        price: Number(fuel.price) || 0
      }] };
    });
    logUserAction(`${region} өңіріне жаңа отын маркасы қосылды: ${fuel.name} (${fuel.price} KZT)`);
  };

  const deleteRegionRateFuel = (region: string, fuelName: string) => {
    setRegionRates(prev => {
      const regionData = prev[region] || [];
      return { ...prev, [region]: regionData.filter((f: any) => f.name !== fuelName) };
    });
    logUserAction(`${region} өңірінен ${fuelName} отын маркасы өшірілді`);
  };

  const updateBannersState = (updates: any) => {
    setBannersState(prev => ({ ...prev, ...updates }));
    logUserAction(`Басты беттегі баннер слайдтары мен компания мәліметтері өңделді`);
  };

  const clearAuditLogs = () => {
    setAuditLogs([]);
    localStorage.removeItem('audit-logs-custom');
  };

  // Spot Rates (Top Hero Prices)
  const [spotRates, setSpotRates] = useState<SpotRate[]>(() => {
    const stored = localStorage.getItem('spot-rates');
    if (stored) return JSON.parse(stored);
    return [
      { id: '1', name: 'AI-92', standard: 'EURO', statusLabel: 'Standard', price: 205, trend: 'up', percentage: '+1.2%' },
      { id: '2', name: 'AI-95', standard: 'EURO', statusLabel: 'Premium', price: 252, trend: 'neutral', percentage: '0.0%' },
      { id: '3', name: 'ДТ', standard: 'SDF', statusLabel: 'Summer Distillate', price: 295, trend: 'down', percentage: '-2.5%' },
    ];
  });

  // News State with migration check to load newly generated news illustrations
  const [news, setNews] = useState<NewsItem[]>(() => {
    const stored = localStorage.getItem('app-news');
    if (stored) {
      try {
        const parsed: NewsItem[] = JSON.parse(stored);
        if (parsed.length >= 6 && parsed[0]?.titleTranslations) {
          return parsed;
        }
      } catch (e) {
        // Fallback
      }
    }
    return mockNews;
  });

  // Delivery Requests (Рұқсаттама заявкалар)
  const [deliveryRequests, setDeliveryRequests] = useState<DeliveryRequest[]>(() => {
    const stored = localStorage.getItem('delivery-requests');
    if (stored) return JSON.parse(stored);
    return [
      { id: 'dr_1', station: 'Almaty-04 (Төле би)', fuel: 'АИ-92', amountTons: 10, date: '11 Маусым, 2026', status: 'pending', fuelId: 'ai92' },
      { id: 'dr_2', station: 'Astana-12 (Ақжол)', fuel: 'АИ-95', amountTons: 15, date: '10 Маусым, 2526', status: 'approved', fuelId: 'ai95' },
      { id: 'dr_3', station: 'Shym-02 (Тәуке Хан)', fuel: 'ДТ (Жазғы)', amountTons: 20, date: '08 Маусым, 2526', status: 'rejected', fuelId: 'dt' },
    ];
  });

  // System Alerts
  const [alerts, setAlerts] = useState<SystemAlert[]>(() => {
    const stored = localStorage.getItem('system-alerts');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          const seen = new Set<string>();
          return parsed.filter(item => {
            if (!item || !item.id || seen.has(item.id)) return false;
            seen.add(item.id);
            return true;
          });
        }
      } catch (e) {
        // Fall back to defaults on parse failure
      }
    }
    return defaultAlerts;
  });

  // Routine Tasks
  const [tasks, setTasks] = useState<RoutineTask[]>(() => {
    const stored = localStorage.getItem('routine-tasks');
    if (stored) return JSON.parse(stored);
    return defaultRoutineTasks;
  });

  // Competitor Rates
  const [competitorRates, setCompetitorRates] = useState<CompetitorRate[]>(() => {
    const stored = localStorage.getItem('competitor-rates');
    if (stored) return JSON.parse(stored);
    return defaultCompetitorRates;
  });

  // Price History Logs
  const [priceHistoryLogs, setPriceHistoryLogs] = useState<PriceHistoryLog[]>(() => {
    const stored = localStorage.getItem('price-history-logs');
    if (stored) return JSON.parse(stored);
    return [
      { id: 'pl_1', date: '11 Маусым, 2026, 12:44', fuel: 'AI-92', oldPrice: 203, newPrice: 205, changedBy: 'Admin (hobbydrn)', type: 'spot' },
      { id: 'pl_2', date: '10 Маусым, 2026, 09:12', fuel: 'Jet A-1', oldPrice: 325, newPrice: 330, changedBy: 'Admin (hobbydrn)', type: 'wholesale' },
    ];
  });

  // Calculations Archive
  const [calculationsArchive, setCalculationsArchive] = useState<any[]>(() => {
    const stored = localStorage.getItem('calculations-archive');
    if (stored) return JSON.parse(stored);
    return [];
  });

  // Managed Prices State (Singapore, Argus, Wholesale, Retail in KZT/Ton)
  const [managedPrices, setManagedPrices] = useState<ManagedPrice[]>(() => {
    const stored = localStorage.getItem('managed-prices-cms');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0 && 'priceRetail' in parsed[0]) {
          return parsed;
        }
      } catch (e) {
        // Fallback
      }
    }
    return defaultManagedPrices;
  });

  useEffect(() => {
    localStorage.setItem('managed-prices-cms', JSON.stringify(managedPrices));
  }, [managedPrices]);

  const addManagedPrice = (item: Omit<ManagedPrice, 'id'>) => {
    const id = generateId('mp_');
    const newPrice: ManagedPrice = {
      ...item,
      id
    };
    setManagedPrices(prev => [newPrice, ...prev]);
    logUserAction(`Жаңа баға көрсеткіші қосылды (${item.category}): ${item.name} (Бөлшек: ${item.priceRetail} ₸/тн, Көтерме: ${item.priceWholesale} ₸/тн).`);
  };

  const updateManagedPrice = (id: string, updates: Partial<ManagedPrice>) => {
    const target = managedPrices.find(p => p.id === id);
    if (target) {
      const oldRetail = target.priceRetail;
      const oldWholesale = target.priceWholesale;
      const newRetail = updates.priceRetail !== undefined ? Number(updates.priceRetail) : oldRetail;
      const newWholesale = updates.priceWholesale !== undefined ? Number(updates.priceWholesale) : oldWholesale;
      
      if (oldRetail !== newRetail || oldWholesale !== newWholesale) {
        addPriceHistoryLog({
          fuel: target.name,
          oldPrice: oldRetail,
          newPrice: newRetail,
          changedBy: currentUser ? `${currentUser.fullName} (${currentUser.role})` : `Admin (${role})`,
          type: target.category === 'smartme' ? 'retail' : 'wholesale'
        });
        logUserAction(`Баға көрсеткіші өңделді: ${target.name} (Бөлшек: ${oldRetail} -> ${newRetail} ₸/тн, Көтерме: ${oldWholesale} -> ${newWholesale} ₸/тн)`);
      } else {
        logUserAction(`Баға көрсеткіші жаңартылды (баға өзгермеді): ${target.name}`);
      }
    }

    setManagedPrices(prev => prev.map(item => {
      if (item.id === id) {
        const oldRetail = item.priceRetail;
        const oldWholesale = item.priceWholesale;
        const newRetail = updates.priceRetail !== undefined ? Number(updates.priceRetail) : oldRetail;
        const newWholesale = updates.priceWholesale !== undefined ? Number(updates.priceWholesale) : oldWholesale;
        return { ...item, ...updates, priceRetail: newRetail, priceWholesale: newWholesale };
      }
      return item;
    }));
  };

  const deleteManagedPrice = (id: string) => {
    const target = managedPrices.find(p => String(p.id) === String(id));
    if (target) {
      logUserAction(`Баға көрсеткіші жойылды: ${target.name} (${target.category})`);
    }
    setManagedPrices(prev => prev.filter(item => String(item.id) !== String(id)));
  };

  // Oil Tank Volumes State
  const [tanksState, setTanksState] = useState<any[]>(() => {
    const stored = localStorage.getItem('tanks-state');
    if (stored) return JSON.parse(stored);
    return defaultTanks;
  });

  // Tank Water Levels State (cm)
  const [waterLevels, setWaterLevels] = useState<{ [tankId: string]: number }>(() => {
    const stored = localStorage.getItem('water-levels');
    if (stored) return JSON.parse(stored);
    return {
      'T-01': 1.2,
      'T-02': 2.4,
      'T-03': 6.2, // Trigger alert initially
      'T-04': 0.8,
      'T-05': 3.1,
    };
  });

  // Store changes to LocalStorage
  useEffect(() => {
    safeLocalStorageSet('spot-rates', JSON.stringify(spotRates));
  }, [spotRates]);

  useEffect(() => {
    safeLocalStorageSet('app-news', JSON.stringify(news));
  }, [news]);

  useEffect(() => {
    safeLocalStorageSet('delivery-requests', JSON.stringify(deliveryRequests));
  }, [deliveryRequests]);

  useEffect(() => {
    safeLocalStorageSet('system-alerts', JSON.stringify(alerts));
  }, [alerts]);

  useEffect(() => {
    safeLocalStorageSet('routine-tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    safeLocalStorageSet('competitor-rates', JSON.stringify(competitorRates));
  }, [competitorRates]);

  useEffect(() => {
    safeLocalStorageSet('price-history-logs', JSON.stringify(priceHistoryLogs));
  }, [priceHistoryLogs]);

  useEffect(() => {
    safeLocalStorageSet('calculations-archive', JSON.stringify(calculationsArchive));
  }, [calculationsArchive]);

  useEffect(() => {
    safeLocalStorageSet('tanks-state', JSON.stringify(tanksState));
  }, [tanksState]);

  useEffect(() => {
    safeLocalStorageSet('water-levels', JSON.stringify(waterLevels));
  }, [waterLevels]);

  useEffect(() => {
    safeLocalStorageSet('app-theme', 'light');
    document.documentElement.classList.remove('dark');
  }, []);

  // Actions
  const addSpotRate = (rate: Omit<SpotRate, 'id'>) => {
    const newRate = {
      ...rate,
      id: generateId(),
    };
    setSpotRates(prev => [...prev, newRate]);
    addAlert({
      type: 'info',
      text: `Жаңа ағымдағы баға көзі құрылды: ${rate.name} (${rate.price} ₸ / л, ${rate.statusLabel}).`,
    });
    addPriceHistoryLog({
      fuel: rate.name,
      oldPrice: 0,
      newPrice: rate.price,
      changedBy: currentUser ? `${currentUser.fullName} (${currentUser.role})` : `Admin (${role})`,
      type: 'spot',
    });
    logUserAction(`Жаңа отын бағасын қосты: ${rate.name} (${rate.price} ₸)`);
  };

  const updateSpotRate = (id: string, updates: Partial<SpotRate>) => {
    setSpotRates(prev => {
      const target = prev.find(p => p.id === id);
      if (target) {
        if (updates.price !== undefined && target.price !== updates.price) {
          addPriceHistoryLog({
            fuel: updates.name || target.name,
            oldPrice: target.price,
            newPrice: updates.price,
            changedBy: currentUser ? `${currentUser.fullName} (${currentUser.role})` : `Admin (${role})`,
            type: 'spot',
          });
        }
        let logText = `Ағымдағы бағаны өзгертті: ${target.name}`;
        const parts: string[] = [];
        if (updates.name !== undefined && target.name !== updates.name) {
          parts.push(`атауы: ${target.name} -> ${updates.name}`);
        }
        if (updates.price !== undefined && target.price !== updates.price) {
          parts.push(`бағасы: ${target.price} -> ${updates.price} ₸`);
        }
        if (updates.standard !== undefined && target.standard !== updates.standard) {
          parts.push(`стандарт: ${target.standard || 'жоқ'} -> ${updates.standard}`);
        }
        if (updates.statusLabel !== undefined && target.statusLabel !== updates.statusLabel) {
          parts.push(`сипаттама: ${target.statusLabel || 'жоқ'} -> ${updates.statusLabel}`);
        }
        if (parts.length > 0) {
          logText += ` (${parts.join(', ')})`;
          logUserAction(logText);
        }
      }
      return prev.map(item => item.id === id ? { ...item, ...updates } : item);
    });
  };

  const deleteSpotRate = (id: string) => {
    const target = spotRates.find(p => String(p.id) === String(id));
    if (target) {
      addAlert({
        type: 'warning',
        text: `Басты беттегі баға жойылды: ${target.name}.`,
      });
      logUserAction(`Отын бағасын жойды: ${target.name}`);
    }
    setSpotRates(prev => prev.filter(item => String(item.id) !== String(id)));
  };

  // Delivery Requests Actions
  const addDeliveryRequest = (req: Omit<DeliveryRequest, 'id' | 'date' | 'status'>) => {
    const newReq: DeliveryRequest = {
      ...req,
      id: generateId('dr_'),
      date: new Date().toLocaleDateString('kk-KZ', { day: '2-digit', month: 'long', year: 'numeric' }),
      status: 'pending',
    };
    setDeliveryRequests(prev => [newReq, ...prev]);
    addAlert({
      type: 'info',
      text: `Бекеттен жаңа жеткізілім өтінімі (заявка) берілді: ${req.station} • ${req.amountTons} тонна ${req.fuel}.`,
    });
    logUserAction(`Жеткізілімге жаңа өтінім берді: ${req.station} - ${req.amountTons} тонна ${req.fuel}`);
  };

  const updateDeliveryStatus = (id: string, status: 'approved' | 'rejected') => {
    const req = deliveryRequests.find(r => r.id === id);
    if (!req) return;

    if (status === 'approved') {
      let matchingTankId = '';
      if (req.fuelId === 'jet') matchingTankId = 'T-01';
      else if (req.fuelId === 'ts1') matchingTankId = 'T-02';
      else if (req.fuelId === 'rt') matchingTankId = 'T-03';
      else if (req.fuelId === 'ai92') matchingTankId = 'T-04';
      else matchingTankId = 'T-05'; // DT

      setTanksState(tState => tState.map(tank => {
        if (tank.id === matchingTankId) {
          const reqDensity = req.fuelId === 'ai92' ? 0.735 : req.fuelId === 'ai95' ? 0.750 : req.fuelId === 'dt' ? 0.840 : 0.795;
          const volM3 = req.amountTons / reqDensity;
          const remainingVal = Math.max(0, tank.volume - volM3);
          return { ...tank, volume: Math.round(remainingVal) };
        }
        return tank;
      }));

      addAlert({
        type: 'info',
        text: `Өтініші расталды! ${req.amountTons} тонна ${req.fuel} ${req.station} бағытына жіберілді. Мұнайбаза резервуар қоры жаңартылды.`,
      });
    } else {
      addAlert({
        type: 'warning',
        text: `${req.station} станциясының ${req.amountTons} тонна ${req.fuel} өтінімі қайтарылды.`,
      });
    }

    logUserAction(`Өтінім мәртебесін өзгертті (${status === 'approved' ? 'Расталды' : 'Бас тартылды'}): ID ${id} (${req.station})`);

    setDeliveryRequests(prev => prev.map(item => item.id === id ? { ...item, status } : item));
  };

  // Alerts actions
  const addAlert = (alert: Omit<SystemAlert, 'id' | 'date' | 'isRead'>) => {
    const newAlert: SystemAlert = {
      ...alert,
      id: generateId('a_'),
      date: new Date().toLocaleDateString('kk-KZ', { day: '2-digit', month: 'long' }) + ', ' + new Date().toLocaleTimeString('kk-KZ', { hour: '2-digit', minute: '2-digit' }),
      isRead: false,
    };
    setAlerts(prev => [newAlert, ...prev]);
  };

  const markAlertAsRead = (id: string) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, isRead: true } : a));
  };

  const clearAllAlerts = () => {
    setAlerts([]);
  };

  // Routine Tasks
  const addTask = (text: string) => {
    const newTask: RoutineTask = {
      id: generateId('t_'),
      text,
      isCompleted: false,
      date: new Date().toLocaleDateString('kk-KZ', { day: '2-digit', month: 'long', year: 'numeric' }),
    };
    setTasks(prev => [newTask, ...prev]);
    logUserAction(`Тапсырма қосты: "${text}"`);
  };

  const toggleTask = (id: string) => {
    const target = tasks.find(t => t.id === id);
    if (target) {
      logUserAction(`Тапсырма мәртебесін ауыстырды: "${target.text}"`);
      setTasks(prev => prev.map(t => t.id === id ? { ...t, isCompleted: !t.isCompleted } : t));
    }
  };

  const deleteTask = (id: string) => {
    const target = tasks.find(t => t.id === id);
    if (target) {
      logUserAction(`Тапсырманы жойды: "${target.text}"`);
    }
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  // Competitors
  const updateCompetitorRate = (id: string, updates: Partial<CompetitorRate>) => {
    const target = competitorRates.find(c => c.id === id);
    if (target) {
      logUserAction(`Бәсекелес (${target.brand}) бағасын өзгертті`);
    }
    setCompetitorRates(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
  };

  // Price logs
  const addPriceHistoryLog = (log: Omit<PriceHistoryLog, 'id' | 'date'>) => {
    const newLog: PriceHistoryLog = {
      ...log,
      id: generateId('pl_'),
      date: new Date().toLocaleDateString('kk-KZ', { day: 'numeric', month: 'long', year: 'numeric' }) + ', ' + new Date().toLocaleTimeString('kk-KZ', { hour: '2-digit', minute: '2-digit' }),
    };
    setPriceHistoryLogs(prev => [newLog, ...prev]);
  };

  // News Items management
  const addNewsItem = (item: Omit<NewsItem, 'id'> & { date?: string }) => {
    const newItem: NewsItem = {
      ...item,
      id: generateId(),
      date: item.date || new Date().toLocaleDateString('kk-KZ', { day: '2-digit', month: 'long', year: 'numeric' }),
    };
    setNews(prev => [newItem, ...prev]);
    addAlert({
      type: 'info',
      text: `Жаңалық тізімінде жаңа материал жарияланды: "${item.title}".`,
    });
    logUserAction(`Жаңалық жариялады: "${item.title}"`);
  };

  const deleteNewsItem = (id: string) => {
    const target = news.find(n => String(n.id) === String(id));
    if (target) {
      logUserAction(`Жаңалықты өшірді: "${target.title}"`);
    }
    setNews(prev => prev.filter(n => String(n.id) !== String(id)));
  };

  const updateNewsItem = (id: string, updates: Partial<NewsItem>) => {
    const target = news.find(n => n.id === id);
    if (target) {
      logUserAction(`Жаңалықты өзгертті: "${updates.title || target.title}"`);
    }
    setNews(prev => prev.map(n => n.id === id ? { ...n, ...updates } : n));
  };

  const updateNewsList = (list: NewsItem[]) => {
    setNews(list);
    logUserAction(`Жаңалықтар тізімін жаңартты`);
  };

  // Calculations Archive
  const saveCalculation = (calc: any) => {
    setCalculationsArchive(prev => [calc, ...prev]);
    logUserAction(`Коммерциялық ұсынысты архивке сақтады (${calc.presetName || 'Жеке есеп'})`);
  };

  const deleteCalculation = (id: string) => {
    setCalculationsArchive(prev => prev.filter(c => c.id !== id));
    logUserAction(`Архивтелген есепті өшірді`);
  };

  // Virtual tanks reservation booking
  const bookVolume = (tankId: string, volumeM3: number) => {
    let success = false;
    const target = tanksState.find(t => t.id === tankId);
    if (target && target.volume >= volumeM3) {
      success = true;
      setTanksState(prev => prev.map(t => t.id === tankId ? { ...t, volume: Math.round(t.volume - volumeM3) } : t));
      addAlert({
        type: 'info',
        text: `Қорға сәтті бронь орнатылды: ${target.fuel} қор қоймасынан ${volumeM3.toFixed(1)} м³ кемуге дайын.`,
      });
      logUserAction(`Резервуар отынын брондады: ${tankId} (${target.fuel}) - ${volumeM3.toFixed(1)} м³`);
    } else {
      addAlert({
        type: 'error',
        text: `Брондау қатесі: ${target?.id || tankId} резервуарында қажетті көлем (${volumeM3.toFixed(1)} м³) жеткіліксіз!`,
      });
    }
    return success;
  };

  const updateWaterLevel = (tankId: string, level: number) => {
    setWaterLevels(prev => ({ ...prev, [tankId]: level }));
    if (level > 5.0) {
      addAlert({
        type: 'error',
        text: `Қауіп! ${tankId} резервуарындағы су деңгейі рұқсат етілген шектен асты: ${level} см! Қақпақ тығыздығы мен ыдыс бүтіндігін тексеру қажет!`,
      });
    } else {
      addAlert({
        type: 'info',
        text: `${tankId} резервуарының су деңгейі жаңартылды: ${level} см (нормада).`,
      });
    }
  };

  const t = (key: keyof typeof translations.en) => {
    return translations[lang][key] || translations.en[key] || '';
  };

  return (
    <AppContext.Provider value={{
      lang, setLang, theme, setTheme, role, setRole: changeRoleSafely, t,
      currentUser, setCurrentUser, loginUser, logoutUser,
      auditLogs, logUserAction,
      adminEmails, deleteAdminEmail,
      spotRates, addSpotRate, updateSpotRate, deleteSpotRate,
      deliveryRequests, addDeliveryRequest, updateDeliveryStatus,
      alerts, addAlert, markAlertAsRead, clearAllAlerts,
      tasks, addTask, toggleTask, deleteTask,
      competitorRates, updateCompetitorRate,
      priceHistoryLogs, addPriceHistoryLog,
      news, addNewsItem, updateNewsItem, deleteNewsItem, updateNewsList,
      calculationsArchive, saveCalculation, deleteCalculation,
      tanksState, setTanksState, addTank, updateTank, deleteTank, bookVolume, toggleTankStatus,
      waterLevels, updateWaterLevel,
      usersList, updateUserRole, updateUserDetails, updateUserTanksAndPermissions, addUser, deleteUser,
      priceDisplayUnit, setPriceDisplayUnit,
      stationsList, addStation, updateStation, deleteStation,
      regionRates, updateRegionRate, addRegionRateFuel, deleteRegionRateFuel,
      bannersState, updateBannersState, clearAuditLogs,
      managedPrices, addManagedPrice, updateManagedPrice, deleteManagedPrice,
      leadersList, updateLeadersList, contactsState, updateContactsState
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppContext must be used within AppProvider');
  return context;
}
