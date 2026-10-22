import { jsx as _jsx } from "react/jsx-runtime";
// Path: src/components/ui/Button.tsx
import styles from './Button.module.css';
// Bouton réutilisable avec 3 variantes visuelles
// primary  → orange CTA (achat, action principale)
// secondary → contour vert (action secondaire)
// ghost    → transparent (navigation, annulation)
export default function Button({ variant = 'primary', size = 'md', fullWidth = false, children, className = '', ...props }) {
    const classes = [
        styles.btn,
        styles[variant],
        styles[size],
        fullWidth ? styles.fullWidth : '',
        className,
    ]
        .filter(Boolean)
        .join(' ');
    return (_jsx("button", { className: classes, ...props, children: children }));
}
