import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiTruck, FiMapPin, FiEdit2, FiCheck, FiX, 
  FiPlus, FiTrash2, FiLoader, FiAlertCircle 
} from 'react-icons/fi';
import { useLanguage } from '../contexts/LanguageContext';

const ShippingDelivery = () => {
  const { isRTL } = useLanguage();
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // حالات الإضافة والتعديل
  const [formData, setFormData] = useState({ name: '', price: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({ name: '', price: '' });

  const API_URL = `${import.meta.env.VITE_API_URL}/city/shipping-cities`;

  const fetchCities = async () => {
    try {
      setLoading(true);
      const response = await axios.get(API_URL);
      setCities(response.data);
    } catch (err) {
      setError('فشل في تحميل البيانات. يرجى التحقق من اتصال الخادم.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCities(); }, []);

  // إضافة مدينة
  const handleAddCity = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.price) return;
    try {
      setIsSubmitting(true);
      const response = await axios.post(API_URL, formData);
      setCities([...cities, response.data]);
      setFormData({ name: '', price: '' });
    } catch (err) {
      alert('خطأ في الإضافة');
    } finally {
      setIsSubmitting(false);
    }
  };

  // تفعيل وضع التعديل
  const startEdit = (city) => {
    setEditingId(city.id);
    setEditData({ name: city.name, price: city.price });
  };

  // حفظ التعديل
  const handleUpdate = async (id) => {
    try {
      setIsSubmitting(true);
      const response = await axios.put(`${API_URL}/${id}`, editData);
      setCities(cities.map(c => c.id === id ? response.data : c));
      setEditingId(null);
    } catch (err) {
      alert('فشل تحديث البيانات');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('هل أنت متأكد؟')) return;
    try {
      await axios.delete(`${API_URL}/${id}`);
      setCities(cities.filter(c => c.id !== id));
    } catch (err) {
      alert('فشل الحذف');
    }
  };

  return (
    <div className={`min-h-screen bg-slate-50 pb-20 ${isRTL ? 'font-cairo' : 'font-sans'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <section className="pt-28 pb-20 bg-gradient-to-br from-indigo-700 via-blue-600 to-cyan-500 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
            <h1 className="text-4xl md:text-6xl font-black mb-4 tracking-tight">لوحة تكاليف الشحن</h1>
            <p className="text-blue-100 text-lg opacity-90">إدارة المناطق والأسعار اللوجستية لمتجرك</p>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 -mt-12">
        <div className="grid lg:grid-cols-12 gap-8">
          
          {/* Form Side */}
          <div className="lg:col-span-4">
            <motion.div className="bg-white p-8 rounded-3xl shadow-2xl border border-white sticky top-28">
              <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <div className="p-2 bg-blue-100 rounded-lg text-blue-600"><FiPlus /></div>
                إضافة وجهة جديدة
              </h3>
              <form onSubmit={handleAddCity} className="space-y-5">
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block">اسم المنطقة</label>
                  <input
                    type="text" required
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:bg-white focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="مثال: إربد، عمان..."
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block">سعر التوصيل (JOD)</label>
                  <input
                    type="number" required step="0.01"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:bg-white focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                    placeholder="0.00"
                  />
                </div>
                <button
                  type="submit" disabled={isSubmitting}
                  className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 active:scale-[0.98] transition-all flex justify-center items-center gap-2"
                >
                  {isSubmitting ? <FiLoader className="animate-spin" /> : <><FiTruck /> تثبيت المنطقة</>}
                </button>
              </form>
            </motion.div>
          </div>

          {/* List Side */}
          <div className="lg:col-span-8">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[1, 2, 3, 4].map(i => <div key={i} className="h-24 bg-gray-200 animate-pulse rounded-2xl" />)}
              </div>
            ) : error ? (
              <div className="bg-red-50 border-r-4 border-red-500 p-6 rounded-xl flex items-center text-red-700">
                <FiAlertCircle className="text-2xl ml-3" /> {error}
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 gap-4">
                <AnimatePresence mode="popLayout">
                  {cities.map((city) => (
                    <motion.div
                      key={city.id} layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className={`bg-white p-5 rounded-2xl border transition-all ${editingId === city.id ? 'ring-2 ring-blue-500 border-transparent shadow-xl' : 'border-gray-100 shadow-sm hover:shadow-md'}`}
                    >
                      {editingId === city.id ? (
                        /* وضع التعديل */
                        <div className="space-y-3">
                          <input 
                            className="w-full text-sm font-bold p-2 bg-gray-50 rounded-lg outline-none border focus:border-blue-400"
                            value={editData.name}
                            onChange={(e) => setEditData({...editData, name: e.target.value})}
                          />
                          <input 
                            type="number"
                            className="w-full text-sm p-2 bg-gray-50 rounded-lg outline-none border focus:border-blue-400"
                            value={editData.price}
                            onChange={(e) => setEditData({...editData, price: e.target.value})}
                          />
                          <div className="flex gap-2 pt-2">
                            <button onClick={() => handleUpdate(city.id)} className="flex-1 bg-green-500 text-white py-2 rounded-lg text-sm font-bold flex justify-center items-center gap-1"><FiCheck /> حفظ</button>
                            <button onClick={() => setEditingId(null)} className="flex-1 bg-gray-100 text-gray-600 py-2 rounded-lg text-sm font-bold flex justify-center items-center gap-1"><FiX /> إلغاء</button>
                          </div>
                        </div>
                      ) : (
                        /* وضع العرض */
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 text-xl font-bold">
                              <FiMapPin />
                            </div>
                            <div>
                              <h4 className="font-bold text-gray-800 leading-tight">{city.name}</h4>
                              <p className="text-xs text-gray-400 mt-1 font-medium italic">{city.price} د.أ</p>
                            </div>
                          </div>
                          
                          <div className="flex gap-1">
                            <button onClick={() => startEdit(city)} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                              <FiEdit2 size={18} />
                            </button>
                            <button onClick={() => handleDelete(city.id)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                              <FiTrash2 size={18} />
                            </button>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
            
            {!loading && cities.length === 0 && (
              <div className="bg-white rounded-3xl p-20 text-center border-2 border-dashed border-gray-200">
                 <FiTruck className="mx-auto text-6xl text-gray-100 mb-4" />
                 <p className="text-gray-400 font-medium">قائمة المدن فارغة، ابدأ بإضافة وجهات الشحن.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShippingDelivery;