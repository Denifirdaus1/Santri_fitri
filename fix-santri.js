const fs = require('fs');

let c = fs.readFileSync('santri/index.html', 'utf8');

const cssToAdd = `
        /* ACTIVE STATUS CARD */
        .active-status-card {
            background: #fff;
            border-radius: 15px;
            padding: 20px;
            margin-bottom: 25px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.05);
            display: flex;
            align-items: center;
            justify-content: space-between;
            border-left: 5px solid #2196f3;
            animation: slideDown 0.5s ease-out;
            flex-wrap: wrap;
            gap: 15px;
        }
        
        .active-status-card.approved {
            border-left-color: #4caf50;
            background: #f1f8e9;
        }

        .active-status-card.late {
            border-left-color: #f44336;
            background: #ffebee;
            animation: pulse-border 2s infinite;
        }

        .asc-info h3 { margin: 0 0 5px 0; color: #333; font-size: 1.1rem; }
        .asc-info p { margin: 0; color: #666; font-size: 0.95rem; }
        .asc-info i { margin-right: 8px; }
        
        .asc-timer {
            text-align: right;
        }
        .asc-timer .countdown {
            font-size: 1.8rem;
            font-weight: 800;
            color: #333;
            font-family: monospace;
            padding: 5px 15px;
            border-radius: 8px;
            background: rgba(0,0,0,0.05);
            display: inline-block;
            min-width: 150px;
            text-align: center;
        }
        .active-status-card.late .countdown {
            color: #f44336;
            background: rgba(244, 67, 54, 0.1);
        }

        @keyframes pulse-border {
            0% { box-shadow: 0 0 0 0 rgba(244, 67, 54, 0.4); }
            70% { box-shadow: 0 0 0 10px rgba(244, 67, 54, 0); }
            100% { box-shadow: 0 0 0 0 rgba(244, 67, 54, 0); }
        }
    </style>
`;
c = c.replace('    </style>', cssToAdd);

const htmlToAdd = `</div>

<!-- ACTIVE PERMIT STATUS -->
<div id="activeStatusContainer"></div>

<!-- MAIN CONTENT -->
<div class="content">`;
c = c.replace(/<\/div>\s*<!-- MAIN CONTENT -->\s*<div class="content">/, htmlToAdd);

const jsToAdd = `let countdownInterval = null;

async function loadActiveStatus() {
    try {
        const { data, error } = await supabase
            .from('izin')
            .select('*')
            .eq('id_santri', myIdSantri)
            .is('tanggal_kembali', null)
            .neq('status', 'ditolak')
            .order('created_at', { ascending: false })
            .limit(1)
            
        if (error) throw error
        
        const container = document.getElementById('activeStatusContainer')
        
        if (countdownInterval) {
            clearInterval(countdownInterval)
            countdownInterval = null
        }

        if (data && data.length > 0) {
            const izin = data[0]
            
            if (izin.status === 'menunggu') {
                container.innerHTML = \`
                    <div class="active-status-card">
                        <div class="asc-info">
                            <h3><i class="fa-solid fa-hourglass-half" style="color:#ff9800;"></i> Izin Sedang Diproses</h3>
                            <p>Permohonan izin <b>\${izin.jenis_izin}</b> pada \${new Date(izin.tanggal_keluar).toLocaleDateString('id-ID')} sedang menunggu persetujuan admin.</p>
                        </div>
                    </div>
                \`
            } else if (izin.status === 'disetujui') {
                if (!izin.batas_waktu) {
                    container.innerHTML = \`
                        <div class="active-status-card approved">
                            <div class="asc-info">
                                <h3><i class="fa-solid fa-check-circle" style="color:#4caf50;"></i> Izin Aktif</h3>
                                <p>Silakan menikmati izin \${izin.jenis_izin} anda. Jangan lupa lapor setelah kembali.</p>
                            </div>
                        </div>
                    \`
                } else {
                    renderBatasWaktuRealtime(container, izin)
                }
            }
        } else {
            container.innerHTML = ''
        }
    } catch (error) {
        console.error('Error loading active status:', error)
    }
}

function renderBatasWaktuRealtime(container, izin) {
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
}

// ==================== SET MIN DATE ====================`;

c = c.replace('// ==================== SET MIN DATE ====================', jsToAdd);
c = c.replace('loadRiwayat()', 'loadRiwayat()\n    loadActiveStatus()'); // there are 3 instances of loadRiwayat() being called, they will all get loadActiveStatus appended!
fs.writeFileSync('santri/index.html', c);
console.log("Success");
