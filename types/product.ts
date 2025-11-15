export interface Product {
  id: number
  name: string
  description: string
  price: number
  rating: number
  brand: string
  category: string
  image?: string 
  inStock: boolean
  sizes?: string[]
  colors?: string[]
  reviews?: number
  originalPrice?: number
  createdAt?: Date | string
}