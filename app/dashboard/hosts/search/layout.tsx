import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Public Events",
  description: "Explore open public events on Waddi.",
};

export default function HostsSearchLayout({ children }: { children: React.ReactNode }) {
  return children;
}
