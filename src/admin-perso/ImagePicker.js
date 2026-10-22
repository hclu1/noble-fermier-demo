import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
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
import { useRef, useState, useEffect } from 'react';
import { compressImage, saveImageToDB, loadImageFromDB, deleteImageFromDB, makeImageKey, LOCAL_IMAGE_PREFIX, isLocalImage, getLocalImageKey, } from './imageStorage';
import styles from './ImagePicker.module.css';
export default function ImagePicker({ productName, productId, currentUrl, onImageSaved, }) {
    const cameraRef = useRef(null);
    const galleryRef = useRef(null);
    const [previewSrc, setPreviewSrc] = useState(null);
    const [loading, setLoading] = useState(false);
    const [sizeKb, setSizeKb] = useState(null);
    // ─── Charge l'aperçu initial ───────────────────────────────────────────
    useEffect(() => {
        if (!currentUrl) {
            setPreviewSrc(null);
            return;
        }
        if (isLocalImage(currentUrl)) {
            // Image stockée dans IndexedDB → on la charge
            loadImageFromDB(getLocalImageKey(currentUrl))
                .then((data) => setPreviewSrc(data))
                .catch(() => setPreviewSrc(null));
        }
        else {
            // URL externe → affichage direct
            setPreviewSrc(currentUrl);
        }
    }, [currentUrl]);
    // ─── Traitement d'un fichier sélectionné ─────────────────────────────
    async function handleFile(file) {
        if (!file.type.startsWith('image/'))
            return;
        setLoading(true);
        try {
            // 1. Compression canvas → JPEG optimisé
            const compressed = await compressImage(file, 900, 0.78);
            // 2. Calcul de la taille approximative
            const bytes = Math.round((compressed.length * 3) / 4);
            setSizeKb(Math.round(bytes / 1024));
            // 3. Clé IndexedDB : "tomates-anciennes_p-1"
            const key = makeImageKey(productName, productId);
            // 4. Stockage IndexedDB
            await saveImageToDB(key, compressed);
            // 5. Mise à jour de l'aperçu
            setPreviewSrc(compressed);
            // 6. Notification du parent avec la clé "local:…"
            onImageSaved(`${LOCAL_IMAGE_PREFIX}${key}`);
        }
        catch (err) {
            console.error('[ImagePicker] Erreur traitement image :', err);
        }
        finally {
            setLoading(false);
        }
    }
    function onInputChange(e) {
        const file = e.target.files?.[0];
        if (file)
            handleFile(file);
        // Remet l'input à zéro pour permettre de re-sélectionner le même fichier
        e.target.value = '';
    }
    // ─── Suppression de l'image ───────────────────────────────────────────
    async function handleDelete() {
        if (isLocalImage(currentUrl)) {
            await deleteImageFromDB(getLocalImageKey(currentUrl)).catch(() => { });
        }
        setPreviewSrc(null);
        setSizeKb(null);
        onImageSaved('');
    }
    return (_jsxs("div", { className: styles.pickerZone, children: [previewSrc ? (_jsxs("div", { className: styles.previewWrapper, children: [_jsx("img", { src: previewSrc, alt: "Aper\u00E7u produit", className: styles.previewImg }), _jsxs("div", { className: styles.previewOverlay, children: [_jsx("button", { type: "button", className: `${styles.imgBtn} ${styles.imgBtnCamera}`, onClick: () => cameraRef.current?.click(), children: "\uD83D\uDCF7 Nouvelle photo" }), _jsx("button", { type: "button", className: `${styles.imgBtn} ${styles.imgBtnGallery}`, onClick: () => galleryRef.current?.click(), children: "\uD83D\uDDBC\uFE0F Autre image" })] })] })) : (_jsxs("div", { className: styles.emptyZone, children: [_jsx("span", { className: styles.emptyIcon, children: "\uD83D\uDCF7" }), _jsxs("p", { className: styles.emptyText, children: ["Aucune photo pour ce produit.", _jsx("br", {}), "Prenez une photo ou choisissez depuis votre galerie."] })] })), loading && (_jsx("div", { className: styles.loadingBar, children: _jsx("div", { className: styles.loadingFill }) })), sizeKb !== null && !loading && (_jsxs("p", { className: styles.imgInfo, children: ["\u2705 Image compress\u00E9e \u00B7 ", sizeKb, " Ko \u00B7 nomm\u00E9e \u00AB\u00A0", _jsx("strong", { style: { color: 'rgba(255,255,255,0.6)' }, children: makeImageKey(productName, productId) }), "\u00A0\u00BB"] })), previewSrc && isLocalImage(currentUrl) && sizeKb === null && (_jsxs("p", { className: styles.imgInfo, children: ["Photo locale \u00B7 cl\u00E9\u00A0", _jsx("strong", { style: { color: 'rgba(255,255,255,0.6)' }, children: getLocalImageKey(currentUrl) })] })), _jsxs("div", { className: styles.btnRow, children: [_jsx("button", { type: "button", className: `${styles.imgBtn} ${styles.imgBtnCamera}`, onClick: () => cameraRef.current?.click(), disabled: loading, children: "\uD83D\uDCF7 Prendre une photo" }), _jsx("button", { type: "button", className: `${styles.imgBtn} ${styles.imgBtnGallery}`, onClick: () => galleryRef.current?.click(), disabled: loading, children: "\uD83D\uDDBC\uFE0F Choisir dans la galerie" }), previewSrc && (_jsx("button", { type: "button", className: `${styles.imgBtn} ${styles.imgBtnDelete}`, onClick: handleDelete, disabled: loading, title: "Supprimer l'image", children: "\uD83D\uDDD1\uFE0F" }))] }), _jsx("input", { ref: cameraRef, type: "file", accept: "image/*", capture: "environment", className: styles.hiddenInput, onChange: onInputChange, "aria-label": "Prendre une photo" }), _jsx("input", { ref: galleryRef, type: "file", accept: "image/*", className: styles.hiddenInput, onChange: onInputChange, "aria-label": "Choisir une image depuis la galerie" })] }));
}
