import { playbookTiptapDoc } from "@/app/docs/content"
import { TiptapReadonly } from "@/components/docs/TiptapReadonly"
import type { Metadata } from "next"

export const metadata: Metadata = {
    title: "Hosting and Planning | Waddi Help",
}

export default function GrowthPlaybookPage() {
    return <TiptapReadonly content={playbookTiptapDoc} />
}
