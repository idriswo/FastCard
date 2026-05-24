const fs = require('fs');

const categoriesEn = {
  "Electronics": "Electronics",
  "Fashion": "Fashion",
  "Home & Garden": "Home & Garden",
  "Sports": "Sports",
  "Toys": "Toys",
  "Camera": "Camera",
  "Computers": "Computers",
  "SmartWatch": "SmartWatch",
  "HeadPhones": "HeadPhones",
  "Gaming": "Gaming"
};

const categoriesRu = {
  "Electronics": "Электроника",
  "Fashion": "Мода",
  "Home & Garden": "Дом и Сад",
  "Sports": "Спорт",
  "Toys": "Игрушки",
  "Camera": "Камеры",
  "Computers": "Компьютеры",
  "SmartWatch": "Смарт-часы",
  "HeadPhones": "Наушники",
  "Gaming": "Игры"
};

const categoriesTj = {
  "Electronics": "Электроника",
  "Fashion": "Мӯд",
  "Home & Garden": "Хона ва Боғ",
  "Sports": "Варзиш",
  "Toys": "Бозичаҳо",
  "Camera": "Камераҳо",
  "Computers": "Компютерҳо",
  "SmartWatch": "Соатҳои ҳушманд",
  "HeadPhones": "Гӯшмонакҳо",
  "Gaming": "Бозиҳо"
};

['en', 'ru', 'tj'].forEach(lang => {
  const file = `src/locales/${lang}.json`;
  const data = JSON.parse(fs.readFileSync(file, 'utf8'));
  
  if (lang === 'en') data.dynamic = { categories: categoriesEn };
  if (lang === 'ru') data.dynamic = { categories: categoriesRu };
  if (lang === 'tj') data.dynamic = { categories: categoriesTj };

  fs.writeFileSync(file, JSON.stringify(data, null, 2));
});

console.log("Categories translation added!");
