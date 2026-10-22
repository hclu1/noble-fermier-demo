import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// Path: src/demo/DemoApp.tsx
import { Routes, Route, Navigate } from 'react-router-dom';
import { DemoProvider } from './context/DemoContext';
import DemoLayout from './layout/DemoLayout';
import DemoHomePage from './pages/DemoHomePage';
import DemoCatalogPage from './pages/DemoCatalogPage';
import DemoProductPage from './pages/DemoProductPage';
import DemoOrdersPage from './pages/DemoOrdersPage';
import DemoAdminPreviewPage from './pages/DemoAdminPreviewPage';
import DemoContactPage from './pages/DemoContactPage';
export default function DemoApp() {
    return (_jsx(DemoProvider, { children: _jsx(DemoLayout, { children: _jsxs(Routes, { children: [_jsx(Route, { path: "/", element: _jsx(DemoHomePage, {}) }), _jsx(Route, { path: "/demo", element: _jsx(DemoHomePage, {}) }), _jsx(Route, { path: "/catalogue", element: _jsx(DemoCatalogPage, {}) }), _jsx(Route, { path: "/demo/catalogue", element: _jsx(DemoCatalogPage, {}) }), _jsx(Route, { path: "/produit/:slug", element: _jsx(DemoProductPage, {}) }), _jsx(Route, { path: "/demo/produit/:slug", element: _jsx(DemoProductPage, {}) }), _jsx(Route, { path: "/commandes", element: _jsx(DemoOrdersPage, {}) }), _jsx(Route, { path: "/demo/commandes", element: _jsx(DemoOrdersPage, {}) }), _jsx(Route, { path: "/admin-preview", element: _jsx(DemoAdminPreviewPage, {}) }), _jsx(Route, { path: "/demo/admin-preview", element: _jsx(DemoAdminPreviewPage, {}) }), _jsx(Route, { path: "/contact", element: _jsx(DemoContactPage, {}) }), _jsx(Route, { path: "/demo/contact", element: _jsx(DemoContactPage, {}) }), _jsx(Route, { path: "*", element: _jsx(Navigate, { to: "/", replace: true }) })] }) }) }));
}
