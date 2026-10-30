import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  Sliders, 
  DollarSign, 
  Clock, 
  Save, 
  CheckCircle2, 
  RefreshCw,
  Coins,
  Layers,
  Scale,
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useLanguage } from '../contexts/LanguageContext';

const SilverPricingCalculator = () => {
  const { isRTL } = useLanguage();

  const [screenPrice, setScreenPrice] = useState(0); 
  const [lastUpdated, setLastUpdated] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedType, setSelectedType] = useState('uae_kilo');
  const [result, setResult] = useState(0);

  const [commissions, setCommissions] = useState({
    uae_kilo: 5,
    swiss_kilo: 9,
    ounce_31: 12,
    ounce_100: 11,
    lira_5: 30
  });

  const JOD_EXCHANGE_RATE = 0.7080;

  const fetchData = async () => {
    try {
      setLoading(true);
      // Fetch live international silver spot price
      const priceRes = await axios.get('https://api.gold-api.com/price/XAG/USD');
      setScreenPrice(priceRes.data.price);
      setLastUpdated(priceRes.data.updatedAtReadable || new Date().toLocaleTimeString());

      // Fetch saved margins from backend
      const commRes = await axios.get(`${import.meta.env.VITE_API_URL}/commissions/silver`);
      if (commRes.data?.data) {
        setCommissions(commRes.data.data);
      }
    } catch (err) {
      if (screenPrice === 0) setScreenPrice(30.50); 
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 300000); // refresh every 5 min
    return () => clearInterval(interval);
  }, []);

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

  const handleSaveCommissions = async () => {
    const toastId = toast.loading("جاري حفظ وتثبيت العمولات...");
    try {
      setSaving(true);
      await axios.post(`${import.meta.env.VITE_API_URL}/commissions/silver`, {
        commissions: commissions
      });
      toast.success("تم تثبيت وهوامش العمولات بنجاح في النظام", { id: toastId });
    } catch (err) {
      toast.error("حدث خطأ أثناء حفظ العمولات", { id: toastId });
    } finally {
      setSaving(false);
    }
  };

  const handleCommChange = (id, value) => {
    setCommissions(prev => ({ ...prev, [id]: value }));
  };

  const calculatorTypes = [
    { id: 'uae_kilo', name: 'سبيكة 1 كيلو إماراتي', subtitle: 'Ag 999.0 • 1000g' },
    { id: 'swiss_kilo', name: 'سبيكة 1 كيلو سويسري فاخر', subtitle: 'PAMP / Valcambi 999.0' },
    { id: 'ounce_31', name: 'أونصة فضة 31.10 جرام', subtitle: '1 Troy Ounce 999.0' },
    { id: 'ounce_100', name: 'سبيكة 100 جرام إسترليني/نقي', subtitle: '100 Grams Ingot' },
    { id: 'lira_5', name: 'ليرة فضية استثمارية 5 جرام', subtitle: 'Silver Coin 5g' },
  ];

  return (
    <div className="space-y-6" dir="rtl">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-800">
            <Sliders className="w-5 h-5 text-slate-800" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 tracking-wide">حاسبة تسعير السبائك وهوامش الفضة العالمية</h2>
            <p className="text-slate-500 text-xs mt-0.5">
              ربط مباشر مع مؤشر بورصة لندن XAG/USD والتحويل للدينار الأردني
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <button
            onClick={fetchData}
            disabled={loading}
            className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 transition-all active:scale-95"
            title="تحديث سعر البورصة"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>

          <button 
            onClick={handleSaveCommissions}
            disabled={saving}
            className="flex-1 sm:flex-none bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-xl font-bold text-xs shadow-sm flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50"
          >
            {saving ? <RefreshCw className="w-4 h-4 animate-spin text-white" /> : <Save className="w-4 h-4 text-white stroke-[2.5]" />}
            <span>حفظ واعتماد العمولات</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Commission Configuration */}
        <div className="lg:col-span-7 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-emerald-600" />
              <span>ضبط عمولة وسبريد المتجر (USD)</span>
            </h3>
            <span className="text-[11px] text-slate-500 font-mono font-bold">سعر الصرف: 1 USD = 0.708 JOD</span>
          </div>

          <div className="space-y-2.5">
            {calculatorTypes.map((type) => {
              const isSelected = selectedType === type.id;

              return (
                <div 
                  key={type.id} 
                  onClick={() => setSelectedType(type.id)}
                  className={`flex items-center justify-between p-3.5 rounded-xl border transition-all cursor-pointer ${
                    isSelected 
                      ? 'bg-indigo-50 border-indigo-200 shadow-sm' 
                      : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                      isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'
                    }`}>
                      <Coins className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{type.name}</h4>
                      <p className={`text-[10px] font-mono mt-0.5 ${isSelected ? 'text-indigo-600 font-bold' : 'text-slate-500'}`}>
                        {type.subtitle}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                    <span className="text-slate-400 text-xs font-bold font-mono">+</span>
                    <div className="relative">
                      <input
                        type="number"
                        step="0.1"
                        className="w-20 px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-center font-mono font-bold text-xs text-slate-900 outline-none focus:border-slate-400"
                        value={commissions[type.id]}
                        onChange={(e) => handleCommChange(type.id, e.target.value)}
                      />
                      <span className="absolute left-1.5 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 font-mono font-bold">$</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Live Trading Screen & Result Output */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Live Spot Silver Ticker */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-emerald-600" />
                <span>سعر أونصة الفضة عالمياً (XAG/USD)</span>
              </label>
              <span className="text-[10px] text-emerald-600 font-mono font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>مباشر</span>
              </span>
            </div>

            <div className="relative">
              <input
                type="number"
                step="0.01"
                className="w-full pl-16 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-mono font-black text-2xl text-slate-900 outline-none focus:border-slate-400 transition-all"
                value={screenPrice}
                onChange={(e) => setScreenPrice(e.target.value)}
              />
              <span className="absolute left-4 top-1/2 -translate-y-1/2 font-mono text-xs font-bold text-slate-500">USD / oz</span>
            </div>

            <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-mono">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>آخر مزامنة: {lastUpdated || 'جاري التحديث...'}</span>
            </div>
          </div>

          {/* Result Card */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden space-y-4">
            <div>
              <span className="text-[10px] font-mono tracking-widest uppercase text-slate-500 font-bold block mb-1">
                السعر الإجمالي للعميل (بالدينار الأردني)
              </span>
              <div className="flex items-baseline gap-2">
                <span className="font-mono font-black text-4xl text-slate-900 tracking-tight">
                  {result.toLocaleString(undefined, { minimumFractionDigits: 3, maximumFractionDigits: 3 })}
                </span>
                <span className="text-sm font-bold text-slate-500 font-sans">د.أ</span>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>الصنف المختار:</span>
                <span className="font-bold text-slate-900">
                  {calculatorTypes.find(t => t.id === selectedType)?.name}
                </span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>العمولة المحسوبة:</span>
                <span className="font-mono font-bold text-emerald-700">
                  +${commissions[selectedType]} USD
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
              <span>يتم تطبيق السعر المعتمد تلقائياً في واجهة متجر السبائك للمشترين</span>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};

export default SilverPricingCalculator;