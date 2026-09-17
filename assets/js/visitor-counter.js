// assets/js/visitor-counter.js
import { db } from "./firebase-config.js";
import {
  doc,
  setDoc,
  increment,
  onSnapshot,
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-firestore.js";

const STATS_DOC_REF = doc(db, "analytics", "visitors");

/**
 * Builds date/month/quarter keys using LOCAL time, not UTC.
 */
function getLocalDateParts(d = new Date()) {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0"); // 01-12
  const day = String(d.getDate()).padStart(2, "0"); // 01-31
  const todayStr = `${year}-${month}-${day}`; // YYYY-MM-DD
  const monthStr = `${year}-${month}`; // YYYY-MM
  const quarterNum = Math.floor(d.getMonth() / 3) + 1;
  const quarterStr = `${year}-Q${quarterNum}`; // e.g. 2026-Q3
  return { todayStr, monthStr, quarterStr };
}

/**
 * Tracks a new visit across total, today, month, and quarter tiers.
 *
 * FIX: uses localStorage (not sessionStorage) with a DATE-based key.
 * sessionStorage only clears when the tab/browser closes — so if a
 * tab stays open overnight, "today" never gets a fresh increment.
 * A dated localStorage key guarantees one increment per browser per
 * calendar day, and resets automatically the next day.
 */
export async function trackVisitor() {
  const { todayStr, monthStr, quarterStr } = getLocalDateParts();
  const sessionKey = `prizam_visited_${todayStr}`; // date-scoped key

  if (!localStorage.getItem(sessionKey)) {
    try {
      // 1. Atomic increment for total cumulative visits
      await setDoc(
        STATS_DOC_REF,
        {
          totalVisits: increment(1),
          lastVisitAt: new Date().toISOString(),
        },
        { merge: true },
      );

      // 2. Atomic increment for today's visits
      await setDoc(
        doc(db, "analytics", `visitors_${todayStr}`),
        {
          visits: increment(1),
          date: todayStr,
        },
        { merge: true },
      );

      // 3. Atomic increment for this month's visits
      await setDoc(
        doc(db, "analytics", `visitors_${monthStr}`),
        {
          visits: increment(1),
          month: monthStr,
        },
        { merge: true },
      );

      // 4. Atomic increment for quarterly visits
      await setDoc(
        doc(db, "analytics", `visitors_${quarterStr}`),
        {
          visits: increment(1),
          quarter: quarterStr,
        },
        { merge: true },
      );

      // Mark this browser as "counted" for TODAY only.
      // Tomorrow's date will produce a new key, so it counts again.
      localStorage.setItem(sessionKey, "true");

      // Optional cleanup: remove old dated keys so localStorage
      // doesn't fill up with stale "prizam_visited_YYYY-MM-DD" entries.
      cleanupOldVisitKeys(todayStr);
    } catch (err) {
      console.warn("Visitor counter increment skipped:", err);
    }
  }
}

/**
 * Removes old "prizam_visited_*" keys that aren't today's key,
 * so localStorage doesn't grow forever.
 */
function cleanupOldVisitKeys(todayStr) {
  const todayKey = `prizam_visited_${todayStr}`;
  for (let i = localStorage.length - 1; i >= 0; i--) {
    const key = localStorage.key(i);
    if (key && key.startsWith("prizam_visited_") && key !== todayKey) {
      localStorage.removeItem(key);
    }
  }
}

/**
 * Listens for real-time cumulative (all-time) visitor count updates.
 */
export function subscribeVisitorCount(callback) {
  return onSnapshot(
    STATS_DOC_REF,
    (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        callback(data.totalVisits || 0);
      } else {
        callback(0);
      }
    },
    (err) => {
      console.warn("Could not stream visitor counts:", err);
    },
  );
}

/**
 * Listens for real-time TODAY visitor count updates (local date).
 */
export function subscribeTodayVisitorCount(callback) {
  const { todayStr } = getLocalDateParts();
  const ref = doc(db, "analytics", `visitors_${todayStr}`);
  return onSnapshot(
    ref,
    (snap) => {
      callback(snap.exists() ? snap.data().visits || 0 : 0);
    },
    (err) => {
      console.warn("Could not stream today's visitor count:", err);
      callback(0);
    },
  );
}

/**
 * Listens for real-time THIS MONTH visitor count updates (local month).
 */
export function subscribeMonthVisitorCount(callback) {
  const { monthStr } = getLocalDateParts();
  const ref = doc(db, "analytics", `visitors_${monthStr}`);
  return onSnapshot(
    ref,
    (snap) => {
      callback(snap.exists() ? snap.data().visits || 0 : 0);
    },
    (err) => {
      console.warn("Could not stream this month's visitor count:", err);
      callback(0);
    },
  );
}

/**
 * Listens for real-time THIS QUARTER visitor count updates (local quarter).
 */
export function subscribeQuarterVisitorCount(callback) {
  const { quarterStr } = getLocalDateParts();
  const ref = doc(db, "analytics", `visitors_${quarterStr}`);
  return onSnapshot(
    ref,
    (snap) => {
      callback(snap.exists() ? snap.data().visits || 0 : 0);
    },
    (err) => {
      console.warn("Could not stream this quarter's visitor count:", err);
      callback(0);
    },
  );
}

/**
 * Convenience: subscribe to ALL four tiers at once.
 */
export function subscribeVisitorStats(callback) {
  const stats = { total: 0, today: 0, month: 0, quarter: 0 };
  const emit = () => callback({ ...stats });

  const unsubTotal = subscribeVisitorCount((v) => {
    stats.total = v;
    emit();
  });
  const unsubToday = subscribeTodayVisitorCount((v) => {
    stats.today = v;
    emit();
  });
  const unsubMonth = subscribeMonthVisitorCount((v) => {
    stats.month = v;
    emit();
  });
  const unsubQuarter = subscribeQuarterVisitorCount((v) => {
    stats.quarter = v;
    emit();
  });

  return () => {
    unsubTotal();
    unsubToday();
    unsubMonth();
    unsubQuarter();
  };
}

// Automatically track visit upon loading
trackVisitor();