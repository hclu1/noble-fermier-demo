// Path: src/data/mockContent.ts

import type { ContentPage } from '../types'

// Pages de contenu statique — remplacées par Supabase plus tard
export const mockContentPages: ContentPage[] = [
  {
    id: 'cp-1',
    slug: 'a-propos',
    title: 'Notre histoire',
    updatedAt: '2026-01-15',
    body: `
      <p>Noble Fermier est né d'une conviction simple : chacun mérite d'accéder à des produits frais, locaux et savoureux, sans compromis.</p>
      <p>Depuis 2019, nous travaillons en direct avec une vingtaine de producteurs de la région Auvergne-Rhône-Alpes. Pas d'intermédiaires, pas de frigos industriels — nos fruits et légumes passent directement du champ à votre table.</p>
      <h2>Notre engagement</h2>
      <p>Nous sélectionnons chaque producteur selon des critères stricts : respect des saisons, pratiques raisonnées ou biologiques, et qualité gustative avant tout. Parce qu'un bon légume, ça se voit, ça se sent, et surtout ça se goûte.</p>
      <p>Notre équipe est disponible du lundi au samedi pour vous conseiller et préparer vos commandes avec soin.</p>
    `,
  },
  {
    id: 'cp-2',
    slug: 'mentions-legales',
    title: 'Mentions légales',
    updatedAt: '2026-01-10',
    body: `
      <h2>Éditeur du site</h2>
      <p>Noble Fermier SAS<br/>12 rue des Maraîchers, 69003 Lyon<br/>SIRET : 000 000 000 00000</p>
      <h2>Hébergement</h2>
      <p>Ce site est hébergé par Vercel Inc., 340 Pine Street, Suite 900, San Francisco, CA 94104, USA.</p>
      <h2>Propriété intellectuelle</h2>
      <p>L'ensemble du contenu de ce site (textes, images, logos) est la propriété exclusive de Noble Fermier SAS et ne peut être reproduit sans autorisation écrite.</p>
    `,
  },
  {
    id: 'cp-3',
    slug: 'confidentialite',
    title: 'Politique de confidentialité',
    updatedAt: '2026-01-10',
    body: `
      <p>Noble Fermier s'engage à protéger votre vie privée conformément au RGPD.</p>
      <h2>Données collectées</h2>
      <p>Nous collectons uniquement les données nécessaires à la gestion de votre compte et de vos commandes : nom, prénom, adresse email, adresse de livraison.</p>
      <h2>Durée de conservation</h2>
      <p>Vos données sont conservées pendant 3 ans après votre dernier achat, puis supprimées automatiquement.</p>
      <h2>Vos droits</h2>
      <p>Vous pouvez accéder, rectifier ou supprimer vos données en nous contactant à : bonjour@noblefermier.fr</p>
    `,
  },
  {
    id: 'cp-4',
    slug: 'cgv',
    title: 'Conditions générales de vente',
    updatedAt: '2026-01-10',
    body: `
      <p>Les présentes CGV régissent les ventes réalisées sur le site Noble Fermier.</p>
      <h2>Commandes</h2>
      <p>Toute commande passée avant 18h est préparée le lendemain matin. Les commandes du samedi sont disponibles le lundi.</p>
      <h2>Prix</h2>
      <p>Les prix sont indiqués en euros, toutes taxes comprises. Noble Fermier se réserve le droit de modifier ses prix à tout moment.</p>
      <h2>Retrait</h2>
      <p>Le retrait se fait en magasin aux horaires d'ouverture, sur présentation de votre confirmation de commande.</p>
    `,
  },
]
