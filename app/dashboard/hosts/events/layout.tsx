import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Events",
  description: "View and manage your hosted events.",
};

export default function HostsEventsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
