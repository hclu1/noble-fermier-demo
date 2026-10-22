import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
// Path: src/App.tsx
import { Routes, Route } from 'react-router-dom';
import PageLayout from './layout/PageLayout';
import { hasFeature } from './config/packs';
// Pages storefront
import HomePage from './features/home/HomePage';
import CatalogPage from './features/catalog/CatalogPage';
import ProductPage from './features/catalog/ProductPage';
import ContactPage from './features/contact/ContactPage';
import ContentPage from './features/content/ContentPage';
// Auth
import LoginPage from './features/auth/LoginPage';
import ForgotPasswordPage from './features/auth/ForgotPasswordPage';
import ProtectedRoute from './features/auth/ProtectedRoute';
// Espace client (Pack Pro)
import AccountPage from './features/account/AccountPage';
import OrdersPage from './features/account/OrdersPage';
// Panier & Checkout (Pack Premium)
import CartPage from './features/cart/CartPage';
import CheckoutPage from './features/cart/CheckoutPage';
// Admin
import AdminRoute from './features/admin/AdminRoute';
import AdminLayout from './features/admin/AdminLayout';
import AdminOrdersPage from './features/admin/orders/AdminOrdersPage';
import AdminProductsPage from './features/admin/products/AdminProductsPage';
import AdminPromotionsPage from './features/admin/promotions/AdminPromotionsPage';
import AdminContentPage from './features/admin/content/AdminContentPage';
import AdminSettingsPage from './features/admin/settings/AdminSettingsPage';
import AdminBrandingPage from './features/admin/branding/AdminBrandingPage';
// ══ ADMINISTRATION PERSONNALISATION CLIENT (Hclu1 / 3131) ══
// Accès via la roue dentée ⚙️ en bas de chaque page
import AdminPersoPanel from './admin-perso/AdminPersoPanel';
// Page 404
import NotFoundPage from './features/NotFoundPage';
// ─────────────────────────────────────────────
// Routeur principal
// Les routes admin utilisent AdminLayout (sans PageLayout)
// et sont protégées par AdminRoute
// ─────────────────────────────────────────────
export default function App() {
    return (_jsxs(Routes, { children: [_jsx(Route, { path: "/admin-perso", element: _jsx(AdminPersoPanel, {}) }), hasFeature('admin') && (_jsxs(Route, { path: "/admin", element: _jsx(AdminRoute, { children: _jsx(AdminLayout, {}) }), children: [_jsx(Route, { index: true, element: _jsx(AdminOrdersPage, {}) }), _jsx(Route, { path: "commandes", element: _jsx(AdminOrdersPage, {}) }), _jsx(Route, { path: "produits", element: _jsx(AdminProductsPage, {}) }), _jsx(Route, { path: "promotions", element: _jsx(AdminPromotionsPage, {}) }), _jsx(Route, { path: "contenu", element: _jsx(AdminContentPage, {}) }), _jsx(Route, { path: "reglages", element: _jsx(AdminSettingsPage, {}) }), _jsx(Route, { path: "branding", element: _jsx(AdminBrandingPage, {}) })] })), _jsx(Route, { path: "/*", element: _jsx(PageLayout, { children: _jsxs(Routes, { children: [hasFeature('home') && _jsx(Route, { path: "/", element: _jsx(HomePage, {}) }), hasFeature('catalog') && _jsx(Route, { path: "/catalogue", element: _jsx(CatalogPage, {}) }), hasFeature('product') && _jsx(Route, { path: "/produit/:slug", element: _jsx(ProductPage, {}) }), hasFeature('contact') && _jsx(Route, { path: "/contact", element: _jsx(ContactPage, {}) }), hasFeature('content') && _jsx(Route, { path: "/p/:slug", element: _jsx(ContentPage, {}) }), _jsx(Route, { path: "/panier", element: _jsx(CartPage, {}) }), _jsx(Route, { path: "/commande", element: _jsx(CheckoutPage, {}) }), hasFeature('auth') && (_jsxs(_Fragment, { children: [_jsx(Route, { path: "/connexion", element: _jsx(LoginPage, {}) }), _jsx(Route, { path: "/mot-de-passe-oublie", element: _jsx(ForgotPasswordPage, {}) })] })), hasFeature('account') && (_jsx(Route, { path: "/mon-compte", element: _jsx(ProtectedRoute, { children: _jsx(AccountPage, {}) }) })), hasFeature('orderHistory') && (_jsx(Route, { path: "/mes-commandes", element: _jsx(ProtectedRoute, { children: _jsx(OrdersPage, {}) }) })), _jsx(Route, { path: "/mentions-legales", element: _jsx(ContentPage, {}) }), _jsx(Route, { path: "/confidentialite", element: _jsx(ContentPage, {}) }), _jsx(Route, { path: "*", element: _jsx(NotFoundPage, {}) })] }) }) })] }));
}
