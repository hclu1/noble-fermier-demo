// Path: src/lib/sanitizeHtml.ts

// ─────────────────────────────────────────────
// Sanitisation du HTML saisi dans l'admin
//
// Autorise uniquement les balises éditoriales sûres.
// Supprime tout ce qui pourrait exécuter du code (script, on*, style…).
//
// Utilisé avant d'envoyer le contenu à Supabase ET avant de l'afficher.
// ─────────────────────────────────────────────

// Balises HTML autorisées dans les pages de contenu
const ALLOWED_TAGS = ['p', 'h2', 'h3', 'h4', 'ul', 'ol', 'li', 'a', 'strong', 'em', 'br']

// Attributs autorisés par balise
const ALLOWED_ATTRIBUTES: Record<string, string[]> = {
  a: ['href', 'target', 'rel'],
}

export function sanitizeHtml(html: string): string {
  // Crée un nœud DOM temporaire pour parser le HTML
  const template = document.createElement('template')
  template.innerHTML = html

  sanitizeNode(template.content)

  return template.innerHTML
}

function sanitizeNode(node: Node): void {
  const children = Array.from(node.childNodes)

  for (const child of children) {
    if (child.nodeType === Node.ELEMENT_NODE) {
      const el = child as Element
      const tag = el.tagName.toLowerCase()

      // Supprime les balises non autorisées (conserve leur contenu texte)
      if (!ALLOWED_TAGS.includes(tag)) {
        const text = document.createTextNode(el.textContent ?? '')
        node.replaceChild(text, el)
        continue
      }

      // Supprime les attributs non autorisés
      const allowedAttrs = ALLOWED_ATTRIBUTES[tag] ?? []
      const attrs = Array.from(el.attributes)
      for (const attr of attrs) {
        if (!allowedAttrs.includes(attr.name)) {
          el.removeAttribute(attr.name)
        }
      }

      // Force rel="noopener noreferrer" sur les liens externes
      if (tag === 'a') {
        const href = el.getAttribute('href') ?? ''
        if (href.startsWith('http')) {
          el.setAttribute('target', '_blank')
          el.setAttribute('rel', 'noopener noreferrer')
        }
      }

      // Récursion sur les enfants
      sanitizeNode(el)
    }
  }
}
