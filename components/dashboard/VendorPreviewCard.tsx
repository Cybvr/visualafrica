"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { Star } from 'lucide-react';

interface VendorPreview {
  id: string;
  slug: string;
  name: string;
  image: string;
  rating: number;
  location: string;
  categories: string[];
  featured?: boolean;
}

interface VendorPreviewCardProps {
  vendor: VendorPreview;
  basePath?: string;
}

const VendorPreviewCard: React.FC<VendorPreviewCardProps> = ({
  vendor,
  basePath = '/dashboard/hosts/vendor'
}) => {
  const [imgSrc, setImgSrc] = useState(
    vendor.image && vendor.image.trim() !== '' ? vendor.image : '/placeholder.png'
  );

  const handleImageError = () => {
    setImgSrc('/placeholder.png');
  };

  return (
    <Link
      href={`${basePath}/${vendor.slug}`}
      className="bg-card p-4 rounded-[2rem] border border-border shadow-sm hover:shadow-lg transition-all group"
    >
      <div className="rounded-2xl overflow-hidden aspect-square mb-4 relative">
        <img
          src={imgSrc}
          alt={vendor.name}
          onError={handleImageError}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {vendor.featured && (
          <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-accent p-1.5 rounded-full shadow-sm">
            <Star size={12} fill="currentColor" />
          </div>
        )}
      </div>
      <div>
        <div className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">
          {vendor.categories[0]}
        </div>
        <h4 className="font-bold text-foreground group-hover:text-accent transition-colors truncate">
          {vendor.name}
        </h4>
        <div className="flex items-center gap-1 mt-1">
          <Star size={14} className="text-yellow-400" fill="currentColor" />
          <span className="text-xs font-bold text-foreground">{vendor.rating}</span>
          <span className="text-xs text-muted-foreground">• {vendor.location.split(',')[0]}</span>
        </div>
      </div>
    </Link>
  );
};

export default VendorPreviewCard;
