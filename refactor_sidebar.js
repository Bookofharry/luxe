const fs = require('fs');

const htmlFiles = [
    'about.html',
    'admin-dashboard.html',
    'admin.html',
    'contact.html',
    'index.html',
    'mission.html',
    'new-arrivals.html',
    'orders.html',
    'shop.html'
];

const mobileSidebarHTML = `
<!-- SIDEBAR OVERLAY -->
<div id="sidebar-overlay" onclick="closeAllSidebars()"></div>

<!-- MOBILE SIDEBAR -->
<div id="mobile-sidebar" class="sidebar">
    <div class="cart-header">
        <h3 style="font-family:'Cormorant Garamond',serif; font-size:32px; color:var(--color-brown); margin:0;">Menu</h3>
        <button onclick="toggleMenu()">
            <i class="ph ph-x" style="font-size: 20px;"></i>
        </button>
    </div>
    <div class="mobile-nav-links">
        <a href="index.html">Home</a>
        <a href="shop.html">Shop</a>
        <a href="new-arrivals.html">New Arrivals</a>
        <a href="orders.html">Orders</a>
        <a href="about.html">About</a>
        <a href="contact.html">Contact</a>
    </div>
</div>

</body>`;

// 1. Update HTML
for (let file of htmlFiles) {
    if (fs.existsSync(file)) {
        let content = fs.readFileSync(file, 'utf8');
        if (!content.includes('id="sidebar-overlay"')) {
            content = content.replace('</body>', mobileSidebarHTML);
            fs.writeFileSync(file, content, 'utf8');
        }
    }
}
console.log('HTML files updated.');

// 2. Update CSS
let css = fs.readFileSync('style.css', 'utf8');

const regexOldNavUl = /nav ul\{\s*display: flex;\s*flex-direction: column;\s*position: fixed;\s*top: 0;\s*left: 0;\s*transform: translateX\(calc\(-100% - 45px\)\);\s*width: 400px;\s*max-width: 100%;\s*height: 100vh;\s*background: var\(--color-off-white\);\s*z-index: 900;\s*transition: transform 0\.4s cubic-bezier\(0\.77, 0, 0\.175, 1\);\s*padding: 140px 30px 30px 30px;\s*text-align: left;\s*gap: 25px;\s*border-top: none;\s*box-shadow: 10px 0 30px rgba\(0,0,0,0\.8\);\s*margin: 0;\s*\}\s*nav ul\.active\{\s*transform: translateX\(0\);\s*\}/g;

const newNavUl = `nav ul {
display: none;
}`;

css = css.replace(regexOldNavUl, newNavUl);

const overlayStyles = `
/* OVERLAY & MOBILE SIDEBAR */
#sidebar-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.6);
    z-index: 1500;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.3s;
}
#sidebar-overlay.active {
    opacity: 1;
    pointer-events: auto;
}

#mobile-sidebar {
    position: fixed;
    left: 0;
    transform: translateX(calc(-100% - 45px));
    top: 0;
    width: 400px;
    max-width: 100%;
    height: 100vh;
    background: var(--color-off-white);
    transition: transform 0.4s cubic-bezier(0.77, 0, 0.175, 1);
    z-index: 2000;
    box-shadow: 10px 0 30px rgba(0,0,0,0.8);
    display: flex;
    flex-direction: column;
}

#mobile-sidebar.active {
    transform: translateX(0);
}

.mobile-nav-links {
    padding: 30px;
    display: flex;
    flex-direction: column;
    gap: 25px;
}
.mobile-nav-links a {
    font-size: 20px;
    color: var(--color-dark-brown);
    text-decoration: none;
    transition: 0.3s;
}
.mobile-nav-links a:hover {
    color: var(--color-brown);
}
`;

if (!css.includes('#sidebar-overlay {')) {
    css += '\\n' + overlayStyles;
}

fs.writeFileSync('style.css', css, 'utf8');
console.log('CSS updated.');

// 3. Update app.js
let appJs = fs.readFileSync('app.js', 'utf8');

// Replace toggleMenu
appJs = appJs.replace(
`function toggleMenu() {
    let menu = document.getElementById("nav-menu");
    if(menu) menu.classList.toggle("active");
}`,
`function toggleMenu() {
    let menu = document.getElementById("mobile-sidebar");
    if(menu) menu.classList.toggle("active");
    updateOverlay();
}`);

// Replace toggleCart
appJs = appJs.replace(
`function toggleCart() {
    let sidebar = document.getElementById("cart-sidebar");
    sidebar.classList.toggle("active");
    if(sidebar.classList.contains("active")) renderCart();
}`,
`function toggleCart() {
    let sidebar = document.getElementById("cart-sidebar");
    if(sidebar) sidebar.classList.toggle("active");
    if(sidebar && sidebar.classList.contains("active")) renderCart();
    updateOverlay();
}`);

// Replace toggleWishlist
appJs = appJs.replace(
`function toggleWishlist() {
    let sidebar = document.getElementById("wishlist-sidebar");
    sidebar.classList.toggle("active");
    if(sidebar.classList.contains("active")) renderWishlist();
}`,
`function toggleWishlist() {
    let sidebar = document.getElementById("wishlist-sidebar");
    if(sidebar) sidebar.classList.toggle("active");
    if(sidebar && sidebar.classList.contains("active")) renderWishlist();
    updateOverlay();
}`);

const overlayLogic = `
function closeAllSidebars() {
    let mobile = document.getElementById("mobile-sidebar");
    let cart = document.getElementById("cart-sidebar");
    let wish = document.getElementById("wishlist-sidebar");
    if (mobile) mobile.classList.remove("active");
    if (cart) cart.classList.remove("active");
    if (wish) wish.classList.remove("active");
    updateOverlay();
}

function updateOverlay() {
    let overlay = document.getElementById("sidebar-overlay");
    if (!overlay) return;
    const isAnyActive = document.querySelector('#mobile-sidebar.active, #cart-sidebar.active, #wishlist-sidebar.active');
    if (isAnyActive) {
        overlay.classList.add("active");
    } else {
        overlay.classList.remove("active");
    }
}
`;

if (!appJs.includes('function closeAllSidebars()')) {
    appJs += '\\n' + overlayLogic;
}

fs.writeFileSync('app.js', appJs, 'utf8');
console.log('App.js updated.');
