import { Menu, X, ArrowLeft, Moon, Sun, Globe, User, ShieldAlert, Key, Bell, Trash, AlertTriangle, AlertCircle, Info } from 'lucide-react';
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { useAppContext } from '../contexts/AppContext';
import { Lang, Role, translations } from '../locales/translations';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isAlertsOpen, setIsAlertsOpen] = useState(false);
  const location = useLocation();
  const { lang, setLang, theme, setTheme, role, setRole, t, alerts, markAlertAsRead, clearAllAlerts, currentUser } = useAppContext();

  // Non-admins see only global alerts or alerts matching their own username
  const visibleAlerts = alerts.filter(a => {
    if (role === 'admin') return true;
    return a.isGlobal || (currentUser && a.username === currentUser.username);
  });

  const unreadCount = visibleAlerts.filter(a => !a.isRead).length;

  const navLinks = [
    { name: t('nav_home'), path: '/' },
    // Only show NB and AZK combined if user is authenticated (user or admin)
    ...(role !== 'guest' ? [
      { name: lang === 'kz' ? 'МБ / АЖҚ' : lang === 'ru' ? 'НБ / АЗС' : 'Depot / AZS', path: '/nb' },
    ] : []),
    { name: t('nav_prices'), path: '/prices' },
    { name: t('nav_contacts'), path: '/contacts' },
    ...(role !== 'guest' ? [
      { name: lang === 'kz' ? 'Профиль' : lang === 'ru' ? 'Профиль' : 'Profile', path: '/profile' },
    ] : []),
  ];

  return (
    <header className="fixed top-0 inset-x-0 z-50 glass border-b-0 border-white/20 dark:border-white/5 transition-colors">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex items-center gap-2 sm:gap-4">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden p-2 -ml-2 rounded-md text-white hover:bg-white/10 transition-colors"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
            <Link to="/" className="flex items-center gap-2 select-none group">
              <span className="font-extrabold text-lg sm:text-xl tracking-tight text-white flex items-center gap-1.5 font-display">
                <span className="bg-white text-[#245dff] px-2.5 py-1 rounded-xl text-sm font-black shadow-sm group-hover:scale-98 transition-transform">
                  SmartME
                </span>
                <span className="text-blue-300 font-extralight text-xs sm:text-sm font-mono">/</span>
                <span className="text-blue-100 font-bold text-xs uppercase tracking-wider font-mono">Mercury Energy</span>
              </span>
            </Link>
          </div>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center space-x-2">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-4 py-2 rounded-full font-bold text-xs uppercase tracking-wider transition-all duration-300 ${
                    isActive 
                      ? 'bg-white text-blue-750 shadow-md scale-[1.02] font-black' 
                      : 'text-blue-50 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2 sm:gap-4">
             {/* Main Site link */}
             <a
              href="https://mercuryenergy.kz"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue-100 hover:text-amber-300 transition-colors py-2 px-3"
            >
              <ArrowLeft className="w-4 h-4" />
              {t('back_to_main')}
            </a>

            {/* Language Switcher */}
            <div className="flex bg-blue-800/40 p-1 rounded-full border border-blue-400/20 font-sans">
              {(['kz', 'ru', 'en'] as Lang[]).map((l) => (
                <button
                  key={l}
                  onClick={() => setLang(l)}
                  className={`px-3 py-1 text-xs font-bold uppercase rounded-full transition-all cursor-pointer ${
                    lang === l 
                      ? 'bg-white text-blue-700 shadow-xs scale-102 font-extrabold' 
                      : 'text-blue-100 hover:text-white font-medium'
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>


            {/* Notifications Alert Center Dropdown */}
            {role !== 'guest' && (
              <div className="relative">
                <button
                  onClick={() => setIsAlertsOpen(!isAlertsOpen)}
                  className="p-2 rounded-full bg-blue-800/40 text-blue-100 hover:bg-blue-700 hover:text-white border border-blue-400/20 transition flex items-center justify-center relative cursor-pointer"
                  title="Дабылдар"
                >
                  <Bell className="w-4 h-4" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-rose-500 text-white font-mono text-[9px] font-black w-4.5 h-4.5 rounded-full flex items-center justify-center animate-pulse border-2 border-blue-600">
                      {unreadCount}
                    </span>
                  )}
                </button>

                <AnimatePresence>
                  {isAlertsOpen && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setIsAlertsOpen(false)} />
                      <motion.div
                        initial={{ opacity: 0, y: 15, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 15, scale: 0.95 }}
                        className="absolute right-0 mt-3 w-80 sm:w-96 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-4 z-25 overflow-hidden flex flex-col"
                      >
                        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 mb-2">
                          <h4 className="font-bold text-slate-950 dark:text-white text-xs uppercase tracking-widest flex items-center gap-2">
                            <ShieldAlert className="w-4 h-4 text-amber-500" /> Орталық дабыл базасы
                          </h4>
                          {visibleAlerts.length > 0 && (
                            <button
                              onClick={clearAllAlerts}
                              className="text-[10px] text-rose-500 hover:text-rose-600 font-bold flex items-center gap-1 bg-rose-500/10 px-2 py-1 rounded-md transition-colors"
                            >
                              <Trash className="w-3 h-3" /> Тазалау
                            </button>
                          )}
                        </div>

                        <div className="max-h-72 overflow-y-auto space-y-2 py-1 scrollbar-thin">
                          {visibleAlerts.length === 0 ? (
                            <div className="text-center py-8 text-xs text-slate-450 dark:text-slate-500">
                              <Bell className="w-8 h-8 mx-auto opacity-30 mb-2" />
                              Дабылдар немесе жүйелік қателер тіркелмеді.
                            </div>
                          ) : (
                            visibleAlerts.map((alert) => (
                              <div
                                key={alert.id}
                                onClick={() => markAlertAsRead(alert.id)}
                                className={`p-2.5 rounded-xl border text-xs leading-relaxed transition-colors cursor-pointer flex gap-2.5 items-start ${
                                  alert.isRead 
                                    ? 'bg-slate-50/50 dark:bg-slate-800/20 border-slate-100 dark:border-slate-800/40 text-slate-500' 
                                    : 'bg-blue-50/40 dark:bg-blue-950/20 border-blue-100/70 dark:border-blue-900/40 text-slate-800 dark:text-slate-200 font-medium'
                                }`}
                              >
                                {alert.type === 'error' ? (
                                  <AlertCircle className="w-4.5 h-4.5 text-rose-500 shrink-0 mt-0.5" />
                                ) : alert.type === 'warning' ? (
                                  <AlertTriangle className="w-4.5 h-4.5 text-amber-500 shrink-0 mt-0.5" />
                                ) : (
                                  <Info className="w-4.5 h-4.5 text-blue-500 shrink-0 mt-0.5" />
                                )}
                                <div className="flex-1">
                                  <p>{alert.text}</p>
                                  <span className="text-[9px] font-semibold text-slate-400 mt-1 block font-mono">{alert.date}</span>
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* Demo Role Switcher */}
            <div className="relative group">
              <button className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition flex items-center justify-center">
                {role === 'guest' ? <User className="w-4 h-4" /> : role === 'admin' ? <ShieldAlert className="w-4 h-4 text-rose-500" /> : <Key className="w-4 h-4 text-emerald-500"/>}
              </button>
              <div className="absolute right-0 top-full mt-2 w-40 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 p-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                <div className="text-[10px] font-bold uppercase text-slate-400 px-2 mb-1">{t('demo_role')}</div>
                {(['guest', 'user', 'admin'] as Role[]).map((r) => (
                  <button
                    key={r}
                    onClick={() => setRole(r)}
                    className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-colors ${
                      role === r ? 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 font-semibold' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50'
                    }`}
                  >
                    {t(`role_${r}` as keyof typeof translations.en)}
                  </button>
                ))}
              </div>
            </div>

            {/* Profile Avatar Page Link */}
            {role !== 'guest' && (
              <Link
                to="/profile"
                className="w-9 h-9 rounded-full bg-blue-800/40 hover:bg-blue-700 hover:text-white border border-blue-400/20 overflow-hidden flex items-center justify-center cursor-pointer transition relative shrink-0"
                title={lang === 'kz' ? 'Жеке кабинет' : lang === 'ru' ? 'Личный кабинет' : 'Personal Cabinet'}
              >
                {currentUser?.profileImage ? (
                  <img 
                    src={currentUser.profileImage} 
                    alt={currentUser.fullName} 
                    className="w-full h-full object-cover select-none" 
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <User className="w-4 h-4 text-blue-100" />
                )}
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden overflow-hidden bg-white/95 dark:bg-slate-900/95 backdrop-blur-3xl border-b border-slate-200 dark:border-slate-800 shadow-2xl"
          >
            <div className="px-4 pt-2 pb-6 space-y-1">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setIsOpen(false)}
                    className={`block px-4 py-3 rounded-xl font-medium transition-colors ${
                      isActive
                        ? 'bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
              <a
                href="https://mercuryenergy.kz"
                target="_blank"
                rel="noopener noreferrer"
                className="block px-4 py-3 rounded-xl font-medium text-slate-500 dark:text-slate-400 hover:text-[#f59e0b] hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                {t('back_to_main')}
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
