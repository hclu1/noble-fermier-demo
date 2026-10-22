// ══════════════════════════════════════════════════════════════════════════
//  PANNEAU PRINCIPAL D'ADMINISTRATION CLIENT
//  Fichier : src/admin-perso/AdminPersoPanel.tsx
//
//  Accessible via : http://localhost:5173/admin-perso
//  Après connexion avec la roue dentée ⚙️ (Hclu1 / 3131)
//
//  Onglets disponibles :
//    🎨 Couleurs      — modifier les couleurs du site en temps réel
//    📝 Textes        — titres, accroche, boutons de la page d'accueil
//    📦 Produits      — nom, prix, description, image de chaque produit
//    🔧 Réinitialiser — revenir aux valeurs par défaut
// ══════════════════════════════════════════════════════════════════════════

import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  useAdminPerso,
  DEFAULT_COLORS,
  DEFAULT_TEXTS,
  type PersoColors,
  type PersoTexts,
  type PersoProduct,
} from './AdminPersoContext'
import { mockProducts, mockCategories } from '../data/mockProducts'
import ImagePicker from './ImagePicker'
import { isLocalImage, getLocalImageKey, loadImageFromDB } from './imageStorage'
import styles from './AdminPersoPanel.module.css'

type Tab = 'colors' | 'texts' | 'products' | 'reset'

export default function AdminPersoPanel() {
  const navigate = useNavigate()
  const { isAdminLoggedIn, perso, logout, saveColors, saveTexts, saveProducts } = useAdminPerso()

  const [tab, setTab] = useState<Tab>('colors')

  // Redirige si pas connecté
  useEffect(() => {
    if (!isAdminLoggedIn) navigate('/', { replace: true })
  }, [isAdminLoggedIn, navigate])

  if (!isAdminLoggedIn) return null

  function handleLogout() {
    logout()
    navigate('/')
  }

  return (
    <div className={styles.shell}>

      {/* ─── Topbar ─── */}
      <header className={styles.topbar}>
        <div className={styles.topbarLeft}>
          <span style={{ fontSize: '1.4rem' }}>⚙️</span>
          <span className={styles.topbarTitle}>Administration — Personnalisation</span>
        </div>
        <div className={styles.topbarRight}>
          <Link to="/" className={styles.siteLink}>← Voir le site</Link>
          <button className={styles.logoutBtn} onClick={handleLogout}>Déconnexion</button>
        </div>
      </header>

      <div className={styles.body}>

        {/* ─── Sidebar navigation ─── */}
        <nav className={styles.sidebar}>
          <p className={styles.sidebarLabel}>Personnalisation</p>
          <TabBtn label="🎨 Couleurs"  id="colors"   active={tab} setTab={setTab} />
          <TabBtn label="📝 Textes"    id="texts"    active={tab} setTab={setTab} />
          <TabBtn label="📦 Produits"  id="products" active={tab} setTab={setTab} />
          <p className={styles.sidebarLabel}>Outils</p>
          <TabBtn label="🔄 Réinitialiser" id="reset" active={tab} setTab={setTab} />
        </nav>

        {/* ─── Contenu de l'onglet actif ─── */}
        <main className={styles.main}>
          {tab === 'colors'   && <ColorsTab   colors={perso.colors}   save={saveColors} />}
          {tab === 'texts'    && <TextsTab    texts={perso.texts}     save={saveTexts} />}
          {tab === 'products' && <ProductsTab products={perso.products} save={saveProducts} />}
          {tab === 'reset'    && <ResetTab />}
        </main>
      </div>
    </div>
  )
}

// ─── Composant bouton onglet ───────────────────────────────────────────────
function TabBtn({ label, id, active, setTab }: {
  label: string; id: Tab; active: Tab; setTab: (t: Tab) => void
}) {
  return (
    <button
      className={`${styles.navBtn} ${active === id ? styles.activeTab : ''}`}
      onClick={() => setTab(id)}
    >
      {label}
    </button>
  )
}

// ══════════════════════════════════════════════════════════════════════════
//  ONGLET COULEURS
// ══════════════════════════════════════════════════════════════════════════
function ColorsTab({ colors, save }: { colors: PersoColors; save: (c: PersoColors) => void }) {
  const [form, setForm] = useState<PersoColors>(colors)
  const [saved, setSaved] = useState(false)

  function set(key: keyof PersoColors, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  function handleSave() {
    save(form)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  function handleReset() {
    setForm(DEFAULT_COLORS)
    save(DEFAULT_COLORS)
  }

  const colorFields: { key: keyof PersoColors; label: string; hint: string }[] = [
    { key: 'primary',      label: 'Couleur principale',   hint: 'Vert de la marque, navbar, titres actifs' },
    { key: 'primaryLight', label: 'Couleur claire',        hint: 'Survol, focus, accents doux' },
    { key: 'cta',          label: 'Bouton principal (CTA)', hint: 'Orange — appel à l\'action' },
    { key: 'bg',           label: 'Fond général',          hint: 'Couleur de fond de toute la page' },
    { key: 'surface',      label: 'Fond des cartes',       hint: 'Cartes produits, panneaux' },
    { key: 'heading',      label: 'Couleur des titres',    hint: 'H1, H2, H3 du site' },
    { key: 'text',         label: 'Texte courant',         hint: 'Corps de texte principal' },
  ]

  return (
    <div>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>🎨 Couleurs du site</h1>
        <p className={styles.pageSubtitle}>
          Modifiez les couleurs en temps réel. Les changements s'affichent immédiatement sur le site.
        </p>
      </div>

      {saved && <p className={styles.savedBanner}>✅ Couleurs enregistrées avec succès !</p>}

      <div className={styles.card}>
        <h2 className={styles.cardTitle}>🎨 Palette de couleurs</h2>
        <div className={styles.grid}>
          {colorFields.map(({ key, label, hint }) => (
            <div className={styles.field} key={key}>
              <label className={styles.label}>{label}</label>
              <div className={styles.colorRow}>
                <input
                  type="color"
                  className={styles.colorPicker}
                  value={form[key]}
                  onChange={(e) => set(key, e.target.value)}
                />
                <input
                  className={styles.input}
                  type="text"
                  value={form[key]}
                  onChange={(e) => set(key, e.target.value)}
                  placeholder="#2D6A4F"
                />
              </div>
              <span style={{ fontSize: 'var(--text-xs)', color: 'rgba(255,255,255,0.3)' }}>{hint}</span>
            </div>
          ))}
        </div>

        {/* Aperçu */}
        <div
          className={styles.colorPreview}
          style={{ background: form.primary, color: form.bg, marginTop: 'var(--space-6)' }}
        >
          Aperçu : texte sur fond principal
        </div>
        <div
          className={styles.colorPreview}
          style={{ background: form.cta, color: '#fff' }}
        >
          Aperçu : bouton CTA
        </div>
      </div>

      <div className={styles.actionRow}>
        <button className={styles.btnPrimary} onClick={handleSave}>💾 Enregistrer les couleurs</button>
        <button className={styles.btnSecondary} onClick={handleReset}>Réinitialiser par défaut</button>
      </div>
    </div>
  )
}

// ══════════════════════════════════════════════════════════════════════════
//  ONGLET TEXTES
// ══════════════════════════════════════════════════════════════════════════
function TextsTab({ texts, save }: { texts: PersoTexts; save: (t: PersoTexts) => void }) {
  const [form, setForm] = useState<PersoTexts>(texts)
  const [saved, setSaved] = useState(false)

  function set(key: keyof PersoTexts, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  function handleSave() {
    save(form)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  function handleReset() {
    setForm(DEFAULT_TEXTS)
    save(DEFAULT_TEXTS)
  }

  return (
    <div>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>📝 Textes du site</h1>
        <p className={styles.pageSubtitle}>
          Modifiez le nom de la boutique, l'accroche, les titres et les boutons de la page d'accueil.
        </p>
      </div>

      {saved && <p className={styles.savedBanner}>✅ Textes enregistrés avec succès !</p>}

      <div className={styles.card}>
        <h2 className={styles.cardTitle}>🏪 Identité de la boutique</h2>
        <div className={styles.grid}>
          <TextField label="Nom de la boutique" value={form.shopName}     set={(v) => set('shopName', v)} />
          <TextField label="Slogan"              value={form.tagline}      set={(v) => set('tagline', v)} />
        </div>
      </div>

      <div className={styles.card}>
        <h2 className={styles.cardTitle}>🏠 Page d'accueil — Section Héro</h2>
        <div className={styles.grid}>
          <TextField label="Accroche courte (au-dessus)"  value={form.heroEyebrow}    set={(v) => set('heroEyebrow', v)} />
          <TextField label="Bouton principal"             value={form.heroButtonMain}  set={(v) => set('heroButtonMain', v)} />
          <div className={`${styles.field} ${styles.gridFull}`}>
            <label className={styles.label}>Grand titre (héro)</label>
            <textarea
              className={`${styles.input} ${styles.textarea}`}
              value={form.heroTitle}
              onChange={(e) => set('heroTitle', e.target.value)}
              rows={3}
            />
          </div>
          <div className={`${styles.field} ${styles.gridFull}`}>
            <label className={styles.label}>Sous-titre (héro)</label>
            <textarea
              className={`${styles.input} ${styles.textarea}`}
              value={form.heroSubtitle}
              onChange={(e) => set('heroSubtitle', e.target.value)}
              rows={2}
            />
          </div>
          <TextField label="Bouton secondaire"  value={form.heroButtonSec}  set={(v) => set('heroButtonSec', v)} />
          <TextField label="Bandeau bas de page" value={form.ctaBandText}   set={(v) => set('ctaBandText', v)} />
        </div>
      </div>

      <div className={styles.actionRow}>
        <button className={styles.btnPrimary} onClick={handleSave}>💾 Enregistrer les textes</button>
        <button className={styles.btnSecondary} onClick={handleReset}>Réinitialiser par défaut</button>
      </div>
    </div>
  )
}

function TextField({ label, value, set }: { label: string; value: string; set: (v: string) => void }) {
  return (
    <div className={styles.field}>
      <label className={styles.label}>{label}</label>
      <input className={styles.input} type="text" value={value} onChange={(e) => set(e.target.value)} />
    </div>
  )
}

// ══════════════════════════════════════════════════════════════════════════
//  ONGLET PRODUITS
// ══════════════════════════════════════════════════════════════════════════
function ProductsTab({
  products: savedProducts,
  save,
}: {
  products: PersoProduct[]
  save: (p: PersoProduct[]) => void
}) {
  // Fusionne les mock avec les overrides sauvegardés
  const baseProducts: PersoProduct[] = mockProducts.map((p) => {
    const override = savedProducts.find((sp) => sp.id === p.id)
    return override ?? {
      id:          p.id,
      name:        p.name,
      description: p.description ?? '',
      price:       p.price,
      unit:        p.unit,
      imageUrl:    (p as any).imageUrl ?? '',
      categoryId:  p.categoryId,
      isFeatured:  p.isFeatured ?? false,
      isAvailable: p.isAvailable ?? true,
    }
  })

  const [products, setProducts] = useState<PersoProduct[]>(baseProducts)
  const [expanded, setExpanded] = useState<string | null>(null)
  const [saved, setSaved] = useState(false)

  function update(id: string, key: keyof PersoProduct, value: string | number | boolean) {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, [key]: value } : p))
    )
  }

  function handleSave() {
    save(products)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  function getCatName(catId: string) {
    return mockCategories.find((c) => c.id === catId)?.name ?? '—'
  }

  return (
    <div>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>📦 Produits</h1>
        <p className={styles.pageSubtitle}>
          Cliquez sur un produit pour modifier son nom, prix, description et image.
        </p>
      </div>

      {saved && <p className={styles.savedBanner}>✅ Produits enregistrés avec succès !</p>}

      <div className={styles.card}>
        <h2 className={styles.cardTitle}>📋 Liste des produits ({products.length})</h2>
        <div className={styles.productList}>
          {products.map((product) => (
            <div key={product.id}>
              {/* ─── Ligne produit ─── */}
              <div
                className={`${styles.productItem} ${expanded === product.id ? styles.expanded : ''}`}
                onClick={() => setExpanded(expanded === product.id ? null : product.id)}
              >
                {/* Miniature — charge depuis IndexedDB si image locale */}
                <ProductThumb imageUrl={product.imageUrl} name={product.name} />

                <div className={styles.productInfo}>
                  <div className={styles.productName}>{product.name}</div>
                  <div className={styles.productMeta}>
                    {getCatName(product.categoryId)} · {product.price.toFixed(2)} € {product.unit}
                    {' '}
                    <span className={product.isAvailable ? `${styles.badge} ${styles.badgeGreen}` : `${styles.badge} ${styles.badgeRed}`}>
                      {product.isAvailable ? 'En stock' : 'Rupture'}
                    </span>
                  </div>
                </div>

                <span className={styles.expandIcon}>›</span>
              </div>

              {/* ─── Formulaire d'édition (expansible) ─── */}
              {expanded === product.id && (
                <div className={styles.productForm}>
                  <div className={styles.grid}>

                    <div className={styles.field}>
                      <label className={styles.label}>Nom du produit</label>
                      <input className={styles.input} value={product.name}
                        onChange={(e) => update(product.id, 'name', e.target.value)} />
                    </div>

                    <div className={styles.field}>
                      <label className={styles.label}>Prix (€)</label>
                      <input className={styles.input} type="number" step="0.01" min="0"
                        value={product.price}
                        onChange={(e) => update(product.id, 'price', parseFloat(e.target.value) || 0)} />
                    </div>

                    <div className={styles.field}>
                      <label className={styles.label}>Unité (ex : le kg, la pièce)</label>
                      <input className={styles.input} value={product.unit}
                        onChange={(e) => update(product.id, 'unit', e.target.value)} />
                    </div>

                    <div className={styles.field}>
                      <label className={styles.label}>En stock</label>
                      <select className={styles.input}
                        value={product.isAvailable ? 'oui' : 'non'}
                        onChange={(e) => update(product.id, 'isAvailable', e.target.value === 'oui')}>
                        <option value="oui">✅ En stock</option>
                        <option value="non">❌ Rupture de stock</option>
                      </select>
                    </div>

                    <div className={styles.field}>
                      <label className={styles.label}>Produit vedette (accueil)</label>
                      <select className={styles.input}
                        value={product.isFeatured ? 'oui' : 'non'}
                        onChange={(e) => update(product.id, 'isFeatured', e.target.value === 'oui')}>
                        <option value="oui">⭐ Affiché en vedette</option>
                        <option value="non">Non affiché en vedette</option>
                      </select>
                    </div>

                    <div className={`${styles.field} ${styles.gridFull}`}>
                      <label className={styles.label}>Description</label>
                      <textarea
                        className={`${styles.input} ${styles.textarea}`}
                        rows={3}
                        value={product.description}
                        onChange={(e) => update(product.id, 'description', e.target.value)}
                      />
                    </div>

                    {/* ─── Sélecteur d'image — Photo ou Galerie ─── */}
                    <div className={`${styles.field} ${styles.gridFull}`}>
                      <label className={styles.label}>
                        📸 Photo du produit
                        <span style={{ fontWeight: 400, color: 'rgba(255,255,255,0.3)', marginLeft: 8 }}>
                          (la photo sera nommée d'après le nom du produit)
                        </span>
                      </label>
                      <ImagePicker
                        productName={product.name}
                        productId={product.id}
                        currentUrl={product.imageUrl}
                        onImageSaved={(url) => update(product.id, 'imageUrl', url)}
                      />
                      {/* Champ URL alternatif pour coller un lien externe */}
                      <details style={{ marginTop: 'var(--space-3)' }}>
                        <summary style={{
                          fontSize: 'var(--text-xs)', color: 'rgba(255,255,255,0.3)',
                          cursor: 'pointer', userSelect: 'none'
                        }}>
                          Ou coller une URL d'image externe
                        </summary>
                        <input
                          className={styles.input}
                          type="url"
                          value={isLocalImage(product.imageUrl) ? '' : product.imageUrl}
                          onChange={(e) => update(product.id, 'imageUrl', e.target.value)}
                          placeholder="https://images.unsplash.com/…"
                          style={{ marginTop: 'var(--space-2)' }}
                        />
                      </details>
                    </div>

                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className={styles.actionRow}>
        <button className={styles.btnPrimary} onClick={handleSave}>💾 Enregistrer tous les produits</button>
      </div>
    </div>
  )
}

// ══════════════════════════════════════════════════════════════════════════
//  ONGLET RÉINITIALISER
// ══════════════════════════════════════════════════════════════════════════
function ResetTab() {
  const { reset } = useAdminPerso()
  const navigate  = useNavigate()
  const [done, setDone] = useState(false)

  function handleReset() {
    if (window.confirm('Remettre TOUTES les personnalisations à zéro ? Cette action est irréversible.')) {
      reset()
      setDone(true)
      setTimeout(() => navigate('/'), 1500)
    }
  }

  return (
    <div>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>🔄 Réinitialisation</h1>
        <p className={styles.pageSubtitle}>
          Remet le site à ses valeurs d'origine (couleurs, textes, produits).
        </p>
      </div>

      {done && <p className={styles.savedBanner}>✅ Réinitialisation effectuée. Retour au site…</p>}

      <div className={styles.card}>
        <h2 className={styles.cardTitle}>⚠️ Remettre à zéro</h2>
        <p style={{ color: 'rgba(255,255,255,0.5)', marginBottom: 'var(--space-6)', lineHeight: 1.6 }}>
          Cette action supprime <strong style={{ color: '#fff' }}>toutes les personnalisations</strong> enregistrées
          dans le navigateur (couleurs, textes, modifications des produits).
          Elle n'affecte pas les données Supabase si elles sont configurées.
        </p>
        <button className={styles.btnDanger} onClick={handleReset}>
          🗑️ Réinitialiser toutes les personnalisations
        </button>
      </div>
    </div>
  )
}

// ══════════════════════════════════════════════════════════════════════════
//  MINIATURE PRODUIT — Charge l'image depuis IndexedDB si locale
//  Évite de passer des grandes data-URL en props (performance)
// ══════════════════════════════════════════════════════════════════════════
function ProductThumb({ imageUrl, name }: { imageUrl: string; name: string }) {
  const [src, setSrc] = useState<string | null>(null)

  useEffect(() => {
    if (!imageUrl) { setSrc(null); return }

    if (isLocalImage(imageUrl)) {
      loadImageFromDB(getLocalImageKey(imageUrl))
        .then((data) => setSrc(data ?? null))
        .catch(() => setSrc(null))
    } else {
      setSrc(imageUrl)
    }
  }, [imageUrl])

  return (
    <div className={styles.productThumb}>
      {src
        ? <img src={src} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 'var(--radius-md)' }} />
        : <span>🌿</span>
      }
    </div>
  )
}
