import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { 
  FileText, 
  BookOpen, 
  ListOrdered, 
  LogOut, 
  Store, 
  User, 
  Printer, 
  Calendar,
  Sparkles,
  PlusCircle,
  RefreshCw,
  Coins,
  Clock,
  CheckCircle2,
  XCircle,
  X,
  ChevronRight,
  ChevronLeft,
  Download,
  Save,
  CalendarCheck
} from 'lucide-react';
import InvoiceDocument from './InvoiceDocument';
import DailySheetDocument from './DailySheetDocument';
import imgLogo from '../images/logo.png';

function BranchPortal() {
  const navigate = useNavigate();
  const token = localStorage.getItem('branch_token');
  const employee = JSON.parse(localStorage.getItem('branch_employee') || '{}');
  const branch = JSON.parse(localStorage.getItem('branch_info') || '{}');

  const [activeTab, setActiveTab] = useState('invoice'); // 'invoice' | 'daily' | 'advances' | 'history'
  const [saving, setSaving] = useState(false);
  const [todayInvoices, setTodayInvoices] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  // حالة ترقيم فواتير اليوم
  const [currentPageInvoices, setCurrentPageInvoices] = useState(1);
  const [itemsPerPageInvoices, setItemsPerPageInvoices] = useState(10);

  // حالة طلبات السلف للموظف وترقيمها ومعلومات الراتب
  const [advances, setAdvances] = useState([]);
  const [loadingAdvances, setLoadingAdvances] = useState(false);
  const [advanceModalOpen, setAdvanceModalOpen] = useState(false);
  const [advanceAmount, setAdvanceAmount] = useState('');
  const [advanceReason, setAdvanceReason] = useState('');
  const [submittingAdvance, setSubmittingAdvance] = useState(false);
  const [currentPageAdvances, setCurrentPageAdvances] = useState(1);
  const [itemsPerPageAdvances, setItemsPerPageAdvances] = useState(10);
  const [employeeSalaryInfo, setEmployeeSalaryInfo] = useState({
    salary: 0,
    totalTakenAdvances: 0,
    remainingSalary: 0
  });

  // حالة سجل الحضور والدوام
  const [attendances, setAttendances] = useState([]);
  const [attendanceSummary, setAttendanceSummary] = useState({
    totalDaysAttended: 0,
    totalWorkedHours: '0.00',
    totalAbsences: 0
  });
  const [todayAttendance, setTodayAttendance] = useState(null);
  const [loadingAttendance, setLoadingAttendance] = useState(false);
  const [currentPageAttendance, setCurrentPageAttendance] = useState(1);
  const [itemsPerPageAttendance, setItemsPerPageAttendance] = useState(10);

  // حالة الحفظ التلقائي للسجل اليومي
  const [autoSaveStatus, setAutoSaveStatus] = useState(''); // 'saving' | 'saved' | 'error' | ''
  const [lastAutoSavedTime, setLastAutoSavedTime] = useState(null);
  const autoSaveTimerRef = useRef(null);

  // حالة الفاتورة الحالية
  const [invoiceData, setInvoiceData] = useState({
    invoiceNumber: '0001',
    date: new Date().toISOString().split('T')[0],
    paymentType: 'نقدي',
    customerName: '',
    customerPhone: '',
    items: [
      { id: 1, type: '', count: '', karat: '925', makerFeeGram: '', gramPrice: '', totalFee: '', priceDinar: '', priceFils: '' },
      { id: 2, type: '', count: '', karat: '925', makerFeeGram: '', gramPrice: '', totalFee: '', priceDinar: '', priceFils: '' },
      { id: 3, type: '', count: '', karat: '925', makerFeeGram: '', gramPrice: '', totalFee: '', priceDinar: '', priceFils: '' },
      { id: 4, type: '', count: '', karat: '925', makerFeeGram: '', gramPrice: '', totalFee: '', priceDinar: '', priceFils: '' },
      { id: 5, type: '', count: '', karat: '925', makerFeeGram: '', gramPrice: '', totalFee: '', priceDinar: '', priceFils: '' },
      { id: 6, type: '', count: '', karat: '925', makerFeeGram: '', gramPrice: '', totalFee: '', priceDinar: '', priceFils: '' },
    ],
    subtotal: '0.000',
    discount: '0.000',
    total: '0.000',
    recipientName: employee.name || ''
  });

  // حالة السجل اليومي الحالي
  const [dailyData, setDailyData] = useState({
    dayName: '',
    date: new Date().toISOString().split('T')[0],
    entries: [
      { id: 1, clientPhone: '', clientName: '', weightAndDetails: '', expenses: '', expenseDetails: '', sales: '', isVisa: false },
      { id: 2, clientPhone: '', clientName: '', weightAndDetails: '', expenses: '', expenseDetails: '', sales: '', isVisa: false },
      { id: 3, clientPhone: '', clientName: '', weightAndDetails: '', expenses: '', expenseDetails: '', sales: '', isVisa: false },
      { id: 4, clientPhone: '', clientName: '', weightAndDetails: '', expenses: '', expenseDetails: '', sales: '', isVisa: false },
      { id: 5, clientPhone: '', clientName: '', weightAndDetails: '', expenses: '', expenseDetails: '', sales: '', isVisa: false },
      { id: 6, clientPhone: '', clientName: '', weightAndDetails: '', expenses: '', expenseDetails: '', sales: '', isVisa: false },
      { id: 7, clientPhone: '', clientName: '', weightAndDetails: '', expenses: '', expenseDetails: '', sales: '', isVisa: false },
      { id: 8, clientPhone: '', clientName: '', weightAndDetails: '', expenses: '', expenseDetails: '', sales: '', isVisa: false },
    ],
    totalGrams: '0.000',
    totalSales: '0.000',
    totalExpenses: '0.000',
    totalVisaSales: '0.000',
    netTotal: '0.000',
    totalAdvances: '0.000',
    brokenSilverGrams: '0.000',
    brokenGoldGrams: '0.000',
  });

  // التحقق من صلاحية الجلسة
  useEffect(() => {
    if (!token || !employee?.id) {
      toast.error('يرجى تسجيل الدخول إلى بوابة الفرع أولاً');
      navigate('/branch-portal/login');
    }
  }, [token, navigate]);

  // جلب رقم الفاتورة التالي
  const fetchNextInvoiceNumber = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/branches/employee/next-invoice-number`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        const nextNum = res.data.invoiceNumber || res.data.nextNumber || '0001';
        setInvoiceData(prev => ({ ...prev, invoiceNumber: nextNum }));
      }
    } catch (error) {
      console.error(error);
    }
  };

  // جلب سجل اليوم الحالي وجلب كافة السطور بدقة
  const fetchTodayDailyRegister = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/branches/employee/daily-register`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success && res.data.data) {
        const d = res.data.data;
        let parsedEntries = d.entries;
        if (typeof parsedEntries === 'string') {
          try { parsedEntries = JSON.parse(parsedEntries); } catch (e) { parsedEntries = []; }
        }

        setDailyData(prev => ({
          ...prev,
          dayName: d.dayName || prev.dayName,
          date: d.date || prev.date,
          entries: Array.isArray(parsedEntries) && parsedEntries.length > 0 ? parsedEntries : prev.entries,
          totalGrams: d.totalGrams !== undefined ? d.totalGrams : prev.totalGrams,
          totalSales: d.totalSales !== undefined ? d.totalSales : prev.totalSales,
          totalExpenses: d.totalExpenses !== undefined ? d.totalExpenses : prev.totalExpenses,
          totalVisaSales: d.totalVisaSales !== undefined ? d.totalVisaSales : prev.totalVisaSales,
          netTotal: d.netTotal !== undefined ? d.netTotal : prev.netTotal,
          totalAdvances: d.totalAdvances !== undefined ? d.totalAdvances : prev.totalAdvances,
          brokenSilverGrams: d.brokenSilverGrams !== undefined ? d.brokenSilverGrams : prev.brokenSilverGrams,
          brokenGoldGrams: d.brokenGoldGrams !== undefined ? d.brokenGoldGrams : prev.brokenGoldGrams,
        }));
      }
    } catch (error) {
      console.error(error);
    }
  };

  // جلب فواتير اليوم للفرع
  const fetchTodayInvoices = async () => {
    setLoadingHistory(true);
    try {
      const today = new Date().toISOString().split('T')[0];
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/branches/employee/invoices?date=${today}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        setTodayInvoices(res.data.data || []);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingHistory(false);
    }
  };

  // جلب سلف الموظف ومعلومات الراتب
  const fetchAdvances = async () => {
    setLoadingAdvances(true);
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/branches/employee/advances`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        setAdvances(res.data.data || []);
        if (res.data.salary !== undefined) {
          setEmployeeSalaryInfo({
            salary: parseFloat(res.data.salary) || 0,
            totalTakenAdvances: parseFloat(res.data.totalTakenAdvances) || 0,
            remainingSalary: parseFloat(res.data.remainingSalary) || 0
          });
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingAdvances(false);
    }
  };

  // إرسال طلب سلفة جديد (مرتبط بالراتب والمتبقي)
  const handleRequestAdvance = async (e) => {
    e.preventDefault();
    const reqAmt = parseFloat(advanceAmount);
    if (!advanceAmount || isNaN(reqAmt) || reqAmt <= 0) {
      return toast.error('يرجى إدخال مبلغ سلفة صحيح');
    }

    if (employeeSalaryInfo.salary <= 0) {
      return toast.error('لم يتم تسجيل راتب شهري لحسابك بعد من قبل الإدارة، يرجى مراجعة الإدارة أولاً.');
    }

    if (reqAmt > employeeSalaryInfo.remainingSalary) {
      return toast.error(`مبلغ السلفة المطلوب (${reqAmt} د.أ) يتجاوز الراتب المتبقي المتاح للسلفة (${employeeSalaryInfo.remainingSalary.toFixed(3)} د.أ)`);
    }

    setSubmittingAdvance(true);
    const toastId = toast.loading('جاري إرسال طلب السلفة للإدارة...');
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/branches/employee/advances`, {
        amount: advanceAmount,
        reason: advanceReason
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.data.success) {
        toast.success(res.data.message || 'تم إرسال طلب السلفة للإدارة بنجاح وهو بانتظار الموافقة', { id: toastId });
        setAdvanceModalOpen(false);
        setAdvanceAmount('');
        setAdvanceReason('');
        fetchAdvances();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'فشل في إرسال طلب السلفة', { id: toastId });
    } finally {
      setSubmittingAdvance(false);
    }
  };

  // جلب سجل الحضور والدوام الخاص بالموظف
  const fetchMyAttendance = async () => {
    if (!token) return;
    setLoadingAttendance(true);
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/branches/employee/attendance`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        setAttendances(res.data.data || []);
        if (res.data.summary) {
          setAttendanceSummary(res.data.summary);
        }
        const todayStr = new Date().toISOString().split('T')[0];
        const todayRec = (res.data.data || []).find(a => a.date === todayStr);
        if (todayRec) {
          setTodayAttendance(todayRec);
        }
      }
    } catch (error) {
      console.error('فشل في جلب سجل الحضور:', error);
    } finally {
      setLoadingAttendance(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchNextInvoiceNumber();
      fetchTodayDailyRegister();
      fetchTodayInvoices();
      fetchAdvances();
      fetchMyAttendance();
    }
  }, [token]);

  // تحديث البيانات تلقائياً وجلب كافة السطور عند التبديل بين التبويبات
  useEffect(() => {
    if (activeTab === 'daily') {
      fetchTodayDailyRegister();
    } else if (activeTab === 'history') {
      fetchTodayInvoices();
      setCurrentPageInvoices(1);
    } else if (activeTab === 'advances') {
      fetchAdvances();
      setCurrentPageAdvances(1);
    } else if (activeTab === 'attendance') {
      fetchMyAttendance();
      setCurrentPageAttendance(1);
    }
  }, [activeTab]);

  const handleLogout = () => {
    toast((t) => (
      <div className="flex flex-col gap-3 font-cairo text-right" dir="rtl">
        <p className="font-bold text-sm text-slate-800">هل تود تسجيل الخروج من الفرع؟</p>
        <p className="text-xs text-slate-500 leading-relaxed">
          سيتم تلقائياً تسجيل وقت الانصراف وحساب إجمالي ساعات العمل لهذا اليوم.
        </p>
        <div className="flex gap-2 justify-start pt-1">
          <button 
            onClick={async () => {
              toast.dismiss(t.id);
              const toastId = toast.loading('جاري تسجيل الانصراف والخروج...');
              try {
                await axios.post(`${import.meta.env.VITE_API_URL}/branches/employee/logout`, {}, {
                  headers: { Authorization: `Bearer ${token}` }
                });
              } catch (e) {
                console.error(e);
              }
              localStorage.removeItem('branch_token');
              localStorage.removeItem('branch_employee');
              localStorage.removeItem('branch_info');
              localStorage.removeItem('branch_attendance');
              toast.success('تم تسجيل انصرافك والخروج من النظام بنجاح', { id: toastId });
              navigate('/branch-portal/login');
            }}
            className="bg-rose-500 hover:bg-rose-600 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-md"
          >
            تأكيد الانصراف والخروج
          </button>
          <button 
            onClick={() => toast.dismiss(t.id)} 
            className="bg-slate-200 text-slate-800 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer"
          >
            إلغاء
          </button>
        </div>
      </div>
    ), { 
      duration: 6000,
      style: {
        background: '#ffffff',
        border: '1px solid #e2e8f0',
        color: '#0f172a',
        fontFamily: 'Cairo, sans-serif'
      }
    });
  };

  // دالة الحفظ التلقائي للسجل اليومي في الخلفية (Auto-Save)
  const saveDailyRegisterAuto = async (dataToSave) => {
    try {
      setAutoSaveStatus('saving');
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/branches/employee/daily-register`, dataToSave, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        setAutoSaveStatus('saved');
        const now = new Date();
        const timeStr = now.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        setLastAutoSavedTime(timeStr);
      }
    } catch (err) {
      console.error('Auto save daily register error:', err);
      setAutoSaveStatus('error');
    }
  };

  // تحديث بيانات السجل اليومي مع تفعيل الحفظ التلقائي بعد توقف الكتابة (Debounced Auto-Save)
  const handleDailyDataChange = (newData) => {
    setDailyData(newData);
    setAutoSaveStatus('saving');

    if (autoSaveTimerRef.current) {
      clearTimeout(autoSaveTimerRef.current);
    }

    autoSaveTimerRef.current = setTimeout(() => {
      saveDailyRegisterAuto(newData);
    }, 1200);
  };

  // جلب كافة سطور فواتير اليوم تلقائياً إلى السجل اليومي واحتساب المجاميع وحفظها فوراً
  const handleImportTodayInvoices = () => {
    if (!todayInvoices || todayInvoices.length === 0) {
      return toast.error('لا توجد فواتير مسجلة اليوم لجلبها');
    }

    const importedEntries = todayInvoices.map((inv, idx) => {
      let itemsDesc = '';
      if (Array.isArray(inv.items)) {
        itemsDesc = inv.items.filter(it => it && it.type).map(it => `${it.count || 1} ${it.type}`).join('، ');
      }
      return {
        id: Date.now() + idx,
        clientPhone: inv.customerPhone || '',
        clientName: inv.customerName || 'عميل نقدي',
        weightAndDetails: `فاتورة #${inv.invoiceNumber}${itemsDesc ? ' (' + itemsDesc + ')' : ''}`,
        expenses: '0.000',
        sales: String(inv.total || '0.000'),
        isVisa: inv.paymentType !== 'نقدي'
      };
    });

    let salesSum = 0;
    let visaSum = 0;
    importedEntries.forEach(item => {
      const s = parseFloat(item.sales) || 0;
      salesSum += s;
      if (item.isVisa) visaSum += s;
    });

    const currentExpenses = parseFloat(dailyData.totalExpenses) || 0;
    const net = (salesSum - currentExpenses).toFixed(3);

    const updated = {
      ...dailyData,
      entries: importedEntries,
      totalSales: salesSum.toFixed(3),
      totalVisaSales: visaSum.toFixed(3),
      netTotal: net
    };

    setDailyData(updated);
    saveDailyRegisterAuto(updated);
    toast.success(`تم جلب ${importedEntries.length} فاتورة كسطور في السجل اليومي وحفظها بنجاح!`);
  };

  // حفظ الفاتورة
  const handleSaveInvoice = async () => {
    // 1. التحقق من أن اسم العميل ثنائي على الأقل
    const nameParts = (invoiceData.customerName || '').trim().split(/\s+/).filter(Boolean);
    if (nameParts.length < 2) {
      toast.error('يرجى إدخال اسم العميل ثنائي على الأقل (مثال: محمد أحمد)');
      return;
    }

    // 2. التحقق من أن رقم الهاتف 9 أرقام بعد الكود الدولي
    let phoneDigits = invoiceData.phoneDigits;
    if (!phoneDigits && invoiceData.customerPhone) {
      let raw = String(invoiceData.customerPhone).replace(/\D/g, '');
      if (raw.startsWith('962')) raw = raw.slice(3);
      if (raw.startsWith('0')) raw = raw.slice(1);
      phoneDigits = raw.slice(0, 9);
    }

    if (!phoneDigits || phoneDigits.length !== 9) {
      toast.error('يرجى إدخال رقم هاتف صحيح مكوّن من 9 أرقام بعد كود الدولة (مثال: 791234567)');
      return;
    }

    const countryCode = invoiceData.phoneCountryCode || '+962';
    const finalPayload = {
      ...invoiceData,
      customerPhone: `${countryCode}${phoneDigits}`
    };

    setSaving(true);
    const toastId = toast.loading('جاري حفظ الفاتورة بالفرع...');
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/branches/employee/invoices`, finalPayload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        toast.success(`تم حفظ الفاتورة رقم ${invoiceData.invoiceNumber} بنجاح!`, { id: toastId });
        fetchTodayInvoices();
        // تجهيز الفاتورة التالية
        fetchNextInvoiceNumber();
        setInvoiceData(prev => ({
          ...prev,
          customerName: '',
          customerPhone: '',
          items: [
            { id: 1, type: '', count: '', karat: '925', makerFeeGram: '', gramPrice: '', totalFee: '', priceDinar: '', priceFils: '' },
            { id: 2, type: '', count: '', karat: '925', makerFeeGram: '', gramPrice: '', totalFee: '', priceDinar: '', priceFils: '' },
            { id: 3, type: '', count: '', karat: '925', makerFeeGram: '', gramPrice: '', totalFee: '', priceDinar: '', priceFils: '' },
            { id: 4, type: '', count: '', karat: '925', makerFeeGram: '', gramPrice: '', totalFee: '', priceDinar: '', priceFils: '' },
            { id: 5, type: '', count: '', karat: '925', makerFeeGram: '', gramPrice: '', totalFee: '', priceDinar: '', priceFils: '' },
            { id: 6, type: '', count: '', karat: '925', makerFeeGram: '', gramPrice: '', totalFee: '', priceDinar: '', priceFils: '' },
          ],
          subtotal: '0.000',
          discount: '0.000',
          total: '0.000'
        }));
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'فشل في حفظ الفاتورة', { id: toastId });
    } finally {
      setSaving(false);
    }
  };

  // حفظ واعتماد يدوي للسجل اليومي
  const handleSaveDailyRegister = async () => {
    setSaving(true);
    const toastId = toast.loading('جاري حفظ واعتماد السجل اليومي...');
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/branches/employee/daily-register`, dailyData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        setAutoSaveStatus('saved');
        const now = new Date();
        const timeStr = now.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        setLastAutoSavedTime(timeStr);
        toast.success('تم حفظ وتحديث السجل اليومي للفرع بنجاح!', { id: toastId });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'فشل في حفظ السجل اليومي', { id: toastId });
    } finally {
      setSaving(false);
    }
  };

  // إغلاق السجل اليومي للفرع وإرسال التقرير النهائي للإدارة
  const handleCloseDailyRegister = async () => {
    const isConfirmed = window.confirm(
      "هل أنت متأكد من إنهاء وإغلاق السجل اليومي لليوم؟\n\nسيتم اعتماد كافة الحسابات والمبيعات والمصاريف وإرسال تقرير الإغلاق النهائي تلقائياً إلى بريد الإدارة."
    );
    if (!isConfirmed) return;

    setSaving(true);
    const toastId = toast.loading('جاري إغلاق السجل اليومي وإرسال التقرير للإدارة...');
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/branches/employee/daily-register/close`, dailyData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        setDailyData(res.data.data);
        setAutoSaveStatus('saved');
        const now = new Date();
        const timeStr = now.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        setLastAutoSavedTime(timeStr);
        toast.success('✅ تم إغلاق السجل اليومي بنجاح وإرسال التقرير النهائي لبريد الإدارة!', { id: toastId, duration: 5000 });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'فشل في إغلاق السجل اليومي', { id: toastId });
    } finally {
      setSaving(false);
    }
  };

  // حسابات ترقيم فواتير اليوم
  const totalInvoicesPages = Math.ceil(todayInvoices.length / itemsPerPageInvoices) || 1;
  const startInvoicesIdx = (currentPageInvoices - 1) * itemsPerPageInvoices;
  const paginatedInvoices = todayInvoices.slice(startInvoicesIdx, startInvoicesIdx + itemsPerPageInvoices);

  // حسابات ترقيم سلف الموظف
  const totalAdvancesPages = Math.ceil(advances.length / itemsPerPageAdvances) || 1;
  const startAdvancesIdx = (currentPageAdvances - 1) * itemsPerPageAdvances;
  const paginatedAdvances = advances.slice(startAdvancesIdx, startAdvancesIdx + itemsPerPageAdvances);

  // حسابات ترقيم سجل الحضور والدوام
  const totalAttendancePages = Math.ceil(attendances.length / itemsPerPageAttendance) || 1;
  const startAttendanceIdx = (currentPageAttendance - 1) * itemsPerPageAttendance;
  const paginatedAttendances = attendances.slice(startAttendanceIdx, startAttendanceIdx + itemsPerPageAttendance);

  // مكون ترقيم الصفحات المشترك
  const renderPagination = (currentPage, totalPages, totalItems, itemsPerPage, setItemsPerPage, setCurrentPage, unitLabel = "سجل") => {
    if (totalItems <= 0) return null;
    const startItem = Math.min((currentPage - 1) * itemsPerPage + 1, totalItems);
    const endItem = Math.min(currentPage * itemsPerPage, totalItems);

    const getPageNumbers = () => {
      const pages = [];
      const maxVisible = 5;
      if (totalPages <= maxVisible) {
        for (let i = 1; i <= totalPages; i++) pages.push(i);
      } else {
        if (currentPage <= 3) {
          pages.push(1, 2, 3, 4, '...', totalPages);
        } else if (currentPage >= totalPages - 2) {
          pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
        } else {
          pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
        }
      }
      return pages;
    };

    return (
      <div className="p-4 border-t border-slate-200 bg-slate-50 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs select-none">
        <div className="flex flex-wrap items-center gap-3 text-slate-500 font-medium">
          <span>
            عرض <strong className="text-slate-900 font-mono">{startItem}</strong> إلى <strong className="text-slate-900 font-mono">{endItem}</strong> من إجمالي <strong className="text-slate-900 font-mono">{totalItems}</strong> {unitLabel}
          </span>
          <div className="flex items-center gap-1.5 border-r border-slate-200 pr-3">
            <span>لكل صفحة:</span>
            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="bg-white border border-slate-200 rounded-lg px-2 py-1 font-mono font-bold text-slate-800 focus:outline-none"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="p-2 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            title="الصفحة السابقة"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-1">
            {getPageNumbers().map((p, idx) => (
              p === '...' ? (
                <span key={`dots-${idx}`} className="px-2 py-1 text-slate-400 font-mono">...</span>
              ) : (
                <button
                  key={p}
                  onClick={() => setCurrentPage(p)}
                  className={`min-w-[32px] h-8 rounded-xl font-mono text-xs font-bold transition-all ${
                    currentPage === p
                      ? 'bg-slate-900 text-white shadow-sm'
                      : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {p}
                </button>
              )
            ))}
          </div>

          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="p-2 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            title="الصفحة التالية"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-[#f1f5f9] text-slate-900 font-cairo" dir="rtl">
      
      {/* الشريط العلوي لموظف الفرع (يختفي عند الطباعة) */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm print:hidden">
        <div className=" mx-auto  sm:px-6 py-3.5 flex items-center justify-between gap-4">
          
          {/* معلومات الفرع والشعار */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-slate-900 flex items-center justify-center p-2 shadow">
              <img src={imgLogo} alt="Logo" className="w-full h-full object-contain" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-black text-slate-900 leading-tight">
                  {branch.name || 'فرع النخبة'}
                </h1>
              </div>
            </div>
          </div>

          {/* التبويبات اليومية المحددة لموظف الفرع (حاجتين يومياً: فاتورة + سجل يومي) */}
          <div className="hidden md:flex items-center gap-1 bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
            <button
              onClick={() => setActiveTab('invoice')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition-all ${
                activeTab === 'invoice'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileText className="w-4 h-4 text-emerald-600" />
              <span>إصدار فاتورة</span>
            </button>

            <button
              onClick={() => setActiveTab('daily')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition-all ${
                activeTab === 'daily'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <BookOpen className="w-4 h-4 text-indigo-600" />
              <span>السجل اليومي</span>
            </button>

            <button
              onClick={() => setActiveTab('attendance')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition-all ${
                activeTab === 'attendance'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <CalendarCheck className="w-4 h-4 text-teal-600" />
              <span>سجل الدوام والحضور</span>
            </button>

            <button
              onClick={() => setActiveTab('advances')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition-all ${
                activeTab === 'advances'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Coins className="w-4 h-4 text-amber-500" />
              <span>سلف الموظف ({advances.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('history')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition-all ${
                activeTab === 'history'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ListOrdered className="w-4 h-4 text-slate-600" />
              <span>فواتير اليوم ({todayInvoices.length})</span>
            </button>
          </div>

          {/* شارة حالة الدوام اليومية اللحظية للموظف */}
          {todayAttendance?.checkInTime && (
            <div className="hidden xl:flex items-center gap-2 bg-teal-50 border border-teal-200 px-3 py-1 rounded-2xl text-xs font-bold text-teal-900">
              <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse"></span>
              <span>حضورك اليوم: <strong className="font-mono text-teal-950">{todayAttendance.checkInTime}</strong></span>
              {todayAttendance.checkOutTime ? (
                <span className="text-slate-500 font-mono text-[11px] border-r border-teal-200 pr-2 mr-1">
                  انصراف: {todayAttendance.checkOutTime} ({todayAttendance.totalHours} س)
                </span>
              ) : (
                <span className="text-teal-600 text-[10px] font-normal border-r border-teal-200 pr-1 mr-1">
                  (قيد الدوام)
                </span>
              )}
            </div>
          )}

          {/* بيانات الموظف وزر الخروج */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex flex-col text-left">
              <span className="text-xs font-black text-slate-900">{employee.name || 'موظف الفرع'}</span>
              <span className="text-[10px] font-mono text-slate-400">{employee.username}</span>
            </div>
            
            <button
              onClick={handleLogout}
              title="تسجيل الخروج من الفرع"
              className="p-2.5 rounded-xl text-rose-600 hover:bg-rose-50 border border-rose-200 text-xs font-bold transition-all flex items-center gap-1.5"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">خروج</span>
            </button>
          </div>
        </div>

        {/* التبويبات على الهاتف */}
        <div className="md:hidden flex items-center justify-around border-t border-slate-200 p-2 bg-slate-50 overflow-x-auto">
          <button
            onClick={() => setActiveTab('invoice')}
            className={`flex-1 py-1.5 px-1 text-center text-xs font-bold rounded-lg whitespace-nowrap ${
              activeTab === 'invoice' ? 'bg-white shadow text-slate-900' : 'text-slate-600'
            }`}
          >
            إصدار فاتورة
          </button>
          <button
            onClick={() => setActiveTab('daily')}
            className={`flex-1 py-1.5 px-1 text-center text-xs font-bold rounded-lg whitespace-nowrap ${
              activeTab === 'daily' ? 'bg-white shadow text-slate-900' : 'text-slate-600'
            }`}
          >
            السجل اليومي
          </button>
          <button
            onClick={() => setActiveTab('attendance')}
            className={`flex-1 py-1.5 px-1 text-center text-xs font-bold rounded-lg whitespace-nowrap ${
              activeTab === 'attendance' ? 'bg-white shadow text-slate-900' : 'text-slate-600'
            }`}
          >
            الدوام والحضور
          </button>
          <button
            onClick={() => setActiveTab('advances')}
            className={`flex-1 py-1.5 px-1 text-center text-xs font-bold rounded-lg whitespace-nowrap ${
              activeTab === 'advances' ? 'bg-white shadow text-slate-900' : 'text-slate-600'
            }`}
          >
            السلف
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`flex-1 py-1.5 px-1 text-center text-xs font-bold rounded-lg whitespace-nowrap ${
              activeTab === 'history' ? 'bg-white shadow text-slate-900' : 'text-slate-600'
            }`}
          >
            فواتير اليوم
          </button>
        </div>
      </header>

      {/* المحتوى الرئيسي */}
      <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        
        {/* التبويب 1: إصدار فاتورة (مطابقة للصورة 2) */}
        {activeTab === 'invoice' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 print:hidden">
              <div>
                <h2 className="text-lg font-black text-slate-900">إصدار فاتورة بيع جديدة</h2>
                <p className="text-xs text-slate-500">
                  الفاتورة مطابقة لدفتر فواتير ELITE SILVER 925 الورقي، يمكنك الكتابة في أي خانة ثم الحفظ أو الطباعة.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    fetchNextInvoiceNumber();
                    setInvoiceData(prev => ({
                      ...prev,
                      customerName: '',
                      customerPhone: '',
                      items: [
                        { id: 1, type: '', count: '', karat: '925', makerFeeGram: '', gramPrice: '', totalFee: '', priceDinar: '', priceFils: '' },
                        { id: 2, type: '', count: '', karat: '925', makerFeeGram: '', gramPrice: '', totalFee: '', priceDinar: '', priceFils: '' },
                        { id: 3, type: '', count: '', karat: '925', makerFeeGram: '', gramPrice: '', totalFee: '', priceDinar: '', priceFils: '' },
                        { id: 4, type: '', count: '', karat: '925', makerFeeGram: '', gramPrice: '', totalFee: '', priceDinar: '', priceFils: '' },
                        { id: 5, type: '', count: '', karat: '925', makerFeeGram: '', gramPrice: '', totalFee: '', priceDinar: '', priceFils: '' },
                        { id: 6, type: '', count: '', karat: '925', makerFeeGram: '', gramPrice: '', totalFee: '', priceDinar: '', priceFils: '' },
                      ],
                      subtotal: '0.000',
                      discount: '0.000',
                      total: '0.000'
                    }));
                    toast.success('تم تصفير النموذج لإنشاء فاتورة جديدة');
                  }}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center gap-1.5 border border-slate-200"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>فاتورة فارغة جديدة</span>
                </button>
              </div>
            </div>

            <InvoiceDocument
              invoiceData={invoiceData}
              onChange={setInvoiceData}
              onPrint={handlePrint}
              onSave={handleSaveInvoice}
              saving={saving}
            />
          </div>
        )}

        {/* التبويب 2: السجل اليومي للفرع (مطابق للصورة 1) */}
        {activeTab === 'daily' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 print:hidden">
              <div>
                <h2 className="text-lg font-black text-slate-900">سجل عمليات اليوم للفرع</h2>
                <p className="text-xs text-slate-500">
                  السجل اليومي مطابق لدفتر الحسابات اليومي الرسمي، يقوم باحتساب المبيعات والمصاريف وصافي اليوم تلقائياً.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={fetchTodayDailyRegister}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center gap-1.5 border border-slate-200"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>تحديث السجل</span>
                </button>
              </div>
            </div>

            <DailySheetDocument
              registerData={dailyData}
              onChange={handleDailyDataChange}
              onPrint={handlePrint}
              onSave={handleSaveDailyRegister}
              onCloseRegister={handleCloseDailyRegister}
              saving={saving}
              autoSaveStatus={autoSaveStatus}
              lastAutoSavedTime={lastAutoSavedTime}
              onImportTodayInvoices={handleImportTodayInvoices}
            />
          </div>
        )}

        {/* التبويب 3: أرشيف فواتير اليوم */}
        {activeTab === 'history' && (
          <div className="space-y-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm print:hidden">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-xl font-black text-slate-900">سجل فواتير اليوم</h2>
                <p className="text-xs text-slate-500">
                  جميع الفواتير التي تم إصدارها اليوم في {branch.name}
                </p>
              </div>

              <button
                onClick={fetchTodayInvoices}
                className="px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100 text-slate-700 hover:bg-slate-200 flex items-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>تحديث</span>
              </button>
            </div>

            {loadingHistory ? (
              <div className="py-12 text-center text-slate-400 font-mono text-sm">
                جاري تحميل فواتير اليوم...
              </div>
            ) : todayInvoices.length === 0 ? (
              <div className="py-16 text-center text-slate-400 space-y-2">
                <FileText className="w-12 h-12 mx-auto opacity-30 text-slate-500" />
                <p className="font-bold text-slate-700">لا توجد فواتير صادرة اليوم حتى الآن</p>
                <p className="text-xs">اضغط على زر "إصدار فاتورة" للبدء في كتابة أول فاتورة اليوم</p>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                <table className="w-full text-right text-xs">
                  <thead>
                    <tr className="bg-slate-50 text-slate-700 border-b border-slate-200 font-black">
                      <th className="p-3">رقم الفاتورة</th>
                      <th className="p-3">نوع الفاتورة</th>
                      <th className="p-3">اسم المشتري</th>
                      <th className="p-3">الهاتف</th>
                      <th className="p-3">عدد الأصناف</th>
                      <th className="p-3">المجموع</th>
                      <th className="p-3">الخصم</th>
                      <th className="p-3">الإجمالي الصافي</th>
                      <th className="p-3 text-center">إجراءات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {paginatedInvoices.map((inv) => {
                      let invoiceItems = inv.items;
                      if (typeof invoiceItems === 'string') {
                        try { invoiceItems = JSON.parse(invoiceItems); } catch (e) { invoiceItems = []; }
                      }
                      const validCount = Array.isArray(invoiceItems)
                        ? invoiceItems.filter(i => i && i.type).length
                        : 0;

                      return (
                        <tr key={inv.id} className="hover:bg-slate-50 transition-colors">
                          <td className="p-3 font-mono font-black text-rose-600">{inv.invoiceNumber}</td>
                          <td className="p-3">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              inv.paymentType === 'نقدي' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                            }`}>
                              {inv.paymentType}
                            </span>
                          </td>
                          <td className="p-3 font-bold text-slate-900">{inv.customerName || 'عميل نقدي'}</td>
                          <td className="p-3 font-mono">{inv.customerPhone || '—'}</td>
                          <td className="p-3 font-mono">{validCount}</td>
                          <td className="p-3 font-mono font-bold">{inv.subtotal} د.أ</td>
                          <td className="p-3 font-mono text-slate-500">{inv.discount} د.أ</td>
                          <td className="p-3 font-mono font-black text-slate-900 text-sm">{inv.total} د.أ</td>
                          <td className="p-3 text-center">
                            <button
                              onClick={() => {
                                setInvoiceData({
                                  ...inv,
                                  items: Array.isArray(invoiceItems) ? invoiceItems : []
                                });
                                setActiveTab('invoice');
                              }}
                              className="px-3 py-1 bg-slate-900 text-white rounded-lg text-xs font-bold hover:bg-slate-800"
                            >
                              عرض وطباعة
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              {renderPagination(currentPageInvoices, totalInvoicesPages, todayInvoices.length, itemsPerPageInvoices, setItemsPerPageInvoices, setCurrentPageInvoices, "فاتورة")}
            </>
            )}
          </div>
        )}

        {/* التبويب 3: سجل الحضور والانصراف والدوام الشهري للموظف */}
        {activeTab === 'attendance' && (
          <div className="space-y-6 print:hidden">
            {/* بطاقات الإحصائيات الشهرية واليومية للدوام */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* بطاقة دوام اليوم اللحظي */}
              <div className="bg-white p-5 rounded-3xl border border-teal-200 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 left-0 w-2 h-full bg-teal-500"></div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-500">حالة دوام اليوم</span>
                  <span className="w-2.5 h-2.5 rounded-full bg-teal-500 animate-pulse"></span>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-600">وقت الدخول:</span>
                    <span className="font-mono font-black text-teal-900 text-sm">
                      {todayAttendance?.checkInTime || '—'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-600">وقت الانصراف:</span>
                    <span className="font-mono font-bold text-slate-700 text-xs">
                      {todayAttendance?.checkOutTime || 'قيد الدوام حالياً'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                    <span className="text-xs text-slate-600">ساعات اليوم:</span>
                    <span className="font-mono font-black text-xs text-slate-900">
                      {todayAttendance?.totalHours ? `${todayAttendance.totalHours} ساعة` : 'تحسب عند الخروج'}
                    </span>
                  </div>
                </div>
              </div>

              {/* بطاقة إجمالي أيام الحضور */}
              <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-500 block mb-1">أيام الحضور هذا الشهر</span>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-2xl font-black font-mono text-emerald-600">
                      {attendanceSummary.totalDaysAttended || 0}
                    </span>
                    <span className="text-xs text-slate-400 font-bold">يوم عمل</span>
                  </div>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
              </div>

              {/* بطاقة إجمالي ساعات العمل */}
              <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-500 block mb-1">إجمالي ساعات الدوام</span>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-2xl font-black font-mono text-indigo-600">
                      {attendanceSummary.totalWorkedHours || '0.00'}
                    </span>
                    <span className="text-xs text-slate-400 font-bold">ساعة</span>
                  </div>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <Clock className="w-6 h-6" />
                </div>
              </div>

              {/* بطاقة أيام الغياب */}
              <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-500 block mb-1">أيام الغياب المسجلة</span>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-2xl font-black font-mono text-rose-600">
                      {attendanceSummary.totalAbsences || 0}
                    </span>
                    <span className="text-xs text-slate-400 font-bold">يوم غياب</span>
                  </div>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center">
                  <XCircle className="w-6 h-6" />
                </div>
              </div>
            </div>

            {/* تنبيه النظام الآلي للحضور والغياب */}
            <div className="bg-gradient-to-l from-teal-500/10 via-teal-500/5 to-transparent border border-teal-200 p-4 rounded-2xl flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
              <div className="text-xs leading-relaxed text-teal-950 font-medium">
                <strong className="font-black text-teal-900 block mb-0.5">نظام تسجيل الحضور والانصراف الذكي:</strong>
                يتم تسجيل حضورك اليومي تلقائياً فور تسجيل دخولك للنظام. وعند انتهاء فترة عملك، تأكد من الضغط على زر <strong className="text-rose-600">"خروج"</strong> أعلى الشاشة ليتم تسجيل وقت انصرافك بدقة واحتساب إجمالي ساعات العمل تلقائياً وحفظها في سجلك المعتمد لدى الإدارة.
              </div>
            </div>

            {/* جدول سجل الحضور والانصراف */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div>
                  <h2 className="text-lg font-black text-slate-900">سجل دوامي الشهري</h2>
                  <p className="text-xs text-slate-500">
                    مواعيد تسجيل الدخول والخروج المحسوبة لساعات العمل لفرع {branch.name || ''}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={fetchMyAttendance}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>تحديث السجل</span>
                </button>
              </div>

              {loadingAttendance ? (
                <div className="py-16 text-center text-slate-400 font-mono text-sm">
                  جاري تحميل سجل الحضور والانصراف...
                </div>
              ) : attendances.length === 0 ? (
                <div className="py-16 text-center text-slate-400 space-y-2">
                  <CalendarCheck className="w-12 h-12 mx-auto opacity-30 text-teal-600" />
                  <p className="font-bold text-slate-700">لا توجد سجلات حضور مسجلة لهذا الشهر حتى الآن</p>
                  <p className="text-xs">سيظهر حضورك وانصرافك اليومي هنا تلقائياً</p>
                </div>
              ) : (
                <>
                  <div className="overflow-x-auto">
                    <table className="w-full text-right text-xs">
                      <thead>
                        <tr className="bg-slate-50 text-slate-700 border-b border-slate-200 font-black">
                          <th className="p-3.5">التاريخ</th>
                          <th className="p-3.5">اليوم</th>
                          <th className="p-3.5">وقت الحضور (الدخول)</th>
                          <th className="p-3.5">وقت الانصراف (الخروج)</th>
                          <th className="p-3.5">إجمالي ساعات العمل</th>
                          <th className="p-3.5">الحالة</th>
                          <th className="p-3.5">ملاحظات</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {paginatedAttendances.map((att) => (
                          <tr key={att.id} className="hover:bg-slate-50/80 transition-colors">
                            <td className="p-3.5 font-mono font-bold text-slate-900">{att.date}</td>
                            <td className="p-3.5 font-medium text-slate-600">{att.dayName || '—'}</td>
                            <td className="p-3.5 font-mono text-teal-700 font-bold">
                              {att.checkInTime || '—'}
                            </td>
                            <td className="p-3.5 font-mono text-slate-700 font-bold">
                              {att.checkOutTime || (
                                <span className="text-amber-600 font-normal">قيد الدوام</span>
                              )}
                            </td>
                            <td className="p-3.5 font-mono font-black text-slate-900">
                              {att.totalHours ? `${att.totalHours} س` : '—'}
                            </td>
                            <td className="p-3.5">
                              <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                                att.status === 'حاضر'
                                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                                  : att.status === 'غياب'
                                  ? 'bg-rose-100 text-rose-800 border border-rose-200'
                                  : att.status === 'متأخر'
                                  ? 'bg-amber-100 text-amber-800 border border-amber-200'
                                  : 'bg-indigo-100 text-indigo-800 border border-indigo-200'
                              }`}>
                                {att.status === 'حاضر' ? '✅ حاضر' : att.status === 'غياب' ? '❌ غياب' : att.status === 'متأخر' ? '⚠️ متأخر' : att.status}
                              </span>
                            </td>
                            <td className="p-3.5 text-xs text-slate-500">
                              {att.notes || '—'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {renderPagination(
                    currentPageAttendance,
                    totalAttendancePages,
                    attendances.length,
                    itemsPerPageAttendance,
                    setItemsPerPageAttendance,
                    setCurrentPageAttendance,
                    "سجل حضور"
                  )}
                </>
              )}
            </div>
          </div>
        )}

        {/* التبويب 4: سلف الموظف وتقديم طلب سلفة */}
        {activeTab === 'advances' && (
          <div className="space-y-5 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm print:hidden">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
              <div>
                <h2 className="text-xl font-black text-slate-900">سجل طلبات السلف الشخصية</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  تقديم طلب سلفة مالية للإدارة العامة ومتابعة حالة الموافقة والاعتماد
                </p>
              </div>

              <button
                type="button"
                onClick={() => setAdvanceModalOpen(true)}
                className="px-5 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-black transition-all shadow flex items-center gap-2"
              >
                <PlusCircle className="w-4 h-4" />
                <span>تقديم طلب سلفة جديد</span>
              </button>
            </div>

            {loadingAdvances ? (
              <div className="py-16 text-center text-slate-400 font-mono text-sm">
                جاري تحميل طلبات السلف...
              </div>
            ) : advances.length === 0 ? (
              <div className="py-16 text-center text-slate-400 space-y-2">
                <Coins className="w-12 h-12 mx-auto opacity-30 text-amber-500" />
                <p className="font-bold text-slate-700">لا توجد طلبات سلف مسجلة باسمك</p>
                <p className="text-xs">اضغط على زر "تقديم طلب سلفة جديد" لإرسال طلب للإدارة</p>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                <table className="w-full text-right text-xs">
                  <thead>
                    <tr className="bg-slate-50 text-slate-700 border-b border-slate-200 font-black">
                      <th className="p-3.5">تاريخ الطلب</th>
                      <th className="p-3.5">مبلغ السلفة المطلوب</th>
                      <th className="p-3.5">السبب / الملاحظات</th>
                      <th className="p-3.5">حالة الطلب</th>
                      <th className="p-3.5">رد الإدارة والملاحظات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {paginatedAdvances.map((adv) => (
                      <tr key={adv.id} className="hover:bg-slate-50 transition-colors">
                        <td className="p-3.5 font-mono text-slate-600">{adv.requestDate}</td>
                        <td className="p-3.5 font-mono font-black text-slate-950 text-sm">
                          {adv.amount} د.أ
                        </td>
                        <td className="p-3.5 text-slate-700">{adv.reason || '—'}</td>
                        <td className="p-3.5">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                            adv.status === 'معلق'
                              ? 'bg-amber-100 text-amber-800 border border-amber-200'
                              : adv.status === 'مقبول'
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                              : 'bg-rose-100 text-rose-800 border border-rose-200'
                          }`}>
                            {adv.status === 'معلق' ? '⏳ قيد المراجعة' : adv.status === 'مقبول' ? '✅ تمت الموافقة' : '❌ مرفوض'}
                          </span>
                        </td>
                        <td className="p-3.5 text-xs text-slate-500">
                          {adv.adminResponseNotes ? (
                            <span className="font-medium text-slate-800">{adv.adminResponseNotes}</span>
                          ) : adv.status === 'مقبول' ? (
                            'تمت الموافقة من الإدارة'
                          ) : (
                            'بانتظار مراجعة الإدارة'
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {renderPagination(currentPageAdvances, totalAdvancesPages, advances.length, itemsPerPageAdvances, setItemsPerPageAdvances, setCurrentPageAdvances, "طلب سلفة")}
            </>
            )}
          </div>
        )}

        {/* نافذة تقديم طلب سلفة جديد */}
        {advanceModalOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-200 text-right">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <Coins className="w-5 h-5 text-amber-500" />
                  <h3 className="text-lg font-black text-slate-900">طلب سلفة مالية</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setAdvanceModalOpen(false)}
                  className="p-1.5 text-slate-400 hover:text-slate-900 rounded-lg hover:bg-slate-100"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleRequestAdvance} className="space-y-4">
                {/* بطاقة معلومات الراتب والحد المتاح للسلفة */}
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2 text-xs">
                  <div className="flex justify-between items-center text-slate-700">
                    <span className="font-bold">الراتب الشهري المسجل:</span>
                    <span className="font-mono font-black text-slate-900">
                      {employeeSalaryInfo.salary > 0 ? `${employeeSalaryInfo.salary.toFixed(3)} د.أ` : 'غير مسجل لدى الإدارة'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-slate-700">
                    <span className="font-bold">سلف سابقة هذا الشهر:</span>
                    <span className="font-mono font-bold text-amber-700">
                      {employeeSalaryInfo.totalTakenAdvances.toFixed(3)} د.أ
                    </span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-slate-200">
                    <span className="font-black text-slate-900">الحد الأقصى المتاح للسلفة:</span>
                    <span className={`font-mono font-black text-sm ${
                      employeeSalaryInfo.remainingSalary > 0 ? 'text-emerald-700' : 'text-rose-600'
                    }`}>
                      {employeeSalaryInfo.remainingSalary.toFixed(3)} د.أ
                    </span>
                  </div>
                </div>

                {employeeSalaryInfo.salary <= 0 ? (
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-xs font-bold text-center">
                    ⚠️ لم يتم تحديد راتب شهري لحسابك بعد، يرجى مراجعة إدارة الفرع لتسجيل الراتب أولاً لتتمكن من تقديم طلب سلفة.
                  </div>
                ) : employeeSalaryInfo.remainingSalary <= 0 ? (
                  <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-900 text-xs font-bold text-center">
                    ⚠️ لقد استنفدت كامل راتبك المتاح لهذا الشهر في سلف سابقة. لا يمكنك تقديم طلب سلفة جديد هذا الشهر.
                  </div>
                ) : null}

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold text-slate-700">
                      مبلغ السلفة المطلوب (بالدينار الأردني) *
                    </label>
                    {employeeSalaryInfo.remainingSalary > 0 && (
                      <span className="text-[10px] text-slate-400 font-mono">
                        (أقصى حد: {employeeSalaryInfo.remainingSalary.toFixed(3)} د.أ)
                      </span>
                    )}
                  </div>
                  <input
                    type="number"
                    step="any"
                    required
                    min="1"
                    max={employeeSalaryInfo.remainingSalary > 0 ? employeeSalaryInfo.remainingSalary : undefined}
                    disabled={employeeSalaryInfo.salary <= 0 || employeeSalaryInfo.remainingSalary <= 0}
                    placeholder="مثال: 50.000"
                    value={advanceAmount}
                    onChange={(e) => setAdvanceAmount(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-mono font-bold focus:outline-none focus:border-slate-800 disabled:opacity-50"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    سبب طلب السلفة / ملاحظات
                  </label>
                  <textarea
                    rows="3"
                    placeholder="ظرف طارئ، مصاريف شخصية..."
                    value={advanceReason}
                    onChange={(e) => setAdvanceReason(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-medium focus:outline-none focus:border-slate-800"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setAdvanceModalOpen(false)}
                    className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                  >
                    إلغاء
                  </button>
                  <button
                    type="submit"
                    disabled={submittingAdvance || employeeSalaryInfo.salary <= 0 || employeeSalaryInfo.remainingSalary <= 0}
                    className="px-5 py-2 text-xs font-black bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-xl shadow disabled:opacity-50"
                  >
                    {submittingAdvance ? 'جاري الإرسال...' : 'إرسال الطلب للإدارة'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </main>

      {/* تنسيقات الطباعة الصارمة للـ A4 الورقي */}
      <style>{`
        @media print {
          body {
            background: #ffffff !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          header, button, .print\\:hidden {
            display: none !important;
          }
          .invoice-paper-sheet, .daily-sheet-paper {
            border: none !important;
            box-shadow: none !important;
            width: 100% !important;
            max-width: 100% !important;
            padding: 10px !important;
          }
        }
      `}</style>
    </div>
  );
}

export default BranchPortal;
