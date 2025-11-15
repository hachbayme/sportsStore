import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'


export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const hasSearchParams = searchParams.toString().length > 0
    const isAdmin = searchParams.get('admin') === 'true' 

    
    if (!hasSearchParams) {
      const products = await prisma.product.findMany({
        where: isAdmin ? {} : { inStock: true }, 
        orderBy: { createdAt: 'desc' }
      })
      return NextResponse.json(products)
    }

    // إذا كانت هناك معاملات بحث، إرجاع النتيجة مع الباجينيشن
    const category = searchParams.get('category')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '999999999')
    const skip = (page - 1) * limit

    const where = {
      ...(!isAdmin && { inStock: true }), // فقط للعملاء
      ...(category && { category })
    }

    const products = await prisma.product.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' }
    })

    const total = await prisma.product.count({ where })

    return NextResponse.json({
      products,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    )
  }
}

// POST /api/products - إنشاء منتج جديد
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const { name, description, price, brand, category, image, sizes, colors } = body

    // التحقق من الحقول المطلوبة
    if (!name || !description || !price || !brand || !category) {
      return NextResponse.json(
        { error: 'جميع الحقول مطلوبة ما عدا الصورة' },
        { status: 400 }
      )
    }

    const product = await prisma.product.create({
      data: {
        name,
        description,
        price: parseFloat(price),
        brand,
        category,
        image: image || null,
        sizes: sizes || [],
        colors: colors || []
      }
    })

    return NextResponse.json(product, { status: 201 })
  } catch (error) {
    console.error('Error creating product:', error)
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    )
  }
}