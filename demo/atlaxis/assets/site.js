(() => {
  const menuButton = document.querySelector("#menu-button");
  const menu = document.querySelector("#mobile-menu");
  const setMenu = (open) => {
    menu.hidden = !open;
    menuButton.setAttribute("aria-expanded", String(open));
    menuButton.setAttribute(
      "aria-label",
      open ? "Закрыть меню" : "Открыть меню",
    );
    menuButton.querySelector("span").textContent = open ? "−" : "+";
  };
  menuButton.addEventListener("click", () =>
    setMenu(menuButton.getAttribute("aria-expanded") !== "true"),
  );
  menu.addEventListener("click", (event) => {
    if (event.target.closest("a")) setMenu(false);
  });
  document.addEventListener("keydown", (event) => {
    if (
      event.key === "Escape" &&
      menuButton.getAttribute("aria-expanded") === "true"
    ) {
      setMenu(false);
      menuButton.focus();
    }
  });
  const tabs = Array.from(document.querySelectorAll('[role="tab"]'));
  const selectTab = (selected) => {
    tabs.forEach((tab) => {
      const active = tab === selected;
      tab.setAttribute("aria-selected", String(active));
      tab.tabIndex = active ? 0 : -1;
      document.getElementById(tab.getAttribute("aria-controls")).hidden =
        !active;
    });
  };
  tabs.forEach((tab, index) => {
    tab.addEventListener("click", () => selectTab(tab));
    tab.addEventListener("keydown", (event) => {
      let next = index;
      if (event.key === "ArrowRight") next = (index + 1) % tabs.length;
      else if (event.key === "ArrowLeft")
        next = (index + tabs.length - 1) % tabs.length;
      else if (event.key === "Home") next = 0;
      else if (event.key === "End") next = tabs.length - 1;
      else return;
      event.preventDefault();
      selectTab(tabs[next]);
      tabs[next].focus();
    });
  });
  const formats = {
    first: [
      "Первая консультация",
      "Коротко опишите, что хотите обсудить. Соберите имеющиеся документы и запишите вопросы.",
    ],
    second: [
      "Второе мнение",
      "Подготовьте предыдущие заключения и результаты исследований. Запишите, что хотите уточнить у другого специалиста.",
    ],
    follow: [
      "Повторная встреча",
      "Вернитесь к заметкам после первой консультации. Соберите новые документы и вопросы, которые появились за это время.",
    ],
  };
  const output = document.querySelector("#prepare-output");
  document.querySelectorAll('input[name="format"]').forEach((input) => {
    input.addEventListener("change", () => {
      const chosen = formats[input.value];
      document.querySelector("#format-title").textContent = chosen[0];
      document.querySelector("#format-description").textContent = chosen[1];
      output.textContent = "";
    });
  });
  document.querySelectorAll(".preparation-items input").forEach((input) => {
    input.addEventListener("change", () => {
      output.textContent = "";
    });
  });
  document.querySelector("#prepare-button").addEventListener("click", () => {
    const chosen = document.querySelector('input[name="format"]:checked');
    const selected = Array.from(
      document.querySelectorAll(".preparation-items input:checked"),
    );
    output.textContent = selected.length
      ? "Заметка: " +
        formats[chosen.value][0] +
        "\n" +
        selected
          .map((input) => "— " + input.nextElementSibling.textContent)
          .join("\n") +
        "\nПодготовлено в этой вкладке. Запись не отправлена."
      : "Отметьте хотя бы один пункт подготовки — затем соберите заметку.";
  });
})();
