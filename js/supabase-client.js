import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// ============================================================
// SUPABASE CLIENT CONFIGURATION
// Ganti dengan URL dan ANON KEY dari Supabase Dashboard
// Settings > API > Project URL & Project API keys (anon/public)
// ============================================================

const SUPABASE_URL = 'https://irbhaexdtdbzzygfyqtb.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlyYmhhZXhkdGRienp5Z2Z5cXRiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUxODYzMDcsImV4cCI6MjA5MDc2MjMwN30.4UVV4SygN6v_cGwA3EDkIJCar56GUE3YxaC_fGD9euU'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

// Domain untuk fake email (NIS-based login)
export const EMAIL_DOMAIN = '@pesantren.local'

// Helper: Konversi NIS/username ke format email
export function toEmail(identifier) {
  if (identifier.includes('@')) return identifier
  return `${identifier}${EMAIL_DOMAIN}`
}

// Helper: Ekstrak NIS/username dari email
export function fromEmail(email) {
  return email.replace(EMAIL_DOMAIN, '')
}
