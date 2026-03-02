"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    ChevronRight,
    ChevronLeft,
    Check,
    Calendar as CalendarIcon,
    Users,
    MapPin,
    Sparkles,
    Wallet,
    CheckCircle2,
    PartyPopper
} from 'lucide-react';
import { EVENT_THEMES } from '@/lib/constants';
import { useAuth } from '@/components/providers/auth-provider';
import { createEvent } from '@/lib/firestore-service';
import { getCurrencySymbol } from '@/lib/utils';

type FormStep = 1 | 2 | 3;

export default function CreateEventPage() {
    const currencySymbol = getCurrencySymbol();
    const router = useRouter();
    const { user, profile } = useAuth();
    const [step, setStep] = useState<FormStep>(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const [formData, setFormData] = useState({
        eventName: '',
        theme: 'All Themes',
        date: '',
        location: '',
        guestCount: '',
        budget: '',
        ticketPrice: '',
        description: ''
    });

    // Yinka AI State
    const [isYinkaOpen, setIsYinkaOpen] = useState(false);
    const [aiPrompt, setAiPrompt] = useState('');
    const [isAILoading, setIsAILoading] = useState(false);

    const handleYinkaSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!aiPrompt.trim()) return;

        setIsAILoading(true);
        try {
            const idToken = await user?.getIdToken();
            if (!idToken) {
                alert("Please sign in again.");
                return;
            }

            const response = await fetch('/api/event-ai', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${idToken}`,
                },
                body: JSON.stringify({ prompt: aiPrompt })
            });

            const data = await response.json();

            if (data.error) {
                alert(data.error);
                return;
            }

            setFormData({
                eventName: data.eventName || formData.eventName,
                theme: data.theme || formData.theme,
                date: data.date || formData.date,
                location: data.location || formData.location,
                guestCount: data.guestCount?.toString() || formData.guestCount,
                budget: data.budget?.toString() || formData.budget,
                ticketPrice: data.ticketPrice?.toString() || formData.ticketPrice,
                description: data.description || formData.description
            });

            setIsYinkaOpen(false);
            setAiPrompt('');
        } catch (error) {
            console.error("Error talking to Yinka:", error);
            alert("Something went wrong with Yinka. Please try again.");
        } finally {
            setIsAILoading(false);
        }
    };

    const handleNext = () => setStep((prev) => (prev + 1) as FormStep);
    const handleBack = () => setStep((prev) => (prev - 1) as FormStep);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) {
            alert("You must be logged in to create an event.");
            return;
        }

        setIsSubmitting(true);
        try {
            await createEvent({
                hostId: user.uid,
                hostName: profile?.displayName || user.displayName || 'Unknown Host',
                eventName: formData.eventName,
                date: formData.date,
                location: formData.location,
                guestCount: parseInt(formData.guestCount) || 0,
                budget: parseInt(formData.budget.replace(/,/g, '')) || 0,
                ticketPrice: parseInt(formData.ticketPrice.replace(/,/g, '')) || 0,
                status: 'Planning',
                image: '/placeholder.png', // Default image
                description: formData.description,
                bookedVendors: [],
                leads: [],
                categories: [],
                themes: [formData.theme],
                guests: [],
                isPublicBrief: false,
                publicBriefStatus: "closed"
            });
            setIsSuccess(true);
        } catch (error) {
            console.error("Error creating event:", error);
            alert("Failed to create event. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isSuccess) {
        return (
            <div className="max-w-2xl mx-auto py-20 text-center space-y-8 animate-in fade-in zoom-in duration-500">
                <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                    <PartyPopper className="text-green-600" size={48} />
                </div>
                <div className="space-y-4">
                    <h2 className="text-4xl font-black text-foreground">Event Created!</h2>
                    <p className="text-muted-foreground font-medium text-lg">
                        Your event "{formData.eventName}" has been successfully created. <br />
                        Now you can start adding vendors to your plan.
                    </p>
                </div>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                    <button
                        onClick={() => router.push('/dashboard/hosts/events')}
                        className="w-full sm:w-auto px-8 py-4 bg-background text-white rounded-2xl font-black hover:bg-background transition-all shadow-xl shadow-slate-900/20"
                    >
                        Go to My Events
                    </button>
                    <button
                        onClick={() => router.push('/dashboard/hosts/vendors')}
                        className="w-full sm:w-auto px-8 py-4 bg-white border border-border text-foreground rounded-2xl font-black hover:bg-secondary transition-all"
                    >
                        Browse Vendors
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto pb-20 relative">
            {/* Yinka Floating Button */}
            {!isYinkaOpen && (
                <button
                    onClick={() => setIsYinkaOpen(true)}
                    className="fixed bottom-8 right-8 z-50 p-6 bg-primary text-white rounded-full shadow-2xl shadow-primary/40 hover:scale-110 active:scale-95 transition-all group"
                >
                    <div className="absolute -top-12 right-0 bg-white border border-border px-4 py-2 rounded-2xl text-foreground font-black text-xs shadow-lg opacity-0 group-hover:opacity-100 transition-all pointer-events-none whitespace-nowrap">
                        Talk to Yinka ✨
                    </div>
                    <Sparkles size={32} />
                </button>
            )}

            {/* Yinka Dialog */}
            {isYinkaOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-background/40 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-in slide-in-from-bottom-8 duration-500">
                        <div className="bg-primary p-8 text-white relative">
                            <button
                                onClick={() => setIsYinkaOpen(false)}
                                className="absolute top-6 right-6 p-2 hover:bg-white/10 rounded-full transition-all"
                            >
                                <ChevronLeft className="rotate-90" size={24} />
                            </button>
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md">
                                    <Sparkles size={32} />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-black">Talk to Yinka</h3>
                                    <p className="text-white/80 font-medium">I'll help you set everything up in seconds.</p>
                                </div>
                            </div>
                        </div>
                        <div className="p-8 space-y-6">
                            <div className="space-y-4">
                                <label className="text-sm font-black text-foreground">Tell me about your event</label>
                                <textarea
                                    rows={4}
                                    placeholder="e.g. Plan a wedding for Chidi and Amaka on December 12th in Lekki with 250 guests and 15M budget..."
                                    className="w-full px-6 py-4 bg-secondary border border-border rounded-2xl text-base font-medium outline-none focus:ring-4 focus:ring-primary/10 transition-all resize-none placeholder:text-muted-foreground"
                                    value={aiPrompt}
                                    onChange={(e) => setAiPrompt(e.target.value)}
                                />
                                <div className="flex flex-wrap gap-2">
                                    {["Wedding in Ikeja", "Corporate Workshop", "Accra Birthday"].map(hint => (
                                        <button
                                            key={hint}
                                            onClick={() => setAiPrompt(prev => prev + hint)}
                                            className="px-3 py-1 bg-secondary border border-border rounded-full text-[10px] font-black text-muted-foreground hover:text-accent hover:border-primary transition-all"
                                        >
                                            + {hint}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <button
                                onClick={handleYinkaSubmit}
                                disabled={isAILoading || !aiPrompt.trim()}
                                className="w-full py-4 bg-primary text-white rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-primary transition-all shadow-xl shadow-primary/20 disabled:opacity-50"
                            >
                                {isAILoading ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Yinka is thinking...
                                    </>
                                ) : (
                                    <>
                                        Generate Event Plan
                                        <ChevronRight size={18} />
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="mb-12 space-y-4">
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-muted-foreground hover:text-muted-foreground transition-colors text-sm font-bold"
                >
                    <ChevronLeft size={16} />
                    Back to Dashboard
                </button>
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <Sparkles className="text-accent" size={16} />
                            <span className="text-accent text-[10px] font-black uppercase tracking-widest leading-none">Powered by Yinka AI</span>
                        </div>
                        <h2 className="text-4xl font-black tracking-tight text-foreground">Create New Event</h2>
                        <p className="text-muted-foreground font-medium mt-1">Let's set up the foundation for your next amazing experience.</p>
                    </div>
                    {/* Progress Dots */}
                    <div className="flex items-center gap-3 bg-white p-2 border border-border rounded-2xl">
                        {[1, 2, 3].map((s) => (
                            <div
                                key={s}
                                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black transition-all ${step === s
                                    ? 'bg-primary text-white shadow-lg shadow-primary/20 scale-110'
                                    : step > s
                                        ? 'bg-green-100 text-green-600'
                                        : 'bg-secondary text-muted-foreground'
                                    }`}
                            >
                                {step > s ? <Check size={14} /> : s}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="bg-white border border-border rounded-[2.5rem] p-8 md:p-12 shadow-sm transition-all">
                <form onSubmit={handleSubmit} className="space-y-10">
                    {step === 1 && (
                        <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
                            <div className="space-y-6">
                                <div className="flex items-center gap-3 text-accent mb-2">
                                    <Sparkles size={20} />
                                    <span className="text-xs font-black uppercase tracking-widest">Step 01: Basics</span>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-black text-foreground">What's the occasion?</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="e.g. Chidi & Amaka Wedding"
                                        className="w-full px-6 py-4 bg-secondary border border-border rounded-2xl text-lg font-bold outline-none focus:ring-4 focus:ring-primary/10 transition-all placeholder:text-muted-foreground"
                                        value={formData.eventName}
                                        onChange={(e) => setFormData({ ...formData, eventName: e.target.value })}
                                    />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2 text-left">
                                        <label className="text-sm font-black text-foreground">Event Theme</label>
                                        <div className="relative">
                                            <select
                                                className="w-full px-6 py-4 bg-secondary border border-border rounded-2xl text-base font-bold outline-none focus:ring-4 focus:ring-primary/10 transition-all appearance-none cursor-pointer"
                                                value={formData.theme}
                                                onChange={(e) => setFormData({ ...formData, theme: e.target.value })}
                                            >
                                                {EVENT_THEMES.map(theme => (
                                                    <option key={theme} value={theme}>{theme}</option>
                                                ))}
                                            </select>
                                            <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" size={20} />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-black text-foreground">Event Date</label>
                                        <div className="relative">
                                            <CalendarIcon className="absolute left-6 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
                                            <input
                                                type="date"
                                                required
                                                className="w-full pl-14 pr-6 py-4 bg-secondary border border-border rounded-2xl text-base font-bold outline-none focus:ring-4 focus:ring-primary/10 transition-all cursor-pointer"
                                                value={formData.date}
                                                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
                            <div className="space-y-6">
                                <div className="flex items-center gap-3 text-accent mb-2">
                                    <MapPin size={20} />
                                    <span className="text-xs font-black uppercase tracking-widest">Step 02: Logistics</span>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-black text-foreground">Where's it happening?</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="e.g. Lekki Phase 1, Lagos"
                                        className="w-full px-6 py-4 bg-secondary border border-border rounded-2xl text-lg font-bold outline-none focus:ring-4 focus:ring-primary/10 transition-all"
                                        value={formData.location}
                                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-black text-foreground">Expected Guests</label>
                                    <div className="relative">
                                        <Users className="absolute left-6 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
                                        <input
                                            type="number"
                                            required
                                            placeholder="e.g. 250"
                                            className="w-full pl-14 pr-6 py-4 bg-secondary border border-border rounded-2xl text-lg font-bold outline-none focus:ring-4 focus:ring-primary/10 transition-all"
                                            value={formData.guestCount}
                                            onChange={(e) => setFormData({ ...formData, guestCount: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
                            <div className="space-y-6">
                                <div className="flex items-center gap-3 text-accent mb-2">
                                    <Wallet size={20} />
                                    <span className="text-xs font-black uppercase tracking-widest">Step 03: Budget & Details</span>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-black text-foreground">What's your estimated budget?</label>
                                    <div className="relative">
                                        <span className="absolute left-6 top-1/2 -translate-y-1/2 text-muted-foreground font-bold">{currencySymbol}</span>
                                        <input
                                            type="text"
                                            required
                                            placeholder="e.g. 15,000,000"
                                            className="w-full pl-12 pr-6 py-4 bg-secondary border border-border rounded-2xl text-lg font-bold outline-none focus:ring-4 focus:ring-primary/10 transition-all"
                                            value={formData.budget}
                                            onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-black text-foreground">Ticket price (optional)</label>
                                    <div className="relative">
                                        <span className="absolute left-6 top-1/2 -translate-y-1/2 text-muted-foreground font-bold">{currencySymbol}</span>
                                        <input
                                            type="text"
                                            placeholder="e.g. 25,000"
                                            className="w-full pl-12 pr-6 py-4 bg-secondary border border-border rounded-2xl text-lg font-bold outline-none focus:ring-4 focus:ring-primary/10 transition-all"
                                            value={formData.ticketPrice}
                                            onChange={(e) => setFormData({ ...formData, ticketPrice: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-black text-foreground">Briefly describe your vision</label>
                                    <textarea
                                        rows={4}
                                        placeholder="e.g. A luxurious outdoor wedding with a modern African theme and focus on great food..."
                                        className="w-full px-6 py-4 bg-secondary border border-border rounded-2xl text-base font-bold outline-none focus:ring-4 focus:ring-primary/10 transition-all resize-none placeholder:text-muted-foreground"
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="flex items-center justify-between pt-10 border-t border-slate-50">
                        {step > 1 ? (
                            <button
                                type="button"
                                onClick={handleBack}
                                className="px-8 py-4 text-muted-foreground font-black hover:text-foreground transition-all"
                            >
                                Previous Step
                            </button>
                        ) : (
                            <div />
                        )}

                        {step < 3 ? (
                            <button
                                type="button"
                                onClick={handleNext}
                                disabled={step === 1 && !formData.eventName}
                                className="px-10 py-4 bg-background text-white rounded-2xl font-black flex items-center gap-2 hover:bg-background transition-all shadow-xl shadow-slate-900/10 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Continue
                                <ChevronRight size={18} />
                            </button>
                        ) : (
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="px-10 py-4 bg-primary text-white rounded-2xl font-black flex items-center gap-2 hover:bg-primary transition-all shadow-xl shadow-primary/20"
                            >
                                {isSubmitting ? 'Creating Event...' : 'Create Event'}
                                {!isSubmitting && <CheckCircle2 size={18} />}
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
}

function ChevronDown({ className, size }: { className?: string, size?: number }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={size || 24}
            height={size || 24}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <path d="m6 9 6 6 6-6" />
        </svg>
    );
}
