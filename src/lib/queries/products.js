// Path: src/lib/queries/products.ts
import { supabase, isMockMode } from '../supabase';
import { mockProducts, mockCategories } from '../../data/mockProducts';
// ─────────────────────────────────────────────
// Requêtes de lecture — produits et catégories
// Utilisées par les pages storefront (catalogue, fiche, accueil)
//
// En mode mock (dev sans .env.local) : retourne les données mock directement.
// En mode Supabase : appelle la base de données réelle.
// ─────────────────────────────────────────────
// ─── Mapping Supabase (snake_case) → TypeScript (camelCase) ───
function rowToProduct(row) {
    return {
        id: row.id,
        name: row.name,
        slug: row.slug,
        description: row.description,
        price: row.price,
        unit: row.unit,
        categoryId: row.category_id,
        imageUrl: row.image_url,
        isFeatured: row.is_featured,
        isAvailable: row.is_available,
        promotionId: row.promotion_id,
    };
}
function rowToCategory(row) {
    return {
        id: row.id,
        name: row.name,
        slug: row.slug,
        imageUrl: row.image_url,
        order: row.order,
    };
}
// ─── Lire tous les produits ───
export async function fetchProducts() {
    if (isMockMode)
        return { data: mockProducts, error: null };
    const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('name');
    if (error)
        return { data: null, error: error.message };
    return { data: data.map(rowToProduct), error: null };
}
// ─── Lire les produits vedettes (accueil) ───
export async function fetchFeaturedProducts() {
    if (isMockMode) {
        const featured = mockProducts.filter((p) => p.isFeatured && p.isAvailable).slice(0, 6);
        return { data: featured, error: null };
    }
    const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_featured', true)
        .eq('is_available', true)
        .limit(6);
    if (error)
        return { data: null, error: error.message };
    return { data: data.map(rowToProduct), error: null };
}
// ─── Lire un produit par son slug ───
export async function fetchProductBySlug(slug) {
    if (isMockMode) {
        const product = mockProducts.find((p) => p.slug === slug);
        if (!product)
            return { data: null, error: 'Produit introuvable.' };
        return { data: product, error: null };
    }
    const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('slug', slug)
        .single();
    if (error)
        return { data: null, error: error.message };
    return { data: rowToProduct(data), error: null };
}
// ─── Lire toutes les catégories ───
export async function fetchCategories() {
    if (isMockMode)
        return { data: mockCategories, error: null };
    const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('order');
    if (error)
        return { data: null, error: error.message };
    return { data: data.map(rowToCategory), error: null };
}
