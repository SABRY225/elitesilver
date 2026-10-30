import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useOutletContext } from 'react-router-dom';
import { 
  Edit3, 
  Trash2, 
  Plus, 
  X, 
  UploadCloud, 
  Layers, 
  FolderOpen
} from 'lucide-react';

function CategoriesList() {
  let outletContext = {};
  try {
    outletContext = useOutletContext() || {};
  } catch (e) {
    outletContext = {};
  }

  const isDarkMode = outletContext.isDarkMode !== undefined ? outletContext.isDarkMode : false;

  const [categories, setCategories] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCat, setEditingCat] = useState(null);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({ name: '' });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const token = localStorage.getItem("token");

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/categories`);
      setCategories(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      toast.error("فشل في تحميل تصنيفات المجوهرات");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    fetchCategories(); 
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return toast.error("يرجى إدخال اسم التصنيف");

    const toastId = toast.loading(editingCat ? "جاري تحديث التصنيف..." : "جاري إنشاء التصنيف...");
    const data = new FormData();
    data.append('name', formData.name.trim());
    if (imageFile) data.append('image', imageFile);

    try {
      const config = {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      };

      if (editingCat) {
        await axios.put(`${import.meta.env.VITE_API_URL}/admin/categories/${editingCat.id}`, data, config);
        toast.success("تم تحديث التصنيف بنجاح", { id: toastId });
      } else {
        await axios.post(`${import.meta.env.VITE_API_URL}/admin/categories`, data, config);
        toast.success("تم إنشاء التصنيف الجديد بنجاح", { id: toastId });
      }
      closeModal();
      fetchCategories();
    } catch (err) {
      toast.error(err.response?.data?.error || "حدث خطأ أثناء الحفظ", { id: toastId });
    }
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`هل أنت متأكد من حذف تصنيف "${name}"؟ تأكد من عدم ارتباطه بمنتجات نشطة.`)) {
      const toastId = toast.loading("جاري حذف التصنيف...");
      try {
        await axios.delete(`${import.meta.env.VITE_API_URL}/admin/categories/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success("تم حذف التصنيف", { id: toastId });
        fetchCategories();
      } catch (err) {
        toast.error("فشل الحذف - التصنيف مرتبط بمنتجات في المتجر", { id: toastId });
      }
    }
  };

  const openModal = (cat = null) => {
    if (cat) {
      setEditingCat(cat);
      setFormData({ name: cat.name });
      setImagePreview(cat.image);
    } else {
      setEditingCat(null);
      setFormData({ name: '' });
      setImagePreview(null);
    }
    setImageFile(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingCat(null);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[360px] gap-3 font-cairo">
        <div className="w-10 h-10 border-2 border-silver-300 border-t-transparent rounded-full animate-spin" />
        <span className="text-silver-400 text-sm font-mono tracking-widest uppercase">جاري مزامنة تصنيفات المتجر...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 font-cairo" dir="rtl">

      {/* Header */}
      <div className={`flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-5 rounded-3xl border transition-colors ${
        isDarkMode ? 'bg-[#0c0d12]/90 border-white/10' : 'bg-slate-50 border-slate-200'
      }`}>
        <div className="flex items-center gap-3">
          <div className={`w-11 h-11 rounded-2xl border flex items-center justify-center ${
            isDarkMode ? 'bg-silver-400/10 border-silver-400/20 text-silver-300' : 'bg-white border-slate-200 text-slate-800'
          }`}>
            <Layers className="w-6 h-6 text-silver-200" />
          </div>
          <div>
            <h2 className={`text-xl sm:text-2xl font-black ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              أقسام ومجموعات المجوهرات
            </h2>
            <p className={`text-sm mt-0.5 font-medium ${isDarkMode ? 'text-silver-400' : 'text-slate-500'}`}>
              هيكلة وتصنيف مصوغات الفضة 925 لتجربة تسوق فاخرة
            </p>
          </div>
        </div>

        <button 
          onClick={() => openModal()}
          className={`w-full sm:w-auto px-6 py-3 rounded-2xl font-black text-sm shadow-md flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer ${
            isDarkMode 
              ? 'bg-gradient-to-r from-silver-300 via-silver-200 to-silver-400 hover:brightness-110 text-black' 
              : 'bg-slate-900 hover:bg-black text-white'
          }`}
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>إضافة تصنيف جديد</span>
        </button>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
        {categories.map((cat) => (
          <div 
            key={cat.id} 
            className={`group relative rounded-3xl border overflow-hidden shadow-xl transition-all duration-300 flex flex-col justify-between ${
              isDarkMode 
                ? 'bg-[#0c0d12]/90 border-white/10 hover:border-white/20' 
                : 'bg-white border-slate-200 hover:border-slate-300 shadow-slate-200/50'
            }`}
          >
            {/* Image Section */}
            <div className={`h-48 w-full relative overflow-hidden ${isDarkMode ? 'bg-black/60' : 'bg-slate-100'}`}>
              <img 
                src={cat.image?.startsWith('http') ? cat.image : `${import.meta.env.VITE_URL}/${cat.image}`} 
                alt={cat.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                onError={(e) => { e.target.style.display = 'none'; }}
              />
              <div className={`absolute inset-0 bg-gradient-to-t via-transparent to-transparent opacity-80 ${
                isDarkMode ? 'from-[#0c0d12]' : 'from-slate-900/40'
              }`} />
              
              {/* Floating ID badge */}
              <span className={`absolute top-3.5 right-3.5 text-xs font-mono font-bold px-3 py-1 rounded-lg border shadow-sm ${
                isDarkMode ? 'bg-black/80 text-silver-300 border-white/10' : 'bg-white/90 text-slate-800 border-slate-200'
              }`}>
                ID #{cat.id}
              </span>
            </div>

            {/* Content & Actions */}
            <div className="p-5 flex items-center justify-between gap-3">
              <div>
                <h3 className={`font-black text-base transition-colors ${
                  isDarkMode ? 'text-white group-hover:text-silver-200' : 'text-slate-900'
                }`}>
                  {cat.name}
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <button 
                  onClick={() => openModal(cat)} 
                  className={`p-2 rounded-xl border transition-all active:scale-95 cursor-pointer ${
                    isDarkMode 
                      ? 'bg-white/5 hover:bg-white/10 text-silver-300 hover:text-white border-white/10' 
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
                  }`}
                  title="تعديل التصنيف"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => handleDelete(cat.id, cat.name)} 
                  className={`p-2 rounded-xl border transition-all active:scale-95 cursor-pointer ${
                    isDarkMode 
                      ? 'bg-white/5 hover:bg-rose-500/20 text-silver-400 hover:text-rose-400 border-white/10' 
                      : 'bg-slate-100 hover:bg-rose-50 text-rose-600 border-slate-200'
                  }`}
                  title="حذف التصنيف"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal: Add / Edit Category */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[70] flex items-center justify-center p-4">
          <div className={`w-full max-w-md rounded-3xl p-6 sm:p-7 shadow-2xl relative border animate-in fade-in zoom-in-95 duration-200 ${
            isDarkMode ? 'bg-[#0e1017] border-white/15' : 'bg-white border-slate-200'
          }`}>
            
            {/* Header */}
            <div className={`flex justify-between items-center pb-4 mb-5 border-b ${
              isDarkMode ? 'border-white/10' : 'border-slate-100'
            }`}>
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-xl border flex items-center justify-center ${
                  isDarkMode ? 'bg-silver-400/10 border-silver-400/20 text-silver-300' : 'bg-slate-100 border-slate-200 text-slate-800'
                }`}>
                  <FolderOpen className="w-5 h-5 text-silver-200" />
                </div>
                <div>
                  <h3 className={`font-black text-base ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                    {editingCat ? 'تعديل بيانات التصنيف' : 'إضافة تصنيف جديد'}
                  </h3>
                </div>
              </div>
              <button 
                onClick={closeModal} 
                className={`p-2 rounded-xl transition-colors cursor-pointer ${
                  isDarkMode ? 'text-silver-400 hover:text-white hover:bg-white/10' : 'text-slate-400 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Image Upload Area */}
              <div>
                <label className={`text-xs font-bold block mb-1.5 uppercase tracking-wider ${
                  isDarkMode ? 'text-silver-300' : 'text-slate-600'
                }`}>
                  صورة الغلاف للتصنيف
                </label>
                <label className={`h-40 w-full border border-dashed rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all overflow-hidden relative group ${
                  isDarkMode 
                    ? 'border-white/20 bg-black/40 hover:border-silver-400' 
                    : 'border-slate-300 bg-slate-50 hover:border-slate-400'
                }`}>
                  {imagePreview ? (
                    <img 
                      src={imagePreview?.startsWith('blob') || imagePreview?.startsWith('http') ? imagePreview : `${import.meta.env.VITE_URL}/${imagePreview}`} 
                      className="w-full h-full object-cover" 
                      alt="preview" 
                    />
                  ) : (
                    <div className="text-center p-4 space-y-2">
                      <UploadCloud className="w-7 h-7 text-silver-400 mx-auto" />
                      <span className="text-sm font-bold block">انقر لرفع صورة الغلاف</span>
                      <span className="text-xs text-silver-400 font-mono">PNG, WEBP, JPG</span>
                    </div>
                  )}
                  <input type="file" className="hidden" onChange={handleImageChange} accept="image/*" />
                </label>
              </div>

              {/* Title input */}
              <div>
                <label className={`text-xs font-bold block mb-1.5 uppercase tracking-wider ${
                  isDarkMode ? 'text-silver-300' : 'text-slate-600'
                }`}>
                  اسم التصنيف
                </label>
                <input 
                  required 
                  placeholder="مثال: أساور إيطالية فاخرة، خواتم سوليتير..." 
                  className={`w-full px-4 py-3 rounded-xl text-sm font-semibold outline-none transition-all ${
                    isDarkMode 
                      ? 'bg-black/50 border border-white/15 text-white placeholder-silver-500 focus:border-silver-400' 
                      : 'bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:border-slate-400'
                  }`}
                  value={formData.name} 
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>

              {/* Action buttons */}
              <div className="flex gap-3 pt-2">
                <button 
                  type="submit" 
                  className={`flex-[2] py-3 rounded-xl font-black text-sm uppercase tracking-wider transition-all shadow-md active:scale-95 cursor-pointer ${
                    isDarkMode 
                      ? 'bg-gradient-to-r from-silver-300 via-silver-200 to-silver-400 hover:brightness-110 text-black' 
                      : 'bg-slate-900 hover:bg-black text-white'
                  }`}
                >
                  {editingCat ? 'تحديث التصنيف' : 'حفظ التصنيف'}
                </button>
                <button 
                  type="button" 
                  onClick={closeModal} 
                  className={`flex-1 py-3 border rounded-xl font-bold text-sm transition-all text-center cursor-pointer ${
                    isDarkMode 
                      ? 'border-white/10 text-silver-300 hover:bg-white/5' 
                      : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
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

export default CategoriesList;