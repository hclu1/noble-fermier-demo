import { jsx as _jsx } from "react/jsx-runtime";
// Path: src/components/ui/Card.tsx
import styles from './Card.module.css';
// Carte générique réutilisable pour les produits, promotions, contenus, etc.
// Entourer n'importe quel contenu dans <Card> pour lui donner le style carte
export default function Card({ children, className = '', clickable = false, padding = 'md', }) {
    const classes = [
        styles.card,
        styles[`padding-${padding}`],
        clickable ? styles.clickable : '',
        className,
    ]
        .filter(Boolean)
        .join(' ');
    return (_jsx("div", { className: classes, children: children }));
}
