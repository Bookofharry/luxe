const fs = require('fs');

let css = fs.readFileSync('style.css', 'utf8');

const oldNav = `nav ul{
display: flex;
flex-direction: column;
position: fixed;
top: 0;
left: -420px;
width: 400px;
max-width: 100%;
height: 100vh;
background: var(--color-off-white);
z-index: 900;
transition: transform 0.4s cubic-bezier(0.77, 0, 0.175, 1);
padding: 140px 30px 30px 30px;
text-align: left;
gap: 25px;
border-top: none;
box-shadow: 10px 0 30px rgba(0,0,0,0.8);
margin: 0;
}

nav ul.active{
transform: translateX(420px);
}`;

css = css.replace(oldNav, `nav ul {
    display: none;
}`);

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
console.log('style.css patched successfully.');
