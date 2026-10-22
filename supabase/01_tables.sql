-- ─────────────────────────────────────────────────────────────────────────────
-- Path: supabase/01_tables.sql
-- Création des tables — socle générique primeur
--
-- Ordre de création : dépendances d'abord.
-- Exécuter ce fichier une seule fois sur un projet Supabase vierge.
-- Pour recommencer proprement : DROP SCHEMA public CASCADE; CREATE SCHEMA public;
-- ─────────────────────────────────────────────────────────────────────────────


-- ═══════════════════════════════════════════════════════════════════════════
-- 1. PROFILS UTILISATEURS
--    Extension de auth.users (géré par Supabase Auth).
--    Créé automatiquement à l'inscription via trigger (voir 03_triggers.sql).
-- ═══════════════════════════════════════════════════════════════════════════

CREATE TABLE profiles (
  id          UUID        PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role        TEXT        NOT NULL DEFAULT 'customer'
                          CHECK (role IN ('customer', 'shop_admin', 'platform_admin')),
  first_name  TEXT,
  last_name   TEXT,
  phone       TEXT,
  email       TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE  profiles            IS 'Profil public de chaque utilisateur Supabase Auth.';
COMMENT ON COLUMN profiles.role       IS 'customer = client, shop_admin = gérant, platform_admin = super admin SaaS.';


-- ═══════════════════════════════════════════════════════════════════════════
-- 2. ADRESSES
--    Adresses de livraison ou de retrait rattachées à un profil.
--    Un profil peut avoir plusieurs adresses.
-- ═══════════════════════════════════════════════════════════════════════════

CREATE TABLE addresses (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id  UUID        NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  label       TEXT,                           -- ex. : 'Domicile', 'Bureau'
  street      TEXT        NOT NULL,
  zip         TEXT        NOT NULL,
  city        TEXT        NOT NULL,
  is_default  BOOLEAN     NOT NULL DEFAULT FALSE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE  addresses            IS 'Adresses de livraison ou de retrait du client.';
COMMENT ON COLUMN addresses.is_default IS 'Une seule adresse par défaut par profil (géré côté applicatif).';


-- ═══════════════════════════════════════════════════════════════════════════
-- 3. RÉGLAGES DE LA BOUTIQUE
--    Une seule ligne par projet Supabase (une boutique = un projet).
--    Initialisée dans 04_seed.sql.
-- ═══════════════════════════════════════════════════════════════════════════

CREATE TABLE shop_settings (
  id             INTEGER     PRIMARY KEY DEFAULT 1,
  name           TEXT        NOT NULL DEFAULT 'Ma Boutique',
  tagline        TEXT,
  logo_url       TEXT,
  phone          TEXT,
  email          TEXT,
  address_street TEXT,
  address_zip    TEXT,
  address_city   TEXT,
  -- Tableau JSON : [{ "label": "Mardi–Samedi", "hours": "7h–13h" }, ...]
  opening_hours  JSONB       NOT NULL DEFAULT '[]',
  -- Tableau JSON : [{ "platform": "instagram", "url": "https://..." }, ...]
  social_links   JSONB       NOT NULL DEFAULT '[]',
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT single_row CHECK (id = 1)
);

COMMENT ON TABLE shop_settings IS 'Paramètres uniques de la boutique. Toujours une seule ligne (id = 1).';


-- ═══════════════════════════════════════════════════════════════════════════
-- 4. BRANDING
--    Identité visuelle de la boutique : couleurs, polices, image hero.
--    Une seule ligne par projet. Initialisée dans 04_seed.sql.
-- ═══════════════════════════════════════════════════════════════════════════

CREATE TABLE branding (
  id              INTEGER     PRIMARY KEY DEFAULT 1,
  primary_color   TEXT        NOT NULL DEFAULT '#2D6A4F',
  secondary_color TEXT        NOT NULL DEFAULT '#F4845F',
  background_color TEXT       NOT NULL DEFAULT '#FEFAE0',
  font_heading    TEXT        NOT NULL DEFAULT 'Playfair Display',
  font_body       TEXT        NOT NULL DEFAULT 'Nunito',
  hero_image_url  TEXT,
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT single_row CHECK (id = 1)
);

COMMENT ON TABLE branding IS 'Identité visuelle de la boutique. Toujours une seule ligne (id = 1).';


-- ═══════════════════════════════════════════════════════════════════════════
-- 5. CATÉGORIES
--    Rayons du magasin (Fruits, Légumes, Herbes…).
-- ═══════════════════════════════════════════════════════════════════════════

CREATE TABLE categories (
  id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  name       TEXT        NOT NULL,
  slug       TEXT        NOT NULL UNIQUE,
  image_url  TEXT,
  -- Ordre d'affichage dans le catalogue (0 = premier)
  "order"    INTEGER     NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE  categories         IS 'Rayons du magasin. Slug unique utilisé dans les URLs.';
COMMENT ON COLUMN categories."order" IS 'Ordre d''affichage croissant dans le catalogue.';


-- ═══════════════════════════════════════════════════════════════════════════
-- 6. PROMOTIONS
--    Règles de réduction applicables à des produits ou des catégories.
--    Les product_ids et category_ids sont des tableaux d'UUID (pas de FK
--    contrainte volontairement pour permettre des promotions futures).
-- ═══════════════════════════════════════════════════════════════════════════

CREATE TABLE promotions (
  id               UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  label            TEXT        NOT NULL,
  discount_percent INTEGER     NOT NULL
                               CHECK (discount_percent > 0 AND discount_percent <= 100),
  -- Produits et catégories ciblés (tableaux d'UUID)
  product_ids      UUID[]      NOT NULL DEFAULT '{}',
  category_ids     UUID[]      NOT NULL DEFAULT '{}',
  start_date       DATE,
  end_date         DATE,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE promotions IS 'Promotions actives ou planifiées. end_date NULL = sans expiration.';


-- ═══════════════════════════════════════════════════════════════════════════
-- 7. PRODUITS
--    Catalogue complet de la boutique.
--    promotion_id optionnel : réduction directe sur le produit.
-- ═══════════════════════════════════════════════════════════════════════════

CREATE TABLE products (
  id           UUID           PRIMARY KEY DEFAULT gen_random_uuid(),
  name         TEXT           NOT NULL,
  slug         TEXT           NOT NULL UNIQUE,
  description  TEXT,
  price        NUMERIC(10,2)  NOT NULL CHECK (price >= 0),
  unit         TEXT           NOT NULL DEFAULT 'kg',   -- kg, pièce, botte, barquette…
  category_id  UUID           REFERENCES categories(id) ON DELETE SET NULL,
  image_url    TEXT,
  is_featured  BOOLEAN        NOT NULL DEFAULT FALSE,  -- affiché en page d'accueil
  is_available BOOLEAN        NOT NULL DEFAULT TRUE,   -- masqué du catalogue si FALSE
  promotion_id UUID           REFERENCES promotions(id) ON DELETE SET NULL,
  created_at   TIMESTAMPTZ    NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ    NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE  products              IS 'Catalogue produits de la boutique.';
COMMENT ON COLUMN products.is_featured  IS 'Produit mis en avant sur la page d''accueil.';
COMMENT ON COLUMN products.is_available IS 'Produit visible dans le catalogue (FALSE = masqué).';
COMMENT ON COLUMN products.unit         IS 'Unité de vente : kg, pièce, botte, barquette, etc.';


-- ═══════════════════════════════════════════════════════════════════════════
-- 8. PAGES DE CONTENU
--    Pages statiques : À propos, Mentions légales, CGV, etc.
--    Le corps (body) contient du HTML nettoyé côté frontend.
-- ═══════════════════════════════════════════════════════════════════════════

CREATE TABLE content_pages (
  id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  slug       TEXT        NOT NULL UNIQUE,
  title      TEXT        NOT NULL,
  body       TEXT        NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE  content_pages      IS 'Pages de contenu statique (mentions légales, à propos…).';
COMMENT ON COLUMN content_pages.body IS 'HTML assaini par sanitizeHtml() avant chaque sauvegarde.';


-- ═══════════════════════════════════════════════════════════════════════════
-- 9. BANNIÈRES
--    Bannières promotionnelles affichées en page d'accueil ou catalogue.
-- ═══════════════════════════════════════════════════════════════════════════

CREATE TABLE banners (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  title       TEXT        NOT NULL,
  subtitle    TEXT,
  image_url   TEXT,
  link_url    TEXT,
  link_label  TEXT,
  is_active   BOOLEAN     NOT NULL DEFAULT TRUE,
  "order"     INTEGER     NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE  banners           IS 'Bannières promotionnelles. is_active = FALSE pour masquer sans supprimer.';
COMMENT ON COLUMN banners."order"   IS 'Ordre d''affichage croissant.';


-- ═══════════════════════════════════════════════════════════════════════════
-- 10. COMMANDES
--     Commandes passées par les clients connectés.
-- ═══════════════════════════════════════════════════════════════════════════

CREATE TABLE orders (
  id            UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id   UUID          NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  status        TEXT          NOT NULL DEFAULT 'pending'
                              CHECK (status IN (
                                'pending',    -- en attente de confirmation
                                'confirmed',  -- confirmée par le gérant
                                'ready',      -- prête à être retirée
                                'delivered',  -- remise au client
                                'cancelled'   -- annulée
                              )),
  total_price   NUMERIC(10,2) NOT NULL CHECK (total_price >= 0),
  delivery_mode TEXT          NOT NULL DEFAULT 'pickup'
                              CHECK (delivery_mode IN ('pickup', 'delivery')),
  note          TEXT,
  created_at    TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE  orders               IS 'Commandes des clients. Le statut est mis à jour par le gérant.';
COMMENT ON COLUMN orders.total_price   IS 'Total calculé au moment de la commande. Ne change pas si les prix changent.';
COMMENT ON COLUMN orders.delivery_mode IS 'pickup = retrait en boutique, delivery = livraison à domicile.';


-- ═══════════════════════════════════════════════════════════════════════════
-- 11. LIGNES DE COMMANDE
--     Chaque produit commandé dans une commande.
--     Le nom et le prix sont copiés au moment de la commande
--     pour garder un historique stable même si le produit change.
-- ═══════════════════════════════════════════════════════════════════════════

CREATE TABLE order_items (
  id          UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id    UUID          NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  -- product_id peut devenir NULL si le produit est supprimé (SET NULL intentionnel)
  product_id  UUID          REFERENCES products(id) ON DELETE SET NULL,
  -- Snapshot : nom et prix au moment de la commande
  name        TEXT          NOT NULL,
  unit        TEXT          NOT NULL,
  price       NUMERIC(10,2) NOT NULL CHECK (price >= 0),
  quantity    NUMERIC(10,3) NOT NULL CHECK (quantity > 0),
  created_at  TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE  order_items      IS 'Lignes d''une commande. Snapshot du produit au moment de l''achat.';
COMMENT ON COLUMN order_items.name IS 'Nom du produit copié à la commande — stable même si le produit est renommé.';
COMMENT ON COLUMN order_items.price IS 'Prix unitaire copié à la commande — stable même si le prix change.';
