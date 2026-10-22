// ══════════════════════════════════════════════════════════════════════════
//  SÉLECTEUR D'IMAGE — Caméra + Galerie + Compression automatique
//  Fichier : src/admin-perso/ImagePicker.tsx
//
//  Fonctionnement :
//    📷 "Prendre une photo"  → ouvre l'appareil photo du téléphone (capture=environment)
//    🖼️ "Choisir galerie"   → ouvre la galerie photos du téléphone / le sélecteur de fichiers
//
//    Dès qu'une image est sélectionnée :
//      1. Compression via canvas (max 900px, JPEG 0.78) → ~50–120 Ko
//      2. Stockage dans IndexedDB sous la clé "nom-du-produit_id"
//      3. onImageSaved(url) est appelé avec "local:nom-du-produit_id"
//
//  Props :
//    productName : nom du produit → utilisé pour nommer le fichier
//    productId   : id du produit → combiné au nom pour la clé unique
//    currentUrl  : URL actuelle (peut être "local:xxx" ou "https://...")
//    onImageSaved: callback appelé avec la nouvelle URL
// ══════════════════════════════════════════════════════════════════════════

import { useRef, useState, useEffect } from 'react'
import {
  compressImage,
  saveImageToDB,
  loadImageFromDB,
  deleteImageFromDB,
  makeImageKey,
  LOCAL_IMAGE_PREFIX,
  isLocalImage,
  getLocalImageKey,
} from './imageStorage'
import styles from './ImagePicker.module.css'

interface ImagePickerProps {
  productName: string
  productId:   string
  currentUrl:  string
  onImageSaved: (newUrl: string) => void
}

export default function ImagePicker({
  productName,
  productId,
  currentUrl,
  onImageSaved,
}: ImagePickerProps) {
  const cameraRef  = useRef<HTMLInputElement>(null)
  const galleryRef = useRef<HTMLInputElement>(null)

  const [previewSrc,  setPreviewSrc]  = useState<string | null>(null)
  const [loading,     setLoading]     = useState(false)
  const [sizeKb,      setSizeKb]      = useState<number | null>(null)

  // ─── Charge l'aperçu initial ───────────────────────────────────────────
  useEffect(() => {
    if (!currentUrl) { setPreviewSrc(null); return }

    if (isLocalImage(currentUrl)) {
      // Image stockée dans IndexedDB → on la charge
      loadImageFromDB(getLocalImageKey(currentUrl))
        .then((data) => setPreviewSrc(data))
        .catch(() => setPreviewSrc(null))
    } else {
      // URL externe → affichage direct
      setPreviewSrc(currentUrl)
    }
  }, [currentUrl])

  // ─── Traitement d'un fichier sélectionné ─────────────────────────────
  async function handleFile(file: File) {
    if (!file.type.startsWith('image/')) return

    setLoading(true)
    try {
      // 1. Compression canvas → JPEG optimisé
      const compressed = await compressImage(file, 900, 0.78)

      // 2. Calcul de la taille approximative
      const bytes = Math.round((compressed.length * 3) / 4)
      setSizeKb(Math.round(bytes / 1024))

      // 3. Clé IndexedDB : "tomates-anciennes_p-1"
      const key = makeImageKey(productName, productId)

      // 4. Stockage IndexedDB
      await saveImageToDB(key, compressed)

      // 5. Mise à jour de l'aperçu
      setPreviewSrc(compressed)

      // 6. Notification du parent avec la clé "local:…"
      onImageSaved(`${LOCAL_IMAGE_PREFIX}${key}`)
    } catch (err) {
      console.error('[ImagePicker] Erreur traitement image :', err)
    } finally {
      setLoading(false)
    }
  }

  function onInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
    // Remet l'input à zéro pour permettre de re-sélectionner le même fichier
    e.target.value = ''
  }

  // ─── Suppression de l'image ───────────────────────────────────────────
  async function handleDelete() {
    if (isLocalImage(currentUrl)) {
      await deleteImageFromDB(getLocalImageKey(currentUrl)).catch(() => {})
    }
    setPreviewSrc(null)
    setSizeKb(null)
    onImageSaved('')
  }

  return (
    <div className={styles.pickerZone}>

      {/* ─── Aperçu de l'image ─── */}
      {previewSrc ? (
        <div className={styles.previewWrapper}>
          <img src={previewSrc} alt="Aperçu produit" className={styles.previewImg} />
          <div className={styles.previewOverlay}>
            <button
              type="button"
              className={`${styles.imgBtn} ${styles.imgBtnCamera}`}
              onClick={() => cameraRef.current?.click()}
            >
              📷 Nouvelle photo
            </button>
            <button
              type="button"
              className={`${styles.imgBtn} ${styles.imgBtnGallery}`}
              onClick={() => galleryRef.current?.click()}
            >
              🖼️ Autre image
            </button>
          </div>
        </div>
      ) : (
        <div className={styles.emptyZone}>
          <span className={styles.emptyIcon}>📷</span>
          <p className={styles.emptyText}>
            Aucune photo pour ce produit.<br />
            Prenez une photo ou choisissez depuis votre galerie.
          </p>
        </div>
      )}

      {/* ─── Barre de chargement ─── */}
      {loading && (
        <div className={styles.loadingBar}>
          <div className={styles.loadingFill} />
        </div>
      )}

      {/* ─── Info taille ─── */}
      {sizeKb !== null && !loading && (
        <p className={styles.imgInfo}>
          ✅ Image compressée · {sizeKb} Ko · nommée «&nbsp;
          <strong style={{ color: 'rgba(255,255,255,0.6)' }}>
            {makeImageKey(productName, productId)}
          </strong>
          &nbsp;»
        </p>
      )}
      {previewSrc && isLocalImage(currentUrl) && sizeKb === null && (
        <p className={styles.imgInfo}>
          Photo locale · clé&nbsp;
          <strong style={{ color: 'rgba(255,255,255,0.6)' }}>
            {getLocalImageKey(currentUrl)}
          </strong>
        </p>
      )}

      {/* ─── Boutons d'action ─── */}
      <div className={styles.btnRow}>
        {/* Bouton Appareil photo — capture=environment = caméra arrière sur mobile */}
        <button
          type="button"
          className={`${styles.imgBtn} ${styles.imgBtnCamera}`}
          onClick={() => cameraRef.current?.click()}
          disabled={loading}
        >
          📷 Prendre une photo
        </button>

        {/* Bouton Galerie / sélecteur de fichier */}
        <button
          type="button"
          className={`${styles.imgBtn} ${styles.imgBtnGallery}`}
          onClick={() => galleryRef.current?.click()}
          disabled={loading}
        >
          🖼️ Choisir dans la galerie
        </button>

        {/* Bouton Supprimer (visible seulement si image présente) */}
        {previewSrc && (
          <button
            type="button"
            className={`${styles.imgBtn} ${styles.imgBtnDelete}`}
            onClick={handleDelete}
            disabled={loading}
            title="Supprimer l'image"
          >
            🗑️
          </button>
        )}
      </div>

      {/* ─── Inputs fichiers cachés ─── */}

      {/* Caméra : capture="environment" déclenche la caméra arrière sur mobile */}
      <input
        ref={cameraRef}
        type="file"
        accept="image/*"
        capture="environment"
        className={styles.hiddenInput}
        onChange={onInputChange}
        aria-label="Prendre une photo"
      />

      {/* Galerie : sans attribut capture → ouvre le sélecteur de fichier normal */}
      <input
        ref={galleryRef}
        type="file"
        accept="image/*"
        className={styles.hiddenInput}
        onChange={onInputChange}
        aria-label="Choisir une image depuis la galerie"
      />

    </div>
  )
}
