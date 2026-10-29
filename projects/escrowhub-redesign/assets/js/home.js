(function () {
  const active = EH.activeItems();
  const byId = (id) => active.find((item) => item.id === id);

  const featured = byId("spotify") || active[0];
  const miniIds = ["bf6", "steam-10k", "007-first-light", "tiktok-de"];
  const restIds = ["steam-topup500", "steam-region", "steam-20k"];

  const featuredHost = document.querySelector("[data-featured]");
  const miniHost = document.querySelector("[data-showcase-mini]");
  const restHost = document.querySelector("[data-showcase-more]");

  if (featuredHost && featured) featuredHost.innerHTML = EH.lotHTML(featured, { featured: true });
  if (miniHost) {
    miniHost.innerHTML = miniIds.map((id) => byId(id)).filter(Boolean).map((item) => EH.lotHTML(item)).join("");
  }
  if (restHost) {
    restHost.innerHTML = restIds.map((id) => byId(id)).filter(Boolean).map((item) => EH.lotHTML(item)).join("");
  }

  const counter = document.querySelector(".all-tile__bottom span");
  if (counter) {
    const count = active.length;
    const word = count % 10 === 1 && count % 100 !== 11 ? "предложение" : count % 10 >= 2 && count % 10 <= 4 && (count % 100 < 10 || count % 100 >= 20) ? "предложения" : "предложений";
    counter.textContent = count + " " + word + " в каталоге";
  }

  EH.syncFavs();

  /* ---------- top-up ---------- */
  const overlay = document.getElementById("topup-overlay");
  const form = document.querySelector("[data-topup-form]");
  if (!overlay || !form) return;

  const amountInput = form.querySelector("#topup-amount");
  const loginInput = form.querySelector("#topup-login");
  const loginLabel = form.querySelector("[data-topup-login-label]");
  const contactInput = form.querySelector("#topup-contact");
  const totalNodes = document.querySelectorAll("[data-topup-total]");
  const baseNode = document.querySelector("[data-topup-base]");
  const feeNode = document.querySelector("[data-topup-fee]");
  const modalTitle = document.getElementById("topup-title");
  const serviceTabs = Array.from(overlay.querySelectorAll("[data-topup-service]"));
  const contactButtons = Array.from(form.querySelectorAll("[data-contact]"));
  const presets = Array.from(form.querySelectorAll("[data-amount]"));

  const services = {
    steam: { label: "Steam", login: "Логин Steam", placeholder: "Ваш логин" },
    ps: { label: "PlayStation", login: "PlayStation ID", placeholder: "Ваш ID" },
    tg: { label: "Telegram", login: "Telegram", placeholder: "@username" },
    apple: { label: "Apple", login: "Apple ID", placeholder: "name@example.com" }
  };
  let currentService = "steam";

  function amountValue() {
    return Math.max(0, Number(String(amountInput.value).replace(/\D/g, "")) || 0);
  }
  function feeValue() {
    return Math.round(amountValue() * 0.025);
  }
  function updateTotals() {
    const amount = amountValue();
    const fee = feeValue();
    if (baseNode) baseNode.textContent = EH.formatPrice(amount);
    if (feeNode) feeNode.textContent = EH.formatPrice(fee);
    totalNodes.forEach((node) => { node.textContent = EH.formatPrice(amount + fee); });
    presets.forEach((button) => button.classList.toggle("is-active", Number(button.dataset.amount) === amount));
  }

  function selectService(service) {
    currentService = service;
    serviceTabs.forEach((tab) => {
      const activeTab = tab.dataset.topupService === service;
      tab.classList.toggle("is-active", activeTab);
      tab.setAttribute("aria-selected", String(activeTab));
    });
    const copy = services[service] || services.steam;
    if (loginLabel) loginLabel.textContent = copy.login;
    if (loginInput) loginInput.placeholder = copy.placeholder;
    if (modalTitle) modalTitle.textContent = "Пополнить " + copy.label;
  }

  function openTopup(service) {
    selectService(service || "steam");
    if (!amountInput.value) amountInput.value = "1000";
    updateTotals();
    EH.openOverlay(overlay);
  }

  document.querySelectorAll("[data-topup-open]").forEach((button) => {
    button.addEventListener("click", () => openTopup(button.dataset.topupOpen));
  });

  serviceTabs.forEach((tab) => {
    tab.addEventListener("click", () => selectService(tab.dataset.topupService));
  });

  amountInput.addEventListener("input", function () {
    this.value = this.value.replace(/[^\d]/g, "").slice(0, 6);
    updateTotals();
  });
  presets.forEach((button) => {
    button.addEventListener("click", () => {
      amountInput.value = button.dataset.amount;
      updateTotals();
    });
  });
  contactButtons.forEach((button) => {
    button.addEventListener("click", () => {
      contactButtons.forEach((item) => item.classList.toggle("is-active", item === button));
      const map = {
        tg: ["@username", "text"],
        wa: ["+7 700 000 00 00", "tel"],
        email: ["name@example.com", "email"]
      };
      const copy = map[button.dataset.contact] || map.tg;
      contactInput.placeholder = copy[0];
      contactInput.type = copy[1];
    });
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (amountValue() < 1) {
      amountInput.focus();
      EH.toast("Укажите сумму пополнения.", "info");
      return;
    }
    if (!loginInput.value.trim()) {
      loginInput.closest(".field").classList.add("has-error");
      loginInput.focus();
      EH.toast("Укажите логин или ID для пополнения.", "info");
      return;
    }
    loginInput.closest(".field").classList.remove("has-error");
    EH.closeOverlay(overlay);
    EH.toast("Демо-прототип: заявка на пополнение не отправляется.", "info");
  });

  updateTotals();
})();
