"use client";

import { useEffect, useState } from "react";
import { Experience } from "@/lib/types";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useAuth } from "@/components/providers/auth-provider";
import { Loader2 } from "lucide-react";

interface ReassignExperienceDialogProps {
    experience: Experience;
    onClose: () => void;
    onSuccess: () => void;
}

function toSlug(input: string) {
    return input
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");
}

function buildVendorLoginEmail(slug: string) {
    const safeSlug = toSlug(slug || "");
    return safeSlug ? `dummy+vendor-${safeSlug}@waddylife.com` : "—";
}

export function ReassignExperienceDialog({
    experience,
    onClose,
    onSuccess,
}: ReassignExperienceDialogProps) {
    const [targetEmail, setTargetEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [optionsLoading, setOptionsLoading] = useState(false);
    const [selectedEmail, setSelectedEmail] = useState("");
    const [targetOptions, setTargetOptions] = useState<
        { email: string; vendorName: string; vendorId: string }[]
    >([]);
    const { user } = useAuth();

    async function loadTargetOptions() {
        setOptionsLoading(true);
        try {
            const idToken = await user?.getIdToken();
            if (!idToken) return;

            const res = await fetch("/api/admin/experiences/reassign/options", {
                headers: {
                    Authorization: `Bearer ${idToken}`,
                },
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Failed to load options");

            const options = (data.options || []).filter(
                (option: { email?: string; vendorId?: string }) =>
                    option?.email && option?.vendorId && option.vendorId !== experience.vendorId
            );
            setTargetOptions(options);
        } catch (error) {
            console.error("Failed to load target options", error);
        } finally {
            setOptionsLoading(false);
        }
    }

    useEffect(() => {
        void loadTargetOptions();
    }, [user?.uid, experience.vendorId]);

    async function handleReassign() {
        if (!targetEmail.includes("@")) {
            toast.error("Please enter a valid email address");
            return;
        }

        setLoading(true);
        try {
            const idToken = await user?.getIdToken();
            if (!idToken) throw new Error("No idToken");

            const res = await fetch("/api/admin/experiences/reassign", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${idToken}`,
                },
                body: JSON.stringify({
                    experienceId: experience.id,
                    targetOwnerEmail: targetEmail,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Failed to reassign");
            }

            toast.success(
                `Successfully reassigned to ${data.targetVendorName || "target vendor"}`
            );
            onSuccess();
        } catch (error: any) {
            console.error("Reassign error:", error);
            toast.error(error.message || "Failed to reassign experience");
        } finally {
            setLoading(false);
        }
    }

    return (
        <Dialog open={true} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Reassign Experience</DialogTitle>
                    <DialogDescription>
                        Enter the email address of the vendor owner you want to transfer this
                        experience to.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-6 py-4">
                    <div className="space-y-4">
                        <div className="p-3 bg-secondary/10 rounded-xl border border-border/50">
                            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-2">Current Assignment</p>
                            <div className="space-y-1">
                                <p className="font-bold text-sm">{experience.vendorName || "Unknown Vendor"}</p>
                                <p className="text-xs font-mono text-muted-foreground">
                                    {buildVendorLoginEmail(experience.vendorSlug || "")}
                                </p>
                            </div>
                        </div>

                        <div className="relative">
                            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-center pointer-events-none">
                                <div className="bg-background px-2 py-1 rounded-full border text-[10px] font-bold uppercase text-muted-foreground">Transfer to</div>
                            </div>
                            <div className="border-t border-dashed border-border py-4" />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="targetEmail" className="text-xs font-bold uppercase text-muted-foreground">Target Owner Email</Label>
                            <select
                                className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm"
                                value={selectedEmail}
                                onChange={(e) => {
                                    if (!e.target.value) return;
                                    setSelectedEmail(e.target.value);
                                    setTargetEmail(e.target.value);
                                }}
                                disabled={optionsLoading || loading}
                            >
                                <option value="">
                                    {optionsLoading ? "Loading owners..." : "Select a vendor owner (optional)"}
                                </option>
                                {targetOptions.map((option) => (
                                    <option key={option.email} value={option.email}>
                                        {option.vendorName} - {option.email}
                                    </option>
                                ))}
                            </select>
                            <Input
                                id="targetEmail"
                                placeholder="e.g. jide@waddi.com"
                                className="rounded-xl border-border bg-background"
                                value={targetEmail}
                                onChange={(e) => setTargetEmail(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") handleReassign();
                                }}
                            />
                            <p className="text-[10px] text-muted-foreground leading-relaxed">
                                Enter the login email of the target vendor owner. We will search for their vendor profile and update the experience's pointers.
                            </p>
                        </div>
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={onClose} disabled={loading}>
                        Cancel
                    </Button>
                    <Button onClick={handleReassign} disabled={loading}>
                        {loading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Reassigning...
                            </>
                        ) : (
                            "Confirm Transfer"
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
