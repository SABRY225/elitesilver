import React from 'react';
import { motion } from 'framer-motion';
import { FiPlus, FiTrash2, FiShoppingBag, FiChevronLeft } from 'react-icons/fi';

const ProductsStep = ({ cart, setCart, onNext, onBack, orderType }) => {
  
  const addToCart = () => {
    setCart([...cart, { id: Date.now(), name: '', price: '', quantity: 1 }]);
  };

  const removeFromCart = (id) => {
    if (cart.length > 1) setCart(cart.filter(item => item.id !== id));
  };

  const updateCart = (id, field, value) => {
    setCart(cart.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const totalAmount = cart.reduce((sum, item) => sum + (Number(item.price || 0) * item.quantity), 0);

  return (
    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="max-w-4xl mx-auto">
      <div className="bg-white rounded-[2.5rem] p-8 shadow-2xl border border-gray-50">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h3 className="text-2xl font-black italic">تفاصيل البنود</h3>
            <p className="text-gray-400 text-xs mt-1 uppercase tracking-widest">
              نوع العملية: {orderType === 'buy' ? 'بيع لعميل' : 'استلام من عميل'}
            </p>
          </div>
          <button 
            onClick={addToCart}
            className="bg-black text-white px-6 py-3 rounded-2xl text-sm font-bold flex items-center gap-2 hover:bg-gray-800 transition-all shadow-lg shadow-gray-200"
          >
            <FiPlus /> إضافة قطعة فضة
          </button>
        </div>

        <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
          {cart.map((item, index) => (
            <motion.div 
              layout
              key={item.id} 
              className="flex items-center gap-4 bg-gray-50 p-5 rounded-[1.5rem] border border-gray-100 hover:border-gray-300 transition-colors"
            >
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-[10px] font-black text-gray-400 shadow-sm">
                {index + 1}
              </div>
              <div className="flex-1">
                <input 
                  type="text" placeholder="وصف القطعة (مثلاً: خاتم عيار 925)" 
                  className="w-full bg-transparent border-none font-bold text-gray-800 placeholder:text-gray-300 focus:ring-0"
                  value={item.name}
                  onChange={(e) => updateCart(item.id, 'name', e.target.value)}
                />
              </div>
              <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl shadow-inner border border-gray-100">
                <input 
                  type="number" placeholder="0.00" 
                  className="w-20 bg-transparent border-none text-center font-black text-gray-900 focus:ring-0"
                  value={item.price}
                  onChange={(e) => updateCart(item.id, 'price', e.target.value)}
                />
                <span className="text-[10px] font-bold text-gray-400">JOD</span>
              </div>
              <div className="flex items-center bg-white rounded-xl border border-gray-100 overflow-hidden">
                 <input 
                  type="number" value={item.quantity} 
                  className="w-12 text-center py-2 font-bold text-sm border-none focus:ring-0"
                  onChange={(e) => updateCart(item.id, 'quantity', parseInt(e.target.value) || 1)}
                />
              </div>
              <button 
                onClick={() => removeFromCart(item.id)}
                className="p-3 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
              >
                <FiTrash2 />
              </button>
            </motion.div>
          ))}
        </div>

        <div className="mt-12 flex justify-between items-center border-t border-gray-50 pt-10">
          <div className="text-right">
            <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-1">إجمالي الفاتورة</p>
            <p className="text-5xl font-black text-gray-900 leading-none">
              {totalAmount.toFixed(2)} <span className="text-xl font-light text-gray-400 uppercase">Jod</span>
            </p>
          </div>
          <div className="flex gap-4">
            <button onClick={onBack} className="px-8 py-4 font-bold text-gray-400 hover:text-black transition-colors uppercase text-xs tracking-widest">رجوع</button>
            <button 
              onClick={onNext}
              disabled={totalAmount <= 0}
              className="bg-black text-white px-12 py-5 rounded-[1.5rem] font-bold shadow-2xl shadow-gray-300 hover:scale-105 active:scale-95 transition-all disabled:opacity-30 disabled:hover:scale-100"
            >
              مراجعة الدفع <FiChevronLeft className="inline mr-2" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductsStep;