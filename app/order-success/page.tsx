"use client"

import { Button } from "@/components/ui/button"
import { CheckCircle, ShoppingBag, Home, Package, Truck, MessageCircle } from "lucide-react"
import Link from "next/link"
import { useCart } from "@/context/cart-context"
import { useEffect } from "react"

export default function OrderSuccessPage() {
  const { clearCart } = useCart()

  // تفريغ السلة تلقائياً عند تحميل الصفحة
  useEffect(() => {
    const hasCleared = localStorage.getItem('cart_cleared')
    if (!hasCleared) {
      clearCart()
      localStorage.setItem('cart_cleared', 'true')
      
      // تنظيف بعد 5 ثواني (اختياري)
      setTimeout(() => {
        localStorage.removeItem('cart_cleared')
      }, 5000)
    }
  }, [clearCart])

  const handleContinueShopping = () => {
    // يمكنك أيضاً تفريغ السلة عند النقر على الزر إذا أردت
    // clearCart()
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
      <div className="text-center max-w-2xl">
        {/* أيقونة النجاح */}
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-amber-500/20 rounded-full animate-ping opacity-75"></div>
          <CheckCircle className="h-20 w-20 text-amber-400 mx-auto relative z-10" />
        </div>
        
        {/* العنوان الرئيسي */}
        <h1 className="text-4xl font-bold text-white mb-4 bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">
          Votre commande a été confirmée avec succès !
        </h1>
        
        {/* الرسالة */}
        <p className="text-gray-300 text-lg mb-8 leading-relaxed">
          Merci de votre confiance. Nous préparerons et expédierons votre commande dans les plus brefs délais.          <br />
        </p>

        {/* معلومات التتبع */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <div className="w-12 h-12 bg-amber-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
              <Package className="h-6 w-6 text-amber-400" />
            </div>
            <h3 className="font-semibold text-white mb-1">Traitement en cours...</h3>
          </div>

          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <div className="w-12 h-12 bg-amber-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
              <Truck className="h-6 w-6 text-amber-400" />
            </div>
            <h3 className="font-semibold text-white mb-1">Livraison</h3>
            <p className="text-gray-400 text-sm">Délai de livraison : 2-5 jours</p>
          </div>

          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <div className="w-12 h-12 bg-amber-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
              <MessageCircle className="h-6 w-6 text-amber-400" />
            </div>
            <h3 className="font-semibold text-white mb-1">Support</h3>
            <p className="text-gray-400 text-sm">Support disponible 24h/24 et 7j/7</p>
          </div>
        </div>

        {/* أزرار التنقل */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/" className="flex-1">
            <Button 
              className="w-full bg-amber-500 hover:bg-amber-600 text-black transition-all duration-300 hover:scale-105 h-12"
              size="lg"
            >
              <Home className="h-5 w-5 ml-2" />
              Accueil
            </Button>
          </Link>
        </div>

        {/* رسالة إضافية */}
      </div>
    </div>
  )
}