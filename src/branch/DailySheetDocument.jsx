import React, { useState, useEffect } from 'react';
import { CheckCircle2, RefreshCw, Download, Trash2, Clock, AlertTriangle, Lock } from 'lucide-react';

/**
 * مكون السجل اليومي لمصوغات ELITE SILVER 925
 * تصميم مطابق بدقة للدفتر الورقي الأصلي (الصورة رقم 1)
 */
function DailySheetDocument({
  registerData = {},
  onChange,
  readOnly = false,
  onPrint,
  onSave,
  onCloseRegister = null,
  saving = false,
  autoSaveStatus = '',
  lastAutoSavedTime = null,
  onImportTodayInvoices = null
}) {
  const safeData = registerData || {};

  const parseEntries = (raw) => {
    if (Array.isArray(raw)) return raw;
    if (typeof raw === 'string') {
      try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) return parsed;
      } catch (e) {
        return [];
      }
    }
    return [];
  };

  const parsedEntries = parseEntries(safeData.entries);
  const defaultEntries = [
    { id: 1, clientPhone: '', clientName: '', weightAndDetails: '', expenses: '', expenseDetails: '', sales: '', isVisa: false },
    { id: 2, clientPhone: '', clientName: '', weightAndDetails: '', expenses: '', expenseDetails: '', sales: '', isVisa: false },
    { id: 3, clientPhone: '', clientName: '', weightAndDetails: '', expenses: '', expenseDetails: '', sales: '', isVisa: false },
    { id: 4, clientPhone: '', clientName: '', weightAndDetails: '', expenses: '', expenseDetails: '', sales: '', isVisa: false },
    { id: 5, clientPhone: '', clientName: '', weightAndDetails: '', expenses: '', expenseDetails: '', sales: '', isVisa: false },
    { id: 6, clientPhone: '', clientName: '', weightAndDetails: '', expenses: '', expenseDetails: '', sales: '', isVisa: false },
    { id: 7, clientPhone: '', clientName: '', weightAndDetails: '', expenses: '', expenseDetails: '', sales: '', isVisa: false },
    { id: 8, clientPhone: '', clientName: '', weightAndDetails: '', expenses: '', expenseDetails: '', sales: '', isVisa: false },
    { id: 9, clientPhone: '', clientName: '', weightAndDetails: '', expenses: '', expenseDetails: '', sales: '', isVisa: false },
    { id: 10, clientPhone: '', clientName: '', weightAndDetails: '', expenses: '', expenseDetails: '', sales: '', isVisa: false },
  ];

  const entries = parsedEntries.length > 0 ? parsedEntries : (readOnly ? [] : defaultEntries);

  // حساب الوقت المتبقي لموعد إغلاق السجل اليومي (11:59 مساءً)
  const calculateRemainingTime = () => {
    const now = new Date();
    const closingTime = new Date();
    closingTime.setHours(23, 59, 0, 0); // الساعة 11:59 مساءً موعد إغلاق الدوام

    const diff = closingTime.getTime() - now.getTime();
    if (diff <= 0) {
      return {
        isClosed: true,
        hours: 0,
        minutes: 0,
        timeString: '0 دقيقة',
        isUrgent: true
      };
    }

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    let hoursText = '';
    if (hours === 1) hoursText = 'ساعة واحدة';
    else if (hours === 2) hoursText = 'ساعتان';
    else if (hours >= 3 && hours <= 10) hoursText = `${hours} ساعات`;
    else if (hours > 10) hoursText = `${hours} ساعة`;

    let minutesText = '';
    if (minutes === 1) minutesText = 'دقيقة واحدة';
    else if (minutes === 2) minutesText = 'دقيقتان';
    else if (minutes >= 3 && minutes <= 10) minutesText = `${minutes} دقائق`;
    else if (minutes > 10) minutesText = `${minutes} دقيقة`;

    let timeString = '';
    if (hours > 0 && minutes > 0) {
      timeString = `${hoursText} و ${minutesText}`;
    } else if (hours > 0) {
      timeString = hoursText;
    } else {
      timeString = minutesText || 'أقل من دقيقة';
    }

    return {
      isClosed: false,
      hours,
      minutes,
      timeString,
      isUrgent: hours < 2
    };
  };

  const [timeLeft, setTimeLeft] = useState(() => calculateRemainingTime());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateRemainingTime());
    }, 30000);
    return () => clearInterval(timer);
  }, []);

  const dayName = safeData.dayName || '';
  const date = safeData.date || new Date().toISOString().split('T')[0];
  const totalGrams = safeData.totalGrams !== undefined ? safeData.totalGrams : '0.000';
  const totalSales = safeData.totalSales !== undefined ? safeData.totalSales : '0.000';
  const totalExpenses = safeData.totalExpenses !== undefined ? safeData.totalExpenses : '0.000';
  const totalVisaSales = safeData.totalVisaSales !== undefined ? safeData.totalVisaSales : '0.000';
  const netTotal = safeData.netTotal !== undefined ? safeData.netTotal : '0.000';
  const totalAdvances = safeData.totalAdvances !== undefined ? safeData.totalAdvances : '0.000';
  const brokenSilverGrams = safeData.brokenSilverGrams !== undefined ? safeData.brokenSilverGrams : '0.000';
  const brokenGoldGrams = safeData.brokenGoldGrams !== undefined ? safeData.brokenGoldGrams : '0.000';

  const daysOfWeek = ['السبت', 'الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة'];

  const recalculate = (newEntries, overrides = {}) => {
    let salesSum = 0;
    let expSum = 0;
    let visaSum = 0;

    newEntries.forEach(item => {
      const s = parseFloat(item.sales) || 0;
      const e = parseFloat(item.expenses) || 0;
      salesSum += s;
      expSum += e;
      if (item.isVisa) {
        visaSum += s;
      }
    });

    const net = (salesSum - expSum).toFixed(3);

    return {
      totalSales: salesSum.toFixed(3),
      totalExpenses: expSum.toFixed(3),
      totalVisaSales: visaSum.toFixed(3),
      netTotal: net,
      ...overrides
    };
  };

  const handleEntryChange = (index, field, value) => {
    if (readOnly || !onChange) return;
    const newEntries = [...entries];
    newEntries[index] = {
      ...newEntries[index],
      [field]: value
    };

    const calcs = recalculate(newEntries);
    onChange({
      ...safeData,
      entries: newEntries,
      ...calcs
    });
  };

  const handleFieldChange = (field, value) => {
    if (readOnly || !onChange) return;
    onChange({
      ...safeData,
      [field]: value
    });
  };

  const addRow = () => {
    if (readOnly || !onChange) return;
    const newEntries = [
      ...entries,
      { id: Date.now(), clientPhone: '', clientName: '', weightAndDetails: '', expenses: '', expenseDetails: '', sales: '', isVisa: false }
    ];
    onChange({
      ...safeData,
      entries: newEntries
    });
  };

  const removeRow = (index) => {
    if (readOnly || !onChange) return;
    const newEntries = entries.filter((_, i) => i !== index);
    const calcs = recalculate(newEntries);
    onChange({
      ...safeData,
      entries: newEntries,
      ...calcs
    });
  };

  return (
    <div className="w-full flex flex-col items-center">
      {/* شريط الإجراءات والتحكم (يختفي عند الطباعة) */}
      {!readOnly && (
        <div className="w-full max-w-[950px] mb-4 flex flex-wrap items-center justify-between gap-3 p-3 bg-white rounded-2xl border border-slate-200 shadow-sm print:hidden">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-slate-500">اختر اليوم:</span>
            <select
              value={dayName}
              onChange={(e) => handleFieldChange('dayName', e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-800 focus:outline-none"
            >
              <option value="">-- اليوم --</option>
              {daysOfWeek.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>

            {/* مؤشر الحفظ التلقائي Live Indicator */}
            {autoSaveStatus === 'saving' && (
              <span className="text-[11px] font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-xl border border-amber-200 flex items-center gap-1.5 animate-pulse">
                <RefreshCw className="w-3 h-3 animate-spin text-amber-600" />
                <span>جاري الحفظ تلقائياً...</span>
              </span>
            )}
            {autoSaveStatus === 'saved' && (
              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-xl border border-emerald-200 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>محفوظ تلقائياً {lastAutoSavedTime ? `(${lastAutoSavedTime})` : ''}</span>
              </span>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {onImportTodayInvoices && (
              <button
                type="button"
                onClick={onImportTodayInvoices}
                className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200 flex items-center gap-1.5 shadow-sm transition-all"
                title="جلب جميع فواتير اليوم الصادرة وتحويلها إلى سطور في السجل تلقائياً"
              >
                <Download className="w-3.5 h-3.5" />
                <span>جلب سطور فواتير اليوم</span>
              </button>
            )}

            <button
              type="button"
              onClick={addRow}
              className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200"
            >
              + إضافة سطر
            </button>
            {onPrint && (
              <button
                type="button"
                onClick={onPrint}
                className="px-4 py-1.5 rounded-xl text-xs font-bold bg-slate-800 text-white hover:bg-slate-900 shadow"
              >
                🖨️ طباعة السجل
              </button>
            )}
            {onSave && (
              <button
                type="button"
                onClick={onSave}
                disabled={saving}
                className="px-5 py-1.5 rounded-xl text-xs font-black bg-emerald-600 text-white hover:bg-emerald-700 shadow disabled:opacity-50"
              >
                {saving ? 'جاري الحفظ...' : '💾 حفظ واعتماد'}
              </button>
            )}
            {onCloseRegister && safeData.status !== 'مغلق' && (
              <button
                type="button"
                onClick={onCloseRegister}
                disabled={saving}
                className="px-4 py-1.5 rounded-xl text-xs font-black bg-rose-600 text-white hover:bg-rose-700 shadow flex items-center gap-1.5 disabled:opacity-50 transition-all"
                title="إغلاق السجل اليومي رسمياً وإرسال التقرير النهائي للإدارة"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>🔒 إغلاق السجل لليوم</span>
              </button>
            )}
            {safeData.status === 'مغلق' && (
              <span className="px-3 py-1.5 rounded-xl text-xs font-black bg-slate-900 text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5 shadow">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>تم إغلاق السجل لليوم (التقرير مرسل للإدارة)</span>
              </span>
            )}
          </div>
        </div>
      )}

      {/* تنبيه الوقت المتبقي لإغلاق السجل اليومي (يختفي عند الطباعة) */}
      <div className="w-full max-w-[950px] mb-4 print:hidden">
        {timeLeft.isClosed ? (
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3.5 bg-rose-50 border-2 border-rose-300 rounded-2xl text-rose-900 shadow-sm animate-pulse">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-rose-200 text-rose-800 rounded-xl flex-shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-black text-rose-950">
                  ⚠️ انتهى وقت الدوام الرسمي لليوم (الساعة 11:59 مساءً)
                </p>
                <p className="text-[11px] text-rose-800 font-medium mt-0.5">
                  يرجى التأكد من استكمال كافة عمليات وحسابات اليوم واعتماد وإغلاق السجل اليومي لإرسال التقرير للإدارة.
                </p>
              </div>
            </div>
            {onCloseRegister ? (
              <button
                type="button"
                onClick={onCloseRegister}
                disabled={saving}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-black rounded-xl shadow whitespace-nowrap self-end sm:self-auto flex items-center gap-1.5"
              >
                <Lock className="w-4 h-4" />
                <span>اعتماد وإغلاق السجل وإرسال التقرير</span>
              </button>
            ) : onSave ? (
              <button
                type="button"
                onClick={onSave}
                disabled={saving}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-black rounded-xl shadow whitespace-nowrap self-end sm:self-auto"
              >
                💾 اعتماد وإغلاق السجل الآن
              </button>
            ) : null}
          </div>
        ) : (
          <div className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3.5 rounded-2xl border shadow-sm transition-all ${timeLeft.isUrgent
              ? 'bg-amber-50/90 border-amber-300 text-amber-950'
              : 'bg-indigo-50/70 border-indigo-200 text-indigo-950'
            }`}>
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-xl flex-shrink-0 ${timeLeft.isUrgent ? 'bg-amber-200 text-amber-900' : 'bg-indigo-200/80 text-indigo-800'
                }`}>
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-black">
                    ⏰ موعد إغلاق السجل اليومي (11:59 م):
                  </span>
                  <span className={`text-xs font-black px-2.5 py-0.5 rounded-lg font-mono ${timeLeft.isUrgent
                      ? 'bg-amber-200 text-amber-950 border border-amber-300'
                      : 'bg-indigo-200/80 text-indigo-950 border border-indigo-300/50'
                    }`}>
                    متبقي {timeLeft.timeString}
                  </span>
                </div>
                <p className={`text-[11px] mt-0.5 ${timeLeft.isUrgent ? 'text-amber-800 font-semibold' : 'text-indigo-700'
                  }`}>
                  يتم إغلاق واعتماد حسابات اليوم عند انتهاء دوام الفرع (الساعة 11:00 مساءً).
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-600 bg-white/90 px-3 py-1.5 rounded-xl border border-slate-200/80 self-end sm:self-auto">
              <Lock className="w-3.5 h-3.5 text-slate-500" />
              <span>تاريخ السجل ثابت: <span className="font-mono font-black text-slate-900">{date}</span></span>
            </div>
          </div>
        )}
      </div>

      {/* ورقة السجل اليومي الرسمية (A4 Format) - مطابقة للصورة رقم 1 */}
      <div
        id="daily-sheet-paper"
        className="daily-sheet-paper bg-white text-slate-900 w-full max-w-[950px] p-6 sm:p-10 border-2 border-slate-800 shadow-2xl relative font-cairo print:p-4 print:border-none print:shadow-none print:w-full print:max-w-none"
        dir="rtl"
        style={{ minHeight: '1050px' }}
      >
        {/* ترويسة السجل اليومي (الصورة 1) */}
        <div className="flex items-center justify-between border-b-2 border-slate-900 pb-4 mb-4">
          {/* يمين: اليوم */}
          <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
            <span>اليوم:</span>
            {readOnly ? (
              <span className="border-b border-slate-800 min-w-[100px] text-center pb-0.5">{dayName || '—'}</span>
            ) : (
              <input
                type="text"
                value={dayName}
                placeholder="السبت، الأحد..."
                onChange={(e) => handleFieldChange('dayName', e.target.value)}
                className="border-b border-slate-800 bg-transparent min-w-[100px] text-center text-xs font-bold focus:outline-none pb-0.5"
              />
            )}
          </div>

          {/* منتصف: شعار ELITE SILVER 925 */}
          <div className="text-center flex flex-col items-center">
            <div className="flex items-center gap-2">
              <h1 className="text-4xl font-black tracking-widest text-slate-950 font-serif">
                ELITƎ
              </h1>
            </div>
            <p> SILVER 925</p>

            <span className="text-[10px] font-mono tracking-wider text-slate-500 uppercase mt-0.5">
              Daily Register • السجل اليومي
            </span>
          </div>

          {/* يسار: التاريخ (ثابت لا يمكن تغييره) */}
          <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
            <span>التاريخ:</span>
            <span className="font-mono border-b border-slate-800 min-w-[110px] text-center pb-0.5 font-bold text-slate-900 inline-flex items-center justify-center gap-1.5 bg-slate-50/50 px-2 rounded" title="تاريخ السجل ثابت ومحمي ولا يمكن تعديله">
              <span>{date}</span>
              <Lock className="w-3 h-3 text-slate-400 print:hidden" />
            </span>
          </div>
        </div>

        {/* الجدول الرئيسي للعمليات اليومية (مطابق بدقة لأعمدة الصورة رقم 1) */}
        <div className="overflow-x-auto mb-6">
          <table className="w-full border-collapse border-2 border-slate-900 text-center text-xs">
            <thead>
              <tr className="bg-slate-100 text-slate-900 font-black border-b-2 border-slate-900">
                <th className="border-r border-slate-900 p-2 w-28">مبيعات</th>
                <th className="border-r border-slate-900 p-2 w-24">المصاريف</th>
                <th className="border-r border-slate-900 p-2 text-right w-44">تفاصيل المصاريف</th>
                <th className="border-r border-slate-900 p-2 text-right">الوزن + التفاصيل</th>
                <th className="border-r border-slate-900 p-2 w-36 text-right">اسم العميل</th>
                <th className="p-2 w-32">رقم العميل</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((row, idx) => (
                <tr key={row.id || idx} className="border-b border-slate-400 hover:bg-slate-50/50">
                  {/* مبيعات */}
                  <td className="border-r border-slate-900 p-1.5 bg-emerald-50/20">
                    {readOnly ? (
                      <span className="font-mono font-bold">{row.sales || '—'}</span>
                    ) : (
                      <div className="flex items-center justify-between gap-1">
                        <input
                          type="number"
                          step="any"
                          value={row.sales}
                          placeholder="0"
                          onChange={(e) => handleEntryChange(idx, 'sales', e.target.value)}
                          className="w-full text-center bg-transparent border-none focus:outline-none text-xs font-mono font-bold p-0"
                        />
                        <button
                          type="button"
                          title="تحديد كمبيعات فيزا"
                          onClick={() => handleEntryChange(idx, 'isVisa', !row.isVisa)}
                          className={`text-[9px] px-1 py-0.5 rounded font-mono font-bold border transition-all ${row.isVisa
                              ? 'bg-indigo-600 text-white border-indigo-700'
                              : 'bg-slate-100 text-slate-400 border-slate-200 hover:text-slate-700'
                            }`}
                        >
                          {row.isVisa ? 'فيزا' : 'نقد'}
                        </button>
                      </div>
                    )}
                  </td>

                  {/* المصاريف */}
                  <td className="border-r border-slate-900 p-1.5 bg-rose-50/20">
                    {readOnly ? (
                      <span className="font-mono text-rose-700 font-bold">{row.expenses || '—'}</span>
                    ) : (
                      <input
                        type="number"
                        step="any"
                        value={row.expenses}
                        placeholder="0"
                        onChange={(e) => handleEntryChange(idx, 'expenses', e.target.value)}
                        className="w-full text-center bg-transparent border-none focus:outline-none text-xs font-mono font-bold p-0 text-rose-700"
                      />
                    )}
                  </td>

                  {/* تفاصيل المصاريف */}
                  <td className="border-r border-slate-900 p-1.5 text-right bg-rose-50/10">
                    {readOnly ? (
                      <span className="font-semibold text-slate-700">{row.expenseDetails || '—'}</span>
                    ) : (
                      <input
                        type="text"
                        value={row.expenseDetails || ''}
                        placeholder="تفاصيل المصروف..."
                        onChange={(e) => handleEntryChange(idx, 'expenseDetails', e.target.value)}
                        className="w-full bg-transparent border-none focus:outline-none text-xs font-semibold p-0 text-slate-800 placeholder:text-slate-300"
                      />
                    )}
                  </td>

                  {/* الوزن + التفاصيل */}
                  <td className="border-r border-slate-900 p-1.5 text-right">
                    {readOnly ? (
                      <span className="font-semibold">{row.weightAndDetails || '—'}</span>
                    ) : (
                      <input
                        type="text"
                        value={row.weightAndDetails}
                        placeholder="الوزن، نوع القطعة، التفاصيل..."
                        onChange={(e) => handleEntryChange(idx, 'weightAndDetails', e.target.value)}
                        className="w-full bg-transparent border-none focus:outline-none text-xs font-semibold p-0"
                      />
                    )}
                  </td>

                  {/* اسم العميل */}
                  <td className="border-r border-slate-900 p-1.5 text-right">
                    {readOnly ? (
                      <span className="font-bold">{row.clientName || '—'}</span>
                    ) : (
                      <input
                        type="text"
                        value={row.clientName}
                        placeholder="اسم العميل..."
                        onChange={(e) => handleEntryChange(idx, 'clientName', e.target.value)}
                        className="w-full bg-transparent border-none focus:outline-none text-xs font-bold p-0"
                      />
                    )}
                  </td>

                  {/* رقم العميل */}
                  <td className="p-1.5 relative group">
                    {readOnly ? (
                      <span className="font-mono">{row.clientPhone || '—'}</span>
                    ) : (
                      <div className="flex items-center gap-1">
                        <input
                          type="text"
                          value={row.clientPhone}
                          placeholder="07XXXXXXXX"
                          onChange={(e) => handleEntryChange(idx, 'clientPhone', e.target.value)}
                          className="w-full text-center bg-transparent border-none focus:outline-none text-xs font-mono p-0"
                        />
                        {entries.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeRow(idx)}
                            className="text-slate-300 hover:text-rose-600 p-0.5 rounded transition-colors print:hidden"
                            title="حذف هذا السطر"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* الجداول الحسابية والملخص في الأسفل (مطابقة تماماً للصورة رقم 1) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">

          {/* الجدول السفلي 1 (ملخص المبيعات والمصاريف) */}
          <div className="border-2 border-slate-900 rounded-lg overflow-hidden text-xs">
            <table className="w-full border-collapse">
              <tbody>
                {/* مجموع الجرامات */}
                <tr className="border-b border-slate-900">
                  <td className="p-2 font-bold bg-slate-50 border-l border-slate-900 w-1/2">
                    مجموع الجرامات
                  </td>
                  <td className="p-2 text-center font-mono font-bold">
                    {readOnly ? (
                      <span>{totalGrams} غرام</span>
                    ) : (
                      <input
                        type="number"
                        step="any"
                        value={totalGrams}
                        onChange={(e) => handleFieldChange('totalGrams', e.target.value)}
                        className="w-full text-center font-mono font-bold bg-transparent focus:outline-none p-0"
                      />
                    )}
                  </td>
                </tr>

                {/* مجموع المبيعات */}
                <tr className="border-b border-slate-900">
                  <td className="p-2 font-bold bg-slate-50 border-l border-slate-900">
                    مجموع المبيعات
                  </td>
                  <td className="p-2 text-center font-mono font-bold text-emerald-700">
                    {totalSales} د.أ
                  </td>
                </tr>

                {/* مجموع المصاريف */}
                <tr className="border-b border-slate-900">
                  <td className="p-2 font-bold bg-slate-50 border-l border-slate-900">
                    مجموع المصاريف
                  </td>
                  <td className="p-2 text-center font-mono font-bold text-rose-700">
                    {totalExpenses} د.أ
                  </td>
                </tr>

                {/* مجموع مبيعات الفيزا */}
                <tr className="border-b border-slate-900">
                  <td className="p-2 font-bold bg-slate-50 border-l border-slate-900">
                    مجموع مبيعات الفيزا
                  </td>
                  <td className="p-2 text-center font-mono font-bold text-indigo-700">
                    {totalVisaSales} د.أ
                  </td>
                </tr>

                {/* صافي المجموع (المبيعات - المصاريف) */}
                <tr className="bg-slate-900 text-white font-black text-sm">
                  <td className="p-2.5 border-l border-slate-700">
                    صافي المجموع ( المبيعات – المصاريف )
                  </td>
                  <td className="p-2.5 text-center font-mono text-base">
                    {netTotal} د.أ
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* الجدول السفلي 2 (السلف وجرامات الكسر) */}
          <div className="border-2 border-slate-900 rounded-lg overflow-hidden text-xs self-start">
            <table className="w-full border-collapse">
              <tbody>
                {/* مجموع السلف */}
                <tr className="border-b border-slate-900">
                  <td className="p-2.5 font-bold bg-slate-50 border-l border-slate-900 w-1/2">
                    مجموع السلف
                  </td>
                  <td className="p-2.5 text-center font-mono font-bold">
                    {readOnly ? (
                      <span>{totalAdvances} د.أ</span>
                    ) : (
                      <input
                        type="number"
                        step="any"
                        value={totalAdvances}
                        placeholder="0.000"
                        onChange={(e) => handleFieldChange('totalAdvances', e.target.value)}
                        className="w-full text-center font-mono font-bold bg-transparent focus:outline-none p-0"
                      />
                    )}
                  </td>
                </tr>

                {/* مجموع جرامات الكسر (الفضه) */}
                <tr className="border-b border-slate-900">
                  <td className="p-2.5 font-bold bg-slate-50 border-l border-slate-900">
                    مجموع جرامات الكسر (الفضه)
                  </td>
                  <td className="p-2.5 text-center font-mono font-bold text-slate-800">
                    {readOnly ? (
                      <span>{brokenSilverGrams} غرام</span>
                    ) : (
                      <input
                        type="number"
                        step="any"
                        value={brokenSilverGrams}
                        placeholder="0.000"
                        onChange={(e) => handleFieldChange('brokenSilverGrams', e.target.value)}
                        className="w-full text-center font-mono font-bold bg-transparent focus:outline-none p-0"
                      />
                    )}
                  </td>
                </tr>

                {/* مجموع جرامات الكسر (الذهب) */}
                <tr>
                  <td className="p-2.5 font-bold bg-slate-50 border-l border-slate-900">
                    مجموع جرامات الكسر (الذهب)
                  </td>
                  <td className="p-2.5 text-center font-mono font-bold text-amber-700">
                    {readOnly ? (
                      <span>{brokenGoldGrams} غرام</span>
                    ) : (
                      <input
                        type="number"
                        step="any"
                        value={brokenGoldGrams}
                        placeholder="0.000"
                        onChange={(e) => handleFieldChange('brokenGoldGrams', e.target.value)}
                        className="w-full text-center font-mono font-bold bg-transparent focus:outline-none p-0 text-amber-700"
                      />
                    )}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

        </div>

      </div>
    </div>
  );
}

export default DailySheetDocument;
