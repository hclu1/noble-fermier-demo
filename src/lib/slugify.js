// Path: src/lib/slugify.ts
// Utilitaire partagé de génération de slug
// Utilisé dans AdminProductsPage et AdminContentPage
// Convertit "Tomates Anciennes" → "tomates-anciennes"
export function slugify(text) {
    return text
        .toLowerCase()
        .normalize('NFD') // décompose les accents (é → e + ́)
        .replace(/[\u0300-\u036f]/g, '') // supprime les diacritiques
        .replace(/\s+/g, '-') // espaces → tirets
        .replace(/[^a-z0-9-]/g, '') // supprime les caractères restants
        .replace(/-+/g, '-') // tirets consécutifs → un seul
        .replace(/^-|-$/g, ''); // supprime les tirets en début/fin
}
