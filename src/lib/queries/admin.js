// Path: src/lib/queries/admin.ts
import { supabase, isMockMode } from '../supabase';
import { mockOrders } from '../../data/mockOrders';
// ─────────────────────────────────────────────
// Requêtes d'écriture — réservées à l'admin
//
// Ces fonctions sont protégées par RLS Supabase :
// seuls les utilisateurs avec profiles.role = 'admin'
// peuvent exécuter ces opérations côté base de données.
// ─────────────────────────────────────────────
// ════════════════════════════════════════════
// PRODUITS
// ════════════════════════════════════════════
export async function adminCreateProduct(product) {
    if (isMockMode)
        return { data: { id: crypto.randomUUID(), ...product }, error: null };
    const { data, error } = await supabase
        .from('products')
        .insert({
        name: product.name,
        slug: product.slug,
        description: product.description,
        price: product.price,
        unit: product.unit,
        category_id: product.categoryId,
        image_url: product.imageUrl ?? null,
        is_featured: product.isFeatured ?? false,
        is_available: product.isAvailable ?? true,
        promotion_id: product.promotionId ?? null,
    })
        .select()
        .single();
    if (error)
        return { data: null, error: error.message };
    return { data: rowToProduct(data), error: null };
}
export async function adminUpdateProduct(id, product) {
    if (isMockMode)
        return { data: { id, ...product }, error: null };
    const { data, error } = await supabase
        .from('products')
        .update({
        name: product.name,
        slug: product.slug,
        description: product.description,
        price: product.price,
        unit: product.unit,
        category_id: product.categoryId,
        image_url: product.imageUrl ?? null,
        is_featured: product.isFeatured ?? false,
        is_available: product.isAvailable ?? true,
        promotion_id: product.promotionId ?? null,
    })
        .eq('id', id)
        .select()
        .single();
    if (error)
        return { data: null, error: error.message };
    return { data: rowToProduct(data), error: null };
}
export async function adminDeleteProduct(id) {
    if (isMockMode)
        return { error: null };
    const { error } = await supabase.from('products').delete().eq('id', id);
    return { error: error?.message ?? null };
}
// ════════════════════════════════════════════
// PROMOTIONS
// ════════════════════════════════════════════
export async function adminCreatePromotion(promo) {
    if (isMockMode)
        return { data: { id: crypto.randomUUID(), ...promo }, error: null };
    const { data, error } = await supabase
        .from('promotions')
        .insert({
        label: promo.label,
        discount_percent: promo.discountPercent,
        product_ids: promo.productIds ?? [],
        category_ids: promo.categoryIds ?? [],
        start_date: promo.startDate ?? null,
        end_date: promo.endDate ?? null,
    })
        .select()
        .single();
    if (error)
        return { data: null, error: error.message };
    return { data: rowToPromotion(data), error: null };
}
export async function adminUpdatePromotion(id, promo) {
    if (isMockMode)
        return { data: { id, ...promo }, error: null };
    const { data, error } = await supabase
        .from('promotions')
        .update({
        label: promo.label,
        discount_percent: promo.discountPercent,
        product_ids: promo.productIds ?? [],
        category_ids: promo.categoryIds ?? [],
        start_date: promo.startDate ?? null,
        end_date: promo.endDate ?? null,
    })
        .eq('id', id)
        .select()
        .single();
    if (error)
        return { data: null, error: error.message };
    return { data: rowToPromotion(data), error: null };
}
export async function adminDeletePromotion(id) {
    if (isMockMode)
        return { error: null };
    const { error } = await supabase.from('promotions').delete().eq('id', id);
    return { error: error?.message ?? null };
}
// ════════════════════════════════════════════
// CONTENU
// ════════════════════════════════════════════
export async function adminCreateContentPage(page) {
    if (isMockMode)
        return { data: { id: crypto.randomUUID(), updatedAt: new Date().toISOString(), ...page }, error: null };
    const { data, error } = await supabase
        .from('content_pages')
        .insert({ slug: page.slug, title: page.title, body: page.body })
        .select()
        .single();
    if (error)
        return { data: null, error: error.message };
    return { data: rowToContentPage(data), error: null };
}
export async function adminUpdateContentPage(id, page) {
    if (isMockMode)
        return { data: { id, updatedAt: new Date().toISOString(), ...page }, error: null };
    const { data, error } = await supabase
        .from('content_pages')
        .update({ slug: page.slug, title: page.title, body: page.body })
        .eq('id', id)
        .select()
        .single();
    if (error)
        return { data: null, error: error.message };
    return { data: rowToContentPage(data), error: null };
}
export async function adminDeleteContentPage(id) {
    if (isMockMode)
        return { error: null };
    const { error } = await supabase.from('content_pages').delete().eq('id', id);
    return { error: error?.message ?? null };
}
// ════════════════════════════════════════════
// RÉGLAGES
// ════════════════════════════════════════════
export async function adminUpdateSettings(settings) {
    if (isMockMode)
        return { error: null };
    const { error } = await supabase
        .from('shop_settings')
        .update({
        name: settings.name,
        tagline: settings.tagline ?? null,
        logo_url: settings.logoUrl ?? null,
        phone: settings.phone ?? null,
        email: settings.email ?? null,
        address_street: settings.address.street,
        address_zip: settings.address.zip,
        address_city: settings.address.city,
        opening_hours: settings.openingHours,
        social_links: settings.socialLinks,
        primary_color: settings.primaryColor ?? null,
    })
        .eq('id', 1); // La table shop_settings a une seule ligne
    return { error: error?.message ?? null };
}
// ════════════════════════════════════════════
// BRANDING (platform_admin uniquement)
// La RLS Supabase bloque les shop_admin sur cette table.
// ════════════════════════════════════════════
export async function adminFetchBranding() {
    if (isMockMode) {
        return {
            data: {
                primaryColor: '#2D6A4F',
                secondaryColor: '#F4845F',
                backgroundColor: '#FEFAE0',
                fontHeading: 'Playfair Display',
                fontBody: 'Nunito',
                heroImageUrl: undefined,
            },
            error: null,
        };
    }
    const { data, error } = await supabase
        .from('branding')
        .select('*')
        .single();
    if (error)
        return { data: null, error: error.message };
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
export async function adminUpdateBranding(branding) {
    if (isMockMode)
        return { error: null };
    const { error } = await supabase
        .from('branding')
        .update({
        primary_color: branding.primaryColor,
        secondary_color: branding.secondaryColor,
        background_color: branding.backgroundColor,
        font_heading: branding.fontHeading,
        font_body: branding.fontBody,
        hero_image_url: branding.heroImageUrl ?? null,
    })
        .eq('id', 1); // La table branding a une seule ligne
    return { error: error?.message ?? null };
}
// ════════════════════════════════════════════
// COMMANDES
// ════════════════════════════════════════════
// Message français envoyé au client à chaque étape
const STATUS_MESSAGES = {
    confirmed: "Votre commande est confirmée. Nous la préparons avec soin.",
    ready: "Votre commande est prête à retirer. Passez nous voir !",
    delivered: "Votre commande a bien été livrée. Merci pour votre confiance.",
};
// Lire toutes les commandes — vue admin (sans filtre RLS sur customer_id)
export async function adminFetchAllOrders() {
    if (isMockMode)
        return { data: mockOrders, error: null };
    const { data, error } = await supabase
        .from('orders')
        .select('*, order_items (*)')
        .order('created_at', { ascending: false });
    if (error)
        return { data: null, error: error.message };
    return { data: data.map(rowToOrder), error: null };
}
// Mettre à jour le statut d'une commande + déclencher la notification email
export async function adminUpdateOrderStatus(orderId, newStatus) {
    if (isMockMode) {
        const message = STATUS_MESSAGES[newStatus];
        if (message)
            console.info(`[Notification mock] ${message} (commande ${orderId})`);
        return { error: null };
    }
    const { error } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', orderId);
    if (error)
        return { error: error.message };
    // Déclenche l'email via une Edge Function Supabase (asynchrone, non bloquant)
    const message = STATUS_MESSAGES[newStatus];
    if (message) {
        supabase.functions
            .invoke('notify-order-status', { body: { orderId, status: newStatus, message } })
            .catch((err) => console.warn('[Notification] Non envoyée :', err));
    }
    return { error: null };
}
// ─────────────────────────────────────────────
// Mappers (snake_case Supabase → camelCase TypeScript)
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
function rowToContentPage(row) {
    return {
        id: row.id,
        slug: row.slug,
        title: row.title,
        body: row.body,
        updatedAt: row.updated_at,
    };
}
function rowToOrderItem(row) {
    return {
        id: row.id,
        orderId: row.order_id,
        productId: row.product_id,
        productName: row.name,
        quantity: row.quantity,
        unitPrice: row.price,
        unit: row.unit,
    };
}
function rowToOrder(row) {
    const items = Array.isArray(row.order_items)
        ? row.order_items.map(rowToOrderItem)
        : [];
    return {
        id: row.id,
        profileId: row.customer_id,
        status: row.status,
        items,
        totalPrice: row.total_price,
        deliveryMode: row.delivery_mode,
        note: row.note,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
    };
}
