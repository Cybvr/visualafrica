import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Experiences",
  description: "Discover and manage premium host experiences.",
};

export default function HostsExperiencesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
