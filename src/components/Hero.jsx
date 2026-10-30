import React, { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  ShieldCheck,
  Gem,
  Truck,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  ArrowLeft,
  ChevronDown,
} from "lucide-react";
import imagHero1 from "../images/image_hero.png";
import imagHero2 from "../images/image_hero1.png";
import imagHero3 from "../images/image_hero2.png";
import imagHero4 from "../images/image_hero3.png";
import imagHero5 from "../images/image_hero4.png";
import imagHero6 from "../images/image_hero5.jpeg";
import imagHero7 from "../images/image_hero6.jpeg";
import imagHero8 from "../images/image_hero7.jpeg";
import imagHero9 from "../images/image_hero8.jpeg";
import { useLanguage } from "../contexts/LanguageContext";

const Hero = () => {
  const images = [
    imagHero1,
    imagHero2,
    imagHero3,
    imagHero4,
    imagHero5,
    imagHero6,
    imagHero7,
    imagHero8,
    imagHero9,
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const { t, language, isRTL } = useLanguage();

  // الانتقال للشريحة التالية
  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  }, [images.length]);

  // الانتقال للشريحة السابقة
  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  }, [images.length]);

  // مؤقت التبديل التلقائي مع دعم الإيقاف المؤقت عند التفاعل
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      nextSlide();
    }, 5500);
    return () => clearInterval(interval);
  }, [nextSlide, isPaused]);

  // دعم أزرار الكيبورد للتحكم
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowLeft") {
        isRTL ? nextSlide() : prevSlide();
      } else if (e.key === "ArrowRight") {
        isRTL ? prevSlide() : nextSlide();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [nextSlide, prevSlide, isRTL]);

  const scrollToSection = (id) => {
    const target = document.getElementById(id);
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      className="relative min-h-[92vh] lg:min-h-screen w-full overflow-hidden flex flex-col justify-between select-none pt-28 pb-10"
      dir={isRTL ? "rtl" : "ltr"}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* 1. خلفية الصور مع تأثير التكبير السينمائي (Ken Burns Effect) */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <AnimatePresence mode="popLayout">
          <motion.img
            key={currentIndex}
            src={images[currentIndex]}
            initial={{ scale: 1.12, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.96, opacity: 0 }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0 w-full h-full object-cover object-center"
            alt="Elite Silver 925 Luxury Masterpiece"
          />
        </AnimatePresence>

        {/* 2. طبقات التعتيم والتدرجات السينمائية الفاخرة لضمان وضوح النصوص بدقة تامة */}
        {/* تعتيم أساسي متوازن يمنع تشويش نقوش العملات والخلفيات الفاتحة على النصوص */}
        <div className="absolute inset-0 bg-black/60 pointer-events-none" />

        {/* تظليل علوي وسفلي متدرج لدمج النافبار والسكشن التالي */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/40 to-[#070709] pointer-events-none" />

        {/* بقعة تعتيم دائرية في المنتصف مباشرة خلف النص لتوفير تباين سينمائي عالي الجودة */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(7,7,9,0.75)_0%,_rgba(7,7,9,0.45)_55%,_rgba(7,7,9,0.92)_100%)] pointer-events-none" />

        {/* هالة إضاءة فضية فاخرة في العمق */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-white/[0.04] blur-[120px] rounded-full pointer-events-none" />
      </div>

      {/* 3. أسهم التنقل بين الشرائح (Desktop & Tablets) */}
      <div className="hidden md:flex absolute inset-y-0 inset-x-4 lg:inset-x-8 z-20 items-center justify-between pointer-events-none">
        <button
          onClick={isRTL ? nextSlide : prevSlide}
          aria-label={isRTL ? "Next Slide" : "Previous Slide"}
          className="pointer-events-auto p-3.5 rounded-full bg-black/40 hover:bg-white/20 backdrop-blur-md border border-white/10 hover:border-white/30 text-white/80 hover:text-white transition-all duration-300 transform hover:scale-110 active:scale-95 shadow-xl"
        >
          {isRTL ? (
            <ChevronRight className="w-5 h-5" />
          ) : (
            <ChevronLeft className="w-5 h-5" />
          )}
        </button>

        <button
          onClick={isRTL ? prevSlide : nextSlide}
          aria-label={isRTL ? "Previous Slide" : "Next Slide"}
          className="pointer-events-auto p-3.5 rounded-full bg-black/40 hover:bg-white/20 backdrop-blur-md border border-white/10 hover:border-white/30 text-white/80 hover:text-white transition-all duration-300 transform hover:scale-110 active:scale-95 shadow-xl"
        >
          {isRTL ? (
            <ChevronLeft className="w-5 h-5" />
          ) : (
            <ChevronRight className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* 4. عداد الشرائح التحريري الفاخر في الزاوية */}
      <div className="hidden lg:flex items-center gap-2 absolute top-32 ltr:right-12 rtl:left-12 z-20 px-3.5 py-1.5 rounded-full bg-black/50 backdrop-blur-md border border-white/10 text-white/80 text-xs font-mono tracking-widest shadow-lg">
        <span className="text-white font-bold">
          {String(currentIndex + 1).padStart(2, "0")}
        </span>
        <span className="text-white/40">/</span>
        <span className="text-white/50">
          {String(images.length).padStart(2, "0")}
        </span>
      </div>

      {/* 5. المحتوى الرئيسي في المنتصف */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 flex flex-col items-center justify-center text-center max-w-5xl my-auto">
        {/* وسام الفخامة الملكي */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="inline-flex items-center gap-2.5 px-4 sm:px-5 py-2 rounded-full bg-white/[0.08] backdrop-blur-xl border border-white/20 shadow-[0_4px_25px_rgba(0,0,0,0.4)] mb-6 sm:mb-8"
        >
          <Sparkles className="w-4 h-4 text-silver-300 animate-pulse" />
          <span className="text-xs sm:text-sm font-medium tracking-wide text-silver-200">
            {language === "ar"
              ? "مجوهرات الفضة الإسترلينية الإيطالية عيار 925"
              : "Authentic 925 Italian Sterling Silver"}
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
        </motion.div>

        {/* العنوان الرئيسي التحريري الفخم والمتناسق بدقة */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.2 }}
          className="max-w-4xl mx-auto"
        >
          <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.25] sm:leading-[1.18] mb-6 tracking-normal">
            <span className="block text-white drop-shadow-[0_4px_24px_rgba(0,0,0,0.9)]">
              {t("silverRedefined")}
            </span>
            <span
              className={`block mt-2 sm:mt-3 ${
                isRTL
                  ? "text-silver-shimmer font-bold"
                  : "text-silver-shimmer font-luxury italic font-normal"
              } drop-shadow-[0_4px_28px_rgba(255,255,255,0.25)]`}
            >
              {t("redefined")}
            </span>
          </h1>

          <p className="mt-4 sm:mt-6 text-silver-200/95 text-sm sm:text-base md:text-lg lg:text-xl max-w-2xl mx-auto leading-relaxed sm:leading-loose font-normal drop-shadow-[0_2px_12px_rgba(0,0,0,0.95)] px-4">
            {t("heroText")}
          </p>
        </motion.div>

        {/* أزرار الإجراءات الفاخرة (CTA Buttons) */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.45 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-5 w-full max-w-md mx-auto mt-8 sm:mt-10"
        >
          {/* الزر الرئيسي: تدرج الفضة المصقولة مع بريق متحرك */}
          <button
            onClick={() => scrollToSection("products")}
            className="group relative w-full sm:w-auto px-8 sm:px-10 py-4 rounded-full silver-btn-luxury font-bold text-sm sm:text-base text-black flex items-center justify-center gap-3 shadow-[0_10px_35px_rgba(255,255,255,0.2)] active:scale-95 transition-all duration-300 overflow-hidden cursor-pointer"
          >
            {/* لمعان معدني عاكس يمر فوق الزر */}
            <div className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/70 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-[350%] transition-transform duration-1000 ease-out" />

            <span className="relative z-10">{t("exploreCollections")}</span>

            <span className="relative z-10 transition-transform duration-300 group-hover:translate-x-1 rtl:group-hover:-translate-x-1">
              {isRTL ? (
                <ArrowLeft className="w-4 h-4" />
              ) : (
                <ArrowRight className="w-4 h-4" />
              )}
            </span>
          </button>

          {/* الزر الثانوي: زجاجي كريستالي أنيق */}
          <button
            onClick={() => scrollToSection("productsCats")}
            className="w-full sm:w-auto px-8 sm:px-10 py-4 rounded-full bg-white/[0.08] hover:bg-white/[0.16] backdrop-blur-xl border border-white/20 hover:border-white/45 text-white font-semibold text-sm sm:text-base transition-all duration-300 active:scale-95 flex items-center justify-center gap-2 shadow-[0_4px_25px_rgba(0,0,0,0.3)] cursor-pointer hover:shadow-[0_0_25px_rgba(255,255,255,0.15)]"
          >
            <span>{t("viewCatalog")}</span>
          </button>
        </motion.div>

        {/* 6. مؤشرات الثقة الفاخرة (4 Trust Pillars) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.65 }}
          className="mt-12 sm:mt-16 grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 w-full max-w-4xl"
        >
          {[
            {
              icon: Gem,
              title: t("pureSilver925"),
              subtitle: isRTL ? "نقاء 92.5% معتمد" : "Certified 92.5% Purity",
            },
            {
              icon: Sparkles,
              title: t("exclusiveDesigns"),
              subtitle: isRTL ? "صياغة إيطالية فاخرة" : "Italian Craftsmanship",
            },
            {
              icon: Truck,
              title: t("freeShipping"),
              subtitle: isRTL ? "توصيل آمن لباب منزلك" : "Insured Express Delivery",
            },
            {
              icon: ShieldCheck,
              title: isRTL ? "ضمان الأصالة" : "Quality Guaranteed",
              subtitle: isRTL ? "شهادة جودة رسمية" : "Official Certificate",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="bg-[#0c0d12]/75 hover:bg-[#0c0d12]/90 border border-white/10 hover:border-white/25 backdrop-blur-xl p-3.5 sm:p-4 rounded-2xl flex items-center gap-3 text-start transition-all duration-300 shadow-[0_10px_30px_rgba(0,0,0,0.4)]"
            >
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white/10 flex items-center justify-center text-silver-200 shrink-0 border border-white/10 shadow-inner">
                <item.icon className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div className="min-w-0">
                <div className="text-xs sm:text-sm font-bold text-white truncate">
                  {item.title}
                </div>
                <div className="text-[10px] sm:text-xs text-silver-400 truncate">
                  {item.subtitle}
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* 7. شريط التحكم والتقدم في الشرائح السفلي (Slide Dots & Scroll Cue) */}
      <div className="relative z-20 mt-8 flex flex-col items-center gap-4">
        {/* مؤشرات الشرائح مع خط التقدم */}
        <div className="flex items-center gap-2 sm:gap-3 bg-black/50 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 shadow-lg">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`relative transition-all duration-500 rounded-full h-1.5 sm:h-2 cursor-pointer ${
                i === currentIndex
                  ? "w-8 sm:w-10 bg-gradient-to-r from-silver-200 to-white shadow-[0_0_12px_rgba(255,255,255,0.7)]"
                  : "w-2 sm:w-2.5 bg-white/30 hover:bg-white/60"
              }`}
            />
          ))}
        </div>

        {/* سهم مؤشر التمرير للأسفل (Scroll Down Indicator) */}
        <button
          onClick={() => scrollToSection("products")}
          className="text-white/60 hover:text-white transition-colors flex items-center gap-1.5 text-[11px] tracking-widest uppercase cursor-pointer"
        >
          <span className="hidden sm:inline">
            {isRTL ? "اكتشف المزيد" : "Scroll to explore"}
          </span>
          <ChevronDown className="w-4 h-4 animate-bounce text-silver-300" />
        </button>
      </div>
    </section>
  );
};

export default Hero;