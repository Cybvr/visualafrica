import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Store Kit",
  description: "View kit details and start planning from templates.",
};

export default function HostsStoreItemLayout({ children }: { children: React.ReactNode }) {
  return children;
}
