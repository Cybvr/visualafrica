import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Settings",
  description: "Manage account, team, and dashboard preferences.",
};

export default function HostsSettingsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
