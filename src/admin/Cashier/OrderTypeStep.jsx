import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, Tag, Wrench, ChevronLeft } from 'lucide-react';

const OrderTypeStep = ({ onSelect }) => {
  const types = [
    { 
      id: 'buy', 
      label: 'عملية بيع للعميل', 
      icon: <ShoppingBag className="w-7 h-7 text-silver-100" />, 
      color: 'from-silver-400/20 to-silver-600/10 border-silver-400/30', 
      desc: 'بيع مصوغات فضة 925 أو سبائك لعميل' 
    },
    { 
      id: 'sell', 
      label: 'شراء كسر فضة', 
      icon: <Tag className="w-7 h-7 text-emerald-400" />, 
      color: 'from-emerald-500/20 to-emerald-700/10 border-emerald-500/30', 
      desc: 'شراء كسر فضة أو خردة من العميل' 
    },
    { 
      id: 'repair', 
      label: 'صيانة وتلميع', 
      icon: <Wrench className="w-7 h-7 text-cyan-400" />, 
      color: 'from-cyan-500/20 to-cyan-700/10 border-cyan-500/30', 
      desc: 'إصلاح مقاس، تركيب أحجار، وتلميع إيطالي' 
    }
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="text-center py-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-4xl mx-auto">
        {types.map((item) => (
          <button
            key={item.id}
            onClick={() => onSelect(item.id)}
            className="group relative bg-[#0c0d12]/90 p-7 rounded-2xl shadow-2xl border border-white/10 hover:border-silver-400/50 transition-all duration-300 text-right overflow-hidden backdrop-blur-xl"
          >
            <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${item.color} border flex items-center justify-center mb-5 group-hover:scale-105 transition-transform`}>
              {item.icon}
            </div>
            <h3 className="text-base font-bold text-white mb-1.5">{item.label}</h3>
            <p className="text-silver-400 text-xs leading-relaxed">{item.desc}</p>
            
            <div className="mt-4 flex items-center gap-1 text-[11px] font-bold text-silver-300 opacity-60 group-hover:opacity-100 transition-opacity">
              <span>بدء المعاملة</span>
              <ChevronLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
            </div>
          </button>
        ))}
      </div>
    </motion.div>
  );
};

export default OrderTypeStep;