import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import axios from 'axios';
import { X, ArrowRight, ShoppingBag, RotateCcw } from 'lucide-react';

// Cashier Step Components
import CustomerStep from './Cashier/CustomerStep';
import ProductsStep from './Cashier/ProductsStep';
import PaymentStep from './Cashier/PaymentStep';
import OrderTypeStep from './Cashier/OrderTypeStep';
import StatsGrid from './Cashier/StatsGrid';
import ActivitySlider from './Cashier/ActivitySlider';

const CashieSystem = () => {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [orderType, setOrderType] = useState(null);

  const [phoneNumber, setPhoneNumber] = useState('');
  const [customer, setCustomer] = useState(null);
  const [isNewCustomer, setIsNewCustomer] = useState(false);
  const [newCustomerData, setNewCustomerData] = useState({ name: '', email: '', address: '' });

  const [cart, setCart] = useState([{ id: Date.now(), name: '', price: '', quantity: 1 }]);
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [dashboardData, setDashboardData] = useState({
    stats: { buyCount: 0, sellCount: 0, repairCount: 0, newCustomers: 0 },
    recentActivities: []
  });

  const totalAmount = useMemo(() => {
    return cart.reduce((sum, item) => sum + (Number(item.price || 0) * (item.quantity || 1)), 0);
  }, [cart]);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL;
        const { data } = await axios.get(`${API_URL}/orders/dashboard-stats`, {
          headers: { "Authorization": "Bearer " + localStorage.getItem("token") }
        });
        setDashboardData(data);
      } catch (err) {
        // Silent catch for stats
      }
    };
    if (step === 0) fetchDashboard();
  }, [step]);

  const resetSystem = useCallback(() => {
    setStep(0);
    setOrderType(null);
    setPhoneNumber('');
    setCustomer(null);
    setIsNewCustomer(false);
    setCart([{ id: Date.now(), name: '', price: '', quantity: 1 }]);
    setNewCustomerData({ name: '', email: '', address: '' });
    setPaymentMethod('cash');
  }, []);

  // 1. Customer search
  const handleSearchCustomer = async (e) => {
    if (e) e.preventDefault();
    if (phoneNumber.length < 9) return toast.error("رقم الهاتف غير مكتمل");

    setLoading(true);
    try {
      const API_URL = import.meta.env.VITE_API_URL;
      const { data } = await axios.get(`${API_URL}/auth/customers/search?phone=${phoneNumber}`);

      setCustomer(data);
      setIsNewCustomer(false);
      toast.success(`أهلاً بك، ${data.name}`);
    } catch (error) {
      setCustomer(null);
      setIsNewCustomer(true);
      toast.error("العميل غير مسجل، يرجى استكمال البيانات");
    } finally {
      setLoading(false);
    }
  };

  // 2. Finalize POS Order
  const handleFinalize = async () => {
    setLoading(true);
    try {
      const API_URL = import.meta.env.VITE_API_URL;
      let finalCustomerId = customer?.id;

      if (isNewCustomer) {
        const customerRes = await axios.post(`${API_URL}/auth/customers/register`, {
          name: newCustomerData.name,
          phone: `+962${phoneNumber}`,
          email: newCustomerData.email,
          address: newCustomerData.address,
          role: "customer"
        });
        finalCustomerId = customerRes.data.id;
      }

      const orderPayload = {
        customerId: finalCustomerId,
        orderType: orderType,
        paymentMethod: paymentMethod,
        totalAmount: totalAmount,
        items: cart.map(item => ({
          id: item.productId,
          productName: item.name,
          quantity: item.quantity,
          unitPrice: item.price
        }))
      };
    
      await axios.post(`${API_URL}/orders/cashier-system`, orderPayload, {
        headers: {
          "Authorization": "Bearer " + localStorage.getItem("token")
        }
      });

      toast.success("تم إصدار الفاتورة وتحديث نقاط الولاء بنجاح");
      resetSystem();
    } catch (error) {
      toast.error(error.response?.data?.message || "حدث خطأ أثناء إتمام العملية");
    } finally {
      setLoading(false);
    }
  };

  const stepsContent = [
    <OrderTypeStep key="0" onSelect={(type) => { setOrderType(type); setStep(1); }} />,
    <CustomerStep
      key="1"
      phoneNumber={phoneNumber} setPhoneNumber={setPhoneNumber}
      loading={loading} onSearch={handleSearchCustomer}
      customer={customer} isNewCustomer={isNewCustomer}
      setNewCustomerData={setNewCustomerData}
      onNext={() => setStep(2)} onBack={() => setStep(0)}
    />,
    <ProductsStep
      key="2"
      cart={cart} setCart={setCart}
      orderType={orderType}
      onNext={() => setStep(3)} onBack={() => setStep(1)}
    />,
    <PaymentStep
      key="3"
      orderType={orderType}
      totalAmount={totalAmount}
      paymentMethod={paymentMethod} setPaymentMethod={setPaymentMethod}
      loading={loading} onFinalize={handleFinalize}
      onBack={() => setStep(2)}
    />
  ];

  return (
    <div className="space-y-6" dir="rtl">


      {/* Progress Bar */}
      {step > 0 && (
        <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-silver-400 to-silver-100"
            initial={{ width: 0 }}
            animate={{ width: `${(step / (stepsContent.length - 1)) * 100}%` }}
          />
        </div>
      )}

      {/* Step Header */}
      {step > 0 && (
        <div className="flex justify-between items-center p-4 rounded-xl bg-[#0c0d12]/90 border border-white/10">
          <span className="bg-silver-400/10 border border-silver-400/20 px-3 py-1 rounded-full text-xs font-bold text-silver-200">
            {orderType === 'buy' ? 'فاتورة بيع مشغولات' : orderType === 'sell' ? 'شراء كسر فضة من عميل' : 'قسم الصيانة والتلميع'}
          </span>
          <span className="text-silver-400 text-xs font-mono">الخطوة {step} من 3</span>
        </div>
      )}

      <main>
        {step === 0 && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <StatsGrid stats={dashboardData.stats} />
            <ActivitySlider activities={dashboardData.recentActivities} />
          </motion.div>
        )}

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 15 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -15 }}
            transition={{ duration: 0.2 }}
          >
            {stepsContent[step]}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Cancel Transaction Button */}
      {step > 0 && (
        <div className="pt-4 flex justify-end">
          <button
            onClick={resetSystem}
            className="inline-flex items-center gap-2 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-400 px-4 py-2 rounded-xl text-xs font-bold transition-all active:scale-95"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>إلغاء العملية الحالية</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default CashieSystem;