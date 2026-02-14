"use client";

import React from 'react';
import Link from 'next/link';
import { Search, Filter, ArrowRight, Clock, User } from 'lucide-react';
import { BLOG_POSTS } from '@/lib/blog-data';

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
          <Link
            href={`/dashboard/diy-content/${post.id}`}
            key={post.id}
            className="group flex flex-col bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden hover:shadow-2xl hover:-translate-y-2 transition-all duration-500"
          >
            <div className="aspect-[16/10] relative overflow-hidden">
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute top-6 left-6">
                <span className="px-4 py-2 bg-white/90 backdrop-blur-md text-orange-600 text-[10px] font-black uppercase tracking-widest rounded-xl shadow-sm">
                  {post.category}
                </span>
              </div>
            </div>

            <div className="p-8 flex flex-col flex-grow">
              <div className="flex items-center gap-4 text-slate-400 mb-4">
                <div className="flex items-center gap-1.5">
                  <Clock size={14} />
                  <span className="text-[10px] font-bold uppercase tracking-wider">{post.date}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <User size={14} />
                  <span className="text-[10px] font-bold uppercase tracking-wider">{post.author}</span>
                </div>
              </div>

              <h3 className="text-xl font-black text-slate-900 group-hover:text-orange-600 transition-colors mb-4 line-clamp-2 leading-tight">
                {post.title}
              </h3>

              <p className="text-slate-500 text-sm font-medium mb-8 line-clamp-2 leading-relaxed">
                {post.excerpt}
              </p>

              <div className="mt-auto flex items-center gap-2 text-orange-600 font-black text-xs uppercase tracking-widest">
                Read Article <ArrowRight size={16} />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default DIYContent;
