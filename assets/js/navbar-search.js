import { collection, onSnapshot } from "https://www.gstatic.com/firebasejs/12.18.0/firebase-firestore.js";
import { db } from "./firebase-config.js";

const searchForms = document.querySelectorAll(".navbar-search");

if (searchForms.length > 0) {
  const datalistId = "navbarProductSuggestions";
  let suggestionList = document.getElementById(datalistId);

  if (!suggestionList) {
    suggestionList = document.createElement("datalist");
    suggestionList.id = datalistId;
    document.body.appendChild(suggestionList);
  }

  searchForms.forEach((form) => {
    const input = form.querySelector('input[name="search"]');
    if (input) input.setAttribute("list", datalistId);
  });

  function updateSuggestions(products) {
    const suggestions = new Map();

    products
      .filter((product) => product.status !== "draft")
      .forEach((product) => {
        [product.title, product.category].filter(Boolean).forEach((value) => {
          const label = String(value).trim();
          if (label) suggestions.set(label.toLowerCase(), label);
        });
      });

    suggestionList.replaceChildren();
    Array.from(suggestions.values())
      .sort((first, second) => first.localeCompare(second))
      .forEach((label) => {
        const option = document.createElement("option");
        option.value = label;
        suggestionList.appendChild(option);
      });
  }

  try {
    const cachedProducts = JSON.parse(localStorage.getItem("prizam_local_catalog") || "[]");
    if (Array.isArray(cachedProducts)) updateSuggestions(cachedProducts);
  } catch (error) {
    // Firestore remains the source of truth when the cache is unavailable.
  }

  onSnapshot(collection(db, "products"), (snapshot) => {
    const products = snapshot.docs.map((productDoc) => ({
      id: productDoc.id,
      ...productDoc.data()
    }));
    updateSuggestions(products);
  }, () => {
    // Keep cached suggestions available when Firestore is offline.
  });
}
