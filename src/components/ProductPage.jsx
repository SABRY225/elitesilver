import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { 
  FiChevronLeft, FiStar, FiHeart, FiShoppingCart, 
  FiChevronRight, FiPlus, FiMinus, FiShield, FiTruck, FiRotateCcw, FiInfo, FiX
} from 'react-icons/fi';
import Navbar from './Navbar';
import Footer from './Footer';
import toast, { Toaster } from 'react-hot-toast';
import { useLanguage } from "../contexts/LanguageContext";

function ProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t, isRTL, language } = useLanguage();
  
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  const [reviews, setReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewData, setReviewData] = useState({ rating: 5, comment: '' });
  const [submittingReview, setSubmittingReview] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const fetchProductAndRelated = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/products/${id}`);
        const data = res.data;
        setProduct(data);
        
        // جلب المنتجات ذات الصلة بناءً على القسم
        if (data.categoryId) {
          const relatedRes = await axios.get(`${import.meta.env.VITE_API_URL}/products?categoryId=${data.categoryId}`);
          const filtered = relatedRes.data.filter(p => (p.id || p._id) !== id).slice(0, 4);
          setRelatedProducts(filtered);
        }

        // جلب التقييمات
        fetchReviews();

        // التحقق من المفضلة في localStorage
        const savedWishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
        setIsWishlisted(savedWishlist.some(item => (item.id || item._id) === id));
      } catch (err) {
        toast.error(t('errorLoadingProduct'));
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    // التحقق من المصادقة
    const user = localStorage.getItem('user');
    setIsAuthenticated(!!user);

    fetchProductAndRelated();
    window.scrollTo(0, 0);
  }, [id, language]);

  const fetchReviews = async () => {
    setLoadingReviews(true);
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/products/${id}/ratings`);
      console.log(res.data);
      
      setReviews(res.data.ratings || []);
    } catch (err) {
      console.error('Error fetching reviews:', err);
      setReviews([]);
    } finally {
      setLoadingReviews(false);
    }
  };

  const handleAddToCart = () => {
    if (!product) return;

    const cartItem = {
      id: product.id || product._id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: quantity,
      addedAt: new Date().toISOString()
    };

    const savedCart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingItem = savedCart.find(item => item.id === cartItem.id);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      savedCart.push(cartItem);
    }

    localStorage.setItem('cart', JSON.stringify(savedCart));
    
    // تشغيل custom event لتحديث Navbar
    window.dispatchEvent(new CustomEvent('cartUpdated', { detail: savedCart }));

    toast.success(`${quantity} x ${product.name} ${t('addedToBag')}`, {
      style: { 
        background: '#1a1a1a', 
        color: '#fff', 
        borderRadius: '8px', 
        border: '1px solid #C0C0C0',
        fontSize: '14px' 
      },
      icon: '✨'
    });
  };

  const handleAddToWishlist = () => {
    if (!product) return;

    const wishlistItem = {
      id: product.id || product._id,
      name: product.name,
      price: product.price,
      image: product.image,
      addedAt: new Date().toISOString()
    };

    const savedWishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    const existingItem = savedWishlist.find(item => item.id === wishlistItem.id);

    if (existingItem) {
      // Remove from wishlist
      const updated = savedWishlist.filter(item => item.id !== wishlistItem.id);
      localStorage.setItem('wishlist', JSON.stringify(updated));
      setIsWishlisted(false);
      toast.success(t('removedFromWishlist'));
      // تشغيل custom event لتحديث Navbar
      window.dispatchEvent(new CustomEvent('wishlistUpdated', { detail: updated }));
    } else {
      // Add to wishlist
      savedWishlist.push(wishlistItem);
      localStorage.setItem('wishlist', JSON.stringify(savedWishlist));
      setIsWishlisted(true);
      toast.success(`${product.name} ${t('addedToWishlist')}`);
      // تشغيل custom event لتحديث Navbar
      window.dispatchEvent(new CustomEvent('wishlistUpdated', { detail: savedWishlist }));
    }
  };

  const handleSubmitReview = async () => {
    if (!isAuthenticated) {
      toast.error(t('pleaseLogin'));
      return;
    }

    if (!reviewData.comment.trim()) {
      toast.error(t('commentRequired'));
      return;
    }

    setSubmittingReview(true);
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      
      const payload = {
        productId: id,
        userId: user.id || user._id,
        userName: user.name,
        rating: reviewData.rating,
        comment: reviewData.comment,
        createdAt: new Date().toISOString()
      };

      await axios.post(`${import.meta.env.VITE_API_URL}/ratings`, payload,{
        headers:{
          "Authorization":"Bearer "+localStorage.getItem("token")
        }
      });
      
      toast.success(t('reviewAddedSuccessfully'));
      setReviewData({ rating: 5, comment: '' });
      setShowReviewModal(false);
      
      // Refresh reviews
      fetchReviews();
    } catch (err) {
      toast.error(t('errorAddingReview'));
      console.error('Error adding review:', err);
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) return <LoadingState t={t} />;
  if (!product) return <div className="py-40 text-center text-white bg-[#0a0a0a] min-h-screen uppercase tracking-widest">{t('productNotFound')}</div>;

  // تجميع الصور (الرئيسية + المعرض) بحيث تشمل الصور الموجودة فقط
  const allImages = [product.image, ...(JSON.parse(product.galleryImages || '[]'))]
    .filter(img => typeof img === 'string' && img.trim() !== '');

    console.log(allImages);
    
  const imageExists = allImages.length > 0;

  return (
    <div className="text-white bg-[#0a0a0a] font-sans pt-20" dir={isRTL ? 'rtl' : 'ltr'}>
      <Toaster position="bottom-center" />
      <Navbar /> 
      
      <div className="container mx-auto px-6 py-12 max-w-7xl">
        
        {/* Breadcrumbs / Back Button */}
        <div className="flex justify-between items-center mb-10">
          <button onClick={() => navigate(-1)} className="group flex items-center gap-2 text-gray-500 hover:text-[#C0C0C0] transition-all text-[12px] font-bold uppercase tracking-widest">
            {isRTL ? <FiChevronRight size={18}/> : <FiChevronLeft size={18}/>} {t('backToCollection')}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 xl:gap-20 items-start">
          
          {/* LEFT: Image Gallery */}
          <div className="lg:col-span-7 space-y-6">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative aspect-[4/5] bg-[#111] rounded-2xl overflow-hidden group border border-white/5"
            >
              {imageExists ? (
                <img 
                  src={allImages[activeImage]?.startsWith("http") ? allImages[activeImage] : `${import.meta.env.VITE_URL}/${allImages[activeImage]}`}
                  alt={product.name} 
                  className="w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-105" 
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm bg-[#222]">
                  {t('noImageAvailable')}
                </div>
              )}
              <div className={`absolute top-6 ${isRTL ? 'right-6' : 'left-6'}`}>
                <span className="bg-[#C0C0C0] text-black text-[10px] px-4 py-1.5 uppercase font-black tracking-widest rounded-full shadow-xl">
                  {t('premiumSelection')}
                </span>
              </div>
            </motion.div>

            {/* Thumbnails */}
            {allImages.length > 1 && (
              <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                {allImages.map((img, idx) => (
                  <button 
                    key={idx}
                    onClick={() => setActiveImage(idx)}
                    className={`relative min-w-[100px] aspect-square rounded-xl overflow-hidden border-2 transition-all ${activeImage === idx ? 'border-[#C0C0C0] scale-95' : 'border-transparent opacity-50 hover:opacity-100'}`}
                  >
                    <img src={img?.startsWith("http") ? img : `${import.meta.env.VITE_URL}/${img}`} className="w-full h-full object-cover" alt="Thumbnail" />
                  </button>
                ))}
              </div>
            )}

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-4 pt-10">
                <TrustBadge icon={<FiShield size={22}/>} title={t('guaranteed')} desc={product.silverType || '925 Silver'} />
                <TrustBadge icon={<FiTruck size={22}/>} title={t('shipping')} desc={t('fastDelivery')} />
                <TrustBadge icon={<FiRotateCcw size={22}/>} title={t('returns')} desc={t('easyReturns')} />
            </div>
          </div>

          {/* RIGHT: Product Details */}
          <div className="lg:col-span-5 lg:sticky lg:top-28">
            <div className="mb-8">
              <h1 className="text-4xl md:text-5xl font-serif mb-4 leading-tight">
                {product.name}
              </h1>
              
              <div className="flex flex-wrap items-baseline gap-4 mb-6">
                <span className="text-4xl font-bold text-[#C0C0C0]">
                  {product.price?.toLocaleString()} <span className="text-sm font-light opacity-60 uppercase">{t('currency')}</span>
                </span>
                {product.pricePerGram && (
                  <span className="text-gray-500 text-sm  border-l border-white/10 pl-4">
                    {product.pricePerGram} {t('currency')} / {t('gram')}
                  </span>
                )}
              </div>

              <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full mb-8">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                <span className="text-[11px] text-emerald-500 font-bold uppercase tracking-widest">
                  {product.stock > 0 ? `${t('inStock')} (${product.stock})` : t('outOfStock')}
                </span>
              </div>

              <p className="text-gray-400 leading-relaxed text-lg font-light mb-8 ">
                {product.description}
              </p>
            </div>

            {/* Specifications Grid */}
            <div className="grid grid-cols-2 gap-3 mb-10">
               <SpecCard label={t('material')} value={product.silverType || 'Silver 925'} />
               <SpecCard label={t('weight')} value={product.weight ? `${product.weight}g` : '--'} />
               <SpecCard label={t('stone')} value={product.stoneType || t('none')} />
               <SpecCard label={t('size')} value={product.size || t('adjustable')} />
               <SpecCard label={t('sku')} value={product.sku || 'EV-001'} />
            </div>

            {/* Actions */}
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10">
                <span className="text-xs font-bold uppercase tracking-widest text-gray-400">{t('quantity')}</span>
                <div className="flex items-center gap-6">
                  <button onClick={() => setQuantity(q => q > 1 ? q-1 : 1)} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#C0C0C0] hover:text-black transition-all"><FiMinus/></button>
                  <span className="text-lg font-serif min-w-[20px] text-center">{quantity}</span>
                  <button onClick={() => setQuantity(q => q + 1)} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#C0C0C0] hover:text-black transition-all"><FiPlus/></button>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <button 
                  onClick={handleAddToCart}
                  disabled={product.stock <= 0}
                  className="w-full bg-white text-black py-5 rounded-2xl font-black text-sm uppercase tracking-[0.3em] hover:bg-[#C0C0C0] hover:text-white transition-all disabled:opacity-30 flex items-center justify-center gap-3"
                >
                  <FiShoppingCart size={20}/> {t('addToBag')}
                </button>
                
                <button 
                  onClick={handleAddToWishlist}
                  className={`w-full py-5 border rounded-2xl text-sm font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-3 ${isWishlisted ? 'border-red-500 text-red-500 bg-red-500/5' : 'border-white/10 text-gray-400 hover:border-white hover:text-white'}`}
                >
                  <FiHeart size={20} className={isWishlisted ? 'fill-current' : ''} />
                  {isWishlisted ? t('inWishlist') : t('addToWishlist')}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* --- REVIEWS --- */}
        <section className="mt-32 pt-20 border-t border-white/5">
          <div className="flex justify-between items-end mb-16">
            <div className="text-center flex-1">
              <h2 className="text-3xl font-serif  mb-4">{t('clientTestimonials')}</h2>
              {reviews.length > 0 && (
                <div className="flex justify-center gap-1 text-[#C0C0C0]">
                  {[...Array(5)].map((_, i) => <FiStar key={i} className="fill-current" size={16}/>)}
                </div>
              )}
            </div>
            <button
              onClick={() => setShowReviewModal(true)}
              className="text-[11px] font-bold uppercase tracking-widest text-[#C0C0C0] hover:underline ml-6 whitespace-nowrap"
            >
              {isAuthenticated ? t('addReview') : t('loginToReview')}
            </button>
          </div>

          {loadingReviews ? (
            <div className="text-center py-12">
              <div className="w-8 h-8 border-2 border-[#C0C0C0] border-t-transparent rounded-full animate-spin mx-auto"></div>
            </div>
          ) : reviews && reviews.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {reviews.slice(0, 3).map((review, idx) => (
                <ReviewCard 
                  key={idx} 
                  name={review.user.name} 
                  comment={review.comment} 
                  rating={review.rating}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-400">
              <p className="text-sm">{t('noReviewsYet')}</p>
            </div>
          )}
        </section>

        {/* --- RELATED PRODUCTS --- */}
        {relatedProducts.length > 0 && (
          <section className="mt-32">
            <div className="flex justify-between items-end mb-12">
              <h2 className="text-3xl font-serif ">{t('completeTheLook')}</h2>
              <Link to="/" className="text-[11px] font-bold uppercase tracking-widest text-[#C0C0C0] hover:underline">
                {t('viewAll')}
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {relatedProducts.map(item => <RelatedCard key={item.id || item._id} item={item} t={t} />)}
            </div>
          </section>
        )}
      </div>
      <Footer />
      
      {/* Review Modal */}
      <ReviewModal 
        isOpen={showReviewModal}
        onClose={() => setShowReviewModal(false)}
        reviewData={reviewData}
        setReviewData={setReviewData}
        onSubmit={handleSubmitReview}
        submitting={submittingReview}
        t={t}
        isRTL={isRTL}
      />
    </div>
  );
}

/* HELPER COMPONENTS */

function SpecCard({ label, value }) {
  return (
    <div className="bg-white/5 p-4 rounded-xl border border-white/5 hover:border-white/20 transition-colors">
      <span className="text-[17px] text-[#C0C0C0] font-black uppercase tracking-widest block mb-1 opacity-80">{label}</span>
      <span className="text-[14px] text-gray-200 font-medium">{value}</span>
    </div>
  );
}

function TrustBadge({ icon, title, desc }) {
  return (
    <div className="text-center p-5 rounded-2xl bg-[#111] border border-white/5 flex flex-col items-center">
      <div className="text-[#C0C0C0] mb-3">{icon}</div>
      <h4 className="text-[10px] font-black uppercase tracking-widest mb-1">{title}</h4>
      <p className="text-[9px] text-gray-500 uppercase tracking-tighter">{desc}</p>
    </div>
  );
}

function ReviewCard({ name, comment, rating = 5 }) {
  return (
    <div className="bg-white/5 p-8 rounded-2xl border border-white/5 ">
      <div className="flex gap-1 text-[#C0C0C0] mb-4">
        {[...Array(5)].map((_, i) => (
          <FiStar 
            key={i} 
            size={14}
            className={i < rating ? 'fill-current' : ''}
          />
        ))}
      </div>
      <p className="text-gray-400 text-sm leading-relaxed mb-6">"{comment}"</p>
      <span className="text-[11px] font-bold uppercase tracking-widest text-[#C0C0C0]">— {name}</span>
    </div>
  );
}

function RelatedCard({ item, t }) {
  return (
    <Link to={`/product/${item.id || item._id}`} className="group block">
      <div className="aspect-[3/4] bg-[#111] rounded-xl overflow-hidden mb-4 relative border border-white/5">
        <img 
          src={item.image?.startsWith("http") ? item.image : `${import.meta.env.VITE_URL}/${item.image}`} 
          className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700" 
          alt={item.name}
        />
      </div>
      <h3 className="text-sm font-medium tracking-wide mb-1 text-center group-hover:text-[#C0C0C0] transition-colors uppercase">{item.name}</h3>
      <p className="text-xs font-bold text-gray-500 text-center uppercase tracking-widest">{item.price?.toLocaleString()} {t('currency')}</p>
    </Link>
  );
}

function LoadingState({ t }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0a0a0a] text-white">
      <div className="w-12 h-12 border-2 border-[#C0C0C0] border-t-transparent rounded-full animate-spin mb-6"></div>
      <span className="text-[11px] tracking-[0.5em] uppercase  animate-pulse text-[#C0C0C0]">{t('loadingMasterpiece')}</span>
    </div>
  );
}

function ReviewModal({ isOpen, onClose, reviewData, setReviewData, onSubmit, submitting, t, isRTL }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-8 max-w-lg w-full"
            onClick={e => e.stopPropagation()}
            dir={isRTL ? 'rtl' : 'ltr'}
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-serif">{t('addReview')}</h3>
              <button onClick={onClose} className="text-gray-400 hover:text-white">
                <FiX size={24} />
              </button>
            </div>

            <div className="space-y-6">
              {/* Rating */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-widest text-[#C0C0C0] mb-3">
                  {t('rating')}
                </label>
                <div className="flex gap-3 justify-center">
                  {[1, 2, 3, 4, 5].map(num => (
                    <button
                      key={num}
                      onClick={() => setReviewData({ ...reviewData, rating: num })}
                      className="transition-transform hover:scale-125"
                    >
                      <FiStar
                        size={28}
                        className={num <= reviewData.rating ? 'fill-[#C0C0C0] text-[#C0C0C0]' : 'text-gray-600'}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Comment */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-widest text-[#C0C0C0] mb-3">
                  {t('yourComment')}
                </label>
                <textarea
                  value={reviewData.comment}
                  onChange={e => setReviewData({ ...reviewData, comment: e.target.value })}
                  placeholder={t('shareYourThoughts')}
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder-gray-600 focus:border-[#C0C0C0] focus:outline-none resize-none h-32"
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-6">
                <button
                  onClick={onClose}
                  className="flex-1 py-3 border border-white/10 rounded-xl text-sm font-bold uppercase tracking-widest text-gray-400 hover:text-white hover:border-white transition-all"
                  disabled={submitting}
                >
                  {t('cancel')}
                </button>
                <button
                  onClick={onSubmit}
                  disabled={submitting || !reviewData.comment.trim()}
                  className="flex-1 py-3 bg-[#C0C0C0] text-black rounded-xl text-sm font-bold uppercase tracking-widest hover:bg-[#e5c158] transition-all disabled:opacity-50"
                >
                  {submitting ? t('submitting') : t('submitReview')}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default ProductPage;