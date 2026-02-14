"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Settings,
  Lightbulb,
  Search,
  Heart,
  Calendar,
  Users,
  FileText,
  CreditCard,
  HelpCircle,
  Mail,
  ClipboardList,
  ChevronDown,
  Plus,
  LogOut,
  User,
  LucideIcon,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "../ui/dropdown-menu";

type NavItemConfig = {
  icon: LucideIcon;
  label: string;
  href: string;
  count?: number;
  matchPaths?: string[];
};

const primaryNavItems: NavItemConfig[] = [
  { icon: LayoutDashboard, label: "Overview", href: "/dashboard" },
  { icon: Calendar, label: "Events", href: "/dashboard/events" },
  { icon: Mail, label: "Inbox", href: "/dashboard/inbox", count: 3 },
  { icon: CreditCard, label: "Contracts", href: "/dashboard/contracts" },
];

const secondaryNavItems: NavItemConfig[] = [
  { icon: Search, label: "Vendors", href: "/dashboard/vendors", matchPaths: ["/dashboard/vendor/"] },
  { icon: Lightbulb, label: "Experiences", href: "/dashboard/experiences" },
  { icon: Heart, label: "Saved", href: "/dashboard/shortlist", count: 13 },
  { icon: Lightbulb, label: "Inspiration", href: "/dashboard/inspiration" },
  { icon: FileText, label: "Resources", href: "/dashboard/diy-content" },
  { icon: HelpCircle, label: "Support", href: "/support" },
];

const CreateEventButton: React.FC = () => {
  return (
    <div className="px-4 mt-4 mb-3">
      <Link
        href="/dashboard/events/new"
        className="w-full px-4 py-3 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl flex items-center justify-center gap-2 transition-colors"
      >
        <Plus size={18} />
        Create an event
      </Link>
    </div>
  );
};

const ProfileDropdown: React.FC = () => {
  return (
    <div className="p-4 border-t border-slate-100">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="w-full px-4 py-3 hover:bg-sidebar-accent rounded-xl flex items-center justify-between transition-colors group text-left">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 bg-slate-200 rounded-full flex items-center justify-center text-slate-600 text-sm font-semibold flex-shrink-0">
                JD
              </div>
              <div className="text-left min-w-0">
                <div className="text-sm font-semibold text-sidebar-foreground truncate">John Doe</div>
                <div className="text-xs text-muted-foreground">john@example.com</div>
              </div>
            </div>
            <ChevronDown
              size={16}
              className="text-slate-400 transition-transform flex-shrink-0 group-data-[state=open]:rotate-180"
            />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-[calc(100%-2rem)] mx-4 rounded-xl shadow-lg border-slate-200"
          side="top"
          align="end"
          sideOffset={12}
        >
          <DropdownMenuItem className="py-2.5 cursor-pointer flex items-center gap-2 text-slate-700">
            <User size={16} />
            Profile Settings
          </DropdownMenuItem>
          <DropdownMenuItem className="py-2.5 cursor-pointer flex items-center gap-2 text-red-600 focus:text-red-700 focus:bg-red-50">
            <LogOut size={16} />
            Sign Out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

const SidebarSection: React.FC<{ children: React.ReactNode; divider?: boolean }> = ({
  children,
  divider,
}) => (
  <div className={divider ? "mb-4 pb-4 border-b border-sidebar-border" : "mb-4"}>
    <nav className="space-y-0.5">{children}</nav>
  </div>
);

const NavItem: React.FC<{
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  href: string;
  count?: number;
}> = ({ icon, label, active, href, count }) => (
  <Link
    href={href}
    className={`flex items-center justify-between px-4 py-2.5 text-sm transition-all rounded-xl group ${active
      ? "text-primary bg-primary/10 font-black shadow-sm"
      : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground"
      }`}
  >
    <div className="flex items-center gap-3">
      <span className={active ? "text-primary" : "text-slate-400 group-hover:text-sidebar-foreground"}>
        {icon}
      </span>
      <span>{label}</span>
    </div>
    {count !== undefined && (
      <span
        className={`text-[10px] font-black px-2 py-0.5 rounded-full ${active ? "bg-primary text-primary-foreground" : "bg-sidebar-accent text-muted-foreground"
          }`}
      >
        {count}
      </span>
    )}
  </Link>
);

const Sidebar: React.FC = () => {
  const pathname = usePathname();

  const isActive = (item: NavItemConfig) => {
    if (pathname === item.href) return true;
    if (item.matchPaths?.some((path) => pathname?.startsWith(path))) return true;
    return false;
  };

  return (
    <div className="flex flex-col h-full bg-sidebar border-r border-sidebar-border">
      <CreateEventButton />

      <div className="flex-1 px-4 overflow-y-auto scrollbar-hide pb-1">
        <SidebarSection divider>
          {primaryNavItems.map((item) => (
            <NavItem
              key={item.href}
              icon={<item.icon size={18} />}
              label={item.label}
              active={isActive(item)}
              href={item.href}
              count={item.count}
            />
          ))}
        </SidebarSection>

        <SidebarSection>
          {secondaryNavItems.map((item) => (
            <NavItem
              key={item.href}
              icon={<item.icon size={18} />}
              label={item.label}
              active={isActive(item)}
              href={item.href}
              count={item.count}
            />
          ))}
        </SidebarSection>
      </div>

      <ProfileDropdown />
    </div>
  );
};

export default Sidebar;