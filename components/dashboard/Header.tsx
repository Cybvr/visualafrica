"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Bell, Search, Plus, Menu, FileText, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import SupportChat from './SupportChat';
import { getFaqs } from '@/lib/firestore-service';
import { FAQ, FAQCategory } from '@/lib/types';

const FAQ_CATEGORIES: FAQCategory[] = [
  { id: 'general', label: 'General' },
  { id: 'hosts', label: 'For Hosts' },
  { id: 'vendors', label: 'For Vendors' },
  { id: 'payments', label: 'Payments & Security' },
];

interface HeaderProps {
  onOpenMenu?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onOpenMenu }) => {
  const pathname = usePathname();
  const mode = pathname?.startsWith("/dashboard/vendors") ? "vendor" : "host";
  const [faqs, setFaqs] = React.useState<FAQ[]>([]);

  React.useEffect(() => {
    async function loadFaqs() {
      try {
        const data = await getFaqs();
        setFaqs(data);
      } catch (error) {
        console.error("Failed to load FAQs for header support:", error);
      }
    }
    loadFaqs();
  }, []);

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
          <Popover>
            <PopoverTrigger asChild>
              <button className="p-2 text-muted-foreground hover:text-foreground transition-colors" aria-label="Support">
                <HelpCircle size={20} />
              </button>
            </PopoverTrigger>
            <PopoverContent className="p-0 w-[400px] sm:w-[500px] border-none bg-transparent shadow-none mr-4" align="end" sideOffset={10}>
              <SupportChat faqs={faqs} categories={FAQ_CATEGORIES} className="h-[600px] shadow-2xl border border-border" />
            </PopoverContent>
          </Popover>
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
