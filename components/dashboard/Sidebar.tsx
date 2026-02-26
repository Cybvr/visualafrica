"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  MdAdd,
  MdCalendarMonth,
  MdChecklist,
  MdDarkMode,
  MdHelp,
  MdLightbulb,
  MdLogout,
  MdMail,
  MdOutlineWbSunny,
  MdPerson,
  MdSearch,
  MdSettings,
  MdComputer,
  MdExpandMore,
  MdChevronLeft,
  MdChevronRight,
  MdStore,
} from "react-icons/md";
import { IconType } from "react-icons";
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
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useTheme } from "next-themes";
import { VENDOR_DASHBOARD_DATA } from "@/lib/vendor-dashboard-data";
import {
  getEvents,
  listenToUserChats,
  updateChatMetadata,
  deleteChat
} from "@/lib/firestore-service";
import ChatHistorySection from "./ChatHistorySection";

type NavItemConfig = {
  icon: IconType;
  label: string;
  href: string;
  count?: number;
  matchPaths?: string[];
};

type UserProfile = {
  displayName: string;
  email: string;
  photoURL?: string;
  role?: string;
};

const ProfileDropdown: React.FC<{ mode: 'host' | 'vendor'; collapsed?: boolean }> = ({ mode, collapsed = false }) => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const { setTheme, theme } = useTheme();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
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
              role: data.role || undefined,
            });
          } else {
            setUserProfile({
              displayName: currentUser.displayName || "User",
              email: currentUser.email || "",
              photoURL: currentUser.photoURL || undefined,
              role: undefined,
            });
          }
        } catch (error) {
          console.error("Error fetching user profile:", error);
          setUserProfile({
            displayName: currentUser.displayName || "User",
            email: currentUser.email || "",
            photoURL: currentUser.photoURL || undefined,
            role: undefined,
          });
        }
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);


  if (loading || !userProfile) {
    return (
      <div className="p-4 border-t border-border">
        <div className={`w-full rounded-xl flex items-center ${collapsed ? "justify-center" : "gap-2"}`}>
          <div className="w-9 h-9 bg-muted rounded-full animate-pulse flex-shrink-0" />
          {!collapsed && (
            <div className="flex-1 space-y-1">
              <div className="h-3 bg-muted rounded animate-pulse w-24" />
              <div className="h-2.5 bg-muted rounded animate-pulse w-32" />
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 border-t border-border">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            className={`w-full hover:bg-card rounded-xl transition-colors group py-2.5 ${collapsed ? "px-1 flex items-center justify-center" : "px-3 flex items-center gap-2 text-left"
              }`}
          >
            <img
              src={userProfile.photoURL || "/images/waddi.png"}
              alt={userProfile.displayName}
              className="w-9 h-9 rounded-full object-cover"
            />
            {!collapsed && (
              <div className="min-w-0 flex-1">
                <div className="text-xs font-semibold text-foreground truncate">
                  {userProfile.displayName}
                </div>
                <div className="text-[10px] text-muted-foreground truncate">
                  Free Plan
                </div>
              </div>
            )}
            {!collapsed && (
              <MdExpandMore
                size={16}
                className="text-muted-foreground transition-transform group-data-[state=open]:rotate-180"
              />
            )}
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-44 rounded-xl shadow-lg bg-background p-1"
          side="right"
          align="end"
          sideOffset={12}
        >
          <DropdownMenuItem
            asChild
            className="py-2 cursor-pointer flex items-center gap-2 text-foreground font-medium text-sm"
          >
            <Link href={mode === 'host' ? '/dashboard/hosts/settings' : '/dashboard/vendors/settings'} className="flex items-center gap-2 w-full">
              <MdSettings size={16} />
              Settings
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem asChild className="py-2 cursor-pointer flex items-center gap-2 text-foreground font-medium text-sm">
            <Link href={mode === 'host' ? '/dashboard/vendors' : '/dashboard/hosts'} className="flex items-center gap-2 w-full">
              {mode === 'host' ? <MdChecklist size={16} /> : <MdPerson size={16} />}
              {mode === 'host' ? 'View as Vendor' : 'View as Host'}
            </Link>
          </DropdownMenuItem>

          {userProfile.role === "admin" && (
            <DropdownMenuItem asChild className="py-2 cursor-pointer flex items-center gap-2 text-foreground font-medium text-sm">
              <Link href="/admin" className="flex items-center gap-2 w-full">
                <MdSettings size={16} />
                Admin
              </Link>
            </DropdownMenuItem>
          )}

          {userProfile.role === "admin" && (
            <DropdownMenuItem asChild className="py-2 cursor-pointer flex items-center gap-2 text-foreground font-medium text-sm">
              <Link href="/docs" className="flex items-center gap-2 w-full">
                <MdLightbulb size={16} />
                Docs
              </Link>
            </DropdownMenuItem>
          )}


          <DropdownMenuSub>
            <DropdownMenuSubTrigger className="py-2 cursor-pointer flex items-center gap-2 text-foreground font-medium text-sm">
              {theme === "light" ? <MdOutlineWbSunny size={16} /> : theme === "dark" ? <MdDarkMode size={16} /> : <MdComputer size={16} />}
              Theme
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent className="min-w-[120px]">
                <DropdownMenuItem onClick={() => setTheme("light")} className="cursor-pointer gap-2">
                  <MdOutlineWbSunny size={14} /> Light
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("dark")} className="cursor-pointer gap-2">
                  <MdDarkMode size={14} /> Dark
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("system")} className="cursor-pointer gap-2">
                  <MdComputer size={14} /> System
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>

          <Link href="/support">
            <DropdownMenuItem className="py-2 cursor-pointer flex items-center gap-2 text-foreground font-medium text-sm">
              <MdHelp size={16} />
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
            className="py-2 cursor-pointer flex items-center gap-2 text-red-600 focus:text-red-700 focus:bg-red-50 text-sm"
          >
            <MdLogout size={16} />
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
  collapsed?: boolean;
  onNavigate?: () => void;
}> = ({ icon, label, active, href, count, collapsed = false, onNavigate }) => {
  const content = (
    <Link
      href={href}
      onClick={onNavigate}
      className={`transition-all rounded-lg group relative ${collapsed
        ? "flex items-center justify-center py-2 px-2"
        : "flex items-center gap-3 py-2 px-3"
        } ${active
          ? "text-foreground bg-secondary font-semibold shadow-sm"
          : "text-muted-foreground hover:bg-card hover:text-foreground"
        }`}
    >
      <span className={active ? "text-foreground" : "text-muted-foreground group-hover:text-foreground"}>
        {icon}
      </span>
      {!collapsed && <span className="text-sm font-medium leading-tight">{label}</span>}
      {count !== undefined && (
        <span
          className={`${collapsed ? "absolute top-1 right-1" : "ml-auto"} text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${active ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"
            }`}
        >
          {count}
        </span>
      )}
    </Link>
  );

  if (!collapsed) {
    return content;
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>{content}</TooltipTrigger>
        <TooltipContent side="right">
          <span>{label}</span>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

interface SidebarProps {
  onNavigate?: () => void;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onNavigate, collapsed = false, onToggleCollapse }) => {
  const pathname = usePathname();
  const mode = pathname?.startsWith("/dashboard/vendors") ? "vendor" : "host";
  const logoHref = mode === "vendor" ? "/dashboard/vendors" : "/dashboard/hosts";
  const [hostEventsCount, setHostEventsCount] = useState(0);
  const [hostChatHistoryItems, setHostChatHistoryItems] = useState<any[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!currentUser) {
      setHostChatHistoryItems([]);
      return;
    }

    const unsubscribe = listenToUserChats(currentUser.uid, (chats) => {
      setHostChatHistoryItems(chats);
    });

    return () => unsubscribe();
  }, [currentUser]);

  useEffect(() => {
    async function loadCounts() {
      if (!currentUser) {
        setHostEventsCount(0);
        return;
      }
      try {
        const events = await getEvents(currentUser.uid);
        setHostEventsCount(events.length);
      } catch (error) {
        console.error("Failed to load sidebar event count:", error);
      }
    }
    loadCounts();
  }, [currentUser]);

  const hostInboxCount = 0;
  const vendorOffersCount = VENDOR_DASHBOARD_DATA.leads.length;
  const vendorInboxCount = VENDOR_DASHBOARD_DATA.chats.filter(c => c.unread).length;
  const vendorEventsCount = VENDOR_DASHBOARD_DATA.bookings.length;

  // Force a fresh ID for the New Task link to ensure it's always a fresh session
  const [freshTaskId, setFreshTaskId] = useState(`task-${Date.now()}`);

  useEffect(() => {
    // Regenerate the ID whenever the user navigates, so the link is always "ready" for the next fresh task
    setFreshTaskId(`task-${Date.now()}`);
  }, [pathname]);

  const hostPrimaryNavItems: NavItemConfig[] = [
    { icon: MdAdd, label: "New Task", href: `/dashboard/hosts/chat/${freshTaskId}` },
    { icon: MdSearch, label: "Search", href: "/dashboard/hosts/search", matchPaths: ["/dashboard/hosts/vendor/"] },
    { icon: MdStore, label: "Store", href: "/dashboard/hosts/store" },
    { icon: MdCalendarMonth, label: "Manage", href: "/dashboard/hosts/events", count: hostEventsCount },
    { icon: MdMail, label: "Inbox", href: "/dashboard/hosts/inbox", count: hostInboxCount },
  ];

  const renameHostChatHistoryItem = async (id: string, title: string) => {
    await updateChatMetadata(id, { title });
  };

  const deleteHostChatHistoryItem = async (id: string) => {
    await deleteChat(id);
  };

  const hostSecondaryNavItems: NavItemConfig[] = [];

  const vendorPrimaryNavItems: NavItemConfig[] = [
    { icon: MdSearch, label: "Search", href: "/dashboard/vendors" },
    { icon: MdMail, label: "Inbox", href: "/dashboard/vendors/inbox", count: vendorInboxCount },
    { icon: MdChecklist, label: "Jobs", href: "/dashboard/vendors/jobs", count: vendorEventsCount },
  ];

  const vendorSecondaryNavItems: NavItemConfig[] = [];

  const primaryNavItems = mode === "host" ? hostPrimaryNavItems : vendorPrimaryNavItems;
  const secondaryNavItems = mode === "host" ? hostSecondaryNavItems : vendorSecondaryNavItems;

  const isActive = (item: NavItemConfig) => {
    if (pathname === item.href) return true;
    if (item.matchPaths?.some((path) => pathname?.startsWith(path))) return true;
    return false;
  };

  return (
    <div className="flex flex-col h-full bg-sidebar transition-all duration-300">
      {/* Sidebar Header with Logo & Collapse Toggle */}
      <div className={`pt-5 pb-4 flex items-center ${collapsed ? "justify-center px-2" : "justify-between px-5"}`}>
        {collapsed ? (
          /* Collapsed: logo visible, hover reveals expand button overlaying it */
          <div className="group relative flex items-center justify-center">
            <Link href={logoHref} className="flex items-center justify-center">
              <img src="/logo.png" alt="Logo" className="h-7 w-auto min-w-[28px] object-contain shrink-0 transition-opacity group-hover:opacity-0" />
            </Link>
            <button
              onClick={onToggleCollapse}
              className="absolute inset-0 hidden md:flex items-center justify-center w-full h-full text-foreground opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none group-hover:pointer-events-auto"
              aria-label="Expand sidebar"
            >
              <MdChevronRight size={22} />
            </button>
          </div>
        ) : (
          /* Expanded: logo left, collapse chevron right */
          <>
            <Link href={logoHref} className="flex items-center gap-2 min-w-0">
              <img src="/logo.png" alt="Waddi Logo" className="h-7 w-auto min-w-[28px] object-contain shrink-0" />
              <span className="font-logo text-xl font-normal text-foreground leading-none">
                Waddi
              </span>
            </Link>
            {onToggleCollapse && (
              <button
                onClick={onToggleCollapse}
                className="hidden md:inline-flex items-center justify-center w-8 h-8 text-muted-foreground hover:text-foreground hover:bg-card rounded-lg transition-colors"
                aria-label="Collapse sidebar"
              >
                <MdChevronLeft size={20} />
              </button>
            )}
          </>
        )}
      </div>

      <div className={`flex-1 overflow-y-auto scrollbar-hide pb-4 ${collapsed ? "px-2" : "px-3"}`}>
        <SidebarSection>
          {primaryNavItems.map((item) => (
            <NavItem
              key={item.href}
              icon={<item.icon size={20} />}
              label={item.label}
              active={isActive(item)}
              href={item.href}
              count={item.count}
              collapsed={collapsed}
              onNavigate={onNavigate}
            />
          ))}
        </SidebarSection>
        {secondaryNavItems.length > 0 && (
          <div className="mt-4">
            <SidebarSection>
              {secondaryNavItems.map((item) => (
                <NavItem
                  key={item.href}
                  icon={<item.icon size={20} />}
                  label={item.label}
                  active={isActive(item)}
                  href={item.href}
                  count={item.count}
                  collapsed={collapsed}
                  onNavigate={onNavigate}
                />
              ))}
            </SidebarSection>
          </div>
        )}
        {mode === "host" && !collapsed && (
          <ChatHistorySection
            items={hostChatHistoryItems}
            onRename={renameHostChatHistoryItem}
            onDelete={deleteHostChatHistoryItem}
          />
        )}

      </div>

      <ProfileDropdown mode={mode} collapsed={collapsed} />
    </div>
  );
};

export default Sidebar;
