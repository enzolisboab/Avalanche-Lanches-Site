import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { customer, items, notes, paymentMethod, totals } = body;

  const { data: savedCustomer, error: customerError } = await supabase
    .from("customers")
    .insert(customer)
    .select("id")
    .single();

  if (customerError) {
    return NextResponse.json({ ok: false, reason: customerError.message }, { status: 500 });
  }

  const number = `#${Date.now().toString().slice(-6)}`;
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      number,
      customer_id: savedCustomer.id,
      payment_method: paymentMethod,
      subtotal: totals.subtotal,
      delivery_fee: totals.delivery,
      discount: totals.discount,
      total: totals.total,
      notes,
    })
    .select("id, number")
    .single();

  if (orderError) {
    return NextResponse.json({ ok: false, reason: orderError.message }, { status: 500 });
  }

  await supabase.from("order_items").insert(
    items.map((item: any) => ({
      order_id: order.id,
      product_id: item.productId,
      name: item.name,
      quantity: item.quantity,
      unit_price: item.unitPrice,
      total: item.total,
    })),
  );

  const preference = await fetch("https://api.mercadopago.com/checkout/preferences", {
    method: "POST",
    headers: {
      authorization: `Bearer ${process.env.MERCADO_PAGO_ACCESS_TOKEN}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      external_reference: order.id,
      notification_url: `${process.env.APP_URL}/api/webhooks/mercadopago`,
      items: items.map((item: any) => ({
        title: item.name,
        quantity: item.quantity,
        unit_price: item.unitPrice,
        currency_id: "BRL",
      })),
      payer: {
        name: customer.name,
        phone: { number: customer.phone },
      },
      back_urls: {
        success: `${process.env.APP_URL}/pedido/aprovado`,
        failure: `${process.env.APP_URL}/pedido/erro`,
        pending: `${process.env.APP_URL}/pedido/pendente`,
      },
      auto_return: "approved",
    }),
  }).then((response) => response.json());

  return NextResponse.json({
    ok: true,
    order,
    checkoutUrl: preference.init_point,
    preferenceId: preference.id,
  });
}
