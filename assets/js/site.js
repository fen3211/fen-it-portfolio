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


  /* Droppable desk props ------------------------------------------------ */
  const fallProps = $$(".desk-object[data-fall]");
  if (fallProps.length) {
    const dropProp = (el) => {
      if (el.dataset.falling === "true") return;
      el.dataset.falling = "true";
      el.style.pointerEvents = "none";
      if (reduceMotion.matches) {
        const fade = el.animate([{ opacity: 1 }, { opacity: 0 }, { opacity: 1 }], { duration: 380, easing: "ease-in-out" });
        fade.finished.then(() => { el.dataset.falling = "false"; el.style.pointerEvents = ""; }).catch(() => {});
        return;
      }
      const direction = el.dataset.fall === "left" ? -1 : 1;
      const fall = el.animate([
        { translate: "0 0", rotate: "0deg", opacity: 1 },
        { translate: `${direction * 70}px 48vh`, rotate: `${direction * 110}deg`, opacity: 1, offset: 0.58 },
        { translate: `${direction * 150}px 125vh`, rotate: `${direction * 260}deg`, opacity: 0 }
      ], { duration: 1050, easing: "cubic-bezier(0.55, 0.06, 0.68, 0.19)", fill: "both" });
      fall.finished.then(() => {
        window.setTimeout(() => {
          el.getAnimations().forEach((animation) => animation.cancel());
          el.style.translate = "";
          const enter = el.animate([
            { translate: `${direction * 40}px -75vh`, rotate: `${-direction * 60}deg`, opacity: 0 },
            { translate: "0 0", rotate: "0deg", opacity: 1 }
          ], { duration: 680, easing: "cubic-bezier(0.34, 1.56, 0.64, 1)", fill: "both" });
          enter.finished.then(() => {
            el.getAnimations().forEach((animation) => animation.cancel());
            el.dataset.falling = "false";
            el.style.pointerEvents = "";
          }).catch(() => {});
        }, 750);
      }).catch(() => {});
    };
    fallProps.forEach((el) => {
      el.addEventListener("click", () => dropProp(el));
      el.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          dropProp(el);
        }
      });
    });
  }

  /* Movable / resizable hero selection ---------------------------------- */
  const selection = $(".hero-selection");
  if (selection && finePointer.matches) {
    let selX = 0;
    let selY = 0;
    let selScale = 1;
    const applySelection = () => {
      selection.style.setProperty("--sel-x", `${selX.toFixed(2)}px`);
      selection.style.setProperty("--sel-y", `${selY.toFixed(2)}px`);
      selection.style.setProperty("--sel-scale", selScale.toFixed(4));
    };
    const resetSelection = () => {
      if (selX === 0 && selY === 0 && selScale === 1) return;
      const from = getComputedStyle(selection).transform;
      selX = 0;
      selY = 0;
      selScale = 1;
      applySelection();
      if (!reduceMotion.matches) {
        selection.animate(
          [{ transform: from }, { transform: "translate(0px, 0px) scale(1)" }],
          { duration: 360, easing: "cubic-bezier(0.16, 1, 0.3, 1)" }
        );
      }
    };
    const startMove = (event) => {
      if (event.button !== 0 || event.target.closest(".handle")) return;
      event.preventDefault();
      selection.focus({ preventScroll: true });
      const startX = event.clientX;
      const startY = event.clientY;
      const originX = selX;
      const originY = selY;
      selection.setPointerCapture(event.pointerId);
      selection.classList.add("is-manipulating");
      const onMove = (moveEvent) => {
        selX = clamp(originX + moveEvent.clientX - startX, -180, 180);
        selY = clamp(originY + moveEvent.clientY - startY, -120, 100);
        applySelection();
      };
      const onUp = () => {
        selection.removeEventListener("pointermove", onMove);
        selection.removeEventListener("pointerup", onUp);
        selection.removeEventListener("pointercancel", onUp);
        selection.classList.remove("is-manipulating");
        if (selection.hasPointerCapture?.(event.pointerId)) selection.releasePointerCapture(event.pointerId);
      };
      selection.addEventListener("pointermove", onMove);
      selection.addEventListener("pointerup", onUp);
      selection.addEventListener("pointercancel", onUp);
    };
    const startResize = (event) => {
      if (event.button !== 0) return;
      event.preventDefault();
      event.stopPropagation();
      const handle = event.currentTarget;
      const corner = handle.dataset.handle;
      const rect = selection.getBoundingClientRect();
      const anchors = {
        tl: [rect.right, rect.bottom],
        tr: [rect.left, rect.bottom],
        bl: [rect.right, rect.top],
        br: [rect.left, rect.top]
      };
      const vectors = {
        tl: [-selection.offsetWidth / 2, -selection.offsetHeight / 2],
        tr: [selection.offsetWidth / 2, -selection.offsetHeight / 2],
        bl: [-selection.offsetWidth / 2, selection.offsetHeight / 2],
        br: [selection.offsetWidth / 2, selection.offsetHeight / 2]
      };
      const anchor = anchors[corner];
      const vector = vectors[corner];
      const startDistance = Math.max(24, Math.hypot(event.clientX - anchor[0], event.clientY - anchor[1]));
      const startScale = selScale;
      const startX = selX;
      const startY = selY;
      handle.setPointerCapture(event.pointerId);
      selection.classList.add("is-manipulating");
      const onMove = (moveEvent) => {
        const distance = Math.hypot(moveEvent.clientX - anchor[0], moveEvent.clientY - anchor[1]);
        const nextScale = clamp(startScale * (distance / startDistance), 0.5, 1.65);
        selScale = nextScale;
        selX = clamp(startX + (startScale - nextScale) * vector[0], -260, 260);
        selY = clamp(startY + (startScale - nextScale) * vector[1], -180, 180);
        applySelection();
      };
      const onUp = () => {
        handle.removeEventListener("pointermove", onMove);
        handle.removeEventListener("pointerup", onUp);
        handle.removeEventListener("pointercancel", onUp);
        selection.classList.remove("is-manipulating");
        if (handle.hasPointerCapture?.(event.pointerId)) handle.releasePointerCapture(event.pointerId);
      };
      handle.addEventListener("pointermove", onMove);
      handle.addEventListener("pointerup", onUp);
      handle.addEventListener("pointercancel", onUp);
    };
    selection.addEventListener("pointerdown", startMove);
    $$(".handle", selection).forEach((handle) => {
      handle.addEventListener("pointerdown", startResize);
    });
    selection.addEventListener("dblclick", resetSelection);
    selection.addEventListener("keydown", (event) => {
      const step = event.shiftKey ? 30 : 10;
      if (event.key === "ArrowLeft") { selX = clamp(selX - step, -180, 180); applySelection(); event.preventDefault(); }
      else if (event.key === "ArrowRight") { selX = clamp(selX + step, -180, 180); applySelection(); event.preventDefault(); }
      else if (event.key === "ArrowUp") { selY = clamp(selY - step, -120, 100); applySelection(); event.preventDefault(); }
      else if (event.key === "ArrowDown") { selY = clamp(selY + step, -120, 100); applySelection(); event.preventDefault(); }
      else if (event.key === "+" || event.key === "=") { selScale = clamp(selScale + 0.08, 0.5, 1.65); applySelection(); event.preventDefault(); }
      else if (event.key === "-" || event.key === "_") { selScale = clamp(selScale - 0.08, 0.5, 1.65); applySelection(); event.preventDefault(); }
      else if (event.key === "0") { resetSelection(); event.preventDefault(); }
    });
  }

  /* Work mini-card + dismiss burst -------------------------------------- */
  const wm = $("#work-modal");
  if (wm) {
    const wmCard = $(".wm__card", wm);
    const wmClose = $$("[data-wm-close]", wm);
    const wmScrim = $("[data-wm-scrim]", wm);
    const wmImg = $("[data-wm-img]", wm);
    const wmUrl = $("[data-wm-url]", wm);
    const wmMeta = $("[data-wm-meta]", wm);
    const wmTitle = $("[data-wm-title]", wm);
    const wmDesc = $("[data-wm-desc]", wm);
    const wmCase = $("[data-wm-case]", wm);
    const wmBurst = $("[data-wm-burst]", wm);
    const wmCtx = wmBurst.getContext("2d");
    let wmTrigger = null;
    let wmOpen = false;
    let wmClosing = false;
    let wmBurstFrame = 0;

    const modalOpen = (trigger) => {
      if (wmOpen) return;
      const card = trigger.closest(".work-card");
      if (!card) return;
      const title = ($("h3", card) || {}).textContent || "";
      const desc = ($(".work-card__body > p", card) || {}).textContent || "";
      const meta = $$(".work-card__meta span", card).map((el) => el.textContent.trim()).join(" / ");
      const img = $(".browser-preview img", card);
      const href = trigger.getAttribute("href") || "#";
      const chrome = $(".browser-chrome small", card);
      wmImg.src = img ? img.currentSrc || img.src : "";
      wmImg.alt = img ? img.alt : title;
      wmUrl.textContent = chrome ? chrome.textContent.trim() : href.replace(/^work\//, "").replace(/\.html$/, "");
      wmMeta.textContent = meta;
      wmTitle.textContent = title;
      wmDesc.textContent = desc;
      wmCase.href = href;
      wmTrigger = trigger;
      wmOpen = true;
      wmClosing = false;
      wmCard.classList.remove("is-closing", "is-in");
      wm.classList.remove("is-closing");
      void wmCard.offsetWidth;
      wmCard.classList.add("is-in");
      wm.hidden = false;
      document.documentElement.classList.add("wm-open");
      requestAnimationFrame(() => {
        wm.classList.add("is-open");
        const closeBtn = $(".wm__close", wm);
        if (closeBtn) closeBtn.focus();
      });
    };

    const burst = (origin) => {
      if (reduceMotion.matches) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const W = window.innerWidth;
      const H = window.innerHeight;
      wmBurst.width = Math.round(W * dpr);
      wmBurst.height = Math.round(H * dpr);
      wmCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const colors = ["196, 245, 41", "244, 243, 237", "22, 69, 234", "255, 112, 47"];
      const rays = [];
      const dots = [];
      for (let i = 0; i < 38; i += 1) {
        rays.push({
          a: Math.random() * Math.PI * 2,
          len: 90 + Math.random() * 380,
          w: 0.8 + Math.random() * 2.4,
          c: colors[i % colors.length],
          start: Math.random() * 0.18
        });
      }
      for (let i = 0; i < 44; i += 1) {
        const a = Math.random() * Math.PI * 2;
        const dist = 60 + Math.random() * 300;
        dots.push({
          a,
          dist,
          size: 1.5 + Math.random() * 3.2,
          c: colors[i % colors.length],
          grav: 30 + Math.random() * 120,
          delay: Math.random() * 0.15
        });
      }
      const start = performance.now();
      const dur = 780;
      const drawBurst = (now) => {
        wmBurstFrame = 0;
        const t = Math.min(1, (now - start) / dur);
        const ease = 1 - Math.pow(1 - t, 3);
        wmCtx.clearRect(0, 0, W, H);
        wmCtx.globalCompositeOperation = "lighter";
        const flashR = 60 + ease * 560;
        const flash = wmCtx.createRadialGradient(origin.x, origin.y, 0, origin.x, origin.y, flashR);
        flash.addColorStop(0, "rgba(255,255,255," + 0.85 * (1 - t) + ")");
        flash.addColorStop(0.18, "rgba(196,245,41," + 0.55 * (1 - t) + ")");
        flash.addColorStop(0.55, "rgba(196,245,41," + 0.16 * (1 - t) + ")");
        flash.addColorStop(1, "rgba(196,245,41,0)");
        wmCtx.fillStyle = flash;
        wmCtx.beginPath();
        wmCtx.arc(origin.x, origin.y, flashR, 0, Math.PI * 2);
        wmCtx.fill();
        wmCtx.lineCap = "round";
        for (let i = 0; i < rays.length; i += 1) {
          const ray = rays[i];
          const grow = Math.min(1, Math.max(0, (ease - ray.start) / (1 - ray.start)));
          const inner = 12 + grow * 40;
          const outer = inner + grow * ray.len;
          wmCtx.strokeStyle = "rgba(" + ray.c + "," + (1 - t) * 0.55 + ")";
          wmCtx.lineWidth = ray.w * (1 - t * 0.5);
          wmCtx.beginPath();
          wmCtx.moveTo(origin.x + Math.cos(ray.a) * inner, origin.y + Math.sin(ray.a) * inner);
          wmCtx.lineTo(origin.x + Math.cos(ray.a) * outer, origin.y + Math.sin(ray.a) * outer);
          wmCtx.stroke();
        }
        for (let i = 0; i < dots.length; i += 1) {
          const d = dots[i];
          const local = Math.min(1, Math.max(0, (t - d.delay) / (1 - d.delay)));
          const e = 1 - Math.pow(1 - local, 2);
          const r = d.dist * e;
          const x = origin.x + Math.cos(d.a) * r;
          const y = origin.y + Math.sin(d.a) * r + d.grav * local * local;
          wmCtx.fillStyle = "rgba(" + d.c + "," + (1 - local) * 0.9 + ")";
          wmCtx.fillRect(x, y, d.size * (1 - local * 0.5), d.size * (1 - local * 0.5));
        }
        wmCtx.globalCompositeOperation = "source-over";
        if (t < 1) wmBurstFrame = requestAnimationFrame(drawBurst);
        else wmCtx.clearRect(0, 0, W, H);
      };
      wmBurstFrame = requestAnimationFrame(drawBurst);
    };

    const modalClose = () => {
      if (!wmOpen || wmClosing) return;
      wmClosing = true;
      if (wmBurstFrame) {
        cancelAnimationFrame(wmBurstFrame);
        wmBurstFrame = 0;
      }
      const closeBtn = $(".wm__close", wm);
      const rect = closeBtn ? closeBtn.getBoundingClientRect() : wmCard.getBoundingClientRect();
      const origin = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
      const finish = () => {
        wm.hidden = true;
        wm.classList.remove("is-open", "is-closing");
        wmCard.classList.remove("is-closing", "is-in");
        document.documentElement.classList.remove("wm-open");
        if (wmTrigger && document.contains(wmTrigger)) wmTrigger.focus();
        wmOpen = false;
        wmClosing = false;
        wmTrigger = null;
        wmCtx.clearRect(0, 0, wmBurst.width, wmBurst.height);
      };
      if (reduceMotion.matches) {
        window.setTimeout(finish, 60);
        return;
      }
      wm.classList.add("is-closing");
      wmCard.classList.remove("is-in");
      void wmCard.offsetWidth;
      wmCard.classList.add("is-closing");
      window.setTimeout(() => burst(origin), 140);
      window.setTimeout(finish, 700);
    };

    $$(".work-card__link").forEach((link) => {
      link.addEventListener("click", (event) => {
        if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
        event.preventDefault();
        modalOpen(link);
      });
    });

    wmClose.forEach((btn) => btn.addEventListener("click", modalClose));
    wmScrim.addEventListener("click", modalClose);
    document.addEventListener("keydown", (event) => {
      if (!wmOpen) return;
      if (event.key === "Escape") {
        event.preventDefault();
        modalClose();
        return;
      }
      if (event.key !== "Tab") return;
      const list = $$('button:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])', wmCard).filter((n) => n.offsetParent !== null);
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
    });
  }

  /* Works ripple — particle water pool -------------------------------- */
  const rippleCanvas = $("#works-ripple");
  if (rippleCanvas) {
    const section = $("#works");
    const ctx = rippleCanvas.getContext("2d", { alpha: true });
    const palette = ["22, 69, 234", "21, 21, 21", "148, 186, 26"];
    const state = {
      w: 0, h: 0, dpr: 1, radius: 300, points: [],
      cx: 0, cy: 0, tx: 0, ty: 0,
      active: 0.35, targetActive: 0.35, visible: false, frame: 0
    };
    const base = { x: 0.66, y: 0.24 };

    const build = () => {
      const gap = state.w < 760 ? 7 : 9;
      const rings = Math.floor(state.radius / gap);
      const pts = [];
      for (let i = 1; i <= rings; i += 1) {
        const r = i * gap;
        const count = Math.max(9, Math.round((Math.PI * 2 * r) / gap));
        const offset = Math.random() * Math.PI * 2;
        for (let j = 0; j < count; j += 1) {
          const rnd = Math.random();
          pts.push({
            r,
            a: offset + (j / count) * Math.PI * 2,
            tone: rnd < 0.88 ? 0 : rnd < 0.97 ? 1 : 2,
            size: 0.75 + Math.random() * 0.85
          });
        }
      }
      state.points = pts;
    };

    const resize = () => {
      const rect = section.getBoundingClientRect();
      state.w = Math.max(1, rect.width);
      state.h = Math.max(1, rect.height);
      state.dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      state.radius = clamp(Math.min(state.w, 760) * 0.5, 190, 360);
      rippleCanvas.width = Math.round(state.w * state.dpr);
      rippleCanvas.height = Math.round(state.h * state.dpr);
      ctx.setTransform(state.dpr, 0, 0, state.dpr, 0, 0);
      if (!state.cx) {
        state.cx = state.w * base.x;
        state.cy = state.h * base.y;
        state.tx = state.cx;
        state.ty = state.cy;
      }
      build();
      if (reduceMotion.matches) draw(0);
    };

    const draw = (now) => {
      if (!state.w || !state.h) return;
      const t = now;
      const time = t * 0.0011;
      const amp = 0.3 + state.active * 0.7;
      const R = state.radius;
      const swirl = Math.sin(time * 0.35) * 0.035;
      ctx.clearRect(0, 0, state.w, state.h);
      ctx.globalAlpha = 1;
      let activeTone = -1;
      for (let i = 0; i < state.points.length; i += 1) {
        const p = state.points[i];
        const edge = Math.min(1, Math.max(0, (R - p.r) / 70));
        if (edge <= 0) continue;
        const wave = Math.sin(p.r * 0.052 - t * 0.0038 + p.a * 0.12) * Math.exp(-p.r / 520) * 23 * amp;
        const dimple = Math.exp(-(p.r * p.r) / 16000) * 24 * amp;
        const h = wave - dimple;
        const crest = Math.max(0, Math.min(1, (h + 30) / 60));
        const rad = p.r + h * 0.45;
        const angle = p.a + swirl + Math.sin(p.r * 0.01 + time) * 0.02;
        const x = state.cx + Math.cos(angle) * rad;
        const y = state.cy + Math.sin(angle) * rad + h * 1.15;
        if (x < -12 || y < -12 || x > state.w + 12 || y > state.h + 12) continue;
        if (p.tone !== activeTone) {
          activeTone = p.tone;
          ctx.fillStyle = "rgba(" + palette[p.tone] + ", 1)";
        }
        ctx.globalAlpha = (0.06 + Math.pow(crest, 1.4) * 0.62) * edge;
        const size = p.size * (0.7 + crest * 1.1);
        ctx.fillRect(x, y, size, size);
      }
      ctx.globalAlpha = 1;
    };

    const tick = (now) => {
      state.frame = 0;
      if (!state.visible) return;
      state.cx = lerp(state.cx, state.tx, 0.06);
      state.cy = lerp(state.cy, state.ty, 0.06);
      state.active = lerp(state.active, state.targetActive, 0.04);
      draw(now);
      if (!reduceMotion.matches) state.frame = requestAnimationFrame(tick);
    };

    const start = () => {
      if (state.frame || reduceMotion.matches) return;
      state.frame = requestAnimationFrame(tick);
    };

    const restCenter = () => {
      state.tx = state.w * base.x;
      state.ty = state.h * base.y;
      state.targetActive = 0.35;
    };

    resize();
    restCenter();
    if (reduceMotion.matches) {
      draw(0);
    } else {
      if (finePointer.matches) {
        section.addEventListener("pointermove", (event) => {
          const rect = section.getBoundingClientRect();
          state.tx = clamp(event.clientX - rect.left, 0, state.w);
          state.ty = clamp(event.clientY - rect.top, 0, state.h);
          state.targetActive = 1;
          start();
        }, { passive: true });
        section.addEventListener("pointerleave", restCenter);
      }
      if ("IntersectionObserver" in window) {
        new IntersectionObserver(([entry]) => {
          state.visible = entry.isIntersecting;
          if (state.visible) start();
        }, { rootMargin: "160px 0px" }).observe(section);
      } else {
        state.visible = true;
        start();
      }
    }
    let rippleTimer = 0;
    window.addEventListener("resize", () => {
      clearTimeout(rippleTimer);
      rippleTimer = window.setTimeout(() => {
        resize();
        restCenter();
        if (reduceMotion.matches) draw(0);
      }, 180);
    });
    reduceMotion.addEventListener("change", () => {
      if (reduceMotion.matches) {
        if (state.frame) cancelAnimationFrame(state.frame);
        state.frame = 0;
        draw(0);
      } else {
        start();
      }
    });
    document.addEventListener("visibilitychange", () => {
      if (document.hidden && state.frame) {
        cancelAnimationFrame(state.frame);
        state.frame = 0;
      } else if (!document.hidden && state.visible) {
        start();
      }
    });
  }

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
