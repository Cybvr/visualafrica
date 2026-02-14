"use client";

import React from 'react';
import { Calendar, FileText, Clock, Star, ArrowRight, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { vendors } from '@/lib/vendors-data';
import { BLOG_POSTS } from '@/lib/blog-data';

export default function DashboardPage() {
  const trendingVendors = vendors.slice(0, 4); // Just take the first 4 for now
  const recommendedPosts = BLOG_POSTS.slice(0, 4);

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-20">
      <div className="space-y-8">
        <div>
          <h2 className="text-3xl font-black tracking-tight text-slate-900">Dashboard Overview</h2>
          <p className="text-slate-500 mt-1">Welcome back, John. Here's what's happening today.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link href="/dashboard/events" className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-all group">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center group-hover:bg-orange-600 group-hover:text-white transition-colors">
                <Calendar size={24} />
              </div>
              <span className="bg-green-100 text-green-700 text-[10px] font-black px-2 py-1 rounded-full uppercase tracking-wider">Active</span>
            </div>
            <div className="space-y-1">
              <h3 className="text-4xl font-black text-slate-900">3</h3>
              <p className="text-sm font-bold text-slate-400 uppercase tracking-wide">Upcoming Events</p>
            </div>
          </Link>

          <Link href="/dashboard/contracts" className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-all group">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center group-hover:bg-purple-600 group-hover:text-white transition-colors">
                <FileText size={24} />
              </div>
              <span className="bg-slate-100 text-slate-600 text-[10px] font-black px-2 py-1 rounded-full uppercase tracking-wider">Signed</span>
            </div>
            <div className="space-y-1">
              <h3 className="text-4xl font-black text-slate-900">5</h3>
              <p className="text-sm font-bold text-slate-400 uppercase tracking-wide">Active Contracts</p>
            </div>
          </Link>

          <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-all group cursor-pointer">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <Clock size={24} />
              </div>
              <span className="bg-red-100 text-red-600 text-[10px] font-black px-2 py-1 rounded-full uppercase tracking-wider">Action Needed</span>
            </div>
            <div className="space-y-1">
              <h3 className="text-4xl font-black text-slate-900">2</h3>
              <p className="text-sm font-bold text-slate-400 uppercase tracking-wide">Pending Tasks</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recommended Resources */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-black text-slate-900">Recommended Resources</h3>
          <Link href="/dashboard/diy-content" className="text-sm font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1">
            View All <ArrowRight size={16} />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {recommendedPosts.map(post => (
            <Link href={`/dashboard/diy-content/${post.id}`} key={post.id} className="group cursor-pointer">
              <div className="rounded-2xl overflow-hidden aspect-[4/3] mb-3 relative">
                <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute top-3 left-3 bg-black/50 backdrop-blur-md text-white text-[10px] font-black px-2 py-1 rounded-full uppercase tracking-wider">
                  {post.category}
                </div>
              </div>
              <h4 className="font-bold text-slate-900 group-hover:text-orange-600 transition-colors line-clamp-2">{post.title}</h4>
            </Link>
          ))}
        </div>
      </section>

      {/* Hottest New Vendors */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
            Hottest New Vendors <span className="text-lg">🔥</span>
          </h3>
          <Link href="/dashboard/vendors" className="text-sm font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1">
            Browse All <ArrowRight size={16} />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {trendingVendors.map(vendor => (
            <Link href={`/dashboard/vendor/${vendor.slug}`} key={vendor.id} className="bg-white p-4 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-lg transition-all group">
              <div className="rounded-2xl overflow-hidden aspect-square mb-4 relative">
                <img src={vendor.image} alt={vendor.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                {vendor.featured && (
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-orange-600 p-1.5 rounded-full shadow-sm">
                    <Star size={12} fill="currentColor" />
                  </div>
                )}
              </div>
              <div>
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{vendor.categories[0]}</div>
                <h4 className="font-bold text-slate-900 group-hover:text-orange-600 transition-colors truncate">{vendor.name}</h4>
                <div className="flex items-center gap-1 mt-1">
                  <Star size={14} className="text-yellow-400" fill="currentColor" />
                  <span className="text-xs font-bold text-slate-700">{vendor.rating}</span>
                  <span className="text-xs text-slate-400">• {vendor.location.split(',')[0]}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
