import React, { useState, useEffect } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { 
  Plus, 
  Trash2, 
  Edit, 
  Save, 
  X, 
  Check, 
  RefreshCw, 
  Sparkles, 
  ArrowUp, 
  ArrowDown,
  Upload,
  Building2,
  Phone,
  Clock,
  Award,
  FlaskConical,
  CircleUser,
  Image,
  Sliders,
  Users,
  MapPin,
  Mail,
  Info,
  FolderOpen,
  UploadCloud
} from 'lucide-react';

const safeAlert = (msg: string) => {
  try {
    window.alert(msg);
  } catch (e) {
    console.warn("Alert blocked in sandbox environment:", msg);
  }
};


// Drag & drop base64 image uploader with dedicated click-to-import button and separate drag-and-drop area
function Base64ImageUploader({ 
  value, 
  onChange, 
  label 
}: { 
  value: string; 
  onChange: (base64: string) => void; 
  label: string;
}) {
  const [dragActive, setDragActive] = useState(false);

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        onChange(e.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const onDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const onChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  return (
    <div className="space-y-2">
      <label className="text-xs font-extrabold text-slate-700 block tracking-wide uppercase">{label}</label>
      
      {value && (
        <div className="relative group max-w-full border border-slate-200 bg-slate-50/60 p-3 rounded-2xl flex items-center gap-4 shadow-sm animate-fade-in mb-2">
          <img 
            src={value} 
            alt="Preview" 
            className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-xl border border-slate-200 shadow-sm" 
            referrerPolicy="no-referrer" 
          />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-slate-800 truncate">Жүктелген сурет</p>
            <p className="text-[10px] text-slate-400 font-mono">Өлшемі: {(value.length / 1024).toFixed(1)} KB</p>
            {value.length > 400 * 1024 && (
              <p className="text-[9px] text-amber-500 font-bold mt-0.5">Сурет көлемі үлкен, бірақ сақталады.</p>
            )}
          </div>
          <button 
            type="button" 
            onClick={() => onChange('')} 
            className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 transition cursor-pointer border border-rose-100 shadow-sm"
            title="Тазарту"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3 items-stretch w-full">
        {/* Left Side: Click-to-import area */}
        <div className="flex-1 bg-slate-50 hover:bg-slate-100/80 border border-slate-200 hover:border-slate-350 rounded-2xl p-4 flex flex-col items-center justify-center text-center relative transition-all cursor-pointer min-h-[100px] shadow-sm">
          <UploadCloud className="w-6 h-6 text-blue-500 mb-1.5 animate-pulse" />
          <span className="text-xs font-bold text-slate-850">Сурет таңдау</span>
          <span className="text-[9px] text-slate-400 mt-0.5">Басып суретті таңдаңыз</span>
          <input 
            type="file" 
            accept="image/*" 
            onChange={onChangeInput} 
            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10" 
          />
        </div>

        {/* Right Side: Separate Drag-and-drop area */}
        <div 
          onDragEnter={onDrag}
          onDragOver={onDrag}
          onDragLeave={onDrag}
          onDrop={onDrop}
          className={`flex-1 border-2 border-dashed rounded-2xl p-4 flex flex-col items-center justify-center text-center transition-all relative min-h-[100px] ${
            dragActive 
              ? 'border-blue-500 bg-blue-50/50 scale-[1.02] shadow-sm' 
              : 'border-slate-200 bg-white hover:border-slate-300'
          }`}
        >
          <FolderOpen className="w-6 h-6 text-slate-400 mb-1.5" />
          <span className="text-xs font-bold text-slate-650">Суретті сүйреу</span>
          <span className="text-[9px] text-slate-400 mt-0.5">Осында сүйреп әкеліңіз</span>
        </div>
      </div>
    </div>
  );
}

export default function CmsManagementPanel() {
  const { 
    lang, 
    bannersState, 
    updateBannersState, 
    leadersList, 
    updateLeadersList, 
    contactsState, 
    updateContactsState,
    news,
    addNewsItem,
    updateNewsItem,
    deleteNewsItem,
    logUserAction 
  } = useAppContext();

  // CMS internal sections tab
  const [subTab, setSubTab] = useState<'slider' | 'leaders' | 'contacts' | 'news'>('slider');

  // ==========================================
  // 4. NEWS CMS STATES & ACTIONS
  // ==========================================
  const [editingNewsId, setEditingNewsId] = useState<string | null>(null);
  const [isAddingNewNews, setIsAddingNewNews] = useState(false);
  const [isSavingNews, setIsSavingNews] = useState(false);

  // News item form states
  const [newsTitleKz, setNewsTitleKz] = useState('');
  const [newsTitleRu, setNewsTitleRu] = useState('');
  const [newsTitleEn, setNewsTitleEn] = useState('');
  const [newsSummaryKz, setNewsSummaryKz] = useState('');
  const [newsSummaryRu, setNewsSummaryRu] = useState('');
  const [newsSummaryEn, setNewsSummaryEn] = useState('');
  const [newsCategory, setNewsCategory] = useState('ЖАҢАЛЫҚ');
  const [newsImageUrl, setNewsImageUrl] = useState('');
  const [newsDate, setNewsDate] = useState('');

  const startEditingNews = (item: any) => {
    setEditingNewsId(item.id);
    setNewsTitleKz(item.titleTranslations?.kz || item.title || '');
    setNewsTitleRu(item.titleTranslations?.ru || item.title || '');
    setNewsTitleEn(item.titleTranslations?.en || item.title || '');
    setNewsSummaryKz(item.summaryTranslations?.kz || item.summary || '');
    setNewsSummaryRu(item.summaryTranslations?.ru || item.summary || '');
    setNewsSummaryEn(item.summaryTranslations?.en || item.summary || '');
    setNewsCategory(item.category || 'ЖАҢАЛЫҚ');
    setNewsImageUrl(item.imageUrl || '');
    setNewsDate(item.date || '');
    setIsAddingNewNews(false);
  };

  const startAddingNews = () => {
    setEditingNewsId(null);
    setNewsTitleKz('');
    setNewsTitleRu('');
    setNewsTitleEn('');
    setNewsSummaryKz('');
    setNewsSummaryRu('');
    setNewsSummaryEn('');
    setNewsCategory('ЖАҢАЛЫҚ');
    setNewsImageUrl('https://images.unsplash.com/photo-1540962351504-03099e0a754b?auto=format&fit=crop&w=800&q=80');
    setNewsDate(new Date().toLocaleDateString('kk-KZ', { day: '2-digit', month: 'long', year: 'numeric' }));
    setIsAddingNewNews(true);
  };

  const saveNewsChanges = () => {
    setIsSavingNews(true);
    setTimeout(() => {
      const payload = {
        title: newsTitleKz || newsTitleRu || newsTitleEn || 'Атаусыз жаңалық',
        summary: newsSummaryKz || newsSummaryRu || newsSummaryEn || '',
        category: newsCategory,
        imageUrl: newsImageUrl,
        titleTranslations: {
          kz: newsTitleKz,
          ru: newsTitleRu,
          en: newsTitleEn
        },
        summaryTranslations: {
          kz: newsSummaryKz,
          ru: newsSummaryRu,
          en: newsSummaryEn
        },
        date: newsDate || new Date().toLocaleDateString('kk-KZ', { day: '2-digit', month: 'long', year: 'numeric' })
      };

      if (isAddingNewNews) {
        addNewsItem(payload);
        setIsAddingNewNews(false);
      } else if (editingNewsId) {
        updateNewsItem(editingNewsId, payload);
        setEditingNewsId(null);
      }
      setIsSavingNews(false);
      safeAlert('Жаңалық сәтті сақталды!');
    }, 400);
  };

  const handleDeleteNews = (id: string) => {
    if (confirm('Бұл жаңалықты өшіруге сенімдісіз бе?')) {
      deleteNewsItem(id);
      if (editingNewsId === id) {
        setEditingNewsId(null);
      }
    }
  };

  // ==========================================
  // 1. SLIDER CMS STATES & ACTIONS
  // ==========================================
  const [sliderAutoplay, setSliderAutoplay] = useState(bannersState?.autoplay !== false);
  const [sliderAutoplaySpeed, setSliderAutoplaySpeed] = useState(bannersState?.autoplaySpeed || 5);
  const [sliderShowIndicators, setSliderShowIndicators] = useState(bannersState?.showIndicators !== false);
  const [sliderShowArrows, setSliderShowArrows] = useState(bannersState?.showArrows !== false);
  const [slides, setSlides] = useState<any[]>(bannersState?.slides || []);
  const [isSavingSlider, setIsSavingSlider] = useState(false);

  // Active edit state for individual slide
  const [editingSlideId, setEditingSlideId] = useState<string | null>(null);
  const [isAddingNewSlide, setIsAddingNewSlide] = useState(false);

  // Form states for slide
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
    setSlideBgGradient('from-blue-950 via-slate-900 to-indigo-950');
    setSlideOverlayOpacity(0.85);
    setSlideButtonTextKz('Толығырақ');
    setSlideButtonTextRu('Подробнее');
    setSlideButtonTextEn('Details');
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
      safeAlert('Жүйеде кем дегенде 1 слайд қалуы керек!');
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

  const handleSaveSliderGlobal = () => {
    setIsSavingSlider(true);
    setTimeout(() => {
      const firstActive = slides.find(s => s.isActive) || slides[0] || {};
      updateBannersState({
        heroTitleKz: firstActive.titleKz || '',
        heroTitleRu: firstActive.titleRu || '',
        heroTitleEn: firstActive.titleEn || '',
        heroDescKz: firstActive.descKz || '',
        heroDescRu: firstActive.descRu || '',
        heroDescEn: firstActive.descEn || '',
        heroImage: firstActive.bgImage || '',
        autoplay: sliderAutoplay,
        autoplaySpeed: Number(sliderAutoplaySpeed),
        showIndicators: sliderShowIndicators,
        showArrows: sliderShowArrows,
        slides: slides
      });
      setIsSavingSlider(false);
      logUserAction('Интерактивті промо-слайдер баптаулары сәтті жаңартылды');
      safeAlert('Промо-слайдер баптаулары сәтті сақталды!');
    }, 600);
  };


  // ==========================================
  // 2. LEADERS CMS STATES & ACTIONS
  // ==========================================
  const [localLeaders, setLocalLeaders] = useState<any[]>([]);
  const [editingLeaderId, setEditingLeaderId] = useState<string | null>(null);
  const [isAddingNewLeader, setIsAddingNewLeader] = useState(false);
  const [isSavingLeaders, setIsSavingLeaders] = useState(false);

  // Form states for Leader
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
  // Specs (two key-values)
  const [lSpec1LabelKz, setLSpec1LabelKz] = useState('');
  const [lSpec1LabelRu, setLSpec1LabelRu] = useState('');
  const [lSpec1LabelEn, setLSpec1LabelEn] = useState('');
  const [lSpec1Val, setLSpec1Val] = useState('');
  const [lSpec2LabelKz, setLSpec2LabelKz] = useState('');
  const [lSpec2LabelRu, setLSpec2LabelRu] = useState('');
  const [lSpec2LabelEn, setLSpec2LabelEn] = useState('');
  const [lSpec2Val, setLSpec2Val] = useState('');

  useEffect(() => {
    if (leadersList) {
      setLocalLeaders(leadersList);
    }
  }, [leadersList]);

  const startEditingLeader = (leader: any) => {
    setEditingLeaderId(leader.id);
    setLeaderNameKz(leader.name?.kz || '');
    setLeaderNameRu(leader.name?.ru || '');
    setLeaderNameEn(leader.name?.en || '');
    setLeaderTitleKz(leader.title?.kz || '');
    setLeaderTitleRu(leader.title?.ru || '');
    setLeaderTitleEn(leader.title?.en || '');
    setLeaderSubKz(leader.sub?.kz || '');
    setLeaderSubRu(leader.sub?.ru || '');
    setLeaderSubEn(leader.sub?.en || '');
    setLeaderImageUrl(leader.imageUrl || '');
    setLeaderIconName(leader.iconName || 'CircleUser');
    setLeaderColor(leader.color || 'bg-blue-600');
    setLeaderEmail(leader.email || '');
    setLeaderBioKz(leader.bio?.kz || '');
    setLeaderBioRu(leader.bio?.ru || '');
    setLeaderBioEn(leader.bio?.en || '');

    // Specs
    setLSpec1LabelKz(leader.specs?.[0]?.label?.kz || '');
    setLSpec1LabelRu(leader.specs?.[0]?.label?.ru || '');
    setLSpec1LabelEn(leader.specs?.[0]?.label?.en || '');
    setLSpec1Val(leader.specs?.[0]?.value || '');
    setLSpec2LabelKz(leader.specs?.[1]?.label?.kz || '');
    setLSpec2LabelRu(leader.specs?.[1]?.label?.ru || '');
    setLSpec2LabelEn(leader.specs?.[1]?.label?.en || '');
    setLSpec2Val(leader.specs?.[1]?.value || '');

    setIsAddingNewLeader(false);
  };

  const startAddingLeader = () => {
    setEditingLeaderId(null);
    setLeaderNameKz('');
    setLeaderNameRu('');
    setLeaderNameEn('');
    setLeaderTitleKz('');
    setLeaderTitleRu('');
    setLeaderTitleEn('');
    setLeaderSubKz('Кәсіби Сарапшы');
    setLeaderSubRu('Профессиональный Эксперт');
    setLeaderSubEn('Professional Expert');
    setLeaderImageUrl('');
    setLeaderIconName('CircleUser');
    setLeaderColor('bg-blue-600');
    setLeaderEmail('info@mercuryenergy.kz');
    setLeaderBioKz('');
    setLeaderBioRu('');
    setLeaderBioEn('');

    setLSpec1LabelKz('Тәжірибе');
    setLSpec1LabelRu('Стаж');
    setLSpec1LabelEn('Experience');
    setLSpec1Val('10+ жыл');
    
    setLSpec2LabelKz('Жобалар');
    setLSpec2LabelRu('Проекты');
    setLSpec2LabelEn('Projects');
    setLSpec2Val('25+');

    setIsAddingNewLeader(true);
  };

  const saveLeaderChanges = () => {
    const leaderPayload = {
      id: editingLeaderId || `leader_${Date.now()}`,
      name: { kz: leaderNameKz, ru: leaderNameRu, en: leaderNameEn },
      title: { kz: leaderTitleKz, ru: leaderTitleRu, en: leaderTitleEn },
      sub: { kz: leaderSubKz, ru: leaderSubRu, en: leaderSubEn },
      imageUrl: leaderImageUrl,
      iconName: leaderIconName,
      color: leaderColor,
      email: leaderEmail,
      bio: { kz: leaderBioKz, ru: leaderBioRu, en: leaderBioEn },
      specs: [
        {
          label: { kz: lSpec1LabelKz, ru: lSpec1LabelRu, en: lSpec1LabelEn },
          value: lSpec1Val
        },
        {
          label: { kz: lSpec2LabelKz, ru: lSpec2LabelRu, en: lSpec2LabelEn },
          value: lSpec2Val
        }
      ]
    };

    let updatedList;
    if (isAddingNewLeader) {
      updatedList = [...localLeaders, leaderPayload];
      setIsAddingNewLeader(false);
    } else {
      updatedList = localLeaders.map(l => l.id === editingLeaderId ? leaderPayload : l);
      setEditingLeaderId(null);
    }

    setLocalLeaders(updatedList);
  };

  const deleteLeader = (id: string) => {
    if (confirm('Бұл басшыны тізімнен жоюға сенімдісіз бе?')) {
      const updatedList = localLeaders.filter(l => l.id !== id);
      setLocalLeaders(updatedList);
      if (editingLeaderId === id) setEditingLeaderId(null);
    }
  };

  const handleSaveAllLeaders = () => {
    setIsSavingLeaders(true);
    setTimeout(() => {
      updateLeadersList(localLeaders);
      setIsSavingLeaders(false);
      logUserAction('Ғылыми жетекшілік және басшылық құрамы тізімі жаңартылды');
      safeAlert('Басшылық құрамы сәтті сақталды!');
    }, 600);
  };


  // ==========================================
  // 3. CONTACTS CMS STATES & ACTIONS
  // ==========================================
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

  const [contFeedbackTitleKz, setContFeedbackTitleKz] = useState('');
  const [contFeedbackTitleRu, setContFeedbackTitleRu] = useState('');
  const [contFeedbackTitleEn, setContFeedbackTitleEn] = useState('');
  const [contFeedbackDescKz, setContFeedbackDescKz] = useState('');
  const [contFeedbackDescRu, setContFeedbackDescRu] = useState('');
  const [contFeedbackDescEn, setContFeedbackDescEn] = useState('');

  const [contAboutImageUrl, setContAboutImageUrl] = useState('');
  const [contInfoSystemTitleKz, setContInfoSystemTitleKz] = useState('');
  const [contInfoSystemTitleRu, setContInfoSystemTitleRu] = useState('');
  const [contInfoSystemTitleEn, setContInfoSystemTitleEn] = useState('');
  const [contInfoSystemDescKz, setContInfoSystemDescKz] = useState('');
  const [contInfoSystemDescRu, setContInfoSystemDescRu] = useState('');
  const [contInfoSystemDescEn, setContInfoSystemDescEn] = useState('');
  const [contInfoSystemImage, setContInfoSystemImage] = useState('');

  const [isSavingContacts, setIsSavingContacts] = useState(false);

  useEffect(() => {
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

      setContFeedbackTitleKz(contactsState.feedbackTitleKz || '');
      setContFeedbackTitleRu(contactsState.feedbackTitleRu || '');
      setContFeedbackTitleEn(contactsState.feedbackTitleEn || '');
      setContFeedbackDescKz(contactsState.feedbackDescKz || '');
      setContFeedbackDescRu(contactsState.feedbackDescRu || '');
      setContFeedbackDescEn(contactsState.feedbackDescEn || '');
      
      setContAboutImageUrl(contactsState.aboutImageUrl || '');
      setContInfoSystemTitleKz(contactsState.infoSystemTitleKz || '');
      setContInfoSystemTitleRu(contactsState.infoSystemTitleRu || '');
      setContInfoSystemTitleEn(contactsState.infoSystemTitleEn || '');
      setContInfoSystemDescKz(contactsState.infoSystemDescKz || '');
      setContInfoSystemDescRu(contactsState.infoSystemDescRu || '');
      setContInfoSystemDescEn(contactsState.infoSystemDescEn || '');
      setContInfoSystemImage(contactsState.infoSystemImage || '');
    }
  }, [contactsState]);

  const handleSaveContacts = () => {
    setIsSavingContacts(true);
    setTimeout(() => {
      updateContactsState({
        aboutTitleKz: contAboutTitleKz,
        aboutTitleRu: contAboutTitleRu,
        aboutTitleEn: contAboutTitleEn,
        aboutSubtitleKz: contAboutSubtitleKz,
        aboutSubtitleRu: contAboutSubtitleRu,
        aboutSubtitleEn: contAboutSubtitleEn,
        aboutDescKz: contAboutDescKz,
        aboutDescRu: contAboutDescRu,
        aboutDescEn: contAboutDescEn,
        
        statVolKz: contStatVolKz,
        statVolRu: contStatVolRu,
        statVolEn: contStatVolEn,
        statVolValue: contStatVolVal,

        statTanksKz: contStatTanksKz,
        statTanksRu: contStatTanksRu,
        statTanksEn: contStatTanksEn,
        statTanksValue: contStatTanksVal,

        statLaunchKz: contStatLaunchKz,
        statLaunchRu: contStatLaunchRu,
        statLaunchEn: contStatLaunchEn,
        statLaunchValue: contStatLaunchVal,

        statDistKz: contStatDistKz,
        statDistRu: contStatDistRu,
        statDistEn: contStatDistEn,
        statDistValue: contStatDistVal,

        addressValKz: contAddressKz,
        addressValRu: contAddressRu,
        addressValEn: contAddressEn,
        
        phone: contPhone,
        email: contEmail,

        hoursValKz: contHoursKz,
        hoursValRu: contHoursRu,
        hoursValEn: contHoursEn,

        feedbackTitleKz: contFeedbackTitleKz,
        feedbackTitleRu: contFeedbackTitleRu,
        feedbackTitleEn: contFeedbackTitleEn,
        feedbackDescKz: contFeedbackDescKz,
        feedbackDescRu: contFeedbackDescRu,
        feedbackDescEn: contFeedbackDescEn,
        
        aboutImageUrl: contAboutImageUrl,
        infoSystemTitleKz: contInfoSystemTitleKz,
        infoSystemTitleRu: contInfoSystemTitleRu,
        infoSystemTitleEn: contInfoSystemTitleEn,
        infoSystemDescKz: contInfoSystemDescKz,
        infoSystemDescRu: contInfoSystemDescRu,
        infoSystemDescEn: contInfoSystemDescEn,
        infoSystemImage: contInfoSystemImage
      });
      setIsSavingContacts(false);
      logUserAction('Байланыс және компания туралы мәліметтер жаңартылды');
      safeAlert('Байланыс деректері мен статистика сәтті жаңартылды!');
    }, 600);
  };


  return (
    <div id="cms-master-panel" className="space-y-6">
      
      {/* Sub-tabs row */}
      <div className="flex flex-wrap gap-2 p-1.5 bg-slate-100 rounded-2xl border border-slate-200 max-w-3xl">
        <button
          type="button"
          onClick={() => setSubTab('slider')}
          className={`flex-1 min-w-[130px] flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
            subTab === 'slider' 
              ? 'bg-blue-600 text-white shadow' 
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>Промо-слайдер</span>
        </button>

        <button
          type="button"
          onClick={() => setSubTab('leaders')}
          className={`flex-1 min-w-[130px] flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
            subTab === 'leaders' 
              ? 'bg-blue-600 text-white shadow' 
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Басшылық құрамы</span>
        </button>

        <button
          type="button"
          onClick={() => setSubTab('contacts')}
          className={`flex-1 min-w-[130px] flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
            subTab === 'contacts' 
              ? 'bg-blue-600 text-white shadow' 
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Байланыс & Компания</span>
        </button>

        <button
          type="button"
          onClick={() => setSubTab('news')}
          className={`flex-1 min-w-[130px] flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
            subTab === 'news' 
              ? 'bg-blue-600 text-white shadow' 
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Жаңалықтар тізімі</span>
        </button>
      </div>

      {/* SECTION 1: SLIDER MANAGEMENT */}
      {subTab === 'slider' && (
        <div className="space-y-6 animate-fade-in text-left">
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-base font-extrabold text-slate-900 font-sans">Басты беттің слайдерін басқару</h3>
              <p className="text-xs text-slate-500 mt-0.5">Интерактивті слайдтар, дизайн, автоматты ауысу жылдамдығы.</p>
            </div>
            <button
              type="button"
              onClick={handleSaveSliderGlobal}
              disabled={isSavingSlider}
              className="w-full sm:w-auto px-5 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-400 text-white rounded-xl text-xs font-black uppercase tracking-wider shadow flex items-center justify-center gap-1.5 transition cursor-pointer"
            >
              {isSavingSlider ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
              <span>Слайдер өзгерістерін сақтау</span>
            </button>
          </div>

          {/* GLOBAL CONFIGURATION */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/60 grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white p-3 rounded-lg border border-slate-200 flex items-center justify-between">
              <div>
                <label className="text-[11px] font-bold text-slate-700 block">Автоматты ауысу</label>
                <span className="text-[9px] text-slate-400">Слайдтар секунд сайын ауысады</span>
              </div>
              <input
                type="checkbox"
                checked={sliderAutoplay}
                onChange={(e) => setSliderAutoplay(e.target.checked)}
                className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
              />
            </div>

            <div className="bg-white p-3 rounded-lg border border-slate-200">
              <label className="text-[11px] font-bold text-slate-700 block mb-1">Ауысу жылдамдығы</label>
              <div className="flex items-center gap-1.5">
                <input
                  type="number"
                  min={2}
                  max={30}
                  value={sliderAutoplaySpeed}
                  onChange={(e) => setSliderAutoplaySpeed(Number(e.target.value))}
                  disabled={!sliderAutoplay}
                  className="w-full px-2 py-1 rounded border border-slate-200 text-xs font-bold text-slate-900 disabled:bg-slate-55"
                />
                <span className="text-[10px] text-slate-400">сек</span>
              </div>
            </div>

            <div className="bg-white p-3 rounded-lg border border-slate-200 flex items-center justify-between">
              <div>
                <label className="text-[11px] font-bold text-slate-700 block">Нүкте индикаторлары</label>
                <span className="text-[9px] text-slate-400">Слайдтар астындағы нүктелер</span>
              </div>
              <input
                type="checkbox"
                checked={sliderShowIndicators}
                onChange={(e) => setSliderShowIndicators(e.target.checked)}
                className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
              />
            </div>

            <div className="bg-white p-3 rounded-lg border border-slate-200 flex items-center justify-between">
              <div>
                <label className="text-[11px] font-bold text-slate-700 block">Бағыттауыш тілдер</label>
                <span className="text-[9px] text-slate-400">Стрелкаларды көрсету</span>
              </div>
              <input
                type="checkbox"
                checked={sliderShowArrows}
                onChange={(e) => setSliderShowArrows(e.target.checked)}
                className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
              />
            </div>
          </div>

          {/* SLIDES LIST */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-xs font-black text-slate-800 uppercase tracking-wider block font-sans">Слайдтар тізімі</span>
              <button
                type="button"
                onClick={startAddingSlide}
                className="flex items-center gap-1.5 px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Жаңа слайд қосу</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {slides.map((slide, index) => {
                const isSelected = editingSlideId === slide.id;
                return (
                  <div 
                    key={slide.id}
                    className={`p-4 rounded-xl border transition flex flex-col justify-between space-y-3 ${
                      isSelected ? 'border-blue-500 bg-blue-50/20 ring-2 ring-blue-500/15' : 'border-slate-250 bg-white hover:border-slate-350'
                    }`}
                  >
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-[10px] font-mono text-slate-400 font-bold">#{index + 1}</span>
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            disabled={index === 0}
                            onClick={() => moveSlide(index, 'up')}
                            className="p-1 rounded bg-slate-100 hover:bg-slate-200 disabled:opacity-40 text-slate-600"
                          >
                            <ArrowUp className="w-3 h-3" />
                          </button>
                          <button
                            type="button"
                            disabled={index === slides.length - 1}
                            onClick={() => moveSlide(index, 'down')}
                            className="p-1 rounded bg-slate-100 hover:bg-slate-200 disabled:opacity-40 text-slate-600"
                          >
                            <ArrowDown className="w-3 h-3" />
                          </button>
                        </div>
                      </div>

                      <div 
                        className="h-20 rounded-lg overflow-hidden relative flex items-center justify-center p-2 text-center"
                        style={slide.bgType === 'image' ? { backgroundImage: `url('${slide.bgImage}')`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
                      >
                        <div className="absolute inset-0 bg-slate-950/60" />
                        <span className="relative z-10 text-[10px] font-bold text-white line-clamp-2 leading-tight px-1">
                          {slide.titleKz || 'Атаусыз слайд'}
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => startEditingSlide(slide)}
                        className="flex-1 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-[10px] rounded-lg transition"
                      >
                        Редакциялау
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteSlide(slide.id)}
                        className="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* SLIDE EDITOR PANEL */}
          {(editingSlideId !== null || isAddingNewSlide) && (
            <div className="bg-white p-5 rounded-2xl border-2 border-blue-500 space-y-6">
              <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                <span className="font-extrabold text-sm text-slate-950 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-blue-500" />
                  {isAddingNewSlide ? 'Жаңа Слайд Құрастыру' : 'Слайдты Редакциялау'}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setEditingSlideId(null);
                    setIsAddingNewSlide(false);
                  }}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Background configs */}
                <div className="space-y-4">
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                    <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block">Дизайн және Мұқаба</span>
                    
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-700 block">Фон түрі</label>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => setSlideBgType('image')}
                          className={`flex-1 py-1 text-xs font-bold rounded-lg border transition ${
                            slideBgType === 'image' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-600 border-slate-200'
                          }`}
                        >
                          Сурет (Image)
                        </button>
                        <button
                          type="button"
                          onClick={() => setSlideBgType('gradient')}
                          className={`flex-1 py-1 text-xs font-bold rounded-lg border transition ${
                            slideBgType === 'gradient' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-600 border-slate-200'
                          }`}
                        >
                          Градиент (Gradient)
                        </button>
                      </div>
                    </div>

                    {slideBgType === 'image' ? (
                      <Base64ImageUploader 
                        value={slideBgImage}
                        onChange={(b64) => setSlideBgImage(b64)}
                        label="Слайдтың суреті (Drag-and-Drop немесе Таңдау)"
                      />
                    ) : (
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-600 block">Градиент коды (Tailwind):</label>
                        <input
                          type="text"
                          value={slideBgGradient}
                          onChange={(e) => setSlideBgGradient(e.target.value)}
                          className="w-full px-3 py-1.5 bg-white border border-slate-200 text-xs rounded font-mono"
                        />
                      </div>
                    )}

                    <div className="space-y-1.5">
                      <div className="flex justify-between text-[11px] font-bold text-slate-700">
                        <span>Күңгірттеу деңгейі (Overlay):</span>
                        <span className="text-blue-600">{Math.round(slideOverlayOpacity * 100)}%</span>
                      </div>
                      <input
                        type="range"
                        min="0.1"
                        max="0.95"
                        step="0.05"
                        value={slideOverlayOpacity}
                        onChange={(e) => setSlideOverlayOpacity(Number(e.target.value))}
                        className="w-full"
                      />
                    </div>
                  </div>
                </div>

                {/* Multilingual labels & Buttons */}
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                  <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block">Бағыттау және Батырмалар</span>
                  
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-700 block">Батырма мәтіні (Қазақша / Русский / English)</label>
                    <div className="space-y-2">
                      <input
                        type="text"
                        placeholder="KZ Мәтіні"
                        value={slideButtonTextKz}
                        onChange={(e) => setSlideButtonTextKz(e.target.value)}
                        className="w-full px-3 py-1.5 rounded bg-white border border-slate-200 text-xs"
                      />
                      <input
                        type="text"
                        placeholder="RU Текст"
                        value={slideButtonTextRu}
                        onChange={(e) => setSlideButtonTextRu(e.target.value)}
                        className="w-full px-3 py-1.5 rounded bg-white border border-slate-200 text-xs"
                      />
                      <input
                        type="text"
                        placeholder="EN Text"
                        value={slideButtonTextEn}
                        onChange={(e) => setSlideButtonTextEn(e.target.value)}
                        className="w-full px-3 py-1.5 rounded bg-white border border-slate-200 text-xs"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-750 block">Батырма сілтемесі</label>
                    <input
                      type="text"
                      value={slideButtonLink}
                      onChange={(e) => setSlideButtonLink(e.target.value)}
                      placeholder="/prices немесе сыртқы сілтеме"
                      className="w-full px-3 py-1.5 rounded bg-white border border-slate-200 text-xs font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* SLIDE TEXT EDITING (KZ / RU / EN) */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
                  <span className="text-[10px] uppercase font-black text-amber-600 block">Қазақ тілі</span>
                  <input
                    type="text"
                    placeholder="Басты тақырыбы"
                    value={slideTitleKz}
                    onChange={(e) => setSlideTitleKz(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded text-xs font-extrabold"
                  />
                  <textarea
                    rows={3}
                    placeholder="Қысқаша сипаттамасы..."
                    value={slideDescKz}
                    onChange={(e) => setSlideDescKz(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded text-xs leading-relaxed"
                  />
                </div>

                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
                  <span className="text-[10px] uppercase font-black text-blue-600 block">Русский язык</span>
                  <input
                    type="text"
                    placeholder="Заголовок"
                    value={slideTitleRu}
                    onChange={(e) => setSlideTitleRu(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded text-xs font-extrabold"
                  />
                  <textarea
                    rows={3}
                    placeholder="Краткое описание..."
                    value={slideDescRu}
                    onChange={(e) => setSlideDescRu(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded text-xs leading-relaxed"
                  />
                </div>

                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
                  <span className="text-[10px] uppercase font-black text-indigo-600 block">English language</span>
                  <input
                    type="text"
                    placeholder="Title"
                    value={slideTitleEn}
                    onChange={(e) => setSlideTitleEn(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded text-xs font-extrabold"
                  />
                  <textarea
                    rows={3}
                    placeholder="Short description..."
                    value={slideDescEn}
                    onChange={(e) => setSlideDescEn(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded text-xs leading-relaxed"
                  />
                </div>
              </div>

              {/* EDITOR FOOTER ACTION */}
              <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setEditingSlideId(null);
                    setIsAddingNewSlide(false);
                  }}
                  className="px-4 py-2 bg-slate-150 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition"
                >
                  Қайтару
                </button>
                <button
                  type="button"
                  onClick={saveSlideChanges}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-black flex items-center gap-1 transition"
                >
                  <Check className="w-4 h-4" />
                  <span>Тізімге Енгізу</span>
                </button>
              </div>
            </div>
          )}

        </div>
      )}

      {/* SECTION 2: LEADERS LIST MANAGEMENT */}
      {subTab === 'leaders' && (
        <div className="space-y-6 animate-fade-in text-left">
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-base font-extrabold text-slate-900 font-sans">Басшылық және Ғылыми жетекшілік құрамын басқару</h3>
              <p className="text-xs text-slate-500 mt-0.5">Басшылық парақшасының құрамын, суреттерін және егжей-тегжейлі өмірбаяндарын толық баптау.</p>
            </div>
            <button
              type="button"
              onClick={handleSaveAllLeaders}
              disabled={isSavingLeaders}
              className="w-full sm:w-auto px-5 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-400 text-white rounded-xl text-xs font-black uppercase tracking-wider shadow flex items-center justify-center gap-1.5 transition cursor-pointer"
            >
              {isSavingLeaders ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
              <span>Өзгерістерді Сақтау</span>
            </button>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-xs font-black text-slate-800 uppercase tracking-wider block font-sans">Тұлғалар Тізімі</span>
            <button
              type="button"
              onClick={startAddingLeader}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Жаңа Тұлға Қосу</span>
            </button>
          </div>

          {/* Leaders table-like card list */}
          <div className="grid grid-cols-1 gap-4">
            {localLeaders.map((leader, index) => (
              <div 
                key={leader.id || index}
                className="p-4 bg-white border border-slate-200 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-slate-350 transition"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  {leader.imageUrl ? (
                    <img 
                      src={leader.imageUrl} 
                      alt={leader.name?.kz} 
                      className="w-14 h-14 rounded-xl object-cover shrink-0 border border-slate-200" 
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 font-extrabold text-sm shrink-0 border border-blue-200">
                      {leader.name?.kz?.substring(0, 2) || 'LE'}
                    </div>
                  )}
                  <div className="min-w-0">
                    <h4 className="text-xs sm:text-sm font-extrabold text-slate-900 truncate">
                      {leader.name?.kz} / {leader.name?.ru}
                    </h4>
                    <p className="text-[11px] text-slate-500 truncate mt-0.5">
                      {leader.title?.kz}
                    </p>
                    <span className="text-[9px] uppercase font-black text-amber-600 block mt-1 font-mono">
                      {leader.email || 'no-email'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto justify-end">
                  <button
                    type="button"
                    onClick={() => startEditingLeader(leader)}
                    className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs rounded-lg transition"
                  >
                    Өңдеу
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteLeader(leader.id)}
                    className="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* LEADER EDITOR ACCORDION */}
          {(editingLeaderId !== null || isAddingNewLeader) && (
            <div className="bg-white p-5 rounded-2xl border-2 border-blue-500 space-y-6">
              <div className="flex justify-between items-center pb-2 border-b border-slate-150">
                <span className="font-extrabold text-sm text-slate-950">
                  {isAddingNewLeader ? 'Жаңа басшылық мүшесін құру' : 'Басшының анкеталық деректерін өңдеу'}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setEditingLeaderId(null);
                    setIsAddingNewLeader(false);
                  }}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                {/* Left col: Image and visual specs */}
                <div className="md:col-span-4 space-y-4">
                  <Base64ImageUploader 
                    value={leaderImageUrl}
                    onChange={(b64) => setLeaderImageUrl(b64)}
                    label="Басшының ресми фотосуреті (Drag-and-Drop / Импорт)"
                  />

                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-3">
                    <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block">Дизайн параметрлері</span>
                    
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-600 block">Таңба белгішесі (Icon):</label>
                      <select 
                        value={leaderIconName}
                        onChange={(e) => setLeaderIconName(e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded bg-white border border-slate-200 text-xs"
                      >
                        <option value="CircleUser">Пайдаланушы (CircleUser)</option>
                        <option value="Award">Марапаттар (Award)</option>
                        <option value="FlaskConical">Технология / Зертхана (FlaskConical)</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-600 block">Белгішенің фоны (Color):</label>
                      <select 
                        value={leaderColor}
                        onChange={(e) => setLeaderColor(e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded bg-white border border-slate-200 text-xs"
                      >
                        <option value="bg-blue-600">Көк (Blue)</option>
                        <option value="bg-amber-550">Сарғылт (Amber)</option>
                        <option value="bg-emerald-600">Жасыл (Emerald)</option>
                        <option value="bg-slate-700">Сұр (Slate)</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-600 block">Байланыс Email:</label>
                      <input 
                        type="email"
                        value={leaderEmail}
                        onChange={(e) => setLeaderEmail(e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded text-xs font-mono"
                      />
                    </div>
                  </div>
                </div>

                {/* Right col: Multi-lingual entries */}
                <div className="md:col-span-8 space-y-4">
                  {/* Localized Name, Title and specs */}
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-4">
                    
                    {/* Names Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500 block">Аты-жөні (Қазақша):</label>
                        <input 
                          type="text" 
                          value={leaderNameKz} 
                          onChange={(e) => setLeaderNameKz(e.target.value)}
                          className="w-full px-2.5 py-1.5 rounded bg-white border border-slate-200 text-xs font-extrabold"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500 block">ФИО (Русский):</label>
                        <input 
                          type="text" 
                          value={leaderNameRu} 
                          onChange={(e) => setLeaderNameRu(e.target.value)}
                          className="w-full px-2.5 py-1.5 rounded bg-white border border-slate-200 text-xs font-extrabold"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500 block">Full Name (English):</label>
                        <input 
                          type="text" 
                          value={leaderNameEn} 
                          onChange={(e) => setLeaderNameEn(e.target.value)}
                          className="w-full px-2.5 py-1.5 rounded bg-white border border-slate-200 text-xs font-extrabold"
                        />
                      </div>
                    </div>

                    {/* Titles Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500 block">Қызмет лауазымы (KZ):</label>
                        <input 
                          type="text" 
                          value={leaderTitleKz} 
                          onChange={(e) => setLeaderTitleKz(e.target.value)}
                          className="w-full px-2.5 py-1.5 rounded bg-white border border-slate-200 text-xs"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500 block">Должность (RU):</label>
                        <input 
                          type="text" 
                          value={leaderTitleRu} 
                          onChange={(e) => setLeaderTitleRu(e.target.value)}
                          className="w-full px-2.5 py-1.5 rounded bg-white border border-slate-200 text-xs"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500 block">Official Position (EN):</label>
                        <input 
                          type="text" 
                          value={leaderTitleEn} 
                          onChange={(e) => setLeaderTitleEn(e.target.value)}
                          className="w-full px-2.5 py-1.5 rounded bg-white border border-slate-200 text-xs"
                        />
                      </div>
                    </div>

                    {/* Sub labels/Certificates info Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1 border-t border-slate-200/50">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500 block">Қосымша мәртебе (KZ):</label>
                        <input 
                          type="text" 
                          value={leaderSubKz} 
                          onChange={(e) => setLeaderSubKz(e.target.value)}
                          className="w-full px-2.5 py-1.5 rounded bg-white border border-slate-200 text-xs"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500 block">Статус / Степень (RU):</label>
                        <input 
                          type="text" 
                          value={leaderSubRu} 
                          onChange={(e) => setLeaderSubRu(e.target.value)}
                          className="w-full px-2.5 py-1.5 rounded bg-white border border-slate-200 text-xs"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500 block">Expert Badge (EN):</label>
                        <input 
                          type="text" 
                          value={leaderSubEn} 
                          onChange={(e) => setLeaderSubEn(e.target.value)}
                          className="w-full px-2.5 py-1.5 rounded bg-white border border-slate-200 text-xs"
                        />
                      </div>
                    </div>

                  </div>

                  {/* Leader Specs and Metrics */}
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                    <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block">Тұлғалық Көрсеткіштер (Metrics)</span>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Metric 1 */}
                      <div className="space-y-2 p-2.5 bg-white border border-slate-200 rounded-lg">
                        <span className="text-[9px] uppercase font-black text-slate-400 block">Көрсеткіш #1</span>
                        <input 
                          type="text" 
                          placeholder="Шамасы (мысалы: 20+ жыл)" 
                          value={lSpec1Val}
                          onChange={(e) => setLSpec1Val(e.target.value)}
                          className="w-full px-2 py-1.5 rounded bg-slate-50 border border-slate-200 text-xs font-mono font-bold"
                        />
                        <div className="space-y-1 mt-1.5">
                          <input 
                            type="text" 
                            placeholder="Мәні KZ (мысалы: Тәжірибе)" 
                            value={lSpec1LabelKz}
                            onChange={(e) => setLSpec1LabelKz(e.target.value)}
                            className="w-full px-2 py-1 border border-slate-200 rounded text-[10px]"
                          />
                          <input 
                            type="text" 
                            placeholder="Мәні RU (мысалы: Стаж)" 
                            value={lSpec1LabelRu}
                            onChange={(e) => setLSpec1LabelRu(e.target.value)}
                            className="w-full px-2 py-1 border border-slate-200 rounded text-[10px]"
                          />
                        </div>
                      </div>

                      {/* Metric 2 */}
                      <div className="space-y-2 p-2.5 bg-white border border-slate-200 rounded-lg">
                        <span className="text-[9px] uppercase font-black text-slate-400 block">Көрсеткіш #2</span>
                        <input 
                          type="text" 
                          placeholder="Шамасы (мысалы: JIG)" 
                          value={lSpec2Val}
                          onChange={(e) => setLSpec2Val(e.target.value)}
                          className="w-full px-2 py-1.5 rounded bg-slate-50 border border-slate-200 text-xs font-mono font-bold"
                        />
                        <div className="space-y-1 mt-1.5">
                          <input 
                            type="text" 
                            placeholder="Мәні KZ" 
                            value={lSpec2LabelKz}
                            onChange={(e) => setLSpec2LabelKz(e.target.value)}
                            className="w-full px-2 py-1 border border-slate-200 rounded text-[10px]"
                          />
                          <input 
                            type="text" 
                            placeholder="Мәні RU" 
                            value={lSpec2LabelRu}
                            onChange={(e) => setLSpec2LabelRu(e.target.value)}
                            className="w-full px-2 py-1 border border-slate-200 rounded text-[10px]"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Multi-lingual biographies */}
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-4">
                    <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block">Биография мен Квалификация мәтіндері</span>
                    
                    <div className="space-y-3">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-amber-700 block">KZ Өмірбаяны мен Кәсіби дамуы:</label>
                        <textarea 
                          rows={4} 
                          value={leaderBioKz} 
                          onChange={(e) => setLeaderBioKz(e.target.value)}
                          className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded text-xs leading-relaxed"
                          placeholder="Басшы туралы егжей-тегжейлі мәтін қазақ тілінде..."
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-blue-700 block">RU Биография и квалификация:</label>
                        <textarea 
                          rows={4} 
                          value={leaderBioRu} 
                          onChange={(e) => setLeaderBioRu(e.target.value)}
                          className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded text-xs leading-relaxed"
                          placeholder="Подробный текст о руководителе на русском языке..."
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-indigo-700 block">EN Biography & Credentials:</label>
                        <textarea 
                          rows={4} 
                          value={leaderBioEn} 
                          onChange={(e) => setLeaderBioEn(e.target.value)}
                          className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded text-xs leading-relaxed"
                          placeholder="Detailed biography text in English..."
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* EDITOR FOOTER ACTION */}
              <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setEditingLeaderId(null);
                    setIsAddingNewLeader(false);
                  }}
                  className="px-4 py-2 bg-slate-150 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition"
                >
                  Қайтару
                </button>
                <button
                  type="button"
                  onClick={saveLeaderChanges}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-black flex items-center gap-1 transition"
                >
                  <Check className="w-4 h-4" />
                  <span>Басшылар Тізіміне Қосу</span>
                </button>
              </div>

            </div>
          )}

        </div>
      )}

      {/* SECTION 3: CONTACTS & COMPANY PROFILE MANAGEMENT */}
      {subTab === 'contacts' && (
        <div className="space-y-6 animate-fade-in text-left">
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-base font-extrabold text-slate-900 font-sans">Байланыс модулі және "Компания жайлы" блогын басқару</h3>
              <p className="text-xs text-slate-500 mt-0.5">Резервуарлар саны, сыйымдылығы, телефондар, мекенжайлар, жұмыс уақыты және компания туралы ресми мәтіндерді редакциялау.</p>
            </div>
            <button
              type="button"
              onClick={handleSaveContacts}
              disabled={isSavingContacts}
              className="w-full sm:w-auto px-5 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-400 text-white rounded-xl text-xs font-black uppercase tracking-wider shadow flex items-center justify-center gap-1.5 transition cursor-pointer"
            >
              {isSavingContacts ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
              <span>Мәліметтерді Сақтау</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* ABOUT COMPANY TEXT CARD */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-4">
              <span className="text-[11px] font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                <Info className="w-4 h-4 text-blue-500" />
                Компания туралы ресми мәтіндер
              </span>

              {/* Title & Subtitle */}
              <div className="space-y-3">
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 block">KZ Тақырыбы:</label>
                    <input 
                      type="text" 
                      value={contAboutTitleKz} 
                      onChange={(e) => setContAboutTitleKz(e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded text-xs font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 block">RU Заголовок:</label>
                    <input 
                      type="text" 
                      value={contAboutTitleRu} 
                      onChange={(e) => setContAboutTitleRu(e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded text-xs font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 block">EN Title:</label>
                    <input 
                      type="text" 
                      value={contAboutTitleEn} 
                      onChange={(e) => setContAboutTitleEn(e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded text-xs font-bold"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-600 block">KZ Кіріспе сур-мәтіні (Subtitle):</label>
                  <input 
                    type="text" 
                    value={contAboutSubtitleKz} 
                    onChange={(e) => setContAboutSubtitleKz(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-600 block">RU Подзаголовок (Subtitle):</label>
                  <input 
                    type="text" 
                    value={contAboutSubtitleRu} 
                    onChange={(e) => setContAboutSubtitleRu(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-600 block">EN Subtitle:</label>
                  <input 
                    type="text" 
                    value={contAboutSubtitleEn} 
                    onChange={(e) => setContAboutSubtitleEn(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded text-xs"
                  />
                </div>
              </div>

              {/* Descriptions */}
              <div className="space-y-3 pt-3 border-t border-slate-200/50">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-700 block">KZ Толық сипаттамасы:</label>
                  <textarea 
                    rows={4} 
                    value={contAboutDescKz} 
                    onChange={(e) => setContAboutDescKz(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded text-xs leading-relaxed"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-700 block">RU Описание компании:</label>
                  <textarea 
                    rows={4} 
                    value={contAboutDescRu} 
                    onChange={(e) => setContAboutDescRu(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded text-xs leading-relaxed"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-700 block">EN Detailed Description:</label>
                  <textarea 
                    rows={4} 
                    value={contAboutDescEn} 
                    onChange={(e) => setContAboutDescEn(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded text-xs leading-relaxed"
                  />
                </div>
                
                {/* About Image Uploader */}
                <div className="pt-3 border-t border-slate-200/50">
                  <Base64ImageUploader 
                    value={contAboutImageUrl}
                    onChange={(base64) => setContAboutImageUrl(base64)}
                    label="Компанияның басты суреті (About Image)"
                  />
                </div>
              </div>
            </div>

            {/* STATS & COORDINATES */}
            <div className="space-y-6">
              {/* Stats values */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-4">
                <span className="text-[11px] font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                  <Sliders className="w-4 h-4 text-amber-550" />
                  Парк көрсеткіштері мен статистикалары
                </span>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white p-2.5 rounded border border-slate-200 space-y-1.5">
                    <span className="text-[9px] uppercase font-bold text-slate-400 block leading-none">#1 Сыйымдылық</span>
                    <input 
                      type="text" 
                      placeholder="KZ Белгі" 
                      value={contStatVolKz} 
                      onChange={(e) => setContStatVolKz(e.target.value)}
                      className="w-full px-2 py-1 border border-slate-200 rounded text-[10px]"
                    />
                    <input 
                      type="text" 
                      placeholder="Мәні (мысалы: 19 000 м³)" 
                      value={contStatVolVal} 
                      onChange={(e) => setContStatVolVal(e.target.value)}
                      className="w-full px-2 py-1 border border-slate-200 rounded text-[10px] font-mono font-bold"
                    />
                  </div>

                  <div className="bg-white p-2.5 rounded border border-slate-200 space-y-1.5">
                    <span className="text-[9px] uppercase font-bold text-slate-400 block leading-none">#2 Резервуарлар</span>
                    <input 
                      type="text" 
                      placeholder="KZ Белгі" 
                      value={contStatTanksKz} 
                      onChange={(e) => setContStatTanksKz(e.target.value)}
                      className="w-full px-2 py-1 border border-slate-200 rounded text-[10px]"
                    />
                    <input 
                      type="text" 
                      placeholder="Мәні (мысалы: 13 резервуар)" 
                      value={contStatTanksVal} 
                      onChange={(e) => setContStatTanksVal(e.target.value)}
                      className="w-full px-2 py-1 border border-slate-200 rounded text-[10px] font-mono font-bold"
                    />
                  </div>

                  <div className="bg-white p-2.5 rounded border border-slate-200 space-y-1.5">
                    <span className="text-[9px] uppercase font-bold text-slate-400 block leading-none">#3 Жыл</span>
                    <input 
                      type="text" 
                      placeholder="KZ Белгі" 
                      value={contStatLaunchKz} 
                      onChange={(e) => setContStatLaunchKz(e.target.value)}
                      className="w-full px-2 py-1 border border-slate-200 rounded text-[10px]"
                    />
                    <input 
                      type="text" 
                      placeholder="Мәні (мысалы: 2018 жыл)" 
                      value={contStatLaunchVal} 
                      onChange={(e) => setContStatLaunchVal(e.target.value)}
                      className="w-full px-2 py-1 border border-slate-200 rounded text-[10px] font-mono font-bold"
                    />
                  </div>

                  <div className="bg-white p-2.5 rounded border border-slate-200 space-y-1.5">
                    <span className="text-[9px] uppercase font-bold text-slate-400 block leading-none">#4 Қашықтық</span>
                    <input 
                      type="text" 
                      placeholder="KZ Белгі" 
                      value={contStatDistKz} 
                      onChange={(e) => setContStatDistKz(e.target.value)}
                      className="w-full px-2 py-1 border border-slate-200 rounded text-[10px]"
                    />
                    <input 
                      type="text" 
                      placeholder="Мәні (мысалы: 6 км қашықтық)" 
                      value={contStatDistVal} 
                      onChange={(e) => setContStatDistVal(e.target.value)}
                      className="w-full px-2 py-1 border border-slate-200 rounded text-[10px] font-mono font-bold"
                    />
                  </div>
                </div>
              </div>

              {/* Coordinates and physical specs */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-4">
                <span className="text-[11px] font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-blue-500" />
                  Физикалық мекенжайлар мен байланыстар
                </span>

                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-600 block">Мекенжай (KZ):</label>
                    <input 
                      type="text" 
                      value={contAddressKz} 
                      onChange={(e) => setContAddressKz(e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-600 block">Адрес компании (RU):</label>
                    <input 
                      type="text" 
                      value={contAddressRu} 
                      onChange={(e) => setContAddressRu(e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded text-xs"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-1 border-t border-slate-200/50">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-600 block">Ресми телефон:</label>
                      <input 
                        type="text" 
                        value={contPhone} 
                        onChange={(e) => setContPhone(e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded text-xs font-mono font-bold"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-600 block">Ресми Email:</label>
                      <input 
                        type="email" 
                        value={contEmail} 
                        onChange={(e) => setContEmail(e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded text-xs font-mono font-bold"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5 pt-1 border-t border-slate-200/50">
                    <label className="text-[10px] font-bold text-slate-600 block">Жұмыс уақыты (KZ / RU / EN):</label>
                    <div className="space-y-1.5">
                      <input 
                        type="text" 
                        placeholder="KZ уақыты"
                        value={contHoursKz} 
                        onChange={(e) => setContHoursKz(e.target.value)}
                        className="w-full px-2.5 py-1 bg-white border border-slate-200 rounded text-xs"
                      />
                      <input 
                        type="text" 
                        placeholder="RU время"
                        value={contHoursRu} 
                        onChange={(e) => setContHoursRu(e.target.value)}
                        className="w-full px-2.5 py-1 bg-white border border-slate-200 rounded text-xs"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* FEEDBACK MODULE TITLES */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-4">
                <span className="text-[11px] font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                  <Mail className="w-4 h-4 text-emerald-550" />
                  Кері байланыс модулінің мәтіндері
                </span>

                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 block">Форма тақырыбы (KZ):</label>
                      <input 
                        type="text" 
                        value={contFeedbackTitleKz} 
                        onChange={(e) => setContFeedbackTitleKz(e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded text-xs font-bold"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 block">Форма тақырыбы (RU):</label>
                      <input 
                        type="text" 
                        value={contFeedbackTitleRu} 
                        onChange={(e) => setContFeedbackTitleRu(e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded text-xs font-bold"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 block">Сипаттамасы (KZ):</label>
                    <input 
                      type="text" 
                      value={contFeedbackDescKz} 
                      onChange={(e) => setContFeedbackDescKz(e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 block">Описание (RU):</label>
                    <input 
                      type="text" 
                      value={contFeedbackDescRu} 
                      onChange={(e) => setContFeedbackDescRu(e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded text-xs"
                    />
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Ақпараттық Жүйе (Бағалар беті) басқару */}
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4 mt-6">
            <span className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
              <Info className="w-4 h-4 text-blue-500" />
              Бағалар бетіндегі "Ақпараттық Жүйе" панелін басқару
            </span>
            <p className="text-xs text-slate-500">Бұл модуль Бағалар бетіндегі ресми баға саясаты мен ақпараттық панельдің тақырыбын, мәтінін және фонына қойылатын суретті өңдейді.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-600 block">KZ Панель Тақырыбы:</label>
                  <input 
                    type="text" 
                    value={contInfoSystemTitleKz} 
                    onChange={(e) => setContInfoSystemTitleKz(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded text-xs font-bold"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-600 block">RU Заголовок Панели:</label>
                  <input 
                    type="text" 
                    value={contInfoSystemTitleRu} 
                    onChange={(e) => setContInfoSystemTitleRu(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded text-xs font-bold"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-600 block">EN Panel Title:</label>
                  <input 
                    type="text" 
                    value={contInfoSystemTitleEn} 
                    onChange={(e) => setContInfoSystemTitleEn(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded text-xs font-bold"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-600 block">KZ Мәтіні:</label>
                  <textarea 
                    rows={3} 
                    value={contInfoSystemDescKz} 
                    onChange={(e) => setContInfoSystemDescKz(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded text-xs leading-relaxed"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-600 block">RU Текст:</label>
                  <textarea 
                    rows={3} 
                    value={contInfoSystemDescRu} 
                    onChange={(e) => setContInfoSystemDescRu(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded text-xs leading-relaxed"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200/50">
              <Base64ImageUploader 
                value={contInfoSystemImage}
                onChange={(base64) => setContInfoSystemImage(base64)}
                label="Ақпараттық Жүйе фонына қойылатын сурет (Info System BG Image)"
              />
            </div>
          </div>

        </div>
      )}

      {subTab === 'news' && (
        <div className="space-y-6 animate-fade-in text-left">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-base font-extrabold text-slate-900 font-sans">Жаңалықтар мен мақалаларды басқару</h3>
              <p className="text-xs text-slate-500 mt-0.5">Сайттағы жаңалықтарды қосу, өзгерту, уақытша өшіру немесе жою.</p>
            </div>
            {!editingNewsId && !isAddingNewNews && (
              <button
                type="button"
                onClick={startAddingNews}
                className="w-full sm:w-auto px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-black uppercase tracking-wider shadow flex items-center justify-center gap-1.5 transition cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Жаңалық қосу</span>
              </button>
            )}
          </div>

          {(editingNewsId || isAddingNewNews) ? (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
              <h4 className="text-sm font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5 pb-2 border-b border-slate-100">
                <Edit className="w-4 h-4 text-blue-600" />
                {isAddingNewNews ? 'Жаңа материал қосу' : 'Материалды өңдеу/түзету'}
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                {/* Form Inputs */}
                <div className="md:col-span-8 space-y-4">
                  {/* Title KZ */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 block">Тақырыбы (KZ):</label>
                    <input
                      type="text"
                      value={newsTitleKz}
                      onChange={(e) => setNewsTitleKz(e.target.value)}
                      placeholder="Қазақша тақырыбы"
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                    />
                  </div>

                  {/* Title RU */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 block">Заголовок новости (RU):</label>
                    <input
                      type="text"
                      value={newsTitleRu}
                      onChange={(e) => setNewsTitleRu(e.target.value)}
                      placeholder="Русский заголовок"
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                    />
                  </div>

                  {/* Title EN */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 block">News Title (EN):</label>
                    <input
                      type="text"
                      value={newsTitleEn}
                      onChange={(e) => setNewsTitleEn(e.target.value)}
                      placeholder="English title"
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                    />
                  </div>

                  {/* Content / Summary KZ */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 block">Мазмұны / Сипаттамасы (KZ):</label>
                    <textarea
                      rows={4}
                      value={newsSummaryKz}
                      onChange={(e) => setNewsSummaryKz(e.target.value)}
                      placeholder="Қазақша толық мәтіні немесе сипаттамасы"
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                    />
                  </div>

                  {/* Content / Summary RU */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 block">Текст новости / Содержание (RU):</label>
                    <textarea
                      rows={4}
                      value={newsSummaryRu}
                      onChange={(e) => setNewsSummaryRu(e.target.value)}
                      placeholder="Русский полный текст или краткое содержание"
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                    />
                  </div>

                  {/* Content / Summary EN */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 block">News Summary / Content (EN):</label>
                    <textarea
                      rows={4}
                      value={newsSummaryEn}
                      onChange={(e) => setNewsSummaryEn(e.target.value)}
                      placeholder="English description or news body"
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                    />
                  </div>
                </div>

                {/* Sidebar Specs & Media */}
                <div className="md:col-span-4 space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 block">Санат (Category):</label>
                    <select
                      value={newsCategory}
                      onChange={(e) => setNewsCategory(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 bg-white rounded-xl text-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                    >
                      <option value="ЖАҢАЛЫҚ">Жаңалық (News)</option>
                      <option value="АҚПАРАТ">Ақпарат (Info)</option>
                      <option value="МАҚАЛА">Мақала (Article)</option>
                      <option value="ТЕНДЕР">Тендер (Tenders)</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 block">Жарияланған күні (Date):</label>
                    <input
                      type="text"
                      value={newsDate}
                      onChange={(e) => setNewsDate(e.target.value)}
                      placeholder="Мысалы: 25 Маусым, 2026"
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none font-mono"
                    />
                  </div>

                  <Base64ImageUploader
                    label="Жаңалық суреті (Image):"
                    value={newsImageUrl}
                    onChange={(url) => setNewsImageUrl(url)}
                  />
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setEditingNewsId(null);
                    setIsAddingNewNews(false);
                  }}
                  className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1"
                >
                  <X className="w-4 h-4" />
                  <span>Бас тарту</span>
                </button>
                <button
                  type="button"
                  onClick={saveNewsChanges}
                  disabled={isSavingNews}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-400 text-white rounded-xl text-xs font-black uppercase tracking-wider shadow flex items-center gap-1.5 transition cursor-pointer"
                >
                  {isSavingNews ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                  <span>Сақтау</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {news.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 text-slate-400 space-y-2">
                  <Sparkles className="w-10 h-10 text-slate-300 mx-auto" />
                  <p className="text-xs font-medium">Жүйеде ешқандай жаңалық табылмады.</p>
                  <button
                    type="button"
                    onClick={startAddingNews}
                    className="mt-2 text-xs text-blue-600 hover:underline font-bold"
                  >
                    Алғашқы жаңалықты қосу
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-3">
                  {news.map((item) => (
                    <div
                      key={item.id}
                      className="bg-white p-4 rounded-2xl border border-slate-200 hover:border-slate-300 transition-all shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
                    >
                      <div className="flex items-center gap-4 min-w-0">
                        {item.imageUrl ? (
                          <img
                            src={item.imageUrl}
                            alt=""
                            className="w-16 h-16 rounded-xl object-cover border border-slate-100 flex-shrink-0"
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          <div className="w-16 h-16 rounded-xl bg-slate-100 text-slate-400 flex items-center justify-center flex-shrink-0">
                            <Image className="w-5 h-5" />
                          </div>
                        )}
                        <div className="min-w-0 space-y-1">
                          <div className="flex flex-wrap gap-1.5 items-center">
                            <span className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded text-[9px] font-black uppercase font-mono">
                              {item.category || 'ЖАҢАЛЫҚ'}
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono">
                              {item.date}
                            </span>
                          </div>
                          <h4 className="font-extrabold text-xs sm:text-sm text-slate-900 leading-tight truncate">
                            {item.titleTranslations?.[lang as 'kz'|'ru'|'en'] || item.title}
                          </h4>
                          <p className="text-[11px] text-slate-500 line-clamp-1">
                            {item.summaryTranslations?.[lang as 'kz'|'ru'|'en'] || item.summary}
                          </p>
                        </div>
                      </div>

                      {/* Management Buttons */}
                      <div className="flex items-center gap-2 self-end md:self-center">
                        <button
                          type="button"
                          onClick={() => startEditingNews(item)}
                          className="p-2 border border-slate-200 hover:border-blue-300 hover:bg-blue-50/50 text-slate-600 hover:text-blue-600 rounded-xl text-xs font-medium transition cursor-pointer flex items-center gap-1"
                        >
                          <Edit className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">Өңдеу</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteNews(item.id)}
                          className="p-2 border border-slate-200 hover:border-red-300 hover:bg-red-50/50 text-slate-600 hover:text-red-600 rounded-xl text-xs font-medium transition cursor-pointer flex items-center gap-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">Өшіру</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

    </div>
  );
}
