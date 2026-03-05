"use client";

import React, { useEffect, useState } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import Header from "@/components/dashboard/Header";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";

export default function DashboardLayoutClient({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [authChecked, setAuthChecked] = useState(false);

    const isChatPage = pathname?.startsWith("/dashboard/hosts/chat/");
    const isHostHomePage = pathname === "/dashboard/hosts";

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (!user) {
                router.replace("/auth/login");
            } else {
                setAuthChecked(true);
            }
        });
        return () => unsubscribe();
    }, [router]);

    useEffect(() => {
        const saved = window.localStorage.getItem("dashboard-sidebar-collapsed");
        if (saved === "true") {
            setIsSidebarCollapsed(true);
        }
    }, []);

    useEffect(() => {
        window.localStorage.setItem("dashboard-sidebar-collapsed", String(isSidebarCollapsed));
    }, [isSidebarCollapsed]);

    if (!authChecked) {
        return null;
    }

    return (
        <div className="flex min-h-screen bg-background text-foreground">
            <aside
                className={`hidden md:block border-r border-border shrink-0 h-screen sticky top-0 transition-[width] duration-200 ${isSidebarCollapsed ? "w-16" : "w-64"}`}
            >
                <Sidebar
                    collapsed={isSidebarCollapsed}
                    onToggleCollapse={() => setIsSidebarCollapsed((prev) => !prev)}
                />
            </aside>

            <Sheet open={open} onOpenChange={setOpen}>
                <SheetContent side="left" className="p-0 w-64 border-none">
                    <Sidebar onNavigate={() => setOpen(false)} />
                </SheetContent>
            </Sheet>

            <div className="flex-1 flex flex-col min-w-0 min-h-screen">
                {!isChatPage && (
                    <header className="border-b border-border h-16 shrink-0 bg-background sticky top-0 z-20">
                        <Header onOpenMenu={() => setOpen(true)} />
                    </header>
                )}

                <main className={cn(
                    "flex-1 bg-secondary/30",
                    isChatPage
                        ? "p-0 h-screen overflow-hidden"
                        : isHostHomePage
                            ? "p-0 overflow-hidden"
                            : "p-2 sm:p-4 md:p-5"
                )}>
                    {children}
                </main>
            </div>
        </div>
    );
}
