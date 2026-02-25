"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

const STORAGE_PREFIX = "va-saved-vendors";

function safeReadLocal(key: string): string[] {
    if (typeof window === "undefined") return [];
    try {
        const raw = window.localStorage.getItem(key);
        if (!raw) return [];
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed.filter(Boolean) : [];
    } catch {
        return [];
    }
}

function safeWriteLocal(key: string, ids: string[]) {
    if (typeof window === "undefined") return;
    try {
        window.localStorage.setItem(key, JSON.stringify(ids));
    } catch {
        // Ignore storage errors (quota, private mode, etc.)
    }
}

export function useSavedVendors(userId?: string | null) {
    const storageKey = useMemo(
        () => `${STORAGE_PREFIX}:${userId || "guest"}`,
        [userId]
    );
    const [savedVendorIds, setSavedVendorIds] = useState<Set<string>>(new Set());
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        let cancelled = false;
        const local = safeReadLocal(storageKey);
        setSavedVendorIds(new Set(local));
        setLoaded(false);

        if (!userId) {
            setLoaded(true);
            return () => {
                cancelled = true;
            };
        }

        (async () => {
            try {
                const docRef = doc(db, "users", userId);
                const snap = await getDoc(docRef);
                const remote = snap.exists()
                    ? Array.isArray(snap.data().savedVendors)
                        ? snap.data().savedVendors.filter(Boolean)
                        : []
                    : [];
                const merged = Array.from(new Set([...local, ...remote].filter(Boolean)));
                if (!cancelled) {
                    setSavedVendorIds(new Set(merged));
                }
                safeWriteLocal(storageKey, merged);
                if (merged.length !== remote.length) {
                    await setDoc(
                        docRef,
                        { savedVendors: merged, updatedAt: new Date().toISOString() },
                        { merge: true }
                    );
                }
            } catch (err) {
                console.error("Failed to load saved vendors:", err);
            } finally {
                if (!cancelled) setLoaded(true);
            }
        })();

        return () => {
            cancelled = true;
        };
    }, [storageKey, userId]);

    const persist = useCallback(
        async (next: Set<string>) => {
            const list = Array.from(next);
            safeWriteLocal(storageKey, list);
            if (!userId) return;
            try {
                await setDoc(
                    doc(db, "users", userId),
                    { savedVendors: list, updatedAt: new Date().toISOString() },
                    { merge: true }
                );
            } catch (err) {
                console.error("Failed to save vendors:", err);
            }
        },
        [storageKey, userId]
    );

    const toggleSavedVendor = useCallback(
        (vendorId: string) => {
            if (!vendorId) return;
            setSavedVendorIds((prev) => {
                const next = new Set(prev);
                if (next.has(vendorId)) {
                    next.delete(vendorId);
                } else {
                    next.add(vendorId);
                }
                void persist(next);
                return next;
            });
        },
        [persist]
    );

    const isSaved = useCallback(
        (vendorId: string) => savedVendorIds.has(vendorId),
        [savedVendorIds]
    );

    const mergeSavedVendors = useCallback(
        (vendorIds: string[]) => {
            if (!vendorIds?.length) return;
            setSavedVendorIds((prev) => {
                const next = new Set(prev);
                vendorIds.filter(Boolean).forEach((id) => next.add(id));
                void persist(next);
                return next;
            });
        },
        [persist]
    );

    const clearSavedVendors = useCallback(() => {
        setSavedVendorIds(() => {
            const next = new Set<string>();
            void persist(next);
            return next;
        });
    }, [persist]);

    return {
        savedVendorIds,
        isSaved,
        toggleSavedVendor,
        mergeSavedVendors,
        clearSavedVendors,
        loaded,
    };
}
