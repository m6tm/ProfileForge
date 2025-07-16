import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      realtime: {
        params: {
          eventsPerSecond: 10
        },
        log_level: 'error' as const
      }
    }
  )
}

export async function signOut() {
  const supabase = createClient();
  await supabase.auth.signOut();
}