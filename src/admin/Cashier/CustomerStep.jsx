import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiUser, FiSmartphone, FiMail, FiMapPin, FiChevronLeft, FiSearch } from 'react-icons/fi';

const CustomerStep = ({ 
  phoneNumber, setPhoneNumber, loading, onSearch, 
  customer, isNewCustomer, setNewCustomerData, onNext, onBack 
}) => {
  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="max-w-2xl mx-auto">
      <div className="bg-white rounded-[2.5rem] p-10 shadow-2xl border border-gray-50">
        <button onClick={onBack} className="text-gray-400 text-xs font-bold mb-6 flex items-center gap-1 hover:text-black transition-colors">
          <FiChevronLeft className="rotate-180" /> العودة للرئيسية
        </button>
        
        <h2 className="text-2xl font-black mb-8 flex items-center gap-3 italic">
          <FiUser className="text-gray-400" /> هوية العميل
        </h2>

        <form onSubmit={onSearch} className="flex gap-2 mb-8">
          <div className="relative flex-1 flex items-center bg-gray-50 rounded-2xl border border-transparent focus-within:border-gray-200 transition-all">
            {/* رمز الدولة وعلم الأردن (إختياري) */}
            <div className="flex items-center gap-2 px-4 border-l border-gray-200 text-gray-500 font-bold text-sm select-none">
            </div>
              <span dir="ltr">+962</span>


            <FiSmartphone className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            <input 
              type="tel" 
              placeholder="07XXXXXXXX"
              className="w-full pr-10 pl-4 py-4 bg-transparent outline-none font-bold placeholder:text-gray-300"
              value={phoneNumber} 
              onChange={(e) => setPhoneNumber(e.target.value)}
              maxLength={9}
            />
          </div>

          <button 
            type="submit" 
            disabled={loading} 
            className="bg-black hover:bg-gray-800 text-white px-8 rounded-2xl font-bold transition-all flex items-center gap-2 disabled:opacity-50"
          >
            {loading ? '...' : <><FiSearch /> بحث</>}
          </button>
        </form>

        <AnimatePresence>
          {isNewCustomer && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }} 
              animate={{ height: 'auto', opacity: 1 }} 
              className="space-y-4 pt-6 border-t border-dashed border-gray-200"
            >
              <div className="bg-gray-50 p-6 rounded-3xl space-y-4">
                <p className="text-amber-600 text-xs font-bold mb-2">رقم جديد؟ يرجى إكمال البيانات:</p>
                <input 
                  type="text" 
                  placeholder="الاسم الكامل" 
                  className="w-full bg-white border border-gray-100 py-3 px-4 rounded-xl text-sm focus:ring-2 focus:ring-black/5 outline-none" 
                  onChange={(e) => setNewCustomerData(prev => ({...prev, name: e.target.value}))}
                />
                <div className="grid grid-cols-2 gap-4">
                  <input 
                    type="email" 
                    placeholder="البريد الإلكتروني" 
                    className="w-full bg-white border border-gray-100 py-3 px-4 rounded-xl text-sm focus:ring-2 focus:ring-black/5 outline-none" 
                    onChange={(e) => setNewCustomerData(prev => ({...prev, email: e.target.value}))}
                  />
                  <input 
                    type="text" 
                    placeholder="العنوان (المدينة)" 
                    className="w-full bg-white border border-gray-100 py-3 px-4 rounded-xl text-sm focus:ring-2 focus:ring-black/5 outline-none" 
                    onChange={(e) => setNewCustomerData(prev => ({...prev, address: e.target.value}))}
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {customer && (
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }} 
            animate={{ scale: 1, opacity: 1 }} 
            className="bg-black rounded-3xl p-6 text-white flex justify-between items-center shadow-xl border border-white/10"
          >
            <div>
              <p className="font-bold text-lg">{customer.name}</p>
              <p className="text-xs text-white/40 tracking-widest">962{phoneNumber}</p>
            </div>
            <div className="text-left font-black text-yellow-400 uppercase text-xs">
              <span className="block text-white/40 text-[10px] mb-1 font-normal">الرصيد الحالي</span>
              {Number(customer.points)*0.05} دينار أردني
            </div>
            <div className="text-left font-black text-yellow-400 uppercase text-xs">
              <span className="block text-white/40 text-[10px] mb-1 font-normal">عدد النقاط</span>
              {Number(customer.points || 0).toFixed(1)} 
            </div>
          </motion.div>
        )}

        {(customer || isNewCustomer) && (
          <button 
            onClick={onNext} 
            className="w-full mt-8 bg-black hover:bg-gray-800 text-white py-5 rounded-2xl font-bold flex items-center justify-center gap-3 shadow-lg transition-transform active:scale-[0.98]"
          >
            متابعة العملية <FiChevronLeft />
          </button>
        )}
      </div>
    </motion.div>
  );
};

export default CustomerStep;