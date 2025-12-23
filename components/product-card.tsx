"use client"

import { useState, useMemo } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart,X,Heart, CheckCircle, Eye } from "lucide-react"
import { useCart } from "@/context/cart-context"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"



// Swiper imports
import { Swiper, SwiperSlide } from "swiper/react"
import "swiper/css"
import "swiper/css/navigation"
import "swiper/css/pagination"
import { Navigation, Pagination } from "swiper/modules"

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
    product_images?: { id: number; image_url: string }[]
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
      toast.error("Veuillez choisir une taille")
      return
    }

    if (product.colors && product.colors.length > 0 && !selectedColor) {
      toast.error("Veuillez choisir une couleur")
      return
    }

    const cartItem = {
      id: product.id,
      name: product.name,
      price: finalPrice,
      image: product.product_images?.[0]?.image_url || product.image || undefined,
      brand: product.brand,
      quantity: quantity,
      selectedSize: selectedSize || undefined,
      selectedColor: selectedColor || undefined
    }

    addItem(cartItem)
    toast.success("Ajouté au panier")
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
        ? "Retiré des favoris"
        : "Ajouté aux favoris"
    )
  }

  const quickAddToCart = () => {
    if (!product.sizes?.length && !product.colors?.length) {
      const cartItem = {
        id: product.id,
        name: product.name,
        price: finalPrice,
        image: product.product_images?.[0]?.image_url || product.image || undefined,
        brand: product.brand,
        quantity: 1,
        selectedSize: undefined,
        selectedColor: undefined
      }
      addItem(cartItem)
      toast.success("Ajouté au panier")
    } else {
      setIsDialogOpen(true)
    }
  }

  const renderPrice = useMemo(() => (
    <div className="flex items-center gap-2">
      <span className="text-lg font-bold text-amber-400">
        {finalPrice.toFixed(2)} MAD
      </span>
      {product.originalPrice && product.originalPrice > finalPrice && (
        <span className="text-sm text-gray-400 line-through">
          {product.originalPrice.toFixed(2)} MAD
        </span>
      )}
    </div>
  ), [finalPrice, product.originalPrice])

  const renderBadges = useMemo(() => (
    <div className="absolute top-2 left-2 right-2 flex flex-wrap gap-1 z-10">
      {/* {!product.inStock && (
        <Badge variant="secondary" className="text-xs bg-gray-600 text-gray-300">
          Rupture
        </Badge>
      )} */}
      {product.isNew && (
        <Badge variant="default" className="text-xs bg-blue-500 text-white">
          Nouveau
        </Badge>
      )}
      {product.isFeatured && (
        <Badge variant="default" className="text-xs bg-purple-500 text-white">
          Featured
        </Badge>
      )}
      {product.discount && product.discount > 0 && (
        <Badge variant="default" className="text-xs bg-amber-500 text-black">
          {product.discount}% OFF
        </Badge>
      )}
    </div>
  ), [product.inStock, product.isNew, product.isFeatured, product.discount])

  const renderImages = () => {
    const images = product.product_images?.length
      ? product.product_images
      : [{ id: 0, image_url: "placeholder-product.png" }]

    return (
      <Swiper
        modules={[Navigation, Pagination]}
        navigation
        pagination={{ clickable: true }}
        className="w-full h-full"
        onSlideChange={() => setImageLoading(false)}
      >
        {images.map((img) => (
          <SwiperSlide key={img.id} className="relative w-full h-full">
            <Image
              src={img.image_url}
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
          </SwiperSlide>
        ))}
      </Swiper>
    )
  }

  // تصميم مختلف حسب viewMode
  if (viewMode === "list") {
    return (
      <div className={cn(
        "flex flex-col md:flex-row border border-gray-700 rounded-lg overflow-hidden bg-gray-800 hover:bg-gray-750 transition-all duration-300 group",
        className
      )}>
        {/* الصورة في وضع list */}
        <div className="relative md:w-1/3 aspect-square md:aspect-auto bg-gray-700 overflow-hidden">
          {renderBadges}
          <Link href={`/products/${product.id}`} className="block h-full">
            <div className="relative w-full h-full">
              {renderImages()}
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                <Eye className="h-8 w-8 text-white" />
              </div>
            </div>
          </Link>
        </div>

        {/* المحتوى في وضع list */}
        <div className="flex-1 p-6 flex flex-col">
          <div className="flex items-start justify-between mb-3">
            <Badge variant="secondary" className="text-xs bg-amber-500/20 text-amber-300 border-amber-500/30">
              {product.brand}
            </Badge>
            {product.inStock && (
              <div className="flex items-center text-xs text-amber-400">
                <CheckCircle className="h-3 w-3 ml-1" />
                En stock
              </div>
            )}
          </div>

          <h3 className="font-semibold text-xl mb-2 text-white hover:text-amber-400 transition-colors">
            <Link href={`/products/${product.id}`}>
              {product.name}
            </Link>
          </h3>
          
          <p className="text-gray-300 mb-4 line-clamp-2 text-base">
            {/* {product.description} */}
          </p>

          <div className="flex items-center justify-between mb-4">
            {renderPrice}
          </div>

          <div className="flex gap-3 mt-auto">
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="flex-1 bg-amber-500 hover:bg-amber-600 text-black">
                  <ShoppingCart className="h-4 w-4 ml-2" />
                  Ajouter au panier
                </Button>
              </DialogTrigger>
              {/* ProductDialog كما كان */}
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
            
            <Link href={`/products/${product.id}`} className="flex-1">
              <Button 
                variant="outline" 
                className="w-full bg-gray-700 hover:bg-gray-600 text-white border-gray-600 hover:border-gray-500 flex items-center justify-center gap-2"
              >
                <Eye className="h-4 w-4" />
                Voir détails
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // تصميم grid (الوضع الافتراضي)
  return (
    <div className={cn("border border-gray-700 rounded-lg overflow-hidden hover:shadow-2xl transition-all duration-300 bg-gray-800 group hover:bg-gray-750", className)}>
      <div className="relative aspect-square bg-gray-700 overflow-hidden">
        {renderBadges}
        <Link href={`/products/${product.id}`} className="block h-full">
          <div className="relative w-full h-full">
            {renderImages()}
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
              <Eye className="h-8 w-8 text-white" />
            </div>
          </div>
        </Link>
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <Badge variant="secondary" className="text-xs bg-amber-500/20 text-amber-300 border-amber-500/30">
            {product.brand}
          </Badge>
          {product.inStock && (
            <div className="flex items-center text-xs text-amber-400">
              <CheckCircle className="h-3 w-3 ml-1" />
              En stock
            </div>
          )}
        </div>

        <h3 className="font-semibold text-lg mb-2 text-white h-15 line-clamp-2 hover:text-amber-400 transition-colors">
          <Link href={`/products/${product.id}`}>
            {product.name}
          </Link>
        </h3>
        {/* <p className="text-gray-300 mb-3 line-clamp-3 text-sm">{product.description}</p> */}

        <div className="flex items-center justify-between mb-3">
          {renderPrice}
        </div>

        <div className="flex gap-2">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex-1 bg-amber-500 hover:bg-amber-600 text-black group-hover:scale-105 transition-all duration-300">
                <ShoppingCart className="h-4 w-4 ml-2" />
                Ajouter
              </Button>
            </DialogTrigger>
            {/* ProductDialog كما كان */}
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
          
          <Link href={`/products/${product.id}`} className="flex-1">
            <Button 
              variant="outline" 
              className="w-full bg-gray-700 hover:bg-gray-600 text-white border-gray-600 hover:border-gray-500 flex items-center justify-center gap-2"
            >
              <Eye className="h-4 w-4" />
              Détails
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

function ProductDialog({ product, selectedSize, setSelectedSize, selectedColor, setSelectedColor, quantity, setQuantity, onAddToCart, onClose }: any) {
  return (
    <DialogContent className="sm:max-w-md bg-gray-800 border-gray-700 text-white">
      <DialogHeader>
        <DialogTitle className="text-white">Choisir les spécifications</DialogTitle>
        <button onClick={onClose} className="absolute left-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none text-gray-400 hover:text-white">
          <X className="h-4 w-4"/>
        </button>
      </DialogHeader>

      <div className="space-y-4 py-4">
        {product.sizes && product.sizes.length > 0 && (
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Taille</label>
            <Select value={selectedSize} onValueChange={setSelectedSize}>
              <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                <SelectValue placeholder="Choisir la taille"/>
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700 text-white">
                {product.sizes.map((size: string) => (
                  <SelectItem key={size} value={size} className="hover:bg-gray-700">{size}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {product.colors && product.colors.length > 0 && (
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Couleur</label>
            <Select value={selectedColor} onValueChange={setSelectedColor}>
              <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                <SelectValue placeholder="Choisir la couleur"/>
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700 text-white">
                {product.colors.map((color: string) => (
                  <SelectItem key={color} value={color} className="hover:bg-gray-700">{color}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300">Quantité</label>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="border-gray-600 text-white hover:bg-amber-500 hover:text-black hover:border-amber-500" onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</Button>
            <span className="px-3 py-1 border border-gray-600 rounded min-w-[50px] text-center text-white">{quantity}</span>
            <Button variant="outline" size="sm" className="border-gray-600 text-white hover:bg-amber-500 hover:text-black hover:border-amber-500" onClick={() => setQuantity(quantity + 1)}>+</Button>
          </div>
        </div>

        <Button onClick={onAddToCart} className="w-full bg-amber-500 hover:bg-amber-600 text-black transition-all duration-300 hover:scale-105">Confirmer l'ajout</Button>
      </div>
    </DialogContent>
  )
}
