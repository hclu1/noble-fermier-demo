// Path: src/demo/DemoApp.tsx

import { Routes, Route, Navigate } from 'react-router-dom'
import { DemoProvider } from './context/DemoContext'
import DemoLayout from './layout/DemoLayout'
import DemoHomePage from './pages/DemoHomePage'
import DemoCatalogPage from './pages/DemoCatalogPage'
import DemoProductPage from './pages/DemoProductPage'
import DemoOrdersPage from './pages/DemoOrdersPage'
import DemoAdminPreviewPage from './pages/DemoAdminPreviewPage'
import DemoContactPage from './pages/DemoContactPage'

export default function DemoApp() {
  return (
    <DemoProvider>
      <DemoLayout>
        <Routes>
          <Route path="/" element={<DemoHomePage />} />
          <Route path="/catalogue" element={<DemoCatalogPage />} />
          <Route path="/produit/:slug" element={<DemoProductPage />} />
          <Route path="/commandes" element={<DemoOrdersPage />} />
          <Route path="/admin-preview" element={<DemoAdminPreviewPage />} />
          <Route path="/contact" element={<DemoContactPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </DemoLayout>
    </DemoProvider>
  )
}
