// components/header.tsx
"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  ShoppingCart, 
  Menu,
  X,
  Home,
  Package,
  Tag,
  Phone
} from "lucide-react"
import { useCart } from "@/context/cart-context"
import { cn } from "@/lib/utils"

// تعريف واجهة للروابط
interface NavLink {
  href: string
  label: string
  icon: React.ComponentType<{ className?: string }>
}

// مصفوفة ماركات الشعارات
// const brandLogos = [
//   { name: "Nike", logo: "/pub/nike1.png" },
//   { name: "ga", logo: "/pub/ga.png" },
//   { name: "Adidas", logo: "/pub/adidas1.png" },
//   { name: "Puma", logo: "/pub/puma1.png" },
//   { name: "Jordan", logo: "/pub/jordan1.png" },
//   { name: "fila", logo: "/pub/fila.png" },
//   { name: "umbro", logo: "/pub/umbro1.png" },
//   { name: "reebok", logo: "/pub/reebok1.png" },
//   { name: "ea7", logo: "/pub/ea7.png" }
// ]

export default function Header() {
  const { totalItems } = useCart()
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // مصفوفة الروابط لسهولة الإدارة
  const navLinks: NavLink[] = [
    {
      href: "/",
      label: "Accueil",
      icon: Home
    },
    {
      href: "/products",
      label: "Produits",
      icon: Package
    },
    {
      href: "/contact",
      label: "Contact",
      icon: Phone
    }
  ]

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
  }

  return (
    <>
      <header className="sticky top-0 z-50 bg-gray-900/95 backdrop-blur supports-[backdrop-filter]:bg-gray-900/80 border-b border-gray-700">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo Section */}
            <div className="flex items-center gap-4">
              {/* Logo Image */}
              <Link 
                href="/" 
                className="flex items-center gap-3 hover:opacity-80 transition-opacity"
                onClick={closeMobileMenu}
              >
                <img 
                  src="/logo.png" 
                  alt="KINGS OF KIT Logo" 
                  className="h-12 w-12 object-contain"
                  onError={(e) => {
                    // Fallback إذا لم توجد الصورة
                    e.currentTarget.style.display = 'none'
                  }}
                />
                <div className="flex flex-col">
                  <span className="text-2xl font-bold bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">
                    KINGS OF KIT
                  </span>
               
                </div>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => {
                const Icon = link.icon
                const isActive = pathname === link.href
                
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "flex items-center gap-2 text-gray-300 hover:text-amber-400 transition-all duration-300 hover:scale-105",
                      isActive && "text-amber-400 font-semibold border-b-2 border-amber-400"
                    )}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="font-medium">{link.label}</span>
                  </Link>
                )
              })}
            </nav>

            {/* Actions Section */}
            <div className="flex items-center gap-4">
              {/* Cart Button */}
              <Link href="/cart">
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="relative bg-transparent border-amber-500/40 text-amber-300 hover:bg-amber-500/20 hover:text-amber-400 hover:border-amber-500/60 transition-all duration-300 hover:scale-110"
                  onClick={closeMobileMenu}
                >
                  <ShoppingCart className="h-5 w-5" />
                  
                  {totalItems > 0 && (
                    <Badge 
                      className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 text-xs flex items-center justify-center bg-amber-500 border-amber-600 text-black font-bold"
                      variant="destructive"
                    >
                      {totalItems > 99 ? "99+" : totalItems}
                    </Badge>
                  )}
                </Button>
              </Link>

              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden bg-transparent text-amber-300 hover:bg-amber-500/20 hover:text-amber-400 transition-all duration-300"
                onClick={toggleMobileMenu}
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Brands Marquee Bar */}
{/* <div className="bg-black border-t border-amber-500/20 py-4 overflow-hidden">
  <div className="relative">
    <div className="flex animate-marquee whitespace-nowrap">
      {brandLogos.map((brand, index) => (
        <div key={`brand-${index}`} className="inline-flex items-center justify-center mx-10 w-20 h-20">
          <img 
            src={brand.logo} 
            alt={brand.name}
            className="max-h-25 max-w-25 min-h-25 min-w-25  object-contain opacity-80 hover:opacity-100 transition-opacity duration-300 grayscale hover:grayscale-0 brightness-0 invert"
            onError={(e) => {
              e.currentTarget.style.display = 'none'
            }}
          />
        </div>
      ))}
    </div>
</div>
 </div> */}

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-700 bg-gray-900/95 backdrop-blur">
            <nav className="container mx-auto px-4 py-6">
              <div className="space-y-6">
                {navLinks.map((link) => {
                  const Icon = link.icon
                  const isActive = pathname === link.href
                  
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={cn(
                        "flex items-center gap-4 text-gray-300 hover:text-amber-400 transition-all duration-300 py-3 px-4 rounded-lg hover:bg-amber-500/10",
                        isActive && "text-amber-400 font-semibold bg-amber-500/20"
                      )}
                      onClick={closeMobileMenu}
                    >
                      <Icon className="h-6 w-6" />
                      <span className="text-lg font-medium">{link.label}</span>
                    </Link>
                  )
                })}
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* Overlay for mobile menu */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/40 z-40 md:hidden backdrop-blur-sm"
          onClick={closeMobileMenu}
        />
      )}

      {/* Add custom CSS for marquee animation */}
      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>
    </>
  )
}