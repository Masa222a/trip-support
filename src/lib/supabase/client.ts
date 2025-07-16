import { createBrowserClient } from "@supabase/ssr";

export function createClient(p0: string, p1: string) {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
