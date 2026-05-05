import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { FiSearch, FiEye, FiCalendar, FiFilter } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { BackButton } from '../../components/BackButton';
import { useLanguage } from '../../contexts/LanguageContext';

const CashierHistory = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const { t } = useLanguage();
  // حالات الفلترة
  const [filters, setFilters] = useState({
    date: new Date().toISOString().split('T')[0], // التاريخ الافتراضي اليوم
    type: 'all'
  });

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const API_URL = import.meta.env.VITE_API_URL;
      const { data } = await axios.get(`${API_URL}/orders/filter`, {
        params: filters,
        headers: { "Authorization": "Bearer " + localStorage.getItem("token") }
      });
      setOrders(data);
    } catch (error) {
      toast.error("خطأ في جلب البيانات");
    } finally {
      setLoading(false);
    }
  };

  // جلب البيانات عند تغيير الفلاتر
  useEffect(() => {
    fetchOrders();
  }, [filters]);

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 font-arabic" dir="rtl">
      <div className="mx-auto">
        <BackButton />
        {/* العناوين والتحكم */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <h1 className="text-2xl font-black text-gray-800">سجل عمليات الكاشير</h1>
          
          <div className="flex flex-wrap items-center gap-3">
            {/* اختيار التاريخ */}
            <div className="relative">
              <FiCalendar className="absolute right-3 top-3 text-gray-400" />
              <input 
                type="date" 
                value={filters.date}
                onChange={(e) => setFilters({...filters, date: e.target.value})}
                className="pr-10 pl-4 py-2 rounded-xl border-none shadow-sm focus:ring-2 focus:ring-black text-sm"
              />
            </div>

            {/* اختيار النوع */}
            <div className="relative">
              <FiFilter className="absolute right-3 top-3 text-gray-400" />
              <select 
                value={filters.type}
                onChange={(e) => setFilters({...filters, type: e.target.value})}
                className="pr-10 pl-8 py-2 rounded-xl border-none shadow-sm focus:ring-2 focus:ring-black text-sm appearance-none bg-white"
              >
                <option value="all">كل الأنواع</option>
                <option value="buy">بيع (لعميل)</option>
                <option value="sell">شراء (من عميل)</option>
                <option value="repair">صيانة</option>
              </select>
            </div>
          </div>
        </div>

        {/* جدول النتائج */}
        <div className="bg-white rounded-[2rem] shadow-xl shadow-gray-200/50 overflow-hidden border border-gray-100">
          <table className="w-full text-right border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-xs uppercase font-bold">
                <th className="px-6 py-4">رقم الطلب</th>
                <th className="px-6 py-4">العميل</th>
                <th className="px-6 py-4">النوع</th>
                <th className="px-6 py-4">المبلغ الإجمالي</th>
                <th className="px-6 py-4">الحالة</th>
                <th className="px-6 py-4">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr><td colSpan="6" className="text-center py-20 text-gray-400">جاري التحميل...</td></tr>
              ) : orders.length === 0 ? (
                <tr><td colSpan="6" className="text-center py-20 text-gray-400">لا توجد نتائج لهذا التاريخ</td></tr>
              ) : (
                orders.map((order) => (
                  <motion.tr 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    key={order.id} 
                    className="hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="px-6 py-4 text-xs font-bold text-gray-400">#{order.id}</td>
                    <td className="px-6 py-4 font-bold text-gray-700">{order.user?.name || 'عميل نقدي'}</td>
                    <td className="px-6 py-4">
                      <span className={`text-[10px] px-3 py-1 rounded-full font-black ${
                        order.orderType === 'buy' ? 'bg-blue-50 text-blue-600' :
                        order.orderType === 'sell' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                      }`}>
                        {order.orderType === 'buy' ? 'بيع لعميل' : order.orderType === 'sell' ? 'شراء من عميل' : 'صيانة'}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-black text-gray-900">{order.totalAmount} دينار أردني</td>
                    <td className="px-6 py-4 text-xs text-green-500 font-bold">{t(order.status)}</td>
                    <td className="px-6 py-4">
                      <button 
                        onClick={() => navigate(`/admin/cashier-system/orders/${order.id}`)}
                        className="p-2 bg-gray-100 hover:bg-black hover:text-white rounded-lg transition-all"
                      >
                        <FiEye size={16} />
                      </button>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CashierHistory;