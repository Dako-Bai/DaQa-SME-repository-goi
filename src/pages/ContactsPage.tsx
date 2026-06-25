import React from 'react';
import CompanyHub from '../components/CompanyHub';
import CompanyManagement from '../components/CompanyManagement';
import { useAppContext } from '../contexts/AppContext';
import { ShieldCheck, MapPin, Building2 } from 'lucide-react';

const contentLocal = {
  kz: {
    about_title: 'Компания жайлы',
    about_subtitle: 'Мұнай өнімдері мен авиаотын нарығындағы сенімді және технологиялық серіктес',
    about_desc: '«Smart Mercury Energy» — Қазақстанның энергетикалық және логистикалық секторында кешенді инфрақұрылымы бар, сенімді және серпінді дамып келе жатқан жетекші компаниялардың бірі. Біздің басты мақсатымыз – мұнай өнімдері мен авиациялық отынды JIG-2 халықаралық стандарттары бойынша қабылдау, сақтау, заманауи сараптамалық бақылаудан өткізу, жөнелту және тасымалдау кәсіпорындарын басқару.',
    
    // Stats labels
    stat_vol: 'Сыйымдылық',
    stat_volumes: '19 000 м³',
    stat_tanks_label: 'Резервуарлар',
    stat_tanks: '13 резервуар',
    stat_launch_label: 'Іске қосылуы',
    stat_launch: '2018 жыл',
    stat_dist_label: 'Әуежайға дейін',
    stat_dist: '6 км қашықтық',
    
    // Location label
    loc_title: 'Орналасуы мен ақпараттары',
    loc_address: 'Қазақстан, Алматы қаласы, Түрксіб ауданы, Свободная көшесі, 136/2',
  },
  ru: {
    about_title: 'О компании',
    about_subtitle: 'Надежный и технологичный партнер на рынке нефтепродуктов и авиатоплива',
    about_desc: '«Smart Mercury Energy» — одна из ведущих, стабильно развивающихся компаний в энергетическом и логистическом секторе Казахстана. Наша деятельность сосредоточена на безопасном приеме, хранении, многоступенчатом лабораторном контроле качества, высокотехнологичной перевалке и поставке светлых нефтепродуктов и сертифицированного авиакеросина в соответствии с JIG-2.',
    
    // Stats labels
    stat_vol: 'Объем парка',
    stat_volumes: '19 000 м³',
    stat_tanks_label: 'Резервуары',
    stat_tanks: '13 резервуаров',
    stat_launch_label: 'Год запуска',
    stat_launch: '2018 год',
    stat_dist_label: 'До аэропорта',
    stat_dist: '6 км пути',

    // Location label
    loc_title: 'Местоположение и информация',
    loc_address: 'Казахстан, г. Алматы, Турксибский район, ул. Свободная, 136/2',
  },
  en: {
    about_title: 'About Company',
    about_subtitle: 'A reliable and advanced partner in the petroleum and jet fuel logistics sector',
    about_desc: 'Smart Mercury Energy is one of the leading, sustainably growing companies in the energy and logistics sector of Kazakhstan. Our core activities center on the secure receipt, bulk storage, multi-stage laboratory analysis, global JIG-2 standard compliant handling, and shipping of commercial transport fuels and certified aviation kerosene.',
    
    // Stats labels
    stat_vol: 'Total Storage',
    stat_volumes: '19,000 m³',
    stat_tanks_label: 'Tanks Count',
    stat_tanks: '13 reservoirs',
    stat_launch_label: 'Launched In',
    stat_launch: 'Year 2018',
    stat_dist_label: 'To Airport',
    stat_dist: '6 km distance',

    // Location label
    loc_title: 'Coordinates & Information',
    loc_address: '136/2 Svobodnaya Street, Turksibsky District, Almaty, Kazakhstan',
  }
};

export default function ContactsPage() {
  const { lang } = useAppContext();
  const text = contentLocal[lang as 'kz' | 'ru' | 'en'] || contentLocal.kz;

  return (
    <div className="pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-16 animate-fade-in text-slate-100">
      
      {/* 1. Brand New Aesthetic "About Company" Section (Blue Themed, with Location and Image) */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch relative z-10">
        
        {/* Left Col: Info & Location Panel */}
        <div className="lg:col-span-7 flex flex-col justify-between p-6 sm:p-8 rounded-[2rem] bg-[#121f3d]/90 border border-blue-400/15 shadow-xl backdrop-blur-md">
          <div className="space-y-4">
            <span className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest bg-blue-500/20 text-blue-300 border border-blue-500/25 inline-block">
              {text.about_title}
            </span>
            <h2 className="text-2xl sm:text-3.5xl font-extrabold text-white tracking-tight leading-tight font-sans">
              Smart Mercury Energy
            </h2>
            <p className="text-xs sm:text-sm text-blue-200 font-medium leading-relaxed font-sans -mt-1">
              {text.about_subtitle}
            </p>
            <p className="text-xs sm:text-[13px] text-slate-300 leading-relaxed font-normal pt-2">
              {text.about_desc}
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-blue-900/40 space-y-4">
            <h4 className="text-[11px] font-bold text-blue-300 uppercase tracking-widest flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-blue-400" />
              {text.loc_title}
            </h4>
            <div className="p-3.5 rounded-2xl bg-[#0b1329]/60 border border-blue-400/10 flex items-start gap-3">
              <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 shrink-0 mt-0.5">
                <Building2 className="w-4 h-4" />
              </div>
              <p className="text-xs text-slate-300 font-sans leading-relaxed">
                {text.loc_address}
              </p>
            </div>
          </div>
        </div>

        {/* Right Col: Full-Height Aesthetic Image & Stats Panel */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
          
          {/* Main Rounded Image */}
          <div className="flex-1 min-h-[220px] rounded-[2rem] overflow-hidden border border-blue-400/15 relative group shadow-xl">
            <img 
              src="/src/assets/images/almaty_oil_depot_aerial_1781524403784.jpg" 
              alt="Mercury Energy Terminal"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-blue-950/70 via-transparent to-transparent pointer-events-none" />
            <div className="absolute bottom-4 left-4 flex items-center gap-1.5 bg-blue-950/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-blue-500/20 text-[10px] text-white">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-400" /> JIG-2 Certified Facilities
            </div>
          </div>

          {/* Core Corporate Stats Block (Exactly matches screenshot description) */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-[#121f3d]/60 border border-blue-400/10 flex flex-col justify-between">
              <span className="text-[10px] text-blue-300 font-bold uppercase tracking-wider">{text.stat_vol}</span>
              <span className="text-lg font-black font-sans text-amber-300 mt-1">{text.stat_volumes}</span>
            </div>
            <div className="p-4 rounded-2xl bg-[#121f3d]/60 border border-blue-400/10 flex flex-col justify-between">
              <span className="text-[10px] text-blue-300 font-bold uppercase tracking-wider">{text.stat_tanks_label}</span>
              <span className="text-lg font-black font-sans text-white mt-1">{text.stat_tanks}</span>
            </div>
            <div className="p-4 rounded-2xl bg-[#121f3d]/60 border border-blue-400/10 flex flex-col justify-between">
              <span className="text-[10px] text-blue-300 font-bold uppercase tracking-wider">{text.stat_launch_label}</span>
              <span className="text-lg font-black font-sans text-white mt-1">{text.stat_launch}</span>
            </div>
            <div className="p-4 rounded-2xl bg-[#121f3d]/60 border border-blue-400/10 flex flex-col justify-between">
              <span className="text-[10px] text-blue-300 font-bold uppercase tracking-wider">{text.stat_dist_label}</span>
              <span className="text-[13px] font-black font-sans text-blue-200 mt-1">{text.stat_dist}</span>
            </div>
          </div>

        </div>

      </section>

      {/* 2. Executive Management Board (Deep royal blue border & background) */}
      <section className="p-1 sm:p-6 rounded-3xl bg-[#121f3d]/90 border border-blue-400/15 shadow-xl text-white">
        <CompanyManagement />
      </section>

      {/* 3. Official Addresses and Direct Intercom Feedback form (using CompanyHub in blue) */}
      <section className="space-y-4">
        <div className="border border-blue-400/15 p-1.5 sm:p-5 rounded-3xl bg-[#121f3d]/40 shadow-xl shadow-blue-950/25 backdrop-blur-md">
          <CompanyHub />
        </div>
      </section>

    </div>
  );
}
