import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Store",
  description: "Browse planning kits, resources, and host tools.",
};

export default function HostsStoreLayout({ children }: { children: React.ReactNode }) {
  return children;
}
