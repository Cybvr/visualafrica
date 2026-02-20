import { db } from './firebase';
import { collection, getDocs, query, where, doc, getDoc } from 'firebase/firestore';
import { Vendor } from './vendors-data';
import { SharedEvent } from './shared-data';
import { BlogPost } from './blog-data';

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
    const querySnapshot = await getDocs(collection(db, 'blogPosts'));
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
