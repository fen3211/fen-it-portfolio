/* Shared shell: icons, storefront header, footer, navigation, login modal, toasts. */
(function () {
  const SPRITE = `
  <svg xmlns="http://www.w3.org/2000/svg" style="position:absolute;width:0;height:0;overflow:hidden" aria-hidden="true">
    <symbol id="i-route" viewBox="0 0 24 24"><path d="M5 6h6.5a4 4 0 0 1 0 8H8a4 4 0 0 0 0 8h11"/><circle cx="5" cy="6" r="1.6"/><circle cx="19" cy="22" r="1.6"/></symbol>
    <symbol id="i-search" viewBox="0 0 24 24"><circle cx="11" cy="11" r="6.5"/><path d="m16 16 4.5 4.5"/></symbol>
    <symbol id="i-arrow-right" viewBox="0 0 24 24"><path d="M4 12h16"/><path d="m14 6 6 6-6 6"/></symbol>
    <symbol id="i-arrow-left" viewBox="0 0 24 24"><path d="M20 12H4"/><path d="m10 6-6 6 6 6"/></symbol>
    <symbol id="i-arrow-up-right" viewBox="0 0 24 24"><path d="M6 18 18 6"/><path d="M8 6h10v10"/></symbol>
    <symbol id="i-chevron-down" viewBox="0 0 24 24"><path d="m6 9 6 6 6-6"/></symbol>
    <symbol id="i-chevron-right" viewBox="0 0 24 24"><path d="m9 6 6 6-6 6"/></symbol>
    <symbol id="i-grid" viewBox="0 0 24 24"><rect x="4" y="4" width="6" height="6" rx="1.5"/><rect x="14" y="4" width="6" height="6" rx="1.5"/><rect x="4" y="14" width="6" height="6" rx="1.5"/><rect x="14" y="14" width="6" height="6" rx="1.5"/></symbol>
    <symbol id="i-home" viewBox="0 0 24 24"><path d="m4 11 8-7 8 7v9H4Z"/><path d="M9.5 20v-6h5v6"/></symbol>
    <symbol id="i-user" viewBox="0 0 24 24"><circle cx="12" cy="8" r="3.5"/><path d="M5 20c.8-3.5 3.4-5.5 7-5.5s6.2 2 7 5.5"/></symbol>
    <symbol id="i-check" viewBox="0 0 24 24"><path d="m5 12 4.5 4.5L19 7"/></symbol>
    <symbol id="i-check-circle" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="m8 12 2.8 2.8L16.5 9"/></symbol>
    <symbol id="i-clock" viewBox="0 0 24 24"><circle cx="12" cy="12" r="8.5"/><path d="M12 7v5.4l3.4 2"/></symbol>
    <symbol id="i-message" viewBox="0 0 24 24"><path d="M4 6.5A2.5 2.5 0 0 1 6.5 4h11A2.5 2.5 0 0 1 20 6.5v7a2.5 2.5 0 0 1-2.5 2.5H10l-4.5 4v-4.4A2.5 2.5 0 0 1 4 13.5Z"/></symbol>
    <symbol id="i-heart" viewBox="0 0 24 24"><path d="M20.2 5.8a5 5 0 0 0-7.1 0L12 6.9l-1.1-1.1a5 5 0 1 0-7.1 7.1L12 21l8.2-8.1a5 5 0 0 0 0-7.1Z"/></symbol>
    <symbol id="i-plus" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></symbol>
    <symbol id="i-minus" viewBox="0 0 24 24"><path d="M5 12h14"/></symbol>
    <symbol id="i-x" viewBox="0 0 24 24"><path d="m6 6 12 12M18 6 6 18"/></symbol>
    <symbol id="i-filter" viewBox="0 0 24 24"><path d="M4 7h16M7 12h10M10 17h4"/></symbol>
    <symbol id="i-sort" viewBox="0 0 24 24"><path d="M7 4v16M4 17l3 3 3-3"/><path d="M17 20V4M14 7l3-3 3 3"/></symbol>
    <symbol id="i-wallet" viewBox="0 0 24 24"><path d="M4 8.5A2.5 2.5 0 0 1 6.5 6H19v12H6.5A2.5 2.5 0 0 1 4 15.5Z"/><path d="M4 9h15"/><path d="M16 12.5h2"/></symbol>
    <symbol id="i-package" viewBox="0 0 24 24"><path d="m12 3 8 4.5v9L12 21l-8-4.5v-9Z"/><path d="m4 7.5 8 4.5 8-4.5M12 12v9"/></symbol>
    <symbol id="i-gamepad" viewBox="0 0 24 24"><path d="M7 8h10a5 5 0 0 1 4.8 6.5l-.8 2.4a2.5 2.5 0 0 1-4.2 1l-1.5-1.7H8.7l-1.5 1.7a2.5 2.5 0 0 1-4.2-1l-.8-2.4A5 5 0 0 1 7 8Z"/><path d="M8 11v4M6 13h4M16 12h.01M18 14h.01"/></symbol>
    <symbol id="i-key" viewBox="0 0 24 24"><circle cx="8" cy="15" r="4"/><path d="m11 12 8-8M16 7l2 2M13.5 9.5l2.5 2.5"/></symbol>
    <symbol id="i-repeat" viewBox="0 0 24 24"><path d="M4 9a4 4 0 0 1 4-4h11l-3-3M20 15a4 4 0 0 1-4 4H5l3 3"/></symbol>
    <symbol id="i-gift" viewBox="0 0 24 24"><path d="M4 10h16v10H4Z"/><path d="M3 10h18M12 10v10"/><path d="M12 10C9 10 7 8.7 7 6.8 7 5.3 8 4 9.4 4c1.8 0 2.6 2.1 2.6 6ZM12 10c3 0 5-1.3 5-3.2C17 5.3 16 4 14.6 4 12.8 4 12 6.1 12 10Z"/></symbol>
    <symbol id="i-spark" viewBox="0 0 24 24"><path d="m12 3 1.7 5.3L19 10l-5.3 1.7L12 17l-1.7-5.3L5 10l5.3-1.7Z"/><path d="M18.5 16v4M16.5 18h4"/></symbol>
    <symbol id="i-code" viewBox="0 0 24 24"><path d="m8 8-4 4 4 4M16 8l4 4-4 4M13.5 5l-3 14"/></symbol>
    <symbol id="i-book" viewBox="0 0 24 24"><path d="M5 5.5A2.5 2.5 0 0 1 7.5 3H19v16H7.5A2.5 2.5 0 0 0 5 21.5Z"/><path d="M5 18.5A2.5 2.5 0 0 1 7.5 16H19"/></symbol>
    <symbol id="i-box" viewBox="0 0 24 24"><path d="M4 8h16v11H4Z"/><path d="M4 8l4-4h8l4 4M12 4v15M8 12h8"/></symbol>
    <symbol id="i-info" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/></symbol>
    <symbol id="i-alert" viewBox="0 0 24 24"><path d="M12 4 21 20H3Z"/><path d="M12 10v4M12 17h.01"/></symbol>
    <symbol id="i-star" viewBox="0 0 24 24"><path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2L12 17.3 6.4 20.2l1.1-6.2L3 9.6l6.2-.9Z"/></symbol>
    <symbol id="i-menu" viewBox="0 0 24 24"><path d="M4 7h16M4 12h16M4 17h16"/></symbol>
    <symbol id="i-copy" viewBox="0 0 24 24"><rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"/></symbol>
    <symbol id="i-mail" viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m4 7 8 6 8-6"/></symbol>
    <symbol id="i-edit" viewBox="0 0 24 24"><path d="m4 16-.8 4.8L8 20l11.5-11.5a2.1 2.1 0 0 0-3-3Z"/><path d="m15 6 3 3"/></symbol>
    <symbol id="i-eye" viewBox="0 0 24 24"><path d="M3 12s3.3-6 9-6 9 6 9 6-3.3 6-9 6-9-6-9-6Z"/><circle cx="12" cy="12" r="2.6"/></symbol>
    <symbol id="i-pause" viewBox="0 0 24 24"><path d="M9 5v14M15 5v14"/></symbol>
    <symbol id="i-play" viewBox="0 0 24 24"><path d="m8 5 11 7-11 7Z"/></symbol>
    <symbol id="i-card" viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 10h18M7 15h3"/></symbol>
    <symbol id="i-file" viewBox="0 0 24 24"><path d="M6 3h8l4 4v14H6Z"/><path d="M14 3v5h5M9 13h6M9 17h4"/></symbol>
    <symbol id="i-shield" viewBox="0 0 24 24"><path d="M12 3 20 6v5c0 5-3.4 8.3-8 10-4.6-1.7-8-5-8-10V6Z"/><path d="m8.5 12 2.3 2.3 4.7-4.6"/></symbol>
  </svg>`;

  const headerHost = document.getElementById("site-header");
  const footerHost = document.getElementById("site-footer");
  const page = document.body.dataset.page || "";
  const params = new URLSearchParams(location.search);
  const activeCategory = params.get("category") || "";

  if (!document.getElementById("eh-sprite")) {
    const spriteHost = document.createElement("div");
    spriteHost.id = "eh-sprite";
    spriteHost.innerHTML = SPRITE;
    document.body.prepend(spriteHost);
  }

  function icon(name, cls) {
    return `<svg class="icon ${cls || ""}" aria-hidden="true"><use href="#i-${name}"></use></svg>`;
  }

  function categoryLink(category, mobile) {
    const active = activeCategory === category.slug;
    if (mobile) {
      return `<a class="drawer__link" href="catalog.html?category=${category.slug}">
        <span>${icon(category.icon)}${category.name}</span>${icon("chevron-right")}
      </a>`;
    }
    return `<a class="cat-pill${active ? " is-active" : ""}" href="catalog.html?category=${category.slug}">
      <span class="cat-pill__icon">${icon(category.icon)}</span>${category.short}
    </a>`;
  }

  function headerPill(slug, label) {
    const category = EH.categories.find((item) => item.slug === slug);
    if (!category) return "";
    return `<a class="cat-pill${activeCategory === slug ? " is-active" : ""}" href="catalog.html?category=${slug}">
      <span class="cat-pill__icon">${icon(category.icon)}</span>${label}
    </a>`;
  }

  function header() {
    if (!headerHost) return;
    headerHost.outerHTML = `
    <header class="site-header">
      <div class="container header-main">
        <a class="brand" href="index.html" aria-label="EscrowHub — на главную">
          <span class="brand__mark">e</span>
          <span class="brand__word">escrowhub</span>
        </a>
        <form class="search" role="search" action="catalog.html" method="get" data-search-form>
          ${icon("search", "search__icon")}
          <label class="sr-only" for="global-search">Поиск цифровых товаров</label>
          <input id="global-search" name="q" type="search" placeholder="Аккаунты, подписки, ключи…" autocomplete="off" aria-autocomplete="list" aria-controls="search-pop">
          <span class="search__hint" aria-hidden="true">Ctrl K</span>
          <button class="search__submit" type="submit" aria-label="Найти">${icon("arrow-right")}</button>
          <div class="search-pop" id="search-pop" hidden></div>
        </form>
        <div class="header-actions">
          <a class="header-link" href="orders.html">${icon("route")}<span>Мои сделки</span></a>
          <button class="btn btn--quiet btn--sm header-login" type="button" data-open-login>${icon("user")}Войти</button>
          <a class="btn btn--primary btn--sm" href="create.html">${icon("plus")}Разместить</a>
        </div>
        <div class="header-mobile-actions">
          <a class="mobile-orders" href="orders.html" aria-label="Мои сделки">${icon("route")}</a>
          <button class="burger" type="button" aria-label="Открыть меню" aria-expanded="false" aria-controls="mobile-drawer" data-open-drawer>${icon("menu")}</button>
        </div>
      </div>
      <div class="category-strip">
        <div class="container category-strip__in">
          <nav class="cat-nav" aria-label="Категории товаров">
            <a class="cat-pill cat-pill--all${page === "catalog" && !activeCategory ? " is-active" : ""}" href="catalog.html">${icon("grid")}Все товары</a>
            ${headerPill("accounts", "Аккаунты")}
            ${headerPill("in-game", "Игровая валюта")}
            ${headerPill("keys", "Ключи")}
            ${headerPill("subscriptions", "Подписки")}
            ${headerPill("gift-cards", "Подарочные карты")}
            ${headerPill("services", "Цифровые услуги")}
            ${headerPill("software", "Софт")}
          </nav>
        </div>
      </div>
    </header>`;
  }

  function footer() {
    if (!footerHost) return;
    footerHost.outerHTML = `
    <footer class="site-footer">
      <div class="container">
        <div class="footer-top">
          <div class="footer-brand">
            <a class="brand" href="index.html" aria-label="EscrowHub — на главную">
              <span class="brand__mark">e</span>
              <span class="brand__word">escrowhub</span>
            </a>
            <p>Маркетплейс цифровых товаров. Оплата хранится в сервисе, пока покупатель не подтвердит получение.</p>
            <span class="footer-demo"><i></i>Демо-прототип · данные не являются реальными заказами</span>
          </div>
          <div class="footer-col">
            <h3>Каталог</h3>
            <a href="catalog.html?category=accounts">Аккаунты</a>
            <a href="catalog.html?category=in-game">Игровая валюта</a>
            <a href="catalog.html?category=keys">Ключи и коды</a>
            <a href="catalog.html?category=services">Цифровые услуги</a>
            <a href="catalog.html">Все товары</a>
          </div>
          <div class="footer-col">
            <h3>Покупателям</h3>
            <a href="orders.html">Мои сделки</a>
            <a href="index.html#how">Как проходит сделка</a>
            <a href="index.html#faq">Вопросы и ответы</a>
            <a href="mailto:support@escrowhub.online">Поддержка</a>
          </div>
          <div class="footer-col">
            <h3>Продавцам</h3>
            <a href="create.html">Разместить объявление</a>
            <a href="seller.html">Кабинет продавца</a>
            <a href="seller.html#wallet">Кошелёк и выплаты</a>
            <a href="index.html#seller">Условия для продавцов</a>
          </div>
          <div class="footer-col">
            <h3>Информация</h3>
            <a href="https://escrowhub.online/terms" target="_blank" rel="noopener">Пользовательское соглашение</a>
            <a href="https://escrowhub.online/privacy" target="_blank" rel="noopener">Политика конфиденциальности</a>
            <a class="footer-mail" href="mailto:support@escrowhub.online">support@escrowhub.online</a>
            <p>Отвечаем в течение 3 рабочих дней.</p>
          </div>
        </div>
        <div class="footer-bottom">
          <span>© 2026 EscrowHub · Дизайн-концепт, не публичная оферта</span>
          <div class="footer-bottom__links">
            <a href="case.html">О концепте</a>
            <a href="states.html">Дизайн-система</a>
            <a href="mailto:support@escrowhub.online">Поддержка</a>
          </div>
        </div>
      </div>
    </footer>`;
  }

  function floatingUI() {
    if (!document.getElementById("mobile-drawer")) {
      const drawer = document.createElement("div");
      drawer.className = "drawer";
      drawer.id = "mobile-drawer";
      drawer.innerHTML = `
        <div class="drawer__scrim" data-close-drawer></div>
        <div class="drawer__panel" role="dialog" aria-modal="true" aria-label="Меню">
          <div class="drawer__head">
            <a class="brand" href="index.html"><span class="brand__mark">e</span><span class="brand__word">escrowhub</span></a>
            <button class="icon-btn icon-btn--plain" type="button" aria-label="Закрыть меню" data-close-drawer>${icon("x")}</button>
          </div>
          <form class="search" action="catalog.html" method="get">
            ${icon("search", "search__icon")}
            <label class="sr-only" for="drawer-search">Поиск</label>
            <input id="drawer-search" name="q" type="search" placeholder="Что ищете?">
            <button class="search__submit" type="submit" aria-label="Найти">${icon("arrow-right")}</button>
          </form>
          <div class="drawer__actions">
            <a class="btn btn--primary btn--block" href="create.html">${icon("plus")}Разместить объявление</a>
            <button class="btn btn--ghost btn--block" type="button" data-open-login>${icon("user")}Войти</button>
          </div>
          <p class="drawer__label">Аккаунт</p>
          <a class="drawer__link" href="orders.html"><span>${icon("route")}Мои сделки</span>${icon("chevron-right")}</a>
          <a class="drawer__link" href="seller.html"><span>${icon("wallet")}Кабинет продавца</span>${icon("chevron-right")}</a>
          <a class="drawer__link" href="index.html#how"><span>${icon("shield")}Как проходит сделка</span>${icon("chevron-right")}</a>
          <p class="drawer__label">Категории</p>
          <a class="drawer__link" href="catalog.html"><span>${icon("grid")}Все товары</span>${icon("chevron-right")}</a>
          ${EH.categories.map((category) => categoryLink(category, true)).join("")}
          <div class="drawer__foot"><a href="mailto:support@escrowhub.online">support@escrowhub.online</a></div>
        </div>`;
      document.body.appendChild(drawer);
    }

    if (!document.getElementById("search-sheet")) {
      const sheet = document.createElement("div");
      sheet.id = "search-sheet";
      sheet.className = "search-sheet";
      sheet.hidden = true;
      sheet.innerHTML = `
        <div class="search-sheet__head">
          <form class="search" action="catalog.html" method="get">
            ${icon("search", "search__icon")}
            <label class="sr-only" for="sheet-search">Поиск</label>
            <input id="sheet-search" name="q" type="search" placeholder="Что ищете?" autocomplete="off">
            <button class="search__submit" type="submit" aria-label="Найти">${icon("arrow-right")}</button>
          </form>
          <button class="icon-btn icon-btn--plain" type="button" aria-label="Закрыть поиск" data-close-search>${icon("x")}</button>
        </div>
        <p class="drawer__label">Популярные запросы</p>
        <div class="search-sheet__tags">
          ${["Spotify", "Steam", "TikTok", "Подарочные карты"].map((q) => `<a class="search-pop__tag" href="catalog.html?q=${encodeURIComponent(q)}">${q}</a>`).join("")}
        </div>
        <p class="drawer__label">На витрине</p>
        <div class="search-sheet__items">
          ${EH.activeItems().slice(0, 4).map((item) => `
            <a class="search-sheet__item" href="product.html?id=${item.id}">
              ${EH.coverHTML(item, { size: "thumb" })}
              <span><b>${item.title}</b><small>${EH.formatPrice(item.price)} · ${item.region}</small></span>
              ${icon("chevron-right")}
            </a>`).join("")}
        </div>`;
      document.body.appendChild(sheet);
    }

    if (!document.getElementById("login-overlay")) {
      const overlay = document.createElement("div");
      overlay.className = "overlay";
      overlay.id = "login-overlay";
      overlay.setAttribute("aria-hidden", "true");
      overlay.innerHTML = `
        <div class="modal" role="dialog" aria-modal="true" aria-labelledby="login-title">
          <button class="modal__close" type="button" aria-label="Закрыть" data-close-overlay>${icon("x")}</button>
          <div class="modal__eyebrow eyebrow">EscrowHub · вход</div>
          <h2 id="login-title">Войдите или создайте аккаунт</h2>
          <p class="modal__sub">Отправим одноразовый код на почту — пароль не нужен.</p>
          <div class="modal__body">
            <form data-login-form novalidate>
              <div data-login-step="1">
                <div class="field">
                  <label class="field__label" for="login-email">Email</label>
                  <input class="input" id="login-email" name="email" type="email" placeholder="name@example.com" autocomplete="email" required>
                  <span class="field__error">Введите корректный email</span>
                </div>
                <button class="btn btn--primary btn--block modal__foot" type="submit">Получить код</button>
              </div>
              <div data-login-step="2" hidden>
                <div class="notice notice--green">${icon("check-circle")}<span>Код отправлен на <b data-login-email></b>. В демо-режиме письмо не приходит.</span></div>
                <div class="field" style="margin-top:16px">
                  <label class="field__label" for="login-code">Код из письма</label>
                  <input class="input" id="login-code" name="code" type="text" inputmode="numeric" maxlength="4" placeholder="0000" autocomplete="one-time-code">
                  <span class="field__hint">Введите любые 4 цифры для демонстрации.</span>
                </div>
                <button class="btn btn--primary btn--block modal__foot" type="submit">Войти</button>
                <div style="text-align:center;margin-top:12px"><button class="btn btn--quiet btn--sm" type="button" data-login-back>Изменить почту</button></div>
              </div>
            </form>
          </div>
          <div class="demo-note">${icon("info")}<span>Демо-прототип: вход, оплата и заказы не выполняются по-настоящему. Данные не отправляются.</span></div>
          <div class="modal__note">Продолжая, вы соглашаетесь с <a href="https://escrowhub.online/terms" target="_blank" rel="noopener" style="text-decoration:underline">условиями</a> и <a href="https://escrowhub.online/privacy" target="_blank" rel="noopener" style="text-decoration:underline">политикой конфиденциальности</a>.</div>
        </div>`;
      document.body.appendChild(overlay);
    }

    if (!document.querySelector(".toast-stack")) {
      const toastStack = document.createElement("div");
      toastStack.className = "toast-stack";
      toastStack.setAttribute("aria-live", "polite");
      document.body.appendChild(toastStack);
    }

    if (!document.querySelector(".mobile-tabbar")) {
      const active = page === "home" ? "home" : page === "catalog" ? "catalog" : page === "orders" ? "orders" : page === "seller" ? "profile" : "";
      const tabbar = document.createElement("nav");
      tabbar.className = "mobile-tabbar";
      tabbar.setAttribute("aria-label", "Мобильная навигация");
      tabbar.innerHTML = `
        <a class="${active === "home" ? "is-active" : ""}" href="index.html">${icon("home")}<span>Витрина</span></a>
        <a class="${active === "catalog" ? "is-active" : ""}" href="catalog.html">${icon("grid")}<span>Каталог</span></a>
        <button type="button" data-open-search>${icon("search")}<span>Поиск</span></button>
        <a class="${active === "orders" ? "is-active" : ""}" href="orders.html">${icon("route")}<span>Сделки</span></a>
        <button class="${active === "profile" ? "is-active" : ""}" type="button" data-open-drawer>${icon("user")}<span>Профиль</span></button>`;
      document.body.appendChild(tabbar);
    }
  }

  EH.icon = icon;
  EH.escapeHTML = function (value) {
    return String(value).replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char]));
  };

  EH.toast = function (message, iconName) {
    const stack = document.querySelector(".toast-stack");
    if (!stack) return;
    const el = document.createElement("div");
    el.className = "toast";
    el.innerHTML = icon(iconName || "check") + `<span>${message}</span>`;
    stack.appendChild(el);
    setTimeout(() => el.classList.add("is-out"), 3200);
    setTimeout(() => el.remove(), 3550);
  };

  let lastFocus = null;

  function lockBody() { document.body.classList.add("is-locked"); }
  function unlockIfIdle() {
    const openOverlay = document.querySelector(".overlay.is-open");
    const openDrawer = document.querySelector(".drawer.is-open");
    const openSheet = !document.getElementById("search-sheet")?.hidden;
    if (!openOverlay && !openDrawer && !openSheet) document.body.classList.remove("is-locked");
  }

  EH.openOverlay = function (overlay) {
    if (!overlay) return;
    lastFocus = document.activeElement;
    overlay.classList.add("is-open");
    overlay.setAttribute("aria-hidden", "false");
    lockBody();
    const focusable = overlay.querySelector("input, button, a[href]");
    if (focusable) setTimeout(() => focusable.focus(), 60);
  };
  EH.closeOverlay = function (overlay) {
    if (!overlay) return;
    overlay.classList.remove("is-open");
    overlay.setAttribute("aria-hidden", "true");
    unlockIfIdle();
    if (lastFocus && document.contains(lastFocus)) lastFocus.focus();
  };

  function openDrawer() {
    const drawer = document.getElementById("mobile-drawer");
    if (!drawer) return;
    drawer.classList.add("is-open");
    document.querySelector("[data-open-drawer]")?.setAttribute("aria-expanded", "true");
    lockBody();
    setTimeout(() => drawer.querySelector("a, button")?.focus(), 80);
  }
  function closeDrawer() {
    const drawer = document.getElementById("mobile-drawer");
    if (!drawer) return;
    drawer.classList.remove("is-open");
    document.querySelector("[data-open-drawer]")?.setAttribute("aria-expanded", "false");
    unlockIfIdle();
  }
  function openSearchSheet() {
    const sheet = document.getElementById("search-sheet");
    if (!sheet) return;
    sheet.hidden = false;
    lockBody();
    setTimeout(() => sheet.querySelector("input")?.focus(), 60);
  }
  function closeSearchSheet() {
    const sheet = document.getElementById("search-sheet");
    if (!sheet) return;
    sheet.hidden = true;
    unlockIfIdle();
  }

  function buildSearchPop(query) {
    const pop = document.getElementById("search-pop");
    if (!pop) return;
    const q = (query || "").trim().toLowerCase();
    const matches = EH.activeItems().filter((item) => {
      if (!q) return true;
      return (item.title + " " + item.fullTitle + " " + item.region).toLowerCase().includes(q);
    }).slice(0, 3);
    const tags = ["Spotify", "Steam", "TikTok", "Подарочные карты"];
    pop.innerHTML = `
      <span class="search-pop__label">Популярные запросы</span>
      <div class="search-pop__tags">${tags.map((t) => `<a class="search-pop__tag" href="catalog.html?q=${encodeURIComponent(t)}">${t}</a>`).join("")}</div>
      <span class="search-pop__label">${q ? "Совпадения" : "На витрине"}</span>
      ${matches.length ? matches.map((item) => `
        <a class="search-pop__item" href="product.html?id=${item.id}">
          ${EH.coverHTML(item, { size: "thumb" })}
          <span><b>${item.title}</b><small>${item.region} · ${item.delivery}</small></span>
          <span class="price">${EH.formatPrice(item.price)}</span>
        </a>`).join("") : `<div style="padding:12px 8px;font-size:13px;color:var(--secondary)">Ничего не нашли. Нажмите Enter, чтобы искать по каталогу.</div>`}
      <div class="search-pop__foot"><span>Поиск по названию, платформе и региону</span><span><kbd>Esc</kbd> закрыть</span></div>`;
  }

  document.addEventListener("click", function (event) {
    if (event.target.closest("[data-open-login]")) {
      event.preventDefault();
      closeDrawer();
      EH.openOverlay(document.getElementById("login-overlay"));
      return;
    }
    if (event.target.closest("[data-close-overlay]")) {
      EH.closeOverlay(event.target.closest(".overlay"));
      return;
    }
    if (event.target.classList.contains("overlay")) {
      EH.closeOverlay(event.target);
      return;
    }
    if (event.target.closest("[data-open-drawer]")) {
      openDrawer();
      return;
    }
    if (event.target.closest("[data-close-drawer]")) {
      closeDrawer();
      return;
    }
    if (event.target.closest("[data-open-search]")) {
      openSearchSheet();
      return;
    }
    if (event.target.closest("[data-close-search]")) {
      closeSearchSheet();
      return;
    }
    if (!event.target.closest(".search")) {
      const pop = document.getElementById("search-pop");
      if (pop) pop.hidden = true;
    }

    const fav = event.target.closest("[data-fav]");
    if (fav) {
      event.preventDefault();
      const id = fav.dataset.fav;
      let favs = [];
      try { favs = JSON.parse(localStorage.getItem("eh_favs") || "[]"); } catch (error) { favs = []; }
      const exists = favs.includes(id);
      favs = exists ? favs.filter((x) => x !== id) : favs.concat(id);
      localStorage.setItem("eh_favs", JSON.stringify(favs));
      fav.setAttribute("aria-pressed", String(!exists));
      const label = fav.querySelector("[data-fav-label]");
      if (label) label.textContent = exists ? "В избранное" : "В избранном";
      EH.toast(exists ? "Удалено из избранного" : "Добавлено в избранное", exists ? "heart" : "check");
    }
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      const overlay = document.querySelector(".overlay.is-open");
      if (overlay) { EH.closeOverlay(overlay); return; }
      if (document.querySelector(".drawer.is-open")) { closeDrawer(); return; }
      if (!document.getElementById("search-sheet")?.hidden) { closeSearchSheet(); return; }
    }
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
      const input = document.getElementById("global-search");
      if (input && input.offsetParent !== null) {
        event.preventDefault();
        input.focus();
        input.select();
      }
    }
    if (event.key === "Tab") {
      const overlay = document.querySelector(".overlay.is-open");
      if (!overlay) return;
      const nodes = overlay.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]), textarea, select, [tabindex]:not([tabindex="-1"])');
      if (!nodes.length) return;
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    }
  });

  document.addEventListener("submit", function (event) {
    const form = event.target.closest("[data-login-form]");
    if (!form) return;
    event.preventDefault();
    const step = form.querySelector("[data-login-step='1']").hidden ? 2 : 1;
    if (step === 1) {
      const email = form.querySelector("#login-email");
      const field = email.closest(".field");
      const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim());
      field.classList.toggle("has-error", !ok);
      if (!ok) { email.focus(); return; }
      form.querySelector("[data-login-email]").textContent = email.value.trim();
      form.querySelector("[data-login-step='1']").hidden = true;
      form.querySelector("[data-login-step='2']").hidden = false;
      const code = form.querySelector("#login-code");
      setTimeout(() => code.focus(), 50);
      EH.toast("Код отправлен (демо). Письмо не отправляется.", "mail");
    } else {
      const code = form.querySelector("#login-code");
      if (code.value.replace(/\D/g, "").length < 4) {
        code.closest(".field").classList.add("has-error");
        code.focus();
        return;
      }
      EH.closeOverlay(document.getElementById("login-overlay"));
      EH.toast("Демо-вход выполнен. Реальные заказы не создаются.", "check-circle");
      form.reset();
      form.querySelector("[data-login-step='1']").hidden = false;
      form.querySelector("[data-login-step='2']").hidden = true;
    }
  });

  document.addEventListener("click", function (event) {
    if (event.target.closest("[data-login-back]")) {
      const form = document.querySelector("[data-login-form]");
      form.querySelector("[data-login-step='1']").hidden = false;
      form.querySelector("[data-login-step='2']").hidden = true;
      form.querySelector("#login-email").focus();
    }
  });

  EH.syncFavs = function () {
    let favs = [];
    try { favs = JSON.parse(localStorage.getItem("eh_favs") || "[]"); } catch (error) { favs = []; }
    document.querySelectorAll("[data-fav]").forEach((button) => {
      const pressed = favs.includes(button.dataset.fav);
      button.setAttribute("aria-pressed", String(pressed));
      const label = button.querySelector("[data-fav-label]");
      if (label) label.textContent = pressed ? "В избранном" : "В избранное";
    });
  };

  header();
  footer();
  floatingUI();

  const searchInput = document.getElementById("global-search");
  if (searchInput) {
    searchInput.addEventListener("focus", function () {
      buildSearchPop(searchInput.value);
      document.getElementById("search-pop").hidden = false;
    });
    searchInput.addEventListener("input", function () { buildSearchPop(searchInput.value); });
  }

  EH.syncFavs();
})();
