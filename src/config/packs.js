// Path: src/config/packs.ts
// Chaque pack active un ensemble de features
export const PACKS = {
    basic: [
        'home',
        'catalog',
        'product',
        'contact',
        'admin',
    ],
    pro: [
        'home',
        'catalog',
        'product',
        'contact',
        'content',
        'promotions',
        'banners',
        'auth',
        'account',
        'orderHistory',
        'orderStatus',
        'admin',
        'settings',
    ],
    premium: [
        'home',
        'catalog',
        'product',
        'contact',
        'content',
        'promotions',
        'banners',
        'auth',
        'account',
        'orderHistory',
        'orderStatus',
        'cart',
        'checkout',
        'delivery',
        'admin',
        'settings',
    ],
};
// Pack actif pour ce client — à modifier par client
export const CURRENT_PACK = 'pro';
// Vérifie si une feature est active dans le pack courant
export function hasFeature(feature) {
    return PACKS[CURRENT_PACK].includes(feature);
}
