import { experiencesTiptapDoc } from "@/app/docs/content"
import { TiptapReadonly } from "@/components/docs/TiptapReadonly"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Narratives & Experiences | Waddi Docs",
}

export default function ExperiencesPage() {
  return <TiptapReadonly content={experiencesTiptapDoc} />
}
