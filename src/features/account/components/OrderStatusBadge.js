import { jsx as _jsx } from "react/jsx-runtime";
import styles from './OrderStatusBadge.module.css';
// Badge coloré affichant le statut d'une commande
// Utilisé dans OrderCard et sur la page des commandes
export default function OrderStatusBadge({ status }) {
    const { label, className } = STATUS_CONFIG[status];
    return (_jsx("span", { className: `${styles.badge} ${styles[className]}`, children: label }));
}
// Configuration des statuts : libellé et classe CSS
const STATUS_CONFIG = {
    pending: { label: 'En attente', className: 'pending' },
    confirmed: { label: 'Confirmée', className: 'confirmed' },
    ready: { label: 'Prête à retirer', className: 'ready' },
    delivered: { label: 'Livrée', className: 'delivered' },
    cancelled: { label: 'Annulée', className: 'cancelled' },
};
