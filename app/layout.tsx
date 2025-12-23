import type React from "react"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import "./globals.css"
import { CartProvider } from '@/context/cart-context'
import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ar" className="antialiased">
      <head>
        <style>{`
html {
  --font-sans: ${GeistSans.variable};
  --font-mono: ${GeistMono.variable};
}
        `}</style>
      </head>
      <body className={inter.className}>
        <CartProvider>
          {children}
        </CartProvider>
      </body>
    </html>
  )
}
