import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { FiUpload, FiEdit3, FiUser, FiPhone, FiMapPin, FiX, FiCheckCircle, FiChevronLeft } from 'react-icons/fi';
import Navbar from './Navbar';
import Footer from './Footer';
import { useLanguage } from '../contexts/LanguageContext';

const CreateOrder = () => {
  const { t ,language  } = useLanguage(); // نستخدم الترجمة من إعداداتك الجاهزة
  const [customerInfo, setCustomerInfo] = useState({ name: '', phone: '', address: '' });
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem('user'));
    if (savedUser) {
      setCustomerInfo(prev => ({ ...prev, name: savedUser.name ,phone:savedUser.phone.slice(4),address:savedUser.address }));
    }
  })

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image) return alert(language === 'ar' ? "يرجى رفع صورة التصميم" : "Please upload design image");
    
    setLoading(true);
    const formData = new FormData();
    const fullPhone = `+962${customerInfo.phone}`; // دمج كود الأردن تلقائياً
    
    formData.append('customerName', customerInfo.name);
    formData.append('customerPhone', fullPhone);
    formData.append('customerAddress', customerInfo.address);
    formData.append('description', description);
    formData.append('image', image);

    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/custom/order`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setSubmitted(true);
    } catch (err) {
      alert(language === 'ar' ? "فشل في إرسال الطلب" : "Submission failed");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6 text-white font-sans">
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center bg-white/5 p-12 rounded-[3rem] border border-white/10 backdrop-blur-3xl shadow-2xl max-w-lg">
          <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-8 border border-green-500/40">
            <FiCheckCircle className="text-green-400 text-4xl" />
          </div>
          <h2 className="text-3xl font-black mb-4 italic">{t('success_title')}</h2>
          <p className="text-gray-400 mb-10 leading-relaxed">{t('success_msg')}</p>
          <button onClick={() => window.location.reload()} className="flex items-center gap-2 mx-auto text-silver-400 hover:text-white transition-all font-bold">
            <FiChevronLeft className={language === 'ar' ? '' : 'rotate-180'} /> {t('back_btn')}
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="bg-[#050505] text-white selection:bg-silver-500/30 font-sans min-h-screen">
      <Navbar />
      
      <div className="pt-32 pb-20 px-4 relative overflow-hidden">
        {/* تأثيرات جمالية في الخلفية */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-silver-500/5 blur-[150px] rounded-full -z-10" />

        <div className="max-w-5xl mx-auto">
          <header className="mb-20 text-center mt-20" >
            <motion.h1 initial={{y:20, opacity:0}} animate={{y:0, opacity:1}} className="text-5xl md:text-7xl font-black italic mb-6 tracking-tighter">
              {t('title')}
            </motion.h1>
            <motion.p initial={{y:20, opacity:0}} animate={{y:0, opacity:1}} transition={{delay:0.1}} className="text-gray-500 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
              {t('subtitle')}
            </motion.p>
          </header>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            
            {/* القسم الأول: البيانات الشخصية والوصف */}
            <div className="lg:col-span-7 space-y-8">
              <section className="bg-white/5 border border-white/10 p-8 rounded-[2.5rem] backdrop-blur-xl shadow-inner">
                <h3 className="text-xl font-bold mb-10 flex items-center gap-3 border-b border-white/5 pb-4 uppercase tracking-widest">
                  <FiUser className="text-silver-400" /> {t('personal_info')}
                </h3>
                
                <div className="space-y-6">
                  {/* الاسم */}
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">{t('name_label')}</label>
                    <div className="relative group">
                      <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-silver-400" />
                      <input required type="text" value={customerInfo.name} onChange={(e) => setCustomerInfo({...customerInfo, name: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 pl-12 outline-none focus:border-silver-500/50 transition-all shadow-inner" placeholder="..." />
                    </div>
                  </div>

                  {/* الهاتف الأردني */}
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">{t('phone_label')}</label>
                    <div className="flex gap-3" dir="ltr"> {/* الهاتف دائماً LTR لسهولة القراءة */}
                      <div className="bg-white/5 border border-white/10 rounded-2xl px-5 flex items-center gap-3 font-bold text-silver-400 min-w-[120px] justify-center">
                        <img src="https://flagcdn.com/w20/jo.png" alt="JO" className="rounded-sm" />
                        <span>+962</span>
                      </div>
                      <div className="relative flex-1 group">
                         <FiPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-silver-400" />
                         <input required type="tel" maxLength="9" value={customerInfo.phone} onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value.replace(/\D/g, '')})} className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 pl-12 outline-none focus:border-silver-500/50 tracking-widest" placeholder="7XXXXXXXX" />
                      </div>
                    </div>
                  </div>

                  {/* العنوان */}
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">{t('address_label')}</label>
                    <div className="relative group">
                      <FiMapPin className="absolute left-4 top-4 text-gray-500 group-focus-within:text-silver-400" />
                      <textarea required value={customerInfo.address} onChange={(e) => setCustomerInfo({...customerInfo, address: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 pl-12 outline-none focus:border-silver-500/50 h-24 resize-none shadow-inner" placeholder="..." />
                    </div>
                  </div>
                </div>
              </section>

              {/* وصف التصميم */}
              <section className="bg-white/5 border border-white/10 p-8 rounded-[2.5rem] backdrop-blur-xl">
                 <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
                  <FiEdit3 className="text-silver-400" /> {t('design_details')}
                </h3>
                <textarea required value={description} onChange={(e) => setDescription(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-2xl p-5 h-44 outline-none focus:border-silver-500/50 resize-none shadow-inner" placeholder={t('desc_placeholder')} />
              </section>
            </div>

            {/* القسم الثاني: رفع الصورة والزر (Sticky) */}
            <div className="lg:col-span-5 space-y-8 lg:sticky lg:top-32">
              <div className="relative p-2 bg-white/5 border border-white/10 rounded-[3rem] overflow-hidden shadow-2xl">
                <input type="file" id="img-upload" className="hidden" accept="image/*" onChange={handleImageChange} />
                
                {preview ? (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="relative h-96 w-full group">
                    <img src={preview} alt="Preview" className="h-full w-full object-cover rounded-[2.5rem]" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-[2.5rem]">
                      <button type="button" onClick={() => {setPreview(null); setImage(null)}} className="bg-red-500 p-4 rounded-full hover:scale-110 transition-transform shadow-2xl">
                        <FiX className="text-white text-2xl" />
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  <label htmlFor="img-upload" className="flex flex-col items-center justify-center h-96 cursor-pointer hover:bg-white/5 transition-all group">
                    <div className="w-24 h-24 bg-silver-500/10 rounded-full flex items-center justify-center mb-6 border border-silver-500/20 group-hover:scale-110 transition-all group-hover:bg-silver-500/20">
                      <FiUpload className="text-4xl text-silver-400" />
                    </div>
                    <p className="font-bold text-xl mb-2">{t('upload_label')}</p>
                    <p className="text-gray-600 text-[10px] uppercase tracking-widest">{t('upload_hint')}</p>
                  </label>
                )}
              </div>

              <button disabled={loading} type="submit" className="w-full py-7 bg-white text-black rounded-[2.5rem] font-black text-2xl hover:bg-silver-400 transition-all active:scale-[0.98] disabled:opacity-50 shadow-[0_30px_60px_-15px_rgba(255,255,255,0.1)]">
                {loading ? t('sending') : t('submit')}
              </button>
              
              <p className="text-center text-gray-700 text-[9px] uppercase tracking-widest px-8 leading-loose">
                {language === 'ar' ? 'فريق النخبة سيتواصل معك عبر الواتساب لتأكيد السعر ومدة التنفيذ' : 'Our team will contact you via WhatsApp for price and lead time confirmation'}
              </p>
            </div>

          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CreateOrder;