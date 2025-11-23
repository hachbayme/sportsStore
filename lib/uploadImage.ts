import { supabase } from "@/lib/supabaseClient";

export async function uploadImage(file: File) {
  const fileExt = file.name.split('.').pop();
  const fileName = `product_${Date.now()}.${fileExt}`;
  const filePath = `products/${fileName}`;

  const { error: uploadError } = await supabase
    .storage
    .from('products')
    .upload(filePath, file);

  if (uploadError) {
    throw uploadError;
  }

  const { data } = supabase
    .storage
    .from('products')
    .getPublicUrl(filePath);

  return data.publicUrl;
}
