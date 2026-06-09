// =========================
// PRODUCT DATABASE
// =========================

let products = JSON.parse(localStorage.getItem("products")) || [

{
id:1,
name:"Diamond Necklace",
price:75000,
stock:12,
category:"Necklaces",
image:"assets/hero.jpg",
description:"Luxury handcrafted necklace"
},

{
id:2,
name:"Gold Bracelet",
price:55000,
stock:8,
category:"Bracelets",
image:"assets/hero.jpg",
description:"Premium gold bracelet"
},

{
id:3,
name:"Luxury Earrings",
price:45000,
stock:15,
category:"Earrings",
image:"assets/hero.jpg",
description:"Elegant earrings"
}

];

// =========================
// CART
// =========================

let cart = JSON.parse(localStorage.getItem("cart")) || [];

let wishlist =
JSON.parse(localStorage.getItem("wishlist")) || [];

let orders =
JSON.parse(localStorage.getItem("orders")) || [];

let discount = 0;

// =========================
// SAVE DATA
// =========================

function saveProducts(){

localStorage.setItem(
"products",
JSON.stringify(products)
);

}

function saveCart(){

localStorage.setItem(
"cart",
JSON.stringify(cart)
);

}

function saveWishlist(){

localStorage.setItem(
"wishlist",
JSON.stringify(wishlist)
);

}

function saveOrders(){

localStorage.setItem(
"orders",
JSON.stringify(orders)
);

}

// =========================
// RENDER PRODUCTS
// =========================

function renderProducts(category = 'All', searchQuery = ''){

let grid = document.getElementById("product-grid");
if(!grid) return;

grid.innerHTML = "";

let filtered = products.filter(p => {
    let matchCat = category === 'All' || p.category === category;
    let matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
});

filtered.forEach(product => {

grid.innerHTML += `
<div class="product-card">
<div class="product-img-wrapper">
<img src="${product.image}" onclick="openProductModal(${product.id})" style="cursor:pointer;">
</div>
<div class="product-info">
<h3 class="product-name" onclick="openProductModal(${product.id})" style="cursor:pointer;">
${product.name}
</h3>
<div class="product-price">
₦${product.price.toLocaleString()}
</div>
<div class="product-buttons">
<button class="add-cart" onclick="addToCart(${product.id})">ADD TO BAG</button>
<button class="wishlist-btn" onclick="addToWishlist(${product.id})"><i class="ph ph-heart"></i></button>
</div>
</div>
</div>
`;
});
}

// =========================
// QUANTITY CONTROLS (GRID)
// =========================

function increaseQtyInput(id) {
    let el = document.getElementById(`qty-${id}`);
    let val = parseInt(el.innerText);
    let product = products.find(p => p.id === id);
    if(val < product.stock) el.innerText = val + 1;
}

function decreaseQtyInput(id) {
    let el = document.getElementById(`qty-${id}`);
    let val = parseInt(el.innerText);
    if(val > 1) el.innerText = val - 1;
}

// =========================
// CART LOGIC
// =========================

// =========================
// UI LOGIC
// =========================

function toggleMenu() {
    let menu = document.getElementById("nav-menu");
    if(menu) menu.classList.toggle("active");
}

function toggleCart() {
    let sidebar = document.getElementById("cart-sidebar");
    sidebar.classList.toggle("active");
    if(sidebar.classList.contains("active")) renderCart();
}

function addToCart(id) {
    let product = products.find(p => p.id === id);
    let qtyEl = document.getElementById(`qty-${id}`);
    let qty = qtyEl ? parseInt(qtyEl.innerText) : 1;
    
    let existing = cart.find(item => item.id === id);
    if(existing) {
        if(existing.qty + qty > product.stock) {
            alert("Cannot add more than stock");
            return;
        }
        existing.qty += qty;
    } else {
        cart.push({...product, qty});
    }
    
    saveCart();
    updateCartCount();
    renderCart();
    
    let el = document.getElementById(`qty-${id}`);
    if(el) el.innerText = "1";
}

function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    saveCart();
    updateCartCount();
    renderCart();
}

function renderCart() {
    let container = document.getElementById("cart-items");
    let totalEl = document.getElementById("cart-total");
    if(!container) return;
    
    container.innerHTML = "";
    let subtotal = 0;
    
    cart.forEach(item => {
        subtotal += item.price * item.qty;
        container.innerHTML += `
        <div class="cart-item">
            <img src="${item.image}" alt="${item.name}" class="cart-item-img">
            <div class="cart-item-details">
                <h4>${item.name}</h4>
                <p>₦${item.price.toLocaleString()}</p>
                <div class="cart-qty-row">
                    <div class="qty-controls cart-qty">
                        <button onclick="decreaseCartQty(${item.id})">-</button>
                        <span>${item.qty}</span>
                        <button onclick="increaseCartQty(${item.id})">+</button>
                    </div>
                    <button class="remove-btn" onclick="removeFromCart(${item.id})"><i class="ph ph-trash"></i></button>
                </div>
            </div>
        </div>
        `;
    });
    
    let finalTotal = subtotal - (subtotal * discount);
    
    if (discount > 0) {
        totalEl.innerHTML = `<del style="color:#888; font-size:14px; margin-right:5px;">₦${subtotal.toLocaleString()}</del> ₦${finalTotal.toLocaleString()}`;
    } else {
        totalEl.innerText = `₦${subtotal.toLocaleString()}`;
    }
}

function increaseCartQty(id) {
    let item = cart.find(i => i.id === id);
    let product = products.find(p => p.id === id);
    if(item && item.qty < product.stock) {
        item.qty++;
        saveCart();
        updateCartCount();
        renderCart();
    }
}

function decreaseCartQty(id) {
    let item = cart.find(i => i.id === id);
    if(item && item.qty > 1) {
        item.qty--;
        saveCart();
        updateCartCount();
        renderCart();
    }
}

function applyCoupon() {
    let code = document.getElementById("coupon").value.trim().toUpperCase();
    if (code === "DISCOUNT10") {
        discount = 0.10; // 10% discount
        alert("10% Discount Applied!");
    } else {
        discount = 0;
        alert("Invalid coupon code");
    }
    renderCart();
}

function updateCartCount() {
    let count = cart.reduce((sum, item) => sum + item.qty, 0);
    let el = document.getElementById("cart-count");
    if(el) el.innerText = count;
}

// =========================
// WISHLIST LOGIC
// =========================

function toggleWishlist() {
    let sidebar = document.getElementById("wishlist-sidebar");
    sidebar.classList.toggle("active");
    if(sidebar.classList.contains("active")) renderWishlist();
}

function addToWishlist(id) {
    let product = products.find(p => p.id === id);
    if(!wishlist.find(item => item.id === id)) {
        wishlist.push(product);
        saveWishlist();
        alert(`${product.name} added to wishlist!`);
    } else {
        alert("Already in wishlist");
    }
}

function removeFromWishlist(id) {
    wishlist = wishlist.filter(item => item.id !== id);
    saveWishlist();
    renderWishlist();
}

function renderWishlist() {
    let container = document.getElementById("wishlist-items");
    if(!container) return;
    
    container.innerHTML = "";
    wishlist.forEach(item => {
        container.innerHTML += `
        <div class="cart-item">
            <div>
                <h4>${item.name}</h4>
                <p>₦${item.price.toLocaleString()}</p>
            </div>
            <div style="display:flex; gap:10px; flex-direction:column;">
                <button onclick="removeFromWishlist(${item.id})">Remove</button>
                <button onclick="addToCart(${item.id})" style="background:#d4af37; color:black; border:none; padding:5px; cursor:pointer;">Add to Cart</button>
            </div>
        </div>
        `;
    });
}

// =========================
// MODAL LOGIC
// =========================

function openProductModal(id) {
    let product = products.find(p => p.id === id);
    if(!product) return;
    
    document.getElementById("modal-img").src = product.image;
    document.getElementById("modal-name").innerText = product.name;
    document.getElementById("modal-price").innerText = `₦${product.price.toLocaleString()}`;
    document.getElementById("modal-desc").innerText = product.description;
    document.getElementById("modal-stock").innerText = `Stock: ${product.stock}`;
    
    document.getElementById("modal-add-btn").onclick = () => {
        addToCart(product.id);
        closeProductModal();
    };
    
    document.getElementById("product-modal").classList.add("active");
}

function closeProductModal() {
    document.getElementById("product-modal").classList.remove("active");
}

// =========================
// FILTER & SEARCH LOGIC
// =========================

let currentCategory = 'All';

function filterCategory(e, cat) {
    currentCategory = cat;
    let buttons = document.querySelectorAll(".filter-btn");
    buttons.forEach(btn => btn.classList.remove("active"));
    if (e && e.target) {
        e.target.classList.add("active");
    }
    
    let searchVal = document.getElementById("search")?.value || '';
    renderProducts(currentCategory, searchVal);
}

document.getElementById("search")?.addEventListener("input", (e) => {
    renderProducts(currentCategory, e.target.value);
});

// Init
document.addEventListener("DOMContentLoaded", () => {
    if (!localStorage.getItem("products")) {
        saveProducts();
    }
    renderProducts();
    updateCartCount();
});