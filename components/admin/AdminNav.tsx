"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LayoutDashboard, Users, BookOpen, Settings } from "lucide-react";

export default function AdminNav() {
    const pathname = usePathname();

    const navItems = [
        { label: "Vendors", href: "/admin/vendors", icon: Users },
        { label: "Blog", href: "/admin/blog", icon: BookOpen },
    ];

    return (
        <div className="flex items-center gap-1 bg-secondary/30 p-1 rounded-xl w-fit">
            {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname.startsWith(item.href);
                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                            "flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-bold transition-all",
                            isActive
                                ? "bg-background text-primary shadow-sm"
                                : "text-muted-foreground hover:text-foreground hover:bg-background/50"
                        )}
                    >
                        <Icon size={16} />
                        {item.label}
                    </Link>
                );
            })}
        </div>
    );
}
