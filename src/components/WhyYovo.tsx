import React from 'react';
import { Tag, Zap, Headphones, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { storeConfig } from '../config';

export const WhyYovo: React.FC = () => {
  const benefits = [
    {
      id: 'benefit-pricing',
      title: 'أسعار واضحة',
      desc: 'شفافية كاملة في الأسعار والمدد بالدينار الجزائري (دج) بدون أي تكاليف مخفية أو مفاجآت.',
      icon: Tag,
      badge: 'شفافية تامة',
      accentColor: 'text-amber-600 bg-amber-50 border-amber-100',
    },
    {
      id: 'benefit-speed',
      title: 'تفعيل سريع',
      desc: 'تفعيل فوري أو خلال دقائق معدودة بعد تأكيد طلبك مع إرشادات مبسطة للبدء مباشرة.',
      icon: Zap,
      badge: '15 - 30 دقيقة',
      accentColor: 'text-sky-600 bg-sky-50 border-sky-100',
    },
    {
      id: 'benefit-support',
      title: 'دعم العملاء',
      desc: 'فريق دعم متواجد للإجابة على استفساراتك عبر Instagram ومساعدتك خطوة بخطوة.',
      icon: Headphones,
      badge: 'متابعة مستمرة',
      accentColor: 'text-emerald-600 bg-emerald-50 border-emerald-100',
    },
    {
      id: 'benefit-guarantee',
      title: 'ضمان حسب المنتج',
      desc: 'شروط ومدة الضمان واضحة ومحددة لكل خدمة على حدة قبل الطلب، باش تخدم وأنت مطمئن وبكل راحة.',
      icon: ShieldCheck,
      badge: 'موضح لكل خدمة',
      accentColor: 'text-indigo-600 bg-indigo-50 border-indigo-100',
    },
  ];

  return (
    <section id="why" className="py-16 sm:py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold text-sky-600 uppercase tracking-wider mb-2 block">
            مميزات التعامل معنا
          </span>
          <h2
            id="why-yovo-title"
            className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight"
          >
            علاش تختار Yovo؟
          </h2>
          <p className="text-base text-slate-600 mt-3 font-normal leading-relaxed">
            نهتم بتوفير تجربة سهلة، سريعة وموثوقة لجميع مستخدمي الاشتراكات الرقمية في الجزائر.
          </p>
        </div>

        {/* 4 Core Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((b) => {
            const Icon = b.icon;
            return (
              <div
                key={b.id}
                id={`benefit-card-${b.id}`}
                className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${b.accentColor}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md">
                      {b.badge}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 mb-2">
                    {b.title}
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed font-normal">
                    {b.desc}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-1.5 text-[11px] text-slate-500">
                  <CheckCircle2 className="w-3.5 h-3.5 text-sky-500" />
                  <span>خدمة موثوقة ومضمونة</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Transparent Guarantee Callout (per user directive) */}
        <div className="mt-10 p-5 rounded-2xl bg-white border border-slate-200/90 max-w-3xl mx-auto flex items-start gap-3.5 text-right">
          <ShieldCheck className="w-5 h-5 text-slate-700 shrink-0 mt-0.5" />
          <div className="text-xs text-slate-600 leading-relaxed">
            <span className="font-bold text-slate-900 block mb-0.5">تنويه شفاف حول الضمان:</span>
            {storeConfig.guaranteeGeneralText} لا نقدّم وعوداً عامة غير واقعية، بل نلتزم بشروط محددة ومعلنة لكل اشتراك في بطاقة تفاصيله.
          </div>
        </div>

      </div>
    </section>
  );
};
