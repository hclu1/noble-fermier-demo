// Path: src/demo/lib/demoQueries.ts
import { demoSupabase, isDemoMockMode } from './demoSupabase';
import { DEMO_PRODUCTS, DEMO_CATEGORIES, DEMO_PROMOTIONS, DEMO_SHOP_SETTINGS, DEMO_BRANDING, DEMO_ORDERS, } from '../data/demoSeedData';
// ─────────────────────────────────────────────
// Requêtes de lecture exclusives au mode démo
//
// 1. Ciblent UNIQUEMENT les tables demo_*
// 2. Ne touchent JAMAIS aux tables de production
// 3. Fallback automatique sur les données d'exemple
// ─────────────────────────────────────────────
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
export async function fetchDemoProducts() {
    if (isDemoMockMode) {
        return { data: DEMO_PRODUCTS, error: null };
    }
    const { data, error } = await demoSupabase
        .from('demo_products')
        .select('*')
        .order('name');
    if (error || !data || data.length === 0) {
        return { data: DEMO_PRODUCTS, error: null };
    }
    return { data: data.map(rowToProduct), error: null };
}
export async function fetchDemoCategories() {
    if (isDemoMockMode) {
        return { data: DEMO_CATEGORIES, error: null };
    }
    const { data, error } = await demoSupabase
        .from('demo_categories')
        .select('*')
        .order('order', { ascending: true });
    if (error || !data || data.length === 0) {
        return { data: DEMO_CATEGORIES, error: null };
    }
    return { data: data.map(rowToCategory), error: null };
}
export async function fetchDemoPromotions() {
    if (isDemoMockMode) {
        return { data: DEMO_PROMOTIONS, error: null };
    }
    const { data, error } = await demoSupabase
        .from('demo_promotions')
        .select('*');
    if (error || !data || data.length === 0) {
        return { data: DEMO_PROMOTIONS, error: null };
    }
    return {
        data: data.map((row) => ({
            id: row.id,
            label: row.label,
            discountPercent: row.discount_percent,
            productIds: row.product_ids ?? [],
            categoryIds: row.category_ids ?? [],
            startDate: row.start_date,
            endDate: row.end_date,
        })),
        error: null,
    };
}
export async function fetchDemoShopSettings() {
    if (isDemoMockMode) {
        return { data: DEMO_SHOP_SETTINGS, error: null };
    }
    const { data, error } = await demoSupabase
        .from('demo_shop_settings')
        .select('*')
        .single();
    if (error || !data) {
        return { data: DEMO_SHOP_SETTINGS, error: null };
    }
    return {
        data: {
            name: data.name,
            tagline: data.tagline,
            logoUrl: data.logo_url,
            phone: data.phone,
            email: data.email,
            address: {
                street: data.address_street,
                zip: data.address_zip,
                city: data.address_city,
            },
            openingHours: data.opening_hours ?? DEMO_SHOP_SETTINGS.openingHours,
            socialLinks: data.social_links ?? DEMO_SHOP_SETTINGS.socialLinks,
            primaryColor: data.primary_color,
        },
        error: null,
    };
}
export async function fetchDemoBranding() {
    if (isDemoMockMode) {
        return { data: DEMO_BRANDING, error: null };
    }
    const { data, error } = await demoSupabase
        .from('demo_branding')
        .select('*')
        .single();
    if (error || !data) {
        return { data: DEMO_BRANDING, error: null };
    }
    return {
        data: {
            primaryColor: data.primary_color,
            secondaryColor: data.secondary_color,
            backgroundColor: data.background_color,
            fontHeading: data.font_heading,
            fontBody: data.font_body,
            heroImageUrl: data.hero_image_url,
        },
        error: null,
    };
}
export async function fetchDemoOrders() {
    return { data: DEMO_ORDERS, error: null };
}
