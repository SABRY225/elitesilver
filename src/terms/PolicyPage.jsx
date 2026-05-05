import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const PolicyPage = ({ title, lastUpdated, children }) => {
  return (
    <div className="min-h-screen bg-slate-50 font-['Tajawal']" dir="rtl">
      <Navbar />
      
      {/* Header */}
      <div className="bg-slate-900 py-20 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#fb7185 0.5px, transparent 0.5px)', backgroundSize: '20px 20px' }}></div>
        <div className="container mx-auto px-6 relative z-10">
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4">{title}</h1>
          <p className="text-rose-400 font-bold">آخر تحديث: {lastUpdated}</p>
        </div>
      </div>

      {/* Content Area */}
      <div className="container mx-auto px-6 -mt-10 pb-20">
        <div className="max-w-4xl mx-auto bg-white rounded-[3rem] shadow-xl shadow-slate-200/50 p-10 md:p-16 border border-white">
          <div className="prose prose-slate prose-lg max-w-none text-right">
            {children}
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default PolicyPage;