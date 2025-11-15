import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json({ error: 'لم يتم تحميل أي ملف' }, { status: 400 })
    }

    // التحقق من نوع الملف
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'الملف يجب أن يكون صورة' }, { status: 400 })
    }

    // تحويل الملف إلى buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // إنشاء مجلد التحميلات إذا لم يكن موجوداً
    const uploadsDir = path.join(process.cwd(), 'public/uploads')
    try {
      await mkdir(uploadsDir, { recursive: true })
    } catch (err) {
      console.error('Error creating uploads directory:', err)
    }

    // إنشاء اسم فريد للملف
    const timestamp = Date.now()
    const extension = file.name.split('.').pop()
    const filename = `product_${timestamp}.${extension}`
    const filepath = path.join(uploadsDir, filename)

    // حفظ الملف
    await writeFile(filepath, buffer)

    // إرجاع رابط الصورة
    const imageUrl = `/uploads/${filename}`

    return NextResponse.json({ url: imageUrl }, { status: 200 })
  } catch (error) {
    console.error('Error uploading file:', error)
    return NextResponse.json(
      { error: 'فشل في تحميل الملف' },
      { status: 500 }
    )
  }
}