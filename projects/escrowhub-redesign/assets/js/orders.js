(function () {
  let stored = [];
  try {
    stored = JSON.parse(localStorage.getItem("eh_demo_orders") || "[]");
  } catch (error) { stored = []; }

  const orders = stored.concat(EH.orders.map((order) => ({ ...order })));
  let activeTab = "all";
  let actionOrderId = null;

  const statusConfig = {
    awaiting: { label: "Ожидает выдачи", tag: "tag--outline", done: 1, active: 1 },
    review: { label: "Проверьте товар", tag: "tag--amber", done: 2, active: 2 },
    completed: { label: "Завершена", tag: "tag--green", done: 4, active: -1 },
    dispute: { label: "Спор открыт", tag: "tag--red", done: 2, active: 2 }
  };

  const els = {
    list: document.querySelector("[data-orders]"),
    empty: document.querySelector("[data-orders-empty]"),
    emptyTitle: document.querySelector("[data-orders-empty-title]"),
    emptyText: document.querySelector("[data-orders-empty-text]"),
    tabs: Array.from(document.querySelectorAll("[data-orders-tab]")),
    stats: {
      active: document.querySelector("[data-stat='active']"),
      completed: document.querySelector("[data-stat='completed']"),
      disputes: document.querySelector("[data-stat='disputes']")
    }
  };

  const inactiveStatuses = ["review", "awaiting"];

  function isActiveStatus(status) {
    return inactiveStatuses.includes(status);
  }

  function counts() {
    return {
      all: orders.length,
      active: orders.filter((order) => isActiveStatus(order.status)).length,
      completed: orders.filter((order) => order.status === "completed").length,
      disputes: orders.filter((order) => order.status === "dispute").length
    };
  }

  function filteredOrders() {
    if (activeTab === "active") return orders.filter((order) => isActiveStatus(order.status));
    if (activeTab === "completed") return orders.filter((order) => order.status === "completed");
    if (activeTab === "disputes") return orders.filter((order) => order.status === "dispute");
    return orders;
  }

  function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char]));
  }

  function itemFor(order) {
    return EH.getItem(order.itemId);
  }

  function trackHTML(status) {
    const config = statusConfig[status] || statusConfig.awaiting;
    const stages = [
      ["Оплата", "средства в сервисе"],
      ["Выдача", "продавец передаёт товар"],
      ["Проверка", "покупатель проверяет"],
      ["Выплата", "после подтверждения"]
    ];
    return `<div class="route route--horiz order-route">
      ${stages.map((stage, index) => {
        let cls = "";
        if (index < config.done) cls = "is-done";
        else if (index === config.active) cls = "is-active";
        if (status === "dispute" && index === config.active) cls += " is-dispute";
        const dot = index < config.done ? '<svg class="icon"><use href="#i-check"></use></svg>' : "0" + (index + 1);
        return `<div class="route__step ${cls}">
          <span class="route__dot">${dot}</span>
          <div class="route__body"><div class="route__title">${stage[0]}</div><p class="route__text">${stage[1]}</p></div>
        </div>`;
      }).join("")}
    </div>`;
  }

  function metaHTML(order, status) {
    const parts = [];
    if (order.paidAt) parts.push(`<span><svg class="icon"><use href="#i-card"></use></svg>Оплачен ${escapeHTML(order.paidAt)}</span>`);
    if (order.deliveredAt) parts.push(`<span><svg class="icon"><use href="#i-package"></use></svg>Выдан ${escapeHTML(order.deliveredAt)}</span>`);
    if (status === "review" && order.autoClose) parts.push(`<span><svg class="icon"><use href="#i-clock"></use></svg>Автозакрытие ${escapeHTML(order.autoClose)}</span>`);
    if (status === "completed" && order.completedAt) parts.push(`<span><svg class="icon"><use href="#i-check-circle"></use></svg>Завершён ${escapeHTML(order.completedAt)}</span>`);
    if (status === "dispute") parts.push(`<span><svg class="icon"><use href="#i-alert"></use></svg>Деньги на удержании</span>`);
    return parts.join("");
  }

  function actionsHTML(order, status, productLink) {
    if (status === "review") {
      return `<div class="order-actions">
        <span class="order-actions__note">Проверьте товар до подтверждения</span>
        <div class="order-actions__buttons">
          <button class="btn btn--ghost btn--sm" type="button" data-dispute="${order.id}">Открыть спор</button>
          <button class="btn btn--green btn--sm" type="button" data-confirm="${order.id}">Подтвердить получение</button>
        </div>
      </div>`;
    }
    if (status === "awaiting") {
      return `<div class="order-actions">
        <span class="order-actions__note">Ждём, когда продавец передаст товар</span>
        <div class="order-actions__buttons"><a class="btn btn--ghost btn--sm" href="${productLink}">Открыть товар</a></div>
      </div>`;
    }
    if (status === "completed") {
      return `<div class="order-actions">
        <span class="order-actions__note">Сделка закрыта · комиссия 0 ₽</span>
        <div class="order-actions__buttons"><a class="btn btn--ghost btn--sm" href="${productLink}">Купить снова</a></div>
      </div>`;
    }
    return `<div class="order-actions">
      <span class="order-actions__note">Спор рассматривает арбитраж EscrowHub</span>
      <div class="order-actions__buttons"><a class="btn btn--ghost btn--sm" href="mailto:support@escrowhub.online">Написать в поддержку</a></div>
    </div>`;
  }

  function orderHTML(order) {
    const item = itemFor(order);
    const status = statusConfig[order.status] ? order.status : "awaiting";
    const config = statusConfig[status];
    const seller = order.seller || (item ? EH.sellers[item.sellerId] : EH.seller);
    const title = item ? item.title : "Цифровой товар";
    const productLink = item ? `product.html?id=${item.id}` : "catalog.html";
    const qty = order.qty || 1;
    const cover = item ? EH.coverHTML(item, { size: "thumb" }) : '<div class="cover cover--thumb" data-tone="other" data-motif="grid" data-glyph="?"><div class="cover__inner"><div class="cover__top"><span>Товар</span></div><div class="cover__center"><div class="cover__brand">Товар</div></div></div></div>';
    const date = order.createdLabel || order.paidAt || "сегодня";
    const note = status === "awaiting"
      ? `<div class="order-status-note">Как только продавец отметит выдачу, появится возможность проверить товар. До подтверждения оплата остаётся в сервисе.</div>`
      : status === "dispute"
        ? `<div class="order-status-note">Спор открыт. Деньги остаются в сервисе до решения арбитража. Проверяйте сообщения поддержки.</div>`
        : "";

    return `<article class="order-card${status === "dispute" ? " order-card--dispute" : ""}" data-order-card="${order.id}">
      <div class="order-head">
        <div class="order-head__id">
          <span class="order-id">#${order.id}</span>
          <span class="order-date">создан ${escapeHTML(date)}</span>
        </div>
        <span class="tag ${config.tag}">${config.label}</span>
      </div>
      <div class="order-body">
        <div class="order-item">
          ${cover}
          <div class="order-item__copy">
            <a href="${productLink}">${title}</a>
            <small>${seller.name} · ${qty} шт.</small>
          </div>
          <div class="order-item__amount">${EH.formatPrice(order.amount)}<small>${status === "completed" ? "выплачено" : "в сделке"}</small></div>
        </div>
        <div class="order-track">${trackHTML(status)}</div>
        <div class="order-meta">${metaHTML(order, status)}</div>
        <div class="order-escrow">
          <svg class="icon"><use href="#i-route"></use></svg>
          <span>${status === "completed" ? "<b>Сделка завершена.</b> Оплата переведена продавцу после подтверждения." : "<b>Оплата на удержании.</b> Продавец получит деньги только после вашего подтверждения."}</span>
        </div>
        ${note}
      </div>
      ${actionsHTML(order, status, productLink)}
    </article>`;
  }

  function setEmptyText() {
    const copy = {
      all: ["Здесь пока пусто", "Когда появятся сделки, они окажутся в этом разделе."],
      active: ["Нет активных сделок", "Всё завершено или ещё не начато. Посмотрите каталог, чтобы найти цифровой товар."],
      completed: ["Завершённых сделок пока нет", "После подтверждения получения сделки появятся здесь."],
      disputes: ["Открытых споров нет", "Если товар не соответствует описанию, спор можно открыть из активной сделки."]
    }[activeTab];
    if (els.emptyTitle) els.emptyTitle.textContent = copy[0];
    if (els.emptyText) els.emptyText.textContent = copy[1];
  }

  function render() {
    const countsNow = counts();
    Object.keys(els.stats).forEach((key) => {
      if (els.stats[key]) els.stats[key].textContent = countsNow[key];
    });
    els.tabs.forEach((tab) => {
      const key = tab.dataset.ordersTab;
      const active = key === activeTab;
      tab.classList.toggle("is-active", active);
      tab.setAttribute("aria-selected", String(active));
      const countNode = tab.querySelector("[data-tab-count]");
      if (countNode) countNode.textContent = countsNow[key];
    });

    const visible = filteredOrders();
    if (els.list) {
      els.list.innerHTML = visible.map(orderHTML).join("");
      els.list.hidden = visible.length === 0;
    }
    if (els.empty) {
      els.empty.hidden = visible.length !== 0;
      setEmptyText();
    }
    document.querySelectorAll("[data-order-card]").forEach((card) => {
      const order = orders.find((entry) => entry.id === card.dataset.orderCard);
      if (order && order.status === "review") {
        card.querySelector("[data-confirm]")?.addEventListener("click", () => openConfirm(order.id));
        card.querySelector("[data-dispute]")?.addEventListener("click", () => openDispute(order.id));
      }
    });
  }

  els.tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      activeTab = tab.dataset.ordersTab;
      render();
    });
  });

  /* confirm */
  const confirmOverlay = document.getElementById("confirm-overlay");
  function openConfirm(id) {
    const order = orders.find((entry) => entry.id === id);
    if (!order) return;
    actionOrderId = id;
    document.querySelector("[data-confirm-order]").textContent = "#" + order.id;
    document.querySelector("[data-confirm-amount]").textContent = EH.formatPrice(order.amount);
    EH.openOverlay(confirmOverlay);
  }

  document.querySelector("[data-confirm-submit]")?.addEventListener("click", () => {
    const order = orders.find((entry) => entry.id === actionOrderId);
    if (!order) return;
    order.status = "completed";
    order.completedAt = new Intl.DateTimeFormat("ru-RU", { day: "numeric", month: "long", hour: "2-digit", minute: "2-digit" }).format(new Date());
    activeTab = "completed";
    EH.closeOverlay(confirmOverlay);
    render();
    EH.toast("Получение подтверждено. Демо: деньги не переводились.", "check-circle");
  });

  /* dispute */
  const disputeOverlay = document.getElementById("dispute-overlay");
  const disputeForm = document.querySelector("[data-dispute-form]");
  function openDispute(id) {
    const order = orders.find((entry) => entry.id === id);
    if (!order) return;
    actionOrderId = id;
    EH.openOverlay(disputeOverlay);
  }
  disputeForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    const order = orders.find((entry) => entry.id === actionOrderId);
    if (!order) return;
    order.status = "dispute";
    activeTab = "disputes";
    EH.closeOverlay(disputeOverlay);
    disputeForm.reset();
    render();
    EH.toast("Спор открыт (демо). Деньги остались на удержании.", "alert");
  });

  render();
})();
