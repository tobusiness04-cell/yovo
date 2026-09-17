import React from 'react';
import { Layers, CreditCard, Send, CheckCircle } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      number: '01',
      title: 'اختار الاشتراك',
      description: 'تصفح قائمة الاشتراكات المتوفرة واختار الأداة اللي تحتاجها في عملك أو دراستك.',
      icon: Layers,
    },
    {
      number: '02',
      title: 'شوف السعر والمدة',
      description: 'اطلع على الخطط المتوفرة (شهري، 3 أشهر، أو سنوي) وتعرف على السعر المحدد بالدينار.',
      icon: CreditCard,
    },
    {
      number: '03',
      title: 'راسلنا',
      description: 'اضغط على "اطلب الآن" وتواصل معنا مباشرة عبر Instagram مع تفاصيل طلبك.',
      icon: Send,
    },
    {
      number: '04',
      title: 'نكمّلو معاك عملية التفعيل',
      description: 'يتم تأكيد الطلب وتفعيل اشتراكك في دقائق مع إرشادات مبسطة للاستخدام ودعم فني.',
      icon: CheckCircle,
    },
  ];

  return (
    <section id="how-it-works" className="py-16 sm:py-24 bg-white border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold text-sky-600 uppercase tracking-wider mb-2 block">
            خطوات بسيطة وسريعة
          </span>
          <h2
            id="how-it-works-title"
            className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight"
          >
            كيفاش تطلب؟
          </h2>
          <p className="text-base text-slate-500 mt-2 font-normal">
            4 خطوات ساهلة باش تتحصل على اشتراكك في أسرع وقت
          </p>
        </div>

        {/* 4 Steps Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={step.number}
                id={`step-card-${step.number}`}
                className="relative bg-slate-50/70 hover:bg-slate-50 rounded-3xl p-6 border border-slate-200/70 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <span className="w-10 h-10 rounded-xl bg-slate-900 text-white font-brand font-bold text-sm flex items-center justify-center">
                      {step.number}
                    </span>
                    <div className="p-2.5 rounded-xl bg-white text-slate-700 shadow-2xs border border-slate-200/60">
                      <Icon className="w-5 h-5 text-sky-600" />
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 mb-2">
                    {step.title}
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed font-normal">
                    {step.description}
                  </p>
                </div>

                <div className="mt-6 pt-3 text-[11px] font-semibold text-slate-400">
                  خطوة {idx + 1} من 4
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
