// Path: src/features/contact/ContactPage.tsx

import { useState } from 'react'
import { brandConfig } from '../../config/brandConfig'
import Container from '../../layout/Container'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import styles from './ContactPage.module.css'

type FormStatus = 'idle' | 'sending' | 'success' | 'error'

// Page contact — formulaire + infos boutique
// Le formulaire est fonctionnel côté UI, l'envoi réel nécessitera Supabase ou un service email
export default function ContactPage() {
  const [status, setStatus] = useState<FormStatus>('idle')
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    subject: '',
    message: '',
  })

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('sending')

    // TODO : envoyer via Supabase Edge Function ou service email
    // Pour l'instant on simule un délai
    await new Promise((r) => setTimeout(r, 800))
    setStatus('success')
  }

  return (
    <Container>
      <div className={styles.page}>

        {/* En-tête */}
        <div className={styles.header}>
          <h1 className={styles.title}>Nous contacter</h1>
          <p className={styles.subtitle}>
            Une question, une commande spéciale ? On vous répond sous 24h.
          </p>
        </div>

        <div className={styles.layout}>

          {/* ─── Formulaire ─── */}
          <div>
            {status === 'success' ? (
              <Card padding="lg" className={styles.successCard}>
                <span className={styles.successIcon}>✓</span>
                <h2 className={styles.successTitle}>Message envoyé !</h2>
                <p>Merci pour votre message. Nous vous répondrons dans les meilleurs délais.</p>
                <Button
                  variant="secondary"
                  onClick={() => {
                    setStatus('idle')
                    setForm({ firstName: '', lastName: '', email: '', subject: '', message: '' })
                  }}
                >
                  Envoyer un autre message
                </Button>
              </Card>
            ) : (
              <form onSubmit={handleSubmit} className={styles.form} noValidate>
                <div className={styles.row}>
                  <div className={styles.field}>
                    <label htmlFor="firstName" className={styles.label}>Prénom *</label>
                    <input
                      id="firstName"
                      name="firstName"
                      type="text"
                      required
                      value={form.firstName}
                      onChange={handleChange}
                      className={styles.input}
                      placeholder="Marie"
                    />
                  </div>
                  <div className={styles.field}>
                    <label htmlFor="lastName" className={styles.label}>Nom *</label>
                    <input
                      id="lastName"
                      name="lastName"
                      type="text"
                      required
                      value={form.lastName}
                      onChange={handleChange}
                      className={styles.input}
                      placeholder="Dupont"
                    />
                  </div>
                </div>

                <div className={styles.field}>
                  <label htmlFor="email" className={styles.label}>Email *</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={form.email}
                    onChange={handleChange}
                    className={styles.input}
                    placeholder="marie@exemple.fr"
                  />
                </div>

                <div className={styles.field}>
                  <label htmlFor="subject" className={styles.label}>Sujet</label>
                  <select
                    id="subject"
                    name="subject"
                    value={form.subject}
                    onChange={handleChange}
                    className={styles.input}
                  >
                    <option value="">Choisir un sujet…</option>
                    <option value="commande">Question sur une commande</option>
                    <option value="produit">Information produit</option>
                    <option value="disponibilite">Disponibilité</option>
                    <option value="autre">Autre</option>
                  </select>
                </div>

                <div className={styles.field}>
                  <label htmlFor="message" className={styles.label}>Message *</label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={5}
                    value={form.message}
                    onChange={handleChange}
                    className={`${styles.input} ${styles.textarea}`}
                    placeholder="Votre message…"
                  />
                </div>

                {status === 'error' && (
                  <p className={styles.errorMessage}>
                    Une erreur est survenue. Veuillez réessayer.
                  </p>
                )}

                <Button
                  type="submit"
                  size="lg"
                  variant="primary"
                  fullWidth
                  disabled={status === 'sending'}
                >
                  {status === 'sending' ? 'Envoi en cours…' : 'Envoyer le message'}
                </Button>
              </form>
            )}
          </div>

          {/* ─── Infos boutique ─── */}
          <aside className={styles.aside}>
            <Card padding="lg">
              <h2 className={styles.asideTitle}>Retrouvez-nous</h2>

              {brandConfig.address && (
                <div className={styles.infoBlock}>
                  <span className={styles.infoIcon}>📍</span>
                  <div>
                    <p className={styles.infoLabel}>Adresse</p>
                    <p>{brandConfig.address.street}</p>
                    <p>{brandConfig.address.zip} {brandConfig.address.city}</p>
                  </div>
                </div>
              )}

              {brandConfig.phone && (
                <div className={styles.infoBlock}>
                  <span className={styles.infoIcon}>📞</span>
                  <div>
                    <p className={styles.infoLabel}>Téléphone</p>
                    <a href={`tel:${brandConfig.phone}`} className={styles.infoLink}>
                      {brandConfig.phone}
                    </a>
                  </div>
                </div>
              )}

              {brandConfig.email && (
                <div className={styles.infoBlock}>
                  <span className={styles.infoIcon}>✉️</span>
                  <div>
                    <p className={styles.infoLabel}>Email</p>
                    <a href={`mailto:${brandConfig.email}`} className={styles.infoLink}>
                      {brandConfig.email}
                    </a>
                  </div>
                </div>
              )}

              {brandConfig.openingHours && (
                <div className={styles.infoBlock}>
                  <span className={styles.infoIcon}>🕐</span>
                  <div>
                    <p className={styles.infoLabel}>Horaires</p>
                    {brandConfig.openingHours.map((line, i) => (
                      <p key={i}>{line}</p>
                    ))}
                  </div>
                </div>
              )}
            </Card>
          </aside>
        </div>
      </div>
    </Container>
  )
}
