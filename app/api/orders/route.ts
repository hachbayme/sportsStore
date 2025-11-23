import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

// -------------------------
// GET /api/orders
// -------------------------
export async function GET() {
  const supabase = await createClient();

  try {
    const { data: orders, error } = await supabase
  .from("order")
  .select(`
    *,
    orderitem (*)
  `)
  .order("createdat", { ascending: false });


    if (error) {
      throw error;
    } 

    return NextResponse.json({ success: true, orders });
  } catch (error: any) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}

// -------------------------
// POST /api/orders
// -------------------------
// export async function POST(request: NextRequest) {
//   const supabase = await createClient();

//   try {
//     const body = await request.json();
//     const { customerInfo, cartItems, total } = body;

//     if (!customerInfo?.name || !customerInfo?.phone || !customerInfo?.address) {
//       return NextResponse.json(
//         { success: false, error: "البيانات المطلوبة غير مكتملة" },
//         { status: 400 }
//       );
//     }

//     // إنشاء الطلب مع العناصر
//     const { data: order, error } = await supabase
//       .from("order")
//       .insert({
//         customername: customerInfo.name,
//         customerphone: customerInfo.phone,
//         customeremail: customerInfo.email || "",
//         customeraddress: customerInfo.address,
//         total: total,
//         status: "PENDING",
//         items: cartItems.map((item: any) => ({
//           name: item.name,
//           brand: item.productbrand,
//           price: item.price,
//           quantity: item.quantity,
//           selected_size: item.selectedSize || "",
//           selected_color: item.selectedColor || "",
//         })),
//       })
//       .select()
//       .single();

//     if (error) {
//       throw error;
//     }

//     return NextResponse.json({
//       success: true,
//       orderId: order.id,
//       message: "تم تأكيد الطلب بنجاح",
//     });
//   } catch (error: any) {
//     console.error("Error creating order:", error);
//     return NextResponse.json(
//       { success: false, error: "فشل في إنشاء الطلب" },
//       { status: 500 }
//     );
//   }
// }
export async function POST(request: NextRequest) {
  const supabase = await createClient();

  try {
    const body = await request.json();
    const { customerInfo, cartItems, total } = body;

    if (!customerInfo?.name || !customerInfo?.phone || !customerInfo?.address) {
      return NextResponse.json(
        { success: false, error: "البيانات المطلوبة غير مكتملة" },
        { status: 400 }
      );
    }

    // 1️⃣ إنشاء الطلب
    const { data: order, error: orderError } = await supabase
      .from("order")
      .insert({
        customername: customerInfo.name,
        customerphone: customerInfo.phone,
        customeremail: customerInfo.email || "",
        customeraddress: customerInfo.address,
        total: total,
        status: "PENDING",
      })
      .select()
      .single();

    if (orderError) throw orderError;

    // 2️⃣ إنشاء العناصر في جدول orderitem
    const orderItemsPayload = cartItems.map((item: any) => ({
      orderid: order.id,
      productname: item.name,
      productbrand: item.brand,
      productprice: item.price,
      quantity: item.quantity,
      selectedsize: item.selectedSize || "",
      selectedcolor: item.selectedColor || "",
    }));

    const { error: itemsError } = await supabase
      .from("orderitem")
      .insert(orderItemsPayload);

    if (itemsError) throw itemsError;

    return NextResponse.json({
      success: true,
      orderId: order.id,
      message: "تم تأكيد الطلب بنجاح",
    });
  } catch (error: any) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      { success: false, error: "فشل في إنشاء الطلب" },
      { status: 500 }
    );
  }
}


// -------------------------
// PUT /api/orders
// -------------------------
export async function PUT(request: NextRequest) {
  const supabase = await createClient();

  try {
    const body = await request.json();
    const { orderId, status } = body;

    if (!orderId || !status) {
      return NextResponse.json(
        { success: false, error: "معرف الطلب والحالة مطلوبان" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("order")
      .update({ status })
      .eq("id", orderId)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json({ success: true, order: data });
  } catch (error: any) {
    console.error("Error updating order:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update order" },
      { status: 500 }
    );
  }
}

// -------------------------
// DELETE /api/orders
// -------------------------
export async function DELETE(request: NextRequest) {
  const supabase = await createClient();

  try {
    const body = await request.json();
    const { orderId } = body;

    if (!orderId) {
      return NextResponse.json(
        { success: false, error: "معرف الطلب مطلوب" },
        { status: 400 }
      );
    }

    // حذف العناصر المرتبطة أولاً
    const { error: delItemsError } = await supabase
      .from("orderitem")
      .delete()
      .eq("orderid", orderId);

    if (delItemsError) throw delItemsError;

    // حذف الطلب نفسه
    const { error: delOrderError } = await supabase
      .from("order")
      .delete()
      .eq("id", orderId);

    if (delOrderError) throw delOrderError;

    return NextResponse.json({
      success: true,
      message: "تم حذف الطلب بنجاح",
    });
  } catch (error: any) {
    console.error("Error deleting order:", error);
    return NextResponse.json(
      { success: false, error: "فشل في حذف الطلب" },
      { status: 500 }
    );
  }
}
