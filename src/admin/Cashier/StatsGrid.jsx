import React from 'react';
import { FiArrowRight, FiShoppingBag, FiTag, FiTool, FiUsers } from 'react-icons/fi';
import { BackButton } from '../../components/BackButton';
import { useNavigate } from 'react-router-dom';

const StatsGrid = ({ stats }) => {
    const navigate = useNavigate();

  const items = [
    { label: 'عمليات الشراء اليوم', value: stats.buyCount, icon: <FiShoppingBag />, color: 'bg-blue-500' },
    { label: 'عمليات البيع اليوم', value: stats.sellCount, icon: <FiTag />, color: 'bg-emerald-500' },
    { label: 'طلبات الصيانة اليوم', value: stats.repairCount, icon: <FiTool />, color: 'bg-amber-500' },
    { label: 'عملاء جدد اليوم', value: stats.newCustomers, icon: <FiUsers />, color: 'bg-purple-500' },
  ];
   const handelNav =()=>{
    localStorage.setItem("adminActiveTab","clients") 
    navigate('/admin')
   }
  return (
    <>
      <div className='flex justify-between items-center mb-8'>
        <div>
          <h2 className="text-3xl font-black mb-2 text-gray-900 italic">نظام إيليت</h2>
          <p className="text-gray-400 mb-12 uppercase tracking-tighter text-sm">إدارة مبيعات وخدمات المتجر</p>
        </div>
         <button 
              onClick={() => { handelNav()}} // -1 تعني العودة خطوة واحدة للخلف في سجل المتصفح
              className="flex items-center gap-2 text-gray-500 hover:text-black transition-all font-bold text-sm mb-6"
            >
              <FiArrowRight /> 
              <span>الرجوع للخلف</span>
            </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {items.map((stat, i) => (
          <div key={i} className="bg-white p-5 rounded-[2rem] shadow-sm border border-gray-50 flex items-center gap-4">
            <div className={`${stat.color} w-12 h-12 rounded-2xl flex items-center justify-center text-white text-xl shadow-lg shadow-gray-200`}>
              {stat.icon}
            </div>
            <div>
              <p className="text-gray-400 text-[10px] font-bold uppercase tracking-wider">{stat.label}</p>
              <p className="text-xl font-black text-gray-900">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>
    </>

  );
};

export default StatsGrid;