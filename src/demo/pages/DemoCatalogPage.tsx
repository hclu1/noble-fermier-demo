// Path: src/demo/pages/DemoCatalogPage.tsx

import { useEffect, useState, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { fetchDemoProducts, fetchDemoCategories, fetchDemoPromotions } from '../lib/demoQueries'
import type { Product, Category, Promotion } from '../../types'
import DemoProductCard from '../components/DemoProductCard'
import styles from './DemoCatalogPage.module.css'

export default function DemoCatalogPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [promotions, setPromotions] = useState<Promotion[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)

  const selectedCategoryId = searchParams.get('cat') || 'all'

  useEffect(() => {
    async function loadData() {
      setLoading(true)
      const [prodRes, catRes, promoRes] = await Promise.all([
        fetchDemoProducts(),
        fetchDemoCategories(),
        fetchDemoPromotions(),
      ])

      if (prodRes.data) setProducts(prodRes.data)
      if (catRes.data) setCategories(catRes.data)
      if (promoRes.data) setPromotions(promoRes.data)
      setLoading(false)
    }
    loadData()
  }, [])

  function handleSelectCategory(catId: string) {
    if (catId === 'all') {
      searchParams.delete('cat')
      setSearchParams(searchParams)
    } else {
      setSearchParams({ cat: catId })
    }
  }

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchCat = selectedCategoryId === 'all' || p.categoryId === selectedCategoryId
      const matchSearch =
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.description && p.description.toLowerCase().includes(searchTerm.toLowerCase()))
      return matchCat && matchSearch
    })
  }, [products, selectedCategoryId, searchTerm])

  const promoMap = useMemo(() => {
    const map = new Map<string, string>()
    promotions.forEach((pr) => {
      if (pr.productIds) {
        pr.productIds.forEach((pid) => map.set(pid, `-${pr.discountPercent}%`))
      }
    })
    return map
  }, [promotions])

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>L’Étal Primeur & Maraîcher</h1>
        <p className={styles.subtitle}>
          Fruits, légumes, herbes aromatiques et paniers fraîcheur en direct de nos producteurs.
        </p>
      </header>

      <div className={styles.toolbar}>
        <div className={styles.searchBox}>
          <span className={styles.searchIcon}>🔍</span>
          <input
            type="search"
            placeholder="Rechercher une variété, un fruit, une herbe..."
            className={styles.searchInput}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className={styles.categoryPills}>
          <button
            type="button"
            className={`${styles.pill} ${selectedCategoryId === 'all' ? styles.activePill : ''}`}
            onClick={() => handleSelectCategory('all')}
          >
            Tous les produits ({products.length})
          </button>

          {categories.map((c) => (
            <button
              key={c.id}
              type="button"
              className={`${styles.pill} ${selectedCategoryId === c.id ? styles.activePill : ''}`}
              onClick={() => handleSelectCategory(c.id)}
            >
              {c.name}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.countInfo}>
        {filteredProducts.length} référence{filteredProducts.length > 1 ? 's' : ''} disponible{filteredProducts.length > 1 ? 's' : ''}
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem 1rem', color: '#6b7280' }}>
          Chargement du catalogue démo...
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>🥕</div>
          <h3>Aucun produit trouvé pour cette recherche</h3>
          <p style={{ color: '#6b7280' }}>Essayez un autre mot-clé ou réinitialisez les filtres.</p>
          <button
            type="button"
            className={styles.resetBtn}
            onClick={() => {
              setSearchTerm('')
              handleSelectCategory('all')
            }}
          >
            Réinitialiser les filtres
          </button>
        </div>
      ) : (
        <div className={styles.productGrid}>
          {filteredProducts.map((p) => (
            <DemoProductCard
              key={p.id}
              product={p}
              promotionLabel={promoMap.get(p.id)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
