type ThermalOrder = {
  number: string;
  createdAt: string;
  customer: { name: string; phone: string; address: string };
  items: Array<{ name: string; quantity: number; unitPrice: number; total: number }>;
  notes?: string;
  paymentMethod: string;
  subtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
};

const brl = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

export function buildThermalReceipt(order: ThermalOrder, paper: 58 | 80 = 80) {
  const width = paper === 58 ? 32 : 48;
  const line = "-".repeat(width);
  const center = (text: string) => text.slice(0, width).padStart(Math.floor((width + text.length) / 2));
  const row = (left: string, right: string) => {
    const cleanLeft = left.slice(0, width - right.length - 1);
    return `${cleanLeft}${" ".repeat(Math.max(1, width - cleanLeft.length - right.length))}${right}`;
  };

  return [
    center("AVALANCHE"),
    center("LANCHES E SALGADOS"),
    line,
    `PEDIDO ${order.number}`,
    new Date(order.createdAt).toLocaleString("pt-BR"),
    line,
    `CLIENTE: ${order.customer.name}`,
    `TEL: ${order.customer.phone}`,
    `END: ${order.customer.address}`,
    line,
    ...order.items.flatMap((item) => [
      `${item.quantity}x ${item.name}`.slice(0, width),
      row(brl.format(item.unitPrice), brl.format(item.total)),
    ]),
    line,
    `OBS: ${order.notes || "Sem observacoes"}`.slice(0, width),
    `PAGAMENTO: ${order.paymentMethod}`,
    row("SUBTOTAL", brl.format(order.subtotal)),
    row("ENTREGA", brl.format(order.deliveryFee)),
    row("DESCONTO", `-${brl.format(order.discount)}`),
    row("TOTAL", brl.format(order.total)),
    line,
    center("OBRIGADO PELA PREFERENCIA"),
    "\n\n\n",
  ].join("\n");
}

export async function sendToThermalPrinter(order: ThermalOrder, paper: 58 | 80 = 80) {
  const receipt = buildThermalReceipt(order, paper);

  await fetch(process.env.PRINT_BRIDGE_URL!, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${process.env.PRINT_BRIDGE_TOKEN}`,
    },
    body: JSON.stringify({
      printer: process.env.THERMAL_PRINTER_NAME,
      paper,
      encoding: "cp850",
      cut: true,
      receipt,
    }),
  });
}
