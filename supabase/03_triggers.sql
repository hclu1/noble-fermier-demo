-- ─────────────────────────────────────────────────────────────────────────────
-- Path: supabase/03_triggers.sql
-- Triggers — automatisations côté base de données
--
-- Exécuter après 02_rls.sql.
--
-- Deux responsabilités :
--   1. Mettre à jour updated_at automatiquement à chaque modification
--   2. Créer le profil utilisateur automatiquement à l'inscription
-- ─────────────────────────────────────────────────────────────────────────────


-- ═══════════════════════════════════════════════════════════════════════════
-- FONCTION : set_updated_at()
--
-- Utilisée par tous les triggers updated_at.
-- Modifie NEW.updated_at avant l'UPDATE, puis retourne NEW.
-- ═══════════════════════════════════════════════════════════════════════════

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

COMMENT ON FUNCTION set_updated_at IS
  'Met à jour updated_at avant chaque UPDATE. Utilisée par tous les triggers updated_at.';


-- ═══════════════════════════════════════════════════════════════════════════
-- TRIGGERS updated_at — appliqués à toutes les tables concernées
-- ═══════════════════════════════════════════════════════════════════════════

CREATE TRIGGER trg_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_shop_settings_updated_at
  BEFORE UPDATE ON shop_settings
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_branding_updated_at
  BEFORE UPDATE ON branding
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_promotions_updated_at
  BEFORE UPDATE ON promotions
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_content_pages_updated_at
  BEFORE UPDATE ON content_pages
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_banners_updated_at
  BEFORE UPDATE ON banners
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- Note : order_items n'a pas de updated_at (les lignes ne sont jamais modifiées,
-- seulement créées ou supprimées avec la commande).


-- ═══════════════════════════════════════════════════════════════════════════
-- FONCTION : create_profile_on_signup()
--
-- Crée automatiquement une ligne dans profiles dès qu'un utilisateur
-- s'inscrit via Supabase Auth.
--
-- SECURITY DEFINER : s'exécute avec les droits du propriétaire de la fonction,
-- ce qui permet d'insérer dans profiles malgré la RLS (qui bloque les INSERT
-- directs pour les clients).
-- ═══════════════════════════════════════════════════════════════════════════

CREATE OR REPLACE FUNCTION create_profile_on_signup()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, role)
  VALUES (
    NEW.id,
    NEW.email,
    'customer'   -- rôle par défaut à l'inscription
  );
  RETURN NEW;
END;
$$;

COMMENT ON FUNCTION create_profile_on_signup IS
  'Crée le profil utilisateur dans public.profiles lors de chaque inscription Supabase Auth.';


-- ═══════════════════════════════════════════════════════════════════════════
-- TRIGGER : sur auth.users — déclenché après chaque inscription
-- ═══════════════════════════════════════════════════════════════════════════

CREATE TRIGGER trg_create_profile_on_signup
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION create_profile_on_signup();
