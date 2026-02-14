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
        <div className="rounded-2xl overflow-hidden aspect-[4/3] mb-3 relative">
          <img
            src={imgSrc}
            alt={post.title}
            onError={handleImageError}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute top-3 left-3 bg-black/50 backdrop-blur-md text-white text-[10px] font-black px-2 py-1 rounded-full uppercase tracking-wider">
            {post.category}
          </div>
        </div>
        <h4 className="font-bold text-slate-900 group-hover:text-orange-600 transition-colors line-clamp-2">
          {post.title}
        </h4>
      </Link>
    );
  }

  return (
    <Link
      href={`${basePath}/${post.id}`}
      className="group flex flex-col bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden hover:shadow-2xl hover:-translate-y-2 transition-all duration-500"
    >
      <div className="aspect-[16/10] relative overflow-hidden">
        <img
          src={imgSrc}
          alt={post.title}
          onError={handleImageError}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />
        <div className="absolute top-6 left-6">
          <span className="px-4 py-2 bg-white/90 backdrop-blur-md text-orange-600 text-[10px] font-black uppercase tracking-widest rounded-xl shadow-sm">
            {post.category}
          </span>
        </div>
      </div>

      <div className="p-8 flex flex-col flex-grow">
        {(post.date || post.author) && (
          <div className="flex items-center gap-4 text-slate-400 mb-4">
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

        <h3 className="text-xl font-black text-slate-900 group-hover:text-orange-600 transition-colors mb-4 line-clamp-2 leading-tight">
          {post.title}
        </h3>

        {post.excerpt && (
          <p className="text-slate-500 text-sm font-medium mb-8 line-clamp-2 leading-relaxed">
            {post.excerpt}
          </p>
        )}

        <div className="mt-auto flex items-center gap-2 text-orange-600 font-black text-xs uppercase tracking-widest">
          Read Article <ArrowRight size={16} />
        </div>
      </div>
    </Link>
  );
};

export default BlogPostCard;
