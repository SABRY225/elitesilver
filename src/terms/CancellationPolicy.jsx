import React from 'react';
import PolicyPage from "./PolicyPage";
import { useLanguage } from '../contexts/LanguageContext';

const CancellationPolicy = () => {
  const { language } = useLanguage();
  const isAr = language === 'ar';

  return (
    <PolicyPage 
      title={isAr ? "سياسة الاستبدال والاسترجاع" : "Returns & Cancellation Policy"} 
      lastUpdated="16/04/2026"
    >
      <div dir={isAr ? 'rtl' : 'ltr'} className={isAr ? 'font-sans text-right' : 'font-serif text-left'}>
        
        {/* 1. General Return Conditions */}
        <section className="mb-10">
          <h3 className={`text-xl font-bold text-slate-800 mb-4 border-silver-600 pr-3 pl-3 ${isAr ? 'border-r-4' : 'border-l-4'}`}>
            {isAr ? "1. شروط الاسترجاع العامة" : "1. General Return Policy"}
          </h3>
          <p className="text-slate-600 leading-relaxed">
            {isAr 
              ? `يمكنكم طلب استبدال أو استرجاع المنتجات الجاهزة خلال (3) أيام من تاريخ الاستلام، بشرط أن تكون القطعة في حالتها الأصلية، غير مستخدمة، وداخل علبة elitesilver925 الأصلية مع كامل ملحقاتها.` 
              : `Ready-made products can be exchanged or returned within (3) days of delivery, provided the item is in its original condition, unworn, and in the original elitesilver925 packaging.`
            }
          </p>
        </section>

        {/* 2. Non-Returnable Items (Custom & Bullion) */}
        <section className="mb-10 bg-slate-50 p-6 rounded-lg border border-slate-100">
          <h3 className={`text-xl font-bold text-red-800 mb-4 border-red-600 pr-3 pl-3 ${isAr ? 'border-r-4' : 'border-l-4'}`}>
            {isAr ? "2. حالات لا يقبل فيها الاسترجاع" : "2. Non-Returnable Items"}
          </h3>
          <ul className="list-disc list-inside text-slate-600 space-y-2 leading-relaxed">
            {isAr ? (
              <>
                <li>القطع المصنعة "حسب الطلب" أو التي تم تعديل مقاسها خصيصاً للعميل.</li>
                <li>سبائك الفضة، نظراً لارتباط سعرها بالأسعار العالمية اللحظية.</li>
                <li>القطع التي تعرضت لسوء الاستخدام أو التلف بسبب العطور والمواد الكيميائية.</li>
              </>
            ) : (
              <>
                <li>Custom-made pieces or items resized specifically for the customer.</li>
                <li>Silver Bullion, due to its link to real-time global market prices.</li>
                <li>Items damaged due to misuse, such as exposure to perfumes or chemicals.</li>
              </>
            )}
          </ul>
        </section>

        {/* 3. Cancellation Policy */}
        <section className="mb-10">
          <h3 className={`text-xl font-bold text-slate-800 mb-4 border-silver-600 pr-3 pl-3 ${isAr ? 'border-r-4' : 'border-l-4'}`}>
            {isAr ? "3. سياسة إلغاء الطلب" : "3. Order Cancellation"}
          </h3>
          <p className="text-slate-600 leading-relaxed">
            {isAr 
              ? `يمكن إلغاء الطلب قبل خروجه للشحن دون أي رسوم. في حال كان الطلب "حسب الطلب"، لا يمكن الإلغاء بعد مرور 24 ساعة على تأكيد الطلب والبدء في التصنيع.` 
              : `Orders can be cancelled free of charge before they are shipped. For "Custom Made" orders, cancellation is not possible 24 hours after order confirmation and production start.`
            }
          </p>
        </section>

        {/* 4. Refund Process */}
        <section className="mb-10">
          <h3 className={`text-xl font-bold text-slate-800 mb-4 border-silver-600 pr-3 pl-3 ${isAr ? 'border-r-4' : 'border-l-4'}`}>
            {isAr ? "4. آلية استرداد الأموال" : "4. Refund Process"}
          </h3>
          <p className="text-slate-600 leading-relaxed">
            {isAr 
              ? `عند قبول طلب الاسترجاع، يتم إعادة المبلغ إلى نفس الوسيلة المستخدمة في الدفع خلال (7-14) يوم عمل. يرجى ملاحظة أن رسوم الشحن الأصلية غير قابلة للاسترداد.` 
              : `Upon approval of your return, refunds are processed to the original payment method within (7-14) business days. Please note that original shipping fees are non-refundable.`
            }
          </p>
        </section>

      </div>
    </PolicyPage>
  );
};

export default CancellationPolicy;