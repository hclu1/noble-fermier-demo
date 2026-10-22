import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Link } from 'react-router-dom';
import { useDemoContext } from '../context/DemoContext';
import styles from './DemoProductCard.module.css';
export default function DemoProductCard({ product, promotionLabel }) {
    const { triggerDemoNotice } = useDemoContext();
    function handleAdd(e) {
        e.preventDefault();
        e.stopPropagation();
        triggerDemoNotice(`Ajout au panier : ${product.name}`);
    }
    return (_jsx("article", { className: styles.card, children: _jsxs(Link, { to: `/produit/${product.slug}`, className: styles.linkWrapper, children: [_jsxs("div", { className: styles.imageContainer, children: [product.imageUrl ? (_jsx("img", { src: product.imageUrl, alt: product.name, className: styles.image, loading: "lazy" })) : (_jsx("div", { style: { display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', fontSize: '2rem' }, children: "\uD83E\uDD6C" })), promotionLabel && (_jsx("span", { className: styles.badge, children: promotionLabel }))] }), _jsxs("div", { className: styles.content, children: [_jsx("h3", { className: styles.name, children: product.name }), product.description && (_jsx("p", { className: styles.description, children: product.description })), _jsxs("div", { className: styles.footer, children: [_jsxs("div", { className: styles.priceBlock, children: [_jsxs("span", { className: styles.price, children: [product.price.toFixed(2), " \u20AC"] }), _jsxs("span", { className: styles.unit, children: ["la ", product.unit] })] }), _jsxs("button", { type: "button", className: styles.addBtn, onClick: handleAdd, title: "Ajouter au panier (Mode D\u00E9mo)", children: [_jsx("span", { children: "+" }), " Panier"] })] })] })] }) }));
}
