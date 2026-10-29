"use strict";

(() => {
  const root = document.documentElement;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const finePointer = window.matchMedia("(pointer: fine)");
  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));

  const lerp = (a, b, t) => a + (b - a) * t;
  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

  /* Page transition ----------------------------------------------------- */
  const transition = $(".page-transition");
  const isInternalPageLink = (link) => {
    if (!(link instanceof HTMLAnchorElement)) return false;
    if (link.target === "_blank" || link.hasAttribute("download")) return false;
    if (link.dataset.noTransition !== undefined) return false;
    if (link.getAttribute("href")?.startsWith("#")) return false;
    if (link.protocol !== location.protocol || link.host !== location.host) return false;
    const url = new URL(link.href, location.href);
    if (url.pathname === location.pathname) return false;
    return /\.html?$/.test(url.pathname) || url.pathname.endsWith("/");
  };

  if (transition) {
    if (!reduceMotion.matches) {
      document.addEventListener("click", (event) => {
        if (event.defaultPrevented || event.button !== 0) return;
        if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
        const link = event.target instanceof Element ? event.target.closest("a[href]") : null;
        if (!link || !isInternalPageLink(link)) return;
        event.preventDefault();
        try { sessionStorage.setItem("fen-nav", "1"); } catch { /* private mode */ }
        transition.classList.add("is-active");
        window.setTimeout(() => { location.href = link.href; }, reduceMotion.matches ? 0 : 400);
      });
    }
    window.addEventListener("pageshow", (event) => {
      if (!event.persisted) return;
      transition.classList.remove("is-active", "is-out");
    });
  }

  /* Header progress ------------------------------------------------------ */
  const progress = $(".scroll-progress span");
  let scrollTicking = false;
  const updateProgress = () => {
    if (!progress) return;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const value = max > 0 ? clamp(window.scrollY / max, 0, 1) : 0;
    progress.style.transform = `scaleX(${value})`;
    scrollTicking = false;
  };
  if (progress) {
    updateProgress();
    window.addEventListener("scroll", () => {
      if (scrollTicking) return;
      scrollTicking = true;
      requestAnimationFrame(updateProgress);
    }, { passive: true });
    window.addEventListener("resize", updateProgress);
  }

  /* Mobile menu ---------------------------------------------------------- */
  const menuButton = $(".menu-btn");
  const menu = $("#site-menu");
  if (menuButton && menu) {
    let lastFocused = null;
    const focusable = () => $$('a[href], button:not([disabled])', menu);
    const setOpen = (open) => {
      menuButton.setAttribute("aria-expanded", String(open));
      menuButton.setAttribute("aria-label", open ? "Закрыть меню" : "Открыть меню");
      menu.classList.toggle("is-open", open);
      menu.setAttribute("aria-hidden", String(!open));
      document.body.classList.toggle("is-locked", open);
      if (open) {
        lastFocused = document.activeElement;
        window.setTimeout(() => { const first = focusable()[0]; if (first) first.focus(); }, 80);
      } else if (lastFocused instanceof HTMLElement) {
        lastFocused.focus();
      }
    };
    menuButton.addEventListener("click", () => setOpen(menuButton.getAttribute("aria-expanded") !== "true"));
    $$("a[href]", menu).forEach((link) => link.addEventListener("click", () => setOpen(false)));
    document.addEventListener("keydown", (event) => {
      if (!menu.classList.contains("is-open")) return;
      if (event.key === "Escape") { event.preventDefault(); setOpen(false); return; }
      if (event.key !== "Tab") return;
      const items = focusable();
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    });
    window.matchMedia("(min-width: 901px)").addEventListener("change", (event) => {
      if (event.matches) setOpen(false);
    });
  }

  /* Cursor --------------------------------------------------------------- */
  const cursor = $(".cursor");
  if (cursor && finePointer.matches && !reduceMotion.matches) {
    const dot = $(".cursor__dot", cursor);
    const ring = $(".cursor__ring", cursor);
    const label = $(".cursor__label", cursor);
    let pointerX = window.innerWidth / 2;
    let pointerY = window.innerHeight / 2;
    let dotX = pointerX;
    let dotY = pointerY;
    let ringX = pointerX;
    let ringY = pointerY;
    let cursorVisible = false;
    let lastTrailAt = 0;
    let lastTrailX = 0;
    let lastTrailY = 0;

    root.classList.add("has-cursor");
    window.addEventListener("pointermove", (event) => {
      pointerX = event.clientX;
      pointerY = event.clientY;
      if (!cursorVisible) {
        cursorVisible = true;
        cursor.classList.remove("is-hidden");
        dotX = ringX = pointerX;
        dotY = ringY = pointerY;
      }
      const now = performance.now();
      const distance = Math.hypot(pointerX - lastTrailX, pointerY - lastTrailY);
      if (now - lastTrailAt > 55 && distance > 14) {
        lastTrailAt = now;
        lastTrailX = pointerX;
        lastTrailY = pointerY;
        const trail = document.createElement("span");
        trail.className = "cursor-trail";
        trail.style.left = `${pointerX}px`;
        trail.style.top = `${pointerY}px`;
        document.body.appendChild(trail);
        const trails = document.querySelectorAll(".cursor-trail");
        if (trails.length > 12) trails[0].remove();
        window.setTimeout(() => trail.remove(), 700);
      }
    }, { passive: true });
    document.addEventListener("pointerleave", () => {
      cursorVisible = false;
      cursor.classList.add("is-hidden");
    });
    window.addEventListener("pointerdown", () => cursor.classList.add("is-down"));
    window.addEventListener("pointerup", () => cursor.classList.remove("is-down"));

    const setCursorLabel = (target) => {
      const host = target instanceof Element ? target.closest("[data-cursor]") : null;
      if (host) {
        cursor.classList.add("is-active");
        if (label) label.textContent = host.dataset.cursor || "";
      } else {
        cursor.classList.remove("is-active");
        if (label) label.textContent = "";
      }
    };
    document.addEventListener("pointerover", (event) => setCursorLabel(event.target));

    const tick = () => {
      dotX = lerp(dotX, pointerX, 0.6);
      dotY = lerp(dotY, pointerY, 0.6);
      ringX = lerp(ringX, pointerX, 0.16);
      ringY = lerp(ringY, pointerY, 0.16);
      if (dot) dot.style.transform = `translate3d(${dotX}px, ${dotY}px, 0) translate(-50%, -50%)`;
      if (ring) ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`;
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  /* Magnetic buttons ----------------------------------------------------- */
  if (finePointer.matches && !reduceMotion.matches) {
    const magnets = $$("[data-magnetic]").map((el) => ({ el, x: 0, y: 0, tx: 0, ty: 0, active: false }));
    magnets.forEach((item) => {
      item.el.addEventListener("pointermove", (event) => {
        const rect = item.el.getBoundingClientRect();
        item.tx = ((event.clientX - rect.left) / rect.width - 0.5) * 10;
        item.ty = ((event.clientY - rect.top) / rect.height - 0.5) * 8;
        item.active = true;
      });
      item.el.addEventListener("pointerleave", () => { item.tx = 0; item.ty = 0; });
    });
    const magnetTick = () => {
      magnets.forEach((item) => {
        item.x = lerp(item.x, item.tx, 0.18);
        item.y = lerp(item.y, item.ty, 0.18);
        if (Math.abs(item.x) < 0.01 && Math.abs(item.y) < 0.01) {
          item.el.style.transform = "";
        } else {
          item.el.style.transform = `translate3d(${item.x}px, ${item.y}px, 0)`;
        }
      });
      requestAnimationFrame(magnetTick);
    };
    requestAnimationFrame(magnetTick);
  }

  /* Tilt plates ---------------------------------------------------------- */
  if (finePointer.matches && !reduceMotion.matches) {
    const plates = $$("[data-tilt]");
    plates.forEach((plate) => {
      let frame = 0;
      let rx = 0;
      let ry = 0;
      const apply = () => {
        plate.style.setProperty("--rx", `${rx.toFixed(2)}deg`);
        plate.style.setProperty("--ry", `${ry.toFixed(2)}deg`);
        frame = 0;
      };
      plate.addEventListener("pointermove", (event) => {
        const rect = plate.getBoundingClientRect();
        const px = (event.clientX - rect.left) / rect.width - 0.5;
        const py = (event.clientY - rect.top) / rect.height - 0.5;
        ry = px * 5;
        rx = -py * 5;
        if (!frame) frame = requestAnimationFrame(apply);
      }, { passive: true });
      plate.addEventListener("pointerleave", () => {
        rx = 0;
        ry = 0;
        if (!frame) frame = requestAnimationFrame(apply);
      });
    });
  }

  /* Hero props parallax + spotlight -------------------------------------- */
  if (finePointer.matches && !reduceMotion.matches) {
    const heroStage = $(".hero");
    if (heroStage) {
      const props = $$(".desk-object", heroStage).map((el) => ({
        el,
        depth: Number(el.dataset.depth) || 20,
        x: 0,
        y: 0,
        tx: 0,
        ty: 0,
      }));
      let heroFrame = 0;
      let heroActive = false;
      const animateProps = () => {
        let moving = false;
        props.forEach((prop) => {
          prop.x = lerp(prop.x, prop.tx, 0.09);
          prop.y = lerp(prop.y, prop.ty, 0.09);
          if (Math.abs(prop.x - prop.tx) > 0.04 || Math.abs(prop.y - prop.ty) > 0.04) moving = true;
          prop.el.style.translate = `${prop.x.toFixed(2)}px ${prop.y.toFixed(2)}px`;
        });
        heroFrame = moving || heroActive ? requestAnimationFrame(animateProps) : 0;
      };
      heroStage.addEventListener("pointermove", (event) => {
        const rect = heroStage.getBoundingClientRect();
        const nx = (event.clientX - rect.left) / rect.width - 0.5;
        const ny = (event.clientY - rect.top) / rect.height - 0.5;
        heroStage.style.setProperty("--mx", `${((event.clientX - rect.left) / rect.width) * 100}%`);
        heroStage.style.setProperty("--my", `${((event.clientY - rect.top) / rect.height) * 100}%`);
        props.forEach((prop) => {
          prop.tx = nx * prop.depth;
          prop.ty = ny * prop.depth;
        });
        heroActive = true;
        if (!heroFrame) heroFrame = requestAnimationFrame(animateProps);
      }, { passive: true });
      heroStage.addEventListener("pointerleave", () => {
        heroActive = false;
        props.forEach((prop) => { prop.tx = 0; prop.ty = 0; });
        if (!heroFrame) heroFrame = requestAnimationFrame(animateProps);
      });
    }
  }

  /* Browser preview pan --------------------------------------------------- */
  if (finePointer.matches && !reduceMotion.matches) {
    $$(".browser-preview").forEach((frame) => {
      const image = $("img", frame);
      if (!image) return;
      frame.addEventListener("pointermove", (event) => {
        const rect = frame.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - 0.5;
        const y = (event.clientY - rect.top) / rect.height - 0.5;
        image.style.setProperty("--pan-x", `${(-x * 10).toFixed(1)}px`);
        image.style.setProperty("--pan-y", `${(-y * 8).toFixed(1)}px`);
      }, { passive: true });
      frame.addEventListener("pointerleave", () => {
        image.style.setProperty("--pan-x", "0px");
        image.style.setProperty("--pan-y", "0px");
      });
    });
  }

  /* Reveals -------------------------------------------------------------- */
  const revealItems = $$("[data-reveal]");
  if (revealItems.length) {
    if (reduceMotion.matches || !("IntersectionObserver" in window)) {
      revealItems.forEach((item) => item.classList.add("is-in"));
    } else {
      // A clip-path reveal clips the element's own intersection rect, so observe
      // its parent and pass the class down to the clipped heading.
      const targets = new Map();
      revealItems.forEach((item) => {
        const target = item.dataset.reveal === "mask" && item.parentElement ? item.parentElement : item;
        if (!targets.has(target)) targets.set(target, []);
        targets.get(target).push(item);
      });
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const items = targets.get(entry.target) || [entry.target];
          items.forEach((item) => item.classList.add("is-in"));
          observer.unobserve(entry.target);
        });
      }, { rootMargin: "0px 0px -8% 0px", threshold: 0.12 });
      targets.forEach((_items, target) => observer.observe(target));
    }
  }

  /* Hero index preview --------------------------------------------------- */
  const preview = $("[data-hero-preview]");
  const previewMedia = preview ? $(".hero__preview-media", preview) : null;
  const previewLabel = preview ? $(".hero__preview-label span:first-child", preview) : null;
  const previewRows = $$(".hero-index li[data-preview]");
  if (preview && previewMedia && previewRows.length) {
    const images = previewRows.map((row) => {
      const img = document.createElement("img");
      img.alt = "";
      img.decoding = "async";
      img.dataset.src = row.dataset.preview;
      previewMedia.appendChild(img);
      return img;
    });
    const initial = clamp(Number(preview.dataset.default || 0), 0, images.length - 1);
    let active = -1;
    const show = (index) => {
      if (index === active) return;
      const previous = active;
      active = index;
      images.forEach((img, i) => {
        if (!img.src) img.src = img.dataset.src;
        if (i === previous) {
          img.classList.remove("is-active");
          img.classList.add("is-leaving");
          window.setTimeout(() => img.classList.remove("is-leaving"), 680);
        } else if (i !== index) {
          img.classList.remove("is-active", "is-leaving");
        }
      });
      const next = images[index];
      if (next) {
        next.classList.remove("is-leaving", "is-active");
        void next.offsetWidth;
        next.classList.add("is-active");
      }
      const row = previewRows[index];
      if (previewLabel && row) previewLabel.textContent = row.dataset.label || "";
    };
    previewRows.forEach((row, index) => {
      const link = $("a", row);
      if (!link) return;
      const activate = () => show(index);
      link.addEventListener("pointerenter", activate);
      link.addEventListener("focus", activate);
    });
    show(initial);
    const warm = () => {
      previewRows.forEach((row) => {
        const img = new Image();
        img.src = row.dataset.preview;
      });
    };
    if ("requestIdleCallback" in window) window.requestIdleCallback(warm, { timeout: 2500 });
    else window.setTimeout(warm, 1600);

    if (finePointer.matches) {
      let dragStart = 0;
      let dragOffset = 0;
      let dragging = false;
      const finishDrag = () => {
        if (!dragging) return;
        dragging = false;
        preview.classList.remove("is-dragging");
        preview.style.translate = "";
        if (Math.abs(dragOffset) > 42) {
          const direction = dragOffset < 0 ? 1 : -1;
          show((active + direction + images.length) % images.length);
        }
        dragOffset = 0;
      };
      preview.addEventListener("pointerdown", (event) => {
        if (event.button !== 0) return;
        dragging = true;
        dragStart = event.clientX;
        dragOffset = 0;
        preview.classList.add("is-dragging");
        if (preview.setPointerCapture) preview.setPointerCapture(event.pointerId);
      });
      preview.addEventListener("pointermove", (event) => {
        if (!dragging) return;
        dragOffset = event.clientX - dragStart;
        preview.style.translate = `${dragOffset.toFixed(1)}px 0`;
      });
      preview.addEventListener("pointerup", finishDrag);
      preview.addEventListener("pointercancel", finishDrag);
      preview.addEventListener("lostpointercapture", finishDrag);
    }
  }

  /* Project filters (FLIP) ----------------------------------------------- */
  const filterButtons = $$("[data-filter]");
  const worksGrid = $("[data-works]");
  if (filterButtons.length && worksGrid) {
    const cards = $$(".work-card", worksGrid);
    const status = $(".filters__note");
    const applyFilter = (value) => {
      const firstRects = new Map();
      cards.forEach((card) => {
        if (!card.hidden) firstRects.set(card, card.getBoundingClientRect());
      });
      cards.forEach((card) => {
        card.hidden = !(value === "all" || card.dataset.category === value);
      });
      worksGrid.dataset.active = value;
      const visible = cards.filter((card) => !card.hidden);
      if (status) status.textContent = `Показано ${visible.length} из ${cards.length}`;

      if (reduceMotion.matches || typeof Element.prototype.animate !== "function") return;
      visible.forEach((card) => {
        const first = firstRects.get(card);
        const last = card.getBoundingClientRect();
        if (!first) {
          card.animate(
            [{ opacity: 0, transform: "translateY(18px)" }, { opacity: 1, transform: "none" }],
            { duration: 420, easing: "cubic-bezier(.16,1,.3,1)" }
          );
          return;
        }
        const dx = first.left - last.left;
        const dy = first.top - last.top;
        if (Math.abs(dx) < 1 && Math.abs(dy) < 1) return;
        card.animate(
          [{ transform: `translate(${dx}px, ${dy}px)` }, { transform: "none" }],
          { duration: 480, easing: "cubic-bezier(.16,1,.3,1)" }
        );
      });
    };
    filterButtons.forEach((button) => {
      button.addEventListener("click", () => {
        filterButtons.forEach((item) => item.setAttribute("aria-pressed", String(item === button)));
        applyFilter(button.dataset.filter || "all");
      });
    });
    applyFilter("all");
  }

  /* Copy email ----------------------------------------------------------- */
  const copyButton = $(".copy-email");
  const copyStatus = $(".copy-status");
  if (copyButton && copyStatus && navigator.clipboard && window.isSecureContext) {
    copyButton.hidden = false;
    let timer = 0;
    copyButton.addEventListener("click", async () => {
      copyButton.disabled = true;
      window.clearTimeout(timer);
      try {
        await navigator.clipboard.writeText("vlad2.0top@mail.ru");
        copyStatus.textContent = "Почта скопирована";
      } catch {
        copyStatus.textContent = "Не удалось скопировать — выдели адрес вручную";
      } finally {
        copyButton.disabled = false;
        timer = window.setTimeout(() => { copyStatus.textContent = ""; }, 5000);
      }
    });
  }

  /* Ticker pause offscreen ----------------------------------------------- */
  const ticker = $(".ticker");
  if (ticker && "IntersectionObserver" in window && !reduceMotion.matches) {
    const observer = new IntersectionObserver(([entry]) => {
      ticker.classList.toggle("is-paused", !entry.isIntersecting);
    }, { threshold: 0.05 });
    observer.observe(ticker);
  }

  /* Clock & year --------------------------------------------------------- */
  const timeElements = $$(".js-time");
  const updateClock = () => {
    if (!timeElements.length) return;
    let time = "";
    try {
      time = new Intl.DateTimeFormat("ru-RU", {
        timeZone: "Europe/Moscow",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false
      }).format(new Date());
    } catch {
      time = new Date().toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" });
    }
    timeElements.forEach((el) => { el.textContent = time; });
  };
  if (timeElements.length) {
    updateClock();
    window.setInterval(updateClock, 30000);
  }
  $$(".js-year").forEach((el) => { el.textContent = String(new Date().getFullYear()); });

  /* Reduced-motion changes at runtime ------------------------------------ */
  reduceMotion.addEventListener("change", (event) => {
    if (event.matches) {
      root.classList.remove("has-cursor");
      if (cursor) cursor.style.display = "none";
    }
  });


  /* Hero palette -------------------------------------------------------- */
  const heroRoot = $(".hero");
  const heroSwatches = $$(".swatch-strip .swatch");
  if (heroRoot && heroSwatches.length) {
    let committedTheme = "blue";
    const setHeroTheme = (theme, commit = false) => {
      heroRoot.dataset.heroTheme = theme;
      heroSwatches.forEach((button) => {
        button.setAttribute("aria-pressed", String(button.dataset.heroTheme === theme));
      });
      if (commit) committedTheme = theme;
    };
    setHeroTheme(committedTheme, true);
    heroSwatches.forEach((button) => {
      button.addEventListener("click", () => setHeroTheme(button.dataset.heroTheme || "blue", true));
      if (finePointer.matches) {
        button.addEventListener("pointerenter", () => setHeroTheme(button.dataset.heroTheme || "blue"));
        button.addEventListener("pointerleave", () => setHeroTheme(committedTheme));
        button.addEventListener("focus", () => setHeroTheme(button.dataset.heroTheme || "blue"));
        button.addEventListener("blur", () => setHeroTheme(committedTheme));
      }
    });
  }

  /* Yandex Metrika: production host only; local previews stay out of stats. */
  if (location.hostname === "fen3211.github.io") {
    const counterId = 112976314;
    window.YM_ID = counterId;
    window.ym = window.ym || function () { (window.ym.a = window.ym.a || []).push(arguments); };
    window.ym.l = Date.now();
    const script = document.createElement("script");
    script.async = true;
    script.src = "https://mc.yandex.ru/metrika/tag.js?id=" + counterId;
    document.head.appendChild(script);
    window.ym(counterId, "init", {
      ssr: true,
      webvisor: true,
      clickmap: true,
      ecommerce: "dataLayer",
      accurateTrackBounce: true,
      trackLinks: true
    });
    document.querySelectorAll('a[href^="https://t.me/"], a[href^="mailto:"]').forEach((link) => {
      link.addEventListener("click", () => {
        try { window.ym(counterId, "reachGoal", "lead_click"); } catch { /* analytics must not block contact */ }
      });
    });
  }
})();
