// assets/js/visitor-counter.js
import { db } from "./firebase-config.js";
import { 
  doc, 
  setDoc, 
  increment, 
  onSnapshot 
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-firestore.js";

const STATS_DOC_REF = doc(db, "analytics", "visitors");

/**
 * Tracks a new visit across total, today, month, and quarter tiers.
 * Uses sessionStorage to count unique browser sessions.
 */
export async function trackVisitor() {
  const sessionKey = "prizam_visited_session";

  if (!sessionStorage.getItem(sessionKey)) {
    const todayStr = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
    const monthStr = todayStr.substring(0, 7); // YYYY-MM
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();
    const quarterNum = Math.floor(currentMonth / 3) + 1;
    const quarterStr = `${currentYear}-Q${quarterNum}`; // e.g., 2026-Q2

    try {
      // 1. Atomic increment for total cumulative visits
      await setDoc(STATS_DOC_REF, {
        totalVisits: increment(1),
        lastVisitAt: new Date().toISOString()
      }, { merge: true });

      // 2. Atomic increment for today's visits
      await setDoc(doc(db, "analytics", `visitors_${todayStr}`), {
        visits: increment(1),
        date: todayStr
      }, { merge: true });

      // 3. Atomic increment for this month's visits
      await setDoc(doc(db, "analytics", `visitors_${monthStr}`), {
        visits: increment(1),
        month: monthStr
      }, { merge: true });

      // 4. Atomic increment for quarterly visits
      await setDoc(doc(db, "analytics", `visitors_${quarterStr}`), {
        visits: increment(1),
        quarter: quarterStr
      }, { merge: true });

      sessionStorage.setItem(sessionKey, "true");
    } catch (err) {
      console.warn("Visitor counter increment skipped:", err);
    }
  }
}

/**
 * Listens for real-time cumulative visitor count updates.
 * @param {Function} callback - Receives the live visit count integer.
 */
export function subscribeVisitorCount(callback) {
  return onSnapshot(STATS_DOC_REF, (snap) => {
    if (snap.exists()) {
      const data = snap.data();
      callback(data.totalVisits || 0);
    } else {
      callback(0);
    }
  }, (err) => {
    console.warn("Could not stream visitor counts:", err);
  });
}

// Automatically track visit upon loading
trackVisitor();