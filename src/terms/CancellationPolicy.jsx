import React from 'react';
import PolicyPage from "./PolicyPage";
import { useLanguage } from '../contexts/LanguageContext';
import {
  RefreshCw,
  AlertTriangle,
  XCircle,
  Wallet,
  ShieldAlert,
  CheckCircle2
} from 'lucide-react';

const CancellationPolicy = () => {
  const { language, isRTL } = useLanguage();
  const isAr = language === 'ar' || isRTL;

  const sections = [
    {
      num: '01',
      icon: <RefreshCw className="w-5 h-5 text-emerald-400" />,
      title: isAr ? 'شروط الاستبدال والاسترجاع العامة (خلال 3 أيام)' : 'General Return & Exchange Conditions (3 Days)',
      desc: isAr
        ? 'يمكن لعملائنا الكرام طلب استبدال أو استرجاع قطع المجوهرات الجاهزة خلال (3) أيام من تاريخ الاستلام الفعلي، بشرط أن تكون القطعة في حالتها الأصلية تماماً، غير ملبوسة، وداخل علبة إيليت سيلفر 925 المخملية مع كامل ملحقاتها وبطاقة الضمان.'
        : 'Patrons may request an exchange or return for ready-to-wear jewelry within (3) calendar days of confirmed delivery, provided the piece is in pristine, unworn condition within the original Elite Silver 925 velvet case, complete with warranty credentials and packaging.',
    },
    {
      num: '02',
      icon: <AlertTriangle className="w-5 h-5 text-amber-400" />,
      title: isAr ? 'حالات استثنائية لا يقبل فيها الاسترجاع' : 'Non-Returnable Exceptions',
      desc: isAr
        ? 'حفاظاً على حقوق العملاء ومعايير الجودة، لا يسري الاسترجاع على: (1) القطع المصنعة خصيصاً بالاسم أو الصور أو المقاسات الخاصة. (2) سبائك الفضة الاستثمارية Ag 999.0 نظراً لارتباطها بأسعار البورصة العالمية الفورية. (3) القطع التي تعرضت للتلف أو سوء الاستخدام أو المواد الكيميائية والعطور.'
        : 'In accordance with luxury atelier standards, returns are not accepted on: (1) Custom-engraved bespoke creations crafted specifically to client specifications. (2) Pure investment silver bullion (Ag 999.0) due to real-time market price volatility. (3) Pieces exhibiting physical misuse, accidental damage, or chemical exposure.',
      highlight: true,
    },
    {
      num: '03',
      icon: <XCircle className="w-5 h-5 text-silver-300" />,
      title: isAr ? 'سياسة إلغاء الطلب قبل الشحن' : 'Pre-Dispatch Order Cancellation',
      desc: isAr
        ? 'يمكن إلغاء الطلبات الجاهزة مجاناً بالكامل دون أي رسوم قبل تسليمها لمندوب الشحن. بالنسبة للطلبات الخاصة (Bespoke)، يمكن الإلغاء فقط خلال أول 24 ساعة من تأكيد الطلب وقبل بدء الصياغة الفعلية في المشغل.'
        : 'Ready-made purchases may be cancelled without penalty at any point prior to handover to courier dispatch. For bespoke made-to-order requests, cancellation is solely permitted within 24 hours of confirmation, prior to artisanal crafting commencement.',
    },
    {
      num: '04',
      icon: <Wallet className="w-5 h-5 text-silver-300" />,
      title: isAr ? 'آلية ومواعيد استرداد المبالغ' : 'Refund Method & Settlement Windows',
      desc: isAr
        ? 'عند استلام القطعة المرتجعة وفحص سلامة العيار والحالة من قبل خبرائنا، يتم تحويل المبلغ المسترد إلى نفس وسيلة الدفع الأصلية خلال (7 - 14) يوم عمل مصرفي. يرجى العلم بأن رسوم التوصيل الأصلية غير قابلة للاسترداد.'
        : 'Following receipt and gemological inspection of the returned piece, authorized refunds are credited to the original payment method within (7 - 14) business banking days. Original courier dispatch fees are non-refundable.',
    },
    {
      num: '05',
      icon: <ShieldAlert className="w-5 h-5 text-rose-400" />,
      title: isAr ? 'القطع التالفة أو العيوب المصنعية' : 'Damaged Parcels or Craftsmanship Defects',
      desc: isAr
        ? 'في حال وصول المنتج وبه أي عيب مصنعي نادر أو تلف ناتج عن النقل، نرجو التواصل مع كونسيرج خدمة العملاء خلال 24 ساعة من الاستلام مع صورة واضحة للتلف لنقوم باستبدال القطعة فوراً مع التكفل بكامل رسوم الشحن.'
        : 'In the rare circumstance that a parcel arrives with transit damage or a verified manufacturing fault, please notify our client concierge within 24 hours of delivery with photographic evidence for immediate complimentary replacement, fully at our expense.',
    },
  ];

  return (
    <PolicyPage
      title={isAr ? "سياسة الاستبدال والاسترجاع والإلغاء" : "Returns, Exchange & Cancellation Policy"}
      subtitle={
        isAr
          ? "إجراءات واضحة وسلسة تضمن حقوق عملائنا في استبدال واسترجاع مقتنيات الفضة الإسترليني"
          : "Transparent guidelines ensuring customer peace of mind for jewelry exchanges, returns, and order cancellations"
      }
      lastUpdated="16/04/2026"
    >
      <div className="space-y-6">
        {sections.map((sec, i) => (
          <div
            key={i}
            className={`group p-6 sm:p-8 rounded-2xl border transition-all duration-300 ${
              sec.highlight
                ? 'bg-amber-500/[0.03] border-amber-500/20 hover:border-amber-500/40'
                : 'bg-white/[0.02] border-white/5 hover:border-white/15'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0 group-hover:bg-white/10 transition-colors">
                  {sec.icon}
                </div>
                <h2 className="text-base sm:text-lg font-bold text-white tracking-wide">
                  {sec.title}
                </h2>
              </div>
              <span className="text-xs font-mono font-bold text-silver-400/60 sm:text-silver-400/80 px-2.5 py-1 rounded-full bg-white/[0.03] border border-white/5 self-start sm:self-auto">
                {sec.num}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-silver-300/80 leading-relaxed ps-0 sm:ps-14">
              {sec.desc}
            </p>
          </div>
        ))}
      </div>
    </PolicyPage>
  );
};

export default CancellationPolicy;