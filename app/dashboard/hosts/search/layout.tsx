import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Vendor Search",
  description: "Search and filter vendors for your event plans.",
};

export default function HostsSearchLayout({ children }: { children: React.ReactNode }) {
  return children;
}
