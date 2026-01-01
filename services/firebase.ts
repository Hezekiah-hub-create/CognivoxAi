// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBslLBLSOihHcqJ6vwlgp2xMWcbHVQixts",
  authDomain: "ai-saas-platform-97d70.firebaseapp.com",
  projectId: "ai-saas-platform-97d70",
  storageBucket: "ai-saas-platform-97d70.firebasestorage.app",
  messagingSenderId: "634384101556",
  appId: "1:634384101556:web:627c109adc50e17b8ce7e1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Clear any stale auth data to prevent lookup errors
if (typeof window !== 'undefined') {
  const authKey = `firebase:authUser:${firebaseConfig.apiKey}:[DEFAULT]`;
  localStorage.removeItem(authKey);
}

// connect to firestore
export const db = getFirestore(app);

// connect to auth
export const auth = getAuth(app);
