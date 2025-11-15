// contexts/cart-context.tsx
"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react"

export interface CartItem {
  id: number
  name: string
  price: number
  image?: string
  brand: string
  selectedSize?: string
  selectedColor?: string
  quantity: number
}

interface CartContextType {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (id: number, selectedSize?: string, selectedColor?: string) => void
  updateQuantity: (id: number, quantity: number, selectedSize?: string, selectedColor?: string) => void
  clearCart: () => void
  totalItems: number
  getTotalPrice: () => number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    const savedCart = localStorage.getItem("cart")
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart))
      } catch (error) {
        console.error('Error parsing cart:', error)
        setItems([])
      }
    }
  }, [])

  useEffect(() => {
    if (isMounted) {
      localStorage.setItem("cart", JSON.stringify(items))
    }
  }, [items, isMounted])

  const addItem = (item: CartItem) => {
    setItems(prevItems => {
      const existingItemIndex = prevItems.findIndex(
        cartItem => 
          cartItem.id === item.id && 
          cartItem.selectedSize === item.selectedSize && 
          cartItem.selectedColor === item.selectedColor
      )

      if (existingItemIndex > -1) {
        const updatedItems = [...prevItems]
        updatedItems[existingItemIndex].quantity += item.quantity
        return updatedItems
      }
      return [...prevItems, item]
    })
  }

  const removeItem = (id: number, selectedSize?: string, selectedColor?: string) => {
    setItems(prevItems => 
      prevItems.filter(item => 
        !(item.id === id && 
          item.selectedSize === selectedSize && 
          item.selectedColor === selectedColor)
      )
    )
  }

  const updateQuantity = (id: number, quantity: number, selectedSize?: string, selectedColor?: string) => {
    if (quantity <= 0) {
      removeItem(id, selectedSize, selectedColor)
      return
    }

    setItems(prevItems =>
      prevItems.map(item =>
        item.id === id && 
        item.selectedSize === selectedSize && 
        item.selectedColor === selectedColor
          ? { ...item, quantity }
          : item
      )
    )
  }

  const clearCart = useCallback(() => {
  setItems([])
}, [])

  const getTotalPrice = () => items.reduce((total, item) => total + item.price * item.quantity, 0)

  const totalItems = items.reduce((total, item) => total + item.quantity, 0)

  return (
    <CartContext.Provider value={{
      items,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      totalItems,
      getTotalPrice
    }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}