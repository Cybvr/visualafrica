import { promosTiptapDoc } from "@/app/docs/content"
import { TiptapReadonly } from "@/components/docs/TiptapReadonly"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Payments and Security | Waddi Help",
}

export default function PromosOffersPage() {
  return <TiptapReadonly content={promosTiptapDoc} />
}
