// components/product-card.tsx
"use client"

import { useState, useMemo } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ShoppingCart, Star, X, Heart, Eye, Zap, CheckCircle } from "lucide-react"
import { useCart } from "@/context/cart-context"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

interface ProductCardProps {
  product: {
    id: number
    name: string
    description: string
    price: number
    originalPrice?: number
    rating: number
    reviewCount?: number
    brand: string
    category: string
    image?: string | null
    inStock: boolean
    isNew?: boolean
    isFeatured?: boolean
    discount?: number
    sizes?: string[]
    colors?: string[]
    tags?: string[]
  }
  viewMode: "grid" | "list"
  className?: string
}

export default function ProductCard({ product, viewMode, className }: ProductCardProps) {
  const { addItem } = useCart()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedSize, setSelectedSize] = useState("")
  const [selectedColor, setSelectedColor] = useState("")
  const [quantity, setQuantity] = useState(1)
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [imageLoading, setImageLoading] = useState(true)

  const finalPrice = product.price

  const handleAddToCart = () => {
    if (product.sizes && product.sizes.length > 0 && !selectedSize) {
      toast.error( "Veuillez choisir une taille")
      return
    }

    if (product.colors && product.colors.length > 0 && !selectedColor) {
      toast.error( "Veuillez choisir une couleur")
      return
    }

    const cartItem = {
      id: product.id,
      name: product.name,
      price: finalPrice,
      image: product.image || undefined,
      brand: product.brand,
      quantity: quantity,
      selectedSize: selectedSize || undefined,
      selectedColor: selectedColor || undefined
    }

    addItem(cartItem)
    toast.success( "Ajouté au panier")
    setIsDialogOpen(false)
    resetSelections()
  }

  const resetSelections = () => {
    setSelectedSize("")
    setSelectedColor("")
    setQuantity(1)
  }

  const toggleWishlist = () => {
    setIsWishlisted(!isWishlisted)
    toast.success(
      isWishlisted 
        ? ( "Retiré des favoris")
        : ( "Ajouté aux favoris")
    )
  }

  const quickAddToCart = () => {
    if (!product.sizes?.length && !product.colors?.length) {
      const cartItem = {
        id: product.id,
        name: product.name,
        price: finalPrice,
        image: product.image || undefined,
        brand: product.brand,
        quantity: 1,
        selectedSize: undefined,
        selectedColor: undefined
      }
      addItem(cartItem)
      toast.success( "Ajouté au panier")
    } else {
      setIsDialogOpen(true)
    }
  }

  const renderPrice = useMemo(() => (
    <div className="flex items-center gap-2">
      <span className="text-lg font-bold text-amber-400">
        {finalPrice.toFixed(2)} ر.س
      </span>
      {product.originalPrice && product.originalPrice > finalPrice && (
        <span className="text-sm text-gray-400 line-through">
          {product.originalPrice.toFixed(2)} ر.س
        </span>
      )}
    </div>
  ), [finalPrice, product.originalPrice])

  const renderBadges = useMemo(() => (
    <div className="absolute top-2 left-2 right-2 flex flex-wrap gap-1 z-10">
      {!product.inStock && (
        <Badge variant="secondary" className="text-xs bg-gray-600 text-gray-300">
          {"Rupture"}
        </Badge>
      )}
      {product.isNew && (
        <Badge variant="default" className="text-xs bg-blue-500 text-white">
          {"Nouveau"}
        </Badge>
      )}
      {product.isFeatured && (
        <Badge variant="default" className="text-xs bg-purple-500 text-white">
          {"Featured"}
        </Badge>
      )}
      {product.discount && product.discount > 0 && (
        <Badge variant="default" className="text-xs bg-amber-500 text-black">
          {product.discount}% {"OFF"}
        </Badge>
      )}
    </div>
  ), [product.inStock, product.isNew, product.isFeatured, product.discount])

  if (viewMode === "list") {
    return (
      <div className={cn("flex gap-4 p-4 border border-gray-700 rounded-lg hover:shadow-xl transition-all bg-gray-800 hover:bg-gray-750", className)}>
        <div className="relative w-24 h-24 bg-gray-700 rounded-lg overflow-hidden flex-shrink-0">
          {renderBadges}
          <Image
            src={product.image || "/placeholder-product.jpg"}
            alt={product.name}
            fill
            className={cn(
              "object-cover transition-opacity duration-300",
              imageLoading ? "opacity-0" : "opacity-100"
            )}
            onLoad={() => setImageLoading(false)}
            onError={() => setImageLoading(false)}
          />
          {imageLoading && (
            <div className="absolute inset-0 bg-gray-600 animate-pulse" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <Badge variant="secondary" className="mb-2 text-xs bg-amber-500/20 text-amber-300 border-amber-500/30">
              {product.brand}
            </Badge>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-gray-400 hover:text-amber-400 hover:bg-amber-500/20"
              onClick={toggleWishlist}
            >
              <Heart className={cn("h-4 w-4", isWishlisted ? "fill-amber-400 text-amber-400" : "text-gray-400")} />
            </Button>
          </div>

          <h3 className="font-semibold text-lg mb-2 text-white line-clamp-2 hover:text-amber-400 transition-colors">
            {product.name}
          </h3>
          
          <p className="text-gray-300 mb-3 line-clamp-2 text-sm">{product.description}</p>
          
          <div className="flex items-center justify-between mb-3">
            {renderPrice}
          </div>

          <div className="flex items-center gap-2">
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button 
                  disabled={!product.inStock}
                  className="bg-amber-500 hover:bg-amber-600 text-black flex-1 transition-all duration-300 hover:scale-105"
                >
                  <ShoppingCart className="h-4 w-4 ml-2" />
                  {"Ajouter au panier"}
                </Button>
              </DialogTrigger>
              <ProductDialog 
                product={product}
                selectedSize={selectedSize}
                setSelectedSize={setSelectedSize}
                selectedColor={selectedColor}
                setSelectedColor={setSelectedColor}
                quantity={quantity}
                setQuantity={setQuantity}
                onAddToCart={handleAddToCart}
                onClose={() => setIsDialogOpen(false)}
              />
            </Dialog>

            <Button 
              variant="outline" 
              size="icon" 
              className="h-10 w-10 border-gray-600 text-gray-400 hover:border-amber-400 hover:text-amber-400 hover:bg-amber-500/20"
            >
              <Eye className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={cn("border border-gray-700 rounded-lg overflow-hidden hover:shadow-2xl transition-all duration-300 bg-gray-800 group hover:bg-gray-750", className)}>
      <div className="relative aspect-square bg-gray-700 overflow-hidden">
        {renderBadges}
        
        <Image
          src={product.image || "/placeholder-product.jpg"}
          alt={product.name}
          fill
          className={cn(
            "object-cover transition-all duration-500 group-hover:scale-110",
            imageLoading ? "opacity-0" : "opacity-100"
          )}
          onLoad={() => setImageLoading(false)}
          onError={() => setImageLoading(false)}
        />
        
        {imageLoading && (
          <div className="absolute inset-0 bg-gray-600 animate-pulse" />
        )}

        {/* Quick Actions Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
          <div className="flex gap-2">
            <Button
              size="icon"
              className="h-10 w-10 bg-amber-500 text-black hover:bg-amber-600 transition-all duration-300 hover:scale-110"
              onClick={quickAddToCart}
              disabled={!product.inStock}
            >
              <ShoppingCart className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <Badge variant="secondary" className="text-xs bg-amber-500/20 text-amber-300 border-amber-500/30">
            {product.brand}
          </Badge>
          {product.inStock && (
            <div className="flex items-center text-xs text-amber-400">
              <CheckCircle className="h-3 w-3 ml-1" />
              { "En stock"}
            </div>
          )}
        </div>

        <h3 className="font-semibold text-lg mb-2 text-white line-clamp-2 hover:text-amber-400 transition-colors group-hover:text-amber-400">
          {product.name}
        </h3>
        
        <p className="text-gray-300 mb-3 line-clamp-3 text-sm">{product.description}</p>
        
        <div className="flex items-center justify-between mb-3">
          {renderPrice}
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              disabled={!product.inStock}
              className="w-full bg-amber-500 hover:bg-amber-600 text-black group-hover:scale-105 transition-all duration-300"
            >
              <ShoppingCart className="h-4 w-4 ml-2" />
              {"Ajouter au panier"}
            </Button>
          </DialogTrigger>
          <ProductDialog 
            product={product}
            selectedSize={selectedSize}
            setSelectedSize={setSelectedSize}
            selectedColor={selectedColor}
            setSelectedColor={setSelectedColor}
            quantity={quantity}
            setQuantity={setQuantity}
            onAddToCart={handleAddToCart}
            onClose={() => setIsDialogOpen(false)}
          />
        </Dialog>
      </div>
    </div>
  )
}

// مكون Dialog منفصل لتحسين الأداء
function ProductDialog({
  product,
  selectedSize,
  setSelectedSize,
  selectedColor,
  setSelectedColor,
  quantity,
  setQuantity,
  onAddToCart,
  onClose
}: any) {

  return (
    <DialogContent className="sm:max-w-md bg-gray-800 border-gray-700 text-white">
      <DialogHeader>
        <DialogTitle className="text-white">{"Choisir les spécifications"}</DialogTitle>
        <button
          onClick={onClose}
          className="absolute left-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none text-gray-400 hover:text-white"
        >
          <X className="h-4 w-4" />
        </button>
      </DialogHeader>

      <div className="space-y-4 py-4">
        {/* Size Selection */}
        {product.sizes && product.sizes.length > 0 && (
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">{ "Taille"}</label>
            <Select value={selectedSize} onValueChange={setSelectedSize}>
              <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                <SelectValue placeholder={"Choisir la taille"} />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700 text-white">
                {product.sizes.map((size: string) => (
                  <SelectItem key={size} value={size} className="hover:bg-gray-700">{size}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Color Selection */}
        {product.colors && product.colors.length > 0 && (
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">{"Couleur"}</label>
            <Select value={selectedColor} onValueChange={setSelectedColor}>
              <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                <SelectValue placeholder={ "Choisir la couleur"} />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700 text-white">
                {product.colors.map((color: string) => (
                  <SelectItem key={color} value={color} className="hover:bg-gray-700">{color}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Quantity Selection */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300">{ "Quantité"}</label>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="border-gray-600 text-white hover:bg-amber-500 hover:text-black hover:border-amber-500"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
            >
              -
            </Button>
            <span className="px-3 py-1 border border-gray-600 rounded min-w-[50px] text-center text-white">{quantity}</span>
            <Button
              variant="outline"
              size="sm"
              className="border-gray-600 text-white hover:bg-amber-500 hover:text-black hover:border-amber-500"
              onClick={() => setQuantity(quantity + 1)}
            >
              +
            </Button>
          </div>
        </div>

        <Button 
          onClick={onAddToCart} 
          className="w-full bg-amber-500 hover:bg-amber-600 text-black transition-all duration-300 hover:scale-105"
        >
          {"Confirmer l'ajout"}
        </Button>
      </div>
    </DialogContent>
  )
}