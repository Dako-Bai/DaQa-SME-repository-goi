import React, { useState } from 'react';
import { Building2, Mail, Phone, Clock, MapPin, Send, Check } from 'lucide-react';
import { useAppContext } from '../contexts/AppContext';

export default function CompanyHub() {
  const { lang, contactsState } = useAppContext();
  const cs = contactsState || {};

  // Resolve localized address and working hours
  const addressVal = cs[`addressVal${lang === 'kz' ? 'Kz' : lang === 'ru' ? 'Ru' : 'En'}`] || cs.addressValKz || 'Алматы қаласы, Свободная к-сі, 136/2';
  const hoursVal = cs[`hoursVal${lang === 'kz' ? 'Kz' : lang === 'ru' ? 'Ru' : 'En'}`] || cs.hoursValKz || 'Дүйсенбі - Жұма: 09:00 - 18:00';
  const phoneVal = cs.phone || '+7 (727) 355-10-10';
  const emailVal = cs.email || 'info@mercuryenergy.kz';

  const t = {
    kz: {
      title: 'Smart Mercury Energy',
      subtitle: 'Мұнай өнімдері мен авиациялық отын логистикасы',
      desc: cs.aboutSubtitleKz || '«Smart Mercury Energy» — Қазақстандағы мұнай өнімдері мен авиациялық отын логистикасын сенімді және қауіпсіз басқаратын жоғары технологиялық компания.',
      address_label: 'Мекенжай:',
      phone_label: 'Телефон:',
      email_label: 'Электрондық пошта:',
      hours_label: 'Жұмыс уақыты:',
      form_title: cs.feedbackTitleKz || 'Кері байланыс',
      form_desc: cs.feedbackDescKz || 'Сұрақтарыңыз немесе ұсыныстарыңыз болса, хабарласыңыз.',
      placeholder_name: 'Аты-жөніңіз',
      placeholder_phone: 'Телефон нөміріңіз',
      placeholder_msg: 'Хатыңыз...',
      btn_send: 'Жіберу',
      success_msg: 'Хабарлама сәтті жіберілді! Жақын арада хабарласамыз.'
    },
    ru: {
      title: 'Smart Mercury Energy',
      subtitle: 'Логистика нефтепродуктов и авиатоплива',
      desc: cs.aboutSubtitleRu || '«Smart Mercury Energy» — высокотехнологичная компания, обеспечивающая надежное и безопасное управление логистикой нефтепродуктов.',
      address_label: 'Адрес:',
      phone_label: 'Телефон:',
      email_label: 'Электронная почта:',
      hours_label: 'Режим работы:',
      form_title: cs.feedbackTitleRu || 'Обратная связь',
      form_desc: cs.feedbackDescRu || 'Свяжитесь с нами по любым вопросам или сотрудничеству.',
      placeholder_name: 'Ваше имя',
      placeholder_phone: 'Ваш телефон',
      placeholder_msg: 'Ваше сообщение...',
      btn_send: 'Отправить',
      success_msg: 'Сообщение успешно отправлено! Мы свяжемся с вами в ближайшее время.'
    },
    en: {
      title: 'Smart Mercury Energy',
      subtitle: 'Petroleum and Aviation Fuel Logistics',
      desc: cs.aboutSubtitleEn || 'Smart Mercury Energy is a high-tech company that provides reliable and secure logistics management.',
      address_label: 'Address:',
      phone_label: 'Phone:',
      email_label: 'Email:',
      hours_label: 'Office Hours:',
      form_title: cs.feedbackTitleEn || 'Feedback',
      form_desc: cs.feedbackDescEn || 'Contact us for any questions or commercial inquiries.',
      placeholder_name: 'Your Name',
      placeholder_phone: 'Your Phone Number',
      placeholder_msg: 'Your Message...',
      btn_send: 'Send Message',
      success_msg: 'Message sent successfully! We will contact you shortly.'
    }
  }[lang as 'kz' | 'ru' | 'en'] || {
    title: 'Smart Mercury Energy',
    subtitle: 'Мұнай өнімдері мен авиациялық отын логистикасы',
    desc: '«Smart Mercury Energy» — Қазақстандағы мұнай өнімдері мен авиациялық отын логистикасын сенімді және қауіпсіз басқаратын жоғары технологиялық компания.',
    address_label: 'Мекенжай:',
    phone_label: 'Телефон:',
    email_label: 'Электрондық пошта:',
    hours_label: 'Жұмыс уақыты:',
    form_title: 'Кері байланыс',
    form_desc: 'Сұрақтарыңыз немесе ұсыныстарыңыз болса, хабарласыңыз.',
    placeholder_name: 'Аты-жөніңіз',
    placeholder_phone: 'Телефон нөміріңіз',
    placeholder_msg: 'Хатыңыз...',
    btn_send: 'Жіберу',
    success_msg: 'Хабарлама сәтті жіберілді! Жақын арада хабарласамыз.'
  };

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [msg, setMsg] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) return;
    setSubmitted(true);
    setTimeout(() => {
      setName('');
      setPhone('');
      setMsg('');
      setSubmitted(false);
    }, 4000);
  };

  return (
    <div id="company-hub-grid" className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 sm:p-8 bg-[#245dff] border border-blue-400/20 rounded-2xl shadow-xl shadow-blue-650/20 text-white animate-fade-in">
      {/* Company Profile */}
      <div className="space-y-6 flex flex-col justify-between">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-900/60 text-amber-300 border border-blue-400/20">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white font-sans">
                {t.title}
              </h2>
              <p className="text-xs text-blue-200 font-semibold uppercase tracking-wider">
                {t.subtitle}
              </p>
            </div>
          </div>
          <p className="text-sm text-blue-100 leading-relaxed font-normal pt-2">
            {t.desc}
          </p>
        </div>

        {/* Essential Coordinates */}
        <div className="space-y-3 pt-4 border-t border-white/10 text-white">
          <div className="flex gap-2.5 items-start text-xs text-blue-100">
            <MapPin className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
            <p>
              <strong className="text-white font-bold">{t.address_label} </strong>
              {addressVal}
            </p>
          </div>
          <div className="flex gap-2.5 items-center text-xs text-blue-100">
            <Phone className="w-4 h-4 text-amber-300 shrink-0" />
            <p>
              <strong className="text-white font-bold">{t.phone_label} </strong>
              {phoneVal}
            </p>
          </div>
          <div className="flex gap-2.5 items-center text-xs text-blue-100">
            <Mail className="w-4 h-4 text-amber-300 shrink-0" />
            <p>
              <strong className="text-white font-bold">{t.email_label} </strong>
              {emailVal}
            </p>
          </div>
          <div className="flex gap-2.5 items-center text-xs text-blue-100">
            <Clock className="w-4 h-4 text-amber-300 shrink-0" />
            <p>
              <strong className="text-white font-bold">{t.hours_label} </strong>
              {hoursVal}
            </p>
          </div>
        </div>
      </div>

      {/* Simplified Clean Feedback Form */}
      <div className="p-5 sm:p-6 bg-[#1d52e5] border border-blue-400/20 rounded-xl flex flex-col justify-between text-white">
        <div className="space-y-1.5 mb-4">
          <h3 className="text-base font-black text-white font-sans">
            {t.form_title}
          </h3>
          <p className="text-xs text-blue-200">
            {t.form_desc}
          </p>
        </div>

        {submitted ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8 bg-blue-950/60 border border-emerald-500/40 rounded-xl">
            <div className="w-10 h-10 rounded-full bg-emerald-500/10 text-emerald-300 flex items-center justify-center mb-3 border border-emerald-500/25">
              <Check className="w-5 h-5" />
            </div>
            <p className="text-xs font-bold text-emerald-300">
              {t.success_msg}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              type="text"
              required
              placeholder={t.placeholder_name}
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full text-xs px-4 py-2.5 bg-blue-950/45 border border-blue-400/25 rounded-lg text-white placeholder-blue-300/60 focus:outline-none focus:border-amber-300 focus:ring-1 focus:ring-amber-300 transition-colors"
            />
            <input
              type="text"
              required
              placeholder={t.placeholder_phone}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full text-xs px-4 py-2.5 bg-blue-950/45 border border-blue-400/25 rounded-lg text-white placeholder-blue-300/60 focus:outline-none focus:border-amber-300 focus:ring-1 focus:ring-amber-300 transition-colors"
            />
            <textarea
              rows={3}
              placeholder={t.placeholder_msg}
              value={msg}
              onChange={(e) => setMsg(e.target.value)}
              className="w-full text-xs px-4 py-2.5 bg-blue-950/45 border border-blue-400/25 rounded-lg text-white placeholder-blue-300/60 focus:outline-none focus:border-amber-300 focus:ring-1 focus:ring-amber-300 transition-colors resize-none"
            />
            <button
               type="submit"
               className="w-full py-2.5 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-450 hover:to-amber-550 text-slate-950 font-extrabold text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2 shadow-sm hover:shadow-md border border-amber-400/30 font-sans"
            >
              <Send className="w-3.5 h-3.5" />
              {t.btn_send}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
