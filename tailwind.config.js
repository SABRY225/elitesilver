/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class', // تفعيل الوضع الليلي عبر الكلاس
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // --- ألوان النظام الرئيسية (Light & Dark) ---
        // تم ضبطها لتعطي إحساساً بالفخامة والهدوء
        'admin-bg': {
          DEFAULT: '#F8FAFC', // Light Mode background
          dark: '#111111',     // Dark Mode background (أسود غني)
        },
        'admin-card': {
          DEFAULT: '#FFFFFF',
          dark: '#1A1A1A',     // رمادي داكن جداً للكروت
        },
        'border-light': {
          DEFAULT: '#E2E8F0', // تم تغميقه قليلاً ليكون أوضح
          dark: '#2D2D2D',
        },
        'text-main': {
          DEFAULT: '#171717', // Slate 900
          dark: '#FAFAFA',     // نصوص بيضاء تقريباً في الوضع الليلي
        },
        'text-muted': {
          DEFAULT: '#64748B', // Slate 500
          dark: '#A3A3A3',     // رمادي متوسط للوضع الليلي
        },

        // --- ألوان العلامة التجارية (Brand Colors) ---
        // تم تغيير الـ Rose إلى الـ Sapphire الملكي لفخامة أكبر مع الفضة
        'brand': {
          // خيارات للون الأساسي:
          // 1. Sapphire الملكي (المستخدم حالياً): '#0F52BA'
          // 2. Ruby عنابي عميق: '#800020'
          // 3. Slate داكن رصين: '#1E293B'
          primary: {
            DEFAULT: '#0F52BA', 
            dark: '#3B82F6', // أزرق أفتح قليلاً للوضع الليلي
          },
          dark: '#0F172A',   // Slate 900 (للعناوين الكبيرة مثلاً)
          accent: {
            DEFAULT: '#6366F1', // Indigo 500
            dark: '#818CF8',
          },
        },


        // الفضة: تم استخدام درجات Zinc الباردة والنقية
        'silver': {
          50: '#FAFAFA',
          100: '#F4F4F5',
          200: '#E4E4E7',
          300: '#D4D4D8',
          400: '#A1A1AA',
          500: '#71717A', // الفضة القياسية
          600: '#52525B',
          700: '#3F3F46',
          800: '#27272A',
          900: '#18181B',
        },

        // البلاتين: درجات Slate مزرقة خفيفة، توحي بالبرودة والصلابة
        'platinum': {
          50: '#F8FAFC',
          100: '#F1F5F9',
          200: '#E2E8F0',
          300: '#CBD5E1',
          400: '#94A3B8',
          500: '#64748B',
          600: '#475569',
          700: '#334155',
          800: '#1E293B',
          900: '#0F172A',
        },

        // اللؤلؤ: درجات Stone دافئة قليلاً لتمييزها عن الفضة الباردة
        'pearl': {
          50: '#FAF9F6', // Off-white دافئ
          100: '#F5F5F4',
          200: '#E7E5E4',
          300: '#D6D3D1',
          400: '#A8A29E',
          500: '#78716C',
        },

        // ألوان الفخامة المسمّاة (Semantic Luxury)
        'luxury': {
          'cream': '#F9F7F0',
          'ivory': '#FFFFF0',
          'champagne': '#F7E7CE',
          'antique': '#C0C0C0',
          'metallic': '#BCC6CC',
        },

        // ألوان الأحجار الكريمة (Gemstones)
        'jewelry': {
          'diamond': '#B9D9EB',
          'sapphire': '#0F52BA',
          'emerald': '#50C878',
          'ruby': '#9B111E',
          'amethyst': '#9966CC',
        },
      },
      borderRadius: {
        'stats': '2.5rem',
        'inner': '1.5rem',
        'luxury': '1rem',
        'jewelry': '0.75rem',
        'elegant': '2rem',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
        '144': '36rem',
      },
      maxWidth: {
        '8xl': '88rem',
        '9xl': '96rem',
      },
      boxShadow: {
        'soft': '0 10px 40px -10px rgba(0, 0, 0, 0.04)',
        'brand': '0 10px 20px -5px rgba(15, 82, 186, 0.15)', 
        'luxury': '0 20px 40px -10px rgba(212, 175, 55, 0.1)',
        'silver': '0 10px 30px -5px rgba(113, 113, 122, 0.15)',
        'silver-glow': '0 0 20px rgba(218, 165, 32, 0.2)',
        'platinum': '0 15px 35px -5px rgba(100, 116, 139, 0.1)',
        // ظل خاص بالوضع الليلي (أكثر عمقاً)
        'dark-deep': '0 20px 50px -12px rgba(0, 0, 0, 0.5)',
      },
      keyframes: {
        'slide-up': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'shimmer': {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'luxury-fade': {
          '0%': { opacity: '0', transform: 'translateY(20px) scale(0.95)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        // تأثير لمعان المجوهرات
        'gem-twinkle': {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.7', transform: 'scale(1.05)' },
        }
      },
      animation: {
        'slide-up': 'slide-up 0.5s ease-out forwards',
        'shimmer': 'shimmer 2s infinite linear',
        'luxury-fade': 'luxury-fade 0.8s ease-out forwards',
        'gem-twinkle': 'gem-twinkle 3s ease-in-out infinite',
      },
      fontFamily: {
              sans: ['Tajawal', 'Alexandria', 'sans-serif'],
        cairo: ['Amiri', 'Playfair Display', 'serif'],
        amiri: ['Amiri', 'Playfair Display', 'serif'],
        luxury: ['Amiri', 'Cinzel', 'serif'],
        tajawal: ['Tajawal', 'sans-serif'],
        alexandria: ['Alexandria', 'sans-serif'],
        amiri: ['Amiri', 'serif'],
        cinzel: ['Cinzel', 'serif'],
      },
      backgroundImage: {
        // تأثيرات تدرج تحاكي المعدن (تم تحسين الألوان)
        'silver-gradient': 'linear-gradient(135deg, #FAFAFA 0%, #D4D4D8 50%, #A1A1AA 100%)',
        'platinum-gradient': 'linear-gradient(135deg, #F1F5F9 0%, #CBD5E1 50%, #94A3B8 100%)',
        // خلفيات للمنصات (Container surfaces) في الوضع الداكن
        'dark-gradient': 'linear-gradient(180deg, #1A1A1A 0%, #111111 100%)',
        
        // قمت بالإبقاء على النقوش، هي فكرة جميلة
        'luxury-texture': 'radial-gradient(circle at 25% 25%, rgba(212, 175, 55, 0.05) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(113, 113, 122, 0.05) 0%, transparent 50%)',
        'jewelry-pattern': 'repeating-conic-gradient(from 0deg at 50% 50%, rgba(218, 165, 32, 0.03) 0deg, transparent 60deg, rgba(80, 200, 120, 0.03) 120deg, transparent 180deg, rgba(15, 82, 186, 0.03) 240deg, transparent 300deg)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}