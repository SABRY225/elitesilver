import React from 'react';
import { 
  DollarSign,
  ShoppingBag,
  Package,
  Layers,
  Users,
  ShieldCheck,
  Star,
  Activity,
  Truck,
  CheckCircle2,
  Clock,
  XCircle,
  AlertCircle,
  Sparkles
} from 'lucide-react';
import { useOutletContext } from 'react-router-dom';

function StatsOverview({ stats: propsStats }) {
  let outletContext = {};
  try {
    outletContext = useOutletContext() || {};
  } catch (e) {
    outletContext = {};
  }

  const rawStats = propsStats || outletContext.stats;
  const data = rawStats?.data || rawStats || {};

  const mainCards = [
    { 
      title: "إجمالي المبيعات المحققة", 
      value: `${(data?.totalSales ? data.totalSales : 0).toLocaleString()} د.أ`, 
      icon: <DollarSign className="w-6 h-6 text-emerald-600" />, 
      iconBg: "bg-emerald-50 border-emerald-200",
      badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
      trend: "إيرادات نقدية" 
    },
    { 
      title: "إجمالي طلبات المتجر", 
      value: data.ordersCount || 0, 
      icon: <ShoppingBag className="w-6 h-6 text-indigo-600" />, 
      iconBg: "bg-indigo-50 border-indigo-200",
      badgeColor: "bg-indigo-50 text-indigo-700 border-indigo-200",
      trend: "مبيعات المصوغات" 
    },
    { 
      title: "طلبات التفصيل المخصص", 
      value: data.CustomOrdersCount || 0, 
      icon: <Sparkles className="w-6 h-6 text-amber-600" />, 
      iconBg: "bg-amber-50 border-amber-200",
      badgeColor: "bg-amber-50 text-amber-700 border-amber-200",
      trend: "مشغل الصياغة" 
    },
    { 
      title: "كتالوج المنتجات المعروضة", 
      value: data.productsCount || 0, 
      icon: <Package className="w-6 h-6 text-sky-600" />, 
      iconBg: "bg-sky-50 border-sky-200",
      badgeColor: "bg-sky-50 text-sky-700 border-sky-200",
      trend: "قطع نشطة" 
    },
    { 
      title: "قاعدة بيانات العملاء", 
      value: data.clientsCount || 0, 
      icon: <Users className="w-6 h-6 text-purple-600" />, 
      iconBg: "bg-purple-50 border-purple-200",
      badgeColor: "bg-purple-50 text-purple-700 border-purple-200",
      trend: "مشترين مسجلين" 
    },
    { 
      title: "فريق الإدارة والمشرفين", 
      value: data.adminsCount || 0, 
      icon: <ShieldCheck className="w-6 h-6 text-slate-700" />, 
      iconBg: "bg-slate-100 border-slate-200",
      badgeColor: "bg-slate-100 text-slate-700 border-slate-200",
      trend: "مشرفين معتمدين" 
    },
    { 
      title: "مراجعات وتقييمات العملاء", 
      value: data.reviewsCount || 0, 
      icon: <Star className="w-6 h-6 text-amber-500 fill-amber-500" />, 
      iconBg: "bg-amber-50 border-amber-200",
      badgeColor: "bg-amber-50 text-amber-700 border-amber-200",
      trend: "آراء موثقة" 
    },
    { 
      title: "الأقسام والمجموعات", 
      value: data.categoriesCount || 0, 
      icon: <Layers className="w-6 h-6 text-teal-600" />, 
      iconBg: "bg-teal-50 border-teal-200",
      badgeColor: "bg-teal-50 text-teal-700 border-teal-200",
      trend: "مجموعات رئيسية" 
    },
  ];

  const statusDistribution = data.orderStatusDistribution || {};

  return (
    <div className="space-y-8 font-cairo text-right" dir="rtl">
      
      {/* شبكة البطاقات الرئيسية */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {mainCards.map((card, idx) => (
          <div 
            key={idx} 
            className="bg-white border border-slate-200 hover:border-slate-300 rounded-3xl p-6 transition-all duration-300 shadow-sm hover:shadow-md relative overflow-hidden group"
          >
            <div className="flex justify-between items-start mb-5 relative z-10">
              <div className={`w-13 h-13 rounded-2xl border flex items-center justify-center p-3 shadow-sm group-hover:scale-105 transition-transform duration-300 ${card.iconBg}`}>
                {card.icon}
              </div>
              <span className={`text-xs font-mono font-bold uppercase tracking-wider px-3 py-1 rounded-full border ${card.badgeColor}`}>
                {card.trend}
              </span>
            </div>
            
            <div className="relative z-10">
              <p className="text-xs font-bold text-slate-500 mb-1 tracking-wide">
                {card.title}
              </p>
              <h3 className="text-3xl sm:text-4xl font-mono font-black tracking-tight text-slate-900">
                {card.value}
              </h3>
            </div>
          </div>
        ))}
      </div>

      {/* قسم المتابعة اللحظية وحالة الطلبات */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm relative overflow-hidden">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 pb-5 border-b border-slate-100">
          <div>
            <h4 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-3">
              <span className="p-2.5 rounded-xl border bg-emerald-50 border-emerald-200 text-emerald-600">
                <Activity className="w-5 h-5 text-emerald-600" />
              </span>
              <span>متابعة حركة الطلبات اللحظية في النظام</span>
            </h4>
            <p className="text-xs sm:text-sm mt-1.5 text-slate-500 font-semibold mr-11">
              توزيع الطلبات المسجلة في المتجر حسب مراحل التجهيز والشحن والتسليم
            </p>
          </div>
          <div className="inline-flex items-center gap-2 text-xs font-mono text-emerald-700 bg-emerald-50 border border-emerald-200 px-3.5 py-1.5 rounded-full font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>تحديث مباشر متزامن</span>
          </div>
        </div>
        
        {/* توزيع حالات الطلبات الـ 5 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
          <StatusMiniCard 
            label="طلبات جديدة" 
            value={statusDistribution.new || 0} 
            color="rose" 
            icon={<Clock className="w-4 h-4 text-rose-600" />} 
            description="بانتظار البدء والمراجعة"
          />
          <StatusMiniCard 
            label="قيد التجهيز" 
            value={statusDistribution.pending || 0} 
            color="amber" 
            icon={<AlertCircle className="w-4 h-4 text-amber-600" />} 
            description="فحص العيار والتغليف"
          />
          <StatusMiniCard 
            label="خرجت للشحن" 
            value={statusDistribution.shipping || 0} 
            color="blue" 
            icon={<Truck className="w-4 h-4 text-blue-600" />} 
            description="مع مندوب التوصيل"
          />
          <StatusMiniCard 
            label="تم التسليم" 
            value={statusDistribution.completed || 0} 
            color="emerald" 
            icon={<CheckCircle2 className="w-4 h-4 text-emerald-600" />} 
            description="طلبات مكتملة بنجاح"
          />
          <StatusMiniCard 
            label="طلبات ملغاة" 
            value={statusDistribution.cancelled || 0} 
            color="slate" 
            icon={<XCircle className="w-4 h-4 text-slate-500" />} 
            description="إلغاءات مستردة"
          />
        </div>

        {/* تنبيه النظام الذكي */}
        <div className="mt-6 p-4 sm:p-5 rounded-2xl border border-amber-200 bg-amber-50/50 flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-amber-100 border border-amber-200 flex items-center justify-center flex-shrink-0 text-amber-700">
            <Sparkles className="w-5 h-5 text-amber-600" />
          </div>
          <div className="flex-1">
            <p className="font-bold text-sm text-amber-900 mb-0.5">توجيه كفاءة الخدمة</p>
            <p className="text-xs text-amber-800 leading-relaxed font-semibold">
              لديك <strong className="text-amber-950 font-mono text-sm font-black">({statusDistribution.pending || 0})</strong> طلبات قيد التجهيز حالياً. سرعة التأكيد والشحن خلال أول ساعتين تعزز رضا وثقة عملاء النخبة بنسبة تتجاوز 40%.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatusMiniCard({ label, value, color, icon, description }) {
  const colorStyles = {
    rose: {
      card: "border-rose-200 bg-rose-50/50",
      iconBox: "bg-rose-100 border-rose-200",
      label: "text-rose-900",
      value: "text-rose-950",
      desc: "text-rose-700"
    },
    amber: {
      card: "border-amber-200 bg-amber-50/50",
      iconBox: "bg-amber-100 border-amber-200",
      label: "text-amber-900",
      value: "text-amber-950",
      desc: "text-amber-700"
    },
    blue: {
      card: "border-blue-200 bg-blue-50/50",
      iconBox: "bg-blue-100 border-blue-200",
      label: "text-blue-900",
      value: "text-blue-950",
      desc: "text-blue-700"
    },
    emerald: {
      card: "border-emerald-200 bg-emerald-50/50",
      iconBox: "bg-emerald-100 border-emerald-200",
      label: "text-emerald-900",
      value: "text-emerald-950",
      desc: "text-emerald-700"
    },
    slate: {
      card: "border-slate-200 bg-slate-50/70",
      iconBox: "bg-slate-200/80 border-slate-300",
      label: "text-slate-800",
      value: "text-slate-900",
      desc: "text-slate-500"
    },
  };

  const style = colorStyles[color] || colorStyles.blue;

  return (
    <div className={`p-4 sm:p-5 rounded-2xl border ${style.card} transition-all duration-200 shadow-sm`}>
      <div className="flex items-center gap-2.5 mb-2.5">
        <div className={`p-2 rounded-xl border ${style.iconBox}`}>{icon}</div>
        <h5 className={`text-xs sm:text-sm font-bold ${style.label}`}>{label}</h5>
      </div>
      <div className="flex items-baseline gap-1.5">
        <p className={`text-2xl sm:text-3xl font-mono font-black ${style.value}`}>{value}</p>
        <span className="text-[11px] font-mono text-slate-500 font-bold">طلب</span>
      </div>
      <p className={`text-[11px] mt-1.5 leading-tight font-medium ${style.desc}`}>{description}</p>
    </div>
  );
}

export default StatsOverview;