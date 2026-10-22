// Path: src/features/admin/settings/AdminSettingsPage.tsx

import { useState, useEffect } from 'react'
import { fetchShopSettings } from '../../../lib/queries/settings'
import { adminUpdateSettings } from '../../../lib/queries/admin'
import { brandConfig } from '../../../config/brandConfig'
import type { ShopSettings, SocialLink } from '../../../types'
import Button from '../../../components/ui/Button'
import styles from './AdminSettingsPage.module.css'

export default function AdminSettingsPage() {
  const [form,   setForm]   = useState<ShopSettings>(brandConfig)
  const [saving, setSaving] = useState(false)
  const [saved,  setSaved]  = useState(false)

  // Charge les réglages depuis Supabase (ou brandConfig en mode mock)
  useEffect(() => {
    fetchShopSettings().then(({ data }) => { if (data) setForm(data) })
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    const { error } = await adminUpdateSettings(form)
    setSaving(false)
    if (!error) {
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    }
  }

  function updateHour(index: number, value: string) {
    const updated = [...form.openingHours]
    updated[index] = value
    setForm((p) => ({ ...p, openingHours: updated }))
  }

  function addHour() {
    setForm((p) => ({ ...p, openingHours: [...p.openingHours, ''] }))
  }

  function removeHour(index: number) {
    setForm((p) => ({ ...p, openingHours: p.openingHours.filter((_, i) => i !== index) }))
  }

  function updateSocial(index: number, field: keyof SocialLink, value: string) {
    const updated = [...form.socialLinks]
    updated[index] = { ...updated[index], [field]: value }
    setForm((p) => ({ ...p, socialLinks: updated }))
  }

  function addSocial() {
    setForm((p) => ({ ...p, socialLinks: [...p.socialLinks, { platform: '', url: '' }] }))
  }

  function removeSocial(index: number) {
    setForm((p) => ({ ...p, socialLinks: p.socialLinks.filter((_, i) => i !== index) }))
  }

  return (
    <div className={styles.page}>

      <div className={styles.header}>
        <h1 className={styles.title}>Réglages de la boutique</h1>
        <p className={styles.subtitle}>
          Ces informations apparaissent dans le header, le footer et la page contact.
        </p>
      </div>

      {saved && <p className={styles.savedBanner} role="status">✓ Réglages enregistrés.</p>}

      <form onSubmit={handleSubmit} className={styles.form}>

        {/* ─── Identité ─── */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Identité</h2>
          <div className={styles.grid}>
            <div className={styles.field}>
              <label className={styles.label}>Nom de la boutique *</label>
              <input className={styles.input} required value={form.name}
                onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Slogan</label>
              <input className={styles.input} value={form.tagline ?? ''}
                onChange={(e) => setForm((p) => ({ ...p, tagline: e.target.value }))} />
            </div>
            <div className={`${styles.field} ${styles.fieldFull}`}>
              <label className={styles.label}>URL du logo</label>
              <input className={styles.input} type="url" value={form.logoUrl ?? ''}
                onChange={(e) => setForm((p) => ({ ...p, logoUrl: e.target.value }))}
                placeholder="https://…" />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>
                Couleur principale
                <span className={styles.labelHint}> — boutons et accents (ex : #2D6A4F)</span>
              </label>
              <div className={styles.colorRow}>
                <input type="color"
                  className={styles.colorPicker}
                  value={form.primaryColor ?? '#2D6A4F'}
                  onChange={(e) => setForm((p) => ({ ...p, primaryColor: e.target.value }))} />
                <input className={styles.input} type="text"
                  value={form.primaryColor ?? ''}
                  onChange={(e) => setForm((p) => ({ ...p, primaryColor: e.target.value }))}
                  placeholder="#2D6A4F" />
              </div>
            </div>
          </div>
        </section>

        {/* ─── Contact ─── */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Contact</h2>
          <div className={styles.grid}>
            <div className={styles.field}>
              <label className={styles.label}>Téléphone</label>
              <input className={styles.input} type="tel" value={form.phone ?? ''}
                onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))} />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Email</label>
              <input className={styles.input} type="email" value={form.email ?? ''}
                onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} />
            </div>
          </div>
        </section>

        {/* ─── Adresse ─── */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Adresse</h2>
          <div className={styles.grid}>
            <div className={`${styles.field} ${styles.fieldFull}`}>
              <label className={styles.label}>Rue</label>
              <input className={styles.input} value={form.address.street}
                onChange={(e) =>
                  setForm((p) => ({ ...p, address: { ...p.address, street: e.target.value } }))
                } />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Code postal</label>
              <input className={styles.input} value={form.address.zip}
                onChange={(e) =>
                  setForm((p) => ({ ...p, address: { ...p.address, zip: e.target.value } }))
                } />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Ville</label>
              <input className={styles.input} value={form.address.city}
                onChange={(e) =>
                  setForm((p) => ({ ...p, address: { ...p.address, city: e.target.value } }))
                } />
            </div>
          </div>
        </section>

        {/* ─── Horaires ─── */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Horaires d'ouverture</h2>
          <div className={styles.listField}>
            {form.openingHours.map((line, i) => (
              <div key={i} className={styles.listRow}>
                <input className={styles.input} value={line}
                  onChange={(e) => updateHour(i, e.target.value)}
                  placeholder="Lundi – Vendredi : 8h – 19h" />
                <button type="button" className={styles.removeBtn}
                  onClick={() => removeHour(i)} aria-label="Supprimer">✕</button>
              </div>
            ))}
            <Button type="button" variant="ghost" size="sm" onClick={addHour}>
              + Ajouter un horaire
            </Button>
          </div>
        </section>

        {/* ─── Réseaux sociaux ─── */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Réseaux sociaux</h2>
          <div className={styles.listField}>
            {form.socialLinks.map((social, i) => (
              <div key={i} className={styles.socialRow}>
                <input className={styles.input} value={social.platform}
                  onChange={(e) => updateSocial(i, 'platform', e.target.value)}
                  placeholder="Instagram" />
                <input className={`${styles.input} ${styles.inputUrl}`} type="url"
                  value={social.url}
                  onChange={(e) => updateSocial(i, 'url', e.target.value)}
                  placeholder="https://…" />
                <button type="button" className={styles.removeBtn}
                  onClick={() => removeSocial(i)} aria-label="Supprimer">✕</button>
              </div>
            ))}
            <Button type="button" variant="ghost" size="sm" onClick={addSocial}>
              + Ajouter un réseau
            </Button>
          </div>
        </section>

        <div className={styles.saveRow}>
          <Button type="submit" size="lg" variant="primary" disabled={saving}>
            {saving ? 'Enregistrement…' : 'Enregistrer les réglages'}
          </Button>
        </div>
      </form>
    </div>
  )
}
