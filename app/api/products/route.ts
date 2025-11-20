import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);

    const isAdmin = searchParams.get("admin") === "true";
    const category = searchParams.get("category") || undefined;
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.max(1, parseInt(searchParams.get("limit") || "20"));
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    // جلب كل البيانات أولاً
    let query = supabase.from("product").select("*").order("createdat", { ascending: false });

    if (!isAdmin) query = query.eq("instock", true);
    if (category) query = query.eq("category", category);

    const { data, error } = await query;

    if (error) {
      console.error("Supabase select error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // pagination يدوي
    const paginatedData = data?.slice(from, to + 1) || [];

    return NextResponse.json({
      products: paginatedData,
      pagination: {
        page,
        limit,
        total: data?.length || 0,
        pages: Math.ceil((data?.length || 0) / limit),
      },
    });
  } catch (err: any) {
    console.error("GET /api/products failed:", err);
    return NextResponse.json({ error: err?.message ?? "Unknown error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const body = await request.json();
    const { name, description, price, brand, category, image, sizes, colors } = body ?? {};

    if (!name || !description || !price || !brand || !category) {
      return NextResponse.json({ error: "جميع الحقول مطلوبة ما عدا الصورة" }, { status: 400 });
    }

    const payload = {
      name,
      description,
      price: typeof price === "string" ? parseFloat(price) : price,
      brand,
      category,
      image: image || null,
      sizes: sizes || [],
      colors: colors || [],
      createdat: new Date().toISOString(),
    };

    const { data, error } = await supabase.from("product").insert([payload]).select("*").single();

    if (error) {
      console.error("Supabase insert error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data, { status: 201 });
  } catch (err: any) {
    console.error("POST /api/products failed:", err);
    return NextResponse.json({ error: err?.message ?? "Unknown error" }, { status: 500 });
  }
}



// import { createClient } from '@/utils/supabase/server'

// export async function GET() {
//   const supabase = await createClient()

//   const { data, error } = await supabase
//     .from("product")
//     .select("*")

//   if (error) {
//     return Response.json({ error: error.message }, { status: 500 })
//   }

//   return Response.json(data)
// }
