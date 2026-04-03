const fs = require('fs');

let c = fs.readFileSync('admin/index.html', 'utf8');

c = c.replace('window.konfirmasiIzin = konfirmasiIzin', 'window.confirmTerima = confirmTerima;\nwindow.confirmTolak = confirmTolak;\nwindow.prosesIzin = prosesIzin;');

c = c.replace(/<button class="btn btn-konfirm" onclick="konfirmasiIzin\(\$\{item\.id_izin\}\)">\s*<i class="fa-solid fa-check"><\/i> Konfirmasi\s*<\/button>/g, '<button class="btn btn-acc" onclick="confirmTerima(${item.id_izin})"><i class="fa-solid fa-check"></i> Terima</button>\n                            <button class="btn btn-tolak" onclick="confirmTolak(${item.id_izin})"><i class="fa-solid fa-xmark"></i> Tolak</button>');

c = c.replace(/function konfirmasiIzin\(id\) \{[\s\S]*?\}/, `function confirmTerima(id) {
    showPopup({
        type: 'confirm', title: 'Terima Izin? ✨',
        message: 'Silakan pilih batas waktu kembali:<br><br><input type="datetime-local" id="batasWaktuInput" style="width:100%; padding:10px; border-radius:10px; border:1px solid #ccc; font-family:inherit;">', confirmText: 'Terima',
        onConfirmFn: () => {
            const batas = document.getElementById('batasWaktuInput').value;
            if(!batas) {
                showToast('error', 'Pilih batas waktu terlebih dahulu!');
                return;
            }
            prosesIzin(id, 'terima', batas);
        }
    })
}

function confirmTolak(id) {
    showPopup({
        type: 'confirm', title: 'Tolak Izin? 😕',
        message: 'Yakin ingin menolak izin ini?', confirmText: 'Tolak',
        onConfirmFn: () => prosesIzin(id, 'tolak')
    })
}

async function prosesIzin(id, aksi, batasWaktu = null) {
    closePopup()
    showToast('info', 'Memproses...')
    try {
        const newStatus = aksi === 'terima' ? 'disetujui' : 'ditolak'
        const updateData = { status: newStatus }
        if (aksi === 'terima' && batasWaktu) {
            updateData.batas_waktu = new Date(batasWaktu).toISOString()
        }
        
        const { error } = await supabase
            .from('izin')
            .update(updateData)
            .eq('id_izin', id)

        if (error) throw error
        showToast('success', \`Izin berhasil di\${aksi === 'terima' ? 'terima' : 'tolak'}! 🎉\`)
        loadDashboard()
    } catch (error) {
        console.error('Error:', error)
        showToast('error', error.message || 'Terjadi kesalahan')
    }
}`);

fs.writeFileSync('admin/index.html', c);
console.log("admin/index.html updated successfully!");
