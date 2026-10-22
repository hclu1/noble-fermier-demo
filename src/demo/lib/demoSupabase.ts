// Path: src/demo/lib/demoSupabase.ts

import { createClient } from '@supabase/supabase-js'

// ─────────────────────────────────────────────
// Client Supabase Démo — Totalement isolé
//
// Les clés de démo peuvent être configurées via :
//   VITE_DEMO_SUPABASE_URL ou fallback sur VITE_SUPABASE_URL
//   VITE_DEMO_SUPABASE_ANON_KEY ou fallback sur VITE_SUPABASE_ANON_KEY
//
// Si aucune clé n'est fournie, le mode démo utilise
// le dataset local garanti sans plantage (demoSeedData).
// ─────────────────────────────────────────────

const demoSupabaseUrl = (import.meta.env.VITE_DEMO_SUPABASE_URL || import.meta.env.VITE_SUPABASE_URL) as string | undefined
const demoSupabaseKey = (import.meta.env.VITE_DEMO_SUPABASE_ANON_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY) as string | undefined

export const isDemoMockMode = !demoSupabaseUrl || !demoSupabaseKey

const PLACEHOLDER_URL = 'https://demo-placeholder.supabase.co'
const PLACEHOLDER_KEY = 'demo-placeholder-key'

export const demoSupabase = createClient(
  demoSupabaseUrl ?? PLACEHOLDER_URL,
  demoSupabaseKey ?? PLACEHOLDER_KEY
)

export type DemoQueryResult<T> =
  | { data: T; error: null }
  | { data: null; error: string }
