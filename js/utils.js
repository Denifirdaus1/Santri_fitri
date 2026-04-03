// ============================================================
// UTILS MODULE — Shared UI Utilities
// ============================================================

/**
 * Toast Notification
 */
export function showToast(type, message) {
  const toast = document.createElement('div')
  toast.className = `toast-notification ${type}`

  let icon = type === 'success' ? 'fa-circle-check' :
    type === 'error' ? 'fa-circle-exclamation' : 'fa-circle-info'

  toast.innerHTML = `<i class="fa-solid ${icon}"></i><span>${message}</span>`
  document.body.appendChild(toast)

  setTimeout(() => {
    toast.style.transition = 'opacity 0.5s'
    toast.style.opacity = '0'
    setTimeout(() => toast.remove(), 500)
  }, 3000)
}

/**
 * Popup Dialog
 */
export function showPopup(options) {
  const container = document.getElementById('popupContainer')
  if (!container) return

  let icon = ''
  let bgClass = ''

  if (options.type === 'success') {
    icon = 'fa-circle-check'
    bgClass = 'success'
  } else if (options.type === 'error') {
    icon = 'fa-circle-exclamation'
    bgClass = 'error'
  } else if (options.type === 'info') {
    icon = 'fa-circle-info'
    bgClass = 'info'
  } else if (options.type === 'confirm') {
    icon = 'fa-circle-question'
    bgClass = 'warning'
  }

  let buttons = ''
  if (options.type === 'confirm') {
    // Store callback globally for onclick
    window._popupConfirmCallback = options.onConfirmFn || null
    let onclickStr = "if(window._popupConfirmCallback) { window._popupConfirmCallback(); }";
    if (options.onConfirm) onclickStr += ` else { ${options.onConfirm} }`;
    
    buttons = `
      <div class="popup-buttons">
        <button class="popup-btn cancel" onclick="window._closePopup()">Batal</button>
        <button class="popup-btn confirm" onclick="${onclickStr}">${options.confirmText || 'Lanjutkan'}</button>
      </div>
    `
  } else {
    buttons = `
      <div class="popup-buttons">
        <button class="popup-btn confirm" onclick="window._closePopup()">OK</button>
      </div>
    `
  }

  container.innerHTML = `
    <div class="popup ${bgClass}">
      <span class="popup-close" onclick="window._closePopup()">&times;</span>
      <i class="fa-solid ${icon}"></i>
      <h3>${options.title || ''}</h3>
      <p>${options.message || ''}</p>
      ${buttons}
    </div>
  `

  container.style.display = 'flex'

  if (options.type !== 'confirm') {
    setTimeout(() => closePopup(), 3000)
  }
}

export function closePopup() {
  const container = document.getElementById('popupContainer')
  if (container) container.style.display = 'none'
  window._popupConfirmCallback = null
}

// Make closePopup available globally for onclick handlers
window._closePopup = closePopup

/**
 * Format Date: 12 Jan 2026
 */
export function formatDate(dateString) {
  if (!dateString) return '-'
  const d = new Date(dateString)
  return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
}

/**
 * Format DateTime: 12/01/2026 14:30
 */
export function formatDateTime(dateString) {
  if (!dateString) return '-'
  const d = new Date(dateString)
  return d.toLocaleString('id-ID', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  })
}

/**
 * Format tanggal Indonesia lengkap
 */
export function formatDateLong(dateString) {
  if (!dateString) return '-'
  const d = new Date(dateString)
  const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 
                   'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember']
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`
}

/**
 * Set user info di header
 */
export function setUserInfo(user, avatarId = 'userAvatar', nameId = 'userName', dateId = 'currentDate') {
  const name = user?.user_metadata?.nama || user?.user_metadata?.nis || user?.email?.split('@')[0] || 'User'
  
  const nameEl = document.getElementById(nameId)
  const avatarEl = document.getElementById(avatarId)
  const dateEl = document.getElementById(dateId)

  if (nameEl) nameEl.innerText = name
  if (avatarEl) avatarEl.innerText = name.charAt(0).toUpperCase()
  if (dateEl) {
    const now = new Date()
    dateEl.innerText = formatDateLong(now)
  }
}
