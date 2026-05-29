const categories = ["Todos", "Hambúrgueres", "Dogões", "Combos", "Salgados", "Bebidas"];

const productVisuals = {
  burger: { className: "visual-burger", pos: "46% 56%", zoom: "140%", fallbackZoom: "140%" },
  dog: { className: "visual-dog", pos: "38% 60%", zoom: "155%", fallbackZoom: "155%" },
  combo: { className: "visual-combo", pos: "64% 56%", zoom: "150%", fallbackZoom: "150%" },
  salgado: { className: "visual-salgado", pos: "52% 76%", zoom: "170%", fallbackZoom: "170%" },
  drink: { className: "visual-drink", pos: "50% 50%", zoom: "86%", fallbackZoom: "165%" },
};

const products = [
  {
    id: "smash-duplo",
    category: "Hambúrgueres",
    name: "Avalanche Smash Duplo",
    description: "Dois smashs, cheddar derretido, bacon crocante e molho da casa.",
    price: 32.9,
    badge: "mais pedido",
    visual: "burger",
    image: "/images/avalanche/smash-duplo.jpg",
  },
  {
    id: "furacao-bacon",
    category: "Hambúrgueres",
    name: "Furacão Bacon",
    description: "Blend alto, pão tostado, cebola na chapa e uma pancada de bacon.",
    price: 36.9,
    badge: "brutal",
    visual: "burger",
    image: "/images/avalanche/furacao-bacon.jpg",
  },
  {
    id: "prensado-da-casa",
    category: "Hambúrgueres",
    name: "Prensado da Casa",
    description: "Lanche prensado brasileiro, queijo puxando e molho cremoso.",
    price: 27.9,
    badge: "raiz",
    visual: "burger",
    image: "/images/avalanche/prensado-da-casa.jpg",
  },
  {
    id: "dogao-avalanche",
    category: "Dogões",
    name: "Dogão Avalanche",
    description: "Salsicha, purê, milho, vinagrete, batata palha e três molhos.",
    price: 24.9,
    badge: "gigante",
    visual: "dog",
    image: "/images/avalanche/dogao-avalanche.jpg",
  },
  {
    id: "dogao-catupiry",
    category: "Dogões",
    name: "Dogão Catupiry",
    description: "Dogão exagerado com catupiry, cheddar, bacon e batata palha.",
    price: 28.9,
    badge: "cremoso",
    visual: "dog",
    image: "/images/avalanche/dogao-catupiry.jpg",
  },
  {
    id: "combo-ataque",
    category: "Combos",
    name: "Combo Ataque Total",
    description: "Smash duplo, fritas crocantes e guaraná caçulinha gelado.",
    price: 44.9,
    badge: "combo",
    visual: "combo",
    image: "/images/avalanche/combo-ataque-total.jpg",
  },
  {
    id: "combo-dupla",
    category: "Combos",
    name: "Combo Dupla Nevasca",
    description: "Dois lanches prensados, fritas grandes e refrigerante 1L.",
    price: 74.9,
    badge: "dupla",
    visual: "combo",
    image: "/images/avalanche/combo-dupla-nevasca.jpg",
  },
  {
    id: "coxinha-cremosa",
    category: "Salgados",
    name: "Coxinha Cremosa",
    description: "Massa dourada, recheio molhadinho e final crocante.",
    price: 8.9,
    badge: "dourada",
    visual: "salgado",
    image: "/images/avalanche/coxinha-cremosa.jpg",
  },
  {
    id: "kit-salgados",
    category: "Salgados",
    name: "Kit Salgados Avalanche",
    description: "Porção mista com coxinha, risole, bolinha de queijo e quibe.",
    price: 34.9,
    badge: "festa",
    visual: "salgado",
    image: "/images/avalanche/kit-salgados-avalanche.jpg",
  },
  {
    id: "guarana-caculinha",
    category: "Bebidas",
    name: "Guaraná Caçulinha",
    description: "Gelado no ponto para fechar o pedido sem dó.",
    price: 6.9,
    badge: "gelado",
    visual: "drink",
    image: "/images/avalanche/guarana-caculinha.jpg",
  },
  {
    id: "refri-litro",
    category: "Bebidas",
    name: "Refrigerante 1L",
    description: "Escolha o sabor no atendimento e manda junto com o combo.",
    price: 12.9,
    badge: "família",
    visual: "drink",
    image: "/images/avalanche/refrigerante-1l.jpg",
  },
];

const statusFlow = ["Novo", "Em preparo", "Saiu para entrega", "Finalizado"];
const money = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
const CART_KEY = "avalanche-cart-v1";
const ORDERS_KEY = "avalanche-orders-v1";

if (new URLSearchParams(window.location.search).has("reset")) {
  localStorage.removeItem(CART_KEY);
  localStorage.removeItem(ORDERS_KEY);
}

const state = {
  category: "Todos",
  cart: readJson(CART_KEY, []),
  orders: readJson(ORDERS_KEY, []),
  coupon: "",
  payment: "Mercado Pago",
  sound: true,
};

const els = {
  loader: document.getElementById("loader"),
  categoryRail: document.getElementById("categoryRail"),
  productGrid: document.getElementById("productGrid"),
  cartPanel: document.getElementById("cartPanel"),
  openCart: document.getElementById("openCart"),
  closeCart: document.getElementById("closeCart"),
  mobileCart: document.getElementById("mobileCart"),
  cartItems: document.getElementById("cartItems"),
  cartTotals: document.getElementById("cartTotals"),
  cartCount: document.getElementById("cartCount"),
  orderNotes: document.getElementById("orderNotes"),
  couponInput: document.getElementById("couponInput"),
  applyCoupon: document.getElementById("applyCoupon"),
  finishOrder: document.getElementById("finishOrder"),
  checkoutModal: document.getElementById("checkoutModal"),
  closeCheckout: document.getElementById("closeCheckout"),
  payOrder: document.getElementById("payOrder"),
  paymentOptions: document.getElementById("paymentOptions"),
  gatewayStatus: document.getElementById("gatewayStatus"),
  gatewayLight: document.getElementById("gatewayLight"),
  customerName: document.getElementById("customerName"),
  customerPhone: document.getElementById("customerPhone"),
  customerAddress: document.getElementById("customerAddress"),
  ordersBoard: document.getElementById("ordersBoard"),
  adminMetrics: document.getElementById("adminMetrics"),
  soundToggle: document.getElementById("soundToggle"),
  paperSize: document.getElementById("paperSize"),
  thermalReceipt: document.getElementById("thermalReceipt"),
  burstLayer: document.getElementById("burstLayer"),
  toastStack: document.getElementById("toastStack"),
  categoryOpen: document.getElementById("categoryOpen"),
};

const orderChannel = "BroadcastChannel" in window ? new BroadcastChannel("avalanche-orders") : null;

document.addEventListener("DOMContentLoaded", () => {
  renderCategories();
  renderProducts();
  renderCart();
  renderAdmin();
  bindEvents();
  setupSwipe();
  registerServiceWorker();
  setTimeout(() => els.loader?.classList.add("is-hidden"), 1450);
});

function bindEvents() {
  els.openCart?.addEventListener("click", openCart);
  els.mobileCart?.addEventListener("click", openCart);
  els.closeCart?.addEventListener("click", closeCart);
  els.cartPanel?.addEventListener("click", (event) => {
    if (event.target === els.cartPanel) closeCart();
  });
  els.closeCheckout?.addEventListener("click", closeCheckout);
  els.checkoutModal?.addEventListener("click", (event) => {
    if (event.target === els.checkoutModal) closeCheckout();
  });

  document.querySelector("[data-scroll-admin]")?.addEventListener("click", () => {
    document.getElementById("admin").scrollIntoView({ behavior: "smooth", block: "start" });
  });

  els.categoryOpen?.addEventListener("click", () => {
    els.categoryRail.scrollIntoView({ behavior: "smooth", block: "center" });
  });

  els.categoryRail?.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-category]");
    if (!button) return;
    state.category = button.dataset.category;
    renderCategories();
    renderProducts();
  });

  els.productGrid?.addEventListener("click", (event) => {
    const button = event.target.closest("[data-add]");
    if (!button) return;
    addToCart(button.dataset.add);
    spawnBurst(event.clientX, event.clientY, 13);
  });

  els.productGrid?.addEventListener("mousemove", (event) => {
    const card = event.target.closest(".product-card");
    if (!card) return;
    const box = card.getBoundingClientRect();
    card.style.setProperty("--mx", `${((event.clientX - box.left) / box.width) * 100}%`);
    card.style.setProperty("--my", `${((event.clientY - box.top) / box.height) * 100}%`);
  });

  els.cartItems?.addEventListener("click", (event) => {
    const control = event.target.closest("[data-qty]");
    if (!control) return;
    changeQuantity(control.dataset.id, Number(control.dataset.qty));
  });

  els.applyCoupon?.addEventListener("click", applyCoupon);
  els.couponInput?.addEventListener("keydown", (event) => {
    if (event.key === "Enter") applyCoupon();
  });

  els.finishOrder?.addEventListener("click", () => {
    if (!state.cart.length) {
      toast("Carrinho vazio", "Escolha uma avalanche primeiro.");
      return;
    }
    openCheckout();
  });

  els.paymentOptions?.addEventListener("click", (event) => {
    const option = event.target.closest("[data-payment]");
    if (!option) return;
    state.payment = option.dataset.payment;
    [...els.paymentOptions.children].forEach((button) => button.classList.remove("active"));
    option.classList.add("active");
    els.gatewayStatus.textContent = `${state.payment} selecionado.`;
  });

  els.payOrder?.addEventListener("click", submitCheckout);

  els.ordersBoard?.addEventListener("click", (event) => {
    const statusButton = event.target.closest("[data-next-status]");
    const printButton = event.target.closest("[data-print]");
    if (statusButton) {
      updateOrderStatus(statusButton.dataset.orderId, statusButton.dataset.nextStatus);
    }
    if (printButton) {
      const order = state.orders.find((item) => item.id === printButton.dataset.print);
      if (order) printOrder(order);
    }
  });

  els.soundToggle?.addEventListener("click", () => {
    state.sound = !state.sound;
    els.soundToggle.textContent = state.sound ? "Som ON" : "Som OFF";
    if (state.sound) playNotification();
  });

  orderChannel?.addEventListener("message", (event) => {
    if (event.data?.type !== "order-created") return;
    state.orders = readJson(ORDERS_KEY, []);
    renderAdmin();
    if (els.adminMetrics) playNotification();
  });
}

function renderCategories() {
  if (!els.categoryRail) return;
  els.categoryRail.innerHTML = categories
    .map(
      (category) => `
        <button class="${category === state.category ? "active" : ""}" type="button" data-category="${category}">
          ${category}
        </button>
      `,
    )
    .join("");
}

function renderProducts() {
  if (!els.productGrid) return;
  const list =
    state.category === "Todos"
      ? products
      : products.filter((product) => product.category === state.category);

  els.productGrid.innerHTML = list
    .map((product) => {
      const visual = productVisuals[product.visual];
      return `
        <article class="product-card" tabindex="0">
          <div class="product-media ${visual.className}" style="${productImageStyle(product, visual)}">
            <span class="product-badge">${product.badge}</span>
          </div>
          <div class="product-body">
            <h3>${product.name}</h3>
            <p>${product.description}</p>
            <div class="product-foot">
              <span class="price">${money.format(product.price)}</span>
              <button class="product-add" type="button" data-add="${product.id}">Adicionar</button>
            </div>
          </div>
        </article>
      `;
    })
    .join("");
}

function productImageStyle(product, visual) {
  return [
    `--product-image:url('${product.image}')`,
    `--pos:${visual.pos}`,
    `--zoom:${visual.zoom}`,
    `--fallback-zoom:${visual.fallbackZoom}`,
  ].join(";");
}

function renderCart() {
  if (!els.cartItems || !els.cartTotals || !els.cartCount) return;
  const enriched = state.cart.map((item) => ({
    ...item,
    product: products.find((product) => product.id === item.id),
  }));

  els.cartItems.innerHTML = enriched.length
    ? enriched
        .map(({ product, qty }) => {
          const visual = productVisuals[product.visual];
          return `
            <article class="cart-item">
              <div class="cart-thumb" style="${productImageStyle(product, visual)}"></div>
              <div>
                <h3>${product.name}</h3>
                <p>${money.format(product.price * qty)}</p>
                <div class="qty-row">
                  <button type="button" data-id="${product.id}" data-qty="-1" aria-label="Diminuir">−</button>
                  <strong>${qty}</strong>
                  <button type="button" data-id="${product.id}" data-qty="1" aria-label="Aumentar">+</button>
                </div>
              </div>
            </article>
          `;
        })
        .join("")
    : `<div class="empty-state">Seu pedido ainda está esperando o primeiro impacto.</div>`;

  const totals = getTotals();
  els.cartTotals.innerHTML = `
    <div class="total-line"><span>Subtotal</span><strong>${money.format(totals.subtotal)}</strong></div>
    <div class="total-line"><span>Entrega</span><strong>${money.format(totals.delivery)}</strong></div>
    <div class="total-line"><span>Desconto</span><strong>-${money.format(totals.discount)}</strong></div>
    <div class="total-line final"><span>Total</span><strong>${money.format(totals.total)}</strong></div>
  `;
  els.cartCount.textContent = state.cart.reduce((sum, item) => sum + item.qty, 0);
  saveJson(CART_KEY, state.cart);
}

function renderAdmin() {
  if (!els.adminMetrics || !els.ordersBoard) return;
  const totals = state.orders.reduce(
    (acc, order) => {
      acc.count += 1;
      acc.revenue += order.totals.total;
      if (order.status === "Novo") acc.new += 1;
      if (order.status === "Saiu para entrega") acc.delivery += 1;
      return acc;
    },
    { count: 0, new: 0, delivery: 0, revenue: 0 },
  );

  els.adminMetrics.innerHTML = `
    <article class="metric-card"><span>Pedidos hoje</span><strong>${totals.count}</strong></article>
    <article class="metric-card"><span>Novos</span><strong>${totals.new}</strong></article>
    <article class="metric-card"><span>Em rota</span><strong>${totals.delivery}</strong></article>
    <article class="metric-card"><span>Faturamento</span><strong>${money.format(totals.revenue)}</strong></article>
  `;

  els.ordersBoard.innerHTML = statusFlow
    .map((status) => {
      const orders = state.orders.filter((order) => order.status === status);
      return `
        <section class="order-column">
          <h3>${status}</h3>
          ${
            orders.length
              ? orders.map(renderOrderCard).join("")
              : `<div class="empty-state">Sem pedidos</div>`
          }
        </section>
      `;
    })
    .join("");
}

function renderOrderCard(order) {
  const next = getNextStatus(order.status);
  const itemSummary = order.items
    .slice(0, 3)
    .map((item) => `<li>${item.qty}× ${escapeHtml(item.name)}</li>`)
    .join("");
  const extra = order.items.length > 3 ? `<li>+${order.items.length - 3} itens</li>` : "";

  return `
    <article class="order-card">
      <header>
        <strong>${order.number}</strong>
        <small>${formatTime(order.createdAt)}</small>
      </header>
      <p>${escapeHtml(order.customer.name)} • ${escapeHtml(order.payment)}</p>
      <ul>${itemSummary}${extra}</ul>
      <strong>${money.format(order.totals.total)}</strong>
      <small>Fila térmica: ${order.printQueued ? "enviado" : "manual"}</small>
      <div class="order-actions">
        <button class="print-btn" type="button" data-print="${order.id}">IMPRIMIR</button>
        ${
          next
            ? `<button class="status-btn" type="button" data-order-id="${order.id}" data-next-status="${next}">${next}</button>`
            : `<button class="status-btn" type="button" disabled>OK</button>`
        }
      </div>
    </article>
  `;
}

function addToCart(id) {
  const item = state.cart.find((cartItem) => cartItem.id === id);
  const product = products.find((entry) => entry.id === id);
  if (!product) return;
  if (item) item.qty += 1;
  else state.cart.push({ id, qty: 1 });
  renderCart();
  toast("Adicionado", product.name);
}

function changeQuantity(id, delta) {
  const item = state.cart.find((cartItem) => cartItem.id === id);
  if (!item) return;
  item.qty += delta;
  state.cart = state.cart.filter((cartItem) => cartItem.qty > 0);
  renderCart();
}

function applyCoupon() {
  const code = els.couponInput.value.trim().toUpperCase();
  if (!code) {
    state.coupon = "";
    renderCart();
    return;
  }
  if (code === "AVALANCHE10") {
    state.coupon = code;
    toast("Cupom aplicado", "AVALANCHE10 liberou 10%.");
  } else {
    state.coupon = "";
    toast("Cupom inválido", "Esse código não pegou.");
  }
  renderCart();
}

function getTotals() {
  const subtotal = state.cart.reduce((sum, item) => {
    const product = products.find((entry) => entry.id === item.id);
    return sum + (product ? product.price * item.qty : 0);
  }, 0);
  const delivery = subtotal > 0 ? 6.99 : 0;
  const discount = state.coupon === "AVALANCHE10" ? subtotal * 0.1 : 0;
  return {
    subtotal,
    delivery,
    discount,
    total: Math.max(0, subtotal + delivery - discount),
  };
}

function openCart() {
  if (!els.cartPanel) return;
  els.cartPanel.classList.add("open");
  els.cartPanel.setAttribute("aria-hidden", "false");
  document.body.classList.add("cart-open");
}

function closeCart() {
  if (!els.cartPanel) return;
  els.cartPanel.classList.remove("open");
  els.cartPanel.setAttribute("aria-hidden", "true");
  document.body.classList.remove("cart-open");
}

function openCheckout() {
  if (!els.checkoutModal) return;
  els.checkoutModal.classList.add("open");
  els.checkoutModal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
  if (els.gatewayStatus) els.gatewayStatus.textContent = `${state.payment} selecionado.`;
  setTimeout(() => els.customerName?.focus(), 120);
}

function closeCheckout() {
  if (!els.checkoutModal) return;
  els.checkoutModal.classList.remove("open");
  els.checkoutModal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
}

async function submitCheckout() {
  const customer = {
    name: els.customerName.value.trim(),
    phone: els.customerPhone.value.trim(),
    address: els.customerAddress.value.trim(),
  };
  if (!customer.name || !customer.phone || !customer.address) {
    toast("Checkout incompleto", "Preencha nome, WhatsApp e endereço.");
    return;
  }
  if (!state.cart.length) {
    toast("Carrinho vazio", "Escolha os itens antes de pagar.");
    return;
  }

  els.payOrder.disabled = true;
  els.payOrder.textContent = "PROCESSANDO";
  const steps = [
    `Criando preferência no ${state.payment}...`,
    "Pagamento aprovado.",
    "Webhook recebido.",
    "Pedido no painel e fila térmica pronta.",
  ];

  for (const step of steps) {
    els.gatewayStatus.textContent = step;
    els.gatewayLight.style.background = step.includes("aprovado") ? "#39d7ff" : "#ffcf24";
    await wait(640);
  }

  const order = createOrder(customer);
  state.orders.unshift(order);
  saveJson(ORDERS_KEY, state.orders);
  orderChannel?.postMessage({ type: "order-created", orderId: order.id });
  renderAdmin();
  if (els.adminMetrics) playNotification();

  state.cart = [];
  state.coupon = "";
  if (els.couponInput) els.couponInput.value = "";
  if (els.orderNotes) els.orderNotes.value = "";
  renderCart();
  closeCheckout();
  closeCart();
  toast("Pedido aprovado", `${order.number} entrou no painel.`);

  els.payOrder.disabled = false;
  els.payOrder.textContent = "PAGAR E ENVIAR";
  if (els.gatewayStatus) els.gatewayStatus.textContent = "Gateway aguardando confirmação.";
}

function createOrder(customer) {
  const totals = getTotals();
  const items = state.cart
    .map((item) => {
      const product = products.find((entry) => entry.id === item.id);
      return {
        id: item.id,
        name: product.name,
        qty: item.qty,
        unitPrice: product.price,
        total: product.price * item.qty,
      };
    })
    .filter(Boolean);

  const id = `av-${Date.now().toString(36)}`;
  return {
    id,
    number: `#${String(Date.now()).slice(-6)}`,
    customer,
    items,
    notes: els.orderNotes?.value.trim() || "",
    payment: state.payment,
    totals,
    status: "Novo",
    createdAt: new Date().toISOString(),
    printQueued: true,
  };
}

function updateOrderStatus(id, status) {
  state.orders = state.orders.map((order) => (order.id === id ? { ...order, status } : order));
  saveJson(ORDERS_KEY, state.orders);
  renderAdmin();
  toast("Status atualizado", status);
}

function getNextStatus(status) {
  const index = statusFlow.indexOf(status);
  return statusFlow[index + 1] || "";
}

function printOrder(order) {
  if (!els.thermalReceipt || !els.paperSize) return;
  const paper = els.paperSize.value === "58" ? "58mm" : "80mm";
  document.documentElement.style.setProperty("--paper-width", paper);
  els.thermalReceipt.innerHTML = `
    <h1>AVALANCHE</h1>
    <h2>${escapeHtml(order.number)}</h2>
    <p>${formatDateTime(order.createdAt)}</p>
    <hr />
    <p><strong>Cliente:</strong> ${escapeHtml(order.customer.name)}</p>
    <p><strong>WhatsApp:</strong> ${escapeHtml(order.customer.phone)}</p>
    <p><strong>Endereço:</strong> ${escapeHtml(order.customer.address)}</p>
    <hr />
    ${order.items
      .map(
        (item) => `
          <p>${item.qty}x ${escapeHtml(item.name)}</p>
          <p>${money.format(item.unitPrice)} | ${money.format(item.total)}</p>
        `,
      )
      .join("")}
    <hr />
    <p><strong>Obs:</strong> ${escapeHtml(order.notes || "Sem observações")}</p>
    <p><strong>Pagamento:</strong> ${escapeHtml(order.payment)}</p>
    <p><strong>Subtotal:</strong> ${money.format(order.totals.subtotal)}</p>
    <p><strong>Entrega:</strong> ${money.format(order.totals.delivery)}</p>
    <p><strong>Desconto:</strong> -${money.format(order.totals.discount)}</p>
    <h2>TOTAL ${money.format(order.totals.total)}</h2>
    <hr />
    <p>Obrigado pela preferência.</p>
  `;
  window.print();
}

function playNotification() {
  if (!state.sound) return;
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    const context = new AudioContext();
    const now = context.currentTime;
    [660, 880, 1180].forEach((frequency, index) => {
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      oscillator.frequency.value = frequency;
      oscillator.type = "triangle";
      gain.gain.setValueAtTime(0.0001, now + index * 0.09);
      gain.gain.exponentialRampToValueAtTime(0.18, now + index * 0.09 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + index * 0.09 + 0.12);
      oscillator.connect(gain).connect(context.destination);
      oscillator.start(now + index * 0.09);
      oscillator.stop(now + index * 0.09 + 0.14);
    });
  } catch {
    state.sound = false;
    if (els.soundToggle) els.soundToggle.textContent = "Som OFF";
  }
}

function toast(title, message) {
  if (!els.toastStack) return;
  const node = document.createElement("div");
  node.className = "toast";
  node.innerHTML = `<strong>${escapeHtml(title)}</strong><span>${escapeHtml(message)}</span>`;
  els.toastStack.appendChild(node);
  setTimeout(() => node.remove(), 3200);
}

function spawnBurst(x, y, count = 10) {
  if (!els.burstLayer) return;
  for (let index = 0; index < count; index += 1) {
    const spark = document.createElement("i");
    const angle = (Math.PI * 2 * index) / count;
    const distance = 36 + Math.random() * 42;
    spark.className = "spark";
    spark.style.left = `${x}px`;
    spark.style.top = `${y}px`;
    spark.style.setProperty("--dx", `${Math.cos(angle) * distance}px`);
    spark.style.setProperty("--dy", `${Math.sin(angle) * distance}px`);
    els.burstLayer.appendChild(spark);
    setTimeout(() => spark.remove(), 740);
  }
}

function setupSwipe() {
  if (!els.cartPanel) return;
  let startX = 0;
  let startY = 0;
  let edgeSwipe = false;

  window.addEventListener(
    "touchstart",
    (event) => {
      const touch = event.touches[0];
      startX = touch.clientX;
      startY = touch.clientY;
      edgeSwipe = startX > window.innerWidth - 34;
    },
    { passive: true },
  );

  window.addEventListener(
    "touchend",
    (event) => {
      const touch = event.changedTouches[0];
      const dx = touch.clientX - startX;
      const dy = Math.abs(touch.clientY - startY);
      if (edgeSwipe && dx < -56 && dy < 80) openCart();
      if (els.cartPanel.classList.contains("open") && dx > 74 && dy < 80) closeCart();
    },
    { passive: true },
  );
}

function registerServiceWorker() {
  if (!("serviceWorker" in navigator)) return;
  navigator.serviceWorker.register("service-worker.js").catch(() => {});
}

function readJson(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(key)) || fallback;
  } catch {
    return fallback;
  }
}

function saveJson(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function formatTime(value) {
  return new Intl.DateTimeFormat("pt-BR", { hour: "2-digit", minute: "2-digit" }).format(
    new Date(value),
  );
}

function formatDateTime(value) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (char) => {
    const map = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" };
    return map[char];
  });
}
