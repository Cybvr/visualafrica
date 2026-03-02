import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "Host Dashboard",
    template: "%s | Host Dashboard",
  },
  description: "Manage events, vendors, guests, and planning workflows in your Waddi host dashboard.",
};

export default function HostsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
