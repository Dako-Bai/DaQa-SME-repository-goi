import React from 'react';
import { 
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, 
  PieChart, Pie, Cell, BarChart, Bar, LineChart, Line 
} from 'recharts';
import { 
  Trash2, Sliders, Thermometer, Database, Droplet, CheckCircle2, 
  Activity, ArrowUpRight, Percent, ShieldAlert 
} from 'lucide-react';
import { Reservoir } from '../types';

// Helper to determine fuel color scheme matching screenshot
export const getFuelGlowColors = (brandName: string) => {
  const norm = brandName.toLowerCase();
  if (norm.includes('95')) {
    return {
      gradient: 'from-purple-500 to-indigo-600',
      badge: 'bg-indigo-600/30 text-indigo-200 border border-indigo-500/30',
      glow: 'shadow-indigo-500/20'
    };
  }
  if (norm.includes('92')) {
    return {
      gradient: 'from-amber-400 to-orange-500',
      badge: 'bg-amber-600/30 text-amber-200 border border-amber-500/30',
      glow: 'shadow-amber-500/20'
    };
  }
  if (norm.includes('дт') || norm.includes('diesel') || norm.includes('лет')) {
    return {
      gradient: 'from-emerald-400 to-teal-500',
      badge: 'bg-emerald-600/30 text-emerald-200 border border-emerald-500/30',
      glow: 'shadow-emerald-500/20'
    };
  }
  return {
    gradient: 'from-sky-400 to-blue-600',
    badge: 'bg-sky-600/30 text-sky-200 border border-sky-500/30',
    glow: 'shadow-sky-500/20'
  };
};

interface GlowReservoirGridProps {
  reservoirs: Reservoir[];
  selectedId: string;
  onSelect: (id: string) => void;
  isAdmin: boolean;
  onDelete: (id: string) => void;
}

export const GlowReservoirGrid: React.FC<GlowReservoirGridProps> = ({
  reservoirs,
  selectedId,
  onSelect,
  isAdmin,
  onDelete
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {reservoirs.map((res) => {
        const isSelected = res.id === selectedId;
        const fillPct = Math.round((res.volume / res.capacity) * 100) || 0;
        const colors = getFuelGlowColors(res.fuel);

        return (
          <div
            key={res.id}
            id={`res-card-${res.id}`}
            onClick={() => onSelect(res.id)}
            className={`p-4 rounded-3xl border-2 transition-all cursor-pointer flex flex-col justify-between relative shadow-xl ${
              isSelected
                ? 'bg-blue-600/20 border-white/80 ring-2 ring-white/10'
                : 'bg-white/10 dark:bg-black/20 border-white/20 hover:border-white/40 hover:bg-white/15'
            }`}
          >
            {/* Header: ID and status */}
            <div className="flex items-center justify-between mb-4">
              <span className="px-3 py-1 bg-slate-900/40 text-slate-300 font-bold rounded-xl font-mono text-xs border border-white/10">
                {res.id}
              </span>
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-200">
                <span className={`w-2 h-2 rounded-full ${res.isOpen ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
                <span>{res.isOpen ? 'Белсенді' : 'Күтуде'}</span>
              </div>
            </div>

            {/* Cylinder Visual Body */}
            <div className="bg-slate-950/40 rounded-3xl p-4 flex flex-col items-center justify-center relative shadow-inner border border-white/5 mb-3">
              <div className="relative w-16 h-28 bg-slate-950/70 rounded-2xl border border-white/10 flex items-center justify-center overflow-hidden shadow-2xl">
                {/* Liquid fill animation */}
                <div 
                  className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t ${colors.gradient} transition-all duration-700`}
                  style={{ height: `${fillPct}%` }}
                />
                
                {/* 3D highlights */}
                <div className="absolute inset-y-0 left-1.5 w-1.5 bg-white/10 opacity-35 blur-[0.5px] rounded-full" />
                <div className="absolute inset-y-0 right-1.5 w-1 bg-black/25 opacity-25 blur-[0.5px] rounded-full" />
                <div className="absolute top-1 left-1 bg-white/10 right-1 h-1.5 rounded-full" />
                
                {/* Percent label */}
                <span className="relative z-10 font-mono text-xs font-black text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                  {fillPct}%
                </span>
              </div>
            </div>

            {/* Fuel brand and parameters info */}
            <div className="space-y-3">
              <div className="text-center">
                <span className={`inline-block text-[10px] font-black uppercase px-2.5 py-1 rounded-lg ${colors.badge} shadow-md`}>
                  {res.fuel}
                </span>
              </div>

              <div className="space-y-1 w-full text-slate-200">
                <div className="flex justify-between items-center text-[10px] font-medium border-b border-white/5 pb-1">
                  <span className="opacity-75">КӨЛЕМІ:</span>
                  <span className="font-extrabold font-mono text-white">{res.volume.toLocaleString()} м³</span>
                </div>
                <div className="flex justify-between items-center text-[10px] font-medium">
                  <span className="opacity-75">СЫЙЫМД.:</span>
                  <span className="font-extrabold font-mono text-white">{res.capacity.toLocaleString()} м³</span>
                </div>
              </div>
            </div>

            {/* Delete button option */}
            {isAdmin && (
              <button
                id={`btn-delete-${res.id}`}
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(res.id);
                }}
                className="mt-3.5 w-full py-2 bg-rose-600/20 hover:bg-rose-600/80 hover:text-white rounded-xl text-[10px] font-black uppercase text-rose-300 transition flex items-center justify-center gap-1 border border-rose-500/20"
              >
                <Trash2 className="w-3.5 h-3.5" /> Өшіру
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
};


interface GlowTelemetryPanelProps {
  reservoir: Reservoir;
  onEditToggle: () => void;
  hasEditAccess: boolean;
}

export const GlowTelemetryPanel: React.FC<GlowTelemetryPanelProps> = ({
  reservoir,
  onEditToggle,
  hasEditAccess
}) => {
  const fillPct = Math.round((reservoir.volume / reservoir.capacity) * 100) || 0;
  const colors = getFuelGlowColors(reservoir.fuel);

  return (
    <div 
      style={{ backgroundColor: '#1E90FF' }}
      className="rounded-3xl p-3.5 shadow-2xl space-y-3.5 text-white border border-white/20"
    >
      {/* Title */}
      <div className="flex items-center justify-between pb-2 border-b border-white/20">
        <h2 className="text-xs font-black tracking-wider uppercase text-white flex items-center gap-1.5 font-mono">
          <Database className="w-4 h-4 text-white" />
          REZ-INFO
        </h2>

        {hasEditAccess && (
          <button
            onClick={onEditToggle}
            className="bg-white/20 hover:bg-white/30 text-white px-2.5 py-1 rounded-xl text-[9px] font-black uppercase tracking-wider transition-all flex items-center gap-1 border border-white/20"
          >
            <Sliders className="w-2.5 h-2.5" /> Өңдеу
          </button>
        )}
      </div>

      {/* Main 3D graphic block */}
      <div className="bg-black/35 rounded-2xl p-3 flex flex-col items-center justify-center relative shadow-inner border border-white/10 py-3.5">
        <div className="relative w-20 h-28 bg-slate-950/80 rounded-2xl border-2 border-white/10 flex items-center justify-center overflow-hidden shadow-2xl">
          {/* Liquid level layer */}
          <div 
            className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t ${colors.gradient} transition-all duration-700`}
            style={{ height: `${fillPct}%` }}
          />

          {/* Under-liquid H2O layer (waterLevel) */}
          {reservoir.waterLevel > 0 && (
            <div 
              className="absolute bottom-0 left-0 right-0 bg-sky-400 border-t border-sky-300 text-[7px] text-slate-950 font-black flex items-center justify-center overflow-hidden transition-all duration-550"
              style={{ height: `${Math.min(14, reservoir.waterLevel * 2.5)}px` }}
            >
              <span className="opacity-90 tracking-widest text-[6px] leading-none">H2O</span>
            </div>
          )}

          {/* Alignment ticks inside cylinder grid */}
          <div className="absolute inset-0 flex flex-col justify-between p-1.5 pointer-events-none text-white/15 text-[7px] font-mono select-none">
            <div className="border-b border-dashed border-white/5 pt-0.5 w-full flex justify-between">
              <span>100</span>
              <span>MAX</span>
            </div>
            <div className="border-b border-dashed border-white/5 w-full flex justify-between">
              <span>75</span>
              <span>—</span>
            </div>
            <div className="border-b border-dashed border-white/5 w-full flex justify-between">
              <span>50</span>
              <span>MID</span>
            </div>
            <div className="border-b border-dashed border-white/5 w-full flex justify-between">
              <span>25</span>
              <span>—</span>
            </div>
            <div className="w-full text-right pr-0.5 pb-0.5">
              <span>0</span>
            </div>
          </div>

          {/* Glass glare highlight */}
          <div className="absolute inset-y-0 left-1.5 w-1.5 bg-white/5 opacity-45 blur-[1px] rounded-full" />
          <div className="absolute inset-y-0 right-1.5 w-1 bg-black/30 opacity-40 blur-[1px] rounded-full" />
          <div className="absolute top-1 inset-x-2 h-1 bg-white/15 rounded-full" />

          {/* Float percentage label */}
          <div className="relative z-10 font-mono text-xl font-black text-white drop-shadow-[0_4px_6px_rgba(0,0,0,0.95)]">
            {fillPct}%
          </div>
        </div>
      </div>

      {/* Reservoir ID block */}
      <div className="flex justify-between items-center bg-black/35 p-2.5 rounded-xl border border-white/10">
        <span className="text-[9px] text-blue-100 font-extrabold uppercase font-mono tracking-wider">РЕЗЕРВУАР ID</span>
        <div className="flex items-center gap-1.5">
          <span className="font-extrabold text-white text-xs font-mono">{reservoir.id}</span>
          <span className={`text-[8px] font-extrabold px-2 py-0.5 rounded-full text-white ${reservoir.isOpen ? 'bg-emerald-600' : 'bg-red-600'}`}>
            {reservoir.isOpen ? 'ACTIVE' : 'OFFLINE'}
          </span>
        </div>
      </div>

      {/* Grid parameter cards block */}
      <div className="grid grid-cols-2 gap-2 text-[11px]">
        <div className="bg-black/25 p-2 rounded-xl border border-white/10 space-y-0.5 text-left">
          <div className="text-[8px] uppercase font-bold text-blue-105 tracking-wider">ОТЫН МАРКАСЫ</div>
          <div className="font-extrabold text-white truncate">{reservoir.fuel}</div>
        </div>

        <div className="bg-black/25 p-2 rounded-xl border border-white/10 space-y-0.5 text-left">
          <div className="text-[8px] uppercase font-bold text-blue-105 tracking-wider">СУ ДЕҢГЕЙІ</div>
          <div className="font-extrabold text-white font-mono">{reservoir.waterLevel} см</div>
        </div>

        <div className="bg-black/25 p-2 rounded-xl border border-white/10 space-y-0.5 text-left">
          <div className="text-[8px] uppercase font-bold text-blue-105 tracking-wider">СЫЙЫМДЫЛЫҒЫ</div>
          <div className="font-extrabold text-white font-mono truncate">{reservoir.capacity.toLocaleString()} м³</div>
        </div>

        <div className="bg-black/25 p-2 rounded-xl border border-white/10 space-y-0.5 text-left">
          <div className="text-[8px] uppercase font-bold text-blue-105 tracking-wider">АҒЫМДАҒЫ КӨЛЕМ</div>
          <div className="font-extrabold text-white font-mono truncate">{reservoir.volume.toLocaleString()} м³</div>
        </div>

        <div className="bg-black/25 p-2 rounded-xl border border-white/10 space-y-0.5 text-left">
          <div className="text-[8px] uppercase font-bold text-blue-105 tracking-wider">ТЕМПЕРАТУРАСЫ</div>
          <div className="font-extrabold text-white font-mono">{reservoir.temperature} °C</div>
        </div>

        <div className="bg-black/25 p-2 rounded-xl border border-white/10 space-y-0.5 text-left">
          <div className="text-[8px] uppercase font-bold text-blue-105 tracking-wider">ТЫҒЫЗДЫҚ СЕНСОР</div>
          <div className="font-extrabold text-white font-mono truncate">{reservoir.density} кг/м³</div>
        </div>
      </div>

      {/* Pressure card footer */}
      <div className="p-2.5 bg-black/35 rounded-xl border border-white/10 flex justify-between items-center text-xs">
        <span className="text-[8px] uppercase font-extrabold text-blue-105 tracking-wider font-sans">ҚЫСЫМЫ:</span>
        <span className="font-extrabold text-white font-mono text-sm">{reservoir.pressure} кПа</span>
      </div>
    </div>
  );
};


// Gorgeous visual charts block mimicking Image 4
export const GlowStatisticsDashboard: React.FC = () => {
  // Chart 1: Optical Stock Dynamics
  const stockDynamicsData = [
    { name: 'Mon', line1: 3750, line2: 3100, line3: 2900 },
    { name: 'Tue', line1: 3850, line2: 3200, line3: 3100 },
    { name: 'Wed', line1: 3800, line2: 3350, line3: 3000 },
    { name: 'Thu', line1: 4100, line2: 3450, line3: 3250 },
    { name: 'Fri', line1: 4050, line2: 3400, line3: 3200 },
    { name: 'Sat', line1: 4250, line2: 3600, line3: 3400 },
    { name: 'Sun', line1: 4150, line2: 3500, line3: 3150 },
  ];

  // Chart 2: Retail Sales Pace
  const salesPaceData = [
    { name: '01', line: 340, area: 210 },
    { name: '05', line: 300, area: 260 },
    { name: '10', line: 430, area: 280 },
    { name: '15', line: 390, area: 250 },
    { name: '20', line: 490, area: 320 },
    { name: '25', line: 450, area: 290 },
    { name: '30', line: 550, area: 390 },
  ];

  // Chart 3: Pie proportions
  const fuelProportionData = [
    { name: 'Jet A-1', value: 35, color: '#0284c7' },
    { name: 'ТС-1 / RT', value: 25, color: '#059669' },
    { name: 'АИ-95 Premium', value: 15, color: '#7c3aed' },
    { name: 'АИ-92 Standard', value: 15, color: '#d97706' },
    { name: 'Diesel Fuel', value: 10, color: '#dc2626' }
  ];

  // Chart 4: Peak Regional Loads
  const regionalLoadsData = [
    { name: 'Almaty', value: 870, color: '#38bdf8' },
    { name: 'Astana', value: 690, color: '#c084fc' },
    { name: 'Shymkent', value: 550, color: '#34d399' },
    { name: 'Karaganda', value: 390, color: '#94a3b8' }
  ];

  return (
    <div id="analytics-statistics-dashboard" className="w-full space-y-6 select-none pt-4">
      {/* Title */}
      <div className="flex items-center gap-2 pb-2 border-b border-white/15">
        <Activity className="w-5 h-5 text-indigo-400" />
        <h2 className="text-xl font-black uppercase tracking-widest text-white font-sans">
          ЖҮЙЕЛІК АНАЛИТИКА ЖӘНЕ СТАТИСТИКА
        </h2>
      </div>

      {/* Grid containing 4 visual cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Card 1: Optical Stock Dynamics */}
        <div className="bg-slate-900/95 border border-white/10 rounded-3xl p-5 shadow-2xl flex flex-col justify-between h-80">
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs font-black tracking-wider uppercase text-white font-sans">
              ОПТЫҚ ҚОРЛАРДЫҢ ДИНАМИКАСЫ (М³)
            </span>
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-lg shadow-blue-500/50" />
          </div>

          <div className="flex-1 w-full min-h-0 text-[10px] text-slate-400 font-mono">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={stockDynamicsData} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                <XAxis dataKey="name" stroke="#94a3b8" opacity={0.5} />
                <YAxis stroke="#94a3b8" opacity={0.5} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff', borderRadius: '12px' }} />
                <Line type="monotone" dataKey="line1" stroke="#38bdf8" strokeWidth={2.5} dot={{ r: 3 }} activeDot={{ r: 5 }} />
                <Line type="monotone" dataKey="line2" stroke="#34d399" strokeWidth={2} dot={{ r: 2 }} />
                <Line type="monotone" dataKey="line3" stroke="#f59e0b" strokeWidth={2} dot={{ r: 2 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Card 2: Retail Sales Pace */}
        <div className="bg-slate-900/95 border border-white/10 rounded-3xl p-5 shadow-2xl flex flex-col justify-between h-80">
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs font-black tracking-wider uppercase text-white font-sans">
              БӨЛШЕК САТЫЛЫМ ҚАРҚЫНЫ (М³)
            </span>
            <span className="w-2.5 h-2.5 rounded-full bg-orange-500 shadow-lg shadow-orange-500/50" />
          </div>

          <div className="flex-1 w-full min-h-0 text-[10px] text-slate-400 font-mono">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={salesPaceData} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="#94a3b8" opacity={0.5} />
                <YAxis stroke="#94a3b8" opacity={0.5} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff', borderRadius: '12px' }} />
                <Area type="monotone" dataKey="area" stroke="#f59e0b" fillOpacity={1} fill="url(#colorSales)" strokeWidth={2.5} />
                <Line type="monotone" dataKey="line" stroke="#60a5fa" strokeWidth={2} dot={{ r: 2 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Card 3: Fuel Type Proportions */}
        <div className="bg-slate-900/95 border border-white/10 rounded-3xl p-5 shadow-2xl flex flex-col justify-between h-80">
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs font-black tracking-wider uppercase text-white font-sans">
              ОТЫН ТҮРЛЕРІНІҢ ҮЛЕСІ
            </span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/50" />
          </div>

          <div className="flex-1 w-full flex items-center gap-6 min-h-0">
            {/* Pie rendering side */}
            <div className="w-[50%] h-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={fuelProportionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={75}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {fuelProportionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff', borderRadius: '12px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Legends on the right */}
            <div className="w-[50%] space-y-2 text-[11px] text-slate-300 font-medium">
              {fuelProportionData.map((entry, index) => (
                <div key={index} className="flex justify-between items-center border-b border-white/5 pb-1">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: entry.color }} />
                    <span className="font-sans truncate max-w-[85px]">{entry.name}</span>
                  </div>
                  <span className="font-semibold text-white font-mono">{entry.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Card 4: Regional Peak Loads */}
        <div className="bg-slate-900/95 border border-white/10 rounded-3xl p-5 shadow-2xl flex flex-col justify-between h-80">
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs font-black tracking-wider uppercase text-white font-sans">
              АЙМАҚТЫҚ ЕҢ ЖОҒАРЫ ЖҮКТЕМЕЛЕР (М³)
            </span>
            <span className="w-2.5 h-2.5 rounded-full bg-purple-500 shadow-lg shadow-purple-500/50" />
          </div>

          <div className="flex-1 w-full min-h-0 text-[10px] text-slate-400 font-mono">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={regionalLoadsData} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                <XAxis dataKey="name" stroke="#94a3b8" opacity={0.5} />
                <YAxis stroke="#94a3b8" opacity={0.5} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff', borderRadius: '12px' }} />
                <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                  {regionalLoadsData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
};
