import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiArrowLeft, FiArrowRight, FiActivity, FiRefreshCw } from 'react-icons/fi';
import { useLanguage } from '../contexts/LanguageContext';

const InvestmentSection = () => {
  const { t, isRTL } = useLanguage();
  const navigate = useNavigate();

  // --- States ---
  const [investmentItems, setInvestmentItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- Fetch Data Function ---
  const fetchAllData = useCallback(async () => {
    try {
      // نضع loading فقط في البداية لعدم تشتيت المستخدم عند التحديث التلقائي
      if (investmentItems.length === 0) setLoading(true);
      
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/home/investment`);
      
      // التأكد من جلب البيانات سواء كانت داخل .data أو .data.data
      const fetchedData = response.data;
         console.log(response.data);
         
      if (Array.isArray(fetchedData)) {
        setInvestmentItems(fetchedData);
        setError(null);
      }
    } catch (err) {
      console.error("Error fetching investment data:", err);
      setError(isRTL ? "فشل تحميل البيانات، يرجى المحاولة لاحقاً" : "Failed to load data");
    } finally {
      setLoading(false);
    }
  }, [isRTL, investmentItems.length]);

  useEffect(() => {
    fetchAllData();
    // تحديث تلقائي كل دقيقتين لمواكبة أسعار البورصة
    const interval = setInterval(fetchAllData, 90000);
    return () => clearInterval(interval);
  }, [fetchAllData]);
  
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

  // --- Animation Variants ---
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const cardVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5 } }
  };

  return (
    <section className="py-24 md:py-32 bg-[#050505] relative overflow-hidden" dir={isRTL ? "rtl" : "ltr"}>
      {/* Background Glows */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -left-24 w-[500px] h-[500px] bg-silver-500/5 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-white/5 rounded-full blur-[100px]"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-6 text-silver-400">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute h-full w-full rounded-full bg-silver-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-silver-500"></span>
              </span>
              <span className="text-sm font-bold uppercase tracking-[0.3em]">{t('liveMarket') || 'بورصة الفضة المباشرة'}</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight italic">
              {t('silverInvestTitle') || 'استثمر في نقاء الفضة'}
            </h2>
          </div>
        </div>

        {/* Dynamic Content Area */}
        {loading && investmentItems.length === 0 ? (
          <div className="flex justify-center items-center h-64">
            <div className="w-12 h-12 border-4 border-silver-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : error ? (
          <div className="text-center text-red-400 py-20 bg-red-500/5 rounded-3xl border border-red-500/20">
            <p className="text-xl">{error}</p>
            <button onClick={fetchAllData} className="mt-4 text-white underline italic text-sm">إعادة المحاولة</button>
          </div>
        ) : (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10"
          >
            <AnimatePresence>
              {investmentItems.map((item) => (
                <motion.div 
                  variants={cardVariants}
                  key={item.id} 
                  layout
                  className="group relative bg-gradient-to-br from-white/[0.08] to-transparent border border-white/10 rounded-[2.5rem] p-10 transition-all duration-500 hover:border-silver-500/40 hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)]"
                >
                  <div className="relative z-10">
                    {/* Product Image */}
                    <div className="mb-10 relative h-40 flex items-center justify-center">
                      <div className="absolute inset-0 bg-silver-500/10 blur-3xl rounded-full scale-50 group-hover:scale-100 transition-transform duration-700"></div>
                      <img 
                        src={`${import.meta.env.VITE_URL}${item.image}`} 
                        alt={item.name} 
                        className="relative w-32 h-32 md:w-40 md:h-40 object-contain drop-shadow-[0_20px_30px_rgba(255,255,255,0.15)] group-hover:scale-110 group-hover:-rotate-3 transition-all duration-500"
                        onError={(e) => { e.target.src = 'https://via.placeholder.com/150?text=Silver'; }}
                      />
                    </div>
                    
                    <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-silver-400 transition-colors min-h-[4rem]">
                      {item.name}
                    </h3>
                    
                    {/* Price Box */}
                    <div className="mb-8 p-6 bg-black/40 rounded-[2rem] border border-white/5 shadow-inner">
                      <span className="block text-gray-500 text-[10px] uppercase tracking-[0.2em] mb-2">{t('currentPrice') || 'السعر الحالي'}</span>
                      <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-black text-white tracking-tighter">
                          {parseFloat(item.price).toLocaleString(isRTL ? 'ar-SA' : 'en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                        <span className="text-sm font-bold text-silver-500 uppercase italic">{t('currency') || 'د.أ'}</span>
                      </div>
                    </div>

                    <button 
                      onClick={() => handleBuy(item)}
                      className="group/btn w-full bg-white text-black py-5 rounded-2xl font-black flex items-center justify-center gap-3 text-lg hover:bg-silver-500 hover:text-white transition-all duration-500 active:scale-95 shadow-xl shadow-white/5"
                    >
                      {t('buyNow') || 'اطلب الآن'}
                      {isRTL ? 
                        <FiArrowLeft className="group-hover/btn:-translate-x-2 transition-transform duration-300" /> : 
                        <FiArrowRight className="group-hover/btn:translate-x-2 transition-transform duration-300" />
                      }
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Footer Info */}
        <div className="mt-20 flex justify-center">
          <div className="inline-flex flex-col sm:flex-row items-center gap-6 bg-white/[0.02] border border-white/5 px-10 py-5 rounded-3xl backdrop-blur-md">
            <div className="flex items-center gap-3 text-gray-400 text-xs tracking-[0.2em] uppercase">
              <FiActivity className="text-silver-500 animate-pulse text-lg" />
              <span>{t('secureInvestment') || 'تداول آمن • سبائك معتمدة • استلام فوري'}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InvestmentSection;