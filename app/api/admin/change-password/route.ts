import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { supabase } from "@/lib/supabaseClient";

export async function POST(req: Request) {
  try {
    const { currentPassword, newPassword } = await req.json();

    if (!currentPassword || !newPassword) {
      return NextResponse.json({ error: "Tous les champs sont requis" }, { status: 400 });
    }

    // جلب أول مستخدم من جدول admin_users
    const { data, error } = await supabase
      .from("admin_users")
      .select("*")
      .limit(1)
      .single();

    if (error || !data) {
      return NextResponse.json({ error: "Aucun administrateur trouvé" }, { status: 401 });
    }

    // تحقق من كلمة المرور الحالية
    const isCurrentValid = bcrypt.compareSync(currentPassword, data.password_hash);
    if (!isCurrentValid) {
      return NextResponse.json({ error: "Mot de passe actuel incorrect" }, { status: 401 });
    }

    // تحقق من طول كلمة المرور الجديدة
    if (newPassword.length < 6) {
      return NextResponse.json({ error: "Le mot de passe doit contenir au moins 6 caractères" }, { status: 400 });
    }

    // إنشاء hash جديد لكلمة المرور
    const newHash = bcrypt.hashSync(newPassword, 10);

    // تحديث كلمة المرور في قاعدة البيانات
    const { error: updateError } = await supabase
      .from("admin_users")
      .update({ password_hash: newHash })
      .eq("id", data.id);

    if (updateError) {
      return NextResponse.json({ error: "Erreur lors de la mise à jour du mot de passe" }, { status: 500 });
    }

    return NextResponse.json({ success: true });

  } catch (err) {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
