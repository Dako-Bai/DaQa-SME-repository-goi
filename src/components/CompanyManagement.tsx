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
    <div id="company-management-container" className="space-y-12 w-full py-8 text-white">
      
      {/* Centered Premium Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <span className="px-3 py-1 bg-blue-500/10 text-blue-300 rounded-full text-[10px] sm:text-xs font-extrabold uppercase tracking-widest border border-blue-500/15 inline-block font-mono">
          {lang === 'kz' ? 'Ғылыми жетекшілік және басшылық' : lang === 'ru' ? 'Научное руководство и управление' : 'Scientific Governance & Leadership'}
        </span>
        <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight font-sans">
          {lang === 'kz' ? 'Ресми және кәсіби басшылық құрамы' : lang === 'ru' ? 'Руководящий состав компании' : 'Executive Governance & Leadership'}
        </h2>
        <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 mx-auto rounded-full mt-2" />
      </div>

      {/* Grid of Executive Cards - Highly Elegant, Expanded Design */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {leaders.map((leader, i) => {
          const IconComponent = iconMap[leader.iconName] || CircleUser;
          return (
            <div 
              key={leader.id || i}
              onClick={() => setSelectedLeader(i)}
              className="bg-[#121f3d]/60 hover:bg-[#152a54]/80 border border-blue-400/15 hover:border-blue-400/40 p-6 sm:p-8 rounded-[2rem] flex flex-col items-center text-center transition-all duration-300 cursor-pointer group relative shadow-lg hover:shadow-2xl hover:-translate-y-1 text-white"
            >
              {/* Leader Avatar / Portrait Frame - Spacious and Aesthetic */}
              <div className="relative shrink-0 mb-5">
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden border-2 border-blue-400/20 group-hover:border-blue-400/50 transition-colors duration-300 shadow-md">
                  {leader.imageUrl ? (
                    <img 
                      src={leader.imageUrl} 
                      alt={leader.name?.[lang as 'kz' | 'ru' | 'en'] || leader.name?.kz || ''} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-full h-full bg-blue-900/60 flex items-center justify-center text-white font-bold text-2xl">
                      {leader.name?.kz ? leader.name.kz.substring(0, 2) : 'ME'}
                    </div>
                  )}
                </div>
                <div className={`absolute -bottom-1 -right-1 w-6.5 h-6.5 rounded-lg ${leader.color || 'bg-blue-600'} flex items-center justify-center text-white scale-100 border border-white/10 shadow`}>
                  <IconComponent className="w-3.5 h-3.5" />
                </div>
              </div>

              {/* Leader Info block */}
              <div className="w-full space-y-3 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-extrabold text-base sm:text-lg text-white group-hover:text-amber-300 transition-colors leading-tight">
                    {leader.name?.[lang as 'kz' | 'ru' | 'en'] || leader.name?.kz || leader.name?.ru || leader.name?.en || ''}
                  </h3>
                  <p className="text-xs text-blue-200 leading-snug mt-2 px-3 py-1 bg-blue-950/40 border border-blue-500/10 rounded-full inline-block max-w-full truncate">
                    {leader.title?.[lang as 'kz' | 'ru' | 'en'] || leader.title?.kz || leader.title?.ru || leader.title?.en || ''}
                  </p>
                  {leader.sub && (
                    <span className="block text-[11px] text-slate-300 font-semibold mt-2.5">
                      {leader.sub?.[lang as 'kz' | 'ru' | 'en'] || leader.sub?.kz || ''}
                    </span>
                  )}
                </div>
                
                <div className="pt-4 border-t border-blue-400/10 mt-4">
                  <span className="text-[10px] sm:text-xs uppercase font-black tracking-widest text-amber-300 group-hover:text-amber-200 transition-colors flex items-center justify-center gap-1">
                    <span>{lang === 'kz' ? 'Толық профиль' : lang === 'ru' ? 'Подробнее' : 'View Profile'}</span>
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </span>
                </div>
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
