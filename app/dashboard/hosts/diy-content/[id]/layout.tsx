import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "DIY Article",
  description: "Detailed host guide from Waddi resources.",
};

export default function HostsDiyArticleLayout({ children }: { children: React.ReactNode }) {
  return children;
}
