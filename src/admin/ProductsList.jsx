import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import {
  FiEdit2, FiTrash2, FiPlus, FiX,
  FiUploadCloud, FiPackage, FiLayers,
  FiSearch, FiCpu, FiTrendingUp,
  FiChevronRight, FiChevronLeft
} from 'react-icons/fi';

function ProductsList() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  // --- Pagination States ---
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8; // عدد المنتجات في كل صفحة

  const [formData, setFormData] = useState({
    name: '', price: '', pricePerGram: '', categoryId: '', description: '',
    silverType: '', weight: '', stoneType: '', stoneColor: '', size: '', stock: '', sku: ''
  });

  const [mainImageFile, setMainImageFile] = useState(null);
  const [mainPreview, setMainPreview] = useState(null);
  const [galleryImageFiles, setGalleryImageFiles] = useState([]);
  const [galleryPreviews, setGalleryPreviews] = useState([]);

  const token = localStorage.getItem("token");

  const fetchData = async () => {
    try {
      const [prodRes, catRes] = await Promise.all([
        axios.get(`${import.meta.env.VITE_API_URL}/products`),
        axios.get(`${import.meta.env.VITE_API_URL}/categories`)
      ]);
      setProducts(prodRes.data);
      setCategories(catRes.data);
    } catch (err) {
      toast.error("خطأ في مزامنة البيانات");
    }
  };

  useEffect(() => { fetchData(); }, []);

  // إعادة الترقيم للصفحة الأولى عند البحث
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  // محرك احتساب السعر التلقائي
  useEffect(() => {
    const weight = parseFloat(formData.weight) || 0;
    const ppg = parseFloat(formData.pricePerGram) || 0;
    const totalPrice = (weight * ppg).toFixed(2);
    if (formData.price !== totalPrice) {
      setFormData(prev => ({ ...prev, price: totalPrice }));
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
    Object.keys(formData).forEach(key => data.append(key, formData[key]));
    if (mainImageFile) data.append('image', mainImageFile);
    galleryImageFiles.forEach(file => data.append('galleryImages', file));

    try {
      const config = { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' } };
      if (editingProduct) {
        await axios.put(`${import.meta.env.VITE_API_URL}/products/${editingProduct.id}`, data, config);
        toast.success("تم التحديث بنجاح");
      } else {
        await axios.post(`${import.meta.env.VITE_API_URL}/products`, data, config);
        toast.success("تمت الإضافة بنجاح");
      }
      closeModal();
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.error || "حدث خطأ");
    }
  };

  const openModal = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({ ...product, pricePerGram: product.pricePerGram || '' });
      setMainPreview(product.image);
      setGalleryPreviews(JSON.parse(product.galleryImages || "[]"));
    } else {
      setEditingProduct(null);
      setFormData({
        name: '', price: '', pricePerGram: '', categoryId: '', description: '',
        silverType: '', weight: '', stoneType: '', stoneColor: '', size: '', stock: '', sku: ''
      });
      setMainPreview(null);
      setGalleryPreviews([]);
    }
    setMainImageFile(null);
    setGalleryImageFiles([]);
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  const handleDelete = async (id) => {
    if (window.confirm("حذف المنتج نهائياً؟")) {
      try {
        await axios.delete(`${import.meta.env.VITE_API_URL}/products/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success("تم الحذف");
        fetchData();
      } catch (err) { toast.error("فشل الحذف"); }
    }
  };
  const getPaginationGroup = () => {
    let pages = [];
    const start = Math.max(1, currentPage - 1);
    const end = Math.min(totalPages, currentPage + 1);

    // إضافة الصفحة الأولى دائماً
    if (start > 1) pages.push(1);

    // إضافة النقاط إذا كان هناك فجوة بعد الصفحة الأولى
    if (start > 2) pages.push('...');

    // إضافة الصفحات المحيطة بالصفحة الحالية
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    // إضافة النقاط إذا كان هناك فجوة قبل الصفحة الأخيرة
    if (end < totalPages - 1) pages.push('...');

    // إضافة الصفحة الأخيرة دائماً
    if (end < totalPages) pages.push(totalPages);

    return pages;
  };
  // --- Filtering & Pagination Logic ---
  const filteredProducts = products.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);

  const inputClass = "w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 outline-none transition-all text-sm font-bold text-slate-700 placeholder:text-slate-400";

  return (
    <div className="p-6 md:p-10 font-['Tajawal'] bg-[#F8FAFC] min-h-screen text-right" dir="rtl">

      {/* Header Section */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-10 gap-6">
        <div className="space-y-1">
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">خزينة المنتجات</h2>
          <p className="text-slate-400 font-medium flex items-center gap-2">
            <FiLayers className="text-rose-500" /> إدارة المخزون وتسعير قطع الفضة الفريدة
          </p>
        </div>

        <div className="flex w-full lg:w-auto gap-3">
          <div className="relative flex-1 lg:w-80 group">
            <FiSearch className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-rose-500 transition-colors" />
            <input
              type="text"
              placeholder="ابحث عن قطعة..."
              className="w-full pr-11 pl-4 py-3 bg-white border border-slate-100 rounded-2xl shadow-sm outline-none focus:ring-2 focus:ring-rose-500/10 transition-all text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button
            onClick={() => openModal()}
            className="bg-slate-900 hover:bg-black text-white px-6 py-3 rounded-2xl flex items-center gap-3 shadow-xl shadow-slate-200 transition-all active:scale-95 whitespace-nowrap font-bold text-sm"
          >
            <FiPlus size={20} /> إضافة قطعة جديدة
          </button>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
        {currentItems.map(p => (
          <div key={p.id} className="bg-white rounded-[2.5rem] border border-slate-100 p-5 shadow-soft hover:shadow-xl hover:-translate-y-1 transition-all group overflow-hidden relative">
            <div className="relative h-56 w-full rounded-[2rem] overflow-hidden mb-4 bg-slate-50">
              <img src={import.meta.env.VITE_URL + '/' + p.image} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={p.name} />
              <div className="absolute top-3 left-3 flex flex-col gap-2">
                <button onClick={() => openModal(p)} className="p-3 bg-white/90 backdrop-blur-md text-slate-700 rounded-xl hover:bg-slate-900 hover:text-white transition-all shadow-sm"><FiEdit2 size={16} /></button>
                <button onClick={() => handleDelete(p.id)} className="p-3 bg-white/90 backdrop-blur-md text-rose-500 rounded-xl hover:bg-rose-500 hover:text-white transition-all shadow-sm"><FiTrash2 size={16} /></button>
              </div>
              <div className="absolute bottom-3 right-3 bg-slate-900/80 backdrop-blur-md text-white px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest">
                {p.sku || 'NO-SKU'}
              </div>
            </div>

            <div className="px-1">
              <div className="flex justify-between items-start mb-2">
                <span className="text-[10px] font-black text-rose-500 bg-rose-50 px-3 py-1 rounded-full uppercase">
                  {categories.find(c => c.id === p.categoryId)?.name || 'غير مصنف'}
                </span>
                <span className="text-xs font-bold text-slate-400 flex items-center gap-1">
                  <FiPackage size={12} /> {p.stock} في المخزن
                </span>
              </div>
              <h3 className="font-black text-slate-800 text-lg mb-3 truncate">{p.name}</h3>

              <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">الوزن التقريبي</span>
                  <span className="font-black text-slate-700">{p.weight} <small className="text-[10px]">جرام</small></span>
                </div>
                <div className="text-left">
                  <span className="text-[10px] font-black text-slate-400 block uppercase">السعر الإجمالي</span>
                  <span className="text-xl font-black text-rose-600 tracking-tighter">{Number(p.price).toLocaleString()} <small className="text-xs">JOD</small></span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      {/* Pagination Controls - Smart Version */}
      {totalPages > 1 && (
        <div className="mt-16 flex flex-col items-center gap-6 pb-20">
          <div className="flex items-center gap-3 bg-white p-2 rounded-[2rem] shadow-sm border border-slate-100">

            {/* السابق */}
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="w-12 h-12 rounded-2xl flex items-center justify-center text-slate-400 hover:bg-slate-50 hover:text-rose-500 disabled:opacity-20 transition-all"
            >
              <FiChevronRight size={22} />
            </button>

            {/* الأرقام الذكية */}
            <div className="flex items-center gap-1">
              {getPaginationGroup().map((item, index) => (
                <React.Fragment key={index}>
                  {item === '...' ? (
                    <span className="w-8 text-center text-slate-300 font-black">...</span>
                  ) : (
                    <button
                      onClick={() => setCurrentPage(item)}
                      className={`w-12 h-12 rounded-2xl font-black text-sm transition-all ${currentPage === item
                          ? 'bg-rose-500 text-white shadow-lg shadow-rose-200 scale-105'
                          : 'text-slate-500 hover:bg-slate-50'
                        }`}
                    >
                      {item}
                    </button>
                  )}
                </React.Fragment>
              ))}
            </div>

            {/* التالي */}
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="w-12 h-12 rounded-2xl flex items-center justify-center text-slate-400 hover:bg-slate-50 hover:text-rose-500 disabled:opacity-20 transition-all"
            >
              <FiChevronLeft size={22} />
            </button>
          </div>

          {/* تفاصيل سريعة */}
          <div className="flex items-center gap-4 text-[11px] font-black text-slate-400 uppercase tracking-widest">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
            إجمالي المنتجات: {filteredProducts.length} قطعة
            <span className="w-1 h-1 rounded-full bg-slate-200"></span>
            صفحة {currentPage} من {totalPages}
          </div>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-4xl max-h-[92vh] overflow-y-auto rounded-[2.5rem] shadow-2xl border border-white animate-in zoom-in-95 duration-300">

            <div className="p-8 border-b border-slate-50 flex justify-between items-center sticky top-0 bg-white/80 backdrop-blur-md z-20">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-rose-500 rounded-2xl flex items-center justify-center text-white shadow-lg">
                  <FiPlus size={24} />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-slate-900">{editingProduct ? 'تحديث القطعة' : 'إضافة قطعة فضة جديدة'}</h3>
                  <p className="text-[11px] font-bold text-slate-400 uppercase mt-1">Product Configuration Suite</p>
                </div>
              </div>
              <button onClick={closeModal} className="p-3 hover:bg-rose-50 text-slate-400 hover:text-rose-500 rounded-2xl transition-all">
                <FiX size={28} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-10 space-y-10">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1">
                  <label className="text-[11px] font-black uppercase tracking-widest block mb-4 text-slate-400">صورة العرض الرئيسية</label>
                  <label className="aspect-square border-2 border-dashed border-slate-200 rounded-[2.5rem] flex flex-col items-center justify-center cursor-pointer hover:border-rose-400 hover:bg-rose-50/30 transition-all overflow-hidden relative group">
                    {mainPreview ? (
                      <img src={mainPreview.startsWith('blob') ? mainPreview : `${import.meta.env.VITE_URL}/${mainPreview}`} className="w-full h-full object-cover" alt="preview" />
                    ) : (
                      <div className="text-center p-6">
                        <FiUploadCloud className="text-4xl text-slate-300 mx-auto mb-2 group-hover:text-rose-500 transition-colors" />
                        <span className="text-xs font-black text-slate-400 uppercase">رفع صورة رئيسية</span>
                      </div>
                    )}
                    <input type="file" className="hidden" onChange={handleMainImageChange} accept="image/*" />
                  </label>
                </div>

                <div className="lg:col-span-2">
                  <label className="text-[11px] font-black uppercase tracking-widest block mb-4 text-slate-400">معرض الصور</label>
                  <div className="grid grid-cols-3 md:grid-cols-4 gap-4">
                    {galleryPreviews.map((url, i) => (
                      <div key={i} className="aspect-square relative group rounded-[1.5rem] overflow-hidden border border-slate-100 shadow-sm">
                        <img src={url.startsWith('blob') ? url : `${import.meta.env.VITE_URL}/${url}`} className="w-full h-full object-cover" alt="gallery" />
                        <button type="button" onClick={() => removeGalleryImage(i)} className="absolute inset-0 bg-rose-500/90 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all"><FiX size={20} /></button>
                      </div>
                    ))}
                    <label className="aspect-square border-2 border-dashed border-slate-200 rounded-[1.5rem] flex items-center justify-center cursor-pointer hover:border-rose-400 hover:text-rose-500 text-slate-300 transition-all">
                      <FiPlus size={24} />
                      <input type="file" multiple className="hidden" onChange={handleGalleryImagesChange} accept="image/*" />
                    </label>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-500 mr-2 uppercase">اسم القطعة</label>
                  <input className={inputClass} placeholder="خاتم فضة عيار 925..." value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-500 mr-2 uppercase">تصنيف المتجر</label>
                  <select className={inputClass} value={formData.categoryId} onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })} required>
                    <option value="">اختر التصنيف</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
              </div>

              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-rose-500 to-rose-600 rounded-[2.5rem] blur-xl opacity-5"></div>
                <div className="relative bg-white p-8 rounded-[2.5rem] border border-rose-100/50 space-y-6">
                  <h4 className="text-xl font-black text-rose-600 flex items-center gap-2 uppercase tracking-widest"><FiTrendingUp /> محرك التسعير</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                      <label className="text-[10px] font-black text-slate-400 block mb-2 uppercase">الوزن (g)</label>
                      <input type="number" step="0.01" className="w-full bg-transparent outline-none font-black text-slate-800 text-lg" placeholder="0.00" value={formData.weight} onChange={(e) => setFormData({ ...formData, weight: e.target.value })} />
                    </div>
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                      <label className="text-[10px] font-black text-slate-400 block mb-2 uppercase">سعر الجرام (JOD)</label>
                      <input type="number" step="0.01" className="w-full bg-transparent outline-none font-black text-slate-800 text-lg" placeholder="0.00" value={formData.pricePerGram} onChange={(e) => setFormData({ ...formData, pricePerGram: e.target.value })} />
                    </div>
                    <div className="bg-rose-500 p-4 rounded-2xl shadow-lg">
                      <label className="text-[10px] font-black text-rose-100 block mb-2 uppercase">السعر الإجمالي</label>
                      <div className="font-black text-white text-2xl tracking-tighter">
                        {formData.price} <small className="text-xs opacity-70">JOD</small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6 pt-4 border-t border-slate-50">
                <h4 className="text-xl font-black text-slate-400 flex items-center gap-2 uppercase tracking-widest"><FiCpu /> المواصفات</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-black text-slate-400 uppercase">عيار الفضة</label>
                    <select className={inputClass} value={formData.silverType} onChange={(e) => setFormData({ ...formData, silverType: e.target.value })}>
                      <option value="">اختر العيار</option>
                      <option value="925">Sterling 925</option>
                      <option value="999">Pure 999</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-black text-slate-400 uppercase">حجر القطعة</label>
                    <input className={inputClass} placeholder="فيروز، عقيق..." value={formData.stoneType} onChange={(e) => setFormData({ ...formData, stoneType: e.target.value })} />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-black text-slate-400 uppercase">المخزون</label>
                    <input className={inputClass} placeholder="الكمية" type="number" value={formData.stock} onChange={(e) => setFormData({ ...formData, stock: e.target.value })} />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-black text-slate-400 uppercase">SKU</label>
                    <input className={inputClass} placeholder="Serial" value={formData.sku} onChange={(e) => setFormData({ ...formData, sku: e.target.value })} />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase">الوصف</label>
                <textarea rows="4" className={inputClass + " resize-none leading-relaxed"} placeholder="اكتب وصفاً جذاباً..." value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-8 sticky bottom-0 bg-white border-t border-slate-50 z-10 p-4">
                <button type="submit" className="flex-[2] bg-slate-900 hover:bg-black text-white py-5 rounded-[2rem] font-black text-sm uppercase tracking-widest transition-all shadow-xl active:scale-95">
                  {editingProduct ? 'حفظ التعديلات' : 'نشر القطعة الآن'}
                </button>
                <button type="button" onClick={closeModal} className="flex-1 py-5 border border-slate-200 text-slate-500 rounded-[2rem] font-black text-sm uppercase hover:bg-slate-50 transition-all">
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

export default ProductsList;