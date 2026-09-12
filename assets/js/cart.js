// assets/js/cart.js

const CART_STORAGE_KEY = "prizam_cart";

// Anti-duplication debounce lock
let lastAddedId = null;
let lastAddedTime = 0;

/**
 * Retrieve and normalize the current cart array from localStorage
 * Automatically removes duplicate items with the same ID
 * @returns {Array<Object>} Sanitized cart items
 */
export function getCart() {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    const list = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(list)) return [];

    // Deduplicate entries by product ID
    const map = new Map();
    list.forEach((item) => {
      if (!item || !item.id) return;
      const idKey = String(item.id);
      const qty = Math.max(1, Number(item.quantity) || 1);

      if (map.has(idKey)) {
        const existing = map.get(idKey);
        existing.quantity = Math.max(existing.quantity, qty);
      } else {
        map.set(idKey, {
          id: item.id,
          title: item.title || "Drain Product",
          price: Number(item.price) || 0,
          imageUrl: item.imageUrl || "assets/images/logo/prizam.png",
          quantity: qty
        });
      }
    });

    const cleanCart = Array.from(map.values());
    if (cleanCart.length !== list.length) {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cleanCart));
    }
    return cleanCart;
  } catch (err) {
    console.error("Error reading cart from localStorage:", err);
    return [];
  }
}

/**
 * Persist cart array to localStorage and refresh badge
 * @param {Array<Object>} cart - Current cart array
 */
export function saveCart(cart) {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  } catch (err) {
    console.error("Error saving cart to localStorage:", err);
  }
  updateCartBadge();
}

/**
 * Add a product item to the cart or increment its quantity
 * Protected against multiple stacked event listeners
 * @param {Object} product - Product details (id, title, price, imageUrl)
 * @param {number} quantity - Units to add (defaults to 1)
 */
export function addToCart(product, quantity = 1) {
  if (!product || !product.id) return;

  const productId = String(product.id);
  const now = Date.now();

  // DEBOUNCE GUARD: Ignore duplicate triggers within 400ms
  if (lastAddedId === productId && (now - lastAddedTime) < 400) {
    return;
  }
  lastAddedId = productId;
  lastAddedTime = now;

  // Sanitize quantity (guards against MouseEvent objects being passed)
  const qtyToAdd = (typeof quantity === "number" && !isNaN(quantity) && quantity > 0)
    ? Math.floor(quantity)
    : 1;

  const cart = getCart();
  const existingIndex = cart.findIndex((item) => String(item.id) === productId);

  if (existingIndex > -1) {
    cart[existingIndex].quantity += qtyToAdd;
  } else {
    cart.push({
      id: product.id,
      title: product.title || "Architectural Drain",
      price: Number(product.price) || 0,
      imageUrl: product.imageUrl || "assets/images/logo/prizam.png",
      quantity: qtyToAdd
    });
  }

  saveCart(cart);

  if (typeof window.showToast === "function") {
    window.showToast(`Added "${product.title || 'Product'}" to your cart!`);
  }
}

/**
 * Update the quantity for an existing cart line item
 * @param {string|number} productId - Product ID
 * @param {number} newQuantity - Updated target count
 */
export function updateQuantity(productId, newQuantity) {
  let cart = getCart();

  if (newQuantity <= 0) {
    removeFromCart(productId);
    return;
  }

  const targetItem = cart.find((item) => String(item.id) === String(productId));
  if (targetItem) {
    targetItem.quantity = Math.floor(newQuantity);
    saveCart(cart);
  }
}

/**
 * Remove an item completely from the cart
 * @param {string|number} productId - Product ID
 */
export function removeFromCart(productId) {
  const cart = getCart().filter((item) => String(item.id) !== String(productId));
  saveCart(cart);
}

/**
 * Clear all cart contents
 */
export function clearCart() {
  saveCart([]);
}

/**
 * Calculate total price of all items currently in the cart
 * @returns {number} Subtotal in INR
 */
export function getCartSubtotal() {
  const cart = getCart();
  return cart.reduce((sum, item) => sum + (Number(item.price) || 0) * (Number(item.quantity) || 1), 0);
}

/**
 * Refresh count badge in the navigation bar
 */
export function updateCartBadge() {
  const cart = getCart();
  const totalCount = cart.reduce((acc, item) => acc + (Number(item.quantity) || 0), 0);
  const badgeElements = document.querySelectorAll("#cartCount, .cart-badge");

  badgeElements.forEach((badge) => {
    badge.textContent = totalCount;
    badge.classList.remove("cart-bump");
    void badge.offsetWidth; // Force DOM reflow for CSS animation
    badge.classList.add("cart-bump");
  });
}

// Window bindings for inline HTML handlers
if (typeof window !== "undefined") {
  window.addToCart = addToCart;
  window.updateCartBadge = updateCartBadge;
  window.getCart = getCart;
}

// Auto-sync badge counter on DOM ready
document.addEventListener("DOMContentLoaded", () => {
  updateCartBadge();
});