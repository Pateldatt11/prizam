// assets/js/firebase-config.js

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.18.0/firebase-app.js";
import { getAnalytics, isSupported } from "https://www.gstatic.com/firebasejs/12.18.0/firebase-analytics.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.18.0/firebase-firestore.js";
import { getAuth, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/12.18.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyAI8erEdUZTK8YiX3DDdfxpbcQp2wnTsGI",
  authDomain: "prizem-c9876.firebaseapp.com",
  projectId: "prizem-c9876",
  storageBucket: "prizem-c9876.firebasestorage.app",
  messagingSenderId: "1062047609931",
  appId: "1:1062047609931:web:579dced19197aca22889ce",
  measurementId: "G-9H08BH5C3B"
};

// Initialize Firebase Core
const app = initializeApp(firebaseConfig);

// Initialize Firestore & Auth Services
const db = getFirestore(app);
const auth = getAuth(app);

// Pre-configured Google Auth Provider for instant one-tap logins
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: "select_account" });

// Safe Analytics loader (prevents localhost & private browser crashes)
let analytics = null;
isSupported().then((supported) => {
  if (supported) {
    analytics = getAnalytics(app);
  }
}).catch(() => {});

export { app, analytics, auth, db, googleProvider };