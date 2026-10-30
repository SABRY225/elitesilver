import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Star,
  Quote,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Award,
} from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";

function Testimonials() {
  const { t, language, isRTL } = useLanguage();
  const [isPaused, setIsPaused] = useState(false);

  // مصفوفة المراجعات الفاخرة ثنائية اللغة
  const reviews = [
    {
      id: 1,
      text_ar:
        "جودة استثنائية وخدمة في قمة الرقي. طلبت طقم فضة إيطالي لمناسبة خاصة وكانت النتيجة ساحرة، وتفاصيل الصياغة ونقاء الفضة 925 فاق كل التوقعات.",
      text_en:
        "Exceptional quality and truly royal service. I ordered an Italian silver set for a special occasion and the result was mesmerizing with flawless 925 craftsmanship.",
      author_ar: "سارة أحمد",
      author_en: "Sarah Ahmed",
      role_ar: "عميلة مميزة VIP",
      role_en: "VIP Elite Client",
      initial: "S",
      tag_ar: "طقم فضة إسترليني",
      tag_en: "Sterling Silver Set",
      rating: 5,
    },
    {
      id: 2,
      text_ar:
        "وصل الطلب في الموعد تماماً وفاق توقعاتي بكثير. الاهتمام بتفاصيل التغليف الملكي الفاخر وشهادة الفحص المرفقة يجعله المتجر الأول للهدايا بلا منازع.",
      text_en:
        "Delivered precisely on time and far exceeded my expectations. The royal packaging and included assay certificate make it the ultimate gift destination.",
      author_ar: "محمد خالد",
      author_en: "Mohamed Khaled",
      role_ar: "طلب تفصيل خاص",
      role_en: "Custom Order Client",
      initial: "M",
      tag_ar: "خاتم ملكي مخصص",
      tag_en: "Custom Royal Ring",
      rating: 5,
    },
    {
      id: 3,
      text_ar:
        "تجربة شراء لا تُنسى وسرعة تجاوب مذهلة. الخاتم الفضي يحمل بريقاً دائماً لا يخبو، أضاف لمسة فريدة من الفخامة والأناقة لكل إطلالاتي اليومية.",
      text_en:
        "An unforgettable boutique experience with instant support. The ring has an enduring luster that adds timeless elegance to all my daily looks.",
      author_ar: "ليلى محمود",
      author_en: "Laila Mahmoud",
      role_ar: "عميلة دائمة",
      role_en: "Loyal Client",
      initial: "L",
      tag_ar: "خاتم فضة 925 إيطالي",
      tag_en: "Italian 925 Ring",
      rating: 5,
    },
    {
      id: 4,
      text_ar:
        "من أروع وأصدق المتاجر التي تعاملت معها على الإطلاق. القطع على الواقع أجمل وأفخم بكثير من الصور، والوزن والنقاء مثاليان بكل المقاييس.",
      text_en:
        "One of the most trustworthy boutiques I've ever dealt with. The actual pieces look far more stunning in person than in the photos.",
      author_ar: "نورة العلي",
      author_en: "Nora Al-Ali",
      role_ar: "شراء عبر المتجر",
      role_en: "Online Client",
      initial: "N",
      tag_ar: "سوار فضة كلاسيكي",
      tag_en: "Classic Silver Bracelet",
      rating: 5,
    },
    {
      id: 5,
      text_ar:
        "دقة متناهية في صياغة الفضة الإسترلينية وتغليف فاخر يليق بكبار الشخصيات. بكل تأكيد سيكون خياري الدائم لكل المناسبات القادمة.",
      text_en:
        "Utmost precision in sterling crafting and packaging fit for royalty. Definitely my go-to boutique for all upcoming celebrations.",
      author_ar: "عبدالله يوسف",
      author_en: "Abdullah Youssef",
      role_ar: "مشتريات هدايا",
      role_en: "Corporate Client",
      initial: "A",
      tag_ar: "سبيكة فضة 100 غرام",
      tag_en: "100g Silver Ingot",
      rating: 5,
    },
    {
      id: 6,
      text_ar:
        "ذوق رفيع جداً في اختيار التصاميم، وفضة إيطالية نقية مع شهادة ضمان معتمدة. فخورة باقتنائي لهذه القطع الفنية الساحرة.",
      text_en:
        "Impeccable taste in design, pure Italian silver with certified quality. So proud of adding these artistic pieces to my jewelry collection.",
      author_ar: "هند حسن",
      author_en: "Hend Hassan",
      role_ar: "عميلة مميزة",
      role_en: "Verified Client",
      initial: "H",
      tag_ar: "سلسال مرصع بالزركون",
      tag_en: "Zircon Silver Necklace",
      rating: 5,
    },
  ];

  // تكرار المراجعات لضمان حركة مستمرة لا نهائية وسلسة
  const duplicatedReviews = [...reviews, ...reviews];

  return (
    <section
      id="testimonials"
      className="py-24 sm:py-32 bg-gradient-to-b from-[#f4f5f7] via-[#ffffff] to-[#f8f9fa] relative overflow-hidden select-none border-t border-silver-200/50"
      dir={isRTL ? "rtl" : "ltr"}
    >
      {/* 1. عناصر خلفية ناعمة تحاكي بريق الفضة */}
      <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-silver-200/20 to-transparent pointer-events-none" />
      <div className="absolute top-1/2 -left-40 w-96 h-96 bg-silver-300/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 -right-40 w-96 h-96 bg-silver-400/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 relative z-10 max-w-7xl">
        {/* 2. ترويسة القسم والإحصائيات الموثقة */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          {/* وسام الثقة */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-silver-100 border border-silver-300/70 text-silver-700 text-xs font-semibold tracking-wider uppercase mb-4 shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5 text-silver-600" />
            <span>
              {t("testimonialsBadge") ||
                (isRTL ? "ثقة مطلقة • تجارب حقيقية" : "Pure Trust & Certified Reviews")}
            </span>
          </motion.div>

          {/* العنوان الرئيسي */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 tracking-tight leading-tight mb-4"
          >
            {isRTL ? "آراء نخبة عملاء إيليت سيلفر" : t("customerReviews")}
          </motion.h2>

          <p className="text-gray-500 text-sm sm:text-base max-w-xl leading-relaxed mb-6">
            {isRTL
              ? "نعتز بثقة آلاف العملاء الذين اختاروا بريق الفضة الإيطالية عيار 925 لتزيين أجمل مناسباتهم"
              : "Cherishing the trust of thousands of clients who choose authentic 925 Italian silver for their finest moments"}
          </p>

          {/* مؤشرات التقييم الفاخرة */}
          <div className="inline-flex items-center gap-4 px-6 py-2.5 rounded-2xl bg-white border border-silver-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.04)]">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className="w-4 h-4 text-amber-400 fill-amber-400 drop-shadow-sm"
                />
              ))}
            </div>
            <span className="text-xs font-bold text-gray-900 font-mono">
              4.9 / 5.0
            </span>
            <span className="text-silver-300">|</span>
            <span className="text-xs text-gray-500 font-medium">
              {isRTL ? "+15,000 عميل راضٍ" : "+15,000 Satisfied Clients"}
            </span>
          </div>
        </div>

        {/* 3. شريط التمرير المستمر (Infinite Luxury Marquee) */}
        <div
          className="relative group overflow-hidden py-4 -mx-4 sm:-mx-6"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* تأثير التلاشي الجانبي الناعم (Edge Fade Gradients) */}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-24 sm:w-44 bg-gradient-to-r from-[#f4f5f7] via-[#f4f5f7]/80 to-transparent z-20" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-24 sm:w-44 bg-gradient-to-l from-[#f4f5f7] via-[#f4f5f7]/80 to-transparent z-20" />

          <motion.div
            className="flex gap-6 sm:gap-8 w-max"
            animate={{
              x: isRTL ? ["0%", "50%"] : ["0%", "-50%"],
            }}
            transition={{
              ease: "linear",
              duration: isPaused ? 100000 : 38,
              repeat: Infinity,
            }}
          >
            {duplicatedReviews.map((review, index) => (
              <div
                key={index}
                className="w-[320px] sm:w-[390px] md:w-[430px] flex-shrink-0 bg-white border border-silver-200/80 hover:border-silver-400 rounded-3xl p-6 sm:p-8 shadow-[0_4px_25px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_45px_rgba(0,0,0,0.1)] transition-all duration-500 flex flex-col justify-between relative group/card cursor-default"
              >
                {/* علامة اقتباس مائية شفافة في الخلفية */}
                <Quote
                  className={`absolute top-6 ${
                    isRTL ? "left-6" : "right-6"
                  } w-12 h-12 text-silver-200/40 group-hover/card:text-silver-300/60 transition-colors pointer-events-none`}
                />

                <div className="relative z-10">
                  {/* رأس الكرت: التقييم وشارة القطعة */}
                  <div className="flex items-center justify-between gap-2 mb-5">
                    <div className="flex items-center gap-1">
                      {[...Array(review.rating)].map((_, i) => (
                        <Star
                          key={i}
                          className="w-3.5 h-3.5 text-amber-400 fill-amber-400"
                        />
                      ))}
                    </div>

                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-silver-700 bg-silver-100/80 px-2.5 py-0.5 rounded-full border border-silver-200/70">
                      <ShieldCheck className="w-3 h-3 text-emerald-600" />
                      <span>{isRTL ? review.tag_ar : review.tag_en}</span>
                    </span>
                  </div>

                  {/* نص المراجعة */}
                  <p
                    className={`text-gray-700 text-sm sm:text-base leading-relaxed font-light mb-8 ${
                      isRTL ? "text-right" : "text-left"
                    }`}
                  >
                    "{isRTL ? review.text_ar : review.text_en}"
                  </p>
                </div>

                {/* ذيل الكرت: بيانات العميل */}
                <div className="relative z-10 pt-4 border-t border-gray-100 flex items-center gap-3.5">
                  {/* صورة الحرف الأول الرمزية */}
                  <div className="relative shrink-0">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-gray-900 to-gray-700 flex items-center justify-center text-silver-200 font-serif font-bold text-lg shadow-md border border-silver-400/40">
                      {review.initial}
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-4.5 h-4.5 bg-emerald-500 rounded-full border-2 border-white flex items-center justify-center text-white shadow-sm">
                      <CheckCircle2 className="w-3 h-3" />
                    </div>
                  </div>

                  <div className={`min-w-0 ${isRTL ? "text-right" : "text-left"}`}>
                    <h4 className="font-bold text-gray-900 text-sm tracking-tight truncate">
                      {isRTL ? review.author_ar : review.author_en}
                    </h4>
                    <p className="text-[11px] text-silver-600 font-semibold tracking-wide truncate">
                      {isRTL ? review.role_ar : review.role_en}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* 4. ركيزة المصداقية الإضافية بالأسفل */}
        <div className="mt-14 sm:mt-16 text-center">
          <div className="inline-flex items-center gap-2 text-xs text-gray-500">
            <Award className="w-4 h-4 text-silver-600" />
            <span>
              {isRTL
                ? "جميع التقييمات صادرة عن مشترين حقيقيين تم التحقق من هوياتهم وطلباتهم"
                : "All testimonials are from verified buyers with authenticated orders"}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Testimonials;