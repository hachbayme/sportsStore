import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/products/[id] - جلب منتج محدد
// GET /api/products/[id] - جلب منتج محدد
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { searchParams } = new URL(request.url)
    const isAdmin = searchParams.get('admin') === 'true'

    const product = await prisma.product.findUnique({
      where: { 
        id: parseInt(params.id),
        ...(!isAdmin && { inStock: true }) // فقط للعملاء
      }
    })

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(product)
  } catch (error) {
    console.error('Error fetching product:', error)
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    )
  }
}

// PUT /api/products/[id] - تحديث منتج موجود
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    
    // التحقق من وجود المنتج أولاً
    const existingProduct = await prisma.product.findUnique({
      where: { id: parseInt(params.id) }
    })

    if (!existingProduct) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    const product = await prisma.product.update({
      where: { id: parseInt(params.id) },
      data: {
        ...(body.name && { name: body.name }),
        ...(body.description && { description: body.description }),
        ...(body.price && { price: parseFloat(body.price) }),
        ...(body.rating && { rating: parseFloat(body.rating) }),
        ...(body.brand && { brand: body.brand }),
        ...(body.category && { category: body.category }),
        ...(body.image !== undefined && { image: body.image }),
        ...(body.inStock !== undefined && { inStock: body.inStock }),
        ...(body.sizes && { sizes: body.sizes }),
        ...(body.colors && { colors: body.colors })
      }
    })

    return NextResponse.json(product)
  } catch (error) {
    console.error('Error updating product:', error)
    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500 }
    )
  }
}

// DELETE /api/products/[id] - حذف منتج
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } } // تغيير هنا
) {
  try {
    const { id } = params // تغيير هنا
    console.log('Deleting product ID:', id)
    
    // التحقق من وجود المنتج أولاً
    const existingProduct = await prisma.product.findUnique({
      where: { id: parseInt(id) }
    })

    if (!existingProduct) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    await prisma.product.delete({
      where: { id: parseInt(id) }
    })

    return NextResponse.json(
      { message: 'Product deleted successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error deleting product:', error)
    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 }
    )
  }
}