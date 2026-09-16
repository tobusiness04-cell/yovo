import React from 'react';
import { MessageSquareQuote, ShieldAlert } from 'lucide-react';
import { testimonialItems } from '../data/testimonials';

export const Testimonials: React.FC = () => {
  return (
    <section id="testimonials" className="py-16 sm:py-24 bg-white border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold text-sky-600 uppercase tracking-wider mb-2 block">
            آراء وتجارب العملاء
          </span>
          <h2
            id="testimonials-title"
            className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight"
          >
            تجارب مع Yovo
          </h2>
          <p className="text-base text-slate-500 mt-2 font-normal">
            تجارب حقيقية يشاركها عملاؤنا بعد تفعيل خدماتهم
          </p>
        </div>

        {/* Testimonials Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonialItems.map((item) => (
            <div
              key={item.id}
              id={`testimonial-${item.id}`}
              className="bg-slate-50/80 rounded-3xl p-6 border border-slate-200/70 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-9 h-9 rounded-xl bg-white shadow-2xs border border-slate-200/60 flex items-center justify-center text-sky-600">
                    <MessageSquareQuote className="w-4 h-4" />
                  </div>
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-slate-200/70 text-slate-700">
                    {item.service}
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                  {item.text}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-200/60 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-900">
                    {item.customerName}
                  </h4>
                  {item.date && (
                    <span className="text-[10px] text-slate-400 block mt-0.5">
                      {item.date}
                    </span>
                  )}
                </div>

                {item.isPlaceholderNote && (
                  <span className="text-[9px] text-slate-400 font-medium px-1.5 py-0.5 rounded-sm bg-slate-200/50">
                    نموذج قابل للتعديل
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Clear Transparency Tag */}
        <div className="mt-8 text-center">
          <p className="inline-flex items-center gap-1.5 text-[11px] text-slate-400 font-medium bg-slate-100/80 px-3 py-1.5 rounded-full">
            <ShieldAlert className="w-3.5 h-3.5 text-slate-400" />
            <span>نلتزم بالشفافية الكاملة: يمكنك دائماً التحقق وسؤال فريقنا على أي تفاصيل عبر رسائلنا المباشرة.</span>
          </p>
        </div>

      </div>
    </section>
  );
};
