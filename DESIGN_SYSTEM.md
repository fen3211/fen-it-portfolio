# DESIGN_SYSTEM.md — FEN / Blueprint Playground

Версия 3.0 · 30.10.2026 · источник значений — [`assets/css/tokens.css`](assets/css/tokens.css), [`assets/css/site.css`](assets/css/site.css), [`assets/css/blueprint.css`](assets/css/blueprint.css) и [`assets/css/case.css`](assets/css/case.css).

Вернули старую blue-studio эстетику: кобальтовую сетку, бумагу, лайм, оранжевые стикеры, стол с инструментами и старый логотип. Новую структуру (индекс работ, кейсы, лаборатория) оставили, но пересобрали её в старом визуальном языке.

---

## 1. Design Philosophy

### 1.1. Концепция

**«Blueprint Playground»** — рабочий стол дизайнера, который превращается в сайт. Кобальтовый blueprint, ластик, карандаш, линейка и клочок бумаги лежат на сетке; заголовок вырезан пунктирной рамкой, как объект в графическом редакторе; рядом — панель `INDEX / WORKS` с проектами и живым превью. Дальше сайт раскладывается в редакционные работы с браузерными рамками, лабораторию артбордов и кейсы.

Это не «тёмный премиум» и не минималистичный SaaS. Это мастерская: тёплая бумага, кобальт, лайм, оранжевый, толстые тени, наклонённые карточки, моно-подписи и старый кремовый логотип.

### 1.2. Характер

Игривый, но собранный. Много слоёв, как на рабочем столе, но у каждого слоя есть роль: фон, инструмент, заголовок, индекс, превью, действия. Ощущение «дизайн-инструмента»: selection frame, handles, палитра, панель слоёв. При этом контент читается, а не тонет в декоре.

### 1.3. Эмоции

- **Любопытство** — хочется навести на строку индекса, потянуть превью, нажать на цвет в палитре.
- **Тактильность** — предметы на столе реагируют на мышь, карточки наклоняются, браузерные окна «выезжают» из рамок.
- **Доверие** — реальные экраны проектов, честные подписи «концепт / демо», без выдуманных результатов.
- **Лёгкая ностальгия** — старый логотип, бумага, blueprint, но с современным ритмом и интерактивом.

### 1.4. Иерархия

1. **Hero-композиция:** selection frame + заголовок, стол-инструменты, индекс проектов справа.
2. **Работы:** бумага, крупная сетка, браузерные рамки, разные пропорции.
3. **Лаборатория:** синий blueprint, артборды-скриншоты с наклоном и paper-рамками.
4. **Обо мне:** старая identity-card с логотипом, фактами и barcode.
5. **Контакт:** синий blueprint, огромный заголовок с outline-словом, лаймовая кнопка.
6. **Футер:** ink, огромный старый логотип.

### 1.5. UX-принципы

- Работа — раньше рассказа о себе.
- Контакты всегда доступны: шапка, контакт, футер.
- Никаких цен и тарифов FEN; только «обсудить проект».
- Проекты открываются полноценными кейсами, а не модалками.
- Мобильная версия — не уменьшенный десктоп: интерактив с мышью заменяется на touch/click, палитра остаётся доступной.
- Hover не единственный способ: у строк есть ссылки и фокус, у палитры — кнопки и `aria-pressed`.
- `prefers-reduced-motion` отключает курсор, trail, параллакс, tilt и тяжёлые переходы; палитра продолжает работать.
- No-JS: контент читается, меню-навигация доступна через `<noscript>`, hero-превью и палитра скрываются, чтобы не выглядеть сломанными.

### 1.6. Почему это направление

Старая версия нравилась характером, но была каталогом из трёх карточек и прайсом. Новая сохраняет любимый blueprint-язык, но добавляет пять проектов, кейсы, настоящую лабораторию и интерактив уровня design-tool. Задача — не «сделать современнее» в сторону безликого SaaS, а усилить то, что уже было живым: сетку, инструменты, типографику и движение.

---

## 2. Color System

### 2.1. Базовые токены

| Токен | HEX | RGB | Применение |
|---|---|---|---|
| `--c-blue` | `#1645EA` | 22 69 234 | Blueprint-фон hero, about, lab, contact, header |
| `--c-blue-deep` | `#1239C9` | 18 57 201 | Глубина, hover, тени |
| `--c-blue-soft` | `#D8E2FF` | 216 226 255 | Вторичный текст на синем, голубая тема |
| `--c-lime` | `#C4F529` | 196 245 41 | CTA, selection, status, акценты |
| `--c-orange` | `#FF702F` | 255 112 47 | Стикеры, маркеры, крупные акценты |
| `--c-orange-deep` | `#B83D0F` | 184 61 15 | Оранжевый текст на бумаге (контраст ≥ 4.5) |
| `--c-paper` | `#F4F3ED` | 244 243 237 | Бумага, фон работ, карточки |
| `--c-paper-deep` | `#E7E5D8` | 231 229 216 | Заглушки, фоны превью |
| `--c-ink` | `#151515` | 21 21 21 | Чернила, текст на бумаге, футер |
| `--c-ink-soft` | `#1D1D1B` | 29 29 27 | Приподнятые тёмные поверхности |
| `--c-white` | `#FFFFFF` | 255 255 255 | Заголовок на синем |
| `--c-line` | `#D5D5CE` | 213 213 206 | Линейки на бумаге |
| `--c-line-strong` | `#B9B9B1` | 185 185 177 | Рамки карточек |
| `--c-line-dark` | `rgb(255 255 255 / 20%)` | — | Линейки на синем/ink |
| `--c-line-dark-strong` | `rgb(255 255 255 / 42%)` | — | Рамки на тёмном |

### 2.2. Семантика

| Роль | Светлая бумага | Синий blueprint | Ink-футер |
|---|---|---|---|
| Основной текст | `--c-ink` | `#FFFFFF` / `--c-bone` | `--c-bone` |
| Вторичный текст | `--c-text-soft` `#63635F` | `--c-blue-soft` | `#B6B6AE` |
| Акцент | `--c-orange-deep` / `--c-blue` | `--c-lime` / `--c-orange` | `--c-lime` |
| Линия | `--c-line` | `--c-line-dark` | `rgb(255 255 255 / 18%)` |
| Hover | `--c-blue` | `--c-lime` | `--c-lime` |
| Focus-visible | 2px orange, offset 4px | 2px lime, offset 4px | 2px lime |
| Active | `#B32F0A` | `#A9D921` | `#A9D921` |

### 2.3. Hero themes

Палитра в hero — реальный контрол. Пять тем:

| Тема | Фон | Заголовок | Акцент selection | Muted |
|---|---|---|---|---|
| `blue` (default) | `#1645EA` | `#FFFFFF` | `#C4F529` | `#D8E2FF` |
| `lime` | `#C4F529` | `#151515` | `#1645EA` | `#4B4C22` |
| `orange` | `#FF702F` | `#151515` | `#C4F529` | `#5A2410` |
| `bone` | `#F4F3ED` | `#151515` | `#1645EA` | `#63635F` |
| `sky` | `#D8E2FF` | `#151515` | `#1645EA` | `#4A5670` |

Переключение: hover — предпросмотр, click — фиксация; `aria-pressed` обновляется. Переход фона 450 мс, цвета текста 300 мс. Контраст текста в каждой теме проверен вручную; заголовок и CTA остаются читаемыми.

### 2.4. Контраст

- Ink на бумаге — 16.4:1; `#63635F` на бумаге — 4.9:1; `#B83D0F` — 5.3:1.
- White на blue — 7.4:1; `#D8E2FF` на blue — 6.1:1; lime на blue — 8.9:1.
- Ink на lime — 12.9:1; ink на orange — 7.4:1; `#5A2410` на orange — 5.1:1.
- Ink на bone — 16.4:1; `#63635F` на bone — 4.9:1; `#4A5670` на sky — 5.5:1.
- Orange `#FF702F` используется для крупных заливок и декора; для мелкого текста — `--c-orange-deep`.

---

## 3. Typography

### 3.1. Шрифты

| Роль | Шрифт | Начертания | Лицензия |
|---|---|---|---|
| Display | **Russo One** | 400 | SIL OFL 1.1 |
| Body / UI | **Manrope** | 200–800 variable | SIL OFL 1.1 |
| Акцент | **Cormorant Garamond** | 500 italic | SIL OFL 1.1 |
| Технический | **IBM Plex Mono** | 400, 500 | SIL OFL 1.1 |

Все шрифты локальные, woff2, без Google Fonts на продакшене. Russo One — заголовки и имена; Manrope — текст, кнопки, подписи; Cormorant — только акцентные слова («работы», «карманный», цитаты); Plex Mono — индексы, категории, статусы.

### 3.2. Шкала

| Токен | Значение | Где |
|---|---|---|
| `--fs-hero` | `clamp(4.4rem, 11.5vw, 10.4rem)` (media 9.25/7.5/6.2rem) | PORT / FOLIO. |
| `--fs-h2` | `clamp(2.15rem, 4.7vw, 4.35rem)` | Заголовки секций |
| `--fs-h3` | `clamp(1.45rem, 2.5vw, 2.35rem)` | Карточки/блоки |
| `--fs-lead` | `clamp(1rem, 1.15vw, 1.18rem)` | Вводный текст |
| `--fs-body` | `1rem` | Основной текст |
| `--fs-small` | `.8125rem` | Вторичный текст |
| `--fs-label` | `.6875rem` | Моно-лейблы |
| `--fs-mono` | `.75rem` | Технические строки |

### 3.3. Интерлиньяж и трекинг

| Роль | Line-height | Letter-spacing |
|---|---|---|
| Hero | `0.87` | `-0.075em` |
| H2 | `1.02` | `-0.055em` |
| H3 | `1.1` | `-0.045em` |
| Body | `1.62` | `0` |
| Lead | `1.65` | `0` |
| Mono label | `1.5` | `0.12em` |

Правила: заголовки — отрицательный трекинг; Cormorant — оптический размер 1.08–1.14em; абзацы 46–56ch; не использовать ALL CAPS в длинных абзацах; не смешивать больше двух гарнитур в одной строке. «Выбранные работы» — исключение: Russo + Cormorant italic как акцент, который нравится владельцу.

---

## 4. Spacing & Layout

- База 4 px; токены 4–160.
- Контейнер `--container: 1280px`; поля `--gutter: clamp(1.25rem, 5vw, 2.5rem)`; 12 колонок; gap 16–24; секция 72–112.
- **Hero:** selection 622px по центру; индекс-панель 250px справа (absolute на desktop); desk-объекты absolute; палитра/стикер/name label. На ≤1024 панель 190; на ≤900 — статическая колонка под selection.
- **Works:** две независимые колонки; карточки с разными пропорциями; браузерные рамки с наклоном −3°…+3°; stage-фоны green/lavender/gray/sand.
- **Lab:** три артборда 1–5, 7–13, 3–10; paper-рамки, наклон −2°…+2°; телефоны в углах.
- **About:** 430px карточка + текст; identity-card с наклоном −3°, sticky.
- **Contact:** блок; огромный заголовок; 1.1fr/0.9fr; контактные строки; звезда справа.
- **Case:** 3/8/1; facts-карточка blue sticky; контент 760; галереи; next 7/5.
- Никаких симметричных SaaS-hero и сеток одинаковых карточек с иконками.

---

## 5. Components

### 5.1. Header

- Sticky, 80px, blue, белая линия.
- Слева — старый текстовый wordmark **FEN® / DESIGN & CODE** (Russo One + mono), без нового знака.
- Nav 12px Manrope, hover lime; CTA — белая рамка 4px, hover lime.
- Scroll progress 1px lime.
- На ≤900 — меню-overlay blue с крупными ссылками; фокус-ловушка, Escape, возврат фокуса.
- Старый орнаментальный логотип — в футере и identity-card, не в шапке (в 58px он нечитаем).

### 5.2. Hero selection

- Dotted lime рамка 622px; caption mono; PORT / FOLIO. в Russo One; lime-квадрат-период; 4 handles.
- Заголовок с 3D text-shadow (белые/серые слои + синяя тень).
- Рамку можно **двигать** (drag за тело), **масштабировать** за любой из четырёх углов (0.5–1.65×, якорь — противоположный угол) и **сбросить** двойным кликом или клавишей `0`; стрелки двигают, `+`/`−` масштабируют. Смещение ограничено ±180/±120 px. Transform через `--sel-x`, `--sel-y`, `--sel-scale`, без layout reflow.
- На hover handles увеличиваются; на touch/узких экранах манипуляции отключены и рамка статична.
- Вокруг — desk-объекты (ruler, pencil, paper, eraser) с parallax по `data-depth`; spotlight следует за курсором.
- Все четыре предмета — кнопки: click/Enter роняет их вниз с вращением, через ~1.8 s они возвращаются сверху с пружиной. Reduced motion — короткий fade.

### 5.3. Hero index panel

- Тёмная панель `INDEX / WORKS`, 250px, 5 строк; номера lime, имена Manrope 800, категории mono.
- Внутри — браузерное превью (16:10), которое меняется hover/focus; карточный шафл 650 мс.
- Превью можно **потянуть** в сторону: drag > 42px переключает проект; `data-cursor="Тяни"`.
- На ≤1024 превью скрыто; на ≤900 панель статическая, строки с миниатюрами.

### 5.4. Hero palette

- 5 кнопок-свотчей: lime, orange, blue, bone, sky.
- Hover — предпросмотр темы, click — фиксация; `aria-pressed`, focus-visible.
- Меняет фон hero, цвет заголовка, selection, handles, footer, name-label и стикер через CSS-переменные `--hero-*`.
- На мобильном палитра остаётся под индекс-панелью; свотчи 28px; работает по tap.

### 5.5. Work cards

- Stage-фон (green/lavender/gray/sand), padding 46×28, border 6px radius.
- Браузерная рамка: chrome (dots + URL), image 16:10/4:3/16:9, rotate; hard shadow.
- Hover: рамка выпрямляется, поднимается, image pan по курсору (±10/8px) + scale 1.04.
- Meta: tag + year; h3 Russo; p Manrope; CTA.
- Вся карточка — overlay-ссылка; focus outline.
- На мобильном chip «Смотреть кейс» виден всегда, наклоны уменьшены.

### 5.6. Utka band

- Orange-полоса, ink-текст, два телефона в рамках, radius 6, hard shadow.
- Заголовок Russo + serif-акцент «карманный».
- Отдельная категория, не карточка в общем ряду.

### 5.7. Filters

- Моно-кнопки, `aria-pressed`, счётчик, live-region.
- Active — синий + underline; фильтрация FLIP 480ms; single-card layout для UI/UX и Mobile.

### 5.8. Lab artboards

- Blue blueprint; три реальных скриншота в paper-рамках с наклоном, hard shadow.
- Телефоны поверх SMS/Real Lot.
- Hover: подъём −8px, tilt ±5°, тень.
- Мета ниже: номер/тип, ссылка в Framer.
- Подпись: реальные скриншоты, не коммерческие релизы.

### 5.9. Identity card

- Paper card, rotate −3°, steel clip, blue avatar со старым логотипом, «ПРИЯТНО. Я — FEN.», stamp, barcode, факты (роль, база Белгород, фокус, стек, формат).
- Sticky на десктопе; static на мобильном.

### 5.10. Contact

- Blue blueprint; label; огромный H2 «ЕСТЬ ИДЕЯ? ДАВАЙ СОБЕРЁМ.» с lime-вопросом и outline-словом.
- Lime CTA, email copy, Telegram/Email/GitHub rows, reply note, star watermark.
- Copy email — маленькая кнопка в строке email, live status.
- Footer section: статус, Белгород/время, copyright.

### 5.11. Footer

- Ink; огромный старый логотип (300px), nav, email, GitHub, «Наверх».
- Bottom mono: © FEN, Белгород/time, GitHub.

### 5.12. Case file

- Blue full-bleed hero band; breadcrumb, h1 Russo, meta 4 cols; cover в browser-рамке.
- Paper content; h2 blue с оранжевым маркером; facts blue sticky card; фигуры в рамках.
- Next case 7/5; footer old logo.
- Case pages используют те же токены, что и главная.

### 5.13. Cursor & transition

- Курсор: lime-квадрат 30px + ink border, label; hover 72px; dot 6px; lerp 0.16.
- Trail: lime-ромбы, 55ms, 700ms, max 12; отключается reduced/touch.
- Page transition: blue blueprint overlay + старый логотип, 420ms; sessionStorage; reduced — мгновенно.
- Modal нет: вместо него полноэкранное меню и case-страницы.

---

## 6. Motion Design System

### 6.1. Принципы

- Движение объясняет слой: предмет уходит в глубину, карточка выпрямляется, палитра меняет сцену.
- Только transform/opacity/translate; никакого layout.
- Один rAF на курсор, один на магниты, один на desk-parallax; tilt — на pointermove.
- Hover не единственный вход: focus/click/tap работают.
- Reduced motion отключает trail/parallax/tilt/анимации, но не ломает функции.

### 6.2. Тайминги

| Механика | Значение |
|---|---|
| Hover цвета | 160–240 ms, `cubic-bezier(.16,1,.3,1)` |
| Кнопки/рамки | 240–360 ms |
| Card shuffle | 650 ms |
| Desk parallax | lerp 0.09, depth 18–42px |
| Cursor trail | spawn 55 ms, fade 700 ms, max 12 |
| Preview drag | threshold 42 px; return snap + shuffle |
| Browser pan | 350 ms; ±10/8px |
| Palette | 450 ms фон, 300 ms текст |
| Падение props | 1050 ms падение + 680 ms возврат-пружина |
| Reveal | 720 ms; mask 900 ms; stagger 80–240 ms |
| Page transition | 420 ms |
| Menu | 550 ms |
| Filters | 480 ms FLIP |
| Ticker / star / process | 34 s / 42 s / 16 s |

### 6.3. Easing

- `--e-out: cubic-bezier(0.16, 1, 0.3, 1)` — входы, hover, reveal.
- `--e-in-out: cubic-bezier(0.65, 0, 0.35, 1)` — меню, page.
- `--e-spring: cubic-bezier(0.34, 1.56, 0.64, 1)` — редкие акценты.
- Линейные — только декоративные циклы.

### 6.4. Mouse interactions

- Desk objects parallax + spotlight (`--mx/--my`).
- Cursor trail (Riff 4).
- Hero preview drag (Riff 1/8).
- Browser image pan.
- Magnetic CTA (10×8px, lerp 0.18).
- Lab tilt ±5°.
- Palette hover/click.
- Падение всех четырёх предметов (линейка, карандаш, бумага, ластик) по click/Enter (WAAPI: translate/rotate, gravity ease-in, spring return).
- Перетаскивание и масштабирование selection-рамки (transform через CSS-переменные, без reflow).
- Handles/sticker hover.

### 6.5. Scroll

- Reveal mask/fade/scale; observer rootMargin −8%, threshold 0.12.
- Header progress scaleX; ticker pause offscreen; sticky facts.
- Page transition for internal links.

### 6.6. Reduced motion

Все transition/animation → 0.01 ms; cursor/trail/parallax/tilt/magnetic off; reveals мгновенно; ticker/star/process остановлены; page transition 0; палитра остаётся функциональной (мгновенная смена цвета).

---

## 7. Responsive Design

| Диапазон | Поведение |
|---|---|
| ≥1200 | Hero 622 + 250 panel; preview visible; palette; works 2 cols; lab 3; about 430/1fr |
| 1024–1199 | Hero 560 + 230 panel; preview hidden; works 2; lab 3 |
| 900–1023 | Hero 540 + 190 panel; preview hidden; works 2; about 320/1fr |
| ≤900 | Hero stack: selection 100%, panel static below, palette below; desk objects/sticker/name hidden; works 2 cols; about 1 col |
| ≤640 | Works 1 col; lab 1 col; Utka stack; contact 1; header 64; palette visible 28px; case block |
| ≤480 | Hero font floor; header 58; compact |
| ≤380 | Smaller headings, hide work open chip |

Проверены 1920, 1440, 1366, 1024, 900, 768, 640, 390, 375, 360 — без горизонтального overflow.

---

## 8. Technical Guidelines

### 8.1. Архитектура

- `tokens.css` — единственный источник токенов.
- `site.css` — базовая структура/компоненты.
- `blueprint.css` — старый визуальный слой, hero, палитра, browser-рамки, identity-card, case-тема; загружается после site/case.
- `case.css` — кейсы.
- `site.js` — меню, курсор/trail, палитра, desk parallax, drag, browser pan, фильтры, reveal, page transition, Metrika.
- `index.html`, `work/*.html`, `404.html`; `projects/` — пять демо; `assets/fonts` — Russo/Manrope/Cormorant/Plex.
- Нет сборщика для оболочки; Vite-проекты лежат собранными с `base: "./"`.

### 8.2. Именование

- BEM-подобные блоки/элементы/модификаторы; состояния `.is-*`; JS-хуки `data-*` (`data-hero-theme`, `data-hero-preview`, `data-tilt`, `data-filter`).
- Цвета/шрифты/отступы — только токены; исключения — контент проектов.

### 8.3. Производительность

- Главная без библиотек; CSS ≈ 127 KB raw / ≈ 24 KB gzip; JS ≈ 23 KB raw / ≈ 6 KB gzip; шрифты локально; WebP; lazy below fold; hero preview images 13–31KB; projects отдельными страницами.
- GPU-friendly transform/opacity; trail max 12; observers unobserve; ticker pause; grain off on mobile.
- Цели: LCP < 2.5s, CLS < 0.1, INP < 200ms; фактические замеры — в `docs/verification.md`.

### 8.4. Доступность

- WCAG 2.1 AA; axe-core 0 нарушений на главной/кейсе (desktop/mobile).
- Skip link, landmarks, H1/H2/H3, focus-visible, aria у меню/фильтров/палитры, alt у изображений.
- Палитра — кнопки с `aria-label`/`aria-pressed`; hover не единственный способ (click/tap).
- Ruler/pencil/paper/eraser — `role="button"`, `tabindex="0"`, aria-label, Enter/Space; падение отключается reduced motion.
- Selection-рамка — group с `tabindex="0"`: стрелки/`+`/`−`/`0`, сброс двойным кликом; на touch-устройствах манипуляции отключены.
- No-JS: навигация через `<noscript>`, hero preview/palette скрыты; контент читается.
- Reduced motion.
- Контраст: оранжевый текст — `#B83D0F`; подписи на светлых темах — ink/тёмные muted.

### 8.5. Изображения и SEO

- WebP; OG JPG 1200×630; превью и кейсы — реальные скриншоты; прототипы — Framer MCP; alt осмысленный; width/height/aspect.
- Title/description/canonical/OG/Twitter, Person/CreativeWork JSON-LD, sitemap, robots, 404, favicon — старый логотип на синем.
- GitHub Pages: относительные пути; `/work/<slug>.html`; `/projects/<slug>/`.
- Метрика только на `fen3211.github.io`; локальные просмотры вне статистики.

### 8.6. Ограничения

- Framer-ссылки требуют доступа к проекту.
- В SMS-PRO **внутри прототипа** desktop-строка использует `Switzer Italic`, который Framer не находит и подменяет системным serif; mobile — `Onest 600`. Это не шрифт портфолио, а особенность проекта; при необходимости выравнивается отдельно.
- Демо — концепты без бэкенда; цены в их скриншотах — контент проектов, не прайс FEN.
- Точные Motion-кривые Riffs не выгружены (см. `ANIMATION_REFERENCES.md`).

---

## 9. Changelog

| Версия | Дата | Изменения |
|---|---|---|
| 3.0 | 30.10.2026 | Возврат Blue Studio: кобальт/бумага/лайм/оранж, Russo One/Manrope, старый логотип, интерактивная палитра hero, desk parallax, cursor trail, preview drag, browser pan, реальные Framer-скриншоты, Белгород |
| 2.0 | 30.10.2026 | Interface Archive (архив; заменён на 3.0) |
| 1.0 | 2026 | Blueprint-версия FEN |
