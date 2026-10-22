// Path: src/demo/pages/DemoAdminPreviewPage.tsx

import { useEffect, useState } from 'react'
import { fetchDemoProducts, fetchDemoCategories } from '../lib/demoQueries'
import type { Product, Category } from '../../types'
import { useDemoContext } from '../context/DemoContext'
import styles from './DemoAdminPreviewPage.module.css'

export default function DemoAdminPreviewPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const { triggerDemoNotice } = useDemoContext()

  useEffect(() => {
    async function load() {
      const [pRes, cRes] = await Promise.all([
        fetchDemoProducts(),
        fetchDemoCategories(),
      ])
      if (pRes.data) setProducts(pRes.data)
      if (cRes.data) setCategories(cRes.data)
    }
    load()
  }, [])

  const categoryMap = new Map<string, string>()
  categories.forEach((c) => categoryMap.set(c.id, c.name))

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Aperçu Tableau de Bord Gérant</h1>
          <p className={styles.subtitle}>
            Démonstration de l'espace d'administration : catalogue, prix, stocks et réapprovisionnements.
          </p>
        </div>

        <div className={styles.adminBadge}>
          <span>🔒</span> Lecture Seule (Mode Démo)
        </div>
      </header>

      {/* KPI Stats */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>Références Actives</div>
          <div className={styles.statValue}>{products.length}</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>Rayons / Catégories</div>
          <div className={styles.statValue}>{categories.length}</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>Commandes du Jour (Démo)</div>
          <div className={styles.statValue}>12</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>Chiffre d’Affaires Démo</div>
          <div className={styles.statValue}>384,50 €</div>
        </div>
      </div>

      {/* Tableau des produits */}
      <div className={styles.tableCard}>
        <div className={styles.tableHeader}>
          <h2 className={styles.tableTitle}>Gestion des Articles & Prix de Vente</h2>
          <button
            type="button"
            className={styles.createBtn}
            onClick={() => triggerDemoNotice('Création d’un nouvel article')}
          >
            <span>+</span> Nouvel Article
          </button>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.th}>Article</th>
                <th className={styles.th}>Rayon</th>
                <th className={styles.th}>Prix unitaire</th>
                <th className={styles.th}>Unité</th>
                <th className={styles.th}>Statut</th>
                <th className={styles.th} style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.slice(0, 10).map((prod) => (
                <tr key={prod.id} className={styles.row}>
                  <td className={styles.td}>
                    <strong>{prod.name}</strong>
                  </td>
                  <td className={styles.td}>
                    {categoryMap.get(prod.categoryId) || 'Rayon principal'}
                  </td>
                  <td className={styles.td}>
                    <strong>{prod.price.toFixed(2)} €</strong>
                  </td>
                  <td className={styles.td}>{prod.unit}</td>
                  <td className={styles.td}>
                    <span style={{ color: '#059669', fontWeight: 600, fontSize: '0.85rem' }}>
                      ● En stock
                    </span>
                  </td>
                  <td className={styles.td} style={{ textAlign: 'right' }}>
                    <button
                      type="button"
                      className={styles.actionIconBtn}
                      onClick={() => triggerDemoNotice(`Modification du prix de ${prod.name}`)}
                      title="Modifier"
                    >
                      ✏️ Éditer
                    </button>
                    <button
                      type="button"
                      className={styles.actionIconBtn}
                      onClick={() => triggerDemoNotice(`Ajustement du stock de ${prod.name}`)}
                      title="Ajuster le stock"
                    >
                      📦 Stock
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
