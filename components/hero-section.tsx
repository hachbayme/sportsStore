"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

const HeroSection = () => {
  const [currentImage, setCurrentImage] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  
  const backgroundImages = [
    "/bg/bg1.jpeg",
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
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* خلفية متغيرة مع أنيميشن */}
      <div className="absolute inset-0">
        {backgroundImages.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 bg-cover bg-center bg-no-repeat ${
              index === currentImage
                ? "opacity-100 scale-100 z-10"
                : "opacity-0 scale-110 z-0"
            } transition-all duration-1000 ease-in-out`}
            style={{
              backgroundImage: `url(${image})`
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-black to-gray-900 opacity-80"></div>
          </div>
        ))}
      </div>
      
      <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 via-transparent to-amber-500/5 opacity-30 z-20"></div>
      
      <div className="container mx-auto px-4 text-center relative z-30">
        <h2 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-amber-400 to-white bg-clip-text text-transparent">
          "Meilleurs articles de sport"
        </h2>
        <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
          "Découvrez notre large gamme de chaussures et de vêtements de sport des marques les plus connues au monde. Haute qualité et prix compétitifs pour toutes vos besoins sportifs"
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/products">
            <Button size="lg" className="text-lg px-8 py-4 bg-amber-600 hover:bg-amber-700 text-black font-bold transition-all duration-300 hover:scale-105">
              Acheter maintenant
            </Button>
          </Link>
        </div>
      </div>

      {/* مؤشرات الصور */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2 z-30">
        {backgroundImages.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentImage ? 'bg-amber-500 scale-125' : 'bg-gray-400'
            }`}
            onClick={() => {
              setIsTransitioning(true)
              setTimeout(() => {
                setCurrentImage(index)
                setIsTransitioning(false)
              }, 1000)
            }}
          />
        ))}
      </div>
    </section>
  )
}

export default HeroSection