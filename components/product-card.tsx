"use client"

import { useState, useMemo } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogTrigger } from "@/components/ui/dialog"
import { ShoppingCart, CheckCircle } from "lucide-react"
import { useCart } from "@/context/cart-context"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

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
      {!product.inStock && (
        <Badge variant="secondary" className="text-xs bg-gray-600 text-gray-300">
          Rupture
        </Badge>
      )}
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

  // 🟢 هنا نستخدم Swiper بدل صورة واحدة
  const renderImages = () => {
  // فقط صور product_images، لا نأخذ image من جدول product
  const images = product.product_images?.length
    ? product.product_images
    : [{ id: 0, image_url: "/placeholder-product.jpg" }] // placeholder فقط

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


  return (
    <div className={cn("border border-gray-700 rounded-lg overflow-hidden hover:shadow-2xl transition-all duration-300 bg-gray-800 group hover:bg-gray-750", className)}>
      <div className="relative aspect-square bg-gray-700 overflow-hidden">
        {renderBadges}
        {renderImages()}

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
              En stock
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
            <Button className="w-full bg-amber-500 hover:bg-amber-600 text-black group-hover:scale-105 transition-all duration-300">
              <ShoppingCart className="h-4 w-4 ml-2" />
              Ajouter au panier
            </Button>
          </DialogTrigger>
          {/* ProductDialog كما كان */}
        </Dialog>
      </div>
    </div>
  )
}
