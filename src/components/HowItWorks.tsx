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
      title: 'راسلنا عبر Instagram',
      description: 'اضغط على "اطلب الآن" وتواصل معنا مباشرة عبر Instagram مع رسالة طلبك الجاهزة.',
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
    <section id="how-it-works" className="py-14 sm:py-20 bg-white border-b border-[#E5E7EB]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F3F4F6] text-[#080B0F] text-xs font-bold mb-3 border border-[#E5E7EB]">
            <span className="w-2 h-2 rounded-full bg-[#FF3B30]"></span>
            <span>خطوات بسيطة وسريعة</span>
          </div>
          <h2
            id="how-it-works-title"
            className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#080B0F] tracking-tight"
          >
            كيفاش تطلب اشتراكك في 4 خطوات؟
          </h2>
          <p className="text-sm text-[#6B7280] mt-2 font-normal">
            عملية طلب سهلة وبسيطة وسريعة بدون أي تعقيدات
          </p>
        </div>

        {/* 4 Steps Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 relative">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={step.number}
                id={`step-card-${step.number}`}
                className="relative bg-[#F3F4F6] hover:bg-gray-100 rounded-2xl p-6 border border-[#E5E7EB] hover:border-[#080B0F] transition-all flex flex-col justify-between yovo-card-hover"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="w-10 h-10 rounded-xl bg-[#080B0F] text-white font-brand font-black text-sm flex items-center justify-center shadow-xs">
                      {step.number}
                    </span>
                    <div className="p-2.5 rounded-xl bg-white text-[#080B0F] shadow-xs border border-[#E5E7EB]">
                      <Icon className="w-4 h-4 text-[#FF3B30]" />
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-[#080B0F] mb-1.5">
                    {step.title}
                  </h3>

                  <p className="text-xs text-[#6B7280] leading-relaxed font-normal">
                    {step.description}
                  </p>
                </div>

                <div className="mt-5 pt-3 text-[11px] font-bold text-[#FF3B30] border-t border-[#E5E7EB]">
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

