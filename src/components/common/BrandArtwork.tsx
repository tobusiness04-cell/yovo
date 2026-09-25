import React from 'react';
import { Product } from '../../types';

interface BrandArtworkProps {
  product: Product;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const BrandArtwork: React.FC<BrandArtworkProps> = ({
  product,
  className = '',
  size = 'md',
}) => {
  // If product already has an image URL from Firestore, render it
  if (product.imageUrl || product.image) {
    return (
      <div className={`relative w-full h-full overflow-hidden bg-[#F3F4F6] flex items-center justify-center ${className}`}>
        <img
          src={product.imageUrl || product.image}
          alt={product.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            // If image fails to load, hide image and show fallback
            (e.target as HTMLElement).style.display = 'none';
          }}
        />
      </div>
    );
  }

  const nameLower = product.name.toLowerCase();
  const idLower = product.id.toLowerCase();

  // 1. Canva Pro
  if (nameLower.includes('canva') || idLower.includes('canva')) {
    return (
      <div className={`relative w-full h-full bg-gradient-to-br from-[#00C4CC] via-[#0075FF] to-[#7D2AE8] flex items-center justify-center overflow-hidden ${className}`}>
        <div className="absolute inset-0 bg-radial from-white/20 via-transparent to-black/30 pointer-events-none" />
        <div className="flex flex-col items-center justify-center text-white relative z-10 transition-transform duration-300 group-hover:scale-105">
          <svg className="w-12 h-12 sm:w-14 sm:h-14 drop-shadow-md" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="50" r="46" fill="white" fillOpacity="0.2" />
            <path
              d="M68 38C64 34 57 32 49 32C37 32 28 40 28 51C28 62 38 69 51 69C60 69 66 65 70 60L63 54C60 58 56 61 51 61C43 61 37 56 37 50C37 44 43 39 50 39C55 39 60 41 62 44L68 38Z"
              fill="white"
            />
          </svg>
          <span className="font-brand font-black tracking-tight text-white text-xs sm:text-sm mt-1 drop-shadow-sm uppercase">
            Canva Pro
          </span>
        </div>
        <div className="absolute bottom-2 left-2 px-1.5 py-0.5 rounded-md bg-black/40 backdrop-blur-xs text-[9px] font-bold text-white uppercase tracking-wider">
          Official
        </div>
      </div>
    );
  }

  // 2. CapCut Pro
  if (nameLower.includes('capcut') || idLower.includes('capcut')) {
    return (
      <div className={`relative w-full h-full bg-[#080B0F] flex items-center justify-center overflow-hidden border border-gray-800 ${className}`}>
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:12px_12px]" />
        <div className="flex flex-col items-center justify-center relative z-10 transition-transform duration-300 group-hover:scale-105">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-white text-black flex items-center justify-center shadow-lg relative">
            <svg className="w-8 h-8 text-black" viewBox="0 0 24 24" fill="currentColor">
              {/* CapCut interlocking shape */}
              <path d="M4 6.5C4 5.12 5.12 4 6.5 4H10.5C11.88 4 13 5.12 13 6.5V9.5H6.5C5.12 9.5 4 8.38 4 7V6.5Z" />
              <path d="M13.5 14.5C13.5 13.12 14.62 12 16 12H19.5C20.88 12 22 13.12 22 14.5V17C22 18.38 20.88 19.5 19.5 19.5H16C14.62 19.5 13.5 18.38 13.5 17V14.5Z" />
              <circle cx="8" cy="16" r="3" />
              <circle cx="16" cy="8" r="3" />
            </svg>
            <span className="absolute -top-1.5 -right-1.5 bg-[#FF3B30] text-white text-[8px] font-black px-1 rounded-sm">
              PRO
            </span>
          </div>
          <span className="font-brand font-black text-white text-xs sm:text-sm mt-1.5 tracking-wide">
            CapCut Pro
          </span>
        </div>
        <div className="absolute bottom-2 left-2 px-1.5 py-0.5 rounded-md bg-white/10 backdrop-blur-xs text-[9px] font-bold text-gray-300">
          4K Video
        </div>
      </div>
    );
  }

  // 3. ChatGPT Plus
  if (nameLower.includes('chatgpt') || idLower.includes('chatgpt') || nameLower.includes('openai')) {
    return (
      <div className={`relative w-full h-full bg-gradient-to-br from-[#0B3B2C] via-[#10A37F] to-[#0A2E23] flex items-center justify-center overflow-hidden ${className}`}>
        <div className="absolute inset-0 bg-radial from-white/15 to-transparent pointer-events-none" />
        <div className="flex flex-col items-center justify-center text-white relative z-10 transition-transform duration-300 group-hover:scale-105">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-white/15 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-lg">
            {/* OpenAI spiral emblem */}
            <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
            </svg>
          </div>
          <span className="font-brand font-black text-white text-xs sm:text-sm mt-1.5 tracking-tight drop-shadow-sm">
            ChatGPT Plus
          </span>
        </div>
        <div className="absolute bottom-2 left-2 px-1.5 py-0.5 rounded-md bg-black/40 backdrop-blur-xs text-[9px] font-bold text-emerald-300">
          GPT-4o
        </div>
      </div>
    );
  }

  // 4. Notion Plus + AI
  if (nameLower.includes('notion') || idLower.includes('notion')) {
    return (
      <div className={`relative w-full h-full bg-[#191919] flex items-center justify-center overflow-hidden border border-gray-800 ${className}`}>
        <div className="flex flex-col items-center justify-center text-white relative z-10 transition-transform duration-300 group-hover:scale-105">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-white text-[#191919] flex items-center justify-center shadow-lg font-black text-2xl font-serif">
            N
          </div>
          <span className="font-brand font-black text-white text-xs sm:text-sm mt-1.5 tracking-wide">
            Notion AI
          </span>
        </div>
        <div className="absolute bottom-2 left-2 px-1.5 py-0.5 rounded-md bg-white/10 backdrop-blur-xs text-[9px] font-bold text-gray-300">
          Workspace
        </div>
      </div>
    );
  }

  // 5. Midjourney
  if (nameLower.includes('midjourney') || idLower.includes('midjourney')) {
    return (
      <div className={`relative w-full h-full bg-gradient-to-br from-[#120B2E] via-[#241442] to-[#0A051C] flex items-center justify-center overflow-hidden border border-purple-900/40 ${className}`}>
        <div className="flex flex-col items-center justify-center text-white relative z-10 transition-transform duration-300 group-hover:scale-105">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-purple-500/20 border border-purple-400/30 flex items-center justify-center shadow-lg text-purple-200">
            {/* Origami boat / Midjourney theme */}
            <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 19h20M12 2v17M12 2l8 17H4L12 2z" />
            </svg>
          </div>
          <span className="font-brand font-black text-white text-xs sm:text-sm mt-1.5 tracking-wide">
            Midjourney
          </span>
        </div>
        <div className="absolute bottom-2 left-2 px-1.5 py-0.5 rounded-md bg-purple-500/20 backdrop-blur-xs text-[9px] font-bold text-purple-200">
          Art AI
        </div>
      </div>
    );
  }

  // 6. Duolingo Super
  if (nameLower.includes('duolingo') || idLower.includes('duolingo')) {
    return (
      <div className={`relative w-full h-full bg-gradient-to-br from-[#58CC02] to-[#2B9200] flex items-center justify-center overflow-hidden ${className}`}>
        <div className="flex flex-col items-center justify-center text-white relative z-10 transition-transform duration-300 group-hover:scale-105">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-white text-[#58CC02] flex items-center justify-center shadow-lg">
            <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
              <circle cx="8.5" cy="11.5" r="3.5" fill="#58CC02" />
              <circle cx="15.5" cy="11.5" r="3.5" fill="#58CC02" />
              <circle cx="9" cy="11.5" r="1.5" fill="white" />
              <circle cx="15" cy="11.5" r="1.5" fill="white" />
              <path d="M12 14L10 16H14L12 14Z" fill="#FF9600" />
            </svg>
          </div>
          <span className="font-brand font-black text-white text-xs sm:text-sm mt-1.5 tracking-wide drop-shadow-sm">
            Duolingo Super
          </span>
        </div>
        <div className="absolute bottom-2 left-2 px-1.5 py-0.5 rounded-md bg-black/30 backdrop-blur-xs text-[9px] font-bold text-white">
          Languages
        </div>
      </div>
    );
  }

  // 7. Generic Fallback for Any Subscription
  const initials = product.name
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('');

  return (
    <div className={`relative w-full h-full bg-[#080B0F] flex items-center justify-center overflow-hidden border border-gray-800 ${className}`}>
      <div className="absolute inset-0 bg-radial from-[#FF3B30]/10 via-transparent to-transparent pointer-events-none" />
      <div className="flex flex-col items-center justify-center relative z-10 transition-transform duration-300 group-hover:scale-105">
        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-white/10 border border-white/15 text-white flex items-center justify-center shadow-lg font-brand font-black text-lg sm:text-xl">
          {initials}
        </div>
        <span className="font-brand font-black text-white text-xs sm:text-sm mt-1.5 tracking-tight truncate max-w-[120px]">
          {product.name}
        </span>
      </div>
      <div className="absolute bottom-2 left-2 px-1.5 py-0.5 rounded-md bg-white/10 backdrop-blur-xs text-[9px] font-bold text-gray-300">
        {product.category || 'اشتراك'}
      </div>
    </div>
  );
};
