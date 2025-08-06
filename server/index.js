const express = require('express');
const cors = require('cors');
const generateBooks = require('./generateBookData');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

app.get('/books', (req, res) => {
  const {
    region = 'en_US',
    seed = '1',
    avgLikes = '0',
    avgReviews = '0',
    page = '1'
  } = req.query;

  try {
    const books = generateBooks(
      region,
      seed,
      parseFloat(avgLikes),
      parseFloat(avgReviews),
      parseInt(page, 10),
      20
    );
    res.json(books);generateBooks
  } catch (err) {
    console.error('Error generating books:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(PORT, () => {
  console.log(`Backend is running on port ${PORT}`);
});
