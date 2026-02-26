import { promosTiptapDoc } from "@/app/docs/content"
import { TiptapReadonly } from "@/components/docs/TiptapReadonly"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Promos and Offers | Waddi Docs",
}

export default function PromosOffersPage() {
  return <TiptapReadonly content={promosTiptapDoc} />
}
