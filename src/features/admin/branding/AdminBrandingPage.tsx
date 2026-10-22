// Path: src/features/admin/branding/AdminBrandingPage.tsx

import { useState, useEffect } from 'react'
import { adminFetchBranding, adminUpdateBranding } from '../../../lib/queries/admin'
import type { Branding } from '../../../types'
import Button from '../../../components/ui/Button'
import styles from './AdminBrandingPage.module.css'

// Page réservée au platform_admin (concepteur SaaS).
// Permet de modifier les couleurs structurelles, les polices et l'image héro.
// La RLS Supabase bloque toute écriture par un shop_admin, même directe via l'API.

const DEFAULT_BRANDING: Branding = {
  primaryColor:    '#2D6A4F',
  secondaryColor:  '#F4845F',
  backgroundColor: '#FEFAE0',
  fontHeading:     'Playfair Display',
  fontBody:        'Nunito',
  heroImageUrl:    '',
}

export default function AdminBrandingPage() {
  const [form,   setForm]   = useState<Branding>(DEFAULT_BRANDING)
  const [saving, setSaving] = useState(false)
  const [saved,  setSaved]  = useState(false)
  const [error,  setError]  = useState<string | null>(null)

  useEffect(() => {
    adminFetchBranding().then(({ data }) => { if (data) setForm(data) })
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError(null)
    const { error } = await adminUpdateBranding(form)
    setSaving(false)
    if (error) {
      setError(error)
    } else {
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    }
  }

  return (
    <div className={styles.page}>

      <div className={styles.header}>
        <h1 className={styles.title}>Branding</h1>
        <p className={styles.subtitle}>
          Identité visuelle structurelle — couleurs du design system, polices et image héro.
        </p>
      </div>

      <p className={styles.notice}>
        🔒 Cette section est réservée au concepteur. Les modifications s'appliquent à l'ensemble du site.
      </p>

      {saved  && <p className={styles.savedBanner} role="status">✓ Branding enregistré.</p>}
      {error  && <p className={styles.errorBanner} role="alert">Erreur : {error}</p>}

      <form onSubmit={handleSubmit} className={styles.form}>

        {/* ─── Couleurs ─── */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Couleurs</h2>
          <div className={styles.grid}>

            <div className={styles.field}>
              <label className={styles.label}>Couleur primaire</label>
              <div className={styles.colorRow}>
                <input type="color" className={styles.colorPicker}
                  value={form.primaryColor}
                  onChange={(e) => setForm((p) => ({ ...p, primaryColor: e.target.value }))} />
                <input className={styles.input} type="text"
                  value={form.primaryColor}
                  onChange={(e) => setForm((p) => ({ ...p, primaryColor: e.target.value }))}
                  placeholder="#2D6A4F" />
              </div>
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Couleur secondaire (CTA)</label>
              <div className={styles.colorRow}>
                <input type="color" className={styles.colorPicker}
                  value={form.secondaryColor}
                  onChange={(e) => setForm((p) => ({ ...p, secondaryColor: e.target.value }))} />
                <input className={styles.input} type="text"
                  value={form.secondaryColor}
                  onChange={(e) => setForm((p) => ({ ...p, secondaryColor: e.target.value }))}
                  placeholder="#F4845F" />
              </div>
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Couleur de fond</label>
              <div className={styles.colorRow}>
                <input type="color" className={styles.colorPicker}
                  value={form.backgroundColor}
                  onChange={(e) => setForm((p) => ({ ...p, backgroundColor: e.target.value }))} />
                <input className={styles.input} type="text"
                  value={form.backgroundColor}
                  onChange={(e) => setForm((p) => ({ ...p, backgroundColor: e.target.value }))}
                  placeholder="#FEFAE0" />
              </div>
            </div>

          </div>
        </section>

        {/* ─── Polices ─── */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Polices</h2>
          <p className={styles.sectionHint}>
            Noms exacts de polices Google Fonts (ex : "Playfair Display", "Nunito").
          </p>
          <div className={styles.grid}>
            <div className={styles.field}>
              <label className={styles.label}>Police des titres</label>
              <input className={styles.input} value={form.fontHeading}
                onChange={(e) => setForm((p) => ({ ...p, fontHeading: e.target.value }))}
                placeholder="Playfair Display" />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Police du corps</label>
              <input className={styles.input} value={form.fontBody}
                onChange={(e) => setForm((p) => ({ ...p, fontBody: e.target.value }))}
                placeholder="Nunito" />
            </div>
          </div>
        </section>

        {/* ─── Image héro ─── */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Image héro</h2>
          <div className={styles.field}>
            <label className={styles.label}>URL de l'image (page d'accueil)</label>
            <input className={styles.input} type="url"
              value={form.heroImageUrl ?? ''}
              onChange={(e) => setForm((p) => ({ ...p, heroImageUrl: e.target.value }))}
              placeholder="https://…" />
          </div>
          {form.heroImageUrl && (
            <img src={form.heroImageUrl} alt="Aperçu héro" className={styles.heroPreview} />
          )}
        </section>

        <div className={styles.saveRow}>
          <Button type="submit" size="lg" variant="primary" disabled={saving}>
            {saving ? 'Enregistrement…' : 'Enregistrer le branding'}
          </Button>
        </div>

      </form>
    </div>
  )
}
