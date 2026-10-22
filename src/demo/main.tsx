// Path: src/demo/main.tsx

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import DemoApp from './DemoApp'
import '../styles/variables.css'
import '../styles/global.css'

// Détection intelligente du basename :
// Si accédé via un sous-chemin /demo/, configure le router sur /demo
// Si déployé sur un domaine ou sous-domaine dédié (ex. demo-noble-fermier.vercel.app), utilise la racine /
const isSubpathDemo = window.location.pathname.startsWith('/demo')
const basename = isSubpathDemo ? '/demo' : '/'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter basename={basename}>
      <DemoApp />
    </BrowserRouter>
  </StrictMode>
)
