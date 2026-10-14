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
      title: 'راسلنا عبر WhatsApp',
      description: 'اضغط على "اطلب الآن" وتواصل معنا مباشرة عبر WhatsApp مع رسالة طلبك الجاهزة لتأكيد التفعيل.',
      icon: Send,
    },
    {
      number: '04',
      title: 'استلم اشتراكك مفعلاً',
      description: 'يتم تأكيد الطلب وتفعيل اشتراكك في دقائق مع إرشادات مبسطة للاستخدام ودعم فني.',
      icon: CheckCircle,
    },
  ];

  return (
    <section id="how-it-works" className="py-14 sm:py-20 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F1F5F9] text-slate-800 text-xs font-bold mb-3 border border-slate-200">
            <span className="w-2 h-2 rounded-full bg-[#6cff76]"></span>
            <span>خطوات بسيطة وسريعة</span>
          </div>
          <h2
            id="how-it-works-title"
            className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-950 tracking-tight"
          >
            كيفاش تطلب اشتراكك في 4 خطوات؟
          </h2>
          <p className="text-sm text-slate-500 mt-2 font-normal">
            عملية طلب سهلة وبسيطة وسريعة بدون أي تعقيدات
          </p>
        </div>

        {/* 4 Steps Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 relative">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            const stepColors = [
              { bg: 'bg-[#006633]', text: 'text-white', iconText: 'text-[#006633]' },
              { bg: 'bg-[#6cff76]', text: 'text-[#003319]', iconText: 'text-[#006633]' },
              { bg: 'bg-[#006633]', text: 'text-white', iconText: 'text-[#006633]' },
              { bg: 'bg-[#008844]', text: 'text-white', iconText: 'text-[#008844]' },
            ];
            const color = stepColors[idx % stepColors.length];

            return (
              <div
                key={step.number}
                id={`step-card-${step.number}`}
                className="relative bg-[#F1F5F9] hover:bg-slate-100 rounded-2xl p-6 border border-slate-200 hover:border-[#006633] transition-all flex flex-col justify-between yovo-card-hover"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className={`w-10 h-10 rounded-xl ${color.bg} ${color.text} font-brand font-black text-sm flex items-center justify-center shadow-xs`}>
                      {step.number}
                    </span>
                    <div className="p-2.5 rounded-xl bg-white shadow-2xs border border-slate-200">
                      <Icon className={`w-4 h-4 ${color.iconText}`} />
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 mb-1.5">
                    {step.title}
                  </h3>

                  <p className="text-xs text-slate-500 leading-relaxed font-normal">
                    {step.description}
                  </p>
                </div>

                <div className="mt-5 pt-3 text-[11px] font-bold text-[#006633] border-t border-slate-200">
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

