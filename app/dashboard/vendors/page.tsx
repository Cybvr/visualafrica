"use client";

import { Search, FileText, TrendingUp, Star, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { VENDOR_DASHBOARD_DATA } from '@/lib/vendor-dashboard-data';
import { SHARED_EVENTS } from '@/lib/shared-data';
import EventCard from '@/components/dashboard/EventCard';

export default function VendorDashboardPage() {
  const router = useRouter();
  const { stats, leads, bookings } = VENDOR_DASHBOARD_DATA;

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-20">
      <div className="space-y-8">
        <div>
          <h2 className="text-3xl font-black tracking-tight text-slate-900">Dashboard Overview</h2>
          <p className="text-slate-500 mt-1">Welcome back. Here's your business at a glance.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Link href="/dashboard/vendors/offers" className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-all group">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <Search size={24} />
              </div>
              <span className="bg-blue-100 text-blue-700 text-[10px] font-black px-2 py-1 rounded-full uppercase tracking-wider">New</span>
            </div>
            <div className="space-y-1">
              <h3 className="text-4xl font-black text-slate-900">{leads.length}</h3>
              <p className="text-sm font-bold text-slate-400 uppercase tracking-wide">Active Offers</p>
            </div>
          </Link>

          <Link href="/dashboard/vendors/contracts" className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-all group">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center group-hover:bg-purple-600 group-hover:text-white transition-colors">
                <FileText size={24} />
              </div>
              <span className="bg-green-100 text-green-700 text-[10px] font-black px-2 py-1 rounded-full uppercase tracking-wider">Active</span>
            </div>
            <div className="space-y-1">
              <h3 className="text-4xl font-black text-slate-900">{stats.activeBookings}</h3>
              <p className="text-sm font-bold text-slate-400 uppercase tracking-wide">Active Contracts</p>
            </div>
          </Link>

          <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-all group cursor-pointer">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center group-hover:bg-orange-600 group-hover:text-white transition-colors">
                <TrendingUp size={24} />
              </div>
              <span className="bg-green-100 text-green-700 text-[10px] font-black px-2 py-1 rounded-full uppercase tracking-wider">+{stats.growth}%</span>
            </div>
            <div className="space-y-1">
              <h3 className="text-4xl font-black text-slate-900">{stats.monthlyRevenue}</h3>
              <p className="text-sm font-bold text-slate-400 uppercase tracking-wide">Monthly Revenue</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-all group cursor-pointer">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-yellow-50 text-yellow-600 rounded-2xl flex items-center justify-center group-hover:bg-yellow-600 group-hover:text-white transition-colors">
                <Star size={24} />
              </div>
              <span className="bg-yellow-100 text-yellow-700 text-[10px] font-black px-2 py-1 rounded-full uppercase tracking-wider">Excellent</span>
            </div>
            <div className="space-y-1">
              <h3 className="text-4xl font-black text-slate-900">{stats.avgRating}</h3>
              <p className="text-sm font-bold text-slate-400 uppercase tracking-wide">Average Rating</p>
            </div>
          </div>
        </div>
      </div>

      {/* Upcoming Events */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
            Upcoming Events <span className="text-lg">✨</span>
          </h3>
          <Link href="/dashboard/vendors/events" className="text-sm font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1">
            View All <ArrowRight size={16} />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {bookings.length > 0 ? (
            bookings.slice(0, 4).map(booking => {
              // Map booking back to a format EventCard expects or update EventCard
              const eventFromShared = SHARED_EVENTS.find(e => e.id === booking.id.split('-')[1]);
              return (
                <EventCard
                  key={booking.id}
                  event={eventFromShared || {
                    id: booking.id,
                    eventName: booking.event,
                    date: booking.date,
                    location: booking.location,
                    image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=800',
                    status: 'Confirmed'
                  } as any}
                  onClick={() => router.push(`/dashboard/vendors/event/${eventFromShared?.id || booking.id}`)}
                />
              )
            })
          ) : (
            <div className="col-span-full text-center py-12 text-slate-400">
              <p className="font-semibold">No upcoming events at the moment.</p>
              <p className="text-sm mt-1">Check back soon for new bookings!</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
