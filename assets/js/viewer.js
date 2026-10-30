/* FEN prototype viewer — Framer-like canvas + working prototype for SMS PRO */
(function () {
  "use strict";

  const pv = document.getElementById("pv");
  if (!pv) return;

  const $ = (sel, root) => (root || pv).querySelector(sel);
  const $$ = (sel, root) => Array.from((root || pv).querySelectorAll(sel));

  const el = {
    barTitle: $("[data-pv-title]"),
    barSub: $("[data-pv-sub]"),
    close: $("[data-pv-close]"),
    framer: $("[data-pv-open-framer]"),
    devices: $$("[data-pv-device]"),
    zoomOut: $("[data-pv-zoom-out]"),
    zoomIn: $("[data-pv-zoom-in]"),
    zoomFit: $("[data-pv-zoom-fit]"),
    zoomValue: $("[data-pv-zoom-value]"),
    sidebar: $("[data-pv-sidebar]"),
    sideTitle: $("[data-pv-side-title]"),
    search: $("[data-pv-search]"),
    searchClear: $("[data-pv-search-clear]"),
    pages: $("[data-pv-pages]"),
    count: $("[data-pv-count]"),
    note: $("[data-pv-note]"),
    canvas: $("[data-pv-canvas]"),
    stage: $("[data-pv-stage]"),
    artlabel: $("[data-pv-artlabel]"),
    art: $("[data-pv-art]"),
    editorImg: $("[data-pv-img]"),
    proto: $("[data-pv-proto]"),
    protoBtn: $("[data-pv-proto-btn]"),
    deviceFrame: $("[data-pv-device-frame]"),
    chromeUrl: $("[data-pv-chrome-url]"),
    scroll: $("[data-pv-scroll]"),
    page: $("[data-pv-page]"),
    protoImg: $("[data-pv-proto-img]"),
    hots: $("[data-pv-hots]"),
    hudName: $("[data-pv-hud-name]"),
    hudPath: $("[data-pv-hud-path]"),
    back: $("[data-pv-back]"),
    home: $("[data-pv-home]"),
    pagesToggle: $("[data-pv-pages-toggle]"),
    linksToggle: $("[data-pv-links-toggle]"),
    exitProto: $("[data-pv-exit]"),
    toast: $("[data-pv-toast]"),
    live: $("[data-pv-live]")
  };

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const state = {
    manifest: null,
    loading: null,
    pageIndex: 0,
    device: "desktop",
    mode: "editor",
    zoom: 1,
    tx: 0,
    ty: 0,
    history: [],
    lastFocus: null,
    isOpen: false,
    hinted: false,
    pagePath: "/"
  };

  const clamp = (v, min, max) => Math.max(min, Math.min(max, v));
  const pathLabel = (path) => (path === "/" ? "/" : path);
  const slugFor = (path) => String(path || "/");

  function byPath(path) {
    if (!state.manifest) return -1;
    return state.manifest.pages.findIndex((p) => p.path === path);
  }

  function current() {
    return state.manifest ? state.manifest.pages[state.pageIndex] : null;
  }

  function mediaFor(page, device) {
    if (!page) return null;
    return device === "phone" ? page.phone : page.desktop;
  }

  function loadManifest() {
    if (state.manifest) return Promise.resolve(state.manifest);
    if (state.loading) return state.loading;
    state.loading = fetch(pv.dataset.manifest || "assets/img/prototypes/sms/manifest.json")
      .then((res) => {
        if (!res.ok) throw new Error("manifest " + res.status);
        return res.json();
      })
      .then((data) => {
        state.manifest = data;
        buildMeta(data);
        buildPages(data);
        return data;
      })
      .catch((err) => {
        console.error("Prototype manifest failed", err);
        el.pages.innerHTML = '<p class="pv-empty"><strong>Не удалось загрузить макет</strong>Обнови страницу и попробуй снова.</p>';
        throw err;
      });
    return state.loading;
  }

  function buildMeta(data) {
    el.barTitle.textContent = data.title || "Прототип";
    el.barSub.textContent = (data.subtitle || "Framer concept") + " / " + data.pages.length + " страниц";
    if (data.framerUrl) el.framer.href = data.framerUrl;
    if (el.count) el.count.textContent = String(data.pages.length).padStart(2, "0");
    if (el.sideTitle) el.sideTitle.textContent = data.title || "Проект";
    if (el.note) el.note.innerHTML = (data.note || "") + " Хотспоты — реальные ссылки из макета.";
  }

  function buildPages(data) {
    const frag = document.createDocumentFragment();
    data.pages.forEach((page, index) => {
      const row = document.createElement("button");
      row.type = "button";
      row.className = "pv-page-row";
      row.dataset.index = String(index);
      row.dataset.search = (page.name + " " + page.path).toLowerCase();
      row.setAttribute("aria-current", "false");
      const thumb = page.desktop || page.phone;
      row.innerHTML =
        '<span class="pv-page-row__num">' + String(index + 1).padStart(2, "0") + "</span>" +
        '<span class="pv-page-row__thumb"><img alt="" loading="lazy" decoding="async" src="' + (thumb ? thumb.thumb : "") + '" width="54" height="36"></span>' +
        '<span class="pv-page-row__text"><span class="pv-page-row__name"></span><span class="pv-page-row__path"></span></span>';
      row.querySelector(".pv-page-row__name").textContent = page.name;
      row.querySelector(".pv-page-row__path").textContent = pathLabel(page.path);
      row.addEventListener("click", () => {
        selectPage(index, { source: "list" });
        if (window.matchMedia("(max-width: 760px)").matches) {
          pv.classList.remove("pv-side-open");
        }
      });
      frag.appendChild(row);
    });
    el.pages.innerHTML = "";
    el.pages.appendChild(frag);
  }

  function refreshPages() {
    if (!state.manifest) return;
    const q = (el.search.value || "").trim().toLowerCase();
    let shown = 0;
    $$(".pv-page-row").forEach((row) => {
      const match = !q || row.dataset.search.includes(q);
      row.hidden = !match;
      if (match) shown++;
    });
    if (el.count) el.count.textContent = q ? String(shown) : String(state.manifest.pages.length).padStart(2, "0");
    el.searchClear.hidden = !q;
  }

  function markActive() {
    $$(".pv-page-row").forEach((row) => {
      row.setAttribute("aria-current", row.dataset.index === String(state.pageIndex) ? "true" : "false");
    });
    const active = $('.pv-page-row[aria-current="true"]');
    if (active && state.isOpen) active.scrollIntoView({ block: "nearest" });
  }

  function setDevice(device) {
    if (device === "phone" && !(current() && current().phone)) device = "desktop";
    state.device = device;
    pv.classList.toggle("is-phone", device === "phone");
    el.devices.forEach((btn) => {
      const isOn = btn.dataset.pvDevice === device;
      btn.setAttribute("aria-pressed", String(isOn));
    });
    state.history = state.history;
  }

  function updateDeviceAvailability() {
    const hasPhone = Boolean(current() && current().phone);
    el.devices.forEach((btn) => {
      if (btn.dataset.pvDevice === "phone") {
        btn.disabled = !hasPhone;
        btn.title = hasPhone ? "Phone · 390" : "На этой странице нет phone-брейкпоинта";
      }
    });
    if (!hasPhone && state.device === "phone") setDevice("desktop");
  }

  function artLabel(page, device) {
    const media = mediaFor(page, device);
    const size = device === "phone" ? "390" : "1200";
    return '<b>' + page.name.toUpperCase() + "</b> · " + device.toUpperCase() + " · " + size + (media ? " · " + media.h : "");
  }

  function selectPage(index, opts) {
    if (!state.manifest) return;
    const options = opts || {};
    const page = state.manifest.pages[index];
    if (!page) return;
    state.pageIndex = index;
    state.pagePath = page.path;
    updateDeviceAvailability();
    markActive();
    el.artlabel.innerHTML = artLabel(page, state.device);
    el.editorImg.alt = page.name + " — макет SMS PRO";
    el.hudName.textContent = page.name;
    el.hudPath.textContent = pathLabel(page.path);
    el.chromeUrl.textContent = "sms-pro.app" + (page.path === "/" ? "" : page.path);
    el.live.textContent = page.name + ", " + (state.device === "phone" ? "телефон" : "десктоп");

    loadEditorImage(page, state.device);
    if (state.mode === "proto") {
      loadProtoPage(page, state.device, options.animate);
      if (options.push !== false && !options.fromHistory) {
        if (options.source !== "hotspot" || !state.history.length || state.history[state.history.length - 1] !== state.pageIndex) {
          if (options.source === "hotspot") state.history.push(index);
        }
      }
    } else {
      fit();
    }
  }

  function loadEditorImage(page, device) {
    const media = mediaFor(page, device);
    if (!media) return;
    el.art.classList.add("is-loading");
    el.art.style.width = media.w + "px";
    const img = new Image();
    const token = (el.editorImg.dataset.token = String(Date.now()));
    img.onload = () => {
      if (el.editorImg.dataset.token !== token) return;
      el.editorImg.src = media.src;
      el.editorImg.width = media.w;
      el.editorImg.height = media.h;
      el.art.classList.remove("is-loading");
      if (state.mode === "editor") fit();
    };
    img.onerror = () => el.art.classList.remove("is-loading");
    img.src = media.src;
  }

  function loadProtoPage(page, device, animate) {
    const media = mediaFor(page, device);
    if (!media) return;
    el.protoImg.src = media.src;
    el.protoImg.width = media.w;
    el.protoImg.height = media.h;
    el.protoImg.alt = page.name + " — макет SMS PRO";
    el.hots.innerHTML = "";
    el.scroll.scrollTop = 0;
    buildHotspots(page, device);
    if (animate && !reduceMotion.matches) {
      el.page.classList.remove("is-entering");
      void el.page.offsetWidth;
      el.page.classList.add("is-entering");
    }
    prefetchTargets(page, device);
  }

  function buildHotspots(page, device) {
    const map = (page.hotspots && page.hotspots[device]) || [];
    if (!map.length) {
      if (el.linksToggle) el.linksToggle.hidden = true;
      return;
    }
    el.linksToggle.hidden = false;
    const media = mediaFor(page, device);
    if (!media) return;
    const items = map
      .map(([x, y, w, h, href]) => {
        const target = byPath(href);
        return { x, y, w, h, href, target };
      })
      .filter((it) => it.target >= 0)
      .sort((a, b) => b.w * b.h - a.w * a.h);
    const frag = document.createDocumentFragment();
    items.forEach((it) => {
      const target = state.manifest.pages[it.target];
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "pv-hot";
      btn.style.left = (it.x / media.w) * 100 + "%";
      btn.style.top = (it.y / media.h) * 100 + "%";
      btn.style.width = (it.w / media.w) * 100 + "%";
      btn.style.height = (it.h / media.h) * 100 + "%";
      btn.setAttribute("aria-label", "Перейти: " + target.name + " (" + it.href + ")");
      const tip = document.createElement("span");
      tip.className = "pv-hot__tip";
      tip.textContent = "→ " + target.name;
      btn.appendChild(tip);
      btn.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        goTo(it.target, "hotspot");
      });
      frag.appendChild(btn);
    });
    el.hots.appendChild(frag);
  }

  function goTo(index, source) {
    if (index < 0) return;
    if (source === "hotspot") state.history.push(state.pageIndex);
    selectPage(index, { source: source, animate: true, push: false });
  }

  function prefetchTargets(page, device) {
    const map = (page.hotspots && page.hotspots[device]) || [];
    const seen = new Set();
    map.slice(0, 12).forEach(([, , , , href]) => {
      const idx = byPath(href);
      if (idx < 0 || seen.has(idx)) return;
      seen.add(idx);
      const media = mediaFor(state.manifest.pages[idx], device);
      if (media) new Image().src = media.src;
    });
  }

  /* Editor transform ------------------------------------------------------ */
  function applyStage() {
    el.stage.style.transform = "translate(" + state.tx.toFixed(2) + "px," + state.ty.toFixed(2) + "px) scale(" + state.zoom + ")";
    if (el.zoomValue) el.zoomValue.textContent = Math.round(state.zoom * 100) + "%";
  }

  function fit() {
    if (!state.manifest || state.mode !== "editor") return;
    const page = current();
    const media = mediaFor(page, state.device);
    if (!media) return;
    const rect = el.canvas.getBoundingClientRect();
    const padX = window.matchMedia("(max-width: 760px)").matches ? 28 : 72;
    const zoom = clamp(Math.min((rect.width - padX) / media.w, 1), 0.12, 2);
    state.zoom = zoom;
    state.tx = (rect.width - media.w * zoom) / 2;
    state.ty = 56;
    applyStage();
  }

  function zoomAt(pointX, pointY, factor) {
    const next = clamp(state.zoom * factor, 0.12, 2.5);
    if (next === state.zoom) return;
    state.tx = pointX - ((pointX - state.tx) * next) / state.zoom;
    state.ty = pointY - ((pointY - state.ty) * next) / state.zoom;
    state.zoom = next;
    applyStage();
  }

  function zoomCenter(factor) {
    const rect = el.canvas.getBoundingClientRect();
    zoomAt(rect.width / 2, rect.height / 2, factor);
  }

  /* Mode ---------------------------------------------------------------- */
  function setMode(mode, opts) {
    const options = opts || {};
    if (mode === state.mode) return;
    state.mode = mode;
    const isProto = mode === "proto";
    pv.classList.toggle("is-proto", isProto);
    pv.classList.remove("pv-side-open");
    state.history = [];
    if (isProto) {
      el.protoBtn.setAttribute("aria-pressed", "true");
      el.scroll.scrollTop = 0;
      loadProtoPage(current(), state.device, false);
      if (!state.hinted) {
        state.hinted = true;
        showToast("Реальные переходы — на <b>главной</b>. Включи «Ссылки», чтобы увидеть хотспоты.");
      }
    } else {
      el.protoBtn.setAttribute("aria-pressed", "false");
      el.artlabel.innerHTML = artLabel(current(), state.device);
      fit();
      if (options.focus) el.protoBtn.focus();
    }
    document.body.classList.toggle("pv-proto-open", isProto);
  }

  let toastTimer = 0;
  function showToast(html) {
    if (!el.toast) return;
    el.toast.innerHTML = html;
    el.toast.classList.add("is-on");
    clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => el.toast.classList.remove("is-on"), 4200);
  }

  /* Open / close -------------------------------------------------------- */
  function open(opts) {
    const options = opts || {};
    state.lastFocus = document.activeElement;
    state.isOpen = true;
    state.device = window.matchMedia("(max-width: 760px)").matches ? "phone" : "desktop";
    pv.classList.toggle("is-phone", state.device === "phone");
    el.devices.forEach((btn) => btn.setAttribute("aria-pressed", String(btn.dataset.pvDevice === state.device)));
    state.mode = "editor";
    pv.classList.remove("is-proto", "pv-side-open", "pv--show-links");
    pv.classList.toggle("is-phone", state.device === "phone");
    if (el.linksToggle) el.linksToggle.setAttribute("aria-pressed", "false");
    if (el.note) el.note.innerHTML = '';
    pv.hidden = false;
    document.documentElement.classList.add("pv-open");
    requestAnimationFrame(() => pv.classList.add("is-open"));
    pv.classList.toggle("pv-side-open", window.matchMedia("(max-width: 760px)").matches ? false : true);
    loadManifest().then(() => {
      if (el.search) {
        el.search.value = "";
        refreshPages();
      }
      const start = options.path ? byPath(options.path) : -1;
      selectPage(start >= 0 ? start : 0, { animate: false, push: false });
      setMode("editor", { focus: false });
      requestAnimationFrame(() => {
        fit();
        const shell = $(".pv__shell");
        if (shell) shell.focus();
      });
      try {
        const url = new URL(window.location.href);
        url.searchParams.set("proto", pv.dataset.project || "sms");
        window.history.replaceState(null, "", url);
      } catch (e) {}
      showToast("Канвас: тяни мышью, <b>Ctrl/⌘ + колесо</b> — зум. Режим «Прототип» — справа сверху.");
    });
  }

  function close() {
    if (!state.isOpen) return;
    state.isOpen = false;
    pv.classList.remove("is-open", "is-proto", "is-phone", "pv-side-open");
    pv.classList.remove("pv--show-links");
    document.documentElement.classList.remove("pv-open");
    document.body.classList.remove("pv-proto-open");
    if (el.linksToggle) el.linksToggle.setAttribute("aria-pressed", "false");
    if (state.mode === "proto") setMode("editor", {});
    window.setTimeout(() => {
      if (!state.isOpen) pv.hidden = true;
    }, 240);
    try {
      const url = new URL(window.location.href);
      url.searchParams.delete("proto");
      window.history.replaceState(null, "", url);
    } catch (e) {}
    if (state.lastFocus && document.contains(state.lastFocus)) state.lastFocus.focus();
  }

  /* Events -------------------------------------------------------------- */
  el.close.addEventListener("click", close);
  const scrim = $("[data-pv-scrim]");
  if (scrim) scrim.addEventListener("click", close);
  el.protoBtn.addEventListener("click", () => setMode(state.mode === "proto" ? "editor" : "proto", { focus: true }));
  el.exitProto.addEventListener("click", () => {
    setMode("editor", { focus: true });
    el.protoBtn.focus();
  });

  el.devices.forEach((btn) => {
    btn.addEventListener("click", () => {
      const next = btn.dataset.pvDevice;
      if (next === state.device) return;
      setDevice(next);
      if (state.mode === "proto") {
        loadProtoPage(current(), state.device, false);
        el.artlabel.innerHTML = artLabel(current(), state.device);
      } else {
        loadEditorImage(current(), state.device);
        el.artlabel.innerHTML = artLabel(current(), state.device);
        fit();
      }
    });
  });

  el.zoomIn.addEventListener("click", () => zoomCenter(1.2));
  el.zoomOut.addEventListener("click", () => zoomCenter(1 / 1.2));
  el.zoomFit.addEventListener("click", fit);

  el.search.addEventListener("input", refreshPages);
  el.searchClear.addEventListener("click", () => {
    el.search.value = "";
    refreshPages();
    el.search.focus();
  });

  el.back.addEventListener("click", () => {
    if (!state.history.length) return;
    const prev = state.history.pop();
    selectPage(prev, { animate: true, push: false, fromHistory: true });
  });
  el.home.addEventListener("click", () => {
    state.history.push(state.pageIndex);
    goTo(0, "home");
  });
  $$("[data-pv-pages-toggle]").forEach((btn) => btn.addEventListener("click", () => pv.classList.toggle("pv-side-open")));
  el.linksToggle.addEventListener("click", () => {
    const on = pv.classList.toggle("pv--show-links");
    el.linksToggle.setAttribute("aria-pressed", String(on));
  });

  /* Canvas pan + zoom ---------------------------------------------------- */
  let drag = null;
  el.canvas.addEventListener("pointerdown", (event) => {
    if (state.mode !== "editor") return;
    if (event.button !== 0) return;
    if (event.target.closest("button, a, input")) return;
    drag = { x: event.clientX, y: event.clientY, tx: state.tx, ty: state.ty };
    el.canvas.classList.add("is-dragging");
    el.canvas.setPointerCapture(event.pointerId);
  });
  el.canvas.addEventListener("pointermove", (event) => {
    if (!drag) return;
    state.tx = drag.tx + (event.clientX - drag.x);
    state.ty = drag.ty + (event.clientY - drag.y);
    applyStage();
  });
  const endDrag = () => {
    drag = null;
    el.canvas.classList.remove("is-dragging");
  };
  el.canvas.addEventListener("pointerup", endDrag);
  el.canvas.addEventListener("pointercancel", endDrag);

  el.canvas.addEventListener(
    "wheel",
    (event) => {
      if (state.mode !== "editor") return;
      event.preventDefault();
      const rect = el.canvas.getBoundingClientRect();
      if (event.ctrlKey || event.metaKey) {
        const factor = Math.exp(-event.deltaY * 0.0022);
        zoomAt(event.clientX - rect.left, event.clientY - rect.top, factor);
      } else {
        state.tx -= event.deltaX;
        state.ty -= event.deltaY;
        applyStage();
      }
    },
    { passive: false }
  );

  /* Keyboard ------------------------------------------------------------- */
  function focusables() {
    return $$('button:not([disabled]):not([hidden]), a[href], input:not([hidden]), [tabindex]:not([tabindex="-1"])', pv).filter(
      (node) => node.offsetParent !== null || node === document.activeElement
    );
  }

  document.addEventListener("keydown", (event) => {
    if (!state.isOpen) return;
    const tag = (event.target.tagName || "").toLowerCase();
    const typing = tag === "input" || tag === "textarea";
    if (event.key === "Escape") {
      event.preventDefault();
      if (state.mode === "proto") {
        setMode("editor", { focus: true });
        el.protoBtn.focus();
      } else {
        close();
      }
      return;
    }
    if (event.key === "Tab") {
      const list = focusables();
      if (!list.length) return;
      const first = list[0];
      const last = list[list.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
      return;
    }
    if (typing) return;
    if (event.key === "ArrowRight") {
      event.preventDefault();
      selectPage(Math.min(state.pageIndex + 1, state.manifest.pages.length - 1), { source: "key" });
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      selectPage(Math.max(state.pageIndex - 1, 0), { source: "key" });
    } else if (event.key === "+" || event.key === "=") {
      if (state.mode === "editor") { event.preventDefault(); zoomCenter(1.2); }
    } else if (event.key === "-" || event.key === "_") {
      if (state.mode === "editor") { event.preventDefault(); zoomCenter(1 / 1.2); }
    } else if (event.key === "0") {
      if (state.mode === "editor") { event.preventDefault(); fit(); }
    } else if (event.key.toLowerCase() === "p") {
      event.preventDefault();
      setMode(state.mode === "proto" ? "editor" : "proto", { focus: true });
    } else if (event.key === "/") {
      event.preventDefault();
      el.search.focus();
    }
  });

  window.addEventListener("resize", () => {
    if (!state.isOpen) return;
    if (state.mode === "editor") fit();
  });

  reduceMotion.addEventListener("change", (event) => {
    pv.classList.toggle("is-reduced", event.matches);
  });
  pv.classList.toggle("is-reduced", reduceMotion.matches);

  /* Openers -------------------------------------------------------------- */
  Array.from(document.querySelectorAll("[data-open-prototype]")).forEach((trigger) => {
    trigger.addEventListener("click", (event) => {
      event.preventDefault();
      open({ path: trigger.dataset.page || "/" });
    });
  });

  try {
    const params = new URLSearchParams(window.location.search);
    if (params.get("proto")) {
      requestAnimationFrame(() => open({ path: "/" }));
    }
  } catch (e) {}
})();
