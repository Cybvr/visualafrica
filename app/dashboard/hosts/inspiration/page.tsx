"use client";

import React from 'react';
import { Eye, Heart, MessageSquare } from 'lucide-react';
import Link from 'next/link';
import { MOCK_EVENTS } from '@/lib/event-data';

const Inspiration: React.FC = () => {
  const publicEvents = MOCK_EVENTS.filter(event => event.showCommunityInspiration);

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div>
        <h2 className="text-3xl font-black tracking-tight text-slate-900">Community Inspiration</h2>
        <p className="text-slate-500 mt-1">Discover public events organized by other VisualAfrica users.</p>
      </div>

      <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
        {publicEvents.map(item => (
          <Link href={`/dashboard/hosts/inspiration/${item.id}`} key={item.id} className="block relative rounded-[2rem] overflow-hidden group break-inside-avoid shadow-sm hover:shadow-2xl transition-all border border-slate-100 bg-white">
            <div className="p-4 flex items-center gap-3 border-b border-slate-50">
              <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px] font-black">{item.name[0]}</div>
              <span className="text-xs font-bold text-slate-900">Visual User</span>
            </div>
            <img src={item.thumbnail} alt={item.name} className="w-full h-auto object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all duration-700" />
            <div className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-orange-600 text-[10px] font-black uppercase tracking-widest text-ellipsis overflow-hidden whitespace-nowrap max-w-[100px]">{item.theme}</span>
                <div className="flex items-center gap-1.5 text-slate-400">
                  <Heart size={14} />
                  <span className="text-[10px] font-bold">{Math.floor(Math.random() * 500) + 50}</span>
                </div>
              </div>
              <h3 className="text-slate-900 font-black text-lg group-hover:text-orange-600 transition-colors">{item.name}</h3>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Inspiration;
