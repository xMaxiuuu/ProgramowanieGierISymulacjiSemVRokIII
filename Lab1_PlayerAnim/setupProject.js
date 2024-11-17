const fs = require('fs');
const path = require('path');

// Definicja struktury katalogów i plików
const baseDir = path.join(__dirname, 'playerAnim');
const srcDir = path.join(baseDir, 'src');
const distDir = path.join(baseDir, 'dist');

// Pliki do stworzenia
const files = [
    { dir: baseDir, name: 'playerAnim.html', content: '<!DOCTYPE html>\n<html>\n<head>\n  <title>Player Animation</title>\n</head>\n<body>\n  <canvas id="gameCanvas"></canvas>\n</body>\n</html>' },
    { dir: baseDir, name: 'gameCanvas.css', content: 'body { margin: 0; background: #000; }' },
    { dir: srcDir, name: 'gameCanvas.ts', content: '// Main game canvas logic' },
    { dir: srcDir, name: 'gameCanvas_Player.ts', content: '// Player logic here' },
    { dir: srcDir, name: 'gameCanvas_Animation.ts', content: '// Animation logic here' }
];

// Tworzenie katalogów i plików
[baseDir, srcDir, distDir].forEach(dir => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        console.log(`Utworzono katalog: ${dir}`);
    }
});

files.forEach(file => {
    const filePath = path.join(file.dir, file.name);
    if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, file.content, 'utf8');
        console.log(`Utworzono plik: ${filePath}`);
    }
});

console.log('Struktura projektu została wygenerowana.');
