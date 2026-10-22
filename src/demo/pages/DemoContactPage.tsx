// Path: src/demo/pages/DemoContactPage.tsx

import React, { useState } from 'react'
import { DEMO_SHOP_SETTINGS } from '../data/demoSeedData'
import { useDemoContext } from '../context/DemoContext'
import styles from './DemoContactPage.module.css'

export default function DemoContactPage() {
  const { triggerDemoNotice } = useDemoContext()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    triggerDemoNotice('Envoi du formulaire de contact')
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>Boutique & Horaires d’Ouverture</h1>
        <p className={styles.subtitle}>
          Venez nous rencontrer directement au magasin ou posez-nous vos questions primeurs.
        </p>
      </header>

      <div className={styles.grid}>
        {/* Coordonnées */}
        <div className={styles.card}>
          <h2 className={styles.sectionTitle}>Coordonnées de l'Échoppe</h2>

          <div className={styles.infoList}>
            <div className={styles.infoItem}>
              <span className={styles.infoIcon}>📍</span>
              <div className={styles.infoContent}>
                <h4>Adresse</h4>
                <p>{DEMO_SHOP_SETTINGS.address.street}, {DEMO_SHOP_SETTINGS.address.zip} {DEMO_SHOP_SETTINGS.address.city}</p>
              </div>
            </div>

            <div className={styles.infoItem}>
              <span className={styles.infoIcon}>📞</span>
              <div className={styles.infoContent}>
                <h4>Téléphone</h4>
                <p>{DEMO_SHOP_SETTINGS.phone}</p>
              </div>
            </div>

            <div className={styles.infoItem}>
              <span className={styles.infoIcon}>✉️</span>
              <div className={styles.infoContent}>
                <h4>Email</h4>
                <p>{DEMO_SHOP_SETTINGS.email}</p>
              </div>
            </div>
          </div>

          <h3 className={styles.sectionTitle} style={{ marginTop: '2rem' }}>Horaires des Arrivages</h3>
          <table className={styles.hoursTable}>
            <tbody>
              {DEMO_SHOP_SETTINGS.openingHours.map((line, i) => (
                <tr key={i}>
                  <td style={{ fontWeight: 500, color: '#374151' }}>{line}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Formulaire */}
        <div className={styles.card}>
          <h2 className={styles.sectionTitle}>Écrivez-nous</h2>
          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Votre nom</label>
              <input
                type="text"
                required
                className={styles.input}
                placeholder="Ex. Élodie Martin"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Adresse e-mail</label>
              <input
                type="email"
                required
                className={styles.input}
                placeholder="elodie@exemple.fr"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Votre message</label>
              <textarea
                required
                className={styles.textarea}
                placeholder="Demande de cagette spéciale, question sur un arrivage..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>

            <button type="submit" className={styles.submitBtn}>
              Envoyer le message (Simulation Démo)
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
