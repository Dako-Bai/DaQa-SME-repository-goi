import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import CompanyManagement from '../components/CompanyManagement';
import NewsCarousel from '../components/NewsCarousel';
import { SpotPricesPanel } from '../components/SpotPricesPanel';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowRight, Settings, Trash, ShieldCheck, Calculator, Mail, HelpCircle, ChevronLeft, ChevronRight 
} from 'lucide-react';
import { useAppContext } from '../contexts/AppContext';

export default function Home() {
  const { 
    lang, role, t,
    spotRates, addSpotRate, updateSpotRate, deleteSpotRate,
    bannersState, regionRates
  } = useAppContext();

  const isAdmin = role === 'admin';

  // State for Region and fuel type filterable pricing board
  const [selectedRegion, setSelectedRegion] = useState<'Almaty' | 'Astana' | 'Shymkent' | 'Atyrau'>('Almaty');
  const [selectedType, setSelectedType] = useState<'all' | 'auto' | 'aviation'>('all');
  const [homeUnit, setHomeUnit] = useState<'liter' | 'ton'>('liter');

  const getDensity = (name: string) => {
    const lowerName = name.toLowerCase();
    if (lowerName.includes('92')) return 0.730;
    if (lowerName.includes('95') || lowerName.includes('98')) return 0.745;
    if (lowerName.includes('дт') || lowerName.includes('дизель') || lowerName.includes('diesel')) return 0.840;
    return 0.775;
  };

  const regionsList = [
    { key: 'Almaty', kz: 'Алматы', ru: 'Алматы', en: 'Almaty' },
    { key: 'Astana', kz: 'Астана', ru: 'Астана', en: 'Astana' },
    { key: 'Shymkent', kz: 'Шымкент', ru: 'Шымкент', en: 'Shymkent' },
    { key: 'Atyrau', kz: 'Атырау', ru: 'Атырау', en: 'Atyrau' },
  ] as const;

  const typesList = [
    { key: 'all', kz: 'Барлығы', ru: 'Все', en: 'All' },
    { key: 'auto', kz: 'Авто', ru: 'Авто', en: 'Auto' },
    { key: 'aviation', kz: 'Авиация', ru: 'Авиа', en: 'Aviation' },
  ] as const;

  // Spot rate creation state for admin panel
  const [isSpotEditorOpen, setIsSpotEditorOpen] = useState(false);
  const [newSpotName, setNewSpotName] = useState('');
  const [newSpotStandard, setNewSpotStandard] = useState('EURO-5');
  const [newSpotLabel, setNewSpotLabel] = useState('Premium');
  const [newSpotPrice, setNewSpotPrice] = useState('');

  const submitNewSpotRate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSpotName || !newSpotPrice) return;
    addSpotRate({
      name: newSpotName,
      standard: newSpotStandard,
      statusLabel: newSpotLabel,
      price: Number(newSpotPrice),
      trend: 'neutral',
      percentage: '0.0%'
    });
    setNewSpotName('');
    setNewSpotPrice('');
    setNewSpotLabel('Premium');
  };

  const activeRegionRates = regionRates[selectedRegion] || [];
  const filteredRates = activeRegionRates.filter(rate => {
    if (selectedType === 'all') return true;
    return rate.category === selectedType;
  });

  // Advanced slideshow state
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  
  const rawSlides = bannersState?.slides || [];
  const activeSlides = rawSlides.length > 0 
    ? rawSlides.filter((s: any) => s.isActive !== false) 
    : [
        {
          id: 'slide_fallback',
          titleKz: bannersState?.heroTitleKz || 'SmartME \nMercury Energy',
          titleRu: bannersState?.heroTitleRu || 'SmartME \nMercury Energy',
          titleEn: bannersState?.heroTitleEn || 'SmartME \nMercury Energy',
          descKz: bannersState?.heroDescKz || '',
          descRu: bannersState?.heroDescRu || '',
          descEn: bannersState?.heroDescEn || '',
          bgType: 'image',
          bgImage: bannersState?.heroImage || '/src/assets/images/energy_terminal_bg_1781522513129.jpg',
          bgGradient: 'from-blue-950 via-slate-900 to-indigo-950',
          overlayOpacity: 0.85,
          buttonTextKz: '',
          buttonTextRu: '',
          buttonTextEn: '',
          buttonLink: '',
          textAlign: 'left'
        }
      ];

  // Auto-play effect
  React.useEffect(() => {
    if (bannersState?.autoplay !== false && activeSlides.length > 1) {
      const intervalMs = (bannersState?.autoplaySpeed || 5) * 1000;
      const timer = setInterval(() => {
        setCurrentSlideIndex((prev) => (prev + 1) % activeSlides.length);
      }, intervalMs);
      return () => clearInterval(timer);
    }
  }, [bannersState?.autoplay, bannersState?.autoplaySpeed, activeSlides.length]);

  const activeSlide = activeSlides[currentSlideIndex] || activeSlides[0];

  const handleNextSlide = () => {
    if (activeSlides.length > 1) {
      setCurrentSlideIndex((prev) => (prev + 1) % activeSlides.length);
    }
  };

  const handlePrevSlide = () => {
    if (activeSlides.length > 1) {
      setCurrentSlideIndex((prev) => (prev - 1 + activeSlides.length) % activeSlides.length);
    }
  };

  return (
    <div className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-16 pb-24 animate-fade-in text-slate-100">
      
      {/* 1. Highly Elegant, Lightweight Corporate Hero Section */}
      <section 
        className={`grid grid-cols-1 lg:grid-cols-12 gap-8 items-center p-6 sm:p-10 rounded-[32px] relative overflow-hidden border border-blue-400/20 shadow-xl transition-all duration-700 bg-cover bg-center ${
          activeSlide.bgType === 'gradient' ? `bg-gradient-to-br ${activeSlide.bgGradient}` : ''
        }`}
        style={activeSlide.bgType === 'image' ? { backgroundImage: `url('${activeSlide.bgImage}')` } : {}}
      >
        {/* Customizable overlay to ensure perfect text readability */}
        <div 
          className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-blue-950/90 to-slate-950/50 z-0 transition-opacity duration-700"
          style={{ opacity: activeSlide.overlayOpacity !== undefined ? activeSlide.overlayOpacity : 0.85 }}
        />
        
        {/* Left Side: Dynamic slide Content & Greeting with custom alignment */}
        <div className={`lg:col-span-7 space-y-6 relative z-10 text-white ${
          activeSlide.textAlign === 'center' ? 'text-center flex flex-col items-center mx-auto' :
          activeSlide.textAlign === 'right' ? 'text-right flex flex-col items-end' : 'text-left'
        }`}>
          <div className="space-y-3 w-full">
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight font-sans whitespace-pre-line animate-fade-in">
              {lang === 'kz' ? activeSlide.titleKz : lang === 'ru' ? activeSlide.titleRu : activeSlide.titleEn}
            </h1>
          </div>
          
          <p className="text-sm sm:text-base text-blue-100/90 leading-relaxed font-normal max-w-xl animate-fade-in">
            {lang === 'kz' ? activeSlide.descKz : lang === 'ru' ? activeSlide.descRu : activeSlide.descEn}
          </p>

          {/* Action button in slide if present */}
          {(lang === 'kz' ? activeSlide.buttonTextKz : lang === 'ru' ? activeSlide.buttonTextRu : activeSlide.buttonTextEn) && (
            <div className="pt-4 animate-fade-in">
              <Link
                to={activeSlide.buttonLink || '/prices'}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-lg hover:scale-[1.02] transition-all cursor-pointer"
              >
                <span>{lang === 'kz' ? activeSlide.buttonTextKz : lang === 'ru' ? activeSlide.buttonTextRu : activeSlide.buttonTextEn}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}

          {/* Slideshow Arrow Navigation & Dot Indicators inside the slide */}
          {activeSlides.length > 1 && (
            <div className="flex items-center gap-4 pt-4 relative z-25">
              {bannersState?.showArrows !== false && (
                <div className="flex gap-2">
                  <button
                    onClick={handlePrevSlide}
                    className="p-1.5 rounded-lg bg-blue-900/40 border border-blue-400/20 hover:bg-white hover:text-slate-950 text-white transition cursor-pointer"
                    title="Алдыңғы слайд"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleNextSlide}
                    className="p-1.5 rounded-lg bg-blue-900/40 border border-blue-400/20 hover:bg-white hover:text-slate-950 text-white transition cursor-pointer"
                    title="Келесі слайд"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}

              {bannersState?.showIndicators !== false && (
                <div className="flex gap-1.5">
                  {activeSlides.map((_, sIdx) => (
                    <button
                      key={sIdx}
                      onClick={() => setCurrentSlideIndex(sIdx)}
                      className={`w-2.5 h-2.5 rounded-full transition-all cursor-pointer ${
                        currentSlideIndex === sIdx ? 'bg-amber-400 w-6' : 'bg-white/40 hover:bg-white/70'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Side: Reusable SpotPricesPanel Component */}
        <div className="lg:col-span-12 xl:col-span-5 flex flex-col justify-between space-y-4">
          <SpotPricesPanel />
          <div className="flex justify-end pr-2 pt-1">
            <Link 
              to="/prices" 
              className="text-xs font-extrabold text-amber-300 hover:text-amber-200 flex items-center gap-1.5 transition-colors tracking-wider font-sans group uppercase"
            >
              {lang === 'kz' ? 'Толығырақ' : lang === 'ru' ? 'Подробнее' : 'Details'}
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>

      {/* 2. Official Corporate Press Center Section */}
      <section className="space-y-2">
        <NewsCarousel />
      </section>

      {/* 3. Executive Board & Corporate Governance Profile */}
      <section className="space-y-2 pt-4">
        <CompanyManagement />
      </section>

      {/* Spot Prices Management Panel Modal for ADMIN ONLY */}
      <AnimatePresence>
        {isSpotEditorOpen && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="bg-gradient-to-b from-[#1d52e5] to-[#123bbe] border border-blue-300/40 rounded-[32px] p-6 sm:p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto space-y-6 shadow-2xl relative text-white scrollbar-thin"
            >
              <div className="flex justify-between items-center border-b border-blue-400/25 pb-4">
                <div>
                  <h3 className="text-base font-extrabold text-white">
                    {lang === 'kz' ? 'Көтерме бағаларды баптау' : lang === 'ru' ? 'Панель управления бағалар' : 'Corporate Price Controller'}
                  </h3>
                  <p className="text-xs text-blue-200 mt-0.5">
                    {lang === 'kz' ? 'Отынның ағымдағы ресми бағаларын өңдеңіз.' : lang === 'ru' ? 'Редактируйте оптовые отпускные цены.' : 'Modify live refinery petroleum price metrics.'}
                  </p>
                </div>
                <button 
                  onClick={() => setIsSpotEditorOpen(false)}
                  className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-blue-900/60 hover:bg-blue-800 border border-blue-400/20 transition cursor-pointer"
                >
                  {lang === 'kz' ? 'Жабу' : lang === 'ru' ? 'Закрыть' : 'Close'}
                </button>
              </div>

              {/* Items editing section */}
              <div className="space-y-3">
                {spotRates.map((rate) => (
                  <div key={rate.id} className="p-3.5 rounded-xl bg-[#1444ca]/50 border border-blue-400/20 flex items-center justify-between gap-4">
                    <div>
                      <p className="font-bold text-white text-xs">{rate.name}</p>
                      <span className="text-[9px] text-blue-200 font-mono uppercase">{rate.statusLabel || 'Standard'} • {rate.standard || 'EURO-5'}</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <input 
                        type="number"
                        value={rate.price}
                        onChange={(e) => updateSpotRate(rate.id, { price: Number(e.target.value) })}
                        className="w-20 px-2.5 py-1 text-xs text-center border border-blue-400/35 bg-[#1444ca] text-white rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-400 font-bold font-mono"
                      />
                      <span className="text-xs text-blue-200">₸/л</span>
                      <button 
                        onClick={() => deleteSpotRate(rate.id)}
                        className="p-1.5 bg-red-600/20 hover:bg-red-650 text-white rounded transition-colors cursor-pointer border border-red-500/10"
                        title="Жою"
                      >
                        <Trash className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add Spot Rate Entry Form */}
              <form onSubmit={submitNewSpotRate} className="border-t border-blue-400/25 pt-4 space-y-3">
                <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                  {lang === 'kz' ? 'Жаңа отын маркасын қосу' : lang === 'ru' ? 'Добавить марку топлива' : 'Add Wholesale Oil Grade'}
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  <input 
                    type="text"
                    required
                    placeholder={lang === 'kz' ? 'Атауы (Мыс: АИ-92)' : lang === 'ru' ? 'Название (Напр: АИ-92)' : 'Grade (e.g., AI-92)'}
                    value={newSpotName}
                    onChange={(e) => setNewSpotName(e.target.value)}
                    className="w-full text-xs px-3 py-2 bg-[#1444ca] text-white border border-blue-400/30 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-400 placeholder-blue-300 font-medium"
                  />
                  <input 
                    type="number"
                    required
                    placeholder={lang === 'kz' ? 'Бағасы (₸)' : lang === 'ru' ? 'Цена (₸)' : 'Rate (₸)'}
                    value={newSpotPrice}
                    onChange={(e) => setNewSpotPrice(e.target.value)}
                    className="w-full text-xs px-3 py-2 bg-[#1444ca] text-white border border-blue-400/30 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-400 font-mono placeholder-blue-300 font-medium"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <input 
                    type="text"
                    placeholder="Standard (EURO-5, GOST)"
                    value={newSpotStandard}
                    onChange={(e) => setNewSpotStandard(e.target.value)}
                    className="w-full text-xs px-3 py-2 bg-[#1444ca] text-white border border-blue-400/30 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-400 placeholder-blue-300 font-medium"
                  />
                  <input 
                    type="text"
                    placeholder="Status (Premium, Regular)"
                    value={newSpotLabel}
                    onChange={(e) => setNewSpotLabel(e.target.value)}
                    className="w-full text-xs px-3 py-2 bg-[#1444ca] text-white border border-blue-400/30 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-400 placeholder-blue-300 font-medium"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-900 font-extrabold text-xs uppercase tracking-wider rounded-lg transition-all cursor-pointer shadow-sm"
                >
                  {lang === 'kz' ? 'Жүйеге енгізу' : lang === 'ru' ? 'Зарегистрировать' : 'Publish Spot Rate'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
