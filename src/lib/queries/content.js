// Path: src/lib/queries/content.ts
import { supabase, isMockMode } from '../supabase';
import { mockContentPages } from '../../data/mockContent';
// ─────────────────────────────────────────────
// Requêtes de lecture — pages de contenu
// ─────────────────────────────────────────────
function rowToContentPage(row) {
    return {
        id: row.id,
        slug: row.slug,
        title: row.title,
        body: row.body,
        updatedAt: row.updated_at,
    };
}
// Lire une page par son slug (ex: "a-propos")
export async function fetchContentPageBySlug(slug) {
    if (isMockMode) {
        const page = mockContentPages.find((p) => p.slug === slug);
        if (!page)
            return { data: null, error: 'Page introuvable.' };
        return { data: page, error: null };
    }
    const { data, error } = await supabase
        .from('content_pages')
        .select('*')
        .eq('slug', slug)
        .single();
    if (error)
        return { data: null, error: error.message };
    return { data: rowToContentPage(data), error: null };
}
// Toutes les pages — pour l'admin
export async function fetchAllContentPages() {
    if (isMockMode)
        return { data: mockContentPages, error: null };
    const { data, error } = await supabase
        .from('content_pages')
        .select('*')
        .order('title');
    if (error)
        return { data: null, error: error.message };
    return { data: data.map(rowToContentPage), error: null };
}
