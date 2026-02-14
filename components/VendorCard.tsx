
import React from 'react';
import { Vendor } from '../types';

const VendorCard: React.FC<Vendor> = ({ name, location, dateRange, imageUrl }) => {
  return (
    <div className="relative aspect-[4/5] rounded-3xl overflow-hidden group cursor-pointer shadow-sm hover:shadow-md transition-shadow">
      <img 
        src={imageUrl} 
        alt={name} 
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
      />
      {/* Overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
      
      {/* Content */}
      <div className="absolute bottom-0 left-0 p-5 w-full text-white">
        <h4 className="font-bold text-base leading-tight mb-1 truncate">{name}</h4>
        <div className="flex items-center gap-2 opacity-90">
          <span className="text-xs">{location}</span>
          <span className="w-1 h-1 bg-white/50 rounded-full" />
          <span className="text-xs">{dateRange}</span>
        </div>
      </div>
    </div>
  );
};

export default VendorCard;
