import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { FiArrowRight, FiPrinter, FiUser, FiPackage, FiInfo, FiHash } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { useLanguage } from '../../contexts/LanguageContext';

const OrderDetails = () => {
  const { orderId} = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const { t } = useLanguage();

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL;
        const { data } = await axios.get(`${API_URL}/orders/cashier/details/${orderId}`, {
          headers: { "Authorization": "Bearer " + localStorage.getItem("token") }
        });
        setOrder(data);
      } catch (error) {
        toast.error("تعذر جلب تفاصيل الطلب");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrderDetails();
  }, [orderId]);

  if (loading) return <div className="flex justify-center items-center h-screen font-arabic">جاري التحميل...</div>;
  if (!order) return <div className="text-center mt-20 font-arabic">الطلب غير موجود</div>;

  return (
    <div className="min-h-screen bg-[#FDFDFD] p-4 md:p-8 font-arabic" dir="rtl">
      <div className="max-w-4xl mx-auto">
        
        {/* Header: الرجوع والطباعة */}
        <div className="flex justify-between items-center mb-8">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-500 hover:text-black transition-all font-bold"
          >
            <FiArrowRight /> <span>الرجوع للسجل</span>
          </button>
        
        </div>

        {/* جسم الفاتورة */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[2.5rem] shadow-xl shadow-gray-100/50 border border-gray-100 overflow-hidden print:shadow-none print:border-none"
        >
          {/* رأس الفاتورة - تفاصيل سريعة */}
          <div className="bg-gray-50 p-8 border-b border-gray-100 flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2 text-gray-400 mb-2">
                <FiHash /> <span className="text-xs font-bold uppercase tracking-widest">رقم الفاتورة</span>
              </div>
              <h1 className="text-xl font-black text-gray-900">ORD-{order.id}</h1>
              <p className="text-xs text-gray-400 mt-2 font-bold">
                تاريخ العملية: {new Date(order.createdAt).toLocaleString('ar-EG')}
              </p>
            </div>
            <div className="text-left">
              <span className={`px-4 py-2 rounded-full text-[10px] font-black uppercase ${
                order.orderType === 'buy' ? 'bg-blue-100 text-blue-600' : (order.orderType === 'sell' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600')
              }`}>
                {order.orderType === 'buy' ? 'فاتورة بيع لعميل' : (order.orderType === 'sell' ? 'فاتورة شراء من عميل' : 'طلب صيانة')}
              </span>
            </div>
          </div>

          <div className="p-8 grid md:grid-cols-2 gap-8">
            {/* معلومات العميل */}
            <div className="space-y-4">
              <h3 className="text-gray-400 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                <FiUser /> بيانات العميل
              </h3>
              <div className="bg-gray-50 p-5 rounded-3xl">
                <p className="font-bold text-gray-800">{order.user?.name || 'عميل نقدي'}</p>
                <p className="text-sm text-gray-500 mt-1">{order.user?.phone || '---'}</p>
                <p className="text-xs text-gray-400 mt-1">{order.user?.address || 'بدون عنوان مسجل'}</p>
              </div>
            </div>

            {/* تفاصيل الدفع */}
            <div className="space-y-4">
              <h3 className="text-gray-400 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                <FiInfo /> طريقة الدفع والحالة
              </h3>
              <div className="bg-gray-50 p-5 rounded-3xl">
                <p className="font-bold text-gray-800 tracking-wide uppercase">{t(order.paymentMethod)}</p>
                <p className="text-sm text-green-500 font-bold mt-1 tracking-widest uppercase">{t(order.status)}</p>
              </div>
            </div>
          </div>

          {/* جدول المنتجات */}
          <div className="px-8 pb-8">
            <h3 className="text-gray-400 text-[10px] font-black uppercase tracking-widest flex items-center gap-2 mb-4">
              <FiPackage /> العناصر المشتراة
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-right border-collapse">
                <thead>
                  <tr className="text-gray-400 text-[10px] font-black border-b border-gray-50">
                    <th className="py-4">المنتج</th>
                    <th className="py-4 text-center">الكمية</th>
                    <th className="py-4 text-center">سعر الوحدة</th>
                    <th className="py-4 text-left">الإجمالي</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {order.items?.map((item, index) => (
                    <tr key={index} className="text-sm">
                      <td className="py-4 font-bold text-gray-700">{item.productName}</td>
                      <td className="py-4 text-center font-bold text-gray-400">{item.quantity}</td>
                      <td className="py-4 text-center font-bold text-gray-600">{item.unitPrice}</td>
                      <td className="py-4 text-left font-black text-gray-900">{item.subTotal}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* الإجمالي النهائي */}
          <div className="bg-black p-8 flex justify-between items-center text-white">
            <span className="text-sm font-bold opacity-60 italic">المبلغ الإجمالي المستحق</span>
            <span className="text-xl font-black tracking-tighter">{order.totalAmount} دينار أردني</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default OrderDetails;