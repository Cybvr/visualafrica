import { storage } from "./firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

/**
 * Uploads a file to Firebase Storage and returns the download URL.
 * @param file The file to upload
 * @param path The storage path (e.g., 'vendors/image.jpg')
 */
export async function uploadImage(file: File, path: string): Promise<string> {
    console.log(`[STORAGE DEBUG] Attempting upload to: ${path}`);
    console.log(`[STORAGE DEBUG] File type: ${file.type}, size: ${file.size} bytes`);
    const storageRef = ref(storage, path);
    const metadata = {
        contentType: file.type,
    };
    try {
        const snapshot = await uploadBytes(storageRef, file, metadata);
        const downloadURL = await getDownloadURL(snapshot.ref);
        return downloadURL;
    } catch (error) {
        console.error(`Firebase Storage upload error for ${path}:`, error);
        throw error;
    }
}
