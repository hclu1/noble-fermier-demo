import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// Path: src/features/catalog/components/ProductCard.tsx
import { Link } from 'react-router-dom';
import { featureFlags } from '../../../config/featureFlags';
import { useCart } from '../../cart/CartContext';
import { useProductImage } from '../../../admin-perso/useProductImage';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import styles from './ProductCard.module.css';
// Carte produit — affichée dans le catalogue et l'accueil
// Respecte les feature flags : prix masqués, badge promo, etc.
export default function ProductCard({ product, category, hasPromo = false }) {
    const { addToCart } = useCart();
    const isUnavailable = product.isAvailable === false;
    // Résout l'image : URL externe ou image locale (IndexedDB) prise depuis l'admin
    const resolvedImage = useProductImage(product.imageUrl);
    return (_jsx(Card, { clickable: true, className: styles.card, children: _jsxs(Link, { to: `/produit/${product.slug}`, className: styles.link, children: [_jsxs("div", { className: styles.imageWrapper, children: [resolvedImage ? (_jsx("img", { src: resolvedImage, alt: product.name, className: styles.image })) : (_jsx("div", { className: styles.imagePlaceholder, "aria-hidden": "true", children: _jsx("span", { className: styles.placeholderEmoji, children: "\uD83E\uDD66" }) })), _jsxs("div", { className: styles.badges, children: [hasPromo && featureFlags.showPromoBadges && (_jsx("span", { className: styles.badgePromo, children: "Promo" })), isUnavailable && (_jsx("span", { className: styles.badgeUnavailable, children: "Rupture" }))] })] }), _jsxs("div", { className: styles.body, children: [category && (_jsx("span", { className: styles.category, children: category.name })), _jsx("h3", { className: styles.name, children: product.name }), _jsxs("p", { className: styles.description, children: [product.description.slice(0, 80), "\u2026"] }), _jsxs("div", { className: styles.footer, children: [featureFlags.showPricesPublicly ? (_jsxs("p", { className: styles.price, children: [_jsxs("span", { className: styles.priceAmount, children: [product.price.toFixed(2), " \u20AC"] }), _jsxs("span", { className: styles.priceUnit, children: [" / ", product.unit] })] })) : (_jsx("p", { className: styles.priceHidden, children: "Prix sur demande" })), _jsx(Button, { size: "sm", variant: "primary", disabled: isUnavailable, onClick: (e) => {
                                        e.preventDefault();
                                        addToCart(product);
                                    }, children: isUnavailable ? 'Indisponible' : 'Ajouter' })] })] })] }) }));
}
