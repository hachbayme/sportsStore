import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {

  const supabase = await createClient();
  const { id } = params;

  const { data, error } = await supabase
    .from("product")
    .select(`
      *,
      product_images (
        id,
        image_url,
        position
      )
    `)
    .eq("id", id)
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 404 });
  }

  return NextResponse.json(data);
}


export async function PUT(
  request: NextRequest,
  context: { params: { id: string } }
) {
  const supabase = await createClient();
  const { id } = context.params;

  try {
    const body = await request.json();

    const { data: existing, error: fetchError } = await supabase
      .from("product")
      .select("*")
      .eq("id", id)
      .single();

    if (fetchError || !existing) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const updates = {
      ...(body.name && { name: body.name }),
      ...(body.description && { description: body.description }),
      ...(body.price && { price: parseFloat(body.price) }),
      ...(body.rating && { rating: parseFloat(body.rating) }),
      ...(body.brand && { brand: body.brand }),
      ...(body.category && { category: body.category }),
      ...(body.image !== undefined && { image: body.image }),
      ...(body.inStock !== undefined && { instock: body.inStock }),
      ...(body.sizes && { sizes: body.sizes }),
      ...(body.colors && { colors: body.colors }),
      updatedat: new Date(),
    };

    const { data, error } = await supabase
      .from("product")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update product" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: { id: string } }
) {
  const supabase = await createClient();
  const { id } = context.params;

  try {
    const { data: existing, error: fetchError } = await supabase
      .from("product")
      .select("id")
      .eq("id", id)
      .single();

    if (fetchError || !existing) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const { error } = await supabase.from("product").delete().eq("id", id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(
      { message: "Product deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete product" },
      { status: 500 }
    );
  }
}
