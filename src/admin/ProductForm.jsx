import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate, useParams, useOutletContext } from 'react-router-dom';
import { 
  Plus,
  X,
  UploadCloud,
  TrendingUp,
  Cpu,
  ArrowRight,
  Save,
  Image as ImageIcon
} from 'lucide-react';

function ProductForm() {
  let outletContext = {};
  try {
    outletContext = useOutletContext() || {};
  } catch (e) {
    outletContext = {};
  }

  const isDarkMode = outletContext.isDarkMode !== undefined ? outletContext.isDarkMode : false;

  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const [categories, setCategories] = useState([]);
  const [branches, setBranches] = useState([]);
  const [formData, setFormData] = useState({
    name: '', price: '', pricePerGram: '', categoryId: '', description: '',
    silverType: '925', weight: '', stoneType: '', stoneColor: '', size: '', stock: '', sku: '', branch: ''
  });

  const [mainImageFile, setMainImageFile] = useState(null);
  const [mainPreview, setMainPreview] = useState(null);
  const [galleryImageFiles, setGalleryImageFiles] = useState([]);
  const [galleryPreviews, setGalleryPreviews] = useState([]);

  const token = localStorage.getItem("token");

  const inputClass = `w-full px-4 py-3 rounded-2xl text-sm font-semibold outline-none transition-all ${
    isDarkMode 
      ? 'bg-black/50 border border-white/15 text-white placeholder-silver-500 focus:border-silver-400' 
      : 'bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:border-slate-400'
  }`;

  const labelClass = `text-xs font-bold mb-2 block uppercase tracking-wider ${
    isDarkMode ? 'text-silver-300' : 'text-slate-600'
  }`;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const catRes = await axios.get(`${import.meta.env.VITE_API_URL}/categories`);
        setCategories(Array.isArray(catRes.data) ? catRes.data : []);
        setBranches(['اربد', 'خلدا', 'ابو نصير']);

        if (isEditMode) {
          const prodRes = await axios.get(`${import.meta.env.VITE_API_URL}/products/${id}`);
          const product = prodRes.data;
          
          setFormData({
            ...product,
            pricePerGram: product.pricePerGram || ''
          });
          
          setMainPreview(product.image);
          setGalleryPreviews(JSON.parse(product.galleryImages || "[]"));
        }
      } catch (err) {
        toast.error("خطأ في تحميل بيانات المنتج");
      }
    };
    fetchData();
  }, [id, isEditMode]);

  // Automated pricing calculation: (Weight × Price per gram)
  useEffect(() => {
    const weight = parseFloat(formData.weight) || 0;
    const ppg = parseFloat(formData.pricePerGram) || 0;
    if (weight > 0 && ppg > 0) {
      const totalPrice = (weight * ppg).toFixed(2);
      if (formData.price !== totalPrice) {
        setFormData(prev => ({ ...prev, price: totalPrice }));
      }
    }
  }, [formData.weight, formData.pricePerGram]);

  const handleMainImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setMainImageFile(file);
      setMainPreview(URL.createObjectURL(file));
    }
  };

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    
    Object.keys(formData).forEach(key => {
      if (formData[key] !== null && formData[key] !== undefined) {
        data.append(key, formData[key]);
      }
    });
    
    if (mainImageFile) data.append('image', mainImageFile);
    galleryImageFiles.forEach(file => data.append('galleryImages', file));

    const toastId = toast.loading(isEditMode ? "جاري تحديث بيانات القطعة..." : "جاري إضافة القطعة للكتالوج...");

    try {
      const config = { 
        headers: { 
          Authorization: `Bearer ${token}`, 
          'Content-Type': 'multipart/form-data' 
        } 
      };

      if (isEditMode) {
        await axios.put(`${import.meta.env.VITE_API_URL}/products/${id}`, data, config);
        toast.success("تم تحديث بيانات القطعة بنجاح", { id: toastId });
      } else {
        await axios.post(`${import.meta.env.VITE_API_URL}/products`, data, config);
        toast.success("تمت إضافة القطعة بنجاح", { id: toastId });
      }
      
      navigate('/admin/products');

    } catch (err) {
      toast.error(err.response?.data?.error || "حدث خطأ أثناء الحفظ", { id: toastId });
    }
  };

  return (
    <div className="space-y-6 text-right font-cairo" dir="rtl">

      
      {/* Top Header */}
      <div className={`flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-5 rounded-3xl border transition-colors ${
        isDarkMode ? 'bg-[#0c0d12]/90 border-white/10' : 'bg-slate-50 border-slate-200'
      }`}>
        <div className="flex items-center gap-3">
          <button 
            type="button"
            onClick={() => navigate('/admin/products')} 
            className={`p-3 rounded-2xl border transition-all active:scale-95 cursor-pointer ${
              isDarkMode ? 'bg-white/5 hover:bg-white/10 border-white/10 text-silver-300 hover:text-white' : 'bg-white hover:bg-slate-100 border-slate-200 text-slate-700 shadow-sm'
            }`}
            title="العودة للخزينة"
          >
            <ArrowRight className="w-5 h-5" />
          </button>
          <div>
            <h2 className={`text-xl sm:text-2xl font-black ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              {isEditMode ? 'تعديل تفاصيل القطعة المصوغة' : 'إدراج قطعة فضة إسترلينية جديدة'}
            </h2>
            <p className={`text-sm mt-0.5 font-medium ${isDarkMode ? 'text-silver-400' : 'text-slate-500'}`}>
              كتالوج الفضة الإسترلينية 925 والسبائك الاستثمارية
            </p>
          </div>
        </div>

        <button 
          onClick={handleSubmit}
          className={`w-full sm:w-auto px-7 py-3 rounded-2xl font-black text-sm shadow-md flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer ${
            isDarkMode 
              ? 'bg-gradient-to-r from-silver-300 via-silver-200 to-silver-400 hover:brightness-110 text-black' 
              : 'bg-slate-900 hover:bg-black text-white'
          }`}
        >
          <Save className="w-4 h-4 stroke-[3]" />
          <span>{isEditMode ? 'حفظ التعديلات' : 'نشر القطعة بالمتجر'}</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Media Uploads */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* Main Display Image */}
          <div className={`p-5 rounded-3xl border ${
            isDarkMode ? 'bg-[#0c0d12]/90 border-white/10' : 'bg-white border-slate-200 shadow-slate-200/50'
          }`}>
            <label className={`text-sm font-bold flex items-center gap-2 mb-3 ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
              <ImageIcon className="w-5 h-5 text-silver-400" />
              <span>صورة العرض الرئيسية</span>
            </label>
            
            <label className={`aspect-square border border-dashed rounded-3xl flex flex-col items-center justify-center cursor-pointer transition-all overflow-hidden relative group ${
              isDarkMode ? 'border-white/20 bg-black/40 hover:border-silver-400' : 'border-slate-300 bg-slate-50 hover:border-slate-400'
            }`}>
              {mainPreview ? (
                <img 
                  src={mainPreview.startsWith('blob') ? mainPreview : `${import.meta.env.VITE_URL}/${mainPreview}`} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                  alt="preview" 
                />
              ) : (
                <div className="text-center p-6 space-y-2">
                  <UploadCloud className="w-10 h-10 text-silver-400 mx-auto" />
                  <p className="text-sm font-bold">انقر لرفع الصورة الأساسية</p>
                  <p className="text-xs text-silver-400 font-mono">PNG, WEBP, JPG بجودة عالية</p>
                </div>
              )}
              <input type="file" className="hidden" onChange={handleMainImageChange} accept="image/*" />
            </label>
          </div>

          {/* Gallery Images */}
          <div className={`p-5 rounded-3xl border ${
            isDarkMode ? 'bg-[#0c0d12]/90 border-white/10' : 'bg-white border-slate-200 shadow-slate-200/50'
          }`}>
            <label className={`text-sm font-bold block mb-3 ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>معرض الزوايا الإضافية</label>
            <div className="grid grid-cols-3 gap-3">
              {galleryPreviews.map((url, i) => (
                <div key={i} className={`aspect-square relative group rounded-2xl overflow-hidden border ${
                  isDarkMode ? 'border-white/10 bg-black/40' : 'border-slate-200 bg-slate-100'
                }`}>
                  <img 
                    src={url.startsWith('blob') ? url : `${import.meta.env.VITE_URL}/${url}`} 
                    className="w-full h-full object-cover" 
                    alt="gallery" 
                  />
                  <button 
                    type="button" 
                    onClick={() => removeGalleryImage(i)} 
                    className="absolute inset-0 bg-rose-950/80 text-rose-300 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              ))}
              
              <label className={`aspect-square border border-dashed rounded-2xl flex items-center justify-center cursor-pointer transition-all ${
                isDarkMode ? 'border-white/15 bg-black/30 text-silver-400 hover:border-silver-400' : 'border-slate-300 bg-slate-50 text-slate-500 hover:border-slate-400'
              }`}>
                <Plus className="w-6 h-6" />
                <input type="file" multiple className="hidden" onChange={handleGalleryImagesChange} accept="image/*" />
              </label>
            </div>
          </div>

        </div>

        {/* Right Column: Spec & Details Form */}
        <div className="lg:col-span-2 space-y-6">
          <div className={`p-6 sm:p-8 rounded-3xl border space-y-6 shadow-xl ${
            isDarkMode ? 'bg-[#0c0d12]/90 border-white/10' : 'bg-white border-slate-200 shadow-slate-200/50'
          }`}>
            
            {/* General Fields */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-1">
                <label className={labelClass}>اسم القطعة</label>
                <input 
                  className={inputClass} 
                  placeholder="مثال: خاتم سوليتير فضة 925..." 
                  value={formData.name} 
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
                  required 
                />
              </div>

              <div>
                <label className={labelClass}>التصنيف الرئيسي</label>
                <select 
                  className={inputClass} 
                  value={formData.categoryId} 
                  onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })} 
                  required
                >
                  <option value="" className={isDarkMode ? "bg-[#10121a]" : "bg-white"}>اختر التصنيف</option>
                  {categories.map(c => (
                    <option key={c.id} value={c.id} className={isDarkMode ? "bg-[#10121a]" : "bg-white"}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className={labelClass}>الفرع التابع</label>
                <select 
                  className={inputClass} 
                  value={formData.branch} 
                  onChange={(e) => setFormData({ ...formData, branch: e.target.value })} 
                  required
                >
                  <option value="" className={isDarkMode ? "bg-[#10121a]" : "bg-white"}>اختر الفرع</option>
                  {branches.map(b => (
                    <option key={b} value={b} className={isDarkMode ? "bg-[#10121a]" : "bg-white"}>{b}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Smart Pricing Engine */}
            <div className={`p-5 rounded-2xl border space-y-3 ${
              isDarkMode ? 'bg-silver-400/5 border-silver-400/15' : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="flex items-center gap-2 text-sm font-bold text-silver-300">
                <TrendingUp className="w-5 h-5 text-emerald-400" />
                <span className={isDarkMode ? 'text-white' : 'text-slate-900'}>محرك التسعير الآلي لمصنعية الفضة</span>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className={`p-3.5 rounded-xl border ${
                  isDarkMode ? 'bg-black/40 border-white/5' : 'bg-white border-slate-200'
                }`}>
                  <label className="text-xs font-mono text-silver-400 block mb-1 uppercase font-bold">الوزن (جرام)</label>
                  <input 
                    type="number" 
                    step="0.01" 
                    className={`w-full bg-transparent outline-none font-mono font-bold text-base ${isDarkMode ? 'text-white' : 'text-slate-900'}`} 
                    placeholder="0.00"
                    value={formData.weight} 
                    onChange={(e) => setFormData({ ...formData, weight: e.target.value })} 
                  />
                </div>

                <div className={`p-3.5 rounded-xl border ${
                  isDarkMode ? 'bg-black/40 border-white/5' : 'bg-white border-slate-200'
                }`}>
                  <label className="text-xs font-mono text-silver-400 block mb-1 uppercase font-bold">سعر الجرام مع المصنعية</label>
                  <input 
                    type="number" 
                    step="0.01" 
                    className={`w-full bg-transparent outline-none font-mono font-bold text-base ${isDarkMode ? 'text-white' : 'text-slate-900'}`} 
                    placeholder="0.00"
                    value={formData.pricePerGram} 
                    onChange={(e) => setFormData({ ...formData, pricePerGram: e.target.value })} 
                  />
                </div>

                <div className={`p-3.5 rounded-xl border flex flex-col justify-center ${
                  isDarkMode ? 'bg-silver-400/10 border-silver-400/30' : 'bg-slate-900 text-white border-slate-900'
                }`}>
                  <label className={`text-xs font-mono block uppercase font-bold ${isDarkMode ? 'text-silver-300' : 'text-silver-400'}`}>السعر النهائي المعتمد</label>
                  <div className="font-mono font-black text-xl text-white">
                    {Number(formData.price || 0).toLocaleString()} <span className="text-xs font-sans text-silver-400">د.أ</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Technical Specifications */}
            <div className="space-y-3">
              <label className={`text-sm font-bold flex items-center gap-2 uppercase tracking-wider ${
                isDarkMode ? 'text-silver-300' : 'text-slate-700'
              }`}>
                <Cpu className="w-5 h-5 text-emerald-400" /> المواصفات والعيار
              </label>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
                <div>
                  <label className={labelClass}>عيار الفضة</label>
                  <select 
                    className={inputClass} 
                    value={formData.silverType} 
                    onChange={(e) => setFormData({ ...formData, silverType: e.target.value })}
                  >
                    <option value="925" className={isDarkMode ? "bg-[#10121a]" : "bg-white"}>إسترليني 925</option>
                    <option value="999" className={isDarkMode ? "bg-[#10121a]" : "bg-white"}>سبيكة نقية 999</option>
                  </select>
                </div>

                <div>
                  <label className={labelClass}>نوع الحجر/الفص</label>
                  <input 
                    className={inputClass} 
                    placeholder="زركون، عقيق..." 
                    value={formData.stoneType} 
                    onChange={(e) => setFormData({ ...formData, stoneType: e.target.value })} 
                  />
                </div>

                <div>
                  <label className={labelClass}>المخزون المتوفر</label>
                  <input 
                    type="number" 
                    className={inputClass} 
                    placeholder="الكمية" 
                    value={formData.stock} 
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })} 
                  />
                </div>

                <div>
                  <label className={labelClass}>كود SKU</label>
                  <input 
                    className={inputClass} 
                    placeholder="ELITE-001" 
                    value={formData.sku} 
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })} 
                  />
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className={labelClass}>تفاصيل ووصف المشغولة</label>
              <textarea 
                rows="4" 
                className={`${inputClass} resize-none leading-relaxed`} 
                placeholder="اكتب وصفاً جذاباً عن صياغة القطعة، نقوشها واللمسات الإيطالية..." 
                value={formData.description} 
                onChange={(e) => setFormData({ ...formData, description: e.target.value })} 
              />
            </div>

            {/* Form Footer Buttons */}
            <div className={`flex items-center gap-3 pt-5 border-t ${isDarkMode ? 'border-white/10' : 'border-slate-200'}`}>
              <button 
                type="submit" 
                className={`flex-1 py-3.5 rounded-2xl font-black text-sm uppercase tracking-wider transition-all flex items-center justify-center gap-2 active:scale-95 cursor-pointer shadow-md ${
                  isDarkMode 
                    ? 'bg-gradient-to-r from-silver-300 via-silver-200 to-silver-400 hover:brightness-110 text-black' 
                    : 'bg-slate-900 hover:bg-black text-white'
                }`}
              >
                <Save className="w-4 h-4 stroke-[3]" />
                <span>{isEditMode ? 'تأكيد وحفظ التعديلات' : 'نشر وتثبيت القطعة'}</span>
              </button>

              <button 
                type="button" 
                onClick={() => navigate('/admin/products')} 
                className={`px-7 py-3.5 border rounded-2xl font-bold text-sm transition-all text-center cursor-pointer ${
                  isDarkMode ? 'border-white/10 text-silver-300 hover:bg-white/5' : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                إلغاء
              </button>
            </div>

          </div>
        </div>

      </form>
    </div>
  );
}

export default ProductForm;