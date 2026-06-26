import React from 'react';
import CompanyHub from '../components/CompanyHub';
import CompanyManagement from '../components/CompanyManagement';
import { useAppContext } from '../contexts/AppContext';
import { ShieldCheck, MapPin, Building2 } from 'lucide-react';

export default function ContactsPage() {
  const { lang, contactsState } = useAppContext();
  const cs = contactsState || {};

  // Resolve language-specific values dynamically
  const aboutTitle = cs[`aboutTitle${lang === 'kz' ? 'Kz' : lang === 'ru' ? 'Ru' : 'En'}`] || cs.aboutTitleKz;
  const aboutSubtitle = cs[`aboutSubtitle${lang === 'kz' ? 'Kz' : lang === 'ru' ? 'Ru' : 'En'}`] || cs.aboutSubtitleKz;
  const aboutDesc = cs[`aboutDesc${lang === 'kz' ? 'Kz' : lang === 'ru' ? 'Ru' : 'En'}`] || cs.aboutDescKz;
  
  const statVolLabel = cs[`statVol${lang === 'kz' ? 'Kz' : lang === 'ru' ? 'Ru' : 'En'}`] || cs.statVolKz;
  const statVolVal = cs.statVolValue;

  const statTanksLabel = cs[`statTanks${lang === 'kz' ? 'Kz' : lang === 'ru' ? 'Ru' : 'En'}`] || cs.statTanksKz;
  const statTanksVal = cs.statTanksValue;

  const statLaunchLabel = cs[`statLaunch${lang === 'kz' ? 'Kz' : lang === 'ru' ? 'Ru' : 'En'}`] || cs.statLaunchKz;
  const statLaunchVal = cs.statLaunchValue;

  const statDistLabel = cs[`statDist${lang === 'kz' ? 'Kz' : lang === 'ru' ? 'Ru' : 'En'}`] || cs.statDistKz;
  const statDistVal = cs.statDistValue;

  const addressLabel = lang === 'kz' ? 'Орналасуы мен ақпараттары' : lang === 'ru' ? 'Местоположение и информация' : 'Coordinates & Information';
  const addressVal = cs[`addressVal${lang === 'kz' ? 'Kz' : lang === 'ru' ? 'Ru' : 'En'}`] || cs.addressValKz;

  return (
    <div className="pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-full mx-auto space-y-16 animate-fade-in text-slate-100">
      
      {/* 1. Brand New Aesthetic "About Company" Section (Blue Themed, with Location and Image) */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch relative z-10">
        
        {/* Left Col: Info & Location Panel */}
        <div className="lg:col-span-7 flex flex-col justify-between p-6 sm:p-8 rounded-[2rem] bg-[#121f3d]/90 border border-blue-400/15 shadow-xl backdrop-blur-md">
          <div className="space-y-4">
            <span className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest bg-blue-500/20 text-blue-300 border border-blue-500/25 inline-block font-sans">
              {aboutTitle}
            </span>
            <h2 className="text-2xl sm:text-3.5xl font-black text-white tracking-tight leading-tight font-sans">
              Smart Mercury Energy
            </h2>
            <p className="text-xs sm:text-sm text-blue-200 font-medium leading-relaxed font-sans -mt-1">
              {aboutSubtitle}
            </p>
            <p className="text-xs sm:text-[13px] text-slate-300 leading-relaxed font-normal pt-2 whitespace-pre-wrap">
              {aboutDesc}
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-blue-900/40 space-y-4">
            <h4 className="text-[11px] font-bold text-blue-300 uppercase tracking-widest flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-blue-400" />
              {addressLabel}
            </h4>
            <div className="p-3.5 rounded-2xl bg-[#0b1329]/60 border border-blue-400/10 flex items-start gap-3">
              <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 shrink-0 mt-0.5">
                <Building2 className="w-4 h-4" />
              </div>
              <p className="text-xs text-slate-300 font-sans leading-relaxed">
                {addressVal}
              </p>
            </div>
          </div>
        </div>

        {/* Right Col: Full-Height Aesthetic Image & Stats Panel */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
          
          {/* Main Rounded Image */}
          <div className="flex-1 min-h-[220px] rounded-[2rem] overflow-hidden border border-blue-400/15 relative group shadow-xl">
            <img 
              src={cs.aboutImageUrl || "/src/assets/images/almaty_oil_depot_aerial_1781524403784.jpg"} 
              alt="Mercury Energy Terminal"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-blue-950/70 via-transparent to-transparent pointer-events-none" />
            <div className="absolute bottom-4 left-4 flex items-center gap-1.5 bg-blue-950/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-blue-500/20 text-[10px] text-white">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-400" /> JIG-2 Certified Facilities
            </div>
          </div>

          {/* Core Corporate Stats Block */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-[#121f3d]/60 border border-blue-400/10 flex flex-col justify-between">
              <span className="text-[10px] text-blue-300 font-bold uppercase tracking-wider leading-none">{statVolLabel}</span>
              <span className="text-lg font-black font-sans text-amber-300 mt-1.5">{statVolVal}</span>
            </div>
            <div className="p-4 rounded-2xl bg-[#121f3d]/60 border border-blue-400/10 flex flex-col justify-between">
              <span className="text-[10px] text-blue-300 font-bold uppercase tracking-wider leading-none">{statTanksLabel}</span>
              <span className="text-lg font-black font-sans text-white mt-1.5">{statTanksVal}</span>
            </div>
            <div className="p-4 rounded-2xl bg-[#121f3d]/60 border border-blue-400/10 flex flex-col justify-between">
              <span className="text-[10px] text-blue-300 font-bold uppercase tracking-wider leading-none">{statLaunchLabel}</span>
              <span className="text-lg font-black font-sans text-white mt-1.5">{statLaunchVal}</span>
            </div>
            <div className="p-4 rounded-2xl bg-[#121f3d]/60 border border-blue-400/10 flex flex-col justify-between">
              <span className="text-[10px] text-blue-300 font-bold uppercase tracking-wider leading-none">{statDistLabel}</span>
              <span className="text-[13px] font-black font-sans text-blue-200 mt-1.5">{statDistVal}</span>
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
