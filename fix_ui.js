const fs = require('fs');

let c = fs.readFileSync('santri/index.html', 'utf8');

const targetStr = `function renderBatasWaktuRealtime(container, izin) {
    const batas = new Date(izin.batas_waktu).getTime();
    
    const updateHTML = () => {
        const sekarang = new Date().getTime();
        const selisih = batas - sekarang;
        
        if (selisih < 0) {
            const lewat = Math.abs(selisih);
            const days = Math.floor(lewat / (1000 * 60 * 60 * 24));
            const hours = Math.floor((lewat % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const mins = Math.floor((lewat % (1000 * 60 * 60)) / (1000 * 60));
            const secs = Math.floor((lewat % (1000 * 60)) / 1000);
            
            container.innerHTML = \`
                <div class="active-status-card late">
                    <div class="asc-info">
                        <h3 style="color:#f44336;"><i class="fa-solid fa-triangle-exclamation"></i> Terlambat Kembali!</h3>
                        <p>Batas waktu: \${new Date(izin.batas_waktu).toLocaleString('id-ID')}</p>
                        <p>Segera kembali ke pondok atau hubungi pengurus!</p>
                    </div>
                    <div class="asc-timer">
                        <div style="font-size:12px; color:#f44336; margin-bottom:5px; font-weight:bold;">TElAH MELEWATI BATAS:</div>
                        <div class="countdown">
                            \${days > 0 ? days + 'h ' : ''}\${hours.toString().padStart(2, '0')}:\${mins.toString().padStart(2, '0')}:\${secs.toString().padStart(2, '0')}
                        </div>
                    </div>
                </div>
            \`;
        } else {
            const days = Math.floor(selisih / (1000 * 60 * 60 * 24));
            const hours = Math.floor((selisih % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const mins = Math.floor((selisih % (1000 * 60 * 60)) / (1000 * 60));
            const secs = Math.floor((selisih % (1000 * 60)) / 1000);
            
            container.innerHTML = \`
                <div class="active-status-card approved">
                    <div class="asc-info">
                        <h3><i class="fa-solid fa-person-walking-luggage" style="color:#4caf50;"></i> Dalam Masa Izin</h3>
                        <p>Batas waktu kembali: <b>\${new Date(izin.batas_waktu).toLocaleString('id-ID')}</b></p>
                    </div>
                    <div class="asc-timer">
                        <div style="font-size:12px; color:#666; margin-bottom:5px;">SISA WAKTU:</div>
                        <div class="countdown">
                            \${days > 0 ? days + 'h ' : ''}\${hours.toString().padStart(2, '0')}:\${mins.toString().padStart(2, '0')}:\${secs.toString().padStart(2, '0')}
                        </div>
                    </div>
                </div>
            \`;
        }
    };
    
    updateHTML();
    countdownInterval = setInterval(updateHTML, 1000);
}`;

const updatedFn = `function renderBatasWaktuRealtime(container, izin) {
    const batas = new Date(izin.batas_waktu).getTime();
    
    let isLate = new Date().getTime() > batas;
    // Render the container only once
    container.innerHTML = \`
        <div id="ascCard" class="active-status-card \${isLate ? 'late' : 'approved'}">
            <div class="asc-info">
                <h3 id="ascTitle" style="\${isLate ? 'color:#f44336;' : ''}">
                    \${isLate ? '<i class="fa-solid fa-triangle-exclamation"></i> Terlambat Kembali!' : '<i class="fa-solid fa-person-walking-luggage" style="color:#4caf50;"></i> Dalam Masa Izin'}
                </h3>
                <p>Batas waktu: <b>\${new Date(izin.batas_waktu).toLocaleString('id-ID')}</b></p>
                <p id="ascDesc">\${isLate ? 'Segera kembali ke pondok atau hubungi pengurus!' : ''}</p>
            </div>
            <div class="asc-timer">
                <div id="ascTimerLabel" style="font-size:12px; color:\${isLate ? '#f44336' : '#666'}; margin-bottom:5px; font-weight:\${isLate ? 'bold' : 'normal'};">
                    \${isLate ? 'TELAH MELEWATI BATAS:' : 'SISA WAKTU:'}
                </div>
                <div id="ascCountdown" class="countdown">--:--:--</div>
            </div>
        </div>
    \`;

    const countdownEl = document.getElementById('ascCountdown');
    const cardEl = document.getElementById('ascCard');
    const titleEl = document.getElementById('ascTitle');
    const descEl = document.getElementById('ascDesc');
    const labelEl = document.getElementById('ascTimerLabel');

    const updateHTML = () => {
        const sekarang = new Date().getTime();
        const selisih = batas - sekarang;
        const currentIsLate = selisih < 0;
        
        const lewatOrSisa = Math.abs(selisih);
        const days = Math.floor(lewatOrSisa / (1000 * 60 * 60 * 24));
        const hours = Math.floor((lewatOrSisa % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const mins = Math.floor((lewatOrSisa % (1000 * 60 * 60)) / (1000 * 60));
        const secs = Math.floor((lewatOrSisa % (1000 * 60)) / 1000);
        
        if (countdownEl) {
            countdownEl.innerText = \`\${days > 0 ? days + 'h ' : ''}\${hours.toString().padStart(2, '0')}:\${mins.toString().padStart(2, '0')}:\${secs.toString().padStart(2, '0')}\`;
        }

        if (currentIsLate && !isLate) {
            isLate = true;
            if(cardEl) cardEl.className = 'active-status-card late';
            if(titleEl) {
                titleEl.style.color = '#f44336';
                titleEl.innerHTML = '<i class="fa-solid fa-triangle-exclamation"></i> Terlambat Kembali!';
            }
            if(descEl) descEl.innerText = 'Segera kembali ke pondok atau hubungi pengurus!';
            if(labelEl) {
                labelEl.style.color = '#f44336';
                labelEl.style.fontWeight = 'bold';
                labelEl.innerText = 'TELAH MELEWATI BATAS:';
            }
        }
    };
    
    updateHTML();
    countdownInterval = setInterval(updateHTML, 1000);
}`;

if (c.indexOf("function renderBatasWaktuRealtime(container, izin)") !== -1) {
    c = c.replace(targetStr, updatedFn);
    fs.writeFileSync('santri/index.html', c);
    console.log("Patched correctly using exact target string replacing!");
} else {
    console.log("Target string not found!");
}
