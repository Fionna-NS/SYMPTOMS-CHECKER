// Firebase SDK imports (full paths on the official CDN)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAPi4oxyNJTlX1Ixf6vCzFHvBUCrZdvVcM",
  authDomain: "symptoms-checker-b48b0.firebaseapp.com",
  projectId: "symptoms-checker-b48b0",
  storageBucket: "symptoms-checker-b48b0.firebasestorage.app",
  messagingSenderId: "892057567874",
  appId: "1:892057567874:web:b614ce93b8171b6c272a9b",
  measurementId: "G-1Q97DEC9L7"
};

// Initialize Firebase and Cloud Firestore
const app = initializeApp(firebaseConfig);

// Exported for script.js to use
export const db = getFirestore(app);
