# ANIMATION_REFERENCES.md — FEN / Motion

Дата разбора: **30.10.2026**. Riffs открыты в браузере пользователя (Chrome, авторизованная сессия Figma). Framer-проекты открыты через Framer MCP, скриншоты сняты через `api.tree.screenshot` и сохранены в `assets/img/prototypes/`.

Ниже — реальные наблюдения. Где точные тайминги/кривые не раскрыты в Riff, это написано прямо; я не подставляю выдуманные значения. Видео-референсы смотрел покадрово, интерактивные — в живом превью.

---

## 1. Разбор 11 Riffs

| # | Референс | Автор / метрики | Что видно | Тип взаимодействия | Тайминг / easing | Где применено на сайте | Технология |
|---|---|---|---|---|---|---|---|
| 1 | [Riff 28 — Card shuffle](https://www.figma.com/riffs/573ca127-c0de-4d04-90c1-f94e8f52d6f5) | Alejandro Vasquez, @alefunlab · 202 creators · 47 likes | Колода карточек: верхняя улетает вверх-вправо с поворотом, следующая выходит вперёд из глубины; 4 карточки (Focus, Create, Explore…), 4 точки пагинации. Видео 8 с. | Автопетля / видео; точки пагинации | ~1.5–2 с на карточку (8 с / 4 карточки); плавное замедление, без резкого overshoot; точная кривая не раскрыта | Hero: превью проекта меняется «карточной» подачей; карточку можно потянуть в сторону — drag > 42 px переключает проект | CSS-слои + JS `is-active` / `is-leaving`; 650 мс, `--e-out` |
| 2 | [Artificial Design — orbit](https://www.figma.com/riffs/5fca8363-2256-4c47-8309-eaadf42b3c36) | Hijrat, @hijrat · 1.9k creators · 468 likes | Карточки стартуют стопкой, затем «взрываются» в орбиту; corner radius морфит 20 → 60; вокруг летят логотипы AI-инструментов. | Автопетля / видео | Точная длительность не раскрыта; движение строится как один burst с длинным хвостом | Не внедрено буквально: в портфолио нет AI-раздела, а орбита logo-хаоса спорит с редакционной сдержанностью | — |
| 3 | [Stone supplier concept](https://www.figma.com/riffs/d1a68e75-2248-4d71-bb83-b94446ab972e) | Maksym Rizniak, @maksymrizniak · 5 likes | Концепт сайта поставщика камня: круговая карусель образцов мрамора/гранита/оникса с подписями, затем сетка интерьеров с параллаксом. Видео 24 с. | Видео-проходка сайта; вероятно scroll/hover, но точный триггер не указан | Точная длительность взаимодействия не раскрыта; в видео — плавные длинные проходки | Влияние на works: крупные реальные изображения, разные пропорции, редакционная сетка; круговую карусель не копировал | — |
| 4 | [Make Cursor Magic](https://www.figma.com/riffs/5f08f8b2-96ea-4f90-908e-ec00bbf8c658) | Hijrat, @hijrat · 1k creators · 315 likes | За курсором следуют символьные карточки (`M@KE ©URS✳® M@G!C`): появляются, всплывают и растворяются. | Mouse move | Точная длительность не раскрыта; по видео — короткая жизнь карточки, меньше секунды, с мягким fade | Реализован: lime cursor trail (55 мс, 700 мс, max 12) + кастомный курсор-квадрат; превью проекта живёт в index-панели | rAF + transform/opacity; курсор с lerp 0.16 |
| 5 | [Liquid metal button](https://www.figma.com/riffs/2e52a092-9e89-4cda-809c-10f8ac09a17c) | chaz, @chaz · 720 creators · 226 likes | Пилюля `Liq. // etal` с жидким металлом/хромом; текстура переливается. Видео 2 с, без описания. | Предположительно hover/loop | 2 с петля; easing не раскрыт | Не внедрено: металл/хром конфликтует с плоской печатной системой сайта | — |
| 6 | [Design thinking loop](https://www.figma.com/riffs/02c6959c-97da-4670-bba2-17d02d7294f1) | Leila Azimi, @leilaazimi · 70 creators · 103 likes | Пять узлов (Empathize → Define → Ideate → Prototype → Test) соединены волнистой линией, которая замыкается в петлю. Видео 16 с. | Видео / autoplay | Точная длительность не раскрыта; в видео линия проходит цикл и возвращается | Частично: в блоке «Как проходит работа» добавлен цикл-маркер `4 этапа / цикл` с круговой стрелкой; полную S-кривую не внедрял, чтобы не усложнять сетку | SVG + CSS `cycle-spin` 16s linear |
| 7 | [Metallic Send button](https://www.figma.com/riffs/81788abd-73cb-4e19-a19f-69a77e85df00) | Harshita Upadhyay, @velvetdrafts · 271 creators · 107 likes | Премиальная металлическая кнопка Send с полированным бликом, глубиной и микроанимацией нажатия. | Hover / press (по описанию «every interaction feel elevated») | Точная длительность не раскрыта; описание обещает сдержанное, дорогое движение | Частично: у кнопок добавлено тактильное нажатие (brightness + сжатие стрелки), без хрома | CSS `:active`, filter/transform 120 мс |
| 8 | [Animated Wallet Card](https://www.figma.com/riffs/bbe7657c-b0cf-4ea3-a7ec-80d7a494faf0) | Hamad Tanveer, @hamadtanveer · 5 creators · 9 likes | Карта кошелька `Total Cash / UST / Redeem` приподнимается и раскрывается, вторая карта остаётся позади. Видео 2 с. | Предположительно hover/loop | 2 с петля; точная кривая не раскрыта | Влияние на карточный стек и глубину hero-превью; отдельную wallet-карту не добавлял | — |
| 9 | [Making dismissing things more fun](https://www.figma.com/riffs/9ca98298-d4fc-4ac0-8522-04229d2f1da1) | Afnizar Nur Ghifari, @afnizarnur · 19 creators · 48 likes | Карточка с зелёным изображением и крестиком; закрытие обыграно игриво. | Click по X (по названию и кадру) | Точная длительность не раскрыта | Не внедрено: в портфолио нет dismissible-карточек; закрытие меню — обычный X | — |
| 10 | [Interactive Generative Light Threads](https://www.figma.com/riffs/93a205df-568e-4b1f-bf70-c8924a1c7eef) | Arian Taheri, @arianttaheri · 22 creators · 27 likes | Тёмная генеративная скульптура из световых нитей, снизу — панель управления цветом/режимами. | Pointer / controls, непрерывная генерация | Непрерывно; конкретные параметры не раскрыты | Не внедрено в оболочку: тяжёлый WebGL не должен грузиться на главной; это язык проектов Oyun/Nova | — |
| 11 | [Mouse-Reactive Dither Effect](https://www.figma.com/riffs/3b13930e-4e0b-478c-bc72-24f48b3c2542) | Hardik Gondhiya, @hardikgondhiya · 28 creators · 66 likes | Ч/б дизеринг-портрет, паттерн реагирует на курсор; видео 11 с. | Mouse move | Непрерывная реакция; точные параметры не раскрыты | Не внедрено: шейдерный dither спорит с типографикой и добавляет вес; направление оставлено для проектных страниц | — |

### Что с этим сделано

- **Реализовано:** карточный шафл и drag hero-превью (Riff 1/8), цикл-маркер процесса (Riff 6), тактильное нажатие кнопок (Riff 7), полноценный cursor trail + design-tool курсор (Riff 4), desk parallax/spotlight, browser image pan, интерактивная палитра hero и падающие карандаш/ластик (запросы владельца).
- **Сознательно не внедрено:** металл/хром (Riff 5), dismiss-карточки (Riff 9), тяжёлый WebGL (Riff 10), dither-шейдер (Riff 11) — они не совпадают с плоской редакционной системой или стоят слишком дорого для оболочки.
- **Точные тайминги и easing:** в Riffs не раскрыты. Чтобы получить их, нужно скопировать frame в Figma и открыть Motion timeline; я не копировал, чтобы не создавать копии в твоих драфтах без разрешения. Если нужно — скажи, и я вытащу точные значения из Motion timeline.

---

## 2. Framer-проекты

Проекты открыты через Framer MCP; для каждого снят реальный экран (не постер, не мокап).

| Проект | Framer project | Скриншоты | Что показано |
|---|---|---|---|
| EMBER | `HrowSjuw9zJzqyTW0rY3` · Telegram Mini App | `assets/img/prototypes/ember.webp` | Обзор: тёмный hero «Тихий премиум для игры», 53 экрана, баланс/каталог/профиль |
| Real Lot | `26DRbo6nv2Rl7spWGPWf` · Freelance Radar / Liquid Glass | `assets/img/prototypes/reallot.webp`, `reallot-mobile.webp` | Сравнение ночной и дневной стеклянной темы + мобильный экран |
| SMS PRO | `fFE7En1crCTqQYEP0LJg` · Redesign Concept | `assets/img/prototypes/sms-desktop.webp`, `sms-mobile.webp` | Светлая главная «Ваш номер. Для любого сервиса», радужный акцент, desktop + mobile |

Важно: Framer-проект **Real Lot** содержит страницу **Freelance Radar** — на сайте проект назван Real Lot, а в подписи честно указан Freelance Radar / liquid glass. Это не выдумка и не подмена: так называются файл и страница.

---

## 3. Реализованная motion-система

### 3.1. Курсор и мышь

| Механика | Триггер | Поведение | Значения | Где | Технология |
|---|---|---|---|---|---|
| Кастомный курсор | `pointermove` | Точка + кольцо, кольцо отстаёт | dot lerp 0.6, ring lerp 0.16, 34 → 78px | Все страницы | rAF, transform, mix-blend-mode |
| Label курсора | hover/focus `[data-cursor]` | «Смотреть», «Кейс», «Открыть», «Написать» | 8px mono, фон white 6% | Hero, карточки, пластины | pointerover + class |
| Магнитные кнопки | `pointermove` | Кнопка тянется к курсору | max 10×8px, lerp 0.18 | Hero, контакт | rAF, translate3d |
| Параллакс превью | `pointermove` на hero | Карточка проекта смещается в глубину | 16×12px, lerp 0.08 | Hero | rAF, `translate` |
| Tilt пластин | `pointermove` | Наклон по X/Y | ±5°, CSS vars `--rx/--ry` | Lab | pointermove + CSS transform |
| Карточный шафл | hover/focus строки индекса | Старая карточка улетает, новая поднимается | 650 мс, `--e-out`, rotate −7° | Hero preview | JS + CSS слои |
| Hover строки индекса | hover/focus | Сдвиг имени, линия, смена превью | +3px, 240 мс | Hero | CSS + JS |
| Hover карточки | hover/focus | Zoom, чип «Смотреть кейс» | 1.035, 900 мс | Works | CSS |
| Кнопки | press | Тактильное нажатие | brightness .95, стрелка scale .92, 120 мс | Везде | CSS `:active` |
| Hero palette | hover/click | Пять цветовых тем hero | 450 мс фон, 300 мс текст | Hero | CSS vars + JS, `aria-pressed` |
| Desk parallax | pointermove | Инструменты уходят в глубину | lerp 0.09, depth 18–42px | Hero | rAF + `translate` |
| Cursor trail | pointermove | Лаймовые ромбы | spawn 55 мс, fade 700 мс, max 12 | Все страницы | DOM + CSS animation |
| Preview drag | pointer drag | Карточка тянется, проект меняется | threshold 42px, shuffle 650 мс | Hero | Pointer capture + JS |
| Droppable props | click/Enter | Карандаш/ластик падают с вращением и возвращаются сверху | 1050 мс fall + 680 мс spring | Hero | WAAPI `translate/rotate` |
| Browser pan | pointermove | Скриншот панорамируется в рамке | ±10/8px, 350 мс | Works | CSS vars + JS |

### 3.2. Вход и scroll

| Механика | Триггер | Поведение | Значения | Где | Технология |
|---|---|---|---|---|---|
| Hero title | загрузка | Маска + сдвиг строк | 850 мс, stagger 60 мс | Hero | CSS keyframes, clip-path |
| Hero preview | загрузка | Поворот/масштаб | 900 мс, rotate −4° → −1.2° | Hero | CSS keyframes |
| Hero fade-up | загрузка | Eyebrow, lede, actions, rail | 600–700 мс, delays 50–550 мс | Hero | CSS keyframes |
| Reveal fade-up | IntersectionObserver | Прозрачность + 26px | 720 мс, delays 80/160/240 мс | Секции, карточки | IO + CSS |
| Reveal mask | IO на родителе | clip-path 100% → −1% | 900 мс | H2 секций | IO + CSS; родитель, чтобы clip не убивал intersection |
| Reveal scale | IO | scale .97 + opacity | 700–900 мс | Пластины | IO + CSS |
| Header progress | scroll | Линия заполняется | scaleX 0→1 | Все страницы | rAF + scroll |
| Ticker | CSS | Бесконечная лента | 34 с linear, пауза offscreen/hover | Главная | CSS animation + IO |
| Scroll cue | CSS | Стрелка вниз | 2.2 с loop | Hero | CSS keyframes |
| Star contact | CSS | Медленное вращение | 42 с linear | Contact | CSS keyframes |
| Status pulse | CSS | Точка «открыт» | 2.8 с loop | Header/rail/contact | CSS keyframes |
| Process cycle | CSS | Круговая стрелка цикла | 16 с linear | About | CSS keyframes |

### 3.3. Состояния интерфейса

| Механика | Триггер | Поведение | Значения | Где | Технология |
|---|---|---|---|---|---|
| Фильтры | click | Скрытие карточек + FLIP | hidden, 480 мс, fade 420 мс | Works | JS + WAAPI |
| Меню | click/Escape | Выезд сверху, stagger ссылок | 550 мс, 120–300 мс | ≤900 | CSS + JS, focus trap |
| Page transition | internal link | Overlay ink + FEN | 420 мс, sessionStorage | Все страницы | CSS + JS |
| Copy email | click | Статус «Почта скопирована» | 5 с, live region | Contact | Clipboard API |
| Reduced motion | media query | Все движения выключены | 0.01 мс | Везде | CSS + JS |

### 3.4. Палитра hero

Отдельный интерактив по запросу владельца: пять свотчей меняют `--hero-bg`, `--hero-fg`, `--hero-accent`, `--hero-caption`, `--hero-label`, `--hero-sticker` и grid. Hover — предпросмотр, click — фиксация; на мобильном tap. Это не Riff, а собственное расширение.

### 3.5. Правила

- Только `transform` и `opacity`; никаких анимаций `top/left/width/height`.
- Один rAF на курсор, один на магниты; tilt — только на pointermove.
- Reveal-обсерверы отписываются после срабатывания.
- Тяжёлые 3D-сцены не живут в оболочке: они в проектах (Oyun, Eclipse, Nova), каждая страница грузится отдельно.
- `prefers-reduced-motion`: курсор, параллакс, tilt, магнит, тикер, звезда, pulse, hero intro, page transition отключены; все reveal сразу видимы.

---

## 4. Что осталось за рамками

- Точные Motion-кривые из Riffs не извлечены: для этого нужен Copy frame → Motion timeline в Figma. Если разрешишь создать копию в твоём драфте, я вытащу значения и подгоню тайминги.
- Riff 3 и 10 — это скорее язык для проектных страниц (Oyun/Nova), чем для оболочки портфолио; они уже учтены в дизайне этих проектов, но не перенесены в главную.
- Framer-прототипы показаны реальными скриншотами; ссылки ведут в редактор Framer и требуют доступа к проекту.

## 5. Соответствие приоритетам ТЗ

| Приоритет | Что сделано |
|---|---|
| Интерактив главного экрана | Hero-индекс с карточным шафлом, параллакс, курсор, магнитный CTA |
| Анимации курсора и hover | Кастомный курсор с label, hover строк/карточек/пластин |
| Переходы между разделами | Полноэкранный page transition 420 мс, hash-навигация |
| Scroll-triggered | mask/fade/scale reveal, header progress, ticker pause |
| Интерактивные карточки | Zoom, чип, overlay-ссылка, tilt у прототипов |
| Микроанимации кнопок | Стрелки, фоны, магнит, press-feedback, focus-visible |
| Состояния интерфейса | Фильтры, меню, копирование, reduced motion, no-JS |
