import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate, useOutletContext } from 'react-router-dom';
import {
  Edit3,
  Trash2,
  Plus,
  Package,
  Layers,
  Search,
  ChevronRight,
  ChevronLeft,
  Gem,
  Scale,
  Sparkles,
  RefreshCw
} from 'lucide-react';

function ProductsList({ searchQuery: propsSearch = "" }) {
  let outletContext = {};
  try {
    outletContext = useOutletContext() || {};
  } catch (e) {
    outletContext = {};
  }

  const isDarkMode = outletContext.isDarkMode !== undefined ? outletContext.isDarkMode : false;
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState(propsSearch || outletContext.searchQuery || "");
  const [loading, setLoading] = useState(true);

  // Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const token = localStorage.getItem("token");

  const fetchData = async () => {
    setLoading(true);
    try {
      const [prodRes, catRes] = await Promise.all([
        axios.get(`${import.meta.env.VITE_API_URL}/admin/get-products`, {
          headers: {
            "Authorization": "Bearer " + token
          }
        }),
        axios.get(`${import.meta.env.VITE_API_URL}/categories`)
      ]);
      setProducts(Array.isArray(prodRes.data) ? prodRes.data : []);
      setCategories(Array.isArray(catRes.data) ? catRes.data : []);
    } catch (err) {
      toast.error("خطأ في مزامنة منتجات الخزينة");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const handleDelete = async (id, name) => {
    if (window.confirm(`هل أنت متأكد من حذف القطعة "${name || ''}" نهائياً من الكتالوج؟`)) {
      const toastId = toast.loading("جاري حذف القطعة...");
      try {
        await axios.delete(`${import.meta.env.VITE_API_URL}/products/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success("تم حذف المنتج بنجاح", { id: toastId });
        fetchData();
      } catch (err) {
        toast.error("فشل الحذف، تحقق من الصلاحيات", { id: toastId });
      }
    }
  };

  const filteredProducts = products.filter(p =>
    p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.sku?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / itemsPerPage));
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
    <div className="space-y-6 font-cairo" dir="rtl">

      {/* Top Header & Search Bar */}
      <div className={`flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 p-5 rounded-3xl border transition-colors ${
        isDarkMode ? 'bg-[#0c0d12]/90 border-white/10' : 'bg-slate-50 border-slate-200'
      }`}>
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className={`w-11 h-11 rounded-2xl border flex items-center justify-center ${
              isDarkMode ? 'bg-silver-400/10 border-silver-400/20 text-silver-300' : 'bg-white border-slate-200 text-slate-800'
            }`}>
              <Gem className="w-6 h-6 text-silver-200" />
            </div>
            <div>
              <h2 className={`text-xl sm:text-2xl font-black ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                خزينة ومخزون المصوغات (Jewelry Vault)
              </h2>
              <p className={`text-sm mt-0.5 font-medium ${isDarkMode ? 'text-silver-400' : 'text-slate-500'}`}>
                إدارة الكتالوج، متابعة الأوزان، والمخزون المتوفر
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row w-full lg:w-auto items-center gap-3">
          {/* Search Input */}
          <div className="relative w-full sm:w-72">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-silver-400" />
            <input
              type="text"
              placeholder="بحث بالاسم أو كود SKU..."
              className={`w-full pr-11 pl-4 py-2.5 rounded-2xl text-sm font-medium outline-none transition-all ${
                isDarkMode 
                  ? 'bg-black/50 border border-white/15 text-white placeholder-silver-500 focus:border-silver-400' 
                  : 'bg-white border border-slate-200 text-slate-900 placeholder-slate-400 focus:border-slate-400 shadow-sm'
              }`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Add Product Button */}
          <button
            onClick={() => navigate('/admin/products/add')}
            className={`w-full sm:w-auto px-6 py-3 rounded-2xl flex items-center justify-center gap-2 font-black text-sm shadow-md transition-all active:scale-95 whitespace-nowrap cursor-pointer ${
              isDarkMode 
                ? 'bg-gradient-to-r from-silver-300 via-silver-200 to-silver-400 hover:brightness-110 text-black' 
                : 'bg-slate-900 hover:bg-black text-white shadow-slate-900/10'
            }`}
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>إضافة قطعة جديدة</span>
          </button>
        </div>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="flex flex-col items-center justify-center min-h-[360px] gap-3">
          <div className="w-10 h-10 border-2 border-silver-300 border-t-transparent rounded-full animate-spin" />
          <span className="text-silver-400 text-sm font-mono tracking-widest uppercase">جاري تحميل كتالوج الفضة...</span>
        </div>
      ) : currentItems.length === 0 ? (
        <div className={`text-center py-20 rounded-3xl border ${
          isDarkMode ? 'bg-[#0c0d12]/60 border-white/10' : 'bg-slate-50 border-slate-200'
        }`}>
          <Package className="w-12 h-12 text-silver-600 mx-auto mb-3" />
          <p className="text-silver-400 text-base font-bold">لا توجد منتجات مطابقة لعملية البحث</p>
        </div>
      ) : (
        /* Products Grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
          {currentItems.map((p) => {
            const categoryName = categories.find(c => c.id === p.categoryId)?.name || 'مجوهرات عامة';
            const isOutOfStock = Number(p.stock) === 0;
            const isLowStock = Number(p.stock) > 0 && Number(p.stock) <= 3;

            return (
              <div
                key={p.id}
                className={`rounded-3xl p-4 sm:p-5 border shadow-xl transition-all duration-300 group flex flex-col justify-between relative overflow-hidden ${
                  isDarkMode 
                    ? 'bg-[#0c0d12]/90 border-white/10 hover:border-white/20' 
                    : 'bg-white border-slate-200 hover:border-slate-300 shadow-slate-200/50'
                }`}
              >
                <div>
                  {/* Image & Quick Action Floating Buttons */}
                  <div className={`relative aspect-square w-full rounded-2xl overflow-hidden mb-4 border ${
                    isDarkMode ? 'bg-black/60 border-white/5' : 'bg-slate-100 border-slate-200'
                  }`}>
                    {p.image ? (
                      <img
                        src={`${import.meta.env.VITE_URL}/${p.image}`}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        alt={p.name}
                        onError={(e) => { e.target.style.display = 'none'; }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-silver-400">
                        <Gem className="w-12 h-12" />
                      </div>
                    )}

                    {/* Action buttons */}
                    <div className="absolute top-3 left-3 flex flex-col gap-2 opacity-90 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => navigate(`/admin/products/edit/${p.id}`)}
                        className={`p-2.5 rounded-xl border transition-all shadow-md cursor-pointer ${
                          isDarkMode 
                            ? 'bg-black/80 text-silver-300 hover:text-white border-white/15 hover:bg-black' 
                            : 'bg-white text-slate-700 hover:text-slate-900 border-slate-200 hover:bg-slate-50'
                        }`}
                        title="تعديل القطعة"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(p.id, p.name)}
                        className={`p-2.5 rounded-xl border transition-all shadow-md cursor-pointer ${
                          isDarkMode 
                            ? 'bg-black/80 text-rose-400 hover:text-rose-300 border-white/15 hover:bg-rose-950/40' 
                            : 'bg-white text-rose-600 hover:text-rose-700 border-slate-200 hover:bg-rose-50'
                        }`}
                        title="حذف القطعة"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* SKU badge */}
                    <div className={`absolute bottom-3 right-3 border px-2.5 py-1 rounded-lg text-xs font-mono font-bold tracking-wider ${
                      isDarkMode ? 'bg-black/85 text-silver-200 border-white/15' : 'bg-white/90 text-slate-800 border-slate-200'
                    }`}>
                      {p.sku || 'SKU-925'}
                    </div>
                  </div>

                  {/* Header Row: Category & Stock status */}
                  <div className="flex items-center justify-between gap-2 mb-2.5">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-lg border ${
                      isDarkMode ? 'text-silver-300 bg-white/5 border-white/10' : 'text-slate-700 bg-slate-100 border-slate-200'
                    }`}>
                      {categoryName}
                    </span>

                    <span className={`text-xs font-mono font-bold flex items-center gap-1.5 px-2.5 py-1 rounded-lg border ${
                      isOutOfStock
                        ? 'bg-rose-500/10 text-rose-500 border-rose-500/20'
                        : isLowStock
                        ? 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                        : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                    }`}>
                      <Package className="w-3.5 h-3.5" />
                      <span>{isOutOfStock ? 'نفذ المخزون' : `${p.stock} متوفر`}</span>
                    </span>
                  </div>

                  {/* Product Title */}
                  <h3 className={`font-black text-base mb-3 line-clamp-1 leading-snug ${
                    isDarkMode ? 'text-white group-hover:text-silver-200' : 'text-slate-900'
                  }`}>
                    {p.name}
                  </h3>
                </div>

                {/* Footer specs: Weight & Price */}
                <div className={`pt-3.5 border-t flex items-center justify-between ${
                  isDarkMode ? 'border-white/10' : 'border-slate-100'
                }`}>
                  <div className="flex items-center gap-1.5 text-sm">
                    <Scale className="w-4 h-4 text-silver-400" />
                    <span className="font-mono font-bold text-base">{p.weight || '—'}</span>
                    <span className="text-xs text-silver-400 font-sans">جرام</span>
                  </div>

                  <div className="text-left font-mono">
                    <span className={`text-base sm:text-lg font-black ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                      {Number(p.price || 0).toLocaleString()}
                    </span>
                    <span className="text-xs text-silver-400 font-sans mr-1">د.أ</span>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className={`flex flex-col sm:flex-row items-center justify-between gap-4 p-5 rounded-3xl border ${
          isDarkMode ? 'bg-[#0c0d12]/90 border-white/10' : 'bg-slate-50 border-slate-200'
        }`}>
          <div className="text-sm font-medium">
            إجمالي المنتجات: <span className="font-mono font-bold text-base">{filteredProducts.length}</span> قطعة | صفحة {currentPage} من {totalPages}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`p-2.5 rounded-xl border transition-all disabled:opacity-20 disabled:cursor-not-allowed ${
                isDarkMode ? 'border-white/10 bg-white/5 text-silver-300 hover:bg-white/10' : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-100'
              }`}
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-1.5">
              {getPaginationGroup().map((item, index) => (
                <React.Fragment key={index}>
                  {item === '...' ? (
                    <span className="w-8 text-center text-silver-500 font-mono text-sm">...</span>
                  ) : (
                    <button
                      onClick={() => setCurrentPage(item)}
                      className={`w-9 h-9 rounded-xl font-mono text-sm font-bold transition-all cursor-pointer ${
                        currentPage === item
                          ? isDarkMode
                            ? 'bg-gradient-to-r from-silver-300 to-silver-100 text-[#070709] shadow-md'
                            : 'bg-slate-900 text-white shadow-md'
                          : isDarkMode
                            ? 'border border-white/10 bg-white/5 text-silver-400 hover:text-white'
                            : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-100'
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
              className={`p-2.5 rounded-xl border transition-all disabled:opacity-20 disabled:cursor-not-allowed ${
                isDarkMode ? 'border-white/10 bg-white/5 text-silver-300 hover:bg-white/10' : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-100'
              }`}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

    </div>
  );
}

export default ProductsList;