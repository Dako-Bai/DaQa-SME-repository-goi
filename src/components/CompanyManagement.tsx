import React, { useState } from 'react';
import { Award, FlaskConical, CircleUser, Mail, ArrowRight, X, ShieldCheck } from 'lucide-react';
import { useAppContext } from '../contexts/AppContext';

export default function CompanyManagement() {
  const { lang, leadersList } = useAppContext();
  const [selectedLeader, setSelectedLeader] = useState<number | null>(null);

  const iconMap: Record<string, any> = {
    CircleUser: CircleUser,
    Award: Award,
    FlaskConical: FlaskConical,
  };

  const leaders = leadersList || [];

  return (
    <div id="company-management-container" className="bg-[#245dff] border border-blue-400/20 rounded-[32px] p-6 sm:p-8 space-y-6 shadow-xl shadow-blue-650/20 text-white">
      
      {/* Minimalist Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-4 border-b border-white/10">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-widest text-amber-200 font-mono">
            {lang === 'kz' ? 'Ғылыми жетекшілік' : lang === 'ru' ? 'Научное руководство' : 'Scientific Leadership'}
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-tight">
            {lang === 'kz' ? 'Ресми және кәсіби басшылық құрамы' : lang === 'ru' ? 'Руководящий состав' : 'Expert Governance'}
          </h2>
        </div>
      </div>

      {/* Grid of Executive Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {leaders.map((leader, i) => {
          const IconComponent = iconMap[leader.iconName] || CircleUser;
          return (
            <div 
              key={leader.id || i}
              onClick={() => setSelectedLeader(i)}
              className="bg-[#1d52e5] hover:bg-blue-700/40 p-4 rounded-2xl flex items-center gap-3.5 transition-all cursor-pointer group relative border border-blue-400/30 hover:border-white/35 text-white"
            >
              <div className="relative shrink-0">
                {leader.imageUrl ? (
                  <img 
                    src={leader.imageUrl} 
                    alt={leader.name?.[lang as 'kz' | 'ru' | 'en'] || leader.name?.kz || ''} 
                    className="w-12 h-12 rounded-xl object-cover border border-blue-300/20 group-hover:scale-102 transition-transform"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-xl bg-blue-800 flex items-center justify-center text-white font-bold text-lg border border-blue-350">
                    {leader.name?.kz ? leader.name.kz.substring(0, 2) : 'ME'}
                  </div>
                )}
                <div className={`absolute -bottom-1 -right-1 w-4.5 h-4.5 rounded-lg ${leader.color || 'bg-blue-600'} flex items-center justify-center text-white scale-90 border border-white/10`}>
                  <IconComponent className="w-2.5 h-2.5" />
                </div>
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-bold text-xs sm:text-sm text-white group-hover:text-amber-200 transition-colors leading-tight truncate">
                  {leader.name?.[lang as 'kz' | 'ru' | 'en'] || leader.name?.kz || leader.name?.ru || leader.name?.en || ''}
                </h3>
                <p className="text-[11px] text-blue-100 leading-tight mt-0.5 truncate bg-[#1746c8]/50 rounded px-1.5 py-0.5 inline-block max-w-full">
                  {leader.title?.[lang as 'kz' | 'ru' | 'en'] || leader.title?.kz || leader.title?.ru || leader.title?.en || ''}
                </p>
                <span className="text-[9px] uppercase font-black tracking-wider text-amber-300 group-hover:text-amber-200 mt-1 block">
                  {lang === 'kz' ? 'Деректерді көру →' : lang === 'ru' ? 'Подробнее →' : 'View Profile →'}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Simple Information Modal Dialog */}
      {selectedLeader !== null && leaders[selectedLeader] && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md">
          <div className="bg-gradient-to-b from-[#1d52e5] to-[#123bbe] border border-blue-300/40 rounded-[32px] max-w-4xl w-full p-6 sm:p-9 space-y-6 shadow-2xl relative text-white animate-in fade-in zoom-in-95 duration-150 max-h-[92vh] overflow-y-auto scrollbar-thin">
            
            {/* Close button */}
            <button 
              onClick={() => setSelectedLeader(null)}
              className="absolute top-6 right-6 text-blue-100 hover:text-white bg-blue-900/60 hover:bg-blue-800 p-2.5 rounded-xl border border-blue-400/20 transition cursor-pointer z-10"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
 
            {/* Split Grid for Massive Portrait & Executive Details */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8 items-start pt-2">
              
              {/* Massive Crisp High-Resolution Portrait */}
              <div className="md:col-span-5 relative rounded-[24px] overflow-hidden border border-blue-300/25 bg-blue-950/40 shadow-xl hover:shadow-2xl transition-all duration-300 md:self-stretch group aspect-[4/3] md:aspect-auto w-full min-h-[280px]">
                {leaders[selectedLeader].imageUrl ? (
                  <img 
                    src={leaders[selectedLeader].imageUrl} 
                    alt={leaders[selectedLeader].name?.[lang as 'kz' | 'ru' | 'en'] || leaders[selectedLeader].name?.kz || ''} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-full h-full min-h-[280px] bg-blue-900 flex items-center justify-center text-white font-bold text-4xl">
                    {leaders[selectedLeader].name?.kz ? leaders[selectedLeader].name.kz.substring(0, 2) : 'ME'}
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-blue-950/40 to-transparent pointer-events-none" />
              </div>
 
              {/* Robust Bio & Governance Achievements */}
              <div className="md:col-span-7 space-y-5">
                <div className="space-y-1.5 pb-3.5 border-b border-blue-400/20">
                  <span className="inline-block px-3 py-1 font-black uppercase tracking-widest text-[#fbbf24] bg-amber-400/10 rounded-md border border-amber-400/15 text-[10px] font-mono">
                    {leaders[selectedLeader].sub?.[lang as 'kz' | 'ru' | 'en'] || leaders[selectedLeader].sub?.kz || ''}
                  </span>
                  <h3 className="text-xl sm:text-2.5xl font-black text-white leading-tight tracking-tight">
                    {leaders[selectedLeader].name?.[lang as 'kz' | 'ru' | 'en'] || leaders[selectedLeader].name?.kz || ''}
                  </h3>
                  <p className="text-xs sm:text-sm text-blue-200 font-medium">
                    {leaders[selectedLeader].title?.[lang as 'kz' | 'ru' | 'en'] || leaders[selectedLeader].title?.kz || ''}
                  </p>
                </div>
 
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold text-amber-200 uppercase tracking-widest block font-mono">
                    {lang === 'kz' ? 'Еңбек жолы мен баяндама' : lang === 'ru' ? 'Биография и квалификация' : 'Professional Profile & Achievements'}
                  </span>
                  <div className="bg-blue-950/20 p-5 rounded-[20px] border border-blue-400/10">
                    <p className="text-xs sm:text-sm text-blue-50 leading-relaxed whitespace-pre-wrap font-normal">
                      {leaders[selectedLeader].bio?.[lang as 'kz' | 'ru' | 'en'] || leaders[selectedLeader].bio?.kz || ''}
                    </p>
                  </div>
                </div>
 
                {/* Stats & Contacts block */}
                <div className="pt-4 flex flex-wrap justify-between items-center gap-4 border-t border-blue-400/20 text-xs text-blue-100">
                  <div className="flex gap-6">
                    {leaders[selectedLeader].specs?.map((spec: any, index: number) => (
                      <div key={index} className="space-y-0.5">
                        <span className="text-[9px] text-blue-300 block font-bold uppercase tracking-wider">{spec.label?.[lang as 'kz' | 'ru' | 'en'] || spec.label?.kz || ''}</span>
                        <span className="font-mono font-bold text-white text-sm">{spec.value}</span>
                      </div>
                    ))}
                  </div>
                  {leaders[selectedLeader].email && (
                    <div className="bg-[#1746c8]/50 px-4 py-2 rounded-xl border border-blue-400/10">
                      <span className="text-[9px] text-blue-300 block font-bold uppercase tracking-wider">Email</span>
                      <a href={`mailto:${leaders[selectedLeader].email}`} className="font-mono text-xs text-amber-300 font-bold hover:underline">
                        {leaders[selectedLeader].email}
                      </a>
                    </div>
                  )}
                </div>
 
              </div>
 
            </div>
 
          </div>
        </div>
      )}

    </div>
  );
}
