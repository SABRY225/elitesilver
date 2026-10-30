import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  MapPin,
  Phone,
  Mail,
  Send,
  Sparkles,
  ShieldCheck,
  ChevronRight,
  ChevronLeft,
  ArrowUp,
  CheckCircle2
} from 'lucide-react';
import { FaInstagram, FaWhatsapp, FaTiktok, FaFacebookF } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { useLanguage } from '../contexts/LanguageContext';
import LogoImg from '../images/logo.png';

function Footer() {
  const currentYear = new Date().getFullYear();
  const { t, language, isRTL } = useLanguage();
  const [email, setEmail] = useState('');

  // معالجة الاشتراك في النشرة البريدية
  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      toast.error(isRTL ? 'يرجى إدخال بريد إلكتروني صالح' : 'Please enter a valid email address');
      return;
    }
    toast.success(
      isRTL
        ? 'شكراً لانضمامك إلى دائرة نخبة إيليت سيلفر!'
        : 'Thank you for joining Elite Silver circle!'
    );
    setEmail('');
  };

  // العودة لأعلى الصفحة بسلاسة
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer
      className="relative bg-[#070709] text-gray-400 pt-20 sm:pt-28 pb-12 overflow-hidden border-t border-silver-900/40 select-none"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      {/* 1. عناصر الإضاءة الخلفية الفاخرة */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-silver-400/40 to-transparent" />
      <div className="absolute -top-32 -left-32 w-[450px] h-[450px] bg-silver-500/5 blur-[140px] rounded-full pointer-events-none" />
      <div className="absolute bottom-10 -right-32 w-[450px] h-[450px] bg-silver-400/5 blur-[140px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 relative z-10 max-w-7xl">
        {/* 2. الشبكة الرئيسية لأقسام الفوتر */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-16 sm:mb-20">
          
          {/* العمود 1: هوية المتجر والشبكات الاجتماعية (4 أعمدة) */}
          <div className="lg:col-span-4 flex flex-col items-start space-y-6">
            <Link to="/" className="inline-block transition-transform hover:scale-105 duration-300">
              <img
                src={LogoImg}
                alt="Elite Silver 925"
                className="h-14 sm:h-16 w-auto object-contain filter drop-shadow-[0_4px_15px_rgba(255,255,255,0.1)]"
              />
            </Link>

            <p className="text-sm leading-relaxed text-silver-300/80 font-light max-w-sm">
              {t('brandDesc')}
            </p>

            {/* شارة الضمان الإيطالي */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-silver-300">
              <Sparkles className="w-3.5 h-3.5 text-silver-300" />
              <span>{isRTL ? 'فضة إسترلينية إيطالية عيار 925 أصلية' : 'Authentic 925 Italian Sterling Silver'}</span>
            </div>

            {/* قنوات التواصل الاجتماعي */}
            <div className="flex items-center gap-3 pt-2">
              <SocialLink
                href="https://www.instagram.com/elitesilver.jo"
                icon={<FaInstagram className="w-4 h-4" />}
                label="Instagram"
              />
              <SocialLink
                href="https://wa.me/962782261996"
                icon={<FaWhatsapp className="w-4 h-4" />}
                label="WhatsApp"
              />
              <SocialLink
                href="https://www.tiktok.com/@elitesilver.jo"
                icon={<FaTiktok className="w-4 h-4" />}
                label="TikTok"
              />
              <SocialLink
                href="https://facebook.com"
                icon={<FaFacebookF className="w-3.5 h-3.5" />}
                label="Facebook"
              />
            </div>
          </div>

          {/* العمود 2: روابط سريعة (2 أعمدة) */}
          <div className="lg:col-span-2">
            <h3 className="text-white text-xs font-bold uppercase tracking-[0.2em] mb-6 flex items-center gap-2 border-b border-white/10 pb-3">
              <span>{t('quickLinks')}</span>
            </h3>
            <ul className="space-y-3.5">
              <FooterLink to="/">{t('home') || (isRTL ? 'الرئيسية' : 'Home')}</FooterLink>
              <FooterLink to="/category/all">{t('collections') || (isRTL ? 'التشكيلات' : 'Collections')}</FooterLink>
              <FooterLink to="/checkout-silver">{t('silverInvestTitle') || (isRTL ? 'سبائك الاستثمار' : 'Silver Bullion')}</FooterLink>
              <FooterLink to="/custom-order">{t('customOrder') || (isRTL ? 'طلب تفصيل خاص' : 'Custom Order')}</FooterLink>
              <FooterLink to="/cart">{t('shoppingCart') || (isRTL ? 'سلة التسوق' : 'Cart')}</FooterLink>
              <FooterLink to="/wishlist">{t('myWishlist') || (isRTL ? 'قائمة المفضلة' : 'Wishlist')}</FooterLink>
            </ul>
          </div>

          {/* العمود 3: السياسات والشروط (2 أعمدة) */}
          <div className="lg:col-span-2">
            <h3 className="text-white text-xs font-bold uppercase tracking-[0.2em] mb-6 flex items-center gap-2 border-b border-white/10 pb-3">
              <span>{isRTL ? 'السياسات والضمان' : 'Policies & Care'}</span>
            </h3>
            <ul className="space-y-3.5">
              <FooterLink to="/terms-conditions">{t('TermsConditions')}</FooterLink>
              <FooterLink to="/privacy-policy">{t('privacyPolicy')}</FooterLink>
              <FooterLink to="/shipping-delivery">{t('ShippingDeliveryPolicy')}</FooterLink>
              <FooterLink to="/refund-policy">{t('refundPolicy')}</FooterLink>
            </ul>
          </div>

          {/* العمود 4: النشرة البريدية ومعلومات الفروع (4 أعمدة) */}
          <div className="lg:col-span-4 flex flex-col space-y-6">
            {/* صندوق النشرة البريدية الفاخر */}
            <div className="bg-gradient-to-b from-white/[0.06] to-white/[0.02] p-6 sm:p-7 rounded-2xl border border-white/10 backdrop-blur-md shadow-xl">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-silver-300" />
                <h4 className="text-white text-xs font-bold uppercase tracking-[0.2em]">
                  {t('newsletter')}
                </h4>
              </div>

              <p className="text-xs text-silver-400 font-light mb-5 leading-relaxed">
                {isRTL
                  ? 'انضم لدائرة النخبة واحصل على وصول مبكر للتشكيلات الجديدة والعروض الحصرية.'
                  : 'Join our elite circle for private access to new handcrafted collections.'}
              </p>

              <form onSubmit={handleNewsletterSubmit} className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t('enterEmail')}
                  className="w-full bg-black/60 border border-white/15 py-3.5 px-4 text-xs tracking-wider focus:outline-none focus:border-silver-400 transition-colors text-white rounded-xl placeholder:text-gray-600"
                />
                <button
                  type="submit"
                  aria-label="Subscribe to newsletter"
                  className={`absolute ${
                    isRTL ? 'left-1.5' : 'right-1.5'
                  } top-1.5 bottom-1.5 silver-btn-luxury px-4 rounded-lg flex items-center justify-center text-black font-bold text-xs transition-all active:scale-95 cursor-pointer`}
                >
                  <Send className={`w-3.5 h-3.5 ${isRTL ? 'rotate-180' : ''}`} />
                </button>
              </form>
            </div>

            {/* تفاصيل فروع الأردن والتواصل السريع */}
            <div className="space-y-3 pt-2 text-xs">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-silver-400 shrink-0 mt-0.5" />
                <div className="text-silver-400/90 leading-snug">
                  <div className="font-bold text-white mb-0.5">{isRTL ? 'فروعنا في الأردن:' : 'Our Branches:'}</div>
                  <div>{t('address1')}</div>
                  <div className="mt-1">{t('address2')}</div>
                  <div className="mt-1">{t('address3')}</div>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-1">
                <Phone className="w-4 h-4 text-silver-400 shrink-0" />
                <div className="flex items-center gap-3 font-mono text-silver-300 text-xs">
                  <a href="tel:+962782261996" className="hover:text-white transition-colors">
                    +962 7822 61996
                  </a>
                  <span>•</span>
                  <a href="tel:+962778504817" className="hover:text-white transition-colors">
                    +962 7785 04817
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-silver-400 shrink-0" />
                <a
                  href="mailto:Elitesilverjo@gmail.com"
                  className="font-mono text-silver-300 hover:text-white transition-colors text-xs"
                >
                  Elitesilverjo@gmail.com
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* 3. الشريط السفلي (حقوق النشر، طرق الدفع، وزر الصعود لأعلى) */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          {/* حقوق النشر */}
          <div className="text-[11px] tracking-wider uppercase text-silver-500 text-center md:text-start">
            © {currentYear} <span className="text-white font-bold">{t('brandName')}</span>.{' '}
            {t('copyright') || (isRTL ? 'جميع الحقوق محفوظة.' : 'All Rights Reserved.')}
          </div>

          {/* بوابات الدفع والأمان المعتمدة */}
          <div className="flex items-center gap-5 text-silver-400 text-xs">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-[11px] font-mono text-silver-300">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>{isRTL ? 'دفع آمن ومشفّر 256-Bit' : '256-Bit Secure SSL'}</span>
            </div>

            <div className="flex items-center gap-2 text-silver-400 text-xs font-mono">
              <span>CliQ</span>
              <span>•</span>
              <span>Visa</span>
              <span>•</span>
              <span>Mastercard</span>
              <span>•</span>
              <span>{isRTL ? 'دفع عند الاستلام' : 'COD'}</span>
            </div>
          </div>

          {/* زر الصعود لأعلى الصفحة */}
          <button
            onClick={scrollToTop}
            aria-label="Scroll to top"
            className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 flex items-center justify-center text-silver-300 hover:text-white transition-all duration-300 cursor-pointer shadow-md active:scale-95"
            title={isRTL ? 'العودة لأعلى الصفحة' : 'Back to top'}
          >
            <ArrowUp className="w-4 h-4" />
          </button>
        </div>
      </div>
    </footer>
  );
}

/* مكون الرابط الداخلي للفوتر */
function FooterLink({ to, children }) {
  const { isRTL } = useLanguage();

  return (
    <li>
      <Link
        to={to}
        className="group flex items-center gap-2 text-xs font-medium tracking-wider text-silver-400 hover:text-white transition-colors duration-300"
      >
        <span className="relative overflow-hidden">
          {children}
          <span className="absolute bottom-0 left-0 w-full h-[1px] bg-silver-400 -translate-x-[110%] group-hover:translate-x-0 transition-transform duration-300" />
        </span>
        <span className="opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1">
          {isRTL ? <ChevronLeft className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
        </span>
      </Link>
    </li>
  );
}

/* مكون الرابط الاجتماعي */
function SocialLink({ href, icon, label }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="w-10 h-10 rounded-full border border-white/10 bg-white/[0.03] hover:bg-white/15 flex items-center justify-center text-silver-300 hover:text-white hover:border-silver-400/50 transition-all duration-300 hover:-translate-y-1 shadow-sm"
    >
      {icon}
    </a>
  );
}

export default Footer;