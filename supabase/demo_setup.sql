-- ─────────────────────────────────────────────────────────────────────────────
-- Path: supabase/demo_setup.sql
-- CONFIGURATION ET JEU DE DONNÉES DU MODE DÉMO (ISOLATION STRICTE)
--
-- RÈGLE ABSOLUE :
-- Ce script crée uniquement des tables avec le préfixe demo_*.
-- Il ne modifie, n'altère et n'accède à AUCUNE table de production.
--
-- SÉCURITÉ :
-- Toutes les tables demo_* ont Row Level Security (RLS) activée.
-- Seule la lecture (SELECT) est accordée au rôle public/anonyme.
-- Toutes les écritures (INSERT, UPDATE, DELETE) sont rejetées par PostgreSQL.
-- ─────────────────────────────────────────────────────────────────────────────

-- ═══════════════════════════════════════════════════════════════════════════
-- 0. RÉINITIALISATION PROPRE DES TABLES DÉMO (SI DÉJÀ EXISTANTES)
-- ═══════════════════════════════════════════════════════════════════════════

DROP TABLE IF EXISTS demo_order_items   CASCADE;
DROP TABLE IF EXISTS demo_orders        CASCADE;
DROP TABLE IF EXISTS demo_products      CASCADE;
DROP TABLE IF EXISTS demo_promotions    CASCADE;
DROP TABLE IF EXISTS demo_categories    CASCADE;
DROP TABLE IF EXISTS demo_shop_settings CASCADE;
DROP TABLE IF EXISTS demo_branding      CASCADE;


-- ═══════════════════════════════════════════════════════════════════════════
-- 1. TABLES DÉMO
-- ═══════════════════════════════════════════════════════════════════════════

-- ─── 1.1 Catégories Démo ───
CREATE TABLE demo_categories (
  id         TEXT PRIMARY KEY,
  name       TEXT NOT NULL,
  slug       TEXT NOT NULL UNIQUE,
  image_url  TEXT,
  "order"    INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── 1.2 Promotions Démo ───
CREATE TABLE demo_promotions (
  id               TEXT PRIMARY KEY,
  label            TEXT NOT NULL,
  discount_percent INTEGER NOT NULL CHECK (discount_percent > 0 AND discount_percent <= 100),
  product_ids      TEXT[] NOT NULL DEFAULT '{}',
  category_ids     TEXT[] NOT NULL DEFAULT '{}',
  start_date       DATE,
  end_date         DATE,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── 1.3 Produits Démo ───
CREATE TABLE demo_products (
  id           TEXT PRIMARY KEY,
  name         TEXT NOT NULL,
  slug         TEXT NOT NULL UNIQUE,
  description  TEXT,
  price        NUMERIC(10,2) NOT NULL CHECK (price >= 0),
  unit         TEXT NOT NULL DEFAULT 'kg',
  category_id  TEXT REFERENCES demo_categories(id) ON DELETE SET NULL,
  image_url    TEXT,
  is_featured  BOOLEAN NOT NULL DEFAULT FALSE,
  is_available BOOLEAN NOT NULL DEFAULT TRUE,
  promotion_id TEXT REFERENCES demo_promotions(id) ON DELETE SET NULL,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── 1.4 Réglages Boutique Démo ───
CREATE TABLE demo_shop_settings (
  id             INTEGER PRIMARY KEY DEFAULT 1,
  name           TEXT NOT NULL,
  tagline        TEXT,
  logo_url       TEXT,
  phone          TEXT,
  email          TEXT,
  address_street TEXT,
  address_zip    TEXT,
  address_city   TEXT,
  opening_hours  JSONB NOT NULL DEFAULT '[]',
  social_links   JSONB NOT NULL DEFAULT '[]',
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT demo_settings_single CHECK (id = 1)
);

-- ─── 1.5 Branding Démo ───
CREATE TABLE demo_branding (
  id              INTEGER PRIMARY KEY DEFAULT 1,
  primary_color   TEXT NOT NULL DEFAULT '#2D6A4F',
  secondary_color TEXT NOT NULL DEFAULT '#D97706',
  background_color TEXT NOT NULL DEFAULT '#FDFBF7',
  font_heading    TEXT NOT NULL DEFAULT 'Playfair Display',
  font_body       TEXT NOT NULL DEFAULT 'Nunito',
  hero_image_url  TEXT,
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT demo_branding_single CHECK (id = 1)
);

-- ─── 1.6 Commandes Démo ───
CREATE TABLE demo_orders (
  id            TEXT PRIMARY KEY,
  customer_name TEXT NOT NULL,
  status        TEXT NOT NULL DEFAULT 'confirmed'
                CHECK (status IN ('pending', 'confirmed', 'ready', 'delivered', 'cancelled')),
  total_price   NUMERIC(10,2) NOT NULL CHECK (total_price >= 0),
  delivery_mode TEXT NOT NULL DEFAULT 'pickup',
  note          TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── 1.7 Lignes de Commandes Démo ───
CREATE TABLE demo_order_items (
  id          TEXT PRIMARY KEY,
  order_id    TEXT NOT NULL REFERENCES demo_orders(id) ON DELETE CASCADE,
  product_id  TEXT REFERENCES demo_products(id) ON DELETE SET NULL,
  name        TEXT NOT NULL,
  unit        TEXT NOT NULL,
  price       NUMERIC(10,2) NOT NULL CHECK (price >= 0),
  quantity    NUMERIC(10,3) NOT NULL CHECK (quantity > 0),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


-- ═══════════════════════════════════════════════════════════════════════════
-- 2. POLICIES RLS (LECTURE SEULE STRICTE POUR TOUS LES UTILISATEURS)
-- ═══════════════════════════════════════════════════════════════════════════

ALTER TABLE demo_categories    ENABLE ROW LEVEL SECURITY;
ALTER TABLE demo_promotions    ENABLE ROW LEVEL SECURITY;
ALTER TABLE demo_products      ENABLE ROW LEVEL SECURITY;
ALTER TABLE demo_shop_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE demo_branding      ENABLE ROW LEVEL SECURITY;
ALTER TABLE demo_orders        ENABLE ROW LEVEL SECURITY;
ALTER TABLE demo_order_items   ENABLE ROW LEVEL SECURITY;

-- Autorisation exclusive de SELECT
CREATE POLICY "RLS_Demo_Categories_Select"    ON demo_categories    FOR SELECT TO public USING (true);
CREATE POLICY "RLS_Demo_Promotions_Select"    ON demo_promotions    FOR SELECT TO public USING (true);
CREATE POLICY "RLS_Demo_Products_Select"      ON demo_products      FOR SELECT TO public USING (true);
CREATE POLICY "RLS_Demo_ShopSettings_Select"  ON demo_shop_settings FOR SELECT TO public USING (true);
CREATE POLICY "RLS_Demo_Branding_Select"      ON demo_branding      FOR SELECT TO public USING (true);
CREATE POLICY "RLS_Demo_Orders_Select"        ON demo_orders        FOR SELECT TO public USING (true);
CREATE POLICY "RLS_Demo_OrderItems_Select"    ON demo_order_items   FOR SELECT TO public USING (true);

-- REMARQUE : Aucune policy INSERT, UPDATE ou DELETE n'est créée.
-- Par défaut dans Supabase/PostgreSQL, tout ce qui n'est pas permis par une policy est REFUSÉ.


-- ═══════════════════════════════════════════════════════════════════════════
-- 3. JEU DE DONNÉES RÉALISTE ET COHÉRENT (SEED DATA DÉMO)
-- ═══════════════════════════════════════════════════════════════════════════

-- Catégories
INSERT INTO demo_categories (id, name, slug, image_url, "order") VALUES
  ('cat-1', 'Fruits de saison', 'fruits-de-saison', 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=1200&q=80', 1),
  ('cat-2', 'Légumes de pleine terre', 'legumes-de-pleine-terre', 'https://images.unsplash.com/photo-1566385101042-1a0aa0c1268c?auto=format&fit=crop&w=1200&q=80', 2),
  ('cat-3', 'Agrumes & Vergers du Sud', 'agrumes-vergers-du-sud', 'https://images.unsplash.com/photo-1582979512210-99b6a53386f9?auto=format&fit=crop&w=1200&q=80', 3),
  ('cat-4', 'Herbes aromatiques & Salades', 'herbes-aromatiques-salades', 'https://images.unsplash.com/photo-1628556270448-4d4e4148e1b1?auto=format&fit=crop&w=1200&q=80', 4),
  ('cat-5', 'Paniers Maraîchers composés', 'paniers-maraichers-composes', 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80', 5);

-- Promotions
INSERT INTO demo_promotions (id, label, discount_percent, product_ids, category_ids) VALUES
  ('promo-1', 'Offre Fraîcheur Maraîchère', 15, ARRAY['prod-3', 'prod-7', 'prod-27'], '{}'),
  ('promo-2', 'Semaine Spéciale Agrumes', 20, ARRAY['prod-4', 'prod-5'], ARRAY['cat-3']);

-- Produits (28 articles réalistes du terroir)
INSERT INTO demo_products (id, name, slug, description, price, unit, category_id, image_url, is_featured, is_available, promotion_id) VALUES
  ('prod-1', 'Pommes Chantecler du Verger d’Anjou', 'pommes-chantecler-verger-anjou', 'Pomme fondante, acidulée et très parfumée. Récoltée à la main en verger éco-responsable.', 3.40, 'kg', 'cat-1', 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=600&q=80', TRUE, TRUE, NULL),
  ('prod-2', 'Poires Conférence de Savoie', 'poires-conference-savoie', 'Chair fine, juteuse et sucrée. Parfaites au couteau ou pochées aux épices.', 3.80, 'kg', 'cat-1', 'https://images.unsplash.com/photo-1514756331096-242fdeb70d4a?auto=format&fit=crop&w=600&q=80', FALSE, TRUE, NULL),
  ('prod-3', 'Clémentines de Corse IGP avec feuilles', 'clementines-corse-igp-feuilles', 'Sans pépin, juteuse avec un équilibre sucre/acidité exceptionnel.', 4.90, 'kg', 'cat-3', 'https://images.unsplash.com/photo-1582979512210-99b6a53386f9?auto=format&fit=crop&w=600&q=80', TRUE, TRUE, 'promo-1'),
  ('prod-4', 'Oranges sanguines Moro de Sicile', 'oranges-sanguines-moro-sicile', 'Chair pourpre intense, riche en antioxydants. Arôme profond de fruits rouges.', 3.90, 'kg', 'cat-3', 'https://images.unsplash.com/photo-1587132137056-bfbf0166836e?auto=format&fit=crop&w=600&q=80', TRUE, TRUE, 'promo-2'),
  ('prod-5', 'Citrons jaunes non traités de Menton', 'citrons-jaunes-menton', 'Peau riche en huiles essentielles parfumées. Idéal pour pâtisserie et jus.', 4.50, 'kg', 'cat-3', 'https://images.unsplash.com/photo-1533038590840-1cde6e668a91?auto=format&fit=crop&w=600&q=80', FALSE, TRUE, 'promo-2'),
  ('prod-6', 'Fraises Mara des Bois de Carpentras', 'fraises-mara-des-bois-carpentras', 'Parfum envoûtant rappelant la fraise des bois. Barquette de 250g.', 4.80, 'barquette', 'cat-1', 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?auto=format&fit=crop&w=600&q=80', TRUE, TRUE, NULL),
  ('prod-7', 'Framboises fraîches de Corrèze', 'framboises-fraiches-correze', 'Baies délicates et veloutées, cueillies à l’aube. Barquette de 125g.', 3.90, 'barquette', 'cat-1', 'https://images.unsplash.com/photo-1577069808021-5a02479e0f63?auto=format&fit=crop&w=600&q=80', FALSE, TRUE, 'promo-1'),
  ('prod-8', 'Raisin Muscat du Ventoux AOP', 'raisin-muscat-du-ventoux', 'Grains bleutés bien croquants, saveur musquée inimitable.', 5.20, 'kg', 'cat-1', 'https://images.unsplash.com/photo-1537640538966-79f369143f8f?auto=format&fit=crop&w=600&q=80', FALSE, TRUE, NULL),
  ('prod-9', 'Carottes des sables de Créances Label Rouge', 'carottes-des-sables-creances', 'Cultivées en pleine terre sableuse en Normandie. Chair tendre et sucrée.', 2.60, 'botte', 'cat-2', 'https://images.unsplash.com/photo-1598170845058-32b9d6a5c317?auto=format&fit=crop&w=600&q=80', TRUE, TRUE, NULL),
  ('prod-10', 'Poireaux primeurs de plein champ', 'poireaux-primeurs-plein-champ', 'Fut blanc bien développé, feuille tendre. Récolte maraîchère.', 2.80, 'kg', 'cat-2', 'https://images.unsplash.com/photo-1587049352847-4a222e784d38?auto=format&fit=crop&w=600&q=80', FALSE, TRUE, NULL),
  ('prod-11', 'Pommes de terre Charlotte de Noirmoutier', 'pommes-de-terre-charlotte-noirmoutier', 'Chair ferme, goût de noisette délicat. Cuisson vapeur ou rissolée.', 3.20, 'kg', 'cat-2', 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=600&q=80', TRUE, TRUE, NULL),
  ('prod-12', 'Tomates anciennes Cœur de Bœuf de Marmande', 'tomates-anciennes-coeur-de-boeuf', 'Variété ancienne, charnue et peu grainée. Parfum authentique.', 4.90, 'kg', 'cat-2', 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=600&q=80', TRUE, TRUE, NULL),
  ('prod-13', 'Courgettes vertes maraîchères de Provence', 'courgettes-vertes-provence', 'Courgettes fines sans amertume, cueillies jeunes le matin.', 2.90, 'kg', 'cat-2', 'https://images.unsplash.com/photo-1563865436874-9aef32095fad?auto=format&fit=crop&w=600&q=80', FALSE, TRUE, NULL),
  ('prod-14', 'Aubergines violettes de Barbentane', 'aubergines-violettes-barbentane', 'Peau satinée, chair fondante parfaite pour ratatouille confite.', 3.40, 'kg', 'cat-2', 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=600&q=80', FALSE, TRUE, NULL),
  ('prod-15', 'Épinards frais d’automne en branches', 'epinards-frais-automne', 'Feuilles croquantes et charnues. Riches en minéraux.', 4.20, 'kg', 'cat-2', 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=600&q=80', FALSE, TRUE, NULL),
  ('prod-16', 'Mâche nantaise d’antan bio', 'mache-nantaise-bio', 'Feuilles bien vertes en petites rosettes tendres. Barquette 150g.', 2.50, 'barquette', 'cat-4', 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80', FALSE, TRUE, NULL),
  ('prod-17', 'Salade Batavia blonde croquante', 'salade-batavia-blonde', 'Pomme volumineuse et feuilles gaufrées très croquantes.', 1.60, 'pièce', 'cat-4', 'https://images.unsplash.com/photo-1556801712-76c8eb07bbc9?auto=format&fit=crop&w=600&q=80', FALSE, TRUE, NULL),
  ('prod-18', 'Champignons de Paris bruns de Saumur', 'champignons-paris-bruns-saumur', 'Ferme sous la dent, saveur de sous-bois. Barquette 250g.', 2.90, 'barquette', 'cat-2', 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=80', FALSE, TRUE, NULL),
  ('prod-19', 'Potimarron bio de la Vallée du Rhône', 'potimarron-bio-vallee-du-rhone', 'Saveur châtaigne très onctueuse. Peau fine comestible.', 3.10, 'pièce', 'cat-2', 'https://images.unsplash.com/photo-1508747703725-719777637510?auto=format&fit=crop&w=600&q=80', TRUE, TRUE, NULL),
  ('prod-20', 'Courge Butternut douce de plein champ', 'courge-butternut-plein-champ', 'Chair dense et veloutée au goût de beurre noisette.', 2.90, 'pièce', 'cat-2', 'https://images.unsplash.com/photo-1570724069488-422e99b58354?auto=format&fit=crop&w=600&q=80', FALSE, TRUE, NULL),
  ('prod-21', 'Avocats Hass crémeux mûrs à point', 'avocats-hass-cremeux', 'Peau sombre et rugueuse, chair crémeuse sans fibres.', 2.10, 'pièce', 'cat-3', 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?auto=format&fit=crop&w=600&q=80', FALSE, TRUE, NULL),
  ('prod-22', 'Basilic Grand Vert en pot vivant', 'basilic-grand-vert-pot', 'Feuilles larges et aromatiques en pot de terre cuite.', 3.50, 'pot', 'cat-4', 'https://images.unsplash.com/photo-1608686207856-001b95cf60ca?auto=format&fit=crop&w=600&q=80', FALSE, TRUE, NULL),
  ('prod-23', 'Menthe poivrée fraîche bio', 'menthe-poivree-fraiche-bio', 'Feuillage vigoureux, parfum mentholé puissant.', 1.80, 'botte', 'cat-4', 'https://images.unsplash.com/photo-1628556270448-4d4e4148e1b1?auto=format&fit=crop&w=600&q=80', FALSE, TRUE, NULL),
  ('prod-24', 'Persil plat maraîcher aromatique', 'persil-plat-maraicher', 'Saveur fine et marquée pour sublimer vos sauces et plats.', 1.50, 'botte', 'cat-4', 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=600&q=80', FALSE, TRUE, NULL),
  ('prod-25', 'Ciboulette fraîche de jardin', 'ciboulette-fraiche-jardin', 'Brins fins au piquant doux évoquant l’échalote fraîche.', 1.60, 'botte', 'cat-4', 'https://images.unsplash.com/photo-1588615419957-46271c667657?auto=format&fit=crop&w=600&q=80', FALSE, TRUE, NULL),
  ('prod-26', 'Bouquet garni de garrigue (Thym & Romarin)', 'bouquet-garni-garrigue', 'Herbes sauvages séchées traditionnellement.', 2.20, 'botte', 'cat-4', 'https://images.unsplash.com/photo-1509358271058-acd22cc93898?auto=format&fit=crop&w=600&q=80', FALSE, TRUE, NULL),
  ('prod-27', 'Panier Familial Maraîcher — 6 kg', 'panier-familial-maraicher-6kg', 'Composition complète de 8 variétés de saison équilibrées.', 24.90, 'panier', 'cat-5', 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80', TRUE, TRUE, 'promo-1'),
  ('prod-28', 'Panier Solo Fraîcheur & Vitamines — 3 kg', 'panier-solo-fraicheur-vitamines-3kg', 'Sélection primeur pour 1 à 2 personnes : 5 variétés prêtes à cuisiner.', 14.50, 'panier', 'cat-5', 'https://images.unsplash.com/photo-1610348725531-843dff563e2c?auto=format&fit=crop&w=600&q=80', TRUE, TRUE, NULL);

-- Réglages Boutique Démo
INSERT INTO demo_shop_settings (id, name, tagline, phone, email, address_street, address_zip, address_city, opening_hours, social_links) VALUES
  (
    1,
    'Noble Fermier (Démo)',
    'Primeur d’exception — Terroirs & Fraîcheur du Jour',
    '04 50 12 34 56',
    'contact@noblefermier-demo.fr',
    '14 Place du Marché Maraîcher',
    '74000',
    'Annecy',
    '[
      {"label": "Mardi au Vendredi", "hours": "07h30 – 12h30 & 15h30 – 19h00"},
      {"label": "Samedi (Jour de Marché)", "hours": "07h00 – 13h00"},
      {"label": "Dimanche & Lundi", "hours": "Fermé"}
    ]'::jsonb,
    '[
      {"platform": "instagram", "url": "https://instagram.com"},
      {"platform": "facebook", "url": "https://facebook.com"}
    ]'::jsonb
  );

-- Branding Démo
INSERT INTO demo_branding (id, primary_color, secondary_color, background_color, font_heading, font_body, hero_image_url) VALUES
  (
    1,
    '#2D6A4F',
    '#D97706',
    '#FDFBF7',
    'Playfair Display',
    'Nunito',
    'https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=1600&q=80'
  );

-- Commandes Démo
INSERT INTO demo_orders (id, customer_name, status, total_price, delivery_mode, note, created_at) VALUES
  ('demo-ord-101', 'Claire Dubois', 'ready', 28.30, 'pickup', 'Retrait prévu samedi vers 10h30.', '2026-10-21T09:15:00.000Z'),
  ('demo-ord-102', 'Marc Lefebvre', 'confirmed', 19.30, 'pickup', 'Merci de choisir des clémentines bien fermes.', '2026-10-21T14:40:00.000Z'),
  ('demo-ord-103', 'Sophie Garnier', 'delivered', 32.10, 'pickup', 'Commande retirée en boutique.', '2026-10-19T11:20:00.000Z');

-- Lignes de commandes Démo
INSERT INTO demo_order_items (id, order_id, product_id, name, unit, price, quantity) VALUES
  ('item-1', 'demo-ord-101', 'prod-27', 'Panier Familial Maraîcher — 6 kg', 'panier', 24.90, 1),
  ('item-2', 'demo-ord-101', 'prod-1', 'Pommes Chantecler du Verger d’Anjou', 'kg', 3.40, 1),
  ('item-3', 'demo-ord-102', 'prod-28', 'Panier Solo Fraîcheur & Vitamines — 3 kg', 'panier', 14.50, 1),
  ('item-4', 'demo-ord-102', 'prod-6', 'Fraises Mara des Bois de Carpentras', 'barquette', 4.80, 1),
  ('item-5', 'demo-ord-103', 'prod-27', 'Panier Familial Maraîcher — 6 kg', 'panier', 24.90, 1),
  ('item-6', 'demo-ord-103', 'prod-11', 'Pommes de terre Charlotte de Noirmoutier', 'kg', 3.20, 2),
  ('item-7', 'demo-ord-103', 'prod-24', 'Persil plat maraîcher aromatique', 'botte', 1.50, 1);
