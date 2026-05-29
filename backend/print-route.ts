import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
import { sendToThermalPrinter } from "./thermal-printer-adapter";

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

export async function POST(request: NextRequest) {
  if (request.headers.get("x-internal-key") !== process.env.INTERNAL_PRINT_KEY) {
    return NextResponse.json({ ok: false, reason: "unauthorized" }, { status: 401 });
  }

  const { orderId, paper = 80 } = await request.json();

  const { data: order, error } = await supabase
    .from("orders")
    .select(
      `
      *,
      customers:customer_id(name, phone, address),
      order_items(name, quantity, unit_price, total)
    `,
    )
    .eq("id", orderId)
    .single();

  if (error) {
    return NextResponse.json({ ok: false, reason: error.message }, { status: 500 });
  }

  await sendToThermalPrinter(
    {
      number: order.number,
      createdAt: order.created_at,
      customer: order.customers,
      items: order.order_items.map((item: any) => ({
        name: item.name,
        quantity: item.quantity,
        unitPrice: item.unit_price,
        total: item.total,
      })),
      notes: order.notes,
      paymentMethod: order.payment_method,
      subtotal: order.subtotal,
      deliveryFee: order.delivery_fee,
      discount: order.discount,
      total: order.total,
    },
    paper,
  );

  await supabase.from("orders").update({ printed_at: new Date().toISOString() }).eq("id", orderId);

  return NextResponse.json({ ok: true });
}
