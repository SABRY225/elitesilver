import React from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { FiCheckCircle, FiHome, FiArrowRight } from 'react-icons/fi';
import Navbar from './Navbar';
import Footer from './Footer';
import { useLanguage } from '../contexts/LanguageContext';

const OrderSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t, isRTL } = useLanguage();
  const user = JSON.parse(localStorage.getItem('user'));
  const orderId = location.state?.orderId;

  return (
    <div className="bg-[#121212] min-h-screen text-white font-sans" dir={isRTL ? 'rtl' : 'ltr'}>
      <Navbar />

      <main className="container mx-auto px-4 sm:px-6 py-24 max-w-3xl text-center">
        <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-emerald-500/15 text-emerald-400 mx-auto mb-8 shadow-[0_0_40px_rgba(16,185,129,0.12)]  mt-40">
          <FiCheckCircle className="text-5xl" />
        </div>

        <h1 className="text-4xl sm:text-5xl font-black mb-4 text-white">{t('orderSuccess')}</h1>
        <p className="text-sm sm:text-base text-silver-300 max-w-2xl mx-auto leading-relaxed mb-8">
          {t('orderSuccessMessage') || 'Thank you! Your order has been placed successfully. We are preparing it and will notify you with the shipping details soon.'}
        </p>

        {orderId && (
          <div className="mb-8 rounded-3xl border border-white/10 bg-white/5 p-6 text-left">
            <p className="text-sm text-silver-300 uppercase tracking-[0.3em] mb-3">{t('orderNumber') || 'Order Number'}</p>
            <p className="text-xl font-semibold text-white">{orderId}</p>
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-white text-black font-bold uppercase tracking-[0.2em] transition hover:bg-slate-100"
          >
            <FiHome /> {t('continueShopping')}
          </button>
          {user ? (
            <Link
              to="/profile"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full border border-white/10 text-white font-bold uppercase tracking-[0.2em] transition hover:bg-white/5"
            >
              {t('viewProfile') || 'View Profile'} <FiArrowRight />
            </Link>
          ) : null}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default OrderSuccess;
