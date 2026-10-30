import React from "react";
import { motion } from "framer-motion";
import { FaApple, FaGooglePlay } from "react-icons/fa";
import {
  ShieldCheck,
  Bell,
  Award,
  Star,
  Sparkles,
  QrCode,
  Smartphone,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";

const AppPromotion = () => {
  const { t, language, isRTL } = useLanguage();
  const isAr = language === "ar" || isRTL;

  // مصفوفة مميزات التطبيق الحصرية
  const features = [
    {
      title: t("easyShoppingTitle") || (isRTL ? "تسوق آمن ومشفّر" : "Safe Shopping"),
      desc:
        t("easyShoppingDesc") ||
        (isRTL
          ? "عمليات دفع إلكتروني مشفرة وسريعة مع حماية كاملة لبياناتك."
          : "Encrypted instant checkout with bank-grade security protocols."),
      icon: ShieldCheck,
      gradient: "from-gray-900 to-gray-700",
    },
    {
      title: t("exclusiveOffersTitle") || (isRTL ? "عروض النخبة VIP" : "VIP Elite Access"),
      desc:
        t("exclusiveOffersDesc") ||
        (isRTL
          ? "وصول مبكر وتنبيهات فورية لأحدث القطع الحصرية والخصومات الخاصة."
          : "Early access and instant push alerts for limited-edition silver drops."),
      icon: Bell,
      gradient: "from-silver-600 to-silver-800",
    },
    {
      title: t("guaranteedQualityTitle") || (isRTL ? "جودة موثقة رقمياً" : "Certified 925 Silver"),
      desc:
        t("guaranteedQualityDesc") ||
        (isRTL
          ? "كل قطعة تشتريها تأتي مع شهادة ضمان وفحص فضة 925 معتمدة داخل التطبيق."
          : "Every ordered piece comes with an in-app digital certificate of purity."),
      icon: Award,
      gradient: "from-gray-800 to-black",
    },
  ];

  return (
    <section
      id="app-promotion"
      className="py-24 sm:py-32 bg-gradient-to-b from-[#f8f9fa] via-[#ffffff] to-[#0d0d0d] relative overflow-hidden select-none border-t border-silver-200/40"
      dir={isRTL ? "rtl" : "ltr"}
    >
      {/* 1. عناصر الإضاءة والخلفية الهادئة */}
      <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-silver-200/20 to-transparent pointer-events-none" />
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-silver-300/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-silver-400/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 relative z-10 max-w-7xl">
        {/* 2. ترويسة القسم الإعلاني */}
        <div className="max-w-3xl mx-auto text-center mb-16 sm:mb-24">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-silver-100 border border-silver-300/70 text-silver-700 text-xs font-semibold tracking-wider uppercase mb-4 shadow-sm"
          >
            <Smartphone className="w-3.5 h-3.5 text-silver-600" />
            <span>
              {t("experienceMobile") ||
                (isRTL ? "الفخامة في جيبك" : "Luxury in Your Pocket")}
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 tracking-tight leading-tight mb-5"
          >
            {t("appPromoTitle")}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-gray-500 text-sm sm:text-base md:text-lg font-light leading-relaxed max-w-2xl mx-auto"
          >
            {t("appPromoDesc")}
          </motion.p>
        </div>

        {/* 3. شبكة المحتوى (المميزات - الهاتف - التحميل) */}
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* الجانب الأيمن / الأيسر: قائمة المميزات */}
          <div className="lg:col-span-4 space-y-6 sm:space-y-8 order-2 lg:order-1">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: isRTL ? 40 : -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                className="group p-5 sm:p-6 rounded-2xl bg-white border border-silver-200/80 hover:border-silver-400 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_15px_35px_rgba(0,0,0,0.08)] transition-all duration-400 flex gap-4 sm:gap-5"
              >
                <div
                  className={`flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center text-silver-200 shadow-md group-hover:scale-105 group-hover:rotate-6 transition-transform duration-400`}
                >
                  <feature.icon className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>

                <div className="min-w-0">
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-1.5 group-hover:text-silver-700 transition-colors tracking-tight">
                    {feature.title}
                  </h3>
                  <p className="text-gray-500 text-xs sm:text-sm leading-relaxed font-light">
                    {feature.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* المنتصف: الهاتف الذكي التفاعلي الفاخر (The Luxury Titanium Phone) */}
          <div className="lg:col-span-4 order-1 lg:order-2 flex justify-center py-6">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              {/* شارة إشعار تفاعلية طافية بالأعلى */}
              <motion.div
                animate={{ y: [-4, 4, -4] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-6 -left-6 sm:-left-10 z-30 bg-white/95 backdrop-blur-md border border-silver-200/80 p-3 sm:p-3.5 rounded-2xl shadow-[0_15px_35px_rgba(0,0,0,0.12)] flex items-center gap-3"
              >
                <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div className="text-start">
                  <div className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">
                    {isRTL ? "ميزة حصرية" : "Exclusive Drop"}
                  </div>
                  <div className="text-xs font-bold text-gray-900">
                    {isRTL ? "خصم 15% لمستخدمي التطبيق" : "15% In-App Welcome Discount"}
                  </div>
                </div>
              </motion.div>

              {/* شارة التقييم العائمة بالأسفل */}
              <motion.div
                animate={{ y: [4, -4, 4] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -bottom-6 -right-6 sm:-right-10 z-30 bg-gray-900 text-white p-3 sm:p-3.5 rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.3)] border border-silver-500/30 flex items-center gap-3"
              >
                <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-amber-400">
                  <Star className="w-4 h-4 fill-amber-400" />
                </div>
                <div className="text-start">
                  <div className="text-xs font-bold text-white flex items-center gap-1">
                    <span>4.9</span>
                    <span className="text-[10px] text-silver-400 font-normal">/ 5.0</span>
                  </div>
                  <div className="text-[10px] text-silver-300">
                    {isRTL ? "تقييم المتجر الرسمي" : "Official App Rating"}
                  </div>
                </div>
              </motion.div>

              {/* إطار الهاتف الفاخر (iPhone Luxury Mockup) */}
              <div className="w-[280px] sm:w-[310px] h-[570px] sm:h-[610px] bg-gradient-to-b from-silver-200 via-silver-400 to-silver-300 rounded-[3.2rem] p-3 shadow-[0_30px_70px_rgba(0,0,0,0.25)] border border-white/60 relative z-20">
                {/* الشاشة الداخلية */}
                <div className="w-full h-full bg-[#0a0a0c] rounded-[2.6rem] relative overflow-hidden flex flex-col justify-between p-5 text-white">
                  {/* Dynamic Island */}
                  <div className="w-24 h-6 bg-black rounded-full mx-auto z-40 flex items-center justify-between px-3 border border-white/10">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/60" />
                    <div className="w-2 h-2 rounded-full bg-blue-500/40" />
                  </div>

                  {/* واجهة التطبيق الداخلية الحقيقية */}
                  <div className="pt-2 flex flex-col items-center flex-1 justify-between">
                    {/* Header التطبيق */}
                    <div className="w-full flex items-center justify-between border-b border-white/10 pb-3">
                      <div>
                        <div className="text-[9px] tracking-widest text-silver-400 uppercase font-mono">
                          {isRTL ? "مرحباً بك في" : "Welcome to"}
                        </div>
                        <div className="text-sm font-black tracking-wider text-white">
                          ELITE SILVER 925
                        </div>
                      </div>
                      <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-xs">
                        💎
                      </div>
                    </div>

                    {/* بطاقة القطعة الفاخرة داخل التطبيق */}
                    <div className="my-auto w-full bg-gradient-to-b from-white/10 to-white/5 rounded-2xl p-4 border border-white/10 shadow-lg text-center">
                      <div className="w-28 h-28 mx-auto mb-3 rounded-2xl bg-radial from-white/20 to-transparent flex items-center justify-center">
                        <span className="text-5xl filter drop-shadow-[0_10px_20px_rgba(255,255,255,0.3)]">
                          💍
                        </span>
                      </div>
                      <div className="text-xs font-bold text-white mb-1">
                        {isRTL ? "خاتم ملكي عيار 925" : "Royal Sterling Ring 925"}
                      </div>
                      <div className="text-[10px] text-silver-300 font-mono mb-3">
                        45.00 JOD
                      </div>
                      <div className="py-2 px-4 rounded-xl bg-white text-black font-black text-[10px] tracking-wider uppercase shadow-md">
                        {isRTL ? "طلب سريع بنقرة واحدة" : "Instant 1-Click Order"}
                      </div>
                    </div>

                    {/* شريط الإحصائية السفلي داخل التطبيق */}
                    <div className="w-full bg-white/5 rounded-xl p-2.5 border border-white/5 flex items-center justify-around text-center">
                      <div>
                        <div className="text-[10px] font-bold text-white">925</div>
                        <div className="text-[8px] text-silver-400">Pure Silver</div>
                      </div>
                      <div className="w-[1px] h-4 bg-white/10" />
                      <div>
                        <div className="text-[10px] font-bold text-emerald-400">24h</div>
                        <div className="text-[8px] text-silver-400">Delivery</div>
                      </div>
                      <div className="w-[1px] h-4 bg-white/10" />
                      <div>
                        <div className="text-[10px] font-bold text-white">100%</div>
                        <div className="text-[8px] text-silver-400">Insured</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* الجانب الأيسر / الأيمن: أزرار التحميل وكود الـ QR */}
          <div className="lg:col-span-4 order-3 flex flex-col items-center lg:items-start space-y-6 sm:space-y-8">
            <div className={`max-w-xs ${isAr ? "text-right" : "text-left"}`}>
              <h3 className="text-2xl sm:text-3xl font-black text-gray-900 mb-2 tracking-tight">
                {t("downloadAppTitle") ||
                  (isRTL ? "حمل التطبيق الآن" : "Download App Now")}
              </h3>
              <p className="text-gray-500 text-xs sm:text-sm font-light leading-relaxed">
                {t("downloadAppDesc") ||
                  (isRTL
                    ? "استمتع بتجربة تسوق راقية وحصرية من هاتفك المحمول في أي وقت."
                    : "Enjoy an exquisite shopping experience directly from your phone.")}
              </p>
            </div>

            {/* أزرار التحميل (App Store & Google Play) */}
            <div className="flex flex-col w-full max-w-[260px] gap-3.5">
              <DownloadButton
                icon={<FaApple className="text-2xl" />}
                sub={t("availableOn") || (isRTL ? "متوفر على" : "Available on")}
                main="App Store"
                bg="bg-gray-950 hover:bg-black text-white"
              />

              <DownloadButton
                icon={<FaGooglePlay className="text-xl" />}
                sub={t("getItOn") || (isRTL ? "حمله من" : "Get it on")}
                main="Google Play"
                bg="bg-gradient-to-r from-silver-800 to-gray-900 hover:from-black hover:to-gray-900 text-white"
              />
            </div>

            {/* بطاقة الـ QR Code الذكية للتحميل الفوري */}
            <div className="w-full max-w-[260px] p-4 rounded-2xl bg-white border border-silver-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.04)] flex items-center gap-3.5">
              <div className="w-14 h-14 rounded-xl bg-gray-900 flex items-center justify-center text-white shrink-0 p-2 shadow-inner">
                {/* رسم SVG لرمز QR فخم */}
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-full h-full text-silver-300"
                >
                  <rect width="6" height="6" x="2" y="2" rx="1" />
                  <rect width="6" height="6" x="16" y="2" rx="1" />
                  <rect width="6" height="6" x="2" y="16" rx="1" />
                  <path d="M16 16h2v2h-2z" />
                  <path d="M20 20h2v2h-2z" />
                  <path d="M16 20h.01" />
                  <path d="M20 16h.01" />
                  <path d="M10 7h4" />
                  <path d="M7 10v4" />
                  <path d="M10 14h4" />
                  <path d="M14 10v4" />
                </svg>
              </div>

              <div className={isRTL ? "text-right" : "text-left"}>
                <div className="text-xs font-bold text-gray-900 mb-0.5">
                  {isRTL ? "امسح للتحميل السريع" : "Scan to Download"}
                </div>
                <div className="text-[10px] text-gray-400 leading-tight">
                  {isRTL
                    ? "وجه كاميرا هاتفك للبدء"
                    : "Point camera at QR code"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

/* مكون زر التحميل الفاخر الموحد */
const DownloadButton = ({ icon, sub, main, bg }) => (
  <motion.a
    href="#"
    whileHover={{ scale: 1.03 }}
    whileTap={{ scale: 0.97 }}
    className={`flex items-center gap-3.5 ${bg} p-3.5 sm:p-4 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-white/10`}
  >
    <div className="shrink-0 flex items-center justify-center text-silver-200">
      {icon}
    </div>
    <div className="flex flex-col text-start">
      <span className="text-[9px] uppercase font-semibold text-silver-400 leading-none mb-1">
        {sub}
      </span>
      <span className="text-base sm:text-lg font-bold leading-none tracking-tight text-white">
        {main}
      </span>
    </div>
  </motion.a>
);

export default AppPromotion;