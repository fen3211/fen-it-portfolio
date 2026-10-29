/* UTKA — interactive prototype
   The two states share one DOM structure and one component system.
   State-specific content lives in data.js. */

(() => {
  "use strict";

  const STATES = window.UTKA_DATA;
  const params = new URLSearchParams(window.location.search);
  const isCapture = params.get("capture") === "1" || params.get("capture") === "true";
  const isDemo = params.get("demo") === "1" || params.get("demo") === "true";

  document.documentElement.classList.toggle("is-capture", isCapture);
  document.documentElement.classList.toggle("is-client", !isCapture && !isDemo);

  const screen = document.getElementById("screen");
  const scroll = document.getElementById("scroll");
  const duckQuote = document.getElementById("duckQuote");
  const beanbank = document.querySelector(".beanbank");
  const beanbankLabel = document.querySelector(".beanbank__label");
  const beanbankUse = beanbank.querySelector("use");
  const levelTitle = document.getElementById("levelTitle");
  const levelCaption = document.getElementById("levelCaption");
  const paws = document.getElementById("paws");
  const offer = document.getElementById("offer");
  const offerBadgeText = document.querySelector(".offer__badge-text");
  const offerLock = document.querySelector(".offer__lock");
  const offerTitle = document.getElementById("offerTitle");
  const offerDescription = document.getElementById("offerDescription");
  const stamps = document.getElementById("stamps");
  const boxData = document.getElementById("boxData");
  const savings = document.getElementById("savings");
  const savingsTitle = savings.querySelector(".savings__title");
  const savingsNote = savings.querySelector(".savings__note");
  const cafeTitle = document.getElementById("cafeTitle");
  const cafeNote = cafeTitle.parentElement.querySelector("p");
  const dockCaption = document.getElementById("dockCaption");
  const stateButtons = Array.from(document.querySelectorAll("[data-state-btn]"));

  const sheetLayer = document.getElementById("sheetLayer");
  const sheet = document.getElementById("sheet");
  const sheetContent = document.getElementById("sheetContent");

  let currentState = params.get("state") === "regular" ? "regular" : "guest";
  let activeSheet = null;
  let closeTimer = 0;
  let switchTimer = 0;
  let lastFocused = null;

  const icon = (id, cls = "") =>
    `<svg class="icon ${cls}" aria-hidden="true"><use href="#${id}"></use></svg>`;

  const escapeHtml = (value) =>
    String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");

  const decorateTitle = (title, tone) => {
    let value = escapeHtml(title);
    if (tone === "pending") {
      value = value.replace("99 ₽", '<span class="price-em">99 ₽</span>');
    }
    if (tone === "active") {
      value = value.replace("бесплатно", '<span class="free-em">бесплатно</span>');
    }
    return value;
  };

  function renderState(next, { updateUrl = false, resetScroll = false } = {}) {
    const data = STATES[next];
    if (!data) return;

    currentState = next;
    screen.dataset.state = next;

    /* bean bank — an independent balance, separate from paws and Box stamps */
    beanbank.dataset.count = String(data.beans.count);
    beanbankLabel.textContent = data.beans.label;
    beanbank.setAttribute("aria-label", data.beans.aria);
    beanbankUse.setAttribute("href", data.beans.count > 0 ? "#i-jar-full" : "#i-jar");

    /* character message */
    duckQuote.textContent = data.quote;

    /* level = visits in the last 30 days, expressed as four paws */
    levelTitle.textContent = data.level.title;
    levelCaption.textContent = data.level.caption;
    const activePaws = data.level.paws.filter(Boolean).length;
    paws.setAttribute("aria-label", `${activePaws} из 4 лапок`);
    paws.innerHTML = data.level.paws
      .map(
        (on, index) =>
          `<span class="paw ${on ? "is-on" : "is-off"}" data-paw="${index + 1}" aria-hidden="true">${icon(
            "i-paw",
            "icon--solid"
          )}</span>`
      )
      .join("");

    /* offer / Box — a third, separate progress */
    offer.dataset.tone = data.offer.tone;
    offerBadgeText.textContent = data.offer.badge;
    offerLock.hidden = data.offer.tone === "active";
    offerTitle.innerHTML = decorateTitle(data.offer.title, data.offer.tone);

    if (data.offer.tone === "pending") {
      offerDescription.textContent = data.offer.description;
    } else {
      const total = data.offer.stampsTotal || 3;
      const filled = data.offer.stamps || 0;
      stamps.innerHTML = Array.from({ length: total }, (_, index) => {
        return `<span class="stamp ${index < filled ? "is-on" : ""}" aria-hidden="true">${icon(
          "i-cup"
        )}</span>`;
      }).join("");
      stamps.setAttribute("aria-label", `Отметки Бокса: ${filled} из ${total}`);
      boxData.textContent = data.offer.boxData;
    }

    /* savings appears only once there is something to be proud of */
    savings.hidden = !data.savings;
    if (data.savings) {
      const [label, value] = data.savings.title.split(": ");
      savingsTitle.innerHTML = `${escapeHtml(label)}: <span class="savings__value">${escapeHtml(
        value
      )}</span>`;
      savingsNote.textContent = data.savings.note;
    }

    cafeTitle.textContent = data.cafe.title;
    cafeNote.textContent = data.cafe.note;
    dockCaption.textContent = data.dockCaption;

    stateButtons.forEach((button) => {
      const isActive = button.dataset.stateBtn === next;
      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-pressed", String(isActive));
    });

    document.title = data.documentTitle;

    if (resetScroll) {
      scroll.scrollTop = 0;
    }

    if (updateUrl && !isCapture && window.location.protocol !== "file:") {
      try {
        history.replaceState({}, "", `${window.location.pathname}?state=${next}`);
      } catch (_) {
        /* the prototype keeps working without URL sync */
      }
    }
  }

  function setState(next, options = {}) {
    if (!STATES[next] || next === currentState) {
      if (options.resetScroll) scroll.scrollTop = 0;
      return;
    }
    if (activeSheet) closeSheet(true);
    renderState(next, options);
    screen.classList.add("is-switching");
    window.clearTimeout(switchTimer);
    switchTimer = window.setTimeout(() => screen.classList.remove("is-switching"), 620);
  }

  /* ============================================================
     Sheets
     ============================================================ */

  const sheetHead = (eyebrow, title) => `
    <div class="sheet-head">
      <div>
        <p class="eyebrow">${escapeHtml(eyebrow)}</p>
        <h2 id="sheetTitle">${escapeHtml(title)}</h2>
      </div>
      <button class="sheet-close" type="button" data-close-sheet aria-label="Закрыть">
        ${icon("i-close")}
      </button>
    </div>`;

  const sheetQR = () => {
    const data = STATES[currentState];
    return `
      ${sheetHead("Визит", "Ваш QR")}
      <div class="qr-card">
        <div class="qr-card__top">
          <span class="qr-card__brand">utka<span class="brand__dot"></span></span>
          <span class="qr-card__hint">покажите на кассе</span>
        </div>
        <div class="qr-wrap">
          <img src="assets/qr-demo.png" alt="QR-код для отметки визита" width="330" height="330">
          <span class="qr-logo" aria-hidden="true">${icon("i-paw", "icon--solid")}</span>
        </div>
        <div class="qr-card__foot">
          <span>UTKA · визит</span>
          <span>${currentState === "regular" ? "3 визита" : "первый визит"}</span>
        </div>
      </div>
      <p class="sheet-note">${escapeHtml(data.dockCaption)}</p>
      <p class="qr-demo">Демонстрационный код для прототипа — здесь будет ваш личный QR.</p>
      <button class="sheet-primary" type="button" data-close-sheet>Готово</button>
    `;
  };

  const sheetHelp = () => `
    ${sheetHead("Механика", "Как работает UTKA")}
    <div class="help-list">
      <div class="help-item">
        <span class="help-icon help-icon--paw" aria-hidden="true">${icon("i-paw", "icon--solid")}</span>
        <div>
          <h3>Лапки</h3>
          <p>Визиты за последние 30 дней. Лапки определяют ваш уровень.</p>
        </div>
      </div>
      <div class="help-item">
        <span class="help-icon help-icon--beans" aria-hidden="true">${icon("i-bean")}</span>
        <div>
          <h3>Зёрна</h3>
          <p>Копятся за визиты, не сгорают и обмениваются на награды.</p>
        </div>
      </div>
      <div class="help-item">
        <span class="help-icon help-icon--box" aria-hidden="true">3+1</span>
        <div>
          <h3>Отметки Бокса</h3>
          <p>Отдельный прогресс к бесплатному кофе. Он не связан с лапками и зёрнами.</p>
        </div>
      </div>
    </div>
    <p class="help-foot">Три независимых прогресса: лапки считают визиты, зёрна копятся, отметки Бокса идут к бесплатному кофе. Они не складываются в один счётчик.</p>
  `;

  const sheetBeans = () => {
    const data = STATES[currentState];
    const count = data.beans.count;
    return `
      ${sheetHead("Копятся и не сгорают", "Банка зёрен")}
      <div class="beans-hero">
        <div class="beans-jar" aria-hidden="true">${icon(count > 0 ? "i-jar-full" : "i-jar")}</div>
        <div class="beans-count">${count > 0 ? escapeHtml(data.beans.label) : "Пока пусто"}</div>
        <p class="beans-desc">Зёрна копятся за визиты и не сгорают. Их можно обменять на награды.</p>
      </div>
      <p class="beans-rules">Лапки уровня и отметки Бокса считаются отдельно от зёрен. <strong>Зёрна никогда не сгорают.</strong></p>
    `;
  };

  const sheetOffers = () => {
    const data = STATES[currentState];
    const o = data.offer;
    const body = o.tone === "pending" ? o.description : o.boxData;
    const note =
      o.tone === "pending"
        ? "Купон проснётся после первого визита и будет действовать 7 дней."
        : "На кассе визит и отметка Бокса засчитываются сами.";
    return `
      ${sheetHead("Сейчас", "Купоны и предложения")}
      <div class="mini-offer" data-tone="${o.tone}">
        <span class="mini-offer__badge">${escapeHtml(o.badge)}</span>
        <h3>${decorateTitle(o.title, o.tone)}</h3>
        <p>${escapeHtml(body)}</p>
      </div>
      <p class="sheet-note">${escapeHtml(note)}</p>
    `;
  };

  const sheetChat = () => {
    const data = STATES[currentState];
    const subtitle = currentState === "regular" ? "подмастерье" : "твой компаньон";
    return `
      <div class="chat-head">
        <span class="avatar" aria-hidden="true">
          <img src="assets/utka-avatar.png" alt="" width="540" height="500">
        </span>
        <div>
          <h2 id="sheetTitle">утка</h2>
          <p>${subtitle}</p>
        </div>
        <button class="sheet-close" type="button" data-close-sheet aria-label="Свернуть чат">
          ${icon("i-close")}
        </button>
      </div>
      <div class="chat-body" id="chatBody">
        <div class="chat-day">Сегодня</div>
        <div class="chat-row">
          <div class="chat-bubble">${escapeHtml(data.quote)}</div>
        </div>
        <div class="chat-chips">
          <button class="chat-chip" type="button" data-sheet="qr">Показать QR</button>
          <button class="chat-chip" type="button" data-sheet="help">Как это работает?</button>
        </div>
      </div>
      <form class="chat-form" novalidate>
        <input class="chat-input" type="text" name="message" placeholder="Написать утке…" aria-label="Сообщение утке" autocomplete="off">
        <button class="chat-send" type="submit" aria-label="Отправить">${icon("i-send")}</button>
      </form>
    `;
  };

  const sheetBuilders = {
    qr: sheetQR,
    help: sheetHelp,
    beans: sheetBeans,
    offers: sheetOffers,
    chat: sheetChat
  };

  function openSheet(kind) {
    const build = sheetBuilders[kind];
    if (!build) return;

    window.clearTimeout(closeTimer);
    lastFocused = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    activeSheet = kind;

    sheetContent.innerHTML = build();
    sheet.classList.toggle("sheet--chat", kind === "chat");
    sheetLayer.hidden = false;
    screen.classList.add("is-sheet-open");

    // make the closing/opening transition deterministic
    void sheet.offsetWidth;
    requestAnimationFrame(() => {
      sheetLayer.classList.add("is-open");
      sheet.focus({ preventScroll: true });
    });

    if (kind === "chat") {
      const body = document.getElementById("chatBody");
      if (body) body.scrollTop = body.scrollHeight;
    }
  }

  function closeSheet(immediate = false) {
    if (!activeSheet) return;
    activeSheet = null;
    sheetLayer.classList.remove("is-open");
    screen.classList.remove("is-sheet-open");

    const cleanup = () => {
      sheetLayer.hidden = true;
      sheetContent.innerHTML = "";
      sheet.classList.remove("sheet--chat");
    };

    window.clearTimeout(closeTimer);
    if (immediate || isCapture || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      cleanup();
    } else {
      closeTimer = window.setTimeout(cleanup, 440);
    }

    if (lastFocused && document.contains(lastFocused)) {
      lastFocused.focus({ preventScroll: true });
    }
  }

  /* ============================================================
     Events
     ============================================================ */

  document.addEventListener("click", (event) => {
    const stateButton = event.target.closest("[data-state-btn]");
    if (stateButton) {
      setState(stateButton.dataset.stateBtn, { updateUrl: true, resetScroll: true });
      return;
    }

    const closeTrigger = event.target.closest("[data-close-sheet]");
    if (closeTrigger) {
      event.preventDefault();
      closeSheet();
      return;
    }

    const sheetTrigger = event.target.closest("[data-sheet]");
    if (sheetTrigger) {
      event.preventDefault();
      openSheet(sheetTrigger.dataset.sheet);
    }
  });

  document.addEventListener("submit", (event) => {
    const form = event.target.closest(".chat-form");
    if (!form) return;
    event.preventDefault();

    const input = form.querySelector(".chat-input");
    const text = input.value.trim();
    if (!text) return;

    const body = document.getElementById("chatBody");
    if (!body) return;

    const row = document.createElement("div");
    row.className = "chat-row chat-row--user";
    const bubble = document.createElement("div");
    bubble.className = "chat-bubble";
    bubble.textContent = text;
    row.appendChild(bubble);

    const chips = body.querySelector(".chat-chips");
    body.insertBefore(row, chips);
    input.value = "";
    body.scrollTop = body.scrollHeight;
  });

  sheetLayer.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      event.preventDefault();
      closeSheet();
      return;
    }

    if (event.key !== "Tab" || !activeSheet) return;

    const focusable = Array.from(
      sheet.querySelectorAll(
        'button:not([disabled]), [href], input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])'
      )
    ).filter((element) => element.offsetParent !== null);

    if (!focusable.length) {
      event.preventDefault();
      sheet.focus();
      return;
    }

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (event.shiftKey && (document.activeElement === first || document.activeElement === sheet)) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (activeSheet) return;
    if (event.metaKey || event.ctrlKey || event.altKey) return;
    if (event.target.closest("input, textarea")) return;

    if (event.key === "1") {
      setState("guest", { updateUrl: true, resetScroll: true });
    }
    if (event.key === "2") {
      setState("regular", { updateUrl: true, resetScroll: true });
    }
  });

  /* ============================================================
     Boot
     ============================================================ */

  renderState(currentState);

  if (isCapture) {
    const target = params.get("scroll");
    requestAnimationFrame(() => {
      if (target === "offer") {
        const node = document.getElementById("offer");
        if (node) scroll.scrollTop = node.offsetTop - 12;
      } else if (target === "cafe") {
        const node = document.querySelector(".cafe");
        if (node) scroll.scrollTop = node.offsetTop - 12;
      } else {
        scroll.scrollTop = 0;
      }
    });
  }
})();
