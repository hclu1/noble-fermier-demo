// Path: src/features/account/AccountPage.tsx

import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../auth/useAuth'
import Container from '../../layout/Container'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import styles from './AccountPage.module.css'

type EditMode = 'none' | 'identity' | 'address'

// Page Mon compte — affichage et édition du profil
// Sections : identité, adresse, sécurité (changement de mot de passe), déconnexion
export default function AccountPage() {
  const { user, logout, updateProfile } = useAuth()
  const [editMode, setEditMode] = useState<EditMode>('none')
  const [saving,   setSaving]   = useState(false)
  const [saved,    setSaved]    = useState(false)

  // Formulaire identité
  const [identity, setIdentity] = useState({
    firstName: user?.profile.firstName ?? '',
    lastName:  user?.profile.lastName  ?? '',
    phone:     user?.profile.phone     ?? '',
  })

  // Formulaire adresse
  const [address, setAddress] = useState({
    street: user?.profile.address?.street ?? '',
    zip:    user?.profile.address?.zip    ?? '',
    city:   user?.profile.address?.city   ?? '',
  })

  if (!user) return null

  async function handleSaveIdentity(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    await updateProfile(identity)
    setSaving(false)
    setSaved(true)
    setEditMode('none')
    setTimeout(() => setSaved(false), 3000)
  }

  async function handleSaveAddress(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    await updateProfile({ address })
    setSaving(false)
    setSaved(true)
    setEditMode('none')
    setTimeout(() => setSaved(false), 3000)
  }

  async function handleLogout() {
    await logout()
  }

  return (
    <Container>
      <div className={styles.page}>

        {/* En-tête */}
        <div className={styles.header}>
          <div>
            <h1 className={styles.title}>Mon compte</h1>
            <p className={styles.welcome}>
              Bonjour, <strong>{user.profile.firstName}</strong> 👋
            </p>
          </div>
          <div className={styles.headerActions}>
            <Link to="/mes-commandes">
              <Button variant="secondary">Mes commandes</Button>
            </Link>
            <Button variant="ghost" onClick={handleLogout}>
              Se déconnecter
            </Button>
          </div>
        </div>

        {/* Confirmation sauvegarde */}
        {saved && (
          <p className={styles.savedBanner} role="status">
            ✓ Modifications enregistrées.
          </p>
        )}

        <div className={styles.grid}>

          {/* ─── Identité ─── */}
          <Card padding="lg">
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Identité</h2>
              {editMode !== 'identity' && (
                <Button variant="ghost" size="sm" onClick={() => setEditMode('identity')}>
                  Modifier
                </Button>
              )}
            </div>

            {editMode === 'identity' ? (
              <form onSubmit={handleSaveIdentity} className={styles.form}>
                <div className={styles.row}>
                  <div className={styles.field}>
                    <label className={styles.label}>Prénom</label>
                    <input
                      className={styles.input}
                      value={identity.firstName}
                      onChange={(e) => setIdentity((p) => ({ ...p, firstName: e.target.value }))}
                      required
                    />
                  </div>
                  <div className={styles.field}>
                    <label className={styles.label}>Nom</label>
                    <input
                      className={styles.input}
                      value={identity.lastName}
                      onChange={(e) => setIdentity((p) => ({ ...p, lastName: e.target.value }))}
                      required
                    />
                  </div>
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>Téléphone</label>
                  <input
                    className={styles.input}
                    type="tel"
                    value={identity.phone}
                    onChange={(e) => setIdentity((p) => ({ ...p, phone: e.target.value }))}
                  />
                </div>
                <div className={styles.formActions}>
                  <Button type="submit" variant="primary" size="sm" disabled={saving}>
                    {saving ? 'Enregistrement…' : 'Enregistrer'}
                  </Button>
                  <Button type="button" variant="ghost" size="sm" onClick={() => setEditMode('none')}>
                    Annuler
                  </Button>
                </div>
              </form>
            ) : (
              <dl className={styles.infoList}>
                <InfoRow label="Prénom"    value={user.profile.firstName} />
                <InfoRow label="Nom"       value={user.profile.lastName}  />
                <InfoRow label="Email"     value={user.email}             />
                <InfoRow label="Téléphone" value={user.profile.phone ?? '—'} />
              </dl>
            )}
          </Card>

          {/* ─── Adresse ─── */}
          <Card padding="lg">
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Adresse de retrait</h2>
              {editMode !== 'address' && (
                <Button variant="ghost" size="sm" onClick={() => setEditMode('address')}>
                  Modifier
                </Button>
              )}
            </div>

            {editMode === 'address' ? (
              <form onSubmit={handleSaveAddress} className={styles.form}>
                <div className={styles.field}>
                  <label className={styles.label}>Rue</label>
                  <input
                    className={styles.input}
                    value={address.street}
                    onChange={(e) => setAddress((p) => ({ ...p, street: e.target.value }))}
                  />
                </div>
                <div className={styles.row}>
                  <div className={styles.field}>
                    <label className={styles.label}>Code postal</label>
                    <input
                      className={styles.input}
                      value={address.zip}
                      onChange={(e) => setAddress((p) => ({ ...p, zip: e.target.value }))}
                    />
                  </div>
                  <div className={styles.field}>
                    <label className={styles.label}>Ville</label>
                    <input
                      className={styles.input}
                      value={address.city}
                      onChange={(e) => setAddress((p) => ({ ...p, city: e.target.value }))}
                    />
                  </div>
                </div>
                <div className={styles.formActions}>
                  <Button type="submit" variant="primary" size="sm" disabled={saving}>
                    {saving ? 'Enregistrement…' : 'Enregistrer'}
                  </Button>
                  <Button type="button" variant="ghost" size="sm" onClick={() => setEditMode('none')}>
                    Annuler
                  </Button>
                </div>
              </form>
            ) : (
              <dl className={styles.infoList}>
                <InfoRow label="Rue"          value={user.profile.address?.street ?? '—'} />
                <InfoRow label="Code postal"  value={user.profile.address?.zip    ?? '—'} />
                <InfoRow label="Ville"        value={user.profile.address?.city   ?? '—'} />
              </dl>
            )}
          </Card>

          {/* ─── Sécurité ─── */}
          <Card padding="lg">
            <h2 className={styles.sectionTitle}>Sécurité</h2>
            <p className={styles.securityText}>
              Pour changer votre mot de passe, utilisez le lien de réinitialisation.
            </p>
            <Link to="/mot-de-passe-oublie">
              <Button variant="secondary" size="sm">
                Réinitialiser le mot de passe
              </Button>
            </Link>
          </Card>

          {/* ─── Compte ─── */}
          <Card padding="lg">
            <h2 className={styles.sectionTitle}>Mon compte</h2>
            <p className={styles.securityText}>
              Membre depuis le{' '}
              {new Date(user.profile.createdAt).toLocaleDateString('fr-FR', {
                month: 'long',
                year: 'numeric',
              })}.
            </p>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              Se déconnecter
            </Button>
          </Card>
        </div>
      </div>
    </Container>
  )
}

// ─── Composant ligne d'info ───
function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className={styles.infoRow}>
      <dt className={styles.infoLabel}>{label}</dt>
      <dd className={styles.infoValue}>{value}</dd>
    </div>
  )
}
