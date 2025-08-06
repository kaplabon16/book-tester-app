import { useEffect, useState } from "react";
import axios from "axios";
import BookTable from "./components/BookTable";

const API_BASE = import.meta.env.VITE_API_URL;

export default function App() {
  const [books, setBooks] = useState([]);
  const [region, setRegion] = useState("en_US");
  const [seed, setSeed] = useState("1");
  const [avgLikes, setAvgLikes] = useState(3);
  const [avgReviews, setAvgReviews] = useState(1);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const regionOptions = [
    { label: "English (USA)", value: "en_US" },
    { label: "German (Germany)", value: "de_DE" },
    { label: "French (France)", value: "fr_FR" },
    { label: "Japanese (Japan)", value: "ja_JP" },
  ];

  const fetchBooks = async (reset = false) => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/books`, {
        params: {
          region,
          seed,
          avgLikes,
          avgReviews,
          page: reset ? 1 : page,
        },
      });

      const data = res.data;
      if (reset) {
        setBooks(data);
        setPage(2);
      } else {
        setBooks((prev) => [...prev, ...data]);
        setPage((prev) => prev + 1);
      }
    } catch (err) {
      console.error("Error loading books:", err);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchBooks(true);
  }, [region, seed, avgLikes, avgReviews]);

  // Infinite scroll
  const handleScroll = (e) => {
    const bottom =
      e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight;
    if (bottom && !loading) {
      fetchBooks();
    }
  };

  const generateRandomSeed = () => {
    const random = Math.floor(Math.random() * 1000000).toString();
    setSeed(random);
  };

  return (
    <div
      className="p-4 max-w-6xl mx-auto h-screen overflow-y-auto"
      onScroll={handleScroll}
    >
      <h1 className="text-2xl font-bold mb-4 text-center">
        📚 Book Tester App
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div>
          <label className="block mb-1 font-medium">Language/Region</label>
          <select
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            className="w-full border p-2 rounded"
          >
            {regionOptions.map((r) => (
              <option key={r.value} value={r.value}>
                {r.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1 font-medium">Seed</label>
          <input
            type="text"
            value={seed}
            onChange={(e) => setSeed(e.target.value)}
            className="w-full border p-2 rounded"
          />
          <button
            onClick={generateRandomSeed}
            className="mt-1 text-sm text-blue-500 underline"
          >
            🔀 Random
          </button>
        </div>

        <div>
          <label className="block mb-1 font-medium">
            Avg Likes (0 - 10)
          </label>
          <input
            type="range"
            min="0"
            max="10"
            step="0.1"
            value={avgLikes}
            onChange={(e) => setAvgLikes(parseFloat(e.target.value))}
            className="w-full"
          />
          <div className="text-sm text-center">{avgLikes.toFixed(1)}</div>
        </div>

        <div>
          <label className="block mb-1 font-medium">
            Avg Reviews (0 - 10)
          </label>
          <input
            type="number"
            min="0"
            max="10"
            step="0.1"
            value={avgReviews}
            onChange={(e) => setAvgReviews(parseFloat(e.target.value))}
            className="w-full border p-2 rounded"
          />
        </div>
      </div>

      <BookTable books={books} />

      {loading && (
        <div className="text-center py-4 text-blue-500 animate-pulse">
          Loading more books...
        </div>
      )}
    </div>
  );
}
