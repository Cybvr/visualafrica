"use client";
import React, { useState } from 'react';
import { Vendor } from '../../lib/vendors-data';
import { Star, MapPin, Bookmark } from 'lucide-react';

const VendorCard: React.FC<Vendor> = ({ name, location, price, rating, image, categories, featured, portfolio }) => {
  const [isLiked, setIsLiked] = useState(featured);
  const [imgSrc, setImgSrc] = useState(image && image.trim() !== '' ? image : '/placeholder.png');

  const toggleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsLiked(!isLiked);
  };

  const handleImageError = () => {
    setImgSrc('/placeholder.png');
  };

  return (
    <div className="bg-card rounded-lg overflow-hidden border border-border hover:shadow-2xl hover:shadow-primary/5 transition-all group cursor-pointer flex flex-col h-full relative min-w-0">
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={imgSrc}
          alt={name}
          onError={handleImageError}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute top-2 left-2 sm:top-4 sm:left-4 flex gap-1.5 sm:gap-2">
          {categories.slice(0, 1).map(cat => (
            <span key={cat} className="px-2 py-0.5 sm:px-3 sm:py-1 bg-card backdrop-blur-sm text-[9px] sm:text-[10px] font-black uppercase tracking-widest rounded-full text-foreground shadow-sm">
              {cat}
            </span>
          ))}
        </div>

        <button
          onClick={toggleLike}
          className={`absolute top-2 right-2 sm:top-4 sm:right-4 p-1.5 sm:p-2 rounded-full backdrop-blur-md transition-all ${isLiked ? 'bg-background text-foreground' : 'bg-white/80 text-muted-foreground hover:text-accent'
            }`}
        >
          <Bookmark size={14} className={isLiked ? 'fill-white' : ''} />
        </button>

        <div className="absolute bottom-2 left-2 sm:bottom-4 sm:left-4 flex items-center gap-1.5 bg-card backdrop-blur-sm px-2 py-1 sm:px-3 sm:py-1.5 rounded-full shadow-sm border border-border/50">
          <span className="text-[9px] sm:text-[10px] font-black text-foreground uppercase tracking-wider">{portfolio?.length || 0} Works</span>
        </div>

        <div className="absolute bottom-2 right-2 sm:bottom-4 sm:right-4 flex items-center gap-1 bg-card backdrop-blur-sm px-2 py-1 rounded-full shadow-sm">
          <Star size={10} className="text-foreground fill-foreground" />
          <span className="text-[10px] font-bold text-foreground">{rating}</span>
        </div>
      </div>

      <div className="p-3 sm:p-5 flex flex-col flex-1 min-w-0">
        <h4 className="font-black text-sm sm:text-base text-foreground leading-tight mb-2 line-clamp-2 min-h-[2.25rem] sm:min-h-[2.5rem]">{name}</h4>

        <div className="mt-auto space-y-3">
          <div className="flex items-center gap-1.5 text-muted-foreground text-[11px] sm:text-xs font-bold uppercase tracking-tight min-w-0">
            <MapPin size={14} className="text-accent" />
            <span className="truncate">{location}</span>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-slate-50">
            <p className="text-[10px] font-bold text-muted-foreground uppercase">Starting at</p>
            <p className="text-xs sm:text-sm font-black text-foreground">{price || 'Contact'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorCard;
