// Path: src/data/mockOrders.ts
// Commandes de démonstration pour l'espace client
// Remplacées par des requêtes Supabase avec RLS (chaque client ne voit que ses commandes)
export const mockOrders = [
    {
        id: 'ord-001',
        profileId: 'mock-user-1',
        status: 'delivered',
        deliveryMode: 'pickup',
        totalPrice: 27.40,
        note: '',
        createdAt: '2026-03-10T09:15:00Z',
        updatedAt: '2026-03-11T14:30:00Z',
        items: [
            { id: 'oi-1', orderId: 'ord-001', productId: 'p-1', productName: 'Tomates anciennes', quantity: 2, unitPrice: 4.50, unit: 'le kg' },
            { id: 'oi-2', orderId: 'ord-001', productId: 'p-6', productName: 'Haricots verts extra-fins', quantity: 1, unitPrice: 5.50, unit: 'le kg' },
            { id: 'oi-3', orderId: 'ord-001', productId: 'p-11', productName: 'Panier découverte', quantity: 1, unitPrice: 18.00, unit: 'le panier' },
        ],
    },
    {
        id: 'ord-002',
        profileId: 'mock-user-1',
        status: 'ready',
        deliveryMode: 'pickup',
        totalPrice: 18.60,
        note: 'Merci de bien emballer les fraises.',
        createdAt: '2026-03-20T11:00:00Z',
        updatedAt: '2026-03-21T08:00:00Z',
        items: [
            { id: 'oi-4', orderId: 'ord-002', productId: 'p-2', productName: 'Fraises Gariguette', quantity: 2, unitPrice: 5.90, unit: 'la barquette 500g' },
            { id: 'oi-5', orderId: 'ord-002', productId: 'p-4', productName: 'Abricots du Roussillon', quantity: 1, unitPrice: 4.80, unit: 'le kg' },
            { id: 'oi-6', orderId: 'ord-002', productId: 'p-9', productName: 'Basilic frais', quantity: 1, unitPrice: 1.80, unit: 'le plant' },
        ],
    },
    {
        id: 'ord-003',
        profileId: 'mock-user-1',
        status: 'confirmed',
        deliveryMode: 'pickup',
        totalPrice: 32.00,
        note: '',
        createdAt: '2026-03-26T16:45:00Z',
        updatedAt: '2026-03-26T17:00:00Z',
        items: [
            { id: 'oi-7', orderId: 'ord-003', productId: 'p-12', productName: 'Panier famille', quantity: 1, unitPrice: 32.00, unit: 'le panier' },
        ],
    },
    {
        id: 'ord-004',
        profileId: 'mock-user-1',
        status: 'pending',
        deliveryMode: 'pickup',
        totalPrice: 15.90,
        note: 'Si pas de poivrons rouges, remplacer par jaunes.',
        createdAt: '2026-03-27T20:10:00Z',
        updatedAt: '2026-03-27T20:10:00Z',
        items: [
            { id: 'oi-8', orderId: 'ord-004', productId: 'p-8', productName: 'Poivrons tricolores', quantity: 2, unitPrice: 3.90, unit: 'le filet 3 pièces' },
            { id: 'oi-9', orderId: 'ord-004', productId: 'p-3', productName: 'Cerises Burlat', quantity: 1, unitPrice: 7.20, unit: 'le kg' },
        ],
    },
];
