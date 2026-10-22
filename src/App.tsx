// Path: src/App.tsx

import { Routes, Route } from 'react-router-dom'
import PageLayout from './layout/PageLayout'
import { hasFeature } from './config/packs'

// Pages storefront
import HomePage       from './features/home/HomePage'
import CatalogPage    from './features/catalog/CatalogPage'
import ProductPage    from './features/catalog/ProductPage'
import ContactPage    from './features/contact/ContactPage'
import ContentPage    from './features/content/ContentPage'

// Auth
import LoginPage          from './features/auth/LoginPage'
import ForgotPasswordPage from './features/auth/ForgotPasswordPage'
import ProtectedRoute     from './features/auth/ProtectedRoute'

// Espace client (Pack Pro)
import AccountPage from './features/account/AccountPage'
import OrdersPage  from './features/account/OrdersPage'

// Panier & Checkout (Pack Premium)
import CartPage     from './features/cart/CartPage'
import CheckoutPage from './features/cart/CheckoutPage'

// Admin
import AdminRoute              from './features/admin/AdminRoute'
import AdminLayout             from './features/admin/AdminLayout'
import AdminOrdersPage         from './features/admin/orders/AdminOrdersPage'
import AdminProductsPage       from './features/admin/products/AdminProductsPage'
import AdminPromotionsPage     from './features/admin/promotions/AdminPromotionsPage'
import AdminContentPage        from './features/admin/content/AdminContentPage'
import AdminSettingsPage       from './features/admin/settings/AdminSettingsPage'
import AdminBrandingPage       from './features/admin/branding/AdminBrandingPage'

// ══ ADMINISTRATION PERSONNALISATION CLIENT (Hclu1 / 3131) ══
// Accès via la roue dentée ⚙️ en bas de chaque page
import AdminPersoPanel from './admin-perso/AdminPersoPanel'

// Page 404
import NotFoundPage from './features/NotFoundPage'


// ─────────────────────────────────────────────
// Routeur principal
// Les routes admin utilisent AdminLayout (sans PageLayout)
// et sont protégées par AdminRoute
// ─────────────────────────────────────────────
export default function App() {
  return (
    <Routes>

      {/* ══ PANNEAU DE PERSONNALISATION CLIENT ══ */}
      {/* URL : /admin-perso  |  Accès : roue dentée ⚙️  |  Login : Hclu1 / 3131 */}
      <Route path="/admin-perso" element={<AdminPersoPanel />} />

      {/* ─── Admin — layout séparé, sans Header/Footer public ─── */}
      {hasFeature('admin') && (
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          }
        >
          <Route index             element={<AdminOrdersPage />}     />
          <Route path="commandes"  element={<AdminOrdersPage />}     />
          <Route path="produits"   element={<AdminProductsPage />}   />
          <Route path="promotions" element={<AdminPromotionsPage />} />
          <Route path="contenu"    element={<AdminContentPage />}    />
          <Route path="reglages"   element={<AdminSettingsPage />}   />
          <Route path="branding"   element={<AdminBrandingPage />}   />
        </Route>
      )}

      {/* ─── Toutes les pages publiques — avec Header/Footer ─── */}
      <Route
        path="/*"
        element={
          <PageLayout>
            <Routes>
              {/* Storefront public */}
              {hasFeature('home')    && <Route path="/"              element={<HomePage />}    />}
              {hasFeature('catalog') && <Route path="/catalogue"     element={<CatalogPage />} />}
              {hasFeature('product') && <Route path="/produit/:slug" element={<ProductPage />} />}
              {hasFeature('contact') && <Route path="/contact"       element={<ContactPage />} />}
              {hasFeature('content') && <Route path="/p/:slug"       element={<ContentPage />} />}

              {/* Panier & Checkout (Pack Premium) */}
              <Route path="/panier"   element={<CartPage />} />
              <Route path="/commande" element={<CheckoutPage />} />

              {/* Auth (Pack Pro) */}
              {hasFeature('auth') && (
                <>
                  <Route path="/connexion"           element={<LoginPage />}          />
                  <Route path="/mot-de-passe-oublie" element={<ForgotPasswordPage />} />
                </>
              )}

              {/* Espace client protégé (Pack Pro) */}
              {hasFeature('account') && (
                <Route
                  path="/mon-compte"
                  element={<ProtectedRoute><AccountPage /></ProtectedRoute>}
                />
              )}
              {hasFeature('orderHistory') && (
                <Route
                  path="/mes-commandes"
                  element={<ProtectedRoute><OrdersPage /></ProtectedRoute>}
                />
              )}

              {/* Pages légales — toujours accessibles */}
              <Route path="/mentions-legales" element={<ContentPage />} />
              <Route path="/confidentialite"  element={<ContentPage />} />

              {/* 404 */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </PageLayout>
        }
      />
    </Routes>
  )
}
