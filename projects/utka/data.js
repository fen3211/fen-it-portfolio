/* UTKA — content states
   The two screens share one component system. Only the guest data below changes. */

window.UTKA_DATA = {
  guest: {
    id: "guest",
    documentTitle: "UTKA — до первого визита",
    beans: {
      label: "Банка зёрен",
      count: 0,
      aria: "Банка зёрен: пусто"
    },
    quote: "Жду. Столик у окна уже присмотрела.",
    level: {
      title: "Пока без уровня",
      paws: [false, false, false, false],
      caption: "Первый визит с QR — первая лапка"
    },
    offer: {
      tone: "pending",
      badge: "Ждёт первого визита",
      title: "Тебе доступен купон на знакомство: второй кофе — за 99 ₽ вместо 350",
      description:
        "Сегодня кофе по обычной цене. Купон проснётся после первого визита и будет действовать 7 дней: капучино, латте, американо или флэт уайт.",
      link: "Все купоны и предложения",
      stamps: null,
      boxData: null
    },
    savings: null,
    cafe: {
      title: "Кофейня рядом",
      note: "6 минут пешком"
    },
    dockCaption: "на кассе — визит засчитается сам",
    character: "base"
  },

  regular: {
    id: "regular",
    documentTitle: "UTKA — знакомый гость",
    beans: {
      label: "3 зерна",
      count: 3,
      aria: "Банка зёрен: 3 зерна"
    },
    quote: "Фартук! Теперь я подмастерье.",
    level: {
      title: "Знакомый гость",
      paws: [true, true, true, false],
      caption: "до „Частого гостя“ — 1 лапка: там Бокс „5+2“"
    },
    offer: {
      tone: "active",
      badge: "Бокс „3+1“",
      title: "Ещё два кофе — и четвёртый бесплатно",
      description: null,
      link: "Все купоны и предложения",
      stamps: 1,
      stampsTotal: 3,
      boxData: "Отметки: 1 из 3. Бокс действует до 7 августа."
    },
    savings: {
      title: "Сэкономлено: 251 ₽",
      note: "это почти чашка капучино"
    },
    cafe: {
      title: "Кофейня рядом",
      note: "6 минут пешком"
    },
    dockCaption: "на кассе — визит и отметка Бокса засчитываются сами",
    character: "apron"
  }
};
