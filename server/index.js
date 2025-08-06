const express = require("express");
const cors = require("cors");
const { Faker, en, de, fr, ja } = require("@faker-js/faker");

const app = express();
const PORT = 3000;

app.use(cors());

const locales = {
  en_US: en,
  de_DE: de,
  fr_FR: fr,
  ja_JP: ja,
};

app.get("/books", (req, res) => {
  const {
    region = "en_US",
    seed = "1",
    page = "1",
    avgLikes = "0",
    avgReviews = "0",
  } = req.query;

  const selectedLocale = locales[region] || en;
  const seedValue = parseInt(seed) + parseInt(page);

  // Create faker instance with selected locale and seed
  const faker = new Faker({ locale: selectedLocale });
  faker.seed(seedValue);

  const books = [];

  for (let i = 0; i < 20; i++) {
    const index = (page - 1) * 20 + i + 1;

    const title = faker.lorem.words(faker.number.int({ min: 2, max: 5 }));
    const author = faker.person.fullName();
    const publisher = faker.company.name();
    const isbn = faker.string.numeric(13);

    const likes = Math.random() < avgLikes / 10 ? Math.ceil(avgLikes) : 0;
    const hasReview = Math.random() < Math.min(avgReviews / 10, 1);
    const reviews = hasReview
      ? Array.from({ length: Math.round(avgReviews) }).map(() => ({
        reviewer: faker.person.fullName(),
        review: faker.lorem.sentence(),
      }))
      : [];

    books.push({
      index,
      title,
      author,
      publisher,
      isbn,
      likes,
      reviews,
    });
  }

  res.json(books);
});

app.listen(PORT, () => {
  console.log(`Backend is running ${PORT}`);
});
