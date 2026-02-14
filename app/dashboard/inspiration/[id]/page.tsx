"use client";

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Heart, Calendar, MapPin, Copy, Share2, ArrowLeft, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

// Mock data - in a real app this would come from an API or shared data file
const COMMUNITY_EVENTS = [
    { id: 1, user: 'Amina J.', title: 'Lekki Sunrise Proposal', category: 'Proposals', image: 'https://images.unsplash.com/photo-1518135714426-c18f5fe26966?auto=format&fit=crop&q=80&w=800', likes: 242, description: "A romantic sunrise proposal setup on a private terrace overlooking the Lekki-Ikoyi link bridge. Features intimate seating, floral arrangements, and a private chef." },
    { id: 2, user: 'Bode T.', title: 'Q3 Board Retreat', category: 'Corporate', image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80&w=800', likes: 89, description: "Executive quarterly review and strategy session. Held in a serene boardroom environment with breakout areas and premium catering." },
    { id: 3, user: 'Sarah K.', title: 'The Adeleke Wedding', category: 'Weddings', image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=800', likes: 1205, description: "A grand traditional wedding celebration hosting 1000 guests. Vibrant colors, live band, and exquisite cultural decor." },
    { id: 4, user: 'David O.', title: 'Lagos Tech Meetup', category: 'Social', image: 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&q=80&w=800', likes: 45, description: "Monthly gathering of tech enthusiasts, developers, and founders. Networking, lightning talks, and refreshments." },
    { id: 5, user: 'Funke A.', title: 'Minimalist Product Launch', category: 'Events', image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=800', likes: 312, description: "Clean, modern product reveal event. Focus on lighting, sound, and product display stations." },
    { id: 6, user: 'Visual Team', title: 'Community Lagoon Party', category: 'Lagos Vibes', image: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&q=80&w=800', likes: 890, description: "End of year party for the Visual Africa community. Boat cruise, DJ, bbq, and good vibes." },
];

export default function InspirationDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const id = Number(params.id);
    const event = COMMUNITY_EVENTS.find(e => e.id === id);

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

    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-20">
            <Link href="/dashboard/inspiration" className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors">
                <ArrowLeft size={16} />
                Back to Inspiration
            </Link>

            <div className="bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden shadow-sm">
                <div className="h-[400px] w-full relative">
                    <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
                    <div className="absolute top-6 right-6 flex gap-3">
                        <button className="h-10 px-4 bg-white/90 backdrop-blur-sm rounded-xl flex items-center gap-2 text-sm font-bold text-slate-900 hover:bg-white transition-colors shadow-sm">
                            <Share2 size={16} />
                            Share
                        </button>
                        <button className="h-10 px-4 bg-white/90 backdrop-blur-sm rounded-xl flex items-center gap-2 text-sm font-bold text-red-500 hover:bg-white transition-colors shadow-sm">
                            <Heart size={16} fill="currentColor" />
                            {event.likes}
                        </button>
                    </div>
                </div>

                <div className="p-8 md:p-12 space-y-8">
                    <div className="flex flex-col md:flex-row gap-6 justify-between items-start">
                        <div>
                            <span className="text-orange-600 text-[10px] font-black uppercase tracking-widest mb-2 block">{event.category}</span>
                            <h1 className="text-3xl md:text-4xl font-black text-slate-900 mb-2">{event.title}</h1>
                            <div className="flex items-center gap-2 text-sm font-bold text-slate-500">
                                <div className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center text-[8px] font-black">{event.user[0]}</div>
                                Created by {event.user}
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
                                <p className="text-sm text-slate-500 pl-8">4-6 Hours</p>
                            </div>
                            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                                <div className="flex items-center gap-3 mb-1">
                                    <MapPin size={18} className="text-slate-400" />
                                    <span className="font-bold text-slate-900">Setting</span>
                                </div>
                                <p className="text-sm text-slate-500 pl-8">Outdoor / Terrace</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
