import React from 'react';
import { MessageSquareQuote, ShieldAlert } from 'lucide-react';
import { testimonialItems } from '../data/testimonials';

export const Testimonials: React.FC = () => {
  return (
    <section id="testimonials" className="py-14 sm:py-20 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F1F5F9] text-slate-800 text-xs font-bold mb-3 border border-slate-200">
            <span className="w-2 h-2 rounded-full bg-[#6cff76]"></span>
            <span>آراء وتجارب العملاء</span>
          </div>
          <h2
            id="testimonials-title"
            className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-950 tracking-tight"
          >
            تجارب عملاء متجر Yovo
          </h2>
          <p className="text-sm text-slate-500 mt-2 font-normal">
            تجارب حقيقية يشاركها عملاؤنا بعد تفعيل اشتراكاتهم
          </p>
        </div>

        {/* Testimonials Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {testimonialItems.map((item) => (
            <div
              key={item.id}
              id={`testimonial-${item.id}`}
              className="bg-[#F1F5F9] hover:bg-slate-100 rounded-2xl p-6 border border-slate-200 hover:border-[#006633] flex flex-col justify-between transition-all yovo-card-hover"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-white shadow-2xs border border-slate-200 flex items-center justify-center text-slate-900">
                    <MessageSquareQuote className="w-5 h-5 text-[#006633]" />
                  </div>
                  <span className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-white text-slate-900 border border-slate-200">
                    {item.service}
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-normal">
                  "{item.text}"
                </p>
              </div>

              <div className="mt-5 pt-3.5 border-t border-slate-200 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-900">
                    {item.customerName}
                  </h4>
                  {item.date && (
                    <span className="text-[10px] text-slate-400 block mt-0.5 font-normal">
                      {item.date}
                    </span>
                  )}
                </div>

                {item.isPlaceholderNote && (
                  <span className="text-[9px] text-slate-500 font-medium px-2 py-0.5 rounded-md bg-white border border-slate-200">
                    نموذج قابل للتعديل
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Clear Transparency Tag */}
        <div className="mt-8 text-center">
          <p className="inline-flex items-center gap-1.5 text-[11px] text-slate-600 font-medium bg-[#F1F5F9] border border-slate-200 px-3.5 py-1.5 rounded-full">
            <ShieldAlert className="w-3.5 h-3.5 text-[#006633]" />
            <span>نلتزم بالشفافية الكاملة: يمكنك دائماً التحقق وسؤال فريقنا على أي تفاصيل عبر رسائلنا المباشرة.</span>
          </p>
        </div>

      </div>
    </section>
  );
};

