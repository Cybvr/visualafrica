"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Settings,
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
} from "../ui/dropdown-menu";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged, signOut, User as FirebaseUser } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

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

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        try {
          // Try to fetch additional profile data from Firestore
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
            // Fallback to Firebase Auth data
            setUserProfile({
              displayName: currentUser.displayName || "User",
              email: currentUser.email || "",
              photoURL: currentUser.photoURL || undefined,
            });
          }
        } catch (error) {
          console.error("Error fetching user profile:", error);
          // Fallback to Firebase Auth data
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
      <div className="p-4 border-t border-slate-100">
        <div className="w-full px-4 py-3 rounded-xl flex items-center gap-3">
          <div className="w-9 h-9 bg-slate-200 rounded-full animate-pulse flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="h-4 bg-slate-200 rounded animate-pulse mb-1" />
            <div className="h-3 bg-slate-200 rounded animate-pulse w-2/3" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 border-t border-slate-100">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="w-full px-4 py-3 hover:bg-sidebar-accent rounded-xl flex items-center justify-between transition-colors group text-left">
            <div className="flex items-center gap-3 min-w-0">
              {userProfile.photoURL ? (
                <img
                  src={userProfile.photoURL}
                  alt={userProfile.displayName}
                  className="w-9 h-9 rounded-full object-cover flex-shrink-0"
                />
              ) : (
                <div className="w-9 h-9 bg-slate-200 rounded-full flex items-center justify-center text-slate-600 text-sm font-semibold flex-shrink-0">
                  {getInitials(userProfile.displayName)}
                </div>
              )}
              <div className="text-left min-w-0">
                <div className="text-sm font-semibold text-sidebar-foreground truncate">
                  {userProfile.displayName}
                </div>
                <div className="text-xs text-muted-foreground truncate">
                  {mode === 'host' ? 'Host Account' : 'Vendor Account'}
                </div>
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
          <Link href={mode === 'host' ? '/dashboard/vendors' : '/dashboard/hosts'}>
            <DropdownMenuItem className="py-2.5 cursor-pointer flex items-center gap-2 text-primary font-bold">
              <ClipboardList size={16} />
              View as {mode === 'host' ? 'Vendor' : 'Host'}
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
  onNavigate?: () => void;
}> = ({ icon, label, active, href, count, onNavigate }) => (
  <Link
    href={href}
    onClick={onNavigate}
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

import { VENDOR_DASHBOARD_DATA } from "@/lib/vendor-dashboard-data";
import { EVENTS } from "@/lib/events-data";

const Sidebar: React.FC<{ onNavigate?: () => void }> = ({ onNavigate }) => {
  const pathname = usePathname();
  const mode = pathname?.startsWith("/dashboard/vendors") ? "vendor" : "host";

  // Dynamic counts for Host
  const hostInboxCount = 3; // Mock for now
  const hostEventsCount = EVENTS.length;

  // Dynamic counts for Vendor
  const vendorOffersCount = VENDOR_DASHBOARD_DATA.leads.length;
  const vendorInboxCount = VENDOR_DASHBOARD_DATA.chats.filter(c => c.unread).length;
  const vendorEventsCount = VENDOR_DASHBOARD_DATA.bookings.length;

  const hostPrimaryNavItems: NavItemConfig[] = [
    { icon: LayoutDashboard, label: "Overview", href: "/dashboard/hosts" },
    { icon: Calendar, label: "Events", href: "/dashboard/hosts/events", count: hostEventsCount },
    { icon: Mail, label: "Inbox", href: "/dashboard/hosts/inbox", count: hostInboxCount },
  ];

  const hostSecondaryNavItems: NavItemConfig[] = [
    { icon: Search, label: "Vendors", href: "/dashboard/hosts/vendors", matchPaths: ["/dashboard/hosts/vendor/"] },
    { icon: Lightbulb, label: "Experiences", href: "/dashboard/hosts/experiences" },
    { icon: Lightbulb, label: "Inspiration", href: "/dashboard/hosts/inspiration" },
    { icon: FileText, label: "Resources", href: "/dashboard/hosts/diy-content" },
    { icon: Settings, label: "Settings", href: "/dashboard/hosts/settings" },
    { icon: HelpCircle, label: "Support", href: "/support" },
  ];

  const vendorPrimaryNavItems: NavItemConfig[] = [
    { icon: LayoutDashboard, label: "Overview", href: "/dashboard/vendors" },
    { icon: Search, label: "Offers", href: "/dashboard/vendors/offers", count: vendorOffersCount },
    { icon: FileText, label: "Contracts", href: "/dashboard/vendors/contracts" },
    { icon: Mail, label: "Inbox", href: "/dashboard/vendors/inbox", count: vendorInboxCount },
  ];

  const vendorSecondaryNavItems: NavItemConfig[] = [
    { icon: Search, label: "Events", href: "/dashboard/vendors/events", count: vendorEventsCount },
    { icon: Calendar, label: "Calendar", href: "/dashboard/vendors/calendar" },
    { icon: User, label: "Portfolio", href: "/dashboard/vendors/portfolio" },
    { icon: Settings, label: "Settings", href: "/dashboard/vendors/settings" },
    { icon: HelpCircle, label: "Support", href: "/support" },
  ];

  const primaryNavItems = mode === "host" ? hostPrimaryNavItems : vendorPrimaryNavItems;
  const secondaryNavItems = mode === "host" ? hostSecondaryNavItems : vendorSecondaryNavItems;

  const isActive = (item: NavItemConfig) => {
    if (pathname === item.href) return true;
    if (item.matchPaths?.some((path) => pathname?.startsWith(path))) return true;
    return false;
  };

  return (
    <div className="flex flex-col h-full bg-sidebar border-r border-sidebar-border">
      <div className="px-4 mt-4 mb-3">
        <Link
          href={mode === "host" ? "/dashboard/hosts/events/new" : "/dashboard/vendors/portfolio/new"}
          onClick={onNavigate}
          className="w-full px-4 py-3 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl flex items-center justify-center gap-2 transition-colors"
        >
          <Plus size={18} />
          {mode === "host" ? "Create an event" : "Add portfolio item"}
        </Link>
      </div>

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