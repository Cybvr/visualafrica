"use client";

import React, { useState, useEffect } from 'react';
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/components/providers/auth-provider';
import { Button } from '@/components/ui/button';
import { Loader2, CheckCircle, AlertCircle, ShieldAlert } from 'lucide-react';

export default function MigrateEventsPage() {
    const { user, profile, loading: authLoading } = useAuth();
    const [status, setStatus] = useState<'idle' | 'scanning' | 'ready' | 'migrating' | 'success' | 'error'>('idle');
    const [unclaimedCount, setUnclaimedCount] = useState(0);
    const [unclaimedDocs, setUnclaimedDocs] = useState<any[]>([]);
    const [error, setError] = useState<string | null>(null);

    async function scanForEvents() {
        if (!user) return;
        setStatus('scanning');
        try {
            const querySnapshot = await getDocs(collection(db, 'events'));
            const docs = querySnapshot.docs.filter(d => !d.data().hostId);
            setUnclaimedDocs(docs);
            setUnclaimedCount(docs.length);
            setStatus('ready');
        } catch (err: any) {
            console.error("Scan error:", err);
            setError(err.message);
            setStatus('error');
        }
    }

    async function handleMigrate() {
        if (!user || status !== 'ready') return;
        setStatus('migrating');
        try {
            let count = 0;
            for (const eventDoc of unclaimedDocs) {
                const docRef = doc(db, 'events', eventDoc.id);
                await updateDoc(docRef, {
                    hostId: user.uid,
                    hostName: profile?.displayName || user.displayName || 'Unknown Host',
                    updatedAt: new Date().toISOString()
                });
                count++;
            }
            setStatus('success');
        } catch (err: any) {
            console.error("Migration error:", err);
            setError(err.message);
            setStatus('error');
        }
    }

    if (authLoading) return <div className="p-20 text-center"><Loader2 className="animate-spin mx-auto" /></div>;

    if (!user) {
        return (
            <div className="max-w-2xl mx-auto py-20 text-center">
                <ShieldAlert className="w-16 h-16 text-red-500 mx-auto mb-4" />
                <h1 className="text-2xl font-bold">Authentication Required</h1>
                <p className="text-muted-foreground mt-2">Please log in to the account you want to assign these events to.</p>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto py-12 space-y-8">
            <div className="bg-card border border-border rounded-lg p-8 md:p-12 shadow-sm text-center">
                <h1 className="text-3xl font-black mb-4">Event Migration Tool</h1>
                <p className="text-muted-foreground">
                    This temporary tool will find events in the database that DON'T have a owner assigned and assign them to your current account: <br />
                    <strong className="text-foreground">{user.email}</strong>
                </p>

                <div className="mt-10 space-y-6">
                    {status === 'idle' && (
                        <Button onClick={scanForEvents} className="rounded-full px-8 h-12">
                            Scan for Unclaimed Events
                        </Button>
                    )}

                    {status === 'scanning' && (
                        <div className="flex items-center justify-center gap-2 text-muted-foreground">
                            <Loader2 className="animate-spin" size={20} />
                            Scanning database...
                        </div>
                    )}

                    {status === 'ready' && (
                        <div className="space-y-6">
                            <div className="p-6 bg-amber-50 border border-amber-200 rounded-2xl text-amber-800">
                                <p className="font-bold text-lg">Found {unclaimedCount} unclaimed events.</p>
                                <p className="text-sm">Would you like to assign these to your account?</p>
                            </div>
                            <Button onClick={handleMigrate} className="rounded-full px-10 h-14 bg-primary text-lg">
                                Claim {unclaimedCount} Events
                            </Button>
                        </div>
                    )}

                    {status === 'migrating' && (
                        <div className="flex flex-col items-center gap-4">
                            <Loader2 className="animate-spin text-primary" size={48} />
                            <p className="font-bold">Migrating your events...</p>
                        </div>
                    )}

                    {status === 'success' && (
                        <div className="space-y-6">
                            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
                                <CheckCircle size={32} />
                            </div>
                            <div className="space-y-2">
                                <h2 className="text-2xl font-bold text-green-700">Migration Complete!</h2>
                                <p className="text-muted-foreground">All unclaimed events have been assigned to your UID.</p>
                            </div>
                            <Button variant="outline" className="rounded-full" onClick={() => window.location.href = '/dashboard/hosts/events'}>
                                Go to My Events
                            </Button>
                        </div>
                    )}

                    {status === 'error' && (
                        <div className="p-6 bg-red-50 border border-red-200 rounded-2xl text-red-800 space-y-4">
                            <div className="flex items-center gap-2 font-bold">
                                <AlertCircle size={20} />
                                Error during migration
                            </div>
                            <p className="text-sm">{error}</p>
                            <Button variant="outline" onClick={scanForEvents}>Try Again</Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
