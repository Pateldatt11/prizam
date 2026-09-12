// assets/js/product-tracker.js
import { db } from "./firebase-config.js";
import { 
  doc, 
  updateDoc, 
  increment 
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-firestore.js";

/**
 * Tracks product clicks and records impressions into Firestore.
 * Uses sessionStorage to prevent duplicate inflation during the same browser visit.
 * @param {string} productId - The Firestore document ID of the product.
 */
export async function trackProductClick(productId) {
  if (!productId) return;

  const sessionKey = `prizam_tracked_click_${productId}`;
  if (sessionStorage.getItem(sessionKey)) {
    return;
  }

  try {
    const productRef = doc(db, "products", String(productId));
    await updateDoc(productRef, {
      clickCount: increment(1),
      lastClickedAt: new Date().toISOString()
    });
    sessionStorage.setItem(sessionKey, "true");
  } catch (err) {
    console.warn("Product click tracking skipped:", err);
  }
}