# Journal des modifications (CHANGELOG)

Toutes les modifications notables apportées à ce projet sont documentées dans ce fichier.
Le format est basé sur [Keep a Changelog](https://keepachangelog.com/fr/1.0.0/) et ce projet respecte le [Semantic Versioning](https://semver.org/lang/fr/).

## [1.1.2] - 2026-10-22

### Modifié
- Ajout explicite de « Mode Démo » dans le titre de marque principal, l'en-tête de navigation, le titre de la page d'accueil et le pied de page (« Noble Fermier — Mode Démo »).

## [1.1.1] - 2026-10-22

### Modifié
- Remplacement des émojis simples par les photographies professionnelles et réalistes pour les rayons primeurs (Fruits du marché provençal, Légumes d'antan de plein champ, Bottes d'aromates maraîchères liées au raphia).

## [1.1.0] - 2026-10-22

### Ajouté
- Création d'un **Mode Démo public, sécurisé et 100 % isolé** pour la vitrine Appalacarte.
- Point d'entrée de démonstration dédié (`demo/index.html` et `src/demo/main.tsx`).
- Navigation complète démo : Accueil, Catalogue avec recherche et filtres par catégories, Fiche Produit, Suivi de Commandes, Aperçu du Tableau de Bord Gérant (lecture seule), Horaires & Contact.
- Bannière supérieure démo avec badge « Démo » et bouton « ← Retour à Appalacarte ».
- Modale de blocage sécurisée prévenant que les actions d'écriture sont réservées à la version complète.
- Script SQL autonome (`supabase/demo_setup.sql`) créant les tables `demo_*` avec RLS en lecture seule stricte et jeu de données de 28 produits primeurs réalistes.
- Script de compilation démo dédié `npm run build:demo` (`vite.config.demo.ts`).

## [1.0.0] - 2026-03-29

### Ajouté
- Version initiale du socle applicatif primeur Noble Fermier.
- Gestion du catalogue, de l'espace client, du panier et du back-office d'administration.
