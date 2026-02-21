"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Clock, User } from 'lucide-react';

interface BlogPost {
  id: string;
  title: string;
  excerpt?: string;
  category: string;
  image: string;
  date?: string;
  author?: string;
}

interface BlogPostCardProps {
  post: BlogPost;
  variant?: 'compact' | 'full';
  basePath?: string;
}

const BlogPostCard: React.FC<BlogPostCardProps> = ({
  post,
  variant = 'full',
  basePath = '/dashboard/hosts/diy-content'
}) => {
  const [imgSrc, setImgSrc] = useState(
    post.image && post.image.trim() !== '' ? post.image : '/placeholder.png'
  );

  const handleImageError = () => {
    setImgSrc('/placeholder.png');
  };

  if (variant === 'compact') {
    return (
      <Link href={`${basePath}/${post.id}`} className="group cursor-pointer">
        <div className="rounded-md overflow-hidden aspect-[4/3] mb-3 relative">
          <img
            src={imgSrc}
            alt={post.title}
            onError={handleImageError}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-3 left-3 bg-accent backdrop-blur-md text-white text-[10px] font-black px-2 py-1 rounded-full uppercase tracking-wider">
            {post.category}
          </div>
        </div>
        <h4 className="font-bold text-foreground line-clamp-2">
          {post.title}
        </h4>
      </Link>
    );
  }

  return (
    <Link
      href={`${basePath}/${post.id}`}
      className="flex flex-col bg-card rounded-md border border-border overflow-hidden"
    >
      <div className="aspect-[16/10] relative overflow-hidden">
        <img
          src={imgSrc}
          alt={post.title}
          onError={handleImageError}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-6 left-6">
          <span className="px-2 py-2 bg-card backdrop-blur-md text-foreground text-[10px] font-black uppercase tracking-widest rounded-md shadow-sm">
            {post.category}
          </span>
        </div>
      </div>

      <div className="p-3 flex flex-col flex-grow">
        {(post.date || post.author) && (
          <div className="flex items-center gap-4 text-muted-foreground mb-4">
            {post.date && (
              <div className="flex items-center gap-1.5">
                <Clock size={14} />
                <span className="text-[10px] font-bold uppercase tracking-wider">{post.date}</span>
              </div>
            )}
            {post.author && (
              <div className="flex items-center gap-1.5">
                <User size={14} />
                <span className="text-[10px] font-bold uppercase tracking-wider">{post.author}</span>
              </div>
            )}
          </div>
        )}

        <h3 className="text-xl font-black text-foreground mb-4 line-clamp-2 leading-tight">
          {post.title}
        </h3>

        {post.excerpt && (
          <p className="text-muted-foreground text-sm font-medium mb-8 line-clamp-2 leading-relaxed">
            {post.excerpt}
          </p>
        )}

      </div>
    </Link>
  );
};

export default BlogPostCard;
