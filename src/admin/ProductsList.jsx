import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import {
  FiEdit2, FiTrash2, FiPlus,
  FiPackage, FiLayers,
  FiSearch, FiChevronRight, FiChevronLeft
} from 'react-icons/fi';

function ProductsList() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  // --- Pagination States ---
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const token = localStorage.getItem("token");

  // جلب البيانات من السيرفر
  const fetchData = async () => {
    try {
      const [prodRes, catRes] = await Promise.all([
        axios.get(`${import.meta.env.VITE_API_URL}/admin/get-products`, {
          headers: {
            "Authorization": "Bearer " + localStorage.getItem("token")
          }
        }),
        axios.get(`${import.meta.env.VITE_API_URL}/categories`)
      ]);
      setProducts(prodRes.data);
      setCategories(catRes.data);
    } catch (err) {
      toast.error("خطأ في مزامنة البيانات");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // إعادة الترقيم للصفحة الأولى عند البحث
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  // حذف منتج
  const handleDelete = async (id) => {
    if (window.confirm("هل أنت متأكد من حذف هذا المنتج نهائياً؟")) {
      try {
        await axios.delete(`${import.meta.env.VITE_API_URL}/products/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success("تم الحذف بنجاح");
        fetchData();
      } catch (err) {
        toast.error("فشل الحذف، تحقق من الصلاحيات");
      }
    }
  };

  // --- Logic التصفية والترقيم ---
  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.sku?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);

  const getPaginationGroup = () => {
    let pages = [];
    const start = Math.max(1, currentPage - 1);
    const end = Math.min(totalPages, currentPage + 1);
    if (start > 1) pages.push(1);
    if (start > 2) pages.push('...');
    for (let i = start; i <= end; i++) pages.push(i);
    if (end < totalPages - 1) pages.push('...');
    if (end < totalPages) pages.push(totalPages);
    return pages;
  };

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
              placeholder="ابحث بالاسم أو SKU..."
              className="w-full pr-11 pl-4 py-3 bg-white border border-slate-100 rounded-2xl shadow-sm outline-none focus:ring-2 focus:ring-rose-500/10 transition-all text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button
            onClick={() => navigate('/admin/products/add')}
            className="bg-slate-900 hover:bg-black text-white px-6 py-3 rounded-2xl flex items-center gap-3 shadow-xl shadow-slate-200 transition-all active:scale-95 whitespace-nowrap font-bold text-sm"
          >
            <FiPlus size={20} /> إضافة قطعة جديدة
          </button>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
        {currentItems.map(p => (
          <div key={p.id} className="bg-white rounded-[2.5rem] border border-slate-100 p-5 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group overflow-hidden relative">

            {/* Image Container */}
            <div className="relative h-56 w-full rounded-[2rem] overflow-hidden mb-4 bg-slate-50">
              <img
                src={`${import.meta.env.VITE_URL}/${p.image}`}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                alt={p.name}
              />
              <div className="absolute top-3 left-3 flex flex-col gap-2">
                <button
                  onClick={() => navigate(`/admin/products/edit/${p.id}`)}
                  className="p-3 bg-white/90 backdrop-blur-md text-slate-700 rounded-xl hover:bg-slate-900 hover:text-white transition-all shadow-sm"
                >
                  <FiEdit2 size={16} />
                </button>
                <button
                  onClick={() => handleDelete(p.id)}
                  className="p-3 bg-white/90 backdrop-blur-md text-rose-500 rounded-xl hover:bg-rose-500 hover:text-white transition-all shadow-sm"
                >
                  <FiTrash2 size={16} />
                </button>
              </div>
              <div className="absolute bottom-3 right-3 bg-slate-900/80 backdrop-blur-md text-white px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest">
                {p.sku || 'NO-SKU'}
              </div>
            </div>

            {/* Content Container */}
            <div className="px-1">
              <div className="flex justify-between items-start mb-2">
                <span className="text-[10px] font-black text-rose-500 bg-rose-50 px-3 py-1 rounded-full uppercase">
                  {categories.find(c => c.id === p.categoryId)?.name || 'غير مصنف'}
                </span>
                <span className={`text-xs font-bold flex items-center gap-1 ${p.stock === 0
                    ? 'text-red-500'
                    : p.stock <= 5
                      ? 'text-amber-500'
                      : 'text-green-500'
                  }`}>
                  <FiPackage size={12} />
                  {p.stock === 0 ? 'نفذ من المخزن' : `${p.stock} في المخزن`}
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
                  <span className="text-xl font-black text-rose-600 tracking-tighter">
                    {Number(p.price).toLocaleString()} <small className="text-xs">JOD</small>
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="mt-16 flex flex-col items-center gap-6 pb-20">
          <div className="flex items-center gap-3 bg-white p-2 rounded-[2rem] shadow-sm border border-slate-100">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="w-12 h-12 rounded-2xl flex items-center justify-center text-slate-400 hover:bg-slate-50 hover:text-rose-500 disabled:opacity-20 transition-all"
            >
              <FiChevronRight size={22} />
            </button>

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

            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="w-12 h-12 rounded-2xl flex items-center justify-center text-slate-400 hover:bg-slate-50 hover:text-rose-500 disabled:opacity-20 transition-all"
            >
              <FiChevronLeft size={22} />
            </button>
          </div>

          <div className="flex items-center gap-4 text-[11px] font-black text-slate-400 uppercase tracking-widest">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
            إجمالي المنتجات: {filteredProducts.length} قطعة
            <span className="w-1 h-1 rounded-full bg-slate-200"></span>
            صفحة {currentPage} من {totalPages}
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductsList;