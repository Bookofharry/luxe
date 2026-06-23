const fs = require('fs');
let css = fs.readFileSync('style.css', 'utf8');

// Fix cart-sidebar
css = css.replace(
`#cart-sidebar {
    position: fixed;
    top: 0;
    right: -420px;
    width: 400px;
    height: 100vh;
    background: var(--color-off-white);
    z-index: 2000;
    transition: transform 0.4s cubic-bezier(0.77, 0, 0.175, 1);
    display: flex;
    flex-direction: column;
    box-shadow: -10px 0 30px rgba(0,0,0,0.8);
}
#cart-sidebar.active {
    transform: translateX(-420px);
}`,
`#cart-sidebar {
    position: fixed;
    top: 0;
    right: 0;
    transform: translateX(calc(100% + 45px));
    width: 400px;
    max-width: 100%;
    height: 100vh;
    background: var(--color-off-white);
    z-index: 2000;
    transition: transform 0.4s cubic-bezier(0.77, 0, 0.175, 1);
    display: flex;
    flex-direction: column;
    box-shadow: -10px 0 30px rgba(0,0,0,0.8);
}
#cart-sidebar.active {
    transform: translateX(0);
}`);

// Fix wishlist-sidebar
css = css.replace(
`#wishlist-sidebar{
position:fixed;
left:-420px;
top:0;
width:400px;
height:100vh;
background:var(--color-light-brown);
transition:.4s;
z-index:2000;
padding:20px;
overflow-y:auto;
}

#wishlist-sidebar.active{
left:0;
}`,
`#wishlist-sidebar{
position:fixed;
left:0;
transform: translateX(calc(-100% - 45px));
top:0;
width:400px;
max-width: 100%;
height:100vh;
background:var(--color-light-brown);
transition: transform 0.4s cubic-bezier(0.77, 0, 0.175, 1);
z-index:2000;
padding:20px;
overflow-y:auto;
box-shadow: 10px 0 30px rgba(0,0,0,0.8);
}

#wishlist-sidebar.active{
transform: translateX(0);
}`);

// Fix nav ul
css = css.replace(
`nav ul{
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
}`,
`nav ul{
display: flex;
flex-direction: column;
position: fixed;
top: 0;
left: 0;
transform: translateX(calc(-100% - 45px));
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
transform: translateX(0);
}`);

fs.writeFileSync('style.css', css, 'utf8');
console.log('Fixed overlapping shadow issues');
