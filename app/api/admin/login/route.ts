import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { supabase } from "@/lib/supabaseClient";

export async function POST(req: Request) {
  try {
    const { password } = await req.json();

    if (!password) {
      return NextResponse.json({ error: "Mot de passe requis" }, { status: 400 });
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
   
    // التحقق من كلمة المرور
    const isValid = bcrypt.compareSync(password, data.password_hash);

    if (!isValid) {
      return NextResponse.json({ error: "Mot de passe incorrect" }, { status: 401 });
    }

    // تسجيل الدخول ناجح
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
