-- ─────────────────────────────────────────────────────────────────────────────
-- Path: supabase/02_rls.sql
-- Row Level Security — protection des données par rôle
--
-- Exécuter après 01_tables.sql.
--
-- Rôles utilisés :
--   customer        — client connecté (lecture propre + gestion de ses données)
--   shop_admin      — gérant de la boutique (accès total)
--   platform_admin  — super admin SaaS (accès total, réservé pour usage futur)
--
-- Principe général :
--   - Données publiques (catalogue, contenu, boutique) → lecture par tous, y compris anonymes
--   - Données privées (commandes, profils) → lecture uniquement par le propriétaire
--   - Écriture → shop_admin uniquement, sauf exceptions explicites
--   - La RLS est la vraie sécurité ; les vérifications frontend ne sont que de l'UX
-- ─────────────────────────────────────────────────────────────────────────────


-- ═══════════════════════════════════════════════════════════════════════════
-- ACTIVATION RLS SUR TOUTES LES TABLES
-- ═══════════════════════════════════════════════════════════════════════════

ALTER TABLE profiles      ENABLE ROW LEVEL SECURITY;
ALTER TABLE addresses     ENABLE ROW LEVEL SECURITY;
ALTER TABLE shop_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE branding      ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories    ENABLE ROW LEVEL SECURITY;
ALTER TABLE promotions    ENABLE ROW LEVEL SECURITY;
ALTER TABLE products      ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE banners       ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders        ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items   ENABLE ROW LEVEL SECURITY;


-- ═══════════════════════════════════════════════════════════════════════════
-- FONCTION UTILITAIRE : is_shop_admin()
--
-- Retourne TRUE si l'utilisateur connecté est shop_admin ou platform_admin.
-- SECURITY DEFINER : s'exécute avec les droits du propriétaire de la fonction
-- pour éviter la récursion infinie (la fonction lit profiles, qui a RLS activée).
-- ═══════════════════════════════════════════════════════════════════════════

CREATE OR REPLACE FUNCTION is_shop_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM   profiles
    WHERE  id   = auth.uid()
    AND    role IN ('shop_admin', 'platform_admin')
  );
$$;

COMMENT ON FUNCTION is_shop_admin IS
  'Retourne TRUE si l''utilisateur connecté est shop_admin ou platform_admin.';


-- ═══════════════════════════════════════════════════════════════════════════
-- PROFILES
--
-- - Chaque client lit et modifie son propre profil.
-- - shop_admin peut tout lire et modifier (pour la gestion des clients).
-- - L'insertion est réservée au trigger create_profile_on_signup (SECURITY DEFINER).
-- ═══════════════════════════════════════════════════════════════════════════

-- Le client lit son propre profil
CREATE POLICY "profiles_select_own"
  ON profiles FOR SELECT
  USING (auth.uid() = id OR is_shop_admin());

-- Le client met à jour son propre profil
CREATE POLICY "profiles_update_own"
  ON profiles FOR UPDATE
  USING (auth.uid() = id OR is_shop_admin());

-- Le shop_admin peut supprimer un profil (ex : RGPD)
CREATE POLICY "profiles_delete_admin"
  ON profiles FOR DELETE
  USING (is_shop_admin());

-- Insertion réservée au trigger (SECURITY DEFINER) — aucun INSERT direct autorisé


-- ═══════════════════════════════════════════════════════════════════════════
-- ADDRESSES
--
-- - Un client gère uniquement ses propres adresses.
-- - shop_admin peut tout lire.
-- ═══════════════════════════════════════════════════════════════════════════

CREATE POLICY "addresses_select_own"
  ON addresses FOR SELECT
  USING (profile_id = auth.uid() OR is_shop_admin());

CREATE POLICY "addresses_insert_own"
  ON addresses FOR INSERT
  WITH CHECK (profile_id = auth.uid());

CREATE POLICY "addresses_update_own"
  ON addresses FOR UPDATE
  USING (profile_id = auth.uid() OR is_shop_admin());

CREATE POLICY "addresses_delete_own"
  ON addresses FOR DELETE
  USING (profile_id = auth.uid() OR is_shop_admin());


-- ═══════════════════════════════════════════════════════════════════════════
-- SHOP_SETTINGS
--
-- - Lecture publique (nécessaire pour afficher nom, adresse, horaires).
-- - Écriture réservée au shop_admin.
-- ═══════════════════════════════════════════════════════════════════════════

CREATE POLICY "shop_settings_select_public"
  ON shop_settings FOR SELECT
  USING (TRUE);

CREATE POLICY "shop_settings_update_admin"
  ON shop_settings FOR UPDATE
  USING (is_shop_admin());


-- ═══════════════════════════════════════════════════════════════════════════
-- BRANDING
--
-- - Lecture publique (couleurs et polices nécessaires au rendu).
-- - Écriture réservée au shop_admin.
-- ═══════════════════════════════════════════════════════════════════════════

CREATE POLICY "branding_select_public"
  ON branding FOR SELECT
  USING (TRUE);

CREATE POLICY "branding_update_admin"
  ON branding FOR UPDATE
  USING (is_shop_admin());


-- ═══════════════════════════════════════════════════════════════════════════
-- CATEGORIES
--
-- - Lecture publique.
-- - Écriture réservée au shop_admin.
-- ═══════════════════════════════════════════════════════════════════════════

CREATE POLICY "categories_select_public"
  ON categories FOR SELECT
  USING (TRUE);

CREATE POLICY "categories_insert_admin"
  ON categories FOR INSERT
  WITH CHECK (is_shop_admin());

CREATE POLICY "categories_update_admin"
  ON categories FOR UPDATE
  USING (is_shop_admin());

CREATE POLICY "categories_delete_admin"
  ON categories FOR DELETE
  USING (is_shop_admin());


-- ═══════════════════════════════════════════════════════════════════════════
-- PROMOTIONS
--
-- - Lecture publique (promotions affichées sur le site).
-- - Écriture réservée au shop_admin.
-- ═══════════════════════════════════════════════════════════════════════════

CREATE POLICY "promotions_select_public"
  ON promotions FOR SELECT
  USING (TRUE);

CREATE POLICY "promotions_insert_admin"
  ON promotions FOR INSERT
  WITH CHECK (is_shop_admin());

CREATE POLICY "promotions_update_admin"
  ON promotions FOR UPDATE
  USING (is_shop_admin());

CREATE POLICY "promotions_delete_admin"
  ON promotions FOR DELETE
  USING (is_shop_admin());


-- ═══════════════════════════════════════════════════════════════════════════
-- PRODUCTS
--
-- - Lecture publique (catalogue accessible sans connexion).
-- - Écriture réservée au shop_admin.
-- ═══════════════════════════════════════════════════════════════════════════

CREATE POLICY "products_select_public"
  ON products FOR SELECT
  USING (TRUE);

CREATE POLICY "products_insert_admin"
  ON products FOR INSERT
  WITH CHECK (is_shop_admin());

CREATE POLICY "products_update_admin"
  ON products FOR UPDATE
  USING (is_shop_admin());

CREATE POLICY "products_delete_admin"
  ON products FOR DELETE
  USING (is_shop_admin());


-- ═══════════════════════════════════════════════════════════════════════════
-- CONTENT_PAGES
--
-- - Lecture publique (pages légales accessibles sans connexion).
-- - Écriture réservée au shop_admin.
-- ═══════════════════════════════════════════════════════════════════════════

CREATE POLICY "content_pages_select_public"
  ON content_pages FOR SELECT
  USING (TRUE);

CREATE POLICY "content_pages_insert_admin"
  ON content_pages FOR INSERT
  WITH CHECK (is_shop_admin());

CREATE POLICY "content_pages_update_admin"
  ON content_pages FOR UPDATE
  USING (is_shop_admin());

CREATE POLICY "content_pages_delete_admin"
  ON content_pages FOR DELETE
  USING (is_shop_admin());


-- ═══════════════════════════════════════════════════════════════════════════
-- BANNERS
--
-- - Lecture publique (bannières affichées sur le site).
-- - Écriture réservée au shop_admin.
-- ═══════════════════════════════════════════════════════════════════════════

CREATE POLICY "banners_select_public"
  ON banners FOR SELECT
  USING (TRUE);

CREATE POLICY "banners_insert_admin"
  ON banners FOR INSERT
  WITH CHECK (is_shop_admin());

CREATE POLICY "banners_update_admin"
  ON banners FOR UPDATE
  USING (is_shop_admin());

CREATE POLICY "banners_delete_admin"
  ON banners FOR DELETE
  USING (is_shop_admin());


-- ═══════════════════════════════════════════════════════════════════════════
-- ORDERS
--
-- - Un client lit et crée ses propres commandes.
-- - Le shop_admin lit et modifie toutes les commandes (gestion des statuts).
-- - Suppression réservée au shop_admin.
-- ═══════════════════════════════════════════════════════════════════════════

-- Lecture : client voit ses commandes, admin voit tout
CREATE POLICY "orders_select"
  ON orders FOR SELECT
  USING (customer_id = auth.uid() OR is_shop_admin());

-- Insertion : client crée ses propres commandes uniquement
CREATE POLICY "orders_insert_own"
  ON orders FOR INSERT
  WITH CHECK (customer_id = auth.uid());

-- Mise à jour : réservée au shop_admin (changements de statut)
CREATE POLICY "orders_update_admin"
  ON orders FOR UPDATE
  USING (is_shop_admin());

-- Suppression : réservée au shop_admin
CREATE POLICY "orders_delete_admin"
  ON orders FOR DELETE
  USING (is_shop_admin());


-- ═══════════════════════════════════════════════════════════════════════════
-- ORDER_ITEMS
--
-- - Un client lit les lignes de ses propres commandes (via sous-requête orders).
-- - Le shop_admin lit tout.
-- - Insertion : client uniquement, et uniquement pour ses propres commandes.
-- ═══════════════════════════════════════════════════════════════════════════

-- Lecture : client voit ses lignes, admin voit tout
CREATE POLICY "order_items_select"
  ON order_items FOR SELECT
  USING (
    is_shop_admin()
    OR
    order_id IN (
      SELECT id FROM orders WHERE customer_id = auth.uid()
    )
  );

-- Insertion : client uniquement, sur ses propres commandes
CREATE POLICY "order_items_insert_own"
  ON order_items FOR INSERT
  WITH CHECK (
    order_id IN (
      SELECT id FROM orders WHERE customer_id = auth.uid()
    )
  );

-- Mise à jour et suppression : réservées au shop_admin
CREATE POLICY "order_items_update_admin"
  ON order_items FOR UPDATE
  USING (is_shop_admin());

CREATE POLICY "order_items_delete_admin"
  ON order_items FOR DELETE
  USING (is_shop_admin());
