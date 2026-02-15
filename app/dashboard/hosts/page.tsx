"use client";

import React, { useState, useEffect } from 'react';
import { Calendar, FileText, Clock, Star, ArrowRight, ExternalLink, Heart } from 'lucide-react';
import Link from 'next/link';
import { doc, getDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { vendors } from '@/lib/vendors-data';
import { BLOG_POSTS } from '@/lib/blog-data';
import { EVENTS } from '@/lib/events-data';
import { SHARED_EVENTS } from '@/lib/shared-data';
import { MOCK_EVENTS } from '@/lib/event-data';
import BlogPostCard from '@/components/dashboard/BlogPostCard';
import VendorPreviewCard from '@/components/dashboard/VendorPreviewCard';

export default function DashboardPage() {
  const [displayName, setDisplayName] = useState<string>('');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        setDisplayName('');
        return;
      }
      try {
        const userDocRef = doc(db, 'users', currentUser.uid);
        const userDoc = await getDoc(userDocRef);
        const name = userDoc.exists()
          ? (userDoc.data().displayName || currentUser.displayName || '')
          : (currentUser.displayName || '');
        setDisplayName(name);
      } catch {
        setDisplayName(currentUser.displayName || '');
      }
    });
    return () => unsubscribe();
  }, []);

  const trendingVendors = vendors.slice(0, 4);
  const recommendedPosts = BLOG_POSTS.slice(0, 4);
  const publicEvents = MOCK_EVENTS.filter(event => event.showCommunityInspiration).slice(0, 3);

  const firstName = displayName.trim().split(/\s+/)[0] || displayName;
  const welcomeText = displayName
    ? `Welcome back, ${firstName}. Here's what's happening today.`
    : "Welcome back. Here's what's happening today.";

  return (
    <div className="max-w-7xl mx-auto space-y-16 pb-20">
      <div className="space-y-4">
        <div>
          <h2 className="text-4xl font-black tracking-tight text-foreground">Home</h2>
          <p className="text-muted-foreground mt-1 text-lg font-medium">{welcomeText}</p>
        </div>
      </div>

      {/* Hottest New Vendors */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-black text-foreground flex items-center gap-2">
            Hottest New Vendors <span className="text-lg">🔥</span>
          </h3>
          <Link href="/dashboard/hosts/vendors" className="text-sm font-bold text-accent hover:text-primary flex items-center gap-1">
            Browse All <ArrowRight size={16} />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {trendingVendors.map(vendor => (
            <VendorPreviewCard key={vendor.id} vendor={vendor} />
          ))}
        </div>
      </section>

      {/* Community */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-black text-foreground flex items-center gap-2">
            Community <span className="text-lg">✨</span>
          </h3>
          <Link href="/dashboard/hosts/community" className="text-sm font-bold text-accent flex items-center gap-1">
            View More <ArrowRight size={16} />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {publicEvents.map(item => (
            <Link href={`/dashboard/hosts/community/${item.id}`} key={item.id} className="block relative rounded-[2.5rem] overflow-hidden group shadow-sm hover:shadow-2xl transition-all border border-border bg-card">
              <div className="p-4 flex items-center gap-3 border-b border-border">
                <div className="w-8 h-8 rounded-full bg-background text-foreground flex items-center justify-center text-[10px] font-black">{item.name[0]}</div>
                <span className="text-xs font-bold text-foreground">Visual User</span>
              </div>
              <div className="aspect-[16/10] overflow-hidden">
                <img src={item.thumbnail} alt={item.name} className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all duration-700" />
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-accent text-[10px] font-black uppercase tracking-widest text-ellipsis overflow-hidden whitespace-nowrap max-w-[100px]">{item.theme}</span>
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Heart size={14} />
                    <span className="text-[10px] font-bold">{Math.floor(Math.random() * 500) + 50}</span>
                  </div>
                </div>
                <h3 className="text-foreground font-black text-lg group-hover:text-accent transition-colors">{item.name}</h3>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Recommended Resources */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-black text-foreground">Recommended Resources</h3>
          <Link href="/dashboard/hosts/diy-content" className="text-sm font-bold text-accent  flex items-center gap-1">
            View All <ArrowRight size={16} />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {recommendedPosts.map(post => (
            <BlogPostCard key={post.id} post={post} variant="compact" />
          ))}
        </div>
      </section>
    </div>
  );
}
