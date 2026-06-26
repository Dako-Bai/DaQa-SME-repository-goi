import React, { useState } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { ManagedPrice } from '../types';
import { 
  Shield, 
  Users, 
  MapPin, 
  Image, 
  Coins, 
  FileText, 
  Plus, 
  Trash2, 
  Edit, 
  Save, 
  X, 
  Check, 
  Search, 
  UserPlus, 
  RefreshCw, 
  Server, 
  TrendingUp, 
  TrendingDown, 
  Minus,
  Sparkles,
  Database,
  ArrowUp,
  ArrowDown,
  Upload,
  Building2,
  Phone,
  Clock,
  Award,
  FlaskConical,
  CircleUser
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import CmsManagementPanel from '../components/CmsManagementPanel';

const safeAlert = (msg: string) => {
  try {
    window.alert(msg);
  } catch (e) {
    console.warn("Alert blocked in sandbox environment:", msg);
  }
};

export default function AdminPage({ activeTabOverride, hideHeaderAndTabs }: { activeTabOverride?: 'banners' | 'prices' | 'stations' | 'tanks' | 'users' | 'logs'; hideHeaderAndTabs?: boolean } = {}) {
  const { 
    lang, 
    role, 
    currentUser,
    priceDisplayUnit,
    setPriceDisplayUnit,
    auditLogs, 
    clearAuditLogs,
    usersList, 
    updateUserRole,
    updateUserDetails,
    updateUserTanksAndPermissions,
    addUser,
    deleteUser,
    tanksState,
    stationsList, 
    addStation, 
    updateStation, 
    deleteStation,
    regionRates, 
    updateRegionRate, 
    addRegionRateFuel, 
    deleteRegionRateFuel,
    bannersState, 
    updateBannersState,
    spotRates, 
    addSpotRate, 
    updateSpotRate, 
    deleteSpotRate,
    logUserAction,
    addTank,
    updateTank,
    deleteTank,
    waterLevels,
    updateWaterLevel,
    managedPrices,
    addManagedPrice,
    updateManagedPrice,
    deleteManagedPrice,
    leadersList,
    updateLeadersList,
    contactsState,
    updateContactsState
  } = useAppContext();

  const getDensity = (brandName: string) => {
    const lower = brandName.toLowerCase();
    if (lower.includes('95')) return 0.750;
    if (lower.includes('92')) return 0.730;
    if (lower.includes('дт') || lower.includes('дизель') || lower.includes('diesel')) return 0.840;
    return 0.775;
  };

  // Selected tab
  const [activeTab, setActiveTab] = useState<'banners' | 'prices' | 'stations' | 'tanks' | 'users' | 'logs'>(() => activeTabOverride || 'banners');

  React.useEffect(() => {
    if (activeTabOverride) {
      setActiveTab(activeTabOverride);
    }
  }, [activeTabOverride]);

  // Tanks configuration tab state
  const [selectedAdmTankId, setSelectedAdmTankId] = useState('');
  const [editAdmFuel, setEditAdmFuel] = useState('');
  const [editAdmVolume, setEditAdmVolume] = useState<number>(0);
  const [editAdmCapacity, setEditAdmCapacity] = useState<number>(1000);
  const [editAdmWater, setEditAdmWater] = useState<number>(0);

  // New tank state
  const [newAdmId, setNewAdmId] = useState('');
  const [newAdmFuel, setNewAdmFuel] = useState('');
  const [newAdmVolume, setNewAdmVolume] = useState<number>(0);
  const [newAdmCapacity, setNewAdmCapacity] = useState<number>(1000);
  const [showAdmAddForm, setShowAdmAddForm] = useState(false);

  // Auto-select first tank on load
  React.useEffect(() => {
    if (tanksState && tanksState.length > 0 && !selectedAdmTankId) {
      setSelectedAdmTankId(tanksState[0].id);
    }
  }, [tanksState, selectedAdmTankId]);

  // Read actual values on selection change
  React.useEffect(() => {
    const active = (tanksState || []).find(t => t.id === selectedAdmTankId);
    if (active) {
      setEditAdmFuel(active.fuel);
      setEditAdmVolume(active.volume);
      setEditAdmCapacity(active.capacity);
      setEditAdmWater(waterLevels ? (waterLevels[active.id] || 0) : 0);
    }
  }, [selectedAdmTankId, tanksState, waterLevels]);

  // Search queries
  const [logSearch, setLogSearch] = useState('');
  const [logRoleFilter, setLogRoleFilter] = useState<string>('all');
  const [userSearch, setUserSearch] = useState('');

  // Add Dynamic User state
  const [showAddUserForm, setShowAddUserForm] = useState(false);
  const [newUName, setNewUName] = useState('');
  const [newUFullName, setNewUFullName] = useState('');
  const [newUEmail, setNewUEmail] = useState('');
  const [newUPassword, setNewUPassword] = useState('');
  const [newURole, setNewURole] = useState<'guest' | 'user' | 'admin'>('user');
  const [newUPermLevel, setNewUPermLevel] = useState<'view' | 'edit' | 'open_close' | 'full'>('view');
  const [newUAllowedTanks, setNewUAllowedTanks] = useState<string[]>(['T-01', 'T-02', 'T-03', 'T-04', 'T-05']);

  const [editingUserForAdmin, setEditingUserForAdmin] = useState<any | null>(null);
  const [editAdminUFullName, setEditAdminUFullName] = useState('');
  const [editAdminUEmail, setEditAdminUEmail] = useState('');
  const [editAdminUPassword, setEditAdminUPassword] = useState('');
  const [editAdminUEmailNotifications, setEditAdminUEmailNotifications] = useState(false);

  // Banners editing state
  const [bKzTitle, setBKzTitle] = useState(bannersState.heroTitleKz || '');
  const [bRuTitle, setBRuTitle] = useState(bannersState.heroTitleRu || '');
  const [bEnTitle, setBEnTitle] = useState(bannersState.heroTitleEn || '');
  const [bKzDesc, setBKzDesc] = useState(bannersState.heroDescKz || '');
  const [bRuDesc, setBRuDesc] = useState(bannersState.heroDescRu || '');
  const [bEnDesc, setBEnDesc] = useState(bannersState.heroDescEn || '');
  const [bImage, setBImage] = useState(bannersState.heroImage || '');
  const [isSavingBanners, setIsSavingBanners] = useState(false);

  // --- CMS SUB-TAB STATE ---
  const [cmsSubTab, setCmsSubTab] = useState<'slider' | 'leaders' | 'contacts'>('slider');

  // Leaders CMS Editing States
  const [editingLeaderId, setEditingLeaderId] = useState<string | null>(null);
  const [leaderNameKz, setLeaderNameKz] = useState('');
  const [leaderNameRu, setLeaderNameRu] = useState('');
  const [leaderNameEn, setLeaderNameEn] = useState('');
  const [leaderTitleKz, setLeaderTitleKz] = useState('');
  const [leaderTitleRu, setLeaderTitleRu] = useState('');
  const [leaderTitleEn, setLeaderTitleEn] = useState('');
  const [leaderSubKz, setLeaderSubKz] = useState('');
  const [leaderSubRu, setLeaderSubRu] = useState('');
  const [leaderSubEn, setLeaderSubEn] = useState('');
  const [leaderImageUrl, setLeaderImageUrl] = useState('');
  const [leaderIconName, setLeaderIconName] = useState('CircleUser');
  const [leaderColor, setLeaderColor] = useState('bg-blue-600');
  const [leaderEmail, setLeaderEmail] = useState('');
  const [leaderBioKz, setLeaderBioKz] = useState('');
  const [leaderBioRu, setLeaderBioRu] = useState('');
  const [leaderBioEn, setLeaderBioEn] = useState('');
  
  const [leaderSpec1LabelKz, setLeaderSpec1LabelKz] = useState('');
  const [leaderSpec1LabelRu, setLeaderSpec1LabelRu] = useState('');
  const [leaderSpec1LabelEn, setLeaderSpec1LabelEn] = useState('');
  const [leaderSpec1Val, setLeaderSpec1Val] = useState('');
  const [leaderSpec2LabelKz, setLeaderSpec2LabelKz] = useState('');
  const [leaderSpec2LabelRu, setLeaderSpec2LabelRu] = useState('');
  const [leaderSpec2LabelEn, setLeaderSpec2LabelEn] = useState('');
  const [leaderSpec2Val, setLeaderSpec2Val] = useState('');

  const [isAddingNewLeader, setIsAddingNewLeader] = useState(false);

  // Contacts & About Company CMS Editing States
  const [contAboutTitleKz, setContAboutTitleKz] = useState('');
  const [contAboutTitleRu, setContAboutTitleRu] = useState('');
  const [contAboutTitleEn, setContAboutTitleEn] = useState('');
  const [contAboutSubtitleKz, setContAboutSubtitleKz] = useState('');
  const [contAboutSubtitleRu, setContAboutSubtitleRu] = useState('');
  const [contAboutSubtitleEn, setContAboutSubtitleEn] = useState('');
  const [contAboutDescKz, setContAboutDescKz] = useState('');
  const [contAboutDescRu, setContAboutDescRu] = useState('');
  const [contAboutDescEn, setContAboutDescEn] = useState('');
  
  const [contStatVolKz, setContStatVolKz] = useState('');
  const [contStatVolRu, setContStatVolRu] = useState('');
  const [contStatVolEn, setContStatVolEn] = useState('');
  const [contStatVolVal, setContStatVolVal] = useState('');

  const [contStatTanksKz, setContStatTanksKz] = useState('');
  const [contStatTanksRu, setContStatTanksRu] = useState('');
  const [contStatTanksEn, setContStatTanksEn] = useState('');
  const [contStatTanksVal, setContStatTanksVal] = useState('');

  const [contStatLaunchKz, setContStatLaunchKz] = useState('');
  const [contStatLaunchRu, setContStatLaunchRu] = useState('');
  const [contStatLaunchEn, setContStatLaunchEn] = useState('');
  const [contStatLaunchVal, setContStatLaunchVal] = useState('');

  const [contStatDistKz, setContStatDistKz] = useState('');
  const [contStatDistRu, setContStatDistRu] = useState('');
  const [contStatDistEn, setContStatDistEn] = useState('');
  const [contStatDistVal, setContStatDistVal] = useState('');

  const [contAddressKz, setContAddressKz] = useState('');
  const [contAddressRu, setContAddressRu] = useState('');
  const [contAddressEn, setContAddressEn] = useState('');
  
  const [contPhone, setContPhone] = useState('');
  const [contEmail, setContEmail] = useState('');

  const [contHoursKz, setContHoursKz] = useState('');
  const [contHoursRu, setContHoursRu] = useState('');
  const [contHoursEn, setContHoursEn] = useState('');

  React.useEffect(() => {
    if (contactsState) {
      setContAboutTitleKz(contactsState.aboutTitleKz || '');
      setContAboutTitleRu(contactsState.aboutTitleRu || '');
      setContAboutTitleEn(contactsState.aboutTitleEn || '');
      setContAboutSubtitleKz(contactsState.aboutSubtitleKz || '');
      setContAboutSubtitleRu(contactsState.aboutSubtitleRu || '');
      setContAboutSubtitleEn(contactsState.aboutSubtitleEn || '');
      setContAboutDescKz(contactsState.aboutDescKz || '');
      setContAboutDescRu(contactsState.aboutDescRu || '');
      setContAboutDescEn(contactsState.aboutDescEn || '');
      
      setContStatVolKz(contactsState.statVolKz || '');
      setContStatVolRu(contactsState.statVolRu || '');
      setContStatVolEn(contactsState.statVolEn || '');
      setContStatVolVal(contactsState.statVolValue || '');

      setContStatTanksKz(contactsState.statTanksKz || '');
      setContStatTanksRu(contactsState.statTanksRu || '');
      setContStatTanksEn(contactsState.statTanksEn || '');
      setContStatTanksVal(contactsState.statTanksValue || '');

      setContStatLaunchKz(contactsState.statLaunchKz || '');
      setContStatLaunchRu(contactsState.statLaunchRu || '');
      setContStatLaunchEn(contactsState.statLaunchEn || '');
      setContStatLaunchVal(contactsState.statLaunchValue || '');

      setContStatDistKz(contactsState.statDistKz || '');
      setContStatDistRu(contactsState.statDistRu || '');
      setContStatDistEn(contactsState.statDistEn || '');
      setContStatDistVal(contactsState.statDistValue || '');

      setContAddressKz(contactsState.addressValKz || '');
      setContAddressRu(contactsState.addressValRu || '');
      setContAddressEn(contactsState.addressValEn || '');
      
      setContPhone(contactsState.phone || '');
      setContEmail(contactsState.email || '');

      setContHoursKz(contactsState.hoursValKz || '');
      setContHoursRu(contactsState.hoursValRu || '');
      setContHoursEn(contactsState.hoursValEn || '');
    }
  }, [contactsState]);

  // Slideshow CMS list management states
  const [slides, setSlides] = useState<any[]>(() => {
    return bannersState.slides || [
      {
        id: 'slide_default_1',
        titleKz: bannersState.heroTitleKz || '',
        titleRu: bannersState.heroTitleRu || '',
        titleEn: bannersState.heroTitleEn || '',
        descKz: bannersState.heroDescKz || '',
        descRu: bannersState.heroDescRu || '',
        descEn: bannersState.heroDescEn || '',
        bgType: 'image',
        bgImage: bannersState.heroImage || '/src/assets/images/energy_terminal_bg_1781522513129.jpg',
        bgGradient: 'from-blue-950 via-slate-900 to-indigo-950',
        overlayOpacity: 0.85,
        buttonTextKz: 'Толығырақ',
        buttonTextRu: 'Подробнее',
        buttonTextEn: 'Details',
        buttonLink: '/prices',
        isActive: true,
        textAlign: 'left'
      }
    ];
  });

  const [sliderAutoplay, setSliderAutoplay] = useState(bannersState.autoplay !== false);
  const [sliderAutoplaySpeed, setSliderAutoplaySpeed] = useState(bannersState.autoplaySpeed || 5);
  const [sliderShowIndicators, setSliderShowIndicators] = useState(bannersState.showIndicators !== false);
  const [sliderShowArrows, setSliderShowArrows] = useState(bannersState.showArrows !== false);

  // Selected slide to edit / create state
  const [editingSlideId, setEditingSlideId] = useState<string | null>(null);
  
  // Fields for slide editor
  const [slideTitleKz, setSlideTitleKz] = useState('');
  const [slideTitleRu, setSlideTitleRu] = useState('');
  const [slideTitleEn, setSlideTitleEn] = useState('');
  const [slideDescKz, setSlideDescKz] = useState('');
  const [slideDescRu, setSlideDescRu] = useState('');
  const [slideDescEn, setSlideDescEn] = useState('');
  const [slideBgType, setSlideBgType] = useState<'image' | 'gradient'>('image');
  const [slideBgImage, setSlideBgImage] = useState('');
  const [slideBgGradient, setSlideBgGradient] = useState('from-blue-950 via-slate-900 to-indigo-950');
  const [slideOverlayOpacity, setSlideOverlayOpacity] = useState(0.85);
  const [slideButtonTextKz, setSlideButtonTextKz] = useState('');
  const [slideButtonTextRu, setSlideButtonTextRu] = useState('');
  const [slideButtonTextEn, setSlideButtonTextEn] = useState('');
  const [slideButtonLink, setSlideButtonLink] = useState('/prices');
  const [slideTextAlign, setSlideTextAlign] = useState<'left' | 'center' | 'right'>('left');
  const [slideIsActive, setSlideIsActive] = useState(true);

  const [isAddingNewSlide, setIsAddingNewSlide] = useState(false);

  const startEditingSlide = (slide: any) => {
    setEditingSlideId(slide.id);
    setSlideTitleKz(slide.titleKz || '');
    setSlideTitleRu(slide.titleRu || '');
    setSlideTitleEn(slide.titleEn || '');
    setSlideDescKz(slide.descKz || '');
    setSlideDescRu(slide.descRu || '');
    setSlideDescEn(slide.descEn || '');
    setSlideBgType(slide.bgType || 'image');
    setSlideBgImage(slide.bgImage || '');
    setSlideBgGradient(slide.bgGradient || 'from-blue-950 via-slate-900 to-indigo-950');
    setSlideOverlayOpacity(slide.overlayOpacity !== undefined ? slide.overlayOpacity : 0.85);
    setSlideButtonTextKz(slide.buttonTextKz || '');
    setSlideButtonTextRu(slide.buttonTextRu || '');
    setSlideButtonTextEn(slide.buttonTextEn || '');
    setSlideButtonLink(slide.buttonLink || '/prices');
    setSlideTextAlign(slide.textAlign || 'left');
    setSlideIsActive(slide.isActive !== false);
    setIsAddingNewSlide(false);
  };

  const startAddingSlide = () => {
    setEditingSlideId(null);
    setSlideTitleKz('');
    setSlideTitleRu('');
    setSlideTitleEn('');
    setSlideDescKz('');
    setSlideDescRu('');
    setSlideDescEn('');
    setSlideBgType('image');
    setSlideBgImage('https://images.unsplash.com/photo-1540962351504-03099e0a754b?auto=format&fit=crop&w=800&q=80');
    setSlideBgGradient('from-[#0b132b] via-[#1c2541] to-[#3a506b]');
    setSlideOverlayOpacity(0.85);
    setSlideButtonTextKz('Бағаларды Көру');
    setSlideButtonTextRu('Посмотреть Цены');
    setSlideButtonTextEn('View Prices');
    setSlideButtonLink('/prices');
    setSlideTextAlign('left');
    setSlideIsActive(true);
    setIsAddingNewSlide(true);
  };

  const saveSlideChanges = () => {
    if (isAddingNewSlide) {
      const newSlide = {
        id: `slide_${Date.now()}`,
        titleKz: slideTitleKz || 'Жаңа слайд',
        titleRu: slideTitleRu || 'Новый слайд',
        titleEn: slideTitleEn || 'New Slide',
        descKz: slideDescKz,
        descRu: slideDescRu,
        descEn: slideDescEn,
        bgType: slideBgType,
        bgImage: slideBgImage,
        bgGradient: slideBgGradient,
        overlayOpacity: Number(slideOverlayOpacity),
        buttonTextKz: slideButtonTextKz,
        buttonTextRu: slideButtonTextRu,
        buttonTextEn: slideButtonTextEn,
        buttonLink: slideButtonLink,
        textAlign: slideTextAlign,
        isActive: slideIsActive
      };
      setSlides([...slides, newSlide]);
      setIsAddingNewSlide(false);
    } else if (editingSlideId) {
      setSlides(slides.map(s => s.id === editingSlideId ? {
        ...s,
        titleKz: slideTitleKz,
        titleRu: slideTitleRu,
        titleEn: slideTitleEn,
        descKz: slideDescKz,
        descRu: slideDescRu,
        descEn: slideDescEn,
        bgType: slideBgType,
        bgImage: slideBgImage,
        bgGradient: slideBgGradient,
        overlayOpacity: Number(slideOverlayOpacity),
        buttonTextKz: slideButtonTextKz,
        buttonTextRu: slideButtonTextRu,
        buttonTextEn: slideButtonTextEn,
        buttonLink: slideButtonLink,
        textAlign: slideTextAlign,
        isActive: slideIsActive
      } : s));
      setEditingSlideId(null);
    }
  };

  const deleteSlide = (id: string) => {
    if (slides.length <= 1) {
      safeAlert(lang === 'kz' ? 'Жүйеде кем дегенде 1 слайд қалуы керек!' : 'В системе должен оставаться как минимум 1 слайд!');
      return;
    }
    setSlides(slides.filter(s => s.id !== id));
    if (editingSlideId === id) setEditingSlideId(null);
  };

  const moveSlide = (index: number, direction: 'up' | 'down') => {
    const nextIndex = direction === 'up' ? index - 1 : index + 1;
    if (nextIndex < 0 || nextIndex >= slides.length) return;
    const newSlides = [...slides];
    const temp = newSlides[index];
    newSlides[index] = newSlides[nextIndex];
    newSlides[nextIndex] = temp;
    setSlides(newSlides);
  };

  // Spot prices add modal
  const [isAddSpotOpen, setIsAddSpotOpen] = useState(false);
  const [spotFuelName, setSpotFuelName] = useState('');
  const [spotStandard, setSpotStandard] = useState('EURO');
  const [spotLabel, setSpotLabel] = useState('Standard');
  const [spotPrice, setSpotPrice] = useState(210);
  const [spotTrend, setSpotTrend] = useState<'up' | 'down' | 'neutral'>('up');
  const [spotPercent, setSpotPercent] = useState('+1.0%');

  // Managed Prices CMS States
  const [isAddManagedOpen, setIsAddManagedOpen] = useState(false);
  const [newManagedName, setNewManagedName] = useState('');
  const [newManagedCategory, setNewManagedCategory] = useState<string>('singapore');
  const [newManagedCustomCategory, setNewManagedCustomCategory] = useState<string>('');
  const [newManagedPriceRetail, setNewManagedPriceRetail] = useState('');
  const [newManagedPriceWholesale, setNewManagedPriceWholesale] = useState('');
  const [newManagedDesc, setNewManagedDesc] = useState('');
  const [newManagedStandard, setNewManagedStandard] = useState('EURO-5');

  // Inline Row Edit States for Managed Prices Table
  const [editingManagedId, setEditingManagedId] = useState<string | null>(null);
  const [editManagedName, setEditManagedName] = useState('');
  const [editManagedCategory, setEditManagedCategory] = useState('');
  const [editManagedCustomCategory, setEditManagedCustomCategory] = useState('');
  const [editManagedStandard, setEditManagedStandard] = useState('');
  const [editManagedDesc, setEditManagedDesc] = useState('');
  const [editManagedPriceRetail, setEditManagedPriceRetail] = useState('');
  const [editManagedPriceWholesale, setEditManagedPriceWholesale] = useState('');

  // Wholesale region prices edit state
  const [selectedRegion, setSelectedRegion] = useState<'Almaty' | 'Astana' | 'Shymkent' | 'Atyrau'>('Almaty');
  const [isAddWholesaleOpen, setIsAddWholesaleOpen] = useState(false);
  const [wName, setWName] = useState('');
  const [wCategory, setWCategory] = useState<'auto' | 'aviation'>('auto');
  const [wStandard, setWStandard] = useState('EURO-5');
  const [wPrice, setWPrice] = useState(250);

  // Stations add modal
  const [isAddStationOpen, setIsAddStationOpen] = useState(false);
  const [newStationName, setNewStationName] = useState('');
  const [newStationId, setNewStationId] = useState('');
  const [tank1Fuel, setTank1Fuel] = useState('AI-95 Premium');
  const [tank1Volume, setTank1Volume] = useState(40);
  const [tank1Capacity, setTank1Capacity] = useState(60);
  const [tank2Fuel, setTank2Fuel] = useState('AI-92 Standard');
  const [tank2Volume, setTank2Volume] = useState(30);
  const [tank2Capacity, setTank2Capacity] = useState(60);

  if (role !== 'admin') {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-8 text-center bg-slate-50">
        <Shield className="w-16 h-16 text-red-500 mb-4 animate-bounce" />
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Рұқсат шектелген / Access Denied</h1>
        <p className="text-slate-500 mt-2 max-w-md text-sm sm:text-base">
          Сізде бұл бетті қарауға жеткілікті құқықтар жоқ. Рөліңізді жоғарғы оң жақта "Админ" деп орнатып, қайталап көріңіз.
        </p>
      </div>
    );
  }

  // Handle Save corporate banner values
  const handleSaveBanners = () => {
    setIsSavingBanners(true);
    setTimeout(() => {
      const firstActive = slides.find(s => s.isActive) || slides[0] || {};
      updateBannersState({
        heroTitleKz: firstActive.titleKz || bKzTitle,
        heroTitleRu: firstActive.titleRu || bRuTitle,
        heroTitleEn: firstActive.titleEn || bEnTitle,
        heroDescKz: firstActive.descKz || bKzDesc,
        heroDescRu: firstActive.descRu || bRuDesc,
        heroDescEn: firstActive.descEn || bEnDesc,
        heroImage: firstActive.bgImage || bImage,
        autoplay: sliderAutoplay,
        autoplaySpeed: Number(sliderAutoplaySpeed),
        showIndicators: sliderShowIndicators,
        showArrows: sliderShowArrows,
        slides: slides
      });
      setIsSavingBanners(false);
      logUserAction(`Промо слайдер параметрлері мен жүйелік баннерлері сәтті жаңартылды`);
      safeAlert(lang === 'kz' ? 'Промо слайдер мәліметтері сәтті сақталды!' : lang === 'ru' ? 'Данные промо-слайдера успешно сохранены!' : 'Promo slider updated successfully!');
    }, 600);
  };

  // Add baseline Fuel Spot rate
  const handleAddSpotFuel = (e: React.FormEvent) => {
    e.preventDefault();
    if (!spotFuelName.trim()) return;
    addSpotRate({
      name: spotFuelName,
      standard: spotStandard,
      statusLabel: spotLabel,
      price: Number(spotPrice),
      trend: spotTrend,
      percentage: spotPercent
    });
    setSpotFuelName('');
    setIsAddSpotOpen(false);
  };

  // Add wholesale regional rate fuel
  const handleAddWholesaleFuel = (e: React.FormEvent) => {
    e.preventDefault();
    if (!wName.trim()) return;
    addRegionRateFuel(selectedRegion, {
      name: wName,
      category: wCategory,
      standard: wStandard,
      price: Number(wPrice)
    });
    setWName('');
    setIsAddWholesaleOpen(false);
  };

  // Add managed price handler
  const submitNewManagedPrice = (e: React.FormEvent) => {
    e.preventDefault();
    const finalCategory = newManagedCategory === 'custom' ? newManagedCustomCategory.trim().toLowerCase() : newManagedCategory;
    if (!newManagedName.trim() || !finalCategory) return;

    let retail = Number(newManagedPriceRetail);
    let wholesale = retail;

    if (newManagedCategory === 'smartme') {
      retail = Number(newManagedPriceRetail);
      wholesale = Number(newManagedPriceWholesale);
    }

    addManagedPrice({
      name: newManagedName.trim(),
      category: finalCategory,
      priceRetail: retail,
      priceWholesale: wholesale,
      description: newManagedDesc.trim() || 'Ресми баға көрсеткіші',
      standard: newManagedStandard || 'EURO-5'
    });

    setNewManagedName('');
    setNewManagedCategory('singapore');
    setNewManagedCustomCategory('');
    setNewManagedPriceRetail('');
    setNewManagedPriceWholesale('');
    setNewManagedDesc('');
    setNewManagedStandard('EURO-5');
    setIsAddManagedOpen(false);
  };

  const startEditingManaged = (item: ManagedPrice) => {
    setEditingManagedId(item.id);
    setEditManagedName(item.name);
    setEditManagedCategory(['singapore', 'argus', 'smartme'].includes(item.category) ? item.category : 'custom');
    setEditManagedCustomCategory(['singapore', 'argus', 'smartme'].includes(item.category) ? '' : item.category);
    setEditManagedStandard(item.standard || '');
    setEditManagedDesc(item.description || '');
    setEditManagedPriceRetail(item.priceRetail.toString());
    setEditManagedPriceWholesale(item.priceWholesale.toString());
  };

  const saveEditedManaged = (id: string) => {
    const finalCategory = editManagedCategory === 'custom' ? editManagedCustomCategory.trim().toLowerCase() : editManagedCategory;
    if (!editManagedName.trim() || !finalCategory) return;
    
    const retail = Number(editManagedPriceRetail);
    const wholesale = editManagedCategory === 'smartme' ? Number(editManagedPriceWholesale) : retail;
    
    updateManagedPrice(id, {
      name: editManagedName.trim(),
      category: finalCategory,
      standard: editManagedStandard,
      description: editManagedDesc.trim(),
      priceRetail: retail,
      priceWholesale: wholesale
    });
    setEditingManagedId(null);
  };

  const cancelEditingManaged = () => {
    setEditingManagedId(null);
  };

  // Add Station handler
  const handleAddStationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStationName.trim() || !newStationId.trim()) return;
    addStation(newStationName, newStationId.toUpperCase(), [
      { fuel: tank1Fuel, volume: Number(tank1Volume), capacity: Number(tank1Capacity), color: 'bg-blue-500', stroke: '#3b82f6' },
      { fuel: tank2Fuel, volume: Number(tank2Volume), capacity: Number(tank2Capacity), color: 'bg-amber-500', stroke: '#f59e0b' }
    ]);
    setNewStationName('');
    setNewStationId('');
    setIsAddStationOpen(false);
  };

  // Filters audit logs
  const filteredLogs = auditLogs.filter(log => {
    // Role-based access control: Operator can only see their own actions
    if (role !== 'admin') {
      if (!currentUser || log.username !== currentUser.username) {
        return false;
      }
    }

    const matchesSearch = log.user.toLowerCase().includes(logSearch.toLowerCase()) || 
                          log.action.toLowerCase().includes(logSearch.toLowerCase()) ||
                          log.email.toLowerCase().includes(logSearch.toLowerCase());
    const matchesRole = logRoleFilter === 'all' ? true : log.role === logRoleFilter;
    return matchesSearch && matchesRole;
  });

  const exportToExcel = () => {
    // UTF-8 BOM so Excel displays Kazakh/Russian Cyrillic correctly
    let csvContent = "\uFEFF";
    csvContent += "ID,Қолданушы (Username/Email),Толық аты (Full Name),Рөлі (Role),Әрекет (Action),Өзгерген өріс (Field),Ескі мән (Old Value),Жаңа мән (New Value),Әрекет түрі (Type),Уақыты (Timestamp)\n";
    
    filteredLogs.forEach(log => {
      const username = log.email ? log.email.split('@')[0] : 'guest';
      const row = [
        log.id,
        `@${username}`,
        `"${(log.user || '').replace(/"/g, '""')}"`,
        log.role,
        `"${(log.action || '').replace(/"/g, '""')}"`,
        `"${(log.fieldChanged || '').replace(/"/g, '""')}"`,
        `"${(log.oldValue || '').replace(/"/g, '""')}"`,
        `"${(log.newValue || '').replace(/"/g, '""')}"`,
        `"${(log.operationType || 'INFO').replace(/"/g, '""')}"`,
        log.timestamp
      ].join(",");
      csvContent += row + "\n";
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `mercury_audit_logs_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    logUserAction('Аудит журналын Excel форматында экспорттады');
  };

  const exportToPDF = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const rowsHtml = filteredLogs.map(log => {
      const username = log.email ? log.email.split('@')[0] : 'guest';
      return `
      <tr style="border-bottom: 1px solid #e2e8f0; font-size: 11px;">
        <td style="padding: 8px; font-family: monospace;">${log.timestamp}</td>
        <td style="padding: 8px;"><strong>${log.user}</strong><br/><span style="color: #64748b; font-family: monospace;">@${username} (${log.role})</span></td>
        <td style="padding: 8px; color: #1e293b;">${log.action}</td>
        <td style="padding: 8px; font-family: monospace; font-size: 10px; color: #475569;">
          ${log.fieldChanged ? `<strong>Өріс:</strong> ${log.fieldChanged}<br/>` : ''}
          ${log.oldValue ? `<span style="color: #ef4444;">Ескі: ${log.oldValue}</span><br/>` : ''}
          ${log.newValue ? `<span style="color: #10b981;">Жаңа: ${log.newValue}</span>` : ''}
        </td>
      </tr>
      `;
    }).join('');

    printWindow.document.write(`
      <html>
        <head>
          <title>Mercury Energy - Жүйелік Қозғалысты Аудиттеу Журналы</title>
          <style>
            body { font-family: 'Inter', sans-serif; padding: 40px; color: #1e293b; }
            .header { border-bottom: 3px solid #2563eb; padding-bottom: 20px; margin-bottom: 30px; }
            .title { font-size: 24px; font-weight: 800; color: #1e3a8a; margin: 0; }
            .subtitle { font-size: 12px; color: #64748b; margin-top: 5px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th { background-color: #f8fafc; padding: 10px; text-align: left; font-size: 11px; font-weight: 700; border-bottom: 2px solid #cbd5e1; text-transform: uppercase; }
            .footer { margin-top: 40px; border-top: 1px solid #e2e8f0; padding-top: 20px; font-size: 10px; color: #94a3b8; text-align: center; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1 class="title">SMARTME / MERCURY ENERGY</h1>
            <p class="subtitle">Жүйелік қауіпсіздік және өзгерістерді аудиттеу журналы</p>
            <p style="font-size: 11px; color: #475569; margin-top: 10px;">
              <strong>Құжат жасалған уақыт:</strong> ${new Date().toLocaleString()}<br/>
              <strong>Жалпы жазбалар саны:</strong> ${filteredLogs.length}
            </p>
          </div>
          <table>
            <thead>
              <tr>
                <th style="width: 15%;">Уақыты</th>
                <th style="width: 25%;">Пайдаланушы</th>
                <th style="width: 35%;">Әрекет</th>
                <th style="width: 25%;">Өзгеріс мәндері</th>
              </tr>
            </thead>
            <tbody>
              ${rowsHtml}
            </tbody>
          </table>
          <div class="footer">
            <p>© Mercury Energy - Барлық құқықтар қорғалған. Бақылау журналы автоматты түрде жасалды.</p>
          </div>
          <script>
            window.onload = function() {
              window.print();
              setTimeout(function() { window.close(); }, 500);
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
    logUserAction('Аудит журналын PDF форматында жүктеді');
  };

  return (
    <div className={hideHeaderAndTabs ? "w-full text-slate-800" : "min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8"}>
      <div className={hideHeaderAndTabs ? "space-y-6 w-full" : "max-w-full mx-auto space-y-8"}>
        
        {/* Header Title with security badge and active profile */}
        {!hideHeaderAndTabs && (
          <div className="bg-slate-900 text-white rounded-[32px] p-6 sm:p-8 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden border border-slate-800">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -z-10" />
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-amber-400 text-slate-900 text-[10px] font-black tracking-widest uppercase rounded-full font-mono flex items-center gap-1.5 shadow-sm">
                  <Shield className="w-3.5 h-3.5" />
                  SUPERADMIN CONTROL HUB
                </span>
                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Live Engine
                </span>
              </div>
              <h1 className="text-2xl sm:text-3.5xl font-black tracking-tight leading-tight">
                Басқару Жүйесі & CMS Орталығы
              </h1>
              <p className="text-slate-400 text-xs sm:text-sm max-w-2xl font-light">
                Порталдағы ақпаратты, басты беттің баннерлерін, жанар-жағармай бағаларын, ресми жанармай құю стансаларын (ЖҚС) және тіркелген пайдаланушылардың рұқсат деңгейлерін тікелей басқаруға арналған қауіпсіз интерфейс.
              </p>
            </div>

            <div className="flex items-center gap-4 bg-slate-800/60 p-4 rounded-2xl border border-slate-700/50">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-black text-sm uppercase shadow font-mono">
                {currentUser?.username.substring(0, 2) || 'AD'}
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-500 block leading-none font-mono">Қосылған Админ</span>
                <span className="text-xs font-bold text-slate-100 block">{currentUser?.fullName}</span>
                <span className="text-[10px] text-slate-400 font-mono block mt-0.5">{currentUser?.email}</span>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Admin Tabs */}
        {!hideHeaderAndTabs && (
          <div className="flex flex-wrap gap-2 pb-1 border-b border-slate-200">
            <button
              onClick={() => setActiveTab('banners')}
              className={`flex items-center gap-2 px-5 py-3 text-xs sm:text-sm font-bold rounded-t-2xl border-t-2 transition-all cursor-pointer ${
                activeTab === 'banners'
                  ? 'bg-white border-blue-600 text-blue-700 font-black shadow-sm'
                  : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-100/50'
              }`}
            >
              <Image className="w-4 h-4" />
              <span>Контент (CMS)</span>
            </button>
            
            <button
              onClick={() => setActiveTab('prices')}
              className={`flex items-center gap-2 px-5 py-3 text-xs sm:text-sm font-bold rounded-t-2xl border-t-2 transition-all cursor-pointer ${
                activeTab === 'prices'
                  ? 'bg-white border-blue-600 text-blue-700 font-black shadow-sm'
                  : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-100/50'
              }`}
            >
              <Coins className="w-4 h-4" />
              <span>Бағаларды Басқару</span>
            </button>

            <button
              onClick={() => setActiveTab('stations')}
              className={`flex items-center gap-2 px-5 py-3 text-xs sm:text-sm font-bold rounded-t-2xl border-t-2 transition-all cursor-pointer ${
                activeTab === 'stations'
                  ? 'bg-white border-blue-600 text-blue-700 font-black shadow-sm'
                  : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-100/50'
              }`}
            >
              <MapPin className="w-4 h-4" />
              <span>ЖҚС Бекеттері</span>
            </button>

            <button
              onClick={() => setActiveTab('tanks')}
              className={`flex items-center gap-2 px-5 py-3 text-xs sm:text-sm font-bold rounded-t-2xl border-t-2 transition-all cursor-pointer ${
                activeTab === 'tanks'
                  ? 'bg-white border-blue-600 text-blue-700 font-black shadow-sm'
                  : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-100/50'
              }`}
            >
              <Database className="w-4 h-4" />
              <span>Резервуарларды Басқару</span>
            </button>

            <button
              onClick={() => setActiveTab('users')}
              className={`flex items-center gap-2 px-5 py-3 text-xs sm:text-sm font-bold rounded-t-2xl border-t-2 transition-all cursor-pointer ${
                activeTab === 'users'
                  ? 'bg-white border-blue-600 text-blue-700 font-black shadow-sm'
                  : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-100/50'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Пайдаланушылар рұқсаты</span>
            </button>

            <button
              onClick={() => setActiveTab('logs')}
              className={`flex items-center gap-2 px-5 py-3 text-xs sm:text-sm font-bold rounded-t-2xl border-t-2 transition-all cursor-pointer ${
                activeTab === 'logs'
                  ? 'bg-white border-blue-600 text-blue-700 font-black shadow-sm'
                  : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-100/50'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Аудит Журналы (Audit Logs)</span>
              <span className="bg-blue-100 text-blue-700 text-[10px] px-1.5 py-0.5 rounded-md font-mono">
                {auditLogs.length}
              </span>
            </button>
          </div>
        )}

        {/* Main Workspace Frame container */}
        <div className={hideHeaderAndTabs ? "w-full" : "bg-white rounded-[28px] border border-slate-200 shadow-sm p-6 sm:p-8 min-h-[500px]"}>
          
          {/* TAB 1: CONTENT CMS (BANNERS, LEADERS, CONTACTS) */}
          {activeTab === 'banners' && (
            <div className="animate-fade-in">
              <CmsManagementPanel />
            </div>
          )}

          {/* TAB 2: PRICING CMS */}
          {activeTab === 'prices' && (
            <div className="space-y-8 animate-fade-in text-left">
              
              {/* Global Settings: Pricing Unit Switch */}
              <div className="p-5 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-3xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="space-y-1">
                  <h4 className="text-sm font-extrabold text-blue-900 flex items-center gap-2">
                    <Coins className="w-4 h-4 text-blue-600 animate-pulse" />
                    Бағаларды Көрсету Өлшем Бірлігі (Тонна / Литр)
                  </h4>
                  <p className="text-xs text-slate-600">
                    Қонақтар мен тұтынушыларға арналған ағымдағы бағалар панеліндегі барлық тарифтердің өлшем бірлігін таңдаңыз.
                  </p>
                </div>
                <div className="flex bg-white p-1 rounded-2xl border border-slate-200 shadow-sm shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      if (setPriceDisplayUnit) {
                        setPriceDisplayUnit('ton');
                        logUserAction('Баға көрсеткішінің өлшем бірлігі Тонна (тн) деп өзгертілді');
                      }
                    }}
                    className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                      priceDisplayUnit === 'ton'
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    Тоннамен (тн)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (setPriceDisplayUnit) {
                        setPriceDisplayUnit('liter');
                        logUserAction('Баға көрсеткішінің өлшем бірлігі Литр (л) деп өзгертілді');
                      }
                    }}
                    className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                      priceDisplayUnit === 'liter'
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    Литрмен (л)
                  </button>
                </div>
              </div>

              {/* Part 1: Spot Rates Editor */}
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-3 border-b border-slate-100">
                  <div>
                    <h3 className="text-base font-black text-slate-900">Бөлшек Сауда Спот Бағалары (Басты беттегі ең жоғарғы бағалар)</h3>
                    <p className="text-xs text-slate-500">Бұл бағалар басты беттің (Home) ең жоғарғы жағында, тікелей тақтада көрініс табады.</p>
                  </div>
                  <button
                    onClick={() => setIsAddSpotOpen(true)}
                    className="flex items-center gap-1.5 px-4 py-2 bg-slate-900 border border-slate-800 text-white hover:bg-slate-800 rounded-xl text-xs font-bold transition cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Жаңа Баға Блогын Қосу</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {spotRates.map((rate) => (
                    <div 
                      key={rate.id}
                      className="p-4 bg-slate-50 hover:bg-slate-100/60 rounded-2xl border border-slate-200 flex flex-col justify-between space-y-3 group transition"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-sm font-black text-slate-900">{rate.name}</span>
                            <span className="px-1.5 py-0.5 bg-slate-200 text-slate-700 text-[9px] font-mono rounded font-bold">{rate.standard}</span>
                          </div>
                          <p className="text-[10px] text-slate-500">{rate.statusLabel}</p>
                        </div>
                        <button
                          onClick={() => {
                            if (confirm(`${rate.name} бағасын тізімнен жойғыңыз келе ме?`)) {
                              deleteSpotRate(rate.id);
                              logUserAction(`Жүйе басты бетінен ${rate.name} спот отыны жойылды`);
                            }
                          }}
                          className="p-1.5 text-slate-400 hover:text-red-650 hover:bg-red-50 rounded-lg cursor-pointer transition"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Display pricing edit row */}
                      {(() => {
                        const density = getDensity(rate.name);
                        const isTon = priceDisplayUnit === 'ton';
                        const displayedVal = isTon 
                          ? Math.round((rate.price / density) * 1000) 
                          : rate.price;

                        return (
                          <div className="grid grid-cols-2 gap-2 bg-white p-2.5 rounded-xl border border-slate-150">
                            <div>
                              <span className="text-[9px] text-slate-400 block font-mono font-bold">
                                {isTon ? 'Бағасы (₸/тн):' : 'Бағасы (₸/л):'}
                              </span>
                              <input 
                                type="number" 
                                value={displayedVal}
                                onChange={(e) => {
                                  const newVal = Number(e.target.value);
                                  const savedPrice = isTon 
                                    ? (newVal * density) / 1000 
                                    : newVal;
                                  updateSpotRate(rate.id, { price: Math.round(savedPrice * 100) / 100 });
                                }}
                                className="w-full bg-transparent text-sm font-black text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono text-left"
                              />
                            </div>
                            <div>
                              <span className="text-[9px] text-slate-400 block font-mono font-bold">Бағыт (%) :</span>
                              <input 
                                type="text" 
                                value={rate.percentage || ''}
                                onChange={(e) => {
                                  updateSpotRate(rate.id, { percentage: e.target.value });
                                }}
                                className="w-full bg-transparent text-xs font-bold text-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-500 text-left"
                              />
                            </div>
                          </div>
                        );
                      })()}

                      <div className="flex justify-between items-center text-[10px]">
                        <span className="text-slate-500">Динамика үрдісі:</span>
                        <div className="flex p-0.5 bg-slate-200/50 rounded-lg">
                          {(['up', 'down', 'neutral'] as const).map(trendType => (
                            <button
                              key={trendType}
                              onClick={() => {
                                updateSpotRate(rate.id, { trend: trendType });
                              }}
                              className={`p-1.5 rounded-md cursor-pointer transition ${
                                rate.trend === trendType
                                  ? trendType === 'up' ? 'bg-emerald-500 text-white' : trendType === 'down' ? 'bg-red-500 text-white' : 'bg-slate-400 text-white'
                                  : 'text-slate-400 hover:text-slate-700'
                              }`}
                            >
                              {trendType === 'up' ? <TrendingUp className="w-3 h-3" /> : trendType === 'down' ? <TrendingDown className="w-3 h-3" /> : <Minus className="w-3 h-3" />}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Part 2: Regional Wholesale rates CMS */}
              <div className="space-y-4 pt-4 border-t border-slate-100">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-3">
                  <div>
                    <h3 className="text-base font-black text-slate-900">Көтерме Аймақтық Сауда Бағалары (Wholesale Rate Cards)</h3>
                    <p className="text-xs text-slate-500">Бұл бағалар калькулятор параметрлері мен зауыттық көтерме тарифтер кестесіне (Prices) тікелей әсер етеді.</p>
                  </div>
                  
                  {/* Select active region */}
                  <div className="flex p-1 bg-slate-100 rounded-xl border border-slate-200/80">
                    {(['Almaty', 'Astana', 'Shymkent', 'Atyrau'] as const).map(reg => (
                      <button
                        key={reg}
                        onClick={() => setSelectedRegion(reg)}
                        className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                          selectedRegion === reg
                            ? 'bg-blue-600 text-white shadow-sm'
                            : 'text-slate-650 hover:text-slate-900'
                        }`}
                      >
                        {reg === 'Almaty' ? 'Алматы' : reg === 'Astana' ? 'Астана' : reg === 'Shymkent' ? 'Шымкент' : 'Атырау'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Grid card displaying region rates */}
                <div className="bg-slate-50 p-6 rounded-[24px] border border-slate-200 space-y-4">
                  <div className="flex justify-between items-center sm:pb-2 border-b border-indigo-200/20">
                    <span className="text-xs font-black uppercase text-indigo-750 font-mono tracking-widest block">
                      {selectedRegion} өңірінің белсенді отын тарифтері
                    </span>
                    
                    <button
                      onClick={() => setIsAddWholesaleOpen(true)}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-100 hover:bg-blue-200 text-blue-800 rounded-lg text-xs font-bold transition cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Жаңа Отын Қосу</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {(regionRates[selectedRegion] || []).map((fuel: any) => (
                      <div 
                        key={fuel.name} 
                        className="bg-white p-4 rounded-xl border border-slate-200 hover:border-slate-350 shadow-sm flex flex-col justify-between space-y-2.5 transition"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="text-xs font-black text-slate-900 block">{fuel.name}</span>
                            <span className="text-[10px] text-slate-400 block">Санат: {fuel.category === 'aviation' ? '⚓ Авиациялық отын' : '🚗 Автокөлік отыны'}</span>
                          </div>
                          
                          <button
                            onClick={() => {
                              if (confirm(`${selectedRegion} өңірінен ${fuel.name} маркасын өшіргіңіз келе ме?`)) {
                                deleteRegionRateFuel(selectedRegion, fuel.name);
                              }
                            }}
                            className="p-1 text-slate-350 hover:text-red-650 rounded hover:bg-slate-100 cursor-pointer"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>

                        <div className="flex gap-2 items-end pt-1 justify-between border-t border-slate-50">
                          <div className="space-y-1">
                            <span className="text-[9px] text-slate-400 block font-mono">Стандарт:</span>
                            <input
                              type="text"
                              value={fuel.standard}
                              onChange={(e) => {
                                updateRegionRate(selectedRegion, fuel.name, fuel.price, e.target.value);
                              }}
                              className="px-2 py-1 bg-slate-50 border border-slate-200 text-[10px] rounded-md font-mono text-slate-700 w-20 text-center"
                            />
                          </div>

                          <div className="space-y-1">
                            <span className="text-[9px] text-slate-405 block font-mono font-extrabold text-indigo-700">Бағасы (KZT/лт/кг):</span>
                            <div className="flex items-center gap-1.5">
                              <input
                                type="number"
                                value={fuel.price}
                                onChange={(e) => {
                                  updateRegionRate(selectedRegion, fuel.name, Number(e.target.value), fuel.standard);
                                }}
                                className="px-2 py-1 bg-indigo-50/50 border border-indigo-200 text-xs text-indigo-950 font-bold rounded-md w-20 text-right focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                              />
                            </div>
                          </div>
                        </div>

                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Part 3: SmartME Managed Prices Index Database (Singapore, Argus, Wholesale, Retail) */}
              <div className="space-y-4 pt-8 border-t border-slate-100">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <div>
                    <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                      <Database className="w-5 h-5 text-indigo-660" />
                      Баға басқарудың кестелік ресми анықтамалығы (Managed Prices CRUD Index)
                    </h3>
                    <p className="text-xs text-slate-500">
                      Мұнда Сингапур биржасы, Argus Media өңірлік бағалары, сондай-ақ компанияның ресми Оптом (Wholesale) және Розничная (Retail) баға көздерін толық басқаруға болады. (Формат тек: ₸ / тонна).
                    </p>
                  </div>
                  
                  <button
                    type="button"
                    onClick={() => setIsAddManagedOpen(!isAddManagedOpen)}
                    className="flex items-center gap-1.5 px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition cursor-pointer shadow-sm border-0"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Жаңа Баға Индексін Қосу</span>
                  </button>
                </div>

                {/* Form to Add New Managed Price */}
                {isAddManagedOpen && (
                  <form onSubmit={submitNewManagedPrice} className="bg-slate-50 p-6 rounded-[20px] border border-slate-200/80 space-y-4 animate-fade-in text-left">
                    <h4 className="text-sm font-bold text-slate-900 border-b border-slate-250 pb-2 uppercase tracking-wider">Жаңа баға көрсеткішін енгізу</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* Name input */}
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-600 block">Атауы немесе Маркасы *</label>
                        <input
                          type="text"
                          required
                          placeholder="Мысалы: Jet A-1 Авиақатынас"
                          value={newManagedName}
                          onChange={(e) => setNewManagedName(e.target.value)}
                          className="w-full px-3 py-2 bg-white text-slate-800 border border-slate-300 rounded-lg text-xs font-bold focus:outline-none focus:ring-1 focus:ring-indigo-500 text-left"
                        />
                      </div>

                      {/* Category select */}
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-600 block">Орын/Баға санаты *</label>
                        <select
                          value={newManagedCategory}
                          onChange={(e) => setNewManagedCategory(e.target.value)}
                          className="w-full px-3 py-2 bg-white text-slate-850 border border-slate-300 rounded-lg text-xs font-bold focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        >
                          <option value="singapore">Сингапур биржалық тарифі (singapore)</option>
                          <option value="argus">Argus Price тарифі (argus)</option>
                          <option value="smartme">SmartME тарифі (smartme)</option>
                          <option value="custom">Жаңа санат (Қолмен жазу...) / Custom Option</option>
                        </select>
                      </div>

                      {/* Custom Category input */}
                      {newManagedCategory === 'custom' && (
                        <div className="space-y-1">
                          <label className="text-xs font-semibold text-indigo-600 block">Жаңа санат атауы (қолмен жазу) *</label>
                          <input
                            type="text"
                            required
                            placeholder="Мысалы: custom-category"
                            value={newManagedCustomCategory}
                            onChange={(e) => setNewManagedCustomCategory(e.target.value)}
                            className="w-full px-3 py-2 bg-white text-slate-800 border border-indigo-300 rounded-lg text-xs font-bold focus:outline-none focus:ring-1 focus:ring-indigo-500 text-left"
                          />
                        </div>
                      )}

                      {/* Dynamic Price Inputs */}
                      {newManagedCategory === 'smartme' ? (
                        <>
                          <div className="space-y-1">
                            <label className="text-xs font-semibold text-slate-600 block">Бөлшек бағасы (₸/тонна) *</label>
                            <input
                              type="number"
                              required
                              min="1"
                              placeholder="Бөлшек бағасы"
                              value={newManagedPriceRetail}
                              onChange={(e) => setNewManagedPriceRetail(e.target.value)}
                              className="w-full px-3 py-2 bg-white text-slate-800 border border-slate-300 rounded-lg text-xs font-mono font-bold focus:outline-none focus:ring-1 focus:ring-indigo-500"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-xs font-semibold text-slate-600 block">Көтерме бағасы (₸/тонна) *</label>
                            <input
                              type="number"
                              required
                              min="1"
                              placeholder="Көтерме бағасы"
                              value={newManagedPriceWholesale}
                              onChange={(e) => setNewManagedPriceWholesale(e.target.value)}
                              className="w-full px-3 py-2 bg-white text-slate-800 border border-slate-300 rounded-lg text-xs font-mono font-bold focus:outline-none focus:ring-1 focus:ring-indigo-500"
                            />
                          </div>
                        </>
                      ) : (
                        <div className="space-y-1">
                          <label className="text-xs font-semibold text-slate-600 block">Бағасы (₸/тонна) *</label>
                          <input
                            type="number"
                            required
                            min="1"
                            placeholder="Теңгемен/тоннасына"
                            value={newManagedPriceRetail}
                            onChange={(e) => setNewManagedPriceRetail(e.target.value)}
                            className="w-full px-3 py-2 bg-white text-slate-800 border border-slate-300 rounded-lg text-xs font-mono font-bold focus:outline-none focus:ring-1 focus:ring-indigo-500"
                          />
                        </div>
                      )}

                      {/* Standard grade */}
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-600 block">Отын стандарты</label>
                        <input
                          type="text"
                          placeholder="Мысалы: EURO-5"
                          value={newManagedStandard}
                          onChange={(e) => setNewManagedStandard(e.target.value)}
                          className="w-full px-3 py-2 bg-white text-slate-800 border border-slate-300 rounded-lg text-xs font-bold focus:outline-none focus:ring-1 focus:ring-indigo-500 text-left"
                        />
                      </div>

                      {/* Description */}
                      <div className="space-y-1 md:col-span-2">
                        <label className="text-xs font-semibold text-slate-600 block">Қосымша түсіндірме сипаттамасы</label>
                        <input
                          type="text"
                          placeholder="Қай өңірде немесе қай биржада қабылданғаны туралы қысқаша мәлімет"
                          value={newManagedDesc}
                          onChange={(e) => setNewManagedDesc(e.target.value)}
                          className="w-full px-3 py-2 bg-white text-slate-800 border border-slate-300 rounded-lg text-xs font-bold focus:outline-none focus:ring-1 focus:ring-indigo-500 text-left"
                        />
                      </div>
                    </div>

                    <div className="flex gap-2.5 justify-end pt-2 border-t border-slate-200">
                      <button
                        type="button"
                        onClick={() => setIsAddManagedOpen(false)}
                        className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-750 rounded-xl text-xs font-bold transition cursor-pointer border-0"
                      >
                        Болдырмау
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition cursor-pointer shadow-sm shadow-indigo-600/10 border-0"
                      >
                        Жаңа Бағаны Қосу (SAVE)
                      </button>
                    </div>
                  </form>
                )}

                {/* Table list representing CRUD */}
                <div className="overflow-x-auto bg-white rounded-2xl border border-slate-200 shadow-sm text-left">
                  <table className="min-w-full divide-y divide-slate-200 text-left">
                    <thead className="bg-slate-50 text-[10px] font-extrabold uppercase text-slate-500 tracking-wider">
                      <tr>
                        <th className="px-5 py-3.5">Атауы немесе маркасы</th>
                        <th className="px-5 py-3.5">Санаты</th>
                        <th className="px-5 py-3.5">Стандарты</th>
                        <th className="px-5 py-3.5">Сипаттамасы</th>
                        <th className="px-5 py-3.5">Бағасы (₸/тн)</th>
                        <th className="px-5 py-3.5 text-right">Әрекеттер</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 text-xs font-medium text-slate-700">
                      {managedPrices.map((item) => {
                        const isEditing = editingManagedId === item.id;
                        
                        return (
                          <tr key={item.id} className={`${isEditing ? 'bg-indigo-50/20' : 'hover:bg-slate-50'} transition`}>
                            {/* Name field */}
                            <td className="px-5 py-3">
                              {isEditing ? (
                                <input
                                  type="text"
                                  value={editManagedName}
                                  onChange={(e) => setEditManagedName(e.target.value)}
                                  className="px-2 py-1 bg-white border border-slate-350 text-slate-900 font-bold rounded text-xs w-full max-w-[160px] text-left"
                                />
                              ) : (
                                <span className="font-extrabold text-slate-900">{item.name}</span>
                              )}
                            </td>

                            {/* Category badge */}
                            <td className="px-5 py-3">
                              {isEditing ? (
                                <div className="space-y-1">
                                  <select
                                    value={editManagedCategory}
                                    onChange={(e) => setEditManagedCategory(e.target.value)}
                                    className="px-2 py-1 bg-white border border-slate-350 text-slate-900 rounded text-xs"
                                  >
                                    <option value="singapore">Singapore</option>
                                    <option value="argus">Argus Price</option>
                                    <option value="smartme">SmartME</option>
                                    <option value="custom">Custom (Қолмен...)</option>
                                  </select>
                                  {editManagedCategory === 'custom' && (
                                    <input
                                      type="text"
                                      placeholder="Санат атауы"
                                      value={editManagedCustomCategory}
                                      onChange={(e) => setEditManagedCustomCategory(e.target.value)}
                                      className="px-2 py-1 bg-white border border-rose-350 text-slate-900 rounded text-xs w-full"
                                    />
                                  )}
                                </div>
                              ) : (
                                <span className={`px-2.5 py-1 text-[9px] uppercase tracking-wider font-extrabold rounded-lg ${
                                  item.category === 'singapore' ? 'bg-amber-100 text-amber-805' :
                                  item.category === 'argus' ? 'bg-indigo-100 text-indigo-850' :
                                  item.category === 'smartme' ? 'bg-[#ff9f00]/15 text-[#b26a00]' :
                                  'bg-slate-100 text-slate-800'
                                }`}>
                                  {item.category === 'singapore' ? 'Singapore' :
                                   item.category === 'argus' ? 'Argus Price' :
                                   item.category === 'smartme' ? 'SmartME' : item.category}
                                </span>
                              )}
                            </td>

                            {/* Standard field */}
                            <td className="px-5 py-3">
                              {isEditing ? (
                                <input
                                  type="text"
                                  value={editManagedStandard}
                                  onChange={(e) => setEditManagedStandard(e.target.value)}
                                  className="px-2 py-1 bg-white border border-slate-350 text-slate-800 rounded font-mono text-xs w-20 text-center"
                                />
                              ) : (
                                <span className="font-mono text-slate-600">{item.standard || '—'}</span>
                              )}
                            </td>

                            {/* Description field */}
                            <td className="px-5 py-3 text-slate-500">
                              {isEditing ? (
                                <input
                                  type="text"
                                  value={editManagedDesc}
                                  onChange={(e) => setEditManagedDesc(e.target.value)}
                                  className="px-2 py-1 bg-white border border-slate-350 text-slate-800 rounded text-xs w-full max-w-[240px]"
                                />
                              ) : (
                                <span className="text-slate-500">{item.description || '—'}</span>
                              )}
                            </td>

                            {/* Price field */}
                            <td className="px-5 py-3 font-mono text-slate-900">
                              {isEditing ? (
                                <div className="space-y-1.5 min-w-[130px]">
                                  {editManagedCategory === 'smartme' ? (
                                    <div className="space-y-1">
                                      <div className="flex items-center gap-1">
                                        <span className="text-[9px] font-bold text-slate-500 w-10 text-right">Бөлшек:</span>
                                        <input
                                          type="number"
                                          value={editManagedPriceRetail}
                                          onChange={(e) => setEditManagedPriceRetail(e.target.value)}
                                          className="px-2 py-0.5 border border-slate-350 rounded font-bold text-xs text-right w-20"
                                        />
                                      </div>
                                      <div className="flex items-center gap-1">
                                        <span className="text-[9px] font-bold text-slate-500 w-10 text-right">Көтерме:</span>
                                        <input
                                          type="number"
                                          value={editManagedPriceWholesale}
                                          onChange={(e) => setEditManagedPriceWholesale(e.target.value)}
                                          className="px-2 py-0.5 border border-slate-350 rounded font-bold text-xs text-right w-20"
                                        />
                                      </div>
                                    </div>
                                  ) : (
                                    <div className="flex items-center gap-1">
                                      <span className="text-[9px] font-bold text-slate-500 shrink-0">Баға:</span>
                                      <input
                                        type="number"
                                        value={editManagedPriceRetail}
                                        onChange={(e) => setEditManagedPriceRetail(e.target.value)}
                                        className="px-2 py-1 border border-slate-350 rounded font-bold text-xs text-right w-24"
                                      />
                                    </div>
                                  )}
                                </div>
                              ) : (
                                <div className="flex flex-col gap-0.5">
                                  {item.category === 'smartme' ? (
                                    <>
                                      <div className="flex items-baseline gap-1 text-[11px]">
                                        <span className="text-slate-500 font-sans font-semibold">Бөлшек:</span>
                                        <span className="font-extrabold text-indigo-750">{item.priceRetail.toLocaleString('kk-KZ')} ₸</span>
                                      </div>
                                      <div className="flex items-baseline gap-1 text-[11px]">
                                        <span className="text-slate-500 font-sans font-semibold">Көтерме:</span>
                                        <span className="font-extrabold text-indigo-750">{item.priceWholesale.toLocaleString('kk-KZ')} ₸</span>
                                      </div>
                                    </>
                                  ) : (
                                    <div className="font-extrabold text-indigo-700 text-xs">
                                      {item.priceRetail.toLocaleString('kk-KZ')} ₸ / тн
                                    </div>
                                  )}
                                </div>
                              )}
                            </td>

                            {/* Actions column */}
                            <td className="px-5 py-3 text-right">
                              {isEditing ? (
                                <div className="flex justify-end gap-1.5">
                                  <button
                                    type="button"
                                    onClick={() => saveEditedManaged(item.id)}
                                    className="p-1 px-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg cursor-pointer font-bold text-[10px] flex items-center gap-1 transition"
                                  >
                                    <Check className="w-3.5 h-3.5" />
                                    <span>Сақтау</span>
                                  </button>
                                  <button
                                    type="button"
                                    onClick={cancelEditingManaged}
                                    className="p-1 px-2 bg-slate-300 hover:bg-slate-400 text-slate-750 rounded-lg cursor-pointer font-bold text-[10px] flex items-center gap-1 transition"
                                  >
                                    <X className="w-3.5 h-3.5" />
                                    <span>Қайтару</span>
                                  </button>
                                </div>
                              ) : (
                                <div className="flex justify-end gap-2">
                                  <button
                                    type="button"
                                    onClick={() => startEditingManaged(item)}
                                    className="px-2 py-1 text-indigo-600 hover:text-indigo-900 rounded hover:bg-indigo-50 cursor-pointer transition text-xs font-bold"
                                  >
                                    Өзгерту
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      if (confirm(`"${item.name}" баға көрсеткішін жүйеден біржола өшіруді растайсыз ба?`)) {
                                        deleteManagedPrice(item.id);
                                      }
                                    }}
                                    className="px-2 py-1 text-rose-600 hover:text-rose-900 rounded hover:bg-rose-50 cursor-pointer transition text-xs font-bold"
                                  >
                                    Жою
                                  </button>
                                </div>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* TAB 3: STATIONS CONTROL CENTER */}
          {activeTab === 'stations' && (
            <div className="space-y-6 animate-fade-in text-left">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-3 border-b border-slate-100">
                <div>
                  <h3 className="text-lg font-black text-slate-900">Жанармай Бекеттері мен Мұнайбаза Қорлары (Gas Stations & Depots CMS)</h3>
                  <p className="text-xs text-slate-500">Резервуарларды бақылау жүйесіндегі белсенді жанармай құю кешендері мен әрбір бекеттің сипаттарын реттеу.</p>
                </div>
                
                <button
                  onClick={() => setIsAddStationOpen(true)}
                  className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white hover:bg-blue-500 rounded-xl text-xs font-bold transition shadow-sm cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Жаңа Бекет Тіркеу (ADD)</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                {stationsList.map((station) => (
                  <div 
                    key={station.id} 
                    className="bg-slate-50 rounded-2xl border border-slate-200 p-5 space-y-4 hover:shadow-md transition flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5">
                            <h4 className="text-sm font-black text-slate-900">{station.name}</h4>
                            <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 font-mono text-[10px] font-extrabold rounded-lg">{station.id}</span>
                          </div>
                          <span className="text-[10px] text-slate-400 block font-mono">Тіркелген белсенді резервуар саны: {station.tanks?.length || 0}</span>
                        </div>

                        {/* Drop station button */}
                        <button
                          onClick={() => {
                            if (confirm(`${station.name} бекетін жүйеден біржола өшіруге қарсы емессіз бе?`)) {
                              deleteStation(station.id);
                            }
                          }}
                          className="p-1.5 text-slate-400 hover:text-red-650 hover:bg-slate-100 rounded-lg cursor-pointer transition"
                          title="Жою"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Display Station Reservoir Tanks editing layout list */}
                      <div className="mt-4 space-y-2.5">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Резервуарларды реттеу:</span>
                        
                        {(station.tanks || []).map((tank: any, tIdx: number) => (
                          <div 
                            key={tIdx} 
                            className="bg-white p-3 rounded-xl border border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs items-center"
                          >
                            <div>
                              <span className="text-[8px] text-slate-400 block font-mono">Отын маркасы:</span>
                              <input 
                                type="text" 
                                value={tank.fuel}
                                onChange={(e) => {
                                  const updatedTanks = [...station.tanks];
                                  updatedTanks[tIdx] = { ...tank, fuel: e.target.value };
                                  updateStation(station.id, { tanks: updatedTanks });
                                }}
                                className="w-full font-bold text-slate-800 focus:outline-none"
                              />
                            </div>

                            <div>
                              <span className="text-[8px] text-slate-400 block font-mono">Ағымдағы көлемі (мың л.):</span>
                              <input 
                                type="number" 
                                value={tank.volume}
                                onChange={(e) => {
                                  const updatedTanks = [...station.tanks];
                                  updatedTanks[tIdx] = { ...tank, volume: Number(e.target.value) };
                                  updateStation(station.id, { tanks: updatedTanks });
                                }}
                                className="w-full font-bold text-slate-800 focus:outline-none"
                              />
                            </div>

                            <div>
                              <span className="text-[8px] text-slate-400 block font-mono">Сыйымдылығы (мың л.):</span>
                              <input 
                                type="number" 
                                value={tank.capacity}
                                onChange={(e) => {
                                  const updatedTanks = [...station.tanks];
                                  updatedTanks[tIdx] = { ...tank, capacity: Number(e.target.value) };
                                  updateStation(station.id, { tanks: updatedTanks });
                                }}
                                className="w-full font-bold text-slate-800 focus:outline-none"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-200/50 flex justify-between items-center bg-white p-2 text-[10px] rounded-xl">
                      <span className="text-slate-500">Карта желісінде көрсетілуі:</span>
                      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-semibold">Қосылған (БАТЫР)</span>
                    </div>

                  </div>
                ))}
              </div>

            </div>
          )}

          {/* TAB: OIL RESERVOIR CONTEXT SETTINGS */}
          {activeTab === 'tanks' && (
            <div className="space-y-6 animate-fade-in text-left">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-3 border-b border-slate-100">
                <div>
                  <h3 className="text-lg font-black text-slate-900">Мұнайбаза Резервуарларын Басқару (Reservoirs Setup & Calibration)</h3>
                  <p className="text-xs text-slate-500">Тензодатчиктердің ағымдағы көрсеткіштерін, подтоварный су деңгейін және отын қалдықтарын реттеу.</p>
                </div>

                <button
                  onClick={() => setShowAdmAddForm(!showAdmAddForm)}
                  className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-500 transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4" /> Жаңа резервуар тіркеу
                </button>
              </div>

              {/* Add New Tank collapse banner-form */}
              {showAdmAddForm && (
                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 animate-in fade-in duration-200 space-y-4">
                  <span className="text-xs font-black text-slate-800 block uppercase font-mono tracking-wider">Базаға Жаңа Резервуар Қосу</span>
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase font-bold text-slate-400 block font-mono">Резервуар ID</label>
                      <input 
                        type="text" 
                        value={newAdmId} 
                        onChange={(e) => setNewAdmId(e.target.value)}
                        placeholder="T-06"
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 uppercase font-mono focus:ring-1 focus:ring-blue-500 outline-none"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase font-bold text-slate-400 block font-mono">Отын түрі / маркасы</label>
                      <input 
                        type="text" 
                        value={newAdmFuel} 
                        onChange={(e) => setNewAdmFuel(e.target.value)}
                        placeholder="АИ-98 Супер"
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:ring-1 focus:ring-blue-500 outline-none"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase font-bold text-slate-400 block font-mono">Бастапқы көлемі (м³)</label>
                      <input 
                        type="number" 
                        value={newAdmVolume} 
                        onChange={(e) => setNewAdmVolume(Number(e.target.value) || 0)}
                        placeholder="3000"
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:ring-1 focus:ring-blue-500 outline-none font-mono"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase font-bold text-slate-400 block font-mono">Жалпы сыйымдылығы (м³)</label>
                      <input 
                        type="number" 
                        value={newAdmCapacity} 
                        onChange={(e) => setNewAdmCapacity(Number(e.target.value) || 0)}
                        placeholder="4000"
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:ring-1 focus:ring-blue-500 outline-none font-mono"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 pt-2 text-xs font-bold">
                    <button
                      onClick={() => setShowAdmAddForm(false)}
                      className="px-3.5 py-1.5 rounded-lg border text-slate-500 hover:bg-slate-100"
                    >
                      Күшін жою
                    </button>
                    <button
                      onClick={() => {
                        if (!newAdmId || !newAdmFuel) {
                          safeAlert("Толтырылмаған жолақтар бар (ID мен отын түрі міндетті)!");
                          return;
                        }
                        addTank(newAdmId, newAdmFuel, newAdmVolume, newAdmCapacity);
                        safeAlert(`Резервуар ${newAdmId} сәтті тіркелді!`);
                        setNewAdmId('');
                        setNewAdmFuel('');
                        setNewAdmVolume(0);
                        setNewAdmCapacity(1000);
                        setShowAdmAddForm(false);
                      }}
                      className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white"
                    >
                      Қойма жүйесіне енгізу
                    </button>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left side: Tank cards selector list */}
                <div className="space-y-3 lg:border-r lg:pr-6 lg:border-slate-100">
                  <span className="text-xs font-bold text-slate-400 block uppercase font-mono mb-2">1. Қордағы резервуарлар:</span>
                  <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
                    {tanksState && tanksState.map((t: any) => (
                      <button
                        key={t.id}
                        onClick={() => setSelectedAdmTankId(t.id)}
                        className={`w-full p-4 rounded-xl border text-left flex justify-between items-center transition-all cursor-pointer ${
                          selectedAdmTankId === t.id 
                            ? 'bg-blue-50/50 border-blue-500 shadow-sm' 
                            : 'bg-white border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        <div className="space-y-1">
                          <span className="text-xs font-black block text-blue-700 font-mono">{t.id}</span>
                          <span className="text-xs font-bold text-slate-800 block truncate max-w-[150px]">{t.fuel}</span>
                        </div>
                        <div className="text-right space-y-0.5">
                          <span className="text-xs font-mono font-bold text-slate-600 block">{t.volume} м³</span>
                          <span className="text-[10px] text-slate-400 font-mono block">Макс: {t.capacity} м³</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Right side: Editor fields */}
                <div className="lg:col-span-2 bg-slate-50/50 border border-slate-200/60 p-5 rounded-2xl space-y-5">
                  <div className="flex justify-between items-center pb-2 border-b border-slate-200/60">
                    <span className="text-xs font-black text-slate-800 font-mono uppercase tracking-wider">
                      2. {selectedAdmTankId || 'Т-01'} Параметрлерін калибрлеу
                    </span>
                    {selectedAdmTankId && (
                      <button
                        onClick={() => {
                          if (confirm(`Резервуар ${selectedAdmTankId} мұнайбазадан өшіріледі. Растайсыз ба?`)) {
                            deleteTank(selectedAdmTankId);
                            setSelectedAdmTankId(tanksState.find((x: any) => x.id !== selectedAdmTankId)?.id || '');
                          }
                        }}
                        className="p-1 px-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-600 hover:bg-rose-600 hover:text-white transition-all text-[10px] font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Резервуарды өшіру
                      </button>
                    )}
                  </div>

                  {selectedAdmTankId ? (
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5 text-left">
                        <label className="text-[10px] uppercase font-bold text-slate-400 font-mono">Отын атауы / Отын маркасы</label>
                        <input 
                          type="text" 
                          value={editAdmFuel} 
                          onChange={(e) => setEditAdmFuel(e.target.value)}
                          className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                      </div>

                      <div className="space-y-1.5 text-left">
                        <label className="text-[10px] uppercase font-bold text-slate-400 font-mono">Подтоварный су деңгейі (см)</label>
                        <input 
                          type="number" 
                          step="0.1"
                          value={editAdmWater} 
                          onChange={(e) => setEditAdmWater(Number(e.target.value) || 0)}
                          className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono"
                        />
                      </div>

                      <div className="space-y-1.5 text-left">
                        <label className="text-[10px] uppercase font-bold text-slate-400 font-mono">Ағымдағы көлемі (м³)</label>
                        <input 
                          type="number" 
                          value={editAdmVolume} 
                          onChange={(e) => setEditAdmVolume(Number(e.target.value) || 0)}
                          className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono"
                        />
                      </div>

                      <div className="space-y-1.5 text-left">
                        <label className="text-[10px] uppercase font-bold text-slate-400 font-mono">Максималды сыйымдылығы (м³)</label>
                        <input 
                          type="number" 
                          value={editAdmCapacity} 
                          onChange={(e) => setEditAdmCapacity(Number(e.target.value) || 0)}
                          className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono"
                        />
                      </div>

                      <div className="col-span-2 pt-3 border-t border-slate-100 flex justify-end gap-2 text-xs font-bold">
                        <button
                          onClick={() => {
                            updateTank(selectedAdmTankId, {
                              fuel: editAdmFuel,
                              volume: editAdmVolume,
                              capacity: editAdmCapacity
                            });
                            updateWaterLevel(selectedAdmTankId, editAdmWater);
                            safeAlert(`Калибрлеу параметрлері ${selectedAdmTankId} үшін сәтті сақталды!`);
                          }}
                          className="px-4.5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold flex items-center gap-1.5 shadow-md shadow-blue-500/10 cursor-pointer ml-auto"
                        >
                          <Save className="w-3.5 h-3.5" /> Калибрлеу Көрсеткішін Сақтау
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400 italic py-10 text-center">Конфигурацияны өңдеу үшін сол жақтан кез келген резервуарды таңдаңыз.</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: USER CONTROL DIRECTORY */}
          {activeTab === 'users' && (
            <div className="space-y-6 animate-fade-in text-left">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-3 border-b border-slate-100">
                <div>
                  <h3 className="text-lg font-black text-slate-900 font-sans">Сайт Қолданушыларын Басқару (User & Admin Security Permissions)</h3>
                  <p className="text-xs text-slate-500">Администратор нақты операторларға резервуарларды ашу/жабу, тек көру, өзгерту немесе толық басқару деңгейлерін тағайындай алады.</p>
                </div>

                <div className="flex flex-wrap sm:flex-nowrap gap-2 items-center w-full sm:w-auto">
                  <button
                    onClick={() => setShowAddUserForm(!showAddUserForm)}
                    className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-md shrink-0"
                  >
                    <UserPlus className="w-4 h-4" /> Жаңа пайдаланушы қосу
                  </button>

                  <div className="relative w-full sm:w-64">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                      <Search className="w-4 h-4 text-slate-400" />
                    </span>
                    <input
                      type="text"
                      value={userSearch}
                      onChange={(e) => setUserSearch(e.target.value)}
                      placeholder="Пайдаланушы атымен іздеу..."
                      className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Form to add user */}
              {showAddUserForm && (
                <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl space-y-4 animate-in fade-in duration-200 text-slate-800">
                  <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest block font-mono">Жаңа Оператор / Пайдаланушы Тіркеу</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-slate-400 block">Толық аты-жөні (ФИО)</label>
                      <input
                        type="text"
                        value={newUFullName}
                        onChange={(e) => setNewUFullName(e.target.value)}
                        placeholder="Байболов Айдын"
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:ring-1 focus:ring-blue-500 outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-slate-400 block">Пайдаланушы аты (Username)</label>
                      <input
                        type="text"
                        value={newUName}
                        onChange={(e) => setNewUName(e.target.value)}
                        placeholder="operator1"
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:ring-1 focus:ring-blue-500 outline-none font-mono"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-slate-400 block">Пошта (Email)</label>
                      <input
                        type="email"
                        value={newUEmail}
                        onChange={(e) => setNewUEmail(e.target.value)}
                        placeholder="aidyn@mercuryenergy.kz"
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:ring-1 focus:ring-blue-500 outline-none font-mono"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-slate-400 block">Құпия сөз (Password)</label>
                      <input
                        type="text"
                        value={newUPassword}
                        onChange={(e) => setNewUPassword(e.target.value)}
                        placeholder="user123"
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:ring-1 focus:ring-blue-500 outline-none font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[10px] uppercase font-bold text-slate-400 block">Негізгі рөлі</label>
                        <select
                          value={newURole}
                          onChange={(e) => setNewURole(e.target.value as any)}
                          className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:ring-1 focus:ring-blue-500 outline-none font-bold cursor-pointer"
                        >
                          <option value="guest">Қонақ (Guest)</option>
                          <option value="user">Пайдаланушы (User)</option>
                          <option value="admin">Бас Әкімші (Admin)</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] uppercase font-bold text-slate-400 block">Ресурстық құқығы</label>
                        <select
                          value={newUPermLevel}
                          onChange={(e) => setNewUPermLevel(e.target.value as any)}
                          className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:ring-1 focus:ring-blue-500 outline-none font-bold cursor-pointer"
                        >
                          <option value="view">Тек көру (Read Only)</option>
                          <option value="open_close">Ашу/Жабу (Open/Close)</option>
                          <option value="edit">Өзгерту (Edit)</option>
                          <option value="full">Толық басқару (Full Control)</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase font-bold text-slate-400 block">Белгіленетін резервуарлар</label>
                      <div className="flex flex-wrap gap-2 pt-1">
                        {tanksState.map(t => (
                          <label key={t.id} className="inline-flex items-center gap-1.5 bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-xs font-mono font-bold text-slate-705 cursor-pointer hover:bg-slate-100">
                            <input
                              type="checkbox"
                              checked={newUAllowedTanks.includes(t.id)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setNewUAllowedTanks([...newUAllowedTanks, t.id]);
                                } else {
                                  setNewUAllowedTanks(newUAllowedTanks.filter(x => x !== t.id));
                                }
                              }}
                              className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                            />
                            {t.id} ({t.fuel})
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-2.5 text-xs font-bold">
                    <button
                      onClick={() => setShowAddUserForm(false)}
                      className="px-4 py-2 rounded-xl border border-slate-250 text-slate-500 hover:bg-slate-100 cursor-pointer"
                    >
                      Күшін жою
                    </button>
                    <button
                      onClick={() => {
                        if (!newUFullName || !newUName || !newUEmail) {
                          safeAlert("Толық ФИО, Логин мен Пошта жолақтарын толтырыңыз!");
                          return;
                        }
                        const u: any = {
                          fullName: newUFullName,
                          username: newUName.trim(),
                          email: newUEmail.trim(),
                          password: newUPassword.trim() || 'user123',
                          role: newURole,
                          permissionLevel: newUPermLevel,
                          allowedTanks: newUAllowedTanks
                        };
                        addUser(u);
                        safeAlert(`Пайдаланушы @${newUName} жүйеге сәтті қосылды!`);
                        setNewUFullName('');
                        setNewUName('');
                        setNewUEmail('');
                        setNewUPassword('');
                        setShowAddUserForm(false);
                      }}
                      className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white cursor-pointer shadow-md shadow-blue-500/10"
                    >
                      Пайдаланушыны Тіркеу
                    </button>
                  </div>
                </div>
              )}

              {/* Users list table element */}
              <div className="overflow-x-auto rounded-2xl border border-slate-250 bg-white">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                      <th className="p-4">Толық аты-жөні (ФИО)</th>
                      <th className="p-4 border-l border-slate-100">Пошта және Логин</th>
                      <th className="p-4 border-l border-slate-100">Жүйелік Рөлі (Role)</th>
                      <th className="p-4 border-l border-slate-100">Резервуарға рұқсат (Tanks)</th>
                      <th className="p-4 border-l border-slate-100">Өкілеттік Деңгейі (Rights)</th>
                      <th className="p-4 text-center border-l border-slate-100">Мәртебесі / Өшіру</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 text-xs text-slate-800">
                    {usersList
                      .filter(u => u.fullName.toLowerCase().includes(userSearch.toLowerCase()) || u.username.toLowerCase().includes(userSearch.toLowerCase()))
                      .map((u) => {
                        const isActiveSessionUser = currentUser?.username === u.username;
                        
                        const handlePermLevelChange = (username: string, level: any) => {
                          updateUserTanksAndPermissions(username, u.allowedTanks || ['T-01'], level);
                        };

                        const handleTankToggle = (username: string, tankId: string) => {
                          const currentTanks = u.allowedTanks || [];
                          let nextTanks;
                          if (currentTanks.includes(tankId)) {
                            nextTanks = currentTanks.filter(t => t !== tankId);
                          } else {
                            nextTanks = [...currentTanks, tankId];
                          }
                          updateUserTanksAndPermissions(username, nextTanks, u.permissionLevel || 'view');
                        };

                        return (
                          <tr key={u.username} className="hover:bg-slate-50/70 transition">
                            <td className="p-4">
                              <div className="flex items-center gap-2.5">
                                <span className="w-7 h-7 rounded-lg bg-blue-100 text-blue-850 flex items-center justify-center font-bold text-xs font-mono shrink-0">
                                  {u.username.substring(0,2).toUpperCase()}
                                </span>
                                <div>
                                  <span className="font-extrabold text-slate-900 block">{u.fullName}</span>
                                  {isActiveSessionUser && (
                                    <span className="inline-block px-1.5 py-0.2 bg-emerald-100 text-emerald-800 text-[8px] font-black rounded font-mono uppercase tracking-widest leading-none mt-1">
                                      БЕЛСЕНДІ (YOU)
                                    </span>
                                  )}
                                </div>
                              </div>
                            </td>
                            
                            <td className="p-4 border-l border-slate-100">
                              <span className="font-mono text-slate-600 block">@{u.username}</span>
                              <span className="text-[10px] text-slate-400 block">{u.email}</span>
                            </td>

                            <td className="p-4 border-l border-slate-100">
                              <select
                                value={u.role}
                                onChange={(e) => {
                                  const nr = e.target.value as 'guest' | 'user' | 'admin';
                                  if (isActiveSessionUser && nr !== 'admin') {
                                    if (!confirm('Ескерту: Өз рөліңізді төмендетсеңіз, Әкімшілік басқару панеліне кіре алмай қаласыз! Төмендетуді растайсыз ба?')) {
                                      return;
                                    }
                                  }
                                  updateUserRole(u.username, nr);
                                }}
                                className={`px-2.5 py-1 rounded-lg border text-xs font-extrabold focus:outline-none transition cursor-pointer ${
                                  u.role === 'admin' 
                                    ? 'bg-rose-50 border-rose-200 text-rose-700' 
                                    : u.role === 'user' 
                                      ? 'bg-indigo-50 border-indigo-200 text-indigo-700' 
                                      : 'bg-slate-100 border-slate-200 text-slate-600'
                                }`}
                              >
                                <option value="guest">Қонақ (Guest)</option>
                                <option value="user">Оператор (User)</option>
                                <option value="admin">Бас Әкімші (Admin)</option>
                              </select>
                            </td>

                            <td className="p-4 border-l border-slate-100">
                              <div className="flex flex-wrap gap-1 max-w-[190px]">
                                {tanksState.map(t => {
                                  const isChecked = (u.allowedTanks || []).includes(t.id);
                                  return (
                                    <button
                                      key={t.id}
                                      onClick={() => handleTankToggle(u.username, t.id)}
                                      className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border transition duration-150 ${
                                        isChecked 
                                          ? 'bg-blue-600 border-blue-500 text-white shadow-sm shadow-blue-500/10'
                                          : 'bg-slate-50 border-slate-200 text-slate-400 hover:bg-slate-100 hover:text-slate-600'
                                      }`}
                                      title={isChecked ? `${t.id} рұқсаттамасын алып тастау` : `${t.id} рұқсаттамасын қосу`}
                                    >
                                      {t.id}
                                    </button>
                                  );
                                })}
                              </div>
                            </td>

                            <td className="p-4 border-l border-slate-100">
                              <select
                                value={u.permissionLevel || 'view'}
                                onChange={(e) => handlePermLevelChange(u.username, e.target.value)}
                                className="px-2.5 py-1 rounded-xl border border-slate-200 text-xs bg-slate-50 font-black text-slate-700 focus:outline-none cursor-pointer"
                              >
                                <option value="view">👁 Тек көру (Read Only)</option>
                                <option value="open_close">🎛 Ашу/Жабу (Open/Close)</option>
                                <option value="edit">⚙ Өзгерту құқығы (Edit)</option>
                                <option value="full">⚡ Толық басқару (Full Control)</option>
                              </select>
                            </td>

                            <td className="p-4 text-center border-l border-slate-100">
                              <div className="flex items-center justify-center gap-1.5 mx-auto">
                                <button
                                  onClick={() => {
                                    setEditingUserForAdmin(u);
                                    setEditAdminUFullName(u.fullName);
                                    setEditAdminUEmail(u.email);
                                    setEditAdminUPassword(u.password || '');
                                    setEditAdminUEmailNotifications(u.emailNotificationsEnabled || false);
                                  }}
                                  className="p-1 px-2 rounded-lg border border-blue-100 text-blue-600 hover:bg-blue-600 hover:text-white transition cursor-pointer text-[10px] font-bold flex items-center gap-1"
                                >
                                  <Edit className="w-3.5 h-3.5" /> Баптау
                                </button>
                                
                                {!isActiveSessionUser && (
                                  <button
                                    onClick={() => {
                                      if (confirm(`Назар аударыңыз! Пайдаланушыны өшіру @${u.username} жүйеден толықтай оның рұқсаттарымен жойылады. Тіркелгіні жоюды растайсыз ба?`)) {
                                        deleteUser(u.username);
                                      }
                                    }}
                                    className="p-1 px-2.5 rounded-lg border border-rose-100 text-rose-500 hover:bg-rose-600 hover:text-white transition cursor-pointer text-[10px] font-bold flex items-center gap-1"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" /> Өшіру
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    }
                  </tbody>
                </table>
              </div>

            </div>
          )}

          {/* USER EDIT MODAL FOR ADMIN */}
          {editingUserForAdmin && (
            <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 text-left">
              <div className="bg-white rounded-[2rem] border border-slate-200 shadow-2xl p-6 sm:p-8 w-full max-w-lg space-y-6 relative overflow-hidden animate-fade-in text-slate-800">
                <div className="absolute top-0 inset-x-0 h-3.5 bg-gradient-to-r from-blue-600 to-indigo-700" />
                
                <div className="flex items-center justify-between pb-3 border-b border-slate-150">
                  <div>
                    <h3 className="text-base font-black text-slate-950">Пайдаланушыны өңдеу және баптау</h3>
                    <p className="text-[10px] text-slate-400 font-mono">@{editingUserForAdmin.username} параметрлерін өзгерту</p>
                  </div>
                  <button 
                    onClick={() => setEditingUserForAdmin(null)}
                    className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-4">
                  {/* Full Name field */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Толық аты-жөні (ФИО):</label>
                    <input 
                      type="text"
                      value={editAdminUFullName}
                      onChange={(e) => setEditAdminUFullName(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs bg-slate-50 focus:bg-white focus:ring-1 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>

                  {/* Email (Login) field */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Электронды пошта (Email / Логин):</label>
                    <input 
                      type="email"
                      value={editAdminUEmail}
                      onChange={(e) => setEditAdminUEmail(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs bg-slate-50 focus:bg-white focus:ring-1 focus:ring-blue-500 focus:outline-none font-mono"
                    />
                  </div>

                  {/* Password field */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Құпия сөз (Пароль):</label>
                    <input 
                      type="text"
                      value={editAdminUPassword}
                      onChange={(e) => setEditAdminUPassword(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs bg-slate-50 focus:bg-white focus:ring-1 focus:ring-blue-500 focus:outline-none font-mono font-bold"
                    />
                  </div>

                  {/* Toggle Notifications */}
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-150 flex items-center justify-between gap-4">
                    <div className="space-y-0.5">
                      <span className="text-xs font-bold text-slate-800">Email хабарламаларды алу рұқсаты</span>
                      <p className="text-[10px] text-slate-400">Нақты уақытта поштаға дабылдарды жіберу</p>
                    </div>

                    <label className="relative inline-flex items-center cursor-pointer select-none">
                      <input 
                        type="checkbox"
                        checked={editAdminUEmailNotifications}
                        onChange={(e) => setEditAdminUEmailNotifications(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-8 h-4.5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-3.5 after:w-3.5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => {
                      updateUserDetails(editingUserForAdmin.username, {
                        fullName: editAdminUFullName,
                        email: editAdminUEmail,
                        password: editAdminUPassword,
                        emailNotificationsEnabled: editAdminUEmailNotifications
                      });
                      setEditingUserForAdmin(null);
                    }}
                    className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-extrabold uppercase tracking-wider transition-all cursor-pointer"
                  >
                    Сақтау
                  </button>
                  <button
                    onClick={() => setEditingUserForAdmin(null)}
                    className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
                  >
                    Болдырмау
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: AUDIT LOGS (ACTION LOGS) */}
          {activeTab === 'logs' && (
            <div className="space-y-6 animate-fade-in text-left">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-3 border-b border-slate-100">
                <div>
                  <h3 className="text-lg font-black text-slate-950 font-sans">Жүйелік Қозғалысты Аудиттеу Журналы (Audit Logs Portal)</h3>
                  <p className="text-xs text-slate-500">Жүйедегі кез келген баға өзгерісін, рөлді жаңартуды немесе жаңалық жариялауды кім, қашан және қалай жасағанын тіркеген журнал.</p>
                </div>

                <div className="flex flex-wrap gap-2.5 w-full sm:w-auto">
                  <div className="relative w-full sm:w-48">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-2.5">
                      <Search className="w-3.5 h-3.5 text-slate-400" />
                    </span>
                    <input
                      type="text"
                      value={logSearch}
                      onChange={(e) => setLogSearch(e.target.value)}
                      placeholder="Атымен немесе бұйрықпен..."
                      className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none"
                    />
                  </div>

                  {/* Filter by role dropdown */}
                  <select
                    value={logRoleFilter}
                    onChange={(e) => setLogRoleFilter(e.target.value)}
                    className="px-2.5 py-1.5 bg-slate-50 rounded-lg text-xs font-semibold border border-slate-200"
                  >
                    <option value="all">Барлық деңгей</option>
                    <option value="admin">Әкімшілер</option>
                    <option value="user">Қызметкерлер</option>
                    <option value="guest">Қонақтар</option>
                  </select>

                  <button
                    onClick={exportToExcel}
                    className="px-3 py-1.5 bg-emerald-600 text-white font-bold text-xs rounded-lg hover:bg-emerald-700 cursor-pointer transition shadow-sm flex items-center gap-1"
                    title="Excel форматында жүктеу"
                  >
                    📥 Excel
                  </button>

                  <button
                    onClick={exportToPDF}
                    className="px-3 py-1.5 bg-blue-600 text-white font-bold text-xs rounded-lg hover:bg-blue-700 cursor-pointer transition shadow-sm flex items-center gap-1"
                    title="PDF форматында басып шығару"
                  >
                    📄 PDF
                  </button>

                  {role === 'admin' && (
                    <button
                      onClick={() => {
                        if (confirm('Тарихты тазартуды растайсыз ба? Бұл іс-әрекет қайтарымсыз.')) {
                          clearAuditLogs();
                          logUserAction('Аудит журналының тарихын толықтай тазартты');
                        }
                      }}
                      className="px-3 py-1.5 bg-red-600 text-white font-bold text-xs rounded-lg hover:bg-red-700 cursor-pointer transition shadow-sm ml-auto sm:ml-0"
                    >
                      Тарихты тазарту
                    </button>
                  )}
                </div>
              </div>

              {/* Feed/Timeline Layout of Audit Logs */}
              {filteredLogs.length === 0 ? (
                <div className="text-center py-16 bg-slate-50 rounded-2xl border border-slate-150">
                  <FileText className="w-12 h-12 text-slate-300 mx-auto mb-2" />
                  <p className="text-xs text-slate-400 font-bold">Талаптарға сәйкес іс-әрекеттер табылған жоқ.</p>
                </div>
              ) : (
                <div className="space-y-3.5 max-h-[550px] overflow-y-auto pr-2 scrollbar-thin">
                  {filteredLogs.map((log) => (
                    <div 
                      key={log.id} 
                      className={`p-4 rounded-2xl border transition-all text-xs flex flex-col sm:flex-row justify-between sm:items-center gap-3 bg-white hover:border-slate-300 shadow-sm ${
                        log.role === 'admin' ? 'border-l-4 border-l-red-500 border-slate-200' : 'border-l-4 border-l-blue-400 border-slate-200'
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-extrabold text-slate-900">{log.user}</span>
                          <span className="text-slate-400">({log.email})</span>
                          
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase font-mono shadow-sm ${
                            log.role === 'admin' ? 'bg-red-105 bg-red-100 text-red-700' : 'bg-blue-105 bg-blue-100 text-blue-700'
                          }`}>
                            {log.role}
                          </span>
                        </div>
                        
                        <p className="text-slate-800 font-bold text-xs">{log.action}</p>
                      </div>

                      <div className="text-right sm:shrink-0">
                        <span className="text-[10px] text-slate-400 font-mono block font-bold">⏱ {log.timestamp}</span>
                        <span className="text-[8px] text-slate-350 font-mono block">Log ID: {log.id}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

            </div>
          )}

        </div>

      </div>

      {/* MODALS SECTION */}

      {/* 1. Modal Add baseline Spot Prices */}
      <AnimatePresence>
        {isAddSpotOpen && (
          <>
            <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50" onClick={() => setIsAddSpotOpen(false)} />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-md bg-white p-6 rounded-3xl z-55 shadow-2xl border border-slate-150 text-slate-800"
            >
              <div className="flex justify-between items-center pb-3 border-b border-slate-100 mb-4">
                <h4 className="font-black text-slate-900 text-sm">Жаңа Спот Отын тарифін тіркеу</h4>
                <button onClick={() => setIsAddSpotOpen(false)} className="p-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-500 cursor-pointer">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleAddSpotFuel} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-slate-400">Отын атауы:</label>
                    <input 
                      type="text" 
                      required 
                      value={spotFuelName} 
                      onChange={(e) => setSpotFuelName(e.target.value)} 
                      placeholder="e.g. AI-98"
                      className="w-full px-3 py-2 border rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 text-xs font-bold"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-slate-400">Стандарт:</label>
                    <input 
                      type="text" 
                      value={spotStandard} 
                      onChange={(e) => setSpotStandard(e.target.value)}
                      className="w-full px-3 py-2 border rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 text-xs font-bold font-mono"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-400">Сипат мәтіні:</label>
                  <input 
                    type="text" 
                    value={spotLabel} 
                    onChange={(e) => setSpotLabel(e.target.value)}
                    placeholder="Premium Performance"
                    className="w-full px-3 py-2 border rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 text-xs font-bold"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-slate-400">Бағасы (Кеңсе):</label>
                    <input 
                      type="number" 
                      required
                      value={spotPrice} 
                      onChange={(e) => setSpotPrice(Number(e.target.value))}
                      className="w-full px-3 py-2 border rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 text-xs font-bold"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-slate-400">Динамика үлесі (%):</label>
                    <input 
                      type="text" 
                      value={spotPercent} 
                      onChange={(e) => setSpotPercent(e.target.value)}
                      placeholder="+1.8%"
                      className="w-full px-3 py-2 border rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 text-xs font-bold"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-400 block pb-1">Нысана бағыты:</label>
                  <div className="flex gap-2">
                    {(['up', 'down', 'neutral'] as const).map(tr => (
                      <button
                        key={tr}
                        type="button"
                        onClick={() => setSpotTrend(tr)}
                        className={`flex-1 py-1 px-3 border rounded-lg text-[10px] font-bold cursor-pointer uppercase transition ${
                          spotTrend === tr ? 'bg-blue-600 text-white border-blue-600' : 'bg-slate-50 border-slate-200 text-slate-500'
                        }`}
                      >
                        {tr}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t flex justify-end gap-2 text-xs font-bold uppercase tracking-wider">
                  <button type="button" onClick={() => setIsAddSpotOpen(false)} className="px-4 py-2 bg-slate-100 rounded-xl">Бас тарту</button>
                  <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-xl">Қосу</button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* 2. Modal Add Wholesale region fuel rates */}
      <AnimatePresence>
        {isAddWholesaleOpen && (
          <>
            <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50" onClick={() => setIsAddWholesaleOpen(false)} />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-sm bg-white p-6 rounded-3xl z-55 shadow-2xl border border-slate-150 text-slate-800"
            >
              <div className="flex justify-between items-center pb-3 border-b border-slate-100 mb-4">
                <h4 className="font-black text-slate-900 text-sm">{selectedRegion} өңіріне Көтерме Отын қосу</h4>
                <button onClick={() => setIsAddWholesaleOpen(false)} className="p-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-500 cursor-pointer">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleAddWholesaleFuel} className="space-y-4 text-left">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-400">Отын атауы (e.g. РТ КЕРОСИН):</label>
                  <input 
                    type="text" 
                    required 
                    value={wName} 
                    onChange={(e) => setWName(e.target.value)} 
                    placeholder="Марканы енгізіңіз..."
                    className="w-full px-3 py-2 border rounded-xl font-bold text-xs focus:ring-1 focus:ring-blue-550"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-slate-400">Санаты:</label>
                    <select 
                      value={wCategory} 
                      onChange={(e) => setWCategory(e.target.value as 'auto' | 'aviation')}
                      className="w-full px-3 py-2 border rounded-xl font-bold text-xs"
                    >
                      <option value="auto">Авто Көлік</option>
                      <option value="aviation">Авиация</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-slate-400">Сертификат (Стандарт):</label>
                    <input 
                      type="text" 
                      value={wStandard} 
                      onChange={(e) => setWStandard(e.target.value)} 
                      className="w-full px-3 py-2 border rounded-xl font-bold font-mono text-xs focus:ring-1"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-400">Бағасы (Көтерме - KZT):</label>
                  <input 
                    type="number" 
                    required
                    value={wPrice} 
                    onChange={(e) => setWPrice(Number(e.target.value))} 
                    className="w-full px-3 py-2 border rounded-xl font-bold text-xs"
                  />
                </div>

                <div className="pt-3 border-t flex justify-end gap-2 text-xs font-bold uppercase tracking-wider">
                  <button type="button" onClick={() => setIsAddWholesaleOpen(false)} className="px-4 py-2 bg-slate-100 rounded-xl">Бас тарту</button>
                  <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-xl">Қосу</button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* 3. Modal Add Gas Station Complectation */}
      <AnimatePresence>
        {isAddStationOpen && (
          <>
            <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50" onClick={() => setIsAddStationOpen(false)} />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-lg bg-white p-6 rounded-3xl z-55 shadow-2xl border border-slate-150 text-slate-800"
            >
              <div className="flex justify-between items-center pb-3 border-b border-slate-100 mb-4">
                <h4 className="font-black text-slate-900 text-sm">Жаңа Жанармай Бекетін тіркеу өтінімі</h4>
                <button onClick={() => setIsAddStationOpen(false)} className="p-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-500 cursor-pointer">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleAddStationSubmit} className="space-y-4 text-left">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-slate-400">ЖҚС Түгел Атауы (Name) :</label>
                    <input 
                      type="text" 
                      required 
                      value={newStationName} 
                      onChange={(e) => setNewStationName(e.target.value)} 
                      placeholder="e.g. Almaty - Turksib"
                      className="w-full px-3 py-2 border rounded-xl font-bold text-xs"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-slate-400">Бекет Идентификаторы (ID/CODE) :</label>
                    <input 
                      type="text" 
                      required 
                      value={newStationId} 
                      onChange={(e) => setNewStationId(e.target.value)} 
                      placeholder="e.g. ALA-05"
                      className="w-full px-3 py-2 border rounded-xl font-bold font-mono text-xs text-indigo-700"
                    />
                  </div>
                </div>

                <span className="text-xs font-extrabold text-slate-700 block border-b pb-1">Резервуарларды жиынтықтау:</span>

                <div className="bg-slate-50 p-3.5 rounded-2xl border space-y-3">
                  <span className="text-[10px] font-bold text-slate-500 block">Резервуар №1 (Premium):</span>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div>
                      <label className="text-[8px] text-slate-400 block font-mono">Отын түрі:</label>
                      <input 
                        type="text" 
                        value={tank1Fuel} 
                        onChange={(e) => setTank1Fuel(e.target.value)} 
                        className="w-full px-2 py-1.5 border rounded-lg bg-white"
                      />
                    </div>
                    <div>
                      <label className="text-[8px] text-slate-400 block font-mono">Қалдық (мың л.) :</label>
                      <input 
                        type="number" 
                        value={tank1Volume} 
                        onChange={(e) => setTank1Volume(Number(e.target.value))} 
                        className="w-full px-2 py-1.5 border rounded-lg bg-white"
                      />
                    </div>
                    <div>
                      <label className="text-[8px] text-slate-400 block font-mono">Сыйымдылығы (мың л.) :</label>
                      <input 
                        type="number" 
                        value={tank1Capacity} 
                        onChange={(e) => setTank1Capacity(Number(e.target.value))} 
                        className="w-full px-2 py-1.5 border rounded-lg bg-white"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 p-3.5 rounded-2xl border space-y-3">
                  <span className="text-[10px] font-bold text-slate-500 block">Резервуар №2 (Standard):</span>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div>
                      <label className="text-[8px] text-slate-400 block font-mono">Отын түрі:</label>
                      <input 
                        type="text" 
                        value={tank2Fuel} 
                        onChange={(e) => setTank2Fuel(e.target.value)} 
                        className="w-full px-2 py-1.5 border rounded-lg bg-white"
                      />
                    </div>
                    <div>
                      <label className="text-[8px] text-slate-400 block font-mono">Қалдық (мың л.) :</label>
                      <input 
                        type="number" 
                        value={tank2Volume} 
                        onChange={(e) => setTank2Volume(Number(e.target.value))} 
                        className="w-full px-2 py-1.5 border rounded-lg bg-white"
                      />
                    </div>
                    <div>
                      <label className="text-[8px] text-slate-400 block font-mono">Сыйымдылығы (мың л.) :</label>
                      <input 
                        type="number" 
                        value={tank2Capacity} 
                        onChange={(e) => setTank2Capacity(Number(e.target.value))} 
                        className="w-full px-2 py-1.5 border rounded-lg bg-white"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t flex justify-end gap-2 text-xs font-bold uppercase tracking-wider">
                  <button type="button" onClick={() => setIsAddStationOpen(false)} className="px-4 py-2 bg-slate-100 rounded-xl">Бас тарту</button>
                  <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-xl">Жүйеге Енгізу</button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
}
