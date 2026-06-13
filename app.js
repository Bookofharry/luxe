// =========================
// PRODUCT DATABASE
// =========================

function safeGetLocalStorage(key, defaultValue) {
    try {
        let val = localStorage.getItem(key);
        return val ? JSON.parse(val) : defaultValue;
    } catch (e) {
        console.error("LocalStorage read failed", e);
        return defaultValue;
    }
}

function safeSetLocalStorage(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
        console.error("LocalStorage write failed", e);
        if (typeof showNotification === "function") {
            showNotification("Unable to save data. Storage might be full or disabled.", "Storage Error", "error");
        }
    }
}

let defaultProducts = [
{ id:1, name:"Diamond Necklace", price:75000, stock:12, category:"Necklaces", image:"assets/hero.jpg", description:"Luxury handcrafted necklace", isNew: true },
{ id:2, name:"Gold Bracelet", price:55000, stock:8, category:"Bracelets", image:"assets/hero.jpg", description:"Premium gold bracelet", isNew: false },
{ id:3, name:"Luxury Earrings", price:45000, stock:15, category:"Earrings", image:"assets/hero.jpg", description:"Elegant earrings", isNew: true },
{ id:4, name:"Sapphire Ring", price:90000, stock:5, category:"Rings", image:"assets/hero.jpg", description:"Stunning sapphire ring", isNew: false },
{ id:5, name:"Pearl Choker", price:60000, stock:10, category:"Necklaces", image:"assets/hero.jpg", description:"Classic pearl choker", isNew: false },
{ id:6, name:"Silver Bangle", price:30000, stock:20, category:"Bracelets", image:"assets/hero.jpg", description:"Minimalist silver bangle", isNew: false },
{ id:7, name:"Ruby Studs", price:85000, stock:7, category:"Earrings", image:"assets/hero.jpg", description:"Vibrant ruby stud earrings", isNew: true },
{ id:8, name:"Emerald Cut Ring", price:120000, stock:3, category:"Rings", image:"assets/hero.jpg", description:"Breathtaking emerald cut ring", isNew: false },
{ id:9, name:"Gold Chain", price:40000, stock:25, category:"Necklaces", image:"assets/hero.jpg", description:"Everyday gold chain", isNew: false },
{ id:10, name:"Charm Bracelet", price:35000, stock:14, category:"Bracelets", image:"assets/hero.jpg", description:"Customizable charm bracelet", isNew: true },
{ id:11, name:"Hoop Earrings", price:25000, stock:30, category:"Earrings", image:"assets/hero.jpg", description:"Classic gold hoops", isNew: false },
{ id:12, name:"Diamond Band", price:150000, stock:4, category:"Rings", image:"assets/hero.jpg", description:"Eternity diamond band", isNew: false },
{ id:13, name:"Pendant Necklace", price:50000, stock:11, category:"Necklaces", image:"assets/hero.jpg", description:"Delicate pendant necklace", isNew: false },
{ id:14, name:"Tennis Bracelet", price:110000, stock:6, category:"Bracelets", image:"assets/hero.jpg", description:"Sparkling diamond tennis bracelet", isNew: true },
{ id:15, name:"Drop Earrings", price:55000, stock:9, category:"Earrings", image:"assets/hero.jpg", description:"Elegant teardrop earrings", isNew: false },
{ id:16, name:"Vintage Ring", price:80000, stock:2, category:"Rings", image:"assets/hero.jpg", description:"Antique style gold ring", isNew: false },
{ id:17, name:"Layered Necklace", price:65000, stock:8, category:"Necklaces", image:"assets/hero.jpg", description:"Modern layered necklace", isNew: false },
{ id:18, name:"Cuff Bracelet", price:45000, stock:12, category:"Bracelets", image:"assets/hero.jpg", description:"Bold gold cuff bracelet", isNew: false },
{ id:19, name:"Chandelier Earrings", price:95000, stock:5, category:"Earrings", image:"assets/hero.jpg", description:"Statement chandelier earrings", isNew: true },
{ id:20, name:"Signet Ring", price:70000, stock:7, category:"Rings", image:"assets/hero.jpg", description:"Engravable gold signet ring", isNew: false }
];

let storedProducts = safeGetLocalStorage("products", null);
if (!storedProducts || storedProducts.length < defaultProducts.length) {
    products = defaultProducts;
    // We don't save to localStorage immediately to avoid overwriting admin changes completely,
    // but we use the default list so they see the 20 items.
} else {
    products = storedProducts.map(p => {
        let def = defaultProducts.find(d => d.id === p.id);
        if (def && typeof p.isNew === 'undefined') p.isNew = def.isNew;
        return p;
    });
}

// =========================
// CART
// =========================

let cart = safeGetLocalStorage("cart", []);

let wishlist = safeGetLocalStorage("wishlist", []);

let orders = safeGetLocalStorage("orders", []);

let discount = 0;

// =========================
// SAVE DATA
// =========================

function saveProducts(){
    safeSetLocalStorage("products", products);
}

function saveCart(){
    safeSetLocalStorage("cart", cart);
}

function saveWishlist(){
    safeSetLocalStorage("wishlist", wishlist);
}

function saveOrders(){
    safeSetLocalStorage("orders", orders);
}

// =========================
// RENDER PRODUCTS
// =========================

function renderProducts(category = 'All', searchQuery = ''){

let grid = document.getElementById("product-grid") || document.getElementById("new-arrivals-grid");
if(!grid) return;

let isNewArrivalsPage = grid.id === "new-arrivals-grid";

grid.innerHTML = "";

let filtered = products.filter(p => {
    let matchCat = category === 'All' || p.category === category;
    let matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    let matchNew = !isNewArrivalsPage || p.isNew === true;
    return matchCat && matchSearch && matchNew;
});

let htmlString = filtered.map(product => `
<div class="product-card">
<div class="product-img-wrapper">
${product.isNew ? '<span class="badge-new">NEW</span>' : ''}
<img 
    src="${product.image}" 
    alt="${product.name}" 
    width="400" 
    height="350" 
    loading="lazy"
    tabindex="0"
    onclick="openProductModal(${product.id})" 
    onkeydown="if(event.key==='Enter') openProductModal(${product.id})"
    style="cursor:pointer;">
</div>
<div class="product-info">
<h3 
    class="product-name" 
    tabindex="0"
    onclick="openProductModal(${product.id})" 
    onkeydown="if(event.key==='Enter') openProductModal(${product.id})"
    style="cursor:pointer;">
${product.name}
</h3>
<div class="product-price">
₦${product.price.toLocaleString()}
</div>
<div class="product-buttons">
<button class="add-cart" aria-label="Add ${product.name} to bag" onclick="addToCart(${product.id})">ADD TO BAG</button>
<button class="wishlist-btn" aria-label="Add ${product.name} to wishlist" onclick="addToWishlist(${product.id})"><i class="ph ph-heart"></i></button>
</div>
</div>
</div>
`).join('');

grid.innerHTML = htmlString;
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
            showNotification("Cannot add more than stock", "Stock Limit", "error");
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
        showNotification("10% Discount Applied!", "Success", "success");
    } else {
        discount = 0;
        showNotification("Invalid coupon code", "Error", "error");
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
        showNotification(`${product.name} added to wishlist!`, "Wishlist", "success");
    } else {
        showNotification("Already in wishlist", "Notice", "info");
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

function showNotification(message, title = "Notice", type = "info") {
    document.getElementById("notification-message").innerText = message;
    document.getElementById("notification-title").innerText = title;
    
    let icon = document.getElementById("notification-icon");
    if(type === "success") {
        icon.className = "ph-fill ph-check-circle";
        icon.style.color = "#d4af37"; 
    } else if (type === "error") {
        icon.className = "ph-fill ph-warning-circle";
        icon.style.color = "#ff4b4b";
    } else {
        icon.className = "ph-fill ph-info";
        icon.style.color = "#d4af37";
    }
    
    let btnContainer = document.getElementById("notification-btn-container");
    btnContainer.innerHTML = `<button class="gold-btn" onclick="closeNotification()" style="width: 100%;">OK</button>`;
    
    document.getElementById("notification-modal").classList.add("active");
}

function showConfirm(message, title, onConfirm) {
    document.getElementById("notification-message").innerText = message;
    document.getElementById("notification-title").innerText = title;
    
    let icon = document.getElementById("notification-icon");
    icon.className = "ph-fill ph-question";
    icon.style.color = "#d4af37";
    
    let btnContainer = document.getElementById("notification-btn-container");
    btnContainer.innerHTML = `
        <button class="outline-btn" onclick="closeNotification()" style="flex:1;">Cancel</button>
        <button class="gold-btn" id="confirm-yes-btn" style="flex:1;">Yes</button>
    `;
    
    document.getElementById("confirm-yes-btn").onclick = () => {
        closeNotification();
        if(onConfirm) onConfirm();
    };
    
    document.getElementById("notification-modal").classList.add("active");
}

function closeNotification() {
    document.getElementById("notification-modal").classList.remove("active");
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