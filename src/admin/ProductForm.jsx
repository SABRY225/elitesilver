import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  FiPlus, FiX, FiUploadCloud, FiTrendingUp, 
  FiCpu, FiArrowRight, FiSave, FiImage 
} from 'react-icons/fi';

function ProductForm() {
  const { id } = useParams(); // الحصول على الـ ID من الرابط في حالة التعديل
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const [categories, setCategories] = useState([]);
  const [branches, setBranches] = useState([]);
  const [formData, setFormData] = useState({
    name: '', price: '', pricePerGram: '', categoryId: '', description: '',
    silverType: '', weight: '', stoneType: '', stoneColor: '', size: '', stock: '', sku: '',branch:''
  });

  const [mainImageFile, setMainImageFile] = useState(null);
  const [mainPreview, setMainPreview] = useState(null);
  const [galleryImageFiles, setGalleryImageFiles] = useState([]);
  const [galleryPreviews, setGalleryPreviews] = useState([]);

  const token = localStorage.getItem("token");

  // ستايل المدخلات الموحد
  const inputClass = "w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 outline-none transition-all text-sm font-bold text-slate-700 placeholder:text-slate-400";

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. جلب التصنيفات دائماً
        const catRes = await axios.get(`${import.meta.env.VITE_API_URL}/categories`);
        setCategories(catRes.data);
        setBranches(['اربد', 'خلدا','ابو نصير']);

        // 2. إذا كنا في وضع التعديل، نجلب بيانات المنتج
        if (isEditMode) {
          const prodRes = await axios.get(`${import.meta.env.VITE_API_URL}/products/${id}`);
          const product = prodRes.data;
          
          setFormData({
            ...product,
            pricePerGram: product.pricePerGram || ''
          });
          
          // عرض الصور المخزنة مسبقاً
          setMainPreview(product.image);
          setGalleryPreviews(JSON.parse(product.galleryImages || "[]"));
        }
      } catch (err) {
        toast.error("خطأ في تحميل البيانات");
      }
    };
    fetchData();
  }, [id, isEditMode]);

  // محرك احتساب السعر التلقائي (الوزن × سعر الجرام)
  useEffect(() => {
    const weight = parseFloat(formData.weight) || 0;
    const ppg = parseFloat(formData.pricePerGram) || 0;
    const totalPrice = (weight * ppg).toFixed(2);
    if (formData.price !== totalPrice) {
      setFormData(prev => ({ ...prev, price: totalPrice }));
    }
  }, [formData.weight, formData.pricePerGram]);

  // معالجة الصورة الرئيسية
  const handleMainImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setMainImageFile(file);
      setMainPreview(URL.createObjectURL(file));
    }
  };

  // معالجة معرض الصور
  const handleGalleryImagesChange = (e) => {
    const files = Array.from(e.target.files);
    setGalleryImageFiles(prev => [...prev, ...files]);
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setGalleryPreviews(prev => [...prev, ...newPreviews]);
  };

  const removeGalleryImage = (indexToRemove) => {
    setGalleryImageFiles(prev => prev.filter((_, i) => i !== indexToRemove));
    setGalleryPreviews(prev => prev.filter((_, i) => i !== indexToRemove));
  };

  // الإرسال إلى السيرفر
  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    
    // إضافة بيانات النص
    Object.keys(formData).forEach(key => data.append(key, formData[key]));
    
    // إضافة الصورة الرئيسية (إن وجدت جديدة)
    if (mainImageFile) data.append('image', mainImageFile);
    
    // إضافة صور المعرض الجديدة
    galleryImageFiles.forEach(file => data.append('galleryImages', file));

    try {
      const config = { 
        headers: { 
          Authorization: `Bearer ${token}`, 
          'Content-Type': 'multipart/form-data' 
        } 
      };

      if (isEditMode) {
        await axios.put(`${import.meta.env.VITE_API_URL}/products/${id}`, data, config);
        toast.success("تم تحديث القطعة بنجاح");
      } else {
        await axios.post(`${import.meta.env.VITE_API_URL}/products`, data, config);
        toast.success("تمت إضافة القطعة بنجاح");
      }
      
      navigate('/admin');
      localStorage.setItem("adminActiveTab", "products"); 

    } catch (err) {
      toast.error(err.response?.data?.error || "حدث خطأ أثناء الحفظ");
    }
  };

  return (
    <div className="p-6 md:p-10 font-['Tajawal'] bg-[#F8FAFC] min-h-screen text-right" dir="rtl">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="max-w-5xl mx-auto">
        
        {/* Navigation Header */}
        <div className="flex justify-between items-center mb-8">
          <button 
            onClick={() => {navigate('/admin'); localStorage.setItem("adminActiveTab", "products");}} 
            className="flex items-center gap-2 text-slate-500 hover:text-rose-600 transition-colors font-bold"
          >
            <FiArrowRight size={20} /> العودة للقائمة
          </button>
          <div className="text-left">
             <h2 className="text-2xl font-black text-slate-900">
               {isEditMode ? 'تعديل بيانات المنتج' : 'إضافة قطعة جديدة'}
             </h2>
             <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Product Management System</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Images Upload */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm">
              <label className="text-[11px] font-black uppercase tracking-widest block mb-4 text-slate-400 flex items-center gap-2">
                <FiImage className="text-rose-500" /> صورة العرض الرئيسية
              </label>
              <label className="aspect-square border-2 border-dashed border-slate-200 rounded-[2.5rem] flex flex-col items-center justify-center cursor-pointer hover:border-rose-400 hover:bg-rose-50/30 transition-all overflow-hidden relative group">
                {mainPreview ? (
                  <img 
                    src={mainPreview.startsWith('blob') ? mainPreview : `${import.meta.env.VITE_URL}/${mainPreview}`} 
                    className="w-full h-full object-cover" 
                    alt="preview" 
                  />
                ) : (
                  <div className="text-center p-6">
                    <FiUploadCloud className="text-4xl text-slate-300 mx-auto mb-2 group-hover:text-rose-500 transition-colors" />
                    <span className="text-xs font-black text-slate-400 uppercase">اختر صورة</span>
                  </div>
                )}
                <input type="file" className="hidden" onChange={handleMainImageChange} accept="image/*" />
              </label>
            </div>

            <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm">
              <label className="text-[11px] font-black uppercase tracking-widest block mb-4 text-slate-400">معرض الصور</label>
              <div className="grid grid-cols-2 gap-3">
                {galleryPreviews.map((url, i) => (
                  <div key={i} className="aspect-square relative group rounded-2xl overflow-hidden border border-slate-100 shadow-sm">
                    <img 
                      src={url.startsWith('blob') ? url : `${import.meta.env.VITE_URL}/${url}`} 
                      className="w-full h-full object-cover" 
                      alt="gallery" 
                    />
                    <button 
                      type="button" 
                      onClick={() => removeGalleryImage(i)} 
                      className="absolute inset-0 bg-rose-500/90 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all"
                    >
                      <FiX size={18} />
                    </button>
                  </div>
                ))}
                <label className="aspect-square border-2 border-dashed border-slate-100 rounded-2xl flex items-center justify-center cursor-pointer hover:border-rose-400 hover:text-rose-500 text-slate-300 transition-all">
                  <FiPlus size={24} />
                  <input type="file" multiple className="hidden" onChange={handleGalleryImagesChange} accept="image/*" />
                </label>
              </div>
            </div>
          </div>

          {/* Right Column: Form Data */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6">
              
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-500 mr-2 uppercase">اسم القطعة</label>
                  <input 
                    className={inputClass} 
                    placeholder="مثال: خاتم فضة ملكي..." 
                    value={formData.name} 
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-500 mr-2 uppercase">تصنيف المتجر</label>
                  <select 
                    className={inputClass} 
                    value={formData.categoryId} 
                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })} 
                    required
                  >
                    <option value="">اختر التصنيف</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-500 mr-2 uppercase">اختيار الفرع</label>
                  <select 
                    className={inputClass} 
                    value={formData.branch} 
                    onChange={(e) => setFormData({ ...formData, branch: e.target.value })} 
                    required
                  >
                    <option value="">اختر الفرع</option>
                    {branches.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              {/* Pricing Section */}
              <div className="relative bg-rose-50/50 p-6 rounded-[2rem] border border-rose-100 space-y-4">
                <h4 className="text-sm font-black text-rose-600 flex items-center gap-2 uppercase">
                  <FiTrendingUp /> محرك التسعير الآلي
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white p-3 rounded-xl shadow-sm">
                    <label className="text-[10px] font-black text-slate-400 block mb-1 uppercase">الوزن (جرام)</label>
                    <input 
                      type="number" step="0.01" 
                      className="w-full bg-transparent outline-none font-black text-slate-800" 
                      value={formData.weight} 
                      onChange={(e) => setFormData({ ...formData, weight: e.target.value })} 
                    />
                  </div>
                  <div className="bg-white p-3 rounded-xl shadow-sm">
                    <label className="text-[10px] font-black text-slate-400 block mb-1 uppercase">سعر الجرام</label>
                    <input 
                      type="number" step="0.01" 
                      className="w-full bg-transparent outline-none font-black text-slate-800" 
                      value={formData.pricePerGram} 
                      onChange={(e) => setFormData({ ...formData, pricePerGram: e.target.value })} 
                    />
                  </div>
                  <div className="bg-rose-600 p-3 rounded-xl shadow-lg flex flex-col justify-center">
                    <label className="text-[10px] font-black text-rose-100 block uppercase">الإجمالي</label>
                    <div className="font-black text-white text-lg tracking-tighter">
                      {formData.price} <small className="text-[10px]">JOD</small>
                    </div>
                  </div>
                </div>
              </div>

              {/* Specs Section */}
              <div className="space-y-4 pt-4">
                <h4 className="text-sm font-black text-slate-400 flex items-center gap-2 uppercase">
                  <FiCpu /> المواصفات التقنية
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-black text-slate-400 mr-2 uppercase">عيار الفضة</label>
                    <select className={inputClass} value={formData.silverType} onChange={(e) => setFormData({ ...formData, silverType: e.target.value })}>
                      <option value="">اختر</option>
                      <option value="925">925</option>
                      <option value="999">999</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-black text-slate-400 mr-2 uppercase">نوع الحجر</label>
                    <input className={inputClass} value={formData.stoneType} onChange={(e) => setFormData({ ...formData, stoneType: e.target.value })} />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-black text-slate-400 mr-2 uppercase">المخزون</label>
                    <input type="number" className={inputClass} value={formData.stock} onChange={(e) => setFormData({ ...formData, stock: e.target.value })} />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-black text-slate-400 mr-2 uppercase">SKU</label>
                    <input className={inputClass} value={formData.sku} onChange={(e) => setFormData({ ...formData, sku: e.target.value })} />
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-500 mr-2 uppercase">وصف المنتج</label>
                <textarea 
                  rows="4" 
                  className={inputClass + " resize-none"} 
                  placeholder="اكتب تفاصيل القطعة..." 
                  value={formData.description} 
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })} 
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-6">
                <button 
                  type="submit" 
                  className="flex-[2] bg-slate-900 hover:bg-black text-white py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all shadow-lg flex items-center justify-center gap-2 active:scale-95"
                >
                  <FiSave size={18} /> {isEditMode ? 'حفظ التعديلات' : 'نشر المنتج الآن'}
                </button>
                <button 
                  type="button" 
                  onClick={() => {navigate('/admin');  localStorage.setItem("adminActiveTab", "products"); }} 
                  className="flex-1 py-4 border border-slate-200 text-slate-500 rounded-2xl font-black text-sm uppercase hover:bg-slate-50 transition-all text-center"
                >
                  إلغاء
                </button>
              </div>

            </div>
          </div>

        </form>
      </div>
    </div>
  );
}

export default ProductForm;