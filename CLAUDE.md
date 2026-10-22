# CLAUDE.md

## Projet
Application web responsive de primeur, personnalisable pour chaque client.
Chaque client a son propre projet séparé.
Le produit est vendu en packs Basic, Pro, Premium avec options activables.

## Objectif principal
Construire un vrai socle propre, lisible, réutilisable et simple à maintenir, compréhensible par un développeur débutant.

## Stack
- React
- Vercel
- Supabase
- Antigravity
- Claude Code
- Claude AI

## Priorités absolues
1. Lisibilité du code.
2. Structure simple et retrouvable.
3. Personnalisation facile par client.
4. Sécurité.
5. Rapidité de maintenance.
6. Design commercial qui donne envie d’acheter.

## Règles de structure
- Toujours privilégier une architecture simple par fonctionnalité.
- Ne jamais créer trop de routes sans justification.
- Ne jamais disperser la logique métier dans trop de dossiers.
- Ne jamais créer des fichiers inutiles.
- Toujours utiliser des noms de fichiers explicites.
- Toujours centraliser la configuration des options client.
- Toujours centraliser la logique des packs, options, branding et routes activables dans `src/config/`.
- Toujours séparer storefront, account, orders, admin, content et settings.
- Toujours écrire du code compréhensible par un débutant.

## Règle obligatoire de repérage
Chaque fichier créé ou modifié doit commencer par un commentaire indiquant le chemin complet du fichier.

Exemple :
```ts
// Path: src/features/catalog/components/ProductCard.tsx
```

## Règles de réponse
- Toujours répondre en français.
- Toujours expliquer le plan avant de coder.
- Toujours lister les fichiers créés ou modifiés.
- Toujours indiquer brièvement le rôle de chaque fichier.
- Toujours proposer la solution la plus simple et la plus lisible.
- Toujours écrire pour un utilisateur débutant.
- Toujours rappeler quels fichiers ont été modifiés.

## Langue et accents
- Tous les textes visibles par l’utilisateur doivent être en français correct, naturel et sans faute.
- Les accents doivent être conservés dans les textes affichés à l’écran.
- Il est interdit de retirer les accents des textes visibles pour contourner un problème technique.
- Les noms techniques (variables, fonctions, fichiers, constantes) doivent rester simples, de préférence en anglais, et sans accents.
- En cas de problème d’encodage, il faut corriger la source technique du problème, jamais dégrader le texte utilisateur.

## Modèle commercial
Le produit fonctionne avec :
- Pack Basic
- Pack Pro
- Pack Premium
- Options activables individuellement

Les fonctionnalités doivent pouvoir être activées ou masquées sans casser l'interface.

## Répartition packs
### Basic
- Accueil
- Catalogue
- Fiches produits
- Contact
- Branding simple
- Admin basique

### Pro
- Tout le Basic
- Espace client
- Connexion / mot de passe oublié
- Historique commandes
- Commandes en cours
- Statuts / validations
- Promotions
- Pages de contenu
- Branding avancé
- Bannières / pub

### Premium
- Tout le Pro
- Panier
- Commande
- Livraison / retrait
- Parcours d'achat avancé
- Fonctions commerciales avancées

## Fonctionnalités produit
Fonctionnalités possibles :
- Accueil
- Catalogue
- Fiche produit
- Contact
- Pages de contenu
- Promotions
- Images et bannières
- Connexion client
- Espace mon compte
- Historique des commandes
- Statuts de commande
- Panier
- Commande
- Livraison ou retrait
- Admin
- Réglages client

## Admin
Les éléments les plus importants à gérer sont :
- Produits
- Prix
- Promotions
- Images
- Pages de contenu

## Personnalisation client
Les éléments suivants doivent être facilement modifiables :
- Nom
- Logo
- Couleurs
- Images
- Bannières publicitaires
- Catégories
- Textes des pages
- Adresse
- Horaires
- Réseaux sociaux
- Options activables

## Sécurité
- Ne jamais exposer de secret dans le frontend.
- Ne jamais utiliser de permissions admin côté client.
- Toujours préparer le code pour Supabase avec sécurité propre.
- Toujours respecter une séparation claire des rôles.
- Chaque client connecté ne doit voir que ses propres commandes et données.
- Ne jamais inventer des garanties de sécurité non implémentées.
- Prévoir RLS sur les tables sensibles.
- Prévoir une logique compatible RGPD.

## Données personnelles
- Ne stocker que les données nécessaires.
- Prévoir consentement si l'e-mail est mémorisé ou prérempli.
- Prévoir une politique de confidentialité.
- Prévoir la gestion du compte client.
- Conserver la session de manière sécurisée.

## Design
- Le design doit donner envie d’acheter.
- Le style doit évoquer fraîcheur, naturel, qualité, abondance et proximité.
- Utiliser une palette primeur : verts, crème, accents fruités.
- Les produits doivent être très mis en valeur visuellement.
- Éviter un design froid, trop technique ou trop générique.

## Ce que Claude ne doit jamais faire
- Créer une architecture complexe inutile.
- Renommer des fichiers ou dossiers sans raison.
- Dupliquer la logique des options.
- Générer du code difficile à relire.
- Modifier beaucoup de fichiers sans lister clairement les changements.
- Ajouter une route si un composant ou une page existante suffit.
- Utiliser des noms vagues comme Page, Route, Utils, Helper sans précision métier.

## Style de code
- Composants courts.
- Fonctions nommées clairement.
- Types explicites.
- Fichiers organisés par fonctionnalité.
- Peu de magie implicite.
- Commentaires utiles seulement si nécessaire.

## Workflow demandé
Avant tout changement :
1. Expliquer ce qui va être fait.
2. Lister les fichiers créés ou modifiés.
3. Écrire le code.
4. Résumer ce qui a été fait.
5. Rappeler le chemin des fichiers.

## Config produit attendue
Le projet doit utiliser des fichiers centraux comme :
- `src/config/packs.ts`
- `src/config/featureFlags.ts`
- `src/config/brandConfig.ts`
- `src/config/routesConfig.ts`

Claude ne doit pas recréer cette logique ailleurs si elle existe déjà.

## Types métier attendus
Le projet doit utiliser des types métier clairs pour :
- produits
- promotions
- clients
- commandes
- contenu
- réglages boutique

## Base de données attendue
Le backend Supabase doit être organisé avec :
- tables métier lisibles
- triggers `updated_at`
- création automatique du profil utilisateur
- policies RLS adaptées aux rôles
- seed data de démonstration

## Priorité actuelle
Construire un socle propre, réutilisable pour plusieurs clients primeurs, avec espace client en pack Pro, et design commercial attractif.