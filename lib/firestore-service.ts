import { db } from './firebase';
import { collection, getDocs, query, where, doc, getDoc, orderBy } from 'firebase/firestore';
import { Vendor, SharedEvent, BlogPost, FAQ, PricingTier, Offering, PlatformFeature } from './types';

export async function getStoreKits(): Promise<any[]> {
    const querySnapshot = await getDocs(collection(db, 'chats'));

    return querySnapshot.docs
        .map(doc => ({ ...doc.data(), id: doc.id } as any))
        .filter((chat: any) => chat.published === true);
}

export async function getVendors(): Promise<Vendor[]> {
    const querySnapshot = await getDocs(collection(db, 'vendors'));
    return querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Vendor));
}

export async function getVendorBySlug(slug: string): Promise<Vendor | null> {
    // 1. Try finding by slug field
    const q = query(collection(db, 'vendors'), where('slug', '==', slug));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
        return { ...querySnapshot.docs[0].data(), id: querySnapshot.docs[0].id } as Vendor;
    }

    // 2. Fallback to document ID
    const docRef = doc(db, 'vendors', slug);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        return { ...docSnap.data(), id: docSnap.id } as Vendor;
    }

    return null;
}

export async function getEvents(): Promise<SharedEvent[]> {
    const querySnapshot = await getDocs(collection(db, 'events'));
    return querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as SharedEvent));
}

export async function getBlogPosts(): Promise<BlogPost[]> {
    const q = query(collection(db, 'blogPosts'), orderBy('date', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => doc.data() as BlogPost);
}

export async function getBlogPostById(id: string): Promise<BlogPost | null> {
    const docRef = doc(db, 'blogPosts', id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        return docSnap.data() as BlogPost;
    }
    return null;
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
    if (docSnap.exists()) return docSnap.data() as Vendor;
    return null;
}

export async function getEventById(id: string): Promise<SharedEvent | null> {
    const docRef = doc(db, 'events', id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) return docSnap.data() as SharedEvent;
    return null;
}

// ── Chat Functions ────────────────────────────────────────

import { addDoc, updateDoc, serverTimestamp, onSnapshot, deleteDoc } from 'firebase/firestore';

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

export async function saveChatMessage(chatId: string, message: any) {
    // Save to messages subcollection
    const messagesRef = collection(db, 'chats', chatId, 'messages');
    await addDoc(messagesRef, {
        ...message,
        timestamp: serverTimestamp()
    });

    // Update the parent chat's updatedAt
    const chatRef = doc(db, 'chats', chatId);
    await updateDoc(chatRef, {
        updatedAt: serverTimestamp()
    });
}

export function listenToMessages(chatId: string, callback: (messages: any[]) => void) {
    const q = query(
        collection(db, 'chats', chatId, 'messages'),
        orderBy('timestamp', 'asc')
    );
    return onSnapshot(q, (snapshot) => {
        const messages = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        callback(messages);
    });
}

export async function updateChatMetadata(chatId: string, data: any) {
    const chatRef = doc(db, 'chats', chatId);
    await updateDoc(chatRef, {
        ...data,
        updatedAt: serverTimestamp()
    });
}

export function listenToUserChats(userId: string, callback: (chats: any[]) => void) {
    const q = query(
        collection(db, 'chats'),
        where('userId', '==', userId)
    );
    return onSnapshot(q, (snapshot) => {
        const chats = snapshot.docs
            .map(doc => ({ id: doc.id, ...doc.data() }))
            .sort((a: any, b: any) => {
                const dateA = a.updatedAt?.seconds || 0;
                const dateB = b.updatedAt?.seconds || 0;
                return dateB - dateA;
            });
        callback(chats);
    });
}

export async function deleteChat(chatId: string) {
    const chatRef = doc(db, 'chats', chatId);
    await deleteDoc(chatRef);
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
