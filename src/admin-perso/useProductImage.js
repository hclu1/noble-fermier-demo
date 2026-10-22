// ══════════════════════════════════════════════════════════════════════════
//  HOOK useProductImage
//  Fichier : src/admin-perso/useProductImage.ts
//
//  Résout l'URL d'une image produit :
//    • Si l'URL commence par "local:" → charge depuis IndexedDB
//    • Sinon → retourne l'URL telle quelle (HTTP externe)
//    • Si vide → retourne null
//
//  Usage dans les composants publics :
//    const imgSrc = useProductImage(product.imageUrl)
//    <img src={imgSrc ?? '/placeholder.svg'} />
// ══════════════════════════════════════════════════════════════════════════
import { useState, useEffect } from 'react';
import { isLocalImage, getLocalImageKey, loadImageFromDB } from './imageStorage';
export function useProductImage(imageUrl) {
    const [src, setSrc] = useState(() => {
        // Initialise directement si c'est une URL externe (pas de async requis)
        if (!imageUrl)
            return null;
        if (!isLocalImage(imageUrl))
            return imageUrl;
        return null; // les images locales sont chargées en async
    });
    useEffect(() => {
        if (!imageUrl) {
            setSrc(null);
            return;
        }
        if (!isLocalImage(imageUrl)) {
            setSrc(imageUrl);
            return;
        }
        // Image locale → charger depuis IndexedDB
        const key = getLocalImageKey(imageUrl);
        loadImageFromDB(key)
            .then((data) => setSrc(data ?? null))
            .catch(() => setSrc(null));
    }, [imageUrl]);
    return src;
}
