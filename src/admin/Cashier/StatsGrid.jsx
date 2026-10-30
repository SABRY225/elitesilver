import React from 'react';
import { ShoppingBag, Tag, Wrench, Users, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const StatsGrid = ({ stats = {} }) => {
  const navigate = useNavigate();

  const items = [
    { label: 'مبيعات البوتيك اليوم', value: stats.buyCount || 0, icon: <ShoppingBag className="w-5 h-5 text-blue-400" />, bg: 'bg-blue-500/10 border-blue-500/20' },
    { label: 'شراء كسر فضة اليوم', value: stats.sellCount || 0, icon: <Tag className="w-5 h-5 text-emerald-400" />, bg: 'bg-emerald-500/10 border-emerald-500/20' },
    { label: 'طلبات الصيانة اليوم', value: stats.repairCount || 0, icon: <Wrench className="w-5 h-5 text-amber-400" />, bg: 'bg-amber-500/10 border-amber-500/20' },
    { label: 'عملاء جدد بالفرع', value: stats.newCustomers || 0, icon: <Users className="w-5 h-5 text-purple-400" />, bg: 'bg-purple-500/10 border-purple-500/20' },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 p-5 rounded-2xl bg-[#0c0d12]/90 border border-white/10 backdrop-blur-xl">
        <div>
          <h2 className="text-lg font-bold text-white tracking-wide">نقطة البيع والكاشير المباشر (Boutique POS Terminal)</h2>
          <p className="text-silver-400 text-xs mt-0.5">تسجيل فواتير البيع الفوري، شراء الكسر، وخدمات الصيانة</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {items.map((stat, i) => (
          <div key={i} className="bg-[#0c0d12]/90 p-4 rounded-xl border border-white/10 shadow-lg flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl ${stat.bg} border flex items-center justify-center flex-shrink-0`}>
              {stat.icon}
            </div>
            <div>
              <p className="text-silver-400 text-[10px] font-bold uppercase tracking-wider">{stat.label}</p>
              <p className="text-lg font-mono font-black text-white mt-0.5">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StatsGrid;