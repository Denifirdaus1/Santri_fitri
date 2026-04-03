import { supabase, toEmail } from './supabase-client.js'

// ============================================================
// AUTH MODULE — NIS-based Login System
// ============================================================

/**
 * Login user dengan NIS/username + password
 * NIS dikonversi ke format email: NIS@pesantren.local
 */
export async function login(identifier, password) {
  const email = toEmail(identifier)

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  })

  if (error) {
    throw new Error(error.message === 'Invalid login credentials' 
      ? 'NIS atau password salah' 
      : error.message)
  }

  return data
}

/**
 * Register santri baru
 * NIS dikonversi ke format email: NIS@pesantren.local
 */
export async function registerSantri(nis, password, idSantri) {
  const email = toEmail(nis)

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        role: 'santri',
        id_santri: parseInt(idSantri),
        nis: nis
      }
    }
  })

  if (error) {
    throw new Error(error.message)
  }

  return data
}

/**
 * Logout user
 */
export async function logout() {
  const { error } = await supabase.auth.signOut()
  if (error) throw new Error(error.message)
}

/**
 * Cek apakah user sudah login
 * Return: { user, session } atau null
 */
export async function getSession() {
  const { data: { session }, error } = await supabase.auth.getSession()
  if (error || !session) return null
  return session
}

/**
 * Get current user data
 */
export async function getCurrentUser() {
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error || !user) return null
  return user
}

/**
 * Get user role dari metadata
 */
export function getUserRole(user) {
  return user?.user_metadata?.role || null
}

/**
 * Get user display name
 */
export function getUserName(user) {
  if (!user) return 'User'
  const meta = user.user_metadata
  return meta?.nama || meta?.nis || user.email?.split('@')[0] || 'User'
}

/**
 * Get santri id_santri dari metadata
 */
export function getSantriId(user) {
  return user?.user_metadata?.id_santri || null
}

/**
 * Auth guard — redirect jika tidak login atau role salah
 * @param {string} requiredRole - 'admin' atau 'santri'
 * @param {string} redirectTo - URL redirect jika tidak authorized
 */
export async function requireAuth(requiredRole = null, redirectTo = '../index.html') {
  const session = await getSession()

  if (!session) {
    window.location.href = redirectTo
    return null
  }

  const user = session.user
  const role = getUserRole(user)

  if (requiredRole && role !== requiredRole) {
    window.location.href = redirectTo
    return null
  }

  return user
}
