# TOOLS_AND_SKILLS.md — чем работал

Дата: **30.10.2026**. Задача: редизайн `fen-it-portfolio`, интеграция пяти проектов, реальные превью, разбор Figma Riffs, проверка и PR.

## 1. Окружение

| Инструмент | Версия / статус |
|---|---|
| Windows 11 (10.0.26300), x64 | рабочая машина |
| Node.js | v24.20.0 |
| npm | 11.19.0 |
| Python | 3.12.10 |
| git | 2.55.0.windows.5 |
| gh CLI | 2.100.0, авторизован как `fen3211` |
| Chromium | Playwright 1.64.1, сборка 1248 |
| Chrome (пользовательский) | открыт с сессией Figma; использован для Riffs |

## 2. MCP

### Использовано

| MCP | Инструменты | Что сделано |
|---|---|---|
| **Framer** | `list_projects`, `open_project`, `read_docs`, `exec` | Найдены проекты SMS-PRO, EMBER, Real Lot. Через `api.tree.serialize` прочитана структура страниц/брейкпоинтов, через `api.tree.screenshot` сняты реальные экраны. Проекты **не изменялись**: `tree.changedNodeCount = 0`. |
| **Playwright** (CLI + браузер) | скриншоты, переходы, viewport | Сняты превью всех пяти демо, кейс-кадры, проверены адаптив, меню, фильтры, reduced motion, no-JS, битые ссылки, консоль. |
| **GitHub** | `gh` CLI | Проверка авторизации, ветка, push и PR (в конце). |
| **Filesystem / shell** | Read/Write/Glob/Grep/Bash | Структура, правки, проверки, сборка проектов. |
| **Computer Use** | Windows app control | Навигация в пользовательском Chrome по 11 Figma Riffs; просмотр Framer-канваса до подключения MCP. Без ввода паролей и без обхода авторизации. |
| **qoder-settings** | `manage_app_setting` (только чтение) | Проверено, что `chromeConnector.enabled = true`; настройки не менялись. |

### Доступно, но не использовано

| MCP | Почему |
|---|---|
| **Browser Use** | `BROWSER_CONNECTOR_WAITING`: не было подключённого внешнего браузера. Riffs открыл через пользовательский Chrome средствами Computer Use. |
| **Figma MCP** | Figma Riffs — это community-контент, а не файл проекта; MCP не нужен. Figma-файла в задаче нет. |
| **Chrome DevTools MCP** | Playwright покрыл все проверки; дублировать не стал. |
| **Premiere / After Effects / Blender / ComfyUI** | Не относятся к задаче. |
| **SQLite / memory / telegram** | Не относятся к задаче. |

## 3. Skills

Доступные и релевантные: `browser-use`, `computer-use`, `frontend-design`, `refero-design`, `web-design-guidelines`, `motion`, `playwright-pro`, `testing`, `verification-before-completion`, `writing-plans`.

Фактически использованы:
- **computer-use** — управление пользовательским Chrome для Riffs.
- **browser-use** — попытка подключения; завершилась `BROWSER_CONNECTOR_WAITING`, после чего перешёл на Computer Use.
- **frontend-design / refero-design / web-design-guidelines** — использованы как чек-лист против «нейрослопа»: композиция, типографика, отсутствие симметричных hero и icon-карточек.
- **motion** — принципы spring/lerp/easing; реализация своя, без библиотеки.
- **playwright-pro / testing / verification-before-completion** — проверки и доказательства (Lighthouse, axe, ссылки, консоль, frame timing).

**Новые глобальные skills не устанавливал.** Причина: в окружении уже есть подходящие; установка меняла бы глобальную конфигурацию без необходимости. Глобальные настройки не менялись, бэкап не требовался.

## 4. Что установлено в scratch-папке (не в репозитории)

В `D:/Projects/тест/qoder/_portfolio_sources/_tools`:

- `playwright@1.64.1` — скриншоты и E2E-проверки.
- `axe-core` — WCAG A/AA.
- `lighthouse` — performance/accessibility/best-practices/SEO.
- `@fontsource-variable/unbounded`, `@fontsource-variable/onest`, `@fontsource/cormorant-garamond`, `@fontsource/ibm-plex-mono` — исходники woff2; в репозиторий скопированы только нужные файлы.

В самом сайте **нет** `node_modules`, сборщика и npm-зависимостей: главная — статика.

## 5. Доступ к референсам

### Figma Riffs — доступны

Все 11 ссылок открыты в пользовательском Chrome (авторизованная сессия Figma, 30.10.2026). Просмотрены видео/превью:

1. Card shuffle — Alejandro Vasquez.
2. Artificial Design orbit — Hijrat.
3. Stone supplier concept — Maksym Rizniak.
4. Make Cursor Magic — Hijrat.
5. Liquid metal button — chaz.
6. Design thinking loop — Leila Azimi.
7. Metallic Send button — Harshita Upadhyay.
8. Animated Wallet Card — Hamad Tanveer.
9. Making dismissing things more fun — Afnizar Nur Ghifari.
10. Interactive Generative Light Threads — Arian Taheri.
11. Mouse-Reactive Dither Effect — Hardik Gondhiya.

Разбор — в `ANIMATION_REFERENCES.md`. Точные Motion-кривые не извлекались: для этого нужна копия frame в Motion timeline, которую я не создавал без разрешения.

### Framer — доступны через MCP

| Проект | ID | Что снято |
|---|---|---|
| SMS-PRO · Redesign Concept | `fFE7En1crCTqQYEP0LJg` | desktop + mobile hero |
| EMBER · Telegram Mini App | `HrowSjuw9zJZqyTW0rY3` | обзор 1000×1250 |
| Real Lot · Freelance Radar | `26DRbo6nv2Rl7spWGPWf` | day/night desktop + mobile |

Скриншоты лежат в `assets/img/prototypes/`. Это реальные рендеры Framer, не сгенерированные мокапы.

Дополнительно через `api.tree.serialize` прочитаны текстовые ноды SMS-PRO: desktop `IigT28pwH` — `Switzer`, italic, 76px; mobile `Z9W41GjvBIigT28pwH` — `Onest`, 600, 36px. Отсюда разные шрифты в прототипе; проекты не изменялись.

### Ограничения доступа

- Прямые ссылки Framer из ТЗ открываются только с доступом к проекту. На сайте стоят скриншоты, а ссылки ведут в Framer.
- Framer MCP для EMBER сработал только с полным URL проекта, не с коротким ID; это учтено.
- Проект **Real Lot** внутри содержит страницу **Freelance Radar**; на сайте это честно подписано.
- Точные Figma Motion-параметры не выгружены: не создавал копию frame в чужих драфтах.

## 6. Проверки и команды

| Проверка | Команда / инструмент | Результат |
|---|---|---|
| JS-синтаксис | `node --check assets/js/site.js` | OK |
| Локальные ссылки/якоря | Python-парсер HTML/CSS | 0 битых (кроме runtime-спрайта иконок Escrow) |
| Битые изображения | проверка `src`/CSS `url()` | 0 |
| Консоль | Playwright на home/cases/5 демо | 0 ошибок на threaded-сервере |
| Доступность | axe-core WCAG A/AA | 0 нарушений (desktop/mobile) |
| Lighthouse mobile | `npx lighthouse` | 99 / 100 / 100 / 100 |
| Lighthouse desktop | `--preset=desktop` | 100 / 100 / 100 / 100 |
| Overflow | 1920…360 | 0 |
| Frame timing | headed Chromium, 3 с скролла | avg ~7 мс, p95 ~7 мс, long tasks 0 |
| No-JS | `javaScriptEnabled:false` | контент и навигация доступны |
| Reduced motion | `reducedMotion:reduce` | курсор off, reveal видимы, анимации off |

## 7. Ограничения и честные заметки

- Headless Chromium на этой машине рендерит ~30 FPS (software); headed — ~144 FPS. В отчёте указан headed-замер, но это не гарантия 60 FPS на любом устройстве.
- Lighthouse — локальный лабораторный замер, не field data.
- Тяжёлые демо (Nova 18 МБ, Utka 3.7 МБ) лежат отдельными страницами и не влияют на загрузку главной.
- В SMS-PRO разные шрифты — это особенность самого Framer-проекта, не портфолио (см. `DESIGN_SYSTEM.md`, 8.6).
- Browser Use connector не был подключён; если он нужен для будущих задач, включи расширение Qoder Browser Connector в Chrome.
- Глобальные конфиги, MCP-настройки и Framer-проекты не изменялись.
