import { auth } from "./firebase-config.js";
import {
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-auth.js";

const adminEmail = "admin@prizam.com";

export function requireAdmin() {
  onAuthStateChanged(auth, (user) => {
    if (!user || user.email !== adminEmail) {
      localStorage.removeItem("prizam_admin_logged_in");
      window.location.href = "login.html";
      return;
    }
    localStorage.setItem("prizam_admin_logged_in", "true");
  });
}

export async function logoutAdmin() {
  localStorage.removeItem("prizam_admin_logged_in");
  await signOut(auth);
  window.location.href = "login.html";
}
