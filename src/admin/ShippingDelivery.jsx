import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Truck, 
  MapPin, 
  Edit3, 
  Check, 
  X, 
  Plus, 
  Trash2, 
  Loader2, 
  AlertCircle,
  RefreshCw
} from 'lucide-react';
import toast from 'react-hot-toast';

const ShippingDelivery = () => {
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [formData, setFormData] = useState({ name: '', price: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({ name: '', price: '' });

  const API_URL = `${import.meta.env.VITE_API_URL}/city/shipping-cities`;

  const fetchCities = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(API_URL);
      setCities(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      setError('فشل في تحميل تسعيرات الشحن. يرجى التحقق من اتصال السيرفر.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    fetchCities(); 
  }, []);

  const handleAddCity = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.price) return;
    
    setIsSubmitting(true);
    const toastId = toast.loading('جاري إضافة الوجهة...');
    try {
      const response = await axios.post(API_URL, formData);
      setCities(prev => [...prev, response.data]);
      setFormData({ name: '', price: '' });
      toast.success('تمت إضافة المنطقة بنجاح', { id: toastId });
    } catch (err) {
      toast.error('خطأ في إضافة الوجهة', { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  const startEdit = (city) => {
    setEditingId(city.id);
    setEditData({ name: city.name, price: city.price });
  };

  const handleUpdate = async (id) => {
    const toastId = toast.loading('جاري حفظ التعديل...');
    try {
      setIsSubmitting(true);
      const response = await axios.put(`${API_URL}/${id}`, editData);
      setCities(cities.map(c => c.id === id ? response.data : c));
      setEditingId(null);
      toast.success('تم تحديث تسعيرة التوصيل', { id: toastId });
    } catch (err) {
      toast.error('فشل تحديث البيانات', { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`هل أنت متأكد من حذف منطقة الشحن "${name || ''}"؟`)) return;
    const toastId = toast.loading('جاري حذف المنطقة...');
    try {
      await axios.delete(`${API_URL}/${id}`);
      setCities(cities.filter(c => c.id !== id));
      toast.success('تم حذف المنطقة بنجاح', { id: toastId });
    } catch (err) {
      toast.error('فشل حذف الوجهة', { id: toastId });
    }
  };

  return (
    <div className="space-y-6" dir="rtl">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-800">
            <Truck className="w-5 h-5 text-slate-800" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 tracking-wide">تسعيرات الشحن والتوصيل للمحافظات</h2>
            <p className="text-slate-500 text-xs mt-0.5">
              إدارة تعرفة الشحن اللوجستي الآمن لكافة المدن الأردنية
            </p>
          </div>
        </div>

        <button 
          onClick={fetchCities}
          className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 transition-all active:scale-95"
          title="تحديث القائمة"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Form to add city */}
        <div className="lg:col-span-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Plus className="w-4 h-4 text-emerald-600" />
              <span>إضافة وجهة ومحافظة جديدة</span>
            </h3>

            <form onSubmit={handleAddCity} className="space-y-3.5">
              <div>
                <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block mb-1">
                  اسم المحافظة / المدينة
                </label>
                <input
                  type="text" 
                  required
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 outline-none focus:border-slate-400 transition-all font-sans"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="مثال: عمان، إربد، العقبة..."
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block mb-1">
                  تكلفة الشحن (بالدينار الأردني)
                </label>
                <div className="relative">
                  <input
                    type="number" 
                    required 
                    step="0.01"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 outline-none focus:border-slate-400 transition-all font-mono"
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                    placeholder="3.00"
                  />
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-500 font-mono">د.أ</span>
                </div>
              </div>

              <button
                type="submit" 
                disabled={isSubmitting}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white py-2.5 rounded-xl font-bold text-xs shadow-sm active:scale-95 transition-all flex justify-center items-center gap-2 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                ) : (
                  <>
                    <Truck className="w-4 h-4 text-white stroke-[2.5]" />
                    <span>تثبيت تعريفة المنطقة</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Cities List */}
        <div className="lg:col-span-8">
          {loading ? (
            <div className="flex flex-col items-center justify-center min-h-[260px] gap-3">
              <div className="w-8 h-8 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" />
              <span className="text-slate-500 text-xs font-mono tracking-widest uppercase">جاري تحميل وجهات الشحن...</span>
            </div>
          ) : error ? (
            <div className="bg-rose-50 border border-rose-200 p-4 rounded-xl flex items-center text-rose-700 text-xs">
              <AlertCircle className="w-4 h-4 ml-2 flex-shrink-0" />
              <span>{error}</span>
            </div>
          ) : cities.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 shadow-sm">
              <Truck className="w-10 h-10 text-slate-400 mx-auto mb-2" />
              <p className="text-slate-500 text-xs">قائمة المدن فارغة، أضف وجهتك الأولى من النموذج الجانبي</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <AnimatePresence mode="popLayout">
                {cities.map((city) => (
                  <motion.div
                    key={city.id} 
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className={`bg-white p-4 rounded-xl border transition-all ${
                      editingId === city.id 
                        ? 'border-indigo-400 shadow-md ring-2 ring-indigo-50' 
                        : 'border-slate-200 hover:border-slate-300 shadow-sm'
                    }`}
                  >
                    {editingId === city.id ? (
                      /* Edit Mode */
                      <div className="space-y-2.5">
                        <input 
                          className="w-full text-xs font-bold px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 outline-none focus:border-slate-400"
                          value={editData.name}
                          onChange={(e) => setEditData({...editData, name: e.target.value})}
                        />
                        <div className="relative">
                          <input 
                            type="number"
                            step="0.01"
                            className="w-full text-xs font-mono font-bold px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 outline-none focus:border-slate-400"
                            value={editData.price}
                            onChange={(e) => setEditData({...editData, price: e.target.value})}
                          />
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-500 font-mono">د.أ</span>
                        </div>
                        <div className="flex gap-2 pt-1">
                          <button 
                            onClick={() => handleUpdate(city.id)} 
                            className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-1.5 rounded-lg text-xs font-bold flex justify-center items-center gap-1 transition-all"
                          >
                            <Check className="w-3.5 h-3.5" /> حفظ
                          </button>
                          <button 
                            onClick={() => setEditingId(null)} 
                            className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-1.5 rounded-lg text-xs font-bold flex justify-center items-center gap-1 transition-all"
                          >
                            <X className="w-3.5 h-3.5" /> إلغاء
                          </button>
                        </div>
                      </div>
                    ) : (
                      /* View Mode */
                      <div className="flex justify-between items-center gap-2">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-9 h-9 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 flex-shrink-0">
                            <MapPin className="w-4 h-4 text-slate-600" />
                          </div>
                          <div className="min-w-0">
                            <h4 className="font-bold text-slate-900 text-xs truncate">{city.name}</h4>
                            <p className="text-[11px] text-slate-500 font-mono font-bold mt-0.5">
                              {Number(city.price || 0).toLocaleString()} <span className="font-sans">د.أ</span>
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-1">
                          <button 
                            onClick={() => startEdit(city)} 
                            className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
                            title="تعديل التعريفة"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button 
                            onClick={() => handleDelete(city.id, city.name)} 
                            className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                            title="حذف المنطقة"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>

      </div>

    </div>
  );
};

export default ShippingDelivery;