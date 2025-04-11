import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, setPersistence, browserLocalPersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyD2wlOpkqMG5bg0wL6Z9sB2IfmEpJUMq4c",
  authDomain: "image-search-anishfyi.firebaseapp.com",
  projectId: "image-search-anishfyi",
  storageBucket: "image-search-anishfyi.firebasestorage.app",
  messagingSenderId: "137979821448",
  appId: "1:137979821448:web:09f95ab9c472c80c55ce3d",
  measurementId: "G-NG2166QQVX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const storage = getStorage(app);
export const analytics = getAnalytics(app);

// Enable persistence
setPersistence(auth, browserLocalPersistence)
  .catch((error) => {
    console.error("Auth persistence error:", error);
  });

// Configure Google Provider
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

export default app; 