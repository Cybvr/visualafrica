import { db } from './firebase';
import {
    collection,
    getDocs,
    query,
    where,
    doc,
    getDoc,
    orderBy,
    addDoc,
    updateDoc,
    serverTimestamp,
    onSnapshot,
    deleteDoc,
    setDoc,
    writeBatch,
    runTransaction,
    Timestamp
} from 'firebase/firestore';

import { Vendor, SharedEvent, BlogPost, FAQ, PricingTier, Offering, PlatformFeature, Experience } from './types';
import { buildMessageQuota, getCurrentPeriodKey } from './message-usage';

export class MessageLimitReachedError extends Error {
    code: string;
    quota: ReturnType<typeof buildMessageQuota>;

    constructor(quota: ReturnType<typeof buildMessageQuota>) {
        super('PLAN_LIMIT_REACHED');
        this.name = 'MessageLimitReachedError';
        this.code = 'PLAN_LIMIT_REACHED';
        this.quota = quota;
    }
}

function toPlainValue(value: unknown): unknown {
    if (value instanceof Timestamp) {
        return value.toDate().toISOString();
    }

    if (value instanceof Date) {
        return value.toISOString();
    }

    if (Array.isArray(value)) {
        return value.map((item) => toPlainValue(item));
    }

    if (value && typeof value === 'object') {
        return Object.fromEntries(
            Object.entries(value as Record<string, unknown>).map(([key, nestedValue]) => [
                key,
                toPlainValue(nestedValue)
            ])
        );
    }

    return value;
}

function toPlainObject<T>(value: T): T {
    return toPlainValue(value) as T;
}

export async function getStoreKits(): Promise<any[]> {
    const q = query(
        collection(db, 'chats'),
        where('published', '==', true)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as any));
}

export async function getVendors(): Promise<Vendor[]> {
    const querySnapshot = await getDocs(collection(db, 'vendors'));
    return querySnapshot.docs.map(doc => toPlainObject({ ...doc.data(), id: doc.id } as Vendor));
}

export async function getVendorBySlug(slug: string): Promise<Vendor | null> {
    // 1. Try finding by slug field
    const q = query(collection(db, 'vendors'), where('slug', '==', slug));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
        return toPlainObject({ ...querySnapshot.docs[0].data(), id: querySnapshot.docs[0].id } as Vendor);
    }

    // 2. Fallback to document ID
    const docRef = doc(db, 'vendors', slug);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        return toPlainObject({ ...docSnap.data(), id: docSnap.id } as Vendor);
    }

    return null;
}

export async function getEvents(userId?: string, userEmail?: string): Promise<SharedEvent[]> {
    const toEvents = (querySnapshot: any) =>
        querySnapshot.docs.map((doc: any) => toPlainObject({ ...doc.data(), id: doc.id } as SharedEvent));

    if (!userId && !userEmail) {
        const q = query(
            collection(db, 'events'),
            where('isPublicBrief', '==', true),
            where('publicBriefStatus', '==', 'open')
        );
        const querySnapshot = await getDocs(q);
        return toEvents(querySnapshot);
    }

    const eventsMap = new Map<string, SharedEvent>();
    const addToMap = (items: SharedEvent[]) => {
        items.forEach((item) => {
            if (item?.id) eventsMap.set(item.id, item);
        });
    };

    const publicQ = query(
        collection(db, 'events'),
        where('isPublicBrief', '==', true),
        where('publicBriefStatus', '==', 'open')
    );
    addToMap(toEvents(await getDocs(publicQ)));

    if (userId) {
        const q1 = query(collection(db, 'events'), where('hostId', '==', userId));
        addToMap(toEvents(await getDocs(q1)));
    }

    if (userEmail) {
        const q2 = query(collection(db, 'events'), where('sharedWith', 'array-contains', userEmail));
        addToMap(toEvents(await getDocs(q2)));
    }

    return Array.from(eventsMap.values());
}

export function listenToEvents(userId: string, callback: (events: SharedEvent[]) => void) {
    const q = query(collection(db, 'events'), where('hostId', '==', userId));
    return onSnapshot(q, (snapshot) => {
        const events = snapshot.docs.map(doc => toPlainObject({ ...doc.data(), id: doc.id } as SharedEvent));
        callback(events);
    });
}

export async function createEvent(eventData: Omit<SharedEvent, 'id'>) {
    const isPublicBrief = eventData.isPublicBrief ?? false;
    const publicBriefStatus = eventData.publicBriefStatus ?? (isPublicBrief ? 'open' : 'closed');

    const docRef = await addDoc(collection(db, 'events'), {
        ...eventData,
        isPublicBrief,
        publicBriefStatus,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
    });
    return docRef.id;
}

export async function updateEvent(eventId: string, data: Partial<SharedEvent>) {
    const docRef = doc(db, 'events', eventId);
    await updateDoc(docRef, {
        ...data,
        updatedAt: serverTimestamp()
    });
}

export async function getBlogPosts(): Promise<BlogPost[]> {
    const q = query(collection(db, 'blogPosts'), orderBy('date', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as BlogPost));
}

export async function getBlogPostById(id: string): Promise<BlogPost | null> {
    const docRef = doc(db, 'blogPosts', id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        return { ...docSnap.data(), id: docSnap.id } as BlogPost;
    }
    return null;
}

export async function createBlogPost(postData: Omit<BlogPost, 'id'>) {
    const docRef = await addDoc(collection(db, 'blogPosts'), {
        ...postData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
    });
    return docRef.id;
}

export async function updateBlogPost(id: string, data: Partial<BlogPost>) {
    const docRef = doc(db, 'blogPosts', id);
    await updateDoc(docRef, {
        ...data,
        updatedAt: serverTimestamp()
    });
}

export async function deleteBlogPost(id: string) {
    const docRef = doc(db, 'blogPosts', id);
    await deleteDoc(docRef);
}

export async function getFaqs(): Promise<FAQ[]> {
    const q = query(collection(db, 'faqs'), orderBy('id', 'asc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => doc.data() as FAQ);
}

export async function getPricingTiers(): Promise<PricingTier[]> {
    const querySnapshot = await getDocs(collection(db, 'pricingTiers'));
    return querySnapshot.docs.map(doc => doc.data() as PricingTier);
}

export async function getSolutions(): Promise<Offering[]> {
    const querySnapshot = await getDocs(collection(db, 'solutions'));
    return querySnapshot.docs.map(doc => doc.data() as Offering);
}

export async function getSolutionBySlug(slug: string): Promise<Offering | null> {
    const docRef = doc(db, 'solutions', slug);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) return docSnap.data() as Offering;
    return null;
}

export async function getPlatformFeatures(): Promise<PlatformFeature[]> {
    const querySnapshot = await getDocs(collection(db, 'platformFeatures'));
    return querySnapshot.docs.map(doc => doc.data() as PlatformFeature);
}

export async function getVendorById(id: string): Promise<Vendor | null> {
    const docRef = doc(db, 'vendors', id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) return toPlainObject({ ...docSnap.data(), id: docSnap.id } as Vendor);
    return null;
}

export async function getEventById(id: string): Promise<SharedEvent | null> {
    const docRef = doc(db, 'events', id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) return toPlainObject({ ...docSnap.data(), id: docSnap.id } as SharedEvent);
    return null;
}

export async function getBookingById(id: string): Promise<any | null> {
    const docRef = doc(db, 'bookings', id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) return toPlainObject({ ...docSnap.data(), id: docSnap.id });
    return null;
}

export async function createBooking(bookingData: any) {
    const docRef = await addDoc(collection(db, 'bookings'), {
        ...bookingData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
    });
    return docRef.id;
}

export function listenToEventById(id: string, callback: (event: SharedEvent | null) => void) {
    const docRef = doc(db, 'events', id);
    return onSnapshot(docRef, (snapshot) => {
        if (snapshot.exists()) {
            callback(toPlainObject({ ...snapshot.data(), id: snapshot.id } as SharedEvent));
        } else {
            callback(null);
        }
    });
}

// ── Chat Functions ────────────────────────────────────────


export async function getUserChats(userId: string) {
    const q = query(
        collection(db, 'chats'),
        where('userId', '==', userId)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .sort((a: any, b: any) => {
            const dateA = a.updatedAt?.seconds || 0;
            const dateB = b.updatedAt?.seconds || 0;
            return dateB - dateA;
        });
}

export async function createChat(userId: string, title: string = "New Chat", city: string | null = null) {
    const docRef = await addDoc(collection(db, 'chats'), {
        userId,
        title,
        activeCity: city,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        published: false
    });
    return docRef.id;
}

export async function getChatById(chatId: string): Promise<any | null> {
    const docRef = doc(db, 'chats', chatId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
    }
    return null;
}

export async function getUserMessageQuota(userId: string) {
    const periodKey = getCurrentPeriodKey();
    const userRef = doc(db, 'users', userId);
    const usageRef = doc(db, 'messageUsage', userId);

    const [userSnap, usageSnap] = await Promise.all([getDoc(userRef), getDoc(usageRef)]);
    const profile = userSnap.exists() ? (userSnap.data() as any) : null;
    const usageData = usageSnap.exists() ? usageSnap.data() as any : null;
    const used = usageData?.periodKey === periodKey ? Number(usageData?.used || 0) : 0;

    return buildMessageQuota({
        profile,
        used,
        periodKey
    });
}

export async function saveUserChatMessage(chatId: string, message: any, userId: string) {
    const periodKey = getCurrentPeriodKey();

    const result = await runTransaction(db, async (tx) => {
        const chatRef = doc(db, 'chats', chatId);
        const usageRef = doc(db, 'messageUsage', userId);
        const userRef = doc(db, 'users', userId);
        const messageRef = doc(collection(db, 'chats', chatId, 'messages'));

        const [chatSnap, usageSnap, userSnap] = await Promise.all([
            tx.get(chatRef),
            tx.get(usageRef),
            tx.get(userRef)
        ]);

        if (!chatSnap.exists()) {
            throw new Error('CHAT_NOT_FOUND');
        }

        const chatData = chatSnap.data() as any;
        if (chatData?.userId !== userId) {
            throw new Error('CHAT_ACCESS_DENIED');
        }

        const profile = userSnap.exists() ? (userSnap.data() as any) : null;
        const usageData = usageSnap.exists() ? (usageSnap.data() as any) : null;
        const used = usageData?.periodKey === periodKey ? Number(usageData?.used || 0) : 0;
        const quota = buildMessageQuota({
            profile,
            used,
            periodKey
        });

        if (!quota.isUnlimited && quota.limit !== null && used >= quota.limit) {
            throw new MessageLimitReachedError(quota);
        }

        const nextUsed = used + 1;
        const nextQuota = buildMessageQuota({
            profile,
            used: nextUsed,
            periodKey
        });

        tx.set(messageRef, {
            ...message,
            timestamp: serverTimestamp()
        });

        tx.set(chatRef, {
            updatedAt: serverTimestamp()
        }, { merge: true });

        tx.set(usageRef, {
            uid: userId,
            periodKey,
            used: nextUsed,
            plan: nextQuota.plan,
            limit: nextQuota.limit ?? -1,
            updatedAt: serverTimestamp(),
            createdAt: usageSnap.exists() ? (usageData?.createdAt || serverTimestamp()) : serverTimestamp()
        }, { merge: true });

        return nextQuota;
    });

    return result;
}

export async function saveChatMessage(chatId: string, message: any) {
    const sanitizedMessage = Object.fromEntries(
        Object.entries(message || {}).filter(([, value]) => value !== undefined)
    );

    // Save to messages subcollection
    const messagesRef = collection(db, 'chats', chatId, 'messages');
    await addDoc(messagesRef, {
        ...sanitizedMessage,
        timestamp: serverTimestamp()
    });

    // Update the parent chat's updatedAt
    const chatRef = doc(db, 'chats', chatId);
    await setDoc(chatRef, {
        updatedAt: serverTimestamp()
    }, { merge: true });
}

export async function saveChatFeedback(chatId: string, payload: { messageId?: string; rating: "up" | "down"; messageType?: string; content?: string; userId?: string }) {
    const feedbackRef = collection(db, 'chats', chatId, 'feedback');
    await addDoc(feedbackRef, {
        ...payload,
        createdAt: serverTimestamp()
    });
}

export function listenToMessages(
    chatId: string,
    callback: (messages: any[]) => void,
    onError?: (error: any) => void
) {
    const q = query(
        collection(db, 'chats', chatId, 'messages'),
        orderBy('timestamp', 'asc')
    );
    return onSnapshot(
        q,
        (snapshot) => {
            const messages = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            callback(messages);
        },
        (error) => {
            if (onError) onError(error);
        }
    );
}

export async function updateChatMetadata(chatId: string, data: any) {
    const chatRef = doc(db, 'chats', chatId);
    await setDoc(chatRef, {
        ...data,
        updatedAt: serverTimestamp()
    }, { merge: true });
}

export function listenToUserChats(userId: string, callback: (chats: any[]) => void) {
    const q = query(
        collection(db, 'chats'),
        where('userId', '==', userId),
        orderBy('updatedAt', 'desc')
    );
    return onSnapshot(q, (snapshot) => {
        const chats = snapshot.docs
            .map(doc => ({ id: doc.id, ...doc.data() }))
            // Safety net: skip any docs that don't match this userId
            .filter((chat: any) => chat.userId === userId);
        callback(chats);
    });
}

export async function deleteChat(chatId: string) {
    const chatRef = doc(db, 'chats', chatId);
    await deleteDoc(chatRef);
}

/**
 * Removes a vendor conversation from a host event.
 * Host inbox conversation IDs are "eventId:vendorId" — they live inside
 * the event document, not in the chats collection.
 */
export async function removeConversationFromEvent(chatId: string) {
    const colonIndex = chatId.indexOf(':');
    if (colonIndex === -1) {
        // Not a compound ID — fall back to deleting from chats
        return deleteChat(chatId);
    }
    const eventId = chatId.slice(0, colonIndex);
    const vendorId = chatId.slice(colonIndex + 1);

    const eventRef = doc(db, 'events', eventId);
    const eventSnap = await getDoc(eventRef);
    if (!eventSnap.exists()) return;

    const eventData = eventSnap.data() as SharedEvent;
    const updatedLeads = (eventData.leads || []).filter(
        (l: any) => l.vendorId !== vendorId
    );
    const updatedBookedVendors = (eventData.bookedVendors || []).filter(
        (b: any) => b.vendorId !== vendorId
    );

    await updateDoc(eventRef, {
        leads: updatedLeads,
        bookedVendors: updatedBookedVendors,
        updatedAt: serverTimestamp()
    });
}

export async function remixChat(originalChatId: string, newUserId: string): Promise<string> {
    const originalChatRef = doc(db, 'chats', originalChatId);
    const originalChatSnap = await getDoc(originalChatRef);
    if (!originalChatSnap.exists()) {
        throw new Error("Chat not found");
    }
    const originalData = originalChatSnap.data();

    // Create new chat
    const newChatRef = await addDoc(collection(db, 'chats'), {
        ...originalData,
        userId: newUserId,
        published: false,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        remixedFrom: originalChatId
    });

    // Copy messages
    const q = query(
        collection(db, 'chats', originalChatId, 'messages'),
        orderBy('timestamp', 'asc')
    );
    const messagesSnap = await getDocs(q);

    for (const msgDoc of messagesSnap.docs) {
        const msgData = msgDoc.data();
        await addDoc(collection(db, 'chats', newChatRef.id, 'messages'), {
            ...msgData,
            timestamp: serverTimestamp()
        });
    }

    return newChatRef.id;
}

export async function addVendor(vendorData: Omit<Vendor, 'id'>) {
    const docId = vendorData.slug || undefined;
    if (docId) {
        await setDoc(doc(db, 'vendors', docId), {
            ...vendorData,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
        });
        return docId;
    } else {
        const docRef = await addDoc(collection(db, 'vendors'), {
            ...vendorData,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
        });
        return docRef.id;
    }
}

export async function updateVendor(vendorId: string, data: Partial<Vendor>) {
    const docRef = doc(db, 'vendors', vendorId);
    await updateDoc(docRef, {
        ...data,
        updatedAt: serverTimestamp()
    });
}

export async function deleteVendor(vendorId: string) {
    const docRef = doc(db, 'vendors', vendorId);
    await deleteDoc(docRef);
}

export async function bulkUpdateVendors(updates: { id: string, data: Partial<Vendor> }[]) {
    const batch = writeBatch(db);
    updates.forEach((update) => {
        const docRef = doc(db, 'vendors', update.id);
        batch.update(docRef, {
            ...update.data,
            updatedAt: serverTimestamp()
        });
    });
    await batch.commit();
}

// ── Experience Functions ──────────────────────────────────

export async function getExperiences(): Promise<Experience[]> {
    const querySnapshot = await getDocs(collection(db, 'experiences'));
    const experiences = querySnapshot.docs.map(doc => toPlainObject({ ...doc.data(), id: doc.id } as Experience));

    // Fetch unique vendor IDs to avoid redundant lookups
    const vendorIds = Array.from(new Set(experiences.filter(e => e.vendorId).map(e => e.vendorId)));

    // Batch fetch vendors in parallel
    const vendors = await Promise.all(vendorIds.map(id => getVendorById(id)));
    const vendorMap: Record<string, Vendor> = {};
    vendors.forEach(v => {
        if (v) vendorMap[v.id] = v;
    });

    // Map vendor details to experiences
    return experiences.map(exp => ({
        ...exp,
        vendorName: vendorMap[exp.vendorId]?.name || exp.vendorName || "Unknown Vendor",
        vendorSlug: vendorMap[exp.vendorId]?.slug || exp.vendorSlug || ""
    }));
}

export async function getExperiencesByVendor(vendorId: string): Promise<Experience[]> {
    const q = query(collection(db, 'experiences'), where('vendorId', '==', vendorId));
    const querySnapshot = await getDocs(q);
    const experiences = querySnapshot.docs.map(doc => toPlainObject({ ...doc.data(), id: doc.id } as Experience));

    const vendor = await getVendorById(vendorId);
    if (!vendor) return experiences;

    return experiences.map(exp => ({
        ...exp,
        vendorName: vendor.name,
        vendorSlug: vendor.slug
    }));
}

export async function getExperienceById(id: string): Promise<Experience | null> {
    const docRef = doc(db, 'experiences', id);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) return null;

    const experience = toPlainObject({ ...docSnap.data(), id: docSnap.id } as Experience);
    if (experience.vendorId) {
        const vendor = await getVendorById(experience.vendorId);
        if (vendor) {
            return {
                ...experience,
                vendorName: vendor.name,
                vendorSlug: vendor.slug
            };
        }
    }
    return experience;
}

export async function addExperience(experienceData: Omit<Experience, 'id'>) {
    const docRef = await addDoc(collection(db, 'experiences'), {
        ...experienceData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
    });
    return docRef.id;
}

export async function updateExperience(id: string, data: Partial<Experience>) {
    const docRef = doc(db, 'experiences', id);
    await updateDoc(docRef, {
        ...data,
        updatedAt: serverTimestamp()
    });
}

export async function deleteExperience(id: string) {
    const docRef = doc(db, 'experiences', id);
    await deleteDoc(docRef);
}

export async function getRelatedExperiences(experienceId: string, limitCount: number = 4): Promise<Experience[]> {
    const allExperiences = await getExperiences();
    const current = allExperiences.find(e => e.id === experienceId);
    if (!current) return allExperiences.filter(e => e.id !== experienceId).slice(0, limitCount);

    // Simple heuristic: same location or same vendor
    // In a real app, you'd use categories or more complex logic
    const related = allExperiences.filter(e =>
        e.id !== experienceId &&
        (e.location === current.location || e.vendorId === current.vendorId)
    );

    if (related.length < limitCount) {
        // Fallback to any other experiences if not enough related ones found
        const others = allExperiences.filter(e =>
            e.id !== experienceId && !related.find(r => r.id === e.id)
        );
        return [...related, ...others].slice(0, limitCount);
    }

    return related.slice(0, limitCount);
}
