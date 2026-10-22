// Path: src/features/admin/content/AdminContentPage.tsx

import { useState, useEffect } from 'react'
import { fetchAllContentPages } from '../../../lib/queries/content'
import { adminCreateContentPage, adminUpdateContentPage, adminDeleteContentPage } from '../../../lib/queries/admin'
import { sanitizeHtml } from '../../../lib/sanitizeHtml'
import { slugify } from '../../../lib/slugify'
import type { ContentPage } from '../../../types'
import Button from '../../../components/ui/Button'
import styles from './AdminContentPage.module.css'

const EMPTY_FORM: Omit<ContentPage, 'id' | 'updatedAt'> = {
  slug: '', title: '', body: '',
}

export default function AdminContentPage() {
  const [pages,     setPages]     = useState<ContentPage[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [isAdding,  setIsAdding]  = useState(false)
  const [form,      setForm]      = useState<Omit<ContentPage, 'id' | 'updatedAt'>>(EMPTY_FORM)

  useEffect(() => {
    fetchAllContentPages().then(({ data }) => { if (data) setPages(data) })
  }, [])

  const isFormOpen = isAdding || editingId !== null

  function handleEdit(page: ContentPage) {
    setForm({ slug: page.slug, title: page.title, body: page.body })
    setEditingId(page.id)
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

    // Sanitisation du HTML avant sauvegarde (protection XSS)
    const safeForm = { ...form, body: sanitizeHtml(form.body) }

    if (isAdding) {
      const { data: created } = await adminCreateContentPage(safeForm)
      if (created) setPages((prev) => [...prev, created])
    } else if (editingId) {
      const currentId = editingId
      const { data: updated } = await adminUpdateContentPage(currentId, safeForm)
      if (updated) setPages((prev) =>
        prev.map((p) => (p.id === currentId ? updated : p))
      )
    }

    handleCancel()
  }

  async function handleDelete(id: string) {
    if (!window.confirm('Supprimer cette page de contenu ?')) return
    const { error } = await adminDeleteContentPage(id)
    if (!error) setPages((prev) => prev.filter((p) => p.id !== id))
  }

  return (
    <div className={styles.page}>

      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Pages de contenu</h1>
          <p className={styles.count}>{pages.length} page(s)</p>
        </div>
        {!isFormOpen && (
          <Button variant="primary" onClick={handleAdd}>+ Ajouter une page</Button>
        )}
      </div>

      {/* ─── Formulaire ajout / édition ─── */}
      {isFormOpen && (
        <form onSubmit={handleSave} className={styles.form}>
          <h2 className={styles.formTitle}>
            {isAdding ? 'Nouvelle page' : 'Modifier la page'}
          </h2>

          <div className={styles.field}>
            <label className={styles.label}>Titre *</label>
            <input className={styles.input} required value={form.title}
              onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
              placeholder="À propos" />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>
              Slug (URL) *{' '}
              <span className={styles.labelHint}>— accessible sur /p/votre-slug</span>
            </label>
            <input className={styles.input} required value={form.slug}
              onChange={(e) => setForm((p) => ({ ...p, slug: slugify(e.target.value) }))}
              placeholder="a-propos" />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>
              Contenu (HTML)
              <span className={styles.labelHint}> — balises h2, p, ul, a autorisées</span>
            </label>
            <textarea className={`${styles.input} ${styles.editor}`} rows={14}
              value={form.body}
              onChange={(e) => setForm((p) => ({ ...p, body: e.target.value }))}
              placeholder="<p>Votre contenu ici…</p>" />
          </div>

          <div className={styles.formActions}>
            <Button type="submit" variant="primary">
              {isAdding ? 'Créer la page' : 'Enregistrer'}
            </Button>
            <Button type="button" variant="ghost" onClick={handleCancel}>Annuler</Button>
          </div>
        </form>
      )}

      {/* ─── Tableau des pages ─── */}
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.th}>Titre</th>
              <th className={styles.th}>Slug (URL)</th>
              <th className={styles.th}>Dernière mise à jour</th>
              <th className={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {pages.map((page) => (
              <tr key={page.id} className={styles.tr}>
                <td className={styles.td}>
                  <span className={styles.pageTitle}>{page.title}</span>
                </td>
                <td className={styles.td}>
                  <code className={styles.slug}>/p/{page.slug}</code>
                </td>
                <td className={styles.td}>
                  {new Date(page.updatedAt).toLocaleDateString('fr-FR', {
                    day: 'numeric', month: 'long', year: 'numeric',
                  })}
                </td>
                <td className={styles.td}>
                  <div className={styles.actions}>
                    <Button size="sm" variant="secondary"
                      onClick={() => handleEdit(page)} disabled={isFormOpen}>
                      Modifier
                    </Button>
                    <Button size="sm" variant="ghost"
                      onClick={() => handleDelete(page.id)} disabled={isFormOpen}>
                      Supprimer
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {pages.length === 0 && (
          <p className={styles.empty}>Aucune page de contenu.</p>
        )}
      </div>
    </div>
  )
}
