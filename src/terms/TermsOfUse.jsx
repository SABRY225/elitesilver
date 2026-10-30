import React from 'react';
import PolicyPage from "./PolicyPage";
import { useLanguage } from '../contexts/LanguageContext';
import {
  Scale,
  Gem,
  Coins,
  ShieldCheck,
  Copyright,
  FileCheck2,
  Sparkles
} from 'lucide-react';

const TermsOfUse = () => {
  const { language, isRTL } = useLanguage();
  const isAr = language === 'ar' || isRTL;

  const sections = [
    {
      num: '01',
      icon: <Scale className="w-5 h-5 text-silver-300" />,
      title: isAr ? 'القبول والالتزام بالشروط' : 'Acceptance of Terms',
      desc: isAr
        ? 'بمجرد تصفحكم أو استخدامكم لمنصة إيليت سيلفر 925 (elitesilver925)، فإنكم تقرون بموافقتكم الكاملة وغير المشروطة على جميع الشروط والأحكام الموضحة هنا. نحتفظ بحق تعديل أو تحديث هذه الشروط في أي وقت لمواكبة التحديثات التشغيلية والتنظيمية.'
        : 'By accessing and utilizing the Elite Silver 925 platform, you acknowledge and agree to be bound unconditionally by these terms and conditions. We reserve the right to revise or update these terms at any time to reflect operational or regulatory adjustments.',
    },
    {
      num: '02',
      icon: <Gem className="w-5 h-5 text-silver-300" />,
      title: isAr ? 'ضمان عيار الفضة الإسترليني 925' : '925 Sterling Silver Hallmark Guarantee',
      desc: isAr
        ? 'نضمن رسمياً أن جميع قطع المجوهرات المعروضة مصوغة من الفضة الإسترلينية الإيطالية الخالصة عيار 925 ومدموغة بالختم الرسمي المعتمد. نظراً للطبيعة اليدوية الفريدة لبعض قطعنا الحرفية، قد يطرأ اختلاف طفيف وغير ملموس في الوزن أو التفاصيل الدقيقة مما يمنح كل قطعة تميزها الخاص.'
        : 'We officially certify that all jewelry pieces displayed are forged from genuine 925 Italian Sterling Silver bearing authentic hallmarking. Due to the artisanal handcrafted nature of bespoke creations, slight natural nuances in weight and detail may occur, enhancing the individuality of each piece.',
    },
    {
      num: '03',
      icon: <Coins className="w-5 h-5 text-amber-300" />,
      title: isAr ? 'الطلبات المفصلة والسبائك الاستثمارية' : 'Bespoke Atelier & Bullion Reserves',
      desc: isAr
        ? 'القطع المفصلة بالاسم أو الصور (Custom Made) تصاغ حصرياً وتدخل خط الإنتاج اليدوي، ولا يمكن إلغاؤها بعد 24 ساعة من تأكيد الطلب. كما تخضع أسعار سبائك الفضة الخالصة Ag 999.0 للأسعار اللحظية لبورصة المعادن الثمينة العالمية ويتم تثبيت السعر وقت تأكيد الطلب مباشرة.'
        : 'Custom bespoke jewelry handcrafted to order enters artisanal production immediately and cannot be cancelled or modified 24 hours after confirmation. Investment silver bullion (Ag 999.0) pricing is indexed directly to real-time international precious metal markets and locked upon order placement.',
    },
    {
      num: '04',
      icon: <ShieldCheck className="w-5 h-5 text-silver-300" />,
      title: isAr ? 'العناية بالمجوهرات والأكسدة الطبيعية' : 'Jewelry Care & Natural Tarnish',
      desc: isAr
        ? 'الفضة الإسترليني عيار 925 معدن نفيس قد يتفاعل طبيعياً مع الهواء أو الرطوبة والأحماض. نوصي بتجنب تعريض القطع المباشر للعطور والمواد الكيميائية وحفظها في علبة إيليت المخملية. الأكسدة السطحية ظاهرة طبيعية للفضة الأصيلة ولا تعد عيباً مصنعياً ويمكن تنظيفها بسهولة بقطعة القماش المرفقة.'
        : 'Sterling silver 925 is a precious noble metal that naturally oxidizes over time when exposed to humidity or chemicals. We recommend avoiding direct contact with perfumes and storing pieces in our signature velvet case. Surface tarnishing is a natural characteristic of genuine silver, not a manufacturing defect, and can easily be restored using the provided polishing cloth.',
    },
    {
      num: '05',
      icon: <Copyright className="w-5 h-5 text-silver-300" />,
      title: isAr ? 'الملكية الفكرية وحقوق العلامة' : 'Intellectual Property & Brand Rights',
      desc: isAr
        ? 'جميع الصور، التصاميم، الشعارات، والمحتويات المعروضة على الموقع هي ملكية حصرية وحقوق محمية لعلامة Elite Silver 925. يُحظر تماماً أي نسخ، اقتباس، أو استخدام تجاري لأي عنصر دون تصريح خطي مسبق ومعتمد.'
        : 'All photography, unique jewelry sketches, logos, and digital assets featured across our portal are the exclusive intellectual property of Elite Silver 925. Reproduction, distribution, or commercial exploitation without prior written authorization is strictly prohibited.',
    },
    {
      num: '06',
      icon: <FileCheck2 className="w-5 h-5 text-silver-300" />,
      title: isAr ? 'القانون الواجب التطبيق والاختصاص' : 'Governing Law & Jurisdiction',
      desc: isAr
        ? 'تخضع هذه الشروط والأحكام وتفسر وفقاً للقوانين والأنظمة المعمول بها في المملكة الأردنية الهاشمية، وتختص المحاكم النظامية في عمان بالفصل في أي نزاع قد ينشأ بخصوص استخدام الموقع أو المشتريات.'
        : 'These terms are governed and construed in accordance with the laws of the Hashemite Kingdom of Jordan. Competent courts in Amman hold exclusive jurisdiction over any disputes arising in connection with orders or platform usage.',
    },
  ];

  return (
    <PolicyPage
      title={isAr ? "شروط وأحكام الاستخدام" : "Terms & Conditions of Use"}
      subtitle={
        isAr
          ? "القواعد والمعايير الرسمية المنظمة لتجربة التسوق واقتناء المجوهرات لدى إيليت سيلفر 925"
          : "The official terms governing bespoke acquisitions, certified hallmarks, and client privileges at Elite Silver 925"
      }
      lastUpdated="16/04/2026"
    >
      <div className="space-y-6">
        {sections.map((sec, i) => (
          <div
            key={i}
            className="group p-6 sm:p-8 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/15 transition-all duration-300"
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

export default TermsOfUse;