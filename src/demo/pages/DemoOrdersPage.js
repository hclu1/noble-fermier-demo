import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// Path: src/demo/pages/DemoOrdersPage.tsx
import { useEffect, useState } from 'react';
import { fetchDemoOrders } from '../lib/demoQueries';
import { useDemoContext } from '../context/DemoContext';
import styles from './DemoOrdersPage.module.css';
export default function DemoOrdersPage() {
    const [orders, setOrders] = useState([]);
    const { triggerDemoNotice } = useDemoContext();
    useEffect(() => {
        async function load() {
            const res = await fetchDemoOrders();
            if (res.data)
                setOrders(res.data);
        }
        load();
    }, []);
    function renderStatusBadge(status) {
        switch (status) {
            case 'ready':
                return _jsx("span", { className: `${styles.statusBadge} ${styles.statusReady}`, children: "Pr\u00EAte \u00E0 retirer" });
            case 'confirmed':
                return _jsx("span", { className: `${styles.statusBadge} ${styles.statusConfirmed}`, children: "Confirm\u00E9e" });
            case 'delivered':
                return _jsx("span", { className: `${styles.statusBadge} ${styles.statusDelivered}`, children: "Remise au client" });
            default:
                return _jsx("span", { className: styles.statusBadge, children: status });
        }
    }
    return (_jsxs("div", { className: styles.page, children: [_jsxs("header", { className: styles.header, children: [_jsx("h1", { className: styles.title, children: "Espace Client \u2014 Suivi des Commandes" }), _jsx("p", { className: styles.subtitle, children: "Visualisation en direct du parcours de commande d'un client primeur (Pack Pro / Premium)." })] }), _jsxs("div", { className: styles.noticeBox, children: [_jsx("span", { children: "\u2139\uFE0F" }), _jsxs("div", { children: [_jsx("strong", { children: "Environnement D\u00E9mo :" }), " Vous visualisez ici un exemple de carnet de commandes client synchronis\u00E9 avec l'application. Les actions de modification ou r\u00E9clamation sont simul\u00E9es."] })] }), _jsx("div", { className: styles.orderList, children: orders.map((order) => (_jsxs("article", { className: styles.orderCard, children: [_jsxs("div", { className: styles.cardHeader, children: [_jsxs("div", { children: [_jsxs("div", { className: styles.orderId, children: ["Commande #", order.id] }), _jsxs("div", { className: styles.orderDate, children: ["Pass\u00E9e le ", new Date(order.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })] })] }), renderStatusBadge(order.status)] }), _jsx("div", { className: styles.itemsList, children: order.items.map((item) => (_jsxs("div", { className: styles.itemRow, children: [_jsxs("div", { children: [_jsx("strong", { children: item.productName }), _jsxs("div", { style: { color: '#6b7280', fontSize: '0.8rem' }, children: ["Qt\u00E9 : ", item.quantity, " ", item.unit, " \u00E0 ", item.unitPrice.toFixed(2), " \u20AC / ", item.unit] })] }), _jsx("div", { children: _jsxs("strong", { children: [(item.quantity * item.unitPrice).toFixed(2), " \u20AC"] }) })] }, item.id))) }), _jsxs("div", { className: styles.cardFooter, children: [_jsxs("div", { children: [_jsx("span", { style: { fontSize: '0.85rem', color: '#6b7280', marginRight: '0.5rem' }, children: "Total commande :" }), _jsxs("span", { className: styles.totalText, children: [order.totalPrice.toFixed(2), " \u20AC"] })] }), _jsxs("div", { style: { display: 'flex', gap: '0.5rem' }, children: [_jsx("button", { type: "button", className: styles.actionBtn, onClick: () => triggerDemoNotice('Téléchargement de facture'), children: "\uD83D\uDCC4 Facture PDF" }), _jsx("button", { type: "button", className: styles.actionBtn, onClick: () => triggerDemoNotice('Recommander le même panier'), children: "\uD83D\uDD04 Recommander" })] })] })] }, order.id))) })] }));
}
