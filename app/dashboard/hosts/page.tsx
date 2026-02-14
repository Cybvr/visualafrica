"use client";

import React from 'react';
import { Calendar, FileText, Clock, Star, ArrowRight, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { vendors } from '@/lib/vendors-data';
import { BLOG_POSTS } from '@/lib/blog-data';
import { EVENTS } from '@/lib/events-data';
import { SHARED_EVENTS } from '@/lib/shared-data';
import BlogPostCard from '@/components/dashboard/BlogPostCard';
import VendorPreviewCard from '@/components/dashboard/VendorPreviewCard';

export default function DashboardPage() {
  const trendingVendors = vendors.slice(0, 4);
  const recommendedPosts = BLOG_POSTS.slice(0, 4);

  // Dynamic data calculation
  const upcomingEventsCount = EVENTS.length;
  const activeContractsCount = SHARED_EVENTS.reduce((acc, event) => acc + event.bookedVendors.length, 0);

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-20">
      <div className="space-y-8">
        <div>
          <h2 className="text-3xl font-black tracking-tight text-slate-900">Dashboard Overview</h2>
          <p className="text-slate-500 mt-1">Welcome back, Tunde. Here's what's happening today.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link href="/dashboard/hosts/events" className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-all group">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center group-hover:bg-orange-600 group-hover:text-white transition-colors">
                <Calendar size={24} />
              </div>
              <span className="bg-green-100 text-green-700 text-[10px] font-black px-2 py-1 rounded-full uppercase tracking-wider">Active</span>
            </div>
            <div className="space-y-1">
              <h3 className="text-4xl font-black text-slate-900">{upcomingEventsCount}</h3>
              <p className="text-sm font-bold text-slate-400 uppercase tracking-wide">Upcoming Events</p>
            </div>
          </Link>

          <Link href="/dashboard/hosts/events" className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-all group">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center group-hover:bg-purple-600 group-hover:text-white transition-colors">
                <FileText size={24} />
              </div>
              <span className="bg-slate-100 text-slate-600 text-[10px] font-black px-2 py-1 rounded-full uppercase tracking-wider">Signed</span>
            </div>
            <div className="space-y-1">
              <h3 className="text-4xl font-black text-slate-900">{activeContractsCount}</h3>
              <p className="text-sm font-bold text-slate-400 uppercase tracking-wide">Active Contracts</p>
            </div>
          </Link>
        </div>
      </div>

      {/* Recommended Resources */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-black text-slate-900">Recommended Resources</h3>
          <Link href="/dashboard/hosts/diy-content" className="text-sm font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1">
            View All <ArrowRight size={16} />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {recommendedPosts.map(post => (
            <BlogPostCard key={post.id} post={post} variant="compact" />
          ))}
        </div>
      </section>

      {/* Hottest New Vendors */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
            Hottest New Vendors <span className="text-lg">🔥</span>
          </h3>
          <Link href="/dashboard/hosts/vendors" className="text-sm font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1">
            Browse All <ArrowRight size={16} />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {trendingVendors.map(vendor => (
            <VendorPreviewCard key={vendor.id} vendor={vendor} />
          ))}
        </div>
      </section>
    </div>
  );
}
