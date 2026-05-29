# Contrato de tempo real

Base recomendada: Next.js App Router + Supabase Realtime.

## Canais

`orders:admin`

Eventos:

- `INSERT public.orders`: pedido aprovado entrou no painel.
- `UPDATE public.orders.status`: mudança de Novo, Em preparo, Saiu para entrega ou Finalizado.
- `UPDATE public.orders.print_queued`: pedido enviado para fila térmica.

## Checkout

1. `POST /api/checkout` cria o cliente, o pedido com `payment_status = pending` e a preferência do Mercado Pago.
2. O gateway recebe Pix, cartão, Google Pay ou Apple Pay quando disponível na conta.
3. `POST /api/webhooks/mercadopago` valida o pagamento no Mercado Pago.
4. Se aprovado, atualiza `payment_status = approved`, `status = Novo` e `print_queued = true`.
5. O painel assinado no Supabase Realtime recebe o pedido instantaneamente.
6. `POST /api/print` monta o cupom e envia para o bridge local da impressora térmica.

## Variáveis

```txt
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
MERCADO_PAGO_ACCESS_TOKEN=
APP_URL=
INTERNAL_PRINT_KEY=
PRINT_BRIDGE_URL=
PRINT_BRIDGE_TOKEN=
THERMAL_PRINTER_NAME=
```
