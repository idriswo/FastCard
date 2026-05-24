const fs = require('fs');

const en = {
  header: {
    home: "Home", contact: "Contact", about: "About", signup: "Sign Up",
    searchPlaceholder: "What are you looking for?", manageAccount: "Manage My Account", logout: "Logout"
  },
  home: {
    categories: "Categories", allProducts: "All Products",
    flashSales: "Flash Sales", todays: "Today's", viewAll: "View All Products",
    browseByCategory: "Browse By Category",
    bestSelling: "Best Selling Products", thisMonth: "This Month",
    exploreProducts: "Explore Our Products", ourProducts: "Our Products",
    newArrival: "New Arrival", featured: "Featured",
    freeDelivery: "FREE AND FAST DELIVERY", freeDeliveryDesc: "Free delivery for all orders over $140",
    customerService: "24/7 CUSTOMER SERVICE", customerServiceDesc: "Friendly 24/7 customer support",
    moneyBack: "MONEY BACK GUARANTEE", moneyBackDesc: "We return money within 30 days"
  },
  product: {
    addToCart: "Add To Cart", buyNow: "Buy Now", reviews: "Reviews",
    inStock: "In Stock", outOfStock: "Out of Stock",
    delivery: "Free Delivery", deliveryDesc: "Enter your postal code for Delivery Availability",
    return: "Return Delivery", returnDesc: "Free 30 Days Delivery Returns. Details",
    related: "Related Item"
  },
  cart: {
    title: "Cart", product: "Product", price: "Price", quantity: "Quantity", subtotal: "Subtotal",
    returnToShop: "Return To Shop", updateCart: "Update Cart",
    cartTotal: "Cart Total", proceedToCheckout: "Proceed to checkout",
    coupon: "Coupon Code", applyCoupon: "Apply Coupon"
  },
  checkout: {
    billingDetails: "Billing Details", firstName: "First Name", companyName: "Company Name",
    streetAddress: "Street Address", apartment: "Apartment, floor, etc. (optional)",
    townCity: "Town/City", phoneNumber: "Phone Number", emailAddress: "Email Address",
    saveInfo: "Save this information for faster check-out next time",
    bankTransfer: "Bank Transfer", cashOnDelivery: "Cash on delivery",
    placeOrder: "Place Order"
  },
  auth: {
    createAccount: "Create an account", enterDetails: "Enter your details below",
    name: "Name", email: "Email", password: "Password", confirmPassword: "Confirm Password",
    login: "Log in", alreadyHaveAccount: "Already have account?",
    welcomeBack: "Log in to FastCard", loginDetails: "Enter your details below",
    forgotPassword: "Forgot Password?", dontHaveAccount: "Don't have an account?",
    signupWithGoogle: "Sign up with Google"
  },
  account: {
    manageMyAccount: "Manage My Account", myProfile: "My Profile", addressBook: "Address Book",
    myPaymentOptions: "My Payment Options", myOrders: "My Orders", myReturns: "My Returns",
    myCancellations: "My Cancellations", editProfile: "Edit Your Profile",
    currentPassword: "Current Password", newPassword: "New Password", confirmNewPassword: "Confirm New Password",
    cancel: "Cancel", saveChanges: "Save Changes"
  },
  wishlist: {
    title: "Wishlist", moveAllToBag: "Move All To Bag", justForYou: "Just For You", seeAll: "See All"
  },
  footer: {
    subscribe: "Subscribe", get10Off: "Get 10% off your first order",
    support: "Support", address: "111 Bijoy sarani, Dhaka, DH 1515, Bangladesh.",
    account: "Account", quickLink: "Quick Link", privacyPolicy: "Privacy Policy",
    termsOfUse: "Terms Of Use", faq: "FAQ", downloadApp: "Download App",
    saveWithApp: "Save $3 with App New User Only"
  }
};

const ru = {
  header: {
    home: "Главная", contact: "Контакты", about: "О нас", signup: "Регистрация",
    searchPlaceholder: "Что вы ищете?", manageAccount: "Мой аккаунт", logout: "Выйти"
  },
  home: {
    categories: "Категории", allProducts: "Все товары",
    flashSales: "Распродажа", todays: "Сегодняшние", viewAll: "Посмотреть все товары",
    browseByCategory: "Поиск по категориям",
    bestSelling: "Лидеры продаж", thisMonth: "В этом месяце",
    exploreProducts: "Наши товары", ourProducts: "Исследуйте",
    newArrival: "Новинки", featured: "Рекомендуемые",
    freeDelivery: "БЕСПЛАТНАЯ И БЫСТРАЯ ДОСТАВКА", freeDeliveryDesc: "Бесплатная доставка для заказов от $140",
    customerService: "ПОДДЕРЖКА 24/7", customerServiceDesc: "Дружелюбная поддержка клиентов 24/7",
    moneyBack: "ГАРАНТИЯ ВОЗВРАТА ДЕНЕГ", moneyBackDesc: "Мы возвращаем деньги в течение 30 дней"
  },
  product: {
    addToCart: "В корзину", buyNow: "Купить", reviews: "Отзывы",
    inStock: "В наличии", outOfStock: "Нет в наличии",
    delivery: "Бесплатная доставка", deliveryDesc: "Введите почтовый индекс для проверки",
    return: "Возврат товара", returnDesc: "Бесплатный возврат в течение 30 дней. Подробнее",
    related: "Похожие товары"
  },
  cart: {
    title: "Корзина", product: "Товар", price: "Цена", quantity: "Количество", subtotal: "Подытог",
    returnToShop: "Вернуться в магазин", updateCart: "Обновить корзину",
    cartTotal: "Сумма заказа", proceedToCheckout: "Перейти к оформлению",
    coupon: "Код купона", applyCoupon: "Применить купон"
  },
  checkout: {
    billingDetails: "Платежные реквизиты", firstName: "Имя", companyName: "Название компании",
    streetAddress: "Адрес (улица, дом)", apartment: "Квартира, этаж (необязательно)",
    townCity: "Город", phoneNumber: "Номер телефона", emailAddress: "Email",
    saveInfo: "Сохранить информацию для следующих покупок",
    bankTransfer: "Банковский перевод", cashOnDelivery: "Оплата при доставке",
    placeOrder: "Разместить заказ"
  },
  auth: {
    createAccount: "Создать аккаунт", enterDetails: "Введите свои данные ниже",
    name: "Имя", email: "Email", password: "Пароль", confirmPassword: "Подтвердите пароль",
    login: "Войти", alreadyHaveAccount: "Уже есть аккаунт?",
    welcomeBack: "Вход в FastCard", loginDetails: "Введите свои данные ниже",
    forgotPassword: "Забыли пароль?", dontHaveAccount: "Нет аккаунта?",
    signupWithGoogle: "Войти через Google"
  },
  account: {
    manageMyAccount: "Управление аккаунтом", myProfile: "Мой профиль", addressBook: "Адресная книга",
    myPaymentOptions: "Мои способы оплаты", myOrders: "Мои заказы", myReturns: "Мои возвраты",
    myCancellations: "Мои отмены", editProfile: "Редактировать профиль",
    currentPassword: "Текущий пароль", newPassword: "Новый пароль", confirmNewPassword: "Подтвердите пароль",
    cancel: "Отмена", saveChanges: "Сохранить изменения"
  },
  wishlist: {
    title: "Избранное", moveAllToBag: "Переместить все в корзину", justForYou: "Специально для вас", seeAll: "Смотреть все"
  },
  footer: {
    subscribe: "Подписка", get10Off: "Получите скидку 10% на первый заказ",
    support: "Поддержка", address: "111 Bijoy sarani, Dhaka, DH 1515, Bangladesh.",
    account: "Аккаунт", quickLink: "Быстрые ссылки", privacyPolicy: "Политика конфиденциальности",
    termsOfUse: "Условия использования", faq: "Частые вопросы", downloadApp: "Скачать приложение",
    saveWithApp: "Сэкономьте $3 с приложением"
  }
};

const tj = {
  header: {
    home: "Асосӣ", contact: "Тамос", about: "Дар бораи мо", signup: "Ба қайд гирифтан",
    searchPlaceholder: "Шумо чӣ меҷӯед?", manageAccount: "Профили ман", logout: "Баромад"
  },
  home: {
    categories: "Категорияҳо", allProducts: "Ҳамаи маҳсулот",
    flashSales: "Фурӯши фаврӣ", todays: "Имрӯза", viewAll: "Дидани ҳамаи маҳсулот",
    browseByCategory: "Ҷустуҷӯ аз рӯи категорияҳо",
    bestSelling: "Маҳсулоти беҳтарин", thisMonth: "Дар ин моҳ",
    exploreProducts: "Маҳсулоти мо", ourProducts: "Бодиққат бинед",
    newArrival: "Навгонӣ", featured: "Тавсияшавандаҳо",
    freeDelivery: "ИНТИҚОЛИ РОЙГОН ВА ТЕЗ", freeDeliveryDesc: "Интиқоли ройгон барои ҳамаи фармоишҳои зиёда аз $140",
    customerService: "ДАСТГИРИИ 24/7", customerServiceDesc: "Дастгирии мизоҷон 24 соат дар як рӯз",
    moneyBack: "КАФОЛАТИ БОЗГАРДОНИДАНИ ПУЛ", moneyBackDesc: "Мо пули шуморо дар давоми 30 рӯз бармегардонем"
  },
  product: {
    addToCart: "Ба сабад", buyNow: "Харидан", reviews: "Шарҳҳо",
    inStock: "Дар анбор", outOfStock: "Дар анбор нест",
    delivery: "Интиқоли ройгон", deliveryDesc: "Индекси почтаи худро ворид кунед",
    return: "Бозгардонидани мол", returnDesc: "Бозгардонидани ройгон дар давоми 30 рӯз. Муфассал",
    related: "Маҳсулоти монанд"
  },
  cart: {
    title: "Сабад", product: "Маҳсулот", price: "Нарх", quantity: "Миқдор", subtotal: "Ҷамъ",
    returnToShop: "Бозгашт ба мағоза", updateCart: "Навсозии сабад",
    cartTotal: "Ҷамъи сабад", proceedToCheckout: "Пардохт кардан",
    coupon: "Рамзи купон", applyCoupon: "Истифодаи купон"
  },
  checkout: {
    billingDetails: "Маълумоти пардохт", firstName: "Ном", companyName: "Номи ширкат",
    streetAddress: "Суроға", apartment: "Ҳуҷра (ҳатмӣ нест)",
    townCity: "Шаҳр", phoneNumber: "Рақами телефон", emailAddress: "Почтаи электронӣ",
    saveInfo: "Маълумотро барои харидҳои оянда захира кунед",
    bankTransfer: "Интиқоли бонкӣ", cashOnDelivery: "Пардохт ҳангоми қабул",
    placeOrder: "Фармоиш додан"
  },
  auth: {
    createAccount: "Сохтани аккаунт", enterDetails: "Маълумоти худро ворид кунед",
    name: "Ном", email: "Почтаи электронӣ", password: "Рамз", confirmPassword: "Тасдиқи рамз",
    login: "Даромадан", alreadyHaveAccount: "Аллакай аккаунт доред?",
    welcomeBack: "Даромад ба FastCard", loginDetails: "Маълумоти худро ворид кунед",
    forgotPassword: "Рамзро фаромӯш кардед?", dontHaveAccount: "Аккаунт надоред?",
    signupWithGoogle: "Даромад тавассути Google"
  },
  account: {
    manageMyAccount: "Идоракунии аккаунт", myProfile: "Профили ман", addressBook: "Китоби суроғаҳо",
    myPaymentOptions: "Усулҳои пардохт", myOrders: "Фармоишҳои ман", myReturns: "Бозгаштҳои ман",
    myCancellations: "Бекоркуниҳои ман", editProfile: "Таҳрири профил",
    currentPassword: "Рамзи ҷорӣ", newPassword: "Рамзи нав", confirmNewPassword: "Тасдиқи рамзи нав",
    cancel: "Бекор кардан", saveChanges: "Захира кардани тағирот"
  },
  wishlist: {
    title: "Мунтахабҳо", moveAllToBag: "Ҳамаашро ба сабад гузаронед", justForYou: "Махсус барои шумо", seeAll: "Дидани ҳама"
  },
  footer: {
    subscribe: "Обуна шудан", get10Off: "Барои фармоиши аввал 10% тахфиф гиред",
    support: "Дастгирӣ", address: "111 Bijoy sarani, Dhaka, DH 1515, Bangladesh.",
    account: "Аккаунт", quickLink: "Истинодҳои зуд", privacyPolicy: "Сиёсати махфият",
    termsOfUse: "Шартҳои истифода", faq: "Саволҳои зиёд", downloadApp: "Боргирии барнома",
    saveWithApp: "Бо барнома $3 сарфа кунед"
  }
};

fs.writeFileSync('src/locales/en.json', JSON.stringify(en, null, 2));
fs.writeFileSync('src/locales/ru.json', JSON.stringify(ru, null, 2));
fs.writeFileSync('src/locales/tj.json', JSON.stringify(tj, null, 2));
console.log("Translations generated successfully!");
