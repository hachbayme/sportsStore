"use client"

import { useState, useEffect } from "react"
import ProductCard from "@/components/product-card"
import { Button } from "@/components/ui/button"
import ContactSection from "@/components/contact-section"
import { Card, CardContent } from "@/components/ui/card"
import {  Truck, Shield, Headphones } from "lucide-react"
import Link from "next/link"
import type { Product } from "@/types/product"
import MainLayout from "@/components/main-layout"
import HeroSection from "../components/hero-section"
import { Mail, Phone, MapPin, Clock, Facebook, Twitter, Instagram, Youtube } from "lucide-react"


export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const brandss = [
    {
      id: 1,
      name: "Nike",
      logo: "/brands/nike-logo.png",
      productsCount: 156,
    },
    {
      id: 2,
      name: "Adidas",
      logo: "/brands/adidas-logo.png",
      productsCount: 142,
    },
    {
      id: 3,
      name: "Puma",
      logo: "/brands/puma-logo.png",
      productsCount: 98,
    },
    {
      id: 4,
      name: "Reebok",
      logo: "/brands/reebok-logo.png",
      productsCount: 87,
    }
  ]

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
  try {
    setLoading(true)
    const response = await fetch("/api/products")
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
    const data = await response.json()
    
    if (Array.isArray(data)) {
      setProducts(data)
    } else if (data.products && Array.isArray(data.products)) {
      setProducts(data.products)
    } else {
      setProducts([])
    }
  } catch (error) {
    console.error('Error fetching products:', error)
    setProducts([])
  } finally {
    setLoading(false)
  }
}

  const featuredProducts = products.slice(0, 4)

  if (loading) {
    return (
      <MainLayout>
        <div className="min-h-screen bg-gray-900 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto mb-4"></div>
            <p className="text-gray-400"> "Chargement ..."
            </p>
          </div>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="min-h-screen bg-gray-900 text-white">
        
        {/* Hero Section */}
        <HeroSection/>

        {/* Features Section */}
        <section className="py-16 bg-gray-800">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center p-6 bg-gray-750 rounded-lg hover:bg-gray-700 transition-all duration-300 hover:-translate-y-1">
                <div className="w-16 h-16 bg-amber-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Truck className="h-8 w-8 text-amber-400" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-white">{"Livraison rapide"}</h3>
                <p className="text-gray-400">
                  { "Livraison gratuite pour les commandes supérieures à 200 MAD"}
                </p>
              </div>
              
              <div className="text-center p-6 bg-gray-750 rounded-lg hover:bg-gray-700 transition-all duration-300 hover:-translate-y-1">
                <div className="w-16 h-16 bg-amber-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-8 w-8 text-amber-400" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-white">{ "Garantie qualité"}</h3>
                <p className="text-gray-400">
                  { "Produits originaux 100% avec garantie d'échange"}
                </p>
              </div>
              
              <div className="text-center p-6 bg-gray-750 rounded-lg hover:bg-gray-700 transition-all duration-300 hover:-translate-y-1">
                <div className="w-16 h-16 bg-amber-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Headphones className="h-8 w-8 text-amber-400" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-white">{ "Support 24/7"}</h3>
                <p className="text-gray-400">
                  {"Service client disponible 24/7"}
                </p>
              </div>
            </div>
          </div>
          <div id="brands"></div>
        </section>

        {/* Brands Section */}
        <section  className="py-16 bg-black">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-white mb-4">
                { "Marques de Sport Premium"}
              </h2>
              <p className="text-lg text-gray-400 max-w-2xl mx-auto">
                { "Découvrez les meilleures marques mondiales dans le domaine du sport et du fitness"
                }
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {brandss.map((brand) => (
                <Card key={brand.id} className="group cursor-pointer bg-gray-850 border border-gray-700 hover:border-amber-500 transition-all duration-300 transform hover:-translate-y-2">
                  <CardContent className="p-6 text-center">
                    <div className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 bg-gray-800">
                      <div className="relative w-16 h-16">
                        <img src={brand.logo} alt={brand.name} className="filter brightness-0 invert" />
                      </div>
                    </div>

                    <h3 className="text-xl font-bold mb-2 group-hover:text-amber-400 transition-colors">
                      {brand.name}
                    </h3>
                    
                   
                  </CardContent>
                </Card>
              ))}
            </div>

            {/*<div className="text-center mt-12">
              <Link href="/brands">
                <button className="bg-transparent border-2 border-amber-500 text-amber-500 px-8 py-3 rounded-lg hover:bg-amber-500 hover:text-black transition-all duration-300 font-semibold">
                  {language === "ar" ? "عرض جميع الماركات" : "Voir toutes les marques"}
                </button>
              </Link>
            </div>*/}
          </div>
        </section>

        {/* Featured Products */}
        {featuredProducts.length > 0 && (
          <section className="py-16 bg-gray-900">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <h3 className="text-3xl font-bold mb-4 text-white">
                  {"Produits en vedette"}
                </h3>
                <p className="text-gray-400 max-w-2xl mx-auto">
                  { "Notre sélection unique des meilleurs produits de sport que nos clients apprécient"}
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {featuredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} viewMode="grid" />
                ))}
              </div>
              
              <div className="text-center mt-8">
                <Link href="/products">
                  <Button size="lg" variant="outline" className="border-amber-500 text-amber-500 hover:bg-amber-500 hover:text-black font-bold">
                    {"Afficher tous les produits"}
                  </Button>
                </Link>
              </div>
            </div>
          </section>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8  mt-16 pt-16 border-t border-gray-700">
          <div className="text-center">
            <div className="w-16 h-16 bg-amber-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Phone className="h-8 w-8 text-amber-400" />
            </div>
            <h4 className="font-semibold text-white mb-2">
              { "Support technique"}
            </h4>
            <p className="text-gray-300">+966 800 123 4567</p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-amber-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="h-8 w-8 text-amber-400" />
            </div>
            <h4 className="font-semibold text-white mb-2">
              { "Email direct"}
            </h4>
            <p className="text-gray-300">sales@sportzone.sa</p>
          </div>

          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-amber-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="h-8 w-8 text-amber-400" />
            </div>
            <h4 className="font-semibold text-white mb-2">
              { "Service client"}
            </h4>
            <p className="text-gray-300">
              { "24h/24 et 7j/7"}
            </p>
          </div>
        </div>
        
      </div>
    </MainLayout>
  )
}
// import { createClient } from '@/utils/supabase/server';

// export default async function Instruments() {
//   const supabase = await createClient();
//   const { data: product } = await supabase.from("product").select();

//   return <pre>{JSON.stringify(product, null, 2)}</pre>
// }
