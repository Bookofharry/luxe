const fs = require('fs');
const path = require('path');

const files = [
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

const quickModalHTML = `
<!-- QUICK SUCCESS MODAL -->
<div id="quick-modal" class="modal">
    <div class="modal-content quick-modal-content">
        <i class="ph-fill ph-check-circle" style="font-size: 60px; color: var(--color-brown); margin-bottom: 15px;"></i>
        <h3 style="font-family:'Cormorant Garamond',serif; font-size: 36px; color: var(--color-dark-brown); margin-bottom: 10px;">Added to Bag!</h3>
        <p id="quick-modal-name" style="font-size: 18px; color: var(--color-brown);"></p>
    </div>
</div>
`;

// 1. Fix HTML: Add Quick Modal and Semantic <main> tag
for (let file of files) {
    let content = fs.readFileSync(file, 'utf8');

    // Add quick-modal if not present
    if (!content.includes('id="quick-modal"') && content.includes('<!-- CUSTOM NOTIFICATION MODAL -->')) {
        content = content.replace('<!-- CUSTOM NOTIFICATION MODAL -->', quickModalHTML + '\n<!-- CUSTOM NOTIFICATION MODAL -->');
    }

    // Add <main> wrapper
    if (!content.includes('<main id="main-content">')) {
        content = content.replace('</header>', '</header>\n\n<main id="main-content">');
        content = content.replace('<!-- FOOTER -->', '</main>\n\n<!-- FOOTER -->');
    }

    fs.writeFileSync(file, content, 'utf8');
}
console.log('HTML files updated.');

// 2. Refactor CSS: Add variables
let css = fs.readFileSync('style.css', 'utf8');

const cssVars = `
:root {
    --color-off-white: #E8F0FF;
    --color-light-brown: #FFF3F0;
    --color-lightest-brown: #FAFFFD;
    --color-brown: #8E6E53;
    --color-dark-brown: #30292F;
    --color-red: #ff4b4b;
    --color-red-hover: #ff2020;
    --color-whatsapp: #25D366;
}
`;

if (!css.includes(':root {')) {
    css = cssVars + '\n' + css;
}

// Case insensitive replacements using regex
const colorMap = {
    '#E8F0FF': 'var(--color-off-white)',
    '#FFF3F0': 'var(--color-light-brown)',
    '#FAFFFD': 'var(--color-lightest-brown)',
    '#8E6E53': 'var(--color-brown)',
    '#30292F': 'var(--color-dark-brown)',
    '#ff4b4b': 'var(--color-red)',
    '#ff2020': 'var(--color-red-hover)',
    '#25D366': 'var(--color-whatsapp)'
};

for (const [hex, variable] of Object.entries(colorMap)) {
    const regex = new RegExp(hex, 'gi');
    css = css.replace(regex, variable);
}

fs.writeFileSync('style.css', css, 'utf8');
console.log('CSS file refactored to use variables.');
