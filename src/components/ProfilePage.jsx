import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  ShoppingBag,
  LogOut,
  Package,
  MapPin,
  ChevronRight,
  Clock,
  Coins,
  ShieldCheck,
  Phone,
  Mail,
  Calendar,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Truck,
  ArrowRight,
  ArrowLeft,
  Gem
} from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { useLanguage } from "../contexts/LanguageContext";
import Navbar from "./Navbar";
import Footer from "./Footer";

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('orders'); // 'orders' | 'bullion' | 'account'
  const [orders, setOrders] = useState([]);
  const [bullionOrders, setBullionOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { t, isRTL, language } = useLanguage();
  const isAr = language === 'ar' || isRTL;
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (!token || !userData) {
      navigate('/');
      return;
    }

    try {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      loadUserOrders(parsedUser.id, token);
      loadBullionOrders(parsedUser.id, token);
    } catch (error) {
      console.error('Failed to parse user data:', error);
      navigate('/');
    }
  }, [navigate]);

  const loadUserOrders = async (userId, token) => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/orders/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Failed to fetch user orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadBullionOrders = async (userId, token) => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/orders/silver/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBullionOrders(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Failed to fetch bullion orders:', error);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    window.dispatchEvent(new CustomEvent('authUpdated'));
    navigate('/');
  };

  const getStatusStyles = (status) => {
    const s = String(status || 'pending').toLowerCase();
    const map = {
      delivered: {
        bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
        dot: 'bg-emerald-400',
        label: isAr ? 'تم التوصيل' : 'Delivered',
      },
      shipped: {
        bg: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
        dot: 'bg-blue-400',
        label: isAr ? 'قيد الشحن' : 'Shipped',
      },
      pending: {
        bg: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
        dot: 'bg-amber-400',
        label: isAr ? 'قيد التجهيز' : 'Processing',
      },
      cancelled: {
        bg: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
        dot: 'bg-rose-400',
        label: isAr ? 'ملغي' : 'Cancelled',
      },
    };
    return map[s] || {
      bg: 'bg-white/10 text-silver-300 border-white/20',
      dot: 'bg-silver-400',
      label: status || (isAr ? 'قيد المراجعة' : 'Pending'),
    };
  };

  const safeParseCartItems = (raw) => {
    if (!raw) return [];
    if (Array.isArray(raw)) return raw;
    try {
      const parsed = typeof raw === 'string' ? JSON.parse(raw) : raw;
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#070709] text-white font-sans selection:bg-silver-500/30 selection:text-white" dir={isRTL ? 'rtl' : 'ltr'}>
      <Navbar />

      <main className="container mx-auto px-4 sm:px-6 pt-36 pb-28 max-w-7xl">
        {/* VIP Top Greeting Banner */}
        <div className="relative mb-10 overflow-hidden rounded-[2.5rem] bg-gradient-to-r from-[#0d0e14] via-[#12131b] to-[#0d0e14] border border-white/10 p-8 sm:p-12 shadow-[0_15px_50px_rgba(0,0,0,0.5)]">
          <div className="absolute top-0 right-0 w-80 h-80 bg-silver-400/5 rounded-full blur-[90px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-amber-500/5 rounded-full blur-[90px] pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-5 sm:gap-6">
              <div className="relative flex-shrink-0">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-tr from-silver-600 via-silver-200 to-white p-[2px] shadow-lg shadow-silver-500/20">
                  <div className="w-full h-full rounded-[14px] bg-[#0c0d12] flex items-center justify-center">
                    <User className="w-10 h-10 text-silver-200" />
                  </div>
                </div>
                <span className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 border-2 border-[#070709] flex items-center justify-center text-black" title="Active VIP Account">
                  <Sparkles className="w-3.5 h-3.5 text-black" />
                </span>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] bg-silver-300/10 text-silver-200 border border-silver-300/30">
                    {t('premiumMember') || (isAr ? 'عضوية النخبة VIP' : 'Elite VIP Member')}
                  </span>
                  <span className="text-xs text-silver-400/70 hidden sm:inline">• 925 Guaranteed</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-tight">
                  {user.name || user.email?.split('@')[0]}
                </h1>
                <p className="text-xs sm:text-sm text-silver-400 font-mono mt-0.5">{user.email}</p>
              </div>
            </div>

            {/* Quick Stats Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 border-t md:border-t-0 md:border-s border-white/10 pt-4 md:pt-0 md:ps-8">
              <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/5 text-center">
                <span className="text-[11px] uppercase tracking-wider text-silver-400 block mb-0.5">
                  {isAr ? 'قطع المجوهرات' : 'Jewelry'}
                </span>
                <span className="text-xl sm:text-2xl font-bold font-mono text-white">
                  {orders.length}
                </span>
              </div>
              <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/5 text-center">
                <span className="text-[11px] uppercase tracking-wider text-silver-400 block mb-0.5">
                  {isAr ? 'سبائك الفضة' : 'Bullion'}
                </span>
                <span className="text-xl sm:text-2xl font-bold font-mono text-amber-300">
                  {bullionOrders.length}
                </span>
              </div>
              <div className="col-span-2 sm:col-span-1 p-3.5 rounded-2xl bg-white/[0.03] border border-white/5 text-center flex flex-col justify-center">
                <span className="text-[11px] uppercase tracking-wider text-silver-400 block mb-0.5">
                  {isAr ? 'الضمان المعتمد' : 'Warranty'}
                </span>
                <span className="text-xs font-bold text-emerald-400 flex items-center justify-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> 100% 925
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Sidebar Nav */}
          <div className="lg:col-span-3 space-y-3">
            <div className="p-3 rounded-2xl bg-[#0c0d12]/90 border border-white/10 backdrop-blur-xl space-y-1.5">
              <SidebarTab
                active={activeTab === 'orders'}
                onClick={() => setActiveTab('orders')}
                icon={<Package className="w-4 h-4" />}
                label={t('myOrders') || (isAr ? 'طلبات المجوهرات' : 'Jewelry Orders')}
                count={orders.length}
                isRTL={isRTL}
              />
              <SidebarTab
                active={activeTab === 'bullion'}
                onClick={() => setActiveTab('bullion')}
                icon={<Coins className="w-4 h-4" />}
                label={t('bullionOrders') || (isAr ? 'طلبات سبائك الفضة' : 'Bullion Orders')}
                count={bullionOrders.length}
                isRTL={isRTL}
              />
              <SidebarTab
                active={activeTab === 'account'}
                onClick={() => setActiveTab('account')}
                icon={<User className="w-4 h-4" />}
                label={isAr ? 'بيانات الحساب والملف' : 'Account Details'}
                isRTL={isRTL}
              />
            </div>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-between px-5 py-3.5 rounded-2xl border border-rose-500/20 bg-rose-500/5 hover:bg-rose-500/10 text-rose-400 transition-all text-xs font-bold uppercase tracking-[0.15em] group"
            >
              <div className="flex items-center gap-3">
                <LogOut className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                <span>{t('logout') || (isAr ? 'تسجيل الخروج' : 'Sign Out')}</span>
              </div>
              <span className="text-[10px] opacity-60">VIP</span>
            </button>
          </div>

          {/* Main Display Area */}
          <div className="lg:col-span-9">
            <div className="rounded-[2.5rem] bg-[#0c0d12]/90 border border-white/10 p-6 sm:p-10 backdrop-blur-2xl shadow-[0_15px_50px_rgba(0,0,0,0.4)] min-h-[550px]">
              <AnimatePresence mode="wait">
                {/* 1. JEWELRY ORDERS TAB */}
                {activeTab === 'orders' && (
                  <motion.div
                    key="orders"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.25 }}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-4 pb-6 mb-8 border-b border-white/10">
                      <div>
                        <h2 className="text-2xl font-serif font-bold text-white mb-1">
                          {t('orderHistory') || (isAr ? 'سجل طلبات المجوهرات' : 'Jewelry Orders History')}
                        </h2>
                        <p className="text-xs text-silver-400">
                          {isAr ? 'تتبع طلبات قطع الفضة الإسترليني 925 وحالتها الحالية' : 'Track your sterling silver orders and delivery status'}
                        </p>
                      </div>
                      <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-silver-300">
                        {orders.length} {isAr ? 'طلب' : 'Orders'}
                      </span>
                    </div>

                    {loading ? (
                      <LoadingSpinner isAr={isAr} />
                    ) : orders.length === 0 ? (
                      <EmptyOrdersView isAr={isAr} t={t} type="jewelry" />
                    ) : (
                      <div className="space-y-5">
                        {orders.map((order) => (
                          <OrderCard
                            key={order.id}
                            order={order}
                            statusMeta={getStatusStyles(order.status)}
                            parseCartItems={safeParseCartItems}
                            t={t}
                            isAr={isAr}
                            isRTL={isRTL}
                          />
                        ))}
                      </div>
                    )}
                  </motion.div>
                )}

                {/* 2. BULLION ORDERS TAB */}
                {activeTab === 'bullion' && (
                  <motion.div
                    key="bullion"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.25 }}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-4 pb-6 mb-8 border-b border-white/10">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h2 className="text-2xl font-serif font-bold text-white">
                            {t('bullionOrders') || (isAr ? 'سجل طلبات السبائك الاستثمارية' : 'Silver Bullion Orders')}
                          </h2>
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-amber-500/20 text-amber-300 border border-amber-500/30">
                            Ag 999.0
                          </span>
                        </div>
                        <p className="text-xs text-silver-400">
                          {isAr ? 'سبائك الفضة السويسرية والإيطالية الخالصة المعتمدة' : 'Certified pure investment-grade silver bullion reserves'}
                        </p>
                      </div>
                      <span className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-xs font-mono text-amber-300">
                        {bullionOrders.length} {isAr ? 'سبيكة' : 'Orders'}
                      </span>
                    </div>

                    {loading ? (
                      <LoadingSpinner isAr={isAr} />
                    ) : bullionOrders.length === 0 ? (
                      <EmptyOrdersView isAr={isAr} t={t} type="bullion" />
                    ) : (
                      <div className="space-y-5">
                        {bullionOrders.map((order) => (
                          <BullionOrderCard
                            key={order.id}
                            order={order}
                            statusMeta={getStatusStyles(order.status)}
                            t={t}
                            isAr={isAr}
                          />
                        ))}
                      </div>
                    )}
                  </motion.div>
                )}

                {/* 3. ACCOUNT DETAILS TAB */}
                {activeTab === 'account' && (
                  <motion.div
                    key="account"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.25 }}
                  >
                    <div className="pb-6 mb-8 border-b border-white/10">
                      <h2 className="text-2xl font-serif font-bold text-white mb-1">
                        {isAr ? 'بيانات العضوية والحساب' : 'Account & Membership Details'}
                      </h2>
                      <p className="text-xs text-silver-400">
                        {isAr ? 'معلومات حسابك الخاص لدى إيليت سيلفر 925' : 'Your personal VIP profile records with Elite Silver 925'}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 space-y-4">
                        <div className="flex items-center gap-3 pb-3 border-b border-white/5">
                          <User className="w-5 h-5 text-silver-300" />
                          <h3 className="text-sm font-bold uppercase tracking-wider text-white">
                            {isAr ? 'المعلومات الشخصية' : 'Personal Profile'}
                          </h3>
                        </div>

                        <div>
                          <label className="text-[11px] uppercase tracking-wider text-silver-400 block mb-1">
                            {isAr ? 'الاسم الكامل' : 'Full Name'}
                          </label>
                          <p className="text-sm font-semibold text-white bg-white/5 px-4 py-3 rounded-xl border border-white/5">
                            {user.name || (isAr ? 'عميل النخبة' : 'Elite Client')}
                          </p>
                        </div>

                        <div>
                          <label className="text-[11px] uppercase tracking-wider text-silver-400 block mb-1">
                            {isAr ? 'البريد الإلكتروني' : 'Email Address'}
                          </label>
                          <p className="text-sm font-mono text-silver-200 bg-white/5 px-4 py-3 rounded-xl border border-white/5">
                            {user.email}
                          </p>
                        </div>

                        {user.phone && (
                          <div>
                            <label className="text-[11px] uppercase tracking-wider text-silver-400 block mb-1">
                              {isAr ? 'رقم الهاتف' : 'Phone Number'}
                            </label>
                            <p className="text-sm font-mono text-silver-200 bg-white/5 px-4 py-3 rounded-xl border border-white/5">
                              {user.phone}
                            </p>
                          </div>
                        )}
                      </div>

                      <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 space-y-4">
                        <div className="flex items-center gap-3 pb-3 border-b border-white/5">
                          <ShieldCheck className="w-5 h-5 text-silver-300" />
                          <h3 className="text-sm font-bold uppercase tracking-wider text-white">
                            {isAr ? 'امتيازات عضوية النخبة' : 'VIP Privileges'}
                          </h3>
                        </div>

                        <div className="space-y-3 text-xs text-silver-300/80">
                          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-white/[0.02]">
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                            <span>{isAr ? 'شهادة ضمان الفضة الإيطالية عيار 925 مع كل طلب' : 'Official 925 Italian silver certificate of authenticity with every order'}</span>
                          </div>
                          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-white/[0.02]">
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                            <span>{isAr ? 'أولوية في تجهيز وشحن الطلبات خلال 24 - 48 ساعة' : 'Priority dispatch and express delivery within 24-48 hours'}</span>
                          </div>
                          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-white/[0.02]">
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                            <span>{isAr ? 'تغليف مخملي فاخر مجاني مخصص للإهداء' : 'Complimentary velvet gift packaging suitable for special occasions'}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

/* --- Sidebar Tab Item --- */
const SidebarTab = ({ active, onClick, icon, label, count, isRTL }) => (
  <button
    type="button"
    onClick={onClick}
    className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl transition-all text-xs font-semibold uppercase tracking-[0.15em] ${
      active
        ? 'bg-gradient-to-r from-white via-silver-200 to-silver-300 text-black shadow-lg shadow-white/10 font-bold'
        : 'text-silver-400 hover:text-white hover:bg-white/5'
    }`}
  >
    <div className="flex items-center gap-3">
      <span className={active ? 'text-black' : 'text-silver-400'}>{icon}</span>
      <span>{label}</span>
    </div>
    <div className="flex items-center gap-2">
      {typeof count === 'number' && (
        <span
          className={`px-2 py-0.5 rounded-full text-[10px] font-mono ${
            active ? 'bg-black/15 text-black font-bold' : 'bg-white/10 text-silver-300'
          }`}
        >
          {count}
        </span>
      )}
      <ChevronRight className={`w-3.5 h-3.5 transition-transform ${isRTL ? 'rotate-180' : ''}`} />
    </div>
  </button>
);

/* --- Regular Jewelry Order Card --- */
const OrderCard = ({ order, statusMeta, parseCartItems, t, isAr, isRTL }) => {
  const items = parseCartItems(order.cartItems);
  const dateFormatted = order.createdAt
    ? new Date(order.createdAt).toLocaleDateString(isAr ? 'ar-JO' : 'en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : '';

  return (
    <div className="rounded-2xl bg-white/[0.03] border border-white/10 p-5 sm:p-6 hover:border-silver-400/30 transition-all duration-300 space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-white/5">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-silver-400/10 border border-silver-400/20 flex items-center justify-center text-silver-300">
            <Package className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-white">
                #{order.id}
              </span>
              <span className="text-[11px] text-silver-400 font-mono">• {dateFormatted}</span>
            </div>
            <p className="text-[11px] text-silver-400/80 mt-0.5">
              {items.length} {isAr ? 'قطعة في هذا الطلب' : 'item(s) in this order'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${statusMeta.bg}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${statusMeta.dot}`} />
            {statusMeta.label}
          </span>
          <div className={isAr ? 'text-left' : 'text-right'}>
            <span className="text-base font-bold font-mono text-white">
              {order.total} <span className="text-xs text-silver-400 font-sans">{t('currency') || 'JOD'}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Items list */}
      <div className="space-y-3">
        {items.map((item, idx) => {
          const imgSrc = item.image
            ? item.image.startsWith('http')
              ? item.image
              : `${import.meta.env.VITE_URL}/${item.image}`
            : null;

          return (
            <div
              key={idx}
              className="flex items-center justify-between gap-4 p-3 rounded-xl bg-black/30 border border-white/5"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-12 h-12 rounded-lg bg-white/5 border border-white/10 overflow-hidden flex-shrink-0 flex items-center justify-center">
                  {imgSrc ? (
                    <img
                      src={imgSrc}
                      alt={item.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  ) : (
                    <Gem className="w-5 h-5 text-silver-400" />
                  )}
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs sm:text-sm font-medium text-white truncate">{item.name}</h4>
                  <div className="flex items-center gap-3 text-[11px] text-silver-400 mt-0.5">
                    <span>
                      {isAr ? 'الكمية:' : 'Qty:'} <strong className="text-white">{item.quantity}</strong>
                    </span>
                    {item.size && (
                      <span>
                        {isAr ? 'المقاس:' : 'Size:'} <strong className="text-white">{item.size}</strong>
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <span className="text-xs sm:text-sm font-mono font-bold text-silver-200 flex-shrink-0">
                {item.price} {t('currency') || 'JOD'}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

/* --- Silver Bullion Order Card --- */
const BullionOrderCard = ({ order, statusMeta, t, isAr }) => {
  const dateFormatted = order.createdAt
    ? new Date(order.createdAt).toLocaleDateString(isAr ? 'ar-JO' : 'en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : '';

  return (
    <div className="rounded-2xl bg-amber-500/[0.03] border border-amber-500/20 p-5 sm:p-6 hover:border-amber-500/40 transition-all duration-300 space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-amber-500/10">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-300">
            <Coins className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-white">
                #{order.id}
              </span>
              <span className="text-[11px] text-silver-400 font-mono">• {dateFormatted}</span>
            </div>
            <p className="text-[11px] text-amber-300/80 mt-0.5">
              {isAr ? 'سبيكة فضة استثمارية عيار 999.0' : 'Pure Investment Bullion Ag 999.0'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${statusMeta.bg}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${statusMeta.dot}`} />
            {statusMeta.label}
          </span>
          <div className={isAr ? 'text-left' : 'text-right'}>
            <span className="text-base font-bold font-mono text-amber-300">
              {order.total_price} <span className="text-xs text-silver-400 font-sans">{t('currency') || 'JOD'}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs pt-1">
        <div className="p-3 rounded-xl bg-black/30 border border-white/5">
          <span className="text-[10px] uppercase tracking-wider text-silver-400 block mb-0.5">
            {t('productName') || (isAr ? 'المنتج' : 'Product')}
          </span>
          <span className="font-bold text-white text-xs">{order.productName || 'Silver Bullion'}</span>
        </div>

        <div className="p-3 rounded-xl bg-black/30 border border-white/5">
          <span className="text-[10px] uppercase tracking-wider text-silver-400 block mb-0.5">
            {t('quantity') || (isAr ? 'الكمية' : 'Quantity')}
          </span>
          <span className="font-bold text-white text-xs">× {order.quantity}</span>
        </div>

        <div className="p-3 rounded-xl bg-black/30 border border-white/5">
          <span className="text-[10px] uppercase tracking-wider text-silver-400 block mb-0.5">
            {t('shippingAddress') || (isAr ? 'عنوان التسليم' : 'Delivery Address')}
          </span>
          <span className="text-silver-200 text-xs truncate block">{order.address || '—'}</span>
        </div>

        <div className="p-3 rounded-xl bg-black/30 border border-white/5">
          <span className="text-[10px] uppercase tracking-wider text-silver-400 block mb-0.5">
            {t('phone') || (isAr ? 'هاتف التواصل' : 'Phone')}
          </span>
          <span className="font-mono text-silver-200 text-xs">{order.phone || '—'}</span>
        </div>
      </div>
    </div>
  );
};

/* --- Empty Orders View --- */
const EmptyOrdersView = ({ isAr, t, type }) => (
  <div className="text-center py-16 px-4 rounded-3xl bg-white/[0.02] border border-dashed border-white/10">
    <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 mx-auto mb-4 flex items-center justify-center text-silver-400">
      {type === 'bullion' ? <Coins className="w-8 h-8 text-amber-400/60" /> : <ShoppingBag className="w-8 h-8" />}
    </div>
    <h3 className="text-lg font-serif font-bold text-white mb-1">
      {t('noOrdersYet') || (isAr ? 'لا توجد طلبات مسجلة حتى الآن' : 'No Orders Yet')}
    </h3>
    <p className="text-xs text-silver-400 max-w-md mx-auto mb-6">
      {type === 'bullion'
        ? (isAr ? 'ابدأ في تنويع استثماراتك واقتنِ سبائك الفضة الإيطالية والسويسرية الخالصة اليوم.' : 'Explore our pure investment silver bullion range to begin.')
        : (isAr ? 'اكتشف أرقى تصاميم الفضة الإسترليني عيار 925 الإيطالية وأضفها إلى مجموعتك الخاصة.' : 'Explore our handcrafted 925 sterling silver jewelry and add timeless elegance to your collection.')}
    </p>
    <Link
      to="/"
      className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-white to-silver-300 text-black text-xs font-bold uppercase tracking-[0.15em] shadow-lg shadow-white/10 hover:shadow-white/20 transition-all"
    >
      <ShoppingBag className="w-3.5 h-3.5" />
      {isAr ? 'استكشف المجموعات' : 'Explore Collections'}
    </Link>
  </div>
);

/* --- Loading Spinner --- */
const LoadingSpinner = ({ isAr }) => (
  <div className="flex flex-col items-center justify-center py-20 gap-3">
    <div className="w-10 h-10 border-2 border-silver-300 border-t-transparent rounded-full animate-spin" />
    <span className="text-xs text-silver-400 font-mono tracking-widest uppercase">
      {isAr ? 'جاري التحميل...' : 'Loading Records...'}
    </span>
  </div>
);

export default ProfilePage;