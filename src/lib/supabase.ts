import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
)

// 0618ca011505ca6c9cf7ce03cc7c7459

// 7ae9c8a09698d6d1a00edc420b1329fadd367cdf340eeaae7c00931228b466ba
