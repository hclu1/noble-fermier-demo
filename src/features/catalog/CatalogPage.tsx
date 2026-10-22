// Path: src/features/catalog/CatalogPage.tsx

import { useState, useMemo, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { fetchProducts, fetchCategories } from '../../lib/queries/products'
import { featureFlags } from '../../config/featureFlags'
import type { Product, Category } from '../../types'
import Container from '../../layout/Container'
import ProductCard from './components/ProductCard'
import styles from './CatalogPage.module.css'
import homeStyles from '../home/HomePage.module.css'

export default function CatalogPage() {
  const [products,    setProducts]    = useState<Product[]>([])
  const [categories,  setCategories]  = useState<Category[]>([])
  const [isLoading,   setIsLoading]   = useState(true)
  const [error,       setError]       = useState<string | null>(null)
  const [search,      setSearch]      = useState('')
  const [searchParams, setSearchParams] = useSearchParams()

  useEffect(() => {
    Promise.all([
      fetchProducts(),
      fetchCategories()
    ]).then(([prodRes, catRes]) => {
      if (prodRes.error || catRes.error) {
        setError(prodRes.error || catRes.error)
      } else {
        if (prodRes.data) setProducts(prodRes.data)
        if (catRes.data)  setCategories(catRes.data)
      }
      setIsLoading(false)
    })
  }, [])

  const activeCategorySlug = searchParams.get('categorie') ?? 'all'

  // Filtrage côté client : catégorie + recherche textuelle
  const filteredProducts = useMemo(() => {
    let result = products

    if (activeCategorySlug !== 'all') {
      const cat = categories.find((c: Category) => c.slug === activeCategorySlug)
      if (cat) result = result.filter((p: Product) => p.categoryId === cat.id)
    }

    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter(
        (p: Product) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      )
    }

    return result
  }, [products, categories, activeCategorySlug, search])

  function handleCategoryClick(slug: string) {
    if (slug === 'all') searchParams.delete('categorie')
    else searchParams.set('categorie', slug)
    setSearchParams(searchParams)
  }

  return (
    <Container>
      <div className={styles.page}>

        <div className={styles.header}>
          <h1 className={styles.title}>Notre catalogue</h1>
          <p className={styles.subtitle}>
            Produits frais, de saison, sélectionnés chaque matin.
          </p>
        </div>

        {featureFlags.enableProductSearch && (
          <div className={styles.searchWrapper}>
            <input
              type="search"
              placeholder="Rechercher un produit…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={styles.searchInput}
              aria-label="Rechercher un produit"
            />
          </div>
        )}

        {/* Filtres par catégorie */}
        <div className={styles.filters} role="tablist" aria-label="Filtrer par catégorie">
          <button
            role="tab"
            aria-selected={activeCategorySlug === 'all'}
            className={`${styles.filterBtn} ${activeCategorySlug === 'all' ? styles.active : ''}`}
            onClick={() => handleCategoryClick('all')}
          >
            Tout voir
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              role="tab"
              aria-selected={activeCategorySlug === cat.slug}
              className={`${styles.filterBtn} ${activeCategorySlug === cat.slug ? styles.active : ''}`}
              onClick={() => handleCategoryClick(cat.slug)}
            >
              {cat.name}
            </button>
          ))}
        </div>

        <p className={styles.count}>
          {isLoading ? 'Chargement…' : `${filteredProducts.length} produit${filteredProducts.length !== 1 ? 's' : ''}`}
        </p>

        {isLoading ? (
          <div className={styles.grid}>
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className={`${homeStyles.skeleton} ${homeStyles.skeletonCard}`} />
            ))}
          </div>
        ) : error ? (
          <div className={styles.statusError}>{error}</div>
        ) : filteredProducts.length > 0 ? (
          <div className={styles.grid}>
            {filteredProducts.map((product) => {
              const category = categories.find((c) => c.id === product.categoryId)
              return (
                <ProductCard
                  key={product.id}
                  product={product}
                  category={category}
                  hasPromo={!!product.promotionId}
                />
              )
            })}
          </div>
        ) : (
          <div className={styles.empty}>
            <span className={styles.emptyIcon}>🔍</span>
            <p>Aucun produit trouvé pour cette recherche.</p>
          </div>
        )}

      </div>
    </Container>
  )
}
