const fs = require('fs');
let css = fs.readFileSync('style.css', 'utf8');

const missingCSS = `
nav ul li a {
text-decoration:none;
color:var(--color-dark-brown);
transition:.3s;
}

nav ul li a:hover {
color:var(--color-brown);
}

.hamburger-btn {
display: none;
background: none;
border: none;
color: var(--color-dark-brown);
font-size: 24px;
cursor: pointer;
}

.nav-icons {
display:flex;
align-items:center;
gap:15px;
}

.nav-icons input {
padding:10px;
border:none;
outline:none;
border-radius:4px;
background:var(--color-brown);
color:var(--color-dark-brown);
}

.nav-icons button {
border:none;
background:transparent;
color:var(--color-dark-brown);
cursor:pointer;
display:flex;
align-items:center;
transition:0.3s;
}

.nav-icons button:hover {
color:var(--color-brown);
}

#cart-count {
background:var(--color-brown);
color:var(--color-light-brown);
padding:2px 7px;
border-radius:50%;
font-size:12px;
margin-left:4px;
}
`;

// Find the position of 'nav ul' and the broken 'margin-left:4px;'
const regex = /nav ul\s*\{\s*display:flex;\s*list-style:none;\s*gap:30px;\s*\}\s*margin-left:4px;\s*\}/g;

if (regex.test(css)) {
    css = css.replace(regex, `nav ul{\ndisplay:flex;\nlist-style:none;\ngap:30px;\n}\n${missingCSS}`);
    fs.writeFileSync('style.css', css, 'utf8');
    console.log('Successfully repaired missing CSS block.');
} else {
    console.log('Regex did not match! Something else is wrong.');
}
