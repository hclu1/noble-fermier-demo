// Path: supabase/functions/notify-order-status/index.ts
//
// Edge Function Supabase — Notification email au client lors d'un changement de statut.
//
// DÉPLOIEMENT :
//   supabase functions deploy notify-order-status
//
// SECRET REQUIS (à configurer dans le dashboard Supabase → Settings → Edge Functions) :
//   RESEND_API_KEY=re_xxxxxxxxxxxx
//   SHOP_EMAIL_FROM=boutique@votre-domaine.fr
//
// Resend : https://resend.com (gratuit jusqu'à 3000 emails/mois)
// ─────────────────────────────────────────────

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY') ?? ''
const SHOP_EMAIL_FROM = Deno.env.get('SHOP_EMAIL_FROM') ?? 'boutique@exemple.fr'
const SUPABASE_URL = Deno.env.get('SUPABASE_URL') ?? ''
const SUPABASE_SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''

serve(async (req) => {
  try {
    const { orderId, newStatus, message } = await req.json()

    if (!orderId || !newStatus || !message) {
      return new Response(JSON.stringify({ error: 'Paramètres manquants.' }), { status: 400 })
    }

    // Récupère l'email du client depuis la base de données
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('customer_id')
      .eq('id', orderId)
      .single()

    if (orderError || !order) {
      return new Response(JSON.stringify({ error: 'Commande introuvable.' }), { status: 404 })
    }

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('email, first_name')
      .eq('id', order.customer_id)
      .single()

    if (profileError || !profile) {
      return new Response(JSON.stringify({ error: 'Profil client introuvable.' }), { status: 404 })
    }

    // Envoi de l'email via Resend
    const emailRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: SHOP_EMAIL_FROM,
        to: profile.email,
        subject: `Mise à jour de votre commande #${orderId.slice(0, 8)}`,
        html: `
          <p>Bonjour ${profile.first_name},</p>
          <p>${message}</p>
          <p>Référence de commande : <strong>#${orderId.slice(0, 8)}</strong></p>
          <br>
          <p>À bientôt,<br>L'équipe de votre primeur</p>
        `,
      }),
    })

    if (!emailRes.ok) {
      const emailError = await emailRes.text()
      return new Response(JSON.stringify({ error: `Resend : ${emailError}` }), { status: 500 })
    }

    return new Response(JSON.stringify({ success: true }), { status: 200 })
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), { status: 500 })
  }
})
