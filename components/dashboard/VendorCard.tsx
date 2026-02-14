
import React, { useState } from 'react';
import { Vendor } from '../../lib/vendors-data';
import { Star, MapPin, Heart } from 'lucide-react';

const VendorCard: React.FC<Vendor> = ({ name, location, price, rating, image, categories, featured }) => {
  const [isLiked, setIsLiked] = useState(featured);

  const toggleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsLiked(!isLiked);
  };

  return (
    <div className="bg-white rounded-[2rem] overflow-hidden border border-slate-100 hover:shadow-2xl hover:shadow-orange-600/5 transition-all group cursor-pointer flex flex-col h-full relative">
      <div className="relative aspect-[4/3] overflow-hidden">
        <img 
          src={image.startsWith('/') ? `https://picsum.photos/seed/${name}/800/600` : image} 
          alt={name} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
        />
        <div className="absolute top-4 left-4 flex gap-2">
          {categories.slice(0, 1).map(cat => (
            <span key={cat} className="px-3 py-1 bg-white/90 backdrop-blur-sm text-[10px] font-black uppercase tracking-widest rounded-full text-slate-900 shadow-sm">
              {cat}
            </span>
          ))}
        </div>
        
        {/* Shortlist Toggle */}
        <button 
          onClick={toggleLike}
          className={`absolute top-4 right-4 p-2 rounded-full backdrop-blur-md transition-all ${
            isLiked ? 'bg-orange-600 text-white' : 'bg-white/80 text-slate-400 hover:text-orange-600'
          }`}
        >
          <Heart size={14} className={isLiked ? 'fill-white' : ''} />
        </button>

        <div className="absolute bottom-4 right-4 flex items-center gap-1 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full shadow-sm">
          <Star size={10} className="text-orange-500 fill-orange-500" />
          <span className="text-[10px] font-bold text-slate-900">{rating}</span>
        </div>
      </div>
      
      <div className="p-5 flex flex-col flex-1">
        <h4 className="font-black text-slate-900 leading-tight mb-2 line-clamp-2 min-h-[2.5rem]">{name}</h4>
        
        <div className="mt-auto space-y-3">
          <div className="flex items-center gap-1.5 text-slate-400 text-xs font-bold uppercase tracking-tight">
            <MapPin size={14} className="text-orange-600" />
            {location}
          </div>
          
          <div className="flex items-center justify-between pt-3 border-t border-slate-50">
            <p className="text-[10px] font-bold text-slate-400 uppercase">Starting at</p>
            <p className="text-sm font-black text-orange-600">{price || 'Contact'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorCard;
