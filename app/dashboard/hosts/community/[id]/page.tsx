"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Heart, Calendar, MapPin, Copy, Share2, ArrowLeft, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { getEventById } from '@/lib/firestore-service';
import { SharedEvent } from '@/lib/types';

export default function InspirationDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;
    const [event, setEvent] = useState<SharedEvent | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function loadEvent() {
            try {
                setEvent(await getEventById(id));
            } catch (error) {
                console.error("Failed to load community event:", error);
            } finally {
                setIsLoading(false);
            }
        }
        loadEvent();
    }, [id]);

    const handleDuplicate = () => {
        toast.success("Event duplicated to your drafts!", {
            description: "You can now edit this event in your dashboard.",
            icon: <CheckCircle2 className="text-green-600" />,
            duration: 3000,
        });
        // In a real app, this would create a new event record and redirect to its edit page
        // router.push('/dashboard/hosts/events/new-id');
    };

    if (isLoading) {
        return <div className="p-10 text-center text-muted-foreground">Loading event...</div>;
    }

    if (!event) {
        return <div className="p-10 text-center text-muted-foreground">Event not found</div>;
    }

    // Generate random likes since it's not in the shared type yet
    const likes = Math.floor(Math.random() * 1000) + 100;

    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-20">
            <Link href="/dashboard/hosts/community" className="inline-flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-foreground transition-colors">
                <ArrowLeft size={16} />
                Back to Community
            </Link>

            <div className="bg-card rounded-[2.5rem] border border-border overflow-hidden shadow-sm">
                <div className="h-[400px] w-full relative">
                    <img src={event.image} alt={event.eventName} className="w-full h-full object-cover" />
                    <div className="absolute top-6 right-6 flex gap-3">
                        <button className="h-10 px-4 bg-card backdrop-blur-sm rounded-xl flex items-center gap-2 text-sm font-bold text-foreground hover:bg-card transition-colors shadow-sm">
                            <Share2 size={16} />
                            Share
                        </button>
                        <button className="h-10 px-4 bg-card backdrop-blur-sm rounded-xl flex items-center gap-2 text-sm font-bold text-red-500 hover:bg-card transition-colors shadow-sm">
                            <Heart size={16} fill="currentColor" />
                            {likes}
                        </button>
                    </div>
                </div>

                <div className="p-8 md:p-12 space-y-8">
                    <div className="flex flex-col md:flex-row gap-6 justify-between items-start">
                        <div>
                            <span className="text-accent text-[10px] font-black uppercase tracking-widest mb-2 block">{event.themes?.[0] || "Event"}</span>
                            <h1 className="text-3xl md:text-4xl font-black text-foreground mb-2">{event.eventName}</h1>
                            <div className="flex items-center gap-2 text-sm font-bold text-muted-foreground">
                                <div className="w-6 h-6 rounded-full bg-background text-white flex items-center justify-center text-[8px] font-black">{event.eventName[0]}</div>
                                Created by Visual User
                            </div>
                        </div>

                        <button
                            onClick={handleDuplicate}
                            className="bg-background text-white px-8 py-4 rounded-xl font-bold flex items-center gap-2 hover:bg-background transition-all hover:scale-105 shadow-xl shadow-slate-900/10 active:scale-95"
                        >
                            <Copy size={18} />
                            Duplicate to My Events
                        </button>
                    </div>

                    {/* Gallery Grid */}
                    {event.publicGallery && event.publicGallery.length > 0 && (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {event.publicGallery.map((img, i) => (
                                <div key={i} className="aspect-square rounded-2xl overflow-hidden bg-card relative group">
                                    <img src={img} alt={`Gallery ${i}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8 border-t border-border">
                        <div className="md:col-span-2 space-y-8">
                            <div>
                                <h3 className="text-lg font-black text-foreground mb-2">About this Inspiration</h3>
                                <p className="text-muted-foreground leading-relaxed text-lg">{event.description}</p>
                            </div>

                            {/* Success Metrics */}
                            {event.metrics && event.metrics.length > 0 && (
                                <div>
                                    <h3 className="text-lg font-black text-foreground mb-4">Success Metrics</h3>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                        {event.metrics.map((metric, i) => (
                                            <div key={i} className="bg-card p-4 rounded-2xl border border-border">
                                                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">{metric.label}</p>
                                                <p className="text-xl font-black text-foreground">{metric.value}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div>
                                <h3 className="text-lg font-black text-foreground mb-4">Vendors Used</h3>
                                <div className="flex flex-wrap gap-3">
                                    {['Photography', 'Catering', 'Decor'].map(tag => (
                                        <span key={tag} className="px-4 py-2 bg-card text-muted-foreground rounded-lg text-sm font-bold">{tag}</span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="p-6 bg-card rounded-2xl border border-border">
                                <div className="flex items-center gap-3 mb-1">
                                    <Calendar size={18} className="text-muted-foreground" />
                                    <span className="font-bold text-foreground">Duration</span>
                                </div>
                                <p className="text-sm text-muted-foreground pl-8">4-6 Hours</p>
                            </div>
                            <div className="p-6 bg-card rounded-2xl border border-border">
                                <div className="flex items-center gap-3 mb-1">
                                    <MapPin size={18} className="text-muted-foreground" />
                                    <span className="font-bold text-foreground">Location</span>
                                </div>
                                <p className="text-sm text-muted-foreground pl-8">{event.location}</p>
                            </div>
                            <div className="p-6 bg-card rounded-2xl border border-border">
                                <div className="flex items-center gap-3 mb-1">
                                    <MapPin size={18} className="text-muted-foreground" />
                                    <span className="font-bold text-foreground">Attendance</span>
                                </div>
                                <p className="text-sm text-muted-foreground pl-8">{event.guestCount ? event.guestCount.toLocaleString('en-US') : 'N/A'}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
