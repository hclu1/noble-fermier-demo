import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// Path: src/demo/components/DemoActionModal.tsx
import { useDemoContext } from '../context/DemoContext';
import styles from './DemoActionModal.module.css';
export default function DemoActionModal() {
    const { isModalOpen, blockedActionName, closeDemoNotice } = useDemoContext();
    const appalacarteUrl = import.meta.env.VITE_APPALACARTE_URL || 'https://appalacarte.fr';
    if (!isModalOpen)
        return null;
    return (_jsx("div", { className: styles.overlay, onClick: closeDemoNotice, role: "dialog", "aria-modal": "true", children: _jsxs("div", { className: styles.modal, onClick: (e) => e.stopPropagation(), children: [_jsx("div", { className: styles.iconContainer, children: "\uD83D\uDD12" }), blockedActionName && (_jsxs("div", { className: styles.actionBadge, children: ["Tentative : ", blockedActionName] })), _jsx("h3", { className: styles.title, children: "Version de D\u00E9monstration" }), _jsx("p", { className: styles.message, children: "Cette action est disponible dans la version compl\u00E8te de l\u2019application. En mode d\u00E9mo, la modification, la validation et l\u2019export de donn\u00E9es sont verrouill\u00E9s pour garantir l\u2019int\u00E9grit\u00E9 de la pr\u00E9sentation." }), _jsxs("div", { className: styles.buttonGroup, children: [_jsx("a", { href: appalacarteUrl, target: "_blank", rel: "noopener noreferrer", className: styles.ctaBtn, children: "D\u00E9couvrir l'offre compl\u00E8te sur Appalacarte" }), _jsx("button", { type: "button", className: styles.closeBtn, onClick: closeDemoNotice, children: "Poursuivre la visite de la d\u00E9mo" })] })] }) }));
}
