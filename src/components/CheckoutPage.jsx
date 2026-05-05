import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiChevronLeft, FiCreditCard, FiTruck, FiLock, FiCheckCircle } from 'react-icons/fi';
import Navbar from './Navbar';
import Footer from './Footer';
import { useLanguage } from '../contexts/LanguageContext';
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios';

function CheckoutPage() {
  const navigate = useNavigate();
  const { t, isRTL } = useLanguage();

  const [cartItems, setCartItems] = useState([]);
  const [cities, setCities] = useState([]);
  const [shippingFees, setShippingFees] = useState({});
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    fullName: '',
    city: '',
    address: '',
    phone: '',
    alternatePhone: '',
  });

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem('cart') || '[]');
    setCartItems(savedCart);
    fetchCities();
    loadUserData();
  }, []);

  const loadUserData = () => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      try {
        const user = JSON.parse(userData);
        setUser(user);
        console.log(user);
        
        setFormData(prev => ({
          ...prev,
          fullName: user.name,
        }));
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
  };

  const fetchCities = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/city/shipping-cities`);
      const citiesData = res.data;
      setCities(citiesData);
      console.log(citiesData);
      
      // بناء كائن الشحن
      const fees = {};
      citiesData.forEach(city => {
        fees[city.id] = city.price;
      });
      setShippingFees(fees);
      
      // اختيار أول مدينة افتراضياً
      if (citiesData.length > 0) {
        setFormData(prev => ({ ...prev, city: citiesData[0].id }));
      }
    } catch (err) {
      console.error('Error fetching cities:', err);
      toast.error('Failed to load cities');
    }
  };

  const subtotal = cartItems.reduce((total, item) => Number(total) + (Number(item.price) * Number(item.quantity)), 0);
  const shipping = Number(shippingFees[formData.city]) || 0;
  const total = subtotal + shipping;

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.fullName || !formData.city || !formData.address || !formData.phone) {
      toast.error(t('fillAllFields') || 'Please fill all required fields');
      return;
    }
    
    const loadingToast = toast.loading(t('processingOrder') || 'Processing your order...');
    
    try {
      const orderData = {
        fullName: formData.fullName,
        city: formData.city,
        address: formData.address,
        phone: formData.phone,
        alternatePhone: formData.alternatePhone,
        paymentMethod,
        cartItems,
        subtotal,
        shipping,
        total,
        ...(user && { userId: user.id }),
      };

      const response = await axios.post(`${import.meta.env.VITE_API_URL}/orders/new`, orderData);
      console.log('Order response:', response.data);

      toast.dismiss(loadingToast);
      toast.success(t('orderSuccess') || 'Order placed successfully!', {
        style: { background: '#1A1A1A', color: '#fff', borderRadius: '0' }
      });
      
      // خيار إعادة التوجيه بعد الطلب
      localStorage.removeItem('cart');
      navigate('/order-success');
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error(t('orderError') || 'Failed to place order. Please try again.');
      console.error('Order submission error:', error);
    }
  };

  if (!cartItems || cartItems.length === 0) return <div className="min-h-screen bg-[#121212] text-white flex items-center justify-center uppercase tracking-widest">No items to checkout.</div>;

  return (
    <div className="bg-[#121212] min-h-screen font-sans text-white pb-32 pt-20" dir={isRTL ? 'rtl' : 'ltr'}>
      <Toaster position="top-center" />
      <Navbar />

      <div className="container mx-auto px-4 sm:px-6 py-12 max-w-6xl">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-[#8E8E8E] hover:text-white transition-all text-[11px] font-bold uppercase tracking-[0.2em] mb-12">
          <FiChevronLeft /> {t('backToCart')}
        </button>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">
          
          {/* LEFT: Customer Details & Payment */}
          <div className="lg:col-span-7 space-y-12">
            <section>
              <h2 className="text-xl sm:text-2xl font-bold uppercase tracking-tighter mb-8 border-b border-white/5 pb-4">{t('shippingInformation')}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2 space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-[#8E8E8E]">{t('fullName')}</label>
                  <input required name="fullName" onChange={handleInputChange} type="text" value={formData.fullName} className="w-full bg-[#1A1A1A] border border-white/10 p-4 text-sm focus:border-white outline-none transition-all" placeholder={t('fullName')} />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-[#8E8E8E]">{t('city')}</label>
                  <select required name="city" value={formData.city} onChange={handleInputChange} className="w-full bg-[#1A1A1A] border border-white/10 p-4 text-sm focus:border-white outline-none transition-all cursor-pointer">
                    <option value="">{t('selectCity')}</option>
                    {cities.map((city) => (
                      <option key={city.id} value={city.id}>
                        {city.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-[#8E8E8E]">{t('address')}</label>
                  <textarea required name="address" onChange={handleInputChange} rows="3" className="w-full bg-[#1A1A1A] border border-white/10 p-4 text-sm focus:border-white outline-none transition-all" placeholder={t('Street, Building, Apartment...')}></textarea>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-[#8E8E8E]">{t('phone')}</label>
                  <input required name="phone" onChange={handleInputChange} type="tel" className="w-full bg-[#1A1A1A] border border-white/10 p-4 text-sm focus:border-white outline-none transition-all" placeholder="+974 0000 0000" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-[#8E8E8E]">{t('alternatePhone') || 'Alternate Phone'}</label>
                  <input name="alternatePhone" onChange={handleInputChange} type="tel" className="w-full bg-[#1A1A1A] border border-white/10 p-4 text-sm focus:border-white outline-none transition-all" placeholder="+974 0000 0000" />
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-bold uppercase tracking-tighter mb-8 border-b border-white/5 pb-4">{t('paymentMethod')}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Credit Card Option */}
                <div 
                  onClick={() => {
                    toast(t('comingSoon'), { icon: '⏳' });
                  }}
                  className="p-6 border border-white/10 bg-white/5 opacity-60 cursor-not-allowed transition-all flex items-center justify-between"
                >
                  <div className="flex items-center gap-4">
                    <FiCreditCard size={20} className="text-[#888]" />
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-widest text-[#888]">{t('creditCard')}</span>
                      <p className="text-[9px] text-[#aaa]">{t('comingSoon')}</p>
                    </div>
                  </div>
                  <span className="text-[11px] font-semibold text-[#aaa]">⏳</span>
                </div>

                {/* Cash on Delivery Option */}
                <div 
                  onClick={() => setPaymentMethod('cod')}
                  className={`p-6 border cursor-pointer transition-all flex items-center justify-between ${paymentMethod === 'cod' ? 'border-white bg-white/5' : 'border-white/10 hover:border-white/30'}`}
                >
                  <div className="flex items-center gap-4">
                    <FiTruck size={20} className={paymentMethod === 'cod' ? 'text-white' : 'text-[#444]'} />
                    <span className="text-[11px] font-bold uppercase tracking-widest">{t('cashOnDelivery')}</span>
                  </div>
                  {paymentMethod === 'cod' && <FiCheckCircle className="text-white" />}
                </div>
              </div>
            </section>
          </div>

          {/* RIGHT: Order Summary */}
          <div className="lg:col-span-5">
            <div className="bg-[#1A1A1A] p-6 sm:p-8 border border-white/5 sticky top-24 sm:top-32">
              <h2 className="text-lg sm:text-xl font-bold uppercase tracking-widest mb-8">{t('orderSummary')}</h2>
              
              <div className="max-h-64 overflow-y-auto mb-8 space-y-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex gap-4 pb-4 border-b border-white/5">
                    <div className="w-16 h-20 sm:w-20 sm:h-24 bg-[#121212] overflow-hidden border border-white/5 flex-shrink-0">
                      <img 
                        src={item.image?.startsWith('http') ? item.image : `${import.meta.env.VITE_URL}/${item.image}`} 
                        className="w-full h-full object-cover opacity-80" 
                        alt={item.name}
                      />
                    </div>
                    <div className="flex flex-col justify-center flex-1">
                      <h4 className="text-[10px] sm:text-[11px] font-bold uppercase tracking-widest mb-1">{item.name}</h4>
                      <p className="text-[#8E8E8E] text-[9px] uppercase">Qty: {item.quantity}</p>
                      <p className="text-white text-[11px] sm:text-[12px] mt-2">{(item.price * item.quantity).toLocaleString()} {t('currency')}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-[10px] sm:text-[11px] uppercase tracking-widest text-[#8E8E8E]">
                  <span>{t('subtotal')}</span>
                  <span>{subtotal.toLocaleString()} {t('currency')}</span>
                </div>
                <div className="flex justify-between text-[10px] sm:text-[11px] uppercase tracking-widest text-[#8E8E8E]">
                  <span>{t('shipping')}</span>
                  <span className={shipping === 0 ? "text-emerald-500 font-bold underline" : "text-white"}>{shipping > 0 ? `${shipping.toLocaleString()} ${t('currency')}` : t('free')}</span>
                </div>
                <div className="flex justify-between text-lg sm:text-xl font-bold uppercase tracking-widest pt-4 border-t border-white/5">
                  <span>{t('total')}</span>
                  <span>{total.toLocaleString()} {t('currency')}</span>
                </div>
              </div>

              <button 
                type="submit"
                className="w-full bg-white text-black py-5 sm:py-6 font-black text-[10px] sm:text-[11px] uppercase tracking-[0.4em] hover:bg-[#D1D1D1] transition-all flex items-center justify-center gap-3 active:scale-[0.98]"
              >
                <FiLock size={16}/> {t('completePurchase')}
              </button>

              <p className="text-[8px] sm:text-[9px] text-[#444] text-center mt-6 uppercase tracking-[0.2em] leading-relaxed">
                Secure SSL Encrypted Transaction <br/>
                Elite Silver © 2026
              </p>
            </div>
          </div>

        </form>
      </div>
      <Footer />
    </div>
  );
}

export default CheckoutPage;