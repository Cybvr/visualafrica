"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronDown, Laptop, LogOut, Moon, Settings, Sun, User, CheckSquare, HelpCircle, Lightbulb } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useTheme } from "next-themes";

type ProfileMenuProps = {
  mode: "host" | "vendor";
};

type UserProfile = {
  displayName: string;
  email: string;
  photoURL?: string;
  role?: string;
};

export default function ProfileMenu({ mode }: ProfileMenuProps) {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const { setTheme, theme } = useTheme();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        try {
          const userDoc = await getDoc(doc(db, "users", currentUser.uid));
          const data = userDoc.exists() ? userDoc.data() : {};
          setUserProfile({
            displayName: data.displayName || currentUser.displayName || "User",
            email: data.email || currentUser.email || "",
            photoURL: data.photoURL || currentUser.photoURL || undefined,
            role: data.role || undefined,
          });
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

  if (loading || !userProfile) {
    return <div className="h-9 w-9 rounded-full bg-muted animate-pulse" aria-label="Loading profile" />;
  }

  const settingsHref = mode === "host" ? "/dashboard/hosts/settings" : "/dashboard/vendors/settings";
  const accountHref = mode === "host" ? "/dashboard/vendors" : "/dashboard/hosts";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="inline-flex min-w-0 items-center gap-2 rounded-full border border-border bg-background px-2 py-1.5 text-left transition-colors hover:bg-secondary"
          aria-label="Open profile menu"
        >
          <img
            src={userProfile.photoURL || "/images/waddi.png"}
            alt=""
            className="h-8 w-8 rounded-full object-cover"
          />
          <span className="hidden max-w-28 truncate text-xs font-semibold text-foreground sm:block">
            {userProfile.displayName}
          </span>
          <ChevronDown size={15} className="text-muted-foreground" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-52 rounded-xl bg-background p-1" align="end" sideOffset={8}>
        <div className="px-3 py-2">
          <p className="truncate text-sm font-semibold text-foreground">{userProfile.displayName}</p>
          <p className="truncate text-xs text-muted-foreground">{userProfile.email}</p>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild className="cursor-pointer gap-2 text-sm font-medium">
          <Link href={settingsHref}>
            <Settings size={16} />
            Settings
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild className="cursor-pointer gap-2 text-sm font-medium">
          <Link href={accountHref}>
            {mode === "host" ? <CheckSquare size={16} /> : <User size={16} />}
            {mode === "host" ? "Vendor Account" : "Host Account"}
          </Link>
        </DropdownMenuItem>
        {userProfile.role === "admin" && (
          <>
            <DropdownMenuItem asChild className="cursor-pointer gap-2 text-sm font-medium">
              <Link href="/admin">
                <Settings size={16} />
                Admin
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild className="cursor-pointer gap-2 text-sm font-medium">
              <Link href="/docs">
                <Lightbulb size={16} />
                Help Center
              </Link>
            </DropdownMenuItem>
          </>
        )}
        <DropdownMenuSub>
          <DropdownMenuSubTrigger className="cursor-pointer gap-2 text-sm font-medium">
            {theme === "light" ? <Sun size={16} /> : theme === "dark" ? <Moon size={16} /> : <Laptop size={16} />}
            Theme
          </DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent className="min-w-[120px]">
              <DropdownMenuItem onClick={() => setTheme("light")} className="cursor-pointer gap-2"><Sun size={14} /> Light</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("dark")} className="cursor-pointer gap-2"><Moon size={14} /> Dark</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("system")} className="cursor-pointer gap-2"><Laptop size={14} /> System</DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>
        <DropdownMenuItem asChild className="cursor-pointer gap-2 text-sm font-medium">
          <Link href="/support">
            <HelpCircle size={16} />
            Support
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => void signOut(auth)}
          className="cursor-pointer gap-2 text-sm font-medium text-red-600 focus:bg-red-50 focus:text-red-700"
        >
          <LogOut size={16} />
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
