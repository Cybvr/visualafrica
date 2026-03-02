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
import SupportChat from "@/components/dashboard/SupportChat";
import { FAQ_CATEGORIES } from "@/lib/constants";
import { getExperienceById, getRelatedExperiences, getFaqs } from "@/lib/firestore-service";
import type { Experience, FAQ } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";
import { ExperienceCard } from "@/components/dashboard/experience-card";
import { useSavedVendors } from "@/hooks/use-saved-vendors";
import { useAuth } from "@/components/providers/auth-provider";

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
        <Link href="/dashboard/hosts/experiences" className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground">
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
    router.push(`/dashboard/hosts/experiences/${experience.id}/book?${query.toString()}`);
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6 pb-12">
      <div className="px-6 pt-4 space-y-4">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/dashboard/hosts/experiences">Experiences</Link>
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
            href={`/dashboard/hosts/vendor/${experience.vendorSlug || ""}`}
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
                Book Experience
              </button>
              {bookingValidationError ? (
                <p className="text-xs font-semibold text-destructive">{bookingValidationError}</p>
              ) : null}
              <Link
                href={`/dashboard/hosts/vendor/${experience.vendorSlug || ""}`}
                className="flex w-full items-center justify-center rounded-lg border border-border bg-card px-3 py-2.5 text-sm font-bold text-foreground hover:bg-secondary"
              >
                View Vendor Profile
              </Link>
              <Link
                href={`/dashboard/hosts/inbox?vendorId=${encodeURIComponent(experience.vendorId)}`}
                className="flex w-full items-center justify-center gap-2 rounded-lg border border-border bg-card px-3 py-2.5 text-sm font-bold text-foreground hover:bg-secondary"
              >
                <MessageSquare size={14} />
                Contact Vendor
              </Link>
            </div>
          </div>
        </aside>
      </div>


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
                    <Link href={`/dashboard/hosts/experiences/${experience.id}`} className="hover:underline">
                      {experience.title} (Current)
                    </Link>
                  </th>
                  {relatedExperiences.slice(0, 2).map((exp) => (
                    <th key={exp.id} className="px-6 py-4 font-bold text-foreground">
                      <Link href={`/dashboard/hosts/experiences/${exp.id}`} className="hover:underline">
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
                  experienceHref={`/dashboard/hosts/experiences/${exp.id}`}
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
                  experienceHref={`/dashboard/hosts/experiences/${exp.id}`}
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
