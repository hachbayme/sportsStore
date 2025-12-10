// app/api/products/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);

    const isAdmin = searchParams.get("admin") === "true";
    const category = searchParams.get("category") || undefined;
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.max(1, parseInt(searchParams.get("limit") || "9999999999"));
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    // 🟡 جلب المنتجات مع الصور مباشرة
    let query = supabase
      .from("product")
      .select(`
        *,
        product_images(*)
      `)
      .order("createdat", { ascending: false });

    if (!isAdmin) query = query.eq("instock", true);
    if (category) query = query.eq("category", category);

    const { data: products, error } = await query;

    if (error) {
      console.error("Supabase select error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // 🟡 pagination يدوي
    const paginatedData = products?.slice(from, to + 1) || [];

    return NextResponse.json({
      products: paginatedData,
      pagination: {
        page,
        limit,
        total: products?.length || 0,
        pages: Math.ceil((products?.length || 0) / limit),
      },
    });
  } catch (err: any) {
    console.error("GET /api/products failed:", err);
    return NextResponse.json({ error: err?.message ?? "Unknown error" }, { status: 500 });
  }
}
