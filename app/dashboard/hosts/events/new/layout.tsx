import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Event",
  description: "Create a new event and define your planning details.",
};

export default function HostsEventsNewLayout({ children }: { children: React.ReactNode }) {
  return children;
}
