"use client";

import React, { useEffect, useState } from "react";
import Header from "@/components/dashboard/Header";
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
    const [authChecked, setAuthChecked] = useState(false);

    const isChatPage = pathname?.startsWith("/dashboard/hosts/chat/");
    const isHostHomePage = pathname === "/dashboard/hosts";
    const isEventWorkspace = pathname?.startsWith("/dashboard/hosts/events/");
    const isEventDetailPage = isEventWorkspace && pathname !== "/dashboard/hosts/events/new";

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

    if (!authChecked) {
        return null;
    }

    return (
        <div className="flex h-screen min-h-0 bg-background text-foreground">
            <div className="flex h-screen min-h-0 flex-1 flex-col min-w-0">
                {!isChatPage && !isEventDetailPage && (
                    <header className="border-b border-border h-16 shrink-0 bg-background sticky top-0 z-20">
                        <Header />
                    </header>
                )}

                <main className={cn(
                    "flex-1 min-h-0 overflow-hidden bg-secondary/30",
                    isChatPage
                        ? "p-0 h-screen overflow-hidden"
                        : isHostHomePage
                            ? "p-0 overflow-hidden"
                            : isEventWorkspace
                                ? "p-0 overflow-hidden"
                            : "p-2 sm:p-4 md:p-5"
                )}>
                    {children}
                </main>
            </div>
        </div>
    );
}
