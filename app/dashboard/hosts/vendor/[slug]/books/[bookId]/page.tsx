"use client";
import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
    ChevronLeft, Calendar, MapPin,
    CreditCard, CheckCircle2, Clock,
    User, MessageSquare, Download, Share2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getBookingById, getVendorBySlug } from '@/lib/firestore-service';
import { formatCurrency } from '@/lib/utils';
import { toast } from 'sonner';

export default function BookingDetailPage() {
    const router = useRouter();
    const params = useParams();
    const slug = params.slug as string;
    const bookId = params.bookId as string;

    const [booking, setBooking] = useState<any>(null);
    const [vendor, setVendor] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            try {
                const [v, b] = await Promise.all([
                    getVendorBySlug(slug),
                    bookId === 'new' ? Promise.resolve(null) : getBookingById(bookId)
                ]);
                setVendor(v);
                setBooking(b);
            } catch (error) {
                console.error("Failed to fetch booking details:", error);
                toast.error("Failed to load booking details");
            } finally {
                setIsLoading(false);
            }
        }
        fetchData();
    }, [slug, bookId]);

    if (isLoading) {
        return (
            <div className="max-w-4xl mx-auto py-12 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
                <p className="text-muted-foreground">Loading booking details...</p>
            </div>
        );
    }

    if (!vendor && bookId !== 'new') {
        return (
            <div className="max-w-4xl mx-auto py-12 text-center">
                <h2 className="text-2xl font-bold">Booking not found</h2>
                <Button
                    variant="link"
                    onClick={() => router.push('/dashboard/hosts/vendors')}
                    className="mt-4"
                >
                    Back to Search
                </Button>
            </div>
        );
    }

    // If this is a 'new' booking request page
    if (bookId === 'new') {
        return (
            <div className="max-w-3xl mx-auto space-y-8 pb-16">
                <div className="flex items-center gap-2 text-muted-foreground">
                    <button onClick={() => router.back()} className="hover:text-foreground flex items-center gap-1 font-bold text-sm">
                        <ChevronLeft size={16} />
                        Back
                    </button>
                </div>

                <div className="space-y-4">
                    <h1 className="text-3xl font-black tracking-tight text-foreground">Book {vendor?.name}</h1>
                    <p className="text-muted-foreground">Confirm your details and send a booking request to the vendor.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <Card className="md:col-span-2 border-border bg-card shadow-sm rounded-2xl overflow-hidden">
                        <CardContent className="p-8 space-y-8">
                            <div className="space-y-6">
                                <h3 className="text-lg font-bold flex items-center gap-2">
                                    <Calendar size={18} className="text-primary" />
                                    Event Information
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-black uppercase tracking-wider text-muted-foreground">Event Date</label>
                                        <input type="date" className="w-full bg-secondary/30 border-border rounded-xl px-4 py-3 text-sm focus:bg-background transition-all outline-none border focus:border-primary/50" />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-black uppercase tracking-wider text-muted-foreground">Guest Count</label>
                                        <input type="number" placeholder="50" className="w-full bg-secondary/30 border-border rounded-xl px-4 py-3 text-sm focus:bg-background transition-all outline-none border focus:border-primary/50" />
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-black uppercase tracking-wider text-muted-foreground">Venue Location</label>
                                    <input type="text" placeholder="Lagos, Nigeria" className="w-full bg-secondary/30 border-border rounded-xl px-4 py-3 text-sm focus:bg-background transition-all outline-none border focus:border-primary/50" />
                                </div>
                            </div>

                            <div className="space-y-6 pt-8 border-t border-border">
                                <h3 className="text-lg font-bold flex items-center gap-2">
                                    <MessageSquare size={18} className="text-primary" />
                                    Notes for Vendor
                                </h3>
                                <textarea
                                    rows={4}
                                    placeholder="Tell the vendor about your event needs..."
                                    className="w-full bg-secondary/30 border-border rounded-xl px-4 py-3 text-sm focus:bg-background transition-all outline-none border focus:border-primary/50 resize-none"
                                />
                            </div>

                            <div className="pt-4">
                                <Button
                                    className="w-full bg-primary hover:bg-primary/90 text-white font-black py-6 rounded-2xl shadow-lg shadow-primary/20 transition-all hover:scale-[1.01] active:scale-[0.99]"
                                    onClick={() => toast.success("Booking request sent! The vendor will review it soon.")}
                                >
                                    Confirm Booking Request
                                </Button>
                                <p className="text-[10px] text-center text-muted-foreground mt-4 uppercase tracking-widest font-bold">
                                    Payment will be processed once the vendor accepts your request
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <aside className="space-y-6">
                        <Card className="border-border bg-card shadow-sm rounded-2xl overflow-hidden">
                            <div className="aspect-[4/3] relative">
                                <img src={vendor?.image} alt={vendor?.name} className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                <div className="absolute bottom-4 left-4 right-4 text-white">
                                    <p className="text-[10px] font-black uppercase tracking-widest opacity-80 mb-1">{vendor?.categories[0]}</p>
                                    <p className="font-bold text-lg leading-tight">{vendor?.name}</p>
                                </div>
                            </div>
                            <CardContent className="p-6 space-y-4">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-muted-foreground font-medium text-xs font-bold uppercase tracking-widest">Base Rate</span>
                                    <span className="font-bold">{vendor?.price ? formatCurrency(vendor.price) : 'Request Quote'}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm pt-4 border-t border-border">
                                    <span className="text-muted-foreground font-medium text-xs font-bold uppercase tracking-widest text-primary">Service Fee</span>
                                    <span className="font-bold text-primary">$0.00</span>
                                </div>
                                <div className="flex justify-between items-center pt-2">
                                    <span className="font-black text-sm uppercase tracking-widest">Total</span>
                                    <span className="font-black text-xl">{vendor?.price ? formatCurrency(vendor.price) : 'TBD'}</span>
                                </div>
                            </CardContent>
                        </Card>

                        <div className="bg-primary/5 border border-primary/20 p-6 rounded-2xl space-y-3">
                            <h4 className="text-sm font-bold text-primary flex items-center gap-2">
                                <CheckCircle2 size={16} />
                                Booking Policy
                            </h4>
                            <p className="text-xs text-muted-foreground leading-relaxed">
                                Your booking is subject to the vendor's availability. Free cancellation up to 48 hours after confirmation.
                            </p>
                        </div>
                    </aside>
                </div>
            </div>
        );
    }

    // Existing booking details (e.g. after confirmation)
    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-16">
            <div className="flex items-center justify-between">
                <button onClick={() => router.back()} className="text-muted-foreground hover:text-foreground flex items-center gap-1 font-bold text-sm transition-colors">
                    <ChevronLeft size={16} />
                    Back to Bookings
                </button>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="h-9 font-bold rounded-xl gap-2 border-border shadow-sm">
                        <Download size={16} />
                        Invoice
                    </Button>
                    <Button variant="outline" size="sm" className="h-9 font-bold rounded-xl gap-2 border-border shadow-sm">
                        <Share2 size={16} />
                        Share
                    </Button>
                </div>
            </div>

            <div className="flex items-end justify-between border-b border-border pb-8">
                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <Badge className="bg-emerald-500 py-1 px-3 text-white border-none font-bold uppercase tracking-widest text-[10px]">Confirmed</Badge>
                        <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Order #BK-{bookId.slice(-6).toUpperCase()}</span>
                    </div>
                    <h1 className="text-4xl font-black text-foreground">Your booking for {vendor?.name}</h1>
                </div>
                <div className="hidden md:flex flex-col items-end">
                    <p className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-1">Total Paid</p>
                    <p className="text-2xl font-black text-foreground">{formatCurrency(booking?.amount || 0)}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2 space-y-8">
                    <section className="bg-card rounded-2xl border border-border p-8 shadow-sm space-y-6 transition-all hover:shadow-md">
                        <h3 className="text-lg font-bold flex items-center gap-2">
                            <User size={18} className="text-primary" />
                            Vendor Details
                        </h3>
                        <div className="flex items-center gap-4 p-4 bg-muted/30 rounded-2xl border border-border/50">
                            <div className="w-16 h-16 rounded-xl overflow-hidden shadow-sm">
                                <img src={vendor?.image} alt={vendor?.name} className="w-full h-full object-cover" />
                            </div>
                            <div>
                                <h4 className="font-bold text-foreground">{vendor?.name}</h4>
                                <p className="text-xs font-bold text-muted-foreground truncate uppercase tracking-widest mt-0.5">{vendor?.categories.join(", ")}</p>
                                <div className="flex items-center gap-2 mt-2 text-xs text-primary font-bold hover:underline cursor-pointer">
                                    <MessageSquare size={14} />
                                    Send a message
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="bg-card rounded-2xl border border-border p-8 shadow-sm space-y-6 transition-all hover:shadow-md">
                        <h3 className="text-lg font-bold flex items-center gap-2 border-b border-border pb-4">
                            <Clock size={18} className="text-primary" />
                            Reservation Details
                        </h3>
                        <div className="grid grid-cols-2 gap-8 pt-2">
                            <div className="space-y-1">
                                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Date</p>
                                <p className="font-bold text-sm">{booking?.date || 'Aug 24, 2024'}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Location</p>
                                <p className="font-bold text-sm">{booking?.location || 'Lagos, Nigeria'}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Event</p>
                                <p className="font-bold text-sm">{booking?.event || 'Social Gathering'}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Status</p>
                                <p className="font-bold text-sm text-emerald-600">Active</p>
                            </div>
                        </div>
                    </section>
                </div>

                <div className="space-y-6">
                    <Card className="border-border bg-card shadow-sm rounded-2xl overflow-hidden hover:shadow-md transition-all">
                        <div className="bg-primary/5 p-6 border-b border-border text-center">
                            <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-2">Total Amount</p>
                            <p className="text-4xl font-black text-foreground">{formatCurrency(booking?.amount || 0)}</p>
                        </div>
                        <CardContent className="p-6 space-y-4">
                            <div className="flex justify-between items-center text-xs">
                                <span className="text-muted-foreground font-bold uppercase tracking-widest">Base Rate</span>
                                <span className="font-bold text-foreground">$5,000.00</span>
                            </div>
                            <div className="flex justify-between items-center text-xs">
                                <span className="text-muted-foreground font-bold uppercase tracking-widest">Platform Fee</span>
                                <span className="font-bold text-foreground underline decoration-dotted underline-offset-4">$0.00</span>
                            </div>
                            <div className="flex justify-between items-center text-xs pt-4 border-t border-border mt-2">
                                <span className="font-black uppercase tracking-widest text-primary">Paid</span>
                                <Badge variant="outline" className="text-emerald-500 border-emerald-500/30 bg-emerald-50 font-black text-[10px]">COMPLETED</Badge>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="bg-muted/30 border border-border p-6 rounded-2xl">
                        <h4 className="text-sm font-bold text-foreground mb-4">Payment Method</h4>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-6 bg-foreground rounded flex items-center justify-center text-[10px] text-background font-bold uppercase tracking-widest leading-none">VISA</div>
                            <div className="flex-1">
                                <p className="text-sm font-bold text-foreground leading-none">Visa •••• 4242</p>
                                <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mt-1">Exp 12/25</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
