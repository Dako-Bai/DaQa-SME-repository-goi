import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Activity, Sliders, Plus, Trash2, Download, Search, Filter, 
  MapPin, Thermometer, Database, Droplet, Check, X, 
  AlertTriangle, Upload, Lock, Unlock, CheckCircle2, RefreshCw, FileText
} from 'lucide-react';
import { useAppContext } from '../contexts/AppContext';
import { Hub, Reservoir } from '../types';
import { DEFAULT_HUBS } from '../utils/defaultHubs';
import { renderHubPDF } from '../utils/pdfCanvas';
import { 
  GlowReservoirGrid, 
  GlowTelemetryPanel, 
  GlowStatisticsDashboard,
  getFuelGlowColors
} from '../components/GlowDashboardComponents';

const safeAlert = (msg: string) => {
  try {
    window.alert(msg);
  } catch (e) {
    console.warn("Alert blocked in sandbox environment:", msg);
  }
};

export default function CombinedMonitorPage() {
  const { lang, currentUser, logUserAction } = useAppContext();
  const [showTelemetry, setShowTelemetry] = React.useState(true);
  
  // Geohubs State Management with local persistence
  const [hubs, setHubs] = React.useState<Hub[]>(() => {
    const saved = localStorage.getItem('smartme_geohubs_v3');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return DEFAULT_HUBS;
      }
    }
    return DEFAULT_HUBS;
  });

  React.useEffect(() => {
    try {
      localStorage.setItem('smartme_geohubs_v3', JSON.stringify(hubs));
    } catch (e) {
      console.warn("Storage quota exceeded for geohubs, keeping state in memory only.", e);
    }
  }, [hubs]);

  const [activeHubId, setActiveHubId] = React.useState('almaty');
  const activeHub = hubs.find(h => h.id === activeHubId) || hubs[0] || DEFAULT_HUBS[0];

  // Selected reservoir within the active hub
  const [selectedResId, setSelectedResId] = React.useState<string>('');
  const activeRes = activeHub.reservoirs.find(r => r.id === selectedResId) || activeHub.reservoirs[0];

  // Initialize selected res on hub change
  React.useEffect(() => {
    if (activeHub.reservoirs.length > 0) {
      setSelectedResId(activeHub.reservoirs[0].id);
    } else {
      setSelectedResId('');
    }
  }, [activeHubId, activeHub]);

  // Schematic background image (stored as Base64 in state & localStorage)
  const [schematicBg, setSchematicBg] = React.useState<string>(() => {
    return localStorage.getItem('smartme_schematic_bg') || '';
  });

  const handleSchematicUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setSchematicBg(base64);
        try {
          localStorage.setItem('smartme_schematic_bg', base64);
        } catch (err) {
          console.warn("Storage quota exceeded, keeping schematic in-memory only.", err);
        }
        logUserAction(`Жаңа технологиялық сызба суреті жүктелді (${file.name})`);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClearSchematic = () => {
    setSchematicBg('');
    localStorage.removeItem('smartme_schematic_bg');
    logUserAction(`Технологиялық сызба суреті бастапқы күйіне қайтарылды`);
  };

  // Dragging logic for Admin
  const [draggingHubId, setDraggingHubId] = React.useState<string | null>(null);
  const canvasRef = React.useRef<HTMLDivElement>(null);

  // Popover state – which hub tooltip is currently shown (hover/click)
  const [hoveredHubId, setHoveredHubId] = React.useState<string | null>(null);

  // Locked/frozen state for hubs
  const [lockedHubs, setLockedHubs] = React.useState<Record<string, boolean>>(() => {
    const saved = localStorage.getItem('smartme_hubs_locked');
    return saved ? JSON.parse(saved) : { astana: true, almaty: true, dostyk: true };
  });

  React.useEffect(() => {
    try {
      localStorage.setItem('smartme_hubs_locked', JSON.stringify(lockedHubs));
    } catch (e) {
      console.warn("Storage quota exceeded for lockedHubs.", e);
    }
  }, [lockedHubs]);

  const toggleLockHub = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setLockedHubs(prev => ({ ...prev, [id]: !prev[id] }));
    logUserAction(`Белгінің бекітілу күйі өзгертілді (${id}): ${!lockedHubs[id] ? 'ҚАТЫРЫЛДЫ' : 'БОСАТЫЛДЫ'}`);
  };

  // Pointer events for smooth drag on schematic screen
  const handlePointerDown = (id: string, e: React.PointerEvent<HTMLDivElement>) => {
    // Click on the point MUST always switch the active hub!
    setActiveHubId(id);
    
    // Dragging of the point is restricted to admin and unlocked state
    if (userRole !== 'admin' || lockedHubs[id]) return;
    
    e.preventDefault();
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    setDraggingHubId(id);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!draggingHubId || !canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    const boundedX = Math.max(0, Math.min(100, x));
    const boundedY = Math.max(0, Math.min(100, y));

    setHubs(prev => prev.map(h => {
      if (h.id === draggingHubId) {
        return { ...h, x: Number(boundedX.toFixed(1)), y: Number(boundedY.toFixed(1)) };
      }
      return h;
    }));
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (draggingHubId) {
      setDraggingHubId(null);
      logUserAction(`Админ белгінің жаңа орнын бекітті (${draggingHubId})`);
    }
  };

  // Add Point (Hub) inline modal
  const [showAddHubModal, setShowAddHubModal] = React.useState(false);
  const [newHubName, setNewHubName] = React.useState('');
  const [newHubIdEn, setNewHubIdEn] = React.useState('');
  const [newHubAddress, setNewHubAddress] = React.useState('');

  const submitNewHub = () => {
    if (!newHubName.trim() || !newHubIdEn.trim()) {
      safeAlert('Орын атауы мен ағылшынша форматын енгізіңіз!');
      return;
    }
    const safeId = newHubIdEn.toLowerCase().replace(/[^a-z0-9]/g, '_');
    if (hubs.some(h => h.id === safeId)) {
      safeAlert('Мұндай ID-і бар хаб қазірдің өзінде тіркелген!');
      return;
    }

    const createdHub: Hub = {
      id: safeId,
      name: newHubName,
      lat: 43.0,
      lng: 70.0,
      x: 50,
      y: 50,
      address: newHubAddress || 'Қазақстан Республикасы',
      reservoirs: [
        { id: `T-${safeId.slice(0, 3).toUpperCase()}-01`, name: 'РП-01', fuel: 'АИ-95 Premium', volume: 800, capacity: 1000, waterLevel: 1.5, temperature: 14.8, density: 745, pressure: 101.3, isOpen: true, lastUpdated: '12:00' },
        { id: `T-${safeId.slice(0, 3).toUpperCase()}-02`, name: 'РП-02', fuel: 'АИ-92 Standard', volume: 600, capacity: 1000, waterLevel: 0.9, temperature: 15.2, density: 730, pressure: 101.1, isOpen: true, lastUpdated: '12:00' }
      ]
    };

    setHubs([...hubs, createdHub]);
    setActiveHubId(safeId);
    setShowAddHubModal(false);
    setNewHubName('');
    setNewHubIdEn('');
    setNewHubAddress('');
    setLockedHubs(prev => ({ ...prev, [safeId]: false })); // Unlocked initially so they can position it!
    logUserAction(`Жаңа орын қосылды: ${newHubName} (Ағылшынша: ${newHubIdEn})`);
  };

  // Add Reservoir Dialog states
  const [showAddResModal, setShowAddResModal] = React.useState(false);
  const [newResId, setNewResId] = React.useState('');
  const [newResFuel, setNewResFuel] = React.useState('АИ-95 Premium');
  const [newResCapacity, setNewResCapacity] = React.useState(1000);
  const [newResVolume, setNewResVolume] = React.useState(600);
  const [newWaterLevel, setNewWaterLevel] = React.useState<number>(1.2);
  const [newTemperature, setNewTemperature] = React.useState<number>(15.2);
  const [newPressure, setNewPressure] = React.useState<number>(101.3);
  const [newDensity, setNewDensity] = React.useState<number>(745);

  const submitNewReservoir = () => {
    if (!newResId.trim()) {
      safeAlert('Резервуар ID енгізіңіз!');
      return;
    }
    if (newResVolume > newResCapacity) {
      safeAlert('ҚАТЕ: Отын мөлшері максималды сыйымдылықтан аса алмайды!');
      return;
    }

    const uppercaseId = newResId.toUpperCase();
    let isDuplicate = false;

    const updatedHubs = hubs.map(h => {
      if (h.id === activeHubId) {
        if (h.reservoirs.some(r => r.id === uppercaseId)) {
          isDuplicate = true;
          return h;
        }
        const newRes: Reservoir = {
          id: uppercaseId,
          name: `Резервуар ${uppercaseId}`,
          fuel: newResFuel,
          volume: Number(newResVolume),
          capacity: Number(newResCapacity),
          waterLevel: Number(newWaterLevel),
          temperature: Number(newTemperature),
          density: Number(newDensity),
          pressure: Number(newPressure),
          isOpen: true,
          lastUpdated: new Date().toLocaleTimeString('kk-KZ')
        };
        return {
          ...h,
          reservoirs: [newRes, ...h.reservoirs]
        };
      }
      return h;
    });

    if (isDuplicate) {
      safeAlert('Бұл хабта мұндай ID резервуары бар!');
      return;
    }

    setHubs(updatedHubs);
    setSelectedResId(uppercaseId);
    setShowAddResModal(false);
    setNewResId('');
    logUserAction(`Хаб ${activeHub.name} үшін жаңа ресивер сызбасы құрылды: ${uppercaseId}`);
  };

  const handleDeleteReservoir = (resId: string) => {
    if (!confirm(`Назар аударыңыз! ${resId} резервуарын біржола өшіруді растайсыз ба?`)) return;
    
    const updatedHubs = hubs.map(h => {
      if (h.id === activeHubId) {
        return {
          ...h,
          reservoirs: h.reservoirs.filter(r => r.id !== resId)
        };
      }
      return h;
    });

    setHubs(updatedHubs);
    logUserAction(`Өшірілді: ${resId} резервуары (${activeHub.name})`);
  };

  // Edit fields
  const [isEditMode, setIsEditMode] = React.useState(false);
  const [editResId, setEditResId] = React.useState('');
  const [editFuel, setEditFuel] = React.useState('');
  const [editVolume, setEditVolume] = React.useState<number>(0);
  const [editCapacity, setEditCapacity] = React.useState<number>(1000);
  const [editWaterLevel, setEditWaterLevel] = React.useState<number>(0);
  const [editTemp, setEditTemp] = React.useState<number>(15.0);
  const [editDensity, setEditDensity] = React.useState<number>(740);
  const [editPressure, setEditPressure] = React.useState<number>(101.3);
  const [editIsOpen, setEditIsOpen] = React.useState(true);

  // Safety norms state with local storage protection
  const [safetyTitle, setSafetyTitle] = React.useState(() => {
    try {
      return localStorage.getItem('safety_title') || '⚠️ Қауіпсіздік және еңбек нормалары:';
    } catch {
      return '⚠️ Қауіпсіздік және еңбек нормалары:';
    }
  });

  const [safetyRules, setSafetyRules] = React.useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('safety_rules');
      return saved ? JSON.parse(saved) : [
        "Резервуар астындағы су (подтоварная су) 5 см-ден аспауы керек, әйтпесе сүзу жүргізеді.",
        "Температура шегі: -15°C пен +45°C аралығы. Нормадан тыс жағдайда кауіпсіздік вентилі өшіріледі.",
        "Толықтық деңгейі ең көбі 95% көлемге рұқсат етіледі (сұйықтықтың жылулық ұлғаю резерві)."
      ];
    } catch {
      return [
        "Резервуар астындағы су (подтоварная су) 5 см-ден аспауы керек, әйтпесе сүзу жүргізеді.",
        "Температура шегі: -15°C пен +45°C аралығы. Нормадан тыс жағдайда кауіпсіздік вентилі өшіріледі.",
        "Толықтық деңгейі ең көбі 95% көлемге рұқсат етіледі (сұйықтықтың жылулық ұлғаю резерві)."
      ];
    }
  });

  const [isEditingSafety, setIsEditingSafety] = React.useState(false);
  const [tempSafetyTitle, setTempSafetyTitle] = React.useState(safetyTitle);
  const [tempSafetyRules, setTempSafetyRules] = React.useState(safetyRules);

  const handleSaveSafety = () => {
    try {
      localStorage.setItem('safety_title', tempSafetyTitle);
      localStorage.setItem('safety_rules', JSON.stringify(tempSafetyRules));
    } catch (e) {
      console.error(e);
    }
    setSafetyTitle(tempSafetyTitle);
    setSafetyRules(tempSafetyRules);
    setIsEditingSafety(false);
    logUserAction('Қауіпсіздік және еңбек нормалары жаңартылды');
  };

  React.useEffect(() => {
    if (activeRes) {
      setEditResId(activeRes.id);
      setEditFuel(activeRes.fuel);
      setEditVolume(activeRes.volume);
      setEditCapacity(activeRes.capacity);
      setEditWaterLevel(activeRes.waterLevel);
      setEditTemp(activeRes.temperature);
      setEditDensity(activeRes.density);
      setEditPressure(activeRes.pressure);
      setEditIsOpen(activeRes.isOpen);
    }
  }, [selectedResId, activeHubId, activeRes]);

  const handleSaveEdits = () => {
    if (!editResId.trim()) {
      safeAlert('Резервуар ID бос болмауы тиіс!');
      return;
    }
    const cleanId = editResId.trim().toUpperCase();

    if (editVolume > editCapacity) {
      safeAlert(`Валидация Қатесі: Ағымдағы мөлшері (${editVolume} м³) резервуар сыйымдылығынан (${editCapacity} м³) аса алмайды!`);
      return;
    }
    if (editVolume < 0 || editCapacity <= 0 || editWaterLevel < 0) {
      safeAlert('Енгізілген параметрлер дұрыс емес!');
      return;
    }

    // Check duplicate ID inside active hub if ID changed
    if (cleanId !== activeRes.id) {
      const isDuplicate = activeHub.reservoirs.some(r => r.id === cleanId);
      if (isDuplicate) {
        safeAlert('ҚАТЕ: Мұндай ID-і бар резервуар қазірдің өзінде бар!');
        return;
      }
    }

    const updatedHubs = hubs.map(h => {
      if (h.id === activeHubId) {
        return {
          ...h,
          reservoirs: h.reservoirs.map(r => {
            if (r.id === activeRes.id) {
              return {
                ...r,
                id: cleanId,
                name: r.name.startsWith('Резервуар ') || r.name === r.id ? `Резервуар ${cleanId}` : r.name,
                fuel: editFuel,
                volume: Number(editVolume),
                capacity: Number(editCapacity),
                waterLevel: Number(editWaterLevel),
                temperature: Number(editTemp),
                density: Number(editDensity),
                pressure: Number(editPressure),
                isOpen: editIsOpen,
                lastUpdated: new Date().toLocaleTimeString('kk-KZ')
              };
            }
            return r;
          })
        };
      }
      return h;
    });

    setHubs(updatedHubs);
    setSelectedResId(cleanId);
    setIsEditMode(false);
    logUserAction(`Жаңартылды: Резервуар ${cleanId} параметрлері өңделді.`);
    safeAlert(`Резервуар ${cleanId} параметрлері өңделді!`);
  };

  // PDF Export
  const triggerPDFExport = () => {
    renderHubPDF(activeHub, currentUser?.fullName || 'Ахметжанов Мақсат Ақанұлы');
    logUserAction(`PDF есеп дайындалды (${activeHub.name})`);
  };

  // CSV Export
  const triggerCSVExport = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "ID,Name,Fuel,Volume,Capacity,Water Level (cm),Temperature (C),Density (kg/m3),Pressure (kPa),Status\n";
    activeHub.reservoirs.forEach(r => {
      csvContent += `${r.id},${r.name},${r.fuel},${r.volume},${r.capacity},${r.waterLevel},${r.temperature},${r.density},${r.pressure},${r.isOpen ? 'Active' : 'Maintenance'}\n`;
    });
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `smartme_${activeHub.id}_reservoirs.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    logUserAction(`CSV экспортталды (${activeHub.name})`);
  };

  // Excel Export
  const triggerExcelExport = () => {
    let excelContent = "ID\tName\tFuel Brand\tCurrent Volume (m3)\tMax Capacity (m3)\tWater Level (cm)\tTemperature (C)\tDensity (kg/m3)\tPressure (kPa)\tStatus\n";
    activeHub.reservoirs.forEach(r => {
      excelContent += `${r.id}\t${r.name}\t${r.fuel}\t${r.volume}\t${r.capacity}\t${r.waterLevel}\t${r.temperature}\t${r.density}\t${r.pressure}\t${r.isOpen ? 'Active' : 'Maintenance'}\n`;
    });
    const blob = new Blob([excelContent], { type: 'application/vnd.ms-excel;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `smartme_${activeHub.id}_reservoirs.xls`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    logUserAction(`Excel экспортталды (${activeHub.name})`);
  };

  // Filter & Search states inside reservoir panel
  const [searchTerm, setSearchTerm] = React.useState('');
  const [fuelFilter, setFuelFilter] = React.useState('ALL');

  const filteredReservoirs = activeHub.reservoirs.filter(res => {
    const matchesSearch = res.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          res.fuel.toLowerCase().includes(searchTerm.toLowerCase());
    
    let matchesFuel = true;
    if (fuelFilter !== 'ALL') {
      matchesFuel = res.fuel.toLowerCase().includes(fuelFilter.toLowerCase());
    }
    return matchesSearch && matchesFuel;
  });

  const userRole = currentUser?.role || 'admin';
  const isAdmin = userRole === 'admin';
  const hasEditAccess = userRole === 'admin';

  // Name mapping for English uppercase
  const activeHubIdUpper = activeHub.id === 'dostyk' ? 'DOSTYQ' : activeHub.id.toUpperCase();

  // Dynamic colors for various fuel classes
  const getFuelColors = (brandName: string) => {
    const norm = brandName.toLowerCase();
    if (norm.includes('95')) return 'from-purple-500 to-indigo-600 bg-purple-500';
    if (norm.includes('92')) return 'from-amber-400 to-orange-500 bg-amber-500';
    if (norm.includes('дт') || norm.includes('diesel')) return 'from-emerald-400 to-teal-500 bg-emerald-500';
    return 'from-sky-400 to-blue-600 bg-sky-500';
  };

  return (
    <div className="flex-1 w-full max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8 pb-32">
      
      {/* 1. TOP SECTION: Device-Uploaded IMAGE workspace canvas (Centrally loaded, borderless, pinned) */}
      <div className="relative w-full rounded-2xl overflow-hidden shadow-2xl bg-white/10 border border-white/20 backdrop-blur-md">
        
        {/* Centered magnificent title */}
        <div className="p-5 flex flex-col items-center justify-center border-b border-white/25 bg-black/40 text-center">
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span>
            <span className="text-[10px] font-black tracking-[0.3em] text-blue-300 uppercase font-mono">
              {lang === 'kz' ? 'БАҚЫЛАУ ЖӘНЕ КАРТА' : lang === 'ru' ? 'МОНИТОРИНГ И КАРТА' : 'MONITORING & GEOLOCATION'}
            </span>
          </div>
          <h2 className="text-xl sm:text-3xl font-extrabold tracking-[0.35em] text-white uppercase font-sans drop-shadow-[0_2px_10px_rgba(59,130,246,0.3)]">
            O R N A L A S U
          </h2>
          
          <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
            {/* Admin Action: Upload custom blueprint or schematic background */}
            {isAdmin && (
              <div className="flex items-center gap-1.5 bg-white/20 hover:bg-white/35 px-3 py-1.5 rounded-lg border border-white/30 transition text-[11px] font-bold text-white relative cursor-pointer">
                <Upload className="w-3.5 h-3.5" />
                <span>{lang === 'kz' ? 'Сызба жүктеу' : 'Сызба жүктеу'}</span>
                <input 
                  type="file" 
                  accept="image/*" 
                  className="absolute inset-0 opacity-0 cursor-pointer w-full" 
                  onChange={handleSchematicUpload} 
                />
              </div>
            )}
            
            {schematicBg && isAdmin && (
              <button 
                onClick={handleClearSchematic}
                className="bg-rose-500/80 hover:bg-rose-600 text-white px-3 py-1.5 rounded-lg text-[11px] font-bold transition flex items-center gap-1 border border-rose-500/20"
              >
                <Trash2 className="w-3.5 h-3.5" /> {lang === 'kz' ? 'Бастапқы сызба' : 'Бастапқы сызба'}
              </button>
            )}

            {/* Admin Action: Add additional geohub points */}
            {isAdmin && (
              <button
                onClick={() => setShowAddHubModal(true)}
                className="bg-emerald-500/90 hover:bg-emerald-600 text-slate-950 font-black px-3.5 py-1.5 rounded-lg text-[11px] uppercase tracking-wider flex items-center gap-1 transition shadow-md"
              >
                <Plus className="w-3.5 h-3.5" /> {lang === 'kz' ? 'Жаңа нүкте қосу' : 'Жаңа нүкте қосу'}
              </button>
            )}
          </div>
        </div>

        {/* The Graphic Canvas Container - Uniform and stable on laptops and phones */}
        <div 
          ref={canvasRef}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          className="relative w-full aspect-[2/1] sm:aspect-[2.2/1] md:aspect-[2.4/1] min-h-[300px] sm:min-h-[380px] md:min-h-[460px] flex items-center justify-center overflow-hidden select-none bg-slate-950"
        >
          {schematicBg ? (
            <img 
              src={schematicBg} 
              alt="System schematic map" 
              className="w-full h-full object-contain select-none borderless" 
              referrerPolicy="no-referrer"
            />
          ) : (
            // Exquisite default technological blueprint vector lines in absolute center
            <div className="absolute inset-0 w-full h-full bg-slate-950">
              <svg viewBox="0 0 1000 500" className="w-full h-full stroke-blue-500/45 dark:stroke-sky-400/50 fill-none">
                <defs>
                  <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
                    <path d="M 30 0 L 0 0 0 30" stroke="currentColor" strokeWidth="0.5" opacity="0.1" />
                  </pattern>
                  <linearGradient id="glowGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#1E90FF" stopOpacity="0.8" />
                    <stop offset="50%" stopColor="#00E5FF" stopOpacity="1" />
                    <stop offset="100%" stopColor="#1E90FF" stopOpacity="0.8" />
                  </linearGradient>
                </defs>
                
                {/* Background Grid */}
                <rect width="100%" height="100%" fill="url(#grid)" />

                {/* Main Cybernetic Pipelines and Connection Paths with Flow Dots */}
                {/* Left-to-Right Pipeline Axis */}
                <path d="M 80 150 L 920 150" stroke="#00E5FF" strokeWidth="2.5" opacity="0.6" strokeDasharray="8,12" className="animate-[dash_12s_linear_infinite]" />
                <path d="M 80 350 L 920 350" stroke="#38bdf8" strokeWidth="2.5" opacity="0.5" strokeDasharray="6,15" className="animate-[dash_15s_linear_infinite]" />
                
                {/* Cross-linking technical pipelines */}
                <path d="M 200 150 L 200 350" stroke="#a78bfa" strokeWidth="1.5" opacity="0.4" strokeDasharray="3,3" />
                <path d="M 500 100 L 500 400" stroke="#f472b6" strokeWidth="2" opacity="0.4" strokeDasharray="4,6" />
                <path d="M 800 150 L 800 350" stroke="#34d399" strokeWidth="1.5" opacity="0.4" strokeDasharray="3,3" />

                {/* Flowing loop connections */}
                <path d="M 320 250 H 680" stroke="#10b981" strokeWidth="2" opacity="0.5" strokeDasharray="5,10" />
                <path d="M 500 250 Q 500 150, 320 150" stroke="#e2e8f0" strokeWidth="1" opacity="0.25" />
                <path d="M 500 250 Q 500 350, 680 350" stroke="#e2e8f0" strokeWidth="1" opacity="0.25" />

                {/* Graphic Blocks (Refinery Column, Tanker Dock, Pump Stations) */}
                
                {/* Block 1: Railway Overpass (Теміржол Эстакадасы) - Left Side */}
                <g transform="translate(100, 200)" className="opacity-80">
                  <rect x="0" y="0" width="130" height="80" rx="12" fill="#0f172a" stroke="#00E5FF" strokeWidth="1.5" />
                  <line x1="15" y1="20" x2="115" y2="20" stroke="#38bdf8" strokeWidth="2" />
                  <circle cx="30" cy="55" r="10" fill="#1e293b" stroke="#00E5FF" />
                  <circle cx="65" cy="55" r="10" fill="#1e293b" stroke="#00E5FF" />
                  <circle cx="100" cy="55" r="10" fill="#1e293b" stroke="#00E5FF" />
                  <text x="65" y="40" textAnchor="middle" fill="#00E5FF" fontSize="7" fontWeight="bold" fontFamily="monospace" letterSpacing="1">ТЖ ЭСТАКАДА</text>
                </g>

                {/* Block 2: Main Pump Station (Орталық Сорғы) - Center Upper */}
                <g transform="translate(430, 40)" className="opacity-85">
                  <rect x="0" y="0" width="140" height="70" rx="12" fill="#0f172a" stroke="#a78bfa" strokeWidth="1.5" />
                  <path d="M 20 35 Q 70 10, 120 35" stroke="#a78bfa" strokeWidth="1.5" />
                  <circle cx="70" cy="40" r="16" fill="#1e293b" stroke="#a78bfa" strokeWidth="2" />
                  <text x="70" y="44" textAnchor="middle" fill="#a78bfa" fontSize="8" fontWeight="black" fontFamily="monospace">PUMP-01</text>
                  <text x="70" y="60" textAnchor="middle" fill="#f472b6" fontSize="6" fontWeight="bold" fontFamily="monospace">БАСТЫ СОРҒЫ</text>
                </g>

                {/* Block 3: Auto Loading Bay (Автоқұю Эстакадасы) - Right Side */}
                <g transform="translate(770, 200)" className="opacity-80">
                  <rect x="0" y="0" width="130" height="80" rx="12" fill="#0f172a" stroke="#34d399" strokeWidth="1.5" />
                  <rect x="20" y="15" width="90" height="35" rx="6" fill="#1e293b" stroke="#34d399" strokeWidth="1" />
                  <path d="M 30 32 L 100 32" stroke="#34d399" strokeWidth="2" />
                  <circle cx="45" cy="32" r="5" fill="#34d399" />
                  <circle cx="85" cy="32" r="5" fill="#34d399" />
                  <text x="65" y="62" textAnchor="middle" fill="#34d399" fontSize="7" fontWeight="bold" fontFamily="monospace" letterSpacing="1">АВТОҚҰЮ БЕКЕТІ</text>
                </g>

                {/* Block 4: Refining & Quality Control Lab (Мұнай Сапасын Тексеру) - Center Lower */}
                <g transform="translate(415, 380)" className="opacity-85">
                  <rect x="0" y="0" width="170" height="70" rx="12" fill="#0f172a" stroke="#f59e0b" strokeWidth="1.5" />
                  <line x1="20" y1="35" x2="150" y2="35" stroke="#f59e0b" strokeWidth="1" strokeDasharray="3,3" />
                  <rect x="50" y="15" width="70" height="25" rx="4" fill="#1e293b" stroke="#f59e0b" />
                  <text x="85" y="30" textAnchor="middle" fill="#f59e0b" fontSize="8" fontWeight="bold" fontFamily="monospace">QC LAB // САПА</text>
                  <text x="85" y="55" textAnchor="middle" fill="#94a3b8" fontSize="6" fontWeight="bold" fontFamily="monospace" letterSpacing="0.5">MERCURY LABORATORY</text>
                </g>

                {/* Center Core System Information */}
                <circle cx="500" cy="250" r="45" fill="#090d16" stroke="url(#glowGrad)" strokeWidth="3" className="animate-pulse shadow-lg" />
                <circle cx="500" cy="250" r="30" fill="#0f172a" stroke="#00E5FF" strokeWidth="1" />
                <path d="M 500 225 L 500 275 M 475 250 L 525 250" stroke="#00E5FF" strokeWidth="1" opacity="0.5" />
                
                <text x="500" y="185" textAnchor="middle" className="fill-white/80 text-[10px] font-mono font-black tracking-[0.2em] uppercase">
                  MERCURY INDUSTRIAL TERMINAL
                </text>
                <text x="500" y="320" textAnchor="middle" className="fill-sky-400/90 text-[8px] font-mono font-bold tracking-widest uppercase">
                  НАҚТЫ УАҚЫТТАҒЫ СЕНСОР КАРТАСЫ
                </text>
                <text x="500" y="335" textAnchor="middle" className="fill-slate-500 text-[6px] font-mono tracking-widest uppercase">
                  © SMARTME LOGISTICS SYSTEM
                </text>
              </svg>
            </div>
          )}

          {/* Interactive Pinned Points (Markers) */}
          {hubs.map((hub) => {
            const isDragging = draggingHubId === hub.id;
            const isLocked = lockedHubs[hub.id] ?? true;
            const isHovered = hoveredHubId === hub.id;
            const isActive = activeHubId === hub.id;

            // Positioning using relative x, y percentages stored in geohub structures
            const posX = hub.x !== undefined ? hub.x : 50;
            const posY = hub.y !== undefined ? hub.y : 50;

            return (
              <div
                key={hub.id}
                style={{ left: `${posX}%`, top: `${posY}%` }}
                onPointerDown={(e) => handlePointerDown(hub.id, e)}
                onMouseEnter={() => setHoveredHubId(hub.id)}
                onMouseLeave={() => setHoveredHubId(null)}
                className={`absolute -translate-x-1/2 -translate-y-1/2 z-20 cursor-grab active:cursor-grabbing`}
              >
                {/* Visual Circle Pulse Marker */}
                <div className="relative group/point">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all shadow-md ${
                    isActive 
                      ? 'bg-blue-600 text-white scale-110 border-white animate-pulse' 
                      : 'bg-slate-900/80 text-blue-300 hover:scale-105 border-blue-400'
                  }`}>
                    <MapPin className="w-4.5 h-4.5" />
                  </div>

                  {/* Lock Status Pin Indicator */}
                  {isAdmin && (
                    <button
                      onClick={(e) => toggleLockHub(hub.id, e)}
                      className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center p-0.5 shadow-md border text-[8px] transition ${
                        isLocked 
                          ? 'bg-emerald-500 text-slate-950 border-white' 
                          : 'bg-amber-500 text-slate-950 border-white'
                      }`}
                      title={isLocked ? "Нүкте қатырылған (Жылжыту бұғатталған)" : "Нүкте босатылған (Сүйреп жылжытыңыз)"}
                    >
                      {isLocked ? <Lock className="w-2.5 h-2.5" /> : <Unlock className="w-2.5 h-2.5" />}
                    </button>
                  )}

                  {/* Immediate automatic detailed tooltip/popover (On click, hover, or active) */}
                  {(isHovered || isDragging || isActive) && (
                    <div className="absolute z-30 bottom-full mb-3 left-1/2 transform -translate-x-1/2 bg-slate-950/95 backdrop-blur-md text-white p-3 rounded-xl shadow-2xl border border-white/20 text-xs w-48 pointer-events-none">
                      <div className="font-extrabold text-sky-400 uppercase text-xs mb-1">
                        {hub.name}
                      </div>
                      <div className="flex justify-between text-slate-300 font-mono mb-1">
                        <span>Резервуарлар:</span>
                        <span className="font-bold text-white">{hub.reservoirs.length}</span>
                      </div>
                      <div className="text-[10px] text-slate-400 border-t border-slate-800 pt-1 mt-1 leading-tight">
                        📍 {hub.address || 'Қазақстан Республикасы'}
                      </div>
                      <div className="text-[8px] text-slate-500 text-right mt-1 font-mono">
                        X: {posX}% | Y: {posY}%
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Active location name - Large, highly attractive bold font styled in bright white and vivid tones */}
      <div className="pb-4 border-b border-white/20 mb-8 bg-gradient-to-r from-blue-700 via-blue-800 to-indigo-900 p-6 rounded-3xl shadow-xl border border-white/10">
        <h1 className="text-5xl sm:text-7xl font-black tracking-[0.15em] text-white uppercase font-sans mb-2 select-none drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]">
          {activeHubIdUpper}
        </h1>
        <p className="text-sm uppercase font-black tracking-widest text-sky-300 flex items-center gap-2 font-mono">
          <span className="inline-block w-3 h-3 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#34d399]"></span>
          БАҚЫЛАУДАҒЫ ОРЫН ТЕРМИНАЛЫ: <span className="text-white underline decoration-sky-400 decoration-2 underline-offset-4">{activeHub.name}</span> • РЕЗЕРВУАРЛАР САНЫ: <span className="text-white font-black">{activeHub.reservoirs.length}</span>
        </p>
      </div>

      {/* 2. DYNAMIC LAYOUT GRID: Left (Export Pills, Reservoirs List) & Right (Active Reservoir Telemetry & Admin controls) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: Reservoirs Panel styled in Dodger Blue brand color */}
        <div className={showTelemetry ? "lg:col-span-9 space-y-6" : "lg:col-span-12 space-y-6"}>

          {/* Reservoirs List Panel with custom background #1E90FF and white layouts */}
          <div 
            style={{ backgroundColor: '#1E90FF' }}
            className="rounded-3xl p-6 shadow-xl space-y-5 text-white border border-white/20"
          >
            
            {/* Header: Title, Rez-Info toggle, and Export controls */}
            <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 pb-4 border-b border-white/20">
              <h2 className="text-sm font-black tracking-wider uppercase text-white font-sans flex items-center gap-2">
                <Database className="w-4 h-4 text-white" />
                ОТЫНДАРДЫҢ АҒЫМДАҒЫ БАҚЫЛАУ ТОРЫ
              </h2>
              
              <div className="flex flex-wrap items-center gap-2">
                {/* Rez-Info show/hide toggle */}
                <button
                  onClick={() => setShowTelemetry(!showTelemetry)}
                  className="bg-white/20 hover:bg-white/30 text-white border border-white/30 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all flex items-center gap-1.5"
                  title="Резервуар деректері және телеметрия панелін көрсету/жасыру"
                >
                  <Sliders className="w-3.5 h-3.5 text-white" />
                  Rez-Info: {showTelemetry ? 'Жасыру' : 'Көрсету'}
                </button>

                {/* Compact Export pill row next to reservoirs panel */}
                <div className="flex flex-wrap items-center gap-2">
                  <div className="flex items-center gap-1 bg-black/25 p-1 rounded-xl border border-white/10 select-none text-[10px]">
                    <span className="text-[9px] font-extrabold uppercase tracking-wider text-blue-105 px-1.5 font-mono">
                      Экспорт:
                    </span>
                    
                    <button
                      onClick={triggerCSVExport}
                      className="bg-sky-600 hover:bg-sky-500 text-white px-2 py-1 rounded-lg text-[9px] font-black uppercase transition flex items-center gap-0.5"
                      title="CSV форматта жүктеу"
                    >
                      <FileText className="w-3 h-3" /> CSV
                    </button>

                    <button
                      onClick={triggerExcelExport}
                      className="bg-emerald-600 hover:bg-emerald-500 text-white px-2 py-1 rounded-lg text-[9px] font-black uppercase transition flex items-center gap-0.5"
                      title="Excel форматта жүктеу"
                    >
                      <Download className="w-3 h-3" /> Excel
                    </button>

                    <button
                      onClick={triggerPDFExport}
                      className="bg-indigo-600 hover:bg-indigo-500 text-white px-2 py-1 rounded-lg text-[9px] font-black uppercase transition flex items-center gap-0.5"
                      title="PDF ресми есеп шығару"
                    >
                      <Sliders className="w-3 h-3" /> PDF
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Filter controls inside reservoirs grid */}
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Search bar */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-blue-100/80" />
                <input
                  type="text"
                  placeholder="Параметр іздеу..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-black/20 border border-white/20 text-white placeholder-blue-100/70 focus:outline-none focus:border-white/40"
                />
              </div>

              {/* Brand select filter dropdown with simplified 'Барлығы' translated option */}
              <div className="relative">
                <select
                  value={fuelFilter}
                  onChange={(e) => setFuelFilter(e.target.value)}
                  className="appearance-none bg-black/20 border border-white/20 text-white px-4 py-2 pr-8 rounded-xl text-xs font-bold cursor-pointer focus:outline-none focus:border-white/40"
                >
                  <option className="bg-slate-900 text-white" value="ALL">Барлығы</option>
                  <option className="bg-slate-900 text-white" value="95">АИ-95 Premium</option>
                  <option className="bg-slate-900 text-white" value="92">АИ-92 Standard</option>
                  <option className="bg-slate-900 text-white" value="Diesel">ДТ Летний</option>
                  <option className="bg-slate-900 text-white" value="Jet">Jet A-1</option>
                </select>
              </div>

              {/* Quick Green Add button to match the mockup header visual */}
              {hasEditAccess && (
                <button
                  onClick={() => setShowAddResModal(true)}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-1 shrink-0 border border-emerald-500/30 shadow-md animate-none"
                >
                  <Plus className="w-4 h-4" /> Қосу
                </button>
              )}
            </div>

            {/* Glowing Custom Grid of Reservoirs */}
            {filteredReservoirs.length === 0 ? (
              <div className="text-center py-10 text-xs text-blue-100 border border-dashed border-white/20 rounded-2xl">
                Мұндай индикаторлы мұнай резервуары табылмады.
              </div>
            ) : (
              <GlowReservoirGrid
                reservoirs={filteredReservoirs}
                selectedId={selectedResId}
                onSelect={setSelectedResId}
                isAdmin={isAdmin && isEditMode}
                onDelete={handleDeleteReservoir}
              />
            )}

            {/* Quick Add node if permissions check passes */}
            {hasEditAccess && (
              <button
                onClick={() => setShowAddResModal(true)}
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-3 rounded-2xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-lg border border-white/10"
              >
                <Plus className="w-4 h-4" /> Жаңа Резервуар Қосу
              </button>
            )}

          </div>
        </div>

        {/* RIGHT COLUMN: Dedicated Telemetry, Sensors & Admin Parameters Adjustment */}
        {showTelemetry && (
          <div className="lg:col-span-3 space-y-4">
            
            {activeRes ? (
              isEditMode ? (
                <div 
                  style={{ backgroundColor: '#1E90FF' }}
                  className="rounded-3xl p-6 shadow-xl space-y-5 border border-white/20 text-white"
                >
                  {/* Header inside edit mode */}
                  <div className="flex items-center justify-between pb-3 border-b border-white/20">
                    <h2 className="text-sm font-black tracking-wider uppercase text-white font-mono flex items-center gap-1.5 animate-pulse">
                      <Sliders className="w-4 h-4 text-white" />
                      ӨҢДЕУ РЕЖИМІ: {activeRes.id}
                    </h2>
                    <span className="text-[10px] font-extrabold uppercase bg-rose-600/30 text-rose-300 px-2 py-0.5 rounded-lg font-mono">
                      ADMIN MODE
                    </span>
                  </div>

                  <div className="space-y-4 text-xs text-white">
                    {/* Live validation warning */}
                    {editVolume > editCapacity && (
                      <div className="text-xs text-rose-200 bg-black/40 p-2.5 rounded-lg border border-rose-500/30 font-extrabold select-none uppercase tracking-wider">
                        ⚠️ ҚАТЕ: Ағымдағы деңгей сыйымдылықтан аса алмайды!
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-blue-100 mb-1 font-bold font-sans">Резервуар ID (Жаңа):</label>
                        <input
                          type="text"
                          value={editResId}
                          onChange={(e) => setEditResId(e.target.value)}
                          className="w-full px-3 py-2 rounded-lg bg-slate-950/80 border border-white/10 text-white font-bold font-mono focus:border-white/30 uppercase text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-blue-100 mb-1 font-bold font-sans">Орын түрі:</label>
                        <input
                          type="text"
                          value={editFuel}
                          onChange={(e) => setEditFuel(e.target.value)}
                          className="w-full px-3 py-2 rounded-lg bg-slate-950/80 border border-white/10 text-white focus:border-white/30 text-xs"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-blue-100 mb-1 font-bold font-sans">Статус:</label>
                      <select
                        value={editIsOpen ? "true" : "false"}
                        onChange={(e) => setEditIsOpen(e.target.value === "true")}
                        className="w-full px-3 py-2 rounded-lg bg-slate-950/80 border border-white/10 text-white focus:border-white/30 font-bold text-xs"
                      >
                        <option className="bg-slate-900 text-white" value="true">Active (Белсенді)</option>
                        <option className="bg-slate-900 text-white" value="false">Drainage / Off (Белсенді емес)</option>
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-blue-101 mb-1 font-bold font-sans">Ағымдағы мөлшер (м³):</label>
                        <input
                          type="number"
                          value={editVolume}
                          onChange={(e) => setEditVolume(Number(e.target.value))}
                          className="w-full px-3 py-2 rounded-lg bg-slate-950/80 border border-white/10 text-white font-mono text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-blue-101 mb-1 font-bold font-sans">Макс. сыйымдылық (м³):</label>
                        <input
                          type="number"
                          value={editCapacity}
                          onChange={(e) => setEditCapacity(Number(e.target.value))}
                          className="w-full px-3 py-2 rounded-lg bg-slate-950/80 border border-white/10 text-white font-mono text-xs"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-blue-101 mb-1 font-bold font-sans">Подтоварная су (см):</label>
                        <input
                          type="number"
                          step="0.1"
                          value={editWaterLevel}
                          onChange={(e) => setEditWaterLevel(Number(e.target.value))}
                          className="w-full px-3 py-2 rounded-lg bg-slate-950/80 border border-white/10 text-white font-mono text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-blue-101 mb-1 font-bold font-sans">Температура (°C):</label>
                        <input
                          type="number"
                          step="0.1"
                          value={editTemp}
                          onChange={(e) => setEditTemp(Number(e.target.value))}
                          className="w-full px-3 py-2 rounded-lg bg-slate-950/80 border border-white/10 text-white font-mono text-xs"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-blue-101 mb-1 font-bold font-sans">Орташа тығыздығы (кг/м³):</label>
                        <input
                          type="number"
                          value={editDensity}
                          onChange={(e) => setEditDensity(Number(e.target.value))}
                          className="w-full px-3 py-2 rounded-lg bg-slate-950/80 border border-white/10 text-white font-mono text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-blue-101 mb-1 font-bold font-sans">Гидростатикалық қысым (кПа):</label>
                        <input
                          type="number"
                          step="0.1"
                          value={editPressure}
                          onChange={(e) => setEditPressure(Number(e.target.value))}
                          className="w-full px-3 py-2 rounded-lg bg-slate-950/80 border border-white/10 text-white font-mono text-xs"
                        />
                      </div>
                    </div>

                    {/* Actions inside form */}
                    <div className="flex gap-2.5 pt-2">
                      <button
                        onClick={handleSaveEdits}
                        disabled={editVolume > editCapacity}
                        className="flex-1 bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-800/60 disabled:cursor-not-allowed text-white font-black py-2.5 rounded-xl text-xs uppercase tracking-wider transition-all"
                      >
                        Сақтау
                      </button>
                      <button
                        onClick={() => setIsEditMode(false)}
                        className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold uppercase transition"
                      >
                        Болдырмау
                      </button>
                    </div>

                    {/* Delete option inside edit mode form */}
                    <div className="pt-2 border-t border-white/10">
                      <button
                        type="button"
                        onClick={() => {
                          handleDeleteReservoir(activeRes.id);
                          setIsEditMode(false);
                        }}
                        className="w-full py-2 bg-rose-600/30 hover:bg-rose-600 text-white rounded-xl text-xs font-black uppercase transition flex items-center justify-center gap-1.5 border border-rose-500/30"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Резервуарды Мүлдем Өшіру
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <GlowTelemetryPanel
                  reservoir={activeRes}
                  onEditToggle={() => setIsEditMode(true)}
                  hasEditAccess={hasEditAccess}
                />
              )
            ) : (
              <div 
                style={{ backgroundColor: '#1E90FF' }}
                className="p-10 text-center font-bold text-white rounded-3xl border border-white/20 shadow-xl select-none"
              >
                <Database className="w-12 h-12 text-white/45 mx-auto mb-3 animate-pulse" />
                Информатикалық сенсорлық датчиктерді көрсету үшін оң жақтағы резервуар торларының бірін таңдаңыз.
              </div>
            )}
            
            {/* Quick usage safety details card - Fully Editable by Admin */}
            <div 
              style={{ backgroundColor: '#1E90FF' }}
              className="p-4 border border-white/20 rounded-3xl text-sm space-y-2 text-white shadow-lg relative"
            >
              <div className="flex justify-between items-center pb-1 border-b border-white/10 mb-2">
                <h3 className="font-extrabold text-xs uppercase text-white tracking-widest select-none">
                  {safetyTitle}
                </h3>
                {isAdmin && !isEditingSafety && (
                  <button
                    onClick={() => {
                      setTempSafetyTitle(safetyTitle);
                      setTempSafetyRules([...safetyRules]);
                      setIsEditingSafety(true);
                    }}
                    className="text-[10px] bg-white/20 hover:bg-white/30 text-white px-2 py-1 rounded-lg font-bold transition uppercase"
                  >
                    Өңдеу
                  </button>
                )}
              </div>

              {isEditingSafety ? (
                <div className="space-y-3">
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-blue-100 mb-1">Тақырыбы:</label>
                    <input
                      type="text"
                      value={tempSafetyTitle}
                      onChange={(e) => setTempSafetyTitle(e.target.value)}
                      className="w-full px-2 py-1 text-xs rounded-lg bg-black/25 border border-white/20 text-white focus:outline-none focus:border-white/40 font-bold"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-[10px] uppercase font-bold text-blue-100">Ережелер (3 тармақ):</label>
                    {tempSafetyRules.map((rule, idx) => (
                      <div key={idx} className="flex gap-1.5 items-center">
                        <span className="text-xs font-mono font-bold text-blue-200">{idx + 1}.</span>
                        <textarea
                          rows={2}
                          value={rule}
                          onChange={(e) => {
                            const newRules = [...tempSafetyRules];
                            newRules[idx] = e.target.value;
                            setTempSafetyRules(newRules);
                          }}
                          className="w-full p-2 text-xs rounded-lg bg-black/25 border border-white/20 text-white focus:outline-none focus:border-white/40 leading-snug resize-none"
                        />
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2 pt-1">
                    <button
                      onClick={handleSaveSafety}
                      className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-black py-2 rounded-xl text-[10px] uppercase tracking-wider transition-all"
                    >
                      Сақтау
                    </button>
                    <button
                      onClick={() => setIsEditingSafety(false)}
                      className="px-3 py-2 bg-slate-850 hover:opacity-85 text-slate-200 rounded-xl text-[10px] font-bold uppercase transition"
                    >
                      Болдырмау
                    </button>
                  </div>
                </div>
              ) : (
                <ul className="list-disc pl-4 space-y-1 text-blue-100 leading-relaxed text-[11px]">
                  {safetyRules.map((rule, idx) => {
                    // Make some keywords bold (e.g. numbers and % levels) to keep the nice highlighting!
                    const formatted = rule
                      .replace(/(5 см-ден)/g, "<strong>$1</strong>")
                      .replace(/(-15°C пен \+45°C)/g, "<strong>$1</strong>")
                      .replace(/(95%)/g, "<strong>$1</strong>");
                    return (
                      <li key={idx} dangerouslySetInnerHTML={{ __html: formatted }} />
                    );
                  })}
                </ul>
              )}
            </div>

          </div>
        )}

      </div>

      {/* Recharts Analytics Dashboard */}
      <div className="mt-12 bg-gradient-to-br from-slate-900 to-indigo-950 p-6 rounded-3xl border border-white/10 shadow-2xl">
        <GlowStatisticsDashboard />
      </div>

      {/* 3. MODAL DIALOGS: Safe dialog additions */}
      <AnimatePresence>
        
        {/* Modal: Add Hub (Point on schematic mapping) */}
        {showAddHubModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setShowAddHubModal(false)}
              className="absolute inset-0 bg-slate-950/70 backdrop-blur-md"
            />
            <motion.div 
              initial={{ scale: 0.95, y: 15 }} 
              animate={{ scale: 1, y: 0 }} 
              exit={{ scale: 0.95, y: 15 }}
              className="relative w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-6"
            >
              <h3 className="text-lg font-black tracking-wider uppercase text-slate-900 dark:text-white font-sans mb-4 border-b pb-2">
                Жаңа Белгі (Орын) Қосу
              </h3>

              <div className="space-y-4 text-xs text-slate-900 dark:text-slate-100">
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 mb-1 font-bold">Орын атауы (Мыс: Шымкент хабы):</label>
                  <input
                    type="text"
                    value={newHubName}
                    onChange={(e) => setNewHubName(e.target.value)}
                    placeholder="Атауын енгізіңіз..."
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 dark:text-slate-400 mb-1 font-bold">Орын белгісі ағылшынша (Мыс: SHYMKENT):</label>
                  <input
                    type="text"
                    value={newHubIdEn}
                    onChange={(e) => setNewHubIdEn(e.target.value)}
                    placeholder="Ағылшынша үлкен әріптермен..."
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white uppercase focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 dark:text-slate-400 mb-1 font-bold">Орынның ресми мекен-жайы:</label>
                  <input
                    type="text"
                    value={newHubAddress}
                    onChange={(e) => setNewHubAddress(e.target.value)}
                    placeholder="Мекен-жайын толық жазыңыз..."
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="bg-slate-100 dark:bg-slate-950 p-3 rounded-lg border text-[10px] leading-relaxed text-slate-500 font-medium">
                  Жаңа орын сурет бетінің дәл ортасына (X: 50%, Y: 50%) қосылады. Оны кез келген уақытта жылжытып қатыра аласыз.
                </div>

                <div className="flex gap-2 pt-2 text-xs font-bold uppercase">
                  <button
                    onClick={submitNewHub}
                    className="flex-1 bg-blue-600 hover:bg-blue-500 text-white py-2.5 rounded-xl transition"
                  >
                    Белгіні суретке бекіту
                  </button>
                  <button
                    onClick={() => setShowAddHubModal(false)}
                    className="px-4 py-2.5 bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-xl transition"
                  >
                    Жабу
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* Modal: Add Reservoir inside active hub */}
        {showAddResModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setShowAddResModal(false)}
              className="absolute inset-0 bg-slate-950/70 backdrop-blur-md"
            />
            <motion.div 
              initial={{ scale: 0.95, y: 15 }} 
              animate={{ scale: 1, y: 0 }} 
              exit={{ scale: 0.95, y: 15 }}
              className="relative w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-6"
            >
              <h3 className="text-lg font-black tracking-wider uppercase text-slate-900 dark:text-white font-sans mb-4 border-b pb-2">
                Жаңа Резервуар Орнату
              </h3>

              <div className="space-y-4 text-xs text-slate-900 dark:text-slate-100">
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-600 dark:text-slate-400 mb-1 font-bold">Резервуар ID (Мыс: T-ALA-14):</label>
                    <input
                      type="text"
                      value={newResId}
                      onChange={(e) => setNewResId(e.target.value)}
                      placeholder="Жүйелік коды"
                      className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white font-mono uppercase focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 dark:text-slate-400 mb-1 font-bold">Отын бренді:</label>
                    <input
                      type="text"
                      value={newResFuel}
                      onChange={(e) => setNewResFuel(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-600 dark:text-slate-400 mb-1 font-bold">Сыйымдылығы (Capacity, м³):</label>
                    <input
                      type="number"
                      value={newResCapacity}
                      onChange={(e) => setNewResCapacity(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 dark:text-slate-400 mb-1 font-bold">Ағымдағы деңгейі (м³):</label>
                    <input
                      type="number"
                      value={newResVolume}
                      onChange={(e) => setNewResVolume(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white font-mono"
                    />
                  </div>
                </div>

                {newResVolume > newResCapacity && (
                  <div className="text-[11px] text-red-500 bg-red-100 p-2.5 rounded-lg border border-red-300 font-bold select-none uppercase tracking-wider">
                    ⚠️ ҚАТЕ: Ағымдағы көлем сыйымдылықтан аса алмайды!
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-600 dark:text-slate-400 mb-1 font-bold">Су деңгейі (см):</label>
                    <input
                      type="number"
                      step="0.1"
                      value={newWaterLevel}
                      onChange={(e) => setNewWaterLevel(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 dark:text-slate-400 mb-1 font-bold">Температура (°C):</label>
                    <input
                      type="number"
                      step="0.1"
                      value={newTemperature}
                      onChange={(e) => setNewTemperature(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-600 dark:text-slate-400 mb-1 font-bold">Отын тығыздығы (кг/м³):</label>
                    <input
                      type="number"
                      value={newDensity}
                      onChange={(e) => setNewDensity(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 dark:text-slate-400 mb-1 font-bold">Қысымы (kPa):</label>
                    <input
                      type="number"
                      step="0.1"
                      value={newPressure}
                      onChange={(e) => setNewPressure(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white font-mono"
                    />
                  </div>
                </div>

                <div className="flex gap-2 pt-2 text-xs font-bold uppercase font-sans">
                  <button
                    onClick={submitNewReservoir}
                    disabled={newResVolume > newResCapacity}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-800/60 disabled:cursor-not-allowed text-white py-2.5 rounded-xl transition"
                  >
                    Қоймаға Енгізу
                  </button>
                  <button
                    onClick={() => setShowAddResModal(false)}
                    className="px-4 py-2.5 bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-xl transition"
                  >
                    Жабу
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}

      </AnimatePresence>

    </div>
  );
}
