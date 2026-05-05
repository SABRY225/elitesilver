import React from 'react';
import PolicyPage from "./PolicyPage";
import { useLanguage } from '../contexts/LanguageContext';
import { FiTruck, FiBox, FiClock, FiShield } from 'react-icons/fi';

const ShippingDeliveryPage = () => {
  const { language } = useLanguage();
  const isAr = language === 'ar';

  return (
    <PolicyPage 
      title={isAr ? "الشحن والتوصيل" : "Shipping & Delivery"} 
      lastUpdated="16/04/2026"
    >
      <div dir={isAr ? 'rtl' : 'ltr'} className={isAr ? 'font-sans text-right' : 'font-serif text-left'}>
        
        {/* مقدمة الشحن */}
        <p className="text-slate-600 mb-10 leading-relaxed italic border-b pb-6 border-slate-100">
          {isAr 
            ? "في elitesilver925، ندرك قيمة مقتنياتكم، لذا نعتمد أعلى معايير التغليف الفاخر والشحن الآمن لضمان وصول قطعكم ببريقها الكامل." 
            : "At elitesilver925, we understand the value of your jewelry. We follow premium packaging and secure shipping standards to ensure your pieces arrive in perfect condition."}
        </p>

        {/* 1. Delivery Timeframes */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <FiClock className="text-silver-600 text-xl" />
            <h3 className={`text-xl font-bold text-slate-800 border-silver-600 pr-3 pl-3 ${isAr ? 'border-r-4' : 'border-l-4'}`}>
              {isAr ? "1. مدة التوصيل" : "1. Delivery Timeframes"}
            </h3>
          </div>
          <p className="text-slate-600 leading-relaxed pr-8 pl-8">
            {isAr 
              ? "يتم تجهيز الطلبات الجاهزة خلال 24 ساعة. التوصيل داخل الدوحة يستغرق (1-2) يوم عمل،. يرجى ملاحظة أن القطع 'حسب الطلب' تحتاج من (7-14) يوماً إضافياً للتصنيع." 
              : "Ready-made orders are processed within 24 hours. while international shipping takes (5-10) business days. Please note that 'Custom Made' pieces require an additional (7-14) days for production."}
          </p>
        </section>

        {/* 2. Shipping Costs */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <FiTruck className="text-silver-600 text-xl" />
            <h3 className={`text-xl font-bold text-slate-800 border-silver-600 pr-3 pl-3 ${isAr ? 'border-r-4' : 'border-l-4'}`}>
              {isAr ? "2. تكاليف الشحن" : "2. Shipping Costs"}
            </h3>
          </div>
          <p className="text-slate-600 leading-relaxed pr-8 pl-8">
            {isAr 
              ? "تظهر رسوم الشحن تلقائياً عند إتمام الدفع بناءً على الموقع الجغرافي. نقدم شحناً مجانياً للطلبات التي تتجاوز قيمة معينة (يتم توضيحها في سلة المشتريات)." 
              : "Shipping fees are calculated at checkout based on location. We offer free shipping on orders above a certain value (as indicated in your cart)."}
          </p>
        </section>

        {/* 3. Secure Packaging */}
        <section className="mb-12 bg-slate-50 p-8 rounded-2xl border border-slate-100">
          <div className="flex items-center gap-3 mb-4">
            <FiShield className="text-silver-600 text-xl" />
            <h3 className={`text-xl font-bold text-slate-800 border-silver-600 pr-3 pl-3 ${isAr ? 'border-r-4' : 'border-l-4'}`}>
              {isAr ? "3. التغليف والضمان" : "3. Packaging & Insurance"}
            </h3>
          </div>
          <p className="text-slate-600 leading-relaxed pr-8 pl-8">
            {isAr 
              ? "كل قطعة من elitesilver925 تأتي مغلفة في صندوقنا الفاخر ومحمية بعناية فائقة. جميع شحناتنا مؤمنة ضد الضياع أو التلف أثناء النقل لضمان حق العميل بالكامل." 
              : "Every piece from elitesilver925 comes in our luxury signature box, carefully protected. All shipments are insured against loss or damage during transit to ensure full customer rights."}
          </p>
        </section>

        {/* 4. Tracking Your Order */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <FiBox className="text-silver-600 text-xl" />
            <h3 className={`text-xl font-bold text-slate-800 border-silver-600 pr-3 pl-3 ${isAr ? 'border-r-4' : 'border-l-4'}`}>
              {isAr ? "4. تتبع الشحنة" : "4. Tracking Your Order"}
            </h3>
          </div>
          <p className="text-slate-600 leading-relaxed pr-8 pl-8">
            {isAr 
              ? "بمجرد خروج طلبكم للشحن، ستصلكم رسالة نصية أو بريد إلكتروني يحتوي على رابط لتتبع مسار الشحنة حتى وصولها لباب منزلكم." 
              : "Once your order is shipped, you will receive a text message or email containing a tracking link to follow your shipment's journey to your doorstep."}
          </p>
        </section>

      </div>
    </PolicyPage>
  );
};

export default ShippingDeliveryPage;