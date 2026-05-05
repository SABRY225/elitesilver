import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion"; // اختياري للحركات الاحترافية
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
    const images = [imagHero1, imagHero2, imagHero3, imagHero4,imagHero5, imagHero6, imagHero7, imagHero8, imagHero9];
    const [currentIndex, setCurrentIndex] = useState(0);
    const { t, language } = useLanguage(); // نفترض وجود language لمعرفة الاتجاه

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
        }, 5000);
        return () => clearInterval(interval);
    }, [images.length]);

    return (
        <section className="relative min-h-[85vh] md:h-screen w-full overflow-hidden flex items-center justify-center font-sans" dir={language === 'ar' ? 'rtl' : 'ltr'}>
            
            {/* 1. Background Layer with Ken Burns Effect */}
            <div className="absolute inset-0 z-0">
                <AnimatePresence mode="wait">
                    <motion.img
                        key={currentIndex}
                        src={images[currentIndex]}
                        initial={{ scale: 1.1, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        className="absolute w-full h-full object-cover"
                        alt="Luxury Jewelry"
                    />
                </AnimatePresence>
                
                {/* 2. Professional Overlays */}
                {/* طبقة تظليل علوية وسفلية لضمان وضوح المحتوى */}
                <div className="absolute inset-0 bg-black/30" /> 
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/70" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/40" />
            </div>

            {/* 3. Floating Decorative Elements */}
            <div className="hidden md:block absolute top-20 left-10 w-64 h-64 bg-silver-500/10 blur-[100px] rounded-full animate-pulse" />
            <div className="hidden md:block absolute bottom-20 right-10 w-80 h-80 bg-silver-400/10 blur-[120px] rounded-full animate-pulse" />

            {/* 4. Main Content */}
            <div className="relative z-10 text-center px-4 sm:px-6 max-w-5xl mt-10">
                <motion.div
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.8 }}
                >
                 

                    <h1 className="text-3xl sm:text-4xl md:text-7xl lg:text-8xl font-bold text-white leading-[1.1] mb-6 drop-shadow-2xl">
                        <span className="bg-gradient-to-b from-white via-white to-silver-300 bg-clip-text text-transparent">
                            {t('silverRedefined')}
                        </span>
                        <br />
                        <span className="bg-gradient-to-r from-silver-300 via-silver-500 to-silver-200 bg-clip-text text-transparent font-serif">
                            {t('redefined')}
                        </span>
                    </h1>

                    <p className="mt-4 text-silver-100 text-sm sm:text-base md:text-xl max-w-2xl mx-auto leading-relaxed opacity-90 font-light">
                        {t('heroText')}
                    </p>
                </motion.div>

                {/* Buttons Section */}
                <motion.div 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    className="flex flex-col sm:flex-row gap-4 mt-10 justify-center"
                >
                    <button className="group relative w-full sm:w-auto px-8 sm:px-10 py-4 overflow-hidden rounded-full bg-gradient-to-r from-silver-600 to-silver-400 text-black font-bold transition-all hover:shadow-[0_0_20px_rgba(212,175,55,0.5)] active:scale-95" onClick={() => document.getElementById('products').scrollIntoView({ behavior: 'smooth' })}>
                        <span className="relative z-10 flex items-center gap-2 text-white">
                            {t('exploreCollections')}
                        </span>
                        <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity" />
                    </button>

                    <button className="w-full sm:w-auto px-8 sm:px-10 py-4 rounded-full border border-white/30 backdrop-blur-md text-white font-semibold hover:bg-white hover:text-black transition-all duration-300 active:scale-95" onClick={() => document.getElementById('productsCats').scrollIntoView({ behavior: 'smooth' })}>
                        {t('viewCatalog')}
                    </button>
                </motion.div>

                {/* 5. Trust Indicators (Features) */}
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 0.6 }}
                    className="mt-16 flex flex-wrap justify-center gap-4 md:gap-10"
                >
                    {[
                        { label: t('pureSilver925'), color: 'bg-silver-500' },
                        { label: t('exclusiveDesigns'), color: 'bg-blue-400' },
                        { label: t('freeShipping'), color: 'bg-emerald-400' }
                    ].map((item, i) => (
                        <div key={i} className="flex items-center gap-3 px-4 py-2 bg-black/20 backdrop-blur-xl border border-white/10 rounded-2xl">
                            <div className={`w-1.5 h-1.5 rounded-full ${item.color} shadow-[0_0_10px_currentColor]`} />
                            <span className="text-white/80 text-xs md:text-sm font-medium tracking-wide">
                                {item.label}
                            </span>
                        </div>
                    ))}
                </motion.div>
            </div>

            {/* 6. Slider Dots */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 z-20">
                {images.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => setCurrentIndex(i)}
                        className={`transition-all duration-500 rounded-full ${
                            i === currentIndex ? "w-10 bg-silver-500" : "w-2 bg-white/40"
                        } h-1.5`}
                    />
                ))}
            </div>
        </section>
    );
};

export default Hero;