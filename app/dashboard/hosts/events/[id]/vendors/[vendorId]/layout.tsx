import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Vendor Workspace",
  description: "Review vendor details, proposals, and event collaboration.",
};

export default function HostsEventVendorLayout({ children }: { children: React.ReactNode }) {
  return children;
}
