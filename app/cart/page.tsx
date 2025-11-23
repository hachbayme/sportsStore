"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft } from "lucide-react"
import { useCart } from "@/hooks/use-cart"
import { toast } from "sonner"

interface CartItem {
  id: number
  name: string
  price: number
  image?: string | null
  brand: string
  selectedSize?: string
  selectedColor?: string
  quantity: number
}

export default function CartPage() {
  const router = useRouter()
  const { items, updateQuantity, removeItem, getTotalPrice, isLoaded } = useCart()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (isLoaded) {
      setLoading(false)
    }
  }, [isLoaded])

  const handleQuantityChange = (index: number, newQuantity: number) => {
    if (newQuantity < 1) return
    
    const item = items[index]
    updateQuantity(item.id, newQuantity, item.selectedSize, item.selectedColor)
  }

  const handleRemoveItem = (index: number) => {
    const item = items[index]
    removeItem(item.id, item.selectedSize, item.selectedColor)
    toast.success("Produit retiré du panier")
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Chargement du panier...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900" dir="rtl">
      <div className="container mx-auto px-4 py-8">
        {/* En-tête */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Panier</h1>
            <p className="text-gray-400 mt-1">
              {items.length > 0 ? `${items.length} produit(s) dans le panier` : "Panier vide"}
            </p>
          </div>
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="bg-amber-500 hover:bg-amber-600 text-black transition-all duration-300 hover:scale-105"
          >
            Retour aux achats
          </Button>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="h-12 w-12 text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">Votre panier est vide</h2>
            <p className="text-gray-400 mb-8">Vous n'avez ajouté aucun produit au panier</p>
            <Button 
              onClick={() => router.push("/")} 
              className="bg-amber-500 hover:bg-amber-600 text-black transition-all duration-300 hover:scale-105" 
              size="lg"
            >
              Commencer vos achats
            </Button>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Liste des articles du panier */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item, index) => (
                <div key={`${item.id}-${item.selectedSize}-${item.selectedColor}`} className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-amber-500/30 transition-all duration-300">
                  <div className="flex gap-4">
                    {/* Image du produit */}
                    <div className="w-20 h-20 bg-gray-700 rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Détails du produit */}
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <Badge variant="secondary" className="mb-1 bg-amber-500/20 text-amber-300 border-amber-500/30">
                            {item.brand}
                          </Badge>
                          <h3 className="font-semibold text-white">{item.name}</h3>
                          {item.selectedSize && <p className="text-sm text-gray-400">Taille: {item.selectedSize}</p>}
                          {item.selectedColor && <p className="text-sm text-gray-400">Couleur: {item.selectedColor}</p>}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveItem(index)}
                          className="text-red-400 hover:text-red-300 hover:bg-red-500/20"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleQuantityChange(index, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                            className="border-gray-600 text-gray-300 hover:bg-amber-500 hover:text-black hover:border-amber-500"
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="px-3 py-1 border border-gray-600 rounded text-white bg-gray-700 min-w-[40px] text-center">
                            {item.quantity}
                          </span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleQuantityChange(index, item.quantity + 1)}
                            className="border-gray-600 text-gray-300 hover:bg-amber-500 hover:text-black hover:border-amber-500"
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                        <div className="text-left">
                          <p className="font-bold text-lg text-amber-400">{item.price * item.quantity} MAD</p>
                          {item.quantity > 1 && <p className="text-sm text-gray-400">{item.price} MAD par article</p>}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Récapitulatif de commande */}
            <div className="lg:col-span-1">
              <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 sticky top-4">
                <h2 className="text-xl font-bold text-white mb-4">Récapitulatif de commande</h2>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-gray-300">
                    <span>Sous-total</span>
                    <span>{getTotalPrice()} MAD</span>
                  </div>
                  <div className="flex justify-between text-gray-300">
                    <span>Livraison</span>
                    <span className="text-amber-400">Gratuite</span>
                  </div>
                  <hr className="border-gray-700" />
                  <div className="flex justify-between font-bold text-lg text-amber-400">
                    <span>Total</span>
                    <span>{getTotalPrice()} MAD</span>
                  </div>
                </div>

                <Button
                  className="w-full bg-amber-500 hover:bg-amber-600 text-black transition-all duration-300 hover:scale-105"
                  onClick={() => router.push("/checkout")}
                  size="lg"
                >
                  Procéder au paiement
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}