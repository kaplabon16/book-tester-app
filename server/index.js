const express = require('express')
const cors = require('cors')
const generateBooks = require('./generateBookData')

const app = express()
app.use(cors())

app.get('/books', async (req, res) => {
  try {
    const { region = 'en_US', seed = 1, avgReviews = 1, page = 1 } = req.query
    const books = generateBooks({ region, seed: parseInt(seed), avgReviews: parseFloat(avgReviews), page: parseInt(page) })
    res.json(books)
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

const port = process.env.PORT || 3000
app.listen(port, () => {
  console.log(`Backend is running on port ${port}`)
})
