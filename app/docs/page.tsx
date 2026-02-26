import type { Metadata } from "next"
import { overviewTiptapDoc } from "@/app/docs/content"
import { TiptapReadonly } from "@/components/docs/TiptapReadonly"

export const metadata: Metadata = {
  title: "Overview | Waddi Docs",
}

export default function DocsOverviewPage() {
  return <TiptapReadonly content={overviewTiptapDoc} />
}
