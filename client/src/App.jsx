import { useEffect, useState } from "react"
import axios from "axios"
import RegionSelector from "./components/RegionSelector"
import SeedInput from "./components/SeedInput"
import LikesSlider from "./components/LikesSlider"
import ReviewsInput from "./components/ReviewsInput"
import BookTable from "./components/BookTable"

export default function App() {
  const [region, setRegion] = useState("en_US")
  const [seed, setSeed] = useState("42")
  const [avgLikes, setAvgLikes] = useState(3.5)
  const [avgReviews, setAvgReviews] = useState(1.0)
  const [books, setBooks] = useState([])
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)

  const fetchBooks = async (reset = false) => {
    setLoading(true)
    const res = await axios.get(`${import.meta.env.VITE_API_URL}/books`, {
      params: { region, seed, avgLikes, avgReviews, page },
    })
    const newBooks = res.data
    setBooks((prev) => (reset ? newBooks : [...prev, ...newBooks]))
    setLoading(false)
  }

  useEffect(() => {
    setPage(1)
    fetchBooks(true)
  }, [region, seed, avgLikes, avgReviews])

  useEffect(() => {
    if (page !== 1) fetchBooks(false)
  }, [page])

  useEffect(() => {
    const handleScroll = () => {
      const bottom =
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 10
      if (bottom && !loading) {
        setPage((prev) => prev + 1)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [loading])

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Book Generator</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <RegionSelector value={region} onChange={setRegion} />
        <SeedInput value={seed} onChange={setSeed} />
        <LikesSlider value={avgLikes} onChange={setAvgLikes} />
        <ReviewsInput value={avgReviews} onChange={setAvgReviews} />
      </div>

      <BookTable books={books} />
    </div>
  )
}
