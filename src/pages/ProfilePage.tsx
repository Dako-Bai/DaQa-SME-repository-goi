import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User, Mail, Shield, Bell, Lock, Camera, Check, AlertCircle, 
  FileText, Settings, Key, Clock, Eye, EyeOff, Edit2, 
  Download, Trash2, Calendar, ChevronRight, X,
  Image, Coins, MapPin, Database, Users
} from 'lucide-react';
import { useAppContext } from '../contexts/AppContext';
import AdminPage from './AdminPage';

export default function ProfilePage() {
  const { 
    currentUser, 
    updateUserDetails, 
    auditLogs, 
    lang, 
    role,
    t
  } = useAppContext();

  // Active section inside profile: 'info' | 'logs' | 'admin_banners' | 'admin_prices' | 'admin_stations' | 'admin_tanks' | 'admin_users' | 'admin_logs'
  const [activeSection, setActiveSection] = useState<string>('info');

  // Personal info state
  const [isEditingInfo, setIsEditingInfo] = useState(false);
  const [fullName, setFullName] = useState(currentUser?.fullName || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [password, setPassword] = useState(currentUser?.password || '');
  const [emailNotifications, setEmailNotifications] = useState(currentUser?.emailNotificationsEnabled || false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [imageError, setImageError] = useState('');
  
  // Log filtering & management state
  const [logPeriod, setLogPeriod] = useState<'all' | 'week' | 'month'>('all');
  const [localLogs, setLocalLogs] = useState<typeof auditLogs | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Filter logs to only show actions by THIS user
  const baseLogs = localLogs || auditLogs;
  const myLogs = baseLogs.filter(log => log.email === currentUser?.email);

  // Date filter helper
  const getFilteredLogs = () => {
    const now = new Date();
    return myLogs.filter(log => {
      if (logPeriod === 'all') return true;
      
      // format: "2026-06-25 12:34:56" -> parse-ready
      const logDate = new Date(log.timestamp.replace(' ', 'T'));
      if (isNaN(logDate.getTime())) return true;
      
      const diffTime = Math.abs(now.getTime() - logDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (logPeriod === 'week') return diffDays <= 7;
      if (logPeriod === 'month') return diffDays <= 30;
      return true;
    });
  };

  const filteredLogs = getFilteredLogs();

  // PDF (formatted text) Export function
  const exportLogsToPDF = () => {
    let text = `====================================================================\n`;
    text += `          SMARTME SYSTEM - OFFICIAL ACTIVITY LOG REPORT             \n`;
    text += `====================================================================\n`;
    text += `Пайдаланушы (User): ${currentUser?.fullName} (@${currentUser?.username})\n`;
    text += `Рөлі (System Role): ${currentUser?.role.toUpperCase()}\n`;
    text += `Рұқсат шегі (Permission): ${currentUser?.permissionLevel || 'view'}\n`;
    text += `Күні (Report Date): ${new Date().toLocaleString('kk-KZ')}\n`;
    text += `Сүзу кезеңі (Filter Period): ${logPeriod === 'all' ? 'Барлығы' : logPeriod === 'week' ? 'Апталық' : 'Айлық'}\n`;
    text += `--------------------------------------------------------------------\n\n`;
    
    filteredLogs.forEach((log, i) => {
      text += `[${i + 1}] Уақыты (Timestamp): ${log.timestamp}\n`;
      text += `    Әрекет (Action): ${log.action}\n`;
      if (log.fieldChanged) {
        text += `    Өзгеріс (Field): ${log.fieldChanged} -> ${log.newValue}\n`;
      }
      text += `--------------------------------------------------------------------\n`;
    });
    
    text += `\nSMARTME Platform Verified Digital Signature • Operational Intelligence Audit Trail\n`;

    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `smartme_activity_report_${currentUser?.username}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Clear User History
  const clearMyLogs = () => {
    const confirmation = confirm(
      lang === 'kz' 
        ? 'Барлық әрекет журналын тазартуды растайсыз ба? Бұл әрекетті кері қайтару мүмкін емес.' 
        : 'Вы уверены, что хотите очистить журнал действий? Это действие необратимо.'
    );
    if (confirmation) {
      // Set local state logs list as empty for this user
      const updated = baseLogs.filter(log => log.email !== currentUser?.email);
      setLocalLogs(updated);
    }
  };

  // Translations dictionary for Profile Page
  const loc = {
    kz: {
      title: 'Жеке Кабинет & Профиль жүйесі',
      subtitle: 'Жеке мәліметтерді өңдеу, қауіпсіздік куәліктері, әрекеттер журналы және баптаулар орталығы.',
      avatar_hint: 'Сурет жүктеу үшін камера белгісін басыңыз',
      personal_info: 'Жеке мәліметтер парақшасы',
      full_name: 'Толық аты-жөні (ФИО):',
      email: 'Электрондық пошта (Email):',
      role_label: 'Жүйелік рөл деңгейі:',
      permissions_label: 'Резервуарларға рұқсат деңгейі:',
      notification_settings: 'Хабарламаларды пошта арқылы алу',
      notification_desc: 'Мұнай базаларындағы өзгерістер мен ағымдағы баға өзгерістері туралы шұғыл хабарламаларды электрондық поштаңызға нақты уақытта алу.',
      security: 'Қауіпсіздік баптаулары',
      password_label: 'Ағымдағы құпия сөз:',
      save_btn: 'Сақтау және Жаңарту',
      saved_msg: 'Профиль мәліметтері сәтті сақталды!',
      history_title: 'Сіздің әрекеттеріңіздің журналы',
      no_history: 'Әзірге ешқандай іс-әрекет тіркелмеген.',
      stats_title: 'Қызметтік статистика',
      registered_since: 'Тіркелген күні:',
      total_actions: 'Жалпы әрекеттер саны:',
      alert_perm: 'Рұқсат деңгейі:',
      edit_mode_btn: 'Деректерді өзгерту',
      cancel_btn: 'Болдырмау',
      show_pwd: 'Көрсету',
      hide_pwd: 'Жасыру',
      section_info: 'Жеке ақпарат',
      section_logs: 'Әрекеттер журналы',
      section_admin: 'Жүйелік Басқару',
      filter_all: 'Барлық уақыт',
      filter_week: 'Осы аптада',
      filter_month: 'Осы айда',
      pdf_btn: 'PDF / Мәтінді жүктеу',
      clear_btn: 'Журналды тазарту'
    },
    ru: {
      title: 'Личный Кабинет и Настройки',
      subtitle: 'Управление учетными данными, безопасностью, журналом аудита и системными ролями.',
      avatar_hint: 'Нажмите на иконку камеры для загрузки фото',
      personal_info: 'Панель личной информации',
      full_name: 'Полное имя (ФИО):',
      email: 'Электронная почта (Email):',
      role_label: 'Системная роль:',
      permissions_label: 'Уровень доступа к резервуарам:',
      notification_settings: 'Уведомления на электронную почту',
      notification_desc: 'Получать мгновенные оповещения об изменениях на нефтебазах и обновлении оптовых цен на ваш Email в реальном времени.',
      security: 'Безопасность',
      password_label: 'Текущий пароль:',
      save_btn: 'Сохранить изменения',
      saved_msg: 'Данные профиля успешно сохранены!',
      history_title: 'Журнал вашей активности',
      no_history: 'История действий пуста.',
      stats_title: 'Служебная статистика',
      registered_since: 'Дата регистрации:',
      total_actions: 'Всего совершено действий:',
      alert_perm: 'Уровень доступа:',
      edit_mode_btn: 'Редактировать данные',
      cancel_btn: 'Отмена',
      show_pwd: 'Показать',
      hide_pwd: 'Скрыть',
      section_info: 'Личная информация',
      section_logs: 'Журнал действий',
      section_admin: 'Управление Системой',
      filter_all: 'Все время',
      filter_week: 'За неделю',
      filter_month: 'За месяц',
      pdf_btn: 'Экспорт в PDF/TXT',
      clear_btn: 'Очистить историю'
    },
    en: {
      title: 'Personal Cabinet & Hub',
      subtitle: 'Manage secure credentials, profile details, activity logs and system integrations.',
      avatar_hint: 'Click camera icon to upload a picture',
      personal_info: 'Personal Details Sheet',
      full_name: 'Full Name:',
      email: 'Email Address:',
      role_label: 'System Role:',
      permissions_label: 'Reservoir Permission Level:',
      notification_settings: 'Email Alerts Service',
      notification_desc: 'Receive immediate alerts and real-time updates regarding depot stocks or price changes on your personal email.',
      security: 'Credentials Security',
      password_label: 'Current Password:',
      save_btn: 'Save New Settings',
      saved_msg: 'Profile successfully updated!',
      history_title: 'Your Activity History Trail',
      no_history: 'No action history logged yet.',
      stats_title: 'Cabinet Analytics',
      registered_since: 'Joined On:',
      total_actions: 'Logged Actions:',
      alert_perm: 'Permission Cap:',
      edit_mode_btn: 'Edit Information',
      cancel_btn: 'Cancel',
      show_pwd: 'Show',
      hide_pwd: 'Hide',
      section_info: 'Personal Info',
      section_logs: 'Activity Logs',
      section_admin: 'Admin Console',
      filter_all: 'All Time',
      filter_week: 'This Week',
      filter_month: 'This Month',
      pdf_btn: 'Download PDF/TXT',
      clear_btn: 'Clear Activity'
    }
  };

  const currentLoc = loc[lang === 'kz' ? 'kz' : lang === 'ru' ? 'ru' : 'en'];

  // Handle avatar image selection & base64 encoding
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setImageError(lang === 'kz' ? 'Сурет өлшемі 2МБ-тан аспауы тиіс' : 'Размер картинки не должен превышать 2МБ');
        return;
      }
      setImageError('');
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string' && currentUser) {
          updateUserDetails(currentUser.username, { profileImage: reader.result });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Submit profile details update
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentUser) {
      updateUserDetails(currentUser.username, {
        fullName,
        email,
        password,
        emailNotificationsEnabled: emailNotifications
      });
      setSaveSuccess(true);
      setIsEditingInfo(false);
      setTimeout(() => setSaveSuccess(false), 3000);
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex-1 w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in text-slate-800 max-w-full">
      
      {/* Title & Header */}
      <div className="space-y-2 text-left">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
          <Settings className="w-7 h-7 text-blue-600 animate-spin-slow" />
          {currentLoc.title}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-3xl leading-relaxed">
          {currentLoc.subtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Sidebar Menu Component */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Avatar and Info Card */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col items-center justify-center text-center relative overflow-hidden">
            <div className="absolute top-0 inset-x-0 h-20 bg-gradient-to-r from-blue-600 to-indigo-700" />
            
            {/* Avatar block */}
            <div className="relative mt-8 mb-4 group">
              <div className="w-28 h-28 rounded-full border-4 border-white bg-slate-100 flex items-center justify-center overflow-hidden shadow-md relative">
                {currentUser?.profileImage ? (
                  <img 
                    src={currentUser.profileImage} 
                    alt={currentUser.fullName} 
                    className="w-full h-full object-cover" 
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <User className="w-14 h-14 text-slate-400" />
                )}
              </div>

              {/* Camera Icon Overlay */}
              <button
                type="button"
                onClick={triggerFileSelect}
                className="absolute bottom-1.5 right-1.5 p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-md transition-transform active:scale-95 cursor-pointer border border-white"
                title={currentLoc.avatar_hint}
              >
                <Camera className="w-4 h-4" />
              </button>
            </div>

            {/* Hidden Input File */}
            <input 
              type="file"
              ref={fileInputRef}
              onChange={handleImageUpload}
              accept="image/*"
              className="hidden"
            />

            <div className="space-y-1.5 z-10">
              <h2 className="text-lg font-black text-slate-900">{currentUser?.fullName}</h2>
              <span className="inline-flex px-3 py-1 rounded-full text-[10px] font-black uppercase font-mono tracking-widest bg-blue-50 text-blue-700 border border-blue-100">
                {currentUser?.role}
              </span>
              <p className="text-slate-400 text-xs font-mono">@{currentUser?.username}</p>
            </div>

            {imageError && (
              <p className="text-[10px] text-red-600 font-bold mt-2 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" /> {imageError}
              </p>
            )}

            {/* Micro Statistics */}
            <div className="w-full mt-6 pt-5 border-t border-slate-100 space-y-3 text-left text-xs">
              <h3 className="font-extrabold text-slate-800 uppercase tracking-widest text-[9px] text-slate-400">
                {currentLoc.stats_title}
              </h3>
              
              <div className="flex justify-between items-center text-slate-600">
                <span>{currentLoc.registered_since}</span>
                <span className="font-bold text-slate-900 font-mono">15.06.2026</span>
              </div>

              <div className="flex justify-between items-center text-slate-600">
                <span>{currentLoc.total_actions}</span>
                <span className="font-bold text-slate-900 font-mono bg-slate-100 px-2 py-0.5 rounded">
                  {myLogs.length}
                </span>
              </div>

              <div className="flex justify-between items-center text-slate-600">
                <span>{currentLoc.alert_perm}</span>
                <span className="font-extrabold text-emerald-600 font-mono uppercase bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                  {currentUser?.permissionLevel || 'view'}
                </span>
              </div>
            </div>
          </div>

          {/* Navigation Menu (TABS) */}
          <div className="bg-white rounded-3xl p-4 border border-slate-200 shadow-sm space-y-1.5 text-left">
            <button
              onClick={() => setActiveSection('info')}
              className={`w-full flex items-center justify-between p-3 rounded-2xl text-xs font-bold transition cursor-pointer ${
                activeSection === 'info' 
                  ? 'bg-blue-600 text-white shadow-md' 
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <User className="w-4 h-4" />
                <span>{currentLoc.section_info}</span>
              </div>
              <ChevronRight className={`w-4 h-4 opacity-70 ${activeSection === 'info' ? 'rotate-90' : ''} transition-transform`} />
            </button>

            <button
              onClick={() => setActiveSection('logs')}
              className={`w-full flex items-center justify-between p-3 rounded-2xl text-xs font-bold transition cursor-pointer ${
                activeSection === 'logs' 
                  ? 'bg-blue-600 text-white shadow-md' 
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <FileText className="w-4 h-4" />
                <span>{currentLoc.section_logs}</span>
              </div>
              <ChevronRight className={`w-4 h-4 opacity-70 ${activeSection === 'logs' ? 'rotate-90' : ''} transition-transform`} />
            </button>

            {role === 'admin' && (
              <>
                <div className="pt-3 pb-1 px-3 border-t border-slate-100">
                  <span className="text-[10px] uppercase tracking-widest font-black text-slate-400 font-mono flex items-center gap-1.5">
                    <Shield className="w-3.5 h-3.5 text-blue-600 animate-pulse" />
                    Басқару Орталығы (CMS)
                  </span>
                </div>

                <button
                  onClick={() => setActiveSection('admin_banners')}
                  className={`w-full flex items-center justify-between p-3 rounded-2xl text-xs font-bold transition cursor-pointer ${
                    activeSection === 'admin_banners' 
                      ? 'bg-blue-600 text-white shadow-md' 
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Image className="w-4 h-4" />
                    <span>Контент</span>
                  </div>
                  <ChevronRight className={`w-4 h-4 opacity-70 ${activeSection === 'admin_banners' ? 'rotate-90' : ''} transition-transform`} />
                </button>

                <button
                  onClick={() => setActiveSection('admin_prices')}
                  className={`w-full flex items-center justify-between p-3 rounded-2xl text-xs font-bold transition cursor-pointer ${
                    activeSection === 'admin_prices' 
                      ? 'bg-blue-600 text-white shadow-md' 
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Coins className="w-4 h-4" />
                    <span>Бағаларды Басқару</span>
                  </div>
                  <ChevronRight className={`w-4 h-4 opacity-70 ${activeSection === 'admin_prices' ? 'rotate-90' : ''} transition-transform`} />
                </button>

                <button
                  onClick={() => setActiveSection('admin_stations')}
                  className={`w-full flex items-center justify-between p-3 rounded-2xl text-xs font-bold transition cursor-pointer ${
                    activeSection === 'admin_stations' 
                      ? 'bg-blue-600 text-white shadow-md' 
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <MapPin className="w-4 h-4" />
                    <span>ЖҚС Бекеттері</span>
                  </div>
                  <ChevronRight className={`w-4 h-4 opacity-70 ${activeSection === 'admin_stations' ? 'rotate-90' : ''} transition-transform`} />
                </button>

                <button
                  onClick={() => setActiveSection('admin_tanks')}
                  className={`w-full flex items-center justify-between p-3 rounded-2xl text-xs font-bold transition cursor-pointer ${
                    activeSection === 'admin_tanks' 
                      ? 'bg-blue-600 text-white shadow-md' 
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Database className="w-4 h-4" />
                    <span>Резервуарларды Басқару</span>
                  </div>
                  <ChevronRight className={`w-4 h-4 opacity-70 ${activeSection === 'admin_tanks' ? 'rotate-90' : ''} transition-transform`} />
                </button>

                <button
                  onClick={() => setActiveSection('admin_users')}
                  className={`w-full flex items-center justify-between p-3 rounded-2xl text-xs font-bold transition cursor-pointer ${
                    activeSection === 'admin_users' 
                      ? 'bg-blue-600 text-white shadow-md' 
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Users className="w-4 h-4" />
                    <span>Пайдаланушылар рұқсаты</span>
                  </div>
                  <ChevronRight className={`w-4 h-4 opacity-70 ${activeSection === 'admin_users' ? 'rotate-90' : ''} transition-transform`} />
                </button>

                <button
                  onClick={() => setActiveSection('admin_logs')}
                  className={`w-full flex items-center justify-between p-3 rounded-2xl text-xs font-bold transition cursor-pointer ${
                    activeSection === 'admin_logs' 
                      ? 'bg-blue-600 text-white shadow-md' 
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <FileText className="w-4 h-4" />
                    <span>Аудит Журналы</span>
                  </div>
                  <ChevronRight className={`w-4 h-4 opacity-70 ${activeSection === 'admin_logs' ? 'rotate-90' : ''} transition-transform`} />
                </button>
              </>
            )}
          </div>
        </div>

        {/* Right Active Panel Content with transitions */}
        <div className="lg:col-span-8">
          <AnimatePresence mode="wait">
            
            {/* 1. PERSONAL INFORMATION VIEW & FORM */}
            {activeSection === 'info' && (
              <motion.div
                key="info"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                {!isEditingInfo ? (
                  /* Read-Only State */
                  <div className="bg-white rounded-[2rem] p-6 sm:p-8 border border-slate-200 shadow-sm text-left space-y-6 relative overflow-hidden">
                    <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                      <div className="flex items-center gap-2.5">
                        <User className="w-5 h-5 text-blue-600" />
                        <h2 className="text-base sm:text-lg font-black text-slate-900">{currentLoc.personal_info}</h2>
                      </div>
                      
                      <button
                        type="button"
                        onClick={() => {
                          setFullName(currentUser?.fullName || '');
                          setEmail(currentUser?.email || '');
                          setPassword(currentUser?.password || '');
                          setEmailNotifications(currentUser?.emailNotificationsEnabled || false);
                          setIsEditingInfo(true);
                        }}
                        className="flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold cursor-pointer transition border-0 shadow"
                      >
                        <Edit2 className="w-3.5 h-3.5 text-amber-300" />
                        <span>{currentLoc.edit_mode_btn}</span>
                      </button>
                    </div>

                    {/* Displays Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-left">
                      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                        <span className="text-[10px] uppercase font-bold text-slate-450 block mb-1">{currentLoc.full_name}</span>
                        <p className="text-sm font-extrabold text-slate-900">{currentUser?.fullName}</p>
                      </div>

                      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                        <span className="text-[10px] uppercase font-bold text-slate-450 block mb-1">{currentLoc.email}</span>
                        <p className="text-sm font-bold text-slate-800 font-mono">{currentUser?.email}</p>
                      </div>

                      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                        <span className="text-[10px] uppercase font-bold text-slate-450 block mb-1">{currentLoc.role_label}</span>
                        <span className="inline-block mt-0.5 px-2.5 py-0.5 text-[10px] font-black uppercase font-mono tracking-widest bg-blue-100 text-blue-800 rounded-md">
                          {currentUser?.role}
                        </span>
                      </div>

                      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                        <span className="text-[10px] uppercase font-bold text-slate-450 block mb-1">{currentLoc.password_label}</span>
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-sm font-bold font-mono text-slate-900">
                            {showPassword ? currentUser?.password : '••••••••'}
                          </p>
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="text-[10px] font-bold text-blue-600 hover:underline"
                          >
                            {showPassword ? currentLoc.hide_pwd : currentLoc.show_pwd}
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Email notify block read only */}
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                      <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                        <Bell className="w-4 h-4 text-blue-600" />
                        {currentLoc.notification_settings}
                      </span>
                      <p className="text-[11px] text-slate-500 leading-relaxed max-w-xl">
                        {currentLoc.notification_desc}
                      </p>
                      <div className="pt-2 flex items-center gap-1.5">
                        <span className={`w-2.5 h-2.5 rounded-full ${currentUser?.emailNotificationsEnabled ? 'bg-emerald-500' : 'bg-slate-350'}`} />
                        <span className="text-xs font-bold text-slate-800">
                          {currentUser?.emailNotificationsEnabled 
                            ? (lang === 'kz' ? 'Қосулы (Белсенді)' : 'Включено (Активно)') 
                            : (lang === 'kz' ? 'Өшірулі (Пассивті)' : 'Выключено')}
                        </span>
                      </div>
                    </div>

                    {saveSuccess && (
                      <div className="flex items-center gap-1.5 text-emerald-650 bg-emerald-50 p-3 rounded-2xl border border-emerald-100 text-xs font-bold animate-fade-in justify-center">
                        <Check className="w-4 h-4" />
                        {currentLoc.saved_msg}
                      </div>
                    )}
                  </div>
                ) : (
                  /* Editable State Form */
                  <form onSubmit={handleSubmit} className="bg-white rounded-[2rem] p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6 text-left">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-150">
                      <div className="flex items-center gap-2">
                        <Edit2 className="w-5 h-5 text-blue-600" />
                        <h2 className="text-base font-extrabold text-slate-900">{currentLoc.personal_info}</h2>
                      </div>
                      
                      <button
                        type="button"
                        onClick={() => setIsEditingInfo(false)}
                        className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl cursor-pointer transition border-0"
                      >
                        {currentLoc.cancel_btn}
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Full Name field */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-700 block">{currentLoc.full_name}</label>
                        <div className="relative">
                          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <User className="w-4 h-4 text-slate-400" />
                          </span>
                          <input 
                            type="text"
                            required
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            className="w-full pl-9 pr-3 py-2 border border-slate-250 bg-slate-50 text-slate-800 text-xs rounded-xl focus:bg-white focus:ring-1 focus:ring-blue-500 focus:outline-none font-bold"
                          />
                        </div>
                      </div>

                      {/* Email field */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-700 block">{currentLoc.email}</label>
                        <div className="relative">
                          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Mail className="w-4 h-4 text-slate-400" />
                          </span>
                          <input 
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full pl-9 pr-3 py-2 border border-slate-250 bg-slate-50 text-slate-800 text-xs rounded-xl focus:bg-white focus:ring-1 focus:ring-blue-500 focus:outline-none font-mono"
                          />
                        </div>
                      </div>

                      {/* Role Indicator (Non-editable) */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-500 block">{currentLoc.role_label}</label>
                        <div className="relative">
                          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Shield className="w-4 h-4 text-slate-400" />
                          </span>
                          <input 
                            type="text"
                            disabled
                            value={currentUser?.role.toUpperCase() || 'USER'}
                            className="w-full pl-9 pr-3 py-2 border border-slate-200 bg-slate-100 text-slate-500 text-xs rounded-xl font-black font-mono cursor-not-allowed uppercase"
                          />
                        </div>
                      </div>

                      {/* Password credentials change */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-700 block">{currentLoc.password_label}</label>
                        <div className="relative">
                          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Key className="w-4 h-4 text-slate-400" />
                          </span>
                          <input 
                            type="text"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full pl-9 pr-3 py-2 border border-slate-250 bg-slate-50 text-slate-850 text-xs rounded-xl focus:bg-white focus:ring-1 focus:ring-blue-500 focus:outline-none font-mono font-bold text-left"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Email notification toggle */}
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                      <div className="flex items-start justify-between gap-4">
                        <div className="space-y-1 text-left">
                          <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                            <Bell className="w-4 h-4 text-blue-600" />
                            {currentLoc.notification_settings}
                          </span>
                          <p className="text-[11px] text-slate-500 leading-relaxed max-w-xl">
                            {currentLoc.notification_desc}
                          </p>
                        </div>

                        <label className="relative inline-flex items-center cursor-pointer select-none shrink-0">
                          <input 
                            type="checkbox"
                            checked={emailNotifications}
                            onChange={(e) => setEmailNotifications(e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 justify-end">
                      <button
                        type="button"
                        onClick={() => setIsEditingInfo(false)}
                        className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition border-0"
                      >
                        {currentLoc.cancel_btn}
                      </button>
                      <button
                        type="submit"
                        className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition shadow hover:shadow-md cursor-pointer border-0"
                      >
                        {currentLoc.save_btn}
                      </button>
                    </div>
                  </form>
                )}
              </motion.div>
            )}

            {/* 2. ACTIVITY TRAIL HISTORY LOGS VIEW */}
            {activeSection === 'logs' && (
              <motion.div
                key="logs"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.2 }}
                className="bg-white rounded-[2rem] p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6 text-left"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-150">
                  <div className="flex items-center gap-2.5">
                    <FileText className="w-5 h-5 text-indigo-650" />
                    <div>
                      <h2 className="text-base sm:text-lg font-black text-slate-900">{currentLoc.history_title}</h2>
                      <p className="text-[11px] text-slate-450">{currentUser?.fullName} тұлғасының жүйедегі белсенділік ізі</p>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-black font-mono rounded-full border border-indigo-100 self-start sm:self-center">
                    {filteredLogs.length} LOGS
                  </span>
                </div>

                {/* Filters and Action Bar */}
                <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-50 p-3.5 rounded-2xl border border-slate-150 text-xs">
                  {/* Filter segment */}
                  <div className="flex p-0.5 bg-slate-200/65 rounded-lg font-bold">
                    <button
                      onClick={() => setLogPeriod('all')}
                      className={`px-3 py-1.5 rounded-md cursor-pointer transition ${
                        logPeriod === 'all' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      {currentLoc.filter_all}
                    </button>
                    <button
                      onClick={() => setLogPeriod('week')}
                      className={`px-3 py-1.5 rounded-md cursor-pointer transition ${
                        logPeriod === 'week' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      {currentLoc.filter_week}
                    </button>
                    <button
                      onClick={() => setLogPeriod('month')}
                      className={`px-3 py-1.5 rounded-md cursor-pointer transition ${
                        logPeriod === 'month' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      {currentLoc.filter_month}
                    </button>
                  </div>

                  {/* Actions buttons */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={exportLogsToPDF}
                      disabled={filteredLogs.length === 0}
                      className="flex items-center gap-1 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-lg cursor-pointer transition text-xs font-bold border-0 shadow-sm"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>{currentLoc.pdf_btn}</span>
                    </button>
                    <button
                      onClick={clearMyLogs}
                      disabled={myLogs.length === 0}
                      className="flex items-center gap-1 px-3 py-1.5 bg-rose-50 hover:bg-rose-100 disabled:opacity-50 text-rose-750 border border-rose-200 rounded-lg cursor-pointer transition text-xs font-bold"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>{currentLoc.clear_btn}</span>
                    </button>
                  </div>
                </div>

                {/* Logs List representation */}
                {filteredLogs.length === 0 ? (
                  <div className="text-center py-12 text-slate-400 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                    <Calendar className="w-8 h-8 text-slate-350 mx-auto mb-2" />
                    <p className="text-xs font-bold">{currentLoc.no_history}</p>
                    <p className="text-[10px] text-slate-400 mt-1">Таңдалған кезеңге немесе осы пайдаланушыға сәйкес деректер жоқ.</p>
                  </div>
                ) : (
                  <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-2 scrollbar-thin">
                    {filteredLogs.map((log) => (
                      <div key={log.id} className="p-3.5 bg-slate-50/50 hover:bg-slate-50 border border-slate-150 rounded-2xl text-xs flex justify-between items-center gap-4 transition">
                        <div className="space-y-1 text-left">
                          <p className="font-extrabold text-slate-850 leading-tight">{log.action}</p>
                          {log.fieldChanged && (
                            <div className="flex items-center gap-1.5 font-mono text-[9px] text-slate-450 bg-slate-100 p-1 px-2 rounded-lg border border-slate-150 inline-block">
                              <span className="font-bold text-slate-500">Көрсеткіш:</span>
                              <span className="font-extrabold text-indigo-700">{log.fieldChanged}</span>
                              <span className="text-slate-350">➔</span>
                              <span className="font-black text-emerald-600">{log.newValue}</span>
                            </div>
                          )}
                        </div>
                        <span className="text-[10px] font-mono text-slate-400 shrink-0 flex items-center gap-1 bg-white p-1 px-2.5 rounded-lg border border-slate-100 shadow-sm">
                          <Clock className="w-3 h-3 text-indigo-500" />
                          {log.timestamp}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* 3. NESTED ADMIN POWERED CONTROL MODULE */}
            {activeSection.startsWith('admin_') && role === 'admin' && (
              <motion.div
                key={activeSection}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.2 }}
                className="w-full max-w-full"
              >
                {/* Paint the Admin Management panel in Admin's profile with a blue gradient on a white background, and enlarge the panel to full size/screen-width */}
                <div className="bg-white rounded-[2.5rem] border-4 border-indigo-500/20 shadow-2xl p-4 sm:p-8 w-full max-w-full overflow-hidden bg-gradient-to-br from-white via-blue-50/5 to-indigo-50/15 relative">
                  
                  {/* Decorative glowing header bar indicating expanded layout */}
                  <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-blue-600 via-indigo-650 to-emerald-500" />
                  
                  <div className="space-y-1 text-left mb-6 pt-2">
                    <h2 className="text-lg sm:text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-800 to-blue-700 tracking-tight flex items-center gap-2">
                      <Shield className="w-5.5 h-5.5 text-indigo-600 animate-pulse" />
                      Басқару Орталығы (CMS)
                    </h2>
                    <p className="text-[11px] text-slate-500">
                      Мұнай базаларын, резервуар сыйымдылығы мен деңгейін және баға индексін толық басқаруға арналған ресми әкімшілік интерфейс.
                    </p>
                  </div>

                  <div className="overflow-x-auto w-full">
                    <AdminPage 
                      activeTabOverride={
                        activeSection === 'admin_banners' ? 'banners' :
                        activeSection === 'admin_prices' ? 'prices' :
                        activeSection === 'admin_stations' ? 'stations' :
                        activeSection === 'admin_tanks' ? 'tanks' :
                        activeSection === 'admin_users' ? 'users' :
                        'logs'
                      }
                      hideHeaderAndTabs={true}
                    />
                  </div>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>

      </div>

    </div>
  );
}
