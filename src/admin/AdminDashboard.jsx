import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { 
  FiBox, FiShoppingBag, FiTag, FiStar, FiMenu, 
  FiTrendingUp, FiLogOut, FiChevronLeft, 
  FiRefreshCw, FiUsers, FiShield, FiMessageSquare,
  FiSearch, FiActivity, FiX,
  FiTruck,
  FiCalendar,
  FiCheck
} from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import imgLogo from '../images/logo.png'

// المكونات الفرعية
import OrdersTable from './OrdersTable';
import ProductsList from './ProductsList';
import CategoriesList from './CategoriesList';
import StatsOverview from './StatsOverview';
import AdminsPage from './AdminsPage';
import ClientsPage from './ClientsPage';
import ReviewsPage from './ReviwsPage';
import ShippingDelivery from './ShippingDelivery';
import PricingCalculator from './PricingCalculator';
import OrdersSilverTable from './OrdersSilverTable';
import CustomOrdersPage from './CustomOrdersPage';

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({
    totalSales: 0, ordersCount: 0, productsCount: 0, pendingCustomOrders: 0
  });
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user")) || { name: "المدير" };
  const userPermissions = user?.permissions || [];
  const token = localStorage.getItem("token");

  // دالة جلب البيانات (محسنة بـ useCallback لمنع إعادة التعريف)
  const fetchStats = useCallback(async (isSilent = false) => {
    if (!isSilent) setLoading(true);
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/admin/stats`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStats(response.data);
      if (!isSilent) toast.success("تم تحديث البيانات اللحظية");
    } catch (error) {
      toast.error("حدث خطأ في جلب البيانات");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (token) fetchStats(true);
    // تحديث تلقائي كل 5 دقائق
    const interval = setInterval(() => fetchStats(true), 300000);
    return () => clearInterval(interval);
  }, [fetchStats, token]);

  const handleLogout = () => {
    toast((t) => (
      <div className="flex flex-col gap-3 font-['Tajawal'] text-right">
        <p className="font-bold text-slate-800">هل تود تسجيل الخروج فعلاً؟</p>
        <div className="flex gap-2 justify-start">
          <button 
            onClick={() => { localStorage.clear(); navigate("/login"); toast.dismiss(t.id); }}
            className="bg-rose-500 text-white px-4 py-1 rounded-lg text-xs"
          >تأكيد</button>
          <button onClick={() => toast.dismiss(t.id)} className="bg-slate-100 px-4 py-1 rounded-lg text-xs">إلغاء</button>
        </div>
      </div>
    ), { duration: 5000 });
  };

  const allMenuItems = [
    { id: 'overview', label: 'الإحصائيات العامة', icon: <FiTrendingUp />, color: 'rose', key: "الاحصائيات العامة" },
    { id: 'orders', label: 'إدارة الطلبات', icon: <FiBox />, color: 'blue', key: "ادارة الطلبات" },
    { id: 'custom-orders', label: 'إدارة الطلبات المخصصة', icon: <FiBox />, color: 'blue', key: "ادارة الطلبات المخصصة" },
    { id: 'orders-silver', label: 'طلبات السبائك', icon: <FiBox />, color: 'blue', key: "طلبات السبائك" },
    { id: 'products', label: 'كتالوج المنتجات', icon: <FiShoppingBag />, color: 'emerald', key: "ادارة المنتجات" },
    { id: 'categories', label: 'التصنيفات', icon: <FiTag />, color: 'purple', key: "التصنيفات" },
    { id: 'reviws', label: 'تقييمات العملاء', icon: <FiMessageSquare />, color: 'indigo', key: "تقييمات العملاء" },
    { id: 'shipping-delivery', label: 'الشحن والتوصيل', icon: <FiTruck />, color: 'amber', key:"الشحن والتوصيل" },
    { id: 'pricing-calculator', label: 'حاسبة الأسعار', icon: <FiCalendar />, color: 'amber', key: "حاسبة الاسعار" },
    { id: 'clients', label: 'قاعدة العملاء', icon: <FiUsers />, color: 'amber', key: "قاعدة العملاء" },
    { id: 'CashierSystem', label: 'نظام الكاشير', icon: <FiCheck />, color: 'indigo', key:  'نظام الكاشير' },
    { id: 'admins', label: 'فريق العمل', icon: <FiShield />, color: 'indigo', key: 'فريق العمل' },
  ];
const allowedMenuItems = useMemo(() => {
    return allMenuItems.filter(item => userPermissions.includes(item.key));
  }, [userPermissions]);
  const hasPermission = (key) => userPermissions.includes(key);
  return (
    <div className="flex min-h-screen bg-[#F0F2F5] font-['Tajawal'] text-right selection:bg-rose-500 selection:text-white" dir="rtl">
      <Toaster position="top-left" />

      {/* Sidebar Overlay for Mobile */}
      {!isSidebarOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden" onClick={() => setSidebarOpen(true)} />
      )}

      {/* القائمة الجانبية المحدثة */}
      <aside className={`fixed lg:static inset-y-0 right-0 z-50 w-72 bg-slate-900 text-white transform ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'} lg:translate-x-0 transition-all duration-500 ease-[cubic-bezier(0.4, 0, 0.2, 1)] m-4 rounded-[2.5rem] shadow-2xl flex flex-col`}>
        <div className="p-8">
          <div className="flex  items-center gap-3 bg-gradient-to-br from-white/10 to-transparent p-4 rounded-3xl border border-white/5 shadow-inner">
              <span className="text-xl font-black block leading-none uppercase text-center">ELITE SILVER 925</span>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-1 overflow-y-auto custom-scrollbar">
          {allowedMenuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-5 py-4 rounded-2xl transition-all duration-300 group relative overflow-hidden ${
                activeTab === item.id 
                ? 'bg-surface-card text-white shadow-xl shadow-surface-card/20' 
                : 'text-slate-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-4 z-10">
                <span className={`text-xl transition-transform duration-500 ${activeTab === item.id ? 'scale-110' : 'group-hover:rotate-12'}`}>{item.icon}</span>
                <span className="font-bold text-[13px]">{item.label}</span>
              </div>
              {activeTab === item.id && <FiChevronLeft className="animate-bounce-x z-10" />}
            </button>
          ))}
        </nav>

        <div className="p-6 border-t border-white/5 bg-slate-950/30 rounded-b-[2.5rem]">
          <button onClick={handleLogout} className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-slate-400 hover:bg-rose-500/10 hover:text-rose-400 transition-all">
            <FiLogOut className="text-xl" />
            <span className="font-bold text-sm">تسجيل الخروج</span>
          </button>
        </div>
      </aside>

      {/* المحتوى الرئيسي المحسن */}
      <main className="flex-1 flex flex-col min-w-0 p-4 lg:p-6 overflow-hidden">
        
        {/* شريط البحث العلوي والرأس */}
        <header className="grid grid-cols-1 md:grid-cols-2 items-center bg-white/80 backdrop-blur-xl p-4 rounded-[2.5rem] shadow-sm border border-white mb-6 gap-4">
          <div className="flex items-center gap-4 col-span-1">
            <div>
              <h1 className="text-lg font-black text-slate-800 leading-none">
                {allowedMenuItems.find(i => i.id === activeTab)?.label}
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></span>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider ">نظام متصل مباشر</p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 col-span-1">
            <button onClick={() => fetchStats()} className="p-3 text-slate-400 hover:bg-slate-100 rounded-2xl transition-all group relative">
              <FiRefreshCw className={`${loading ? 'animate-spin text-rose-500' : 'group-hover:rotate-180 transition-transform duration-700'}`} size={18} />
            </button>
            
            <div className="h-8 w-[1px] bg-slate-200 mx-2"></div>

            <div className="flex items-center gap-3">
              <div className="text-left">
                <p className="text-sm font-black text-slate-800 leading-none">{user.name}</p>
                <p className="text-[9px] text-rose-500 font-black mt-1 uppercase tracking-tighter">System Administrator</p>
              </div>
              <div className="relative">
                <img 
                  src={`https://ui-avatars.com/api/?name=${user.name}&background=f43f5e&color=fff&bold=true&rounded=true`} 
                  alt="avatar" 
                  className="w-11 h-11 rounded-2xl shadow-md border-2 border-white ring-4 ring-slate-50"
                />
                <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full"></span>
              </div>
            </div>
          </div>
        </header>

        {/* منطقة العمل الديناميكية */}
        <div className="flex-1 relative overflow-hidden group">
          <div className="bg-white/90 backdrop-blur-md rounded-[3.5rem] shadow-2xl shadow-slate-200/60 border border-white min-h-[calc(100vh-180px)] overflow-y-auto custom-scrollbar p-4 md:p-8">
            {/* تأثير التحميل اللطيف */}
            {loading ? (
              <div className="flex flex-col items-center justify-center h-full space-y-4 opacity-50">
                <FiActivity className="text-4xl text-rose-500 animate-bounce" />
                <p className="text-xs font-bold tracking-widest text-slate-400 uppercase">جاري مزامنة البيانات...</p>
              </div>
            ) : (
              <div className="animate-in fade-in zoom-in duration-500">
             {activeTab === 'overview' && hasPermission("الاحصائيات العامة") && <StatsOverview stats={stats} />}
                {activeTab === 'orders' && hasPermission("ادارة الطلبات") && <OrdersTable searchQuery={searchQuery} />}
                {activeTab === 'orders-silver' && hasPermission("طلبات السبائك") && <OrdersSilverTable />}
                {activeTab === 'custom-orders' && hasPermission("ادارة الطلبات المخصصة") && <CustomOrdersPage />}
                {activeTab === 'products' && hasPermission("ادارة المنتجات") && <ProductsList searchQuery={searchQuery} />}
                {activeTab === 'categories' && hasPermission("التصنيفات") && <CategoriesList />}
                {activeTab === 'clients' && hasPermission("قاعدة العملاء") && <ClientsPage />}
                {activeTab === 'shipping-delivery' && hasPermission("الشحن والتوصيل") && <ShippingDelivery />}
                {activeTab === 'pricing-calculator' && hasPermission("حاسبة الاسعار") && <PricingCalculator />}
                {activeTab === 'admins' && hasPermission("فريق العمل") && <AdminsPage />}
                {activeTab === 'reviws' && hasPermission("تقييمات العملاء") && <ReviewsPage />}
                {activeTab === 'CashierSystem' && hasPermission("نظام الكاشير") && navigate("./cashier-system")}
                
                {!hasPermission(allMenuItems.find(i => i.id === activeTab)?.key) && (
                  <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                    <FiShield size={50} className="mb-4 opacity-20" />
                    <p className="font-bold">عذراً، ليس لديك صلاحية للوصول لهذا القسم</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* تنسيقات CSS مخصصة */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #E2E8F0; border-radius: 10px; }
        .animate-bounce-x { animation: bounce-x 1s infinite; }
        @keyframes bounce-x {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(-5px); }
        }
      `}</style>
    </div>
  );
}

export default AdminDashboard;