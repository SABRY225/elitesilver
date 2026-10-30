import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useOutletContext } from 'react-router-dom';
import {
  RefreshCw,
  Eye,
  X,
  User,
  MapPin,
  Package,
  MessageCircle,
  Phone,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  CheckCircle2,
  Clock,
  Truck,
  XCircle,
  Gem,
  ShoppingBag
} from 'lucide-react';

function OrdersTable({ searchQuery: propsSearch = "" }) {
  let outletContext = {};
  try {
    outletContext = useOutletContext() || {};
  } catch (e) {
    outletContext = {};
  }

  const isDarkMode = outletContext.isDarkMode !== undefined ? outletContext.isDarkMode : false;
  const searchQuery = propsSearch || outletContext.searchQuery || "";

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [openDropdownId, setOpenDropdownId] = useState(null);
  
  // Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const token = localStorage.getItem("token");

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/admin/all-orders`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      toast.error("فشل في مزامنة طلبات المتجر");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (orderId, newStatus) => {
    const loadingToast = toast.loading("جاري تحديث حالة الطلب...");
    try {
      await axios.patch(
        `${import.meta.env.VITE_API_URL}/admin/orders/${orderId}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("تم تحديث حالة الطلب بنجاح", { id: loadingToast });
      setOpenDropdownId(null);
      fetchOrders();
    } catch (error) {
      toast.error("فشل تحديث الحالة", { id: loadingToast });
    }
  };

  // Filtering Logic
  const filteredOrders = orders.filter(order =>
    order.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.id?.toString().includes(searchQuery) ||
    order.phone?.includes(searchQuery)
  );

  // Pagination Calculations
  const totalPages = Math.max(1, Math.ceil(filteredOrders.length / itemsPerPage));
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredOrders.slice(indexOfFirstItem, indexOfLastItem);

  const getStatusBadge = (status) => {
    const s = String(status || '').trim();
    switch (s) {
      case 'مكتمل':
      case 'delivered':
        return {
          icon: <CheckCircle2 className="w-4 h-4 text-emerald-400" />,
          style: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30'
        };
      case 'قيد التنفيذ':
      case 'pending':
        return {
          icon: <Clock className="w-4 h-4 text-amber-500" />,
          style: 'bg-amber-500/10 text-amber-500 border-amber-500/30'
        };
      case 'جاري الشحن':
      case 'shipped':
        return {
          icon: <Truck className="w-4 h-4 text-cyan-500" />,
          style: 'bg-cyan-500/10 text-cyan-500 border-cyan-500/30'
        };
      case 'ملغي':
      case 'cancelled':
        return {
          icon: <XCircle className="w-4 h-4 text-rose-500" />,
          style: 'bg-rose-500/10 text-rose-500 border-rose-500/30'
        };
      default:
        return {
          icon: <Package className="w-4 h-4 text-silver-300" />,
          style: isDarkMode ? 'bg-white/5 text-silver-300 border-white/10' : 'bg-slate-100 text-slate-700 border-slate-200'
        };
    }
  };

  const safeParseCartItems = (raw) => {
    if (!raw) return [];
    if (Array.isArray(raw)) return raw;
    try {
      const parsed = typeof raw === 'string' ? JSON.parse(raw) : raw;
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[360px] gap-3 font-cairo">
        <div className="w-10 h-10 border-2 border-silver-300 border-t-transparent rounded-full animate-spin" />
        <span className="text-silver-400 text-sm font-mono tracking-widest uppercase">جاري مزامنة سجل الطلبات...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 font-cairo" dir="rtl">
      
      {/* Top Header Card */}
      <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-3xl border transition-colors ${
        isDarkMode ? 'bg-[#0c0d12]/90 border-white/10' : 'bg-slate-50 border-slate-200'
      }`}>
        <div className="flex items-center gap-3">
          <div className={`w-11 h-11 rounded-2xl border flex items-center justify-center ${
            isDarkMode ? 'bg-silver-400/10 border-silver-400/20 text-silver-300' : 'bg-white border-slate-200 text-slate-800'
          }`}>
            <ShoppingBag className="w-6 h-6 text-silver-200" />
          </div>
          <div>
            <h2 className={`text-xl sm:text-2xl font-black ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              إدارة ومتابعة طلبات المتجر
            </h2>
            <p className={`text-sm mt-0.5 font-medium ${isDarkMode ? 'text-silver-400' : 'text-slate-500'}`}>
              إجمالي الطلبات المسجلة: <span className="font-mono font-bold text-base">{filteredOrders.length}</span> طلب
            </p>
          </div>
        </div>

        <button 
          onClick={fetchOrders}
          className={`inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl border text-sm font-bold transition-all active:scale-95 cursor-pointer ${
            isDarkMode ? 'bg-white/5 hover:bg-white/10 border-white/10 text-silver-200' : 'bg-white hover:bg-slate-100 border-slate-200 text-slate-800 shadow-sm'
          }`}
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          <span>تحديث السجل اللحظي</span>
        </button>
      </div>

      {/* Table Container */}
      <div className={`rounded-3xl border overflow-hidden shadow-xl transition-colors ${
        isDarkMode ? 'bg-[#0c0d12]/90 border-white/10' : 'bg-white border-slate-200'
      }`}>
        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse">
            <thead>
              <tr className={`border-b text-sm font-black uppercase tracking-wider ${
                isDarkMode ? 'border-white/10 bg-white/[0.02] text-silver-400' : 'border-slate-200 bg-slate-50 text-slate-600'
              }`}>
                <th className="p-4 sm:p-5">رقم الطلب</th>
                <th className="p-4 sm:p-5">بيانات العميل</th>
                <th className="p-4 sm:p-5">القيمة الإجمالية</th>
                <th className="p-4 sm:p-5 text-center">حالة الطلب</th>
                <th className="p-4 sm:p-5 text-center">التفاصيل والمنتجات</th>
              </tr>
            </thead>
            <tbody className={`divide-y text-sm ${isDarkMode ? 'divide-white/5' : 'divide-slate-100'}`}>
              {currentItems.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-14 text-center text-silver-400 font-bold text-base">
                    لا توجد طلبات مطابقة للبحث حالياً
                  </td>
                </tr>
              ) : (
                currentItems.map((order, index) => {
                  const isLast = index >= currentItems.length - 2;
                  const badge = getStatusBadge(order.status);

                  return (
                    <tr key={order.id} className={`transition-colors ${
                      isDarkMode ? 'hover:bg-white/[0.02]' : 'hover:bg-slate-50/80'
                    }`}>
                      
                      {/* ID & Date */}
                      <td className="p-4 sm:p-5">
                        <div className={`font-mono text-base font-black ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                          #{order.id}
                        </div>
                        <div className={`text-xs mt-1 font-mono ${isDarkMode ? 'text-silver-400' : 'text-slate-400'}`}>
                          {order.createdAt ? new Date(order.createdAt).toLocaleDateString('ar-EG') : '—'}
                        </div>
                      </td>

                      {/* Client */}
                      <td className="p-4 sm:p-5">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-2xl border flex items-center justify-center font-black text-sm ${
                            isDarkMode ? 'bg-silver-400/10 border-silver-400/20 text-silver-200' : 'bg-slate-100 border-slate-200 text-slate-800'
                          }`}>
                            {order.fullName?.charAt(0) || 'ع'}
                          </div>
                          <div>
                            <div className={`font-bold text-base ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                              {order.fullName || 'عميل المتجر'}
                            </div>
                            <div className={`text-xs font-mono mt-1 flex items-center gap-1.5 ${
                              isDarkMode ? 'text-silver-400' : 'text-slate-500'
                            }`} dir="ltr">
                              <Phone className="w-3.5 h-3.5 text-silver-500" />
                              <span>{order.phone}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Total */}
                      <td className="p-4 sm:p-5">
                        <span className={`font-mono font-black text-base sm:text-lg ${isDarkMode ? 'text-silver-100' : 'text-slate-900'}`}>
                          {Number(order.total || 0).toLocaleString()} <span className="text-xs text-silver-400 font-sans">د.أ</span>
                        </span>
                      </td>

                      {/* Status Dropdown */}
                      <td className="p-4 sm:p-5">
                        <div className="relative flex justify-center">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setOpenDropdownId(openDropdownId === order.id ? null : order.id);
                            }}
                            className={`min-w-[140px] px-4 py-2 rounded-full border text-xs sm:text-sm font-bold flex items-center justify-between gap-2 transition-all cursor-pointer ${badge.style}`}
                          >
                            <span className="flex items-center gap-1.5">
                              {badge.icon}
                              <span>{order.status || 'جديد'}</span>
                            </span>
                            <ChevronDown
                              className={`w-4 h-4 opacity-70 transition-transform ${openDropdownId === order.id ? 'rotate-180' : ''}`}
                            />
                          </button>

                          {openDropdownId === order.id && (
                            <>
                              <div
                                className="fixed inset-0 z-[80]"
                                onClick={() => setOpenDropdownId(null)}
                              />
                              <div
                                className={`absolute ${isLast ? 'bottom-[115%]' : 'top-[115%]'} right-1/2 translate-x-1/2 w-48 rounded-2xl shadow-2xl py-2 z-[90] border ${
                                  isDarkMode ? 'bg-[#10121a] border-white/15' : 'bg-white border-slate-200'
                                }`}
                              >
                                <div className={`text-xs px-4 py-1.5 text-center border-b font-mono font-bold uppercase ${
                                  isDarkMode ? 'text-silver-400 border-white/5' : 'text-slate-400 border-slate-100'
                                }`}>
                                  تحديث حالة الطلب
                                </div>
                                {['جديد', 'قيد التنفيذ', 'جاري الشحن', 'مكتمل', 'ملغي'].map((option) => (
                                  <button
                                    key={option}
                                    onClick={() => updateStatus(order.id, option)}
                                    className={`w-full px-4 py-2.5 text-right text-xs sm:text-sm font-bold flex items-center justify-between transition-colors cursor-pointer ${
                                      order.status === option
                                        ? isDarkMode ? 'bg-silver-400/15 text-white' : 'bg-slate-100 text-slate-900'
                                        : isDarkMode ? 'text-silver-400 hover:bg-white/5 hover:text-white' : 'text-slate-600 hover:bg-slate-50'
                                    }`}
                                  >
                                    <span>{option}</span>
                                    {order.status === option && (
                                      <span className="w-2 h-2 rounded-full bg-emerald-400" />
                                    )}
                                  </button>
                                ))}
                              </div>
                            </>
                          )}
                        </div>
                      </td>

                      {/* Action */}
                      <td className="p-4 sm:p-5 text-center">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className={`p-2.5 rounded-2xl border transition-all active:scale-95 cursor-pointer ${
                            isDarkMode 
                              ? 'bg-white/5 hover:bg-white/10 border-white/10 text-silver-300 hover:text-white' 
                              : 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700'
                          }`}
                          title="عرض تفاصيل الطلب والقطع"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                      </td>

                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className={`p-5 border-t flex flex-col sm:flex-row items-center justify-between gap-4 text-sm ${
          isDarkMode ? 'border-white/10 bg-white/[0.01]' : 'border-slate-200 bg-slate-50'
        }`}>
          <div className={isDarkMode ? 'text-silver-400' : 'text-slate-600'}>
            عرض <span className="font-mono font-bold">{filteredOrders.length > 0 ? indexOfFirstItem + 1 : 0}</span> - <span className="font-mono font-bold">{Math.min(indexOfLastItem, filteredOrders.length)}</span> من إجمالي <span className="font-mono font-bold">{filteredOrders.length}</span> طلب
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`p-2.5 rounded-xl border transition-all disabled:opacity-20 disabled:cursor-not-allowed ${
                isDarkMode ? 'border-white/10 bg-white/5 text-silver-300 hover:bg-white/10' : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-100'
              }`}
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            <div className="flex gap-1.5">
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-9 h-9 rounded-xl font-mono text-sm font-bold transition-all cursor-pointer ${
                    currentPage === i + 1
                      ? isDarkMode
                        ? 'bg-gradient-to-r from-silver-300 to-silver-100 text-[#070709] shadow-md'
                        : 'bg-slate-900 text-white shadow-md'
                      : isDarkMode
                        ? 'border border-white/10 bg-white/5 text-silver-400 hover:text-white'
                        : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>

            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className={`p-2.5 rounded-xl border transition-all disabled:opacity-20 disabled:cursor-not-allowed ${
                isDarkMode ? 'border-white/10 bg-white/5 text-silver-300 hover:bg-white/10' : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-100'
              }`}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex justify-center items-center z-50 p-4">
          <div className={`w-full max-w-2xl max-h-[90vh] overflow-hidden rounded-3xl shadow-2xl flex flex-col border animate-in fade-in zoom-in-95 duration-200 ${
            isDarkMode ? 'bg-[#0e1017] border-white/15' : 'bg-white border-slate-200'
          }`}>
            
            {/* Modal Header */}
            <div className={`p-5 border-b flex justify-between items-center ${
              isDarkMode ? 'border-white/10 bg-white/[0.02]' : 'border-slate-200 bg-slate-50'
            }`}>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl border flex items-center justify-center ${
                  isDarkMode ? 'bg-silver-400/10 border-silver-400/20 text-silver-300' : 'bg-white border-slate-200 text-slate-800'
                }`}>
                  <Gem className="w-5 h-5 text-silver-200" />
                </div>
                <div>
                  <h3 className="font-black text-lg text-white">تفاصيل الطلب #{selectedOrder.id}</h3>
                  <p className="text-xs text-silver-400 mt-0.5 font-mono">
                    {selectedOrder.createdAt ? new Date(selectedOrder.createdAt).toLocaleString('ar-EG') : '—'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                  isDarkMode ? 'bg-white/5 hover:bg-white/10 border-white/10 text-silver-400 hover:text-white' : 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700'
                }`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5">
              
              {/* Customer & Address Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className={`p-4 rounded-2xl border ${
                  isDarkMode ? 'bg-white/[0.03] border-white/10' : 'bg-slate-50 border-slate-200'
                }`}>
                  <div className="text-xs font-mono tracking-widest uppercase text-silver-400 flex items-center gap-1.5 mb-2 font-bold">
                    <User className="w-4 h-4 text-silver-300" /> بيانات العميل
                  </div>
                  <p className="font-black text-base text-white">{selectedOrder.fullName}</p>
                  <p className="text-sm text-silver-400 font-mono mt-1" dir="ltr">{selectedOrder.phone}</p>
                </div>

                <div className={`p-4 rounded-2xl border ${
                  isDarkMode ? 'bg-white/[0.03] border-white/10' : 'bg-slate-50 border-slate-200'
                }`}>
                  <div className="text-xs font-mono tracking-widest uppercase text-silver-400 flex items-center gap-1.5 mb-2 font-bold">
                    <MapPin className="w-4 h-4 text-silver-300" /> عنوان التوصيل
                  </div>
                  <p className="text-sm font-semibold text-silver-200 leading-relaxed">
                    {selectedOrder.address || 'العنوان غير محدد'}
                  </p>
                </div>
              </div>

              {/* Items List */}
              <div>
                <div className="text-sm font-bold text-silver-300 mb-3 flex items-center gap-2">
                  <Package className="w-5 h-5 text-silver-400" />
                  <span>القطع المطلوبة في الفاتورة</span>
                </div>
                <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
                  {safeParseCartItems(selectedOrder.cartItems).map((item, idx) => (
                    <div
                      key={idx}
                      className={`flex items-center gap-3.5 p-3.5 rounded-2xl border transition-all ${
                        isDarkMode ? 'bg-white/[0.02] border-white/10 hover:border-white/20' : 'bg-slate-50 border-slate-200'
                      }`}
                    >
                      {item.image ? (
                        <img
                          src={`${import.meta.env.VITE_URL}/${item.image}`}
                          alt={item.name}
                          className="w-14 h-14 object-cover rounded-xl border border-white/10 bg-black/40"
                          onError={(e) => { e.target.style.display = 'none'; }}
                        />
                      ) : (
                        <div className="w-14 h-14 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-silver-400">
                          <Gem className="w-6 h-6" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-sm text-white truncate">{item.name}</p>
                        <p className="text-xs text-silver-400 mt-1 font-mono">
                          الكمية: <span className="text-silver-200 font-bold">{item.quantity}</span> × {Number(item.price || 0).toLocaleString()} د.أ
                        </p>
                      </div>
                      <div className="font-mono font-black text-sm text-silver-100">
                        {(Number(item.quantity || 1) * Number(item.price || 0)).toLocaleString()} د.أ
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Summary */}
              <div className={`p-4 sm:p-5 rounded-2xl border space-y-2.5 ${
                isDarkMode ? 'bg-black/50 border-white/10' : 'bg-slate-50 border-slate-200'
              }`}>
                <div className="flex justify-between text-sm text-silver-400">
                  <span>المجموع الفرعي للقطع</span>
                  <span className="font-mono font-bold">{Number(selectedOrder.subtotal || 0).toLocaleString()} د.أ</span>
                </div>
                <div className="flex justify-between text-sm text-silver-400">
                  <span>رسوم التوصيل</span>
                  <span className="font-mono text-emerald-400 font-bold">+{Number(selectedOrder.shipping || 0).toLocaleString()} د.أ</span>
                </div>
                <div className={`pt-3 border-t flex justify-between items-center text-base font-black ${
                  isDarkMode ? 'border-white/10 text-white' : 'border-slate-200 text-slate-900'
                }`}>
                  <span>الإجمالي النهائي المستحق</span>
                  <span className="font-mono text-xl sm:text-2xl text-silver-100 font-black">
                    {Number(selectedOrder.total || 0).toLocaleString()} د.أ
                  </span>
                </div>
              </div>

            </div>

            {/* Modal Footer */}
            <div className={`p-4 sm:p-5 border-t ${
              isDarkMode ? 'bg-white/[0.02] border-white/10' : 'bg-slate-50 border-slate-200'
            }`}>
              <a
                href={`https://wa.me/${String(selectedOrder.phone || '').replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2.5 w-full bg-[#25D366] hover:bg-[#20ba5a] text-black font-black py-3.5 rounded-2xl transition-all shadow-lg active:scale-[0.99] text-sm cursor-pointer"
              >
                <MessageCircle className="w-5 h-5" />
                <span>مراسلة العميل وتأكيد تفاصيل الطلب عبر واتساب</span>
              </a>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

export default OrdersTable;