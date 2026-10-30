import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ShieldCheck,
  FileText,
  Lock,
  Truck,
  RefreshCw,
  Clock,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  HelpCircle,
  MessageCircle,
  Gem
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useLanguage } from '../contexts/LanguageContext';

const PolicyPage = ({ title, subtitle, lastUpdated, icon: Icon = FileText, children }) => {
  const { isRTL, language } = useLanguage();
  const isAr = language === 'ar' || isRTL;
  const location = useLocation();

  const policyLinks = [
    {
      path: '/terms-conditions',
      label: isAr ? 'شروط الاستخدام' : 'Terms of Use',
      icon: <FileText className="w-4 h-4" />,
    },
    {
      path: '/privacy-policy',
      label: isAr ? 'سياسة الخصوصية' : 'Privacy Policy',
      icon: <Lock className="w-4 h-4" />,
    },
    {
      path: '/shipping-delivery',
      label: isAr ? 'الشحن والتوصيل' : 'Shipping & Delivery',
      icon: <Truck className="w-4 h-4" />,
    },
    {
      path: '/cancellation-policy',
      label: isAr ? 'الاسترجاع والإلغاء' : 'Returns & Cancellation',
      icon: <RefreshCw className="w-4 h-4" />,
    },
  ];

  return (
    <div
      className="min-h-screen bg-[#070709] text-white font-sans selection:bg-silver-500/30 selection:text-white"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <Navbar />

      <main className="container mx-auto px-4 sm:px-6 pt-36 pb-28 max-w-5xl">
        {/* Glow Effects */}
        <div className="relative">
          <div className="absolute top-10 left-1/2 -translate-x-1/2 w-96 h-96 bg-silver-400/5 rounded-full blur-[140px] pointer-events-none" />
          <div className="absolute top-20 right-1/4 w-80 h-80 bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none" />

          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12 relative z-10"
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.03] border border-white/10 text-xs text-silver-300 font-medium mb-5">
              <ShieldCheck className="w-4 h-4 text-silver-300" />
              <span>{isAr ? 'الشفافية وضمان النخبة' : 'Transparency & Elite Guarantee'}</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-serif font-bold text-white mb-4 tracking-tight">
              <span className="bg-gradient-to-r from-white via-silver-200 to-silver-400 bg-clip-text text-transparent">
                {title}
              </span>
            </h1>

            {subtitle && (
              <p className="text-silver-300/80 text-sm sm:text-base max-w-2xl mx-auto mb-4 leading-relaxed">
                {subtitle}
              </p>
            )}

            <div className="inline-flex items-center gap-2 text-xs text-silver-400/80 font-mono">
              <Clock className="w-3.5 h-3.5" />
              <span>
                {isAr ? 'آخر تحديث رسمي:' : 'Last official revision:'} {lastUpdated || '16/04/2026'}
              </span>
            </div>
          </motion.div>

          {/* Quick Policy Switcher Navigation Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-10 relative z-10"
          >
            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 p-2 rounded-2xl bg-[#0c0d12]/80 border border-white/10 backdrop-blur-xl">
              {policyLinks.map((item, idx) => {
                const isActive =
                  location.pathname === item.path ||
                  (item.path === '/cancellation-policy' && location.pathname === '/refund-policy');

                return (
                  <Link
                    key={idx}
                    to={item.path}
                    className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all duration-300 ${
                      isActive
                        ? 'bg-gradient-to-r from-white via-silver-200 to-silver-300 text-black shadow-lg shadow-white/10 font-bold'
                        : 'text-silver-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </motion.div>

          {/* Main Content Luxury Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="relative z-10 rounded-[2.5rem] bg-[#0c0d12]/90 border border-white/10 p-8 sm:p-14 backdrop-blur-2xl shadow-[0_20px_70px_rgba(0,0,0,0.6)]"
          >
            {children}

            {/* Assistance Concierge Footer Box */}
            <div className="mt-14 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4 text-center sm:text-right">
                <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-silver-300 flex-shrink-0">
                  <HelpCircle className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white mb-0.5">
                    {isAr ? 'هل لديك أي استفسار قانوني أو خاص؟' : 'Have questions regarding our policies?'}
                  </h4>
                  <p className="text-xs text-silver-400">
                    {isAr
                      ? 'فريق خدمة عملاء إيليت سيلفر متاح على مدار الساعة لمساعدتك.'
                      : 'Our dedicated concierge is available around the clock to assist you.'}
                  </p>
                </div>
              </div>

              <a
                href="https://wa.me/962799307765"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider transition-all flex-shrink-0"
              >
                <MessageCircle className="w-4 h-4" />
                {isAr ? 'محادثة المساعد الفوري' : 'Contact Support'}
              </a>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PolicyPage;