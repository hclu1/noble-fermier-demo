// Path: src/features/admin/products/AdminProductsPage.tsx

import { useState, useEffect } from 'react'
import { fetchProducts, fetchCategories } from '../../../lib/queries/products'
import { adminCreateProduct, adminUpdateProduct, adminDeleteProduct } from '../../../lib/queries/admin'
import { slugify } from '../../../lib/slugify'
import type { Product, Category } from '../../../types'
import Button from '../../../components/ui/Button'
import styles from './AdminProductsPage.module.css'

const EMPTY_FORM: Omit<Product, 'id'> = {
  name: '', slug: '', description: '', price: 0,
  unit: 'le kg', categoryId: '',
  isFeatured: false, isAvailable: true,
}

export default function AdminProductsPage() {
  const [products,   setProducts]   = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [editingId,  setEditingId]  = useState<string | null>(null)
  const [isAdding,   setIsAdding]   = useState(false)
  const [form,       setForm]       = useState<Omit<Product, 'id'>>(EMPTY_FORM)

  useEffect(() => {
    fetchProducts().then(({ data })   => { if (data) setProducts(data) })
    fetchCategories().then(({ data }) => { if (data) setCategories(data) })
  }, [])

  const isFormOpen = isAdding || editingId !== null

  function handleEdit(product: Product) {
    const { id, ...rest } = product
    setForm(rest)
    setEditingId(id)
    setIsAdding(false)
  }

  function handleAdd() {
    setForm({ ...EMPTY_FORM, categoryId: categories[0]?.id ?? '' })
    setEditingId(null)
    setIsAdding(true)
  }

  function handleCancel() {
    setEditingId(null)
    setIsAdding(false)
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    const data = { ...form, slug: slugify(form.name) }

    if (isAdding) {
      const { data: created } = await adminCreateProduct(data)
      if (created) setProducts((prev) => [...prev, created])
    } else if (editingId) {
      const currentId = editingId
      const { data: updated } = await adminUpdateProduct(currentId, data)
      if (updated) setProducts((prev) =>
        prev.map((p) => (p.id === currentId ? updated : p))
      )
    }

    handleCancel()
  }

  async function handleDelete(id: string) {
    if (!window.confirm('Supprimer ce produit ?')) return
    const { error } = await adminDeleteProduct(id)
    if (!error) setProducts((prev) => prev.filter((p) => p.id !== id))
  }

  return (
    <div className={styles.page}>

      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Produits</h1>
          <p className={styles.count}>{products.length} produit(s)</p>
        </div>
        {!isFormOpen && (
          <Button variant="primary" onClick={handleAdd}>+ Ajouter un produit</Button>
        )}
      </div>

      {/* ─── Formulaire ajout / édition ─── */}
      {isFormOpen && (
        <form onSubmit={handleSave} className={styles.form}>
          <h2 className={styles.formTitle}>
            {isAdding ? 'Nouveau produit' : 'Modifier le produit'}
          </h2>

          <div className={styles.formGrid}>
            <div className={styles.field}>
              <label className={styles.label}>Nom *</label>
              <input className={styles.input} required value={form.name}
                onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                placeholder="Tomates anciennes" />
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Catégorie</label>
              <select className={styles.input} value={form.categoryId}
                onChange={(e) => setForm((p) => ({ ...p, categoryId: e.target.value }))}>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Prix (€) *</label>
              <input className={styles.input} type="number" min="0" step="0.01" required
                value={form.price}
                onChange={(e) => setForm((p) => ({ ...p, price: parseFloat(e.target.value) || 0 }))} />
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Unité</label>
              <input className={styles.input} value={form.unit}
                onChange={(e) => setForm((p) => ({ ...p, unit: e.target.value }))}
                placeholder="le kg, la pièce…" />
            </div>

            <div className={`${styles.field} ${styles.fieldFull}`}>
              <label className={styles.label}>Description</label>
              <textarea className={styles.input} rows={3} value={form.description}
                onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} />
            </div>

            <div className={styles.field}>
              <label className={styles.label}>URL image</label>
              <input className={styles.input} type="url" value={form.imageUrl ?? ''}
                onChange={(e) => setForm((p) => ({ ...p, imageUrl: e.target.value }))}
                placeholder="https://…" />
            </div>

            <div className={styles.checkboxGroup}>
              <label className={styles.checkboxLabel}>
                <input type="checkbox" checked={form.isFeatured ?? false}
                  onChange={(e) => setForm((p) => ({ ...p, isFeatured: e.target.checked }))} />
                Produit vedette (affiché sur l'accueil)
              </label>
              <label className={styles.checkboxLabel}>
                <input type="checkbox" checked={form.isAvailable ?? true}
                  onChange={(e) => setForm((p) => ({ ...p, isAvailable: e.target.checked }))} />
                En stock
              </label>
            </div>
          </div>

          <div className={styles.formActions}>
            <Button type="submit" variant="primary">
              {isAdding ? 'Créer le produit' : 'Enregistrer'}
            </Button>
            <Button type="button" variant="ghost" onClick={handleCancel}>Annuler</Button>
          </div>
        </form>
      )}

      {/* ─── Tableau des produits ─── */}
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.th}>Nom</th>
              <th className={styles.th}>Catégorie</th>
              <th className={styles.th}>Prix</th>
              <th className={styles.th}>Unité</th>
              <th className={styles.th}>Vedette</th>
              <th className={styles.th}>Stock</th>
              <th className={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => {
              const cat = categories.find((c) => c.id === product.categoryId)
              return (
                <tr key={product.id} className={styles.tr}>
                  <td className={styles.td}>
                    <span className={styles.productName}>{product.name}</span>
                  </td>
                  <td className={styles.td}>{cat?.name ?? '—'}</td>
                  <td className={styles.td}>{product.price.toFixed(2)} €</td>
                  <td className={styles.td}>{product.unit}</td>
                  <td className={styles.td}>
                    {product.isFeatured
                      ? <span className={styles.badgeYes}>Oui</span>
                      : <span className={styles.badgeNo}>Non</span>}
                  </td>
                  <td className={styles.td}>
                    {product.isAvailable !== false
                      ? <span className={styles.badgeYes}>En stock</span>
                      : <span className={styles.badgeNo}>Rupture</span>}
                  </td>
                  <td className={styles.td}>
                    <div className={styles.actions}>
                      <Button size="sm" variant="secondary"
                        onClick={() => handleEdit(product)} disabled={isFormOpen}>
                        Modifier
                      </Button>
                      <Button size="sm" variant="ghost"
                        onClick={() => handleDelete(product.id)} disabled={isFormOpen}>
                        Supprimer
                      </Button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
        {products.length === 0 && (
          <p className={styles.empty}>Aucun produit pour l'instant.</p>
        )}
      </div>
    </div>
  )
}
