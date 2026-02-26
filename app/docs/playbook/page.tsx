import { playbookTiptapDoc } from "@/app/docs/content"
import { TiptapReadonly } from "@/components/docs/TiptapReadonly"
import type { Metadata } from "next"

export const metadata: Metadata = {
    title: "Growth Playbook | Waddi Docs",
}

export default function GrowthPlaybookPage() {
    return <TiptapReadonly content={playbookTiptapDoc} />
}
