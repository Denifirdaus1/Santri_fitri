// Tampilkan notifikasi
function showNotification(type, message) {
    const area = document.getElementById('notification-area');
    
    const notif = document.createElement('div');
    notif.className = `notification ${type}`;
    notif.innerHTML = `
        <i class="fa-solid ${type === 'success' ? 'fa-circle-check' : 'fa-triangle-exclamation'}"></i>
        <span>${message}</span>
    `;
    
    area.appendChild(notif);
    
    // Auto hide after 5 seconds
    setTimeout(() => {
        notif.style.transition = 'opacity 0.5s';
        notif.style.opacity = '0';
        setTimeout(() => {
            notif.remove();
        }, 500);
    }, 5000);
}

// Cek URL parameters
function checkUrlParams() {
    const urlParams = new URLSearchParams(window.location.search);
    
    if (urlParams.get('logout') === 'success') {
        showNotification('success', 'Anda telah berhasil logout dari sistem!');
        // Clean URL
        window.history.replaceState({}, document.title, window.location.pathname);
    }
    
    if (urlParams.get('error') === '1') {
        showNotification('error', 'Username atau password salah. Silakan coba lagi.');
        // Clean URL
        window.history.replaceState({}, document.title, window.location.pathname);
    }
    
    if (urlParams.get('registered') === 'success') {
        showNotification('success', 'Pendaftaran berhasil! Silakan login dengan akun Anda.');
        // Clean URL
        window.history.replaceState({}, document.title, window.location.pathname);
    }
}

// Cek apakah sudah login
function checkAuth() {
    const user = localStorage.getItem('user');
    if (user) {
        const userData = JSON.parse(user);
        if (userData.role === 'admin') {
            window.location.href = 'admin/dashboard.html';
        } else if (userData.role === 'santri') {
            window.location.href = 'santri/index.html';
        }
    }
}

// Handle login form
document.addEventListener('DOMContentLoaded', function() {
    // Check if already logged in
    checkAuth();
    
    // Check URL parameters
    checkUrlParams();
    
    const loginForm = document.getElementById('loginForm');
    
    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        
        // Show loading
        const submitBtn = loginForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Memproses...';
        submitBtn.disabled = true;
        
        try {
            const response = await fetch('api/login.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password })
            });
            
            const data = await response.json();
            
            if (data.success) {
                // Simpan data user
                localStorage.setItem('user', JSON.stringify(data.user));
                
                showNotification('success', 'Login berhasil! Mengalihkan...');
                
                // Redirect sesuai role
                setTimeout(() => {
                    if (data.user.role === 'admin') {
                        window.location.href = 'admin/dashboard.html';
                    } else {
                        window.location.href = 'santri/index.html';
                    }
                }, 1500);
            } else {
                showNotification('error', 'Username atau password salah');
                
                // Reset button
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }
        } catch (error) {
            console.error('Error:', error);
            showNotification('error', 'Terjadi kesalahan. Silakan coba lagi.');
            
            // Reset button
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    });
});