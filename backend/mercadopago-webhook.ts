import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

export async function POST(request: NextRequest) {
  const payload = await request.json();
  const providerPaymentId = String(payload.data?.id || payload.id || "");

  if (!providerPaymentId) {
    return NextResponse.json({ ok: false, reason: "missing payment id" }, { status: 400 });
  }

  const payment = await fetch(`https://api.mercadopago.com/v1/payments/${providerPaymentId}`, {
    headers: { Authorization: `Bearer ${process.env.MERCADO_PAGO_ACCESS_TOKEN}` },
  }).then((response) => response.json());

  const orderId = payment.external_reference;
  const approved = payment.status === "approved";

  const { data: order, error } = await supabase
    .from("orders")
    .update({
      payment_status: approved ? "approved" : "rejected",
      provider_payment_id: providerPaymentId,
      status: approved ? "Novo" : "Finalizado",
      print_queued: approved,
      updated_at: new Date().toISOString(),
    })
    .eq("id", orderId)
    .select("*")
    .single();

  if (error) {
    return NextResponse.json({ ok: false, reason: error.message }, { status: 500 });
  }

  if (approved) {
    await fetch(`${process.env.APP_URL}/api/print`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-internal-key": process.env.INTERNAL_PRINT_KEY!,
      },
      body: JSON.stringify({ orderId: order.id }),
    });
  }

  return NextResponse.json({ ok: true });
}
