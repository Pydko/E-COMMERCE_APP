// ================= SLIDER =================
document.addEventListener("DOMContentLoaded", () => {
  const slider = document.querySelector(".slider");
  const slides = document.querySelectorAll(".slide");
  const total = slides.length;

  let index = 1; // first actual slide
  const INTERVAL_MS = 3000;

  // Add first and last clones for infinite loop effect
  const firstClone = slides[0].cloneNode(true);
  const lastClone = slides[total - 1].cloneNode(true);
  slider.appendChild(firstClone);
  slider.insertBefore(lastClone, slides[0]);

  const allSlides = document.querySelectorAll(".slide");
  const totalSlides = allSlides.length;

  // Initial position
  slider.style.transform = `translateX(-${index * 100}%)`;

  const go = () => {
    index++;
    slider.style.transition = "transform 0.6s ease-in-out";
    slider.style.transform = `translateX(-${index * 100}%)`;
  };

  // Check when transition ends to reset position without visible jump
  slider.addEventListener("transitionend", () => {
    if (index === totalSlides - 1) {
      slider.style.transition = "none";
      index = 1; // Reset to the actual first slide
      slider.style.transform = `translateX(-${index * 100}%)`;
    }
    if (index === 0) {
      slider.style.transition = "none";
      index = totalSlides - 2; // Reset to the actual last slide
      slider.style.transform = `translateX(-${index * 100}%)`;
    }
  });

  setInterval(go, INTERVAL_MS);
});


// ================= PRODUCT LISTING & FILTERING (BACKEND INTEGRATION) =================
const BASE_URL = "http://localhost:3000/server/main";

const categoryList = document.getElementById("category-list");
const subcategoryList = document.getElementById("subcategory-list");
const subcategoryTitle = document.getElementById("subcategory-title");
const subcategoryItems = document.getElementById("subcategory-items");
const backBtn = document.getElementById("back-btn");

const productList = document.getElementById("product-list");
const searchBar = document.getElementById("search-bar");

let allProducts = []; // Stores all products
let currentProducts = []; // Stores products filtered by active subcategory or search

// --- HELPER FUNCTIONS ---

// Email validation
function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
}

// Function to render products into HTML (Image Path Fixed!)
function renderProducts(list) {
  if (list.length === 0) {
    productList.innerHTML = '<p style="text-align:center; grid-column: 1 / -1;">No products found for this category/search.</p>';
    return;
  }

  productList.innerHTML = list.map(
    (p) => {
      // FIX: Use the first image path from the backend and prepend server address
      const imagePath = p.images && p.images.length > 0
        ? `http://localhost:3000${p.images[0]}`
        : './assets/images/placeholder.png'; // Fallback image path

      return `
        <div class="product-card" data-name="${p.title}" data-price="${p.price}" data-product-id="${p._id}">
          <img src="${imagePath}" alt="${p.title}" onerror="this.onerror=null;this.src='./assets/images/placeholder.png';">
          <h4>${p.title}</h4>
          <p class="price">${p.price}₺</p>
          <button class="add-card-btn">Add to Cart</button>
        </div>
      `;
    }
  ).join("");
}

// --- CORE FETCHING LOGIC ---

// 1. Fetch Categories and Populate Cards
async function fetchCategories() {
  try {
    const response = await fetch(`${BASE_URL}/categories`);
    const data = await response.json();

    // FIX: Populate static HTML cards with dynamic data
    const categoryCards = document.querySelectorAll(".category-list .card");
    categoryCards.forEach((card, index) => {
      if (data[index]) {
        // Write category name into the card
        card.textContent = data[index].name;
        // Add necessary data attributes
        card.setAttribute('data-id', data[index]._id);
        card.setAttribute('data-name', data[index].name);
      }
    });

  } catch (err) {
    console.error("Error fetching categories:", err);
  }
}

// 2. Fetch Subcategories and Display List
async function fetchSubCategories(categoryId, categoryName) {
  try {
    // Call backend with ID
    const response = await fetch(`${BASE_URL}/subcategories/${categoryId}`);
    const data = await response.json();

    // Populate subcategory list
    subcategoryItems.innerHTML = data.map(item =>
      `<div class="card" data-name="${item.name}">${item.name}</div>`
    ).join("");

    subcategoryTitle.textContent = categoryName + " Category";
    categoryList.style.display = "none";
    subcategoryList.classList.add("active");

  } catch (err) {
    console.error("Error fetching subcategories:", err);
  }
}

// 3. Fetch Products by Subcategory Name and Display
async function fetchProductsBySubCategory(subCategoryName) {
  try {
    // Call backend with name
    const response = await fetch(`${BASE_URL}/products/by-subcategory/${subCategoryName}`);
    currentProducts = await response.json();

    // Clear search bar
    searchBar.value = "";
    renderProducts(currentProducts);
  } catch (err) {
    console.error("Error fetching products by subcategory:", err);
  }
}

// 4. Fetch All Products and Display on Initial Load
async function fetchAllProducts() {
  try {
    const response = await fetch(`${BASE_URL}`);
    allProducts = await response.json();
    renderProducts(allProducts);
  } catch (err) {
    console.error("Error fetching all products:", err);
  }
}

// --- EVENT LISTENERS ---

// Main Category Click
document.addEventListener("DOMContentLoaded", () => {
  categoryList.addEventListener("click", (e) => {
    if (e.target.closest(".card")) {
      const card = e.target.closest(".card");
      const categoryId = card.getAttribute("data-id");
      const categoryName = card.getAttribute("data-name");

      if (categoryId && categoryName) {
        fetchSubCategories(categoryId, categoryName);

        // Clear product list when returning to category view
        productList.innerHTML = "";
        currentProducts = [];
        searchBar.value = "";
      }
    }
  });

  // Subcategory Click
  subcategoryItems.addEventListener("click", (e) => {
    if (e.target.classList.contains("card")) {
      const subcatName = e.target.getAttribute("data-name");
      if (subcatName) {
        fetchProductsBySubCategory(subcatName);
      }
    }
  });
});


// Back Button
backBtn.addEventListener("click", () => {
  subcategoryList.classList.remove("active");
  categoryList.style.display = "grid";

  // Clear products and reload all products when going back to main category view
  productList.innerHTML = "";
  currentProducts = [];
  searchBar.value = "";
  fetchAllProducts();
});


// Filter products as user types in search bar
searchBar.addEventListener("input", (e) => {
  const query = e.target.value.toLowerCase();

  // Decide which list to filter against
  const listToFilter = currentProducts.length > 0 ? currentProducts : allProducts;

  const filtered = listToFilter.filter(p =>
    p.title.toLowerCase().includes(query) || p.brand.toLowerCase().includes(query)
  );
  renderProducts(filtered);
});


// --- INITIALIZATION ---
document.addEventListener("DOMContentLoaded", () => {
  fetchCategories();
  fetchAllProducts();
});


// ================= CART =================
const cart = [];
const cartLnk = document.querySelector("#cart-link");

const cartModal = document.getElementById("cart-modal");
const closeBtnCart = document.querySelector(".close-btn-cart");
const cartItemsContainer = document.getElementById("cart-items");
const cartCount = document.getElementById("cart-count");
const cartTotal = document.getElementById("cart-total");

// Open cart modal
cartLnk.addEventListener("click", (e) => {
  e.preventDefault();
  renderCart();
  cartModal.style.display = "flex";
});

// Close cart modal
closeBtnCart.addEventListener("click", () => {
  cartModal.style.display = "none";
});

window.addEventListener("click", (e) => {
  if (e.target === cartModal) {
    cartModal.style.display = "none";
  }
});

// Add to cart (from product card button)
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("add-card-btn")) {
    const productCard = e.target.closest(".product-card");
    const id = productCard.getAttribute("data-product-id");

    // Find the product in the full list
    const product = allProducts.find(p => p._id === id);

    if (!product) return alert("Product information not found!");

    // If product already exists, increase quantity
    const existing = cart.find(item => item._id === id);
    if (existing) {
      existing.qty++;
    } else {
      // Add to cart, saving images field for display
      cart.push({
        _id: product._id,
        title: product.title,
        price: product.price,
        images: product.images,
        qty: 1
      });
    }

    updateCartCount();
    alert(`${product.title} added to cart!`);
  }
});

// Render cart content (Image Path Fixed!)
function renderCart() {
  if (cart.length === 0) {
    cartItemsContainer.innerHTML = "<p>Your cart is empty.</p>";
    cartTotal.textContent = "Total: 0₺";
    return;
  }

  let total = 0;
  cartItemsContainer.innerHTML = cart.map((item, index) => {
    const subTotal = item.price * item.qty;
    total += subTotal;

    // IMAGE PATH FIX:
    const imagePath = item.images && item.images.length > 0
      ? `http://localhost:3000${item.images[0]}`
      : './assets/images/placeholder.png';

    return `
      <div class="cart-item">
        <div style="display:flex; align-items:center;">
          <img src="${imagePath}" alt="${item.title}">
          <span>${item.title} (x${item.qty}) - ${item.price}₺</span>
        </div>
        <button class="remove-btn" data-index="${index}">Remove</button>
      </div>
    `;
  }).join("");

  cartTotal.textContent = `Total: ${total.toFixed(2)}₺`;
}

// Remove from cart
cartItemsContainer.addEventListener("click", (e) => {
  if (e.target.classList.contains("remove-btn")) {
    const index = e.target.dataset.index;
    cart.splice(index, 1);
    updateCartCount();
    renderCart();
  }
});

// Checkout
document.getElementById("checkout-btn").addEventListener("click", () => {
  if (cart.length === 0) {
    alert("Cart is empty, cannot checkout!");
  } else {
    alert("Checkout successful!");
    cart.length = 0; // clear cart
    updateCartCount();
    renderCart();
    cartModal.style.display = "none";
  }
});

// Update cart counter
function updateCartCount() {
  const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
  cartCount.textContent = totalQty;
}

// ================= PRODUCT DETAIL MODAL =================
const productModal = document.getElementById("product-modal");
const closeBtnProduct = document.querySelector(".close-btn-product");
const modalImg = document.getElementById("product-modal-img");
const modalName = document.getElementById("product-modal-name");
const modalPrice = document.getElementById("product-modal-price");
const modalDesc = document.getElementById("product-modal-desc");
const productAddCartBtn = document.getElementById("product-add-cart");

let selectedProduct = null;

// Open detail modal when product card is clicked
document.addEventListener("click", (e) => {
  if (e.target.closest(".product-card") && !e.target.classList.contains("add-card-btn")) {
    const card = e.target.closest(".product-card");
    const id = card.getAttribute("data-product-id");

    // Find the product in the allProducts list
    const product = allProducts.find(p => p._id === id);

    if (!product) return;

    selectedProduct = product;

    // IMAGE PATH FIX:
    const imagePath = product.images && product.images.length > 0
      ? `http://localhost:3000${product.images[0]}`
      : './assets/images/placeholder.png';

    modalImg.src = imagePath;
    modalName.textContent = selectedProduct.title;
    modalPrice.textContent = selectedProduct.price + "₺";
    modalDesc.textContent = "Detailed description about this product will be here."; // Using static text as desc field is not in DB

    productModal.style.display = "flex";
  }
});

// Close product modal
closeBtnProduct.addEventListener("click", () => {
  productModal.style.display = "none";
});

window.addEventListener("click", (e) => {
  if (e.target === productModal) {
    productModal.style.display = "none";
  }
});

// Add to cart from detail modal
productAddCartBtn.addEventListener("click", () => {
  if (!selectedProduct) return;
  const existing = cart.find(item => item._id === selectedProduct._id);

  if (existing) {
    existing.qty++;
  } else {
    // Add to cart, saving images field for display
    cart.push({
      _id: selectedProduct._id,
      title: selectedProduct.title,
      price: selectedProduct.price,
      images: selectedProduct.images,
      qty: 1
    });
  }
  updateCartCount();
  alert(`${selectedProduct.title} added to cart!`);
  productModal.style.display = "none";
});

// === Footer Newsletter Subscribe ===
document.addEventListener("DOMContentLoaded", () => {
  const subscribeBtn = document.querySelector(".footer-section button");
  const emailInput = document.querySelector(".footer-section input");

  if (subscribeBtn) {
    subscribeBtn.addEventListener("click", () => {
      const email = emailInput.value.trim();

      if (email === "") {
        alert("Please enter your email address.");
      } else if (!validateEmail(email)) {
        alert("Please enter a valid email address.");
      } else {
        alert(`Thank you! You have subscribed with ${email}.`);
        emailInput.value = "";
      }
    });
  }

  // Open social media links in a new tab
  document.querySelectorAll(".footer-section .social-links a").forEach(link => {
    link.setAttribute("target", "_blank");
    link.setAttribute("rel", "noopener noreferrer");
  });
});
