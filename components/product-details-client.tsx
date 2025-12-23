// components/product-details-client.tsx
"use client"

import React, { useState } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/context/cart-context";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type ProductImage = { id: number; image_url: string; position?: number };
type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  rating?: number;
  brand?: string;
  category?: string;
  product_images?: ProductImage[];
  sizes?: string[];
  colors?: string[];
  inStock?: boolean;
  discount?: number;
};

export default function ProductDetailsClient({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);
  const [loadingImage, setLoadingImage] = useState(true);

  const images = (product.product_images && product.product_images.length > 0)
    ? product.product_images
    : [{ id: 0, image_url: "/placeholder-product.png" }];

  const addToCart = () => {
    if (product.sizes && product.sizes.length > 0 && !selectedSize) {
      toast.error("Veuillez choisir une taille");
      return;
    }
    if (product.colors && product.colors.length > 0 && !selectedColor) {
      toast.error("Veuillez choisir une couleur");
      return;
    }

    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: images[0].image_url,
      brand: product.brand || '',
      quantity,
      selectedSize: selectedSize || undefined,
      selectedColor: selectedColor || undefined,
    });

    toast.success("Produit ajouté au panier");
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white py-10">
      <div className="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left: Swiper */}
        <div className="w-full">
          <div className="aspect-[4/3] bg-gray-700 rounded overflow-hidden">
            <Swiper
              modules={[Navigation, Pagination]}
              navigation
              pagination={{ clickable: true }}
              className="h-full w-full"
              onSlideChange={() => setLoadingImage(false)}
            >
              {images.map(img => (
                <SwiperSlide key={img.id} className="relative w-full h-full">
                  <Image
                    src={img.image_url}
                    alt={product.name}
                    fill
                    className={cn("object-cover", loadingImage ? "opacity-0" : "opacity-100")}
                    onLoad={() => setLoadingImage(false)}
                    onError={() => setLoadingImage(false)}
                    priority={true}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>

        {/* Right: Details */}
        <div className="w-full">
          <h1 className="text-2xl font-bold text-white mb-2">{product.name}</h1>
          <div className="flex items-center gap-3 mb-4">
            <span className="text-2xl font-bold text-amber-400">{product.price.toFixed(2)} MAD</span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-sm text-gray-400 line-through">{product.originalPrice.toFixed(2)} MAD</span>
            )}
            {product.discount && (
              <Badge variant="default" className="text-xs bg-amber-500 text-black">{product.discount}% OFF</Badge>
            )}
          </div>

          <p className="text-gray-300 mb-6">{product.description}</p>

          {/* Sizes */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="mb-4">
              <label className="block text-sm text-gray-300 mb-2">Taille</label>
              <Select value={selectedSize} onValueChange={setSelectedSize}>
                <SelectTrigger className="bg-gray-800 border-gray-600 text-white w-48">
                  <SelectValue placeholder="Choisir la taille" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700 text-white">
                  {product.sizes.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Colors */}
          {product.colors && product.colors.length > 0 && (
            <div className="mb-4">
              <label className="block text-sm text-gray-300 mb-2">Couleur</label>
              <Select value={selectedColor} onValueChange={setSelectedColor}>
                <SelectTrigger className="bg-gray-800 border-gray-600 text-white w-48">
                  <SelectValue placeholder="Choisir la couleur" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700 text-white">
                  {product.colors.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Quantity + Add to cart */}
          <div className="flex items-center gap-3 mt-6">
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</Button>
              <div className="px-4 py-2 border border-gray-700 rounded text-white">{quantity}</div>
              <Button variant="outline" onClick={() => setQuantity(q => q + 1)}>+</Button>
            </div>

            <Button onClick={addToCart} className="bg-amber-500 hover:bg-amber-600 text-black flex items-center gap-2">
              <ShoppingCart className="h-4 w-4" /> Ajouter au panier
            </Button>
          </div>

          {/* Extra info */}
          <div className="mt-6 text-sm text-gray-400">
            <div><strong>Marque:</strong> {product.brand}</div>
            <div><strong>Catégorie:</strong> {product.category}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
