// Path: src/lib/queries/settings.ts
import { supabase, isMockMode } from '../supabase';
import { brandConfig } from '../../config/brandConfig';
// ─────────────────────────────────────────────
// Requêtes de lecture — réglages de la boutique
// La table shop_settings a une seule ligne (id = 1).
// En mode mock : retourne brandConfig directement.
// ─────────────────────────────────────────────
export async function fetchShopSettings() {
    if (isMockMode)
        return { data: brandConfig, error: null };
    const { data, error } = await supabase
        .from('shop_settings')
        .select('*')
        .single();
    if (error)
        return { data: null, error: error.message };
    const settings = {
        name: data.name,
        tagline: data.tagline,
        logoUrl: data.logo_url,
        address: {
            street: data.address_street,
            zip: data.address_zip,
            city: data.address_city,
        },
        phone: data.phone,
        email: data.email,
        openingHours: data.opening_hours,
        socialLinks: data.social_links,
        primaryColor: data.primary_color,
    };
    return { data: settings, error: null };
}
