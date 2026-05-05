import { useNavigate } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi'; // أيقونة سهم لليمين تناسب العربي

export const BackButton = () => {
  const navigate = useNavigate();

  return (
    <button 
      onClick={() => navigate(-1)} // -1 تعني العودة خطوة واحدة للخلف في سجل المتصفح
      className="flex items-center gap-2 text-gray-500 hover:text-black transition-all font-bold text-sm mb-6"
    >
      <FiArrowRight /> 
      <span>الرجوع للخلف</span>
    </button>
  );
};