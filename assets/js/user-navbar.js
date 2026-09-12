// // Save as assets/js/user-navbar.js

// function injectUniversalUserNavbar(currentPage = 'home') {
//   // Automatically inject the required mobile drawer and toggle button CSS
//   if (!document.getElementById("universalNavbarStyles")) {
//     const styleEl = document.createElement("style");
//     styleEl.id = "universalNavbarStyles";
//     styleEl.textContent = `
//       .mobile-menu-toggle {
//         display: flex;
//         align-items: center;
//         justify-content: center;
//         background: none;
//         border: none;
//         font-size: 1.25rem;
//         color: var(--primary, #121212);
//         cursor: pointer;
//         padding: 0.4rem;
//         z-index: 1001;
//       }
//       @media (min-width: 900px) {
//         .mobile-menu-toggle {
//           display: none !important;
//         }
//       }
//       .nav-links {
//         position: fixed;
//         top: 0;
//         left: 0;
//         width: 80%;
//         max-width: 300px;
//         height: 100vh;
//         background: #ffffff;
//         flex-direction: column;
//         padding: 5rem 2rem 2rem;
//         gap: 1.5rem;
//         box-shadow: 10px 0 30px rgba(0, 0, 0, 0.15);
//         transform: translateX(-100%);
//         transition: transform 0.4s cubic-bezier(0.25, 1, 0.5, 1);
//         z-index: 999;
//         display: flex;
//         border-top-right-radius: 24px;
//         border-bottom-right-radius: 24px;
//       }
//       .nav-links.active {
//         transform: translateX(0);
//       }
//       @media (min-width: 900px) {
//         .nav-links {
//           position: static !important;
//           height: auto !important;
//           width: auto !important;
//           max-width: none !important;
//           background: transparent !important;
//           flex-direction: row !important;
//           padding: 0 !important;
//           box-shadow: none !important;
//           transform: none !important;
//           gap: 2rem !important;
//           border-radius: 0 !important;
//         }
//       }
//     `;
//     document.head.appendChild(styleEl);
//   }

//   const navbarHTML = `
//     <header class="navbar">
//       <div class="nav-container">
//         <button class="mobile-menu-toggle" id="mobileMenuBtn" aria-label="Toggle Mobile Menu">
//           <i class="fa-solid fa-bars" id="menuIcon"></i>
//         </button>

//         <a href="index.html" class="logo">
//           <span class="logo-mark">●</span> Prizam
//         </a>

//         <nav class="nav-links" id="navLinksMenu">
//           <a href="index.html" class="${currentPage === 'home' ? 'active' : ''}">Home</a>
//           <a href="shop.html" class="${currentPage === 'shop' ? 'active' : ''}">Products</a>
//           <a href="index.html#top-picks">Top Picks</a>
//           <a href="blog.html" class="${currentPage === 'blog' ? 'active' : ''}">Blog</a>
//           <a href="contact.html" class="${currentPage === 'contact' ? 'active' : ''}">Contact</a>
//         </nav>

//         <div class="nav-actions">
//           <a href="shop.html" class="icon-btn" aria-label="Search"><i class="fa-solid fa-magnifying-glass"></i></a>
//           <a href="cart.html" class="icon-btn cart-badge-wrapper" aria-label="Cart">
//             <i class="fa-solid fa-bag-shopping"></i>
//             <span class="cart-badge" id="cartCount">0</span>
//           </a>
//           <a href="admin/index.html" class="icon-btn" title="Admin Portal"><i class="fa-solid fa-gear"></i></a>
//         </div>
//       </div>
//     </header>
//   `;

//   document.body.insertAdjacentHTML("afterbegin", navbarHTML);

//   // Mobile Hamburger Toggle Logic (Left-Side Drawer with Rounded Right Corners)
//   const mobileMenuBtn = document.getElementById("mobileMenuBtn");
//   const navLinksMenu = document.getElementById("navLinksMenu");
//   const menuIcon = document.getElementById("menuIcon");

//   if (mobileMenuBtn && navLinksMenu) {
//     mobileMenuBtn.addEventListener("click", () => {
//       navLinksMenu.classList.toggle("active");
//       if (navLinksMenu.classList.contains("active")) {
//         menuIcon.className = "fa-solid fa-xmark";
//       } else {
//         menuIcon.className = "fa-solid fa-bars";
//       }
//     });
//   }

//   updateCartBadgeCount();
// }

// function updateCartBadgeCount() {
//   try {
//     const raw = localStorage.getItem("prizam_cart");
//     const cart = raw ? JSON.parse(raw) : [];
//     const count = cart.reduce((tot, item) => tot + (Number(item.quantity) || 1), 0);
//     const badge = document.getElementById("cartCount");
//     if (badge) badge.textContent = count;
//   } catch (e) {}
// }