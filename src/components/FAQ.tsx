import React, { useState } from 'react';
import { ChevronDown, HelpCircle, Send } from 'lucide-react';
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
    <section id="faq" className="py-10 sm:py-16 bg-slate-50/60 border-b border-slate-200">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white text-slate-800 text-[11px] sm:text-xs font-bold mb-2.5 border border-slate-200 shadow-2xs">
            <HelpCircle className="w-3.5 h-3.5 text-[#006633]" />
            <span>إجابات سريعة</span>
          </div>
          <h2
            id="faq-section-title"
            className="text-xl sm:text-3xl font-black text-slate-950 tracking-tight"
          >
            الأسئلة الشائعة
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 font-normal">
            كل ما يهمك معرفته حول الدفع، التفعيل والضمان
          </p>
        </div>

        {/* Compact Accordion List */}
        <div className="space-y-2.5">
          {faqItems.map((item) => {
            const isOpen = openId === item.id;
            return (
              <div
                key={item.id}
                id={`faq-item-${item.id}`}
                className={`bg-white rounded-xl border transition-all duration-200 ${
                  isOpen ? 'border-[#006633] ring-1 ring-[#006633]/20 shadow-xs' : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggleFAQ(item.id)}
                  className="w-full p-4 sm:p-4.5 text-right flex items-center justify-between gap-3 hover:bg-slate-50/50 transition-colors focus:outline-hidden cursor-pointer"
                  aria-expanded={isOpen}
                >
                  <span className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">
                    {item.question}
                  </span>
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-transform duration-200 ${
                      isOpen
                        ? 'rotate-180 bg-[#006633] text-white'
                        : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    <ChevronDown className="w-3.5 h-3.5" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-4 pb-4 pt-1 text-xs text-slate-600 leading-relaxed border-t border-slate-100 animate-in fade-in font-normal">
                    {item.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Ask Question Support Link */}
        <div className="mt-8 p-4 rounded-xl bg-white border border-slate-200 text-center flex flex-col sm:flex-row items-center justify-between gap-3 shadow-2xs">
          <div className="text-right">
            <h4 className="text-xs font-bold text-slate-900">عندك استفسار آخر؟</h4>
            <p className="text-[11px] text-slate-500 mt-0.5">راسلنا مباشرة على WhatsApp ونجاوبوك في الحين.</p>
          </div>
          <button
            type="button"
            onClick={onOpenContact}
            className="w-full sm:w-auto px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#006633] to-[#008844] hover:opacity-95 shadow-xs transition-all flex items-center justify-center gap-1.5 shrink-0 cursor-pointer active:scale-95"
          >
            <Send className="w-3.5 h-3.5 text-[#6cff76]" />
            <span>راسلنا على واتساب</span>
          </button>
        </div>

      </div>
    </section>
  );
};
