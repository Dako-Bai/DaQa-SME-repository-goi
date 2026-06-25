import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Activity, Sliders, Plus, Trash2, Download, Search, Filter, 
  MapPin, Thermometer, Database, Droplet, Check, X, 
  AlertTriangle, CheckCircle2, RefreshCw, FileText, DollarSign, Gauge, Fuel, ShoppingBag
} from 'lucide-react';
import { 
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, 
  PieChart, Pie, Cell, BarChart, Bar, LineChart, Line 
} from 'recharts';
import { useAppContext } from '../contexts/AppContext';

// Initial Gas Station structures
interface GasStation {
  id: string;
  name: string;
  address: string;
  status: 'active' | 'maintenance' | 'offline';
  tanks: {
    id: string;
    fuel: string;
    volume: number;
    capacity: number;
    waterLevel: number;
    temperature: number;
  }[];
  dispensers: {
    id: string;
    status: 'idle' | 'pumping' | 'offline';
    currentNozzleFuel: string;
    activeSaleLiters: number;
    completedSalesToday: number;
  }[];
}

const DEFAULT_STATIONS: GasStation[] = [
  {
    id: 'azk-01',
    name: 'АЗК №01 (Қабдолов)',
    address: 'Қабдолов көшесі, 22А, Алматы қ.',
    status: 'active',
    tanks: [
      { id: 'AZK-T1', fuel: 'АИ-95 Premium', volume: 18500, capacity: 25000, waterLevel: 0.8, temperature: 15.2 },
      { id: 'AZK-T2', fuel: 'АИ-92 Standard', volume: 22000, capacity: 25000, waterLevel: 1.1, temperature: 15.5 },
      { id: 'AZK-T3', fuel: 'ДТ Летний', volume: 28500, capacity: 40000, waterLevel: 2.1, temperature: 16.1 },
      { id: 'AZK-T4', fuel: 'ДТ-З Зимний', volume: 9200, capacity: 20000, waterLevel: 0.5, temperature: 14.8 }
    ],
    dispensers: [
      { id: 'TR-1', status: 'pumping', currentNozzleFuel: 'АИ-95 Premium', activeSaleLiters: 42.5, completedSalesToday: 142 },
      { id: 'TR-2', status: 'idle', currentNozzleFuel: 'АИ-92 Standard', activeSaleLiters: 0, completedSalesToday: 189 },
      { id: 'TR-3', status: 'pumping', currentNozzleFuel: 'ДТ Летний', activeSaleLiters: 110.4, completedSalesToday: 98 },
      { id: 'TR-4', status: 'offline', currentNozzleFuel: 'АИ-92 Standard', activeSaleLiters: 0, completedSalesToday: 0 }
    ]
  },
  {
    id: 'azk-02',
    name: 'АЗК №02 (Төле би)',
    address: 'Төле би көшесі, 189, Алматы қ.',
    status: 'active',
    tanks: [
      { id: 'AZK2-T1', fuel: 'АИ-95 Premium', volume: 14200, capacity: 20000, waterLevel: 0.4, temperature: 14.9 },
      { id: 'AZK2-T2', fuel: 'АИ-92 Standard', volume: 19500, capacity: 20000, waterLevel: 0.9, temperature: 15.1 },
      { id: 'AZK2-T3', fuel: 'ДТ Летний', volume: 15100, capacity: 30000, waterLevel: 1.5, temperature: 15.8 }
    ],
    dispensers: [
      { id: 'TR-1', status: 'idle', currentNozzleFuel: 'АИ-95 Premium', activeSaleLiters: 0, completedSalesToday: 115 },
      { id: 'TR-2', status: 'pumping', currentNozzleFuel: 'АИ-92 Standard', activeSaleLiters: 18.2, completedSalesToday: 210 },
      { id: 'TR-3', status: 'idle', currentNozzleFuel: 'ДТ Летний', activeSaleLiters: 0, completedSalesToday: 76 }
    ]
  },
  {
    id: 'azk-03',
    name: 'АЗК №03 (Майлин)',
    address: 'Майлин көшесі, 79, Алматы қ.',
    status: 'active',
    tanks: [
      { id: 'AZK3-T1', fuel: 'АИ-95 Premium', volume: 11000, capacity: 20000, waterLevel: 0.6, temperature: 15.0 },
      { id: 'AZK3-T2', fuel: 'АИ-92 Standard', volume: 17200, capacity: 20000, waterLevel: 0.8, temperature: 15.3 },
      { id: 'AZK3-T3', fuel: 'ДТ Летний', volume: 22400, capacity: 30000, waterLevel: 1.2, temperature: 16.0 }
    ],
    dispensers: [
      { id: 'TR-1', status: 'pumping', currentNozzleFuel: 'АИ-92 Standard', activeSaleLiters: 35.8, completedSalesToday: 168 },
      { id: 'TR-2', status: 'idle', currentNozzleFuel: 'АИ-95 Premium', activeSaleLiters: 0, completedSalesToday: 130 }
    ]
  }
];

export default function AZKPage() {
  const { lang, currentUser, logUserAction, role } = useAppContext();
  const isAdmin = role === 'admin';

  const [stations, setStations] = React.useState<GasStation[]>(() => {
    const saved = localStorage.getItem('smartme_azk_stations');
    return saved ? JSON.parse(saved) : DEFAULT_STATIONS;
  });

  React.useEffect(() => {
    localStorage.setItem('smartme_azk_stations', JSON.stringify(stations));
  }, [stations]);

  const [activeStationId, setActiveStationId] = React.useState('azk-01');
  const activeStation = stations.find(s => s.id === activeStationId) || stations[0] || DEFAULT_STATIONS[0];

  const [selectedTankId, setSelectedTankId] = React.useState<string>('');
  const activeTank = activeStation.tanks.find(t => t.id === selectedTankId) || activeStation.tanks[0];

  React.useEffect(() => {
    if (activeStation.tanks.length > 0) {
      setSelectedTankId(activeStation.tanks[0].id);
    } else {
      setSelectedTankId('');
    }
  }, [activeStationId]);

  // Form State for Adding Stations
  const [showAddStationModal, setShowAddStationModal] = React.useState(false);
  const [newStationName, setNewStationName] = React.useState('');
  const [newStationAddress, setNewStationAddress] = React.useState('');

  // Form State for edit in place
  const [isEditMode, setIsEditMode] = React.useState(false);
  const [editTankVolume, setEditTankVolume] = React.useState(0);
  const [editTankTemp, setEditTankTemp] = React.useState(0);
  const [editTankWater, setEditTankWater] = React.useState(0);

  React.useEffect(() => {
    if (activeTank) {
      setEditTankVolume(activeTank.volume);
      setEditTankTemp(activeTank.temperature);
      setEditTankWater(activeTank.waterLevel);
    }
  }, [activeTank, isEditMode]);

  const handleSaveTankDetails = () => {
    if (!activeTank) return;
    setStations(prev => prev.map(s => {
      if (s.id === activeStation.id) {
        return {
          ...s,
          tanks: s.tanks.map(t => {
            if (t.id === activeTank.id) {
              return {
                ...t,
                volume: editTankVolume,
                temperature: editTankTemp,
                waterLevel: editTankWater
              };
            }
            return t;
          })
        };
      }
      return s;
    }));
    logUserAction(`АЗС Танк өзгертілді: ${activeTank.id}, көлемі: ${editTankVolume}л, темп: ${editTankTemp}°C`);
    setIsEditMode(false);
  };

  const handleAddStation = () => {
    if (!newStationName.trim()) return;
    const newId = `azk-${Date.now().toString().slice(-2)}`;
    const newS: GasStation = {
      id: newId,
      name: newStationName,
      address: newStationAddress || 'Алматы қ.',
      status: 'active',
      tanks: [
        { id: `${newId.toUpperCase()}-T1`, fuel: 'АИ-95 Premium', volume: 15000, capacity: 25000, waterLevel: 0.5, temperature: 15.0 },
        { id: `${newId.toUpperCase()}-T2`, fuel: 'АИ-92 Standard', volume: 18000, capacity: 25000, waterLevel: 0.8, temperature: 15.0 }
      ],
      dispensers: [
        { id: 'TR-1', status: 'idle', currentNozzleFuel: 'АИ-95 Premium', activeSaleLiters: 0, completedSalesToday: 10 }
      ]
    };
    setStations(prev => [...prev, newS]);
    logUserAction(`Жаңа АЗС бекеті қосылды: ${newStationName}`);
    setShowAddStationModal(false);
    setNewStationName('');
    setNewStationAddress('');
  };

  const handleDeleteStation = (id: string, name: string) => {
    if (confirm(`Назар аударыңыз! ${name} АЗС бекетін өшіруді растайсыз ба?`)) {
      setStations(prev => prev.filter(s => s.id !== id));
      logUserAction(`${name} АЗС бекеті толығымен жүйеден өшірілді`);
      if (activeStationId === id) {
        setActiveStationId('azk-01');
      }
    }
  };

  // Recharts Sales data for Gas Station
  const azkSalesTrend = [
    { hour: '08:00', 'АИ-95': 120, 'АИ-92': 340, 'ДТ': 210 },
    { hour: '10:00', 'АИ-95': 180, 'АИ-92': 480, 'ДТ': 350 },
    { hour: '12:00', 'АИ-95': 240, 'АИ-92': 550, 'ДТ': 420 },
    { hour: '14:00', 'АИ-95': 150, 'АИ-92': 390, 'ДТ': 290 },
    { hour: '16:00', 'АИ-95': 190, 'АИ-92': 460, 'ДТ': 310 },
    { hour: '18:00', 'АИ-95': 310, 'АИ-92': 690, 'ДТ': 540 },
    { hour: '20:00', 'АИ-95': 220, 'АИ-92': 510, 'ДТ': 380 }
  ];

  const azkHourlyCustomers = [
    { hour: '08:00', cars: 45 },
    { hour: '10:00', cars: 72 },
    { hour: '12:00', cars: 88 },
    { hour: '14:00', cars: 55 },
    { hour: '16:00', cars: 64 },
    { hour: '18:00', cars: 124 },
    { hour: '20:00', cars: 82 }
  ];

  // AZK Calculator States
  const [calcTankVol, setCalcTankVol] = React.useState(15000);
  const [calcTankTemp, setCalcTankTemp] = React.useState(15);
  const [calcExpansionCoeff, setCalcExpansionCoeff] = React.useState(0.00095); // AI-95 thermal coeff
  const [standardVolumeResult, setStandardVolumeResult] = React.useState(0);

  React.useEffect(() => {
    // Standard volume at 15 degrees Celsius formula: V_std = V_obs * (1 - coeff * (T_obs - 15))
    const deltaT = calcTankTemp - 15;
    const vStd = calcTankVol * (1 - calcExpansionCoeff * deltaT);
    setStandardVolumeResult(Math.round(vStd * 100) / 100);
  }, [calcTankVol, calcTankTemp, calcExpansionCoeff]);

  return (
    <div className="min-h-screen bg-slate-900 text-white py-8 px-4 sm:px-6 lg:px-8 space-y-8 select-none">
      
      {/* 1. GEOGRAPHIC STATS RAIL */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-slate-950 p-4 rounded-3xl border border-white/10 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-500/10 rounded-2xl border border-blue-500/20">
            <Fuel className="w-6 h-6 text-blue-400" />
          </div>
          <div>
            <h1 className="text-lg font-black tracking-wider text-white uppercase font-sans">
              АЗК Ағымдағы Мониторинг & Желі
            </h1>
            <p className="text-[10px] text-slate-400 font-mono">
              Бөлшек сауда бағалары, резервуар қорлары мен таратқыш бағаналары
            </p>
          </div>
        </div>

        {/* Action button: add station */}
        <div className="flex flex-wrap gap-2">
          {stations.map(s => (
            <button
              key={s.id}
              onClick={() => setActiveStationId(s.id)}
              className={`px-4 py-2 rounded-2xl text-xs font-black uppercase tracking-wider transition ${
                activeStationId === s.id
                  ? 'bg-blue-600 text-white border-2 border-white'
                  : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10'
              }`}
            >
              {s.name}
            </button>
          ))}
          {isAdmin && (
            <button
              onClick={() => setShowAddStationModal(true)}
              className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl text-xs font-black uppercase transition-all"
            >
              + АЗС ҚОСУ
            </button>
          )}
        </div>
      </div>

      {/* 2. FORECOURT SCHEMATIC INTERACTIVE BOARD */}
      <div className="relative w-full rounded-2xl overflow-hidden shadow-2xl bg-slate-950 border border-white/20">
        <div className="p-4 flex justify-between items-center bg-black/40 border-b border-white/10">
          <span className="text-xs font-black tracking-widest text-blue-400 uppercase font-mono">
            FORECOURT & DISPENSER TELEMETRY MAP (АЗК КАРТАСЫ)
          </span>
          <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-400 text-[9px] font-extrabold uppercase rounded-lg font-mono">
            СТАТУС: БЕЛСЕНДІ байланыс
          </span>
        </div>

        {/* Forecourt SVG Graphic Canvas */}
        <div className="relative w-full h-[320px] sm:h-[420px] bg-slate-950 flex items-center justify-center p-4">
          <svg viewBox="0 0 1000 400" className="w-full h-full stroke-blue-500/20 fill-none">
            <pattern id="azk-grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" stroke="#1e293b" strokeWidth="0.5" />
            </pattern>
            <rect width="100%" height="100%" fill="url(#azk-grid)" />

            {/* Roads & Entrance */}
            <path d="M 50 200 L 950 200" stroke="#334155" strokeWidth="40" strokeDasharray="10,10" opacity="0.3" />
            
            {/* Station Building (Маркет / Касса) */}
            <g transform="translate(420, 40)" className="opacity-90">
              <rect x="0" y="0" width="160" height="70" rx="12" fill="#0f172a" stroke="#1E90FF" strokeWidth="2" />
              <text x="80" y="30" textAnchor="middle" fill="#1E90FF" fontSize="9" fontWeight="black" fontFamily="sans-serif">MERCURY MARKET</text>
              <text x="80" y="48" textAnchor="middle" fill="#64748b" fontSize="7" fontWeight="bold" fontFamily="monospace">№01 КАССА • АКТИВТІ</text>
            </g>

            {/* Dispenser Nozzle Island 1 & 2 */}
            <g transform="translate(180, 260)" className="opacity-90">
              <rect x="0" y="0" width="180" height="40" rx="6" fill="#1e293b" stroke="#475569" />
              <rect x="30" y="-20" width="30" height="20" rx="4" fill="#0f172a" stroke="#38bdf8" strokeWidth="1.5" />
              <rect x="120" y="-20" width="30" height="20" rx="4" fill="#0f172a" stroke="#fb923c" strokeWidth="1.5" />
              <text x="45" y="-6" textAnchor="middle" fill="#38bdf8" fontSize="8" fontWeight="bold">TR-1</text>
              <text x="135" y="-6" textAnchor="middle" fill="#fb923c" fontSize="8" fontWeight="bold">TR-2</text>
              <text x="90" y="24" textAnchor="middle" fill="#94a3b8" fontSize="8" fontWeight="bold">ОСТРОВОК №1</text>
            </g>

            {/* Dispenser Nozzle Island 3 & 4 */}
            <g transform="translate(640, 260)" className="opacity-90">
              <rect x="0" y="0" width="180" height="40" rx="6" fill="#1e293b" stroke="#475569" />
              <rect x="30" y="-20" width="30" height="20" rx="4" fill="#0f172a" stroke="#34d399" strokeWidth="1.5" />
              <rect x="120" y="-20" width="30" height="20" rx="4" fill="#0f172a" stroke="#94a3b8" strokeWidth="1" />
              <text x="45" y="-6" textAnchor="middle" fill="#34d399" fontSize="8" fontWeight="bold">TR-3</text>
              <text x="135" y="-6" textAnchor="middle" fill="#94a3b8" fontSize="8" fontWeight="bold">TR-4</text>
              <text x="90" y="24" textAnchor="middle" fill="#94a3b8" fontSize="8" fontWeight="bold">ОСТРОВОК №2</text>
            </g>

            {/* Fuel Pipe schematics */}
            <path d="M 225 240 V 170 H 420" stroke="#38bdf8" strokeWidth="1.5" opacity="0.3" strokeDasharray="3,3" />
            <path d="M 315 240 V 170 H 420" stroke="#fb923c" strokeWidth="1.5" opacity="0.3" strokeDasharray="3,3" />
            <path d="M 685 240 V 170 H 580" stroke="#34d399" strokeWidth="1.5" opacity="0.3" strokeDasharray="3,3" />

            {/* Small tank farm outlines */}
            <g transform="translate(80, 50)" opacity="0.25">
              <rect width="100" height="60" rx="8" fill="none" stroke="#e2e8f0" strokeWidth="1" />
              <text x="50" y="35" textAnchor="middle" fill="#e2e8f0" fontSize="7" fontFamily="monospace">TNK-FARM AREA</text>
            </g>
          </svg>

          {/* Absolute Overlays for dispensers activity */}
          <div className="absolute inset-x-0 bottom-4 flex justify-around px-8 gap-4 overflow-x-auto">
            {activeStation.dispensers.map(tr => {
              const colors = tr.status === 'pumping' ? 'border-emerald-500 bg-emerald-950/80 text-emerald-300' :
                             tr.status === 'idle' ? 'border-sky-500 bg-slate-950/80 text-sky-300' :
                             'border-slate-800 bg-slate-900/40 text-slate-500';
              return (
                <div key={tr.id} className={`p-3 rounded-2xl border min-w-40 shadow-lg text-xs space-y-1 ${colors}`}>
                  <div className="flex justify-between items-center font-bold">
                    <span>БАҒАНА: {tr.id}</span>
                    <span className="uppercase text-[8px] px-1.5 py-0.5 rounded-full bg-black/45">{tr.status}</span>
                  </div>
                  {tr.status === 'pumping' ? (
                    <div className="space-y-1 font-mono">
                      <div className="text-[10px] text-emerald-400">Отын: {tr.currentNozzleFuel}</div>
                      <div className="text-base font-black animate-pulse">{tr.activeSaleLiters} л</div>
                    </div>
                  ) : (
                    <div className="text-[10px] text-slate-400">
                      Күту режимінде<br/>
                      Бүгін: {tr.completedSalesToday} құю
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 3. UNDERGROUND TANKS & TELEMETRY CONTROLS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: List of Underground tanks */}
        <div className="lg:col-span-9 space-y-6">
          <div className="bg-slate-950 p-6 rounded-3xl border border-white/10 space-y-6">
            <h2 className="text-sm font-black tracking-wider uppercase text-blue-400 flex items-center gap-2">
              <Database className="w-4.5 h-4.5" />
              АЗС ЖЕРАСТЫ РЕЗЕРВУАРЛАР СЕНСОР ТОРЫ
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
              {activeStation.tanks.map(t => {
                const isSelected = selectedTankId === t.id;
                const fillPct = Math.round((t.volume / t.capacity) * 100) || 0;
                
                // Color mapping
                const colors = t.fuel.includes('95') ? 'from-purple-500 to-indigo-600' :
                               t.fuel.includes('92') ? 'from-amber-400 to-orange-500' :
                               'from-emerald-400 to-teal-500';

                return (
                  <div
                    key={t.id}
                    onClick={() => setSelectedTankId(t.id)}
                    className={`p-4 rounded-3xl border-2 transition-all cursor-pointer relative ${
                      isSelected 
                        ? 'bg-blue-600/10 border-blue-400 shadow-blue-500/10 shadow-2xl'
                        : 'bg-white/5 border-white/10 hover:border-white/20'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-3">
                      <span className="px-2 py-0.5 bg-slate-900 text-slate-300 rounded-lg text-[10px] font-mono border border-white/10">{t.id}</span>
                      <span className="text-[9px] text-slate-400 font-bold">{t.temperature}°C</span>
                    </div>

                    {/* Tank visual level */}
                    <div className="h-2.5 w-full bg-slate-900 rounded-full overflow-hidden mb-3.5 border border-white/5">
                      <div 
                        className={`h-full bg-gradient-to-r ${colors} transition-all duration-500`}
                        style={{ width: `${fillPct}%` }}
                      />
                    </div>

                    <div className="space-y-1">
                      <div className="text-[11px] font-extrabold text-white truncate">{t.fuel}</div>
                      <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                        <span>Көлемі:</span>
                        <span className="font-bold text-white">{t.volume.toLocaleString()} л ({fillPct}%)</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Mini Rez-Info Panel (Shrunk size requested) */}
        <div className="lg:col-span-3">
          {activeTank ? (
            <div className="bg-slate-950 p-5 rounded-3xl border border-white/15 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <span className="text-xs font-black text-blue-400 uppercase font-mono">REZ-INFO (Танк)</span>
                {isAdmin && (
                  <button
                    onClick={() => setIsEditMode(!isEditMode)}
                    className="text-[9px] font-bold px-2 py-1 bg-white/10 hover:bg-white/20 rounded-lg border border-white/10 transition"
                  >
                    {isEditMode ? 'Болдырмау' : 'Өңдеу'}
                  </button>
                )}
              </div>

              {isEditMode ? (
                <div className="space-y-3 text-xs">
                  <div className="space-y-1">
                    <label className="text-slate-400 font-bold text-[10px] uppercase">Ағымдағы көлем (литр):</label>
                    <input
                      type="number"
                      value={editTankVolume}
                      onChange={(e) => setEditTankVolume(Number(e.target.value))}
                      className="w-full bg-slate-900 border border-slate-700 px-2.5 py-1.5 rounded-lg text-white font-mono"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-slate-400 font-bold text-[10px] uppercase">Температурасы (°C):</label>
                    <input
                      type="number"
                      value={editTankTemp}
                      onChange={(e) => setEditTankTemp(Number(e.target.value))}
                      className="w-full bg-slate-900 border border-slate-700 px-2.5 py-1.5 rounded-lg text-white font-mono"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-slate-400 font-bold text-[10px] uppercase">Су деңгейі (см):</label>
                    <input
                      type="number"
                      value={editTankWater}
                      onChange={(e) => setEditTankWater(Number(e.target.value))}
                      className="w-full bg-slate-900 border border-slate-700 px-2.5 py-1.5 rounded-lg text-white font-mono"
                    />
                  </div>
                  <button
                    onClick={handleSaveTankDetails}
                    className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold uppercase tracking-wider text-[10px] transition"
                  >
                    Сақтау
                  </button>
                </div>
              ) : (
                <div className="space-y-3.5 text-xs">
                  <div className="bg-slate-900/60 p-3 rounded-2xl border border-white/5 space-y-1">
                    <span className="text-[9px] text-slate-400 uppercase font-mono">Жерасты Танкі ID</span>
                    <div className="font-extrabold text-sm text-white">{activeTank.id}</div>
                  </div>

                  <div className="space-y-2 font-mono text-[11px] text-slate-300">
                    <div className="flex justify-between border-b border-white/5 pb-1">
                      <span>Отын маркасы:</span>
                      <span className="text-white font-bold">{activeTank.fuel}</span>
                    </div>
                    <div className="flex justify-between border-b border-white/5 pb-1">
                      <span>Көлемі:</span>
                      <span className="text-white font-bold">{activeTank.volume.toLocaleString()} л</span>
                    </div>
                    <div className="flex justify-between border-b border-white/5 pb-1">
                      <span>Сыйымдылық:</span>
                      <span className="text-white font-bold">{activeTank.capacity.toLocaleString()} л</span>
                    </div>
                    <div className="flex justify-between border-b border-white/5 pb-1">
                      <span>Су деңгейі:</span>
                      <span className="text-white font-bold">{activeTank.waterLevel} см</span>
                    </div>
                    <div className="flex justify-between pb-1">
                      <span>Температура:</span>
                      <span className="text-white font-bold">{activeTank.temperature} °C</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-slate-500 text-xs text-center py-10 bg-slate-950 rounded-3xl border border-white/5">
              Танк таңдаңыз
            </div>
          )}
        </div>
      </div>

      {/* 4. RECHARTS STATISTICS & DAILY SALES ANALYTICS */}
      <div className="bg-slate-950 p-6 rounded-3xl border border-white/10 space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-indigo-400" />
            <h2 className="text-sm font-black uppercase tracking-widest text-white">
              АЗК БӨЛШЕК САТЫЛЫМ ЖӘНЕ ТРАФИК ТАЛДАУЫ
            </h2>
          </div>
          <span className="text-[10px] text-slate-400 font-mono">Транзакциялар соңғы 24 сағат</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Chart 1: Sales Trend */}
          <div className="bg-slate-900 border border-white/5 rounded-2xl p-4 h-72 flex flex-col justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Жанармай түрлері бойынша сатылым (Литр)</span>
            <div className="flex-1 w-full min-h-0 text-[10px] text-slate-400 font-mono mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={azkSalesTrend}>
                  <XAxis dataKey="hour" stroke="#94a3b8" opacity={0.6} />
                  <YAxis stroke="#94a3b8" opacity={0.6} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff', borderRadius: '8px' }} />
                  <Bar dataKey="АИ-95" fill="#7c3aed" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="АИ-92" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="ДТ" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 2: Hourly customer flows */}
          <div className="bg-slate-900 border border-white/5 rounded-2xl p-4 h-72 flex flex-col justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">АЗК Клиенттік трафик динамикасы (Көліктер саны)</span>
            <div className="flex-1 w-full min-h-0 text-[10px] text-slate-400 font-mono mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={azkHourlyCustomers}>
                  <defs>
                    <linearGradient id="carsGlow" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="hour" stroke="#94a3b8" opacity={0.6} />
                  <YAxis stroke="#94a3b8" opacity={0.6} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff', borderRadius: '8px' }} />
                  <Area type="monotone" dataKey="cars" stroke="#3b82f6" fillOpacity={1} fill="url(#carsGlow)" strokeWidth={2.5} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* 5. AZK THERMAL EXPANSION CALCULATIONS MODULE */}
      <div className="bg-gradient-to-r from-blue-900 to-indigo-950 p-6 rounded-3xl border border-white/10 shadow-xl grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
        <div className="space-y-3">
          <div className="inline-block px-3 py-1 bg-blue-500/15 border border-blue-400/30 rounded-xl text-blue-300 text-[10px] font-extrabold uppercase tracking-widest font-mono">
            МЕНШІКТІ ЕСЕПТЕУЛЕР
          </div>
          <h2 className="text-xl font-black text-white font-sans uppercase">
            Танк Термиялық Ықпалын Есептеу
          </h2>
          <p className="text-xs text-blue-100 leading-relaxed max-w-lg">
            Көлемнің температуралық өзгеруін түзету формуласы. Отын температурасы стандартты 15°C мәнінен ауытқығанда, ағымдағы көлемді ресми стандартталған стандартты температура көлеміне келтіру.
          </p>
        </div>

        <div className="bg-black/35 p-5 rounded-2xl border border-white/5 space-y-4">
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="space-y-1">
              <label className="text-[10px] text-slate-300 font-bold uppercase">Өлшенген Көлем (л):</label>
              <input
                type="number"
                value={calcTankVol}
                onChange={(e) => setCalcTankVol(Number(e.target.value))}
                className="w-full bg-slate-900 border border-slate-700 px-3 py-2 rounded-xl text-white font-mono"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] text-slate-300 font-bold uppercase">Температура (°C):</label>
              <input
                type="number"
                value={calcTankTemp}
                onChange={(e) => setCalcTankTemp(Number(e.target.value))}
                className="w-full bg-slate-900 border border-slate-700 px-3 py-2 rounded-xl text-white font-mono"
              />
            </div>
          </div>

          <div className="space-y-1 text-xs">
            <label className="text-[10px] text-slate-300 font-bold uppercase">Көлемдік ұлғаю коэффициенті (β):</label>
            <select
              value={calcExpansionCoeff}
              onChange={(e) => setCalcExpansionCoeff(Number(e.target.value))}
              className="w-full bg-slate-900 border border-slate-700 px-3 py-2 rounded-xl text-white font-mono font-bold"
            >
              <option value="0.00095">АИ-95 Premium (0.00095)</option>
              <option value="0.00105">АИ-92 Standard (0.00105)</option>
              <option value="0.00085">Дизельді отын (0.00085)</option>
            </select>
          </div>

          <div className="p-4 bg-slate-900/80 rounded-xl border border-white/5 flex justify-between items-center text-xs">
            <span className="font-extrabold text-slate-300 uppercase">15°C деңгейдегі Стандартты көлем:</span>
            <span className="font-mono text-base font-black text-emerald-400">{standardVolumeResult.toLocaleString()} л</span>
          </div>
        </div>
      </div>

      {/* ADD STATION MODAL */}
      <AnimatePresence>
        {showAddStationModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm">
            <div className="relative w-full max-w-md bg-slate-900 border border-white/10 rounded-3xl p-6 space-y-4">
              <h3 className="text-base font-black uppercase text-white tracking-wider border-b border-white/10 pb-2">
                Жаңа АЗС бекетін тіркеу
              </h3>
              <div className="space-y-3 text-xs text-slate-200">
                <div className="space-y-1">
                  <label className="font-bold text-slate-400">АЗК Атауы:</label>
                  <input
                    type="text"
                    value={newStationName}
                    onChange={(e) => setNewStationName(e.target.value)}
                    placeholder="Мыс: АЗК №05 (Абай)"
                    className="w-full bg-slate-950 border border-white/10 p-2 rounded-xl text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-400">Мекен-жайы:</label>
                  <input
                    type="text"
                    value={newStationAddress}
                    onChange={(e) => setNewStationAddress(e.target.value)}
                    placeholder="Мекен-жайын енгізіңіз..."
                    className="w-full bg-slate-950 border border-white/10 p-2 rounded-xl text-white"
                  />
                </div>
              </div>
              <div className="flex gap-2 text-xs font-bold uppercase pt-2">
                <button
                  onClick={handleAddStation}
                  className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl"
                >
                  Тіркеу
                </button>
                <button
                  onClick={() => setShowAddStationModal(false)}
                  className="px-4 py-2.5 bg-white/10 hover:bg-white/15 text-slate-300 rounded-xl"
                >
                  Болдырмау
                </button>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
