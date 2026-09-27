import React from 'react';
import { ShieldCheck, Send, FileText, CheckCircle2 } from 'lucide-react';
import { storeConfig } from '../config';

export const TrustSection: React.FC = () => {
  return (
    <section id="trust" className="py-14 sm:py-20 bg-[#F1F5F9]/40 border-b border-slate-200 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          <div className="lg:col-span-5 text-right">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white text-slate-800 text-xs font-bold mb-3 border border-slate-200 shadow-2xs">
              <ShieldCheck className="w-3.5 h-3.5 text-[#006633]" />
              <span>مبادئ التعامل والثقة</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight mb-3">
              الشفافية والوضوح قبل كل طلب
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed max-w-xl font-normal">
              في {storeConfig.brandName}، نؤمن بأن الثقة تبدأ من الصدق والوضوح. لا نضع وعوداً مبالغاً فيها ولا رسوماً خفية.
              كل اشتراك نوضّح طريقة تفعيله، مدته وسعره، وشروط ضمانه الخاصة به مباشرة قبل أي دفع أو تأكيد.
            </p>
          </div>

          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs hover:border-[#006633] transition-all">
              <div className="flex items-center gap-2 mb-2 font-bold text-xs">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-[#006633] flex items-center justify-center">
                  <FileText className="w-4 h-4 text-[#006633]" />
                </div>
                <span className="text-slate-900">شروط واضحة مسبقاً</span>
              </div>
              <p className="text-xs text-slate-500 leading-normal font-normal">
                كل خدمة يتم توضيح مدتها، إمكانية التجديد، ونوع التفعيل (حساب خاص أو ترقية) بدقة.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs hover:border-[#006633] transition-all">
              <div className="flex items-center gap-2 mb-2 font-bold text-xs">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-[#006633] flex items-center justify-center">
                  <Send className="w-4 h-4 text-[#006633]" />
                </div>
                <span className="text-slate-900">تواصل إنساني مباشر</span>
              </div>
              <p className="text-xs text-slate-500 leading-normal font-normal">
                تتواصل معنا وتطلب مباشرة عبر Instagram دون روبوتات أو تعقيدات.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs hover:border-[#006633] transition-all">
              <div className="flex items-center gap-2 mb-2 font-bold text-xs">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-[#006633] flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4 text-[#006633]" />
                </div>
                <span className="text-slate-900">ضمان محدد لكل منتج</span>
              </div>
              <p className="text-xs text-slate-500 leading-normal font-normal">
                ضمان طيلة المدة المتفق عليها مع متابعة فورية في حالة أي استفسار أو مشكل تقني.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs hover:border-[#006633] transition-all">
              <div className="flex items-center gap-2 mb-2 font-bold text-xs">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-[#006633] flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4 text-[#006633]" />
                </div>
                <span className="text-slate-900">متجر رقمي مستقل</span>
              </div>
              <p className="text-xs text-slate-500 leading-normal font-normal">
                {storeConfig.brandName} متجر رقمي مستقل يقدم خدمات التفعيل والمساعدة للمستخدم الجزائري.
              </p>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};

