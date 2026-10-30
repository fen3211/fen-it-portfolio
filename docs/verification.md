# Проверка — Blue Studio / 30.10.2026

Ветка: `redesign/portfolio-v2`. Локальный сервер: [`http://127.0.0.1:4173/`](http://127.0.0.1:4173/) (`python serve.py`, ThreadingHTTPServer). Main не изменялся.

## 1. Сборка и статика

| Проверка | Результат |
|---|---|
| Главная и кейсы | статика, сборка не требуется |
| `node --check assets/js/site.js` | OK |
| Vite-проекты Oyun / Eclipse | собраны с `base: "./"`, открываются из подпапок |
| Проекты Escrow / Nova / Utka | статические, относительные пути проверены |
| Секреты / `.env` в репозитории | не найдены |
| Git submodules | не используются |

## 2. Консоль и запросы

- Главная, 5 кейсов, 5 демо: **0 ошибок консоли**, **0 ответов ≥400** на `http://127.0.0.1:4173/`.
- NOVA Gear: 56 hero-кадров, 0 failed requests на threaded-сервере.
- Одиночный `python -m http.server` может давать `ERR_CONNECTION_REFUSED` при одновременной загрузке 56 кадров NOVA; поэтому в репозиторий добавлен `serve.py` с `ThreadingHTTPServer`.
- Runtime-спрайт иконок Escrow (`#i-*`) собирается JS из `assets/js/shell.js`; статический чекер помечает такие `use href="#i-..."` как «якоря без цели» — ложное срабатывание.

## 3. Ссылки и якоря

Проверены все HTML-файлы (24), локальные `href`/`src` и CSS `url()`:

- битых файлов — **0**;
- битых якорей — **0** (кроме runtime-спрайта выше);
- CSS `url(%23n)` — внутренняя ссылка SVG-фильтра grain в data URI, не внешний файл.

## 4. Доступность (axe-core, WCAG 2.1 A/AA)

| Страница / состояние | Viewport | Нарушений |
|---|---|---|
| Главная, blue | 1440 × 1000 | **0** |
| Главная, lime | 1440 × 1000 | **0** |
| Главная, orange | 1440 × 1000 | **0** |
| Главная, bone | 1440 × 1000 | **0** |
| Главная, sky | 1440 × 1000 | **0** |
| Главная | 390 × 844 | **0** |
| Кейс Utka | 1440 × 1000 | **0** |

Проверены: контраст, alt, landmark’и, заголовки, focus, aria у меню/фильтров/палитры.

## 5. Lighthouse (локально, Chromium)

### Mobile

| Категория | Оценка |
|---|---|
| Performance | **99** |
| Accessibility | **100** |
| Best Practices | **100** |
| SEO | **100** |

FCP **1.7 s**, LCP **1.7 s**, TBT **90 ms**, CLS **0**, Speed Index **1.7 s**, TTI **3.0 s**. Transfer: **648 KiB**.

### Desktop (`--preset=desktop`)

| Категория | Оценка |
|---|---|
| Performance | **99** |
| Accessibility | **100** |
| Best Practices | **100** |
| SEO | **100** |

FCP **0.4 s**, LCP **0.9 s**, TBT **20 ms**, CLS **0.001**, Speed Index **0.6 s**. Transfer: **758 KiB**.

Оговорка: лабораторный замер на конкретной машине, не field data.

## 6. Плавность

- **Headed Chromium** (GPU), 1440 × 1000, полный скролл за 3 с: **avg 6.94 ms/кадр, p95 7.0, max 9.1**, 428 кадров.
- **Long tasks** за прогон: **0**.
- Headless Chromium (software rendering) на этой машине даёт ~30–33 ms/кадр; это ограничение headless-рендера, не вывод о продакшене. В отчёте — headed-замер, без универсальных обещаний 60 FPS.

## 7. Адаптивность

Проверены ширины: **1920, 1440, 1366, 1024, 900, 768, 640, 390, 375, 360**.

- Горизонтального переполнения нет.
- Hero: desktop selection 622 + panel 250; 1024 — 540 + 190; ≤900 — стопка, палитра остаётся, превью/декор скрыты.
- Works: 2 колонки → 1 на ≤640; браузерные рамки с наклоном; stage не раздувается из-за aspect-ratio.
- Lab: 3 артборда → 1; телефоны внутри.
- About: 430/1 → 1; identity-card static на мобильном.
- Contact: 2 → 1; палитра/звезда/большие декоративные элементы адаптированы.

Скриншоты: [home-hero](screenshots/home-hero.jpg), [home-works](screenshots/home-works.jpg), [home-lab](screenshots/home-lab.jpg), [home-about](screenshots/home-about.jpg), [home-contact](screenshots/home-contact.jpg), [home-footer](screenshots/home-footer.jpg), [home-mobile](screenshots/home-mobile.jpg), [case-utka](screenshots/case-utka.jpg).

## 8. Интеракции

| Сценарий | Результат |
|---|---|
| Hero palette | 5 тем: hover — предпросмотр, click — фиксация; `aria-pressed`; работает и в reduced motion |
| Hero index | hover/focus меняет превью; card shuffle; drag > 42 px переключает проект |
| Desk parallax | ruler/pencil/paper/eraser смещаются с разной глубиной; spotlight следует за курсором |
| Cursor trail | лаймовые ромбы, 55 мс, 700 мс, max 12; отключается reduced/touch |
| Browser pan | изображение в рамке панорамируется по курсору, hover scale |
| Falling props | карандаш/ластик падают по click/Enter и возвращаются; keyboard; reduced — fade |
| Utka band | два телефона, отдельная категория, ссылка на кейс |
| Фильтры | «Все 5», «Веб 3», «UI/UX 1», «Мобильные 1»; FLIP; live-region |
| Мобильное меню | открытие/закрытие, Escape, focus trap, возврат фокуса, блокировка скролла |
| Page transition | overlay 420 мс, переход на кейс и назад на `index.html#works` |
| Копирование email | статус «Почта скопирована», 5 с |
| Reduced motion | курсор/trail/parallax/tilt off, все 27 reveal сразу `is-in`, палитра работает |
| No-JS | навигация в шапке через `<noscript>`, контент виден, hero-превью/палитра скрыты |
| 404 | новая страница, ссылка на главную, noindex |

## 9. Референсы и прототипы

- 11 Figma Riffs открыты в пользовательском Chrome (авторизованная сессия). Разбор — `ANIMATION_REFERENCES.md`.
- Framer-проекты EMBER, Real Lot, SMS PRO открыты через Framer MCP; экраны сняты `api.tree.screenshot`. Проекты не изменялись (`changedNodeCount: 0`).
- Реальные скриншоты: `assets/img/prototypes/`.
- В SMS-PRO **внутри прототипа** desktop-строка использует `Switzer Italic` (Framer не находит italic и подставляет системный serif), mobile — `Onest 600`. Это особенность проекта, не портфолио; при необходимости выравнивается отдельно.
- Проект **Real Lot** содержит страницу **Freelance Radar** — подпись на сайте это отражает.

## 10. Ограничения

- Нет бэкенда, оплаты, авторизации и реальных заявок; демо — концепты/тестовые задания.
- В демо-скриншотах встречаются цены продуктов (SMS PRO, Utka, EscrowHub) — это контент проектов, а не прайс услуг FEN. На сайте нет цен/тарифов FEN.
- Точные Motion-кривые Riffs не извлечены; для этого нужна копия frame в Motion timeline.
- Lighthouse — локальный замер; на GitHub Pages показатели могут отличаться из-за сети/CDN.
- Внешние ссылки внутри демо (например, правила EscrowHub.online) ведут на реальные публичные страницы сервиса.
