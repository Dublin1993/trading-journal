// Supabase is loaded via CDN in index.html as window.supabase
const { createClient } = window.supabase

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
)
