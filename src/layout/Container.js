import { jsx as _jsx } from "react/jsx-runtime";
// Path: src/layout/Container.tsx
import styles from './Container.module.css';
// Centrage horizontal avec max-width
// narrow=true → 800px (articles, formulaires)
// narrow=false → 1200px (catalogue, accueil)
export default function Container({ children, narrow = false, className = '' }) {
    const widthClass = narrow ? styles.narrow : styles.wide;
    return (_jsx("div", { className: `${styles.container} ${widthClass} ${className}`, children: children }));
}
