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
    <section id="faq" className="py-14 sm:py-20 bg-[#F1F5F9]/50 border-b border-slate-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white text-slate-800 text-xs font-bold mb-3 border border-slate-200 shadow-2xs">
            <HelpCircle className="w-3.5 h-3.5 text-[#006633]" />
            <span>الأسئلة الشائعة حول المتجر</span>
          </div>
          <h2
            id="faq-section-title"
            className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-950 tracking-tight"
          >
            الأسئلة المتكررة
          </h2>
          <p className="text-sm text-slate-500 mt-2 font-normal">
            إجابات واضحة ومباشرة حول الاشتراكات، التفعيل، وطرق الدفع
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-3">
          {faqItems.map((item) => {
            const isOpen = openId === item.id;
            return (
              <div
                key={item.id}
                id={`faq-item-${item.id}`}
                className={`bg-white rounded-2xl border transition-all duration-200 shadow-2xs ${
                  isOpen ? 'border-[#006633] ring-1 ring-[#006633]/25' : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggleFAQ(item.id)}
                  className="w-full p-5 text-right flex items-center justify-between gap-4 hover:bg-slate-50/50 transition-colors focus:outline-hidden cursor-pointer"
                  aria-expanded={isOpen}
                >
                  <span className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                    {item.question}
                  </span>
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-all duration-200 ${
                      isOpen
                        ? 'rotate-180 bg-gradient-to-r from-[#006633] to-[#008844] text-white shadow-xs'
                        : 'bg-[#F1F5F9] text-slate-500 border border-slate-200'
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 animate-in fade-in font-normal">
                    {item.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Ask Question Support Box */}
        <div className="mt-10 p-6 rounded-2xl bg-white border border-slate-200 text-center flex flex-col sm:flex-row items-center justify-between gap-4 shadow-2xs">
          <div className="text-right">
            <h4 className="text-sm font-bold text-slate-900">عندك سؤال آخر ما لقيتهش هنا؟</h4>
            <p className="text-xs text-slate-500 mt-0.5">راسلنا مباشرة على WhatsApp ونجاوبوك فوراً في أي وقت.</p>
          </div>
          <button
            type="button"
            onClick={onOpenContact}
            className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#006633] to-[#008844] hover:opacity-95 shadow-md shadow-[#006633]/20 transition-all flex items-center gap-2 shrink-0 cursor-pointer active:scale-95"
          >
            <Send className="w-4 h-4 text-[#6cff76]" />
            <span>اسألنا على WhatsApp</span>
          </button>
        </div>

      </div>
    </section>
  );
};

