import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Vendors",
  description: "Browse and filter vendors for your events.",
};

export default function HostsVendorsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
