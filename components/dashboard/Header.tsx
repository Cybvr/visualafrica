"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Bell, Search, Plus, Menu } from 'lucide-react';

interface HeaderProps {
  onOpenMenu?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onOpenMenu }) => {
  const pathname = usePathname();
  const mode = pathname?.startsWith("/dashboard/vendors") ? "vendor" : "host";

  return (
    <div className="h-full flex items-center justify-between px-6 bg-background">
      <div className="flex items-center gap-4">
        <button
          onClick={onOpenMenu}
          className="md:hidden p-2 -ml-2 text-muted-foreground hover:bg-secondary rounded-xl transition-colors"
        >
          <Menu size={20} />
        </button>

        <div className="hidden sm:flex items-center bg-secondary/50 border border-border rounded-xl px-3 py-1.5 focus-within:ring-2 focus-within:ring-primary/10 transition-all">
          <Search size={16} className="text-muted-foreground" />
          <input
            type="text"
            placeholder="Search platform..."
            className="bg-transparent border-none outline-none text-xs px-2 w-48 font-medium text-foreground placeholder:text-muted-foreground"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Link href="/pricing">
          <button className="hidden lg:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary/20 to-accent/20 border border-primary/20 text-foreground rounded-xl text-xs font-semibold hover:from-primary/30 hover:to-accent/30 transition-all shadow-sm">
            <Plus size={14} className="text-primary" />
            14 days left Upgrade
          </button>
        </Link>

        <button className="relative p-2 text-muted-foreground hover:text-foreground transition-colors">
          <Bell size={20} />
          <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 bg-primary rounded-full border border-background" />
        </button>
      </div>
    </div>
  );
};

export default Header;