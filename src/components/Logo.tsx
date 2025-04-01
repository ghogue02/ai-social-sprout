
import React from 'react';

const Logo = ({ className = "" }: { className?: string }) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="w-8 h-8 relative">
        <div className="w-full h-full rounded-full border-2 border-allendale-gold flex items-center justify-center">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 14C8.7 14 6 11.3 6 8C6 4.7 8.7 2 12 2C15.3 2 18 4.7 18 8C18 11.3 15.3 14 12 14Z" stroke="#C3A343" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M19 21L18 15L12 14L6 15L5 21" stroke="#C3A343" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 14V17" stroke="#C3A343" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>
      <div className="flex flex-col">
        <span className="text-allendale-gold font-serif font-semibold text-sm leading-none">allendale</span>
        <span className="text-allendale-gold font-serif font-semibold text-lg leading-none">SOCIAL</span>
      </div>
    </div>
  );
};

export default Logo;
