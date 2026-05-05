import React from 'react';
import { motion } from 'framer-motion';
import {
  FiInstagram, FiPhone, FiMail,
  FiMapPin, FiSend, FiStar, FiChevronRight
} from 'react-icons/fi';
import { FaTiktok, FaWhatsapp } from 'react-icons/fa';
import { useLanguage } from '../contexts/LanguageContext';

function Footer() {
  const currentYear = new Date().getFullYear();
  const { t, language } = useLanguage();
  const isAr = language === 'ar';

  return (
    <footer className="relative bg-[#0d0d0d] text-gray-400 pt-24 pb-10 overflow-hidden border-t border-silver-900/30" dir={isAr ? 'rtl' : 'ltr'}>

      {/* عناصر جمالية في الخلفية */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-silver-500/50 to-transparent" />
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-silver-600/5 blur-[120px] rounded-full" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">

          {/* Brand Identity Section */}
          <div className="flex flex-col items-start space-y-6">
            <div className="flex items-center gap-3">
              <div className="relative group">
                <div className="w-12 h-12 border border-silver-500/50 flex items-center justify-center rotate-45 group-hover:rotate-[225deg] transition-transform duration-700">
                  <FiStar className="text-silver-500 -rotate-45 group-hover:-rotate-[225deg] transition-transform duration-700" />
                </div>
              </div>
              <h3 className="text-white text-2xl font-bold tracking-tighter uppercase font-serif">
                {t('brandName')} <span className="text-silver-500 block text-xs tracking-[0.3em] font-sans font-light mt-1 opacity-80">{t('brandTag')}</span>
              </h3>
            </div>

            <p className="text-sm leading-relaxed opacity-70 font-light max-w-xs">
              {t('brandDesc') || "Elevating your everyday style with handcrafted 925 sterling silver jewelry. Timeless elegance for the modern soul."}
            </p>

            <div className="flex gap-4 pt-4">
              <SocialLink href="https://instagram.com" icon={<FiInstagram />} label="Instagram" />
              <SocialLink href="https://whatsapp.com" icon={<FaWhatsapp />} label="WhatsApp" />
              <SocialLink href="https://tiktok.com" icon={<FaTiktok />} label="TikTok" />
            </div>
          </div>

          {/* Luxury Navigation */}
          <div className="lg:pl-10">
            <h3 className="text-white text-xs font-bold mb-10 uppercase tracking-[0.2em] border-b border-silver-900/50 pb-4 inline-block">
              {t('quickLinks')}
            </h3>
            <ul className="space-y-4">
              <FooterLink href="/terms-conditions">{t('TermsConditions')}</FooterLink>
              <FooterLink href="/privacy-policy">{t('privacyPolicy')}</FooterLink>
              {/* <FooterLink href="/cancellation-policy">{t('CancellationPolicy')}</FooterLink> */}
              <FooterLink href="/shipping-delivery">{t('ShippingDeliveryPolicy')}</FooterLink>
              <FooterLink href="/refund-policy">{t('refundPolicy')}</FooterLink>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h3 className="text-white text-xs font-bold mb-10 uppercase tracking-[0.2em] border-b border-silver-900/50 pb-4 inline-block">
              {t('contactInfo')}
            </h3>
            <ul className="space-y-8">
              {/* العناوين الثلاثة */}
              <ContactItem
                icon={<FiMapPin />}
                title={isAr ? "فروعنا" : "Our Locations"}
                links={[
                  t('address1'),
                  t('address2'),
                  t('address3')
                ]}
              />

              {/* أرقام التواصل الثلاثة */}
              <ContactItem
                icon={<FiPhone />}
                title={isAr ? "اتصل بنا" : "Call Us"}
                links={[
                  "+962 7822 61996",
                  "+962 7785 04817",
                  "+962 7954 31499"
                ]}
              />

              {/* البريد الإلكتروني */}
              <ContactItem
                icon={<FiMail />}
                title={isAr ? "البريد الإلكتروني" : "Email"}
                links={["Elitesilverjo@gmail.com"]}
              />
            </ul>
          </div>

          {/* Premium Newsletter */}
          <div className="bg-white/[0.03] p-8 rounded-2xl border border-white/5 backdrop-blur-sm">
            <h3 className="text-white text-xs font-bold mb-4 uppercase tracking-[0.2em]">
              {t('newsletter')}
            </h3>
            <p className="text-xs text-gray-500 mb-6 leading-relaxed ">
              Join our elite circle for early access to new collections and private sales.
            </p>
            <div className="relative group">
              <input
                type="email"
                placeholder={t('enterEmail')}
                className="w-full bg-[#1a1a1a] border border-white/10 py-4 px-4 text-[11px] tracking-widest focus:outline-none focus:border-silver-600 transition-all duration-500 text-white rounded-lg"
              />
              <button className={`absolute ${isAr ? 'left-1' : 'right-1'} top-1 bottom-1 bg-silver-600 hover:bg-silver-500 text-black px-5 rounded-md transition-all flex items-center justify-center`}>
                <FiSend className={isAr ? 'rotate-180' : ''} />
              </button>
            </div>
          </div>

        </div>

        {/* Bottom Metadata */}
        <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-[10px] tracking-[0.2em] uppercase text-gray-600">
            © {currentYear} <span className="text-gray-400">{t('brandName')}</span>. {t('copyright') || "All Rights Reserved."}
          </div>

          <div className="flex items-center gap-8 grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all duration-700">
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/fe/Visa_Inc._logo_%281992%E2%80%931999%29.svg/250px-Visa_Inc._logo_%281992%E2%80%931999%29.svg.png" className="h-3" alt="Visa" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" className="h-5" alt="Mastercard" />
            <div className="h-4 w-[1px] bg-white/10 hidden md:block" />
            <span className="text-[9px] tracking-widest text-gray-500 uppercase">Secure Payments</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* --- Internal Components for Cleanliness --- */

function FooterLink({ href, children }) {
  const { language } = useLanguage();
  const isAr = language === 'ar';

  return (
    <li>
      <a
        href={href}
        className="group flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.15em] text-gray-500 hover:text-silver-500 transition-all duration-300"
      >
        <span className="relative overflow-hidden">
          {children}
          <span className="absolute bottom-0 left-0 w-full h-[1px] bg-silver-600 -translate-x-[110%] group-hover:translate-x-0 transition-transform duration-500"></span>
        </span>
        <FiChevronRight className={`text-[10px] opacity-0 group-hover:opacity-100 transition-all ${isAr ? 'rotate-180' : ''} transform group-hover:translate-x-1`} />
      </a>
    </li>
  );
}

// تأكد أنك كتبت كلمة links هنا بين الأقواس
function ContactItem({ icon, title, links }) { 
  return (
    <li className="group flex items-start gap-4">
      <div className="w-10 h-10 shrink-0 rounded-full border border-white/5 flex items-center justify-center text-silver-500 group-hover:bg-silver-600 group-hover:text-black transition-all duration-500 text-base">
        {icon}
      </div>
      <div className="flex flex-col space-y-1.5">
        <span className="text-[9px] uppercase tracking-widest text-gray-600 mb-0.5">{title}</span>
        
        {links && links.map((link, index) => (
          <span 
            key={index} 
            className="text-[11px] text-gray-400 group-hover:text-white transition-colors block leading-tight font-light"
          >
            {link}
          </span>
        ))}
      </div>
    </li>
  );
}

function SocialLink({ href, icon, label }) {
  return (
    <a
      href={href}
      aria-label={label}
      className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-gray-400 hover:border-silver-500 hover:text-silver-500 transition-all duration-500 hover:-translate-y-1 bg-white/[0.02]"
    >
      {icon}
    </a>
  );
}

export default Footer;