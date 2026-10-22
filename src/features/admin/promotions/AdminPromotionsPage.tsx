// Path: src/features/admin/promotions/AdminPromotionsPage.tsx

import { useState, useEffect } from 'react'
import { fetchAllPromotions } from '../../../lib/queries/promotions'
import { fetchProducts, fetchCategories } from '../../../lib/queries/products'
import { adminCreatePromotion, adminUpdatePromotion, adminDeletePromotion } from '../../../lib/queries/admin'
import type { Promotion, Product, Category } from '../../../types'
import Button from '../../../components/ui/Button'
import styles from './AdminPromotionsPage.module.css'

const EMPTY_FORM: Omit<Promotion, 'id'> = {
  label: '', discountPercent: 10,
  productIds: [], categoryIds: [],
  startDate: '', endDate: '',
}

export default function AdminPromotionsPage() {
  const [promotions, setPromotions] = useState<Promotion[]>([])
  const [products,   setProducts]   = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [editingId,  setEditingId]  = useState<string | null>(null)
  const [isAdding,   setIsAdding]   = useState(false)
  const [form,       setForm]       = useState<Omit<Promotion, 'id'>>(EMPTY_FORM)

  useEffect(() => {
    fetchAllPromotions().then(({ data }) => { if (data) setPromotions(data) })
    fetchProducts().then(({ data })      => { if (data) setProducts(data) })
    fetchCategories().then(({ data })    => { if (data) setCategories(data) })
  }, [])

  const isFormOpen = isAdding || editingId !== null

  function handleEdit(promo: Promotion) {
    const { id, ...rest } = promo
    setForm(rest)
    setEditingId(id)
    setIsAdding(false)
  }

  function handleAdd() {
    setForm(EMPTY_FORM)
    setEditingId(null)
    setIsAdding(true)
  }

  function handleCancel() {
    setEditingId(null)
    setIsAdding(false)
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()

    if (isAdding) {
      const { data: created } = await adminCreatePromotion(form)
      if (created) setPromotions((prev) => [created, ...prev])
    } else if (editingId) {
      const currentId = editingId
      const { data: updated } = await adminUpdatePromotion(currentId, form)
      if (updated) setPromotions((prev) =>
        prev.map((p) => (p.id === currentId ? updated : p))
      )
    }

    handleCancel()
  }

  async function handleDelete(id: string) {
    if (!window.confirm('Supprimer cette promotion ?')) return
    const { error } = await adminDeletePromotion(id)
    if (!error) setPromotions((prev) => prev.filter((p) => p.id !== id))
  }

  function toggleId(ids: string[], id: string, checked: boolean): string[] {
    return checked ? [...ids, id] : ids.filter((i) => i !== id)
  }

  return (
    <div className={styles.page}>

      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Promotions</h1>
          <p className={styles.count}>{promotions.length} promotion(s)</p>
        </div>
        {!isFormOpen && (
          <Button variant="primary" onClick={handleAdd}>+ Ajouter une promotion</Button>
        )}
      </div>

      {/* ─── Formulaire ajout / édition ─── */}
      {isFormOpen && (
        <form onSubmit={handleSave} className={styles.form}>
          <h2 className={styles.formTitle}>
            {isAdding ? 'Nouvelle promotion' : 'Modifier la promotion'}
          </h2>

          <div className={styles.formGrid}>
            <div className={`${styles.field} ${styles.fieldFull}`}>
              <label className={styles.label}>Libellé *</label>
              <input className={styles.input} required value={form.label}
                onChange={(e) => setForm((p) => ({ ...p, label: e.target.value }))}
                placeholder="ex : Fraises -15 %" />
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Réduction (%)</label>
              <input className={styles.input} type="number" min="1" max="100"
                value={form.discountPercent}
                onChange={(e) =>
                  setForm((p) => ({ ...p, discountPercent: parseInt(e.target.value) || 0 }))
                } />
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Date de début</label>
              <input className={styles.input} type="date" value={form.startDate ?? ''}
                onChange={(e) => setForm((p) => ({ ...p, startDate: e.target.value }))} />
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Date de fin</label>
              <input className={styles.input} type="date" value={form.endDate ?? ''}
                onChange={(e) => setForm((p) => ({ ...p, endDate: e.target.value }))} />
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Catégories ciblées</label>
              <div className={styles.checkboxGroup}>
                {categories.map((cat) => (
                  <label key={cat.id} className={styles.checkboxLabel}>
                    <input type="checkbox"
                      checked={(form.categoryIds ?? []).includes(cat.id)}
                      onChange={(e) =>
                        setForm((p) => ({
                          ...p,
                          categoryIds: toggleId(p.categoryIds ?? [], cat.id, e.target.checked),
                        }))
                      } />
                    {cat.name}
                  </label>
                ))}
              </div>
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Produits ciblés</label>
              <div className={styles.checkboxGroup}>
                {products.map((prod) => (
                  <label key={prod.id} className={styles.checkboxLabel}>
                    <input type="checkbox"
                      checked={(form.productIds ?? []).includes(prod.id)}
                      onChange={(e) =>
                        setForm((p) => ({
                          ...p,
                          productIds: toggleId(p.productIds ?? [], prod.id, e.target.checked),
                        }))
                      } />
                    {prod.name}
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className={styles.formActions}>
            <Button type="submit" variant="primary">
              {isAdding ? 'Créer' : 'Enregistrer'}
            </Button>
            <Button type="button" variant="ghost" onClick={handleCancel}>Annuler</Button>
          </div>
        </form>
      )}

      {/* ─── Tableau des promotions ─── */}
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.th}>Libellé</th>
              <th className={styles.th}>Réduction</th>
              <th className={styles.th}>Du</th>
              <th className={styles.th}>Au</th>
              <th className={styles.th}>Cible</th>
              <th className={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {promotions.map((promo) => (
              <tr key={promo.id} className={styles.tr}>
                <td className={styles.td}>
                  <span className={styles.promoLabel}>{promo.label}</span>
                </td>
                <td className={styles.td}>
                  <span className={styles.discount}>-{promo.discountPercent} %</span>
                </td>
                <td className={styles.td}>{formatDate(promo.startDate)}</td>
                <td className={styles.td}>{formatDate(promo.endDate)}</td>
                <td className={styles.td}>
                  <span className={styles.target}>{buildTargetLabel(promo)}</span>
                </td>
                <td className={styles.td}>
                  <div className={styles.actions}>
                    <Button size="sm" variant="secondary"
                      onClick={() => handleEdit(promo)} disabled={isFormOpen}>
                      Modifier
                    </Button>
                    <Button size="sm" variant="ghost"
                      onClick={() => handleDelete(promo.id)} disabled={isFormOpen}>
                      Supprimer
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {promotions.length === 0 && (
          <p className={styles.empty}>Aucune promotion pour l'instant.</p>
        )}
      </div>
    </div>
  )
}

function formatDate(date?: string): string {
  if (!date) return '—'
  return new Date(date).toLocaleDateString('fr-FR', {
    day: 'numeric', month: 'short', year: 'numeric',
  })
}

function buildTargetLabel(promo: Promotion): string {
  const cats  = (promo.categoryIds ?? []).length
  const prods = (promo.productIds  ?? []).length
  if (cats === 0 && prods === 0) return 'Tout le catalogue'
  const parts = []
  if (cats  > 0) parts.push(`${cats} catégorie(s)`)
  if (prods > 0) parts.push(`${prods} produit(s)`)
  return parts.join(', ')
}
