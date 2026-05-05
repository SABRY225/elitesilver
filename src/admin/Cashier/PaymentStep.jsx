import React from 'react';
import { motion } from 'framer-motion';
import { FiCheckCircle, FiCreditCard, FiDollarSign, FiPrinter } from 'react-icons/fi';

const PaymentStep = ({ totalAmount, paymentMethod, setPaymentMethod, onFinalize, loading, onBack }) => {
  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-md mx-auto">
      <div className="bg-white rounded-[3rem] p-10 shadow-2xl border border-gray-50 text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-gray-200 via-black to-gray-200" />
        
        <div className="w-24 h-24 bg-gray-50 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-inner">
          <FiCheckCircle className="text-4xl text-black" />
        </div>
        
        <h2 className="text-3xl font-black mb-2 tracking-tighter">تأكيد المعاملة</h2>
        <p className="text-gray-400 text-sm mb-10">اختر وسيلة الدفع لإصدار الفاتورة</p>

        <div className="grid grid-cols-1 gap-4 mb-10">
          {[
            { id: 'cash', label: 'دفع نقدي (Cash)', icon: <FiDollarSign /> },
            { id: 'points', label: 'دفع نقاط (Points)', icon: <FiCreditCard /> },
            { id: 'card', label: 'بطاقة ائتمان (Card)', icon: <FiCreditCard /> }
          ].map((method) => (
            <button 
              key={method.id}
              onClick={() => setPaymentMethod(method.id)}
              className={`flex items-center justify-between p-6 rounded-3xl border-2 transition-all duration-300 ${
                paymentMethod === method.id 
                ? 'border-black bg-black text-white shadow-xl scale-[1.02]' 
                : 'border-gray-100 text-gray-400 hover:border-gray-200'
              }`}
            >
              <div className="flex items-center gap-4">
                <span className="text-xl">{method.icon}</span>
                <span className="font-bold text-sm uppercase tracking-wide">{method.label}</span>
              </div>
              {paymentMethod === method.id && <FiCheckCircle className="text-white" />}
            </button>
          ))}
        </div>

        <div className="bg-gray-50 p-8 rounded-[2rem] mb-10 border border-gray-100 shadow-inner">
          <div className="flex justify-between items-center mb-2">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">إجمالي المستحق</span>
            <span className="text-[10px] font-black text-green-600 bg-green-50 px-2 py-0.5 rounded italic">Paid via {paymentMethod}</span>
          </div>
          <p className="text-4xl font-black text-gray-900 tracking-tighter">{totalAmount.toFixed(2)} JOD</p>
        </div>

        <div className="space-y-4">
          <button 
            onClick={onFinalize}
            disabled={loading}
            className="w-full bg-black text-white py-6 rounded-2xl font-black text-lg shadow-2xl hover:shadow-black/20 active:scale-95 transition-all flex items-center justify-center gap-3"
          >
            {loading ? 'جاري المعالجة...' : <><FiPrinter /> إتمام وحفظ الفاتورة</>}
          </button>
          
          <button 
            onClick={onBack}
            className="text-gray-400 text-xs font-bold uppercase tracking-widest hover:text-black transition-colors"
          >
            تعديل محتويات السلة
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default PaymentStep;