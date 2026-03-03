"use client";

import { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/components/providers/auth-provider';

export function useVendorProfile() {
    const { user, loading: authLoading } = useAuth();
    const [vendorId, setVendorId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchVendor() {
            if (authLoading) return;
            if (!user) {
                setVendorId(null);
                setIsLoading(false);
                return;
            }

            try {
                // Try ownerId first
                const qOwner = query(collection(db, 'vendors'), where('ownerId', '==', user.uid));
                const snapOwner = await getDocs(qOwner);

                if (!snapOwner.empty) {
                    setVendorId(snapOwner.docs[0].id);
                    setIsLoading(false);
                    return;
                }

                // Try loginEmail fallback
                if (user.email) {
                    const qEmail = query(collection(db, 'vendors'), where('loginEmail', '==', user.email.toLowerCase()));
                    const snapEmail = await getDocs(qEmail);

                    if (!snapEmail.empty) {
                        setVendorId(snapEmail.docs[0].id);
                        setIsLoading(false);
                        return;
                    }
                }

                setVendorId(null);
            } catch (error) {
                console.error("Error fetching vendor profile:", error);
                setVendorId(null);
            } finally {
                setIsLoading(false);
            }
        }

        fetchVendor();
    }, [user, authLoading]);

    return { vendorId, isLoading };
}
