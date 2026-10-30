import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { 
  MessageCircle,
  Loader2,
  Calendar,
  DollarSign,
  Clock,
  User,
  Briefcase,
  Hash,
  Sparkles,
  ChevronDown,
  RefreshCw,
  Gift,
  Plus,
  Trash2,
  X,
  Phone,
  Save
} from 'lucide-react';

function SpecialOrdersList() {
  const [specialOrders, setSpecialOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newOrder, setNewOrder] = useState({
    customerName: '',
    phone: '',
    occasion: '',
    budget: '',
    description: ''
  });

  const token = localStorage.getItem("token");

  const fetchSpecialOrders = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/admin/special-orders`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = response.data;
      const list = Array.isArray(data) ? data : (Array.isArray(data?.data) ? data.data : []);
      setSpecialOrders(list);
    } catch (err) {
      console.error(err);
      toast.error("فشل في تحميل طلبات المناسبات والهدايا");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSpecialOrders();
  }, []);

  const updateStatus = async (id, newStatus) => {
    const toastId = toast.loading("جاري تحديث الحالة...");
    try {
      await axios.patch(`${import.meta.env.VITE_API_URL}/admin/special-orders/${id}`, 
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("تم تحديث حالة الطلب بنجاح", { id: toastId });
      fetchSpecialOrders();
    } catch (err) {
      toast.error("فشل تحديث الحالة", { id: toastId });
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`هل أنت متأكد من حذف طلب العميل "${name || ''}" نهائياً؟`)) return;
    const toastId = toast.loading("جاري حذف الطلب...");
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/admin/special-orders/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("تم حذف الطلب بنجاح", { id: toastId });
      setSpecialOrders(prev => prev.filter(o => o.id !== id));
    } catch (err) {
      toast.error("فشل حذف الطلب", { id: toastId });
    }
  };

  const handleCreateOrder = async (e) => {
    e.preventDefault();
    if (!newOrder.customerName.trim() || !newOrder.phone.trim()) {
      return toast.error("يرجى إدخال اسم العميل ورقم الهاتف");
    }

    setIsSubmitting(true);
    const toastId = toast.loading("جاري تسجيل الطلب...");
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/admin/special-orders`, newOrder, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("تم تسجيل طلب المناسبة بنجاح", { id: toastId });
      setIsModalOpen(false);
      setNewOrder({
        customerName: '',
        phone: '',
        occasion: '',
        budget: '',
        description: ''
      });
      fetchSpecialOrders();
    } catch (err) {
      toast.error("فشل في تسجيل الطلب", { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[360px] gap-3">
        <div className="w-10 h-10 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" />
        <span className="text-slate-500 text-xs font-mono tracking-widest uppercase">جاري تحميل طلبات المناسبات الخاصة...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6" dir="rtl">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-800">
            <Gift className="w-5 h-5 text-slate-800" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 tracking-wide">طلبات الهدايا والمناسبات المخصصة</h2>
            <p className="text-slate-500 text-xs mt-0.5">
              إجمالي الأفكار المسجلة: <span className="text-slate-900 font-mono font-bold">{specialOrders.length}</span> طلب
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-sm active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>تسجيل طلب مناسبة</span>
          </button>

          <button
            onClick={fetchSpecialOrders}
            className="inline-flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 text-xs font-bold transition-all active:scale-95"
            title="تحديث السجل"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Cards List */}
      <div className="space-y-4">
        {specialOrders.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 shadow-sm">
            <Gift className="w-12 h-12 text-slate-400 mx-auto mb-3" />
            <p className="text-slate-500 text-sm font-bold">لا توجد طلبات مناسبات خاصة حالياً</p>
            <p className="text-slate-400 text-xs mt-1">يمكنك تسجيل طلب جديد بالنقر على "تسجيل طلب مناسبة" أعلاه</p>
          </div>
        ) : (
          specialOrders.map((order) => (
            <div 
              key={order.id} 
              className="bg-white border border-slate-200 hover:border-slate-300 transition-all duration-300 rounded-2xl overflow-hidden flex flex-col lg:flex-row shadow-sm"
            >
              {/* Status accent strip */}
              <div className={`w-full lg:w-1.5 ${
                order.status === 'جديد' ? 'bg-amber-400' : 
                order.status === 'تم التواصل' ? 'bg-emerald-500' : 'bg-slate-300'
              }`} />

              <div className="flex-1 p-5 md:p-6 space-y-4">
                
                {/* Header row */}
                <div className="flex flex-wrap justify-between items-center gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 font-bold text-sm">
                      <User className="w-5 h-5 text-slate-600" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-base">{order.customerName || 'عميل'}</h4>
                      <div className="flex items-center gap-2 text-slate-500 text-xs mt-0.5 font-mono">
                        <span>#{order.id}</span>
                        <span>•</span>
                        <Clock className="w-3 h-3 text-slate-400" />
                        <span>{order.createdAt ? new Date(order.createdAt).toLocaleDateString('ar-EG') : '—'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Status selector & actions */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500 font-bold">الحالة:</span>
                    <select 
                      value={order.status || 'جديد'}
                      onChange={(e) => updateStatus(order.id, e.target.value)}
                      className="text-xs font-bold px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 cursor-pointer outline-none focus:border-slate-400 transition-all"
                    >
                      <option value="جديد">جديد</option>
                      <option value="تم التواصل">تم التواصل</option>
                      <option value="ملغي">ملغي</option>
                    </select>

                    <button
                      onClick={() => handleDelete(order.id, order.customerName)}
                      className="p-1.5 rounded-lg bg-slate-100 hover:bg-rose-50 text-slate-400 hover:text-rose-600 border border-slate-200 transition-colors"
                      title="حذف الطلب"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Info highlights */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <Briefcase className="w-4 h-4 text-slate-500" />
                    <div>
                      <p className="text-[10px] text-slate-500 uppercase font-mono font-bold">المناسبة</p>
                      <p className="text-xs font-bold text-slate-900 mt-0.5">{order.occasion || 'غير محدد'}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 bg-emerald-50/50 rounded-xl border border-emerald-100">
                    <DollarSign className="w-4 h-4 text-emerald-600" />
                    <div>
                      <p className="text-[10px] text-emerald-700 uppercase font-mono font-bold">الميزانية المتوقعة</p>
                      <p className="text-xs font-bold text-emerald-700 mt-0.5 font-mono">
                        {order.budget ? `${Number(order.budget).toLocaleString()} د.أ` : 'لم تحدد'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                  <p className="text-[11px] text-slate-600 font-bold mb-1 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-slate-500" /> الفكرة المطلوبة:
                  </p>
                  <p className="text-xs text-slate-700 leading-relaxed">
                    "{order.description || 'لا يوجد وصف تفصيلي'}"
                  </p>
                </div>

              </div>

              {/* WhatsApp Action sidebar */}
              <div className="p-5 lg:w-56 bg-slate-50/60 border-t lg:border-t-0 lg:border-r border-slate-200 flex flex-col justify-center items-center gap-2">
                <a 
                  href={`https://wa.me/${String(order.phone || '').replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`أهلاً بك ${order.customerName}، معك متجر Elite Silver 925 للفخامة والفضة الإسترلينية. بخصوص طلبك المخصص لمناسبة (${order.occasion || 'الخاصة'})، يسعدنا مناقشة التفاصيل معك...`)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full bg-[#25D366] hover:bg-[#20ba5a] text-white py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-sm active:scale-95"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>تواصل واتساب</span>
                </a>
                <span className="text-[11px] text-slate-500 font-mono font-bold" dir="ltr">{order.phone}</span>
              </div>

            </div>
          ))
        )}
      </div>

      {/* New Order Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white border border-slate-200 rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
            
            <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/60">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700">
                  <Gift className="w-4 h-4 text-slate-700" />
                </div>
                <h3 className="text-sm font-bold text-slate-900">تسجيل طلب مناسبة وهدية خاصة</h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-500 hover:text-slate-800 transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateOrder} className="p-5 space-y-4">
              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1">اسم العميل *</label>
                <input
                  type="text"
                  required
                  value={newOrder.customerName}
                  onChange={(e) => setNewOrder({...newOrder, customerName: e.target.value})}
                  placeholder="مثال: ريم الأحمد"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 outline-none focus:border-slate-400 font-bold"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1">رقم الهاتف (واتساب) *</label>
                <input
                  type="text"
                  required
                  value={newOrder.phone}
                  onChange={(e) => setNewOrder({...newOrder, phone: e.target.value})}
                  placeholder="079XXXXXXXX"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 outline-none focus:border-slate-400 font-mono font-bold"
                  dir="ltr"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-600 block mb-1">المناسبة</label>
                  <input
                    type="text"
                    value={newOrder.occasion}
                    onChange={(e) => setNewOrder({...newOrder, occasion: e.target.value})}
                    placeholder="تخرج، خطوبة، عيد ميلاد..."
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 outline-none focus:border-slate-400 font-semibold"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-600 block mb-1">الميزانية المتوقعة (د.أ)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={newOrder.budget}
                    onChange={(e) => setNewOrder({...newOrder, budget: e.target.value})}
                    placeholder="50"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 outline-none focus:border-slate-400 font-mono font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1">تفاصيل الفكرة ومتطلبات الهدية</label>
                <textarea
                  rows={3}
                  value={newOrder.description}
                  onChange={(e) => setNewOrder({...newOrder, description: e.target.value})}
                  placeholder="اكتب تفاصيل طلب الهدية أو الصياغة الخاصة..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 outline-none focus:border-slate-400 leading-relaxed"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-slate-900 hover:bg-slate-800 text-white py-2.5 rounded-xl font-bold text-xs shadow-sm flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                >
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin text-white" /> : <Save className="w-4 h-4" />}
                  <span>حفظ الطلب</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 rounded-xl font-bold text-xs transition-all"
                >
                  إلغاء
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}

export default SpecialOrdersList;