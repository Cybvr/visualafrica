import { Header } from "@/app/(marketing)/common/header"
import { Footer } from "@/app/(marketing)/common/footer"
import { WaddiPrompt } from "@/components/landingpage/waddi-prompt"
import { FilmstripGallery } from "@/components/landingpage/filmstrip-gallery"
import { PwaAuthGate } from "@/components/pwa-auth-gate"

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <PwaAuthGate />
      <Header />
      <main className="flex-1">
        <WaddiPrompt mode="marketing" />
        <FilmstripGallery />
      </main>
      <Footer />
    </div>
  )
}
