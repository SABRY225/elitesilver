import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import {
  FiRefreshCw, FiEye, FiX, FiUser, FiMapPin,
  FiPackage, FiMessageCircle, FiSmartphone,
  FiChevronRight, FiChevronLeft, FiChevronDown
} from 'react-icons/fi';

function OrdersSilverTable({ searchQuery = "" }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [openDropdownId, setOpenDropdownId] = useState(null);
  
  // --- Pagination States ---
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const token = localStorage.getItem("token");

  // إعادة الترقيم للصفحة الأولى عند حدوث بحث جديد
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/admin/silver/all`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(response.data);
    } catch (error) {
      toast.error("فشل في مزامنة الطلبات");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (orderId, newStatus) => {
    const loadingToast = toast.loading("جاري تحديث الحالة...");
    try {
      await axios.patch(
        `${import.meta.env.VITE_API_URL}/admin/orders/silver/${orderId}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("تم تحديث الحالة بنجاح", { id: loadingToast });
      fetchOrders();
    } catch (error) {
      toast.error("فشل التحديث", { id: loadingToast });
    }
  };

  // --- Filtering Logic ---
  const filteredOrders = orders.filter(order =>
    order.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.id?.toString().includes(searchQuery) ||
    order.phone?.includes(searchQuery)
  );

  // --- Pagination Calculations ---
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredOrders.slice(indexOfFirstItem, indexOfLastItem);

  const getStatusStyle = (status) => {
    switch (status) {
      case 'مكتمل': return 'bg-emerald-50 text-emerald-600 border-emerald-500';
      case 'قيد التنفيذ': return 'bg-blue-50 text-blue-600 border-blue-500';
      case 'جاري الشحن': return 'bg-purple-50 text-purple-600 border-purple-500';
      case 'ملغي': return 'bg-rose-50 text-rose-600 border-rose-500';
      default: return 'bg-amber-50 text-amber-600 border-amber-500';
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4 font-['Tajawal']">
        <FiRefreshCw className="animate-spin text-4xl text-indigo-600" />
        <span className="text-slate-500 font-medium">جاري تحميل الطلبات...</span>
      </div>
    );
  }
  return (
    <div className="space-y-6 font-['Tajawal']" dir="rtl">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <FiPackage className="text-indigo-600" /> إدارة الطلبات السيائك
          </h2>
          <p className="text-slate-400 text-sm mt-1">لديك إجمالي {filteredOrders.length} طلب</p>
        </div>
        <button 
          onClick={fetchOrders}
          className="flex items-center justify-center gap-2 px-6 py-2.5 bg-indigo-600 text-white rounded-2xl hover:bg-indigo-700 transition-all active:scale-95 shadow-lg shadow-indigo-100 font-bold"
        >
          <FiRefreshCw className={loading ? "animate-spin" : ""} /> تحديث البيانات
        </button>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-xl overflow-visible">
        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="p-5 text-slate-500 font-bold text-sm">رقم الطلب</th>
                <th className="p-5 text-slate-500 font-bold text-sm">العميل</th>
                <th className="p-5 text-slate-500 font-bold text-sm">القيمة الإجمالية</th>
                <th className="p-5 text-slate-500 font-bold text-sm text-center">الحالة</th>
                <th className="p-5 text-slate-500 font-bold text-sm text-center">الإجراءات</th>
              </tr>
            </thead>
          <tbody className="divide-y divide-slate-50">
  {currentItems.map((order, index) => {
    const isLast = index >= currentItems.length - 1;

    return (
      <tr key={order.id} className="hover:bg-slate-50/50 transition-colors">
        
        <td className="p-5">
          <span className="font-mono font-bold text-slate-600">#{order.id}</span>
        </td>

        <td className="p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold border border-slate-200">
              {order.fullName?.charAt(0)}
            </div>
            <div>
              <div className="font-bold text-slate-800">{order.fullName}</div>
              <div className="text-xs text-slate-400 flex items-center gap-1">
                <FiSmartphone size={12}/> {order.phone}
              </div>
            </div>
          </div>
        </td>

        <td className="p-5 font-black text-slate-700">
          {Number(order.total_price).toLocaleString()} د.أ
        </td>

        {/* ✅ Dropdown */}
        <td className="p-5">
          <div className="relative flex justify-center">

            <button
              onClick={(e) => {
                e.stopPropagation();
                setOpenDropdownId(openDropdownId === order.id ? null : order.id);
              }}
              className={`
                min-w-[140px] px-4 py-2 rounded-full border-2 font-bold text-xs
                flex items-center justify-between gap-2 transition-all
                ${getStatusStyle(order.status)}
              `}
            >
              <span className="flex-1 text-center">{order.status}</span>
              <FiChevronDown
                className={`transition-transform ${openDropdownId === order.id ? 'rotate-180' : ''}`}
              />
            </button>

            {openDropdownId === order.id && (
              <>
                {/* Overlay */}
                <div
                  className="fixed inset-0 z-[90]"
                  onClick={() => setOpenDropdownId(null)}
                />

                {/* Dropdown */}
                <div
                  className={`
                    absolute ${isLast ? 'bottom-[110%]' : 'top-[110%]'}
                    right-1/2 translate-x-1/2 w-48 bg-white rounded-2xl
                    shadow-xl border border-slate-200 py-2
                    z-[100]
                  `}
                >
                  <div className="text-[10px] text-slate-400 px-4 py-1 text-center border-b mb-1">
                    تغيير حالة الطلب
                  </div>

                  {['جديد', 'قيد التنفيذ', 'جاري الشحن', 'مكتمل', 'ملغي'].map((option) => (
                    <button
                      key={option}
                      onClick={() => {
                        updateStatus(order.id, option);
                        setOpenDropdownId(null);
                      }}
                      className={`
                        w-full px-4 py-3 text-right text-sm flex justify-between
                        ${order.status === option
                          ? 'bg-indigo-50 text-indigo-600 font-bold'
                          : 'text-slate-600 hover:bg-slate-50'}
                      `}
                    >
                      {option}
                      {order.status === option && (
                        <span className="w-2 h-2 rounded-full bg-indigo-600" />
                      )}
                    </button>
                  ))}
                </div>
              </>
            )}

          </div>
        </td>

        <td className="p-5 text-center">
          <button
            onClick={() => setSelectedOrder(order)}
            className="p-2.5 text-indigo-500 hover:bg-indigo-50 rounded-xl"
          >
            <FiEye size={20} />
          </button>
        </td>

      </tr>
    );
  })}
</tbody>
          </table>
        </div>

        {/* Pagination UI */}
        <div className="p-6 border-t border-slate-50 flex flex-col md:flex-row items-center justify-between gap-4 bg-slate-50/30">
          <div className="text-sm text-slate-500 font-medium">
            عرض <span className="text-indigo-600 font-bold">{indexOfFirstItem + 1}</span> - <span className="text-indigo-600 font-bold">{Math.min(indexOfLastItem, filteredOrders.length)}</span> من <span className="text-slate-800 font-bold">{filteredOrders.length}</span> طلب
          </div>
          
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-30 transition-all shadow-sm"
            >
              <FiChevronRight size={20} />
            </button>

            <div className="flex gap-1">
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-10 h-10 rounded-xl font-bold transition-all shadow-sm ${currentPage === i + 1 ? 'bg-indigo-600 text-white scale-110 shadow-indigo-200' : 'bg-white text-slate-500 border border-slate-100 hover:border-indigo-200'}`}
                >
                  {i + 1}
                </button>
              ))}
            </div>

            <button 
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-30 transition-all shadow-sm"
            >
              <FiChevronLeft size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Enhanced Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex justify-center items-center z-50 p-4 animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-2xl max-h-[90vh] overflow-hidden rounded-[2.5rem] shadow-2xl flex flex-col animate-in slide-in-from-bottom-4 duration-300">
            
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div>
                <h2 className="font-black text-xl text-slate-800">تفاصيل الطلب #{selectedOrder.id}</h2>
                <p className="text-xs text-slate-400 mt-1">{new Date(selectedOrder.createdAt).toLocaleString('ar-EG')}</p>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="p-2 bg-white text-slate-400 hover:text-rose-500 rounded-xl shadow-sm border border-slate-100 transition-all">
                <FiX size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-indigo-50/50 p-5 rounded-2xl border border-indigo-100/50">
                  <h4 className="text-indigo-600 text-[10px] font-black uppercase tracking-widest mb-2 flex items-center gap-1"><FiUser/> معلومات العميل</h4>
                  <p className="font-bold text-slate-800">{selectedOrder.fullName}</p>
                  <p className="text-sm text-slate-600 font-medium">{selectedOrder.phone}</p>
                </div>
                <div className="bg-amber-50/50 p-5 rounded-2xl border border-amber-100/50">
                  <h4 className="text-amber-600 text-[10px] font-black uppercase tracking-widest mb-2 flex items-center gap-1"><FiMapPin/> عنوان التوصيل</h4>
                  <p className="text-sm font-bold text-slate-700 leading-relaxed">{selectedOrder.address}</p>
                </div>
              </div>

              <div>
                <h3 className="font-black text-slate-800 mb-4 flex items-center gap-2">
                  <FiPackage className="text-indigo-600"/> المنتجات المشتراة
                </h3>
                <div className="space-y-3">
                    <div className="flex items-center gap-4 p-4 rounded-2xl border border-slate-100 hover:border-indigo-100 transition-colors bg-white shadow-sm">
                      <div className="flex-1">
                        <p className="font-bold text-slate-800 text-sm leading-tight">{selectedOrder.productName}</p>
                        <p className="text-xs text-slate-400 mt-1 font-bold">الكمية: {selectedOrder.quantity} × {Number(selectedOrder.productPrice).toLocaleString()} د.أ</p>
                      </div>
                      <div className="text-indigo-600 font-black text-sm">{(selectedOrder.quantity * Number(selectedOrder.productPrice)).toLocaleString()} د.أ</div>
                    </div>
                </div>
              </div>

              <div className="bg-slate-900 p-6 rounded-[2rem] space-y-3 text-white shadow-xl shadow-slate-200">
                 <div className="flex justify-between text-slate-400 text-sm">
                    <span>المجموع الفرعي</span>
                    <span>{Number(selectedOrder.productPrice).toLocaleString()} د.أ</span>
                 </div>
                 <div className="flex justify-between text-slate-400 text-sm">
                    <span>تكلفة التوصيل</span>
                    <span className="text-emerald-400">+{Number(selectedOrder?.cityInfo?.price).toLocaleString()} د.أ</span>
                 </div>
                 <div className="pt-3 border-t border-slate-700 flex justify-between items-center">
                    <span className="font-bold">الإجمالي النهائي</span>
                    <span className="font-black text-2xl text-indigo-400">{Number(selectedOrder.total_price).toLocaleString()} د.أ</span>
                 </div>
              </div>
            </div>

            <div className="p-6 bg-white border-t border-slate-100">
              <a href={`https://wa.me/${selectedOrder.phone}`} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 w-full bg-[#25D366] hover:bg-[#20ba5a] text-white py-4 rounded-2xl font-black shadow-lg shadow-green-100 transition-all active:scale-[0.98]">
                <FiMessageCircle size={22} /> تواصل عبر واتساب
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default OrdersSilverTable;