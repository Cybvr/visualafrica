import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Itinerary",
  description: "Review and update your event timeline and schedule.",
};

export default function HostsEventItineraryLayout({ children }: { children: React.ReactNode }) {
  return children;
}
