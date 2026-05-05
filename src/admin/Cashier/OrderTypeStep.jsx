import React from 'react';
import { motion } from 'framer-motion';
import { FiShoppingBag, FiTag, FiTool, FiChevronLeft } from 'react-icons/fi';

const OrderTypeStep = ({ onSelect }) => {
  const types = [
    { id: 'buy', label: 'عملية شراء', icon: <FiShoppingBag />, color: 'from-gray-900 to-gray-700', desc: 'بيع قطعة فضة لعميل' },
    { id: 'sell', label: 'عملية بيع', icon: <FiTag />, color: 'from-gray-500 to-gray-300', desc: 'شراء كسر فضة من عميل' },
    { id: 'repair', label: 'قسم الصيانة', icon: <FiTool />, color: 'from-gray-200 to-gray-100', desc: 'تصليح أو تلميع قطع' }
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
        {types.map((item) => (
          <button
            key={item.id}
            onClick={() => onSelect(item.id)}
            className="group relative bg-white p-10 rounded-[3rem] shadow-xl border border-gray-50 hover:border-black transition-all duration-500 text-right overflow-hidden"
          >
            <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center text-white text-2xl mb-6 shadow-lg group-hover:scale-110 transition-transform`}>
              {item.icon}
            </div>
            <h3 className="text-xl font-black mb-2">{item.label}</h3>
            <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
            <div className="absolute bottom-6 left-10 opacity-0 group-hover:opacity-100 transition-all -translate-x-4 group-hover:translate-x-0">
              <FiChevronLeft className="text-2xl" />
            </div>
          </button>
        ))}
      </div>
    </motion.div>
  );
};

export default OrderTypeStep;