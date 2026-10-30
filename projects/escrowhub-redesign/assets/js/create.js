(function () {
  const params = new URLSearchParams(location.search);
  const editItem = EH.getItem(params.get("edit") || "");
  const categorySelect = document.querySelector("[data-create-category]");
  const deliverySelect = document.querySelector("[data-create-delivery]");
  const formatSelect = document.querySelector("[data-create-format]");
  const form = document.querySelector("[data-create-form]");
  const preview = document.querySelector("[data-preview-card]");
  const overlay = document.getElementById("publish-overlay");

  const coverMap = {
    accounts: ["accounts", "wave"],
    "in-game": ["ingame", "grid"],
    keys: ["keys", "stripe"],
    subscriptions: ["software", "ledger"],
    "gift-cards": ["gift", "stripe"],
    services: ["services", "ledger"],
    software: ["software", "grid"],
    courses: ["courses", "arch"],
    other: ["other", "rings"]
  };

  if (categorySelect) {
    categorySelect.innerHTML = '<option value="">Выберите категорию</option>' +
      EH.categories.map((category) => `<option value="${category.slug}">${category.name}</option>`).join("");
  }

  function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char]));
  }

  function getValue(selector) {
    const el = document.querySelector(selector);
    return el ? el.value.trim() : "";
  }

  function values() {
    return {
      title: getValue("[data-create-name]"),
      category: getValue("[data-create-category]") || "accounts",
      format: getValue("[data-create-format]"),
      region: getValue("[data-create-region]"),
      delivery: getValue("[data-create-delivery]"),
      price: Number(getValue("[data-create-price]")),
      stock: Number(getValue("[data-create-stock]")),
      description: getValue("[data-create-description]")
    };
  }

  function previewItem(data) {
    const category = EH.getCategory(data.category) || EH.categories[0];
    const short = data.title.split(/[—–|·]/)[0].trim() || "Новый товар";
    const brand = short.length > 26 ? short.slice(0, 25).trim() + "…" : short;
    const lower = data.title.toLowerCase();
    let theme = (EH.categoryVisuals[category.slug] || ["steam-light"])[0];
    let logo = null;
    if (lower.includes("spotify")) { theme = "spotify"; logo = "spotify"; }
    else if (lower.includes("tiktok")) { theme = "tiktok"; logo = "tiktok"; }
    else if (lower.includes("steam")) { theme = "steam"; logo = "steam"; }
    const main = data.title ? (short.split(" ")[0] || "Товар") : "Новый товар";
    return {
      id: "preview",
      title: data.title || "Название объявления",
      category: category.slug,
      price: data.price || 0,
      stock: data.stock || 1,
      unit: "шт.",
      region: data.region || "Регион",
      format: data.format || "Товар",
      delivery: data.delivery || "срок выдачи",
      sellerId: "iewc",
      visual: {
        theme,
        logo,
        kicker: category.short,
        main,
        meta: [data.region || "Регион", data.format || "Формат"].join(" · "),
        mark: brand.slice(0, 4)
      }
    };
  }

  function renderPreview() {
    if (!preview) return;
    const data = values();
    const item = previewItem(data);
    const category = EH.getCategory(item.category);
    const title = data.title || "Название объявления";
    preview.innerHTML = `<article class="lot lot--preview">
      <div class="lot__media">${EH.coverHTML(item)}</div>
      <div class="lot__body">
        <div class="lot__meta"><span>${category.short}</span><span class="sep">·</span><span>${escapeHTML(item.region)}</span></div>
        <h3 class="lot__title">${escapeHTML(title)}</h3>
        <div class="lot__seller"><span class="avatar">E</span><span><b>EWC</b> <small>· Новый продавец</small></span></div>
        <div class="lot__bottom">
          <div class="lot__price"><b>${data.price > 0 ? EH.formatPrice(data.price) : "0 ₽"}</b><small>/ шт. · ${data.stock > 0 ? data.stock : 1} шт.</small></div>
          <span class="lot__go"><svg class="icon"><use href="#i-arrow-up-right"></use></svg></span>
        </div>
      </div>
    </article>`;
  }

  function updateCounters() {
    const title = document.querySelector("[data-create-name]");
    const description = document.querySelector("[data-create-description]");
    const titleCounter = document.querySelector("[data-counter='title']");
    const descCounter = document.querySelector("[data-counter='description']");
    if (titleCounter && title) titleCounter.textContent = `${title.value.length} / 100`;
    if (descCounter && description) descCounter.textContent = `${description.value.length} / 2000`;
  }

  function clearError(field) {
    if (field) field.classList.remove("has-error");
  }

  form?.addEventListener("input", (event) => {
    const field = event.target.closest(".field");
    if (field && event.target.type !== "checkbox") clearError(field);
    updateCounters();
    renderPreview();
  });
  form?.addEventListener("change", (event) => {
    const field = event.target.closest(".field");
    if (field) clearError(field);
    updateCounters();
    renderPreview();
  });

  /* prefill for edit */
  if (editItem) {
    const headTitle = document.querySelector("[data-create-title]");
    const crumb = document.querySelector("[data-create-crumb]");
    const publishLabel = document.querySelector("[data-publish-label]");
    const publishTitle = document.querySelector("[data-publish-title]");
    if (headTitle) headTitle.textContent = "Редактировать объявление";
    document.title = "Редактировать объявление — EscrowHub";
    if (crumb) crumb.textContent = "Редактирование";
    if (publishLabel) publishLabel.textContent = "Сохранить изменения";
    if (publishTitle) publishTitle.textContent = "Изменения сохранены";
    document.querySelector("[data-create-name]").value = editItem.title;
    categorySelect.value = editItem.category;
    if (!Array.from(formatSelect.options).some((option) => option.value === editItem.format || option.textContent === editItem.format)) {
      formatSelect.add(new Option(editItem.format, editItem.format));
    }
    formatSelect.value = editItem.format;
    if (!Array.from(deliverySelect.options).some((option) => option.value === editItem.delivery || option.textContent === editItem.delivery)) {
      deliverySelect.add(new Option(editItem.delivery, editItem.delivery));
    }
    deliverySelect.value = editItem.delivery;
    document.querySelector("[data-create-region]").value = editItem.region;
    document.querySelector("[data-create-price]").value = editItem.price;
    document.querySelector("[data-create-stock]").value = editItem.stock;
    document.querySelector("[data-create-description]").value = editItem.description.join("\n\n");
    updateCounters();
    renderPreview();
  } else {
    renderPreview();
  }

  function validate() {
    const data = values();
    let firstInvalid = null;
    function mark(name, valid) {
      const field = document.querySelector(`[data-field="${name}"]`);
      if (field) {
        field.classList.toggle("has-error", !valid);
        if (!valid && !firstInvalid) firstInvalid = field;
      }
      return valid;
    }
    mark("title", data.title.length >= 3 && data.title.length <= 100);
    mark("category", !!getValue("[data-create-category]"));
    mark("price", Number.isFinite(data.price) && data.price > 0);
    mark("stock", Number.isFinite(data.stock) && data.stock >= 1 && data.stock <= 9999);
    mark("description", data.description.length >= 20);
    mark("terms", !!document.querySelector("[data-create-terms]")?.checked);
    if (firstInvalid) {
      firstInvalid.scrollIntoView({ behavior: "smooth", block: "center" });
      firstInvalid.querySelector("input, select, textarea, button")?.focus({ preventScroll: true });
    }
    return !firstInvalid;
  }

  form?.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!validate()) return;
    EH.openOverlay(overlay);
  });

  document.querySelector("[data-save-draft]")?.addEventListener("click", () => {
    EH.toast("Черновик сохранён (демо). В реальной системе он появился бы в кабинете.", "file");
  });

  document.querySelector("[data-publish-again]")?.addEventListener("click", () => {
    EH.closeOverlay(overlay);
    window.location.href = "create.html";
  });
})();
