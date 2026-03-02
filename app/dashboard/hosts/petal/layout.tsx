import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Petal",
  description: "Petal workspace inside your host dashboard.",
};

export default function HostsPetalLayout({ children }: { children: React.ReactNode }) {
  return children;
}
