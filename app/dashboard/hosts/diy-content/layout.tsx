import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "DIY Content",
  description: "Read planning guides and educational resources.",
};

export default function HostsDiyContentLayout({ children }: { children: React.ReactNode }) {
  return children;
}
