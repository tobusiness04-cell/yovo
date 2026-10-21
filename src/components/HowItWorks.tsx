import React from 'react';
import { Layers, Send, Smartphone, CheckCircle } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      number: '01',
      title: 'اختار الاشتراك',
      description: 'تصفح قائمة الاشتراكات واختار الأداة والخطة (شهري، سنوي...) التي تناسبك.',
      icon: Layers,
    },
    {
      number: '02',
      title: 'اضغط "اطلب الآن"',
      description: 'يتم تجهيز رسالة طلبك تلقائياً لفتح محادثة واتساب المباشرة معنا بنقرة واحدة.',
      icon: Send,
    },
    {
      number: '03',
      title: 'ادفع عبر BaridiMob أو CCP أو فليكسي',
      description: 'نرسل لك رقم الحساب (RIP) أو رقم الهاتف لتحويل المبلغ بسهولة وإرسال صورة الوصل.',
      icon: Smartphone,
    },
    {
      number: '04',
      title: 'استلم تفعيلك في دقائق',
      description: 'يتم تفعيل اشتراكك فوراً مع إرشادات مبسطة وضمان كامل طيلة مدة الاشتراك.',
      icon: CheckCircle,
    },
  ];

  return (
    <section id="how-it-works" className="py-10 sm:py-16 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-xl mx-auto mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-800 text-[11px] sm:text-xs font-bold mb-2.5 border border-slate-200">
            <span className="w-2 h-2 rounded-full bg-[#006633]"></span>
            <span>بسيطة ومباشرة</span>
          </div>
          <h2
            id="how-it-works-title"
            className="text-xl sm:text-3xl font-black text-slate-950 tracking-tight"
          >
            كيفاش تطلب اشتراكك في 4 خطوات؟
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1.5 font-normal">
            طلب فوري وتفعيل سريع بدون الحاجة لإنشاء حساب أو تعقيدات
          </p>
        </div>

        {/* 4 Steps Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {steps.map((step, idx) => {
            const Icon = step.icon;

            return (
              <div
                key={step.number}
                id={`step-card-${step.number}`}
                className="bg-slate-50/80 hover:bg-slate-100/90 rounded-2xl p-5 sm:p-6 border border-slate-200/80 hover:border-[#006633] transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="w-9 h-9 rounded-xl bg-[#006633] text-white font-brand font-black text-sm flex items-center justify-center shadow-xs">
                      {step.number}
                    </span>
                    <div className="p-2 rounded-xl bg-white shadow-2xs border border-slate-200/80">
                      <Icon className="w-4 h-4 text-[#006633]" />
                    </div>
                  </div>

                  <h3 className="text-sm sm:text-base font-bold text-slate-900 mb-1.5">
                    {step.title}
                  </h3>

                  <p className="text-xs text-slate-500 leading-relaxed font-normal">
                    {step.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 text-[11px] font-bold text-[#006633] border-t border-slate-200/60 flex items-center justify-between">
                  <span>خطوة {idx + 1} من 4</span>
                  <span className="text-slate-400 font-normal">تأكيد فوري</span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
