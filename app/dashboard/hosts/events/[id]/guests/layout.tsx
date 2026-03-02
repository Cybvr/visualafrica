import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Guest List",
  description: "Manage guest invitations, statuses, and attendance.",
};

export default function HostsEventGuestsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
