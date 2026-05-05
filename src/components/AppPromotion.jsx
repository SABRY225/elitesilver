import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { FaApple, FaGooglePlay, FaShoppingCart, FaBell, FaStar, FaShieldAlt } from 'react-icons/fa';
import { useLanguage } from "../contexts/LanguageContext";

const AppPromotion = () => {
  const { t, language } = useLanguage();
  const isAr = language === 'ar';

  // مصفوفة المميزات المطورة
  const features = [
    {
      title: t('easyShoppingTitle') || "Safe Shopping",
      desc: t('easyShoppingDesc') || "Seamless checkout with world-class security protocols.",
      icon: <FaShieldAlt />,
      gradient: 'from-[#1a1a1a] to-[#4a4a4a]'
    },
    {
      title: t('exclusiveOffersTitle') || "VIP Access",
      desc: t('exclusiveOffersDesc') || "Be the first to know about our limited edition drops.",
      icon: <FaBell />,
      gradient: 'from-[#b8860b] to-[#ffd700]'
    },
    {
      title: t('guaranteedQualityTitle') || "Certified Silver",
      desc: t('guaranteedQualityDesc') || "Every piece in your cart comes with a digital certificate.",
      icon: <FaStar />,
      gradient: 'from-[#718096] to-[#cbd5e0]'
    }
  ];

  return (
    <section className="py-32 bg-[#fafafa] relative overflow-hidden" dir={isAr ? 'rtl' : 'ltr'}>
      
      {/* 1. خلفية درامية (Atmospheric Background) */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-silver-200/20 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-silver-200/30 blur-[120px] rounded-full animate-pulse" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        
        {/* 2. Headline مع خطوط فنية */}
        <div className="max-w-4xl mx-auto text-center mb-24">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="inline-block px-4 py-1 border border-silver-400/30 rounded-full mb-6"
          >
            <span className="text-[10px] uppercase tracking-[0.4em] text-silver-600 font-bold">
              {t('experienceMobile') || "Experience Luxury on the Go"}
            </span>
          </motion.div>
          <h2 className="text-5xl md:text-7xl font-bold mb-8 tracking-tighter text-gray-900 luxury-heading">
            {t('appPromoTitle')}
          </h2>
          <p className="text-gray-500 text-lg md:text-xl font-light leading-relaxed max-w-2xl mx-auto">
            {t('appPromoDesc')}
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-16 items-center">
          
          {/* 3. الجانب الأيسر: قائمة المميزات (Vertical Timeline Style) */}
          <div className="lg:col-span-4 space-y-12 order-2 lg:order-1">
            {features.map((feature, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, x: isAr ? 50 : -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.2 }}
                className="flex gap-6 group"
              >
                <div className={`flex-shrink-0 w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center text-white text-xl shadow-lg group-hover:rotate-12 transition-transform duration-500`}>
                  {feature.icon}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2 tracking-tight group-hover:text-silver-600 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed font-light">
                    {feature.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* 4. المنتصف: الهاتف (The Hero Mockup) */}
          <div className="lg:col-span-4 order-1 lg:order-2 flex justify-center">
            <motion.div 
              style={{ perspective: 1000 }}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="relative"
            >
              {/* الهاتف بتصميم Glassmorphism */}
              <div className="w-[300px] h-[600px] bg-white rounded-[3.5rem] p-3 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.2)] border border-gray-200 relative z-20 overflow-hidden">
                <div className="w-full h-full bg-[#0a0a0a] rounded-[2.8rem] relative overflow-hidden flex flex-col items-center justify-center p-8">
                  {/* شاشة التطبيق */}
                  <div className="absolute top-0 left-0 w-full h-full opacity-40 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
                  
                  <motion.div 
                    animate={{ y: [0, -10, 0] }}
                    transition={{ repeat: Infinity, duration: 4 }}
                    className="relative z-10 flex flex-col items-center"
                  >
                    <div className="w-24 h-24 bg-gradient-to-tr from-silver-600 to-silver-400 rounded-3xl flex items-center justify-center shadow-[0_0_30px_rgba(212,175,55,0.4)] mb-6">
                       <span className="text-black text-3xl font-black">E</span>
                    </div>
                    <h4 className="text-white text-2xl font-bold mb-2 font-serif">ELITE SILVER</h4>
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => <FaStar key={i} className="text-silver-500 text-[8px]" />)}
                    </div>
                  </motion.div>

                  {/* واجهة شراء وهمية */}
                  <div className="mt-12 w-full space-y-3 relative z-10">
                    <div className="h-12 w-full bg-white/5 rounded-xl border border-white/10 animate-pulse" />
                    <div className="h-12 w-full bg-silver-600 rounded-xl shadow-lg flex items-center justify-center text-black text-[10px] font-bold tracking-widest uppercase">
                      Confirm Purchase
                    </div>
                  </div>
                </div>
                {/* Dynamic Island */}
                <div className="absolute top-6 left-1/2 -translate-x-1/2 w-28 h-7 bg-black rounded-full z-30 flex items-center justify-center border border-white/10">
                   <div className="w-1 h-1 bg-blue-500 rounded-full ml-auto mr-4" />
                </div>
              </div>

              {/* حلقات ذهبية خلف الهاتف */}
              <div className="absolute -top-10 -right-10 w-40 h-40 border-2 border-silver-200/30 rounded-full -z-10 animate-[spin_10s_linear_infinite]" />
              <div className="absolute -bottom-10 -left-10 w-60 h-60 border border-silver-400/10 rounded-full -z-10 animate-[spin_15s_linear_infinite]" />
            </motion.div>
          </div>

          {/* 5. الجانب الأيمن: أزرار التحميل (Premium Call to Action) */}
          <div className="lg:col-span-4 order-3 flex flex-col items-center lg:items-start space-y-8">
            <div className={`max-w-xs ${isAr ? 'text-right' : 'text-left'}`}>
               <h3 className="text-3xl font-bold text-gray-900 mb-4">{t('downloadAppTitle') || "Ready to shop?"}</h3>
               <p className="text-gray-500 text-sm font-light leading-relaxed">
                 {t('downloadAppDesc') || "Scan the QR code or use the buttons below to start your journey."}
               </p>
            </div>

            <div className="flex flex-col w-full max-w-[240px] gap-4">
              <DownloadButton 
                icon={<FaApple />} 
                sub={t('availableOn') || "Available on"} 
                main="App Store" 
                bg="bg-black" 
              />
              <DownloadButton 
                icon={<FaGooglePlay />} 
                sub={t('getItOn') || "Get it on"} 
                main="Google Play" 
                bg="bg-gradient-to-r from-silver-600 to-silver-500" 
                darkText
              />
            </div>


          </div>

        </div>
      </div>
    </section>
  );
};

/* مكون زر التحميل لإعادة الاستخدام */
const DownloadButton = ({ icon, sub, main, bg, darkText }) => (
  <motion.a 
    href="#"
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    className={`flex items-center gap-4 ${bg} ${darkText ? 'text-black' : 'text-white'} p-4 rounded-2xl shadow-xl transition-all duration-300`}
  >
    <span className="text-3xl">{icon}</span>
    <div className="flex flex-col">
      <span className="text-[8px] uppercase font-bold opacity-60 leading-none mb-1">{sub}</span>
      <span className="text-lg font-bold leading-none tracking-tight">{main}</span>
    </div>
  </motion.a>
);

export default AppPromotion;