"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import { auth, googleProvider } from "@/lib/firebase"
import { signInWithPopup } from "firebase/auth"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleGoogleSignIn = async () => {
    setIsLoading(true)
    try {
      await signInWithPopup(auth, googleProvider)
      router.push("/dashboard")
    } catch (error) {
      console.error("Login error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen">
      {/* Left Side - Image */}
      <div className="relative hidden w-1/2 lg:block">
        <Image
          src="/images/hero-wedding.jpg"
          alt="Beautiful event in Lagos"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-foreground/50" />
        <div className="absolute inset-0 flex flex-col items-start justify-end p-12">
          <Link href="/" className="absolute left-8 top-8 flex items-center gap-2">
            <img src="/logo.png" alt="Visual Africa Logo" className="h-8 w-auto object-contain" />
            <span className="font-logo text-xl font-normal text-background">
              Visual Africa
            </span>
          </Link>
          <div className="max-w-md space-y-8">
            <div className="space-y-5">
              <p className="font-serif text-2xl font-semibold leading-snug text-background">
                All-in-one event planning.
              </p>
              <ul className="space-y-3 text-sm text-background/90">
                <li>
                  <span className="font-semibold text-background">Discover venues in no time</span>
                  <br />
                  Browse and compare hotels, venues, and activities in minutes instead of weeks.
                </li>
                <li>
                  <span className="font-semibold text-background">Guest management made simple</span>
                  <br />
                  Sites, RSVPs, room assignments, and announcements—unified in a single tool.
                </li>
                <li>
                  <span className="font-semibold text-background">AI takes care of the grind</span>
                  <br />
                  Sourcing, quotes, and outreach run automatically in the background.
                </li>
              </ul>
            </div>
            <blockquote className="border-l-2 border-background/50 pl-4">
              <p className="font-serif text-xl font-semibold leading-snug text-background">
                {"\"Visual Africa made planning our wedding in Lagos an absolute dream. The vendors were incredible!\""}
              </p>
              <footer className="mt-3 text-sm text-background/70">
                — Adunni & Chike, Lagos
              </footer>
            </blockquote>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex w-full flex-col items-center justify-center bg-background px-4 py-12 lg:w-1/2">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="mb-8 flex items-center justify-between lg:hidden">
            <Link href="/" className="flex items-center gap-2">
              <img src="/logo.png" alt="Visual Africa Logo" className="h-8 w-auto object-contain" />
              <span className="font-logo text-xl font-normal text-foreground">
                Visual Africa
              </span>
            </Link>
          </div>

          <Link
            href="/"
            className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to home
          </Link>

          <Card className="border-border bg-card shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="font-serif text-2xl font-bold text-card-foreground">
                Welcome back
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Sign in to your Visual Africa account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-3">
                <Button
                  className="w-full bg-primary text-foreground hover:bg-primary/90"
                  onClick={handleGoogleSignIn}
                  disabled={isLoading}
                >
                  <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                  </svg>
                  {isLoading ? "Signing in..." : "Continue with Google"}
                </Button>
                <Button
                  variant="outline"
                  className="w-full border-border text-foreground hover:bg-secondary"
                  disabled={isLoading}
                >
                  <svg className="mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M16.365 1.43c0 1.14-.493 2.27-1.177 3.08-.744.9-1.99 1.57-2.987 1.57-.18 0-.36-.02-.53-.06-.17-.06-.28-.1-.28-.18 0-.15.06-.37.17-.66.58-1.31 1.86-2.63 2.98-3.08.56-.23 1.24-.42 1.81-.47.01.13.01.27.01.4zM18 12.26c0-2.08 1.01-3.3 2.08-4.12-.78-1.16-2-1.94-3.46-1.94-1.53 0-2.18.62-3.24.62-1.1 0-1.94-.62-3.07-.62-1.67 0-3.46 1.38-3.46 4.04 0 1.67.65 3.42 1.44 4.56.69.97 1.28 1.75 2.19 1.75.86 0 1.24-.57 2.32-.57 1.1 0 1.38.56 2.3.56.92 0 1.56-.86 2.19-1.73.45-.62.78-1.2.97-1.55-.06-.02-2.26-.96-2.26-3z" />
                  </svg>
                  Continue with Apple
                </Button>
              </div>

              <p className="mt-6 text-center text-sm text-muted-foreground">
                {"Don't have an account?"}{" "}
                <Link
                  href="/auth/register"
                  className="font-medium text-primary transition-colors hover:text-primary/80"
                >
                  Create account
                </Link>
              </p>
            </CardContent>
          </Card>

          <p className="mt-6 text-center text-xs text-muted-foreground">
            By continuing, you agree to our{" "}
            <Link href="/terms" className="underline hover:text-foreground">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="underline hover:text-foreground">
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  )
}