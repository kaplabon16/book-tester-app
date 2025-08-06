const express = require("express");
const cors = require("cors");
const { Faker, en, de, fr, ja } = require("@faker-js/faker");

const generateBooks = require("./generateBookData");


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
  const { region, seed, avgLikes, avgReviews, page = 1 } = req.query;

  const books = generateBooks(
    region || "en_US",
    seed || "1",
    parseFloat(avgLikes) || 0,
    parseFloat(avgReviews) || 0,
    parseInt(page),
    20
  );

  res.json(books);
});


app.listen(PORT, () => {
  console.log(`Backend is running ${PORT}`);
});
