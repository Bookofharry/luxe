const fs = require('fs');
let css = fs.readFileSync('style.css', 'utf8');

// The original block
const oldBlock = `.nav-icons input {
padding:10px;
border:none;
outline:none;
border-radius:4px;
background:var(--color-brown);
color:#fff;
}

.nav-icons input::placeholder {
color: rgba(255, 255, 255, 0.8);
}`;

const newBlock = `.nav-icons input {
padding:10px;
border:none;
outline:none;
border-radius:4px;
background:var(--color-brown);
color:var(--color-dark-brown);
}`;

// Replace the original block
css = css.replace(oldBlock, newBlock);

// Remove the duplicated block that multi_replace added around line 544
const duplicateBlockRegex = /\.nav-icons input \{\s*padding:10px;\s*border:none;\s*outline:none;\s*border-radius:4px;\s*background:var\(--color-brown\);\s*color:var\(--color-dark-brown\);\s*\}/g;

// Find all occurrences and if there are multiple, keep only the first
let matches = [...css.matchAll(duplicateBlockRegex)];
if (matches.length > 1) {
    // Remove the last match
    let lastMatch = matches[matches.length - 1];
    css = css.substring(0, lastMatch.index) + css.substring(lastMatch.index + lastMatch[0].length);
}

fs.writeFileSync('style.css', css, 'utf8');
console.log('Reverted search bar correctly');
