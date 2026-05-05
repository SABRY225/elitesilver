import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FiShield, FiTruck, FiPhone, FiUser, FiMapPin, FiPlus, FiMinus, FiCreditCard, FiCheckCircle } from 'react-icons/fi';
import { GiCoins, GiGoldBar, GiWeight } from 'react-icons/gi';
import { BsLayersHalf } from 'react-icons/bs';
import Navbar from './Navbar';
import Footer from './Footer';
import toast, { Toaster } from 'react-hot-toast';
import { useLanguage } from '../contexts/LanguageContext';
import axios from 'axios';

const SilverCheckout = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { t, isRTL } = useLanguage();

  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [user, setUser] = useState({ id: null, fullName: '' });
  
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    secondaryPhone: '',
    cityId: '',
    address: '',
    paymentMethod: 'cod' 
  });

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem('user'));
    if (savedUser) {
      setUser({ id: savedUser.id, fullName: savedUser.name });
      setFormData(prev => ({ ...prev, fullName: savedUser.name }));
    }

    const fetchCities = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/city/shipping-cities`);
         
        const data = await response.json();
        setCities(data);
      } catch (error) {
        console.error("Error fetching cities", error);
      }
    };
    fetchCities();
  }, []);

  if (!state) return <div className="flex items-center justify-center min-h-screen text-2xl font-bold text-slate-400">{t('productNotFound')}</div>;

  const productPrice = state.price || 0;
  const deliveryFee = selectedCity ? (parseFloat(selectedCity.price) || 0) : 0;
  const totalAmount = (productPrice * quantity) + deliveryFee;

  const handleCityChange = (e) => {
    const cityId = e.target.value;
    const city = cities.find(c => c.id === parseInt(cityId));
    setSelectedCity(city);
    setFormData({ ...formData, cityId: cityId });
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    if (formData.phone.length < 9) {
      return toast.error(isRTL ? 'يرجى إدخال رقم هاتف صحيح (9 أرقام)' : 'Please enter a valid 9-digit phone number');
    }

    const loadingToast = toast.loading(t('processingOrder'));
    try {
      const finalData = {
        ...formData,
        phone: `+962${formData.phone}`,
        secondaryPhone: formData.secondaryPhone ? `+962${formData.secondaryPhone}` : '',
        userId: user.id,
        quantity: quantity,
        total_price: totalAmount,
        productName: state.name,
        productPrice: state.price,
      };
    
      await axios.post(`${import.meta.env.VITE_API_URL}/orders/silver`, finalData);
      toast.dismiss(loadingToast);
      toast.success(t('orderSuccess'));
      navigate('/order-success');
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error(t('orderError'));
    }
  };

  const getIcon = (id) => {
    const iconClass = "text-slate-400 w-12 h-12 p-2 bg-slate-100 rounded-xl";
    switch (id) {
      case 'uae_kilo':
      case 'swiss_kilo': return <GiGoldBar className={iconClass} />;
      case 'ounce_31': return <GiWeight className={iconClass} />;
      case 'ounce_100': return <BsLayersHalf className={iconClass} />;
      case 'lira_5': return <GiCoins className="text-yellow-600 w-12 h-12 p-2 bg-yellow-50 rounded-xl" />;
      default: return <GiGoldBar className={iconClass} />;
    }
  };

  return (
    <div className="min-h-screen  bg-[#111111]" dir={isRTL ? 'rtl' : 'ltr'} style={{ fontFamily: isRTL ? 'Cairo, sans-serif' : 'Inter, sans-serif' }}>
      <Toaster position="top-center" />
      <Navbar />
      
      <main className="max-w-7xl mx-auto pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-12 items-start">
          
          {/* Form Side (Col 7) */}
          <div className="lg:col-span-7 space-y-8 mt-20">
            <header>
              <h1 className="text-3xl font-black mb-2  text-[#fff]">{t('shippingInfo')}</h1>
              <p className=" text-[#fff]/50">{t('completeDetailsToFinishOrder')}</p>
            </header>

            <form onSubmit={handleSubmit} className="bg-white rounded-[2rem] p-8 shadow-xl shadow-slate-200/50 border border-slate-100 space-y-6">
              {user.id && (
                <div className="flex items-center gap-3 bg-emerald-50 text-emerald-700 p-4 rounded-2xl border border-emerald-100">
                  <FiShield className="animate-pulse" />
                  <span className="font-semibold text-sm">{t('welcome')}, {user.fullName}</span>
                </div>
              )}

              <div className="space-y-4">
                {/* Full Name */}
                <div className="group">
                  <label className="block text-sm font-bold text-slate-700 mb-2 px-1">{t('fullName')}</label>
                  <div className="relative flex items-center">
                    <FiUser className="absolute mx-4 text-slate-400 group-focus-within:text-slate-900 transition-colors" />
                    <input 
                      required
                      className="w-full py-4 pr-4 pl-12 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-slate-900/5 focus:border-slate-900 outline-none transition-all" 
                      type="text" 
                      value={formData.fullName}
                      onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                    />
                  </div>
                </div>

                {/* Phones */}
                <div className="grid md:grid-cols-2 gap-4">
                  {[
                    { id: 'phone', label: t('phone'), required: true },
                    { id: 'secondaryPhone', label: t('secondaryPhone'), required: false }
                  ].map((field) => (
                    <div key={field.id}>
                      <label className="block text-sm font-bold text-slate-700 mb-2 px-1">{field.label}</label>
                      <div className="flex h-[58px] group" dir="ltr">
                        <div className="flex items-center gap-2 bg-slate-100 border border-slate-200 border-r-0 rounded-l-2xl px-4 text-slate-600 font-bold text-sm">
                          <img src="https://flagcdn.com/w20/jo.png" alt="JO" className="w-5 rounded-sm" />
                          <span>+962</span>
                        </div>
                        <input 
                          required={field.required}
                          className="flex-1 p-4 bg-slate-50 border border-slate-200 rounded-r-2xl outline-none group-focus-within:border-slate-900 group-focus-within:bg-white transition-all font-mono" 
                          type="tel" 
                          maxLength="9"
                          placeholder="7XXXXXXXX"
                          value={formData[field.id]}
                          onChange={(e) => setFormData({...formData, [field.id]: e.target.value.replace(/\D/g, '')})}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Location */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2 px-1">{t('city')}</label>
                    <div className="relative flex items-center">
                      <FiMapPin className="absolute mx-4 text-slate-400" />
                      <select 
                        required
                        className="w-full py-4 pr-10 pl-12 bg-slate-50 border border-slate-200 rounded-2xl appearance-none focus:bg-white focus:border-slate-900 outline-none transition-all cursor-pointer"
                        onChange={handleCityChange}
                      >
                        <option value="">{t('selectCity')}...</option>
                        {cities.map(city => <option key={city.id} value={city.id}>{city.name}</option>)}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2 px-1">{t('address')}</label>
                    <input 
                      required
                      className="w-full py-4 px-6 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:border-slate-900 outline-none transition-all" 
                      placeholder={t('detailedAddress')}
                      onChange={(e) => setFormData({...formData, address: e.target.value})}
                    />
                  </div>
                </div>
              </div>

              {/* Payment Methods */}
              <div className="pt-6 border-t border-slate-100">
                <label className="text-sm font-bold text-slate-700 block mb-4 uppercase tracking-wider">{t('paymentMethod')}</label>
                <div className="grid sm:grid-cols-2 gap-4">
                  {/* COD */}
                  <label className={`relative flex items-center p-5 rounded-2xl border-2 cursor-pointer transition-all hover:bg-slate-50 ${formData.paymentMethod === 'cod' ? 'border-slate-900 bg-slate-50 ring-4 ring-slate-900/5' : 'border-slate-100'}`}>
                    <input 
                      type="radio" name="payment" className="hidden"
                      checked={formData.paymentMethod === 'cod'}
                      onChange={() => setFormData({...formData, paymentMethod: 'cod'})}
                    />
                    <div className="flex items-center gap-4 w-full">
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${formData.paymentMethod === 'cod' ? 'border-slate-900' : 'border-slate-300'}`}>
                        {formData.paymentMethod === 'cod' && <div className="w-3 h-3 bg-slate-900 rounded-full" />}
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-slate-900">{t('cashOnDelivery')}</p>
                        <p className="text-xs text-slate-500">{t('payWhenReceive')}</p>
                      </div>
                      <FiTruck className={`text-2xl ${formData.paymentMethod === 'cod' ? 'text-slate-900' : 'text-slate-300'}`} />
                    </div>
                  </label>

                  {/* Disabled Credit Card */}
                  <div className="relative flex items-center p-5 rounded-2xl border-2 border-slate-100 opacity-60 bg-slate-50/50 cursor-not-allowed overflow-hidden">
                    <div className="flex items-center gap-4 w-full">
                      <div className="w-6 h-6 rounded-full border-2 border-slate-200" />
                      <div className="flex-1">
                        <p className="font-bold text-slate-400">{t('creditCard')}</p>
                        <span className="text-[10px] bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full font-bold">{t('comingSoon')}</span>
                      </div>
                      <FiCreditCard className="text-2xl text-slate-300" />
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>

          {/* Sticky Summary Side (Col 5) */}
          <div className="lg:col-span-5 lg:sticky lg:top-32 space-y-6  mt-20">
            <div className="bg-slate-900 rounded-[2rem] p-8 text-white shadow-2xl shadow-slate-900/20 overflow-hidden relative">
               {/* Decorative Circle */}
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/5 rounded-full blur-3xl"></div>
              
              <h3 className="text-xl font-bold mb-8 flex items-center gap-2">
                <FiCheckCircle className="text-emerald-400" /> {t('orderSummary')}
              </h3>

              <div className="flex items-center gap-5 mb-8 bg-white/5 p-4 rounded-2xl border border-white/10">
                {getIcon(state.id)}
                <div className="flex-1">
                  <h4 className="font-bold text-lg leading-tight">{state.name}</h4>
                  <p className="text-slate-400 text-sm mt-1">{productPrice.toLocaleString()} {t('currency')}</p>
                </div>
                <div className="flex items-center gap-3 bg-white/10 px-3 py-2 rounded-xl border border-white/10">
                  <button type="button" onClick={() => setQuantity(prev => Math.max(1, prev - 1))} className="hover:text-emerald-400 transition-colors"><FiMinus /></button>
                  <span className="font-black min-w-[20px] text-center">{quantity}</span>
                  <button type="button" onClick={() => setQuantity(prev => prev + 1)} className="hover:text-emerald-400 transition-colors"><FiPlus /></button>
                </div>
              </div>

              <div className="space-y-4 border-t border-white/10 pt-6">
                <div className="flex justify-between text-slate-400">
                  <span>{t('subtotal')}</span>
                  <span className="text-white font-medium">{(productPrice * quantity).toLocaleString()} {t('currency')}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>{t('shipping')}</span>
                  <span className={deliveryFee > 0 ? "text-emerald-400 font-bold" : "text-slate-500"}>
                    {deliveryFee > 0 ? `+ ${deliveryFee} ${t('currency')}` : t('free')}
                  </span>
                </div>
                <div className="flex justify-between items-end pt-4">
                  <div>
                    <p className="text-slate-400 text-xs uppercase tracking-widest mb-1">{t('totalAmount')}</p>
                    <p className="text-3xl font-black text-white">{totalAmount.toLocaleString()} <span className="text-sm font-normal text-slate-400">{t('currency')}</span></p>
                  </div>
                </div>
              </div>

              <button 
                onClick={handleSubmit}
                className="w-full bg-white text-slate-900 py-5 rounded-2xl font-black text-lg shadow-xl hover:bg-slate-100 transform active:scale-[0.98] transition-all mt-8 flex items-center justify-center gap-3"
              >
                {t('confirmAndPay')}
              </button>
            </div>

            <div className="bg-blue-50/50 p-6 rounded-2xl flex items-start gap-4 border border-blue-100">
              <FiTruck className="text-blue-600 text-xl mt-1 flex-shrink-0" />
              <p className="text-xs text-blue-800 leading-relaxed font-medium">
                <strong>{t('fastDelivery')}:</strong> {t('deliveryInfo')}
              </p>
            </div>
          </div>

        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default SilverCheckout;