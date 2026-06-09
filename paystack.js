// =====================================
// PAYSTACK MOCK CHECKOUT
// =====================================

function payWithPaystack() {
    if(cart.length === 0) {
        showNotification("Your cart is empty", "Error", "error");
        return;
    }

    let email = document.getElementById("customer-email").value;
    if(!email) {
        showNotification("Please enter your email address", "Missing Info", "error");
        return;
    }

    let phone = document.getElementById("customer-phone")?.value.trim();
    let ngPhoneRegex = /^(\+234|0)[789][01]\d{8}$/;
    
    if(!phone || !ngPhoneRegex.test(phone)) {
        showNotification("Please enter a valid Nigerian phone number (e.g. 08012345678)", "Missing Info", "error");
        return;
    }

    let total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
    total = total - (total * discount);

    // Mock Paystack behavior since no key is provided
    showConfirm(`MOCK CHECKOUT\n\nTotal: ₦${total.toLocaleString()}\nEmail: ${email}\nPhone: ${phone}\n\nProceed to simulate successful payment?`, "Confirm Payment", () => {
        // Success Mock
        showNotification("Payment successful! Reference: MOCK-" + Date.now(), "Order Confirmed", "success");
        
        let order = {
            reference: "MOCK-" + Date.now(),
            status: "Paid",
            total: total,
            date: new Date().toLocaleDateString(),
            phone: phone,
            items: [...cart]
        };

        orders.push(order);
        saveOrders();

        cart = [];
        saveCart();
        
        renderCart();
        updateCartCount();
        
        let sidebar = document.getElementById("cart-sidebar");
        if(sidebar.classList.contains("active")) {
            sidebar.classList.remove("active");
        }
        
        // Refresh Order History if on page
        renderOrderHistory();
    });
}

function renderOrderHistory() {
    let container = document.getElementById("order-history");
    if(!container) return;
    
    container.innerHTML = "";
    
    if(orders.length === 0) {
        container.innerHTML = "<p>No past orders.</p>";
        return;
    }

    orders.forEach(order => {
        container.innerHTML += `
        <div class="order-card">
            <h3>Order ${order.reference}</h3>
            <p style="color:#25D366; font-weight:bold;">Status: ${order.status}</p>
            <p style="color:#d4af37;">Total: ₦${order.total.toLocaleString()}</p>
            <p>Date: ${order.date}</p>
        </div>
        `;
    });
}

// Call on load if history section exists
document.addEventListener("DOMContentLoaded", () => {
    renderOrderHistory();
});
