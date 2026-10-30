import React from 'react';
import PolicyPage from "./PolicyPage";
import { useLanguage } from '../contexts/LanguageContext';
import {
  Clock,
  Truck,
  ShieldCheck,
  PackageCheck,
  MapPin,
  Sparkles,
  PhoneCall
} from 'lucide-react';

const ShippingDeliveryPage = () => {
  const { language, isRTL } = useLanguage();
  const isAr = language === 'ar' || isRTL;

  const sections = [
    {
      num: '01',
      icon: <Clock className="w-5 h-5 text-silver-300" />,
      title: isAr ? 'مدة التجهيز والتسليم السريع' : 'Processing Times & Express Delivery',
      desc: isAr
        ? 'يتم تجهيز وفحص القطع الجاهزة فور تأكيد الطلب خلال 24 ساعة. التوصيل داخل العاصمة عمان يستغرق 24 - 48 ساعة كحد أقصى، وخلال 48 - 72 ساعة لجميع محافظات المملكة. أما القطع المفصلة بالاسم (Custom Made) فتحتاج من (5 - 9) أيام عمل إضافية للصياغة اليدوية والتلميع الفاخر.'
        : 'Ready-to-wear pieces are inspected and dispatched within 24 hours of confirmation. Delivery within Amman takes 24 - 48 hours, and 48 - 72 hours across all other Jordanian governorates. Custom-engraved atelier pieces require an additional (5 - 9) working days for meticulous crafting and artisanal polish.',
    },
    {
      num: '02',
      icon: <Truck className="w-5 h-5 text-emerald-400" />,
      title: isAr ? 'رسوم الشحن وتغطية المحافظات' : 'Shipping Tariffs & Nationwide Coverage',
      desc: isAr
        ? 'نغطي كافة المحافظات الأردنية من إربد شمالاً وحتى العقبة جنوباً بأسعار شحن رمزية وثابتة تظهر تلقائياً في صفحة إتمام الطلب (ديناران داخل عمان، وثلاثة دنانير للمحافظات). كما نوفر خدمة الشحن المجاني التلقائي للطلبات المميزة التي تتجاوز قيمتها 50 ديناراً.'
        : 'We deliver door-to-door across all Jordanian governorates with transparent flat rates calculated at checkout (2 JOD in Amman, 3 JOD for all other governorates). Complimentary shipping is automatically granted on qualifying luxury purchases exceeding 50 JOD.',
    },
    {
      num: '03',
      icon: <ShieldCheck className="w-5 h-5 text-silver-300" />,
      title: isAr ? 'التغليف المخملي الفاخر والتأمين الشامل' : 'Velvet Gift Packaging & Transit Insurance',
      desc: isAr
        ? 'تصلكم كل قطعة مجوهرات مغلفة في علبة إيليت المخملية الملكية مع كيس الإهداء الفاخر وشهادة الضمان الرسمية وبطاقة العناية بالفضة. كافة شحناتنا مؤمنة بالكامل بنسبة 100% ضد الفقد أو الضرر أثناء التوصيل لراحة بالكم التامة.'
        : 'Every creation arrives nestled in our signature royal velvet jewelry case, accompanied by a luxury gift bag, official hallmark warranty certificate, and polishing cloth. All parcels are 100% comprehensively insured against transit damage or loss for complete peace of mind.',
    },
    {
      num: '04',
      icon: <PackageCheck className="w-5 h-5 text-silver-300" />,
      title: isAr ? 'تتبع الشحنة والتنسيق المسبق' : 'Order Tracking & Courier Coordination',
      desc: isAr
        ? 'بمجرد استلام مندوب الشحن لطلبكم، ستصلكم رسالة نصية وواتساب تفيد بخروج الشحنة. يقوم مندوب التوصيل بالاتصال بكم مسبقاً لتحديد موعد التسليم الأنسب لكم بدقة واحترافية.'
        : 'Upon dispatch with our courier partner, you will receive an instant notification update. The dedicated courier will contact you directly via phone prior to arrival to coordinate your preferred delivery window.',
    },
    {
      num: '05',
      icon: <MapPin className="w-5 h-5 text-amber-300" />,
      title: isAr ? 'فحص الشحنة عند الاستلام' : 'Inspection on Handover',
      desc: isAr
        ? 'يحق للعميل التأكد من سلامة الطرد الخارجي والتغليف عند استلامه من مندوب التوصيل قبل السداد في حالة الدفع عند الاستلام (COD)، لضمان استلام مقتنياتكم في أبهى حلة.'
        : 'Patrons opting for Cash on Delivery (COD) are welcome to inspect outer tamper-proof packaging upon delivery before handing payment to our courier representative, ensuring total fulfillment satisfaction.',
    },
  ];

  return (
    <PolicyPage
      title={isAr ? "الشحن والتوصيل الفاخر" : "Shipping & White-Glove Delivery"}
      subtitle={
        isAr
          ? "توصيل آمن وسريع لقطع الفضة الإسترليني 925 لجميع مناطق المملكة مع التغليف المخملي الفاخر"
          : "Insured express courier delivery for authentic 925 silver jewelry to your doorstep across Jordan in luxury gift cases"
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

export default ShippingDeliveryPage;