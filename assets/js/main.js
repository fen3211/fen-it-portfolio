"use strict";

(() => {
  const menuButton = document.querySelector(".menu-toggle");
  const mobileNav = document.getElementById("mobile-nav");
  if (menuButton instanceof HTMLButtonElement && mobileNav instanceof HTMLElement) {
    const closeMenu = (restoreFocus = false) => {
      menuButton.setAttribute("aria-expanded", "false");
      menuButton.setAttribute("aria-label", "Открыть меню");
      mobileNav.classList.remove("is-open");
      if (restoreFocus) menuButton.focus();
    };
    const desktop = window.matchMedia("(min-width: 901px)");
    menuButton.addEventListener("click", () => {
      const open = menuButton.getAttribute("aria-expanded") !== "true";
      menuButton.setAttribute("aria-expanded", String(open));
      menuButton.setAttribute("aria-label", open ? "Закрыть меню" : "Открыть меню");
      mobileNav.classList.toggle("is-open", open);
    });
    mobileNav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => closeMenu());
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && menuButton.getAttribute("aria-expanded") === "true") closeMenu(true);
    });
    document.addEventListener("click", (event) => {
      if (event.target instanceof Node && !mobileNav.contains(event.target) && !menuButton.contains(event.target)) closeMenu();
    });
    mobileNav.addEventListener("focusout", (event) => {
      if (event.relatedTarget instanceof Node && !mobileNav.contains(event.relatedTarget) && !menuButton.contains(event.relatedTarget)) closeMenu();
    });
    desktop.addEventListener("change", (event) => {
      if (event.matches) closeMenu();
    });
    document.documentElement.classList.add("has-js");
  }

  const copyButton = document.querySelector(".copy-email");
  const copyStatus = document.querySelector(".copy-status");
  if (copyButton instanceof HTMLButtonElement && copyStatus instanceof HTMLElement && navigator.clipboard && window.isSecureContext) {
    copyButton.hidden = false;
    let statusTimer;
    copyButton.addEventListener("click", async () => {
      copyButton.disabled = true;
      window.clearTimeout(statusTimer);
      try {
        await navigator.clipboard.writeText("vlad2.0top@mail.ru");
        copyStatus.textContent = "Почта скопирована. Осталось рассказать о задаче.";
      } catch {
        copyStatus.textContent = "Не удалось скопировать. Выдели адрес или нажми на него.";
      } finally {
        copyButton.disabled = false;
        statusTimer = window.setTimeout(() => { copyStatus.textContent = ""; }, 7000);
      }
    });
  }

  // Keep localhost and file previews out of production analytics.
  if (location.hostname !== "fen3211.github.io") return;
  const counterId = 112976314;
  window.YM_ID = counterId;
  window.ym = window.ym || function () { (window.ym.a = window.ym.a || []).push(arguments); };
  window.ym.l = Date.now();
  const script = document.createElement("script");
  script.async = true;
  script.src = "https://mc.yandex.ru/metrika/tag.js?id=" + counterId;
  document.head.appendChild(script);
  window.ym(counterId, "init", { ssr: true, webvisor: true, clickmap: true, ecommerce: "dataLayer", accurateTrackBounce: true, trackLinks: true });

  document.querySelectorAll('a[href^="https://t.me/"], a[href^="mailto:"]').forEach((link) => {
    link.addEventListener("click", () => {
      try {
        window.ym(counterId, "reachGoal", "lead_click");
      } catch {
        // Analytics must never interrupt contact navigation.
      }
    });
  });
})();
