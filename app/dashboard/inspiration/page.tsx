"use client";

import React from 'react';
import { Eye, Heart, MessageSquare } from 'lucide-react';
import Link from 'next/link';

const COMMUNITY_EVENTS = [
  { id: 1, user: 'Amina J.', title: 'Lekki Sunrise Proposal', category: 'Proposals', image: 'https://images.unsplash.com/photo-1518135714426-c18f5fe26966?auto=format&fit=crop&q=80&w=800', likes: 242 },
  { id: 2, user: 'Bode T.', title: 'Q3 Board Retreat', category: 'Corporate', image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80&w=800', likes: 89 },
  { id: 3, user: 'Sarah K.', title: 'The Adeleke Wedding', category: 'Weddings', image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=800', likes: 1205 },
  { id: 4, user: 'David O.', title: 'Lagos Tech Meetup', category: 'Social', image: 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&q=80&w=800', likes: 45 },
  { id: 5, user: 'Funke A.', title: 'Minimalist Product Launch', category: 'Events', image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=800', likes: 312 },
  { id: 6, user: 'Visual Team', title: 'Community Lagoon Party', category: 'Lagos Vibes', image: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&q=80&w=800', likes: 890 },
];

const Inspiration: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div>
        <h2 className="text-3xl font-black tracking-tight text-slate-900">Community Inspiration</h2>
        <p className="text-slate-500 mt-1">Discover public events organized by other VisualAfrica users.</p>
      </div>

      <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
        {COMMUNITY_EVENTS.map(item => (
          <Link href={`/dashboard/inspiration/${item.id}`} key={item.id} className="block relative rounded-[2rem] overflow-hidden group break-inside-avoid shadow-sm hover:shadow-2xl transition-all border border-slate-100 bg-white">
            <div className="p-4 flex items-center gap-3 border-b border-slate-50">
              <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px] font-black">{item.user[0]}</div>
              <span className="text-xs font-bold text-slate-900">{item.user}</span>
            </div>
            <img src={item.image} alt={item.title} className="w-full h-auto object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all duration-700" />
            <div className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-orange-600 text-[10px] font-black uppercase tracking-widest">{item.category}</span>
                <div className="flex items-center gap-1.5 text-slate-400">
                  <Heart size={14} />
                  <span className="text-[10px] font-bold">{item.likes}</span>
                </div>
              </div>
              <h3 className="text-slate-900 font-black text-lg group-hover:text-orange-600 transition-colors">{item.title}</h3>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Inspiration;
