import React from 'react';
import PolicyPage from "./PolicyPage";
import { useLanguage } from '../contexts/LanguageContext';
import {
  Lock,
  ShieldCheck,
  CreditCard,
  EyeOff,
  Cookie,
  UserCheck,
  FileText
} from 'lucide-react';

const PrivacyPolicy = () => {
  const { language, isRTL } = useLanguage();
  const isAr = language === 'ar' || isRTL;

  const sections = [
    {
      num: '01',
      icon: <FileText className="w-5 h-5 text-silver-300" />,
      title: isAr ? 'جمع ومعالجة المعلومات الضرورية' : 'Information Collection & Processing',
      desc: isAr
        ? 'في إيليت سيلفر 925، نجمع فقط البيانات الأساسية اللازمة لإتمام طلباتكم وتوصيل قطع المجوهرات بدقة (الاسم، العنوان المفصل، رقم الهاتف، والبريد الإلكتروني). نستخدم هذه البيانات حصرياً لخدمتكم والتواصل بشأن حالة شحنتكم وتوثيق شهادات الضمان.'
        : 'At Elite Silver 925, we collect only essential information required to fulfill orders and ensure accurate delivery (Full Name, Shipping Address, Phone Number, and Email). This information is utilized solely to manage fulfillment, provide order updates, and issue certified authenticity records.',
    },
    {
      num: '02',
      icon: <Lock className="w-5 h-5 text-emerald-400" />,
      title: isAr ? 'تشفير وأمان البيانات (SSL 256-bit)' : 'Bank-Grade Data Encryption (SSL 256-bit)',
      desc: isAr
        ? 'نطبق أعلى بروتوكولات الحماية الإلكترونية والتشفير المعتمدة عالمياً لحماية كافة جلسات التصفح والبيانات الشخصية من أي وصول غير مصرح به. خوادمنا مؤمنة بأنظمة جدران حماية متطورة لمنع أي اختراق أو تسريب.'
        : 'We enforce stringent industry-standard encryption protocols (256-bit SSL) to safeguard all platform interactions and client data against unauthorized access. Our infrastructure is fortified with enterprise firewalls to ensure maximum confidentiality.',
    },
    {
      num: '03',
      icon: <EyeOff className="w-5 h-5 text-silver-300" />,
      title: isAr ? 'حظر مشاركة أو بيع البيانات لأي طرف ثالث' : 'Strict Zero-Data-Selling Policy',
      desc: isAr
        ? 'نلتزم التزاماً مطلقاً بعدم بيع، تأجير، أو مشاركة بيانات عملائنا الشخصية مع أي شركات تسويقية أو أطراف خارجية على الإطلاق. لا تتم مشاركة تفاصيل العنوان والهاتف إلا مع شركة التوصيل المعتمدة لإيصال طلبكم فقط.'
        : 'We maintain an absolute zero-tolerance policy against selling, renting, or sharing personal client records with external marketing vendors or third parties. Delivery contact details are solely shared with authorized courier personnel strictly for package handover.',
    },
    {
      num: '04',
      icon: <CreditCard className="w-5 h-5 text-silver-300" />,
      title: isAr ? 'أمن المدفوعات وبوابات الدفع المعتمدة' : 'PCI-Compliant Payment Security',
      desc: isAr
        ? 'تتم معالجة كافة المعاملات المالية عبر بوابات دفع إلكترونية معتمدة ومتوافقة مع المعايير المصرفية العالمية (PCI-DSS). نحن لا نقوم بتخزين أي أرقام لبطاقاتكم الائتمانية أو رموز الأمان (CVV) على خوادمنا نهائياً.'
        : 'All online financial transactions are executed through fully licensed, bank-grade payment gateways compliant with PCI-DSS standards. Elite Silver 925 does not retain or store sensitive credit card numbers or security CVV codes on our servers.',
    },
    {
      num: '05',
      icon: <Cookie className="w-5 h-5 text-amber-300" />,
      title: isAr ? 'ملفات تعريف الارتباط (Cookies)' : 'Cookies & Preference Management',
      desc: isAr
        ? 'نستخدم ملفات تعريف الارتباط المحدودة لتحسين تجربة التسوق وحفظ محتويات سلة المشتريات وقائمة الرغبات وتفضيلات اللغة المختارة. يمكنك إدارة أو تعطيل ملفات الكوكيز في أي وقت عبر إعدادات متصفحك.'
        : 'We utilize lightweight session cookies exclusively to enhance user journeys, preserving shopping bag items, wishlist selections, and language preferences. You may adjust or disable cookies at any time via your personal browser settings.',
    },
    {
      num: '06',
      icon: <UserCheck className="w-5 h-5 text-silver-300" />,
      title: isAr ? 'حقوق العميل والتحكم بالبيانات' : 'Client Rights & Data Erasure',
      desc: isAr
        ? 'يحق لكل عميل طلب الاطلاع على بياناته المسجلة أو تعديلها أو طلب حذف حسابه وسجلاته بالكامل في أي وقت عبر التواصل مع خدمة العملاء أو من خلال لوحة التحكم الخاصة به.'
        : 'Every registered patron reserves the right to review, update, or request the permanent deletion of their profile records from our databases at any time by reaching out to our concierge support team.',
    },
  ];

  return (
    <PolicyPage
      title={isAr ? "سياسة الخصوصية وأمان البيانات" : "Privacy & Data Security Policy"}
      subtitle={
        isAr
          ? "التزامنا الراسخ بحماية خصوصية عملائنا وتأمين بياناتهم وفق أعلى المعايير المصرفية والرقمية"
          : "Our steadfast commitment to protecting client privacy and safeguarding sensitive information to world-class standards"
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

export default PrivacyPolicy;