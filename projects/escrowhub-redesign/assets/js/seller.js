(function () {
  const statuses = {};
  EH.items.forEach((item) => { statuses[item.id] = item.status; });

  const statusInfo = {
    active: { label: "Активно", cls: "tag--green" },
    draft: { label: "Черновик", cls: "tag--outline" },
    paused: { label: "На паузе", cls: "tag--amber" }
  };

  const els = {
    preview: document.querySelector("[data-preview-list]"),
    listings: document.querySelector("[data-listings-body]"),
    active: document.querySelector("[data-seller-stat='active']"),
    drafts: document.querySelector("[data-seller-stat='drafts']"),
    deals: document.querySelector("[data-seller-stat='deals']"),
    balance: document.querySelector("[data-seller-stat='balance']"),
    listingsBadge: document.querySelector("[data-listings-badge]"),
    ordersBadge: document.querySelector("[data-orders-badge]")
  };

  function counts() {
    const active = Object.values(statuses).filter((status) => status === "active").length;
    const draft = Object.values(statuses).filter((status) => status === "draft").length;
    const paused = Object.values(statuses).filter((status) => status === "paused").length;
    return { active, draft, paused, total: EH.items.length };
  }

  function updateStats() {
    const c = counts();
    if (els.active) els.active.textContent = c.active;
    if (els.drafts) els.drafts.textContent = c.draft;
    if (els.deals) els.deals.textContent = EH.seller.deals;
    if (els.balance) els.balance.textContent = "0 ₽";
    if (els.listingsBadge) els.listingsBadge.textContent = c.total;
    if (els.ordersBadge) els.ordersBadge.textContent = EH.seller.deals;
    const summary = document.querySelector("[data-seller-panel='listings'] .seller-panel-head p");
    if (summary) {
      summary.textContent = `${c.total} товаров · активных ${c.active} · черновиков ${c.draft}${c.paused ? " · на паузе " + c.paused : ""}`;
    }
  }

  function listingAction(item, status) {
    if (status === "active") {
      return `<button type="button" data-listing-action="pause" data-id="${item.id}" aria-label="Снять с публикации" title="Снять с публикации"><svg class="icon"><use href="#i-pause"></use></svg></button>`;
    }
    return `<button type="button" data-listing-action="publish" data-id="${item.id}" aria-label="Опубликовать" title="Опубликовать"><svg class="icon"><use href="#i-play"></use></svg></button>`;
  }

  function previewRow(item) {
    const info = statusInfo[statuses[item.id]] || statusInfo.draft;
    const category = EH.getCategory(item.category);
    return `<div class="preview-row">
      <div class="preview-product">
        ${EH.coverHTML(item, { size: "thumb" })}
        <div class="preview-product__copy">
          <b>${item.title}</b>
          <small>${category.short} · ${item.region}</small>
        </div>
      </div>
      <span class="preview-price">${EH.formatPrice(item.price)}</span>
      <span class="tag ${info.cls}">${info.label}</span>
      <a class="preview-edit" href="create.html?edit=${item.id}" aria-label="Редактировать ${item.title}"><svg class="icon"><use href="#i-edit"></use></svg></a>
    </div>`;
  }

  function renderPreview() {
    if (!els.preview) return;
    const activeItems = EH.items.filter((item) => statuses[item.id] === "active").slice(0, 4);
    els.preview.innerHTML = activeItems.map(previewRow).join("");
  }

  function tableRow(item) {
    const status = statuses[item.id];
    const info = statusInfo[status] || statusInfo.draft;
    const category = EH.getCategory(item.category);
    return `<tr>
      <td>
        <div class="listing-product">
          ${EH.coverHTML(item, { size: "thumb" })}
          <div class="listing-product__copy"><b>${item.title}</b><small>${category.short} · ${item.region}</small></div>
        </div>
      </td>
      <td data-label="Цена">${EH.formatPrice(item.price)}</td>
      <td data-label="Наличие">${item.stock === 0 ? '<span class="stock-zero">0 шт.</span>' : item.stock + " шт."}</td>
      <td data-label="Статус"><span class="tag ${info.cls}">${info.label}</span></td>
      <td>
        <div class="listing-actions">
          <a href="create.html?edit=${item.id}" aria-label="Редактировать ${item.title}" title="Редактировать"><svg class="icon"><use href="#i-edit"></use></svg></a>
          ${listingAction(item, status)}
        </div>
      </td>
    </tr>`;
  }

  function renderListings() {
    if (!els.listings) return;
    els.listings.innerHTML = EH.items.map(tableRow).join("");
  }

  function renderAll() {
    updateStats();
    renderPreview();
    renderListings();
  }

  document.addEventListener("click", (event) => {
    const action = event.target.closest("[data-listing-action]");
    if (!action) return;
    const item = EH.getItem(action.dataset.id);
    if (!item) return;
    const next = action.dataset.listingAction === "pause" ? "paused" : "active";
    statuses[item.id] = next;
    renderAll();
    EH.toast(next === "paused" ? "Объявление снято с публикации (демо)." : "Объявление опубликовано (демо).", next === "paused" ? "pause" : "check-circle");
  });

  /* tabs */
  const panels = Array.from(document.querySelectorAll("[data-seller-panel]"));
  const tabButtons = Array.from(document.querySelectorAll("[data-seller-tab]"));
  const validTabs = ["overview", "listings", "orders", "wallet"];

  function activate(tab, updateHash) {
    const target = validTabs.includes(tab) ? tab : "overview";
    panels.forEach((panel) => { panel.hidden = panel.dataset.sellerPanel !== target; });
    tabButtons.forEach((button) => {
      const active = button.dataset.sellerTab === target;
      button.classList.toggle("is-active", active);
      if (button.getAttribute("role") === "tab") button.setAttribute("aria-selected", String(active));
    });
    if (updateHash) history.replaceState(null, "", "#" + target);
  }

  tabButtons.forEach((button) => {
    button.addEventListener("click", () => activate(button.dataset.sellerTab, true));
  });
  document.querySelectorAll("[data-goto-tab]").forEach((button) => {
    button.addEventListener("click", () => activate(button.dataset.gotoTab, true));
  });

  const initial = location.hash.replace("#", "");
  activate(validTabs.includes(initial) ? initial : "overview", false);
  renderAll();
})();
