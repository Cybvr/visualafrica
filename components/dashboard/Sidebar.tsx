"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Settings,
  BriefcaseBusiness,
  Lightbulb,
  Search,
  Heart,
  Calendar,
  FileText,
  CreditCard,
  HelpCircle,
  Mail,
  ClipboardList,
  ChevronDown,
  Plus,
  LogOut,
  User,
  Briefcase,
  LucideIcon,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuPortal,
} from "../ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged, signOut, User as FirebaseUser } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useTheme } from "next-themes";
import { Sun, Moon, Monitor } from "lucide-react";
import { VENDOR_DASHBOARD_DATA } from "@/lib/vendor-dashboard-data";
import { EVENTS } from "@/lib/events-data";

type NavItemConfig = {
  icon: LucideIcon;
  label: string;
  href: string;
  count?: number;
  matchPaths?: string[];
};

type UserProfile = {
  displayName: string;
  email: string;
  photoURL?: string;
};

const ProfileDropdown: React.FC<{ mode: 'host' | 'vendor' }> = ({ mode }) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const { setTheme, theme } = useTheme();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        try {
          const userDocRef = doc(db, "users", currentUser.uid);
          const userDoc = await getDoc(userDocRef);

          if (userDoc.exists()) {
            const data = userDoc.data();
            setUserProfile({
              displayName: data.displayName || currentUser.displayName || "User",
              email: data.email || currentUser.email || "",
              photoURL: data.photoURL || currentUser.photoURL || undefined,
            });
          } else {
            setUserProfile({
              displayName: currentUser.displayName || "User",
              email: currentUser.email || "",
              photoURL: currentUser.photoURL || undefined,
            });
          }
        } catch (error) {
          console.error("Error fetching user profile:", error);
          setUserProfile({
            displayName: currentUser.displayName || "User",
            email: currentUser.email || "",
            photoURL: currentUser.photoURL || undefined,
          });
        }
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const getInitials = (name: string) => {
    const names = name.split(" ");
    if (names.length >= 2) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  if (loading || !userProfile) {
    return (
      <div className="p-4 border-t border-border">
        <div className="w-full rounded-xl flex flex-col items-center gap-2">
          <div className="w-9 h-9 bg-muted rounded-full animate-pulse flex-shrink-0" />
          <div className="h-3 bg-muted rounded animate-pulse w-12" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 border-t">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="w-full hover:bg-card rounded-xl flex flex-col items-center transition-colors group text-center py-3 px-2">
            {userProfile.photoURL ? (
              <img
                src={userProfile.photoURL}
                alt={userProfile.displayName}
                className="w-9 h-9 rounded-full object-cover"
              />
            ) : (
              <div className="w-9 h-9 bg-secondary rounded-full flex items-center justify-center text-muted-foreground text-sm font-semibold">
                {getInitials(userProfile.displayName)}
              </div>
            )}
            <div className="mt-1">
              <div className="text-[10px] font-semibold text-sidebar-foreground truncate max-w-full">
                {userProfile.displayName}
              </div>
            </div>
            <ChevronDown
              size={12}
              className="text-muted-foreground transition-transform mt-1 group-data-[state=open]:rotate-180"
            />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-48 rounded-xl shadow-lg bg-background"
          side="right"
          align="end"
          sideOffset={12}
        >
          <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
            Account
          </div>
          <Link href={mode === 'host' ? '/dashboard/vendors' : '/dashboard/hosts'}>
            <DropdownMenuItem className="py-2.5 cursor-pointer flex items-center gap-2 text-foreground font-medium">
              <ClipboardList size={16} />
              View as {mode === 'host' ? 'Vendor' : 'Host'}
            </DropdownMenuItem>
          </Link>
          <DropdownMenuItem className="py-2.5 cursor-pointer flex items-center gap-2 text-foreground font-medium">
            <User size={16} />
            Profile Settings
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
            Preferences
          </div>

          <DropdownMenuSub>
            <DropdownMenuSubTrigger className="py-2.5 cursor-pointer flex items-center gap-2 text-foreground font-medium">
              {theme === "light" ? <Sun size={16} /> : theme === "dark" ? <Moon size={16} /> : <Monitor size={16} />}
              Theme
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent className="min-w-[120px]">
                <DropdownMenuItem onClick={() => setTheme("light")} className="cursor-pointer gap-2">
                  <Sun size={14} /> Light
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("dark")} className="cursor-pointer gap-2">
                  <Moon size={14} /> Dark
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("system")} className="cursor-pointer gap-2">
                  <Monitor size={14} /> System
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>

          <Link href="/support">
            <DropdownMenuItem className="py-2.5 cursor-pointer flex items-center gap-2 text-foreground font-medium">
              <HelpCircle size={16} />
              Support
            </DropdownMenuItem>
          </Link>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            onClick={async () => {
              try {
                await signOut(auth);
              } catch (error) {
                console.error("Error signing out:", error);
              }
            }}
            className="py-2.5 cursor-pointer flex items-center gap-2 text-red-600 focus:text-red-700 focus:bg-red-50"
          >
            <LogOut size={16} />
            Sign Out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

const SidebarSection: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div>
    <nav className="space-y-0.5">{children}</nav>
  </div>
);

const NavItem: React.FC<{
  icon: React.ReactNode;
  label: string;
  active: boolean;
  href: string;
  count?: number;
  onNavigate?: () => void;
}> = ({ icon, label, active, href, count, onNavigate }) => {
  return (
    <Link
      href={href}
      onClick={onNavigate}
      className={`flex flex-col items-center transition-all rounded-xl group relative py-3 px-2 ${active
        ? "text-foreground bg-secondary font-black shadow-sm"
        : "text-muted-foreground hover:bg-card hover:text-foreground"
        }`}
    >
      <span className={active ? "text-foreground" : "text-muted-foreground group-hover:text-foreground"}>
        {icon}
      </span>
      <span className="text-[10px] font-bold mt-1 text-center leading-tight">
        {label}
      </span>
      {count !== undefined && (
        <span
          className={`absolute top-1 right-1 text-[8px] font-black px-1.5 py-0.5 rounded-full ${active ? "bg-primary text-primary-foreground" : "bg-sidebar text-muted-foreground"
            }`}
        >
          {count}
        </span>
      )}
    </Link>
  );
};

interface SidebarProps {
  onNavigate?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onNavigate }) => {
  const pathname = usePathname();
  const mode = pathname?.startsWith("/dashboard/vendors") ? "vendor" : "host";

  const hostInboxCount = 3;
  const hostEventsCount = EVENTS.length;
  const vendorOffersCount = VENDOR_DASHBOARD_DATA.leads.length;
  const vendorInboxCount = VENDOR_DASHBOARD_DATA.chats.filter(c => c.unread).length;
  const vendorEventsCount = VENDOR_DASHBOARD_DATA.bookings.length;

  const hostPrimaryNavItems: NavItemConfig[] = [
    { icon: Home, label: "Home", href: "/dashboard/hosts" },
    { icon: Search, label: "Discover", href: "/dashboard/hosts/vendors", matchPaths: ["/dashboard/hosts/vendor/"] },
    { icon: Calendar, label: "Manage", href: "/dashboard/hosts/events", count: hostEventsCount },
  ];

  const hostSecondaryNavItems: NavItemConfig[] = [
    { icon: Lightbulb, label: "Inspiration", href: "/dashboard/hosts/inspiration" },
    { icon: FileText, label: "Resources", href: "/dashboard/hosts/diy-content" },
    { icon: Settings, label: "Settings", href: "/dashboard/hosts/settings" },
  ];

  const vendorPrimaryNavItems: NavItemConfig[] = [
    { icon: Home, label: "Home", href: "/dashboard/vendors" },
    { icon: BriefcaseBusiness, label: "Offers", href: "/dashboard/vendors/offers", count: vendorOffersCount },
    { icon: ClipboardList, label: "Jobs", href: "/dashboard/vendors/jobs", count: vendorEventsCount },
  ];

  const vendorSecondaryNavItems: NavItemConfig[] = [
    { icon: User, label: "Portfolio", href: "/dashboard/vendors/portfolio" },
    { icon: Settings, label: "Settings", href: "/dashboard/vendors/settings" },
  ];

  const primaryNavItems = mode === "host" ? hostPrimaryNavItems : vendorPrimaryNavItems;
  const secondaryNavItems = mode === "host" ? hostSecondaryNavItems : vendorSecondaryNavItems;

  const isActive = (item: NavItemConfig) => {
    if (pathname === item.href) return true;
    if (item.matchPaths?.some((path) => pathname?.startsWith(path))) return true;
    return false;
  };

  return (
    <div className="flex flex-col h-full bg-sidebar transition-all duration-300">
      {/* Sidebar Header with Logo */}
      <div className="px-4 mt-6 mb-8 flex flex-col items-center">
        <Link href="/" className="flex flex-col items-center gap-2">
          <img src="/logo.png" alt="Logo" className="h-8 w-auto min-w-[32px] object-contain shrink-0" />
        </Link>
      </div>

      <div className="flex-1 px-4 overflow-y-auto scrollbar-hide pb-4">
        <SidebarSection>
          {primaryNavItems.map((item) => (
            <NavItem
              key={item.href}
              icon={<item.icon size={18} />}
              label={item.label}
              active={isActive(item)}
              href={item.href}
              count={item.count}
              onNavigate={onNavigate}
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
              onNavigate={onNavigate}
            />
          ))}
        </SidebarSection>
      </div>

      <ProfileDropdown mode={mode} />
    </div>
  );
};

export default Sidebar;
