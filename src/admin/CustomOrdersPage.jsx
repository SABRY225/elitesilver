import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLanguage } from '../contexts/LanguageContext';
import {
  ChevronRight,
  ChevronLeft,
  User,
  Phone,
  RefreshCcw,
  Eye,
  X,
  CheckCircle2,
  Clock,
  PackageCheck,
  DollarSign,
  Save,
  XCircle,
  Check,
  Sparkles,
  Layers,
  ArrowRight
} from 'lucide-react';
import toast from 'react-hot-toast';

const CustomOrdersPage = () => {
  const { t } = useLanguage();

  const [orders, setOrders] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [price, setPrice] = useState("");
  const [isUpdatingPrice, setIsUpdatingPrice] = useState(false);

  const fetchOrders = async (currentPage) => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/custom/orders?page=${currentPage}&limit=8`);
      setOrders(Array.isArray(data.data) ? data.data : []);
      setTotalPages(data.totalPages || 1);
    } catch (error) {
      toast.error("فشل في تحميل الطلبات الخاصة");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(page);
  }, [page]);

  const handleStatusUpdate = async (id, newStatus) => {
    const toastId = toast.loading("جاري تحديث الحالة...");
    try {
      await axios.patch(`${import.meta.env.VITE_API_URL}/custom/orders/${id}/status`, { status: newStatus });
      setOrders(orders.map(order => order.id === id ? { ...order, status: newStatus } : order));
      if (selectedOrder?.id === id) setSelectedOrder({ ...selectedOrder, status: newStatus });
      toast.success("تم تحديث حالة الطلب بنجاح", { id: toastId });
    } catch (error) {
      toast.error("فشل في تحديث الحالة", { id: toastId });
    }
  };

  const handlePriceUpdate = async () => {
    if (!price || isNaN(price)) return toast.error("يرجى إدخال قيمة سعر صحيحة");

    setIsUpdatingPrice(true);
    const toastId = toast.loading("جاري حفظ التسعيرة...");
    try {
      await axios.patch(`${import.meta.env.VITE_API_URL}/custom/orders/${selectedOrder.id}/price`, { price: Number(price) });

      setOrders(orders.map(order => order.id === selectedOrder.id ? { ...order, price: Number(price) } : order));
      setSelectedOrder({ ...selectedOrder, price: Number(price) });
      toast.success("تم اعتماد وحفظ السعر بنجاح", { id: toastId });
    } catch (error) {
      toast.error("فشل في حفظ السعر", { id: toastId });
    } finally {
      setIsUpdatingPrice(false);
    }
  };

  const openDetails = (order) => {
    setSelectedOrder(order);
    setPrice(order.price || "");
    setIsModalOpen(true);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'approved':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'reviewing':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'shipping':
        return 'bg-cyan-50 text-cyan-700 border-cyan-200';
      case 'completed':
        return 'bg-slate-100 text-slate-700 border-slate-300';
      case 'cancelled':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      default:
        return 'bg-blue-50 text-blue-700 border-blue-200';
    }
  };

  const statusLabels = {
    new: "جديد",
    reviewing: "قيد المراجعة الفنية",
    approved: "معتمد للتنفيذ",
    shipping: "جاري الشحن",
    completed: "مكتمل ومُسلّم",
    cancelled: "ملغي"
  };

  return (
    <div className="space-y-6" dir="rtl">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-800">
            <Sparkles className="w-5 h-5 text-slate-800" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 tracking-wide">الطلبات والتصاميم المخصصة (Atelier Custom)</h2>
            <p className="text-slate-500 text-xs mt-0.5">دراسة أفكار العملاء، اعتماد المخطط، وتحديد التسعيرة</p>
          </div>
        </div>

        <button
          onClick={() => fetchOrders(page)}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 text-xs font-bold transition-all active:scale-95"
        >
          <RefreshCcw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          <span>تحديث القائمة</span>
        </button>
      </div>

      {/* Table Container */}
      <div className="rounded-2xl bg-white border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70">
                <th className="p-4 text-xs font-bold uppercase tracking-wider text-slate-600">العميل</th>
                <th className="p-4 text-xs font-bold uppercase tracking-wider text-slate-600">تفاصيل الفكرة</th>
                <th className="p-4 text-xs font-bold uppercase tracking-wider text-slate-600">التسعير المعتمد</th>
                <th className="p-4 text-xs font-bold uppercase tracking-wider text-slate-600">المرحلة</th>
                <th className="p-4 text-xs font-bold uppercase tracking-wider text-slate-600 text-center">الإجراءات والتحكم</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan="5" className="p-16 text-center text-slate-500">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-8 h-8 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" />
                      <span className="text-xs font-mono">جاري جلب المخططات الخاصة...</span>
                    </div>
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-12 text-center text-slate-500 text-sm">
                    لا توجد طلبات خاصة مسجلة حالياً
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50/70 transition-colors">
                    
                    {/* Customer */}
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 font-bold text-xs">
                          {order.customerName?.charAt(0) || 'ع'}
                        </div>
                        <div>
                          <div className="font-bold text-xs text-slate-900">{order.customerName}</div>
                          <div className="text-[11px] text-slate-500 font-mono mt-0.5 flex items-center gap-1" dir="ltr">
                            <Phone className="w-3 h-3 text-slate-400" />
                            <span>{order.customerPhone}</span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Description preview */}
                    <td className="p-4 max-w-[280px]">
                      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                        {order.description || 'بدون وصف إضافي'}
                      </p>
                    </td>

                    {/* Price */}
                    <td className="p-4">
                      {order.price ? (
                        <span className="font-mono font-bold text-sm text-slate-900">
                          {Number(order.price).toLocaleString()} <span className="text-[11px] text-slate-500 font-sans">د.أ</span>
                        </span>
                      ) : (
                        <span className="text-amber-800 text-xs font-bold px-2.5 py-1 rounded-md bg-amber-50 border border-amber-200">
                          بانتظار التسعير
                        </span>
                      )}
                    </td>

                    {/* Status Badge */}
                    <td className="p-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${getStatusBadge(order.status)}`}>
                        {statusLabels[order.status] || order.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="p-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        
                        {/* View modal */}
                        <button
                          onClick={() => openDetails(order)}
                          className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 transition-all active:scale-95"
                          title="عرض التفاصيل والتسعير"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        <div className="w-[1px] h-5 bg-slate-200 mx-1" />

                        {/* Quick state flow buttons */}
                        {order.status === 'new' && (
                          <>
                            <button
                              onClick={() => handleStatusUpdate(order.id, 'reviewing')}
                              className="p-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 transition-all"
                              title="بدء المراجعة الفنية"
                            >
                              <Clock className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleStatusUpdate(order.id, 'cancelled')}
                              className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 transition-all"
                              title="رفض الطلب"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          </>
                        )}

                        {order.status === 'reviewing' && (
                          <>
                            <button
                              onClick={() => handleStatusUpdate(order.id, 'approved')}
                              className="p-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 transition-all"
                              title="اعتماد الطلب للتصنيع"
                            >
                              <CheckCircle2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleStatusUpdate(order.id, 'cancelled')}
                              className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 transition-all"
                              title="رفض الطلب"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          </>
                        )}

                        {order.status === 'approved' && (
                          <button
                            onClick={() => handleStatusUpdate(order.id, 'shipping')}
                            className="p-2 rounded-xl bg-cyan-50 hover:bg-cyan-100 text-cyan-700 border border-cyan-200 transition-all"
                            title="بدء الشحن والتسليم"
                          >
                            <PackageCheck className="w-4 h-4" />
                          </button>
                        )}

                        {order.status === 'shipping' && (
                          <button
                            onClick={() => handleStatusUpdate(order.id, 'completed')}
                            className="p-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 transition-all"
                            title="إتمام الطلب بنجاح"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                        )}

                      </div>
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-50/50">
          <p className="text-xs text-slate-500">
            صفحة <span className="text-slate-900 font-mono font-bold">{page}</span> من <span className="text-slate-900 font-mono font-bold">{totalPages}</span>
          </p>
          <div className="flex gap-1.5">
            <button
              disabled={page === 1}
              onClick={() => setPage(p => p - 1)}
              className="p-2 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              disabled={page === totalPages}
              onClick={() => setPage(p => p + 1)}
              className="p-2 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white border border-slate-200 rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">

            {/* Modal Header */}
            <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/60">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700">
                  <Sparkles className="w-4 h-4 text-slate-700" />
                </div>
                <h3 className="text-sm font-bold text-slate-900">إدارة وتسعير الطلب الخاص #{selectedOrder.id}</h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-500 hover:text-slate-800 transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-5 overflow-y-auto space-y-5 flex-1">

              {/* Price Setup Card */}
              <div className="bg-emerald-50 border border-emerald-200 p-5 rounded-2xl">
                <label className="text-xs font-bold text-emerald-800 mb-2.5 flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-emerald-600" />
                  <span>تحديد واعتماد تسعيرة المشغولة</span>
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <input
                      type="number"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder="أدخل السعر الإجمالي بالدينار الأردني..."
                      className="w-full px-4 py-2.5 rounded-xl bg-white border border-emerald-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500 text-sm font-mono shadow-sm"
                    />
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-emerald-700 font-mono">د.أ</span>
                  </div>
                  <button
                    onClick={handlePriceUpdate}
                    disabled={isUpdatingPrice}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-2 disabled:opacity-50 shadow-sm"
                  >
                    {isUpdatingPrice ? <RefreshCcw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    <span>حفظ واعتماد</span>
                  </button>
                </div>
                <p className="text-[11px] text-emerald-700 mt-2 font-mono">
                  * يتم إظهار السعر المعتمد فوراً في لوحة حساب العميل لإكمال الدفع
                </p>
              </div>

              {/* Customer Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] font-mono tracking-widest uppercase text-slate-500 block mb-1">اسم العميل</span>
                  <p className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <User className="w-3.5 h-3.5 text-slate-500" /> {selectedOrder.customerName}
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] font-mono tracking-widest uppercase text-slate-500 block mb-1">رقم الهاتف</span>
                  <p className="text-sm font-bold text-slate-900 flex items-center gap-2 font-mono" dir="ltr">
                    <Phone className="w-3.5 h-3.5 text-slate-500" /> {selectedOrder.customerPhone}
                  </p>
                </div>
              </div>

              {/* Description */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-mono tracking-widest uppercase text-slate-500 block mb-2">وصف الفكرة ومتطلبات التصميم</span>
                <p className="text-xs text-slate-700 leading-relaxed bg-white p-3 rounded-xl border border-slate-200">
                  "{selectedOrder.description}"
                </p>
              </div>

              {/* Image Preview */}
              {selectedOrder.imagePath && (
                <div>
                  <span className="text-[10px] font-mono tracking-widest uppercase text-slate-500 block mb-2">الصورة أو المخطط المرفق</span>
                  <div className="rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 p-2">
                    <img
                      src={`${import.meta.env.VITE_URL}/uploads/${selectedOrder.imagePath}`}
                      alt="Design Preview"
                      className="w-full max-h-[380px] object-contain rounded-xl"
                    />
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default CustomOrdersPage;