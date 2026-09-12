// assets/js/seed.js

import { db } from "./firebase-config.js";
import {
  collection,
  addDoc,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";

const sampleProducts = [
  {
    title: "Linear Shower Drain",
    category: "Bathroom Drains",
    material: "304 Stainless Steel",
    price: 2499,
    originalPrice: 3499,
    dimensions: "600mm x 70mm x 20mm",
    flowRate: "40 L/min",
    imageUrl: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=600&q=80",
    isTopPick: true,
    isTopSeller: true,
    isUpcoming: false,
    createdAt: new Date().toISOString()
  },
  {
    title: "Square Floor Drain",
    category: "Bathroom Drains",
    material: "304 Stainless Steel",
    price: 1299,
    originalPrice: 1600,
    dimensions: "150mm x 150mm x 25mm",
    flowRate: "30 L/min",
    imageUrl: "https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?auto=format&fit=crop&w=600&q=80",
    isTopPick: true,
    isTopSeller: true,
    isUpcoming: false,
    createdAt: new Date().toISOString()
  },
  {
    title: "Outdoor Channel Drain",
    category: "Outdoor Drains",
    material: "304 Stainless Steel",
    price: 3499,
    originalPrice: 4499,
    dimensions: "1000mm x 100mm x 80mm",
    flowRate: "55 L/min",
    imageUrl: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=80",
    isTopPick: true,
    isTopSeller: true,
    isUpcoming: false,
    createdAt: new Date().toISOString()
  },
  {
    title: "Kitchen Sink Drain Basket",
    category: "Kitchen Drains",
    material: "304 Stainless Steel",
    price: 899,
    originalPrice: 1199,
    dimensions: "114mm x 114mm",
    flowRate: "25 L/min",
    imageUrl: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=600&q=80",
    isTopPick: false,
    isTopSeller: true,
    isUpcoming: false,
    createdAt: new Date().toISOString()
  },
  {
    title: "Wall-Recessed Drain",
    category: "Bathroom Drains",
    material: "304 Stainless Steel",
    price: 4199,
    originalPrice: 5200,
    dimensions: "800mm x 50mm",
    flowRate: "45 L/min",
    imageUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80",
    isTopPick: false,
    isTopSeller: false,
    isUpcoming: true,
    createdAt: new Date().toISOString()
  },
  {
    title: "Designer Tile-Insert Drain",
    category: "Accessories",
    material: "Brass",
    price: 2099,
    originalPrice: 2699,
    dimensions: "200mm x 200mm",
    flowRate: "35 L/min",
    imageUrl: "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=600&q=80",
    isTopPick: true,
    isTopSeller: false,
    isUpcoming: true,
    createdAt: new Date().toISOString()
  }
];

/**
 * Inserts sample products into Firestore if the catalog is empty
 * @returns {Promise<boolean>} True if items were seeded, false if already populated
 */
export async function seedProducts() {
  const collectionRef = collection(db, "products");
  const existingDocs = await getDocs(collectionRef);

  if (!existingDocs.empty) {
    console.warn("Firestore already contains products. Seeding skipped.");
    return false;
  }

  for (const item of sampleProducts) {
    await addDoc(collectionRef, item);
    console.log(`Prizam seed: added ${item.title}`);
  }

  return true;
}