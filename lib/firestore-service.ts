import { db } from './firebase';
import { collection, getDocs, query, where, doc, getDoc, orderBy } from 'firebase/firestore';
import { Vendor, SharedEvent, BlogPost, FAQ, PricingTier, Offering, PlatformFeature } from './types';

export async function getVendors(): Promise<Vendor[]> {
    const querySnapshot = await getDocs(collection(db, 'vendors'));
    return querySnapshot.docs.map(doc => doc.data() as Vendor);
}

export async function getVendorBySlug(slug: string): Promise<Vendor | null> {
    const q = query(collection(db, 'vendors'), where('slug', '==', slug));
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) return null;
    return querySnapshot.docs[0].data() as Vendor;
}

export async function getEvents(): Promise<SharedEvent[]> {
    const querySnapshot = await getDocs(collection(db, 'events'));
    return querySnapshot.docs.map(doc => doc.data() as SharedEvent);
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
