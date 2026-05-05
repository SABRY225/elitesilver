import { motion } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';
import { FaQuoteRight, FaStar } from 'react-icons/fa';

function Testimonials() {
  const { t, language } = useLanguage();
  const isAr = language === 'ar';

  const reviews = [
    { id: 1, text: "Exceptional quality and very professional service. I ordered for a special occasion and the result was stunning.", author: "Sarah Ahmed", role: "Premium Client", initial: "S" },
    { id: 2, text: "Delivered on time and exceeded expectations. The attention to packaging and details is outstanding.", author: "Mohamed Khaled", role: "Custom Order", initial: "M" },
    { id: 3, text: "Amazing experience. Fast response and precise execution. Your products added a special touch to our gathering.", author: "Laila Mahmoud", role: "Loyal Client", initial: "L" },
    { id: 4, text: "One of the best stores I've dealt with. The real product looks even better than the photos.", author: "Nora Ali", role: "New Customer", initial: "N" },
    { id: 5, text: "Highly professional work and premium packaging. I’ll definitely rely on you for future occasions.", author: "Abdullah Youssef", role: "Corporate Order", initial: "A" },
    { id: 6, text: "Perfect timing and excellent taste in colors and materials. Wishing you continued success.", author: "Hend Hassan", role: "Premium Client", initial: "H" }
  ];

  // تكرار المراجعات لضمان استمرارية الحركة (Marquee)
  const duplicatedReviews = [...reviews, ...reviews, ...reviews];

  return (
    <section className="py-24 bg-[#fdfdfd] relative overflow-hidden border-t border-silver-200/30" dir={isAr ? 'rtl' : 'ltr'}>
      
      {/* عناصر زخرفية خلفية */}
      <div className="absolute top-0 left-1/4 w-64 h-64 bg-silver-200/20 blur-[100px] rounded-full -z-10" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-silver-200/30 blur-[120px] rounded-full -z-10" />

      <div className="container mx-auto px-6">
        {/* Header القسم */}
        <div className="text-center mb-16">
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-silver-600 font-bold tracking-[0.3em] uppercase text-xs mb-3 block"
          >
            {t('testimonialsBadge') || 'Pure Trust'}
          </motion.span>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 luxury-heading"
          >
            {t('customerReviews')}
          </motion.h2>

          <div className="flex justify-center gap-1">
            {[...Array(5)].map((_, i) => (
              <FaStar key={i} className="text-silver-500 text-sm" />
            ))}
          </div>
        </div>

        {/* Marquee Container */}
        <div className="relative group overflow-hidden">
          <motion.div 
            className="flex gap-8"
            animate={{
              x: isAr ? ["0%", "50%"] : ["0%", "-50%"]
            }}
            transition={{
              ease: "linear",
              duration: 40,
              repeat: Infinity,
            }}
            whileHover={{ animationPlayState: 'paused' }}
          >
            {duplicatedReviews.map((review, index) => (
              <div
                key={index}
                className="w-[350px] md:w-[420px] flex-shrink-0 bg-white border border-gray-100 p-10 rounded-[2rem] shadow-[0_10px_30px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_40px_rgba(212,175,55,0.1)] transition-all duration-500 relative group/card"
              >
                {/* أيقونة الاقتباس */}
                <FaQuoteRight className={`absolute top-8 ${isAr ? 'left-8' : 'right-8'} text-silver-500/10 text-5xl transition-transform group-hover/card:scale-110 group-hover/card:text-silver-500/20`} />

                <div className="relative z-10">
                  <p className={`text-gray-600 leading-relaxed mb-8 text-lg font-light ${isAr ? 'text-right' : 'text-left'} `}>
                    "{review.text}"
                  </p>

                  <div className={`flex items-center gap-4 ${isAr ? 'flex-row' : 'flex-row'}`}>
                    <div className="relative">
                      <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-gray-900 to-gray-700 flex items-center justify-center text-silver-400 font-serif text-xl shadow-lg">
                        {review.initial}
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-silver-500 rounded-full border-2 border-white flex items-center justify-center">
                        <FaStar className="text-[8px] text-white" />
                      </div>
                    </div>
                    
                    <div className={isAr ? 'text-right' : 'text-left'}>
                      <h4 className="font-bold text-gray-900 text-sm tracking-widest uppercase">
                        {review.author}
                      </h4>
                      <p className="text-[10px] text-silver-600 font-semibold mt-1 tracking-[0.1em] uppercase">
                        {review.role}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>

          {/* تأثير التلاشي الجانبي (Gradients) */}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#fdfdfd] to-transparent z-10" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[#fdfdfd] to-transparent z-10" />
        </div>
      </div>
    </section>
  );
}

export default Testimonials;