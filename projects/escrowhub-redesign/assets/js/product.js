(function () {
  const params = new URLSearchParams(location.search);
  const item = EH.getItem(params.get("id") || "spotify");

  const page = document.querySelector("[data-product-page]");
  const notFound = document.querySelector("[data-not-found]");
  const mobileBar = document.querySelector("[data-mobile-buybar]");

  function hideProduct() {
    document.querySelector(".product-head")?.remove();
    document.querySelector(".product-layout")?.remove();
    document.querySelector(".similar")?.remove();
    document.querySelector(".product-crumbs")?.remove();
    if (notFound) notFound.hidden = false;
    if (mobileBar) mobileBar.remove();
    document.title = "Товар не найден — EscrowHub";
  }

  if (!item || item.status !== "active") {
    hideProduct();
    return;
  }

  const seller = EH.sellers[item.sellerId] || EH.seller;
  const category = EH.getCategory(item.category);
  const out = item.stock === 0;
  let qty = 1;

  document.title = item.fullTitle + " — купить на EscrowHub";
  document.querySelectorAll(".cat-nav a, .drawer__link").forEach((link) => {
    if ((link.getAttribute("href") || "").includes("category=" + item.category)) link.classList.add("is-active");
  });
  document.body.dataset.category = item.category;

  function plural(number, one, few, many) {
    const n = Math.abs(number) % 100;
    const n1 = n % 10;
    if (n > 10 && n < 20) return many;
    if (n1 > 1 && n1 < 5) return few;
    if (n1 === 1) return one;
    return many;
  }
  function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char]));
  }

  /* breadcrumbs */
  const crumbs = document.querySelector("[data-product-crumbs]");
  if (crumbs) {
    crumbs.innerHTML = `<a href="index.html">Главная</a><span class="sep">/</span>
      <a href="catalog.html">Каталог</a><span class="sep">/</span>
      <a href="catalog.html?category=${item.category}">${category.name}</a><span class="sep">/</span>
      <span class="current" aria-current="page">${item.title}</span>`;
  }

  /* header */
  const badges = document.querySelector("[data-product-badges]");
  if (badges) {
    badges.innerHTML = `<span class="tag">${category.name}</span>
      <span class="tag tag--outline">${seller.deals === 0 ? "Новый продавец" : "Продавец"}</span>
      ${out ? '<span class="tag tag--red">Нет в наличии</span>' : `<span class="tag tag--green">В наличии · ${item.stock} ${item.unit}</span>`}`;
  }
  const title = document.querySelector("[data-product-title]");
  if (title) title.textContent = item.fullTitle;
  const meta = document.querySelector("[data-product-meta]");
  if (meta) {
    meta.innerHTML = `<span><svg class="icon"><use href="#i-clock"></use></svg>Выдача ${item.delivery}</span>
      <span class="sep">·</span>
      <span><svg class="icon"><use href="#i-eye"></use></svg>${item.views} ${plural(item.views, "просмотр", "просмотра", "просмотров")}</span>
      <span class="sep">·</span>
      <span>Опубликовано ${item.published}</span>
      <span class="sep">·</span>
      <span>${item.region}</span>`;
  }

  /* cover + facts */
  const cover = document.querySelector("[data-product-cover]");
  if (cover) cover.innerHTML = EH.coverHTML(item, { size: "lg" });
  const facts = document.querySelector("[data-product-facts]");
  if (facts) {
    facts.innerHTML = `
      <div class="product-fact">
        <span class="product-fact__icon"><svg class="icon"><use href="#i-route"></use></svg></span>
        <div><span>Регион</span><b>${item.region}</b></div>
      </div>
      <div class="product-fact">
        <span class="product-fact__icon"><svg class="icon"><use href="#i-package"></use></svg></span>
        <div><span>Формат</span><b>${item.format}</b></div>
      </div>
      <div class="product-fact">
        <span class="product-fact__icon"><svg class="icon"><use href="#i-clock"></use></svg></span>
        <div><span>Выдача</span><b>${item.delivery}</b></div>
      </div>`;
  }

  /* content */
  const description = document.querySelector("[data-product-description]");
  if (description) description.innerHTML = item.description.map((p) => `<p>${p}</p>`).join("");
  const includes = document.querySelector("[data-product-includes]");
  if (includes) includes.innerHTML = item.includes.map((text) => `<li>${text}</li>`).join("");
  const conditions = document.querySelector("[data-product-conditions]");
  if (conditions) conditions.innerHTML = item.conditions.map((text) => `<li>${text}</li>`).join("");

  /* seller */
  const sellerPanel = document.querySelector("[data-product-seller]");
  if (sellerPanel) {
    sellerPanel.innerHTML = `
      <span class="avatar avatar--lg">${seller.initial}</span>
      <div class="seller-panel__info">
        <div class="seller-panel__name">
          <h3>${seller.name}</h3>
          ${seller.deals === 0 ? '<span class="tag tag--outline">Новый продавец</span>' : '<span class="tag tag--green">Продавец</span>'}
          <span class="seller-panel__handle">${seller.handle}</span>
        </div>
        <div class="seller-panel__stats">
          <span><svg class="icon"><use href="#i-package"></use></svg>${seller.deals} завершённых сделок</span>
          <span><svg class="icon"><use href="#i-star"></use></svg>${seller.reviews} отзывов</span>
          <span><svg class="icon"><use href="#i-clock"></use></svg>на EscrowHub с ${seller.joined}</span>
        </div>
        <p class="seller-panel__note">Рейтинг появится после первой завершённой сделки. До подтверждения оплата остаётся в сервисе.</p>
      </div>
      <div class="seller-panel__actions">
        <button class="btn btn--ghost btn--sm" type="button" data-open-chat><svg class="icon"><use href="#i-message"></use></svg>Написать</button>
        <a class="btn btn--ghost btn--sm" href="catalog.html?q=${encodeURIComponent(seller.name)}">Все товары</a>
      </div>`;
  }
  const reviewsCount = document.querySelector("[data-reviews-count]");
  if (reviewsCount) reviewsCount.textContent = seller.reviews;

  /* sidebar + favourites */
  const priceNode = document.querySelector("[data-product-price]");
  if (priceNode) priceNode.textContent = EH.formatPrice(item.price);
  const stockNode = document.querySelector("[data-product-stock]");
  if (stockNode) stockNode.textContent = out ? "Нет в наличии" : `В наличии · ${item.stock} ${item.unit}`;

  document.querySelectorAll("[data-fav]").forEach((button) => {
    button.dataset.fav = item.id;
  });
  EH.syncFavs();

  const miniSeller = document.querySelector("[data-product-seller-mini]");
  if (miniSeller) {
    miniSeller.innerHTML = `
      <span class="avatar">${seller.initial}</span>
      <div><b>${seller.name}</b><small>${seller.deals === 0 ? "Новый продавец" : `${seller.deals} сделок`}</small></div>
      <svg class="icon"><use href="#i-chevron-right"></use></svg>`;
  }

  const qtyInput = document.querySelector("[data-qty]");
  const checkoutQtyInput = document.querySelector("[data-checkout-qty]");
  const plusButtons = Array.from(document.querySelectorAll("[data-qty-plus], [data-checkout-plus]"));
  const minusButtons = Array.from(document.querySelectorAll("[data-qty-minus], [data-checkout-minus]"));

  function maxQty() {
    return Math.max(1, item.stock);
  }

  function syncTotals() {
    const subtotal = item.price * qty;
    document.querySelectorAll("[data-product-subtotal]").forEach((n) => { n.textContent = EH.formatPrice(subtotal); });
    document.querySelectorAll("[data-product-total], [data-checkout-total], [data-order-total]").forEach((n) => { n.textContent = EH.formatPrice(subtotal); });
    document.querySelectorAll("[data-checkout-subtotal]").forEach((n) => { n.textContent = EH.formatPrice(subtotal); });
    if (qtyInput) qtyInput.value = qty;
    if (checkoutQtyInput) checkoutQtyInput.value = qty;
    const mobileLabel = document.querySelector("[data-mobile-label]");
    if (mobileLabel) mobileLabel.textContent = `${item.cover.brand} · ${qty} шт.`;
    const mobilePrice = document.querySelector("[data-mobile-price]");
    if (mobilePrice) mobilePrice.textContent = EH.formatPrice(subtotal);
  }

  function setQty(next) {
    qty = Math.max(1, Math.min(maxQty(), Number(next) || 1));
    syncTotals();
    plusButtons.forEach((b) => { b.disabled = qty >= maxQty() || out; });
    minusButtons.forEach((b) => { b.disabled = qty <= 1 || out; });
  }

  plusButtons.forEach((button) => button.addEventListener("click", () => setQty(qty + 1)));
  minusButtons.forEach((button) => button.addEventListener("click", () => setQty(qty - 1)));
  [qtyInput, checkoutQtyInput].forEach((input) => {
    input?.addEventListener("change", () => setQty(input.value));
    input?.addEventListener("input", () => {
      if (input.value.length > 3) input.value = input.value.slice(0, 3);
    });
  });

  if (out) {
    document.querySelectorAll("[data-open-checkout]").forEach((button) => {
      button.disabled = true;
      if (button.closest(".mobile-buybar")) button.textContent = "Нет в наличии";
      if (button.closest(".deal-card")) button.innerHTML = "Нет в наличии";
    });
    [qtyInput, checkoutQtyInput].forEach((input) => { if (input) input.disabled = true; });
    plusButtons.forEach((b) => { b.disabled = true; });
    minusButtons.forEach((b) => { b.disabled = true; });
  } else {
    setQty(1);
  }

  /* similar */
  const similar = document.querySelector("[data-similar]");
  if (similar) {
    const list = EH.activeItems()
      .filter((candidate) => candidate.id !== item.id && candidate.stock > 0)
      .sort((a, b) => b.popularity - a.popularity)
      .slice(0, 3);
    similar.innerHTML = list.map(EH.lotHTML).join("");
    EH.syncFavs();
  }

  /* share */
  document.querySelector("[data-share]")?.addEventListener("click", async function () {
    const url = location.href;
    try {
      await navigator.clipboard.writeText(url);
      EH.toast("Ссылка на товар скопирована", "copy");
    } catch (error) {
      EH.toast("Скопируйте ссылку из адресной строки", "copy");
    }
  });

  /* anchor scrollspy */
  const anchors = Array.from(document.querySelectorAll(".product-anchors a"));
  const sections = anchors.map((anchor) => document.querySelector(anchor.getAttribute("href"))).filter(Boolean);
  function updateAnchors() {
    let current = sections[0];
    sections.forEach((section) => {
      if (section.getBoundingClientRect().top <= 180) current = section;
    });
    anchors.forEach((anchor) => {
      anchor.classList.toggle("is-active", anchor.getAttribute("href") === `#${current.id}`);
    });
  }
  window.addEventListener("scroll", updateAnchors, { passive: true });
  updateAnchors();

  /* checkout */
  const checkoutOverlay = document.getElementById("checkout-overlay");
  const checkoutModal = checkoutOverlay?.querySelector(".modal");
  const checkoutItem = document.querySelector("[data-checkout-item]");

  function renderCheckoutItem() {
    if (!checkoutItem) return;
    checkoutItem.innerHTML = `
      ${EH.coverHTML(item, { size: "thumb" })}
      <div class="checkout-item__copy"><b>${item.title}</b><small>${seller.name} · ${item.region}</small></div>
      <span class="checkout-item__price">${EH.formatPrice(item.price)}</span>`;
  }

  function openCheckout() {
    if (out || !checkoutOverlay) return;
    renderCheckoutItem();
    setQty(qty);
    checkoutOverlay.querySelector("[data-checkout-step='1']").hidden = false;
    checkoutOverlay.querySelector("[data-checkout-step='2']").hidden = true;
    if (checkoutModal) {
      checkoutModal.setAttribute("aria-labelledby", "checkout-title");
      checkoutModal.removeAttribute("aria-label");
    }
    EH.openOverlay(checkoutOverlay);
  }

  document.querySelectorAll("[data-open-checkout]").forEach((button) => {
    if (!out) button.addEventListener("click", openCheckout);
  });

  document.querySelector("[data-confirm-order]")?.addEventListener("click", function () {
    const orderId = "#EH-" + (2850 + Math.floor(Math.random() * 49));
    const order = {
      id: orderId.replace("#", ""),
      itemId: item.id,
      qty: qty,
      amount: item.price * qty,
      status: "awaiting",
      statusLabel: "Ожидает выдачи",
      paidAt: new Intl.DateTimeFormat("ru-RU", { day: "numeric", month: "long", hour: "2-digit", minute: "2-digit" }).format(new Date()),
      deliveredAt: null,
      autoClose: null,
      seller: { name: seller.name, initial: seller.initial }
    };
    try {
      const existing = JSON.parse(localStorage.getItem("eh_demo_orders") || "[]");
      existing.unshift(order);
      localStorage.setItem("eh_demo_orders", JSON.stringify(existing.slice(0, 5)));
    } catch (error) { /* storage may be unavailable */ }

    checkoutOverlay.querySelector("[data-checkout-step='1']").hidden = true;
    checkoutOverlay.querySelector("[data-checkout-step='2']").hidden = false;
    const orderNode = checkoutOverlay.querySelector("[data-order-id]");
    if (orderNode) orderNode.textContent = "#" + order.id;
    if (checkoutModal) {
      checkoutModal.removeAttribute("aria-labelledby");
      checkoutModal.setAttribute("aria-label", "Демо-заказ создан");
    }
    EH.syncFavs();
  });

  const successClose = checkoutOverlay?.querySelector("[data-checkout-step='2'] [data-close-overlay]");
  successClose?.addEventListener("click", () => {
    checkoutOverlay.querySelector("[data-checkout-step='1']").hidden = false;
    checkoutOverlay.querySelector("[data-checkout-step='2']").hidden = true;
  });

  /* chat */
  const chatOverlay = document.getElementById("chat-overlay");
  const chatLog = document.querySelector("[data-chat-log]");
  const chatForm = document.querySelector("[data-chat-form]");
  const chatInput = document.querySelector("#chat-message");

  document.addEventListener("click", (event) => {
    if (event.target.closest("[data-open-chat]")) {
      const sellerNode = document.querySelector("[data-chat-seller]");
      if (sellerNode) sellerNode.textContent = seller.name;
      EH.openOverlay(chatOverlay);
    }
  });

  chatForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    const value = chatInput.value.trim();
    if (!value) { chatInput.focus(); return; }
    document.querySelector("[data-chat-empty]")?.remove();
    const bubble = document.createElement("div");
    bubble.className = "chat-bubble chat-bubble--me";
    bubble.textContent = value;
    chatLog.appendChild(bubble);
    chatLog.scrollTop = chatLog.scrollHeight;
    chatInput.value = "";
    chatInput.focus();
  });

  document.querySelector("[data-report]")?.addEventListener("click", function () {
    EH.toast("Демо-прототип: жалоба не отправляется. Поддержка: support@escrowhub.online", "alert");
  });

  setQty(1);
})();
