import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { 
  FiMessageCircle, FiLoader, FiCalendar, FiDollarSign, 
  FiClock, FiUser, FiBriefcase, FiHash, FiTrash2 
} from 'react-icons/fi';

function SpecialOrdersList() {
  const [specialOrders, setSpecialOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  const fetchSpecialOrders = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/admin/special-orders`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSpecialOrders(response.data);
    } catch (err) {
      toast.error("فشل في تحميل طلبات التصميم");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchSpecialOrders(); }, []);

  const updateStatus = async (id, newStatus) => {
    try {
      await axios.patch(`${import.meta.env.VITE_API_URL}/special-orders/${id}`, 
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("تم تحديث حالة الطلب");
      fetchSpecialOrders();
    } catch (err) {
      toast.error("فشل تحديث الحالة");
    }
  };

  if (loading) return (
    <div className="flex justify-center p-20 text-rose-500">
      <FiLoader className="animate-spin text-4xl" />
    </div>
  );

  return (
    <div className="p-4 lg:p-8 font-['Tajawal']" dir="rtl">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {specialOrders.map((order) => (
          <div 
            key={order.id} 
            className="bg-white border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 rounded-[2rem] overflow-hidden flex flex-col lg:flex-row"
          >
            {/* الجزء الجانبي للحالة */}
            <div className={`w-full lg:w-2 transition-colors ${
              order.status === 'جديد' ? 'bg-amber-400' : 
              order.status === 'تم التواصل' ? 'bg-emerald-500' : 'bg-slate-300'
            }`} />

            <div className="flex-1 p-6 md:p-8">
              {/* الرأس: المعلومات الأساسية */}
              <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-500">
                    <FiUser size={24} />
                  </div>
                  <div>
                    <h4 className="font-black text-slate-800 text-xl">{order.customerName}</h4>
                    <div className="flex items-center gap-2 text-slate-400 text-xs mt-1">
                      <FiHash /> <span>{order.id}</span>
                      <span className="mx-1">•</span>
                      <FiClock /> <span>{new Date(order.createdAt).toLocaleDateString('ar-EG')}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-slate-400 ml-2">الحالة:</span>
                  <select 
                    value={order.status}
                    onChange={(e) => updateStatus(order.id, e.target.value)}
                    className={`text-xs font-black px-4 py-2 rounded-xl border-none outline-none cursor-pointer shadow-sm transition-all ${
                      order.status === 'جديد' ? 'bg-amber-50 text-amber-600' : 
                      order.status === 'تم التواصل' ? 'bg-emerald-50 text-emerald-600' : 
                      'bg-slate-100 text-slate-500'
                    }`}
                  >
                    <option value="جديد">🔔 جديد</option>
                    <option value="تم التواصل">✅ تم التواصل</option>
                    <option value="ملغي">❌ ملغي</option>
                  </select>
                </div>
              </div>

              {/* تفاصيل الطلب - كروت صغيرة */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="flex items-center gap-3 p-4 bg-rose-50/50 rounded-2xl border border-rose-100/50">
                  <FiBriefcase className="text-rose-500" />
                  <div>
                    <p className="text-[10px] text-rose-400 font-bold">المناسبة</p>
                    <p className="text-sm font-bold text-slate-700">{order.occasion || 'غير محدد'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100/50">
                  <FiDollarSign className="text-emerald-500" />
                  <div>
                    <p className="text-[10px] text-emerald-400 font-bold">الميزانية المتوقعة</p>
                    <p className="text-sm font-bold text-slate-700">{order.budget ? `${order.budget} ر.ق` : 'لم تحدد'}</p>
                  </div>
                </div>
              </div>

              {/* نص الفكرة */}
              <div className="relative group">
                <div className="absolute -right-2 top-0 bottom-0 w-1 bg-slate-100 group-hover:bg-rose-200 transition-colors rounded-full" />
                <div className="pr-4">
                  <p className="text-xs font-bold text-slate-400 mb-2 flex items-center gap-1">
                    <FiCalendar className="text-rose-400" /> الفكرة المطلوبة بالتفصيل:
                  </p>
                  <p className="text-slate-600 text-sm leading-relaxed ">
                    "{order.description}"
                  </p>
                </div>
              </div>
            </div>

            {/* الأزرار والإجراءات */}
            <div className="bg-slate-50 p-6 lg:w-64 flex flex-col justify-center gap-3 border-r border-slate-100">
              <a 
                href={`https://wa.me/${order.phone}?text=${encodeURIComponent(`أهلاً ${order.customerName}، معك متجر "لمسة خاصة". وصلتنا فكرتك المبدعة بخصوص مناسبة (${order.occasion}) ونسعد بتنفيذها لك...`)}`}
                target="_blank"
                rel="noreferrer"
                className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white py-4 rounded-2xl text-sm font-black flex items-center justify-center gap-2 transition-all shadow-lg shadow-green-100"
              >
                <FiMessageCircle size={18} />
                تواصل واتساب
              </a>
              
            </div>

          </div>
        ))}

        {specialOrders.length === 0 && (
          <div className="text-center py-24 bg-white rounded-[3rem] border-4 border-dashed border-slate-50">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-200">
              <FiBriefcase size={40} />
            </div>
            <p className="text-slate-400 font-black text-xl">لا توجد طلبات إبداعية بانتظارك حالياً</p>
            <p className="text-slate-300 text-sm mt-2">سيظهر هنا أي طلب خاص يتم إرساله من الموقع</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default SpecialOrdersList;