import React from 'react';

export const AnnouncementBar: React.FC = () => {
  return (
    <div className="bg-[#111111] text-[#E8E8E4] text-[11px] font-medium tracking-widest uppercase py-2 px-4 text-center border-b border-[#222222]">
      <div className="flex items-center justify-center gap-3 flex-wrap">
        <span>COMPLIMENTARY WORLDWIDE COURIER OVER $100</span>
        <span className="text-[#6B6B6B]">•</span>
        <span>30-DAY EFFORTLESS RETURNS</span>
        <span className="text-[#6B6B6B]">•</span>
        <span className="text-[#B8912F]">ATELIER DROP 06 LIVE</span>
      </div>
    </div>
  );
};
