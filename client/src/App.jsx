const React = require('react')
const { useState, useEffect } = React
const axios = require('axios')
const BookTable = require('./components/BookTable')

const API_BASE = process.env.VITE_API_URL

function App() {
  const [books, setBooks] = useState([])
  const [region, setRegion] = useState('en_US')
  const [seed, setSeed] = useState('1')
  const [avgLikes, setAvgLikes] = useState(3)
  const [avgReviews, setAvgReviews] = useState(1)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)

  const regionOptions = [
    { label: 'English (USA)', value: 'en_US' },
    { label: 'German (Germany)', value: 'de_DE' },
    { label: 'French (France)', value: 'fr_FR' },
    { label: 'Japanese (Japan)', value: 'ja_JP' },
  ]

  // Fetch books - reset = true means reset list and page to 1
  const fetchBooks = async (reset = false) => {
    if (loading) return
    setLoading(true)
    try {
      const res = await axios.get(`${API_BASE}/books`, {
        params: {
          region,
          seed,
          avgLikes,
          avgReviews,
          page: reset ? 1 : page,
        },
      })

      const data = res.data
      if (reset) {
        setBooks(data)
        setPage(2)
      } else {
        setBooks((prev) => [...prev, ...data])
        setPage((prev) => prev + 1)
      }
    } catch (err) {
      console.error('Error loading books:', err)
    } finally {
      setLoading(false)
    }
  }

  // Reset on region, seed, avgLikes, avgReviews change
  useEffect(() => {
    fetchBooks(true)
  }, [region, seed, avgLikes, avgReviews])

  // Infinite scroll handler
  const handleScroll = (e) => {
    const bottom =
      e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight
    if (bottom && !loading) {
      fetchBooks()
    }
  }

  // Randomize seed
  const generateRandomSeed = () => {
    const random = Math.floor(Math.random() * 1000000).toString()
    setSeed(random)
  }

  return (
    React.createElement(
      'div',
      { className: 'p-4 max-w-6xl mx-auto h-screen overflow-y-auto', onScroll: handleScroll },
      React.createElement('h1', { className: 'text-2xl font-bold mb-4 text-center' }, 'Book Tester App'),

      React.createElement('div', { className: 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6' },
        React.createElement('div', null,
          React.createElement('label', { className: 'block mb-1 font-medium' }, 'Language/Region'),
          React.createElement(
            'select',
            {
              value: region,
              onChange: (e) => setRegion(e.target.value),
              className: 'w-full border p-2 rounded',
            },
            regionOptions.map((r) =>
              React.createElement('option', { key: r.value, value: r.value }, r.label)
            )
          )
        ),

        React.createElement('div', null,
          React.createElement('label', { className: 'block mb-1 font-medium' }, 'Seed'),
          React.createElement('input', {
            type: 'text',
            value: seed,
            onChange: (e) => setSeed(e.target.value),
            className: 'w-full border p-2 rounded',
          }),
          React.createElement(
            'button',
            {
              onClick: generateRandomSeed,
              className: 'mt-1 text-sm text-blue-500 underline',
            },
            '🔀 Random'
          )
        ),

        React.createElement('div', null,
          React.createElement('label', { className: 'block mb-1 font-medium' }, 'Avg Likes (0 - 10)'),
          React.createElement('input', {
            type: 'range',
            min: '0',
            max: '10',
            step: '0.1',
            value: avgLikes,
            onChange: (e) => setAvgLikes(parseFloat(e.target.value)),
            className: 'w-full',
          }),
          React.createElement('div', { className: 'text-sm text-center' }, avgLikes.toFixed(1))
        ),

        React.createElement('div', null,
          React.createElement('label', { className: 'block mb-1 font-medium' }, 'Avg Reviews (0 - 10)'),
          React.createElement('input', {
            type: 'number',
            min: '0',
            max: '10',
            step: '0.1',
            value: avgReviews,
            onChange: (e) => setAvgReviews(parseFloat(e.target.value)),
            className: 'w-full border p-2 rounded',
          })
        )
      ),

      React.createElement(BookTable, { books }),

      loading &&
      React.createElement(
        'div',
        { className: 'text-center py-4 text-blue-500 animate-pulse' },
        'Loading more books...'
      )
    )
  )
}

module.exports = App
