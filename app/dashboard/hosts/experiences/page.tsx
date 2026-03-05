"use client";

import React, { useState, useEffect } from 'react';
import { Search, Filter, Sparkles } from 'lucide-react';
import { type Experience } from '@/lib/types';
import { ExperienceCard } from '@/components/dashboard/experience-card';
import { useSavedVendors } from '@/hooks/use-saved-vendors';
import { useAuth } from '@/components/providers/auth-provider';
import { getExperiences } from '@/lib/firestore-service';

const ExperiencesPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'saved'>('all');
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const { savedVendorIds, toggleSavedVendor } = useSavedVendors(user?.uid);

  useEffect(() => {
    async function fetchExperiences() {
      try {
        const data = await getExperiences();
        setExperiences(data || []);
      } catch (error) {
        console.error('Error fetching experiences data:', error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchExperiences();
  }, []);

  const savedExperiences = experiences.filter((e) => savedVendorIds.has(e.id));
  const displayExperiences = activeTab === 'saved' ? savedExperiences : experiences;

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto space-y-10 pb-20">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 animate-pulse">
          <div className="space-y-3">
            <div className="h-4 w-32 bg-muted rounded" />
            <div className="h-10 w-64 bg-muted rounded" />
            <div className="h-4 w-80 bg-muted rounded" />
          </div>
          <div className="flex items-center gap-3">
            <div className="h-14 w-80 bg-muted rounded-2xl" />
            <div className="h-14 w-14 bg-muted rounded-2xl" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="aspect-[4/5] bg-muted animate-pulse rounded-[2rem]" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-10 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="text-primary" size={20} />
            <span className="text-primary text-[10px] font-black uppercase tracking-widest">Premium Branded</span>
          </div>
          <h2 className="text-4xl font-serif font-black tracking-tight text-foreground">Experiences</h2>
          <p className="text-muted-foreground font-medium mt-1">Ultra-exclusive curated events and activity packages.</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative group">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <input
              type="text"
              placeholder="Search experiences..."
              className="pl-12 pr-6 py-4 bg-white border border-border rounded-2xl w-full md:w-80 font-bold focus:ring-2 focus:ring-primary/20 outline-none transition-all shadow-sm"
            />
          </div>
          <button className="p-4 bg-white border border-border rounded-2xl text-muted-foreground hover:text-primary transition-all shadow-sm">
            <Filter size={20} />
          </button>
        </div>
      </div>

      <div className="flex items-center border-b border-border">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-8 py-4 text-sm font-black transition-all border-b-2 ${activeTab === 'all' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-muted-foreground'
            }`}
        >
          All Experiences
        </button>
        <button
          onClick={() => setActiveTab('saved')}
          className={`px-8 py-4 text-sm font-black transition-all border-b-2 ${activeTab === 'saved' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-muted-foreground'
            }`}
        >
          Saved
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-12 items-stretch">
        {displayExperiences.map((exp) => (
          <div key={exp.id} className="block h-full transition-transform hover:scale-[1.02]">
            <ExperienceCard
              experience={exp}
              experienceHref={`/dashboard/hosts/vendor/${exp.vendorSlug}`}
              saved={savedVendorIds.has(exp.id)}
              onToggleSave={() => toggleSavedVendor(exp.id)}
            />
          </div>
        ))}

        {displayExperiences.length === 0 && (
          <div className="col-span-full relative overflow-hidden rounded-lg border border-border bg-card p-20 text-center">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full translate-x-1/2 -translate-y-1/2 blur-3xl" />
            <div className="relative space-y-6">
              <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto text-primary rotate-6">
                <Sparkles size={40} />
              </div>
              <div>
                <h3 className="text-2xl font-black text-foreground">No Experiences Found</h3>
                <p className="text-muted-foreground max-w-sm mx-auto mt-2">
                  We're still curating our list of ultra-exclusive experiences. Check back soon for something extraordinary.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExperiencesPage;
