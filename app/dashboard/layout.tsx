"use client";

import React, { useState } from "react";
import Sidebar from "../../components/dashboard/Sidebar";
import Header from "../../components/dashboard/Header";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [open, setOpen] = useState(false);

    return (
        <div className="flex min-h-screen bg-background text-foreground">
            {/* Desktop Sidebar */}
            <aside className="hidden md:block border-r border-border shrink-0 h-screen sticky top-0 w-28">
                <Sidebar />
            </aside>

            {/* Mobile Sidebar */}
            <Sheet open={open} onOpenChange={setOpen}>
                <SheetContent side="left" className="p-0 w-28 border-none">
                    <Sidebar onNavigate={() => setOpen(false)} />
                </SheetContent>
            </Sheet>

            <div className="flex-1 flex flex-col min-w-0 min-h-screen">
                <header className="border-b border-border h-16 shrink-0 bg-background sticky top-0 z-20">
                    <Header onOpenMenu={() => setOpen(true)} />
                </header>

                <main className="flex-1 bg-secondary/30 p-3 sm:p-4 md:p-10">
                    {children}
                </main>
            </div>
        </div>
    );
}
