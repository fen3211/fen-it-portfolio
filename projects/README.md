# projects/ — интегрированные демо

Пять проектов лежат внутри основного репозитория, без Git Submodules. Каждый сохраняет самостоятельную работоспособность в своей папке.

| Папка | Проект | Источник | Тип интеграции | Размер |
|---|---|---|---|---|
| `oyun-alemi/` | Ойын әлемі | [fen3211/oyun-alemi](https://github.com/fen3211/oyun-alemi) | Vite `dist`, `base: "./"` | 728 КБ |
| `eclipse-maison/` | Eclipse Maison | [fen3211/eclipse-maison](https://github.com/fen3211/eclipse-maison) | Vite `dist`, `base: "./"` | 2.3 МБ |
| `escrowhub-redesign/` | EscrowHub | [fen3211/escrowhub-redesign](https://github.com/fen3211/escrowhub-redesign) | статический экспорт + скриншоты кейса | 5.6 МБ |
| `nova-gear/` | NOVA Gear | [fen3211/nova-gear](https://github.com/fen3211/nova-gear) | статический сайт | 18 МБ |
| `utka/` | Utka | [fen3211/utka](https://github.com/fen3211/utka) | статический прототип | 3.7 МБ |

## Что скопировано и что исключено

### Oyun Alemi
- Скопирован production `dist` (HTML + JS + CSS).
- Исходники, тесты, Playwright, docs не копировались: в портфолио нужен работающий сайт, а не dev-инфраструктура.
- Сборка: `npm run build -- --base=./`; иначе ассеты ищутся от корня домена и ломаются на GitHub Pages.

### Eclipse Maison
- Скопирован `dist` React/Three.js с относительным base.
- Шрифты Instrument Serif / Inter Tight входят в сборку (OFL).
- Исходные `.tsx`, тесты, workflows не копировались.

### EscrowHub
- Скопированы все публичные HTML-страницы: `index`, `catalog`, `product`, `orders`, `seller`, `create`, `404`, `case`, `states`.
- `assets/` (CSS, JS, шрифты, логотипы) + `deliverables/screenshots/` — потому что собственная страница `case.html` ссылается на эти изображения.
- Не копировались `backup/` и служебные скрипты. Внешние ссылки на правила EscrowHub.online остались публичными ссылками оригинала.

### NOVA Gear
- Скопированы `index.html`, `style.css`, `script.js`, `lenis.min.js`, `assets/` (18 МБ: 56 hero-кадров, scrub-кадры, продуктовые рендеры), `favicon.ico`, `LICENSE`.
- Исключены `review/`, `kwork_portfolio/`, `scripts/`, `tests/`, `.github/` — они не нужны для работы сайта и раздувают репозиторий.
- Лицензия кода — MIT, copyright fen3211 (см. `nova-gear/LICENSE`).

### Utka
- Скопированы `index.html`, `about.html`, `system.html`, `prototype.html`, `app.js`, `data.js`, `styles/`, `assets/`.
- Дополнительно скопированы два PNG из `exports/screens-2x/`, на которые ссылается `about.html`; остальные экспорты 2x/3x, PDF и служебные raw-скрипты исключены.
- Figma-файла нет и не заявлено; деливерабл — HTML/CSS/JS + PNG. Бэкенда нет.

## Обновление проекта

### Vite-проекты (Oyun, Eclipse)

```bash
# в исходном репозитории
npm install
npm run build -- --base=./

# скопировать содержимое dist в projects/<slug>/
# (не копировать node_modules, .env, .git)
```

Проверить после копирования:
- нет абсолютных `src="/..."` и `href="/..."`;
- шрифты/картинки открываются по относительным путям;
- консоль чистая на `http://127.0.0.1:4173/projects/<slug>/`.

### Статические проекты (EscrowHub, Nova, Utka)

Скопировать только рантайм-файлы и `assets/`, сохранив структуру. Не тащить `node_modules`, бэкапы, экспорты, тесты и секреты. Проверить внутренние ссылки (у Escrow — query-параметры `product.html?id=...`).

## Лицензии и авторство

- Все пять проектов — работы автора портфолио (fen3211).
- NOVA Gear — MIT (файл `LICENSE` внутри папки).
- Шрифты в сборках — SIL OFL 1.1 (Instrument Serif, Inter Tight, Manrope, Onest и др.).
- Демо-бренды (Eclipse Maison, NOVA Gear, Utka, EscrowHub-редизайн) — концепты/тестовые задания; коммерческие названия и цены внутри демо не являются публичной офертой.
- Стоковые изображения не добавлялись; все превью сняты с реальных демо через Playwright, скриншоты прототипов — через Framer MCP.

## Framer-прототипы

EMBER, Real Lot и SMS PRO не лежат в `projects/`: это внешние Framer-проекты. Их реальные скриншоты сохранены в `assets/img/prototypes/` и показаны в секции `#lab`. Ссылки ведут в Framer и требуют доступа к проекту.
