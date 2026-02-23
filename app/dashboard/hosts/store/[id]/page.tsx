"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { getChatById, listenToMessages, remixChat } from '@/lib/firestore-service';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { Button } from '@/components/ui/button';
import { Loader2, Plus, ShoppingBag, MapPin, Sparkles, CreditCard } from 'lucide-react';
import { CITIES } from '@/lib/chat-data';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

// Simplified Preview Message Component
function PreviewMsg({ msg }: { msg: any }) {
    const ag = msg.role === "agent";

    // Simplistic rendering for store preview
    const renderContent = () => {
        if (msg.type === 'vendor_cards' && msg.vendors) {
            return (
                <div className="space-y-3 mt-2">
                    <div className="text-sm">{msg.content}</div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 opacity-80 pointer-events-none filter blur-[1px]">
                        {msg.vendors.slice(0, 4).map((v: any, i: number) => (
                            <div key={i} className="bg-card border border-border rounded-xl p-3">
                                <div className="font-bold text-sm truncate">{v.name}</div>
                                <div className="text-xs text-muted-foreground">{v.type}</div>
                            </div>
                        ))}
                    </div>
                </div>
            );
        }

        return (
            <div className="text-sm whitespace-pre-line leading-relaxed">
                {msg.content || (msg.type ? `[Interactive: ${msg.type}]` : "...")}
            </div>
        );
    };

    return (
        <div className={cn("flex gap-3 mb-6", ag ? "flex-row items-start" : "flex-row-reverse items-start")}>
            {ag ? (
                <div className="w-[32px] h-[32px] rounded-full bg-secondary flex-shrink-0 flex items-center justify-center">
                    <Sparkles size={14} className="text-primary" />
                </div>
            ) : (
                <div className="w-[32px] h-[32px] rounded-full bg-primary flex-shrink-0 flex items-center justify-center text-[10px] font-bold text-primary-foreground">
                    YOU
                </div>
            )}

            <div className={cn("flex-1 min-w-0 flex flex-col", ag ? "items-start" : "items-end")}>
                <div className={cn("text-[10px] text-muted-foreground mb-1", !ag && "text-right")}>
                    {ag ? "Waddi" : "You"} · {msg.time || "Time"}
                </div>
                <div className={cn(
                    "rounded-2xl px-4 py-3 shadow-sm border max-w-[85%]",
                    ag ? "bg-card border-border text-foreground rounded-tl-[4px]" : "bg-secondary/30 border-border text-foreground rounded-tr-[4px]"
                )}>
                    {renderContent()}
                </div>
            </div>
        </div>
    );
}

export default function StorePreviewPage() {
    const params = useParams();
    const router = useRouter();
    const [kit, setKit] = useState<any>(null);
    const [messages, setMessages] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isRemixing, setIsRemixing] = useState(false);
    const [isPaymentOpen, setIsPaymentOpen] = useState(false);
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, setUser);
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        const id = typeof params.id === 'string' ? params.id : (params.id?.[0] || "");
        if (!id) return;

        async function fetchKit() {
            try {
                const data = await getChatById(id);
                setKit(data);

                // Fetch messages
                const unsubscribe = listenToMessages(id, (msgs) => {
                    setMessages(msgs);
                    setLoading(false);
                });
                return unsubscribe;
            } catch (err) {
                console.error("Kit fetch error", err);
                setLoading(false);
            }
        }

        fetchKit();
    }, [params.id]);

    const togglePaymentModal = () => {
        if (!user) {
            alert("Please sign in to buy and remix kits.");
            return;
        }
        setIsPaymentOpen(true);
    };

    const handleConfirmPayment = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setIsRemixing(true);
            const id = typeof params.id === 'string' ? params.id : (params.id?.[0] || "");
            if (!id) throw new Error("No ID found");

            // Simulate stripe payment processing
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Duplicate the chat
            const newChatId = await remixChat(id, user.uid);

            // Immediately redirect
            router.push(`/dashboard/hosts/chat/${newChatId}`);
        } catch (error) {
            console.error("Remix failed:", error);
            alert("Failed to process payment and remix. Please try again.");
            setIsRemixing(false);
            setIsPaymentOpen(false);
        }
    };

    if (loading) {
        return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin text-muted-foreground" /></div>;
    }

    if (!kit) {
        return <div className="p-8 text-center text-muted-foreground">Store kit not found.</div>;
    }

    const displayPrice = kit.price ? (kit.price.startsWith('$') ? kit.price : `$${kit.price}`) : "$49";
    const isOldDefault = kit.image?.includes('1511795409834');
    const displayImage = (kit.image && !isOldDefault) ? kit.image : "/images/logo.png";

    return (
        <div className="bg-background h-screen flex flex-col overflow-hidden relative">

            {/* Hero Header */}
            <div className="shrink-0 bg-card border-b border-border shadow-sm z-20">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex flex-col sm:flex-row gap-6 flex-1 text-left min-w-0">
                        <div className="w-full sm:w-40 aspect-video sm:aspect-square flex-shrink-0 bg-secondary rounded-xl overflow-hidden border border-border flex items-center justify-center relative">
                            <img
                                src={displayImage}
                                alt={kit.title || "Kit"}
                                className={displayImage === "/images/logo.png" ? "w-[60px] h-[60px] opacity-30 object-contain" : "absolute inset-0 w-full h-full object-cover"}
                            />
                        </div>
                        <div className="flex flex-col justify-center flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="bg-secondary text-foreground text-xs font-bold px-2 py-1 rounded uppercase tracking-wider">
                                    {kit.city || "Remote"}
                                </span>
                                <span className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
                                    <Sparkles size={12} /> Pre-built Event Kit
                                </span>
                            </div>
                            <h1 className="text-2xl sm:text-3xl font-black text-foreground mb-1 truncate whitespace-normal leading-tight">{kit.title || "Untitled Kit"}</h1>
                            {kit.publisherName && (
                                <p className="text-xs text-muted-foreground mb-2 font-medium">by {kit.publisherName}</p>
                            )}
                            <p className="text-muted-foreground text-sm max-w-lg leading-relaxed line-clamp-3">{kit.description || "A cohesive event plan, curated vendors, and detailed itinerary. Get this kit and make it yours instantly."}</p>
                        </div>
                    </div>

                    <div className="shrink-0 sm:self-end">
                        <Button
                            onClick={togglePaymentModal}
                            disabled={isRemixing}
                            size="lg"
                            className="w-full sm:w-auto font-bold shadow-xl active:scale-95 transition-all gap-2"
                        >
                            {isRemixing ? (
                                <><Loader2 size={18} className="animate-spin" /> Remxing...</>
                            ) : (
                                <><ShoppingBag size={18} /> Buy & Remix — {displayPrice}</>
                            )}
                        </Button>
                    </div>
                </div>
            </div>

            {/* Scrollable Transcript */}
            <div className="flex-1 overflow-y-auto bg-background/50 relative">
                <div className="max-w-4xl mx-auto w-full p-4 sm:p-6 pb-24">

                    <div className="text-center mb-8">
                        <div className="inline-block bg-background border border-border rounded-full px-4 py-1.5 text-xs text-muted-foreground font-semibold shadow-sm">
                            Transcript Preview
                        </div>
                    </div>

                    <div className="space-y-2 opacity-90">
                        {messages.slice(0, 10).map((m: any, idx: number) => (
                            <PreviewMsg key={m.id || idx} msg={m} />
                        ))}
                    </div>

                    {messages.length > 10 && (
                        <div className="relative mt-4">
                            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/50 backdrop-blur-[2px] z-10 pointers-events-none" />
                            <div className="opacity-40">
                                {messages.slice(10, 12).map((m: any, idx: number) => (
                                    <PreviewMsg key={m.id || idx} msg={m} />
                                ))}
                            </div>
                            <div className="absolute bottom-4 left-0 right-0 z-20 flex justify-center">
                                <Button onClick={togglePaymentModal} variant="secondary" className="shadow-lg border border-border">
                                    Buy to unlock full transcript & workspace
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Stripe Mock Modal */}
            <Dialog open={isPaymentOpen} onOpenChange={(open) => !isRemixing && setIsPaymentOpen(open)}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Complete Purchase</DialogTitle>
                        <DialogDescription>
                            You're buying the <strong>{kit.title}</strong> kit.
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleConfirmPayment} className="space-y-4 py-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Email Address</label>
                            <Input placeholder="you@example.com" required type="email" disabled={isRemixing} />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Card Information</label>
                            <div className="relative">
                                <Input placeholder="0000 0000 0000 0000" required disabled={isRemixing} className="pl-10" />
                                <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Expiry</label>
                                <Input placeholder="MM/YY" required disabled={isRemixing} />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">CVC</label>
                                <Input placeholder="123" required disabled={isRemixing} />
                            </div>
                        </div>

                        <div className="bg-secondary/50 rounded-lg p-4 mt-6 flex justify-between items-center">
                            <span className="font-semibold text-sm">Total Due</span>
                            <span className="font-black text-lg">{displayPrice}</span>
                        </div>

                        <DialogFooter className="mt-6 flex-row sm:justify-between w-full">
                            <Button type="button" variant="outline" onClick={() => setIsPaymentOpen(false)} disabled={isRemixing}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isRemixing} className="gap-2">
                                {isRemixing ? (
                                    <><Loader2 size={16} className="animate-spin" /> Processing payment...</>
                                ) : (
                                    <>Pay {displayPrice}</>
                                )}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
