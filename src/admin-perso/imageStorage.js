// ══════════════════════════════════════════════════════════════════════════
//  STOCKAGE D'IMAGES — IndexedDB + Compression Canvas
//  Fichier : src/admin-perso/imageStorage.ts
//
//  Stratégie :
//    • Compression automatique via canvas (max 900px, qualité JPEG 0.78)
//    • Stockage dans IndexedDB (capacité ~50–200 Mo selon navigateur)
//    • Les images du localStorage restent légères (on stocke juste la clé)
//    • Chaque image est nommée d'après le produit pour retrouvage facile
//
//  Taille typique après compression : 40–120 Ko par photo
// ══════════════════════════════════════════════════════════════════════════
const DB_NAME = 'noble-fermier-images';
const DB_VERSION = 1;
const STORE_NAME = 'product-images';
// ─── Ouvre (ou crée) la base IndexedDB ─────────────────────────────────────
function openDB() {
    return new Promise((resolve, reject) => {
        const req = indexedDB.open(DB_NAME, DB_VERSION);
        req.onupgradeneeded = (e) => {
            const db = e.target.result;
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME, { keyPath: 'key' });
            }
        };
        req.onsuccess = (e) => resolve(e.target.result);
        req.onerror = (e) => reject(e.target.error);
    });
}
// ─── Compresse une image via canvas ────────────────────────────────────────
// maxPx   : dimension max (largeur ou hauteur) en pixels
// quality : qualité JPEG 0–1
export function compressImage(file, maxPx = 900, quality = 0.78) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                // ─ Calcule les nouvelles dimensions en conservant le ratio ─
                let { width, height } = img;
                if (width > maxPx || height > maxPx) {
                    if (width >= height) {
                        height = Math.round((height * maxPx) / width);
                        width = maxPx;
                    }
                    else {
                        width = Math.round((width * maxPx) / height);
                        height = maxPx;
                    }
                }
                // ─ Dessine sur un canvas et exporte en JPEG compressé ─
                const canvas = document.createElement('canvas');
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);
                resolve(canvas.toDataURL('image/jpeg', quality));
            };
            img.onerror = reject;
            img.src = e.target.result;
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}
// ─── Sauvegarde une image dans IndexedDB ───────────────────────────────────
// key      : identifiant unique (ex : "tomates-anciennes-p-1")
// dataUrl  : résultat de compressImage()
export async function saveImageToDB(key, dataUrl) {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, 'readwrite');
        const store = tx.objectStore(STORE_NAME);
        store.put({ key, dataUrl });
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
    });
}
// ─── Lit une image depuis IndexedDB ────────────────────────────────────────
export async function loadImageFromDB(key) {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, 'readonly');
        const store = tx.objectStore(STORE_NAME);
        const req = store.get(key);
        req.onsuccess = () => resolve(req.result?.dataUrl ?? null);
        req.onerror = () => reject(req.error);
    });
}
// ─── Supprime une image depuis IndexedDB ───────────────────────────────────
export async function deleteImageFromDB(key) {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, 'readwrite');
        const store = tx.objectStore(STORE_NAME);
        store.delete(key);
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
    });
}
// ─── Liste toutes les clés d'images stockées ──────────────────────────────
export async function listImageKeys() {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, 'readonly');
        const store = tx.objectStore(STORE_NAME);
        const req = store.getAllKeys();
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => reject(req.error);
    });
}
// ─── Génère une clé lisible à partir du nom produit ───────────────────────
// "Tomates Anciennes" + "p-1" → "tomates-anciennes_p-1"
export function makeImageKey(productName, productId) {
    const slug = productName
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // supprime les accents
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
    return `${slug}_${productId}`;
}
// ─── Préfixe utilisé pour détecter une image locale ───────────────────────
// Si imageUrl commence par "local:", l'image est dans IndexedDB
export const LOCAL_IMAGE_PREFIX = 'local:';
export function isLocalImage(url) {
    return url.startsWith(LOCAL_IMAGE_PREFIX);
}
export function getLocalImageKey(url) {
    return url.replace(LOCAL_IMAGE_PREFIX, '');
}
