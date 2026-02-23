import { storage } from "./firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

/**
 * Uploads a file to Firebase Storage and returns the download URL.
 * @param file The file to upload
 * @param path The storage path (e.g., 'vendors/image.jpg')
 */
export async function uploadImage(file: File, path: string): Promise<string> {
    const storageRef = ref(storage, path);
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
}
