import type { APIRoute } from "astro";
import { supabaseAdmin } from "../../../../lib/supabase";

export const POST: APIRoute = async ({ request }) => {
  try {
    // 1. Check Authentication (Bearer Token)
    const authHeader = request.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const { data: { user }, error: authError } = await supabaseAdmin!.auth.getUser(token);

    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Invalid token" }), { status: 401 });
    }

    // 2. Parse Body
    const body = await request.json();
    const { orderId, deliveryInfo, updateStatus } = body;

    if (!orderId || !deliveryInfo) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400 });
    }

    // 3. Prepare Update Data
    const updateData: any = {
      delivery_info: deliveryInfo,
    };

    if (updateStatus) {
      updateData.status = 'completed';
      updateData.payment_status = 'verified'; // Assume verified if delivered
      updateData.delivery_status = 'delivered'; // If you have this column
    }

    // 4. Update Order in Supabase
    const { error: updateError } = await supabaseAdmin!
      .from("orders")
      .update(updateData)
      .eq("id", orderId);

    if (updateError) {
      throw new Error(updateError.message);
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

  } catch (error: any) {
    console.error("Delivery Error:", error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
};
