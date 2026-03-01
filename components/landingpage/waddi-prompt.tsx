"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Plus } from "lucide-react";
import { signInWithPopup } from "firebase/auth";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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

const SUGGESTIONS = [
    "Plan a surprise 30th birthday in Lagos for 20 guests",
    "Find a wedding venue in Accra with ocean views",
    "Help me plan traditional wedding",
    "Budget for a corporate gala in Nairobi",
    "Book a private chef for a brunch in Cape Town"
];

export function WaddiPrompt() {
    const router = useRouter();
    const { user, loading } = useAuth();
    const [input, setInput] = useState("");
    const [mounted, setMounted] = useState(false);
    const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);
    const [isSigningIn, setIsSigningIn] = useState(false);
    const [authError, setAuthError] = useState<string | null>(null);
    const [pendingPrompt, setPendingPrompt] = useState("");

    useEffect(() => setMounted(true), []);

    const startChat = (prompt: string) => {
        router.push(`/dashboard/hosts/chat/new?q=${encodeURIComponent(prompt)}`);
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

        // Route to the real new-chat flow; chat page will create/persist via send()
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

    return (
        <section className="h-full min-h-[28rem] px-4 md:px-6">
            <div className="mx-auto grid h-full max-w-5xl place-items-center">
                <div className="w-full text-center space-y-6 md:px-0">
                    <h1 className="text-4xl md:text-3xl font-bold text-foreground tracking-tight">
                        Stop planning.
                        Start living it.
                    </h1>

                    <div className="max-w-2xl mx-auto relative mt-8 group">
                        <form onSubmit={handleStartChat}>
                            <div className="relative bg-card rounded-2xl shadow-sm group-hover:shadow-md transition-all overflow-hidden">
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
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <button
                                                type="button"
                                                className="h-10 w-10 rounded-lg border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors inline-flex items-center justify-center"
                                                aria-label="Open sample prompts"
                                            >
                                                <Plus size={18} />
                                            </button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="start" className="w-80 p-1 bg-background">
                                            {SUGGESTIONS.map((s, i) => (
                                                <DropdownMenuItem
                                                    key={i}
                                                    onClick={() => setInput(s)}
                                                    className="py-2 whitespace-normal leading-relaxed cursor-pointer"
                                                >
                                                    {s}
                                                </DropdownMenuItem>
                                            ))}
                                        </DropdownMenuContent>
                                    </DropdownMenu>

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
