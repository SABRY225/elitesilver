import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
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
  Coins,
  ShieldCheck
} from 'lucide-react';

function OrdersSilverTable({ searchQuery = "" }) {
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
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/admin/silver/all`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      toast.error("فشل في مزامنة طلبات سبائك الفضة");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (orderId, newStatus) => {
    const loadingToast = toast.loading("جاري تحديث حالة السبيكة...");
    try {
      await axios.patch(
        `${import.meta.env.VITE_API_URL}/admin/orders/silver/${orderId}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("تم تحديث حالة طلب السبيكة بنجاح", { id: loadingToast });
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
    order.phone?.includes(searchQuery) ||
    order.productName?.toLowerCase().includes(searchQuery.toLowerCase())
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
          icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />,
          style: 'bg-emerald-50 text-emerald-700 border-emerald-200'
        };
      case 'قيد التنفيذ':
      case 'pending':
        return {
          icon: <Clock className="w-3.5 h-3.5 text-amber-600" />,
          style: 'bg-amber-50 text-amber-700 border-amber-200'
        };
      case 'جاري الشحن':
      case 'shipped':
        return {
          icon: <Truck className="w-3.5 h-3.5 text-cyan-600" />,
          style: 'bg-cyan-50 text-cyan-700 border-cyan-200'
        };
      case 'ملغي':
      case 'cancelled':
        return {
          icon: <XCircle className="w-3.5 h-3.5 text-rose-600" />,
          style: 'bg-rose-50 text-rose-700 border-rose-200'
        };
      default:
        return {
          icon: <Coins className="w-3.5 h-3.5 text-slate-600" />,
          style: 'bg-slate-100 text-slate-700 border-slate-200'
        };
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[360px] gap-3">
        <div className="w-10 h-10 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" />
        <span className="text-slate-500 text-xs font-mono tracking-widest uppercase">جاري تحميل سجل سبائك الفضة...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6" dir="rtl">
      
      {/* Top Header Card */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-800">
            <Coins className="w-5 h-5 text-slate-800" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 tracking-wide">إدارة طلبات سبائك الفضة النقية (Ag 999.0)</h2>
            <p className="text-slate-500 text-xs mt-0.5">
              إجمالي طلبات الاستثمار: <span className="text-slate-900 font-mono font-bold">{filteredOrders.length}</span> طلب
            </p>
          </div>
        </div>

        <button 
          onClick={fetchOrders}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 text-xs font-bold transition-all active:scale-95"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          <span>تحديث السجل</span>
        </button>
      </div>

      {/* Table Container */}
      <div className="rounded-2xl bg-white border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70">
                <th className="p-4 text-xs font-bold uppercase tracking-wider text-slate-600">رقم الطلب</th>
                <th className="p-4 text-xs font-bold uppercase tracking-wider text-slate-600">العميل</th>
                <th className="p-4 text-xs font-bold uppercase tracking-wider text-slate-600">السبيكة المطلوبة</th>
                <th className="p-4 text-xs font-bold uppercase tracking-wider text-slate-600">القيمة الإجمالية</th>
                <th className="p-4 text-xs font-bold uppercase tracking-wider text-slate-600 text-center">حالة الطلب</th>
                <th className="p-4 text-xs font-bold uppercase tracking-wider text-slate-600 text-center">التفاصيل</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {currentItems.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-slate-500 text-sm">
                    لا توجد طلبات سبائك مطابقة للبحث
                  </td>
                </tr>
              ) : (
                currentItems.map((order, index) => {
                  const isLast = index >= currentItems.length - 2;
                  const badge = getStatusBadge(order.status);

                  return (
                    <tr key={order.id} className="hover:bg-slate-50/70 transition-colors">
                      
                      {/* ID */}
                      <td className="p-4">
                        <div className="font-mono text-xs font-bold text-slate-900">#{order.id}</div>
                        <div className="text-[11px] text-slate-500 mt-0.5">
                          {order.createdAt ? new Date(order.createdAt).toLocaleDateString('ar-EG') : '—'}
                        </div>
                      </td>

                      {/* Customer */}
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 font-bold text-xs">
                            {order.fullName?.charAt(0) || 'ع'}
                          </div>
                          <div>
                            <div className="font-bold text-xs text-slate-900">{order.fullName || 'عميل'}</div>
                            <div className="text-[11px] text-slate-500 font-mono mt-0.5 flex items-center gap-1" dir="ltr">
                              <Phone className="w-3 h-3 text-slate-400" />
                              <span>{order.phone}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Product Name */}
                      <td className="p-4">
                        <span className="text-xs font-semibold text-slate-800 line-clamp-1">
                          {order.productName || 'سبيكة فضة نقية'}
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono">الكمية: {order.quantity || 1}</span>
                      </td>

                      {/* Total */}
                      <td className="p-4">
                        <span className="font-mono font-bold text-sm text-slate-900">
                          {Number(order.total_price || 0).toLocaleString()} <span className="text-[11px] text-slate-500 font-sans">د.أ</span>
                        </span>
                      </td>

                      {/* Status Dropdown */}
                      <td className="p-4">
                        <div className="relative flex justify-center">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setOpenDropdownId(openDropdownId === order.id ? null : order.id);
                            }}
                            className={`min-w-[130px] px-3 py-1.5 rounded-full border text-xs font-bold flex items-center justify-between gap-1.5 transition-all ${badge.style}`}
                          >
                            <span className="flex items-center gap-1.5">
                              {badge.icon}
                              <span>{order.status || 'جديد'}</span>
                            </span>
                            <ChevronDown
                              className={`w-3.5 h-3.5 opacity-60 transition-transform ${openDropdownId === order.id ? 'rotate-180' : ''}`}
                            />
                          </button>

                          {openDropdownId === order.id && (
                            <>
                              <div
                                className="fixed inset-0 z-[80]"
                                onClick={() => setOpenDropdownId(null)}
                              />
                              <div
                                className={`absolute ${isLast ? 'bottom-[110%]' : 'top-[110%]'} right-1/2 translate-x-1/2 w-44 bg-white border border-slate-200 rounded-xl shadow-2xl py-1.5 z-[90]`}
                              >
                                <div className="text-[10px] text-slate-500 px-3 py-1 text-center border-b border-slate-100 mb-1 font-mono uppercase font-bold">
                                  تحديث مرحلة الطلب
                                </div>
                                {['جديد', 'قيد التنفيذ', 'جاري الشحن', 'مكتمل', 'ملغي'].map((option) => (
                                  <button
                                    key={option}
                                    onClick={() => updateStatus(order.id, option)}
                                    className={`w-full px-3 py-2 text-right text-xs flex items-center justify-between transition-colors ${
                                      order.status === option
                                        ? 'bg-slate-100 text-slate-900 font-bold'
                                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                                    }`}
                                  >
                                    <span>{option}</span>
                                    {order.status === option && (
                                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                    )}
                                  </button>
                                ))}
                              </div>
                            </>
                          )}
                        </div>
                      </td>

                      {/* Action */}
                      <td className="p-4 text-center">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 transition-all active:scale-95"
                          title="عرض تفاصيل الطلب"
                        >
                          <Eye className="w-4 h-4" />
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
        <div className="p-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-50/50">
          <div className="text-xs text-slate-500">
            عرض <span className="text-slate-900 font-mono font-bold">{filteredOrders.length > 0 ? indexOfFirstItem + 1 : 0}</span> - <span className="text-slate-900 font-mono font-bold">{Math.min(indexOfLastItem, filteredOrders.length)}</span> من <span className="text-slate-900 font-mono font-bold">{filteredOrders.length}</span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            <div className="flex gap-1">
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-8 h-8 rounded-xl font-mono text-xs font-bold transition-all ${
                    currentPage === i + 1
                      ? 'bg-slate-900 text-white shadow-sm'
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
              className="p-2 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-white border border-slate-200 w-full max-w-2xl max-h-[90vh] overflow-hidden rounded-3xl shadow-2xl flex flex-col animate-in fade-in zoom-in-95 duration-200">
            
            {/* Header */}
            <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/60">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700">
                  <Coins className="w-4 h-4 text-slate-700" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900">تفاصيل طلب سبيكة الفضة #{selectedOrder.id}</h3>
                  <p className="text-[11px] text-slate-500 mt-0.5 font-mono">
                    {selectedOrder.createdAt ? new Date(selectedOrder.createdAt).toLocaleString('ar-EG') : '—'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-2 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-500 hover:text-slate-800 transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-5 space-y-5">
              
              {/* Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <div className="text-[10px] font-mono tracking-widest uppercase text-slate-500 flex items-center gap-1.5 mb-2 font-bold">
                    <User className="w-3.5 h-3.5 text-slate-500" /> بيانات المستثمر
                  </div>
                  <p className="font-bold text-sm text-slate-900">{selectedOrder.fullName}</p>
                  <p className="text-xs text-slate-500 font-mono mt-1" dir="ltr">{selectedOrder.phone}</p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <div className="text-[10px] font-mono tracking-widest uppercase text-slate-500 flex items-center gap-1.5 mb-2 font-bold">
                    <MapPin className="w-3.5 h-3.5 text-slate-500" /> وجهة التسليم
                  </div>
                  <p className="text-xs font-semibold text-slate-700 leading-relaxed">
                    {selectedOrder.address || 'العنوان غير محدد'}
                  </p>
                </div>
              </div>

              {/* Product Spec */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="text-xs font-bold text-slate-700 mb-3 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>مواصفات السبيكة المطلوبة</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-white border border-slate-200">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700">
                      <Coins className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="font-bold text-sm text-slate-900">{selectedOrder.productName || 'سبيكة فضة سويسرية Ag 999.0'}</p>
                      <p className="text-[11px] text-slate-500 font-mono mt-0.5">
                        الكمية: {selectedOrder.quantity || 1} × {Number(selectedOrder.productPrice || 0).toLocaleString()} د.أ
                      </p>
                    </div>
                  </div>
                  <div className="font-mono font-bold text-sm text-slate-900">
                    {(Number(selectedOrder.quantity || 1) * Number(selectedOrder.productPrice || 0)).toLocaleString()} د.أ
                  </div>
                </div>
              </div>

              {/* Financial Calculation */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex justify-between text-xs text-slate-600">
                  <span>سعر السبيكة</span>
                  <span className="font-mono font-bold">{Number(selectedOrder.productPrice || 0).toLocaleString()} د.أ</span>
                </div>
                <div className="flex justify-between text-xs text-slate-600">
                  <span>تأمين وشحن المحافظة</span>
                  <span className="font-mono font-bold text-emerald-600">+{Number(selectedOrder?.cityInfo?.price || 0).toLocaleString()} د.أ</span>
                </div>
                <div className="pt-2 border-t border-slate-200 flex justify-between items-center text-sm font-bold">
                  <span className="text-slate-900">الإجمالي النهائي للطلب</span>
                  <span className="font-mono text-base text-slate-900 font-black">
                    {Number(selectedOrder.total_price || 0).toLocaleString()} د.أ
                  </span>
                </div>
              </div>

            </div>

            {/* Footer */}
            <div className="p-4 bg-slate-50/60 border-t border-slate-100">
              <a
                href={`https://wa.me/${String(selectedOrder.phone || '').replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 w-full bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold py-3 rounded-xl transition-all shadow-sm active:scale-[0.99] text-xs"
              >
                <MessageCircle className="w-4 h-4" />
                <span>مراسلة العميل وتأكيد الحجز عبر واتساب</span>
              </a>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

export default OrdersSilverTable;