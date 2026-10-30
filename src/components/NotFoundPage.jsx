import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiHome, FiShoppingBag, FiArrowRight, FiArrowLeft, FiCompass } from "react-icons/fi";
import { useLanguage } from "../contexts/LanguageContext";
import Navbar from "./Navbar";
import Footer from "./Footer";

const NotFoundPage = () => {
  const { t, isRTL, language } = useLanguage();
  const navigate = useNavigate();
  const isAr = language === "ar";

  return (
    <div className="min-h-screen bg-[#070709] text-white flex flex-col font-sans selection:bg-silver-400 selection:text-black" dir={isRTL ? "rtl" : "ltr"}>
      <Navbar />

      <main className="flex-1 flex items-center justify-center relative overflow-hidden px-4 sm:px-6 py-32 md:py-40">
        {/* Subtle Luxury Ambient Background Orbs */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-gradient-to-tr from-silver-500/10 via-white/5 to-transparent rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-silver-400/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/5 rounded-full blur-[100px] pointer-events-none" />

        {/* Delicate decorative grid lines */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />

        <div className="relative z-10 max-w-2xl w-full text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative p-8 sm:p-12 md:p-16 rounded-3xl bg-white/[0.02] border border-white/10 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.6)]"
          >
            {/* Jewelry Hallmark Tag */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.05] border border-white/10 text-silver-300 text-xs tracking-[0.25em] uppercase font-bold mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-silver-400 animate-ping" />
              <span>ELITE SILVER 925 • ERROR 404</span>
            </div>

            {/* Glowing 404 Header */}
            <motion.h1
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="text-7xl sm:text-8xl md:text-9xl font-extrabold tracking-tighter bg-gradient-to-b from-white via-silver-200 to-silver-600 bg-clip-text text-transparent drop-shadow-[0_10px_20px_rgba(255,255,255,0.1)] font-serif"
            >
              404
            </motion.h1>

            <h2 className="mt-4 text-2xl sm:text-3xl font-bold text-white tracking-tight">
              {isAr ? "الصفحة غير متوفرة" : "Piece Not Found"}
            </h2>

            <p className="mt-4 text-gray-400 text-sm sm:text-base leading-relaxed max-w-lg mx-auto font-light">
              {isAr
                ? "يبدو أن الصفحة أو القطعة التي تبحث عنها قد تم نقلها أو أصبحت غير متوفرة حالياً. ندعوك لاستكشاف أحدث تشكيلات الفضة الإسترلينية الفاخرة."
                : "The collection piece or page you are seeking is currently unavailable or has been relocated. Explore our signature handcrafted 925 silver creations."}
            </p>

            {/* Action Buttons */}
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-full bg-gradient-to-r from-silver-200 via-white to-silver-300 text-black font-bold text-sm tracking-wide shadow-[0_0_25px_rgba(255,255,255,0.25)] hover:shadow-[0_0_35px_rgba(255,255,255,0.4)] hover:scale-[1.02] active:scale-95 transition-all"
              >
                <FiHome className="text-base" />
                <span>{isAr ? "العودة للرئيسية" : "Back to Home"}</span>
              </Link>

              <Link
                to="/category/all"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/15 text-white font-medium text-sm tracking-wide hover:border-silver-400/40 transition-all active:scale-95"
              >
                <FiShoppingBag className="text-base text-silver-300" />
                <span>{isAr ? "تصفح المجموعات" : "Explore Collections"}</span>
                {isAr ? <FiArrowLeft className="text-sm" /> : <FiArrowRight className="text-sm" />}
              </Link>
            </div>

            {/* Quick Links */}
            <div className="mt-10 pt-8 border-t border-white/5 flex flex-wrap items-center justify-center gap-6 text-xs text-gray-400">
              <Link to="/custom-order" className="hover:text-silver-300 transition-colors flex items-center gap-1.5">
                <FiCompass className="text-silver-400" />
                <span>{isAr ? "طلب تصميم مخصص" : "Custom Order"}</span>
              </Link>
              <span className="text-white/20">•</span>
              <button
                onClick={() => navigate(-1)}
                className="hover:text-silver-300 transition-colors cursor-pointer"
              >
                {isAr ? "الرجوع للصفحة السابقة" : "Go Back"}
              </button>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default NotFoundPage;
