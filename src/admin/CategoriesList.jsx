import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { FiEdit2, FiTrash2, FiPlus, FiX, FiActivity, FiUploadCloud, FiImage } from 'react-icons/fi';

function CategoriesList() {
  const [categories, setCategories] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCat, setEditingCat] = useState(null);
  const [loading, setLoading] = useState(true);

  // حالة الفورم
  const [formData, setFormData] = useState({ name: '' });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const token = localStorage.getItem("token");

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/categories`);
      setCategories(response.data);
    } catch (err) {
      toast.error("فشل في تحميل التصنيفات");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCategories(); }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('name', formData.name);
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
        toast.success("تم تحديث التصنيف بنجاح");
      } else {
        await axios.post(`${import.meta.env.VITE_API_URL}/admin/categories`, data, config);
        toast.success("تم إنشاء تصنيف جديد");
      }
      closeModal();
      fetchCategories();
    } catch (err) {
      toast.error(err.response?.data?.error || "حدث خطأ أثناء الحفظ");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("حذف التصنيف؟ تأكد من خلوه من المنتجات أولاً.")) {
      try {
        await axios.delete(`${import.meta.env.VITE_API_URL}/admin/categories/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success("تم الحذف");
        fetchCategories();
      } catch (err) {
        toast.error("فشل الحذف - التصنيف مرتبط بمنتجات");
      }
    }
  };

  const openModal = (cat = null) => {
    if (cat) {
      setEditingCat(cat);
      setFormData({ name: cat.name });
      setImagePreview(cat.image); // عرض الصورة الموجودة مسبقاً
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

  if (loading) return (
    <div className="flex flex-col items-center justify-center p-20 space-y-4">
      <FiActivity className="animate-spin text-4xl text-rose-500" />
      <p className="text-xs font-black text-slate-400 uppercase tracking-widest">جاري مزامنة الأقسام...</p>
    </div>
  );

  return (
    <div className="p-4 font-['Tajawal'] text-right" dir="rtl">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h3 className="text-2xl font-black text-slate-900 tracking-tight">أقسام المتجر الرئيسية</h3>
          <p className="text-sm text-slate-400 font-medium">هيكلة تصنيفات المنتجات لعرضها بشكل احترافي للعملاء</p>
        </div>
        <button 
          onClick={() => openModal()}
          className="bg-slate-950 text-white px-6 py-3 rounded-2xl hover:bg-rose-500 transition-all flex items-center gap-3 shadow-xl shadow-slate-200 font-bold active:scale-95"
        >
          <FiPlus size={20} /> إضافة تصنيف جديد
        </button>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {categories.map((cat) => (
          <div key={cat.id} className="group relative bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden shadow-soft hover:shadow-2xl hover:-translate-y-1 transition-all duration-500">
            {/* Image Section */}
            <div className="h-48 w-full bg-slate-50 relative overflow-hidden">
              <img 
                src={cat.image?.startsWith('http') ? cat.image : `${import.meta.env.VITE_URL}/${cat.image}`} 
                alt={cat.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                onError={(e) => { e.target.src = 'https://placehold.co/600x400?text=Category'; }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent opacity-60" />
              
              {/* Floating ID Tag */}
              <span className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-[10px] font-black px-3 py-1 rounded-full text-slate-600 shadow-sm">
                ID: #{cat.id}
              </span>
            </div>

            {/* Content Section */}
            <div className="p-6">
              <h4 className="font-black text-slate-800 text-xl mb-4 group-hover:text-rose-500 transition-colors">{cat.name}</h4>
              
              <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                <div className="flex gap-2">
                  <button onClick={() => openModal(cat)} className="p-2.5 bg-slate-50 text-blue-500 rounded-xl hover:bg-blue-500 hover:text-white transition-all">
                    <FiEdit2 size={16} />
                  </button>
                  <button onClick={() => handleDelete(cat.id)} className="p-2.5 bg-slate-50 text-rose-500 rounded-xl hover:bg-rose-500 hover:text-white transition-all">
                    <FiTrash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal - Modern Design */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-md z-[70] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-[3rem] p-10 shadow-2xl relative animate-in zoom-in slide-in-from-bottom-4 duration-300">
            <button onClick={closeModal} className="absolute top-8 left-8 text-slate-400 hover:text-rose-500 transition-colors">
              <FiX size={28} />
            </button>
            
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-rose-500 rounded-2xl flex items-center justify-center text-white shadow-brand">
                <FiImage size={24} />
              </div>
              <div>
                <h3 className="text-2xl font-black text-slate-900 leading-none">إدارة التصنيف</h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Category Control Suite</p>
              </div>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Image Upload Area */}
              <div className="space-y-3">
                <label className="text-[11px] font-black text-slate-400 uppercase mr-2 tracking-tighter">صورة التصنيف المميزة</label>
                <label className="h-44 w-full border-2 border-dashed border-slate-100 rounded-[2rem] bg-slate-50 flex flex-col items-center justify-center cursor-pointer hover:border-rose-300 hover:bg-rose-50 transition-all overflow-hidden relative group">
                  {imagePreview ? (
                    <img src={imagePreview?.startsWith('http') ? imagePreview : `${import.meta.env.VITE_URL}/${imagePreview}`} className="w-full h-full object-cover" alt="preview" />
                  ) : (
                    <div className="text-center p-6">
                      <FiUploadCloud className="text-3xl text-slate-300 mx-auto mb-2 group-hover:text-rose-500 transition-colors" />
                      <span className="text-[10px] font-black text-slate-400 uppercase group-hover:text-rose-500">رفع صورة التصنيف</span>
                    </div>
                  )}
                  <input type="file" className="hidden" onChange={handleImageChange} accept="image/*" />
                </label>
              </div>

              <div className="space-y-3">
                <label className="text-[11px] font-black text-slate-400 uppercase mr-2 tracking-tighter">عنوان التصنيف</label>
                <input 
                  required 
                  placeholder="مثلاً: مجموعات الخواتم الملكية" 
                  className="w-full p-5 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-rose-500/20 focus:bg-white focus:border-rose-400 transition-all font-bold text-slate-800"
                  value={formData.name} 
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button type="submit" className="flex-[2] bg-slate-950 text-white py-5 rounded-[1.8rem] font-black text-sm uppercase tracking-widest hover:bg-rose-600 transition-all shadow-2xl shadow-slate-200 active:scale-95">
                  {editingCat ? 'تحديث البيانات' : 'حفظ ونشر التصنيف'}
                </button>
                <button type="button" onClick={closeModal} className="flex-1 py-5 border border-slate-200 text-slate-400 rounded-[1.8rem] font-black text-sm uppercase tracking-widest hover:bg-slate-50 transition-all">
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