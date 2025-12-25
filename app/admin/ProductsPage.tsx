"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Package, Plus, Edit, Trash2, Image as ImageIcon, XCircle, Box, DollarSign, TrendingUp, Upload } from "lucide-react"
import { toast } from "sonner"
import { supabase } from "@/lib/supabaseClient"
import {uploadImage} from "@/lib/uploadImage";
// استيراد React components
import { Swiper, SwiperSlide } from "swiper/react";

// استيراد Navigation من 'swiper' مباشرة
import { Navigation } from 'swiper/modules';

// ثم إضافتها إلى المصفوفة
// استيراد CSS
import "swiper/css";
import "swiper/css/navigation";


interface ProductImage {
  id: number;
  product_id: number; 
  image_url: string;
  position: number;
}



interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  rating: number;
  brand: string;
  category: string;

  // بدل image واحدة → مصفوفة من الصور
  product_images: ProductImage[];

  instock: boolean;
  sizes: string[];
  colors: string[];
  createdat: string;
  images?: ProductImage[];
}

interface ProductWithImages extends Product {
  images: ProductImage[];
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [productSearchTerm, setProductSearchTerm] = useState("")
  const [activeCategory, setActiveCategory] = useState<string>("all")
  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [uploadingImage, setUploadingImage] = useState(false)

  // Formulaire produit
const [productForm, setProductForm] = useState({
  name: "",
  description: "",
  price: 0,
  brand: "",
  category: "",
  instock: true,
  sizes: [] as string[],
  colors: [] as string[],
  newSize: "",
  newColor: "",

  // الملفات الجديدة التي سيتم رفعها
  imagesFiles: [] as File[],

  // الصور الموجودة مسبقاً في DB عند التعديل
  existingImages: [] as { id: number; image_url: string; position: number }[],
  newImageUrl: ""
})


  useEffect(() => {
    fetchProducts()
  }, [])

  useEffect(() => {
    filterProducts()
  }, [products, productSearchTerm, activeCategory])



const fetchProducts = async () => {
  setLoading(true);
  try {
    // جلب المنتجات
    const { data: productsData, error: productError } = await supabase
      .from("product")
      .select("*")
      .order("createdat", { ascending: false });

    if (productError) throw productError;

    const products = productsData as Product[];

    // جلب كل الصور
    const { data: imagesData, error: imagesError } = await supabase
      .from("product_images")
      .select("*");

    if (imagesError) throw imagesError;

    const images = imagesData as ProductImage[];

    // دمج الصور مع المنتجات
    const productsWithImages: ProductWithImages[] = products.map(product => ({
      ...product,
      images: images.filter(img => img.product_id === product.id)
    }));

    setProducts(productsWithImages);
  } catch (error) {
    console.error("Error fetching products:", error);
    toast.error(error instanceof Error ? error.message : "Erreur lors du chargement des produits");
  } finally {
    setLoading(false);
  }
};



  const filterProducts = () => {
    let filtered = products

    if (productSearchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(productSearchTerm.toLowerCase()) ||
        product.brand.toLowerCase().includes(productSearchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(productSearchTerm.toLowerCase()) ||
        product.id.toString().includes(productSearchTerm)
      )
    }

    if (activeCategory !== "all") {
      filtered = filtered.filter(product => product.category === activeCategory)
    }

    setFilteredProducts(filtered)
  }




const handleProductSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  try {
    if (editingProduct) {
      // تحديث المنتج الرئيسي
      const { error } = await supabase
        .from("product")
        .update({
          name: productForm.name,
          description: productForm.description,
          price: productForm.price,
          brand: productForm.brand,
          category: productForm.category,
          instock: productForm.instock,
          sizes: productForm.sizes,
          colors: productForm.colors,
          // updatedat: new Date().toISOString()
        })
        .eq("id", editingProduct.id)

      if (error) throw error

      

      // فقط إذا تم إضافة صور جديدة
if (productForm.imagesFiles && productForm.imagesFiles.length > 0) {
  // حذف الصور القديمة
  const { error: deleteError } = await supabase
    .from("product_images")
    .delete()
    .eq("product_id", editingProduct.id);

  if (deleteError) throw deleteError;

  // رفع الصور الجديدة
  for (const [index, file] of productForm.imagesFiles.entries()) {
    const imageUrl = await uploadImage(file);
    const { error: imgError } = await supabase
      .from("product_images")
      .insert({
        product_id: editingProduct.id,
        image_url: imageUrl,
        position: index + 1
      });

    if (imgError) throw imgError;
  }
}




      // for (const file of productForm.imagesFiles) {
      //   const imageUrl = await uploadImage(file)
      //   const { error: imgError } = await supabase
      //     .from("product_images")
      //     .insert({
      //       product_id: editingProduct.id,
      //       image_url: imageUrl
      //     })
      //   if (imgError) throw imgError
      // }

      toast.success("Produit mis à jour avec succès")
    } else {
      // إضافة منتج جديد
      const { data: newProduct, error } = await supabase
        .from("product")
        .insert([{
          name: productForm.name,
          description: productForm.description,
          price: productForm.price,
          brand: productForm.brand,
          category: productForm.category,
          instock: productForm.instock,
          sizes: productForm.sizes,
          colors: productForm.colors,
          createdat: new Date().toISOString()
        }])
        .select()
        .single()

      if (error || !newProduct) throw error || new Error("Failed to create product")

      for (const file of productForm.imagesFiles) {
        const imageUrl = await uploadImage(file)
        const { error: imgError } = await supabase
          .from("product_images")
          .insert({
            product_id: newProduct.id,
            image_url: imageUrl
          })
        if (imgError) throw imgError
      }

      toast.success("Produit ajouté avec succès")
    }

    setIsProductDialogOpen(false)
    resetProductForm()
    fetchProducts()
  } catch (error) {
    console.log("Error saving product:", error)
    toast.error(error instanceof Error ? error.message : "Erreur lors de la sauvegarde du produit")
  }
}



  const deleteProduct = async (productId: number) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce produit ?")) return
    try {
      const { error } = await supabase
        .from("product")
        .delete()
        .eq("id", productId)

      if (error) throw error
      toast.success("Produit supprimé avec succès")
      fetchProducts()
    } catch (error) {
      console.error("Error deleting product:", error)
      toast.error(error instanceof Error ? error.message : "Erreur lors de la suppression du produit")
    }
  }

const editProduct = (product: Product) => {
  setEditingProduct(product)
  setProductForm({
    name: product.name,
    description: product.description,
    price: product.price,
    brand: product.brand,
    category: product.category,
    instock: product.instock,
    sizes: product.sizes,
    colors: product.colors,
    newSize: "",
    newColor: "",
    
    // الصور الجديدة التي سيرفعها المستخدم
    imagesFiles: [],

    // الصور الموجودة مسبقاً في DB
    existingImages: product.product_images || [],
    newImageUrl: ""
  })
  setIsProductDialogOpen(true)
}

const resetProductForm = () => {
  setProductForm({
    name: "",
    description: "",
    price: 0,
    brand: "",
    category: "",
    instock: true,
    sizes: [],
    colors: [],
    newSize: "",
    newColor: "",

    // إعادة تهيئة الصور
    imagesFiles: [],
    existingImages: [],
    newImageUrl: ""
  })
  setEditingProduct(null)
}


const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
  const files = Array.from(e.target.files || [])

  const validFiles = files.filter(file => {
    if (!file.type.startsWith("image/")) {
      toast.error("Le fichier doit être une image")
      return false
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("La taille de l'image doit être inférieure à 5MB")
      return false
    }
    return true
  })

  if (validFiles.length === 0) return

  // إضافة الملفات الجديدة إلى imagesFiles
  setProductForm(prev => ({
    ...prev,
    imagesFiles: [...prev.imagesFiles, ...validFiles]
  }))

  // إنشاء preview للصور الجديدة
  validFiles.forEach(file => {
    const reader = new FileReader()
    reader.onload = (e) => {
      setProductForm(prev => ({
        ...prev,
        existingImages: [...prev.existingImages, {
          id: Date.now(), // معرف مؤقت للعرض قبل الحفظ
          image_url: e.target?.result as string,
          position: 0
        }]
      }))
    }
    reader.readAsDataURL(file)
  })
}


// حذف صورة بناءً على id أو index
const removeUploadedImage = (imageId?: number, index?: number) => {
  setProductForm(prev => ({
    ...prev,
    // إذا تم تمرير imageId → نحذف الصورة الموجودة مسبقاً في DB
    existingImages: imageId
      ? prev.existingImages.filter(img => img.id !== imageId)
      : prev.existingImages,
    
    // إذا تم تمرير index → نحذف الصورة الجديدة التي لم تُرفع بعد
    imagesFiles: index !== undefined
      ? prev.imagesFiles.filter((_, i) => i !== index)
      : prev.imagesFiles
  }))

  // إعادة تعيين input file إذا لم يتبق أي ملف
  if (fileInputRef.current && (!productForm.imagesFiles.length || index !== undefined)) {
    fileInputRef.current.value = ""
  }
}


  const addSize = () => {
    if (productForm.newSize.trim()) {
      setProductForm({ ...productForm, sizes: [...productForm.sizes, productForm.newSize.trim()], newSize: "" })
    }
  }
  const removeSize = (index: number) => {
    const newSizes = [...productForm.sizes]
    newSizes.splice(index, 1)
    setProductForm({ ...productForm, sizes: newSizes })
  }

  const addColor = () => {
    if (productForm.newColor.trim()) {
      setProductForm({ ...productForm, colors: [...productForm.colors, productForm.newColor.trim()], newColor: "" })
    }
  }
  const removeColor = (index: number) => {
    const newColors = [...productForm.colors]
    newColors.splice(index, 1)
    setProductForm({ ...productForm, colors: newColors })
  }

  const getTotalProducts = () => products.length
  const getTotalValue = () => products.reduce((total, product) => total + product.price, 0)
  const getinstockCount = () => products.filter(product => product.instock).length

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-amber-400 mx-auto mb-4"></div>
          <p className="text-gray-400">Chargement des produits...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-amber-400">Gestion des Produits</h1>
              <p className="text-gray-400 mt-2">Ajouter, modifier et supprimer des produits</p>
            </div>
            
            <Dialog open={isProductDialogOpen} onOpenChange={setIsProductDialogOpen}>
              <DialogTrigger asChild>
                <Button 
                  onClick={() => resetProductForm()} 
                  className="flex items-center gap-2 bg-amber-500/10 text-amber-300 border-amber-500/30 hover:bg-amber-500/20 hover:text-amber-200"
                >
                  <Plus className="h-4 w-4" />
                  Ajouter un nouveau produit
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto bg-gray-800 border-gray-700 text-white">
                <DialogHeader>
                  <DialogTitle className="text-amber-400">{editingProduct ? "Modifier le produit" : "Ajouter un nouveau produit"}</DialogTitle>
                  <DialogDescription className="text-gray-400">
                    {editingProduct ? "Modifiez les informations du produit" : "Remplissez les informations pour ajouter un nouveau produit"}
                  </DialogDescription>
                </DialogHeader>
                
                <form onSubmit={handleProductSubmit} className="grid gap-4 py-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-gray-300">Nom du produit</Label>
                      <Input
                        id="name"
                        value={productForm.name}
                        onChange={(e) => setProductForm({...productForm, name: e.target.value})}
                        required
                        className="bg-gray-700 border-gray-600 text-white placeholder-gray-500 focus:border-amber-500"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="price" className="text-gray-300">Prix (DH)</Label>
                      <Input
                        id="price"
                        type="number"
                        step="0.01"
                        min="0"
                        value={productForm.price}
                        onChange={(e) => setProductForm({...productForm, price: parseFloat(e.target.value) || 0})}
                        required
                        className="bg-gray-700 border-gray-600 text-white placeholder-gray-500 focus:border-amber-500"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="description" className="text-gray-300">Description du produit</Label>
                    <Textarea
                      id="description"
                      value={productForm.description}
                      onChange={(e) => setProductForm({...productForm, description: e.target.value})}
                      required
                      rows={3}
                      className="bg-gray-700 border-gray-600 text-white placeholder-gray-500 focus:border-amber-500"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="brand" className="text-gray-300">Marque</Label>
                      <Input
                        id="brand"
                        value={productForm.brand}
                        onChange={(e) => setProductForm({...productForm, brand: e.target.value})}
                        required
                        className="bg-gray-700 border-gray-600 text-white placeholder-gray-500 focus:border-amber-500"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="category" className="text-gray-300">Catégorie</Label>
                      <Input
                        id="category"
                        value={productForm.category}
                        onChange={(e) => setProductForm({...productForm, category: e.target.value})}
                        required
                        className="bg-gray-700 border-gray-600 text-white placeholder-gray-500 focus:border-amber-500"
                      />
                    </div>
                  </div>
                  
                  {/* Section de téléchargement d'image */}
                  <div className="space-y-2">
                    <Label className="text-gray-300">Image du produit</Label>
                    
                    <div className="flex flex-col gap-3">
                      {/* Bouton de téléchargement d'image */}
                      <div>
                        <Input
                          ref={fileInputRef}
                          id="image-upload"
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                        <Label 
                          htmlFor="image-upload" 
                          className="cursor-pointer flex flex-col items-center justify-center p-4 border border-dashed border-gray-600 rounded-md bg-gray-700 hover:bg-gray-600 transition-colors"
                        >
                          <Upload className="h-8 w-8 mb-2 text-gray-400" />
                          <span className="text-gray-300">Cliquez pour télécharger une image depuis votre appareil</span>
                          <span className="text-sm text-gray-500">JPEG, PNG, GIF (5MB maximum)</span>
                        </Label>
                      </div>
                      
                      {/* Aperçu de l'image téléchargée */}
                      <div className="flex flex-wrap gap-3 mt-2">
                        {productForm.existingImages.map((img, index) => (
                          <div key={img.id || index} className="relative w-32 h-32 border border-gray-600 rounded-md overflow-hidden">
                            <img 
                              src={img.image_url} 
                              alt="Aperçu" 
                              className="w-full h-full object-cover"
                            />
                            <button
                              type="button"
                              onClick={() => removeUploadedImage(img.id, index)}
                              className="absolute top-1 left-1 bg-red-500/80 text-white rounded-full p-1"
                            >
                              <XCircle className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                      </div>

                      
                      {/* Ou saisir l'URL de l'image manuellement */}
                      <div className="mt-2">
  <Label htmlFor="image-url" className="text-gray-300">Ou entrez l'URL des images:</Label>
  <div className="flex gap-2 mt-1">
    <Input
      id="image-url"
      value={productForm.newImageUrl || ""}
      onChange={(e) => setProductForm({
        ...productForm,
        newImageUrl: e.target.value
      })}
      placeholder="https://example.com/image.jpg"
      className="flex-1 bg-gray-700 border-gray-600 text-white placeholder-gray-500 focus:border-amber-500"
    />
    <Button
      type="button"
      onClick={() => {
        if (!productForm.newImageUrl) return
        setProductForm(prev => ({
          ...prev,
          existingImages: [
            ...prev.existingImages,
            { id: Date.now(), image_url: prev.newImageUrl, position: prev.existingImages.length }
          ],
          newImageUrl: ""
        }))
      }}
      className="bg-amber-500/10 text-amber-300 border-amber-500/30 hover:bg-amber-500/20 hover:text-amber-200"
    >
      Ajouter URL
    </Button>
  </div>
                    </div>

                    </div>
                    
                    {uploadingImage && (
                      <div className="flex items-center justify-center mt-2">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-amber-400"></div>
                        <span className="mr-2 text-sm text-gray-400">Téléchargement de l'image...</span>
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-300">Tailles disponibles</Label>
                    <div className="flex gap-2">
                      <Input
                        value={productForm.newSize}
                        onChange={(e) => setProductForm({...productForm, newSize: e.target.value})}
                        placeholder="Ajouter une nouvelle taille"
                        className="bg-gray-700 border-gray-600 text-white placeholder-gray-500 focus:border-amber-500"
                      />
                      <Button 
                        type="button" 
                        onClick={addSize}
                        className="bg-amber-500/10 text-amber-300 border-amber-500/30 hover:bg-amber-500/20 hover:text-amber-200"
                      >
                        Ajouter
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {productForm.sizes.map((size, index) => (
                        <Badge key={index} variant="secondary" className="flex items-center gap-1 bg-gray-700 text-gray-300 border-gray-600">
                          {size}
                          <button 
                            type="button" 
                            onClick={() => removeSize(index)}
                            className="text-red-400 hover:text-red-300"
                          >
                            <XCircle className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-gray-300">Couleurs disponibles</Label>
                    <div className="flex gap-2">
                      <Input
                        value={productForm.newColor}
                        onChange={(e) => setProductForm({...productForm, newColor: e.target.value})}
                        placeholder="Ajouter une nouvelle couleur"
                        className="bg-gray-700 border-gray-600 text-white placeholder-gray-500 focus:border-amber-500"
                      />
                      <Button 
                        type="button" 
                        onClick={addColor}
                        className="bg-amber-500/10 text-amber-300 border-amber-500/30 hover:bg-amber-500/20 hover:text-amber-200"
                      >
                        Ajouter
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {productForm.colors.map((color, index) => (
                        <Badge key={index} variant="secondary" className="flex items-center gap-1 bg-gray-700 text-gray-300 border-gray-600">
                          {color}
                          <button 
                            type="button" 
                            onClick={() => removeColor(index)}
                            className="text-red-400 hover:text-red-300"
                          >
                            <XCircle className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <DialogFooter>
                    <Button 
                      type="submit"
                      className="bg-amber-500 hover:bg-amber-600 text-white"
                      disabled={uploadingImage}
                    >
                      {uploadingImage ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Chargement...
                        </>
                      ) : editingProduct ? "Mettre à jour" : "Ajouter"}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="bg-gray-800 border-gray-700 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400">Total des produits</p>
                  <p className="text-2xl font-bold text-amber-400">{getTotalProducts()}</p>
                </div>
                <div className="p-3 bg-amber-500/10 rounded-full">
                  <Box className="h-6 w-6 text-amber-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400">Valeur totale</p>
                  <p className="text-2xl font-bold text-amber-400">{getTotalValue().toFixed(2)} DH</p>
                </div>
                <div className="p-3 bg-green-500/10 rounded-full">
                  <DollarSign className="h-6 w-6 text-green-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* <Card className="bg-gray-800 border-gray-700 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400">Produits en stock</p>
                  <p className="text-2xl font-bold text-amber-400">{getinstockCount()}</p>
                </div>
                <div className="p-3 bg-blue-500/10 rounded-full">
                  <TrendingUp className="h-6 w-6 text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card> */}
        </div>

        {/* Recherche de produits */}
        <Card className="bg-gray-800 border-gray-700 shadow-lg mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <div className="flex-1 relative">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Rechercher par nom, marque ou catégorie..."
                  value={productSearchTerm}
                  onChange={(e) => setProductSearchTerm(e.target.value)}
                  className="pr-10 bg-gray-700 border-gray-600 text-white placeholder-gray-500 focus:border-amber-500"
                />
              </div>
              
              <Select value={activeCategory} onValueChange={setActiveCategory}>
                <SelectTrigger className="w-[180px] bg-gray-700 border-gray-600 text-white focus:border-amber-500">
                  <SelectValue placeholder="Toutes les catégories" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700 text-white">
                  <SelectItem value="all" className="focus:bg-gray-700">Toutes les catégories</SelectItem>
                  {Array.from(new Set(products.map(p => p.category))).map(category => (
                    <SelectItem key={category} value={category} className="focus:bg-gray-700">
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Grille de produits */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <Card key={product.id} className="bg-gray-800 border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:border-amber-500/30 overflow-hidden">
              <div className="h-48 bg-gray-700 overflow-hidden">
                {product.images && product.images.length > 0 ? (
            <Swiper
      modules={[Navigation]}
      navigation
      spaceBetween={0}
      slidesPerView={1}
      className="h-full"
    >
      {product.images.map((img, index) => (
        <SwiperSlide key={index}>
          <img
            src={img.image_url}
            alt={`${product.name} ${index + 1}`}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.src =
                "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIGZpbGw9IiMzNzM3MzciLz48cGF0aCBkPSJNMzYgMjhIMjhWMzZIMzZWMjhaTTM4IDI2VjM4SDI2VjI2SDM4Wk0yNCA0MEg0MFYyNEgyNFY0MFpNNDIgNDJIMjJWNDJWMjJINDJWMjJWMjJINDJWMzZWMzZINDJWNDJaTTIwIDQ0SDQ0VjIwSDIwVjQ0WiIgZmlsbD0iIzhBOEE4QSIvPjwvc3ZnPg==";
            }}
          />
        </SwiperSlide>
              ))}
            </Swiper>
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-700">
              <ImageIcon className="h-12 w-12 text-gray-500" />
            </div>
          )}

              </div>
              
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <CardTitle className="text-lg text-white">{product.name}</CardTitle>
                  <Badge 
                    variant={product.instock ? "default" : "destructive"} 
                    className={product.instock 
                      ? "text-green-300 bg-green-500/20 border-green-500/30" 
                      : "text-red-300 bg-red-500/20 border-red-500/30"
                    }
                  >
                    {product.instock ? "Disponible" : "Non disponible"}
                  </Badge>
                </div>
                
                <p className="text-gray-400 text-sm mb-3 line-clamp-2">{product.description}</p>
                
                <div className="flex justify-between items-center mb-3">
                  <span className="font-bold text-amber-400">{product.price} DH</span>
                  <div className="flex items-center">
                    <span className="text-yellow-400 text-sm ml-1">★</span>
                    <span className="text-sm text-gray-400">{product.rating.toFixed(1)}</span>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-1 mb-3">
                  <Badge variant="outline" className="text-xs bg-gray-700 text-gray-300 border-gray-600">{product.brand}</Badge>
                  <Badge variant="outline" className="text-xs bg-gray-700 text-gray-300 border-gray-600">{product.category}</Badge>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="flex gap-1">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => editProduct(product)}
                      className="bg-amber-500/10 text-amber-300 border-amber-500/30 hover:bg-amber-500/20 hover:text-amber-200"
                    >
                      <Edit className="h-4 w-4 ml-1" />
                      Modifier
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() => deleteProduct(product.id)}
                      className="bg-red-500/10 text-red-300 border-red-500/30 hover:bg-red-500/20 hover:text-red-200"
                    >
                      <Trash2 className="h-4 w-4 ml-1" />
                      Supprimer
                    </Button>
                  </div>
                  
                  <span className="text-xs text-gray-500">
                    {new Date(product.createdat).toLocaleDateString('fr-FR')}
                  </span>
                </div>
              </CardContent>
            </Card>

          ))}
        </div>

        {filteredProducts.length === 0 && !loading && (
          <div className="text-center py-16">
            <Package className="h-16 w-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-300 mb-2">Aucun produit</h3>
            <p className="text-gray-500">
              {productSearchTerm || activeCategory !== "all" 
                ? "Aucun produit trouvé correspondant à votre recherche" 
                : "Aucun produit pour le moment"
              }
            </p>
          </div>
        )}
      </div>
    </div>
  )
}