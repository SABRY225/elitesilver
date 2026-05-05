import PolicyPage from "./PolicyPage";

const RefundPolicy = () => (
  <PolicyPage title="سياسة الاستبدال والاسترجاع" lastUpdated="16/04/2026">
    <h3 className="text-2xl font-bold text-slate-800 mb-4">1. المنتجات القابلة للإرجاع</h3>
    <p className="text-slate-600 mb-6 leading-relaxed">بما أن منتجاتنا يتم تصميمها وتصنيعها خصيصاً بناءً على طلبكم، فإننا نعتذر عن استرجاع أو استبدال أي منتج مخصص (يحتوي على اسم أو تاريخ أو تصميم خاص) إلا في حال وجود عيب مصنعي واضح.</p>
    
    <h3 className="text-2xl font-bold text-slate-800 mb-4">2. المنتجات التالفة</h3>
    <p className="text-slate-600 mb-6 leading-relaxed">في حال وصول المنتج تالفاً، نرجو منكم التواصل معنا خلال 24 ساعة من تاريخ الاستلام مع إرفاق صور واضحة للتلف لنقوم بمعالجة الأمر فوراً.</p>
  </PolicyPage>
);

export default RefundPolicy