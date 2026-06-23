const fs = require('fs');
let css = fs.readFileSync('style.css', 'utf8');

const missingCSS = `nav ul li a {
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
color:#fff;
}

.nav-icons input::placeholder {
color: rgba(255, 255, 255, 0.8);
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
}`;

css = css.replace('margin-left:4px;\n}', missingCSS);
fs.writeFileSync('style.css', css, 'utf8');
console.log('Fixed CSS.');
