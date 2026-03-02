import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Host Chat",
  description: "Chat with Waddi AI and manage event planning conversations.",
};

export default function HostsChatLayout({ children }: { children: React.ReactNode }) {
  return children;
}
