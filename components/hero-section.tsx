"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
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
  ChevronRight,
  ChevronDown,
  ChevronLeft,
  ArrowRight  
} from "lucide-react"

const HeroSection = () => {
  const [currentImage, setCurrentImage] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  
  const backgroundImages = [
    "/bg/bg1.avif",
    "/bg/bg2.jpeg",
    "/bg/bg3.jpeg"
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true)
      setTimeout(() => {
        setCurrentImage((prev) => (prev + 1) % backgroundImages.length)
        setIsTransitioning(false)
      }, 1000) // مدة الانتقال - يجب أن تتطابق مع مدة الأنيميشن
    }, 6000) // تغيير الصورة كل 6 ثواني (5 ثواني عرض + 1 ثانية انتقال)

    return () => clearInterval(interval)
  }, [backgroundImages.length])

return (
  <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-gray-900 via-black to-gray-800">
    
    {/* خلفية الصور المتغيرة */}
    <div className="absolute inset-0 z-0">
      {backgroundImages.map((image, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentImage ? 'opacity-100' : 'opacity-0'
          }`}
          style={{
            backgroundImage: `url(${image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        >
          {/* طبقة تظليل بسيطة */}
          <div className="absolute inset-0 bg-black/50"></div>
        </div>
      ))}
    </div>

    {/* محتوى بسيط وأنيق */}
    <div className="container mx-auto px-6 relative z-10">
      <div className="max-w-3xl mx-auto text-center space-y-8">
        
        {/* العنوان الرئيسي */}
        <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight">
          <span className="block">Meilleurs</span>
          <span className="block text-amber-400">Articles de Sport</span>
        </h1>

        {/* خط فاصل بسيط */}
        <div className="w-32 h-1 bg-gradient-to-r from-amber-500 to-amber-600 mx-auto rounded-full"></div>

        {/* الوصف */}
        <p className="text-xl text-gray-300 leading-relaxed max-w-2xl mx-auto">
          Découvrez notre large gamme de chaussures et de vêtements de sport 
          des marques les plus connues au monde. Haute qualité et prix compétitifs.
        </p>

        {/* أزرار الإجراءات */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
          <Link href="/products">
            <Button 
              size="lg" 
              className="px-8 py-6 text-lg font-semibold bg-amber-600 hover:bg-amber-700 text-white 
                         transition-colors duration-300 rounded-lg shadow-lg hover:shadow-xl"
            >
              Explorer la collection
            </Button>
          </Link>
          

        </div>

      </div>
    </div>

    {/* مؤشرات الصور البسيطة */}
    <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
      <div className="flex items-center gap-4">
        {backgroundImages.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentImage(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentImage 
                ? 'bg-amber-500 scale-125' 
                : 'bg-white/50 hover:bg-white/80'
            }`}
            aria-label={`Aller à l'image ${index + 1}`}
          />
        ))}
      </div>
    </div>

  </section>
);
}

export default HeroSection