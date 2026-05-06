import React, { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios';

// استيراد المكونات
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
  React.useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL;
        const { data } = await axios.get(`${API_URL}/orders/dashboard-stats`, {
          headers: { "Authorization": "Bearer " + localStorage.getItem("token") }
        });
        setDashboardData(data);
      } catch (err) { console.error("Error fetching stats"); }
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

  // 1. البحث عن عميل
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
      toast.error("العميل غير مسجل، يرجى ملء البيانات");
    } finally {
      setLoading(false);
    }
  };

  // 2. حفظ العملية النهائية (ربط العميل + الفاتورة)
  const handleFinalize = async () => {
    setLoading(true);
    try {
      const API_URL = import.meta.env.VITE_API_URL;
      let finalCustomerId = customer?.id;

      // أ- إذا كان عميل جديد، نقوم بتسجيله أولاً
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
    console.log(cart);

      // ب- إرسال بيانات الفاتورة
      const orderPayload = {
        customerId: finalCustomerId,
        orderType: orderType, // 'buy', 'sell', 'repair'
        paymentMethod: paymentMethod,
        totalAmount: totalAmount,
        items: cart.map(item => ({
          id: item.productId,
          productName: item.name,
          quantity: item.quantity,
          unitPrice: item.price
        }))
      };
    console.log(orderPayload);
    
      await axios.post(`${API_URL}/orders/cashier-system`, orderPayload, {
        headers: {
          "Authorization": "Bearer " + localStorage.getItem("token")
        }
      });

      toast.success("تم حفظ الفاتورة بنجاح وتحديث نقاط العميل");
      resetSystem();
    } catch (error) {
      console.error(error);
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
    <div className="min-h-screen bg-[#FDFDFD] pb-10 font-arabic" dir="rtl">
      <Toaster position="top-center" reverseOrder={false} />
      {step > 0 && (
        <div className="w-full h-1.5 bg-gray-100 sticky top-0 z-50">
          <motion.div
            className="h-full bg-black"
            initial={{ width: 0 }}
            animate={{ width: `${(step / (stepsContent.length - 1)) * 100}%` }}
          />
        </div>
      )}

      <main className="container mx-auto pt-8 px-4">
        {step === 0 && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
            <StatsGrid stats={dashboardData.stats} />
            <ActivitySlider activities={dashboardData.recentActivities} />
          </motion.div>
        )}
        {step > 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-between items-center mb-6 px-4">
            <span className="bg-gray-100 px-4 py-1 rounded-full text-xs font-bold text-gray-500 uppercase">
              {orderType === 'buy' ? 'فاتورة شراء' : orderType === 'sell' ? 'شراء من عميل' : 'طلب صيانة'}
            </span>
            <span className="text-gray-400 text-xs font-medium">الخطوة {step} من 3</span>
          </motion.div>
        )}

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {stepsContent[step]}
          </motion.div>
        </AnimatePresence>
      </main>

      {step > 0 && (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.05 }}
          onClick={resetSystem}
          className="fixed bottom-6 left-6 bg-white border border-red-100 text-red-500 px-6 py-3 rounded-2xl text-xs font-bold shadow-xl hover:bg-red-50 transition-all z-40"
        >
          إلغاء العملية
        </motion.button>
      )}
    </div>
  );
};

export default CashieSystem;