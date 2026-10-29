// products are found here, its a lot easier than putting the info in html.
const products = [
  { id: 1, name: "Headphones",        price: 300.00, image: "images/Headphones.jpg",    description: "Over-ear wireless headphones with deep bass." },
  { id: 2, name: "Band KeyChain",     price: 60.00,  image: "images/Korn-Keychain.jpg", description: "Metalic keychain of a band." },
  { id: 3, name: "Red Lava Lamp",     price: 350.00, image: "images/Lava-Lamp.jpg",     description: "17 Inch Red Lava Lamp." },
  { id: 4, name: "Power Bank",        price: 220.00, image: "images/Power-Bank.jpg",    description: "10 000mAh portable charger with two ports." },
  { id: 5, name: "Bluetooth Speaker", price: 300.00, image: "images/JBL.jpg",           description: "Waterproof speaker with 12 hours of battery." },
  { id: 6, name: "Wireless Mouse",    price: 150.00, image: "images/Wireless-Mouse.jpg",description: "Quiet-click mouse for work or gaming." },
  { id: 7, name: "LED Desk Lamp",     price: 190.00, image: "images/Desk-Lamp.jpg",     description: "Dimmable lamp with three colour modes." },
  { id: 8, name: "Phone Case",        price: 60.00,  image: "images/Phone-Case.jpg",    description: "Shockproof silicone iPhone case, matte black." }
];

const CART_ICON = "images/Cart-Icon.png";

// allowing items added to the cart to be saved in user's localStorage so it survives page changes
function getCart() {
  return JSON.parse(localStorage.getItem("swiftmartCart")) || [];
}
function saveCart(cart) {
  localStorage.setItem("swiftmartCart", JSON.stringify(cart));
  updateCartCount();
}
function formatPrice(amount) {
  return "R" + amount.toFixed(2);
}
function addToCart(productId) {
  const cart = getCart();
  const existing = cart.find(item => item.id === productId);
  if (existing) {
    existing.quantity++;
  } else {
    cart.push({ id: productId, quantity: 1 });
  }
  saveCart(cart);
}
// shows the total of items added to cart
function updateCartCount() {
  const total = getCart().reduce((sum, item) => sum + item.quantity, 0);
  const badge = document.getElementById("cart-count");
  if (badge) badge.textContent = total;
}

// PRODUCTS PAGE: built card for each product
function renderProducts() {
  const grid = document.getElementById("product-grid");
  if (!grid) return;
  products.forEach(product => {
    const card = document.createElement("article");
    card.className = "product-card";
    card.innerHTML = `
      <span class="price">${formatPrice(product.price)}</span>
      <img src="${product.image}" alt="${product.name}">
      <h3>${product.name}</h3>
      <p>${product.description}</p>
      <div class="card-bottom">
        <span>Add to cart</span>
        <button class="add-btn" aria-label="Add ${product.name} to cart" data-id="${product.id}">
          <img src="${CART_ICON}" alt="">
        </button>
      </div>`;
    grid.appendChild(card);
  });
  // one click!!
  grid.addEventListener("click", event => {
    const button = event.target.closest(".add-btn");
    if (!button) return;
    addToCart(Number(button.dataset.id));
    const message = document.getElementById("added-message");
    message.textContent = "Added to cart!";
    setTimeout(() => (message.textContent = ""), 1500);
  });
}

// SLIDESHOW for HOMEPAGE
function startSlideshow() {
  const show = document.getElementById("slideshow");
  if (!show) return;
  let current = 0;
  const image = document.getElementById("slide-image");
  const name = document.getElementById("slide-name");

  function showSlide(index) {
    current = (index + products.length) % products.length;
    image.src = products[current].image;
    image.alt = products[current].name;
    name.textContent = products[current].name + " - " + formatPrice(products[current].price);
  }
  document.getElementById("prev-slide").addEventListener("click", () => showSlide(current - 1));
  document.getElementById("next-slide").addEventListener("click", () => showSlide(current + 1));
  showSlide(0);
  setInterval(() => showSlide(current + 1), 4000);
}

// CHECKOUT PAGE
function renderCart() {
  const list = document.getElementById("cart-items");
  if (!list) return;
  const cart = getCart();
  list.innerHTML = "";
  let totalItems = 0;
  let totalCost = 0;

  if (cart.length === 0) {
    list.innerHTML = "<p>Your cart is empty. <a href='products.html'>Browse our products</a>.</p>";
  }
  cart.forEach(item => {
    const product = products.find(p => p.id === item.id);
    totalItems += item.quantity;
    totalCost += product.price * item.quantity;
    const row = document.createElement("div");
    row.className = "cart-row";
    row.innerHTML = `
      <img src="${product.image}" alt="${product.name}">
      <div><strong>${product.name}</strong><br>${formatPrice(product.price)} each</div>
      <div class="qty">
        <button data-action="minus" data-id="${product.id}" aria-label="Decrease quantity">-</button>
        <span> ${item.quantity} </span>
        <button data-action="plus" data-id="${product.id}" aria-label="Increase quantity">+</button>
      </div>
      <button class="remove-btn" data-action="remove" data-id="${product.id}">Remove</button>`;
    list.appendChild(row);
  });
  document.getElementById("summary-items").textContent = totalItems;
  document.getElementById("summary-total").textContent = formatPrice(totalCost);
}

function setupCartButtons() {
  const list = document.getElementById("cart-items");
  if (!list) return;
  list.addEventListener("click", event => {
    const button = event.target.closest("button");
    if (!button) return;
    const id = Number(button.dataset.id);
    let cart = getCart();
    const item = cart.find(i => i.id === id);
    if (button.dataset.action === "plus") item.quantity++;
    if (button.dataset.action === "minus") item.quantity--;
    if (button.dataset.action === "remove") item.quantity = 0;
    cart = cart.filter(i => i.quantity > 0);
    saveCart(cart);
    renderCart();
  });
}

function showError(input, message) {
  input.classList.add("invalid");
  input.parentElement.querySelector(".error").textContent = message;
}
function clearError(input) {
  input.classList.remove("invalid");
  input.parentElement.querySelector(".error").textContent = "";
}
function validateForm(form) {
  let isValid = true;
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  form.querySelectorAll("input, textarea").forEach(field => {
    clearError(field);
    const value = field.value.trim();
    if (value === "") {
      showError(field, "This field is required.");
      isValid = false;
    } else if (field.type === "email" && !emailPattern.test(value)) {
      showError(field, "Enter a valid email, like name@example.com.");
      isValid = false;
    }
  });
  return isValid;
}

function setupContactForm() {
  const form = document.getElementById("contact-form");
  if (!form) return;
  form.addEventListener("submit", event => {
    event.preventDefault();
    if (validateForm(form)) {
      document.getElementById("form-success").textContent = "Thanks! Your message has been sent. We'll reply soon.";
      form.reset();
    } else {
      document.getElementById("form-success").textContent = "";
    }
  });
}

function setupOrderForm() {
  const form = document.getElementById("order-form");
  if (!form) return;
  form.addEventListener("submit", event => {
    event.preventDefault();
    const success = document.getElementById("order-success");
    if (getCart().length === 0) {
      success.textContent = "Add at least one product before placing an order.";
      return;
    }
    if (validateForm(form)) {
      saveCart([]);
      renderCart();
      form.reset();
      success.textContent = "Order placed! Thank you for shopping with SwiftMart.";
    } else {
      success.textContent = "";
    }
  });
}

// run everything when the page has loaded
document.addEventListener("DOMContentLoaded", () => {
  updateCartCount();
  renderProducts();
  startSlideshow();
  renderCart();
  setupCartButtons();
  setupContactForm();
  setupOrderForm();
});
