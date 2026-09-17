import React from 'react';
import { ShieldCheck, Send, FileText, CheckCircle2 } from 'lucide-react';
import { storeConfig } from '../config';

export const TrustSection: React.FC = () => {
  return (
    <section id="trust" className="py-14 bg-slate-900 text-white overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          <div className="lg:col-span-6 text-right">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800 text-sky-400 text-xs font-semibold mb-3 border border-slate-700">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>مبادئ الثقافة والتعامل</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-3">
              الشفافية والوضوح قبل كل شيء
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl font-normal">
              في {storeConfig.brandName}، نؤمن بأن الثقة تبدأ من الوضوح. لا نضع وعوداً مبالغاً فيها ولا رسوماً خفية.
              كل اشتراك نوضّح طريقة تفعيله، مدته وسعره، وشروط ضمانه الخاصة به مباشرة قبل أي دفع أو تأكيد.
            </p>
          </div>

          <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80">
              <div className="flex items-center gap-2 mb-2 text-sky-400 font-bold text-xs">
                <FileText className="w-4 h-4" />
                <span>شروط واضحة مسبقاً</span>
              </div>
              <p className="text-xs text-slate-300 leading-normal">
                كل خدمة يتم توضيح مدتها، إمكانية التجديد، ونوع التفعيل (حساب خاص أو ترقية).
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80">
              <div className="flex items-center gap-2 mb-2 text-sky-400 font-bold text-xs">
                <Send className="w-4 h-4" />
                <span>تواصل إنساني مباشر</span>
              </div>
              <p className="text-xs text-slate-300 leading-normal">
                تتواصل معنا مباشرة عبر Instagram دون روبوتات أو تعقيدات.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80">
              <div className="flex items-center gap-2 mb-2 text-amber-400 font-bold text-xs">
                <ShieldCheck className="w-4 h-4" />
                <span>ضمان محدد لكل منتج</span>
              </div>
              <p className="text-xs text-slate-300 leading-normal">
                ضمان طيلة المدة المتفق عليها مع متابعة في حالة أي استفسار أو مشكل تقني.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80">
              <div className="flex items-center gap-2 mb-2 text-purple-400 font-bold text-xs">
                <CheckCircle2 className="w-4 h-4" />
                <span>علامة مستقلة</span>
              </div>
              <p className="text-xs text-slate-300 leading-normal">
                {storeConfig.brandName} متجر رقمي مستقل يقدم خدمات التفعيل والمساعدة للمستخدم الجزائري.
              </p>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
