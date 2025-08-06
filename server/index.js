const express = require('express')
const cors = require('cors')
const generateBooks = require('./generateBookData')

const app = express()

app.use(cors({
  origin: '*',
  methods: ['GET'],
}))

const PORT = process.env.PORT || 3000

app.get('/books', (req, res) => {
  try {
    const region = req.query.region || 'en_US'
    const seed = req.query.seed || '1'
    const avgLikes = parseFloat(req.query.avgLikes) || 0
    const avgReviews = parseFloat(req.query.avgReviews) || 0
    const page = parseInt(req.query.page, 10) || 1

    const books = generateBooks(region, seed, avgLikes, avgReviews, page)

    res.json(books)
  } catch (error) {
    console.error('Error generating books:', error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
})

app.listen(PORT, () => {
  console.log(`Backend is running on port ${PORT}`)
})
