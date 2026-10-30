import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import {
  ChevronLeft,
  ChevronRight,
  Star,
  Heart,
  ShoppingBag,
  Plus,
  Minus,
  ShieldCheck,
  Truck,
  RotateCcw,
  Sparkles,
  X,
  Gem,
  Award,
  CheckCircle2,
} from "lucide-react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import toast from "react-hot-toast";
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
  const [reviewData, setReviewData] = useState({ rating: 5, comment: "" });
  const [submittingReview, setSubmittingReview] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const fetchProductAndRelated = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/products/${id}`
        );
        const data = res.data;
        setProduct(data);

        if (data.categoryId) {
          const relatedRes = await axios.get(
            `${import.meta.env.VITE_API_URL}/products?categoryId=${data.categoryId}`
          );
          const filtered = relatedRes.data
            .filter((p) => (p.id || p._id) !== id)
            .slice(0, 4);
          setRelatedProducts(filtered);
        }

        fetchReviews();

        const savedWishlist = JSON.parse(
          localStorage.getItem("wishlist") || "[]"
        );
        setIsWishlisted(
          savedWishlist.some((item) => (item.id || item._id) === id)
        );
      } catch (err) {
        toast.error(t("errorLoadingProduct") || (isRTL ? "فشل تحميل تفاصيل المنتج" : "Failed to load product"));
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    const user = localStorage.getItem("user");
    setIsAuthenticated(!!user);

    fetchProductAndRelated();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [id, language]);

  const fetchReviews = async () => {
    setLoadingReviews(true);
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/products/${id}/ratings`
      );
      setReviews(res.data.ratings || []);
    } catch (err) {
      console.error("Error fetching reviews:", err);
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
      addedAt: new Date().toISOString(),
    };

    const savedCart = JSON.parse(localStorage.getItem("cart") || "[]");
    const existingItem = savedCart.find((item) => item.id === cartItem.id);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      savedCart.push(cartItem);
    }

    localStorage.setItem("cart", JSON.stringify(savedCart));
    window.dispatchEvent(new Event("cartUpdated"));
    toast.success(`${product.name} ${t("addedToBag") || (isRTL ? "تمت إضافتها إلى السلة!" : "added to bag!")}`);
  };

  const handleAddToWishlist = () => {
    if (!product) return;

    const wishlistItem = {
      id: product.id || product._id,
      name: product.name,
      price: product.price,
      image: product.image,
      addedAt: new Date().toISOString(),
    };

    const savedWishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");
    const existingItem = savedWishlist.find(
      (item) => item.id === wishlistItem.id
    );

    if (existingItem) {
      const updated = savedWishlist.filter(
        (item) => item.id !== wishlistItem.id
      );
      localStorage.setItem("wishlist", JSON.stringify(updated));
      setIsWishlisted(false);
      toast.success(t("removedFromWishlist") || (isRTL ? "تم الحذف من المفضلة" : "Removed from wishlist"));
      window.dispatchEvent(
        new CustomEvent("wishlistUpdated", { detail: updated })
      );
    } else {
      savedWishlist.push(wishlistItem);
      localStorage.setItem("wishlist", JSON.stringify(savedWishlist));
      setIsWishlisted(true);
      toast.success(`${product.name} ${t("addedToWishlist") || (isRTL ? "تمت الإضافة إلى المفضلة!" : "added to wishlist!")}`);
      window.dispatchEvent(
        new CustomEvent("wishlistUpdated", { detail: savedWishlist })
      );
    }
  };

  const handleSubmitReview = async () => {
    if (!isAuthenticated) {
      toast.error(t("pleaseLogin") || (isRTL ? "يرجى تسجيل الدخول أولاً" : "Please sign in first"));
      return;
    }

    if (!reviewData.comment.trim()) {
      toast.error(t("commentRequired") || (isRTL ? "يرجى كتابة تعليقك" : "Please enter your comment"));
      return;
    }

    setSubmittingReview(true);
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const payload = {
        productId: id,
        userId: user.id || user._id,
        userName: user.name,
        rating: reviewData.rating,
        comment: reviewData.comment,
        createdAt: new Date().toISOString(),
      };

      await axios.post(`${import.meta.env.VITE_API_URL}/ratings`, payload, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });

      toast.success(t("reviewAddedSuccessfully") || (isRTL ? "تمت إضافة تقييمك بنجاح!" : "Review added successfully!"));
      setReviewData({ rating: 5, comment: "" });
      setShowReviewModal(false);
      fetchReviews();
    } catch (err) {
      toast.error(t("errorAddingReview") || (isRTL ? "فشل إرسال التقييم" : "Error submitting review"));
      console.error("Error adding review:", err);
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) return <LoadingState t={t} isRTL={isRTL} />;
  if (!product)
    return (
      <div className="py-44 text-center text-white bg-[#070709] min-h-screen">
        <h2 className="text-2xl font-bold mb-4">{t("productNotFound") || (isRTL ? "المنتج غير موجود" : "Product Not Found")}</h2>
        <Link to="/category/all" className="silver-btn-luxury px-6 py-2.5 rounded-full text-black font-bold text-xs uppercase">
          {t("browseCollections") || (isRTL ? "تصفح التشكيلات" : "Browse Collections")}
        </Link>
      </div>
    );

  const allImages = [
    product.image,
    ...JSON.parse(product.galleryImages || "[]"),
  ].filter((img) => typeof img === "string" && img.trim() !== "");

  const imageExists = allImages.length > 0;
  const numericPrice = parseFloat(product.price) || 0;

  return (
    <div
      className="text-white bg-[#070709] select-none min-h-screen flex flex-col justify-between"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <Navbar />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 pt-36 sm:pt-44 pb-24 max-w-7xl flex-1">
        {/* زر العودة والمسار */}
        <div className="flex justify-between items-center mb-8">
          <button
            onClick={() => navigate(-1)}
            className="group flex items-center gap-2 text-silver-400 hover:text-white transition-colors text-xs font-bold uppercase tracking-wider cursor-pointer"
          >
            {isRTL ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            <span>{t("backToCollection") || (isRTL ? "العودة إلى التشكيلة" : "Back")}</span>
          </button>
        </div>

        {/* شبكة تفاصيل المنتج الرئيسية */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 xl:gap-16 items-start">
          {/* الجانب الأيمن / الأيسر: معرض الصور */}
          <div className="lg:col-span-7 space-y-5">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative aspect-[4/5] bg-black/50 rounded-3xl overflow-hidden border border-white/10 shadow-2xl group"
            >
              {imageExists ? (
                <img
                  src={
                    allImages[activeImage]?.startsWith("http")
                      ? allImages[activeImage]
                      : `${import.meta.env.VITE_URL}/${allImages[activeImage]}`
                  }
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-silver-400 text-xs">
                  {t("noImageAvailable")}
                </div>
              )}

              {/* شارة الأصالة */}
              <div className={`absolute top-4 ${isRTL ? "right-4" : "left-4"}`}>
                <span className="bg-white/95 backdrop-blur-md text-black text-[10px] px-3.5 py-1.5 uppercase font-black tracking-widest rounded-full shadow-lg border border-silver-200">
                  {isRTL ? "فضة إيطالية ٩٢٥" : "Italian 925 Silver"}
                </span>
              </div>
            </motion.div>

            {/* الصور المصغرة للمعرض */}
            {allImages.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                {allImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(idx)}
                    className={`relative min-w-[80px] sm:min-w-[90px] aspect-square rounded-2xl overflow-hidden border-2 transition-all cursor-pointer ${
                      activeImage === idx
                        ? "border-white scale-95 shadow-md"
                        : "border-transparent opacity-50 hover:opacity-100"
                    }`}
                  >
                    <img
                      src={
                        img?.startsWith("http")
                          ? img
                          : `${import.meta.env.VITE_URL}/${img}`
                      }
                      className="w-full h-full object-cover"
                      alt={`Thumbnail ${idx}`}
                    />
                  </button>
                ))}
              </div>
            )}

            {/* شارات الضمان والثقة */}
            <div className="grid grid-cols-3 gap-3 pt-6 border-t border-white/10">
              <TrustBadge
                icon={<ShieldCheck className="w-5 h-5 text-silver-300" />}
                title={t("guaranteed") || (isRTL ? "جودة مضمونة" : "Certified Purity")}
                desc={product.silverType || "925 Silver"}
              />
              <TrustBadge
                icon={<Truck className="w-5 h-5 text-silver-300" />}
                title={t("shipping") || (isRTL ? "شحن سريع" : "Fast Delivery")}
                desc={t("fastDelivery") || (isRTL ? "توصيل للمنزل" : "Insured")}
              />
              <TrustBadge
                icon={<RotateCcw className="w-5 h-5 text-silver-300" />}
                title={t("easyReturns") || (isRTL ? "إرجاع سهل" : "Easy Returns")}
                desc={isRTL ? "ضمان الاستبدال" : "Hassle Free"}
              />
            </div>
          </div>

          {/* الجانب الأيمن / الأيسر: تفاصيل القطعة والشراء */}
          <div className="lg:col-span-5 lg:sticky lg:top-32 space-y-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-silver-300 font-mono mb-3">
                <Sparkles className="w-3.5 h-3.5 text-silver-400" />
                <span>{product.sku || "ES-925"}</span>
              </div>

              <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-tight mb-4">
                {product.name}
              </h1>

              {/* السعر */}
              <div className="flex flex-wrap items-baseline gap-4 mb-4">
                <span className="text-3xl sm:text-4xl font-black text-white font-mono">
                  {numericPrice.toLocaleString(isRTL ? "ar-JO" : "en-US", {
                    minimumFractionDigits: 2,
                  })}
                  <span className="text-xs font-bold text-silver-400 uppercase ms-2">
                    {t("currency")}
                  </span>
                </span>

                {product.pricePerGram && (
                  <span className="text-silver-400 text-xs border-s border-white/10 ps-3">
                    {product.pricePerGram} {t("currency")} / {t("gram") || "غرام"}
                  </span>
                )}
              </div>

              {/* حالة المخزون */}
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full mb-6">
                <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                <span className="text-[11px] text-emerald-400 font-bold uppercase tracking-wider">
                  {product.stock > 0
                    ? `${t("inStock") || (isRTL ? "متوفر في المخزون" : "In Stock")} (${product.stock})`
                    : t("outOfStock") || (isRTL ? "غير متوفر حالياً" : "Out of Stock")}
                </span>
              </div>

              {/* الوصف */}
              {product.description && (
                <p className="text-silver-300/80 leading-relaxed text-sm font-light mb-6">
                  {product.description}
                </p>
              )}
            </div>

            {/* المواصفات الفنية */}
            <div className="grid grid-cols-2 gap-2.5">
              <SpecCard label={t("material") || (isRTL ? "العيار والمعدن" : "Material")} value={product.silverType || "Silver 925"} />
              <SpecCard label={t("weight") || (isRTL ? "الوزن" : "Weight")} value={product.weight ? `${product.weight}g` : "--"} />
              <SpecCard label={t("stone") || (isRTL ? "نوع الحجر" : "Stone")} value={product.stoneType || t("none") || (isRTL ? "بدون" : "None")} />
              <SpecCard label={t("size") || (isRTL ? "المقاس" : "Size")} value={product.size || t("adjustable") || (isRTL ? "قابل للتعديل" : "Adjustable")} />
            </div>

            {/* الكمية وأزرار الإجراءات */}
            <div className="space-y-3.5 pt-2">
              <div className="flex items-center justify-between p-3.5 bg-white/5 rounded-2xl border border-white/10">
                <span className="text-xs font-bold uppercase tracking-wider text-silver-400">
                  {t("quantity") || (isRTL ? "الكمية" : "Quantity")}
                </span>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setQuantity((q) => (q > 1 ? q - 1 : 1))}
                    className="w-8 h-8 flex items-center justify-center rounded-xl bg-white/5 hover:bg-white/15 text-white transition-colors cursor-pointer"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-base font-bold font-mono text-white min-w-[20px] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    className="w-8 h-8 flex items-center justify-center rounded-xl bg-white/5 hover:bg-white/15 text-white transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-2.5">
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock <= 0}
                  className="w-full py-4 silver-btn-luxury text-black rounded-xl font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2.5 shadow-lg active:scale-95 transition-all disabled:opacity-40 cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>{t("addToBag") || (isRTL ? "إضافة إلى السلة" : "Add to Bag")}</span>
                </button>

                <button
                  onClick={handleAddToWishlist}
                  className={`w-full py-3.5 border rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    isWishlisted
                      ? "border-red-500/80 text-red-400 bg-red-500/10"
                      : "border-white/10 text-silver-300 hover:border-white/30 hover:text-white"
                  }`}
                >
                  <Heart
                    className={`w-4 h-4 ${
                      isWishlisted ? "fill-red-500 text-red-500" : ""
                    }`}
                  />
                  <span>
                    {isWishlisted
                      ? t("inWishlist") || (isRTL ? "في قائمة المفضلة" : "In Wishlist")
                      : t("addToWishlist") || (isRTL ? "أضف إلى المفضلة" : "Add to Wishlist")}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* --- قسم المراجعات والتقييمات --- */}
        <section className="mt-24 pt-16 border-t border-white/10">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-12 gap-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-2">
                {t("clientTestimonials") || (isRTL ? "تقييمات العملاء" : "Client Reviews")}
              </h2>
              {reviews.length > 0 && (
                <div className="flex items-center gap-1.5 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                  <span className="text-xs text-silver-400 font-mono ms-2">
                    ({reviews.length} {isRTL ? "تقييم" : "reviews"})
                  </span>
                </div>
              )}
            </div>

            <button
              onClick={() => setShowReviewModal(true)}
              className="px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-white text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
            >
              {isAuthenticated
                ? t("addReview") || (isRTL ? "أضف تقييمك" : "Write a Review")
                : t("loginToReview") || (isRTL ? "سجل الدخول لإضافة تقييم" : "Sign in to Review")}
            </button>
          </div>

          {loadingReviews ? (
            <div className="text-center py-12">
              <div className="w-8 h-8 border-2 border-silver-400 border-t-transparent rounded-full animate-spin mx-auto" />
            </div>
          ) : reviews && reviews.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {reviews.slice(0, 3).map((review, idx) => (
                <div
                  key={idx}
                  className="bg-white/[0.03] p-6 rounded-2xl border border-white/10 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex gap-1 text-amber-400 mb-3">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 ${
                            i < (review.rating || 5)
                              ? "fill-amber-400"
                              : "text-gray-600"
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-silver-300 text-xs sm:text-sm leading-relaxed mb-4">
                      "{review.comment}"
                    </p>
                  </div>
                  <div className="text-xs font-bold text-white border-t border-white/5 pt-3">
                    — {review.user?.name || review.userName || (isRTL ? "عميل معتمد" : "Verified Buyer")}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-silver-400 text-xs">
              {t("noReviewsYet") || (isRTL ? "لا توجد تقييمات لهذه القطعة حتى الآن. كن أول من يقيّمها!" : "No reviews yet for this masterpiece. Be the first to review!")}
            </div>
          )}
        </section>

        {/* --- المنتجات ذات الصلة --- */}
        {relatedProducts.length > 0 && (
          <section className="mt-24 pt-16 border-t border-white/10">
            <div className="flex justify-between items-end mb-10">
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                {t("completeTheLook") || (isRTL ? "قطع تناسب إطلالتك" : "Complete the Look")}
              </h2>
              <Link
                to="/category/all"
                className="text-xs font-bold uppercase tracking-wider text-silver-400 hover:text-white transition-colors"
              >
                {t("viewAll") || (isRTL ? "عرض الكل" : "View All")}
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              {relatedProducts.map((item) => (
                <Link
                  key={item.id || item._id}
                  to={`/product/${item.id || item._id}`}
                  className="group bg-gradient-to-b from-white/[0.05] to-transparent p-3 rounded-2xl border border-white/10 hover:border-silver-400/40 transition-all flex flex-col justify-between"
                >
                  <div className="aspect-[4/5] rounded-xl overflow-hidden bg-black/40 mb-3">
                    <img
                      src={
                        item.image?.startsWith("http")
                          ? item.image
                          : `${import.meta.env.VITE_URL}/${item.image}`
                      }
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <h3 className="text-xs font-bold text-white group-hover:text-silver-300 transition-colors truncate mb-1">
                    {item.name}
                  </h3>
                  <div className="text-xs font-mono font-bold text-silver-300">
                    {(parseFloat(item.price) || 0).toLocaleString()}{" "}
                    <span className="text-[9px] uppercase">{t("currency")}</span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />

      {/* مودال التقييم */}
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

function SpecCard({ label, value }) {
  return (
    <div className="bg-white/[0.03] p-3 rounded-xl border border-white/10">
      <span className="text-[10px] text-silver-400 uppercase tracking-wider block mb-0.5">
        {label}
      </span>
      <span className="text-xs text-white font-medium truncate block">
        {value}
      </span>
    </div>
  );
}

function TrustBadge({ icon, title, desc }) {
  return (
    <div className="text-center p-3 sm:p-4 rounded-2xl bg-white/[0.02] border border-white/5 flex flex-col items-center">
      <div className="mb-1.5">{icon}</div>
      <h4 className="text-[10px] font-bold uppercase tracking-wider text-white mb-0.5">
        {title}
      </h4>
      <p className="text-[9px] text-silver-400">{desc}</p>
    </div>
  );
}

function LoadingState({ t, isRTL }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#070709] text-white">
      <div className="w-12 h-12 border-2 border-silver-400 border-t-transparent rounded-full animate-spin mb-4" />
      <span className="text-xs tracking-widest uppercase text-silver-300 animate-pulse font-mono">
        {t("loadingMasterpiece") || (isRTL ? "جاري تجهيز القطعة الفنية..." : "Loading Luxury...")}
      </span>
    </div>
  );
}

function ReviewModal({
  isOpen,
  onClose,
  reviewData,
  setReviewData,
  onSubmit,
  submitting,
  t,
  isRTL,
}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-md z-[90] flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.94, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.94, opacity: 0 }}
            className="bg-[#0e0e13] border border-white/15 rounded-3xl p-6 sm:p-8 max-w-lg w-full text-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
            dir={isRTL ? "rtl" : "ltr"}
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">
                {t("addReview") || (isRTL ? "أضف تقييمك" : "Write a Review")}
              </h3>
              <button
                onClick={onClose}
                className="p-1.5 rounded-full hover:bg-white/10 text-silver-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-silver-300 mb-2">
                  {t("rating") || (isRTL ? "تقييمك للقطعة" : "Rating")}
                </label>
                <div className="flex gap-2 justify-center py-2">
                  {[1, 2, 3, 4, 5].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setReviewData({ ...reviewData, rating: num })}
                      className="transition-transform hover:scale-125 cursor-pointer"
                    >
                      <Star
                        className={`w-7 h-7 ${
                          num <= reviewData.rating
                            ? "fill-amber-400 text-amber-400"
                            : "text-gray-600"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-silver-300 mb-2">
                  {t("yourComment") || (isRTL ? "تعليقك" : "Comment")}
                </label>
                <textarea
                  value={reviewData.comment}
                  onChange={(e) =>
                    setReviewData({ ...reviewData, comment: e.target.value })
                  }
                  placeholder={
                    t("shareYourThoughts") ||
                    (isRTL
                      ? "شاركنا رأيك في جودة الصياغة ونقاء الفضة..."
                      : "Share your experience with this piece...")
                  }
                  className="w-full bg-black/60 border border-white/15 rounded-2xl p-4 text-xs text-white placeholder-gray-500 focus:border-silver-400 focus:outline-none resize-none h-28"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-3 border border-white/15 rounded-xl text-xs font-bold uppercase tracking-wider text-silver-400 hover:text-white transition-all cursor-pointer"
                  disabled={submitting}
                >
                  {t("cancel") || (isRTL ? "إلغاء" : "Cancel")}
                </button>
                <button
                  type="button"
                  onClick={onSubmit}
                  disabled={submitting || !reviewData.comment.trim()}
                  className="flex-1 py-3 silver-btn-luxury text-black rounded-xl text-xs font-bold uppercase tracking-wider transition-all disabled:opacity-40 cursor-pointer shadow-lg"
                >
                  {submitting
                    ? t("submitting") || (isRTL ? "جاري الإرسال..." : "Submitting...")
                    : t("submitReview") || (isRTL ? "إرسال التقييم" : "Submit")}
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