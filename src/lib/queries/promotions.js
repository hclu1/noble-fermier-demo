// Path: src/lib/queries/promotions.ts
import { supabase, isMockMode } from '../supabase';
import { mockPromotions } from '../../data/mockPromotions';
// ─────────────────────────────────────────────
// Requêtes de lecture — promotions
// ─────────────────────────────────────────────
function rowToPromotion(row) {
    return {
        id: row.id,
        label: row.label,
        discountPercent: row.discount_percent,
        productIds: row.product_ids,
        categoryIds: row.category_ids,
        startDate: row.start_date,
        endDate: row.end_date,
    };
}
// Promotions actives (date en cours ou sans date de fin)
export async function fetchActivePromotions() {
    if (isMockMode) {
        const today = new Date().toISOString().slice(0, 10);
        const active = mockPromotions.filter((p) => !p.endDate || p.endDate >= today);
        return { data: active, error: null };
    }
    const today = new Date().toISOString().slice(0, 10);
    const { data, error } = await supabase
        .from('promotions')
        .select('*')
        .or(`end_date.is.null,end_date.gte.${today}`)
        .order('created_at', { ascending: false });
    if (error)
        return { data: null, error: error.message };
    return { data: data.map(rowToPromotion), error: null };
}
// Toutes les promotions — pour l'admin
export async function fetchAllPromotions() {
    if (isMockMode)
        return { data: mockPromotions, error: null };
    const { data, error } = await supabase
        .from('promotions')
        .select('*')
        .order('created_at', { ascending: false });
    if (error)
        return { data: null, error: error.message };
    return { data: data.map(rowToPromotion), error: null };
}
