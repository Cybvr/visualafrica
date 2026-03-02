import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Event Details",
  description: "Track event details, planning progress, and operations.",
};

export default function HostsEventDetailLayout({ children }: { children: React.ReactNode }) {
  return children;
}
