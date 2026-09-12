import { db } from "./firebase-config.js";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  addDoc,
  deleteDoc,
  query,
  orderBy
} from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";
import { seedProducts } from "./seed.js";

// DOM Elements
const productTableBody = document.getElementById("productTableBody");
const productModal = document.getElementById("productModal");
const openModalBtn = document.getElementById("openModalBtn");
const closeModalBtn = document.getElementById("closeModalBtn");
const cancelModalBtn = document.getElementById("cancelModalBtn");
const addProductForm = document.getElementById("addProductForm");
const seedDataBtn = document.getElementById("seedDataBtn");

// Modal Controls
if (openModalBtn) openModalBtn.addEventListener("click", () => productModal.classList.add("active"));
if (closeModalBtn) closeModalBtn.addEventListener("click", () => productModal.classList.remove("active"));
if (cancelModalBtn) cancelModalBtn.addEventListener("click", () => productModal.classList.remove("active"));

// Close modal when clicking outside overlay
if (productModal) {
  productModal.addEventListener("click", (e) => {
    if (e.target === productModal) productModal.classList.remove("active");
  });
}

// Live Toggle: updates isTopPick, isTopSeller, or isUpcoming immediately in Firestore
window.handleToggle = async function (id, fieldName, isChecked) {
  try {
    const docRef = doc(db, "products", id);
    await updateDoc(docRef, { [fieldName]: isChecked });
    console.log(`Product ${id} updated: ${fieldName} = ${isChecked}`);
  } catch (error) {
    console.error("Failed to update status:", error);
    alert("Could not update status. Check permissions or network connection.");
    await renderProductList(); // Revert toggle UI state on failure
  }
};

// Delete Product from Firestore
window.handleDelete = async function (id) {
  if (!confirm("Are you sure you want to delete this product? This action cannot be undone.")) return;
  try {
    await deleteDoc(doc(db, "products", id));
    await renderProductList();
  } catch (error) {
    console.error("Delete error:", error);
    alert("Could not delete product. Check Firebase rules.");
  }
};

// Fetch and Populate the Admin Table
export async function renderProductList() {
  if (!productTableBody) return;

  try {
    const q = query(collection(db, "products"), orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);
    productTableBody.innerHTML = "";

    if (querySnapshot.empty) {
      productTableBody.innerHTML = `
        <tr>
          <td colspan="7" style="text-align: center; padding: 2rem; color: var(--admin-muted);">
            No products found in catalog. Add your first product or click "Seed Starter Products".
          </td>
        </tr>
      `;
      return;
    }

    querySnapshot.forEach((docSnap) => {
      const data = docSnap.data();
      const id = docSnap.id;

      const row = document.createElement("tr");
      row.innerHTML = `
        <td>
          <div class="prod-cell">
            <img src="${data.imageUrl || 'https://via.placeholder.com/60'}" class="prod-thumb" alt="${data.title || 'Product'}" />
            <strong>${data.title || 'Untitled Product'}</strong>
          </div>
        </td>
        <td>${data.category || 'Drain'}</td>
        <td>₹${data.price ?? 0}</td>
        <td>
          <label class="switch">
            <input type="checkbox" ${data.isTopPick ? 'checked' : ''} onchange="handleToggle('${id}', 'isTopPick', this.checked)">
            <span class="slider"></span>
          </label>
        </td>
        <td>
          <label class="switch">
            <input type="checkbox" ${data.isTopSeller ? 'checked' : ''} onchange="handleToggle('${id}', 'isTopSeller', this.checked)">
            <span class="slider"></span>
          </label>
        </td>
        <td>
          <label class="switch">
            <input type="checkbox" ${data.isUpcoming ? 'checked' : ''} onchange="handleToggle('${id}', 'isUpcoming', this.checked)">
            <span class="slider"></span>
          </label>
        </td>
        <td>
          <button class="btn-delete" onclick="handleDelete('${id}')" title="Delete Product">
            <i class="fa-solid fa-trash"></i>
          </button>
        </td>
      `;
      productTableBody.appendChild(row);
    });
  } catch (err) {
    console.error("Error reading catalog:", err);
    productTableBody.innerHTML = `
      <tr>
        <td colspan="7" style="text-align: center; color: var(--admin-danger); padding: 2rem;">
          Failed to load products. Verify Firestore rules and config credentials.
        </td>
      </tr>
    `;
  }
}

// Quick Add Form Submission (from Admin Modal)
if (addProductForm) {
  addProductForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const submitBtn = addProductForm.querySelector('button[type="submit"]');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = "Saving...";
    }

    const newProduct = {
      title: document.getElementById("pTitle").value.trim(),
      price: Number(document.getElementById("pPrice").value),
      originalPrice: Number(document.getElementById("pOriginalPrice")?.value) || null,
      category: document.getElementById("pCategory").value,
      imageUrl: document.getElementById("pImageUrl").value.trim(),
      isTopPick: false,
      isTopSeller: false,
      isUpcoming: false,
      createdAt: new Date().toISOString()
    };

    try {
      await addDoc(collection(db, "products"), newProduct);
      addProductForm.reset();
      productModal.classList.remove("active");
      await renderProductList();
    } catch (error) {
      console.error("Error creating product:", error);
      alert("Failed to save product. Check console logs.");
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = "Save to Catalog";
      }
    }
  });
}

// Starter Data Seeder Button
if (seedDataBtn) {
  seedDataBtn.addEventListener("click", async () => {
    seedDataBtn.disabled = true;
    seedDataBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Seeding Catalog...`;

    try {
      const seeded = await seedProducts();
      alert(seeded ? "Sample products seeded successfully!" : "Products already exist in database.");
      await renderProductList();
    } catch (err) {
      console.error("Seed error:", err);
      alert("Failed to seed products. Verify Firebase API keys in assets/js/firebase-config.js.");
    } finally {
      seedDataBtn.disabled = false;
      seedDataBtn.innerHTML = `<i class="fa-solid fa-database"></i> Seed Starter Products`;
    }
  });
}

// Initial Load
document.addEventListener("DOMContentLoaded", renderProductList);