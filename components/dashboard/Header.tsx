"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Bell, Search, Plus, Menu, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Link href="/support">
            <Button variant="outline" size="sm" className="hidden lg:flex items-center gap-2 border-primary/20 hover:bg-primary/5 hover:border-primary/40 text-primary h-9 rounded-xl px-4">
              <FileText size={16} />
              <span className="font-semibold text-xs">Resources</span>
            </Button>
          </Link>
        </div>

        <button className="relative p-2 text-muted-foreground hover:text-foreground transition-colors">
          <Bell size={20} />
          <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 bg-primary rounded-full border border-background" />
        </button>
      </div>
    </div>
  );
};

export default Header;
