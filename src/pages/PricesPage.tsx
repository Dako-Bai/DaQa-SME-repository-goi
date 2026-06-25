import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Calculator, Scale, Fuel, Coins, Layers, Info, Copy, Check, InfoIcon, Sparkles, RefreshCw, Edit2, Lock, Save, X, Eye
} from 'lucide-react';
import { useAppContext } from '../contexts/AppContext';
import { SpotPricesPanel } from '../components/SpotPricesPanel';

export default function PricesPage() {
  const { lang, role, setRole, managedPrices, updateManagedPrice, currentUser, priceDisplayUnit } = useAppContext();

  const isGuest = role === 'guest' || !currentUser;

  // Price Category Tab Filter
  const [activeCategoryTab, setActiveCategoryTab] = useState<'all' | 'singapore' | 'argus' | 'smartme'>('all');
  const [smartMeSubFilter, setSmartMeSubFilter] = useState<'retail' | 'wholesale'>('retail');

  // Interactive inline editing states for admins
  const [editingPriceId, setEditingPriceId] = useState<string | null>(null);
  const [editPriceRetail, setEditPriceRetail] = useState<string>('');
  const [editPriceWholesale, setEditPriceWholesale] = useState<string>('');
  const [editName, setEditName] = useState<string>('');
  const [editDescription, setEditDescription] = useState<string>('');
  const [editStandard, setEditStandard] = useState<string>('');

  const getConvertedPrice = (priceTon: number, name: string) => {
    if (priceDisplayUnit === 'ton') {
      return { value: priceTon, unit: '₸/тн' };
    }
    // Convert KZT/Ton to KZT/Liter: priceLiter = (priceTon * density) / 1000
    let density = 0.750;
    const lower = name.toLowerCase();
    if (lower.includes('95')) density = 0.745;
    else if (lower.includes('92')) density = 0.730;
    else if (lower.includes('дт') || lower.includes('дизель') || lower.includes('diesel')) density = 0.840;
    else if (lower.includes('jet') || lower.includes('авиа') || lower.includes('тс-1') || lower.includes('керосин')) density = 0.775;
    
    const priceLiter = (priceTon * density) / 1000;
    return { value: Math.round(priceLiter * 10) / 10, unit: '₸/л' };
  };

  // Basic presets for quick entry (market rates per ton in Kazakhstan)
  const presets = [
    { name: 'Jet A-1', density: 0.775, defaultPrice: 525000, color: 'from-emerald-500 to-teal-600' },
    { name: 'ТС-1 Авиа', density: 0.780, defaultPrice: 410000, color: 'from-cyan-500 to-blue-600' },
    { name: 'АИ-95 Премиум', density: 0.745, defaultPrice: 338255, color: 'from-blue-500 to-indigo-600' },
    { name: 'АИ-92 Стандарт', density: 0.730, defaultPrice: 280821, color: 'from-amber-500 to-orange-600' },
    { name: 'ДТ Жазғы (Дизель)', density: 0.840, defaultPrice: 351190, color: 'from-rose-500 to-pink-600' },
  ];

  // Inputs for Calculator (KZT per Ton format only)
  const [tempDensity, setTempDensity] = useState<number>(0.775); // g/cm³
  const [tempVolume, setTempVolume] = useState<number>(24000); // Liters
  const [tempPricePerUnit, setTempPricePerUnit] = useState<number>(525000); // KZT per ton ONLY

  // Core values used in Calculation Results
  const [density, setDensity] = useState<number>(0.775);
  const [volume, setVolume] = useState<number>(24000);
  const [pricePerUnit, setPricePerUnit] = useState<number>(525000);
  const [selectedPreset, setSelectedPreset] = useState<string>('Jet A-1');
  const [copied, setCopied] = useState<boolean>(false);

  // Calculated States (Mass in Tons and Total Cost)
  const [results, setResults] = useState({
    massTons: 18.6,
    costKzt: 9765000,
  });

  // Calculate under the unit criteria: THT (tons) and price / Ton
  const handleCalculate = () => {
    const massT = (tempVolume * tempDensity) / 1000;
    const cost = massT * tempPricePerUnit; // mass in tons * price per ton

    setResults({
      massTons: massT,
      costKzt: cost,
    });

    setDensity(tempDensity);
    setVolume(tempVolume);
    setPricePerUnit(tempPricePerUnit);
  };

  // Run calculation initially once
  useEffect(() => {
    handleCalculate();
  }, []);

  const selectPreset = (p: typeof presets[0]) => {
    setSelectedPreset(p.name);
    setTempDensity(p.density);
    setTempPricePerUnit(p.defaultPrice);
  };

  const handleCopy = () => {
    const calcUser = currentUser ? currentUser.fullName : (lang === 'kz' ? 'Ахметжанов Мақсат Ақанұлы' : lang === 'ru' ? 'Ахметжанов Максат Аканулы' : 'Maksat Akanuly');
    const calcEmail = currentUser ? currentUser.email : 'guest@mercuryenergy.kz';
    const nowStr = new Date().toLocaleDateString(lang === 'kz' ? 'kk-KZ' : lang === 'ru' ? 'ru-RU' : 'en-US') + ' ' + new Date().toLocaleTimeString(lang === 'kz' ? 'kk-KZ' : lang === 'ru' ? 'ru-RU' : 'en-US');

    let text = '';
    if (lang === 'kz') {
      text = `⚡️ MERCURY ENERGY • ЕСЕПТЕУ СЕРТИФИКАТЫ
──────────────────────────────────────
 Өнім / Отын маркасы: ${selectedPreset || 'Жеке параметр'}
 Тығыздығы (ρ): ${density.toFixed(4)} г/см³
 Көлемі (V): ${volume.toLocaleString('kk-KZ')} литр
 Массасы (m): ${results.massTons.toFixed(3)} тонна (тн)
 Бір тонна бағасы: ${pricePerUnit.toLocaleString('kk-KZ')} ₸ / тн
 Жалпы есептелген құны: ${Math.round(results.costKzt).toLocaleString('kk-KZ')} ₸
──────────────────────────────────────
 📝 Есептеу формуласы (қысқаша):
  • Масса: m = (V × ρ) / 1000
  • Құны: Жалпы = Масса × Баға
──────────────────────────────────────
 👤 Есептеген маман: ${calcUser}
 📧 Байланыс поштасы: ${calcEmail}
 🕒 Есептелген уақыты: ${nowStr}
──────────────────────────────────────
 * SmartME технологиялық жүйесі арқылы сертификатталды`;
    } else if (lang === 'ru') {
      text = `⚡️ MERCURY ENERGY • СЕРТИФИКАТ РАСЧЕТА
──────────────────────────────────────
 Продукт / Марка топлива: ${selectedPreset || 'Индивидуальный параметр'}
 Плотность (ρ): ${density.toFixed(4)} г/см³
 Объем (V): ${volume.toLocaleString('ru-RU')} литров
 Масса (m): ${results.massTons.toFixed(3)} тонн(ы)
 Цена за тонну: ${pricePerUnit.toLocaleString('ru-RU')} ₸ / тн
 Общая рассчитанная стоимость: ${Math.round(results.costKzt).toLocaleString('ru-RU')} ₸
──────────────────────────────────────
 📝 Формула расчета (кратко):
  • Масса: m = (V × ρ) / 1000
  • Стоимость: Итого = Масса × Цена
──────────────────────────────────────
 👤 Расчет выполнил: ${calcUser}
 📧 Электронная почта: ${calcEmail}
 🕒 Время расчета: ${nowStr}
──────────────────────────────────────
 * Сертифицировано технологической системой SmartME`;
    } else {
      text = `⚡️ MERCURY ENERGY • CALCULATION CERTIFICATE
──────────────────────────────────────
 Product / Fuel Grade: ${selectedPreset || 'Custom parameter'}
 Density (ρ): ${density.toFixed(4)} g/cm³
 Volume (V): ${volume.toLocaleString('en-US')} liters
 Mass (m): ${results.massTons.toFixed(3)} tons
 Price per Ton: ${pricePerUnit.toLocaleString('en-US')} KZT / ton
 Total Calculated Cost: ${Math.round(results.costKzt).toLocaleString('en-US')} KZT
──────────────────────────────────────
 📝 Calculation Formula (brief):
  • Mass: m = (V × ρ) / 1000
  • Cost: Total = Mass × Price
──────────────────────────────────────
 👤 Calculated by: ${calcUser}
 📧 Contact Email: ${calcEmail}
 🕒 Time of Calculation: ${nowStr}
──────────────────────────────────────
 * Certified via SmartME refinery intelligence engine`;
    }

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const startEditing = (item: any) => {
    setEditingPriceId(item.id);
    setEditPriceRetail(item.priceRetail.toString());
    setEditPriceWholesale(item.priceWholesale.toString());
    setEditName(item.name);
    setEditDescription(item.description);
    setEditStandard(item.standard || '');
  };

  const saveEditedPrice = (priceId: string, category: string) => {
    const nextRetail = Number(editPriceRetail);
    const nextWholesale = Number(editPriceWholesale);
    
    const updates: any = {
      name: editName,
      description: editDescription,
      standard: editStandard
    };

    if (category === 'smartme') {
      if (!isNaN(nextRetail) && nextRetail > 0 && !isNaN(nextWholesale) && nextWholesale > 0) {
        updates.priceRetail = nextRetail;
        updates.priceWholesale = nextWholesale;
      }
    } else {
      if (!isNaN(nextRetail) && nextRetail > 0) {
        updates.priceRetail = nextRetail;
        updates.priceWholesale = nextRetail;
      }
    }
    updateManagedPrice(priceId, updates);
    setEditingPriceId(null);
  };

  // Translations
  const loc = {
    kz: {
      title: 'Отын сипаттамаларын есептеу',
      subtitle: 'Тығыздық пен көлем қолмен немесе дайын үлгілер арқылы реттеледі. Жүйе нақты уақытта масса мен жалпы құнын тек Теңге/Тонна форматында есептейді.',
      presets_title: 'Жылдам орнату үлгілері:',
      density_label: 'Отын тығыздығы (ρ):',
      volume_label: 'Отын көлемі (V):',
      price_label: 'Кесімді бағасы (₸ / тонна):',
      results_title: 'Есептелген көрсеткіштер',
      mass_tons: 'Отын массасы (Тонна):',
      cost_label: 'Есептелген жалпы құны:',
      unit_liters: 'Литр',
      unit_tons: 'тн',
      cost_val: 'Есептелген құны:',
      formula: 'Есептеу формуласы мен негізі:',
      formula_mass: 'Масса: m = V × ρ / 1000',
      formula_cost: 'Жалпы құны = Масса (тн) × Баға (₸/тн)',
      density_info: 'Анықтама: Мұнай өнімдерінің тығыздығы температура мен сапаға тікелей байланысты өзгереді. Есептеулер тек Tонна бойынша орындалады.',
      copy_btn: 'Нәтижені көшіру',
      copied_msg: 'Көшірілді!',
    },
    ru: {
      title: 'Расчет параметров топлива',
      subtitle: 'Плотность и объем настраиваются вручную или через готовые шаблоны. Система в реальном времени рассчитывает массу и общую стоимость в формате Тенге/Тонна.',
      presets_title: 'Готовые шаблоны марок:',
      density_label: 'Плотность топлива (ρ):',
      volume_label: 'Объем топлива (V):',
      price_label: 'Индикативная цена (₸ / тонна):',
      results_title: 'Рассчитанные параметры',
      mass_tons: 'Масса топлива (Тонны):',
      cost_label: 'Итоговая стоимость:',
      unit_liters: 'Литров',
      unit_tons: 'тн',
      cost_val: 'Итоговая сумма:',
      formula: 'Формула и основа расчета:',
      formula_mass: 'Масса: m = V × ρ / 1000',
      formula_cost: 'Стоимость = Масса (тн) × Цена (₸/тн)',
      density_info: 'Справка: Плотность нефтепродуктов варьируется в зависимости от стандартов. Все финансовые котировки производятся строго в тоннах.',
      copy_btn: 'Копировать результат',
      copied_msg: 'Скопировано!',
    },
    en: {
      title: 'Fuel Parameter Calculator',
      subtitle: 'Adjust density and volume manually or select a preset. The system instantly evaluates the mass and total transaction cost strictly in KZT/Ton.',
      presets_title: 'Quick Fuel Presets:',
      density_label: 'Fuel Density (ρ):',
      volume_label: 'Fuel Volume (V):',
      price_label: 'Indicative Price (KZT / Ton):',
      results_title: 'Calculated Output',
      mass_tons: 'Fuel Mass (Tons):',
      cost_label: 'Total Calculated Cost:',
      unit_liters: 'Liters',
      unit_tons: 'tons',
      cost_val: 'Total Sum:',
      formula: 'Calculation Formulas:',
      formula_mass: 'Mass: m = V × ρ / 1000',
      formula_cost: 'Cost = Mass (tons) × Price (KZT/ton)',
      density_info: 'Note: Predefined optimal physical constants are provided. All evaluations represent weight metrics in Tonnes.',
      copy_btn: 'Copy Results',
      copied_msg: 'Copied!',
    }
  };

  const currentLoc = loc[lang === 'kz' ? 'kz' : lang === 'ru' ? 'ru' : 'en'];

  // Guest can access prices without restriction per request

  // Filter listed managedPrices according to the active category tab
  const filteredPrices = managedPrices.filter(p => {
    if (activeCategoryTab === 'all') return true;
    return p.category === activeCategoryTab;
  });

  return (
    <div className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-24 animate-fade-in relative text-slate-100">
      
      {/* Current Spot Prices Panel displayed prominently on the Prices Page */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        <div className="lg:col-span-6 flex">
          <SpotPricesPanel />
        </div>
        <div className="lg:col-span-6 p-7 sm:p-8 rounded-[2rem] bg-gradient-to-br from-slate-900 to-[#102456] border border-blue-400/20 text-white min-h-[290px] flex flex-col justify-between">
          <div className="space-y-4 text-left">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 text-blue-300 text-[10px] font-black uppercase tracking-widest border border-blue-500/15">
              <Info className="w-3.5 h-3.5" /> {lang === 'kz' ? 'Ақпараттық Жүйе' : 'Информационная Справка'}
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-white leading-tight font-sans">
              MERCURY ENERGY • {lang === 'kz' ? 'Ресми баға саясаты' : 'Официальная ценовая политика'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
              {lang === 'kz' 
                ? 'Біз серіктестерімізге ең тиімді көтерме және бөлшек бағаларды, Сингапур және Argus халықаралық баға көрсеткіштерімен салыстырылған нақты деректерді ұсынамыз. Барлық деректер нақты уақытта жаңартылып отырады.'
                : 'Мы предоставляем нашим партнерам самые выгодные оптовые и розничные котировки, основанные на международных индексах Сингапура и Argus. Все данные обновляются в реальном времени.'}
            </p>
            <div className="pt-2 text-xs text-amber-300 font-mono flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>{lang === 'kz' ? 'Ресми тарифтер • Барлығы ашық' : 'Официальные тарифы • Все открыто'}</span>
            </div>
          </div>
          <div className="pt-4 border-t border-white/5 text-[10px] text-slate-400 font-mono text-left">
            System Live Platform • Verified refinery intelligence
          </div>
        </div>
      </div>

      {!isGuest && (
        <>
          {/* Visual Header Grid Banner */}
          <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-blue-600 to-indigo-750 p-8 sm:p-12 text-white shadow-xl shadow-blue-100/10">
         <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
         <div className="absolute bottom-0 left-0 w-80 h-80 bg-white/5 rounded-full blur-3xl pointer-events-none"></div>
         
         <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 relative z-10">
            <div className="space-y-4 max-w-2xl">
               <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 text-white text-xs font-bold tracking-widest uppercase border border-white/20">
                  <Calculator className="w-3.5 h-3.5 text-white" /> Smart Calculator (₸/тн)
               </span>
               <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight font-sans">
                  {currentLoc.title}
               </h1>
               <p className="text-blue-100 text-xs sm:text-sm leading-relaxed">
                  {currentLoc.subtitle}
               </p>
            </div>
         </div>
         
         <div className="mt-8 pt-6 border-t border-white/10 flex flex-wrap gap-x-8 gap-y-4 justify-between items-center text-xs text-blue-250">
             <div className="flex items-center gap-2">
                 <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                 <span className="font-semibold text-blue-100 uppercase tracking-widest text-[9px]">Verified Wholesale Price Database</span>
             </div>
             <p className="font-mono text-[9px] text-blue-200">System Unit: Tenge/Ton Only (Barrel Metrics Hidden)</p>
         </div>
      </div>

      {/* Preset Quick Actions */}
      <div className="bg-[#245dff] p-6 sm:p-8 rounded-[2rem] space-y-4 border border-blue-400/20 shadow-xl shadow-blue-650/20 text-white">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-300" />
          {currentLoc.presets_title}
        </h3>
        <div className="flex flex-wrap gap-2.5">
          {presets.map((p) => {
            const isActive = selectedPreset === p.name;
            return (
              <button
                key={p.name}
                onClick={() => selectPreset(p)}
                className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all flex items-center gap-2 border-0 cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r ' + p.color + ' text-white shadow-lg scale-102'
                    : 'bg-[#1d52e5] border border-blue-400/30 text-blue-100 hover:text-white hover:bg-blue-700/40'
                }`}
              >
                <Fuel className="w-3.5 h-3.5 shrink-0" />
                {p.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Calculator Body Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* Left Side Inputs Form */}
        <div className="lg:col-span-7 bg-[#245dff] p-6 sm:p-9 rounded-[2.5rem] border border-blue-400/20 shadow-xl shadow-blue-650/20 text-white transition-all flex flex-col justify-between space-y-6">
          <div className="space-y-6">
            
            {/* Density Column */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs font-bold text-blue-200 uppercase tracking-wider">
                <span>{currentLoc.density_label}</span>
                {selectedPreset && (
                  <span className="text-[10px] text-amber-300 font-bold bg-[#1d52e5] px-2 py-0.5 rounded border border-blue-400/20">
                    Үлгі: {selectedPreset}
                  </span>
                )}
              </div>
              
              <div className="relative">
                <input
                  type="number"
                  step="0.0001"
                  min="0.500"
                  max="2.000"
                  value={tempDensity}
                  onChange={(e) => {
                    setTempDensity(parseFloat(e.target.value) || 0);
                    setSelectedPreset('');
                  }}
                  className="w-full bg-[#1d52e5] rounded-xl px-4 py-3.5 pl-4 pr-16 text-sm font-bold font-mono text-white placeholder-blue-300 border border-blue-400/30 focus:outline-none focus:ring-2 focus:ring-amber-400"
                  placeholder="0.775"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-blue-200 font-mono">g/cm³</span>
              </div>
            </div>

            {/* Volume Column */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs font-bold text-blue-200 uppercase tracking-wider">
                <span>{currentLoc.volume_label}</span>
              </div>
              
              <div className="relative">
                <input
                  type="number"
                  min="1"
                  value={tempVolume}
                  onChange={(e) => setTempVolume(parseFloat(e.target.value) || 0)}
                  className="w-full bg-[#1d52e5] rounded-xl px-4 py-3.5 pl-4 pr-16 text-sm font-bold font-mono text-white placeholder-blue-300 border border-blue-400/30 focus:outline-none focus:ring-2 focus:ring-amber-400"
                  placeholder="24000"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-blue-200 font-mono">Liter (л)</span>
              </div>
            </div>

            {/* Price Estimator (Tenge per ton strictly, as per system design) */}
            <div className="space-y-2 pt-4 w-full">
              <label className="block text-xs font-bold text-blue-200 uppercase tracking-wider">
                {currentLoc.price_label}
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <input
                    type="number"
                    min="0"
                    value={tempPricePerUnit}
                    onChange={(e) => setTempPricePerUnit(parseFloat(e.target.value) || 0)}
                    className="w-full bg-[#1d52e5] rounded-xl pl-4 pr-10 py-3.5 text-sm font-bold font-mono text-white placeholder-blue-300 border border-blue-400/30 focus:outline-none focus:ring-2 focus:ring-amber-400"
                    placeholder="Баға"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-blue-200 font-mono">₸ / тн</span>
                </div>
              </div>
            </div>

            {/* Calculate Button (Manual Trigger) */}
            <div className="pt-4">
              <button
                type="button"
                onClick={handleCalculate}
                className="w-full h-14 rounded-full bg-linear-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 active:scale-[0.99] text-white font-extrabold text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-amber-500/15 transition-all cursor-pointer hover:scale-[1.01]"
              >
                <RefreshCw className="w-5 h-5 shrink-0" />
                {lang === 'kz' ? 'Есептеу' : lang === 'ru' ? 'Рассчитать параметры' : 'Calculate Parameters'}
              </button>
            </div>

          </div>

          {/* Guidelines notes */}
          <div className="pt-6 flex items-start gap-4 text-blue-100 text-xs leading-relaxed font-normal">
            <InfoIcon className="w-5 h-5 text-amber-300 shrink-0" />
            <p className="flex-1">{currentLoc.density_info}</p>
          </div>

        </div>

        {/* Right Side Instant High-contrast Results Panel */}
        <div className="lg:col-span-5 bg-slate-900 text-white p-6 sm:p-9 rounded-[2.5rem] flex flex-col justify-between hover:shadow-2xl transition-all relative overflow-hidden h-full min-h-[440px]">
           <div className="absolute right-0 top-0 w-80 h-80 bg-slate-800/10 rounded-full blur-3xl -z-10"></div>
           <div className="absolute left-[#20px] bottom-[#20px] w-60 h-60 bg-blue-900/10 rounded-full blur-2xl -z-10"></div>
           
           <div className="space-y-6">
              <div className="flex justify-between items-center">
                <span className="bg-slate-950 text-amber-400 px-3.5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 border border-slate-800/50">
                  <Layers className="w-3.5 h-3.5" /> {currentLoc.results_title}
                </span>
                <span className="text-[10px] font-mono text-slate-500">SmartME Engine</span>
              </div>

              {/* Outputs display parameters */}
              <div className="space-y-8 py-2">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{currentLoc.mass_tons}</p>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-4xl sm:text-5xl font-extrabold tracking-tight text-amber-400 font-mono">
                      {results.massTons.toLocaleString(undefined, { minimumFractionDigits: 3, maximumFractionDigits: 3 })}
                    </span>
                    <span className="text-base text-slate-400 font-semibold">{currentLoc.unit_tons}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 border-t border-b border-white/5 py-4">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block flex items-center gap-1.5">
                      <Scale className="w-3.5 h-3.5 text-blue-450" /> КӨЛЕМ
                    </span>
                    <strong className="text-xl font-bold font-mono text-white">
                      {volume.toLocaleString('kk-KZ')}
                    </strong>
                    <span className="text-slate-450 text-xs font-semibold ml-1">Литер (л)</span>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block flex items-center gap-1.5">
                      <Fuel className="w-3.5 h-3.5 text-purple-400" /> ТЫҒЫЗДЫҚ
                    </span>
                    <strong className="text-xl font-bold font-mono text-white">
                      {density.toFixed(4)}
                    </strong>
                    <span className="text-slate-505 text-xs font-semibold ml-1">г/см³</span>
                  </div>
                </div>

                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{currentLoc.cost_val}</p>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-3xl sm:text-4xl font-black font-mono text-emerald-400">
                      {Math.round(results.costKzt).toLocaleString('kk-KZ')}
                    </span>
                    <span className="text-base text-slate-400 font-semibold">₸</span>
                  </div>
                </div>
              </div>
           </div>

           {/* Core Physical Formulas */}
           <div className="mt-6 pt-4 border-t border-white/5 space-y-4">
              <div className="space-y-3">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500 block">
                  {lang === 'kz' ? 'Есептеулердің толық математикалық қадамдары:' : lang === 'ru' ? 'Полные математические шаги расчета:' : 'Complete Mathematical Steps of Evaluation:'}
                </span>
                
                <div className="space-y-3 text-xs text-slate-300 font-sans">
                  {/* Step 1: Mass Math */}
                  <div className="p-3.5 bg-white/5 border border-white/5 rounded-2xl space-y-2">
                    <div className="flex justify-between items-center text-[10px] font-bold text-amber-400 uppercase tracking-wider border-b border-white/5 pb-1.5">
                      <span>{lang === 'kz' ? '1. Массаны есептеу' : lang === 'ru' ? '1. Расчет массы' : '1. Evaluate mass'}</span>
                      <span className="font-mono text-slate-500">m = V × ρ / 1000</span>
                    </div>
                    <div className="font-mono text-[11px] leading-relaxed text-slate-400">
                      <div className="text-white font-medium">
                        {volume.toLocaleString('kk-KZ')} л × {density.toFixed(4)} г/см³ ÷ 1000 = <strong className="text-amber-400">{results.massTons.toFixed(3)} тн</strong>
                      </div>
                    </div>
                  </div>

                  {/* Step 2: Total Cost Math */}
                  <div className="p-3.5 bg-white/5 border border-white/5 rounded-2xl space-y-2">
                    <div className="flex justify-between items-center text-[10px] font-bold text-emerald-400 uppercase tracking-wider border-b border-white/5 pb-1.5">
                      <span>{lang === 'kz' ? '2. Қаржылық есеп (Құны)' : lang === 'ru' ? '2. Расчет стоимости' : '2. Transaction cost'}</span>
                      <span className="font-mono text-slate-500">Cost = m × Price</span>
                    </div>
                    <div className="font-mono text-[11px] leading-relaxed text-slate-400 font-semibold">
                      <div className="text-white">
                        {results.massTons.toFixed(3)} тн × {pricePerUnit.toLocaleString('kk-KZ')} ₸/тн = <strong className="text-emerald-400">{Math.round(results.costKzt).toLocaleString('kk-KZ')} ₸</strong>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Tools */}
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleCopy}
                  className="flex-1 h-12 rounded-full bg-linear-to-r from-blue-600 to-indigo-750 hover:from-blue-500 hover:to-indigo-600 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer hover:shadow-lg"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  {copied ? currentLoc.copied_msg : currentLoc.copy_btn}
                </button>
              </div>
           </div>
        </div>

      </div>

      {/* Beautiful Current Fuel Prices Directory Catalog - Tab filter categories */}
      <div className="bg-[#245dff] p-6 sm:p-9 rounded-[2.5rem] border border-blue-400/20 shadow-xl shadow-blue-650/20 text-white space-y-6 mt-8 w-full">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-white/10">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-widest text-amber-300 block font-mono">
              {lang === 'kz' ? 'БАРЛЫҚ МЕНЕДЖЕРЛІК БАҒАЛАР • ТЕҢГЕ/ТОННА' : lang === 'ru' ? 'СИСТЕМА СРАВНЕНИЯ ЦЕН • ТЕНГЕ/ТОННА' : 'ROLE PRICES CATALOUGE • T/TON'}
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white flex items-center gap-2 mt-1">
              <Coins className="w-6 h-6 text-amber-300" />
              {lang === 'kz' ? 'Баға менеджменті мен ресми индекстер каталогы' : lang === 'ru' ? 'Каталог управляемых цен и официальных индексов' : 'Wholesale Prices & Official Indices Directory'}
            </h2>
            <p className="text-xs text-blue-105 mt-1">
              {lang === 'kz' 
                ? 'Халықаралық Сингапур биржасы, Argus Media агенттігінің индекстерімен бірге компанияның ресми көтерме және бөлшек бағалары. Өлшем бірлігі: Тонна' 
                : lang === 'ru' 
                ? 'Котировки Сингапурской биржи, индексы Argus Media, официальные оптовые и розничные прайсы компании в формате Тенге/Тонна.' 
                : 'International exchange indices, Argus data, corporate wholesale & retail rates cataloged strictly in KZT/Ton format.'}
            </p>
          </div>
          <span className="shrink-0 px-3.5 py-1.5 rounded-full text-[10px] font-extrabold uppercase tracking-widest bg-amber-400/20 text-amber-200 border border-amber-400/10">
            {lang === 'kz' ? 'БЕЛСЕНДІ ЖҮЙЕ' : lang === 'ru' ? 'АКТИВНАЯ' : 'SYSTEM LIVE'}
          </span>
         </div>
  
         {/* Category Select Tab bar */}
         <div className="space-y-4">
           <div className="space-y-2">
             <span className="text-xs font-bold text-blue-100 uppercase tracking-wider block">
               {lang === 'kz' ? 'Баға санаты бойынша сүзгілеу:' : lang === 'ru' ? 'Фильтровать по категории:' : 'Filter Price Category:'}
             </span>
             <div className="flex flex-wrap gap-1.5 bg-blue-800/40 p-1.5 rounded-2xl border border-blue-400/20">
               {([
                 { key: 'all', labelKz: 'Барлығы', labelRu: 'Все', labelEn: 'All' },
                 { key: 'singapore', labelKz: 'Singapore', labelRu: 'Singapore', labelEn: 'Singapore' },
                 { key: 'argus', labelKz: 'Argus Price', labelRu: 'Argus Price', labelEn: 'Argus Price' },
                 { key: 'smartme', labelKz: 'SmartME', labelRu: 'SmartME', labelEn: 'SmartME' }
               ] as const).map((tab) => (
                 <button
                   key={tab.key}
                   type="button"
                   onClick={() => setActiveCategoryTab(tab.key)}
                   className={`flex-1 min-w-[120px] px-3.5 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer text-center ${
                     activeCategoryTab === tab.key
                       ? 'bg-white text-blue-700 shadow-md'
                       : 'text-blue-100 hover:text-white bg-transparent'
                   }`}
                 >
                   {lang === 'kz' ? tab.labelKz : lang === 'ru' ? tab.labelRu : tab.labelEn}
                 </button>
               ))}
             </div>
           </div>

           {/* Retail | Wholesale Toggle Switch - Show only for smartme filter tab */}
           {activeCategoryTab === 'smartme' && (
             <div className="flex justify-center items-center py-4 bg-blue-800/20 rounded-2xl border border-blue-400/10 animate-fade-in gap-4">
               <span className="text-xs font-bold text-blue-100 uppercase tracking-wider">
                 {lang === 'kz' ? 'Баға түрі:' : lang === 'ru' ? 'Тип цены:' : 'Price Type:'}
               </span>
               <div className="flex bg-blue-950/60 p-1 rounded-xl border border-blue-400/20">
                 <button
                   type="button"
                   onClick={() => setSmartMeSubFilter('retail')}
                   className={`px-4 py-2 rounded-lg text-xs font-extrabold transition-all cursor-pointer ${
                     smartMeSubFilter === 'retail'
                       ? 'bg-amber-400 text-slate-950 shadow'
                       : 'text-blue-100 hover:text-white'
                   }`}
                 >
                   {lang === 'kz' ? 'Бөлшек (Retail)' : lang === 'ru' ? 'Розница (Retail)' : 'Retail'}
                 </button>
                 <button
                   type="button"
                   onClick={() => setSmartMeSubFilter('wholesale')}
                   className={`px-4 py-2 rounded-lg text-xs font-extrabold transition-all cursor-pointer ${
                     smartMeSubFilter === 'wholesale'
                       ? 'bg-amber-400 text-slate-950 shadow'
                       : 'text-blue-100 hover:text-white'
                   }`}
                 >
                   {lang === 'kz' ? 'Көтерме (Wholesale)' : lang === 'ru' ? 'Опт (Wholesale)' : 'Wholesale'}
                 </button>
               </div>
             </div>
           )}
         </div>
  
         {/* Price metrics responsive Grid Sheet with Admin Edit Features enabled */}
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
            {filteredPrices.length === 0 ? (
              <div className="col-span-full text-center py-12 text-sm text-blue-200">
                {lang === 'kz' ? 'Бұл санатта ешқандай баға көрсеткіші тіркелмеген.' : lang === 'ru' ? 'В этой категории котировки отсутствуют.' : 'No price records found in this category.'}
              </div>
            ) : (
              filteredPrices.map((item) => {
                const isEditing = editingPriceId === item.id;
                const badgeColors = 
                  item.category === 'singapore' ? 'bg-amber-450/20 text-amber-300 border-amber-450/10' :
                  item.category === 'argus' ? 'bg-indigo-400/20 text-indigo-300 border-indigo-400/10' :
                  item.category === 'smartme' ? 'bg-[#ff9f00]/20 text-amber-200 border-[#ff9f00]/10' :
                  'bg-rose-450/20 text-rose-305 border-rose-450/10';

                const categoryLabel = 
                  item.category === 'singapore' ? 'Singapore' :
                  item.category === 'argus' ? 'Argus Price' :
                  item.category === 'smartme' ? 'SmartME' :
                  item.category;

                const activePrice = item.category === 'smartme' 
                  ? (smartMeSubFilter === 'retail' ? item.priceRetail : item.priceWholesale)
                  : item.priceRetail;

                return (
                  <div 
                    key={item.id} 
                    className="p-5 sm:p-6 rounded-3xl bg-[#1d52e5] border border-blue-400/20 hover:border-white/40 hover:bg-blue-700/30 transition-all flex flex-col justify-between space-y-4 relative overflow-hidden"
                  >
                    <div className="space-y-3">
                      <div className="flex justify-between items-start gap-2">
                        <span className={`px-2.5 py-1 text-[9px] uppercase tracking-wider rounded-lg font-black border uppercase ${badgeColors}`}>
                          {categoryLabel}
                        </span>
                        {isEditing ? (
                          <div className="w-1/2">
                            <input
                              type="text"
                              value={editStandard}
                              onChange={(e) => setEditStandard(e.target.value)}
                              placeholder="Стандарт (К-5, т.б.)"
                              className="w-full px-1.5 py-0.5 text-[10px] bg-slate-900 border border-blue-400/50 rounded font-mono text-blue-200 focus:outline-none text-right text-white"
                            />
                          </div>
                        ) : (
                          item.standard && (
                            <span className="text-[10px] text-blue-200 font-mono italic">
                              {item.standard}
                            </span>
                          )
                        )}
                      </div>

                      {isEditing ? (
                        <div className="space-y-2 mt-1 text-left">
                          <div className="space-y-0.5">
                            <span className="text-[9px] font-bold text-blue-200 uppercase tracking-widest block">Өнім атауы:</span>
                            <input
                              type="text"
                              value={editName}
                              onChange={(e) => setEditName(e.target.value)}
                              className="w-full px-2 py-1 text-xs bg-slate-900 border border-blue-400/50 rounded font-bold text-white focus:outline-none"
                            />
                          </div>
                          <div className="space-y-0.5">
                            <span className="text-[9px] font-bold text-blue-200 uppercase tracking-widest block">Сипаттамасы (астындағы кішкентай жазу):</span>
                            <textarea
                              value={editDescription}
                              onChange={(e) => setEditDescription(e.target.value)}
                              rows={2}
                              className="w-full px-2 py-1 text-xs bg-slate-900 border border-blue-400/50 rounded text-slate-250 focus:outline-none resize-none text-white"
                            />
                          </div>
                        </div>
                      ) : (
                        <>
                          <h3 className="font-bold text-white text-base leading-snug">
                            {item.name}
                          </h3>
                          {(item.category === 'singapore' || item.category === 'argus') && (
                            <div className="text-[10px] font-extrabold text-amber-300 uppercase tracking-widest mt-1">
                              ИНДЕКС ТАРИФІ
                            </div>
                          )}
                          <p className="text-slate-200 text-xs leading-relaxed font-normal">
                            {item.description}
                          </p>
                        </>
                      )}
                    </div>

                    {/* Price Display and Quick Editing container */}
                    <div className="border-t border-blue-400/20 pt-4 flex items-center justify-between gap-2.5">
                      <div className="flex flex-col text-left w-full">
                        <span className="text-[9px] font-bold uppercase tracking-wider text-blue-200">
                          {priceDisplayUnit === 'ton' ? 'Баға көрсеткіші (тн)' : 'Баға көрсеткіші (литр)'}
                        </span>
                        
                        {isEditing ? (
                          <div className="flex flex-col gap-2 mt-2 w-full">
                            {item.category === 'smartme' ? (
                              <div className="space-y-1.5">
                                <div className="flex items-center gap-2">
                                  <span className="text-[10px] uppercase font-extrabold text-blue-200 w-16 text-right shrink-0">Бөлшек:</span>
                                  <input
                                    type="number"
                                    value={editPriceRetail}
                                    onChange={(e) => setEditPriceRetail(e.target.value)}
                                    className="flex-1 px-2 py-1 text-xs bg-slate-900 border border-blue-400/50 rounded font-bold text-amber-300 focus:outline-none"
                                  />
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="text-[10px] uppercase font-extrabold text-blue-200 w-16 text-right shrink-0">Көтерме:</span>
                                  <input
                                    type="number"
                                    value={editPriceWholesale}
                                    onChange={(e) => setEditPriceWholesale(e.target.value)}
                                    className="flex-1 px-2 py-1 text-xs bg-slate-900 border border-blue-400/50 rounded font-bold text-amber-300 focus:outline-none"
                                  />
                                </div>
                              </div>
                            ) : (
                              <div className="flex items-center gap-2">
                                <span className="text-[10px] uppercase font-extrabold text-blue-200 shrink-0">Бағасы:</span>
                                <input
                                  type="number"
                                  value={editPriceRetail}
                                  onChange={(e) => setEditPriceRetail(e.target.value)}
                                  className="w-full px-2 py-1 text-xs bg-slate-900 border border-blue-400/50 rounded font-bold text-amber-300 focus:outline-none"
                                  autoFocus
                                 />
                              </div>
                            )}
                            <div className="flex gap-1.5 mt-2 justify-end">
                              <button
                                type="button"
                                onClick={() => saveEditedPrice(item.id, item.category)}
                                title="Сақтау"
                                className="p-1 px-2.5 bg-emerald-500 hover:bg-emerald-600 rounded text-slate-950 font-bold text-[10px] transition cursor-pointer flex items-center gap-1"
                              >
                                <Save className="w-3.5 h-3.5" />
                                <span>Сақтау</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => setEditingPriceId(null)}
                                title="Күшін жою"
                                className="p-1 px-2.5 bg-rose-500 hover:bg-rose-600 rounded text-white transition cursor-pointer flex items-center gap-1"
                              >
                                <X className="w-3.5 h-3.5" />
                                <span>Болдырмау</span>
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex flex-col">
                            <div className="flex items-baseline gap-1.5 mt-1">
                              <strong className="text-xl font-extrabold font-mono text-amber-300">
                                {getConvertedPrice(activePrice, item.name).value.toLocaleString('kk-KZ')}
                              </strong>
                              <span className="text-xs font-semibold text-blue-200">
                                {getConvertedPrice(activePrice, item.name).unit}
                              </span>
                            </div>
                            {item.category === 'smartme' && (
                              <div className="text-[10px] font-medium text-slate-200 italic mt-1">
                                {smartMeSubFilter === 'retail'
                                  ? `Көтерме тариф: ${getConvertedPrice(item.priceWholesale, item.name).value.toLocaleString('kk-KZ')} ${getConvertedPrice(item.priceWholesale, item.name).unit}`
                                  : `Бөлшек тариф: ${getConvertedPrice(item.priceRetail, item.name).value.toLocaleString('kk-KZ')} ${getConvertedPrice(item.priceRetail, item.name).unit}`}
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      {/* ADMIN ONLY Edit cell trigger */}
                      {role === 'admin' && !isEditing && (
                        <button
                          type="button"
                          onClick={() => startEditing(item)}
                          className="flex items-center gap-1 text-[10px] font-extrabold bg-[#1d52e5] hover:bg-white hover:text-blue-700 hover:shadow-md transition-all text-white py-1.5 px-3 rounded-lg border border-blue-400/40 cursor-pointer shrink-0"
                        >
                          <Edit2 className="w-3 h-3" />
                          {lang === 'kz' ? 'Өзгерту' : lang === 'ru' ? 'Изменить' : 'Edit'}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div><div className="pt-4 border-t border-white/5 flex items-center gap-2.5 text-xs text-blue-200">
           <Info className="w-4 h-4 text-amber-300" />
           <p>
             {lang === 'kz' 
               ? 'Нұсқаулық: Осы бетте әкімші рөлімен бағаларды өзгерту оларды барлық басқа пайдаланушы беттерінде нақты уақытта автоматты түрде өзгертеді.' 
               : 'Инструкция: Изменение котировок в административном режиме моментально отразится во всей системе.'}
           </p>
         </div>
      </div>
      </>
      )}
    </div>
  );
}
