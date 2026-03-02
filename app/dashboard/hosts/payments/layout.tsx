import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Payments",
  description: "Track and manage host payment activity.",
};

export default function HostsPaymentsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
