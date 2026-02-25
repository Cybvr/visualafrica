import type { Metadata } from "next";

export const metadata: Metadata = {
    title: {
        default: "Admin | Waddi",
        template: "%s | Waddi Admin",
    },
};

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}
