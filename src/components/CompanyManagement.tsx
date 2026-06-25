import React, { useState } from 'react';
import { Award, FlaskConical, CircleUser, Mail, ArrowRight, X, ShieldCheck } from 'lucide-react';
import { useAppContext } from '../contexts/AppContext';

export default function CompanyManagement() {
  const { lang } = useAppContext();
  const [selectedLeader, setSelectedLeader] = useState<number | null>(null);

  const leaders = [
    {
      id: 0,
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
      icon: CircleUser,
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
      id: 1,
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
      icon: Award,
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
      id: 2,
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
      icon: FlaskConical,
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

  return (
    <div className="bg-[#245dff] border border-blue-400/20 rounded-[32px] p-6 sm:p-8 space-y-6 shadow-xl shadow-blue-650/20 text-white">
      
      {/* Shortened Minimalist Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-4 border-b border-white/10">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-widest text-amber-200 font-mono">
            {lang === 'kz' ? 'Ғылыми жетекшілік' : lang === 'ru' ? 'Научное руководство' : 'Scientific Leadership'}
          </span>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight leading-tight">
            {lang === 'kz' ? 'Ресми және кәсіби басшылық құрамы' : lang === 'ru' ? 'Руководящий состав' : 'Expert Governance'}
          </h2>
        </div>
      </div>

      {/* Grid of Executive Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {leaders.map((leader, i) => {
          const IconComponent = leader.icon;
          return (
            <div 
              key={leader.id}
              onClick={() => setSelectedLeader(i)}
              className="bg-[#1d52e5] hover:bg-blue-700/40 p-4 rounded-2xl flex items-center gap-3.5 transition-all cursor-pointer group relative border border-blue-400/30 hover:border-white/35 text-white"
            >
              <div className="relative shrink-0">
                <img 
                  src={leader.imageUrl} 
                  alt={leader.name[lang as 'kz' | 'ru' | 'en']} 
                  className="w-12 h-12 rounded-xl object-cover border border-blue-300/20 group-hover:scale-102 transition-transform"
                  referrerPolicy="no-referrer"
                />
                <div className={`absolute -bottom-1 -right-1 w-4.5 h-4.5 rounded-lg ${leader.color} flex items-center justify-center text-white scale-90 border border-white/10`}>
                  <IconComponent className="w-2.5 h-2.5" />
                </div>
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-bold text-xs sm:text-sm text-white group-hover:text-amber-200 transition-colors leading-tight truncate">
                  {leader.name[lang as 'kz' | 'ru' | 'en'] || leader.name.kz}
                </h3>
                <p className="text-[11px] text-blue-105 leading-tight mt-0.5 truncate bg-[#1746c8]/50 rounded px-1.5 py-0.5 inline-block max-w-full">
                  {leader.title[lang as 'kz' | 'ru' | 'en'] || leader.title.kz}
                </p>
                <span className="text-[9px] uppercase font-black tracking-wider text-amber-350 group-hover:text-amber-350 mt-1 block">
                  {lang === 'kz' ? 'Деректерді көру →' : lang === 'ru' ? 'Подробнее →' : 'View Profile →'}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Simple Information Modal Dialog */}
      {selectedLeader !== null && (
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
                <img 
                  src={leaders[selectedLeader].imageUrl} 
                  alt={leaders[selectedLeader].name[lang as 'kz' | 'ru' | 'en']} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-blue-950/40 to-transparent pointer-events-none" />
              </div>

              {/* Robust Bio & Governance Achievements */}
              <div className="md:col-span-7 space-y-5">
                <div className="space-y-1.5 pb-3.5 border-b border-blue-400/20">
                  <span className="inline-block px-3 py-1 font-black uppercase tracking-widest text-[#fbbf24] bg-amber-400/10 rounded-md border border-amber-400/15 text-[10px] font-mono">
                    {leaders[selectedLeader].sub[lang as 'kz' | 'ru' | 'en']}
                  </span>
                  <h3 className="text-xl sm:text-2.5xl font-extrabold text-white leading-tight tracking-tight">
                    {leaders[selectedLeader].name[lang as 'kz' | 'ru' | 'en']}
                  </h3>
                  <p className="text-xs sm:text-sm text-blue-200 font-medium">
                    {leaders[selectedLeader].title[lang as 'kz' | 'ru' | 'en']}
                  </p>
                </div>

                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold text-amber-200 uppercase tracking-widest block font-mono">
                    {lang === 'kz' ? 'Еңбек жолы мен баяндама' : lang === 'ru' ? 'Биография и квалификация' : 'Professional Profile & Achievements'}
                  </span>
                  <div className="bg-blue-950/20 p-5 rounded-[20px] border border-blue-400/10">
                    <p className="text-xs sm:text-sm text-blue-50 leading-relaxed whitespace-pre-wrap font-normal">
                      {leaders[selectedLeader].bio[lang as 'kz' | 'ru' | 'en']}
                    </p>
                  </div>
                </div>

                {/* Stats & Contacts block */}
                <div className="pt-4 flex flex-wrap justify-between items-center gap-4 border-t border-blue-400/20 text-xs text-blue-100">
                  <div className="flex gap-6">
                    {leaders[selectedLeader].specs.map((spec, index) => (
                      <div key={index} className="space-y-0.5">
                        <span className="text-[9px] text-blue-300 block font-bold uppercase tracking-wider">{spec.label[lang as 'kz' | 'ru' | 'en']}</span>
                        <span className="font-mono font-bold text-white text-sm">{spec.value}</span>
                      </div>
                    ))}
                  </div>
                  <div className="bg-[#1746c8]/50 px-4 py-2 rounded-xl border border-blue-400/10">
                    <span className="text-[9px] text-blue-300 block font-bold uppercase tracking-wider">Email</span>
                    <a href={`mailto:${leaders[selectedLeader].email}`} className="font-mono text-xs text-amber-300 font-bold hover:underline">
                      {leaders[selectedLeader].email}
                    </a>
                  </div>
                </div>

              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}
