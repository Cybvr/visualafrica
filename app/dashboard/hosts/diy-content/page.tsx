"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Filter, ArrowRight, Clock, User } from 'lucide-react';
import { BlogPost } from '@/lib/types';
import BlogPostCard from '@/components/dashboard/BlogPostCard';
import { getBlogPosts } from '@/lib/firestore-service';

const DIYContent: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const data = await getBlogPosts();
        setPosts(data);
      } catch (error) {
        console.error("Error fetching DIY content:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchPosts();
  }, []);

  if (isLoading) return <div className="p-10 text-center">Loading DIY resources...</div>;
  return (
    <div className="max-w-7xl mx-auto space-y-10 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black tracking-tight text-foreground">DIY Resources</h2>
          <p className="text-muted-foreground font-medium mt-1">Expert guides and templates to master your event planning.</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-accent transition-colors" size={18} />
            <input
              type="text"
              placeholder="Search resources..."
              className="pl-12 pr-6 py-4 bg-card border border-border rounded-2xl w-full md:w-80 font-bold focus:ring-2 focus:ring-primary outline-none transition-all shadow-sm"
            />
          </div>
          <button className="p-4 bg-card border border-border rounded-2xl text-muted-foreground hover:text-accent transition-all shadow-sm">
            <Filter size={20} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.map((post) => (
          <BlogPostCard key={post.id} post={post} variant="full" />
        ))}
      </div>
    </div>
  );
};

export default DIYContent;
