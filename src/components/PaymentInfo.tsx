import React from 'react';
import { Smartphone, Building2, CheckCircle2, Zap } from 'lucide-react';

export const PaymentInfo: React.FC = () => {
  return (
    <section id="payment" className="py-10 sm:py-14 bg-slate-50/70 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-xl mx-auto mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white text-slate-800 text-[11px] sm:text-xs font-bold mb-2.5 border border-slate-200 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-[#006633]"></span>
            <span>طرق الدفع المتوفرة في الجزائر 🇩🇿</span>
          </div>
          <h2
            id="payment-section-title"
            className="text-xl sm:text-3xl font-black text-slate-950 tracking-tight"
          >
            دفع سهل وسريع بالدينار الجزائري
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1.5 font-normal leading-relaxed">
            لا تحتاج لبطاقات بنكية أجنبية. ادفع مباشرة وبأمان عبر الحسابات البريدية الجزائرية أو الفليكسي.
          </p>
        </div>

        {/* 3 Main Payment Methods Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5 max-w-5xl mx-auto mb-8">
          
          {/* BaridiMob Card */}
          <div className="bg-white rounded-2xl p-5 border-2 border-emerald-500/30 shadow-xs hover:border-[#006633] transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3.5">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#006633] to-[#008844] text-white flex items-center justify-center shadow-xs">
                  <Smartphone className="w-5 h-5 text-white" />
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#6cff76]/20 text-[#004d26] border border-[#6cff76]/30">
                  الأسرع والأسهل ⚡
                </span>
              </div>

              <h3 className="text-base font-black text-slate-900 mb-1">
                بريدي موب — BaridiMob
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed font-normal mb-3">
                تحويل مباشر من تطبيق BaridiMob الخاص بك برقم RIP في ثوانٍ معدودة دون الحاجة للتنقل.
              </p>
            </div>

            <ul className="space-y-1.5 pt-3 border-t border-slate-100 text-[11px] text-slate-700">
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#006633] shrink-0" />
                <span>تأكيد فوري وتفعيل سريع خلال دقائق</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#006633] shrink-0" />
                <span>متوفر 24/7 طوال أيام الأسبوع</span>
              </li>
            </ul>
          </div>

          {/* CCP Card */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3.5">
                <div className="w-11 h-11 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-xs">
                  <Building2 className="w-5 h-5 text-white" />
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200">
                  متاح للجميع 🏢
                </span>
              </div>

              <h3 className="text-base font-black text-slate-900 mb-1">
                الحساب الجاري البريدي — CCP
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed font-normal mb-3">
                الدفع عبر أي مكتب بريد في جميع ولايات الوطن الجزائري بواسطة حوالة بريدية برقم الحساب.
              </p>
            </div>

            <ul className="space-y-1.5 pt-3 border-t border-slate-100 text-[11px] text-slate-700">
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#006633] shrink-0" />
                <span>مناسب للزبائن بدون بطاقة ذهبية</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#006633] shrink-0" />
                <span>إرسال وصل التحويل عبر واتساب فقط</span>
              </li>
            </ul>
          </div>

          {/* Flexy Card */}
          <div className="bg-white rounded-2xl p-5 border border-amber-200/80 shadow-xs hover:border-amber-400 transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3.5">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 text-white flex items-center justify-center shadow-xs">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200">
                  متاح أيضاً 📲
                </span>
              </div>

              <h3 className="text-base font-black text-slate-900 mb-1">
                فليكسي — Flexy
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed font-normal mb-3">
                تعبئة رصيد مباشر عبر الهاتف لجميع المتعاملين لمن يفضل الدفع عبر الفليكسي بكل سهولة.
              </p>
            </div>

            <ul className="space-y-1.5 pt-3 border-t border-slate-100 text-[11px] text-slate-700">
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <span>متوفر لـ Mobilis، Djezzy، و Ooredoo</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <span>تأكيد فوري بعد إرسال رسالة الرصيد</span>
              </li>
            </ul>
          </div>

        </div>

        {/* 3-Step Simple Payment Process Banner */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-2xs max-w-4xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 text-center sm:text-right">
            <div className="flex items-center sm:items-start gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-emerald-50 text-[#006633] font-black text-xs flex items-center justify-center shrink-0">
                1
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">اطلب عبر واتساب</h4>
                <p className="text-[11px] text-slate-500">اختر اشتراكك واضغط "اطلب الآن"</p>
              </div>
            </div>

            <div className="flex items-center sm:items-start gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-emerald-50 text-[#006633] font-black text-xs flex items-center justify-center shrink-0">
                2
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">طريقة الدفع التي تناسبك</h4>
                <p className="text-[11px] text-slate-500">ادفع عبر بريدي موب أو CCP أو فليكسي</p>
              </div>
            </div>

            <div className="flex items-center sm:items-start gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-emerald-50 text-[#006633] font-black text-xs flex items-center justify-center shrink-0">
                3
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">تفعيل فوري مضمون</h4>
                <p className="text-[11px] text-slate-500">يصلك حسابك مع الضمان والدعم</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
