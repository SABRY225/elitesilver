import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { FiTrendingUp, FiSettings, FiDollarSign, FiInfo, FiRefreshCw, FiClock, FiSave, FiCheckCircle } from 'react-icons/fi';
import { GiCoins, GiGoldBar, GiWeight } from 'react-icons/gi'; 
import { BsLayersHalf } from 'react-icons/bs';
import { useLanguage } from '../contexts/LanguageContext';

const SilverPricingCalculator = () => {
  const { isRTL } = useLanguage();

  const [screenPrice, setScreenPrice] = useState(0); 
  const [lastUpdated, setLastUpdated] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false); // حالة حفظ العمولات
  const [selectedType, setSelectedType] = useState('uae_kilo');
  const [result, setResult] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);

  // حالة العمولات (يتم جلبها من الباك أند)
  const [commissions, setCommissions] = useState({
    uae_kilo: 5,
    swiss_kilo: 9,
    ounce_31: 12,
    ounce_100: 11,
    lira_5: 30
  });

  const JOD_EXCHANGE_RATE = 0.7080;

  // 1. جلب سعر الفضة والعمولات من الباك أند
  const fetchData = async () => {
    try {
      setLoading(true);
      // جلب السعر العالمي
      const priceRes = await axios.get('https://api.gold-api.com/price/XAG/USD');
      setScreenPrice(priceRes.data.price);
      setLastUpdated(priceRes.data.updatedAtReadable);

      // جلب العمولات المحفوظة من السيرفر الخاص بك
      const commRes = await axios.get(`${import.meta.env.VITE_API_URL}/commissions/silver`);
      console.log(commRes.data.data);
      
      if (commRes.data.data) {
        setCommissions(commRes.data.data);
      }
    } catch (err) {
      console.error("Error fetching data:", err);
      if(screenPrice === 0) setScreenPrice(30.50); 
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 300000);
    return () => clearInterval(interval);
  }, []);

  // 2. تحديث السعر النهائي عند تغيير السعر العالمي أو النوع أو "العمولة"
  useEffect(() => {
    let finalPrice = 0;
    const s = parseFloat(screenPrice) || 0;
    const markup = parseFloat(commissions[selectedType]) || 0;

    switch (selectedType) {
      case 'uae_kilo':
      case 'swiss_kilo':
        finalPrice = (s + markup) * 32.15 * JOD_EXCHANGE_RATE;
        break;
      case 'ounce_31':
        finalPrice = (s + markup) * JOD_EXCHANGE_RATE;
        break;
      case 'ounce_100':
        finalPrice = ((s + markup) / 31.1) * 100 * JOD_EXCHANGE_RATE;
        break;
      case 'lira_5':
        finalPrice = ((s + markup) / 31.1) * 5 * JOD_EXCHANGE_RATE;
        break;
      default:
        finalPrice = 0;
    }
    setResult(finalPrice);
  }, [screenPrice, selectedType, commissions]);

  // 3. دالة حفظ العمولات للباك أند
  const handleSaveCommissions = async () => {
    try {
      setSaving(true);
      await axios.post(`${import.meta.env.VITE_API_URL}/commissions/silver`, {
        commissions: commissions
      });
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (err) {
      alert("حدث خطأ أثناء حفظ العمولات");
    } finally {
      setSaving(false);
    }
  };

  const handleCommChange = (id, value) => {
    setCommissions(prev => ({ ...prev, [id]: value }));
  };

  const calculatorTypes = [
    { id: 'uae_kilo', name: 'كيلو إماراتي', icon: <GiGoldBar className="text-slate-400" /> },
    { id: 'swiss_kilo', name: 'كيلو سويسري', icon: <GiGoldBar className="text-slate-300" /> },
    { id: 'ounce_31', name: 'أونصة 31.1 جرام', icon: <GiWeight className="text-slate-500" /> },
    { id: 'ounce_100', name: 'أونصة 100 جرام', icon: <BsLayersHalf className="text-slate-500" /> },
    { id: 'lira_5', name: 'ليرة 5 جرام', icon: <GiCoins className="text-yellow-600" /> },
  ];

  return (
    <div className={`min-h-screen bg-gray-50 pb-20 ${isRTL ? 'font-cairo' : 'font-sans'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="max-w-7xl mx-auto px-6 py-12">
        
        {/* هيدر الصفحة */}
        <div className="flex justify-between items-center mb-10">
            <h2 className="text-3xl font-black text-slate-800 flex items-center gap-3">
                <FiSettings className="animate-spin-slow" /> لوحة تحكم التسعير والعمولات
            </h2>
            <button 
                onClick={handleSaveCommissions}
                disabled={saving}
                className="bg-slate-800 text-white px-8 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-slate-700 transition-all active:scale-95 disabled:opacity-50"
            >
                {saving ? <FiRefreshCw className="animate-spin" /> : <FiSave />}
                {isRTL ? 'حفظ كافة التعديلات' : 'Save All Changes'}
            </button>
        </div>

        {/* تنبيه النجاح */}
        {showSuccess && (
            <motion.div initial={{opacity:0, y:-20}} animate={{opacity:1, y:0}} className="mb-6 p-4 bg-green-100 text-green-700 rounded-xl flex items-center gap-2 border border-green-200 font-bold">
                <FiCheckCircle /> تم تحديث العمولات في قاعدة البيانات بنجاح!
            </motion.div>
        )}

        <div className="grid lg:grid-cols-2 gap-10">
          
          {/* الجانب الأيسر: التحكم في العمولات */}
          <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
            <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2 border-b pb-4">
              <FiDollarSign className="text-green-600" /> ضبط عمولة كل منتج (USD)
            </h3>

            <div className="space-y-6">
              {calculatorTypes.map((type) => (
                <div key={type.id} className={`flex items-center justify-between p-4 rounded-2xl border ${selectedType === type.id ? 'border-slate-500 bg-slate-50' : 'border-gray-50'}`}>
                  <div className="flex items-center gap-3" onClick={() => setSelectedType(type.id)}>
                    <span className="text-2xl cursor-pointer">{type.icon}</span>
                    <span className="font-bold text-gray-700 cursor-pointer">{type.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400 text-xs font-bold">+</span>
                    <input
                      type="number"
                      className="w-24 px-3 py-2 bg-white border border-gray-200 rounded-lg text-center font-bold text-slate-800 focus:border-slate-500 outline-none shadow-sm"
                      value={commissions[type.id]}
                      onChange={(e) => handleCommChange(type.id, e.target.value)}
                    />
                    <span className="text-gray-500 text-xs font-bold">$</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* الجانب الأيمن: معاينة السعر العالمي والنتيجة */}
          <div className="flex flex-col gap-6">
            
            {/* مدخل السعر العالمي */}
            <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
                <label className="block text-sm font-bold text-gray-600 mb-4 italic">سعر أونصة الفضة عالمياً (تحديث تلقائي)</label>
                <div className="relative">
                    <FiTrendingUp className="absolute top-1/2 left-4 -translate-y-1/2 text-slate-400 text-xl" />
                    <input
                        type="number"
                        className="w-full pl-12 pr-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-2xl font-black text-slate-800 focus:border-slate-500 outline-none transition-all"
                        value={screenPrice}
                        onChange={(e) => setScreenPrice(e.target.value)}
                    />
                </div>
                <div className="mt-4 flex items-center gap-2 text-slate-400 text-xs">
                    <FiClock /> آخر تحديث: {lastUpdated || 'جاري التحميل...'}
                </div>
            </div>

            {/* معاينة النتيجة النهائية */}
            <div className="bg-slate-800 rounded-3xl p-10 shadow-2xl relative overflow-hidden text-white">
              <GiGoldBar className="absolute -bottom-10 -right-10 text-white/5 text-9xl rotate-12" />
              
              <h3 className="text-slate-400 font-bold mb-2 uppercase tracking-widest text-xs">معاينة السعر للعميل (أردني)</h3>
              <div className="flex items-baseline gap-4 mb-6 relative z-10">
                <span className="text-6xl font-black text-white">
                  {result.toLocaleString(undefined, { minimumFractionDigits: 3, maximumFractionDigits: 3 })}
                </span>
                <span className="text-2xl font-bold text-slate-400">د.أ</span>
              </div>
              
              <div className="p-4 bg-white/5 rounded-2xl text-sm font-medium border border-white/10 relative z-10 backdrop-blur-sm">
                <div className="flex justify-between mb-1">
                    <span>المنتج المحدد:</span>
                    <span className="font-bold text-silver-300">{calculatorTypes.find(t => t.id === selectedType)?.name}</span>
                </div>
                <div className="flex justify-between">
                    <span>العمولة المضافة:</span>
                    <span className="font-bold text-green-400">${commissions[selectedType]} +</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default SilverPricingCalculator;