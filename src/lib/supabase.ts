// Path: src/lib/supabase.ts

import { createClient } from '@supabase/supabase-js'

// ─────────────────────────────────────────────
// Client Supabase — utilisé dans toute l'application
//
// Les valeurs viennent de .env.local (jamais commitées)
// Copier .env.example → .env.local et remplir les valeurs
// ─────────────────────────────────────────────

const supabaseUrl  = import.meta.env.VITE_SUPABASE_URL  as string
const supabaseKey  = import.meta.env.VITE_SUPABASE_ANON_KEY as string

// En développement sans .env.local : avertissement console uniquement.
// L'app démarre quand même avec les données mock.
// Les requêtes Supabase échoueront proprement (QueryResult.error non null).
if (!supabaseUrl || !supabaseKey) {
  console.warn(
    '[Supabase] Variables manquantes : VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY.\n' +
    'Copiez .env.example en .env.local pour activer la base de données.\n' +
    "L'app fonctionne en mode mock sans ces variables."
  )
}

// true en DEV quand VITE_SUPABASE_URL n'est pas configuré
// Utilisé dans les fichiers de requêtes pour retourner les mocks à la place de Supabase
export const isMockMode = !supabaseUrl || !supabaseKey

// Valeurs fictives pour que createClient ne plante pas si les variables sont absentes.
// Les requêtes retourneront les mocks — comportement attendu en mode dev sans .env.local.
const PLACEHOLDER_URL = 'https://placeholder.supabase.co'
const PLACEHOLDER_KEY = 'placeholder'

export const supabase = createClient(
  supabaseUrl ?? PLACEHOLDER_URL,
  supabaseKey ?? PLACEHOLDER_KEY
)

// ─────────────────────────────────────────────
// Type utilitaire pour les retours de requêtes
// Toutes les fonctions de src/lib/queries/ retournent ce type
// ─────────────────────────────────────────────
export type QueryResult<T> =
  | { data: T;    error: null   }
  | { data: null; error: string }
