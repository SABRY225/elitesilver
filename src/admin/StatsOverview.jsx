import React from 'react';
import { 
  FiDollarSign, FiBox, FiTag, FiUsers, 
  FiAlertCircle, FiCheckCircle, FiTruck, FiActivity,
  FiShield, FiStar, FiGrid,
  FiPlusCircle,
  FiXCircle
} from 'react-icons/fi';

function StatsOverview({ stats }) {
  
  const mainCards = [
    { 
      title: "إجمالي المبيعات", 
      value: `${(stats?.data?.totalSales ? stats.data?.totalSales : 0).toLocaleString()}`, 
      icon: <FiDollarSign />, 
      gradient: "from-emerald-500 to-teal-600",
      bgLight: "bg-emerald-50",
      textColor: "text-emerald-600",
      trend: "نمو المبيعات" 
    },
    { 
      title: "إجمالي الطلبات", 
      value: stats.data.ordersCount ? stats.data.ordersCount : 0, 
      icon: <FiBox />, 
      gradient: "from-rose-500 to-orange-600",
      bgLight: "bg-rose-50",
      textColor: "text-rose-600",
      trend: "من المتجر" 
    },
    { 
      title: "إجمالي الطلبات المخصصة", 
      value: stats.data.CustomOrdersCount ? stats.data.CustomOrdersCount : 0, 
      icon: <FiBox />, 
      gradient: "from-blue-500 to-red-700",
      bgLight: "bg-rose-50",
      textColor: "text-rose-600",
      trend: "من المتجر" 
    },
    { 
      title: "عدد المنتجات", 
      value: stats.data.productsCount ? stats.data.productsCount : 0, 
      icon: <FiTag />, 
      gradient: "from-blue-500 to-indigo-600",
      bgLight: "bg-blue-50",
      textColor: "text-blue-600",
      trend: "نشط" 
    },
    { 
      title: "إجمالي العملاء", 
      value: stats.data.clientsCount ? stats.data.clientsCount : 0, 
      icon: <FiUsers />, 
      gradient: "from-amber-500 to-yellow-600",
      bgLight: "bg-amber-50",
      textColor: "text-amber-600",
      trend: "قاعدة بيانات" 
    },
    { 
      title: "المشرفين", 
      value: stats.data.adminsCount ? stats.data.adminsCount : 0, 
      icon: <FiShield />, 
      gradient: "from-slate-700 to-slate-900",
      bgLight: "bg-slate-100",
      textColor: "text-slate-600",
      trend: "فريق العمل" 
    },
    { 
      title: "التقييمات", 
      value: stats.data.reviewsCount ? stats.data.reviewsCount : 0, 
      icon: <FiStar />, 
      gradient: "from-purple-500 to-violet-600",
      bgLight: "bg-purple-50",
      textColor: "text-purple-600",
      trend: "آراء العملاء" 
    },
    { 
      title: "التصنيفات", 
      value: stats.data.categoriesCount ? stats.data.categoriesCount : 0, 
      icon: <FiGrid />, 
      gradient: "from-cyan-500 to-blue-600",
      bgLight: "bg-cyan-50",
      textColor: "text-cyan-600",
      trend: "أقسام المتجر" 
    },
  ];

  return (
    <div className="space-y-10 font-['Tajawal'] text-right animate-slide-up" dir="rtl">
      
      {/* شبكة البطاقات الرئيسية */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {mainCards.map((card, idx) => (
          <div key={idx} className="bg-white p-6 rounded-stats shadow-soft border border-border-light hover:border-brand-primary/20 transition-all group relative overflow-hidden">
            {/* تأثير خلفية خفي عند الحوم */}
            <div className={`absolute -right-4 -top-4 w-24 h-24 rounded-full ${card.bgLight} opacity-0 group-hover:opacity-40 transition-opacity duration-500`}></div>
            
            <div className="flex justify-between items-start mb-6 relative z-10">
              <div className={`bg-gradient-to-br ${card.gradient} w-14 h-14 rounded-inner flex items-center justify-center text-white text-2xl shadow-lg group-hover:scale-110 transition-transform duration-500`}>
                {card.icon}
              </div>
              <span className={`flex items-center gap-1 text-[10px] font-black uppercase tracking-wider ${card.textColor} ${card.bgLight} px-3 py-1.5 rounded-full`}>
                {card.trend}
              </span>
            </div>
            
            <div className="relative z-10">
              <p className="text-slate-400 text-xs font-bold mb-1 tracking-tight">{card.title}</p>
              <h3 className="text-3xl font-black text-slate-800 tracking-tight">
                {card.value}
              </h3>
            </div>
          </div>
        ))}
      </div>

      {/* قسم المتابعة اللحظية */}
<div className="bg-white p-8 rounded-stats shadow-soft border border-border-light relative overflow-hidden">
        <div className="absolute top-0 right-0 w-2 h-full bg-rose-500"></div>

        <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
          <div>
            <h4 className="text-xl font-black text-slate-800 flex items-center gap-3">
              <span className="p-2 bg-rose-50 text-rose-500 rounded-lg"><FiActivity /></span>
              متابعة حركة الطلبات اللحظية
            </h4>
            <p className="text-slate-400 text-xs mt-1 mr-11">توزيع الطلبات الحالية حسب حالتها في النظام</p>
          </div>
          <div className="text-[10px] font-bold text-slate-400 bg-slate-50 border border-slate-100 px-4 py-2 rounded-xl">
            تحديث مباشر
          </div>
        </div>
        
        {/* تم تغيير عدد الأعمدة إلى 5 ليناسب الإضافات الجديدة */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <StatusMiniCard 
            label="طلبات جديدة" 
            value={stats.data.orderStatusDistribution?.new} 
            color="rose" 
            icon={<FiPlusCircle />} 
            description="بانتظار البدء بها"
          />
          <StatusMiniCard 
            label="قيد المعالجة" 
            value={stats.data.orderStatusDistribution?.pending} 
            color="amber" 
            icon={<FiAlertCircle />} 
            description="يتم تجهيزها الآن"
          />
          <StatusMiniCard 
            label="خرجت للشحن" 
            value={stats.data.orderStatusDistribution?.shipping} 
            color="blue" 
            icon={<FiTruck />} 
            description="مع شركات الشحن"
          />
          <StatusMiniCard 
            label="تم التسليم" 
            value={stats.data.orderStatusDistribution?.completed } 
            color="emerald" 
            icon={<FiCheckCircle />} 
            description="عمليات ناجحة"
          />
          <StatusMiniCard 
            label="طلبات ملغاة" 
            value={stats.data.orderStatusDistribution?.cancelled } 
            color="red" 
            icon={<FiXCircle />} 
            description="طلبات لم تكتمل"
          />
        </div>

        {/* تنبيه ذكي */}
        <div className="mt-10 p-5 bg-slate-900 rounded-inner border border-slate-800 flex items-center gap-4 group">
          <div className="relative">
             <div className="absolute inset-0 bg-rose-500 rounded-full blur animate-pulse"></div>
             <FiAlertCircle className="text-white relative z-10 text-xl" />
          </div>
          <div className="flex-1">
            <p className="text-white text-sm font-bold">تنبيه النظام الذكي</p>
            <p className="text-slate-400 text-xs">لديك {stats.orderStatusDistribution?.pending || 0} طلبات معلقة. سرعة الاستجابة ترفع ولاء عملائك بنسبة 40%.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatusMiniCard({ label, value, color, icon, description }) {
  const themes = {
    amber: "from-amber-50 to-orange-50 text-amber-600 border-amber-100",
    blue: "from-blue-50 to-indigo-50 text-blue-600 border-blue-100",
    emerald: "from-emerald-50 to-teal-50 text-emerald-600 border-emerald-100"
  };

  return (
    <div className={`p-6 rounded-inner bg-gradient-to-br ${themes[color]} border transition-all hover:scale-[1.02] duration-300`}>
      <div className="flex items-center gap-4 mb-4">
        <div className="text-2xl">{icon}</div>
        <h5 className="text-sm font-black opacity-80">{label}</h5>
      </div>
      <div className="flex items-baseline gap-2">
        <p className="text-4xl font-black tracking-tight">{value}</p>
        <span className="text-[10px] font-bold opacity-60">طلب</span>
      </div>
      <p className="text-[10px] mt-3 opacity-70 font-medium ">{description}</p>
    </div>
  );
}

export default StatsOverview;