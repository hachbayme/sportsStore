"use client"

import { useState } from "react"
import OrdersPage from "./OrdersPage"
import ProductsPage from "./ProductsPage"
import { Button } from "@/components/ui/button"
import { Package, ShoppingCart, Home, BarChart3, Users, Settings, LogOut } from "lucide-react"
import { Toaster } from "sonner"
import AdminProtection from "@/components/AdminProtection"
import AdminSettings from "./settings/page"

export default function AdminDashboard() {
  const [activePage, setActivePage] = useState<"orders" | "products" | "settings" | "home">("orders")

  // const handleLogout = () => {
  //   // Effacer les données de session
  //   sessionStorage.removeItem('adminAuthenticated');
  //   // Recharger la page pour retourner à la page de connexion
  //   window.location.href = '/admin';
  // }
  const handleLogout = () => {
  sessionStorage.removeItem('adminAuthenticated'); // أو حذف token
  window.location.href = '/admin'; // إعادة التوجيه للصفحة المحمية
}

  const renderPage = () => {
    switch (activePage) {
      case "orders":
        return <OrdersPage />
      case "products":
        return <ProductsPage />
      case "settings":
        return <AdminSettings />
      default:
        return <OrdersPage />
    }
  }

  return (
    <AdminProtection>
      <div className="min-h-screen bg-gray-900 text-white" >
        {/* Barre supérieure au lieu de la barre latérale */}
        <header className="bg-gray-800 border-b border-gray-700 sticky top-0 z-10">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between h-16">
              {/* Titre et logo */}
              <div className="flex items-center gap-4">
                <h1 className="text-xl font-bold text-amber-400">Tableau de bord Admin</h1>
                <p className="text-gray-400 text-sm hidden md:block">Magasin de vêtements de sport</p>
              </div>

              {/* Boutons de navigation principaux */}
              <nav className="flex items-center gap-2">
                <Button 
                  variant={activePage === "orders" ? "default" : "ghost"} 
                  onClick={() => setActivePage("orders")}
                  className="gap-2 text-gray-300 hover:text-amber-400 hover:bg-amber-500/10"
                  size="sm"
                >
                  <ShoppingCart className="h-4 w-4" />
                  <span className="hidden sm:inline">Commandes</span>
                </Button>
                
                <Button 
                  variant={activePage === "products" ? "default" : "ghost"} 
                  onClick={() => setActivePage("products")}
                  className="gap-2 text-gray-300 hover:text-amber-400 hover:bg-amber-500/10"
                  size="sm"
                >
                  <Package className="h-4 w-4" />
                  <span className="hidden sm:inline">Produits</span>
                </Button>
                
                <Button 
                  variant={activePage === "settings" ? "default" : "ghost"} 
                  onClick={() => setActivePage("settings")}
                  className="gap-2 text-gray-300 hover:text-amber-400 hover:bg-amber-500/10"
                  size="sm"
                >
                  <Settings className="h-4 w-4" />
                  <span className="hidden sm:inline">Paramètres</span>
                </Button>
              </nav>

              {/* Informations utilisateur et boutons d'action */}
              <div className="flex items-center gap-2">

                <Button
                  variant="outline"
                  onClick={handleLogout}
                  className="gap-2 text-sm bg-red-600/20 hover:bg-red-600/30 text-red-300 border-red-500/30"
                  size="sm"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="hidden sm:inline">Déconnexion</span>
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Contenu principal */}
        <main className="container mx-auto p-6">
          {/* Barre de titre de page 
          <div className="bg-gray-800 rounded-lg p-4 mb-6 border border-gray-700">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-amber-400">
                {activePage === "orders" && "Gestion des commandes"}
                {activePage === "products" && "Gestion des produits"}
                {activePage === "settings" && "Paramètres"}
                {activePage === "home" && "Tableau de bord"}
              </h2>
            </div>
          </div>*/}

          {/* Contenu de la page */}
          <div className="bg-gray-800/50 rounded-lg border border-gray-700 p-5">
            {renderPage()}
          </div>
        </main>
        
        <Toaster 
          position="top-left"
          expand={true}
          richColors
          closeButton
        />
      </div>
    </AdminProtection>
  )
}