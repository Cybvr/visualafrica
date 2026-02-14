"use client";

import React from 'react';
import Link from 'next/link';
import { Search, Filter, ArrowRight, Clock, User } from 'lucide-react';
import { BLOG_POSTS } from '@/lib/blog-data';
import BlogPostCard from '@/components/dashboard/BlogPostCard';

const DIYContent: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto space-y-10 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black tracking-tight text-slate-900">DIY Resources</h2>
          <p className="text-slate-500 font-medium mt-1">Expert guides and templates to master your event planning.</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-orange-600 transition-colors" size={18} />
            <input
              type="text"
              placeholder="Search resources..."
              className="pl-12 pr-6 py-4 bg-white border border-slate-100 rounded-2xl w-full md:w-80 font-bold focus:ring-2 focus:ring-orange-600 outline-none transition-all shadow-sm"
            />
          </div>
          <button className="p-4 bg-white border border-slate-100 rounded-2xl text-slate-600 hover:text-orange-600 transition-all shadow-sm">
            <Filter size={20} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {BLOG_POSTS.map((post) => (
          <BlogPostCard key={post.id} post={post} variant="full" />
        ))}
      </div>
    </div>
  );
};

export default DIYContent;
