import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  CheckCircle2,
  Copy,
  Check,
  ShoppingBag,
  User,
  ShieldCheck,
  Truck,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Clock,
  MessageCircle,
  Gem
} from 'lucide-react';
import toast from 'react-hot-toast';
import Navbar from './Navbar';
import Footer from './Footer';
import { useLanguage } from '../contexts/LanguageContext';

const OrderSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t, isRTL, language } = useLanguage();
  const isAr = language === 'ar' || isRTL;
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const orderId = location.state?.orderId;
  const [copied, setCopied] = useState(false);

  const handleCopyOrderId = () => {
    if (!orderId) return;
    navigator.clipboard.writeText(String(orderId));
    setCopied(true);
    toast.success(isAr ? 'تم نسخ رقم الطلب بنجاح' : 'Order ID copied to clipboard');
    setTimeout(() => setCopied(false), 2500);
  };

  const steps = [
    {
      title: isAr ? 'تم تأكيد الطلب' : 'Order Confirmed',
      desc: isAr ? 'تم تسجيل طلبك واعتماده في نظام النخبة' : 'Your order is recorded & confirmed in our system',
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-400" />,
      active: true,
      done: true,
    },
    {
      title: isAr ? 'فحص العيار والتغليف المخملي' : 'Quality Inspection & Luxury Box',
      desc: isAr ? 'فحص عيار 925 وتغليف القطع في علبة إيليت الفاخرة' : 'Authenticating 925 hallmark & packaging in luxury velvet case',
      icon: <Gem className="w-5 h-5 text-silver-300" />,
      active: true,
      done: false,
    },
    {
      title: isAr ? 'التوصيل السريع للمنزل' : 'Express Delivery',
      desc: isAr ? 'توصيل آمن إلى باب منزلك خلال 24 - 48 ساعة' : 'Insured delivery to your doorstep within 24-48 hours',
      icon: <Truck className="w-5 h-5 text-silver-400" />,
      active: false,
      done: false,
    },
  ];

  return (
    <div className="bg-[#070709] min-h-screen text-white font-sans selection:bg-silver-500/30 selection:text-white" dir={isRTL ? 'rtl' : 'ltr'}>
      <Navbar />

      <main className="container mx-auto px-4 sm:px-6 pt-36 pb-24 max-w-4xl">
        {/* Glow backdrop */}
        <div className="relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none" />
          <div className="absolute top-1/4 left-1/3 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-silver-400/5 rounded-full blur-[120px] pointer-events-none" />

          {/* Main Success Container */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="relative z-10 rounded-[2.5rem] bg-[#0c0d12]/90 border border-white/10 p-8 sm:p-14 backdrop-blur-2xl shadow-[0_20px_70px_rgba(0,0,0,0.6)] text-center"
          >
            {/* Animated Celebration Icon */}
            <div className="relative inline-flex items-center justify-center mb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1.2, 1] }}
                transition={{ duration: 0.7, ease: 'backOut' }}
                className="w-28 h-28 rounded-full bg-gradient-to-tr from-emerald-500/20 via-emerald-400/10 to-transparent border border-emerald-400/40 flex items-center justify-center shadow-[0_0_50px_rgba(52,211,153,0.25)]"
              >
                <div className="w-20 h-20 rounded-full bg-emerald-500/20 flex items-center justify-center border border-emerald-400/60">
                  <CheckCircle2 className="w-12 h-12 text-emerald-400" />
                </div>
              </motion.div>
              <span className="absolute -top-1 -right-1 w-7 h-7 rounded-full bg-silver-200/20 border border-white/40 flex items-center justify-center text-xs text-silver-200 animate-pulse">
                <Sparkles className="w-4 h-4 text-silver-300" />
              </span>
            </div>

            {/* Title & Subtitle */}
            <h1 className="text-3xl sm:text-5xl font-serif font-bold text-white mb-4 tracking-tight">
              {t('orderSuccess') || (isAr ? 'تهانينا! تم تأكيد طلبك بنجاح' : 'Order Confirmed Successfully')}
            </h1>
            <p className="text-silver-300/80 text-sm sm:text-base max-w-xl mx-auto leading-relaxed mb-8">
              {t('orderSuccessMessage') || (isAr
                ? 'شكراً لاختيارك إيليت سيلفر 925. تم استلام تفاصيل طلبك ويجري تجهيز قطعتك الفضية بكل عناية واحترافية.'
                : 'Thank you for choosing Elite Silver 925. Your jewelry piece is now being carefully prepared and packaged in our atelier.')}
            </p>

            {/* Order Reference Box */}
            {orderId && (
              <div className="mb-10 max-w-md mx-auto p-5 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-between gap-4">
                <div className={isAr ? 'text-right' : 'text-left'}>
                  <p className="text-[11px] uppercase tracking-[0.25em] text-silver-400 font-medium">
                    {t('orderNumber') || (isAr ? 'رقم الطلب المرجعي' : 'Order Reference')}
                  </p>
                  <p className="text-lg sm:text-xl font-mono font-bold text-white mt-0.5 tracking-wider">
                    #{orderId}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleCopyOrderId}
                  className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-silver-300 hover:text-white transition-all flex items-center gap-2 text-xs font-medium"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span className="text-emerald-400">{isAr ? 'تم النسخ' : 'Copied'}</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>{isAr ? 'نسخ' : 'Copy'}</span>
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Stepper Timeline */}
            <div className="max-w-2xl mx-auto mb-12">
              <h3 className="text-xs font-bold uppercase tracking-[0.25em] text-silver-400 mb-6 text-center">
                {isAr ? 'مراحل تنفيذ وتوصيل الطلب' : 'Order Fulfillment Journey'}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {steps.map((st, i) => (
                  <div
                    key={i}
                    className={`p-4 rounded-2xl border text-center transition-all ${
                      st.done
                        ? 'bg-emerald-500/[0.04] border-emerald-500/30 text-white'
                        : st.active
                        ? 'bg-silver-500/[0.04] border-white/20 text-white'
                        : 'bg-white/[0.02] border-white/5 text-silver-400/60'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-full mx-auto mb-3 flex items-center justify-center bg-white/5 border border-white/10">
                      {st.icon}
                    </div>
                    <h4 className="text-sm font-semibold text-white mb-1">{st.title}</h4>
                    <p className="text-xs text-silver-400/70 leading-relaxed">{st.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Authenticity Guarantee Banner */}
            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-silver-950/40 via-white/[0.02] to-silver-950/40 border border-silver-400/20 max-w-xl mx-auto mb-10 flex items-center justify-center gap-3 text-xs sm:text-sm text-silver-300">
              <ShieldCheck className="w-5 h-5 text-silver-300 flex-shrink-0" />
              <span>
                {isAr
                  ? 'مرفق مع كل طلب شهادة ضمان رسمية للفضة الإسترليني عيار 925 الإيطالية'
                  : 'Every order includes an official 925 Italian Sterling Silver certificate of authenticity'}
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 border-t border-white/10">
              <button
                onClick={() => navigate('/')}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-white via-silver-200 to-silver-400 text-black font-bold uppercase tracking-[0.15em] text-xs shadow-lg shadow-white/10 hover:shadow-white/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <ShoppingBag className="w-4 h-4" />
                {t('continueShopping') || (isAr ? 'متابعة التسوق' : 'Continue Shopping')}
              </button>

              {user && (
                <Link
                  to="/profile"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full border border-white/20 bg-white/5 hover:bg-white/10 text-white font-bold uppercase tracking-[0.15em] text-xs transition-all hover:border-white/40"
                >
                  <User className="w-4 h-4 text-silver-300" />
                  {t('viewProfile') || (isAr ? 'عرض طلباتي في الحساب' : 'View My Orders')}
                  {isAr ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                </Link>
              )}

              {/* Concierge WhatsApp Assistant */}
              <a
                href={`https://wa.me/962799307765?text=${encodeURIComponent(
                  isAr
                    ? `مرحباً، أود الاستفسار عن طلبي رقم ${orderId ? '#' + orderId : ''}`
                    : `Hello, I would like to inquire about my order ${orderId ? '#' + orderId : ''}`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 rounded-full border border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-[0.15em] transition-all"
              >
                <MessageCircle className="w-4 h-4" />
                {isAr ? 'خدمة كونسيرج واتساب' : 'WhatsApp Concierge'}
              </a>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default OrderSuccess;

