import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { 
  Star, 
  MessageSquare, 
  Package, 
  User, 
  Calendar, 
  Trash2, 
  RefreshCw,
  ShieldCheck,
  Gem
} from 'lucide-react';

function ReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const base = import.meta.env.VITE_API_URL;
      const response = await axios.get(`${base}/reviews/admin`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setReviews(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      toast.error('فشل في تحميل مراجعات العملاء');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleDeleteReview = async (id) => {
    if (!window.confirm('هل أنت متأكد من حذف هذا التقييم نهائياً؟')) return;
    const toastId = toast.loading('جاري حذف التقييم...');
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/reviews/admin/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('تم حذف التقييم بنجاح', { id: toastId });
      fetchReviews();
    } catch (error) {
      toast.error('فشل حذف التقييم', { id: toastId });
    }
  };

  const renderStars = (rating) => {
    return (
      <div className="flex gap-0.5 text-amber-400">
        {[...Array(5)].map((_, i) => (
          <Star 
            key={i} 
            className="w-3.5 h-3.5" 
            fill={i < Number(rating || 0) ? "currentColor" : "none"} 
          />
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[360px] gap-3">
        <div className="w-10 h-10 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" />
        <span className="text-slate-500 text-xs font-mono tracking-widest uppercase">جاري تحليل آراء ومراجعات العملاء...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6" dir="rtl">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-800">
            <MessageSquare className="w-5 h-5 text-slate-800" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 tracking-wide">مراجعات وتقييمات العملاء</h2>
            <p className="text-slate-500 text-xs mt-0.5">
              مراقبة جودة المنتجات، رضى المشترين، والآراء الموثقة
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3.5 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-xs">
            <span className="text-slate-500 font-bold">إجمالي المراجعات: </span>
            <span className="text-slate-900 font-mono font-bold">{reviews.length}</span>
          </div>

          <button
            onClick={fetchReviews}
            className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 transition-all active:scale-95"
            title="تحديث المراجعات"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Grid of Reviews */}
      {reviews.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 shadow-sm">
          <MessageSquare className="w-12 h-12 text-slate-400 mx-auto mb-3" />
          <p className="text-slate-500 text-sm">لا توجد تقييمات مسجلة حتى الآن</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          {reviews.map((rev) => (
            <div 
              key={rev.id || rev._id} 
              className="bg-white rounded-2xl border border-slate-200 p-5 hover:border-slate-300 transition-all duration-300 shadow-sm flex flex-col justify-between space-y-4"
            >
              <div className="flex gap-4">
                
                {/* Product thumbnail */}
                <div className="w-20 h-20 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 flex-shrink-0">
                  {rev.product?.image ? (
                    <img 
                      src={`${import.meta.env.VITE_URL}/${rev.product?.image}`} 
                      alt="product" 
                      className="w-full h-full object-cover"
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400">
                      <Gem className="w-6 h-6" />
                    </div>
                  )}
                </div>

                {/* Review info */}
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start gap-2 mb-1.5">
                    <div>
                      <h4 className="font-bold text-slate-900 text-xs truncate">
                        {rev.product?.name || 'قطعة مجوهرات'}
                      </h4>
                      <div className="flex items-center gap-2 mt-1">
                        {renderStars(rev.rating)}
                        <span className="text-[10px] font-mono text-slate-500 font-bold">
                          {rev.rating}/5
                        </span>
                      </div>
                    </div>

                    <button 
                      onClick={() => handleDeleteReview(rev.id || rev._id)}
                      className="p-1.5 rounded-lg bg-slate-100 hover:bg-rose-50 text-slate-500 hover:text-rose-600 border border-slate-200 transition-all"
                      title="حذف التقييم"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <p className="text-slate-700 text-xs leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-200 mt-2">
                    "{rev.comment || 'تقييم ممتاز بدون تعليق نصي'}"
                  </p>
                </div>
              </div>

              {/* Review footer */}
              <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500">
                <div className="flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  <span className="font-bold text-slate-800">
                    {rev.user?.name || rev.user?.fullName || 'عميل موثق'}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 font-mono">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>
                    {rev.createdAt ? new Date(rev.createdAt).toLocaleDateString('ar-EG') : '—'}
                  </span>
                </div>

                <div className="flex items-center gap-1 text-emerald-600">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span className="text-[10px] font-bold">مشتري معتمد</span>
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