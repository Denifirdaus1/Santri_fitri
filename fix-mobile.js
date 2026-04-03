const fs = require('fs');

const files = [
    'admin/index.html',
    'admin/kelola-santri.html',
    'admin/tambah-santri.html',
    'admin/edit-santri.html',
    'admin/konfirmasi.html',
    'admin/monitoring.html',
    'admin/rekap.html',
    'santri/index.html'
];

files.forEach(f => {
    let c = fs.readFileSync(f, 'utf8');
    if (!c.includes('mobile-menu-btn')) {
        c = c.replace(/<div class="header">(\s*<div class="header-left">)?/g, (match, p1) => {
            return match + '\n<button class="mobile-menu-btn" onclick="document.querySelector(\'.sidebar\').classList.toggle(\'active\'); document.querySelector(\'.mobile-overlay\').classList.toggle(\'active\')"><i class="fa-solid fa-bars"></i></button>\n';
        });
        
        let bodyTagIndex = c.indexOf('<body>');
        if (bodyTagIndex !== -1) {
             c = c.replace('<body>', '<body>\n<div class="mobile-overlay" onclick="document.querySelector(\'.sidebar\').classList.remove(\'active\'); this.classList.remove(\'active\')"></div>');
        }
        fs.writeFileSync(f, c);
        console.log(`Updated ${f}`);
    } else {
        console.log(`Skipped ${f} (already has menu btn)`);
    }
});
