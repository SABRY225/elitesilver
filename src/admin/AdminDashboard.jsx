import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { 
  TrendingUp,
  Package,
  Sparkles,
  ShoppingBag,
  Tag,
  MessageSquare,
  Truck,
  Users,
  ShieldCheck,
  LogOut,
  ChevronLeft,
  RefreshCw,
  Coins,
  CheckCircle2,
  Menu,
  X,
  SlidersHorizontal,
  Gift,
  Store,
  BookOpen,
  FileText,
  ClipboardCheck,
  CalendarCheck
} from 'lucide-react';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import imgLogo from '../images/logo.png';

function AdminDashboard() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    localStorage.removeItem("adminTheme");
    document.documentElement.classList.remove('dark');
  }, []);

  const isDarkMode = false;

  const [stats, setStats] = useState({
    totalSales: 0, ordersCount: 0, productsCount: 0, pendingCustomOrders: 0
  });
  const [loading, setLoading] = useState(false);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const user = JSON.parse(localStorage.getItem("user")) || { name: "المدير العام" };
  const userPermissions = user?.permissions || [];
  const token = localStorage.getItem("token");

  // استخراج المسار النشط من رابط المتصفح
  const currentSubPath = useLocation().pathname.replace(/^\/admin\/?/, '').split('/')[0];
  const activeTab = currentSubPath || 'overview';

  // التحقق من صلاحية المدير العام
  const isSuperAdmin = user?.email === 'admin@elitesilver925.com' || user?.name === 'المدير العام' || !userPermissions || userPermissions.length === 0;

  // قائمة جميع أقسام لوحة الإدارة مع الأيقونات والصلاحيات والمسار
  const allMenuItems = [
    { id: 'overview', path: 'overview', label: 'الإحصائيات العامة', icon: <TrendingUp className="w-5 h-5" />, key: "الاحصائيات العامة" },
    { id: 'branches', path: 'branches', label: 'إدارة الفروع والموظفين', icon: <Store className="w-5 h-5 text-indigo-600" />, key: "ادارة الفروع" },
    { id: 'employee-attendance', path: 'employee-attendance', label: 'سجل الحضور والغياب', icon: <CalendarCheck className="w-5 h-5 text-teal-600" />, key: "حضور الموظفين" },
    { id: 'employee-advances', path: 'employee-advances', label: 'طلبات سلف الموظفين', icon: <Coins className="w-5 h-5 text-amber-500" />, key: "سلف الموظفين" },
    { id: 'branch-daily-registers', path: 'branch-daily-registers', label: 'سجلات الفروع اليومية', icon: <BookOpen className="w-5 h-5 text-emerald-600" />, key: "سجلات الفروع" },
    { id: 'branch-invoices', path: 'branch-invoices', label: 'فواتير الفروع', icon: <FileText className="w-5 h-5 text-amber-600" />, key: "فواتير الفروع" },
    { id: 'inventory-audits', path: 'inventory-audits', label: 'سجل الجرد (الإدارة فقط)', icon: <ClipboardCheck className="w-5 h-5 text-rose-600" />, key: "سجل الجرد" },
    { id: 'orders', path: 'orders', label: 'إدارة طلبات المتجر', icon: <Package className="w-5 h-5" />, key: "ادارة الطلبات" },
    { id: 'custom-orders', path: 'custom-orders', label: 'طلبات التفصيل الخاص', icon: <Sparkles className="w-5 h-5" />, key: "ادارة الطلبات المخصصة" },
    { id: 'special-orders', path: 'special-orders', label: 'طلبات المناسبات والهدايا', icon: <Gift className="w-5 h-5" />, key: "ادارة الطلبات المخصصة" },
    { id: 'orders-silver', path: 'orders-silver', label: 'طلبات سبائك الفضة', icon: <Coins className="w-5 h-5" />, key: "طلبات السبائك" },
    { id: 'products', path: 'products', label: 'كتالوج المصوغات', icon: <ShoppingBag className="w-5 h-5" />, key: "ادارة المنتجات" },
    { id: 'categories', path: 'categories', label: 'المجموعات والتصنيفات', icon: <Tag className="w-5 h-5" />, key: "التصنيفات" },
    { id: 'reviews', path: 'reviews', label: 'تقييمات وآراء العملاء', icon: <MessageSquare className="w-5 h-5" />, key: "تقييمات العملاء" },
    { id: 'shipping-delivery', path: 'shipping-delivery', label: 'تسعيرات شحن المحافظات', icon: <Truck className="w-5 h-5" />, key: "الشحن والتوصيل" },
    { id: 'pricing-calculator', path: 'pricing-calculator', label: 'حاسبة تسعير الفضة', icon: <SlidersHorizontal className="w-5 h-5" />, key: "حاسبة الاسعار" },
    { id: 'clients', path: 'clients', label: 'قاعدة بيانات المشترين', icon: <Users className="w-5 h-5" />, key: "قاعدة العملاء" },
    // { id: 'cashier-system', path: 'cashier-system', label: 'نظام الكاشير ونقاط البيع', icon: <CheckCircle2 className="w-5 h-5 text-emerald-500" />, key: 'نظام الكاشير' },
    { id: 'admins', path: 'admins', label: 'فريق العمل والصلاحيات', icon: <ShieldCheck className="w-5 h-5" />, key: 'فريق العمل' },
  ];

  const allowedMenuItems = useMemo(() => {
    return allMenuItems.filter(item => isSuperAdmin || userPermissions.includes(item.key) || (item.key === "حضور الموظفين" && userPermissions.includes("ادارة الفروع")));
  }, [userPermissions, isSuperAdmin]);

  const hasPermission = (key) => isSuperAdmin || userPermissions.includes(key) || (key === "حضور الموظفين" && userPermissions.includes("ادارة الفروع"));

  // جلب إحصائيات النظام اللحظية
  const fetchStats = useCallback(async (isSilent = false) => {
    if (!isSilent) setLoading(true);
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/admin/stats`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStats(response.data);
      if (!isSilent) toast.success("تم تحديث الإحصائيات اللحظية بنجاح");
    } catch (error) {
      if (!isSilent) toast.error("حدث خطأ في مزامنة البيانات");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (token) fetchStats(true);
    const interval = setInterval(() => fetchStats(true), 300000);
    return () => clearInterval(interval);
  }, [fetchStats, token]);

  const handleLogout = () => {
    toast((t) => (
      <div className="flex flex-col gap-3 font-cairo text-right" dir="rtl">
        <p className="font-bold text-sm">هل تود تسجيل الخروج من لوحة الإدارة؟</p>
        <div className="flex gap-2 justify-start pt-1">
          <button 
            onClick={() => { localStorage.clear(); navigate("/login"); toast.dismiss(t.id); }}
            className="bg-rose-500 hover:bg-rose-600 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-md"
          >
            تأكيد الخروج
          </button>
          <button 
            onClick={() => toast.dismiss(t.id)} 
            className="bg-slate-200 dark:bg-white/10 text-slate-800 dark:text-white px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer"
          >
            إلغاء
          </button>
        </div>
      </div>
    ), { 
      duration: 5000,
      style: {
        background: isDarkMode ? '#0c0d12' : '#ffffff',
        border: isDarkMode ? '1px solid rgba(255,255,255,0.15)' : '1px solid #e2e8f0',
        color: isDarkMode ? '#fff' : '#0f172a',
        fontFamily: 'Cairo, sans-serif'
      }
    });
  };

  // التحقق من صلاحية التبويب الحالي
  const currentItem = allMenuItems.find(i => i.id === activeTab || (activeTab === 'reviws' && i.id === 'reviews'));
  const isCurrentAllowed = !currentItem || hasPermission(currentItem.key);

  return (
    <div 
      className="min-h-screen font-cairo text-right bg-[#f4f6fa] text-slate-900 light selection:bg-silver-400 selection:text-black" 
      dir="rtl"
    >

      {/* غطاء الشاشة عند فتح القائمة على الهواتف */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden" 
          onClick={() => setSidebarOpen(false)} 
        />
      )}

      <div className="flex min-h-screen">
        {/* القائمة الجانبية (Sidebar) */}
        <aside 
          className={`fixed lg:sticky top-0 h-screen inset-y-0 right-0 z-50 w-72 transition-all duration-300 ease-in-out flex flex-col justify-between shadow-2xl bg-white border-l border-slate-200 text-slate-800 ${
            isSidebarOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'
          }`}
        >
          <div className="flex flex-col h-full overflow-hidden">
            {/* ترويسة اللوجو */}
            <div className="p-6 pb-5 border-b border-slate-100 flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl p-2 flex items-center justify-center border border-slate-200 bg-slate-50 shadow-sm">
                  <img src={imgLogo} alt="Logo" className="w-full h-full object-contain" />
                </div>
                <div>
                  <span className="font-black text-base tracking-wider uppercase block text-slate-900">ELITE SILVER</span>
                  <span className="text-xs text-slate-400 font-mono">Atelier Control 925</span>
                </div>
              </div>

              <button 
                onClick={() => setSidebarOpen(false)}
                className="p-2 rounded-xl lg:hidden text-slate-400 hover:text-slate-900 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* روابط التنقل الرئيسية */}
            <nav className="p-3.5 space-y-1.5 flex-1 overflow-y-auto custom-scrollbar">
              {allowedMenuItems.map((item) => {
                const isActive = activeTab === item.id || (activeTab === 'reviws' && item.id === 'reviews');

                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      navigate(`/admin/${item.path}`);
                      if (window.innerWidth < 1024) setSidebarOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl transition-all duration-200 group cursor-pointer text-sm font-bold ${
                      isActive 
                        ? 'bg-slate-900 text-white font-black shadow-lg shadow-slate-900/10'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <span className={`transition-transform duration-200 ${
                        isActive 
                          ? 'text-white' 
                          : 'text-slate-400 group-hover:text-slate-900'
                      }`}>
                        {item.icon}
                      </span>
                      <span className="leading-snug">{item.label}</span>
                    </div>

                    {isActive && (
                      <ChevronLeft className="w-4 h-4 rotate-180 text-white" />
                    )}
                  </button>
                );
              })}
            </nav>

            {/* زر تسجيل الخروج السفلي */}
            <div className="p-4 border-t border-slate-100 bg-slate-50 flex-shrink-0">
              <button 
                onClick={handleLogout} 
                className="w-full flex items-center justify-between px-4 py-3 rounded-2xl text-rose-500 hover:bg-rose-500/10 border border-rose-500/20 transition-all text-sm font-bold cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <LogOut className="w-4 h-4" />
                  <span>تسجيل الخروج</span>
                </div>
                <span className="text-[11px] opacity-70 font-mono">End Session</span>
              </button>
            </div>
          </div>
        </aside>

        {/* مساحة العمل الرئيسية */}
        <main className="flex-1 flex flex-col min-w-0 p-4 sm:p-6 lg:p-8 overflow-x-hidden">
          
          {/* الشريط العلوي الفاخر (Header) */}
          <header className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between p-4 sm:p-5 rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-200/50 backdrop-blur-xl mb-6 gap-4">
            <div className="flex items-center gap-3.5">
              <button 
                onClick={() => setSidebarOpen(true)}
                className="p-2.5 rounded-xl lg:hidden border bg-slate-100 border-slate-200 text-slate-800"
              >
                <Menu className="w-5 h-5" />
              </button>
              
              <div>
                <h1 className="text-xl sm:text-2xl font-black tracking-wide leading-tight text-slate-900">
                  {currentItem?.label || 'لوحة التحكم المركزية'}
                </h1>
              </div>
            </div>

            {/* أدوات التحكم العلوية: التحديث وبيانات المسؤول */}
            <div className="flex items-center justify-end gap-3 flex-wrap">
              {/* زر تحديث الإحصائيات */}
              <button 
                onClick={() => fetchStats()} 
                title="تحديث البيانات اللحظية"
                className="p-2.5 rounded-2xl border border-slate-200 bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all cursor-pointer group shadow-sm"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-emerald-500' : 'group-hover:rotate-180 transition-transform duration-500'}`} />
              </button>

              <div className="h-8 w-[1px] hidden sm:block bg-slate-200" />

              {/* بطاقة هوية المدير */}
              <div className="flex items-center gap-3 px-4 py-2 rounded-2xl border bg-slate-50 border-slate-200">
                <div className="text-left hidden sm:block">
                  <p className="text-sm font-black leading-tight text-slate-900">{user.name}</p>
                  <p className="text-[10px] text-slate-400 font-mono uppercase tracking-wider mt-0.5">Administrator</p>
                </div>
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-slate-300 to-slate-200 p-[1px] shadow-sm">
                  <div className="w-full h-full rounded-[11px] flex items-center justify-center font-bold text-sm bg-white text-slate-900 border border-slate-100">
                    {user.name?.charAt(0) || 'A'}
                  </div>
                </div>
              </div>
            </div>
          </header>

          {/* مساحة عرض المحتوى للمسار النشط */}
          <div className="flex-1 min-h-[calc(100vh-190px)] rounded-3xl p-5 sm:p-8 backdrop-blur-2xl border border-slate-200 bg-white shadow-xl shadow-slate-200/50">
            {loading && (
              <div className="flex flex-col items-center justify-center min-h-[300px] gap-3">
                <div className="w-10 h-10 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" />
                <p className="text-sm font-mono tracking-widest text-slate-400 uppercase">جاري مزامنة بيانات المتجر...</p>
              </div>
            )}

            {!loading && !isCurrentAllowed && (
              <div className="flex flex-col items-center justify-center py-28 text-slate-400 gap-3">
                <ShieldCheck className="w-16 h-16 opacity-30 text-rose-500" />
                <h3 className="text-lg font-bold text-slate-800">الصلاحيات مقيدة</h3>
                <p className="text-sm">عذراً، حسابك لا يمتلك الصلاحية الكافية للوصول إلى هذا القسم الإداري.</p>
              </div>
            )}

            {!loading && isCurrentAllowed && (
              <Outlet context={{ stats, isDarkMode: false, searchQuery, fetchStats, user }} />
            )}
          </div>
        </main>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 5px; height: 5px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(0,0,0,0.02); }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.15); border-radius: 9999px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(0,0,0,0.3); }
      `}</style>
    </div>
  );
}

export default AdminDashboard;