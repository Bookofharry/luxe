const fs = require('fs');
let css = fs.readFileSync('style.css', 'utf8');

// Colors
const offWhite = '#E8F0FF';
const brown = '#8E6E53';
const lightestBrown = '#FAFFFD';
const darkBrown = '#30292F';
const lightBrown = '#FFF3F0';

const replacements = {
    '#0b0b0b': offWhite,
    '#000': lightBrown,
    'black': lightBrown,
    '#111': lightBrown,
    '#151515': lightestBrown,
    '#181818': lightestBrown,
    '#050505': lightBrown,
    '#d4af37': brown,
    '#fff': darkBrown,
    'white': darkBrown,
    '#ddd': darkBrown,
    '#ccc': darkBrown,
    '#888': darkBrown,
    '#666': darkBrown,
    'rgba\\(212,175,55': 'rgba(142,110,83', // brown RGB
    '#1a1a1a': brown,
    '#222': brown,
    '#333': brown,
    'rgba\\(0,0,0,': 'rgba(48,41,47,' // dark brown RGB
};

for (const [key, value] of Object.entries(replacements)) {
    // Case insensitive replacement for hex codes and color words
    const regex = new RegExp(key + '(?![a-zA-Z0-9])', 'gi');
    css = css.replace(regex, value);
}

fs.writeFileSync('style.css', css, 'utf8');
console.log('Styles updated');
