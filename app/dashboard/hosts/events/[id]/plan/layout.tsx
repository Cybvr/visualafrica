import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Event Plan",
  description: "Manage your event plan and planning checklist.",
};

export default function HostsEventPlanLayout({ children }: { children: React.ReactNode }) {
  return children;
}
