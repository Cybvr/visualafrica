"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/providers/auth-provider"

function isStandalonePwa(): boolean {
  if (typeof window === "undefined") return false

  const isStandaloneDisplayMode = window.matchMedia("(display-mode: standalone)").matches
  const isIosStandalone = Boolean((window.navigator as Navigator & { standalone?: boolean }).standalone)

  return isStandaloneDisplayMode || isIosStandalone
}

export function PwaAuthGate() {
  const router = useRouter()
  const { user, loading } = useAuth()

  useEffect(() => {
    if (loading || !isStandalonePwa()) return

    router.replace(user ? "/dashboard" : "/auth/login")
  }, [loading, router, user])

  return null
}
