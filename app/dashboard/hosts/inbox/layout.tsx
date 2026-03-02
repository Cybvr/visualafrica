import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Inbox",
  description: "Review and manage vendor conversations for your events.",
};

export default function HostsInboxLayout({ children }: { children: React.ReactNode }) {
  return children;
}
