"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { signInWithPopup } from "firebase/auth";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { useAuth } from "@/components/providers/auth-provider";
import { auth, googleProvider } from "@/lib/firebase";
import { cn } from "@/lib/utils";

const QUICK_STARTS = [
    "Plan an event",
    "Find a vendor",
    "Build a trip",
];

type WaddiPromptProps = {
    mode?: "marketing" | "dashboard";
};

export function WaddiPrompt({ mode = "marketing" }: WaddiPromptProps) {
    const router = useRouter();
    const { user, loading } = useAuth();
    const [input, setInput] = useState("");
    const [mounted, setMounted] = useState(false);
    const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);
    const [isSigningIn, setIsSigningIn] = useState(false);
    const [authError, setAuthError] = useState<string | null>(null);
    const [pendingPrompt, setPendingPrompt] = useState("");

    useEffect(() => setMounted(true), []);

    const startChat = (prompt: string, tags?: string[]) => {
        let url = `/dashboard/hosts/chat/new?q=${encodeURIComponent(prompt)}`;
        if (tags && tags.length > 0) {
            url += `&deals=${encodeURIComponent(tags.join(","))}`;
        }
        router.push(url);
    };

    const handleStartChat = (e?: React.FormEvent) => {
        e?.preventDefault();
        const prompt = input.trim();
        if (!prompt) return;
        if (loading) return;

        if (!user) {
            setPendingPrompt(prompt);
            setAuthError(null);
            setIsAuthDialogOpen(true);
            return;
        }

        startChat(prompt);
    };

    const handleGoogleLogin = async () => {
        setIsSigningIn(true);
        setAuthError(null);

        try {
            await signInWithPopup(auth, googleProvider);
            const prompt = pendingPrompt || input.trim();
            setIsAuthDialogOpen(false);
            if (prompt) startChat(prompt);
        } catch (error) {
            console.error("Login error:", error);
            setAuthError("Sign in failed. Please try again.");
        } finally {
            setIsSigningIn(false);
        }
    };

    if (!mounted) return null;

    const sectionClassName =
        mode === "dashboard"
            ? "h-full min-h-[28rem]"
            : "h-[calc(100svh-5.5rem)] min-h-[34rem]";

    return (
        <section className={cn("px-4 md:px-6", sectionClassName)}>
            <div className="mx-auto grid h-full max-w-5xl place-items-center">
                <div className="w-full text-center space-y-6 md:px-0">
                    <h1 className="text-4xl md:text-5xl font-bold text-foreground tracking-tight">
                        {mode === "dashboard" ? "What needs your attention?" : "What needs doing?"}
                    </h1>
                    <p className="mx-auto max-w-xl text-base text-muted-foreground md:text-lg">
                        Tell Waddi what you need to move forward today.
                    </p>

                    <div className="max-w-2xl mx-auto relative mt-8 flex flex-col items-center gap-4">
                        <form onSubmit={handleStartChat} className="w-full">
                            <div className="relative bg-card rounded-2xl shadow-sm hover:shadow-md transition-all overflow-hidden border border-border">
                                <textarea
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter" && !e.shiftKey) {
                                            e.preventDefault();
                                            handleStartChat();
                                        }
                                    }}
                                    placeholder="E.g. Help me plan a traditional wedding in Lagos..."
                                    rows={1}
                                    className="w-full bg-transparent px-6 pt-5 pb-16 text-base focus:outline-none resize-none min-h-[108px]"
                                />

                                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                                    <div className="flex flex-wrap gap-2">
                                        {QUICK_STARTS.map((label) => (
                                            <button
                                                key={label}
                                                type="button"
                                                onClick={() => setInput(`${label} `)}
                                                className="h-10 rounded-lg border border-border bg-card px-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                                            >
                                                {label}
                                            </button>
                                        ))}
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={!input.trim()}
                                        className="h-10 w-10 bg-primary text-primary-foreground rounded-xl flex items-center justify-center disabled:opacity-50 transition-all active:scale-95"
                                    >
                                        <ArrowRight size={20} strokeWidth={2.5} />
                                    </button>
                                </div>
                            </div>
                        </form>

                    </div>
                </div>
            </div>

            <Dialog open={isAuthDialogOpen} onOpenChange={setIsAuthDialogOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Sign in to continue</DialogTitle>
                        <DialogDescription>
                            Sign in and we will continue planning with your prompt.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-3">
                        <Button
                            type="button"
                            onClick={handleGoogleLogin}
                            disabled={isSigningIn}
                            className="w-full"
                        >
                            {isSigningIn ? "Signing in..." : "Continue with Google"}
                        </Button>
                        {authError && (
                            <p className="text-sm text-destructive">{authError}</p>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </section>
    );
} 
