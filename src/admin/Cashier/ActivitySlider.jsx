import React, { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import { FiClock, FiUser, FiArrowLeft, FiShoppingBag, FiTag, FiTool } from 'react-icons/fi';

// استايلات Swiper الأساسية
import 'swiper/css';
import 'swiper/css/pagination';
import { useNavigate } from 'react-router-dom';

const ActivitySlider = ({ activities }) => {
  // الحالة المسؤولة عن الفلترة (all, buy, sell, repair)
  const [filter, setFilter] = useState('all');
  const navigate = useNavigate();

   
  // تصفية البيانات بناءً على الخيار المختار
  const filteredActivities = activities?.filter(act => 
    filter === 'all' ? true : act.type === filter
  );

  const tabs = [
    { id: 'all', label: 'الكل', icon: null },
    { id: 'buy', label: 'فواتير الشراء اليوم', icon: <FiTag /> },
    { id: 'sell', label: 'فواتير البيع اليوم', icon: <FiShoppingBag /> },
    { id: 'repair', label: 'فواتير الصيانة اليوم', icon: <FiTool /> },
  ];

  return (
    <div className="relative group mb-10">
      {/* الرأس ونظام التبويب */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 px-2 gap-4">
        <div>
          <h3 className="text-lg font-black text-gray-800 flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            النشاطات الأخيرة
          </h3>
        </div>

        {/* أزرار الفلترة المستحدثة */}
        <div className="flex bg-gray-100 p-1 rounded-2xl border border-gray-200">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                filter === tab.id
                  ? 'bg-white text-black shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        <button className="hidden md:flex text-[10px] font-bold text-gray-400 hover:text-black transition-colors items-center gap-1 uppercase tracking-widest" 
        onClick={()=>navigate("./history")}
        >
          عرض السجل بالكامل <FiArrowLeft />
        </button>
      </div>

      {/* السلايدر */}
      <Swiper
        key={filter} // استخدام الـ filter كـ key يجبر السلايدر على إعادة التشغيل عند التغيير لضمان السلاسة
        modules={[Autoplay, Pagination, Navigation]}
        spaceBetween={15}
        slidesPerView={1}
        loop={filteredActivities?.length > 3}
        autoplay={{ delay: 4000, disableOnInteraction: false }}
        breakpoints={{
          640: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
          1280: { slidesPerView: 4 },
        }}
        className="pb-12"
      >
        {filteredActivities?.map((activity, index) => (
          <SwiperSlide key={index}>
            <div className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden group">
              <div className="absolute -right-4 -top-4 w-20 h-20 bg-gray-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <div className="flex justify-between items-start mb-6">
                <span className={`text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-tighter ${
                  activity.type === 'buy' ? 'bg-blue-50 text-blue-600' : 
                  activity.type === 'sell' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                }`}>
                  {activity.type === 'buy' ? 'شراء' : activity.type === 'sell' ? 'بيع' : 'صيانة'}
                </span>
                <span className="text-xl font-black text-gray-900 tracking-tighter">
                  {activity.total} <small className="text-[10px] text-gray-400">JOD</small>
                </span>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-gray-600">
                  <FiUser className="text-xs text-gray-300" />
                  <span className="text-xs font-bold truncate">{activity.customerName}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-400">
                  <FiClock className="text-xs" />
                  <span className="text-[10px] font-medium">{new Date(activity.time).toLocaleString()}</span>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
        
        {/* حالة عدم وجود بيانات للفلتر المختار */}
        {filteredActivities?.length === 0 && (
            <div className="text-center py-10 text-gray-400 text-sm font-medium italic">
                لا توجد عمليات {tabs.find(t => t.id === filter).label} مؤخراً
            </div>
        )}
      </Swiper>
    </div>
  );
};

export default ActivitySlider;