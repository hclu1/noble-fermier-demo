-- ─────────────────────────────────────────────────────────────────────────────
-- Path: supabase/05_roles.sql
-- Séparation des rôles admin — shop_admin vs platform_admin
--
-- Exécuter après 02_rls.sql.
--
-- Contexte :
--   shop_admin     → gérant de la boutique (accès métier complet)
--   platform_admin → concepteur SaaS (accès structurel en plus)
--
-- Ce fichier fait trois choses :
--   1. Crée is_platform_admin() — fonction miroir de is_shop_admin()
--   2. Restreint la table branding au platform_admin uniquement
--   3. Ajoute la colonne primary_color dans shop_settings
--      pour que le shop_admin puisse modifier sa couleur principale
--      sans accéder au branding structurel
-- ─────────────────────────────────────────────────────────────────────────────


-- ═══════════════════════════════════════════════════════════════════════════
-- 1. FONCTION is_platform_admin()
--
-- Retourne TRUE uniquement pour platform_admin.
-- Utilisée dans les policies réservées au concepteur SaaS.
--
-- SECURITY DEFINER : même raison que is_shop_admin() —
-- évite la récursion infinie lors de la lecture de profiles (table avec RLS).
-- ═══════════════════════════════════════════════════════════════════════════

CREATE OR REPLACE FUNCTION is_platform_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM   profiles
    WHERE  id   = auth.uid()
    AND    role = 'platform_admin'
  );
$$;

COMMENT ON FUNCTION is_platform_admin IS
  'Retourne TRUE uniquement pour platform_admin (concepteur SaaS). '
  'Utilisé pour les policies réservées à la configuration structurelle.';


-- ═══════════════════════════════════════════════════════════════════════════
-- 2. BRANDING — restriction au platform_admin
--
-- Situation initiale (02_rls.sql) :
--   branding_update_admin → USING (is_shop_admin())
--   is_shop_admin() retourne TRUE pour shop_admin ET platform_admin
--   → le gérant peut modifier les couleurs structurelles et les polices
--
-- Nouvelle règle :
--   branding_update_admin → USING (is_platform_admin())
--   → seul le concepteur SaaS peut modifier le branding structurel
--
-- La lecture reste publique (inchangée) — le frontend a besoin des couleurs
-- pour rendre la page, même pour les visiteurs anonymes.
-- ═══════════════════════════════════════════════════════════════════════════

-- Supprimer l'ancienne policy d'écriture (créée dans 02_rls.sql)
DROP POLICY IF EXISTS "branding_update_admin" ON branding;

-- Nouvelle policy : écriture réservée au platform_admin uniquement
CREATE POLICY "branding_update_platform_admin"
  ON branding FOR UPDATE
  USING (is_platform_admin());

COMMENT ON POLICY "branding_update_platform_admin" ON branding IS
  'Seul platform_admin peut modifier le branding structurel (couleurs, polices, héro). '
  'shop_admin n''a pas accès à cette table.';


-- ═══════════════════════════════════════════════════════════════════════════
-- 3. SHOP_SETTINGS — ajout de la colonne primary_color
--
-- Pourquoi ici et pas dans branding ?
--   branding est maintenant verrouillé pour le platform_admin.
--   Pour permettre au shop_admin de personnaliser une couleur principale
--   (ex : couleur des boutons CTA, accent de marque),
--   on ajoute primary_color directement dans shop_settings,
--   table à laquelle le shop_admin a déjà accès en écriture (02_rls.sql).
--
-- Valeur par défaut : NULL
--   Le frontend utilise la valeur CSS variable par défaut si NULL.
--   Si renseignée, elle écrase la variable --color-primary au runtime.
-- ═══════════════════════════════════════════════════════════════════════════

ALTER TABLE shop_settings
  ADD COLUMN IF NOT EXISTS primary_color TEXT DEFAULT NULL;

COMMENT ON COLUMN shop_settings.primary_color IS
  'Couleur principale de la boutique (hex, ex: #2D6A4F). '
  'Si NULL, le frontend utilise la valeur par défaut du design system. '
  'Modifiable par shop_admin. Ne remplace pas le branding structurel.';
