/* Demo content for the EscrowHub redesign prototype.
   Prices and listing titles are based on public escrowhub.online pages checked 25.10.2026.
   Stock values, seller stats and order data are demo-only; the prototype is not connected to the service. */

window.EH = window.EH || {};

EH.categories = [
  { slug: "accounts", name: "Аккаунты", short: "Аккаунты", desc: "TikTok, Spotify, Steam", icon: "user", index: "01" },
  { slug: "in-game", name: "Игровая валюта и предметы", short: "Игровая валюта", desc: "Пополнения и предметы", icon: "gamepad", index: "02" },
  { slug: "keys", name: "Ключи и коды активации", short: "Ключи и коды", desc: "Коды активации", icon: "key", index: "03" },
  { slug: "subscriptions", name: "Подписки", short: "Подписки", desc: "Сервисы по подписке", icon: "repeat", index: "04" },
  { slug: "gift-cards", name: "Подарочные карты и промокоды", short: "Подарочные карты", desc: "Steam, Apple, PlayStation", icon: "gift", index: "05" },
  { slug: "services", name: "Цифровые услуги", short: "Цифровые услуги", desc: "Смена региона и настройка", icon: "spark", index: "06" },
  { slug: "software", name: "Программы и софт", short: "Программы и софт", desc: "Лицензии и программы", icon: "code", index: "07" },
  { slug: "courses", name: "Курсы и обучение", short: "Курсы", desc: "Материалы и доступы", icon: "book", index: "08" },
  { slug: "other", name: "Другое", short: "Другое", desc: "Прочие предложения", icon: "box", index: "09" }
];

EH.sellers = {
  iewc: {
    id: "iewc",
    name: "EWC",
    handle: "@iewc",
    initial: "E",
    joined: "октября 2026",
    deals: 0,
    reviews: 0,
    rating: null,
    badge: "Новый продавец"
  },
  northwind: {
    id: "northwind",
    name: "Northwind Digital",
    handle: "@northwind",
    initial: "N",
    joined: "2025",
    deals: 214,
    reviews: 128,
    rating: 4.9,
    badge: "Продавец"
  }
};

EH.items = [
  {
    id: "spotify",
    title: "Spotify Premium — аккаунт, Турция",
    fullTitle: "Spotify Premium — турецкий аккаунт с доступом к привязанной почте",
    category: "accounts",
    price: 50,
    stock: 120,
    unit: "шт.",
    region: "Турция",
    format: "Аккаунт",
    delivery: "до 15 минут",
    sellerId: "iewc",
    published: "25.10.2026",
    views: 132,
    popularity: 132,
    status: "active",
    summary: "Турецкий аккаунт Spotify с доступом к привязанной почте. Выдача — вручную после оплаты.",
    cover: { brand: "Spotify", sub: "TR · 1 месяц", tone: "accounts", motif: "wave", glyph: "S" },
    includes: ["Логин и пароль", "Доступ к привязанной почте", "Регион: Турция", "Выдача вручную"],
    conditions: [
      "Обычно выдача занимает до 15 минут после оплаты.",
      "Проверьте вход и параметры аккаунта до подтверждения получения.",
      "Если товар не соответствует описанию — откройте спор до подтверждения."
    ],
    description: [
      "Аккаунт зарегистрирован в турецком регионе. В комплект входят данные для входа и доступ к привязанной почте — после покупки вы становитесь единственным владельцем.",
      "Работа сервиса и доступные функции зависят от правил Spotify. Перед подтверждением получения проверьте вход и параметры аккаунта. Если что-то не совпало с описанием, откройте спор — оплата останется на удержании до решения."
    ]
  },
  {
    id: "steam-10k",
    title: "Steam-аккаунт с балансом 10 000 ₸",
    fullTitle: "Steam-аккаунт с балансом 10 000 ₸",
    category: "accounts",
    price: 3100,
    stock: 1,
    unit: "шт.",
    region: "Казахстан",
    format: "Аккаунт",
    delivery: "до 30 минут",
    sellerId: "iewc",
    published: "25.10.2026",
    views: 84,
    popularity: 98,
    status: "active",
    summary: "Steam-аккаунт с балансом 10 000 ₸. Регион — Казахстан, данные выдаются после оплаты.",
    cover: { brand: "Steam", sub: "KZ · 10 000 ₸", tone: "accounts", motif: "rings", glyph: "S" },
    includes: ["Аккаунт Steam", "Баланс 10 000 ₸", "Данные входа", "Регион: Казахстан"],
    conditions: [
      "Проверьте баланс и доступ к аккаунту до подтверждения.",
      "Смена почты и данных — по правилам Steam.",
      "Спор доступен в течение 72 часов после выдачи."
    ],
    description: [
      "Аккаунт Steam с балансом 10 000 ₸. Регион аккаунта — Казахстан. Данные для входа передаются в чате сделки после оплаты.",
      "Перед подтверждением получения проверьте вход и баланс. Если данные не подходят или баланс отличается от описания, откройте спор."
    ]
  },
  {
    id: "steam-region",
    title: "Смена региона Steam",
    fullTitle: "Смена региона Steam — услуга продавца",
    category: "services",
    price: 570,
    stock: 25,
    unit: "шт.",
    region: "Онлайн",
    format: "Услуга",
    delivery: "5–20 минут",
    sellerId: "iewc",
    published: "25.10.2026",
    views: 96,
    popularity: 116,
    status: "active",
    summary: "Смена региона Steam вручную после оплаты. Детали и совместимость согласуются в чате сделки.",
    cover: { brand: "Steam", sub: "Смена региона", tone: "services", motif: "ledger", glyph: "R" },
    includes: ["Смена региона аккаунта", "Работа в чате сделки", "Проверка результата", "Срок: 5–20 минут"],
    conditions: [
      "Совместимость региона уточните в чате до оплаты.",
      "После выполнения проверьте регион в Steam и подтвердите получение.",
      "Если результат не соответствует описанию, откройте спор."
    ],
    description: [
      "Услуга смены региона Steam. Продавец выполняет работу после оплаты и согласует детали в чате сделки.",
      "Перед подтверждением получения проверьте результат в своём аккаунте. Услуга не считается оказанной, пока вы не подтвердили получение."
    ]
  },
  {
    id: "steam-topup500",
    title: "Пополнение Steam на 500 ₽",
    fullTitle: "Пополнение баланса Steam на 500 ₽",
    category: "in-game",
    price: 500,
    stock: 80,
    unit: "шт.",
    region: "Онлайн",
    format: "Пополнение",
    delivery: "5–15 минут",
    sellerId: "iewc",
    published: "25.10.2026",
    views: 210,
    popularity: 210,
    status: "active",
    summary: "Пополнение баланса Steam на 500 ₽ после оплаты. Данные и способ — в чате сделки.",
    cover: { brand: "Steam 500", sub: "Пополнение баланса", tone: "in-game", motif: "grid", glyph: "₽" },
    includes: ["Пополнение на 500 ₽", "Работа в чате сделки", "Проверка баланса"],
    conditions: [
      "Способ пополнения согласуется в чате сделки.",
      "Проверьте баланс до подтверждения получения.",
      "Если пополнение не пришло, откройте спор до подтверждения."
    ],
    description: [
      "Пополнение баланса Steam на 500 ₽. После оплаты продавец связывается с вами в чате сделки и уточняет детали.",
      "Проверьте зачисление в своём аккаунте до подтверждения. Если баланс не изменился, откройте спор — деньги останутся в сервисе до решения."
    ]
  },
  {
    id: "bf6",
    title: "BATTLEFIELD 6: Phantom Edition — Steam",
    fullTitle: "BATTLEFIELD 6: Phantom Edition — ключ Steam (РФ / Беларусь)",
    category: "keys",
    price: 7200,
    stock: 8,
    unit: "шт.",
    region: "РФ / Беларусь",
    format: "Ключ",
    delivery: "до 15 минут",
    sellerId: "iewc",
    published: "25.10.2026",
    views: 164,
    popularity: 178,
    status: "active",
    summary: "Ключ BATTLEFIELD 6: Phantom Edition для Steam. Регионы активации — РФ и Беларусь.",
    cover: { brand: "BATTLEFIELD 6", longBrand: true, sub: "Steam · Phantom Edition", tone: "in-game", motif: "grid", glyph: "6" },
    includes: ["Ключ активации Steam", "Phantom Edition", "Регионы: РФ / Беларусь", "Выдача в чате сделки"],
    conditions: [
      "Проверьте регион активации до покупки.",
      "Ключ выдаётся в чате сделки после оплаты.",
      "Активированный ключ не подлежит возврату вне процедуры спора."
    ],
    description: [
      "Ключ активации BATTLEFIELD 6: Phantom Edition для Steam. Поддерживаемые регионы — РФ и Беларусь.",
      "После оплаты ключ появится в чате сделки. Проверьте регион и активацию до подтверждения получения; при ошибке откройте спор."
    ]
  },
  {
    id: "007-first-light",
    title: "007 First Light — подарок в Steam",
    fullTitle: "007 First Light — подарок в Steam",
    category: "gift-cards",
    price: 4500,
    stock: 12,
    unit: "шт.",
    region: "Онлайн",
    format: "Подарок",
    delivery: "до 10 минут",
    sellerId: "iewc",
    published: "25.10.2026",
    views: 118,
    popularity: 121,
    status: "active",
    summary: "Игра 007 First Light в виде подарка Steam. Отправляется продавцом после оплаты.",
    cover: { brand: "007 First Light", longBrand: true, sub: "Steam · подарок", tone: "gift", motif: "stripe", glyph: "007" },
    includes: ["Подарок в Steam", "Игра 007 First Light", "Отправка в чате сделки"],
    conditions: [
      "Для получения подарка нужен аккаунт Steam.",
      "Проверьте игру в библиотеке до подтверждения.",
      "Если подарок не пришёл, откройте спор."
    ],
    description: [
      "Продавец отправляет 007 First Light в Steam в виде подарка после оплаты.",
      "Проверьте наличие игры в библиотеке до подтверждения получения. Если подарок не пришёл или пришла другая игра, откройте спор."
    ]
  },
  {
    id: "tiktok-de",
    title: "TikTok-аккаунт с монетизацией — Германия",
    fullTitle: "TikTok-аккаунт с доступом к монетизации (Германия)",
    category: "accounts",
    price: 90,
    stock: 30,
    unit: "шт.",
    region: "Германия",
    format: "Аккаунт",
    delivery: "до 30 минут",
    sellerId: "iewc",
    published: "25.10.2026",
    views: 76,
    popularity: 88,
    status: "active",
    summary: "TikTok-аккаунт из Германии с доступом к монетизации. Передаётся вместе с данными входа.",
    cover: { brand: "TikTok", sub: "DE · монетизация", tone: "accounts", motif: "arch", glyph: "T" },
    includes: ["Аккаунт TikTok", "Регион: Германия", "Данные входа", "Доступ к привязанной почте"],
    conditions: [
      "Условия монетизации зависят от правил TikTok.",
      "Проверьте вход и доступ к функциям до подтверждения.",
      "Если доступ не соответствует описанию, откройте спор."
    ],
    description: [
      "TikTok-аккаунт, зарегистрированный в Германии, с доступом к функциям монетизации. Продавец передаёт данные входа и доступ к привязанной почте.",
      "Доступные функции зависят от TikTok и могут меняться. Проверьте аккаунт до подтверждения получения; если доступ не соответствует описанию, откройте спор."
    ]
  },
  {
    id: "steam-20k",
    title: "Steam-аккаунт с балансом 20 000 ₸",
    fullTitle: "Steam-аккаунт с балансом 20 000 ₸",
    category: "accounts",
    price: 5900,
    stock: 0,
    unit: "шт.",
    region: "Казахстан",
    format: "Аккаунт",
    delivery: "до 30 минут",
    sellerId: "iewc",
    published: "25.10.2026",
    views: 52,
    popularity: 60,
    status: "active",
    summary: "Steam-аккаунт с балансом 20 000 ₸. Сейчас нет в наличии — уточните условия в чате.",
    cover: { brand: "Steam", sub: "KZ · 20 000 ₸", tone: "accounts", motif: "orbit", glyph: "S" },
    includes: ["Аккаунт Steam", "Баланс 20 000 ₸", "Данные входа", "Регион: Казахстан"],
    conditions: [
      "Сейчас товара нет в наличии.",
      "Написать продавцу можно из карточки товара.",
      "Условия следующей выдачи согласуются в чате."
    ],
    description: [
      "Steam-аккаунт с балансом 20 000 ₸. Сейчас позиция недоступна для покупки.",
      "Вы можете написать продавцу из карточки товара и уточнить, когда появится следующая позиция. Escrow-защита начнёт действовать только после оформления заказа."
    ]
  },
  {
    id: "steam-30k-draft",
    title: "Steam-аккаунт с балансом 30 000 ₸",
    fullTitle: "Steam-аккаунт с балансом 30 000 ₸",
    category: "accounts",
    price: 8600,
    stock: 2,
    unit: "шт.",
    region: "Казахстан",
    format: "Аккаунт",
    delivery: "до 30 минут",
    sellerId: "iewc",
    published: "—",
    views: 0,
    popularity: 0,
    status: "draft",
    summary: "Черновик объявления.",
    cover: { brand: "Steam", sub: "KZ · 30 000 ₸", tone: "accounts", motif: "rings", glyph: "S" },
    includes: ["Аккаунт Steam", "Баланс 30 000 ₸"],
    conditions: [],
    description: ["Черновик объявления. Публикация ещё не подтверждена."]
  }
];

EH.seller = EH.sellers.iewc;
EH.orders = [
  {
    id: "EH-2841",
    itemId: "spotify",
    amount: 50,
    status: "review",
    statusLabel: "Проверьте товар",
    paidAt: "26 октября, 14:12",
    deliveredAt: "26 октября, 14:18",
    autoClose: "27 октября, 14:18",
    seller: EH.sellers.iewc
  },
  {
    id: "EH-2790",
    itemId: "steam-region",
    amount: 570,
    status: "completed",
    statusLabel: "Завершена",
    paidAt: "18 октября, 19:04",
    deliveredAt: "18 октября, 19:09",
    completedAt: "18 октября, 21:40",
    seller: EH.sellers.northwind
  }
];

EH.activeItems = function () {
  return EH.items.filter((item) => item.status === "active");
};

EH.getItem = function (id) {
  return EH.items.find((item) => item.id === id);
};

EH.getCategory = function (slug) {
  return EH.categories.find((category) => category.slug === slug);
};

EH.formatPrice = function (value) {
  return new Intl.NumberFormat("ru-RU").format(value) + " ₽";
};


EH.visuals = {
  spotify: { theme: "spotify", logo: "spotify", kicker: "Аккаунт", main: "Premium", meta: "TR · 1 месяц" },
  "steam-10k": { theme: "steam", logo: "steam", kicker: "Аккаунт", main: "10 000 ₸", meta: "KZ · Steam" },
  "steam-region": { theme: "steam-light", logo: "steam", kicker: "Услуга", main: "Region", meta: "Смена региона" },
  "steam-topup500": { theme: "steam-blue", logo: "steam", kicker: "Пополнение", main: "500 ₽", meta: "Баланс Steam" },
  bf6: { theme: "bf", kicker: "Ключ Steam", main: "BF6", meta: "Phantom Edition", mark: "BF6" },
  "007-first-light": { theme: "bond", kicker: "Подарок Steam", main: "007", meta: "First Light", mark: "007" },
  "tiktok-de": { theme: "tiktok", logo: "tiktok", kicker: "Аккаунт", main: "DE", meta: "TikTok · монетизация" },
  "steam-20k": { theme: "steam-2", logo: "steam", kicker: "Аккаунт", main: "20 000 ₸", meta: "KZ · Steam" },
  "steam-30k-draft": { theme: "steam-2", logo: "steam", kicker: "Аккаунт", main: "30 000 ₸", meta: "KZ · Steam" }
};

EH.categoryVisuals = {
  accounts: ["steam-light", null],
  "in-game": ["steam-blue", "steam"],
  keys: ["steam", "steam"],
  subscriptions: ["tiktok", null],
  "gift-cards": ["bond", null],
  services: ["steam-light", "steam"],
  software: ["tiktok", null],
  courses: ["bf", null],
  other: ["steam-2", null]
};

EH.visualFor = function (item) {
  if (item.visual) return item.visual;
  if (EH.visuals[item.id]) return EH.visuals[item.id];
  const category = EH.getCategory(item.category);
  const fallback = EH.categoryVisuals[item.category] || ["steam-light", null];
  const main = (item.cover && item.cover.brand) || (category ? category.short : "Товар");
  return {
    theme: fallback[0],
    logo: fallback[1],
    kicker: item.format || (category ? category.short : "Товар"),
    main: main.length > 18 ? main.slice(0, 17) + "…" : main,
    meta: item.region || "Цифровой товар",
    mark: main.slice(0, 4)
  };
};

EH.coverHTML = function (item, options) {
  const opts = options || {};
  const v = EH.visualFor(item);
  const classes = ["cover"];
  if (opts.size === "lg") classes.push("cover--lg");
  if (opts.size === "thumb") classes.push("cover--thumb");
  const label = String(item.title || "").replace(/"/g, "&quot;");
  const thumbMark = v.logo
    ? '<span class="brand-logo cover__logo" data-brand="' + v.logo + '"></span>'
    : '<span class="cover__mark">' + (v.mark || v.main) + '</span>';
  if (opts.size === "thumb") {
    return '<div class="' + classes.join(" ") + '" data-theme="' + v.theme + '" role="img" aria-label="' + label + '">' +
      '<span class="cover__center">' + thumbMark + '</span>' +
    '</div>';
  }
  const logo = v.logo ? '<span class="brand-logo cover__logo" data-brand="' + v.logo + '"></span>' : '<span></span>';
  return '<div class="' + classes.join(" ") + '" data-theme="' + v.theme + '" role="img" aria-label="' + label + '">' +
    '<div class="cover__top">' + logo + '<span class="cover__kicker">' + (v.kicker || "") + '</span></div>' +
    '<div class="cover__bottom">' +
      '<div class="cover__main">' + (v.main || "") + '</div>' +
      '<div class="cover__sub">' + (v.meta || "") + '</div>' +
    '</div>' +
  '</div>';
};

EH.lotHTML = function (item, options) {
  const opts = options || {};
  const category = EH.getCategory(item.category);
  const seller = EH.sellers[item.sellerId] || EH.seller;
  const out = item.stock === 0;
  const featured = !!opts.featured;
  const availability = out ? "Нет в наличии" : "В наличии";
  const stockLabel = out ? "нет в наличии" : item.stock + " " + item.unit;
  return '<article class="lot' + (featured ? " lot--featured" : "") + (out ? " lot--out" : "") + '" data-category="' + item.category + '">' +
    '<div class="lot__media">' +
      '<a class="lot__cover-link" href="product.html?id=' + item.id + '" aria-label="' + item.title + '">' + EH.coverHTML(item) + '</a>' +
      '<button class="lot__fav" type="button" data-fav="' + item.id + '" aria-pressed="false" aria-label="Добавить в избранное">' +
        '<svg class="icon"><use href="#i-heart"></use></svg>' +
      '</button>' +
      '<span class="lot__avail"><i></i>' + availability + '</span>' +
    '</div>' +
    '<div class="lot__body">' +
      '<div class="lot__meta"><span>' + category.short + '</span><span class="sep">·</span><span>' + item.region + '</span></div>' +
      '<h3 class="lot__title"><a href="product.html?id=' + item.id + '">' + item.title + '</a></h3>' +
      (featured ? '<p class="lot__summary">' + item.summary + '</p>' : '') +
      '<div class="lot__seller"><span class="avatar">' + seller.initial + '</span><b>' + seller.name + '</b><span class="lot__stock">' + stockLabel + '</span></div>' +
      '<div class="lot__bottom">' +
        '<div class="lot__price"><b>' + EH.formatPrice(item.price) + '</b><span>/ ' + item.unit + '</span></div>' +
        '<a class="lot__go" href="product.html?id=' + item.id + '" aria-label="Открыть ' + item.title + '"><svg class="icon"><use href="#i-arrow-up-right"></use></svg></a>' +
      '</div>' +
    '</div>' +
  '</article>';
};

EH.reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
