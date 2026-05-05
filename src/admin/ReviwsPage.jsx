import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { FiStar, FiMessageCircle, FiPackage, FiUser, FiCalendar, FiActivity, FiTrash2 } from 'react-icons/fi';

function ReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const base = import.meta.env.VITE_API_URL;
      // نفترض أن الـ API يعيد التقييمات مع عمل Populate للمنتج والمستخدم
      const response = await axios.get(`${base}/reviews/admin`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setReviews(response.data);
    } catch (error) {
      toast.error('فشل في تحميل مراجعات العملاء');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleDeleteReview = async (id) => {
    if (!window.confirm('هل أنت متأكد من حذف هذا التقييم؟')) return;
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/reviews/admin/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('تم حذف التقييم');
      fetchReviews();
    } catch (error) {
      toast.error('فشل حذف التقييم');
    }
  };

  // دالة لرسم النجوم بناءً على الرقم
  const renderStars = (rating) => {
    return (
      <div className="flex gap-0.5 text-amber-400">
        {[...Array(5)].map((_, i) => (
          <FiStar key={i} size={14} fill={i < rating ? "currentColor" : "none"} />
        ))}
      </div>
    );
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center p-20 space-y-4">
      <FiActivity className="animate-spin text-4xl text-rose-500" />
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">تحليل آراء العملاء...</p>
    </div>
  );

  return (
    <div className="p-4 md:p-8 font-['Tajawal'] text-right space-y-8" dir="rtl">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-slate-900 rounded-lg text-white shadow-lg">
              <FiMessageCircle size={24} />
            </div>
            <h3 className="text-3xl font-black text-slate-900 tracking-tight">مراجعات العملاء</h3>
          </div>
          <p className="text-sm text-slate-400 font-medium">مراقبة الجودة وآراء المشترين حول المنتجات</p>
        </div>
        
        <div className="bg-white px-6 py-3 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
           <span className="text-sm font-bold text-slate-500">إجمالي المراجعات:</span>
           <span className="text-xl font-black text-rose-500">{reviews.length}</span>
        </div>
      </div>

      {reviews.length === 0 ? (
        <div className="bg-white rounded-[3rem] p-20 text-center border border-dashed border-slate-200">
          <p className="text-slate-400 font-bold ">لا توجد تقييمات مسجلة حتى الآن</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {reviews.map((rev) => (
            <div key={rev.id || rev._id} className="bg-white rounded-[2.5rem] border border-slate-100 p-6 hover:shadow-2xl hover:border-rose-100 transition-all duration-500 group relative overflow-hidden">
              
              <div className="flex flex-col md:flex-row gap-6">
                {/* Product Section */}
                <div className="w-full md:w-32 h-32 bg-slate-50 rounded-3xl overflow-hidden flex-shrink-0 relative group-hover:scale-105 transition-transform duration-500">
                  <img 
                    src={`${import.meta.env.VITE_URL}/${rev.product?.image}`} 
                    alt="product" 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>

                {/* Review Details */}
                <div className="flex-1 space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-black text-slate-800 text-lg group-hover:text-rose-500 transition-colors">
                        {rev.product?.name || 'منتج غير معروف'}
                      </h4>
                      <div className="mt-1 flex items-center gap-3">
                        {renderStars(rev.rating)}
                        <span className="text-[11px] font-black text-slate-400 uppercase tracking-tighter">
                          Rating: {rev.rating}/5
                        </span>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleDeleteReview(rev.id || rev._id)}
                      className="p-2.5 bg-rose-50 text-rose-500 rounded-xl hover:bg-rose-500 hover:text-white transition-all shadow-sm"
                    >
                      <FiTrash2 size={16} />
                    </button>
                  </div>

                  <p className="text-slate-600 text-sm leading-relaxed font-medium bg-slate-50/50 p-4 rounded-2xl border border-slate-50">
                    "{rev.comment || 'لا يوجد تعليق مكتوب'}"
                  </p>

                  {/* Footer Info */}
                  <div className="flex flex-wrap items-center gap-y-2 gap-x-6 pt-2">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-slate-100 rounded-full flex items-center justify-center">
                        <FiUser size={12} className="text-slate-500" />
                      </div>
                      <span className="text-xs font-bold text-slate-500">{rev.user?.name || rev.user?.fullName || 'عميل مجهول'}</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <FiCalendar size={14} className="text-slate-300" />
                      <span className="text-[10px] font-bold text-slate-400">
                        {rev.createdAt ? new Date(rev.createdAt).toLocaleDateString('ar-EG') : '-'}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 mr-auto">
                       <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                       <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Verified Purchase</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ReviewsPage;