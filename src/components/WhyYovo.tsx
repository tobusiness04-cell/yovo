import React from 'react';
import { Tag, Zap, Headphones, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { storeConfig } from '../config';

export const WhyYovo: React.FC = () => {
  const benefits = [
    {
      id: 'benefit-pricing',
      title: 'أسعار واضحة بالدينار',
      desc: 'شفافية كاملة في الأسعار والمدد بالدينار الجزائري بدون أي تكاليف خفية أو مفاجآت بعد الطلب.',
      icon: Tag,
      badge: 'شفافية تامة',
      accentColor: 'text-amber-600 bg-amber-50 border-amber-200',
    },
    {
      id: 'benefit-speed',
      title: 'تفعيل سريع وفوري',
      desc: 'تفعيل خلال دقائق معدودة بعد تأكيد طلبك مع إرشادات مبسطة للبدء في استخدام اشتراكك فوراً.',
      icon: Zap,
      badge: '15 - 30 دقيقة',
      accentColor: 'text-[#3B82F6] bg-blue-50 border-blue-200',
    },
    {
      id: 'benefit-support',
      title: 'دعم مباشر عبر Instagram',
      desc: 'فريق دعم متواجد للإجابة على استفساراتك ومساعدتك خطوة بخطوة في أي وقت.',
      icon: Headphones,
      badge: 'متابعة مباشرة',
      accentColor: 'text-[#8B5CF6] bg-purple-50 border-purple-200',
    },
    {
      id: 'benefit-guarantee',
      title: 'ضمان محدد لكل اشتراك',
      desc: 'شروط ومدة الضمان واضحة ومحددة لكل أداة على حدة قبل الطلب، لتخدم وأنت مطمئن ومرتاح البال.',
      icon: ShieldCheck,
      badge: 'ضمان معلن',
      accentColor: 'text-[#10B981] bg-emerald-50 border-emerald-200',
    },
  ];

  return (
    <section id="why" className="py-14 sm:py-20 bg-[#F1F5F9]/60 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white text-slate-800 text-xs font-bold mb-3 border border-slate-200 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-[#22D3EE]"></span>
            <span>مميزات التسوق مع Yovo</span>
          </div>
          <h2
            id="why-yovo-title"
            className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-950 tracking-tight"
          >
            علاش تختار متجر Yovo لاشتراكاتك؟
          </h2>
          <p className="text-sm text-slate-500 mt-2 font-normal leading-relaxed">
            نهتم بتوفير تجربة تسوق سهلة، سريعة وموثوقة لجميع المبدعين والطلبة وصانعي المحتوى في الجزائر.
          </p>
        </div>

        {/* 4 Core Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {benefits.map((b) => {
            const Icon = b.icon;
            return (
              <div
                key={b.id}
                id={`benefit-card-${b.id}`}
                className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-2xs hover:border-[#3B82F6] hover:shadow-lg transition-all flex flex-col justify-between yovo-card-hover"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center border shadow-2xs ${b.accentColor}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-bold text-slate-600 bg-[#F1F5F9] border border-slate-200 px-2.5 py-1 rounded-lg">
                      {b.badge}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 mb-1.5">
                    {b.title}
                  </h3>

                  <p className="text-xs text-slate-500 leading-relaxed font-normal">
                    {b.desc}
                  </p>
                </div>

                <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center gap-1.5 text-[11px] text-slate-800 font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981]" />
                  <span>خدمة موثوقة ومضمونة</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Transparent Guarantee Callout */}
        <div className="mt-8 p-4 rounded-xl bg-white border border-slate-200 max-w-3xl mx-auto flex items-start gap-3 text-right shadow-2xs">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#22D3EE] via-[#3B82F6] to-[#8B5CF6] text-white flex items-center justify-center shrink-0 mt-0.5">
            <ShieldCheck className="w-4 h-4 text-white" />
          </div>
          <div className="text-xs text-slate-600 leading-relaxed">
            <span className="font-bold text-slate-900 block mb-0.5">تنويه شفاف حول الضمان:</span>
            {storeConfig.guaranteeGeneralText} لا نقدّم وعوداً عامة غير واقعية، بل نلتزم بشروط محددة ومعلنة لكل اشتراك في بطاقة تفاصيله.
          </div>
        </div>

      </div>
    </section>
  );
};

