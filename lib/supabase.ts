import { createClient, type SupabaseClient } from "@supabase/supabase-js"
import { getPublicEnv } from "@/lib/env"

let client: SupabaseClient | null = null

/**
 * Lazily-created browser Supabase client.
 *
 * Created on first access rather than at module load so that importing this
 * module (e.g. during `next build` / prerender) does not require the env to be
 * present. Env is validated via `getPublicEnv()` on first real use.
 */
export function getSupabaseClient(): SupabaseClient {
  if (client) return client
  const { NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY } = getPublicEnv()
  client = createClient(NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY)
  return client
}
