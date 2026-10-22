import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// Path: src/features/account/OrdersPage.tsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../auth/useAuth';
import { fetchOrdersByUser } from '../../lib/queries/orders';
import Container from '../../layout/Container';
import Button from '../../components/ui/Button';
import OrderCard from './components/OrderCard';
import styles from './OrdersPage.module.css';
import homeStyles from '../home/HomePage.module.css';
export default function OrdersPage() {
    const { user } = useAuth();
    const [orders, setOrders] = useState([]);
    const [statusFilter, setStatusFilter] = useState('all');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
        fetchOrdersByUser().then(({ data, error: fetchErr }) => {
            if (fetchErr)
                setError(fetchErr);
            else if (data)
                setOrders(data);
            setIsLoading(false);
        });
    }, []);
    if (!user)
        return null;
    // Commandes triées de la plus récente à la plus ancienne (fetchOrdersByUser trie déjà en Supabase)
    const userOrders = orders
        .filter((o) => o.profileId === user.id)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    const filtered = statusFilter === 'all'
        ? userOrders
        : userOrders.filter((o) => o.status === statusFilter);
    return (_jsx(Container, { children: _jsxs("div", { className: styles.page, children: [_jsxs("div", { className: styles.header, children: [_jsxs("div", { children: [_jsx("h1", { className: styles.title, children: "Mes commandes" }), _jsxs("p", { className: styles.subtitle, children: [userOrders.length, " commande", userOrders.length !== 1 ? 's' : '', " au total"] })] }), _jsx(Link, { to: "/mon-compte", children: _jsx(Button, { variant: "secondary", children: "\u2190 Mon compte" }) })] }), _jsxs("div", { className: styles.filters, children: [_jsx("label", { htmlFor: "status-filter", className: styles.filterLabel, children: "Filtrer par statut :" }), _jsxs("select", { id: "status-filter", value: statusFilter, onChange: (e) => setStatusFilter(e.target.value), className: styles.filterSelect, children: [_jsx("option", { value: "all", children: "Toutes les commandes" }), _jsx("option", { value: "pending", children: "En attente" }), _jsx("option", { value: "confirmed", children: "Confirm\u00E9e" }), _jsx("option", { value: "ready", children: "Pr\u00EAte \u00E0 retirer" }), _jsx("option", { value: "delivered", children: "Livr\u00E9e" }), _jsx("option", { value: "cancelled", children: "Annul\u00E9e" })] })] }), isLoading ? (_jsx("div", { className: styles.list, children: Array.from({ length: 3 }).map((_, i) => (_jsx("div", { className: `${homeStyles.skeleton}`, style: { height: '140px', borderRadius: 'var(--radius-lg)' } }, i))) })) : error ? (_jsxs("div", { className: styles.empty, children: [_jsx("span", { className: styles.emptyIcon, children: "\u274C" }), _jsx("p", { className: styles.emptyTitle, children: "Erreur de chargement" }), _jsx("p", { className: styles.emptyText, children: error })] })) : filtered.length > 0 ? (_jsx("div", { className: styles.list, children: filtered.map((order) => (_jsx(OrderCard, { order: order }, order.id))) })) : (_jsxs("div", { className: styles.empty, children: [_jsx("span", { className: styles.emptyIcon, children: "\uD83D\uDCCB" }), _jsx("p", { className: styles.emptyTitle, children: "Aucune commande" }), _jsx("p", { className: styles.emptyText, children: statusFilter === 'all'
                                ? "Vous n'avez pas encore passé de commande."
                                : 'Aucune commande avec ce statut.' }), _jsx(Link, { to: "/catalogue", children: _jsx(Button, { variant: "primary", children: "Voir le catalogue" }) })] }))] }) }));
}
