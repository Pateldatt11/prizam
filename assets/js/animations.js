// assets/js/animations.js

document.addEventListener("DOMContentLoaded", () => {
  // 1. Intersection Observer for Scroll Reveal Animations
  const observerOptions = {
    root: null,
    rootMargin: "0px 0px -60px 0px",
    threshold: 0.12
  };

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("active");
        observer.unobserve(entry.target); // Trigger animation once
      }
    });
  }, observerOptions);

  // Observe all static elements marked with .reveal
  document.querySelectorAll(".reveal").forEach((element) => {
    revealObserver.observe(element);
  });

  // Global helper to observe dynamically injected Firestore cards
  window.observeDynamicCards = function () {
    const unobservedCards = document.querySelectorAll(
      ".product-card:not(.active), .category-card:not(.active)"
    );
    unobservedCards.forEach((card) => {
      card.classList.add("reveal");
      revealObserver.observe(card);
    });
  };

  // 2. Sticky Navbar Glassmorphism Scroll Effect
  const navbar = document.querySelector(".navbar");
  if (navbar) {
    window.addEventListener(
      "scroll",
      () => {
        if (window.scrollY > 40) {
          navbar.style.boxShadow = "0 4px 20px rgba(0, 0, 0, 0.08)";
          navbar.style.background = "rgba(255, 255, 255, 0.95)";
        } else {
          navbar.style.boxShadow = "none";
          navbar.style.background = "rgba(255, 255, 255, 0.85)";
        }
      },
      { passive: true }
    );
  }
});

// 3. Global Toast Notification Helper
window.showToast = function (message) {
  let toast = document.querySelector(".toast-notification");

  if (!toast) {
    toast = document.createElement("div");
    toast.className = "toast-notification";
    document.body.appendChild(toast);
  }

  toast.textContent = message;
  toast.classList.add("show");

  // Auto-dismiss toast
  clearTimeout(window.toastTimeout);
  window.toastTimeout = setTimeout(() => {
    toast.classList.remove("show");
  }, 2800);
};