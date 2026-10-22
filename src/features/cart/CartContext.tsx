// Path: src/features/cart/CartContext.tsx

import React, { createContext, useContext, useState, useEffect } from 'react'
import type { Product } from '../../types'

export interface CartItem {
  product: Product
  quantity: number
}

interface CartContextValue {
  items: CartItem[]
  totalItems: number
  totalPrice: number
  addToCart: (product: Product) => void
  removeFromCart: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
}

const CartContext = createContext<CartContextValue | null>(null)

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart() doit être utilisé dans un <CartProvider>')
  return ctx
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  // Initialisation à partir du localStorage pour la démo
  const [items, setItems] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('noble_fermier_cart')
    return saved ? JSON.parse(saved) : []
  })

  // Sauvegarde automatique dans le localStorage
  useEffect(() => {
    localStorage.setItem('noble_fermier_cart', JSON.stringify(items))
  }, [items])

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)
  const totalPrice = items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0)

  function addToCart(product: Product) {
    setItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id)
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }
      return [...prev, { product, quantity: 1 }]
    })
  }

  function removeFromCart(productId: string) {
    setItems((prev) => prev.filter((item) => item.product.id !== productId))
  }

  function updateQuantity(productId: string, quantity: number) {
    if (quantity <= 0) {
      removeFromCart(productId)
      return
    }
    setItems((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    )
  }

  function clearCart() {
    setItems([])
  }

  return (
    <CartContext.Provider
      value={{
        items,
        totalItems,
        totalPrice,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}
