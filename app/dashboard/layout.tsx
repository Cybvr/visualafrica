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
        <div className="flex min-h-screen bg-white text-slate-900">
            {/* Desktop Sidebar */}
            <aside className="hidden md:block w-64 border-r border-slate-100 shrink-0 h-screen sticky top-0">
                <Sidebar />
            </aside>

            {/* Mobile Sidebar */}
            <Sheet open={open} onOpenChange={setOpen}>
                <SheetContent side="left" className="p-0 w-64 border-none">
                    <Sidebar onNavigate={() => setOpen(false)} />
                </SheetContent>
            </Sheet>

            <div className="flex-1 flex flex-col min-w-0 min-h-screen">
                <header className="border-b border-slate-100 h-16 shrink-0 bg-white sticky top-0 z-20">
                    <Header onOpenMenu={() => setOpen(true)} />
                </header>

                <main className="flex-1 bg-slate-50/50 p-6 md:p-10">
                    {children}
                </main>
            </div>
        </div>
    );
}
