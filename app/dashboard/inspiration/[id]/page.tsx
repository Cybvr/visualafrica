"use client";

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Heart, Calendar, MapPin, Copy, Share2, ArrowLeft, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { MOCK_EVENTS } from '@/lib/event-data';

export default function InspirationDetailsPage() {
    const params = useParams();
    const router = useRouter();
    // ID in event-data is string
    const id = params.id as string;
    const event = MOCK_EVENTS.find(e => e.id === id);

    const handleDuplicate = () => {
        toast.success("Event duplicated to your drafts!", {
            description: "You can now edit this event in your dashboard.",
            icon: <CheckCircle2 className="text-green-600" />,
            duration: 3000,
        });
        // In a real app, this would create a new event record and redirect to its edit page
        // router.push('/dashboard/events/new-id');
    };

    if (!event) {
        return <div className="p-10 text-center text-slate-500">Event not found</div>;
    }

    // Generate random likes since it's not in the shared type yet
    const likes = Math.floor(Math.random() * 1000) + 100;

    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-20">
            <Link href="/dashboard/inspiration" className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors">
                <ArrowLeft size={16} />
                Back to Inspiration
            </Link>

            <div className="bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden shadow-sm">
                <div className="h-[400px] w-full relative">
                    <img src={event.thumbnail} alt={event.name} className="w-full h-full object-cover" />
                    <div className="absolute top-6 right-6 flex gap-3">
                        <button className="h-10 px-4 bg-white/90 backdrop-blur-sm rounded-xl flex items-center gap-2 text-sm font-bold text-slate-900 hover:bg-white transition-colors shadow-sm">
                            <Share2 size={16} />
                            Share
                        </button>
                        <button className="h-10 px-4 bg-white/90 backdrop-blur-sm rounded-xl flex items-center gap-2 text-sm font-bold text-red-500 hover:bg-white transition-colors shadow-sm">
                            <Heart size={16} fill="currentColor" />
                            {likes}
                        </button>
                    </div>
                </div>

                <div className="p-8 md:p-12 space-y-8">
                    <div className="flex flex-col md:flex-row gap-6 justify-between items-start">
                        <div>
                            <span className="text-orange-600 text-[10px] font-black uppercase tracking-widest mb-2 block">{event.theme}</span>
                            <h1 className="text-3xl md:text-4xl font-black text-slate-900 mb-2">{event.name}</h1>
                            <div className="flex items-center gap-2 text-sm font-bold text-slate-500">
                                <div className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center text-[8px] font-black">{event.name[0]}</div>
                                Created by Visual User
                            </div>
                        </div>

                        <button
                            onClick={handleDuplicate}
                            className="bg-slate-900 text-white px-8 py-4 rounded-xl font-bold flex items-center gap-2 hover:bg-slate-800 transition-all hover:scale-105 shadow-xl shadow-slate-900/10 active:scale-95"
                        >
                            <Copy size={18} />
                            Duplicate to My Events
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8 border-t border-slate-100">
                        <div className="md:col-span-2 space-y-6">
                            <div>
                                <h3 className="text-lg font-black text-slate-900 mb-2">About this Inspiration</h3>
                                <p className="text-slate-600 leading-relaxed">{event.description}</p>
                            </div>

                            <div>
                                <h3 className="text-lg font-black text-slate-900 mb-4">Vendors Used</h3>
                                <div className="flex flex-wrap gap-3">
                                    {['Photography', 'Catering', 'Decor'].map(tag => (
                                        <span key={tag} className="px-4 py-2 bg-slate-100 text-slate-600 rounded-lg text-sm font-bold">{tag}</span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                                <div className="flex items-center gap-3 mb-1">
                                    <Calendar size={18} className="text-slate-400" />
                                    <span className="font-bold text-slate-900">Duration</span>
                                </div>
                                <p className="text-sm text-slate-500 pl-8">2 Days</p>
                            </div>
                            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                                <div className="flex items-center gap-3 mb-1">
                                    <MapPin size={18} className="text-slate-400" />
                                    <span className="font-bold text-slate-900">Location</span>
                                </div>
                                <p className="text-sm text-slate-500 pl-8">{event.location}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
