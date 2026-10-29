(function () {
  const baseItems = EH.activeItems();
  const params = new URLSearchParams(location.search);
  const validSorts = ["new", "price_asc", "price_desc", "popular"];

  const state = {
    q: params.get("q") || "",
    categories: (params.get("category") || "").split(",").filter(Boolean),
    regions: (params.get("region") || "").split(",").filter(Boolean),
    min: params.get("min") || "",
    max: params.get("max") || "",
    available: params.get("available") === "1",
    sort: validSorts.includes(params.get("sort")) ? params.get("sort") : "new"
  };

  const els = {
    grid: document.querySelector("[data-catalog-grid]"),
    count: document.querySelector("[data-result-count]"),
    empty: document.querySelector("[data-empty]"),
    emptyText: document.querySelector("[data-empty-text]"),
    footer: document.querySelector("[data-results-footer]"),
    footerText: document.querySelector("[data-results-footer-text]"),
    chips: document.querySelector("[data-active-filters]"),
    categories: document.querySelector("[data-filter-categories]"),
    regions: document.querySelector("[data-filter-regions]"),
    query: document.querySelector("[data-filter-query]"),
    priceMin: document.querySelector("[data-price-min]"),
    priceMax: document.querySelector("[data-price-max]"),
    available: document.querySelector("[data-filter-available]"),
    sidebar: document.getElementById("filter-panel"),
    overlay: document.querySelector("[data-filter-overlay]"),
    filterCount: document.querySelector("[data-filter-count]"),
    applyBtn: document.querySelector("[data-apply-filters]")
  };

  const regionOrder = ["Турция", "Казахстан", "Германия", "РФ / Беларусь", "Онлайн"];
  const regions = Array.from(new Set(baseItems.map((item) => item.region)))
    .sort((a, b) => {
      const ai = regionOrder.indexOf(a);
      const bi = regionOrder.indexOf(b);
      return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
    });

  const categoryCounts = {};
  baseItems.forEach((item) => {
    categoryCounts[item.category] = (categoryCounts[item.category] || 0) + 1;
  });
  const regionCounts = {};
  baseItems.forEach((item) => {
    regionCounts[item.region] = (regionCounts[item.region] || 0) + 1;
  });

  if (els.categories) {
    els.categories.innerHTML = EH.categories
      .filter((category) => categoryCounts[category.slug] || state.categories.includes(category.slug))
      .map((category) => `<label class="check">
        <input type="checkbox" value="${category.slug}" data-category-filter>
        <span>${category.name}</span>
        <span class="check__count">${categoryCounts[category.slug] || 0}</span>
      </label>`).join("");
  }

  if (els.regions) {
    els.regions.innerHTML = regions.map((region) => `<label class="check">
      <input type="checkbox" value="${region}" data-region-filter>
      <span>${region}</span>
      <span class="check__count">${regionCounts[region]}</span>
    </label>`).join("");
  }

  function plural(number, one, few, many) {
    const n = Math.abs(number) % 100;
    const n1 = n % 10;
    if (n > 10 && n < 20) return many;
    if (n1 > 1 && n1 < 5) return few;
    if (n1 === 1) return one;
    return many;
  }
  function offersLabel(number) {
    return number + " " + plural(number, "предложение", "предложения", "предложений");
  }
  function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char]));
  }

  function syncHeaderPills() {
    document.querySelectorAll(".cat-nav .cat-pill").forEach((pill) => {
      const href = pill.getAttribute("href") || "";
      const match = href.match(/category=([^&]+)/);
      const slug = match ? decodeURIComponent(match[1]) : "";
      const active = state.categories.length === 1 ? slug === state.categories[0] : state.categories.length === 0 && slug === "";
      pill.classList.toggle("is-active", active);
    });
  }

  function syncControls() {
    if (els.query) els.query.value = state.q;
    if (els.priceMin) els.priceMin.value = state.min;
    if (els.priceMax) els.priceMax.value = state.max;
    if (els.available) els.available.checked = state.available;
    document.querySelectorAll("[data-category-filter]").forEach((input) => {
      input.checked = state.categories.includes(input.value);
    });
    document.querySelectorAll("[data-region-filter]").forEach((input) => {
      input.checked = state.regions.includes(input.value);
    });
    document.querySelectorAll("[data-sort]").forEach((button) => {
      const active = button.dataset.sort === state.sort;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-pressed", String(active));
    });
    const select = document.querySelector("[data-sort-select]");
    if (select) select.value = state.sort;
  }

  function hasFilters() {
    return !!(state.q || state.categories.length || state.regions.length || state.min || state.max || state.available);
  }

  function filterItems() {
    const q = state.q.trim().toLowerCase();
    const min = state.min === "" ? null : Number(state.min);
    const max = state.max === "" ? null : Number(state.max);

    let items = baseItems.filter((item) => {
      const category = EH.getCategory(item.category);
      const seller = EH.sellers[item.sellerId] || EH.seller;
      const haystack = [item.title, item.fullTitle, item.region, item.format, category ? category.name : "", seller.name].join(" ").toLowerCase();
      if (q && !haystack.includes(q)) return false;
      if (state.categories.length && !state.categories.includes(item.category)) return false;
      if (state.regions.length && !state.regions.includes(item.region)) return false;
      if (min !== null && Number.isFinite(min) && item.price < min) return false;
      if (max !== null && Number.isFinite(max) && item.price > max) return false;
      if (state.available && item.stock === 0) return false;
      return true;
    });

    if (state.sort === "price_asc") items.sort((a, b) => a.price - b.price);
    else if (state.sort === "price_desc") items.sort((a, b) => b.price - a.price);
    else if (state.sort === "popular") items.sort((a, b) => b.popularity - a.popularity);

    return items;
  }

  function syncURL() {
    const next = new URLSearchParams();
    if (state.q.trim()) next.set("q", state.q.trim());
    if (state.categories.length) next.set("category", state.categories.join(","));
    if (state.regions.length) next.set("region", state.regions.join(","));
    if (state.min) next.set("min", state.min);
    if (state.max) next.set("max", state.max);
    if (state.available) next.set("available", "1");
    if (state.sort !== "new") next.set("sort", state.sort);
    const query = next.toString();
    history.replaceState(null, "", location.pathname + (query ? "?" + query : ""));
  }

  function buildChips() {
    if (!els.chips) return;
    const chips = [];
    if (state.q.trim()) chips.push(`<button class="active-chip" type="button" data-remove="query">Поиск: «${escapeHTML(state.q.trim())}» <svg class="icon"><use href="#i-x"></use></svg></button>`);
    state.categories.forEach((slug) => {
      const category = EH.getCategory(slug);
      chips.push(`<button class="active-chip" type="button" data-remove="category" data-value="${slug}">${category ? category.name : slug} <svg class="icon"><use href="#i-x"></use></svg></button>`);
    });
    state.regions.forEach((region) => {
      chips.push(`<button class="active-chip" type="button" data-remove="region" data-value="${escapeHTML(region)}">${escapeHTML(region)} <svg class="icon"><use href="#i-x"></use></svg></button>`);
    });
    if (state.min || state.max) {
      const label = state.min && state.max ? `Цена: ${state.min}–${state.max} ₽` : state.min ? `Цена: от ${state.min} ₽` : `Цена: до ${state.max} ₽`;
      chips.push(`<button class="active-chip" type="button" data-remove="price">${label} <svg class="icon"><use href="#i-x"></use></svg></button>`);
    }
    if (state.available) chips.push(`<button class="active-chip" type="button" data-remove="available">Только в наличии <svg class="icon"><use href="#i-x"></use></svg></button>`);
    if (chips.length) chips.push(`<button class="active-clear" type="button" data-reset-filters>Сбросить всё</button>`);
    els.chips.innerHTML = chips.join("");
    els.chips.hidden = chips.length === 0;
  }

  function updateFilterBadge() {
    if (!els.filterCount) return;
    let count = 0;
    if (state.q.trim()) count++;
    count += state.categories.length + state.regions.length;
    if (state.min || state.max) count++;
    if (state.available) count++;
    els.filterCount.textContent = count;
    els.filterCount.hidden = count === 0;
  }

  function render() {
    const items = filterItems();
    if (els.grid) {
      els.grid.innerHTML = items.map(EH.lotHTML).join("");
      els.grid.hidden = items.length === 0;
    }
    if (els.count) els.count.textContent = "Найдено: " + items.length;
    if (els.applyBtn) {
      els.applyBtn.textContent = items.length ? "Показать " + offersLabel(items.length) : "Показать результаты";
    }
    if (els.empty) {
      els.empty.hidden = items.length !== 0;
      if (els.emptyText && items.length === 0) {
        els.emptyText.textContent = state.q.trim()
          ? `По запросу «${state.q.trim()}» ничего не найдено. Уберите фильтры или проверьте написание.`
          : "Под выбранные фильтры пока нет предложений. Попробуйте расширить диапазон цены или выбрать другую категорию.";
      }
    }
    if (els.footer) els.footer.hidden = items.length === 0;
    if (els.footerText) {
      els.footerText.textContent = hasFilters()
        ? "Показаны все " + offersLabel(items.length) + " по вашему запросу."
        : "Показаны все предложения каталога.";
    }
    updateFilterBadge();
    buildChips();
    syncControls();
    syncHeaderPills();
    EH.syncFavs();
  }

  function resetState() {
    state.q = "";
    state.categories = [];
    state.regions = [];
    state.min = "";
    state.max = "";
    state.available = false;
    state.sort = "new";
    syncControls();
    render();
    syncURL();
  }

  /* events */
  const form = document.querySelector("[data-filter-form]");
  form?.addEventListener("submit", (event) => event.preventDefault());

  let queryTimer;
  els.query?.addEventListener("input", function () {
    clearTimeout(queryTimer);
    const value = this.value;
    queryTimer = setTimeout(() => {
      state.q = value;
      render();
      syncURL();
    }, 180);
  });

  document.querySelectorAll("[data-category-filter]").forEach((input) => {
    input.addEventListener("change", () => {
      state.categories = Array.from(document.querySelectorAll("[data-category-filter]:checked")).map((el) => el.value);
      render();
      syncURL();
    });
  });

  document.querySelectorAll("[data-region-filter]").forEach((input) => {
    input.addEventListener("change", () => {
      state.regions = Array.from(document.querySelectorAll("[data-region-filter]:checked")).map((el) => el.value);
      render();
      syncURL();
    });
  });

  let priceTimer;
  function onPriceInput() {
    clearTimeout(priceTimer);
    priceTimer = setTimeout(() => {
      state.min = els.priceMin.value;
      state.max = els.priceMax.value;
      render();
      syncURL();
    }, 300);
  }
  els.priceMin?.addEventListener("input", onPriceInput);
  els.priceMax?.addEventListener("input", onPriceInput);

  els.available?.addEventListener("change", function () {
    state.available = this.checked;
    render();
    syncURL();
  });

  document.querySelectorAll("[data-sort]").forEach((button) => {
    button.addEventListener("click", () => {
      state.sort = button.dataset.sort;
      render();
      syncURL();
    });
  });

  document.querySelector("[data-sort-select]")?.addEventListener("change", function () {
    state.sort = this.value;
    render();
    syncURL();
  });

  document.addEventListener("click", (event) => {
    if (!event.target.closest("[data-reset-filters]")) return;
    resetState();
    closeFilters();
  });

  els.chips?.addEventListener("click", (event) => {
    const chip = event.target.closest("[data-remove]");
    if (!chip) return;
    const type = chip.dataset.remove;
    if (type === "query") state.q = "";
    if (type === "price") { state.min = ""; state.max = ""; }
    if (type === "available") state.available = false;
    if (type === "category") state.categories = state.categories.filter((value) => value !== chip.dataset.value);
    if (type === "region") state.regions = state.regions.filter((value) => value !== chip.dataset.value);
    render();
    syncURL();
  });

  /* mobile filter drawer */
  function openFilters() {
    if (!els.sidebar) return;
    els.sidebar.classList.add("is-open");
    if (els.overlay) els.overlay.hidden = false;
    document.body.classList.add("is-locked");
    document.querySelector("[data-close-filters]")?.focus();
  }
  function closeFilters() {
    if (!els.sidebar) return;
    els.sidebar.classList.remove("is-open");
    if (els.overlay) els.overlay.hidden = true;
    if (!document.querySelector(".overlay.is-open") && !document.querySelector(".drawer.is-open")) {
      document.body.classList.remove("is-locked");
    }
  }

  document.querySelector("[data-open-filters]")?.addEventListener("click", openFilters);
  document.querySelector("[data-close-filters]")?.addEventListener("click", closeFilters);
  document.querySelector("[data-apply-filters]")?.addEventListener("click", closeFilters);
  els.overlay?.addEventListener("click", closeFilters);
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && els.sidebar?.classList.contains("is-open")) closeFilters();
  });
  window.addEventListener("resize", () => {
    if (window.innerWidth > 980) closeFilters();
  });

  syncControls();
  render();
  syncURL();
})();
