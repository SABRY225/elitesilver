import React from 'react';
import PolicyPage from "./PolicyPage";
import { useLanguage } from '../contexts/LanguageContext';

const TermsOfUse = () => {
  const { t, language } = useLanguage();
  const isAr = language === 'ar';

  return (
    <PolicyPage 
      title={isAr ? "شروط الاستخدام" : "Terms of Use"} 
      lastUpdated="16/04/2026"
    >
      <div dir={isAr ? 'rtl' : 'ltr'} className={isAr ? 'font-sans' : 'font-serif'}>
        
        {/* 1. Acceptance */}
        <section className="mb-10">
          <h3 className={`text-xl font-bold text-slate-800 mb-4 border-silver-600 pr-3 pl-3 ${isAr ? 'border-r-4' : 'border-l-4 text-left'}`}>
            {isAr ? "1. القبول والالتزام" : "1. Acceptance of Terms"}
          </h3>
          <p className="text-slate-600 leading-relaxed">
            {isAr 
              ? `بمجرد دخولكم واستخدامكم لموقع elitesilver925، فإنكم تقرون بالموافقة على كافة الشروط والأحكام. نحن نحتفظ بالحق في تحديث هذه الشروط بما يتماشى مع تطور خدماتنا.` 
              : `By accessing and using elitesilver925, you agree to be bound by these terms and conditions. We reserve the right to update these terms to reflect changes in our services.`
            }
          </p>
        </section>

        {/* 2. Quality & Hallmarks */}
        <section className="mb-10">
          <h3 className={`text-xl font-bold text-slate-800 mb-4 border-silver-600 pr-3 pl-3 ${isAr ? 'border-r-4' : 'border-l-4  text-left'}`}>
            {isAr ? "2. ضمان الجودة والعيارات" : "2. Quality & Hallmarks"}
          </h3>
          <p className="text-slate-600 leading-relaxed">
            {isAr 
              ? `نضمن أن جميع قطعنا مصنوعة من الفضة الإسترلينية عيار 925. قد يوجد تفاوت طفيف في الأوزان أو الأبعاد بسبب الطبيعة اليدوية لبعض التصاميم.` 
              : `We guarantee that all our pieces are crafted from authentic 925 Sterling Silver. Slight variations in weight or dimensions may occur due to the handcrafted nature of certain designs.`
            }
          </p>
        </section>

        {/* 3. Custom Orders & Bullion */}
        <section className="mb-10">
          <h3 className={`text-xl font-bold text-slate-800 mb-4 border-silver-600 pr-3 pl-3 ${isAr ? 'border-r-4' : 'border-l-4  text-left'}`}>
            {isAr ? "3. الطلبات الخاصة والسبائك" : "3. Custom Orders & Bullion"}
          </h3>
          <p className="text-slate-600 leading-relaxed">
            {isAr 
              ? `الطلبات "حسب الطلب" لا تخضع للاستبدال بمجرد التنفيذ. أما السبائك، فتخضع أسعارها للتحديث اللحظي بناءً على البورصة العالمية.` 
              : `Custom-made orders are non-refundable once production starts. Bullion prices are subject to real-time market updates based on the global silver exchange.`
            }
          </p>
        </section>

        {/* 4. Product Care */}
        <section className="mb-10">
          <h3 className={`text-xl font-bold text-slate-800 mb-4 border-silver-600 pr-3 pl-3 ${isAr ? 'border-r-4' : 'border-l-4  text-left'}`}>
            {isAr ? "4. العناية بالمقتنيات" : "4. Jewelry Care"}
          </h3>
          <p className="text-slate-600 leading-relaxed">
            {isAr 
              ? `المتجر غير مسؤول عن أكسدة الفضة الناتجة عن سوء الاستخدام (مثل التعرض للعطور). الأكسدة عملية طبيعية يمكن معالجتها بالتنظيف.` 
              : `The store is not responsible for silver oxidation caused by misuse (e.g., exposure to perfumes). Oxidation is a natural process that can be reversed by proper cleaning.`
            }
          </p>
        </section>

        {/* 5. Intellectual Property */}
        <section className="mb-10">
          <h3 className={`text-xl font-bold text-slate-800 mb-4 border-silver-600 pr-3 pl-3 ${isAr ? 'border-r-4' : 'border-l-4  text-left'}`}>
            {isAr ? "5. حقوق الملكية" : "5. Intellectual Property"}
          </h3>
          <p className="text-slate-600 leading-relaxed">
            {isAr 
              ? `جميع الصور والتصاميم هي ملكية حصري لـ elitesilver925. يُمنع النسخ أو الاستخدام التجاري دون إذن خطي.` 
              : `All images and designs are the exclusive property of elitesilver925. Copying or commercial use is strictly prohibited without written consent.`
            }
          </p>
        </section>

      </div>
    </PolicyPage>
  );
};

export default TermsOfUse;