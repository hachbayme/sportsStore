// app/products/[id]/page.tsx
import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import ProductDetailsClient from "@/components/product-details-client";

interface Props {
  params: { id: string };
}

export default async function ProductPage({ params: { id } }: Props) {
  const supabase = await createClient();

  // جلب المنتج مع product_images
  const { data: product, error } = await supabase
    .from("product")
    .select(`*, product_images(*)`)
    .eq("id", Number(id))
    .single();

  if (error || !product) {
    // يمكنك تخصيص صفحة خطأ بدلاً من notFound
    console.error("Error fetching product:", error);
    return notFound();
  }

  // نمرّر المنتج كما هو إلى المكوّن العميل
  return <ProductDetailsClient product={product} />;
}
