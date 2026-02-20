"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Calendar, Users, Briefcase, Search, Filter, SlidersHorizontal } from 'lucide-react';
import { VENDOR_DASHBOARD_DATA, Booking } from '@/lib/vendor-dashboard-data';
import { SharedEvent } from '@/lib/shared-data';
import { getEvents } from '@/lib/firestore-service';
import { Button } from '@/components/ui/button';
import { DashboardFilter } from '@/components/dashboard/DashboardFilter';

type JobStatus = 'all' | 'pending' | 'offers' | 'active' | 'declined' | 'completed';

// Map booking statuses to job filter categories
function getJobCategory(booking: Booking): JobStatus[] {
    const categories: JobStatus[] = ['all'];

    switch (booking.status) {
        case 'Confirmed':
        case 'Upcoming':
            categories.push('active');
            break;
        case 'Pending Payment':
        case 'Unresolved':
            categories.push('pending');
            break;
        case 'Paid':
        case 'Completed':
            categories.push('completed');
            break;
    }

    return categories;
}

export default function VendorJobsPage() {
    const { bookings } = VENDOR_DASHBOARD_DATA;
    const [allEvents, setAllEvents] = useState<SharedEvent[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeFilter, setActiveFilter] = useState<JobStatus>('all');

    useEffect(() => {
        async function fetchEvents() {
            try {
                const events = await getEvents();
                setAllEvents(events);
            } catch (error) {
                console.error("Error fetching vendor jobs data:", error);
            } finally {
                setIsLoading(false);
            }
        }
        fetchEvents();
    }, []);

    // Calculate real counts based on booking statuses
    const jobCounts = {
        all: bookings.length,
        pending: bookings.filter(b => getJobCategory(b).includes('pending')).length,
        offers: 0,
        active: bookings.filter(b => getJobCategory(b).includes('active')).length,
        declined: 0,
        completed: bookings.filter(b => getJobCategory(b).includes('completed')).length
    };

    const statusConfig = [
        { key: 'all' as JobStatus, label: 'All Jobs', count: jobCounts.all },
        { key: 'pending' as JobStatus, label: 'Pending Reviews', count: jobCounts.pending },
        { key: 'offers' as JobStatus, label: 'Offers Sent', count: jobCounts.offers },
        { key: 'active' as JobStatus, label: 'Active', count: jobCounts.active },
        { key: 'declined' as JobStatus, label: 'Declined', count: jobCounts.declined },
        { key: 'completed' as JobStatus, label: 'Completed', count: jobCounts.completed },
    ];

    // Filter bookings based on active filter
    const filteredBookings = activeFilter === 'all'
        ? bookings
        : bookings.filter(booking => getJobCategory(booking).includes(activeFilter));

    return (
        <div className="max-w-7xl mx-auto space-y-6 pb-16">
            <div className="space-y-4">
                <div>
                    <h2 className="text-4xl font-black tracking-tight text-foreground">My Jobs</h2>
                    <p className="text-muted-foreground mt-1 font-medium">Manage proposals, active jobs, and track your earnings.</p>
                </div>
                <DashboardFilter placeholder="Search jobs by event or client..." />
            </div>

            {/* Filter Tabs */}
            <div className="border-b border-border">
                <div className="flex items-center gap-6 overflow-x-auto pb-px">
                    {statusConfig.map((status) => (
                        <button
                            key={status.key}
                            onClick={() => setActiveFilter(status.key)}
                            className={`pb-3 text-sm font-black transition-all border-b-2 flex items-center gap-2 whitespace-nowrap ${activeFilter === status.key
                                ? 'border-primary text-primary'
                                : 'border-transparent text-muted-foreground hover:text-foreground'
                                }`}
                        >
                            {status.label}
                            <span
                                className={`px-2 py-0.5 rounded-full text-[10px] ${activeFilter === status.key
                                    ? 'bg-primary/10 text-primary'
                                    : 'bg-secondary text-muted-foreground'
                                    }`}
                            >
                                {status.count}
                            </span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Jobs List */}
            <div className="grid grid-cols-1 gap-6">
                {filteredBookings.length > 0 ? (
                    filteredBookings.map((booking) => {
                        const eventFromShared = allEvents.find(e => e.id === booking.id.split('-')[1]);
                        const displayImage = eventFromShared?.image || 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=800';

                        return (
                            <Link
                                key={booking.id}
                                href={`/dashboard/vendors/jobs/${booking.id}`}
                                className="group bg-card border border-border rounded-2xl p-4 flex flex-col md:flex-row gap-6 hover:shadow-lg transition-all hover:border-primary/50 cursor-pointer"
                            >
                                {/* Job Image */}
                                <div className="relative w-full md:w-72 h-48 md:h-auto rounded-xl overflow-hidden shrink-0">
                                    <Image
                                        src={displayImage}
                                        alt={booking.event}
                                        fill
                                        className="object-cover transition-transform duration-500"
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
                                            <span className="text-xs font-bold text-muted-foreground">ID: #{booking.id}</span>
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
                                            <span className="font-bold">{booking.date}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-foreground/80">
                                            <MapPin size={16} className="text-primary" />
                                            <span className="font-bold">{booking.location}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-foreground/80">
                                            <Briefcase size={16} className="text-primary" />
                                            <span className="font-bold">{booking.client}</span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        );
                    })
                ) : (
                    <div className="text-center py-20 bg-card border border-dashed border-border rounded-2xl">
                        <Briefcase size={48} className="mx-auto text-muted-foreground mb-4" />
                        <h3 className="text-xl font-bold text-foreground">
                            {activeFilter === 'pending' && 'No Pending Reviews'}
                            {activeFilter === 'offers' && 'No Offers Sent'}
                            {activeFilter === 'active' && 'No Active Jobs'}
                            {activeFilter === 'declined' && 'No Declined Jobs'}
                            {activeFilter === 'completed' && 'No Completed Jobs'}
                            {activeFilter === 'all' && 'No Jobs Yet'}
                        </h3>
                        <p className="text-muted-foreground mt-2 font-medium">
                            {activeFilter === 'pending' && 'New job requests will appear here for your review.'}
                            {activeFilter === 'offers' && 'Proposals you submit will appear here.'}
                            {activeFilter === 'active' && 'Your confirmed bookings will appear here.'}
                            {activeFilter === 'declined' && 'Jobs you decline or that get rejected will appear here.'}
                            {activeFilter === 'completed' && 'Finished jobs will appear here once marked complete.'}
                            {activeFilter === 'all' && 'When you get booked for events, they will appear here.'}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
