# FEN — портфолио дизайнера и разработчика

Редизайн персонального портфолио: редакционный индекс работ, живые превью проектов, отдельная лаборатория Framer-прототипов и пять полноценных кейсов.

- **Ветка:** `redesign/portfolio-v2` (main не изменялся; merge — только после подтверждения).
- **Локально:** [http://127.0.0.1:4173/](http://127.0.0.1:4173/)
- **Продакшен:** [fen3211.github.io/fen-it-portfolio](https://fen3211.github.io/fen-it-portfolio/) — текущая версия из main, новая появится только после merge.

## Что изменилось

- Новый первый экран: крупная типографика, индекс из пяти работ и карточное превью, которое меняется при наведении.
- Убраны ЭКО-ЭКСПЕРТ, Atlaxis, блок «ТВОЯ ЗАДАЧА. МОЯ СБОРКА.» и все цены/тарифы.
- Добавлены Oyun Alemi, Eclipse Maison, EscrowHub, NOVA Gear и Utka; у каждого — кейс и локальное демо.
- Utka вынесена в отдельную категорию «Мобильные» и показана двумя экранами в рамке телефона.
- Добавлен раздел «Лаборатория / Framer» с **реальными скриншотами** EMBER, Real Lot (Freelance Radar) и SMS PRO.
- Собрана дизайн-система на токенах, motion-система, reduced motion, no-JS-навигация, page transitions и кастомный курсор.
- Обновлены SEO, OG, sitemap, 404 и документация.

## Стек

- Статический HTML + CSS + JavaScript. Сборка для главной не нужна.
- Шрифты: Unbounded, Onest, Cormorant Garamond, IBM Plex Mono — локально, woff2, OFL.
- Проекты внутри репозитория:
  - Oyun Alemi — Vite + TypeScript + Three.js + GSAP + Lenis (собранный `dist`).
  - Eclipse Maison — React 19 + R3F/Three.js + GSAP + Lenis (собранный `dist`).
  - EscrowHub — HTML/CSS/JS, многостраничный прототип.
  - NOVA Gear — Vanilla JS + CSS + Lenis, 56 кадров WebP.
  - Utka — HTML/CSS/JS, мобильный прототип 390 × 844.
- Аналитика: Яндекс.Метрика только на `fen3211.github.io`; локальные запуски не учитываются.

## Структура

```text
fen-it-portfolio/
├── index.html                  # главная
├── 404.html
├── work/
│   ├── oyun-alemi.html         # 5 кейсов
│   ├── eclipse-maison.html
│   ├── escrowhub.html
│   ├── nova-gear.html
│   └── utka.html
├── projects/                   # 5 демо внутри репозитория
│   ├── oyun-alemi/
│   ├── eclipse-maison/
│   ├── escrowhub-redesign/
│   ├── nova-gear/
│   └── utka/
├── assets/
│   ├── css/tokens.css          # единственный источник токенов
│   ├── css/site.css            # оболочка + главная
│   ├── css/case.css            # кейсы
│   ├── js/site.js              # курсор, меню, фильтры, переходы
│   ├── fonts/                  # локальные woff2
│   └── img/
│       ├── previews/           # превью работ + миниатюры
│       ├── cases/              # кадры кейсов + OG
│       ├── prototypes/         # реальные скриншоты Framer
│       └── brand/              # FEN-знак
├── docs/
│   ├── screenshots/            # скриншоты для PR/QA
│   └── verification.md         # результаты проверок
├── DESIGN_SYSTEM.md
├── ANIMATION_REFERENCES.md
├── TOOLS_AND_SKILLS.md
├── serve.py                    # локальный ThreadingHTTPServer
├── robots.txt
└── sitemap.xml
```

## Локальный запуск

Из корня проекта:

```bash
python serve.py
```

Открыть [http://127.0.0.1:4173/](http://127.0.0.1:4173/). `serve.py` использует `ThreadingHTTPServer`: NOVA Gear одновременно подгружает 56 WebP-кадров, и одиночный `http.server` может отказывать в соединениях. Сборка и npm-зависимости для главной не нужны.

Проверка JS:

```bash
node --check assets/js/site.js
```

## Сборка проектов

Главная — статика, собирать нечего. Для Vite-проектов (Oyun, Eclipse) сборка уже лежит в `projects/`. Если исходники обновились:

```bash
cd <source-repo>
npm install
npm run build -- --base=./
# скопировать dist/* в projects/<slug>/
```

`base: "./"` обязателен: сайт живёт по пути `/fen-it-portfolio/`, а не в корне домена. Статические проекты (EscrowHub, NOVA, Utka) просто копируются в `projects/<slug>/` с сохранением относительных путей.

**Не использовать Git Submodules.** Проекты физически лежат в репозитории. Секреты, `.env`, токены и личные данные не переносились. Тяжёлые служебные папки исходников (review, kwork_portfolio, scripts, tests, exports 3x) исключены; подробности — в [`projects/README.md`](projects/README.md).

## Как добавить проект

1. Положить демо в `projects/<slug>/`; проверить относительные пути и отсутствие абсолютных `/assets/...`.
2. Снять превью с реального демо (Playwright) и положить в `assets/img/previews/`, кадры кейса — в `assets/img/cases/`.
3. Добавить строку в hero-индекс и карточку в `#works` (`index.html`); указать `data-category` (`web`, `ui`, `mobile`).
4. Создать `work/<slug>.html` по образцу существующих кейсов; обновить `sitemap.xml`.
5. Проверить ссылки, alt, консоль, ширины 360–1920.

## Как редактировать контент

- **Главная:** `index.html` — hero, индекс, works, lab, about, contact.
- **Кейсы:** `work/*.html` — заголовок, факты, нарратив, изображения, следующий кейс.
- **Цвета, шрифты, отступы, движение:** `assets/css/tokens.css`; компоненты — `site.css` и `case.css`. Не хардкодить HEX вне токенов.
- **Тексты и данные проектов:** внутри `projects/` (у Utka — `data.js`, у Escrow — `assets/js/data.js`).
- **Контакты:** Telegram `https://t.me/TT_Fen`, email `vlad2.0top@mail.ru`, GitHub `fen3211` — используются в шапке, контактах и подвале.

## Анимации

Кратко: hero card shuffle, кастомный курсор с lerp, магнитные CTA, параллакс превью, tilt пластин, mask/fade/scale reveal, FLIP-фильтры, page transition, reduced motion. Полная спецификация — [`DESIGN_SYSTEM.md`](DESIGN_SYSTEM.md), разбор Riffs и реализованных механик — [`ANIMATION_REFERENCES.md`](ANIMATION_REFERENCES.md).

Тяжёлые 3D-сцены не грузятся на главной: они живут в отдельных проектах. Это сознательно — оболочка остаётся лёгкой.

## Проверки

- Lighthouse mobile: **99 / 100 / 100 / 100**, desktop: **100 / 100 / 100 / 100**.
- axe-core: **0** нарушений WCAG A/AA на главной и кейсах (desktop + mobile).
- Локальные ссылки/якоря: **0** битых (кроме runtime-спрайта иконок Escrow, который собирается JS).
- Горизонтальный overflow: нет на 1920, 1440, 1366, 1024, 900, 768, 640, 390, 375, 360.
- Frame timing в headed Chromium: ~7 мс/кадр при полном скролле; long tasks — 0. Это замер на конкретной машине, не универсальная гарантия 60 FPS.
- Подробно — [`docs/verification.md`](docs/verification.md).

## Деплой на GitHub Pages

- Pages обслуживает ветку `main` из корня репозитория.
- Все локальные пути относительные; кейсы — `/work/<slug>.html`; проекты — `/projects/<slug>/`.
- Canonical/OG указывают на `https://fen3211.github.io/fen-it-portfolio/`.
- Ветка `redesign/portfolio-v2` не публикуется, пока не влита в main.
- После merge: проверить `/`, `/work/utka.html`, `/projects/nova-gear/`, `/404.html` на Pages.

## Известные ограничения

- Ссылки на Framer-прототипы ведут в редактор и требуют доступа к проекту. На сайте стоят реальные скриншоты, снятые через Framer MCP.
- Проект Framer называется **Real Lot**, но его страница — **Freelance Radar**; это отражено в подписи, без выдуманных названий.
- Демо проектов — концепты и тестовые задания, без реального бэкенда/оплаты. Границы обозначены в каждом кейсе и в самих демо.
- Точные Motion-кривые из Figma Riffs не извлечены: для этого нужна копия frame в Motion timeline. Наблюдения и приблизительные тайминги — в `ANIMATION_REFERENCES.md`.
- Внешние ссылки внутри демо (например, правила EscrowHub.online) ведут на реальные публичные страницы сервиса.

## Контакты

- Telegram: [@TT_Fen](https://t.me/TT_Fen)
- Email: [vlad2.0top@mail.ru](mailto:vlad2.0top@mail.ru)
- GitHub: [github.com/fen3211](https://github.com/fen3211)
