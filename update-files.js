const fs = require('fs');
const path = require('path');

// HTML klasörünü kontrol et
const htmlDir = path.join(__dirname, 'html');

// Rakamla başlayan .html dosyalarını bul
const files = fs.readdirSync(htmlDir)
    .filter(file => {
        // 01, 02, vb. ile başlayan ve .html ile biten dosyaları filtrele
        return /^\d{2}_.*\.html$/.test(file) && file !== 'index.html';
    })
    .sort((a, b) => {
        // Dosya adındaki rakamları karşılaştır
        const numA = parseInt(a.match(/^(\d+)/)[1]);
        const numB = parseInt(b.match(/^(\d+)/)[1]);
        return numA - numB;
    });

// files.json dosyasını oluştur/güncelle
const filesJson = {
    files: files
};

fs.writeFileSync(
    path.join(htmlDir, 'files.json'),
    JSON.stringify(filesJson, null, 4),
    'utf8'
);

console.log('✅ files.json güncellendi!');
console.log('📄 Bulunan dosyalar:', files);

// Ayrıca index.html içindeki FILES_CONFIG'i güncelle
const indexPath = path.join(htmlDir, 'index.html');
let indexContent = fs.readFileSync(indexPath, 'utf8');

// FILES_CONFIG objesini güncelle
const filesConfigPattern = /const FILES_CONFIG = \{[\s\S]*?\};/;
const newFilesConfig = `const FILES_CONFIG = {
            files: [
                ${files.map(f => `"${f}"`).join(',\n                ')}
            ]
        };`;

if (filesConfigPattern.test(indexContent)) {
    indexContent = indexContent.replace(filesConfigPattern, newFilesConfig);
    fs.writeFileSync(indexPath, indexContent, 'utf8');
    console.log('✅ index.html içindeki FILES_CONFIG güncellendi!');
} else {
    console.warn('⚠️  index.html içinde FILES_CONFIG bulunamadı!');
}