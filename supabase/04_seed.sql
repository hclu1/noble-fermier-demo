-- ─────────────────────────────────────────────────────────────────────────────
-- Path: supabase/04_seed.sql
-- Données de démonstration — boutique primeur générique
--
-- Exécuter après 03_triggers.sql.
--
-- Ce fichier crée :
--   - 1 boutique de démonstration (shop_settings + branding)
--   - 4 catégories
--   - 3 promotions
--   - 12 produits
--   - 4 pages de contenu (à propos, mentions légales, CGV, confidentialité)
--   - 2 bannières
--
-- Les UUIDs sont fixés pour permettre des références croisées stables.
-- Pour créer un utilisateur admin de démonstration :
--   → Supabase Dashboard > Authentication > Users > Add User
--   → Email : admin@demo.fr / Mot de passe : à définir
--   → Puis : UPDATE profiles SET role = 'shop_admin' WHERE email = 'admin@demo.fr';
-- ─────────────────────────────────────────────────────────────────────────────


-- ═══════════════════════════════════════════════════════════════════════════
-- RÉGLAGES DE LA BOUTIQUE
-- ═══════════════════════════════════════════════════════════════════════════

INSERT INTO shop_settings (
  id, name, tagline,
  phone, email,
  address_street, address_zip, address_city,
  opening_hours, social_links
) VALUES (
  1,
  'Le Panier Frais',
  'Fruits et légumes frais, locaux et de saison',
  '01 23 45 67 89',
  'bonjour@lepanierfrais.fr',
  '12 rue du Marché',
  '75001',
  'Paris',
  '[
    { "label": "Mardi – Vendredi", "hours": "7h – 13h30" },
    { "label": "Samedi",           "hours": "7h – 14h" },
    { "label": "Dimanche",         "hours": "8h – 12h30" },
    { "label": "Lundi",            "hours": "Fermé" }
  ]',
  '[
    { "platform": "instagram", "url": "https://instagram.com" },
    { "platform": "facebook",  "url": "https://facebook.com" }
  ]'
);


-- ═══════════════════════════════════════════════════════════════════════════
-- BRANDING
-- ═══════════════════════════════════════════════════════════════════════════

INSERT INTO branding (
  id, primary_color, secondary_color, background_color,
  font_heading, font_body
) VALUES (
  1,
  '#2D6A4F',          -- vert primeur
  '#F4845F',          -- orange CTA
  '#FEFAE0',          -- crème fond
  'Playfair Display',
  'Nunito'
);


-- ═══════════════════════════════════════════════════════════════════════════
-- CATÉGORIES
-- UUIDs fixes pour pouvoir les référencer dans les produits ci-dessous.
-- ═══════════════════════════════════════════════════════════════════════════

INSERT INTO categories (id, name, slug, "order") VALUES
  ('c1000000-0000-0000-0000-000000000001', 'Fruits',              'fruits',    1),
  ('c1000000-0000-0000-0000-000000000002', 'Légumes',             'legumes',   2),
  ('c1000000-0000-0000-0000-000000000003', 'Herbes aromatiques',  'herbes',    3),
  ('c1000000-0000-0000-0000-000000000004', 'Paniers & coffrets',  'paniers',   4);


-- ═══════════════════════════════════════════════════════════════════════════
-- PROMOTIONS
-- UUIDs fixes pour les référencer dans les produits.
-- ═══════════════════════════════════════════════════════════════════════════

INSERT INTO promotions (id, label, discount_percent, category_ids, product_ids, end_date) VALUES
  (
    'p1000000-0000-0000-0000-000000000001',
    'Fruits de saison –20 %',
    20,
    ARRAY['c1000000-0000-0000-0000-000000000001']::UUID[],
    '{}',
    CURRENT_DATE + INTERVAL '30 days'
  ),
  (
    'p1000000-0000-0000-0000-000000000002',
    'Légumes du jardin –15 %',
    15,
    ARRAY['c1000000-0000-0000-0000-000000000002']::UUID[],
    '{}',
    CURRENT_DATE + INTERVAL '14 days'
  ),
  (
    'p1000000-0000-0000-0000-000000000003',
    'Panier découverte –10 %',
    10,
    '{}',
    '{}',
    NULL   -- sans date d'expiration
  );


-- ═══════════════════════════════════════════════════════════════════════════
-- PRODUITS (12)
-- ═══════════════════════════════════════════════════════════════════════════

INSERT INTO products (
  id, name, slug, description,
  price, unit, category_id,
  is_featured, is_available, promotion_id
) VALUES

  -- ── Fruits ──────────────────────────────────────────────────────────────

  (
    'd1000000-0000-0000-0000-000000000001',
    'Fraises Gariguette',
    'fraises-gariguette',
    'Fraises longues et parfumées, cueillies à maturité. Arrivage quotidien du Lot-et-Garonne.',
    4.50, 'barquette 250g',
    'c1000000-0000-0000-0000-000000000001',
    TRUE, TRUE,
    'p1000000-0000-0000-0000-000000000001'
  ),
  (
    'd1000000-0000-0000-0000-000000000002',
    'Pommes Gala',
    'pommes-gala',
    'Pommes croquantes et sucrées, cultivées dans la Drôme. Idéales pour le goûter.',
    2.80, 'kg',
    'c1000000-0000-0000-0000-000000000001',
    FALSE, TRUE,
    'p1000000-0000-0000-0000-000000000001'
  ),
  (
    'd1000000-0000-0000-0000-000000000003',
    'Cerises Burlat',
    'cerises-burlat',
    'Premières cerises de la saison, charnues et juteuses. Origine : Provence.',
    6.90, 'kg',
    'c1000000-0000-0000-0000-000000000001',
    TRUE, TRUE,
    'p1000000-0000-0000-0000-000000000001'
  ),
  (
    'd1000000-0000-0000-0000-000000000004',
    'Melon Charentais',
    'melon-charentais',
    'Melon brodé, miel et parfumé. Sélectionné à la main pour garantir la maturité.',
    3.20, 'pièce',
    'c1000000-0000-0000-0000-000000000001',
    TRUE, TRUE,
    NULL
  ),

  -- ── Légumes ─────────────────────────────────────────────────────────────

  (
    'd1000000-0000-0000-0000-000000000005',
    'Tomates cœur de bœuf',
    'tomates-coeur-de-boeuf',
    'Tomates charnues, peu acides, idéales en salade. Agriculture raisonnée, région PACA.',
    4.20, 'kg',
    'c1000000-0000-0000-0000-000000000002',
    TRUE, TRUE,
    'p1000000-0000-0000-0000-000000000002'
  ),
  (
    'd1000000-0000-0000-0000-000000000006',
    'Courgettes jaunes',
    'courgettes-jaunes',
    'Courgettes dorées, tendres et sucrées. Récoltées jeunes pour une texture idéale.',
    2.50, 'kg',
    'c1000000-0000-0000-0000-000000000002',
    FALSE, TRUE,
    'p1000000-0000-0000-0000-000000000002'
  ),
  (
    'd1000000-0000-0000-0000-000000000007',
    'Haricots verts fins',
    'haricots-verts-fins',
    'Haricots extra-fins, cueillis à la main. Fondants et savoureux.',
    3.80, 'kg',
    'c1000000-0000-0000-0000-000000000002',
    FALSE, TRUE,
    NULL
  ),
  (
    'd1000000-0000-0000-0000-000000000008',
    'Salade batavia',
    'salade-batavia',
    'Laitue croquante, feuilles larges et généreuses. Idéale pour les grandes salades.',
    1.20, 'pièce',
    'c1000000-0000-0000-0000-000000000002',
    FALSE, TRUE,
    NULL
  ),

  -- ── Herbes aromatiques ───────────────────────────────────────────────────

  (
    'd1000000-0000-0000-0000-000000000009',
    'Basilic frais',
    'basilic-frais',
    'Basilic grand vert, feuilles larges et très parfumées. Livraison quotidienne.',
    1.50, 'botte',
    'c1000000-0000-0000-0000-000000000003',
    FALSE, TRUE,
    NULL
  ),
  (
    'd1000000-0000-0000-0000-000000000010',
    'Ciboulette',
    'ciboulette',
    'Brins fins et tendres, goût délicat. Parfaite pour les fromages frais et les œufs.',
    1.20, 'botte',
    'c1000000-0000-0000-0000-000000000003',
    FALSE, TRUE,
    NULL
  ),

  -- ── Paniers & coffrets ───────────────────────────────────────────────────

  (
    'd1000000-0000-0000-0000-000000000011',
    'Panier Découverte Famille',
    'panier-decouverte-famille',
    'Un assortiment généreux de fruits et légumes de saison, sélectionnés chaque matin. Pour 4 personnes, 5 jours.',
    28.00, 'panier',
    'c1000000-0000-0000-0000-000000000004',
    TRUE, TRUE,
    'p1000000-0000-0000-0000-000000000003'
  ),
  (
    'd1000000-0000-0000-0000-000000000012',
    'Coffret Herbes & Saveurs',
    'coffret-herbes-saveurs',
    'Six variétés d''herbes aromatiques fraîches dans un joli coffret cadeau. Idéal pour les amateurs de cuisine.',
    12.50, 'coffret',
    'c1000000-0000-0000-0000-000000000004',
    FALSE, TRUE,
    NULL
  );


-- ═══════════════════════════════════════════════════════════════════════════
-- PAGES DE CONTENU (4)
-- ═══════════════════════════════════════════════════════════════════════════

INSERT INTO content_pages (slug, title, body) VALUES

  (
    'a-propos',
    'À propos',
    '<h2>Notre histoire</h2>
<p>Le Panier Frais est une boutique de primeur indépendante, fondée avec une conviction simple : tout le monde mérite des fruits et légumes vraiment frais, à prix juste.</p>
<p>Chaque matin, nous sélectionnons les meilleurs arrivages auprès de producteurs locaux et de grossistes de confiance. La fraîcheur n''est pas un argument commercial — c''est notre seul critère.</p>
<h2>Nos engagements</h2>
<ul>
<li>Produits de saison, prioritairement locaux</li>
<li>Sélection quotidienne à la main</li>
<li>Prix transparents et accessibles</li>
<li>Zéro gaspillage : les invendus partent en dons alimentaires</li>
</ul>'
  ),

  (
    'mentions-legales',
    'Mentions légales',
    '<h2>Éditeur du site</h2>
<p>Ce site est édité par <strong>Le Panier Frais</strong>, entreprise individuelle.<br>
Adresse : 12 rue du Marché, 75001 Paris<br>
Téléphone : 01 23 45 67 89<br>
Email : bonjour@lepanierfrais.fr</p>
<h2>Hébergement</h2>
<p>Ce site est hébergé par <strong>Vercel Inc.</strong>, 340 Pine Street, Suite 800, San Francisco, CA 94104, États-Unis.</p>
<h2>Propriété intellectuelle</h2>
<p>L''ensemble du contenu de ce site (textes, images, visuels) est la propriété exclusive de Le Panier Frais. Toute reproduction est interdite sans autorisation préalable.</p>'
  ),

  (
    'confidentialite',
    'Politique de confidentialité',
    '<h2>Données collectées</h2>
<p>Dans le cadre de la création d''un compte client, nous collectons : prénom, nom, adresse e-mail, numéro de téléphone et adresse postale. Ces données sont strictement nécessaires au traitement de vos commandes.</p>
<h2>Utilisation des données</h2>
<p>Vos données personnelles sont utilisées uniquement pour la gestion de votre compte et de vos commandes. Elles ne sont jamais vendues ni transmises à des tiers à des fins commerciales.</p>
<h2>Vos droits</h2>
<p>Conformément au RGPD, vous disposez d''un droit d''accès, de rectification et de suppression de vos données. Pour exercer ces droits, contactez-nous à : bonjour@lepanierfrais.fr</p>'
  ),

  (
    'cgv',
    'Conditions générales de vente',
    '<h2>Commandes</h2>
<p>Les commandes passées sur ce site sont confirmées par e-mail dans un délai de 24h. Toute commande est considérée ferme et définitive à compter de la confirmation.</p>
<h2>Retrait</h2>
<p>Les commandes sont à retirer en boutique aux horaires d''ouverture indiqués, dans un délai de 48h après confirmation. Passé ce délai, la commande peut être annulée.</p>
<h2>Prix</h2>
<p>Les prix affichés sont en euros, toutes taxes comprises. Le Panier Frais se réserve le droit de modifier ses prix à tout moment. Le prix applicable est celui affiché au moment de la commande.</p>
<h2>Réclamations</h2>
<p>Pour toute réclamation, contactez-nous dans les 24h suivant le retrait à bonjour@lepanierfrais.fr ou au 01 23 45 67 89.</p>'
  );


-- ═══════════════════════════════════════════════════════════════════════════
-- BANNIÈRES (2)
-- ═══════════════════════════════════════════════════════════════════════════

INSERT INTO banners (title, subtitle, link_url, link_label, is_active, "order") VALUES
  (
    'Fruits de saison à –20 %',
    'Fraises, cerises, pommes… profitez de nos prix de saison jusqu''à fin du mois.',
    '/catalogue?categorie=fruits',
    'Voir les fruits',
    TRUE,
    1
  ),
  (
    'Nouveau : Panier Famille',
    'Un panier complet pour 4 personnes, livré ou à retirer en boutique.',
    '/produit/panier-decouverte-famille',
    'Découvrir le panier',
    TRUE,
    2
  );
