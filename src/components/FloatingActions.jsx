import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiArrowUp } from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import { useLanguage } from "../contexts/LanguageContext";

const FloatingActions = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const { language, isRTL } = useLanguage();
  const isAr = language === "ar";

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 350);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const whatsappNumber = "+962790000000"; // رقم خدمة العملاء المعتمد
  const whatsappMessage = encodeURIComponent(
    isAr
      ? "مرحباً، أود الاستفسار عن مجوهرات إيليت سيلفر 925 ✨"
      : "Hello, I would like to inquire about Elite Silver 925 jewelry ✨"
  );

  return (
    <div
      className={`fixed bottom-6 z-40 flex flex-col items-center gap-3 ${
        isRTL ? "left-6" : "right-6"
      }`}
    >
      {/* Scroll to Top Button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            key="scroll-top"
            initial={{ opacity: 0, scale: 0.6, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.6, y: 15 }}
            transition={{ duration: 0.25 }}
            onClick={scrollToTop}
            aria-label={isAr ? "الصعود لأعلى" : "Scroll to top"}
            className="group relative w-12 h-12 rounded-full bg-[#141416]/90 backdrop-blur-md border border-white/20 text-white flex items-center justify-center shadow-[0_10px_25px_rgba(0,0,0,0.5)] hover:border-silver-400 hover:bg-white hover:text-black transition-all duration-300 hover:scale-105 active:scale-95"
          >
            <FiArrowUp className="text-lg transition-transform duration-300 group-hover:-translate-y-0.5" />
            
            {/* Tooltip */}
            <span
              className={`absolute top-1/2 -translate-y-1/2 ${
                isRTL ? "left-14" : "right-14"
              } px-2.5 py-1 rounded-md bg-black/90 text-white text-[11px] font-medium tracking-wide whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-md border border-white/10`}
            >
              {isAr ? "للأعلى" : "Top"}
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* WhatsApp VIP Concierge Button */}
      <motion.a
        href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={isAr ? "محادثة واتساب مباشرة" : "Chat on WhatsApp"}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
        className="group relative w-13 h-13 rounded-full bg-gradient-to-tr from-[#128C7E] to-[#25D366] text-white flex items-center justify-center shadow-[0_10px_30px_rgba(37,211,102,0.35)] hover:shadow-[0_15px_35px_rgba(37,211,102,0.5)] hover:scale-110 active:scale-95 transition-all duration-300"
      >
        {/* Subtle breathing glow */}
        <span className="absolute inset-0 rounded-full bg-[#25D366] opacity-30 animate-ping pointer-events-none" />

        <FaWhatsapp className="text-2xl relative z-10" />

        {/* Tooltip */}
        <span
          className={`absolute top-1/2 -translate-y-1/2 ${
            isRTL ? "left-16" : "right-16"
          } px-3 py-1.5 rounded-lg bg-[#111114]/95 text-white text-xs font-semibold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-xl border border-white/10 flex items-center gap-1.5`}
        >
          <span className="w-2 h-2 rounded-full bg-[#25D366]" />
          <span>{isAr ? "خدمة العملاء VIP" : "VIP Concierge"}</span>
        </span>
      </motion.a>
    </div>
  );
};

export default FloatingActions;
