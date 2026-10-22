import { jsx as _jsx } from "react/jsx-runtime";
// Path: src/main.tsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './features/auth/AuthContext';
import BrandingProvider from './providers/BrandingProvider';
import { CartProvider } from './features/cart/CartContext';
import { AdminPersoProvider } from './admin-perso/AdminPersoContext';
import App from './App';
import './styles/global.css';
// Point d'entrée de l'application
// AdminPersoProvider gère les personnalisations client (couleurs, textes, produits)
// → Accès via le bouton ⚙️ en bas de page (Hclu1 / 3131)
// BrandingProvider lit les couleurs en base et injecte les CSS vars au démarrage
// AuthProvider enveloppe toute l'app pour que useAuth() soit disponible partout
createRoot(document.getElementById('root')).render(_jsx(StrictMode, { children: _jsx(BrowserRouter, { children: _jsx(AdminPersoProvider, { children: _jsx(BrandingProvider, { children: _jsx(AuthProvider, { children: _jsx(CartProvider, { children: _jsx(App, {}) }) }) }) }) }) }));
