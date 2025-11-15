// app/api/orders/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'




// GET - جلب جميع الطلبات
export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      include: {
        items: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json({ success: true, orders })
  } catch (error) {
    console.error('Error fetching orders:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch orders' },
      { status: 500 }
    )
  }
}

// PUT - تحديث حالة الطلب
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { orderId, status } = body

    const order = await prisma.order.update({
      where: { id: orderId },
      data: { status },
    })

    return NextResponse.json({ success: true, order })
  } catch (error) {
    console.error('Error updating order:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update order' },
      { status: 500 }
    )
  }
}





export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { customerInfo, cartItems, total } = body

    // التحقق من البيانات المطلوبة
    if (!customerInfo?.name || !customerInfo?.phone || !customerInfo?.address) {
      return NextResponse.json(
        { success: false, error: 'البيانات المطلوبة غير مكتملة' },
        { status: 400 }
      )
    }

    const order = await prisma.order.create({
      data: {
        customerName: customerInfo.name,
        customerPhone: customerInfo.phone,
        customerEmail: customerInfo.email || '',
        customerAddress: customerInfo.address,
        total: total,
        status: 'PENDING', 
        items: {
          create: cartItems.map((item: any) => ({
            productName: item.name,
            productBrand: item.brand,
            productPrice: item.price,
            quantity: item.quantity,
            selectedSize: item.selectedSize || '',
            selectedColor: item.selectedColor || '',
          })),
        },
      },
    })

    return NextResponse.json({ 
      success: true, 
      orderId: order.id,
      message: 'تم تأكيد الطلب بنجاح'
    })
  } catch (error) {
    console.error('Error creating order:', error)
    return NextResponse.json(
      { success: false, error: 'فشل في إنشاء الطلب' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json()
    const { orderId } = body

    if (!orderId) {
      return NextResponse.json(
        { success: false, error: 'معرف الطلب مطلوب' },
        { status: 400 }
      )
    }

    // حذف العناصر المرتبطة أولاً بسبب قيود المفتاح الخارجي
    await prisma.orderItem.deleteMany({
      where: { orderId: orderId }
    })

    // ثم حذف الطلب نفسه
    await prisma.order.delete({
      where: { id: orderId }
    })

    return NextResponse.json({ 
      success: true, 
      message: 'تم حذف الطلب بنجاح' 
    })
  } catch (error) {
    console.error('Error deleting order:', error)
    return NextResponse.json(
      { success: false, error: 'فشل في حذف الطلب' },
      { status: 500 }
    )
  }
}