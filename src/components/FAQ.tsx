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
    <section id="faq" className="py-14 sm:py-20 bg-[#F3F4F6]/50 border-b border-[#E5E7EB]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white text-[#080B0F] text-xs font-bold mb-3 border border-[#E5E7EB]">
            <HelpCircle className="w-3.5 h-3.5 text-[#FF3B30]" />
            <span>الأسئلة الشائعة حول المتجر</span>
          </div>
          <h2
            id="faq-section-title"
            className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#080B0F] tracking-tight"
          >
            الأسئلة المتكررة
          </h2>
          <p className="text-sm text-[#6B7280] mt-2 font-normal">
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
                className={`bg-white rounded-2xl border transition-all duration-200 shadow-xs ${
                  isOpen ? 'border-[#080B0F] ring-1 ring-[#080B0F]/10' : 'border-[#E5E7EB] hover:border-gray-400'
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggleFAQ(item.id)}
                  className="w-full p-5 text-right flex items-center justify-between gap-4 hover:bg-gray-50/50 transition-colors focus:outline-hidden cursor-pointer"
                  aria-expanded={isOpen}
                >
                  <span className="text-sm sm:text-base font-bold text-[#080B0F] leading-snug">
                    {item.question}
                  </span>
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-all duration-200 ${
                      isOpen
                        ? 'rotate-180 bg-[#080B0F] text-white shadow-xs'
                        : 'bg-[#F3F4F6] text-[#6B7280] border border-[#E5E7EB]'
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-[#6B7280] leading-relaxed border-t border-gray-100 animate-in fade-in font-normal">
                    {item.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Ask Question Support Box */}
        <div className="mt-10 p-6 rounded-2xl bg-white border border-[#E5E7EB] text-center flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
          <div className="text-right">
            <h4 className="text-sm font-bold text-[#080B0F]">عندك سؤال آخر ما لقيتهش هنا؟</h4>
            <p className="text-xs text-[#6B7280] mt-0.5">راسلنا مباشرة على إنستغرام ونجاوبوك فوراً في أي وقت.</p>
          </div>
          <button
            type="button"
            onClick={onOpenContact}
            className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-[#080B0F] hover:bg-black transition-all flex items-center gap-2 shrink-0 cursor-pointer active:scale-95"
          >
            <Send className="w-4 h-4 text-[#FF3B30]" />
            <span>اسألنا على Instagram</span>
          </button>
        </div>

      </div>
    </section>
  );
};

