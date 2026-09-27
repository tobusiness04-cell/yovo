import React from 'react';
import { ArrowUpLeft, Send, Sparkles } from 'lucide-react';

interface FinalCTAProps {
  onOpenContact: () => void;
}

export const FinalCTA: React.FC<FinalCTAProps> = ({ onOpenContact }) => {
  return (
    <section id="final-cta" className="py-14 sm:py-20 bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl bg-[#071E12] text-white p-8 sm:p-14 overflow-hidden text-center shadow-2xl border border-emerald-900/60">
          
          {/* Subtle decorative glow */}
          <div className="absolute -top-24 -right-24 w-80 h-80 bg-[#6cff76]/15 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-[#006633]/30 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative z-10 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/10 text-white text-xs font-bold mb-4 backdrop-blur-xs border border-white/15">
              <Sparkles className="w-3.5 h-3.5 text-[#6cff76]" />
              <span>ابدأ الآن مع Yovo</span>
            </div>

            <h2
              id="final-cta-headline"
              className="text-2xl sm:text-4xl font-black text-white tracking-tight mb-4"
            >
              جاهز لتفعيل اشتراكك اليوم؟
            </h2>

            <p
              id="final-cta-supporting"
              className="text-xs sm:text-base text-slate-300 leading-relaxed mb-8 font-normal"
            >
              شوف الاشتراكات المتوفرة وتواصل معنا لمعرفة السعر والمدة والتفاصيل.
              فريقنا جاهز لتفعيل طلبك والإجابة على كل استفساراتك فوراً.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5">
              <a
                id="final-cta-explore-btn"
                href="#products"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl text-xs sm:text-sm font-black text-[#003319] bg-[#6cff76] hover:bg-[#5ae664] shadow-lg shadow-[#6cff76]/30 transition-all active:scale-98"
              >
                <span>تصفح الاشتراكات</span>
                <ArrowUpLeft className="w-4 h-4" />
              </a>

              <button
                id="final-cta-contact-btn"
                type="button"
                onClick={onOpenContact}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-white/10 hover:bg-white/15 border border-white/15 transition-all active:scale-98 cursor-pointer"
              >
                <Send className="w-4 h-4 text-[#6cff76]" />
                <span>راسلنا عبر Instagram</span>
              </button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

