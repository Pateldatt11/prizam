// Save as admin/assets/js/admin-sidebar.js

function injectUniversalAdminSidebar(currentPage) {
  const sidebarHTML = `
    <aside class="admin-sidebar">
      <div class="sidebar-brand">
        <span>●</span> Prizam Admin
      </div>

      <ul class="sidebar-menu">
        <div class="menu-heading">Storefront Catalog</div>
        <li>
          <a href="index.html" class="sidebar-link ${currentPage === 'products' ? 'active' : ''}">
            <i class="fa-solid fa-boxes-stacked"></i> Products
          </a>
        </li>
        <li>
          <a href="index.html" class="sidebar-link ${currentPage === 'publish' ? 'active' : ''}">
            <i class="fa-solid fa-circle-check"></i> Publish
          </a>
        </li>
        <li>
          <a href="index.html" class="sidebar-link ${currentPage === 'draft' ? 'active' : ''}">
            <i class="fa-solid fa-file-lines"></i> Draft
          </a>
        </li>
        <li>
          <a href="add-product.html" class="sidebar-link ${currentPage === 'add-product' ? 'active' : ''}">
            <i class="fa-solid fa-plus-circle"></i> Add New Product
          </a>
        </li>

        <div class="menu-heading">Management & Sales</div>
        <li>
          <a href="orders.html" class="sidebar-link ${currentPage === 'orders' ? 'active' : ''}">
            <i class="fa-solid fa-truck-ramp-box"></i> Orders
            <span class="badge-count" id="sidebarOrdersBadge">0</span>
          </a>
        </li>
        <li>
          <a href="returns.html" class="sidebar-link ${currentPage === 'returns' ? 'active' : ''}">
            <i class="fa-solid fa-rotate-left"></i> Returns
          </a>
        </li>
        <li>
          <a href="inquiries.html" class="sidebar-link ${currentPage === 'inquiries' ? 'active' : ''}">
            <i class="fa-solid fa-envelope-open-text"></i> Contact Request
          </a>
        </li>
        <li>
          <a href="analytics.html" class="sidebar-link ${currentPage === 'analytics' ? 'active' : ''}">
            <i class="fa-solid fa-chart-pie"></i> Store Analysis
          </a>
        </li>
        <li>
          <a href="settings.html" class="sidebar-link ${currentPage === 'settings' ? 'active' : ''}">
            <i class="fa-solid fa-gears"></i> System Maintenance
          </a>
        </li>

        <div class="menu-heading">Live Preview</div>
        <li>
          <a href="../index.html" target="_blank" class="sidebar-link">
            <i class="fa-solid fa-arrow-up-right-from-square"></i> Live Preview
          </a>
        </li>
      </ul>

      <div class="sidebar-footer">
        <div class="admin-profile">
          <div class="avatar-circle">AD</div>
          <div class="profile-info">
            <div class="profile-name">Administrator</div>
            <div class="profile-role">admin@prizam.com</div>
          </div>
        </div>
        <button class="btn-logout" id="globalLogoutBtn" title="Sign out">
          <i class="fa-solid fa-arrow-right-from-bracket"></i>
        </button>
      </div>
    </aside>
  `;

  document.body.insertAdjacentHTML("afterbegin", sidebarHTML);

  document.getElementById("globalLogoutBtn").addEventListener("click", () => {
    localStorage.removeItem("prizam_admin_logged_in");
    window.location.href = "login.html";
  });

  try {
    const orders = JSON.parse(localStorage.getItem("prizam_local_orders")) || [];
    const badge = document.getElementById("sidebarOrdersBadge");
    if (badge) badge.textContent = orders.length;
  } catch (e) {}
}