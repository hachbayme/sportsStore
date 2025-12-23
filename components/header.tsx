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
  Phone,
  MessageCircle,
  User,
  ChevronRight
} from "lucide-react"
import { useCart } from "@/context/cart-context"
import { cn } from "@/lib/utils"

// تعريف واجهة للروابط
interface NavLink {
  href: string
  label: string
  icon: React.ComponentType<{ className?: string }>
}



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
    <header className="sticky top-0 z-50 bg-gradient-to-b from-gray-900 via-gray-900/95 to-gray-900/90 backdrop-blur-2xl border-b border-white/5 shadow-2xl shadow-black/20">
      <div className="container mx-auto px-4 lg:px-8 py-2">
        <div className="flex items-center justify-between">
          
          {/* Logo Section - Elegant Design */}
          <div className="flex items-center gap-3">
            <Link 
              href="/" 
              className="group relative flex items-center gap-3 transition-all duration-500"
              onClick={closeMobileMenu}
            >
              {/* Animated Logo Container */}
              <div className="relative h-10 w-10">
                {/* Glow Effect */}
                <div className="absolute -inset-2 bg-gradient-to-r from-amber-500/20 via-amber-400/10 to-amber-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-700 opacity-0 group-hover:opacity-100"></div>
                
                {/* Logo Background */}
                <div className="relative h-full w-full rounded-xl bg-gradient-to-br from-gray-800 to-gray-900 border border-white/10 overflow-hidden group-hover:border-amber-500/30 transition-all duration-500">
                  {/* Animated Background Pattern */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(251,191,36,0.1),transparent_50%)]"></div>
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(217,119,6,0.05),transparent_50%)]"></div>
                  </div>
                  
                  {/* Logo Image with Fallback */}
                  <div className="relative h-full w-full flex items-center justify-center p-2">
                    <img 
                      src="/logo.png" 
                      alt="KINGS OF KIT Logo" 
                      className="h-full w-full object-contain filter drop-shadow-lg group-hover:drop-shadow-2xl transition-all duration-500 group-hover:scale-105"
                      loading="eager"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.nextElementSibling?.classList.remove('hidden');
                      }}
                    />
                    {/* Fallback Logo */}
                    <div className="hidden absolute inset-0 flex items-center justify-center">
                      <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg">
                        <span className="text-gray-900 font-black text-xl tracking-tighter">KK</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Corner Accents */}
                  <div className="absolute top-0 left-0 h-3 w-3 border-t border-l border-amber-500/30 rounded-tl-lg"></div>
                  <div className="absolute top-0 right-0 h-3 w-3 border-t border-r border-amber-500/30 rounded-tr-lg"></div>
                  <div className="absolute bottom-0 left-0 h-3 w-3 border-b border-l border-amber-500/30 rounded-bl-lg"></div>
                  <div className="absolute bottom-0 right-0 h-3 w-3 border-b border-r border-amber-500/30 rounded-br-lg"></div>
                </div>
              </div>
              
              {/* Text Logo */}
              <div className="flex flex-col items-start">
                <span className="text-xl font-black tracking-tighter bg-gradient-to-r from-amber-200 via-amber-300 to-amber-400 bg-clip-text text-transparent">
                  KINGS OF KIT
                </span>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs font-medium text-gray-400 tracking-widest">PREMIUM QUALITE</span>
                  <div className="h-0.5 w-0.5 rounded-full bg-amber-500/50"></div>
                </div>
              </div>
              
              {/* Underline Animation */}
              <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-amber-500/50 to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
            </Link>
          </div>

          {/* Desktop Navigation - Minimalist Design */}
          <nav className="hidden lg:flex items-center gap-0">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "group relative flex flex-col items-center px-6 py-3 transition-all duration-500",
                    "text-gray-400 hover:text-amber-300"
                  )}
                >
                  {/* Icon Container */}
                  <div className={cn(
                    "relative mb-2 transition-all duration-500",
                    isActive ? "text-amber-400" : "text-gray-500 group-hover:text-amber-300"
                  )}>
                    <Icon className="h-5 w-5 transition-transform duration-500 group-hover:scale-110" />
                    
                    {/* Active Dot */}
                    {isActive && (
                      <div className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 shadow-sm"></div>
                    )}
                  </div>
                  
                  {/* Label */}
                  <span className={cn(
                    "text-xs font-medium tracking-widest transition-all duration-500",
                    isActive ? "text-amber-400" : "text-gray-500 group-hover:text-amber-300"
                  )}>
                    {link.label}
                  </span>
                  
                  {/* Background Hover Effect */}
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-b from-transparent to-gray-800/0 group-hover:to-amber-500/5 transition-all duration-500 opacity-0 group-hover:opacity-100"></div>
                  
                  {/* Active Line */}
                  {isActive && (
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-gradient-to-r from-amber-400 to-amber-600 rounded-full"></div>
                  )}
                  
                  {/* Hover Line */}
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-amber-500/50 to-amber-500/30 rounded-full group-hover:w-6 transition-all duration-500"></div>
                </Link>
              );
            })}
          </nav>

          {/* Actions Section - Premium Design */}
          <div className="flex items-center gap-3">
            {/* Cart Button */}
            <Link href="/cart" className="relative">
              <Button
                size="icon"
                className={cn(
                  "group relative h-10 w-10 rounded-xl",
                  "bg-gradient-to-br from-gray-800 to-gray-900",
                  "border border-white/10 hover:border-amber-500/30",
                  "shadow-lg hover:shadow-xl hover:shadow-amber-500/10",
                  "transition-all duration-500 hover:scale-105 active:scale-95"
                )}
                onClick={closeMobileMenu}
              >
                {/* Animated Background */}
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-amber-500/0 via-amber-500/0 to-amber-500/0 group-hover:from-amber-500/10 group-hover:via-amber-500/5 group-hover:to-amber-500/0 transition-all duration-500"></div>
                
                {/* Icon */}
                <ShoppingCart className="h-5 w-5 text-gray-400 group-hover:text-amber-300 transition-colors duration-500 relative z-10" />
                
                {/* Cart Badge */}
                {totalItems > 0 && (
                  <div className="absolute -top-2 -right-2 z-20">
                    <div className={cn(
                      "relative h-7 w-7 rounded-full flex items-center justify-center",
                      "bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600",
                      "shadow-lg shadow-amber-500/30",
                      "animate-pulse-subtle"
                    )}>
                      <span className="text-xs font-black text-gray-900">
                        {totalItems > 99 ? "99+" : totalItems}
                      </span>
                      
                      {/* Inner Glow */}
                      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/20 to-transparent mix-blend-overlay"></div>
                    </div>
                  </div>
                )}
                
                {/* Corner Accents */}
                <div className="absolute top-0 left-0 h-2 w-2 border-t border-l border-amber-500/0 group-hover:border-amber-500/30 rounded-tl-lg transition-all duration-500"></div>
                <div className="absolute top-0 right-0 h-2 w-2 border-t border-r border-amber-500/0 group-hover:border-amber-500/30 rounded-tr-lg transition-all duration-500"></div>
              </Button>
            </Link>



            {/* Mobile Menu Button - Premium Design */}
            <Button
              size="icon"
              className={cn(
                "lg:hidden group relative h-10 w-10 rounded-xl",
                "bg-gradient-to-br from-gray-800 to-gray-900",
                "border border-white/10 hover:border-amber-500/30",
                "shadow-lg hover:shadow-xl hover:shadow-amber-500/10",
                "transition-all duration-500 active:scale-95"
              )}
              onClick={toggleMobileMenu}
              aria-label="Toggle menu"
            >
              <div className="relative h-5 w-5">
                {isMobileMenuOpen ? (
                  <X className="h-5 w-5 text-amber-400 animate-spin-in" />
                ) : (
                  <Menu className="h-5 w-5 text-gray-400 group-hover:text-amber-300 transition-colors duration-500" />
                )}
              </div>
              
              {/* Corner Accents */}
              <div className="absolute top-0 left-0 h-2 w-2 border-t border-l border-amber-500/0 group-hover:border-amber-500/30 rounded-tl-lg transition-all duration-500"></div>
              <div className="absolute top-0 right-0 h-2 w-2 border-t border-r border-amber-500/0 group-hover:border-amber-500/30 rounded-tr-lg transition-all duration-500"></div>
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation - Premium Drawer */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-x-0 top-20 z-40 animate-slideDown">
          <div className="container mx-auto px-4">
            <div className="rounded-2xl bg-gradient-to-b from-gray-800/95 to-gray-900/95 backdrop-blur-3xl border border-white/10 shadow-2xl shadow-black/30 overflow-hidden">
              {/* Header */}
              <div className="p-6 border-b border-white/5">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-400 tracking-widest">NAVIGATION</span>
                  <div className="h-6 w-6 rounded-full bg-gradient-to-br from-amber-500/10 to-amber-500/5 flex items-center justify-center">
                    <div className="h-2 w-2 rounded-full bg-gradient-to-br from-amber-400 to-amber-600"></div>
                  </div>
                </div>
              </div>
              
              {/* Menu Items */}
              <nav className="p-4">
                <div className="space-y-2">
                  {navLinks.map((link) => {
                    const Icon = link.icon;
                    const isActive = pathname === link.href;
                    
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        className={cn(
                          "group relative flex items-center gap-4 p-4 rounded-xl",
                          "transition-all duration-500 active:scale-[0.98]",
                          "bg-gradient-to-r from-gray-800/50 to-gray-800/30",
                          "hover:from-amber-500/10 hover:to-amber-500/5",
                          isActive && "from-amber-500/20 to-amber-600/10"
                        )}
                        onClick={closeMobileMenu}
                      >
                        {/* Icon Container */}
                        <div className={cn(
                          "relative h-10 w-10 rounded-lg flex items-center justify-center",
                          "bg-gradient-to-br from-gray-700 to-gray-800",
                          "group-hover:from-amber-500/20 group-hover:to-amber-600/10",
                          "transition-all duration-500",
                          isActive && "from-amber-500/30 to-amber-600/20"
                        )}>
                          <Icon className={cn(
                            "h-5 w-5 transition-all duration-500",
                            isActive ? "text-amber-400" : "text-gray-400 group-hover:text-amber-300"
                          )} />
                          
                          {/* Active Indicator */}
                          {isActive && (
                            <div className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 shadow-sm"></div>
                          )}
                        </div>
                        
                        {/* Text */}
                        <div className="flex-1">
                          <span className={cn(
                            "block text-base font-medium transition-colors duration-500",
                            isActive ? "text-amber-400" : "text-gray-300 group-hover:text-amber-300"
                          )}>
                            {link.label}
                          </span>
                          <span className="text-xs text-gray-500 mt-0.5">
                            Navigate to {link.label.toLowerCase()}
                          </span>
                        </div>
                        
                        {/* Arrow */}
                        <ChevronRight className={cn(
                          "h-5 w-5 ml-auto transition-all duration-500",
                          isActive ? "text-amber-400" : "text-gray-600 opacity-0 group-hover:opacity-100 group-hover:translate-x-1"
                        )} />
                      </Link>
                    );
                  })}
                </div>
                
                {/* Cart Section */}
                <div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-gray-800/50 to-gray-800/30 border border-white/5">
                  <Link
                    href="/cart"
                    className="flex items-center justify-between group"
                    onClick={closeMobileMenu}
                  >
                    <div className="flex items-center gap-4">
                      <div className="relative h-10 w-10 rounded-lg bg-gradient-to-br from-gray-700 to-gray-800 group-hover:from-amber-500/20 group-hover:to-amber-600/10 flex items-center justify-center transition-all duration-500">
                        <ShoppingCart className="h-5 w-5 text-gray-400 group-hover:text-amber-300 transition-colors duration-500" />
                        
                        {totalItems > 0 && (
                          <div className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center">
                            <span className="text-[10px] font-bold text-gray-900">{Math.min(totalItems, 9)}</span>
                          </div>
                        )}
                      </div>
                      
                      <div>
                        <span className="block text-base font-medium text-gray-300 group-hover:text-amber-300 transition-colors duration-500">
                          Shopping Cart
                        </span>
                        <span className="text-xs text-gray-500">
                          {totalItems > 0 ? `${totalItems} premium items` : 'Your cart is empty'}
                        </span>
                      </div>
                    </div>
                    
                    {totalItems > 0 && (
                      <Badge className="bg-gradient-to-br from-amber-400 to-amber-600 text-gray-900 font-black shadow-lg shadow-amber-500/20">
                        {totalItems > 99 ? "99+" : totalItems}
                      </Badge>
                    )}
                  </Link>
                </div>
              </nav>
              
              {/* Footer */}
              <div className="p-6 border-t border-white/5">
                <div className="text-center">
                  <span className="text-xs text-gray-500 tracking-widest">© 2026 KINGS OF KIT</span>
                  <div className="flex items-center justify-center gap-3 mt-2">
                    <div className="h-0.5 w-6 bg-gradient-to-r from-transparent via-amber-500/30 to-transparent"></div>
                    <span className="text-xs text-gray-400">PREMIUM COLLECTIONS</span>
                    <div className="h-0.5 w-6 bg-gradient-to-r from-transparent via-amber-500/30 to-transparent"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>

    {/* Overlay for mobile menu */}
    {isMobileMenuOpen && (
      <div 
        className="fixed inset-0 z-30 bg-gradient-to-b from-black/80 via-black/60 to-black/40 backdrop-blur-sm animate-fadeIn"
        onClick={closeMobileMenu}
      />
    )}

    {/* Custom Animations */}
    <style jsx>{`
      @keyframes slideDown {
        from {
          opacity: 0;
          transform: translateY(-20px) scale(0.95);
        }
        to {
          opacity: 1;
          transform: translateY(0) scale(1);
        }
      }
      
      @keyframes fadeIn {
        from {
          opacity: 0;
        }
        to {
          opacity: 1;
        }
      }
      
      @keyframes spinIn {
        from {
          opacity: 0;
          transform: rotate(-90deg) scale(0.5);
        }
        to {
          opacity: 1;
          transform: rotate(0) scale(1);
        }
      }
      
      @keyframes pulse-subtle {
        0%, 100% {
          transform: scale(1);
          box-shadow: 0 0 20px rgba(251, 191, 36, 0.3);
        }
        50% {
          transform: scale(1.05);
          box-shadow: 0 0 30px rgba(251, 191, 36, 0.5);
        }
      }
      
      .animate-slideDown {
        animation: slideDown 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      }
      
      .animate-fadeIn {
        animation: fadeIn 0.3s ease-out;
      }
      
      .animate-spin-in {
        animation: spinIn 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      }
      
      .animate-pulse-subtle {
        animation: pulse-subtle 2s ease-in-out infinite;
      }
      
      /* Smooth scroll for the entire app */
      html {
        scroll-behavior: smooth;
        scroll-padding-top: 5rem;
      }
      
      /* Selection color */
      ::selection {
        background: rgba(251, 191, 36, 0.3);
        color: #ffffff;
      }
    `}</style>
  </>
);
}