import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Clock, Edit3, X, Trash2, Check, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { useAppContext } from '../contexts/AppContext';
import { NewsItem } from '../types';

const IMAGE_PRESETS = [
  {
    name: 'Aviation',
    url: 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?auto=format&fit=crop&w=800&q=80',
    label: { kz: 'Авиация', ru: 'Авиация', en: 'Aviation' }
  },
  {
    name: 'Operational',
    url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
    label: { kz: 'База', ru: 'Терминал', en: 'Terminal' }
  },
  {
    name: 'Corporate',
    url: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80',
    label: { kz: 'Ғылым', ru: 'Тәжірибе', en: 'Science' }
  },
  {
    name: 'Logistics',
    url: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=800&q=80',
    label: { kz: 'Логистика', ru: 'Логистика', en: 'Logistics' }
  }
];

export default function NewsCarousel() {
  const [filter, setFilter] = useState<'Newest' | 'Oldest' | 'Trending'>('Newest');
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
  const carouselRef = useRef<HTMLDivElement>(null);

  // Admin form state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [formTitle, setFormTitle] = useState('');
  const [formSummary, setFormSummary] = useState('');
  const [formCategory, setFormCategory] = useState('Operational');
  const [formImageUrl, setFormImageUrl] = useState(IMAGE_PRESETS[0].url);
  const [imageSourceMode, setImageSourceMode] = useState<'presets' | 'url' | 'upload'>('presets');

  const { t, news, addNewsItem, deleteNewsItem, role, lang } = useAppContext();

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setFormImageUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddNews = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || !formSummary.trim()) return;

    addNewsItem({
      title: formTitle,
      summary: formSummary,
      category: formCategory,
      imageUrl: formImageUrl,
    });

    setFormTitle('');
    setFormSummary('');
    setFormCategory('Operational');
    setFormImageUrl(IMAGE_PRESETS[0].url);
    setImageSourceMode('presets');
    setIsAddModalOpen(false);
  };

  const sortedNews = [...news].sort((a, b) => {
    if (filter === 'Newest') return new Date(b.date || '').getTime() - new Date(a.date || '').getTime();
    if (filter === 'Oldest') return new Date(a.date || '').getTime() - new Date(b.date || '').getTime();
    return b.title.length - a.title.length;
  });

  const scrollCarousel = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const { scrollLeft, clientWidth } = carouselRef.current;
      const step = clientWidth * 0.75;
      carouselRef.current.scrollTo({
        left: direction === 'left' ? scrollLeft - step : scrollLeft + step,
        behavior: 'smooth'
      });
    }
  };

  return (
    <>
      <div className="bg-[#245dff] border border-blue-400/20 p-6 sm:p-8 rounded-[32px] space-y-6 relative overflow-hidden shadow-xl shadow-blue-650/20 text-white">
        
        {/* Header Controls with Carousel Buttons */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 pb-5 z-10 relative border-b border-white/10">
          <div className="space-y-1">
            <div className="flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
              <span className="text-[10px] font-bold text-amber-200 uppercase tracking-widest block font-mono">
                {lang === 'kz' ? 'JAŃALYQTAR KARYSELI' : lang === 'ru' ? 'КАРУСЕЛЬ НОВОСТЕЙ' : 'CORP NEWSROOM'}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight">
              {lang === 'kz' ? 'Компания жаңалықтары' : lang === 'ru' ? 'Новости компании' : 'Latest Press Releases'}
            </h2>
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            {/* Filter controls */}
            <div className="flex p-1 bg-blue-800/50 rounded-xl w-max border border-blue-400/30">
              {(['Newest', 'Oldest', 'Trending'] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                    filter === f
                      ? 'bg-white text-blue-700 shadow-sm scale-102 font-extrabold'
                      : 'text-blue-100 hover:text-white'
                  }`}
                >
                  {f === 'Newest' ? (lang === 'kz' ? 'Жаңадан' : lang === 'ru' ? 'Новые' : 'Newest') :
                   f === 'Oldest' ? (lang === 'kz' ? 'Ескіден' : lang === 'ru' ? 'Старые' : 'Oldest') :
                   (lang === 'kz' ? 'Танымал' : lang === 'ru' ? 'Тренды' : 'Popular')}
                </button>
              ))}
            </div>

            {/* Slider control arrows */}
            <div className="flex items-center gap-1.5">
              {role === 'admin' && (
                <button 
                  onClick={() => setIsAddModalOpen(true)}
                  className="flex items-center gap-1 px-3 py-2 bg-amber-400 hover:bg-amber-300 text-slate-900 text-xs font-bold rounded-xl transition cursor-pointer border border-amber-350"
                >
                  <Edit3 className="w-3.5 h-3.5 shrink-0" />
                  {lang === 'kz' ? 'Қосу' : lang === 'ru' ? 'Новость' : 'Add Post'}
                </button>
              )}
              <button 
                onClick={() => scrollCarousel('left')}
                className="w-9 h-9 rounded-xl bg-blue-700/60 text-blue-100 hover:bg-blue-600 hover:text-white transition flex items-center justify-center cursor-pointer border border-blue-500/25"
                title="Scroll Left"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button 
                onClick={() => scrollCarousel('right')}
                className="w-9 h-9 rounded-xl bg-blue-700/60 text-blue-100 hover:bg-blue-600 hover:text-white transition flex items-center justify-center cursor-pointer border border-blue-500/25"
                title="Scroll Right"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Horizontal Swipe Carousel Container */}
        {sortedNews.length === 0 ? (
          <div className="text-center py-10 rounded-[32px] bg-blue-800/40 border border-blue-500/10">
            <span className="text-blue-200 text-sm">
              {lang === 'kz' ? 'Жарияланымдар табылмады.' : lang === 'ru' ? 'Публикации не найдены.' : 'No items.'}
            </span>
          </div>
        ) : (
          <div 
            ref={carouselRef}
            className="flex gap-5 overflow-x-auto scroll-smooth snap-x snap-mandatory px-0.5 py-2 scrollbar-none no-scrollbar"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {sortedNews.map((item) => {
              const localizedTitle = item.titleTranslations?.[lang] || item.title;
              const localizedSummary = item.summaryTranslations?.[lang] || item.summary;
              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedNews(item)}
                  className="w-[280px] sm:w-[325px] shrink-0 snap-start bg-[#1d52e5] border border-blue-400/40 hover:border-white/40 rounded-[28px] overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col justify-between group text-white"
                >
                  <div>
                    {item.imageUrl && (
                      <div className="relative h-40 w-full overflow-hidden bg-blue-900/60">
                        <img 
                          src={item.imageUrl} 
                          alt={localizedTitle}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                          referrerPolicy="no-referrer"
                        />

                        {role === 'admin' && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (confirm(lang === 'kz' ? 'Бұл жаңалықты өшіруді қалайсыз ба?' : lang === 'ru' ? 'Удалить эту новость?' : 'Delete this news?')) {
                                deleteNewsItem(item.id);
                              }
                            }}
                            className="absolute top-2.5 right-2.5 bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg transition shadow z-10 cursor-pointer border border-red-500/10"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    )}
                    <div className="p-4.5 space-y-2.5">
                      <div className="flex items-center text-blue-200 text-[10px] font-bold gap-1.5 font-mono uppercase">
                        <Clock className="w-3.5 h-3.5 text-blue-300 shrink-0" />
                        <span>{item.date}</span>
                      </div>
                      <h3 className="text-sm sm:text-base font-bold text-white leading-snug group-hover:text-amber-200 transition-colors line-clamp-2">
                        {localizedTitle}
                      </h3>
                      <p className="text-blue-100/90 text-xs leading-relaxed line-clamp-3">
                        {localizedSummary}
                      </p>
                    </div>
                  </div>
                  <div className="px-4.5 py-3 bg-blue-950/20 border-t border-blue-200/10 flex justify-between items-center text-xs">
                    <span className="font-bold text-amber-300 group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                      {lang === 'kz' ? 'Толық оқу' : lang === 'ru' ? 'Читать дальше' : 'Read details'}
                      <span>→</span>
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 1. Article View Modal Detail */}
      <AnimatePresence>
        {selectedNews && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedNews(null)}
              className="fixed inset-0 bg-slate-950/60 backdrop-blur-md z-[100]"
            />
            <motion.div 
              initial={{ opacity: 0, y: 30, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 30, scale: 0.98 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[95%] max-w-4xl max-h-[92vh] overflow-y-auto bg-gradient-to-b from-[#1d52e5] to-[#123bbe] rounded-[32px] shadow-2xl z-[101] border border-blue-300/40 p-5 sm:p-9 text-white focus:outline-none scrollbar-thin"
            >
              {/* Close Button at Top Right of the Modal */}
              <div className="absolute top-6 right-6 z-20">
                <button 
                  onClick={() => setSelectedNews(null)}
                  className="w-10 h-10 bg-blue-900/60 hover:bg-blue-800 text-white rounded-xl flex items-center justify-center transition-colors cursor-pointer border border-blue-400/20 shadow-md"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Meta Header */}
                <div className="flex items-center gap-3 text-amber-300 text-xs font-bold uppercase tracking-wider font-mono">
                  <span className="px-2.5 py-1 bg-amber-400/20 rounded-md border border-amber-400/10">
                    {selectedNews.category || 'PRESS'}
                  </span>
                  <div className="flex items-center gap-1.5 text-blue-200">
                    <Clock className="w-4 h-4 text-blue-300" />
                    {selectedNews.date}
                  </div>
                </div>

                {/* Extended Catchy Font Title */}
                <h2 className="text-xl sm:text-3.5xl font-extrabold text-white leading-tight tracking-tight font-sans">
                  {selectedNews.titleTranslations?.[lang] || selectedNews.title}
                </h2>

                <hr className="border-blue-400/20" />

                {/* Huge Clear Crisp Interactive Image */}
                {selectedNews.imageUrl && (
                  <div className="relative rounded-[24px] overflow-hidden border border-blue-300/20 shadow-2xl bg-blue-950/40">
                    <img 
                      src={selectedNews.imageUrl} 
                      alt={selectedNews.titleTranslations?.[lang] || selectedNews.title}
                      className="w-full h-auto max-h-[520px] object-cover rounded-[24px] transition-transform duration-700 hover:scale-[1.01]"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                )}

                {/* Highly-Readable Premium Clean Description Block */}
                <div className="bg-blue-950/20 p-5 sm:p-7 rounded-[24px] border border-blue-400/10 space-y-4">
                  <p className="text-sm sm:text-base text-blue-50 leading-relaxed sm:leading-loose font-normal whitespace-pre-wrap antialiased">
                    {selectedNews.summaryTranslations?.[lang] || selectedNews.summary}
                  </p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* 2. Admin News Post Form Modal */}
      <AnimatePresence>
        {isAddModalOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAddModalOpen(false)}
              className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-[100]"
            />
            <motion.div 
              initial={{ opacity: 0, y: 30, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 30, scale: 0.98 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[95%] max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-3xl shadow-2xl z-[101] border border-blue-100 p-6 sm:p-8 space-y-6 text-slate-800"
            >
              <div className="flex justify-between items-center border-b border-blue-50 pb-4">
                <div className="flex items-center gap-2">
                  <Edit3 className="w-5 h-5 text-blue-600" />
                  <h2 className="text-lg font-bold text-slate-900 font-sans">
                    {lang === 'kz' ? 'Жаңа жариялым құру' : lang === 'ru' ? 'Новая публикация' : 'Publish Corporate News'}
                  </h2>
                </div>
                <button 
                  onClick={() => setIsAddModalOpen(false)}
                  className="w-8 h-8 rounded-lg bg-blue-50 text-slate-500 hover:text-slate-850 flex items-center justify-center cursor-pointer transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleAddNews} className="space-y-4 text-left">
                {/* News Title */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-655 uppercase tracking-wider block">
                    {lang === 'kz' ? 'Жаңалық тақырыбы' : lang === 'ru' ? 'Заголовок новости' : 'Article Title'}
                  </label>
                  <input
                    type="text"
                    required
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    placeholder={lang === 'kz' ? 'Тақырыпты теріңіз...' : lang === 'ru' ? 'Введите заголовок...' : 'Enter catchy headline...'}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-blue-500 text-slate-900 font-medium text-sm transition focus:outline-none"
                  />
                </div>

                {/* Grid for Category */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-655 uppercase tracking-wider block">
                      {lang === 'kz' ? 'Бөлім (Категория)' : lang === 'ru' ? 'Категория' : 'Category'}
                    </label>
                    <select
                      value={formCategory}
                      onChange={(e) => setFormCategory(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:ring-2 focus:ring-blue-500 text-sm font-medium transition focus:outline-none animate-none"
                    >
                      <option value="Operational">{lang === 'kz' ? 'Өндірістік' : lang === 'ru' ? 'Техническая' : 'Operational'}</option>
                      <option value="Aviation">{lang === 'kz' ? 'Авиациялық' : lang === 'ru' ? 'Авиация' : 'Aviation'}</option>
                      <option value="Corporate">{lang === 'kz' ? 'Корпоративтік' : lang === 'ru' ? 'Корпоративная' : 'Corporate'}</option>
                      <option value="Market News">{lang === 'kz' ? 'Нарық аналитикасы' : lang === 'ru' ? 'Аналитика рынка' : 'Market News'}</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-655 uppercase tracking-wider block">
                      {lang === 'kz' ? 'Сурет түрі' : lang === 'ru' ? 'Тип изображения' : 'Image Source'}
                    </label>
                    <div className="grid grid-cols-3 gap-1.5">
                      <button
                        type="button"
                        onClick={() => {
                          setImageSourceMode('presets');
                          setFormImageUrl(IMAGE_PRESETS[0].url);
                        }}
                        className={`py-2 px-1 rounded-xl block text-[10px] sm:text-xs font-bold border transition cursor-pointer text-center ${
                          imageSourceMode === 'presets'
                            ? 'bg-blue-605 border-blue-605 bg-blue-600 text-white shadow-sm' 
                            : 'border-slate-200 text-slate-505 hover:bg-slate-100'
                        }`}
                      >
                        {lang === 'kz' ? 'Үлгілер' : lang === 'ru' ? 'Пресеты' : 'Presets'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setImageSourceMode('url')}
                        className={`py-2 px-1 rounded-xl block text-[10px] sm:text-xs font-bold border transition cursor-pointer text-center ${
                          imageSourceMode === 'url'
                            ? 'bg-blue-605 border-blue-605 bg-blue-600 text-white shadow-sm' 
                            : 'border-slate-200 text-slate-505 hover:bg-slate-100'
                        }`}
                      >
                        {lang === 'kz' ? 'Сілтеме' : lang === 'ru' ? 'Ссылка' : 'URL'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setImageSourceMode('upload')}
                        className={`py-2 px-1 rounded-xl block text-[10px] sm:text-xs font-bold border transition cursor-pointer text-center ${
                          imageSourceMode === 'upload'
                            ? 'bg-blue-650 border-blue-650 bg-blue-600 text-white shadow-sm' 
                            : 'border-slate-200 text-slate-505 hover:bg-slate-100'
                        }`}
                      >
                        {lang === 'kz' ? 'Жүктеу' : lang === 'ru' ? 'Загрузка' : 'Upload'}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Preconfigured Images Grid / Custom input / Custom upload dropzone */}
                {imageSourceMode === 'presets' ? (
                  <div className="space-y-2">
                    <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500 block pb-1 border-b border-slate-100">
                      {lang === 'kz' ? 'Суретті таңдаңыз:' : lang === 'ru' ? 'Выберите изображение:' : 'Select preset illustration:'}
                    </span>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                      {IMAGE_PRESETS.map((preset) => {
                        const isSelected = formImageUrl === preset.url;
                        return (
                          <button
                            key={preset.name}
                            type="button"
                            onClick={() => setFormImageUrl(preset.url)}
                            className={`p-1.5 rounded-xl border text-left space-y-1 overflow-hidden transition relative cursor-pointer ${
                              isSelected ? 'border-blue-500 bg-blue-50' : 'border-slate-200 bg-slate-50/50'
                            }`}
                          >
                            <img 
                              src={preset.url} 
                              alt={preset.name} 
                              className="w-full h-12 object-cover rounded-lg"
                              referrerPolicy="no-referrer"
                            />
                            <div className="flex items-center justify-between px-0.5">
                              <span className="text-[10px] font-bold text-slate-700 truncate">
                                {preset.label[lang as 'kz' | 'ru' | 'en'] || preset.name}
                              </span>
                              {isSelected && <Check className="w-3 h-3 text-blue-600 shrink-0" />}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ) : imageSourceMode === 'url' ? (
                  <div className="space-y-1.5 animate-fade-in">
                    <label className="text-xs font-bold text-slate-655 uppercase tracking-wider block">
                      {lang === 'kz' ? 'Мұнда суреттің толық URL сілтемесін қойыңыз' : lang === 'ru' ? 'Вставьте полную ссылку URL' : 'Image Location URL'}
                    </label>
                    <input
                      type="url"
                      value={formImageUrl}
                      onChange={(e) => setFormImageUrl(e.target.value)}
                      placeholder="https://images.unsplash.com/photo-..."
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:ring-2 focus:ring-blue-500 text-xs font-mono transition focus:outline-none"
                    />
                  </div>
                ) : (
                  <div className="space-y-2 animate-fade-in">
                    <label className="text-xs font-bold text-slate-655 uppercase tracking-wider block">
                      {lang === 'kz' ? 'Құрылғыдан сурет жүктеу' : lang === 'ru' ? 'Загрузить файл с устройства' : 'Upload photo from device'}
                    </label>
                    
                    <div className="relative">
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleFileUpload}
                        className="hidden" 
                        id="news-image-uploader-ref"
                      />
                      
                      <label 
                        htmlFor="news-image-uploader-ref"
                        className="border-2 border-dashed border-slate-200 hover:border-blue-400 bg-slate-50 p-5 rounded-2xl flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors"
                      >
                        {formImageUrl.startsWith('data:image') ? (
                          <div className="flex items-center gap-3 w-full">
                            <img 
                              src={formImageUrl} 
                              alt="Uploaded thumbnail" 
                              className="w-16 h-12 object-cover rounded-lg border border-slate-200 shadow"
                            />
                            <div className="text-left">
                              <span className="text-xs font-extrabold text-[#10b981] block">✓ {lang === 'kz' ? 'Сурет сәтті жүктелді' : lang === 'ru' ? 'Суроет успешно загружен' : 'Image loaded successfully'}</span>
                              <span className="text-[10px] text-slate-500 block font-mono">{lang === 'kz' ? 'Басқа файл таңдау үшін басыңыз' : lang === 'ru' ? 'Нажмите для изменения' : 'Click to override file'}</span>
                            </div>
                          </div>
                        ) : (
                          <>
                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                              <Edit3 className="w-5 h-5" />
                            </div>
                            <div className="text-center">
                              <span className="text-xs font-bold text-slate-700 block">{lang === 'kz' ? 'Файлды таңдау үшін шертіңіз' : lang === 'ru' ? 'Нажмите для выбора файла' : 'Click to select image file'}</span>
                              <span className="text-[10px] text-slate-400 block">{lang === 'kz' ? 'PNG, JPG, WEBP немесе GIF кез келген сурет форматтары қолдаулы' : lang === 'ru' ? 'Любой формат PNG, JPG, WEBP или GIF' : 'PNG, JPG, WEBP or GIF format supported'}</span>
                            </div>
                          </>
                        )}
                      </label>
                    </div>
                  </div>
                )}

                {/* News content / summary text area */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-655 uppercase tracking-wider block">
                    {lang === 'kz' ? 'Жаңалық мәтіні мен мазмұны' : lang === 'ru' ? 'Текст мақалы' : 'Article Summary & Body'}
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={formSummary}
                    onChange={(e) => setFormSummary(e.target.value)}
                    placeholder={lang === 'kz' ? 'Жазба мазмұнын енгізіңіз...' : lang === 'ru' ? 'Введите текст публикации...' : 'Write comprehensive story or announcement details...'}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:ring-2 focus:ring-blue-500 font-medium text-sm transition focus:outline-none"
                  />
                </div>

                {/* Form Buttons */}
                <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="px-5 py-2 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 font-bold text-xs uppercase tracking-wider cursor-pointer transition-colors"
                  >
                    {lang === 'kz' ? 'Бас тарту' : lang === 'ru' ? 'Отмена' : 'Cancel'}
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase tracking-wider shadow cursor-pointer transition-colors"
                  >
                    {lang === 'kz' ? 'Жариялау' : lang === 'ru' ? 'Опубликовать' : 'Publish'}
                  </button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
