import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Settings, Save, X, TrendingUp, TrendingDown, Minus, Coins, AlertCircle, Info } from 'lucide-react';
import { useAppContext } from '../contexts/AppContext';

export const SpotPricesPanel: React.FC = () => {
  const { 
    lang, 
    role, 
    currentUser,
    spotRates, 
    updateSpotRate, 
    priceDisplayUnit 
  } = useAppContext();

  const isAdmin = role === 'admin';
  const isGuest = role === 'guest' || !currentUser;

  // In-place edit state
  const [isEditing, setIsEditing] = useState(false);
  const [editStates, setEditStates] = useState<Record<string, {
    name: string;
    price: number;
    standard: string;
    statusLabel: string;
  }>>({});

  const getDensity = (brandName: string) => {
    const lower = brandName.toLowerCase();
    if (lower.includes('95')) return 0.750;
    if (lower.includes('92')) return 0.730;
    if (lower.includes('дт') || lower.includes('дизель') || lower.includes('diesel')) return 0.840;
    return 0.775; // average for jets/others
  };

  const startInPlaceEdit = () => {
    const initialStates: typeof editStates = {};
    spotRates.forEach(rate => {
      const density = getDensity(rate.name);
      const initialPrice = priceDisplayUnit === 'ton' 
        ? Math.round((rate.price / density) * 1000)
        : rate.price;

      initialStates[rate.id] = {
        name: rate.name,
        price: initialPrice,
        standard: rate.standard || '',
        statusLabel: rate.statusLabel || '',
      };
    });
    setEditStates(initialStates);
    setIsEditing(true);
  };

  const handleFieldChange = (id: string, field: string, value: any) => {
    setEditStates(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: value
      }
    }));
  };

  const saveInPlaceChanges = () => {
    Object.keys(editStates).forEach(id => {
      const state = editStates[id];
      const rate = spotRates.find(r => r.id === id);
      if (!rate) return;

      const density = getDensity(state.name || rate.name);
      const savedPrice = priceDisplayUnit === 'ton'
        ? (Number(state.price) * density) / 1000
        : Number(state.price);

      updateSpotRate(id, {
        name: state.name,
        price: Math.round(savedPrice * 100) / 100,
        standard: state.standard,
        statusLabel: state.statusLabel,
      });
    });
    setIsEditing(false);
  };

  return (
    <div 
      id="spot-prices-panel"
      className="rounded-[2rem] bg-gradient-to-br from-[#1e4cd1] to-[#1236a9] p-6 flex flex-col justify-between relative overflow-hidden border border-white/20 shadow-xl text-white w-full"
    >
      <div className="absolute right-0 top-0 w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none"></div>
      
      <div className="space-y-5 relative z-10">
        {/* Header Section */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Coins className="w-5 h-5 text-amber-300" />
            <h3 className="text-white font-black text-lg font-display tracking-tight uppercase">
              {lang === 'kz' ? 'Ағымдағы Бағалар' : lang === 'ru' ? 'Текущие Цены' : 'Current Prices'}
            </h3>
            <span className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse shadow-[0_0_8px_#10b981] shrink-0" />
          </div>
          
          {isAdmin && (
            <button
              onClick={() => {
                if (isEditing) {
                  setIsEditing(false);
                } else {
                  startInPlaceEdit();
                }
              }}
              className="flex items-center gap-1 text-[10px] uppercase tracking-wider font-extrabold bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-xl border border-white/15 transition cursor-pointer"
              title={lang === 'kz' ? 'Бағаларды тікелей өңдеу' : 'Редактировать на месте'}
            >
              <Settings className={`w-3.5 h-3.5 ${isEditing ? 'animate-spin' : ''}`} />
              <span>{isEditing ? (lang === 'kz' ? 'Жабу' : 'Закрыть') : (lang === 'kz' ? 'Баптау' : 'Настройка')}</span>
            </button>
          )}
        </div>

        {/* Info label about selected display unit (only for non-guests) */}
        {!isGuest && (
          <div className="flex justify-between items-center bg-black/20 p-2.5 rounded-xl border border-white/5 text-[10px] uppercase font-bold tracking-widest text-slate-200">
            <span>{lang === 'kz' ? 'Өлшем бірлігі:' : 'Единица измерения:'}</span>
            <span className="text-amber-300 font-black">
              {priceDisplayUnit === 'ton' 
                ? (lang === 'kz' ? 'Тоннамен (₸/тн)' : 'В тоннах (₸/тн)') 
                : (lang === 'kz' ? 'Литрмен (₸/л)' : 'В литрах (₸/л)')}
            </span>
          </div>
        )}

        {/* Content Section */}
        <AnimatePresence mode="wait">
          {isEditing ? (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              <div className="max-h-[350px] overflow-y-auto space-y-3.5 pr-1 scrollbar-thin">
                {spotRates.map((rate) => {
                  const state = editStates[rate.id] || {
                    name: rate.name,
                    price: rate.price,
                    standard: rate.standard || '',
                    statusLabel: rate.statusLabel || '',
                  };

                  return (
                    <div 
                      key={rate.id}
                      className="p-3.5 rounded-2xl bg-black/30 border border-white/10 space-y-3 text-xs"
                    >
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[8px] uppercase font-bold text-blue-200 mb-0.5">Отын атауы:</label>
                          <input 
                            type="text"
                            value={state.name}
                            onChange={(e) => handleFieldChange(rate.id, 'name', e.target.value)}
                            className="w-full px-2 py-1 bg-slate-900 border border-white/15 rounded text-white font-bold"
                          />
                        </div>
                        <div>
                          <label className="block text-[8px] uppercase font-bold text-blue-200 mb-0.5">
                            {priceDisplayUnit === 'ton' ? 'Бағасы (тоннасына ₸):' : 'Бағасы (литріне ₸):'}
                          </label>
                          <input 
                            type="number"
                            value={state.price}
                            onChange={(e) => handleFieldChange(rate.id, 'price', e.target.value)}
                            className="w-full px-2 py-1 bg-slate-900 border border-white/15 rounded text-amber-300 font-bold font-mono text-right"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[8px] uppercase font-bold text-blue-200 mb-0.5">Стандарт (астындағы жазу):</label>
                          <input 
                            type="text"
                            value={state.standard}
                            onChange={(e) => handleFieldChange(rate.id, 'standard', e.target.value)}
                            placeholder="мысалы: EURO-5"
                            className="w-full px-2 py-1 bg-slate-900 border border-white/15 rounded text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-[8px] uppercase font-bold text-blue-200 mb-0.5">Қосымша сипаттама:</label>
                          <input 
                            type="text"
                            value={state.statusLabel}
                            onChange={(e) => handleFieldChange(rate.id, 'statusLabel', e.target.value)}
                            placeholder="мысалы: Standard"
                            className="w-full px-2 py-1 bg-slate-900 border border-white/15 rounded text-white"
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-2 border-t border-white/10">
                <button
                  onClick={saveInPlaceChanges}
                  className="flex-1 py-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black rounded-xl text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{lang === 'kz' ? 'Сақтау' : 'Сохранить'}</span>
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold uppercase transition"
                >
                  {lang === 'kz' ? 'Болдырмау' : 'Отмена'}
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-2.5"
            >
              {spotRates.map((rate, idx) => {
                const density = getDensity(rate.name);
                const isLiter = priceDisplayUnit !== 'ton';
                
                // Conversions
                const displayedPrice = isLiter 
                  ? rate.price 
                  : (rate.price / density) * 1000;

                const trendIcon = rate.trend === 'up' ? <TrendingUp className="w-3 h-3 text-emerald-400" /> :
                                  rate.trend === 'down' ? <TrendingDown className="w-3 h-3 text-rose-400" /> :
                                  <Minus className="w-3 h-3 text-slate-400" />;

                const trendBg = rate.trend === 'up' ? 'bg-emerald-500/10 border-emerald-500/25 text-emerald-400' :
                                rate.trend === 'down' ? 'bg-rose-500/10 border-rose-500/25 text-rose-400' :
                                'bg-slate-500/10 border-slate-500/25 text-slate-400';

                return (
                  <div 
                    key={rate.id || idx} 
                    className="p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all flex justify-between items-center group/card shadow-md"
                  >
                    <div className="flex flex-col text-left font-sans">
                      <div className="flex items-center gap-2">
                        <span className="text-base sm:text-lg font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-200 to-white drop-shadow-[0_2px_3px_rgba(0,0,0,0.5)] tracking-tight uppercase">
                          {rate.name}
                        </span>
                        {rate.standard && (
                          <span className="text-[9px] font-black px-2 py-0.5 rounded bg-amber-400 text-slate-950 uppercase font-mono tracking-wider shadow">
                            {rate.standard}
                          </span>
                        )}
                      </div>
                      
                      {!isGuest && rate.statusLabel && (
                        <span className="text-[9px] text-blue-200 mt-1 block max-w-[150px] truncate leading-tight font-medium opacity-80">
                          {rate.statusLabel}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-3">
                      {rate.percentage && (
                        <div className={`flex items-center gap-0.5 px-2.5 py-0.5 rounded-lg text-[9px] font-black border uppercase ${trendBg}`}>
                          {trendIcon}
                          <span>{rate.percentage}</span>
                        </div>
                      )}
                      <div className="text-right">
                        <span className="text-lg sm:text-xl font-black font-mono text-amber-300 flex items-center justify-end gap-1 select-all">
                          {Math.round(displayedPrice).toLocaleString('kk-KZ')} 
                          <span className="text-xs font-black text-blue-200">
                            {isLiter ? '₸/л' : '₸/тн'}
                          </span>
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Small footer advisory node */}
        <div className="pt-2 border-t border-white/10 flex items-start gap-1.5 text-[10px] text-blue-105 leading-relaxed">
          <Info className="w-3.5 h-3.5 text-amber-300 shrink-0 mt-0.5" />
          <p>
            {lang === 'kz' 
              ? 'Бағалар әкімші тарапынан нақты уақыт режимінде реттеледі.' 
              : 'Цены регулируются администратором в режиме реального времени.'}
          </p>
        </div>
      </div>
    </div>
  );
};
