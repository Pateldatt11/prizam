// assets/js/products.js

import { db } from "./firebase-config.js";
import {
  collection,
  query,
  where,
  getDocs
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-firestore.js";
import { addToCart } from "./cart.js";

/**
 * Fetch products from Firestore by boolean flag and render into container
 * @param {string} flagField - Firestore document field ('isTopPick', 'isTopSeller', 'isUpcoming')
 * @param {string} containerId - Target DOM element ID
 * @param {string} badgeLabel - Badge text displayed on the product card
 */
export async function loadProductsBySection(flagField, containerId, badgeLabel) {
  const container = document.getElementById(containerId);
  if (!container) return;

  try {
    const q = query(
      collection(db, "products"),
      where("status", "==", "published"),
      where(flagField, "==", true)
    );
    const querySnapshot = await getDocs(q);

    container.innerHTML = "";

    if (querySnapshot.empty) {
      container.innerHTML = `
        <div style="grid-column: 1 / -1; padding: 2rem 0; text-align: center; color: var(--text-muted);">
          <p>No products currently featured in this showcase.</p>
        </div>
      `;
      return;
    }

    querySnapshot.forEach((docSnap) => {
      const product = docSnap.data();
      const productId = docSnap.id;

      const card = document.createElement("div");
      card.className = "product-card reveal";

      const discountBadge = product.originalPrice && product.originalPrice > product.price
        ? `<span class="badge-tag">${badgeLabel}</span>`
        : `<span class="badge-tag">${badgeLabel}</span>`;

      card.innerHTML = `
        <div class="product-thumb" style="cursor: pointer;">
          ${discountBadge}
          <img 
            src="${product.imageUrl || 'https://via.placeholder.com/400x300'}" 
            alt="${product.title || 'Prizam Drain'}" 
            loading="lazy" 
          />
        </div>
        <div class="product-info">
          <h3 class="product-title" style="cursor: pointer;">
            ${product.title || 'Untitled Product'}
          </h3>
          <div class="product-price-box">
            <span class="current-price">₹${product.price || 0}</span>
            ${product.originalPrice ? `<span class="old-price">₹${product.originalPrice}</span>` : ''}
          </div>
          <button class="btn-add-cart" data-id="${productId}">
            Add to Cart
          </button>
        </div>
      `;

      // Navigate to product details page on card click
      const navigateToDetails = () => {
        window.location.href = `product-details.html?id=${productId}`;
      };

      card.querySelector(".product-thumb").addEventListener("click", navigateToDetails);
      card.querySelector(".product-title").addEventListener("click", navigateToDetails);

      // Add to Cart button handler
      const cartBtn = card.querySelector(".btn-add-cart");
      cartBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        addToCart({
          id: productId,
          title: product.title,
          price: product.price,
          imageUrl: product.imageUrl
        });
      });

      container.appendChild(card);
    });

    // Re-trigger scroll reveal animations for newly injected DOM nodes
    if (typeof window.observeDynamicCards === "function") {
      window.observeDynamicCards();
    }
  } catch (err) {
    console.error(`Error loading section [${flagField}]:`, err);
    container.innerHTML = `
      <div style="grid-column: 1 / -1; padding: 2rem 0; text-align: center; color: var(--admin-danger, #dc2626);">
        <p>Failed to load products. Check network connection and Firestore permissions.</p>
      </div>
    `;
  }
}

// Auto-initialize showcases on DOM ready
document.addEventListener("DOMContentLoaded", () => {
  // Populate Top Picks on Homepage
  loadProductsBySection("isTopPick", "topPicksContainer", "Top Pick");

  // Populate Best Sellers on Homepage
  loadProductsBySection("isTopSeller", "bestSellersContainer", "Best Seller");
});