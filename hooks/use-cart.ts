"use client"

import { useState, useEffect } from "react"

export interface CartItem {
  id: number
  name: string
  price: number
  image?: string | null
  brand: string
  selectedSize?: string
  selectedColor?: string
  quantity: number
}

export function useCart() {
  const [items, setItems] = useState<CartItem[]>([])
  const [isLoaded, setIsLoaded] = useState(false)
  const totalItems = items.reduce((total, item) => total + item.quantity, 0)

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("cart")
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart)
        setItems(Array.isArray(parsedCart) ? parsedCart : [])
      } catch (error) {
        console.error('Error parsing cart from localStorage:', error)
        setItems([])
      }
    }
    setIsLoaded(true)
  }, [])


  // Save cart to localStorage whenever items change
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("cart", JSON.stringify(items))
    }
  }, [items, isLoaded])

  const addItem = (item: CartItem) => {
    setItems(prevItems => {
      const existingItemIndex = prevItems.findIndex(
        (cartItem) => 
          cartItem.id === item.id && 
          cartItem.selectedSize === item.selectedSize && 
          cartItem.selectedColor === item.selectedColor
      )

      if (existingItemIndex > -1) {
        const updatedItems = [...prevItems]
        updatedItems[existingItemIndex].quantity += item.quantity
        return updatedItems
      } else {
        return [...prevItems, item]
      }
    })
  }

  const removeItem = (id: number, selectedSize?: string, selectedColor?: string) => {
    setItems(prevItems => 
      prevItems.filter((item) => 
        !(item.id === id && item.selectedSize === selectedSize && item.selectedColor === selectedColor)
      )
    )
  }

  const updateQuantity = (id: number, quantity: number, selectedSize?: string, selectedColor?: string) => {
    if (quantity <= 0) {
      removeItem(id, selectedSize, selectedColor)
      return
    }

    setItems(prevItems =>
      prevItems.map((item) =>
        item.id === id && item.selectedSize === selectedSize && item.selectedColor === selectedColor 
          ? { ...item, quantity } 
          : item
      )
    )
  }

  const clearCart = () => {
    setItems([])
  }

  // احذف الدالة getTotalItems المكررة وعدّل الدالة الموجودة
  const getTotalPrice = () => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  return {
    items,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    //getTotalItems: () => totalItems, // ← أعدها كدالة تعيد القيمة
    totalItems,
    getTotalPrice,
    isLoaded
  }
}