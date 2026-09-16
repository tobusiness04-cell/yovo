import React, { useState } from 'react';
import { ChevronDown, HelpCircle, MessageCircle } from 'lucide-react';
import { faqItems } from '../data/faq';

interface FAQProps {
  onOpenContact: () => void;
}

export const FAQ: React.FC<FAQProps> = ({ onOpenContact }) => {
  const [openId, setOpenId] = useState<string | null>(faqItems[0]?.id || null);

  const toggleFAQ = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section id="faq" className="py-16 sm:py-24 bg-slate-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-200/80 text-slate-700 text-xs font-semibold mb-3">
            <HelpCircle className="w-3.5 h-3.5 text-sky-600" />
            <span>الأسئلة الشائعة</span>
          </div>
          <h2
            id="faq-section-title"
            className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight"
          >
            الأسئلة المتكررة
          </h2>
          <p className="text-base text-slate-600 mt-2 font-normal">
            إجابات واضحة ومباشرة على أكثر الاستفسارات التي تصلنا
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-3.5">
          {faqItems.map((item) => {
            const isOpen = openId === item.id;
            return (
              <div
                key={item.id}
                id={`faq-item-${item.id}`}
                className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden transition-all shadow-2xs"
              >
                <button
                  type="button"
                  onClick={() => toggleFAQ(item.id)}
                  className="w-full p-5 text-right flex items-center justify-between gap-4 hover:bg-slate-50/50 transition-colors focus:outline-hidden"
                  aria-expanded={isOpen}
                >
                  <span className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                    {item.question}
                  </span>
                  <div
                    className={`w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 bg-slate-900 text-white' : ''
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 animate-in fade-in">
                    {item.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Ask Question Support Box */}
        <div className="mt-10 p-6 rounded-3xl bg-white border border-slate-200/80 text-center flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-right">
            <h4 className="text-sm font-bold text-slate-900">عندك سؤال آخر ما لقيتهش هنا؟</h4>
            <p className="text-xs text-slate-500 mt-0.5">راسلنا مباشرة ونجاوبوك في أقرب وقت.</p>
          </div>
          <button
            type="button"
            onClick={onOpenContact}
            className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-900 bg-slate-100 hover:bg-slate-200 transition-colors flex items-center gap-2 shrink-0"
          >
            <MessageCircle className="w-4 h-4 text-sky-600" />
            <span>اسألنا على WhatsApp أو Instagram</span>
          </button>
        </div>

      </div>
    </section>
  );
};
