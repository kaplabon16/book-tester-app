import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { generateBooks } from './generateBookData.js'

dotenv.config()

const app = express()
const port = process.env.PORT || 3000

app.use(cors())

app.get('/books', (req, res) => {
  try {
    const region = req.query.region || 'en_US'
    const seed = req.query.seed || '42'
    const avgLikes = parseFloat(req.query.avgLikes || '0')
    const avgReviews = parseFloat(req.query.avgReviews || '0')
    const page = parseInt(req.query.page || '1')

    const books = generateBooks({ region, seed, avgLikes, avgReviews, page })

    res.json({ books })
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' })
  }
})

app.listen(port, () => {
  console.log(`Backend is running on port ${port}`)
})
