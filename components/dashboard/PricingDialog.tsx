"use client";

import React from 'react';
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

interface PricingTier {
    name: string;
    tagline: string;
    price: string;
    priceNote?: string;
    highlighted: boolean;
    features: { title: string; description: string }[];
    cta: string;
}

const PRICING_TIERS: PricingTier[] = [
    {
        name: "Free",
        tagline: "Basic planning for everyone",
        price: "$0",
        highlighted: false,
        cta: "Current Plan",
        features: [
            { title: "Standard Waddi", description: "Standard planning assistant" },
            { title: "Community Access", description: "Access to community boards" },
        ]
    },
    {
        name: "Waddi Pro",
        tagline: "Advanced planning and deeper insights",
        price: "$19",
        priceNote: "per event",
        highlighted: true,
        cta: "Upgrade to Pro",
        features: [
            { title: "Everything in Free", description: "All basic features included" },
            { title: "Advanced Model", description: "Access to deeper planning insights" },
            { title: "Vendor Negotiations", description: "Waddi helps you get the best deals" },
            { title: "Priority Support", description: "24/7 dedicated assistance" },
        ]
    },
    {
        name: "Concierge",
        tagline: "Full service orchestration",
        price: "Custom",
        highlighted: false,
        cta: "Contact Us",
        features: [
            { title: "Everything in Pro", description: "All pro features included" },
            { title: "On-the-ground Support", description: "Personal coordinator in Lagos" },
            { title: "Guest Logistics", description: "Full airport and hotel coordination" },
        ]
    }
];

interface PricingDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onUpgrade?: () => void;
}

export const PricingDialog: React.FC<PricingDialogProps> = ({
    open,
    onOpenChange,
    onUpgrade
}) => {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
                <DialogHeader className="text-center sm:text-center pb-4">
                    <DialogTitle className="text-3xl font-bold font-serif">Upgrade your Planning</DialogTitle>
                    <DialogDescription className="text-lg">
                        Choose the right plan to make your event unforgettable.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
                    {PRICING_TIERS.map((tier) => (
                        <div
                            key={tier.name}
                            className={`relative flex flex-col rounded-2xl border p-6 transition-all hover:shadow-xl ${tier.highlighted
                                    ? "border-primary bg-primary/5 shadow-md ring-1 ring-primary"
                                    : "border-border bg-card"
                                }`}
                        >
                            {tier.highlighted && (
                                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-4 py-1 text-[10px] font-bold uppercase tracking-wider text-primary-foreground">
                                    Recommended
                                </div>
                            )}

                            <div className="mb-6">
                                <h3 className={`text-xl font-bold ${tier.highlighted ? "text-primary" : "text-card-foreground"}`}>
                                    {tier.name}
                                </h3>
                                <p className="mt-1 text-xs text-muted-foreground">{tier.tagline}</p>
                            </div>

                            <div className="mb-6 flex items-baseline gap-1">
                                <span className="text-3xl font-bold">{tier.price}</span>
                                {tier.priceNote && <span className="text-sm text-muted-foreground">{tier.priceNote}</span>}
                            </div>

                            <Button
                                onClick={() => {
                                    if (tier.cta === "Upgrade to Pro" && onUpgrade) {
                                        onUpgrade();
                                    }
                                    onOpenChange(false);
                                }}
                                className={`w-full mb-8 font-bold ${tier.highlighted
                                        ? "bg-primary text-primary-foreground hover:bg-primary/90"
                                        : tier.name === "Free"
                                            ? "bg-muted text-muted-foreground cursor-default hover:bg-muted"
                                            : "border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                                    }`}
                                variant={tier.highlighted ? "default" : "outline"}
                                disabled={tier.name === "Free"}
                            >
                                {tier.cta}
                            </Button>

                            <ul className="space-y-4 flex-1">
                                {tier.features.map((feature) => (
                                    <li key={feature.title} className="flex gap-3">
                                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                                        <div>
                                            <p className="text-xs font-bold text-card-foreground">{feature.title}</p>
                                            <p className="mt-0.5 text-[10px] leading-relaxed text-muted-foreground">
                                                {feature.description}
                                            </p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </DialogContent>
        </Dialog>
    );
};
