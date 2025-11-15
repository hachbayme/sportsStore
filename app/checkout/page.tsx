"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, CreditCard, MapPin, User, Phone, Mail } from "lucide-react"
import { useCart } from "@/hooks/use-cart"
import { toast } from "sonner"

interface CustomerInfo {
  name: string
  phone: string
  email: string
  address: string
}

export default function CheckoutPage() {
  const router = useRouter()
  const { items, getTotalPrice, clearCart } = useCart()
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    name: "",
    phone: "",
    email: "",
    address: ""
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Vérification des données
    if (!customerInfo.name || !customerInfo.phone || !customerInfo.address) {
      toast.error("Veuillez remplir tous les champs obligatoires")
      setLoading(false)
      return
    }

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerInfo,
          cartItems: items,
          total: getTotalPrice()
        }),
      })

      const result = await response.json()

      if (result.success) {
        toast.success("Commande confirmée avec succès!")
        clearCart()
        router.push("/order-success")
      } else {
        toast.error("Une erreur s'est produite lors de la confirmation de la commande")
      }
    } catch (error) {
      console.error('Error:', error)
      toast.error("Une erreur s'est produite lors de la confirmation de la commande")
    } finally {
      setLoading(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Panier vide</h1>
          <p className="text-gray-400 mb-8">Vous n'avez ajouté aucun produit au panier</p>
          <Button 
            onClick={() => router.push("/")} 
            className="bg-amber-500 hover:bg-amber-600 text-black transition-all duration-300 hover:scale-105"
          >
            Retour aux achats
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900" dir="ltr">
      <div className="container mx-auto px-4 py-8">
        {/* En-tête */}
        <div className="flex items-center justify-between mb-8">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="bg-amber-500 hover:bg-amber-600 text-black transition-all duration-300 hover:scale-105"
          >
            Retour
          </Button>
          <h1 className="text-3xl font-bold text-white">Finaliser la commande</h1>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Informations client */}
          <div className="space-y-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <User className="h-5 w-5 text-amber-400" />
                  Informations client
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block text-gray-300">Nom complet *</label>
                    <Input
                      type="text"
                      placeholder="Entrez votre nom complet"
                      value={customerInfo.name}
                      onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                      required
                      className="bg-gray-700 border-gray-600 text-white placeholder-gray-500 focus:border-amber-500 focus:ring-amber-500"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block text-gray-300">Numéro de téléphone *</label>
                    <Input
                      type="tel"
                      placeholder="Entrez votre numéro de téléphone"
                      value={customerInfo.phone}
                      onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                      required
                      className="bg-gray-700 border-gray-600 text-white placeholder-gray-500 focus:border-amber-500 focus:ring-amber-500"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block text-gray-300">Adresse e-mail</label>
                    <Input
                      type="email"
                      placeholder="Entrez votre adresse e-mail"
                      value={customerInfo.email}
                      onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })}
                      className="bg-gray-700 border-gray-600 text-white placeholder-gray-500 focus:border-amber-500 focus:ring-amber-500"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block text-gray-300">Adresse *</label>
                    <Input
                      type="text"
                      placeholder="Entrez votre adresse complète"
                      value={customerInfo.address}
                      onChange={(e) => setCustomerInfo({ ...customerInfo, address: e.target.value })}
                      required
                      className="bg-gray-700 border-gray-600 text-white placeholder-gray-500 focus:border-amber-500 focus:ring-amber-500"
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-amber-500 hover:bg-amber-600 text-black transition-all duration-300 hover:scale-105"
                    size="lg"
                    disabled={loading}
                  >
                    {loading ? "Confirmation de la commande..." : "Confirmer la commande"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Récapitulatif de commande */}
          <div className="space-y-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Récapitulatif de commande</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {items.map((item) => (
                    <div key={`${item.id}-${item.selectedSize}-${item.selectedColor}`} className="flex justify-between items-center border-b border-gray-700 pb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gray-700 rounded overflow-hidden">
                          <img
                            src={item.image || "/placeholder.svg"}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-medium text-white">{item.name}</p>
                          <Badge variant="secondary" className="text-xs bg-amber-500/20 text-amber-300 border-amber-500/30 mt-1">
                            {item.brand}
                          </Badge>
                          {item.selectedSize && <p className="text-xs text-gray-400 mt-1">Taille: {item.selectedSize}</p>}
                          {item.selectedColor && <p className="text-xs text-gray-400 mt-1">Couleur: {item.selectedColor}</p>}
                          <p className="text-xs text-gray-400 mt-1">Quantité: {item.quantity}</p>
                        </div>
                      </div>
                      <p className="font-medium text-amber-400">{item.price * item.quantity} SAR</p>
                    </div>
                  ))}

                  <div className="space-y-2 pt-4">
                    <div className="flex justify-between text-gray-300">
                      <span>Sous-total</span>
                      <span>{getTotalPrice()} SAR</span>
                    </div>
                    <div className="flex justify-between text-gray-300">
                      <span>Livraison</span>
                      <span className="text-amber-400">Gratuite</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg border-t border-gray-700 pt-2 text-amber-400">
                      <span>Total</span>
                      <span>{getTotalPrice()} SAR</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Méthodes de paiement */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <CreditCard className="h-5 w-5 text-amber-400" />
                  Méthodes de paiement
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 border border-amber-500/30 rounded-lg bg-amber-500/10">
                    <div className="w-8 h-8 bg-amber-500/20 rounded-full flex items-center justify-center">
                      <CreditCard className="h-4 w-4 text-amber-400" />
                    </div>
                    <span className="text-amber-300">Paiement à la livraison</span>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 border border-gray-600 rounded-lg bg-gray-700/50 opacity-50">
                    <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
                      <CreditCard className="h-4 w-4 text-gray-400" />
                    </div>
                    <span className="text-gray-400">Carte de crédit (bientôt disponible)</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}