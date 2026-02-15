"use client";

import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Calendar, Users, Briefcase, Search, Filter, SlidersHorizontal } from 'lucide-react';
import { VENDOR_DASHBOARD_DATA } from '@/lib/vendor-dashboard-data';
import { SHARED_EVENTS } from '@/lib/shared-data';
import { Button } from '@/components/ui/button';
import { DashboardFilter } from '@/components/dashboard/DashboardFilter';

export default function VendorJobsPage() {
    const { bookings } = VENDOR_DASHBOARD_DATA;

    return (
        <div className="max-w-7xl mx-auto space-y-10 pb-20">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
                <div>
                    <h2 className="text-4xl font-black tracking-tight text-foreground">My Jobs</h2>
                    <p className="text-muted-foreground mt-1 font-medium italic">Manage all your confirmed bookings and upcoming events.</p>
                </div>
                <DashboardFilter placeholder="Search jobs by event or client..." />
            </div>

            <div className="grid grid-cols-1 gap-6">
                {bookings.length > 0 ? (
                    bookings.map((booking) => {
                        const eventFromShared = SHARED_EVENTS.find(e => e.id === booking.id.split('-')[1]);
                        const displayImage = eventFromShared?.image || 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=800';

                        return (
                            <Link
                                key={booking.id}
                                href={`/dashboard/vendors/jobs/${booking.id}`}
                                className="group bg-card border border-border rounded-3xl p-4 flex flex-col md:flex-row gap-6 hover:shadow-lg transition-all hover:border-primary/50 cursor-pointer"
                            >
                                {/* Job Image */}
                                <div className="relative w-full md:w-72 h-48 md:h-auto rounded-2xl overflow-hidden shrink-0">
                                    <Image
                                        src={displayImage}
                                        alt={booking.event}
                                        fill
                                        className="object-cover transition-transform duration-500 "
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent md:hidden" />
                                    <div className="absolute bottom-4 left-4 text-white md:hidden">
                                        <span className="px-2 py-1 bg-primary text-[10px] font-bold uppercase tracking-widest rounded-md">
                                            {booking.status}
                                        </span>
                                    </div>
                                </div>

                                {/* Job Info */}
                                <div className="flex-1 py-2 flex flex-col justify-between">
                                    <div>
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="hidden md:inline-block px-3 py-1 bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-widest rounded-full">
                                                {booking.status}
                                            </span>
                                            <span className="text-xs font-medium text-muted-foreground">ID: #{booking.id}</span>
                                        </div>
                                        <h3 className="text-2xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                                            {booking.event}
                                        </h3>
                                        <p className="text-muted-foreground text-sm line-clamp-2 max-w-2xl">
                                            Booked for {booking.client}. Project amount: {booking.amount}
                                        </p>
                                    </div>

                                    <div className="flex items-center gap-6 mt-6 pt-6 border-t border-border">
                                        <div className="flex items-center gap-2 text-sm text-foreground/80">
                                            <Calendar size={16} className="text-primary" />
                                            <span className="font-semibold">{booking.date}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-foreground/80">
                                            <MapPin size={16} className="text-primary" />
                                            <span className="font-semibold">{booking.location}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-foreground/80">
                                            <Briefcase size={16} className="text-primary" />
                                            <span className="font-semibold">{booking.client}</span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        );
                    })
                ) : (
                    <div className="text-center py-20 bg-card border border-dashed border-border rounded-[3rem]">
                        <Briefcase size={48} className="mx-auto text-muted-foreground mb-4" />
                        <h3 className="text-xl font-bold text-foreground italic">No jobs yet</h3>
                        <p className="text-muted-foreground mt-2 font-medium">When you get booked for events, they will appear here.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
