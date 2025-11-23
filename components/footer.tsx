// components/footer.tsx
"use client"

import { useState } from "react"
import Link from "next/link"
import {  
  Shield,
  Truck,
  ArrowRight,
  Lock,
  User
} from "lucide-react"

export default function Footer() {
  const [showAdminHint, setShowAdminHint] = useState(false)
  
  // زر الدخول إلى الإدمن - يحتاج إلى 5 نقرات متتالية
  const handleAdminAccess = () => {
    setShowAdminHint(true)
    setTimeout(() => setShowAdminHint(false), 3000)
  }



  return (
    <footer className="bg-gray-900 text-white relative border-t border-gray-800">
      {/* زر الدخول السري للإدمن (مخفي) */}
      <div 
        className="absolute top-4 right-4 w-2 h-2 bg-gray-600 rounded-full cursor-pointer"
        onClick={handleAdminAccess}
        title="Admin Access"
      />
      
      {showAdminHint && (
        <div className="absolute top-12 right-4 bg-amber-500 text-black px-4 py-2 rounded-lg text-sm font-semibold z-50">
          <Link href="/admin" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            { "Accès Admin"}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      )}


      {/* حقوق النشر */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm">
              © 2024 SportZone. { "Tous droits réservés"}
            </p>
            
            <div className="flex items-center gap-6">
              
              <div className="flex items-center gap-2 text-gray-400 text-sm">
                <Shield className="h-4 w-4 text-amber-400" />
                <span>{"Privacy protected"}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400 text-sm">
                <Truck className="h-4 w-4 text-amber-400" />
                <span>{ "Livraison rapide"}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}