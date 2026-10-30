import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  TrendingUp,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  ArrowLeft,
  ArrowRight,
  Coins,
  CheckCircle2,
  Clock,
  Award
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const InvestmentSection = () => {
  const { t, isRTL, language } = useLanguage();
  const navigate = useNavigate();

  // --- الحالات (States) ---
  const [investmentItems, setInvestmentItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  // --- جلب بيانات السبائك والاستثمار من الـ API ---
  const fetchAllData = useCallback(async (isManual = false) => {
    try {
      if (isManual) {
        setIsRefreshing(true);
      } else if (investmentItems.length === 0) {
        setLoading(true);
      }

      const response = await axios.get(`${import.meta.env.VITE_API_URL}/home/investment`);
      const fetchedData = response.data;

      if (Array.isArray(fetchedData) && fetchedData.length > 0) {
        setInvestmentItems(fetchedData);
        setError(null);
        setLastUpdated(new Date());
      } else if (investmentItems.length === 0) {
        // في حال كانت القائمة فارغة مؤقتاً، نعتمد بيانات استثمارية افتراضية لعرض التصميم
        setInvestmentItems([
          {
            id: 1,
            name: language === 'ar' ? 'كيلو فضة إماراتي 999' : 'UAE Silver Kilo 999',
            price: 1150.00,
            image: '/uploads/uae_kilo.png'
          },
          {
            id: 2,
            name: language === 'ar' ? 'سبيكة سويسرية 100 غرام' : 'Swiss Silver 100g Ingot',
            price: 125.00,
            image: '/uploads/swiss_100.png'
          },
          {
            id: 3,
            name: language === 'ar' ? 'أونصة فضة استثمارية 31.1 غرام' : 'Silver Ounce 31.1g',
            price: 39.50,
            image: '/uploads/ounce_31.png'
          }
        ]);
        setLastUpdated(new Date());
      }
    } catch (err) {
      console.error('Error fetching investment data:', err);
      if (investmentItems.length === 0) {
        setError(isRTL ? 'فشل تحميل أسعار البورصة، يرجى المحاولة لاحقاً' : 'Failed to load live market data');
      }
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, [isRTL, language, investmentItems.length]);

  useEffect(() => {
    fetchAllData();
    // تحديث دوري كل دقيقة ونصف لمواكبة البورصة
    const interval = setInterval(() => fetchAllData(true), 90000);
    return () => clearInterval(interval);
  }, [fetchAllData]);

  // الانتقال إلى صفحة إتمام طلب السبيكة
  const handleBuy = (item) => {
    navigate('/checkout-silver', {
      state: {
        name: item.name,
        price: item.price,
        id: item.id,
        image: item.image
      }
    });
  };

  // تنسيق وقت آخر تحديث
  const formatLastUpdated = () => {
    if (!lastUpdated) return isRTL ? 'مباشر' : 'Live';
    return lastUpdated.toLocaleTimeString(isRTL ? 'ar-JO' : 'en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <section
      id="investment-section"
      className="py-20 md:py-32 bg-gradient-to-b from-[#070709] via-[#0c0c10] to-[#070709] relative overflow-hidden select-none"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      {/* 1. تأثيرات الخلفية الفاخرة (Luxury Ambient Spotlights) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* خط فاصل علوي فخم */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-silver-400/30 to-transparent" />

        {/* إضاءات هادئة */}
        <div className="absolute top-1/4 -right-20 w-[450px] h-[450px] bg-silver-400/5 rounded-full blur-[140px]" />
        <div className="absolute bottom-1/4 -left-20 w-[450px] h-[450px] bg-emerald-500/5 rounded-full blur-[140px]" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10 max-w-7xl">
        {/* 2. رأس القسم (Header & Live Ticker) */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-16 md:mb-20 gap-8 border-b border-white/5 pb-10">
          <div className="max-w-2xl">
            {/* شارة حالة البورصة الحية */}
            <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 mb-5 shadow-[0_0_15px_rgba(16,185,129,0.1)]">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <span className="text-xs font-bold uppercase tracking-widest">
                {t('liveMarket')}
              </span>
              <span className="text-emerald-500/40">•</span>
              <span className="text-[11px] font-mono text-emerald-300">
                Ag 999.0
              </span>
            </div>

            {/* العنوان الرئيسي */}
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight tracking-tight mb-4">
              <span className="bg-gradient-to-r from-white via-silver-200 to-silver-400 bg-clip-text text-transparent">
                {t('silverInvestTitle')}
              </span>
            </h2>

            {/* الوصف الإيضاحي */}
            <p className="text-silver-300/80 text-sm sm:text-base leading-relaxed font-light">
              {t('silverInvestDesc')}
            </p>
          </div>

          {/* أدوات التحديث وحالة السوق */}
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-3.5 bg-white/[0.03] backdrop-blur-md border border-white/10 p-2.5 sm:p-3 rounded-2xl w-full lg:w-auto justify-between sm:justify-start">
            <div className="flex items-center gap-2 text-silver-300 text-xs px-2">
              <Clock className="w-4 h-4 text-silver-400" />
              <span>
                {isRTL ? 'آخر تحديث:' : 'Updated:'}{' '}
                <strong className="text-white font-mono">{formatLastUpdated()}</strong>
              </span>
            </div>

            <button
              onClick={() => fetchAllData(true)}
              disabled={isRefreshing}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 text-white text-xs font-semibold transition-all border border-white/10 cursor-pointer disabled:opacity-50"
              title={isRTL ? 'تحديث الأسعار الآن' : 'Refresh Rates Now'}
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-silver-300' : ''}`} />
              <span>{isRTL ? 'تحديث الأسعار' : 'Refresh'}</span>
            </button>
          </div>
        </div>

        {/* 3. منطقة المحتوى والبطاقات (Dynamic Cards Area) */}
        {loading && investmentItems.length === 0 ? (
          /* حالة التحميل الفاخرة (Skeleton Cards) */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white/[0.03] border border-white/10 rounded-3xl p-8 animate-pulse flex flex-col justify-between h-[420px]"
              >
                <div className="w-1/3 h-6 bg-white/10 rounded-full mb-8" />
                <div className="w-32 h-32 bg-white/10 rounded-2xl mx-auto my-auto" />
                <div className="space-y-3 mt-6">
                  <div className="w-3/4 h-6 bg-white/10 rounded-lg" />
                  <div className="w-full h-16 bg-white/10 rounded-2xl" />
                  <div className="w-full h-12 bg-white/10 rounded-xl" />
                </div>
              </div>
            ))}
          </div>
        ) : error && investmentItems.length === 0 ? (
          /* حالة الخطأ */
          <div className="text-center py-16 px-6 bg-red-500/5 rounded-3xl border border-red-500/20 max-w-xl mx-auto backdrop-blur-sm">
            <p className="text-red-300 text-base mb-4">{error}</p>
            <button
              onClick={() => fetchAllData(true)}
              className="px-6 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-semibold text-sm transition-all cursor-pointer"
            >
              {isRTL ? 'إعادة المحاولة' : 'Try Again'}
            </button>
          </div>
        ) : (
          /* شبكة بطاقات السبائك الفاخرة */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10"
          >
            <AnimatePresence>
              {investmentItems.map((item, idx) => {
                const numericPrice = parseFloat(item.price) || 0;
                return (
                  <motion.div
                    key={item.id || idx}
                    initial={{ opacity: 0, y: 25 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: idx * 0.12 }}
                    whileHover={{ y: -8 }}
                    className="group relative bg-gradient-to-b from-white/[0.07] via-white/[0.03] to-transparent border border-white/10 hover:border-silver-400/40 rounded-3xl sm:rounded-[2.2rem] p-6 sm:p-8 transition-all duration-500 hover:shadow-[0_25px_50px_-10px_rgba(0,0,0,0.8),_0_0_30px_rgba(212,212,216,0.12)] flex flex-col justify-between overflow-hidden"
                  >
                    {/* بريق معدني خفيف في زاوية الكرت عند التحويم */}
                    <div className="absolute top-0 right-0 w-36 h-36 bg-gradient-to-bl from-white/10 to-transparent rounded-bl-full pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    <div>
                      {/* رأس البطاقة والشارات */}
                      <div className="flex items-center justify-between gap-2 mb-6">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-silver-200 text-[11px] font-semibold tracking-wider uppercase">
                          <Coins className="w-3.5 h-3.5 text-silver-300" />
                          <span>{isRTL ? 'سبيكة نقية 999' : 'Pure 999 Bullion'}</span>
                        </span>

                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                          <TrendingUp className="w-3 h-3" />
                          <span>{isRTL ? 'سعر فوري' : 'Live'}</span>
                        </span>
                      </div>

                      {/* صورة السبيكة مع تأثير الإضاءة الفضية */}
                      <div className="relative h-44 sm:h-48 flex items-center justify-center my-4">
                        {/* هالة دائرية براقة خلف الصورة */}
                        <div className="absolute w-32 h-32 bg-silver-400/15 rounded-full blur-2xl group-hover:scale-125 transition-transform duration-700 pointer-events-none" />

                        <img
                          src={
                            item.image?.startsWith('http')
                              ? item.image
                              : `${import.meta.env.VITE_URL}${item.image}`
                          }
                          alt={item.name}
                          className="relative w-36 h-36 sm:w-44 sm:h-44 object-contain drop-shadow-[0_15px_25px_rgba(0,0,0,0.7)] group-hover:scale-110 group-hover:-rotate-2 transition-transform duration-500"
                          onError={(e) => {
                            e.target.src =
                              'https://images.unsplash.com/photo-1610375461246-83df859d849d?w=300&auto=format&fit=crop&q=80';
                          }}
                        />
                      </div>

                      {/* اسم المنتج */}
                      <h3 className="text-xl sm:text-2xl font-bold text-white mb-4 group-hover:text-silver-200 transition-colors line-clamp-2 min-h-[3.5rem] tracking-tight">
                        {item.name}
                      </h3>

                      {/* مزايا السبيكة النقدية */}
                      <div className="space-y-1.5 mb-6 text-xs text-silver-400">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-silver-300 shrink-0" />
                          <span>{isRTL ? 'شهادة نقاء معتمدة ورقم تسلسلي' : 'Certified Serial & Purity Assay'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Award className="w-3.5 h-3.5 text-silver-300 shrink-0" />
                          <span>{isRTL ? 'ملاذ آمن للادخار والاستثمار' : 'Secure Liquid Investment Asset'}</span>
                        </div>
                      </div>
                    </div>

                    {/* صندوق السعر وزر الشراء */}
                    <div>
                      <div className="mb-5 p-4 sm:p-5 bg-black/50 rounded-2xl border border-white/5 shadow-inner">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-silver-400 text-[11px] font-medium tracking-wider uppercase">
                            {t('currentPrice')}
                          </span>
                          <span className="text-[10px] text-emerald-400 font-mono">
                            {isRTL ? 'شامل الضريبة' : 'VAT Included'}
                          </span>
                        </div>

                        <div className="flex items-baseline gap-2">
                          <span className="text-3xl sm:text-4xl font-black text-white tracking-tight font-mono">
                            {numericPrice.toLocaleString(isRTL ? 'ar-JO' : 'en-US', {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2
                            })}
                          </span>
                          <span className="text-sm font-bold text-silver-400 uppercase">
                            {t('currency')}
                          </span>
                        </div>
                      </div>

                      {/* زر الطلب الفوري */}
                      <button
                        onClick={() => handleBuy(item)}
                        className="group/btn w-full silver-btn-luxury py-4 px-6 rounded-xl font-black text-base text-black flex items-center justify-center gap-3 transition-all duration-300 active:scale-95 shadow-[0_10px_25px_rgba(255,255,255,0.1)] cursor-pointer"
                      >
                        <span className="relative z-10">{t('buyNow')}</span>
                        <span className="relative z-10 transition-transform duration-300 group-hover/btn:translate-x-1 rtl:group-hover/btn:-translate-x-1">
                          {isRTL ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                        </span>
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        )}

        {/* 4. شريط ضمان الاستثمار الفاخر بالأسفل (Trust Badges) */}
        <div className="mt-16 md:mt-24 pt-10 border-t border-white/5">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {[
              {
                icon: ShieldCheck,
                title: isRTL ? 'سبائك معتمدة عيار 999' : 'Certified 999 Bullion',
                desc: isRTL ? 'مدموغة ومطابقة للمعايير الدولية' : 'Stamped to international standards'
              },
              {
                icon: Award,
                title: isRTL ? 'شهادات فحص موثقة' : 'Official Assay Certificates',
                desc: isRTL ? 'كل قطعة تأتي برقم تسلسلي خاص' : 'Each ingot with unique serial'
              },
              {
                icon: TrendingUp,
                title: isRTL ? 'أسعار بورصة لحظية' : 'Live Market Pricing',
                desc: isRTL ? 'محدثة تلقائياً وفق الأسواق العالمية' : 'Updated with global metals exchanges'
              },
              {
                icon: Sparkles,
                title: isRTL ? 'استلام فوري ومؤمّن' : 'Insured Delivery & Pickup',
                desc: isRTL ? 'توصيل آمن لباب منزلك مع تأمين كامل' : 'Fully insured delivery or branch pickup'
              }
            ].map((item, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3.5 p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-colors"
              >
                <div className="w-10 h-10 rounded-xl bg-silver-500/10 border border-silver-500/20 flex items-center justify-center text-silver-300 shrink-0">
                  <item.icon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-white text-xs sm:text-sm font-bold mb-1">
                    {item.title}
                  </h4>
                  <p className="text-silver-400/80 text-[11px] leading-snug">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default InvestmentSection;