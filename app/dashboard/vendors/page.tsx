"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { doc, getDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { VENDOR_DASHBOARD_DATA } from '@/lib/vendor-dashboard-data';
import { SHARED_EVENTS } from '@/lib/shared-data';
import { DashboardFilter } from '@/components/dashboard/DashboardFilter';
import Image from 'next/image';
import { MapPin, Calendar, Users, Briefcase, Star, Clock } from 'lucide-react';

type EventStatus = 'All Events' | 'Planning' | 'Confirmed' | 'Completed';

export default function VendorDashboardPage() {
  const router = useRouter();
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

  const { stats, leads, bookings } = VENDOR_DASHBOARD_DATA;
  const [activeTab, setActiveTab] = useState<'all' | 'saved'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredEvents = searchQuery.trim() === ''
    ? SHARED_EVENTS
    : SHARED_EVENTS.filter(event =>
      event.eventName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.hostName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.location.toLowerCase().includes(searchQuery.toLowerCase())
    );

  // For demo purposes, we'll just show a subset if tab is 'saved'
  const displayEvents = activeTab === 'all' ? filteredEvents : filteredEvents.slice(0, 2);

  const firstName = displayName.trim().split(/\s+/)[0] || displayName;
  const welcomeText = displayName
    ? `Welcome back, ${firstName}. Here's your business at a glance.`
    : "Welcome back. Here's your business at a glance.";

  return (
    <div className="max-w-7xl mx-auto space-y-12 pb-20">
      <div className="space-y-8">
        <div className="space-y-6 mb-10">
          <DashboardFilter
            placeholder="Search for event themes, locations, or hosts..."
            onSearchChange={setSearchQuery}
          />
        </div>

        <div className="flex items-center gap-3 border-b border-border mb-8">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-8 py-4 text-sm font-black transition-all border-b-2 -mb-[2px] ${activeTab === 'all'
              ? 'border-primary text-foreground'
              : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
          >
            All
          </button>
          <button
            onClick={() => setActiveTab('saved')}
            className={`px-8 py-4 text-sm font-black transition-all border-b-2 -mb-[2px] ${activeTab === 'saved'
              ? 'border-primary text-foreground'
              : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
          >
            Saved Events
          </button>
        </div>



        {displayEvents.length > 0 ? (
          <div className="grid grid-cols-1 gap-6">
            {displayEvents.map(event => (
              <Link
                key={event.id}
                href={`/dashboard/vendors/opportunities/${event.id}`}
                className="group bg-card border border-border rounded-3xl p-4 flex flex-col md:flex-row gap-6 hover:shadow-lg transition-all hover:border-primary/50 cursor-pointer"
              >
                <div className="relative w-full md:w-72 h-48 md:h-auto rounded-2xl overflow-hidden shrink-0">
                  <Image
                    src={event.image || '/placeholder.png'}
                    alt={event.eventName}
                    fill
                    className="object-cover transition-transform duration-500 "
                  />
                  <div className="absolute top-4 right-4 z-10">
                    <button className="w-10 h-10 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center text-muted-foreground shadow-lg transition-colors">
                      <Star size={20} />
                    </button>
                  </div>
                </div>

                <div className="flex-1 py-2 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-widest rounded-full">
                        {event.status}
                      </span>

                    </div>
                    <h3 className="text-2xl font-bold text-foreground mb-2 ">
                      {event.eventName}
                    </h3>
                    <p className="text-muted-foreground text-sm line-clamp-2 max-w-2xl">
                      {event.description}
                    </p>

                    {(event.categories || event.themes) && (
                      <div className="flex flex-wrap gap-2 mt-4">
                        {event.categories?.map((cat, idx) => (
                          <span key={idx} className="px-2 py-0.5 bg-card text-foreground-600 text-[10px] font-bold rounded-md">
                            {cat}
                          </span>
                        ))}
                        {event.themes?.map((theme, idx) => (
                          <span key={idx} className="px-2 py-0.5 bg-primary/5 text-primary/70 text-[10px] font-bold rounded-md border border-primary/10 italic">
                            {theme}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-6 mt-6 pt-6 border-t border-border">
                    <div className="flex items-center gap-2 text-sm font-bold text-foreground/80">
                      <Calendar size={16} className="text-primary" />
                      {event.date}
                    </div>
                    <div className="flex items-center gap-2 text-sm font-bold text-foreground/80">
                      <MapPin size={16} className="text-primary" />
                      {event.location}
                    </div>
                    <div className="flex items-center gap-2 text-sm font-bold text-foreground/80">
                      <Users size={16} className="text-primary" />
                      {event.guestCount} Guests
                    </div>
                    <div className="flex items-center gap-2 text-sm font-bold text-foreground/80">
                      <Briefcase size={16} className="text-primary" />
                      {event.hostName}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-card rounded-[2rem] border border-border">
            <div className="text-muted-foreground space-y-2">
              <p className="text-lg font-bold text-foreground">No events found</p>
              <p className="text-sm">
                {activeTab === 'saved' ? "You haven't saved any events yet." : 'Check back soon for new opportunities!'}
              </p>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
