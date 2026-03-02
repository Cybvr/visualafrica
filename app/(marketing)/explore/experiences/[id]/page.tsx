"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ChevronLeft,
  Clock3,
  MapPin,
  MessageSquare,
  ShieldCheck,
  Sparkles,
  Star,
  Calendar,
  Users,
  Clock,
  Heart,
  Store,
} from "lucide-react";


import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import SupportChat from "@/components/dashboard/SupportChat";
import { FAQ_CATEGORIES } from "@/lib/constants";
import { getExperienceById, getRelatedExperiences, getFaqs } from "@/lib/firestore-service";
import type { Experience, FAQ } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";
import { ExperienceCard } from "@/components/dashboard/experience-card";
import { useSavedVendors } from "@/hooks/use-saved-vendors";
import { useAuth } from "@/components/providers/auth-provider";
import { auth, googleProvider } from "@/lib/firebase";
import { signInWithPopup } from "firebase/auth";

export default function ExperienceDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [experience, setExperience] = useState<Experience | null>(null);
  const [relatedExperiences, setRelatedExperiences] = useState<Experience[]>([]);
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { savedVendorIds, toggleSavedVendor } = useSavedVendors(user?.uid);
  const [bookingDate, setBookingDate] = useState("");
  const [bookingGuests, setBookingGuests] = useState(1);
  const [bookingTime, setBookingTime] = useState("");
  const [bookingValidationError, setBookingValidationError] = useState("");
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const [pendingBookPath, setPendingBookPath] = useState("");
  const [authButtonLoading, setAuthButtonLoading] = useState(false);
  const [heroImageFailed, setHeroImageFailed] = useState(false);



  useEffect(() => {
    async function load() {
      try {
        const [data, related, faqData] = await Promise.all([
          getExperienceById(params.id),
          getRelatedExperiences(params.id, 100),
          getFaqs()
        ]);



        setExperience(data);
        setRelatedExperiences(related);
        setFaqs(faqData);
      } catch (error) {

        console.error("Failed to load experience data:", error);
      } finally {
        setLoading(false);
      }
    }

    if (params.id) {
      load();
    }
  }, [params.id]);

  useEffect(() => {
    setHeroImageFailed(false);
  }, [experience?.id, experience?.image]);

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl space-y-6 p-6">
        <div className="h-8 w-36 animate-pulse rounded bg-muted" />
        <div className="h-80 animate-pulse rounded-2xl bg-muted" />
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="h-64 animate-pulse rounded-2xl bg-muted lg:col-span-2" />
          <div className="h-64 animate-pulse rounded-2xl bg-muted" />
        </div>
      </div>
    );
  }

  if (!experience) {
    return (
      <div className="mx-auto max-w-5xl p-6 space-y-4">
        <Link href="/explore/experiences" className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground">
          <ChevronLeft size={16} />
          Back to experiences
        </Link>
        <p className="text-lg font-semibold text-foreground">Experience not found.</p>
      </div>
    );
  }

  const inclusionList =
    experience.whatsIncluded && experience.whatsIncluded.length > 0
      ? experience.whatsIncluded
      : [
        "Custom planning flow with your vendor",
        "Experience setup and hosting support",
        "Flexible add-ons tailored to your event",
        "Direct communication with the vendor team",
      ];

  const handleBookExperience = () => {
    if (!bookingDate || !bookingTime || !Number.isFinite(bookingGuests) || bookingGuests < 1) {
      setBookingValidationError("Select date, time, and at least 1 guest before booking.");
      return;
    }

    setBookingValidationError("");
    const query = new URLSearchParams({
      date: bookingDate,
      time: bookingTime,
      guests: String(bookingGuests),
    });
    const bookPath = `/explore/experiences/${experience.id}/book?${query.toString()}`;
    if (!user) {
      setPendingBookPath(bookPath);
      setAuthDialogOpen(true);
      return;
    }
    router.push(bookPath);
  };

  const handleGoogleSignIn = async () => {
    setAuthButtonLoading(true);
    try {
      await signInWithPopup(auth, googleProvider);
      setAuthDialogOpen(false);
      router.push(pendingBookPath || `/explore/experiences/${experience.id}`);
    } catch (error) {
      console.error("Login error:", error);
    } finally {
      setAuthButtonLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6 pb-12">
      <div className="px-6 pt-4 space-y-4">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/explore/experiences">Experiences</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="font-bold">{experience.title}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="space-y-2">
          <h1 className="text-2xl font-black tracking-tight text-foreground md:text-4xl">
            {experience.title}
          </h1>
        </div>

        <div className="flex flex-wrap gap-2 pt-2">
          <Link
            href={`/explore/vendors/${experience.vendorSlug || ""}`}
            className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1.5 text-xs font-black text-primary transition-colors hover:bg-primary/20"
          >
            <Store size={12} />
            {experience.vendorName || "Unknown Vendor"}
          </Link>
          <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-3 py-1.5 text-xs font-bold text-foreground transition-colors hover:bg-secondary/80">

            <Star size={12} className="fill-current" />
            {experience.rating || 0}
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-3 py-1.5 text-xs font-bold text-foreground">
            <MapPin size={12} />
            {experience.location}
          </span>
          {experience.duration ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-3 py-1.5 text-xs font-bold text-foreground">
              <Clock3 size={12} />
              {experience.duration}
            </span>
          ) : null}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 px-6 lg:grid-cols-3">
        <div className="space-y-8 lg:col-span-2">
          <section className="relative overflow-hidden rounded-2xl border border-border group/image">
            {experience.image && !heroImageFailed ? (
              <img
                src={experience.image}
                alt={experience.title}
                className="h-[460px] w-full object-cover transition-transform duration-700 group-hover/image:scale-105"
                onError={() => setHeroImageFailed(true)}
              />
            ) : (
              <img
                src="/placeholder.png"
                alt="Placeholder image"
                className="h-[460px] w-full object-cover"
              />
            )}

            <button
              onClick={() => toggleSavedVendor(experience.id)}
              className={`absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 shadow-lg transition-all hover:scale-110 active:scale-95 ${savedVendorIds.has(experience.id) ? "text-primary" : "text-muted-foreground hover:text-foreground"
                }`}
              title={savedVendorIds.has(experience.id) ? "Remove from wishlist" : "Add to wishlist"}
            >
              <Heart className={`h-5 w-5 ${savedVendorIds.has(experience.id) ? "fill-primary" : ""}`} />
            </button>
          </section>


          <section className="space-y-8">
            <div>
              <h2 className="text-xl text-foreground">Overview</h2>
              <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
                {experience.description}
              </p>
            </div>

            <div className="border-t border-border pt-6">
              <h2 className="text-xl text-foreground">What&apos;s Included</h2>
              <ul className="mt-3 space-y-3">
                {inclusionList.map((item, idx) => (
                  <li key={`${item}-${idx}`} className="flex items-start gap-2 text-sm text-foreground">
                    <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-green-600" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="border-t border-border pt-6">
              <h2 className="text-xl text-foreground">Additional Info</h2>
              <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="rounded-xl border border-border p-6 shadow-sm">
                  <h3 className="text-lg font-bold text-foreground">Cancellation Policy</h3>
                  <p className="mt-3 text-sm text-muted-foreground">
                    You can cancel up to 24 hours in advance of the experience for a full refund.
                  </p>
                  <button className="mt-6 rounded-lg border border-primary px-6 py-2 text-sm font-bold text-primary transition-colors hover:bg-primary/5">
                    Show more
                  </button>
                </div>

                <div className="rounded-xl border border-border p-6 shadow-sm">
                  <h3 className="text-lg font-bold text-foreground">Questions?</h3>
                  <div className="mt-3 space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Visit Waddi support for any further questions.
                    </p>
                    <p className="text-sm font-medium text-foreground">
                      Experience ID: <span className="font-mono text-muted-foreground">EXP-{experience.id.split('-').pop()?.substring(0, 3).toUpperCase()}{Math.abs(experience.id.split('').reduce((a, b) => { a = ((a << 5) - a) + b.charCodeAt(0); return a & a }, 0)).toString(36).substring(0, 4).toUpperCase()}</span>
                    </p>
                  </div>
                  <Popover>
                    <PopoverTrigger asChild>
                      <button
                        className="mt-4 inline-block rounded-lg border border-foreground px-6 py-2 text-sm font-bold text-foreground transition-colors hover:bg-secondary"
                      >
                        Waddi Support
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className="p-0 w-[400px] border-none bg-transparent shadow-none" align="start" sideOffset={10}>
                      <SupportChat faqs={faqs} categories={FAQ_CATEGORIES} className="h-[500px] shadow-2xl border border-border" />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </div>
          </section>
        </div>

        <aside className="space-y-4">
          <div className="sticky top-20 rounded-2xl border border-border bg-card p-5">
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              From
            </p>
            <p className="mt-1 text-2xl font-black text-foreground">
              {experience.price === null || experience.price === undefined || Number.isNaN(Number(experience.price))
                ? "Contact for pricing"
                : formatCurrency(Number(experience.price))}
            </p>

            <div className="mt-6 space-y-4 border-t border-border pt-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mr-1">Date</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={14} />
                  <input
                    type="date"
                    value={bookingDate}
                    onChange={(e) => {
                      setBookingDate(e.target.value);
                      if (bookingValidationError) setBookingValidationError("");
                    }}
                    className="w-full rounded-lg border border-border bg-background py-2.5 pl-9 pr-3 text-sm font-bold focus:ring-2 focus:ring-primary/20 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Guests</label>
                  <div className="relative">
                    <Users className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={14} />
                    <input
                      type="number"
                      min="1"
                      value={bookingGuests}
                      onChange={(e) => {
                        const nextGuests = Number.parseInt(e.target.value, 10);
                        setBookingGuests(Number.isFinite(nextGuests) && nextGuests > 0 ? nextGuests : 1);
                        if (bookingValidationError) setBookingValidationError("");
                      }}
                      className="w-full rounded-lg border border-border bg-background py-2.5 pl-9 pr-3 text-sm font-bold focus:ring-2 focus:ring-primary/20 outline-none"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Time</label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={14} />
                    <input
                      type="time"
                      value={bookingTime}
                      onChange={(e) => {
                        setBookingTime(e.target.value);
                        if (bookingValidationError) setBookingValidationError("");
                      }}
                      className="w-full rounded-lg border border-border bg-background py-2.5 pl-9 pr-3 text-sm font-bold focus:ring-2 focus:ring-primary/20 outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 space-y-2 border-t border-border pt-4 text-xs font-medium">

              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Vendor</span>
                <span className="max-w-[180px] truncate font-semibold text-foreground">
                  {experience.vendorName || "Unknown Vendor"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Rating</span>
                <span className="font-semibold text-foreground">{experience.rating || 0} / 5</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Location</span>
                <span className="max-w-[180px] truncate font-semibold text-foreground">
                  {experience.location}
                </span>
              </div>
            </div>

            <div className="mt-5 space-y-2">
              <button
                type="button"
                onClick={handleBookExperience}
                className="flex w-full items-center justify-center rounded-lg bg-primary px-3 py-2.5 text-sm font-bold text-white hover:bg-primary/90"
              >
                {user ? "Book Experience" : "Login to Book"}
              </button>
              {bookingValidationError ? (
                <p className="text-xs font-semibold text-destructive">{bookingValidationError}</p>
              ) : null}
              <Link
                href={`/explore/vendors/${experience.vendorSlug || ""}`}
                className="flex w-full items-center justify-center rounded-lg border border-border bg-card px-3 py-2.5 text-sm font-bold text-foreground hover:bg-secondary"
              >
                View Vendor Profile
              </Link>
              <Link
                href="/support"
                className="flex w-full items-center justify-center gap-2 rounded-lg border border-border bg-card px-3 py-2.5 text-sm font-bold text-foreground hover:bg-secondary"
              >
                <MessageSquare size={14} />
                Contact Support
              </Link>
            </div>
          </div>
        </aside>
      </div>

      <Dialog open={authDialogOpen} onOpenChange={setAuthDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Login to Book</DialogTitle>
            <DialogDescription className="sr-only">Authentication actions</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <div className="flex w-full flex-col gap-3">
              <Button
                className="w-full bg-primary text-foreground hover:bg-primary/90"
                onClick={handleGoogleSignIn}
                disabled={authButtonLoading}
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
                {authButtonLoading ? "Signing in..." : "Continue with Google"}
              </Button>
              <Button
                variant="outline"
                className="w-full border-border text-foreground hover:bg-secondary"
                disabled={authButtonLoading}
              >
                <svg className="mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M16.365 1.43c0 1.14-.493 2.27-1.177 3.08-.744.9-1.99 1.57-2.987 1.57-.18 0-.36-.02-.53-.06-.17-.06-.28-.1-.28-.18 0-.15.06-.37.17-.66.58-1.31 1.86-2.63 2.98-3.08.56-.23 1.24-.42 1.81-.47.01.13.01.27.01.4zM18 12.26c0-2.08 1.01-3.3 2.08-4.12-.78-1.16-2-1.94-3.46-1.94-1.53 0-2.18.62-3.24.62-1.1 0-1.94-.62-3.07-.62-1.67 0-3.46 1.38-3.46 4.04 0 1.67.65 3.42 1.44 4.56.69.97 1.28 1.75 2.19 1.75.86 0 1.24-.57 2.32-.57 1.1 0 1.38.56 2.3.56.92 0 1.56-.86 2.19-1.73.45-.62.78-1.2.97-1.55-.06-.02-2.26-.96-2.26-3z" />
                </svg>
                Continue with Apple
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>


      {/* New Sections */}
      <div className="space-y-12 px-6 pt-12 border-t border-border">
        {/* Compare Similar Experiences */}
        <section>
          <div className="mb-6">
            <h2 className="text-2xl text-foreground">Compare Similar Experiences</h2>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-border">

            <table className="w-full text-left text-sm">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-6 py-4 font-bold text-foreground">Feature</th>
                  <th className="px-6 py-4 font-bold text-primary">
                    <Link href={`/explore/experiences/${experience.id}`} className="hover:underline">
                      {experience.title} (Current)
                    </Link>
                  </th>
                  {relatedExperiences.slice(0, 2).map((exp) => (
                    <th key={exp.id} className="px-6 py-4 font-bold text-foreground">
                      <Link href={`/explore/experiences/${exp.id}`} className="hover:underline">
                        {exp.title}
                      </Link>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                <tr>
                  <td className="px-6 py-4 font-semibold text-muted-foreground">Summary</td>
                  <td className="px-6 py-4 align-top text-foreground">
                    <div className="space-y-1.5">
                      <p className="font-bold">{experience.price ? formatCurrency(Number(experience.price)) : "By Request"}</p>
                      <div className="flex items-center gap-1">
                        <Star size={14} className="fill-primary text-primary" />
                        <span className="font-semibold">{experience.rating || 0}</span>
                      </div>
                      <p className="font-medium">{experience.location}</p>
                      <p>{experience.vendorName}</p>
                      <span className="text-xs font-bold uppercase text-primary">Current Plan</span>
                    </div>
                  </td>
                  {relatedExperiences.slice(0, 2).map((exp) => (
                    <td key={exp.id} className="px-6 py-4 align-top text-foreground">
                      <div className="space-y-1.5">
                        <p className="font-bold">{exp.price ? formatCurrency(Number(exp.price)) : "By Request"}</p>
                        <div className="flex items-center gap-1">
                          <Star size={14} className="fill-primary text-primary" />
                          <span className="font-semibold">{exp.rating || 0}</span>
                        </div>
                        <p className="font-medium">{exp.location}</p>
                        <p>{exp.vendorName}</p>
                      </div>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Customers Who Bought This Tour Also Bought */}
        <section>
          <div className="mb-6">
            <h2 className="text-2xl text-foreground">Customers Who Bought This Tour Also Bought</h2>
          </div>

          <div className="flex flex-nowrap gap-6 overflow-x-auto pb-2">
            {relatedExperiences.map((exp) => (
              <div key={exp.id} className="w-[280px] flex-none">
                <ExperienceCard
                  experience={exp}
                  experienceHref={`/explore/experiences/${exp.id}`}
                  saved={savedVendorIds.has(exp.id)}
                  onToggleSave={() => toggleSavedVendor(exp.id)}
                />
              </div>
            ))}
          </div>
        </section>

        <section className="pb-12">
          <div className="mb-6">
            <h2 className="text-2xl text-foreground">Explore similar things to do</h2>
          </div>
          <div className="flex flex-nowrap gap-6 overflow-x-auto pb-2">
            {relatedExperiences.map((exp) => (
              <div key={exp.id} className="w-[280px] flex-none">
                <ExperienceCard
                  experience={exp}
                  experienceHref={`/explore/experiences/${exp.id}`}
                  saved={savedVendorIds.has(exp.id)}
                  onToggleSave={() => toggleSavedVendor(exp.id)}
                />
              </div>
            ))}
          </div>

        </section>


      </div>
    </div>

  );
}
