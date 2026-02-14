"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronLeft, Bell, Search, Plus, Menu } from 'lucide-react';

interface HeaderProps {
  onOpenMenu?: () => void;
  isCollapsed?: boolean;
}

const Header: React.FC<HeaderProps> = ({ onOpenMenu, isCollapsed }) => {
  const pathname = usePathname();
  const mode = pathname?.startsWith("/dashboard/vendors") ? "vendor" : "host";

  return (
    <div className="h-full flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        <button
          onClick={onOpenMenu}
          className="md:hidden p-2 -ml-2 text-slate-600 hover:bg-slate-50 rounded-xl transition-colors"
        >
          <Menu size={20} />
        </button>

        <Link href={mode === 'host' ? '/dashboard/hosts' : '/dashboard/vendors'} className="flex items-center gap-2 cursor-pointer group">
          <img src="/logo.png" alt="Waddi" className="h-7 w-auto object-contain" />
          <span className="font-serif text-lg font-bold text-slate-900 tracking-tight">Waddi</span>
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

        <Link href="/pricing">
          <button className="hidden lg:flex items-center gap-2 px-4 py-2 bg-zinc-200 text-foreground rounded-xl text-xs font-normal">
            <Plus size={14} />
            Upgrade to Pro
          </button>
        </Link>

        <button className="relative p-2 text-slate-400 hover:text-slate-600 transition-colors">
          <Bell size={20} />
          <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 bg-orange-600 rounded-full border border-white" />
        </button>

      </div>
    </div>
  );
};

export default Header;
