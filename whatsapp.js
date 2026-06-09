// =====================================
// WHATSAPP ORDERING SYSTEM
// =====================================

// Replace with your WhatsApp Business Number
const WHATSAPP_NUMBER = "2348154783517";

// =====================================
// FORMAT MONEY
// =====================================

function formatMoney(amount){

    return amount.toLocaleString("en-NG");

}

// =====================================
// GET CART TOTAL
// =====================================

function getWhatsAppTotal(){

    let total = 0;

    cart.forEach(item => {

        total += item.price * item.qty;

    });
    
    total = total - (total * discount);

    return total;

}

// =====================================
// GENERATE ORDER NUMBER
// =====================================

function generateOrderNumber(){

    return "ORD-" +
    Date.now();

}

// =====================================
// SEND ORDER
// =====================================

function sendWhatsAppOrder(){

    if(cart.length === 0){

        alert("Your cart is empty");

        return;

    }

    const orderNumber =
    generateOrderNumber();

    let message =
`🛍️ *NEW JEWELRY ORDER*

Order Number: ${orderNumber}

`;

    cart.forEach(item => {

        const subtotal =
        item.price * item.qty;

        message +=

`💎 ${item.name}
Qty: ${item.qty}
Price: ₦${formatMoney(item.price)}
Subtotal: ₦${formatMoney(subtotal)}

`;

    });

    message +=
`-----------------------
TOTAL: ₦${formatMoney(getWhatsAppTotal())}

Customer Email:
${document.getElementById("customer-email")?.value || "Not Provided"}

Thank you.
`;

    const whatsappURL =
    `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

    window.open(
        whatsappURL,
        "_blank"
    );

}