import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Vendor Profile",
  description: "Review vendor details, pricing, and offerings.",
};

export default function HostsVendorDetailLayout({ children }: { children: React.ReactNode }) {
  return children;
}
