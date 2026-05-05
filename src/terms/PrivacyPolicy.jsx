import React from 'react';
import PolicyPage from "./PolicyPage";
import { useLanguage } from '../contexts/LanguageContext';

const PrivacyPolicy = () => {
  const { language } = useLanguage();
  const isAr = language === 'ar';

  return (
    <PolicyPage 
      title={isAr ? "سياسة الخصوصية" : "Privacy Policy"} 
      lastUpdated="16/04/2026"
    >
      <div dir={isAr ? 'rtl' : 'ltr'} className={isAr ? 'font-sans text-right' : 'font-serif text-left'}>
        
        {/* 1. Data Collection */}
        <section className="mb-10">
          <h3 className={`text-xl font-bold text-slate-800 mb-4 border-silver-600 pr-3 pl-3 ${isAr ? 'border-r-4' : 'border-l-4'}`}>
            {isAr ? "1. جمع المعلومات" : "1. Information Collection"}
          </h3>
          <p className="text-slate-600 leading-relaxed">
            {isAr 
              ? `في elitesilver925، نجمع فقط المعلومات الضرورية لإتمام طلباتكم (الاسم، العنوان، رقم الهاتف، والبريد الإلكتروني). نستخدم هذه البيانات لضمان وصول قطع الفضة الخاصة بكم بأمان وسرعة.` 
              : `At elitesilver925, we only collect essential information to process your orders (Name, Address, Phone Number, and Email). We use this data to ensure your silver pieces reach you safely and promptly.`
            }
          </p>
        </section>

        {/* 2. Data Security */}
        <section className="mb-10">
          <h3 className={`text-xl font-bold text-slate-800 mb-4 border-silver-600 pr-3 pl-3 ${isAr ? 'border-r-4' : 'border-l-4'}`}>
            {isAr ? "2. حماية البيانات" : "2. Data Protection"}
          </h3>
          <p className="text-slate-600 leading-relaxed">
            {isAr 
              ? `نحن نلتزم بتطبيق بروتوكولات أمان متقدمة لحماية بياناتكم من أي وصول غير مصرح به. لا نقوم ببيع أو مشاركة بياناتكم الشخصية مع أي أطراف ثالثة لأغراض تسويقية.` 
              : `We implement advanced security protocols to protect your data from unauthorized access. We do not sell or share your personal information with third parties for marketing purposes.`
            }
          </p>
        </section>

        {/* 3. Secure Payments */}
        <section className="mb-10">
          <h3 className={`text-xl font-bold text-slate-800 mb-4 border-silver-600 pr-3 pl-3 ${isAr ? 'border-r-4' : 'border-l-4'}`}>
            {isAr ? "3. أمن المدفوعات" : "3. Payment Security"}
          </h3>
          <p className="text-slate-600 leading-relaxed">
            {isAr 
              ? `يتم معالجة جميع عمليات الدفع عبر بوابات دفع إلكترونية مشفرة وآمنة تماماً. نحن في elitesilver925 لا نقوم بتخزين بيانات بطاقاتكم الائتمانية على خوادمنا.` 
              : `All payments are processed through encrypted and fully secure payment gateways. At elitesilver925, we do not store your credit card information on our servers.`
            }
          </p>
        </section>

        {/* 4. Cookies */}
        <section className="mb-10">
          <h3 className={`text-xl font-bold text-slate-800 mb-4 border-silver-600 pr-3 pl-3 ${isAr ? 'border-r-4' : 'border-l-4'}`}>
            {isAr ? "4. ملفات تعريف الارتباط" : "4. Cookies Policy"}
          </h3>
          <p className="text-slate-600 leading-relaxed">
            {isAr 
              ? `نستخدم ملفات تعريف الارتباط (Cookies) لتحسين تجربة تسوقكم وتذكر تفضيلاتكم داخل الموقع. يمكنك تعطيل هذه الخاصية من إعدادات متصفحك في أي وقت.` 
              : `We use cookies to enhance your shopping experience and remember your preferences. You can disable this feature through your browser settings at any time.`
            }
          </p>
        </section>

        {/* 5. Contact Us */}
        <section className="mb-10">
          <h3 className={`text-xl font-bold text-slate-800 mb-4 border-silver-600 pr-3 pl-3 ${isAr ? 'border-r-4' : 'border-l-4'}`}>
            {isAr ? "5. التواصل معنا" : "5. Contact Us"}
          </h3>
          <p className="text-slate-600 leading-relaxed">
            {isAr 
              ? `إذا كان لديك أي استفسار حول كيفية تعاملنا مع بياناتك، يمكنك دائماً التواصل معنا عبر البريد الإلكتروني الخاص بالدعم.` 
              : `If you have any questions about how we handle your data, you can always contact our support team via email.`
            }
          </p>
        </section>

      </div>
    </PolicyPage>
  );
};

export default PrivacyPolicy;