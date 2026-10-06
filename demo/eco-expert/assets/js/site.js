/* Interactive demo: no network submissions. */
(() => {
  const button = document.querySelector("#burger");
  const menu = document.querySelector("#mnav");
  const setMenu = (open) => {
    if (!button || !menu) return;
    menu.hidden = !open;
    button.setAttribute("aria-expanded", String(open));
    button.setAttribute("aria-label", open ? "Закрыть меню" : "Открыть меню");
    button.querySelector("span").textContent = open ? "−" : "+";
  };
  button?.addEventListener("click", () =>
    setMenu(button.getAttribute("aria-expanded") !== "true"),
  );
  menu?.addEventListener("click", (event) => {
    if (event.target.closest("a")) setMenu(false);
  });
  document.addEventListener("keydown", (event) => {
    if (
      event.key === "Escape" &&
      button?.getAttribute("aria-expanded") === "true"
    ) {
      setMenu(false);
      button.focus();
    }
  });
  const current = new URL(location.href).pathname.replace(/\/$/, "/index.html");
  document.querySelectorAll(".links a, .mnav a").forEach((link) => {
    if (new URL(link.href).pathname === current) {
      link.classList.add("on");
      link.setAttribute("aria-current", "page");
    }
  });
  document.querySelectorAll("[data-filter-group]").forEach((group) => {
    const cards = Array.from(document.querySelectorAll("[data-cat]"));
    group.querySelectorAll("button").forEach((filter) =>
      filter.addEventListener("click", () => {
        group.querySelectorAll("button").forEach((item) => {
          item.classList.toggle("on", item === filter);
          item.setAttribute("aria-pressed", String(item === filter));
        });
        cards.forEach((card) => {
          card.hidden =
            filter.dataset.filter !== "all" &&
            card.dataset.cat !== filter.dataset.filter;
        });
        const status = document.querySelector(".filter-status");
        if (status)
          status.textContent =
            "Сценариев: " + cards.filter((card) => !card.hidden).length;
      }),
    );
  });
  document.querySelectorAll('input[type="file"]').forEach((input) => {
    input.addEventListener("change", () => {
      const files = Array.from(input.files || []);
      const tooLarge = files.some((file) => file.size > 50 * 1024 * 1024);
      input.setCustomValidity(
        tooLarge ? "Размер каждого файла должен быть не больше 50 МБ." : "",
      );
      input.closest("label").querySelector("small").textContent = tooLarge
        ? "Файл больше 50 МБ. Выберите другой."
        : files.length
          ? "Выбрано файлов: " + files.length
          : "PDF, DWG, XLS / до 50 МБ на файл";
    });
  });
  document.querySelectorAll("form[data-lead]").forEach((form) => {
    form.querySelector('button[type="submit"]').disabled = false;
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      if (!form.reportValidity()) return;
      const data = new FormData(form);
      const files = form.querySelector('input[type="file"]').files;
      const output = form.querySelector("output");
      output.textContent =
        "Бриф подготовлен (демо).\nНаправление: " +
        data.get("topic") +
        "\nЗадача: " +
        data.get("msg") +
        "\nФайлов выбрано: " +
        files.length +
        "\nНичего не отправлено. Можно исправить данные и собрать бриф ещё раз.";
    });
  });
})();
