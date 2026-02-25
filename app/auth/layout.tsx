import type { Metadata } from "next";

export const metadata: Metadata = {
    title: {
        default: "Sign In | Waddi",
        template: "%s | Waddi",
    },
};

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}
