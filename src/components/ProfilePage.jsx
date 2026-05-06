import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiUser, FiShoppingBag, FiSettings, FiLogOut,
  FiPackage, FiMapPin, FiChevronRight, FiClock, FiActivity // أضفت أيقونة جديدة للسبائك
} from "react-icons/fi";
import { GiGoldBar } from "react-icons/gi"; // أيقونة السبيكة
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useLanguage } from "../contexts/LanguageContext";
import Navbar from "./Navbar";
import Footer from "./Footer";

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('orders'); // 'orders' or 'bullion'
  const [orders, setOrders] = useState([]);
  const [bullionOrders, setBullionOrders] = useState([]); // حالة طلبات السبائك
  const [loading, setLoading] = useState(true);
  const { t, isRTL } = useLanguage();
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
      // جلب النوعين من الطلبات عند التحميل
      loadUserOrders(parsedUser.id, token);
      loadBullionOrders(parsedUser.id, token);
    } catch (error) {
      navigate('/');
    }
  }, [navigate]);

  // 1. جلب طلبات المتجر العادية
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

  // 2. جلب طلبات السبائك من الإندبوينت الجديدة
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
    const styles = {
      delivered: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
      shipped: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
      pending: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
      cancelled: 'bg-red-500/10 text-red-500 border-red-500/20',
    };
    return styles[status] || 'bg-gray-500/10 text-gray-500 border-gray-500/20';
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans " dir={isRTL ? 'rtl' : 'ltr'}>
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-24 ">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mt-20">

          {/* Sidebar Navigation */}
          <motion.div className="lg:col-span-3 space-y-4">
            <div className="p-6 bg-[#111] border border-white/5 rounded-3xl mb-8 text-center">
              <div className="w-20 h-20 bg-gradient-to-tr from-[#C0C0C0] to-[#F7E7CE] rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg shadow-silver-500/20">
                <FiUser className="w-10 h-10 text-black" />
              </div>
              <h2 className="text-xl font-serif font-bold text-white truncate">{user.name || user.email}</h2>
              <p className="text-gray-500 text-xs mt-1 uppercase tracking-widest">{t('premiumMember')}</p>
            </div>

            <nav className="space-y-2">
              <NavButton
                active={activeTab === 'orders'}
                onClick={() => setActiveTab('orders')}
                icon={<FiPackage />}
                label={t('myOrders')}
                isRTL={isRTL}
              />
              {/* التابة الجديدة للسبائك */}
              <NavButton
                active={activeTab === 'bullion'}
                onClick={() => setActiveTab('bullion')}
                icon={<GiGoldBar />}
                label={t('bullionOrders') || "طلبات السبائك"}
                isRTL={isRTL}
              />
              <button onClick={handleLogout} className="w-full flex items-center gap-4 px-6 py-4 text-red-500 hover:bg-red-500/5 rounded-2xl transition-all duration-300 text-sm font-bold uppercase tracking-widest mt-12">
                <FiLogOut /> {t('logout')}
              </button>
            </nav>
          </motion.div>

          {/* Main Content Area */}
          <motion.div className="lg:col-span-9">
            <div className="bg-[#111] border border-white/5 rounded-[2rem] p-8 md:p-12 min-h-[600px]">
              <AnimatePresence mode="wait">
                
                {activeTab === 'orders' ? (
                  <motion.div key="orders" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}>
                    <div className="flex justify-between items-end mb-10">
                      <div>
                        <h1 className="text-3xl font-serif mb-2">{t('orderHistory')}</h1>
                        <div className="h-1 w-12 bg-[#C0C0C0]"></div>
                      </div>
                      <span className="text-gray-500 text-xs uppercase tracking-widest">{t('totalOrders')} {orders.length}</span>
                    </div>

                    {loading ? <LoadingSpinner /> : orders.length === 0 ? <NoOrders t={t} /> : (
                      <div className="space-y-6">
                        {orders.map((order) => (
                          <OrderCard key={order.id} order={order} styles={getStatusStyles(order.status)} t={t} />
                        ))}
                      </div>
                    )}
                  </motion.div>
                ) : (
                  /* محتوى طلبات السبائك */
                  <motion.div key="bullion" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}>
                    <div className="flex justify-between items-end mb-10">
                      <div>
                        <h1 className="text-3xl font-serif mb-2">{t('bullionOrders') || "طلبات السبائك"}</h1>
                        <div className="h-1 w-12 bg-yellow-500"></div>
                      </div>
                      <span className="text-gray-500 text-xs uppercase tracking-widest">{t('totalOrders')} {bullionOrders.length}</span>
                    </div>

                    {loading ? <LoadingSpinner /> : bullionOrders.length === 0 ? <NoOrders t={t} /> : (
                      <div className="space-y-6">
                        {bullionOrders.map((order) => (
                          <BullionOrderCard key={order.id} order={order} styles={getStatusStyles(order.status)} t={t} />
                        ))}
                      </div>
                    )}
                  </motion.div>
                )}
                
              </AnimatePresence>
            </div>
          </motion.div>

        </div>
      </div>
      <Footer />
    </div>
  );
};

/* --- كارد خاص بطلبات السبائك (بناءً على البيانات التي ذكرتها) --- */
const BullionOrderCard = ({ order, styles, t }) => (
  <div className="group bg-white/5 border border-white/5 rounded-2xl p-6 hover:border-yellow-500/30 transition-all duration-300">
    <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-yellow-500/10 rounded-xl text-yellow-500">
          <GiGoldBar size={20} />
        </div>
        <div>
          <h3 className="text-sm font-bold uppercase tracking-widest">#{order.id}</h3>
          <p className="text-xs text-gray-500 font-light mt-1">{new Date(order.createdAt).toLocaleDateString()}</p>
        </div>
      </div>
      <div className="text-right">
          <p className="text-sm font-black text-yellow-500">{order.total_price} <span className="text-[10px] opacity-60">{t('currency')}</span></p>
          <span className={`mt-1 inline-block px-3 py-1 text-[10px] font-black uppercase tracking-tighter border rounded-full ${styles}`}>
            {order.status || 'Pending'}
          </span>
      </div>
    </div>

    {/* تفاصيل المنتج الواحد في السبيكة */}
    <div className="pt-4 border-t border-white/5 grid md:grid-cols-2 gap-4 text-xs">
        <div>
            <p className="text-gray-500 uppercase tracking-tighter mb-1">{t('productName') || 'المنتج'}</p>
            <p className="font-bold text-white text-sm">{order.productName}</p>
        </div>
        <div className="md:text-left">
            <p className="text-gray-500 uppercase tracking-tighter mb-1">{t('quantity') || 'الكمية'}</p>
            <p className="font-bold text-white text-sm">× {order.quantity}</p>
        </div>
        <div>
            <p className="text-gray-500 uppercase tracking-tighter mb-1">{t('shippingAddress') || 'عنوان الشحن'}</p>
            <p className="text-gray-300 italic">{order.address}</p>
        </div>
        <div className="md:text-left">
            <p className="text-gray-500 uppercase tracking-tighter mb-1">{t('phone') || 'الهاتف'}</p>
            <p className="text-gray-300">{order.phone}</p>
        </div>
    </div>
  </div>
);

// مكونات فرعية للتنظيف
const LoadingSpinner = () => (
    <div className="flex justify-center py-20">
      <div className="w-10 h-10 border-2 border-[#C0C0C0] border-t-transparent rounded-full animate-spin"></div>
    </div>
);

const NoOrders = ({ t }) => (
    <div className="text-center py-20 bg-white/5 rounded-3xl border border-dashed border-white/10">
      <FiShoppingBag className="w-12 h-12 text-gray-700 mx-auto mb-4" />
      <p className="text-gray-400 font-serif ">{t('noOrdersYet')}</p>
    </div>
);

/* --- Sub-Components --- */

const NavButton = ({ active, onClick, icon, label, isRTL }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center justify-between px-6 py-4 rounded-2xl transition-all duration-500 group ${active
      ? 'bg-[#C0C0C0] text-black shadow-lg shadow-silver-500/10'
      : 'text-gray-400 hover:bg-white/5 hover:text-white border border-transparent hover:border-white/10'
      }`}
  >
    <div className="flex items-center gap-4">
      <span className="text-lg">{icon}</span>
      <span className="text-xs font-black uppercase tracking-[0.2em]">{label}</span>
    </div>
    <FiChevronRight className={`transition-transform duration-300 ${isRTL ? 'rotate-180' : ''} ${active ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`} />
  </button>
);

const OrderCard = ({ order, styles, t, isRTL }) => (
  <div className="group bg-white/5 border border-white/5 rounded-2xl p-6 hover:border-[#C0C0C0]/30 transition-all duration-300">
    <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-[#C0C0C0]/10 rounded-xl text-[#C0C0C0]">
          <FiPackage size={20} />
        </div>
        <div>
          <h3 className="text-sm font-bold uppercase tracking-widest">#{order.id}</h3>
          <p className="text-xs text-gray-500 font-light mt-1">{new Date(order.createdAt).toLocaleDateString()}</p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="text-sm font-black text-[#C0C0C0]">{order.total} <span className="text-[10px] opacity-60">{t('currency')}</span></p>
          <span className={`mt-1 inline-block px-3 py-1 text-[10px] font-black uppercase tracking-tighter border rounded-full ${styles}`}>
            {order.status}
          </span>
        </div>
      </div>
    </div>

    <div className="space-y-3 pt-4 border-t border-white/5">
      {JSON.parse(order.cartItems).map((item, idx) => (
        <div key={idx} className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 text-xs tracking-wide">
          <div className="flex items-center gap-3 text-gray-400 flex-1">
            <img src={`${import.meta.env.VITE_URL}/${item.image}`} alt={item.name} className="w-12 h-12 sm:w-10 sm:h-10 object-cover rounded-lg flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="font-medium text-white truncate">{item.name}</div>
              <div className="text-xs text-gray-500 mt-1">
                <span className="text-[#C0C0C0] font-bold">×</span> {item.quantity}
              </div>
            </div>
          </div>
          <div className="text-white font-serif text-sm sm:text-xs text-left sm:text-right ">
            {item.price} {t('currency')}
          </div>
        </div>
      ))}
    </div>
  </div>
);

const ProfileField = ({ label, value }) => (
  <div className="space-y-2">
    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-[#C0C0C0] opacity-80 ml-1">{label}</label>
    <div className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-gray-200 text-sm font-medium">
      {value}
    </div>
  </div>
);

export default ProfilePage;