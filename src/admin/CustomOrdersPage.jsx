import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLanguage } from '../contexts/LanguageContext';
import {
    ChevronRight, ChevronLeft, User, Phone, FileText,
    RefreshCcw, Eye, X, MapPin, CheckCircle2, Clock, AlertCircle,
    PackageCheck, DollarSign, Save,
    XCircle,
    Check
} from 'lucide-react';
import toast from 'react-hot-toast'; // يفضل استخدامه للتنبيهات

const CustomOrdersPage = () => {
    const { t } = useLanguage();

    // States
    const [orders, setOrders] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // إضافات للسعر
    const [price, setPrice] = useState("");
    const [isUpdatingPrice, setIsUpdatingPrice] = useState(false);

    // 1. جلب البيانات
    const fetchOrders = async (currentPage) => {
        setLoading(true);
        try {
            const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/custom/orders?page=${currentPage}&limit=5`);
            setOrders(data.data);
            setTotalPages(data.totalPages);
        } catch (error) {
            console.error("Error fetching data", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders(page);
    }, [page]);

    // 2. تحديث الحالة
    const handleStatusUpdate = async (id, newStatus) => {
        try {
            await axios.patch(`${import.meta.env.VITE_API_URL}/custom/orders/${id}/status`, { status: newStatus });
            setOrders(orders.map(order => order.id === id ? { ...order, status: newStatus } : order));
            if (selectedOrder?.id === id) setSelectedOrder({ ...selectedOrder, status: newStatus });
            toast.success("تم تحديث الحالة بنجاح");
        } catch (error) {
            alert("فشل في تحديث الحالة");
        }
    };

    // 3. تحديث السعر
    const handlePriceUpdate = async () => {
        if (!price || isNaN(price)) return alert("يرجى إدخال سعر صحيح");

        setIsUpdatingPrice(true);
        try {
            await axios.patch(`${import.meta.env.VITE_API_URL}/custom/orders/${selectedOrder.id}/price`, { price: Number(price) });

            // تحديث البيانات محلياً
            setOrders(orders.map(order => order.id === selectedOrder.id ? { ...order, price: Number(price) } : order));
            setSelectedOrder({ ...selectedOrder, price: Number(price) });

            alert("تم حفظ السعر بنجاح");
        } catch (error) {
            alert("فشل في حفظ السعر");
        } finally {
            setIsUpdatingPrice(false);
        }
    };

    // 4. فتح التفاصيل
    const openDetails = (order) => {
        setSelectedOrder(order);
        setPrice(order.price || ""); // تعبئة السعر إذا كان موجوداً مسبقاً
        setIsModalOpen(true);
    };

    const statusStyles = {
        new: "bg-blue-50 text-blue-700 border-blue-200",
        reviewing: "bg-amber-50 text-amber-700 border-amber-200",
        approved: "bg-emerald-50 text-emerald-700 border-emerald-200",
        completed: "bg-slate-100 text-slate-600 border-slate-200",
        shipping: "bg-blue-50 text-blue-700 border-blue-200",
        cancelled: "bg-red-100 text-red-700 border-red-200",
    };

    return (
        <div className="p-4 md:p-8 bg-[#f8fafc] min-h-screen font-sans" dir="rtl">

            {/* Header Section */}
            <div className="max-w-7xl mx-auto mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">إدارة الطلبات الخاصة</h1>
                    <p className="text-slate-500 mt-1 text-sm font-medium">متابعة الطلبات، تحديث الحالات، ومعاينة التصاميم</p>
                </div>
                <button
                    onClick={() => fetchOrders(page)}
                    className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl shadow-sm border border-slate-200 text-slate-600 hover:bg-slate-50 transition-all active:scale-95"
                >
                    <RefreshCcw size={18} className={loading ? "animate-spin" : ""} />
                    <span className="text-sm font-bold">تحديث البيانات</span>
                </button>
            </div>

            {/* Main Table Card */}
            <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-right border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200 text-slate-600">
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider">العميل</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider">لمحة عن الطلب</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider">السعر</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider">الحالة</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-center">الإجراءات</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="text-center py-20 text-slate-400">
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                                            <p className="font-medium">جاري جلب الطلبات...</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : orders.map((order) => (
                                <tr key={order.id} className="hover:bg-slate-50/50 transition-colors group">
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold">
                                                {order.customerName.charAt(0)}
                                            </div>
                                            <div>
                                                <div className="font-bold text-slate-900">{order.customerName}</div>
                                                <div className="text-xs text-slate-500">{order.customerPhone}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <p className="text-slate-600 text-sm line-clamp-1 max-w-[200px]">{order.description}</p>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="font-bold text-slate-700">
                                            {order.price ? `${order.price} د.أ` : <span className="text-slate-300 font-normal italic text-xs">لم يحدد</span>}
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold border ${statusStyles[order.status]}`}>
                                            {t(order.status)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5 text-center">
                                        <div className="flex items-center justify-center gap-2">
                                            {/* زرار التفاصيل - لون محايد */}

                                            <button
                                                onClick={() => openDetails(order)}
                                                className="p-2.5 text-slate-500 bg-slate-100 hover:bg-slate-200 hover:text-slate-700 rounded-xl transition-all duration-200 group shadow-sm"
                                                title="عرض التفاصيل"
                                            >
                                                <Eye size={18} className="group-hover:scale-110 transition-transform" />
                                            </button>


                                            {/* فاصل صغير */}

                                            <div className="w-[1px] h-6 bg-slate-200 mx-1"></div>



                                            {/* أزرار الحالات السريعة - تظهر بناءً على الحالة الحالية */}

                                            <div className="flex gap-1.5">

                                                {order.status == 'reviewing' && (
                                                    <>
                                                        <button
                                                            onClick={() => handleStatusUpdate(order.id, 'approved')}
                                                            className="p-2.5 text-emerald-600 bg-emerald-50 hover:bg-emerald-100 rounded-xl transition-all border border-emerald-100 shadow-sm"
                                                            title="موافقة"
                                                        >
                                                            <CheckCircle2 size={18} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleStatusUpdate(order.id, 'cancelled')}
                                                            className="p-2.5 text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-xl transition-all border border-rose-100 shadow-sm"
                                                            title="رفض الطلب"
                                                        >
                                                            <XCircle size={18} />
                                                        </button>
                                                    </>
                                                )}



                                                {order.status === 'approved' && (
                                                    <button
                                                        onClick={() => handleStatusUpdate(order.id, 'shipping')}
                                                        className="p-2.5 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-xl transition-all border border-blue-100 shadow-sm"
                                                        title="بدء الشحن"
                                                    >
                                                        <PackageCheck size={18} />
                                                    </button>
                                                )}
                                                {order.status === 'shipping' && (
                                                    <button
                                                        onClick={() => handleStatusUpdate(order.id, 'completed')}
                                                        className="p-2.5 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-xl transition-all border border-blue-100 shadow-sm"
                                                        title="إكمال الطلب"
                                                    >
                                                        <Check size={18} />
                                                    </button>

                                                )}
                                                {order.status === 'new' &&
                                                    (
                                                        <>
                                                            <button
                                                                onClick={() => handleStatusUpdate(order.id, 'reviewing')}
                                                                className="p-2.5 text-amber-600 bg-amber-50 hover:bg-amber-100 rounded-xl transition-all border border-amber-100 shadow-sm"
                                                                title="إعادة للمراجعة"
                                                            >
                                                                <Clock size={18} />
                                                            </button>
                                                            <button
                                                                onClick={() => handleStatusUpdate(order.id, 'cancelled')}
                                                                className="p-2.5 text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-xl transition-all border border-rose-100 shadow-sm"
                                                                title="رفض الطلب"
                                                            >
                                                                <XCircle size={18} />
                                                            </button>
                                                        </>
                                                    )
                                                }
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex justify-between items-center">
                    <p className="text-sm text-slate-500 font-medium">صفحة {page} من {totalPages}</p>
                    <div className="flex gap-2">
                        <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="p-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-50 transition-all"><ChevronRight size={18} /></button>
                        <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)} className="p-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-50 transition-all"><ChevronLeft size={18} /></button>
                    </div>
                </div>
            </div>

            {/* Modal - نافذة التفاصيل والتسعير */}
            {isModalOpen && selectedOrder && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
                    <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative animate-in fade-in zoom-in duration-300">

                        <div className="sticky top-0 bg-white/80 backdrop-blur-md px-6 py-4 border-b flex justify-between items-center z-10">
                            <h2 className="text-xl font-black text-slate-800">إدارة الطلب الخاص</h2>
                            <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors"><X size={24} /></button>
                        </div>

                        <div className="p-6 space-y-6">

                            {/* قسم تحديد السعر - جديد */}
                            <div className="bg-emerald-50 border border-emerald-100 p-6 rounded-2xl">
                                <label className="block text-emerald-800 font-bold mb-3 flex items-center gap-2">
                                    <DollarSign size={18} /> تحديد تسعيرة الطلب
                                </label>
                                <div className="flex gap-3">
                                    <div className="relative flex-1">
                                        <input
                                            type="number"
                                            value={price}
                                            onChange={(e) => setPrice(e.target.value)}
                                            placeholder="أدخل السعر الإجمالي هنا..."
                                            className="w-full px-4 py-3 rounded-xl border-2 border-emerald-200 focus:border-emerald-500 focus:ring-0 transition-all font-bold text-lg"
                                        />
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-emerald-600">د.أ</span>
                                    </div>
                                    <button
                                        onClick={handlePriceUpdate}
                                        disabled={isUpdatingPrice}
                                        className="bg-emerald-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-emerald-700 transition-all flex items-center gap-2 disabled:opacity-50 shadow-md shadow-emerald-200"
                                    >
                                        {isUpdatingPrice ? <RefreshCcw className="animate-spin" size={18} /> : <Save size={18} />}
                                        حفظ السعر
                                    </button>
                                </div>
                                <p className="text-[10px] text-emerald-600 mt-2 font-medium">* بمجرد الحفظ سيتمكن العميل من رؤية السعر في حسابه</p>
                            </div>

                            {/* معلومات العميل */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl">
                                <div>
                                    <label className="text-[10px] font-bold text-slate-400 uppercase">العميل</label>
                                    <p className="text-slate-900 font-bold flex items-center gap-2"><User size={14} /> {selectedOrder.customerName}</p>
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-slate-400 uppercase">رقم التواصل</label>
                                    <p className="text-slate-900 font-bold flex items-center gap-2" dir="ltr"><Phone size={14} /> {selectedOrder.customerPhone}</p>
                                </div>
                            </div>

                            {/* الوصف */}
                            <div>
                                <label className="text-xs font-bold text-slate-400 mb-2 block">وصف الطلب</label>
                                <div className="p-4 bg-blue-50 border border-blue-100 rounded-2xl text-slate-700 font-medium leading-relaxed italic">
                                    "{selectedOrder.description}"
                                </div>
                            </div>

                            {/* الصورة */}
                            <div>
                                <label className="text-xs font-bold text-slate-400 mb-2 block tracking-widest">التصميم المرفق</label>
                                <div className="rounded-2xl overflow-hidden border-4 border-white shadow-xl bg-slate-100">
                                    <img src={`${import.meta.env.VITE_URL}/uploads/${selectedOrder.imagePath}`} alt="Design" className="w-full h-auto max-h-[400px] object-contain mx-auto" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CustomOrdersPage;