"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import {
  Search,
  Clock,
  CheckCircle2,
  Calendar,
  Users,
  Info,
  CreditCard,
  Lock
} from "lucide-react";
import { SiVisa, SiMastercard, SiDiscover } from "react-icons/si";
import { formatCurrency } from "@/lib/utils";
import { getExperienceById } from "@/lib/firestore-service";
import type { Experience } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/providers/auth-provider";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

function parseDateTime(dateValue: string, timeValue: string): Date | null {
  if (!dateValue || !timeValue) return null;
  const dt = new Date(`${dateValue}T${timeValue}`);
  return Number.isNaN(dt.getTime()) ? null : dt;
}

function formatBookingDateTime(dateValue: string, timeValue: string): string {
  const dt = parseDateTime(dateValue, timeValue);
  if (!dt) return "Date and time to be confirmed";

  const datePart = new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(dt);
  const timePart = new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
  }).format(dt);
  return `${datePart} • ${timePart}`;
}

function formatCancellationDeadline(dateValue: string, timeValue: string): string {
  const dt = parseDateTime(dateValue, timeValue);
  if (!dt) return "before the experience start time";

  const deadline = new Date(dt);
  deadline.setDate(deadline.getDate() - 1);
  const datePart = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(deadline);
  const timePart = new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
  }).format(dt);
  return `before ${timePart} on ${datePart}`;
}

export default function BookingPage() {
  const params = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const { user, profile } = useAuth();
  const [experience, setExperience] = useState<Experience | null>(null);
  const [loading, setLoading] = useState(true);

  // Form states
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [pickupOption, setPickupOption] = useState("pickup");
  const [pickupLocation, setPickupLocation] = useState("");
  const [specialRequirements, setSpecialRequirements] = useState("");
  const [detailsVerified, setDetailsVerified] = useState(false);
  const [detailsError, setDetailsError] = useState("");
  const [guestCount] = useState(() => {
    const guests = Number.parseInt(searchParams.get("guests") ?? "1", 10);
    return Number.isFinite(guests) && guests > 0 ? guests : 1;
  });
  const [holdSeconds, setHoldSeconds] = useState(15 * 60);

  useEffect(() => {
    async function load() {
      try {
        const data = await getExperienceById(params.id);
        setExperience(data);
      } catch (error) {
        console.error("Failed to load experience:", error);
      } finally {
        setLoading(false);
      }
    }
    if (params.id) load();
  }, [params.id]);

  useEffect(() => {
    const interval = setInterval(() => {
      setHoldSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const displayName = profile?.displayName || user?.displayName || "";
    if (!displayName || firstName || lastName) return;

    const parts = displayName.trim().split(/\s+/).filter(Boolean);
    if (parts.length === 0) return;

    setFirstName(parts[0] || "");
    setLastName(parts.slice(1).join(" "));
  }, [profile?.displayName, user?.displayName, firstName, lastName]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (!experience) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-foreground">
        <p className="text-base font-semibold">Experience not found.</p>
      </div>
    );
  }

  const hasUnitPrice =
    experience.price !== null &&
    experience.price !== undefined &&
    !Number.isNaN(Number(experience.price));
  const unitPrice = hasUnitPrice ? Number(experience.price) : null;
  const totalPrice = unitPrice !== null ? unitPrice * guestCount : null;
  const guestLabel = `${guestCount} Adult${guestCount === 1 ? "" : "s"}`;
  const holdMinutes = String(Math.floor(holdSeconds / 60)).padStart(2, "0");
  const holdRemainingSeconds = String(holdSeconds % 60).padStart(2, "0");
  const email = profile?.email || user?.email || "";
  const phone = (profile as { phone?: string } | null)?.phone || user?.phoneNumber || "";
  const bookingDate = searchParams.get("date") ?? "";
  const bookingTime = searchParams.get("time") ?? "";
  const bookingDateTimeLabel = formatBookingDateTime(bookingDate, bookingTime);
  const cancellationDeadlineLabel = formatCancellationDeadline(bookingDate, bookingTime);
  const handleNext = () => {
    if (!firstName.trim() || !lastName.trim()) {
      setDetailsVerified(false);
      setDetailsError("Enter first and last name to continue.");
      return;
    }

    if (!bookingDate || !bookingTime || guestCount < 1) {
      setDetailsVerified(false);
      setDetailsError("Booking date, time, and guests are required.");
      return;
    }

    if (pickupOption === "pickup" && !pickupLocation.trim()) {
      setDetailsVerified(false);
      setDetailsError("Enter a pickup location or choose 'I'll decide later'.");
      return;
    }

    setDetailsError("");
    setDetailsVerified(true);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="mx-auto max-w-[1240px] px-4 py-8 md:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">

          {/* Main Column */}
          <div className="lg:col-span-2 space-y-6">

            {/* Step 1: Contact Details */}
            <section className="rounded-xl border border-border bg-background p-6 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-muted text-xs font-bold">1</div>
                  <h2 className="text-xl font-bold">Contact details</h2>
                </div>
                <Button variant="link" className="h-auto p-0 text-sm font-bold text-foreground hover:no-underline">Edit</Button>
              </div>
              <div className="space-y-1 text-base text-muted-foreground">
                <p className="font-bold text-foreground">{firstName} {lastName}</p>
                <p>Email: {email || "Not provided"}</p>
                {phone ? <p>Phone: {phone}</p> : null}
              </div>
            </section>

            {/* Step 2: Activity Details */}
            <section className="rounded-xl border border-border bg-background p-6 shadow-sm">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-foreground text-xs font-bold text-background">2</div>
                <h2 className="text-xl font-bold">Activity details</h2>
              </div>

              <div className="flex flex-col gap-6 rounded-2xl border border-border bg-muted/30 p-4 md:flex-row">
                <div className="relative h-28 w-full overflow-hidden rounded-xl md:w-32">
                  <Image
                    src={experience.image || "/placeholder.png"}
                    alt={experience.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 space-y-3">
                  <h3 className="text-xl font-bold leading-tight">{experience.title}</h3>
                  <div className="flex flex-col gap-3 text-sm text-muted-foreground md:text-base">
                    <div className="flex items-center gap-2">
                      <Users size={18} className="text-foreground" />
                      <span>{guestLabel}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar size={18} className="text-foreground" />
                      <span>{bookingDateTimeLabel}</span>
                    </div>
                    <div className="flex items-start gap-2 text-primary">
                      <CheckCircle2 size={18} className="mt-0.5 shrink-0" />
                      <div className="text-sm">
                        <div className="flex flex-wrap items-center gap-1">
                          <Popover>
                            <PopoverTrigger asChild>
                              <span className="cursor-pointer font-bold underline decoration-primary/30 underline-offset-4 hover:decoration-primary">
                                Free cancellation
                              </span>
                            </PopoverTrigger>
                            <PopoverContent className="max-w-[300px] p-4 text-sm shadow-xl">
                              <div className="space-y-2">
                                <h4 className="font-bold">Cancellation Policy</h4>
                                <p className="text-muted-foreground leading-relaxed">
                                  You can cancel this experience for a full refund as long as you do so at least 24 hours before it starts. After that, no refund is available.
                                </p>
                              </div>
                            </PopoverContent>
                          </Popover>
                          <span> + </span>
                          <Popover>
                            <PopoverTrigger asChild>
                              <span className="cursor-pointer font-bold underline decoration-primary/30 underline-offset-4 hover:decoration-primary">
                                Unlimited rescheduling
                              </span>
                            </PopoverTrigger>
                            <PopoverContent className="max-w-[300px] p-4 text-sm shadow-xl">
                              <div className="space-y-2">
                                <h4 className="font-bold">Rescheduling Policy</h4>
                                <p className="text-muted-foreground leading-relaxed">
                                  Need to change your plans? You can reschedule this experience as many times as you like for free up to 24 hours before start. Subject to availability.
                                </p>
                              </div>
                            </PopoverContent>
                          </Popover>
                        </div>
                        <span className="block mt-1 text-muted-foreground">{cancellationDeadlineLabel}</span>
                      </div>
                    </div>
                  </div>
                  <Button asChild variant="link" className="h-auto p-0 text-sm font-bold text-muted-foreground underline decoration-dotted underline-offset-4">
                    <Link href={`/dashboard/hosts/vendor/${experience.vendorSlug || ""}`}>
                      Visit Experience Operator
                    </Link>
                  </Button>
                </div>
              </div>

              {/* Traveler Form */}
              <div className="mt-8 space-y-4">
                <h4 className="text-lg font-bold">Primary traveler (Adult)</h4>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-muted-foreground">First name</label>
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => {
                        setFirstName(e.target.value);
                        if (detailsVerified) setDetailsVerified(false);
                        if (detailsError) setDetailsError("");
                      }}
                      className="w-full rounded-lg border border-input px-4 py-3 outline-none focus:border-ring"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-muted-foreground">Last name</label>
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => {
                        setLastName(e.target.value);
                        if (detailsVerified) setDetailsVerified(false);
                        if (detailsError) setDetailsError("");
                      }}
                      className="w-full rounded-lg border border-input px-4 py-3 outline-none focus:border-ring"
                    />
                  </div>
                </div>
              </div>

              {/* Pickup Point */}
              <div className="mt-8 space-y-4 border-t border-border pt-6">
                <h4 className="text-lg font-bold">Pickup point</h4>
                <p className="text-base text-muted-foreground">Tell us where you&apos;d like to be picked up from. If you&apos;re not sure, you can decide later.</p>

                <div className="space-y-3">
                  <label className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition-colors ${pickupOption === 'pickup' ? 'border-primary bg-muted' : 'border-border'}`}>
                    <input
                      type="radio"
                      name="pickup"
                      className="mt-1 h-4 w-4 accent-primary"
                      checked={pickupOption === 'pickup'}
                      onChange={() => {
                        setPickupOption("pickup");
                        if (detailsVerified) setDetailsVerified(false);
                        if (detailsError) setDetailsError("");
                      }}
                    />
                    <div className="flex-1 space-y-3">
                      <span className="text-sm font-bold">I&apos;d like to be picked up</span>
                      {pickupOption === 'pickup' && (
                        <div className="relative">
                          <input
                            type="text"
                            placeholder="Search location"
                            value={pickupLocation}
                            onChange={(e) => {
                              setPickupLocation(e.target.value);
                              if (detailsVerified) setDetailsVerified(false);
                              if (detailsError) setDetailsError("");
                            }}
                            className="w-full rounded-lg border border-input py-3 pl-4 pr-10 text-sm outline-none"
                          />
                          <Search size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                  </label>

                  <label className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 transition-colors ${pickupOption === 'later' ? 'border-primary bg-muted' : 'border-border'}`}>
                    <input
                      type="radio"
                      name="pickup"
                      className="h-4 w-4 accent-primary"
                      checked={pickupOption === 'later'}
                      onChange={() => {
                        setPickupOption("later");
                        if (detailsVerified) setDetailsVerified(false);
                        if (detailsError) setDetailsError("");
                      }}
                    />
                    <span className="text-sm font-bold">I&apos;ll decide later</span>
                  </label>
                </div>
              </div>

              {/* Language & Requirements */}
              <div className="mt-8 flex flex-col gap-6 border-t border-border pt-6 md:flex-row">
                <div className="flex-1 space-y-2">
                  <h4 className="text-lg font-bold">Tour language</h4>
                  <p className="text-base text-muted-foreground">English - Guide</p>
                </div>
                <div className="flex-[2] space-y-2">
                  <div className="relative">
                    <label className="absolute -top-2 left-3 bg-background px-1 text-xs font-bold text-muted-foreground">Special requirements</label>
                    <textarea
                      className="w-full rounded-lg border border-input p-4 text-sm outline-none focus:border-ring"
                      rows={4}
                      placeholder="Special requirements"
                      maxLength={1000}
                      value={specialRequirements}
                      onChange={(e) => setSpecialRequirements(e.target.value)}
                    ></textarea>
                    <p className="text-right text-xs font-bold text-muted-foreground">{specialRequirements.length}/1000 characters maximum</p>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <Button onClick={handleNext} className="rounded-lg px-8 py-3 font-bold">
                  {detailsVerified ? "Verified" : "Next"}
                </Button>
                {detailsError ? (
                  <p className="mt-2 text-sm font-semibold text-destructive">{detailsError}</p>
                ) : null}
              </div>
            </section>

            {/* Step 3: Payment Details */}
            <section className="rounded-xl border border-border bg-background p-6 shadow-sm">
              <div className="mb-6 flex items-center gap-3">
                <div className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${detailsVerified ? "bg-foreground text-background" : "bg-muted text-foreground"}`}>3</div>
                <h2 className="text-xl font-bold">Payment details</h2>
              </div>
              {!detailsVerified ? (
                <p className="text-sm font-semibold text-muted-foreground">Complete Step 2 and click Next to unlock payment.</p>
              ) : (
              <div className="space-y-6">
                <div className="rounded-xl border border-primary bg-primary/5 p-4">
                  <div className="flex items-center justify-between font-bold">
                    <div className="flex items-center gap-2">
                      <CreditCard size={20} className="text-primary" />
                      <span>Credit or debit card</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <SiVisa size={32} className="text-[#1A1F71]" />
                      <SiMastercard size={32} className="text-[#EB001B]" />
                      <SiDiscover size={32} className="text-[#FF6000]" />
                    </div>
                  </div>

                  <div className="mt-6 space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-muted-foreground">Cardholder name</label>
                      <input
                        type="text"
                        placeholder="John Doe"
                        className="w-full rounded-lg border border-input px-4 py-3 outline-none focus:border-ring"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-bold text-muted-foreground">Card number</label>
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="0000 0000 0000 0000"
                          className="w-full rounded-lg border border-input px-4 py-3 pr-12 outline-none focus:border-ring"
                        />
                        <Lock size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-muted-foreground">Expiry date</label>
                        <input
                          type="text"
                          placeholder="MM/YY"
                          className="w-full rounded-lg border border-input px-4 py-3 outline-none focus:border-ring"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-muted-foreground">CVC/CVV</label>
                        <input
                          type="text"
                          placeholder="123"
                          className="w-full rounded-lg border border-input px-4 py-3 outline-none focus:border-ring"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 border-t border-border pt-6">
                  <h4 className="text-lg font-bold">Billing address</h4>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-muted-foreground">Country</label>
                      <Select defaultValue="US">
                        <SelectTrigger className="w-full h-12 bg-background">
                          <SelectValue placeholder="Select country" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="US">United States</SelectItem>
                          <SelectItem value="NG">Nigeria</SelectItem>
                          <SelectItem value="UK">United Kingdom</SelectItem>
                          <SelectItem value="CA">Canada</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-muted-foreground">Zip / Postal code</label>
                      <input
                        type="text"
                        placeholder="10001"
                        className="w-full rounded-lg border border-input px-4 py-3 outline-none focus:border-ring"
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-8 space-y-4 border-t border-border pt-6">
                  <p className="text-xs text-muted-foreground">
                    By clicking &quot;Book now&quot;, you are agreeing to Waddi&apos;s <Link href="#" className="underline">Terms and Conditions</Link> and <Link href="#" className="underline">Privacy Policy</Link>.
                  </p>
                  <Button className="w-full h-14 text-lg font-bold rounded-xl" size="lg">
                    Book now
                  </Button>
                  <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                    <Lock size={14} />
                    <span>Secure Checkout</span>
                  </div>
                </div>
              </div>
              )}
            </section>

          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="sticky top-24 space-y-6">

              {/* Summary Card */}
              <section className="overflow-hidden rounded-xl border border-border bg-background shadow-sm">
                {/* Timer Banner */}
                <div className="flex items-center justify-center gap-2 bg-muted py-2 text-sm font-bold text-foreground">
                  <Clock size={16} />
                  <span>
                    Holding your spot for{" "}
                    <span className="font-black">{holdMinutes}:{holdRemainingSeconds}</span> minutes
                  </span>
                </div>

                <div className="p-4 space-y-4">
                  <div className="flex gap-3">
                    <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg">
                      <Image
                        src={experience.image || "/placeholder.png"}
                        alt={experience.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <h3 className="text-base font-bold leading-snug">{experience.title}</h3>
                  </div>

                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Users size={16} />
                        <span>{guestLabel}</span>
                      </div>
                      <span className="font-bold text-foreground">
                        {totalPrice !== null ? formatCurrency(totalPrice) : "Contact for pricing"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar size={16} />
                      <span>{bookingDateTimeLabel}</span>
                    </div>
                    <div className="flex items-center gap-2 text-primary">
                      <CheckCircle2 size={16} />
                      <div className="text-xs">
                        <div className="flex flex-wrap items-center gap-1">
                          <Popover>
                            <PopoverTrigger asChild>
                              <span className="cursor-pointer font-bold underline decoration-primary/30 underline-offset-2 hover:decoration-primary">
                                Free cancellation
                              </span>
                            </PopoverTrigger>
                            <PopoverContent className="max-w-[250px] p-3 text-xs shadow-lg">
                              Full refund if cancelled at least 24 hours prior to the experience start time.
                            </PopoverContent>
                          </Popover>
                          <span>+</span>
                          <Popover>
                            <PopoverTrigger asChild>
                              <span className="cursor-pointer font-bold underline decoration-primary/30 underline-offset-2 hover:decoration-primary">
                                Rescheduling
                              </span>
                            </PopoverTrigger>
                            <PopoverContent className="max-w-[250px] p-3 text-xs shadow-lg">
                              Free rescheduling up to 24 hours before the experience starts.
                            </PopoverContent>
                          </Popover>
                        </div>
                        <span className="block mt-0.5 text-[11px] text-muted-foreground">{cancellationDeadlineLabel}</span>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-border pt-4">
                    <Button variant="link" className="h-auto p-0 text-sm font-bold underline">
                      <Info size={14} className="rotate-180" />
                      Enter Promo Code
                    </Button>
                  </div>

                  <div className="flex items-center justify-between border-t border-border pt-4 text-lg font-bold">
                    <span>Total price (USD):</span>
                    <span>{totalPrice !== null ? formatCurrency(totalPrice) : "Contact for pricing"}</span>
                  </div>
                </div>
              </section>

              {/* Confidence Tags */}
              <div className="space-y-6 px-2">
                <div className="space-y-4">
                  <div className="space-y-1">
                    <h5 className="text-base font-bold">Exceptional flexibility</h5>
                    <p className="text-sm text-muted-foreground">Free cancellation and lowest price guarantee</p>
                  </div>
                  <div className="space-y-1">
                    <h5 className="text-base font-bold">24/7 global support</h5>
                    <p className="text-sm text-muted-foreground">Our award-winning customer service team is here to help</p>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
