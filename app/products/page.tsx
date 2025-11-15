// components/products-page.tsx
"use client"

import { useState, useEffect, useMemo } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import ProductCard from "@/components/product-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Search, Filter, X, Grid, List, ChevronDown, ChevronUp } from "lucide-react"
import type { Product } from "@/types/product"
import { cn } from "@/lib/utils"
import MainLayout from "@/components/main-layout"

interface FilterState {
  category: string[]
  brand: string[]
  priceRange: [number, number]
  inStock: boolean
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [showFilters, setShowFilters] = useState(false)
  const searchParams = useSearchParams()
  const router = useRouter()

  // État initial des filtres
  const [filters, setFilters] = useState<FilterState>({
    category: [],
    brand: [],
    priceRange: [0, 1000],
    inStock: false
  })

  // Extraire les filtres de l'URL
  useEffect(() => {
    const category = searchParams.get('category')?.split(',') || []
    const brand = searchParams.get('brand')?.split(',') || []
    const priceRange = searchParams.get('priceRange')?.split('-').map(Number) as [number, number] || [0, 1000]
    const inStock = searchParams.get('inStock') === 'true'

    setFilters({
      category,
      brand,
      priceRange,
      inStock
    })
  }, [searchParams])

  // Charger les produits
  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
  try {
    setLoading(true)
    const response = await fetch("/api/products")
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
    const data = await response.json()
    
    // التصحيح هنا: البيانات قد تكون مصفوفة أو كائن يحتوي على products
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

  // Extraire les valeurs uniques pour les filtres
const uniqueCategories = useMemo(() => {
  if (!Array.isArray(products)) return []
  return Array.from(new Set(products.map(p => p.category)))
}, [products])

const uniqueBrands = useMemo(() => {
  if (!Array.isArray(products)) return []
  return Array.from(new Set(products.map(p => p.brand)))
}, [products])

const maxPrice = useMemo(() => {
  if (!Array.isArray(products)) return 1000
  const prices = products.map(p => p.price)
  return Math.max(...prices, 1000)
}, [products])
  // Appliquer les filtres
  // Appliquer les filtres
const filteredProducts = useMemo(() => {
  if (!Array.isArray(products)) return []
  
  return products.filter(product => {
    // Filtre catégorie
    if (filters.category.length > 0 && !filters.category.includes(product.category)) {
      return false
    }

    // Filtre marque
    if (filters.brand.length > 0 && !filters.brand.includes(product.brand)) {
      return false
    }

    // Filtre prix
    if (product.price < filters.priceRange[0] || product.price > filters.priceRange[1]) {
      return false
    }

    // Filtre disponibilité
    if (filters.inStock && !product.inStock) {
      return false
    }

    return true
  })
}, [products, filters])

  // Mettre à jour l'URL avec les filtres
  const updateURL = (newFilters: FilterState) => {
    const params = new URLSearchParams()
    
    if (newFilters.category.length > 0) {
      params.set('category', newFilters.category.join(','))
    }
    
    if (newFilters.brand.length > 0) {
      params.set('brand', newFilters.brand.join(','))
    }
    
    if (newFilters.priceRange[0] > 0 || newFilters.priceRange[1] < maxPrice) {
      params.set('priceRange', newFilters.priceRange.join('-'))
    }
    
    if (newFilters.inStock) {
      params.set('inStock', 'true')
    }

    router.push(`/products?${params.toString()}`, { scroll: false })
  }

  const handleFilterChange = (key: keyof FilterState, value: any) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    updateURL(newFilters)
  }

  const clearFilters = () => {
    const resetFilters: FilterState = {
      category: [],
      brand: [],
      priceRange: [0, maxPrice],
      inStock: false
    }
    setFilters(resetFilters)
    router.push('/products', { scroll: false })
  }

  const hasActiveFilters = filters.category.length > 0 || 
    filters.brand.length > 0 || 
    filters.priceRange[0] > 0 || 
    filters.priceRange[1] < maxPrice || 
    filters.inStock

  if (loading) {
    return (
      <MainLayout>
        <div className="min-h-screen bg-gray-900 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto mb-4"></div>
            <p className="text-gray-400">
              Chargement des produits...
            </p>
          </div>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="min-h-screen bg-gray-900">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-gray-900 via-black to-gray-900 py-12">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl font-bold text-center text-white mb-4">
              Nos Produits
            </h1>
            <p className="text-lg text-center text-gray-300 max-w-2xl mx-auto">
              Découvrez notre large gamme de produits sportifs de haute qualité
            </p>
          </div>
        </div>

        {/* Filters Bar - Horizontal */}
        <div className="sticky top-16 z-40 bg-gray-800 border-b border-gray-700 shadow-xl">
          <div className="container mx-auto px-4 py-4">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
              {/* Results Count */}
              <div className="flex items-center gap-4">
                <Badge variant="secondary" className="text-sm bg-amber-500/20 text-amber-300 border-amber-500/30">
                  {filteredProducts.length} produits
                </Badge>
                
                {/* View Toggle */}
                <div className="flex items-center gap-1">
                  <Button
                    variant={viewMode === "grid" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setViewMode("grid")}
                    className="h-8 w-8 p-0 bg-gray-700 border-gray-600 text-gray-300 hover:bg-amber-500 hover:text-black"
                  >
                    <Grid className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setViewMode("list")}
                    className="h-8 w-8 p-0 bg-gray-700 border-gray-600 text-gray-300 hover:bg-amber-500 hover:text-black"
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Main Filters Row */}
              <div className="flex flex-wrap items-center gap-4">
                {/* Category Filter */}
                <Select
                  value={filters.category[0] || "all"}
                  onValueChange={(value) => handleFilterChange('category', value === "all" ? [] : [value])}
                >
                  <SelectTrigger className="w-40 bg-gray-700 border-gray-600 text-white">
                    <SelectValue placeholder="Catégorie" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700 text-white">
                    <SelectItem value="all" className="hover:bg-gray-700">
                      Toutes les catégories
                    </SelectItem>
                    {uniqueCategories.map(category => (
                      <SelectItem key={category} value={category} className="hover:bg-gray-700">
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Brand Filter */}
                <Select
                  value={filters.brand[0] || "all"}
                  onValueChange={(value) => handleFilterChange('brand', value === "all" ? [] : [value])}
                >
                  <SelectTrigger className="w-40 bg-gray-700 border-gray-600 text-white">
                    <SelectValue placeholder="Marque" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700 text-white">
                    <SelectItem value="all" className="hover:bg-gray-700">
                      Toutes les marques
                    </SelectItem>
                    {uniqueBrands.map(brand => (
                      <SelectItem key={brand} value={brand} className="hover:bg-gray-700">
                        {brand}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* In Stock Filter */}
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="inStock"
                    checked={filters.inStock}
                    onCheckedChange={(checked) => handleFilterChange('inStock', checked === true)}
                    className="border-gray-600 data-[state=checked]:bg-amber-500 data-[state=checked]:border-amber-500"
                  />
                  <Label htmlFor="inStock" className="text-sm cursor-pointer text-gray-300">
                    En stock
                  </Label>
                </div>

                {/* Toggle Advanced Filters */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-2 bg-gray-700 border-gray-600 text-gray-300 hover:bg-amber-500 hover:text-black hover:border-amber-500"
                >
                  <Filter className="h-4 w-4" />
                  Plus de filtres
                  {showFilters ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </Button>

                {/* Clear Filters */}
                {hasActiveFilters && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearFilters}
                    className="text-red-400 hover:text-red-300 hover:bg-red-500/20"
                  >
                    <X className="h-4 w-4 ml-2" />
                    Effacer tout
                  </Button>
                )}
              </div>
            </div>

            {/* Advanced Filters (Collapsible) */}
            {showFilters && (
              <div className="mt-4 pt-4 border-t border-gray-700">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {/* Price Slider */}
                  <div className="space-y-3">
                    <Label className="text-gray-300">Fourchette de prix</Label>
                    <Slider
                      value={filters.priceRange}
                      min={0}
                      max={maxPrice}
                      step={10}
                      onValueChange={(value) => handleFilterChange('priceRange', value as [number, number])}
                      className="mt-2"
                    />
                    <div className="flex justify-between text-sm text-gray-400">
                      <span>0 ر.س</span>
                      <span>{maxPrice} ر.س</span>
                    </div>
                  </div>

                  {/* Multiple Categories */}
                  <div className="space-y-3">
                    <Label className="text-gray-300">Catégories</Label>
                    <div className="space-y-2 max-h-32 overflow-y-auto">
                      {uniqueCategories.map(category => (
                        <div key={category} className="flex items-center gap-2">
                          <Checkbox
                            id={`cat-${category}`}
                            checked={filters.category.includes(category)}
                            onCheckedChange={(checked) => {
                              const newCategories = checked
                                ? [...filters.category, category]
                                : filters.category.filter(c => c !== category)
                              handleFilterChange('category', newCategories)
                            }}
                            className="border-gray-600 data-[state=checked]:bg-amber-500 data-[state=checked]:border-amber-500"
                          />
                          <Label htmlFor={`cat-${category}`} className="text-sm cursor-pointer text-gray-300">
                            {category}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Multiple Brands */}
                  <div className="space-y-3">
                    <Label className="text-gray-300">Marques</Label>
                    <div className="space-y-2 max-h-32 overflow-y-auto">
                      {uniqueBrands.map(brand => (
                        <div key={brand} className="flex items-center gap-2">
                          <Checkbox
                            id={`brand-${brand}`}
                            checked={filters.brand.includes(brand)}
                            onCheckedChange={(checked) => {
                              const newBrands = checked
                                ? [...filters.brand, brand]
                                : filters.brand.filter(b => b !== brand)
                              handleFilterChange('brand', newBrands)
                            }}
                            className="border-gray-600 data-[state=checked]:bg-amber-500 data-[state=checked]:border-amber-500"
                          />
                          <Label htmlFor={`brand-${brand}`} className="text-sm cursor-pointer text-gray-300">
                            {brand}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Products Grid */}
        <div className="container mx-auto px-4 py-8">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">😢</div>
              <h3 className="text-2xl font-semibold text-gray-400 mb-4">
                Aucun produit trouvé
              </h3>
              <p className="text-gray-500 mb-8">
                Essayez d'ajuster vos filtres pour trouver ce que vous cherchez
              </p>
              <Button 
                onClick={clearFilters} 
                className="bg-amber-500 hover:bg-amber-600 text-black transition-all duration-300 hover:scale-105"
              >
                Voir tous les produits
              </Button>
            </div>
          ) : (
            <div className={cn(
              "grid gap-6",
              viewMode === "grid" 
                ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                : "grid-cols-1"
            )}>
              {filteredProducts.map((product) => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  viewMode={viewMode} 
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  )
}