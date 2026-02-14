
"use client";

import React from 'react';
import Link from 'next/link';
import { ChevronLeft, Bell, Search, Plus, Menu } from 'lucide-react';

interface HeaderProps {
  onOpenMenu?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onOpenMenu }) => {
  return (
    <div className="h-full flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        <button
          onClick={onOpenMenu}
          className="md:hidden p-2 -ml-2 text-slate-600 hover:bg-slate-50 rounded-xl transition-colors"
        >
          <Menu size={20} />
        </button>

        <Link href="/dashboard" className="flex items-center gap-3 cursor-pointer group">
          <span className="font-black text-lg tracking-tighter text-slate-900">Dashboard</span>
        </Link>
      </div>

      <div className="flex items-center gap-4">
        {/* Search & Actions */}
        <div className="hidden sm:flex items-center bg-slate-50 border border-slate-100 rounded-xl px-3 py-1.5 focus-within:ring-2 focus-within:ring-orange-600/10 transition-all">
          <Search size={16} className="text-slate-400" />
          <input
            type="text"
            placeholder="Search platform..."
            className="bg-transparent border-none outline-none text-xs px-2 w-48 font-medium"
          />
        </div>

        <div className="flex -space-x-2">
          {[1, 2, 3].map((i) => (
            <img
              key={i}
              className="inline-block h-8 w-8 rounded-full ring-2 ring-white"
              src={`https://picsum.photos/seed/${i + 20}/64/64`}
              alt="Team member"
            />
          ))}
        </div>

        <button className="relative p-2 text-slate-400 hover:text-slate-600 transition-colors">
          <Bell size={20} />
          <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 bg-orange-600 rounded-full border border-white" />
        </button>

      </div>
    </div>
  );
};

export default Header;
