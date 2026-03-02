"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { SharedEvent } from '@/lib/types';
import { getEvents } from '@/lib/firestore-service';
import { VENDOR_DASHBOARD_DATA } from '@/lib/vendor-dashboard-data';
import { DashboardFilter } from '@/components/dashboard/DashboardFilter';
import { MapPin, Calendar, Users, Star, Clock } from 'lucide-react';
import { VENDOR_CATEGORIES } from '@/lib/constants';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

type EventStatus = 'All Events' | 'Planning' | 'Confirmed' | 'Completed';

function formatEventDate(value: string): string {
  if (!value) return 'Date TBA';
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(parsed);
}

export default function VendorDashboardPage() {
  const router = useRouter();
  const [authUser, setAuthUser] = useState<FirebaseUser | null>(null);
  const [displayName, setDisplayName] = useState<string>('');
  const [allEvents, setAllEvents] = useState<SharedEvent[]>([]);
  const [hasVendorProfile, setHasVendorProfile] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [claimModalOpen, setClaimModalOpen] = useState(false);
  const [claimLoading, setClaimLoading] = useState(false);
  const [claimForm, setClaimForm] = useState({
    businessName: '',
    city: '',
    phone: '',
    description: '',
    categories: [] as string[],
  });
  const [step, setStep] = useState(1);
  const totalSteps = 3;

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setAuthUser(currentUser);
      if (!currentUser) {
        setDisplayName('');
        setHasVendorProfile(false);
        setAllEvents([]);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const userDocRef = doc(db, 'users', currentUser.uid);
        const [userDoc, ownedById] = await Promise.all([
          getDoc(userDocRef),
          getDocs(query(collection(db, 'vendors'), where('ownerId', '==', currentUser.uid))),
        ]);
        const ownedByEmail = currentUser.email
          ? await getDocs(query(collection(db, 'vendors'), where('loginEmail', '==', currentUser.email.toLowerCase())))
          : null;
        const name = userDoc.exists()
          ? (userDoc.data().displayName || currentUser.displayName || '')
          : (currentUser.displayName || '');
        setDisplayName(name);

        const vendorIds = Array.from(
          new Set(
            [...ownedById.docs, ...(ownedByEmail?.docs || [])].map((snap) => snap.id)
          )
        );
        setHasVendorProfile(vendorIds.length > 0);
        setClaimModalOpen(vendorIds.length === 0);

        const events = await getEvents();
        if (!vendorIds.length) {
          setAllEvents([]);
        } else {
          const filtered = events.filter(
            (event) => event.isPublicBrief === true && (event.publicBriefStatus || 'closed') === 'open'
          );
          setAllEvents(filtered);
        }
      } catch {
        setDisplayName(currentUser.displayName || '');
        setHasVendorProfile(false);
        setAllEvents([]);
      } finally {
        setIsLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  async function handleVendorOnboarding() {
    if (!authUser) return;

    if (!claimForm.businessName.trim() || !claimForm.city.trim() || !claimForm.phone.trim() || claimForm.categories.length === 0) {
      toast.error('Business name, city, phone, and category are required.');
      return;
    }

    setClaimLoading(true);
    try {
      const idToken = await authUser.getIdToken();
      const res = await fetch('/api/vendor/claim', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify(claimForm),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Failed to submit onboarding');

      toast.success('Vendor onboarding complete. Reloading vendor workspace...');
      setClaimModalOpen(false);
      window.location.reload();
    } catch (error: any) {
      toast.error(error.message || 'Failed to submit vendor onboarding');
    } finally {
      setClaimLoading(false);
    }
  }

  const { stats, leads, bookings } = VENDOR_DASHBOARD_DATA;
  const [activeTab, setActiveTab] = useState<'all' | 'saved'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredEvents = searchQuery.trim() === ''
    ? allEvents
    : allEvents.filter(event =>
      event.eventName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.hostName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.location.toLowerCase().includes(searchQuery.toLowerCase())
    );

  // For demo purposes, we'll just show a subset if tab is 'saved'
  const displayEvents = activeTab === 'all' ? filteredEvents : filteredEvents.slice(0, 2);

  const firstName = displayName.trim().split(/\s+/)[0] || displayName;
  const welcomeText = displayName
    ? `Welcome back, ${firstName}. Here's your business at a glance.`
    : "Welcome back. Here's your business at a glance.";

  return (
    <div className="max-w-7xl mx-auto space-y-12 pb-20">
      <Dialog open={claimModalOpen} onOpenChange={setClaimModalOpen}>
        <DialogContent className="sm:max-w-[560px]">
          <DialogHeader>
            <DialogTitle>Vendor Onboarding</DialogTitle>
            <DialogDescription>
              Step {step} of {totalSteps}: {step === 1 ? 'Business details' : step === 2 ? 'Service categories' : 'Business description'}
            </DialogDescription>
          </DialogHeader>

          <div className="w-full bg-secondary h-1.5 rounded-full overflow-hidden mb-4">
            <div
              className="h-full bg-primary transition-all duration-300 ease-in-out"
              style={{ width: `${(step / totalSteps) * 100}%` }}
            />
          </div>

          <div className="grid gap-4 py-2">
            {step === 1 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-muted-foreground">Business Name</label>
                  <input
                    className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                    value={claimForm.businessName}
                    onChange={(e) => setClaimForm((prev) => ({ ...prev, businessName: e.target.value }))}
                    placeholder="e.g. Waddi Events Co"
                  />
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase text-muted-foreground">City</label>
                    <input
                      className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                      value={claimForm.city}
                      onChange={(e) => setClaimForm((prev) => ({ ...prev, city: e.target.value }))}
                      placeholder="e.g. Lagos"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase text-muted-foreground">Phone / WhatsApp</label>
                    <input
                      className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                      value={claimForm.phone}
                      onChange={(e) => setClaimForm((prev) => ({ ...prev, phone: e.target.value }))}
                      placeholder="+234..."
                    />
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-muted-foreground">Primary Categories</label>
                <div className="max-h-[300px] overflow-auto rounded-xl border border-border p-3 bg-secondary/20">
                  <div className="flex flex-wrap gap-2">
                    {VENDOR_CATEGORIES.filter((cat) => cat !== 'All Categories').map((cat) => {
                      const selected = claimForm.categories.includes(cat);
                      return (
                        <button
                          key={cat}
                          type="button"
                          className={`rounded-full border px-4 py-2 text-xs font-semibold transition-all ${selected ? 'border-primary bg-primary/10 text-primary' : 'border-border bg-background text-muted-foreground hover:border-primary/50'}`}
                          onClick={() =>
                            setClaimForm((prev) => ({
                              ...prev,
                              categories: selected ? prev.categories.filter((c) => c !== cat) : [...prev.categories, cat],
                            }))
                          }
                        >
                          {cat}
                        </button>
                      );
                    })}
                  </div>
                </div>
                <p className="text-[10px] text-muted-foreground mt-1">Select at least one category to continue.</p>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-muted-foreground">Short Description (Optional)</label>
                <textarea
                  className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  rows={6}
                  value={claimForm.description}
                  onChange={(e) => setClaimForm((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="Tell clients what you provide, your experience, and what makes you unique."
                />
              </div>
            )}
          </div>
          <DialogFooter className="flex items-center justify-between sm:justify-between w-full">
            <div className="flex-1">
              {step === 1 ? (
                <Button
                  variant="ghost"
                  onClick={() => setClaimModalOpen(false)}
                  disabled={claimLoading}
                  className="text-muted-foreground hover:text-foreground"
                >
                  Not now
                </Button>
              ) : (
                <Button
                  variant="outline"
                  onClick={() => setStep(prev => prev - 1)}
                  disabled={claimLoading}
                  className="rounded-xl"
                >
                  Back
                </Button>
              )}
            </div>
            <div className="flex gap-2">
              {step < totalSteps ? (
                <Button
                  onClick={() => {
                    if (step === 1 && (!claimForm.businessName || !claimForm.city || !claimForm.phone)) {
                      toast.error('All business details are required.');
                      return;
                    }
                    if (step === 2 && claimForm.categories.length === 0) {
                      toast.error('Please select at least one category.');
                      return;
                    }
                    setStep(prev => prev + 1);
                  }}
                  className="rounded-xl px-8"
                >
                  Next
                </Button>
              ) : (
                <Button
                  onClick={handleVendorOnboarding}
                  disabled={claimLoading}
                  className="rounded-xl px-8"
                >
                  {claimLoading ? 'Submitting...' : 'Start Supplying'}
                </Button>
              )}
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="space-y-8">
        <div className="space-y-6 mb-10">
          <DashboardFilter
            placeholder="Search for event themes, locations, or hosts..."
            onSearchChange={setSearchQuery}
          />
        </div>

        <div className="flex items-center gap-3 border-b border-border mb-8">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-8 py-4 text-sm font-black transition-all border-b-2 -mb-[2px] ${activeTab === 'all'
              ? 'border-primary text-foreground'
              : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
          >
            All
          </button>
          <button
            onClick={() => setActiveTab('saved')}
            className={`px-8 py-4 text-sm font-black transition-all border-b-2 -mb-[2px] ${activeTab === 'saved'
              ? 'border-primary text-foreground'
              : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
          >
            Saved Events
          </button>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="border border-border rounded-2xl p-4 bg-card animate-pulse">
                <div className="h-6 w-1/2 rounded bg-secondary" />
                <div className="mt-3 h-3 w-full rounded bg-secondary" />
                <div className="mt-2 h-3 w-4/5 rounded bg-secondary" />
                <div className="mt-4 flex flex-wrap gap-2">
                  <div className="h-5 w-20 rounded bg-secondary" />
                  <div className="h-5 w-16 rounded bg-secondary" />
                  <div className="h-5 w-24 rounded bg-secondary" />
                </div>
                <div className="mt-4 border-t border-border pt-3 flex flex-wrap gap-3">
                  <div className="h-3 w-28 rounded bg-secondary" />
                  <div className="h-3 w-24 rounded bg-secondary" />
                  <div className="h-3 w-20 rounded bg-secondary" />
                </div>
              </div>
            ))}
          </div>
        ) : hasVendorProfile === false ? (
          <div className="text-center py-16 bg-card rounded-[2rem] border border-border">
            <div className="text-muted-foreground space-y-2">
              <p className="text-lg font-bold text-foreground">No vendor profile linked</p>
              <p className="text-sm">
                This account is not linked to a vendor profile yet. Ask an admin to assign a vendor owner email or owner ID.
              </p>
            </div>
          </div>
        ) : displayEvents.length > 0 ? (
          <div className="grid grid-cols-1 gap-6">
            {displayEvents.map(event => (
              <Link
                key={event.id}
                href={`/dashboard/vendors/opportunities/${event.id}`}
                className="group relative bg-card border border-border rounded-2xl p-3 hover:shadow-md transition-all hover:border-primary/50 cursor-pointer"
              >
                <button
                  className="absolute right-3 top-3 h-8 w-8 rounded-full flex items-center justify-center text-muted-foreground transition-colors hover:bg-secondary"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  aria-label={`Save ${event.eventName}`}
                >
                  <Star size={16} />
                </button>
                <div className="py-1">
                  <div>
                    <h3 className="text-xl font-bold text-foreground mb-1.5">
                      {event.eventName}
                    </h3>
                    <p className="text-muted-foreground text-xs line-clamp-2 max-w-2xl">
                      {event.description}
                    </p>

                    {Boolean(event.categories?.length) && (
                      <div className="flex flex-wrap gap-2 mt-4">
                        {event.categories?.map((cat, idx) => (
                          <span key={idx} className="px-2 py-0.5 bg-card text-foreground-600 text-[10px] font-bold rounded-md">
                            {cat}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-4 mt-4 pt-4 border-t border-border">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-foreground/80">
                      <Calendar size={14} className="text-primary" />
                      {formatEventDate(event.date)}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs font-bold text-foreground/80">
                      <MapPin size={14} className="text-primary" />
                      {event.location}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs font-bold text-foreground/80">
                      <Users size={14} className="text-primary" />
                      {event.guestCount} Guests
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-card rounded-[2rem] border border-border">
            <div className="text-muted-foreground space-y-2">
              <p className="text-lg font-bold text-foreground">No events found</p>
              <p className="text-sm">
                {activeTab === 'saved' ? "You haven't saved any events yet." : 'No open public briefs yet. Check back soon.'}
              </p>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
