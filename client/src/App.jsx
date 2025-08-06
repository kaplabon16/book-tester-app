import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import Papa from 'papaparse';

const PAGE_SIZE = 20;
const INCREMENT = 10;

export default function App() {
  const [books, setBooks] = useState([]);
  const [region, setRegion] = useState('en_US');
  const [seed, setSeed] = useState('1');
  const [avgLikes, setAvgLikes] = useState(0);
  const [avgReviews, setAvgReviews] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState('table');
  const [totalLoaded, setTotalLoaded] = useState(0);

  const containerRef = useRef(null);

  const fetchBooks = async (pageToLoad) => {
    setLoading(true);
    try {
      const res = await axios.get('https://book-tester-backend.onrender.com/books', {
        params: {
          region,
          seed,
          avgLikes,
          avgReviews,
          page: pageToLoad,
        },
      });
      const newBooks = res.data;

      setBooks((prev) => {
        return pageToLoad === 1 ? newBooks : [...prev, ...newBooks];
      });
      setTotalLoaded((prev) =>
        pageToLoad === 1 ? newBooks.length : prev + newBooks.length
      );
      setLoading(false);
    } catch (error) {
      console.error('Error loading books:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    setPage(1);
    fetchBooks(1);
  }, [region, seed, avgLikes, avgReviews]);

  useEffect(() => {
    const onScroll = () => {
      if (!containerRef.current) return;
      const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
      if (
        scrollTop + clientHeight >= scrollHeight - 100 &&
        !loading
      ) {
        const nextPage = page + 1;
        setPage(nextPage);
        fetchBooks(nextPage);
      }
    };
    const currentRef = containerRef.current;
    if (currentRef) {
      currentRef.addEventListener('scroll', onScroll);
    }
    return () => {
      if (currentRef) {
        currentRef.removeEventListener('scroll', onScroll);
      }
    };
  }, [page, loading]);

  const exportCSV = () => {
    if (books.length === 0) return;
    const csvData = books.map(({ index, isbn, title, author, publisher, likes, reviews }) => ({
      Index: index,
      ISBN: isbn,
      Title: title,
      Author: author,
      Publisher: publisher,
      Likes: likes,
      Reviews: reviews.map(r => `${r.reviewer}: ${r.text}`).join(' | '),
    }));
    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'books_export.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ maxWidth: 1000, margin: 'auto' }}>
      <h1>Book Tester App</h1>

      <div style={{ marginBottom: 20 }}>
        <label>
          Region:{' '}
          <select value={region} onChange={(e) => setRegion(e.target.value)}>
            <option value="en_US">English (USA)</option>
            <option value="fr_FR">French (France)</option>
            <option value="de_DE">German (Germany)</option>
            <option value="ja_JP">Japanese (Japan)</option>
          </select>
        </label>{' '}

        <label>
          Seed:{' '}
          <input
            type="number"
            value={seed}
            onChange={(e) => setSeed(e.target.value)}
            min="1"
          />
        </label>{' '}

        <label>
          Avg Likes:{' '}
          <input
            type="number"
            step="0.1"
            min="0"
            max="10"
            value={avgLikes}
            onChange={(e) => setAvgLikes(parseFloat(e.target.value))}
          />
        </label>{' '}

        <label>
          Avg Reviews:{' '}
          <input
            type="number"
            step="0.1"
            min="0"
            max="10"
            value={avgReviews}
            onChange={(e) => setAvgReviews(parseFloat(e.target.value))}
          />
        </label>{' '}

        <button onClick={() => setSeed(String(Math.floor(Math.random() * 1000000)))}>
          Random Seed 🔀
        </button>{' '}

        <button onClick={exportCSV} disabled={books.length === 0}>
          Export CSV
        </button>{' '}

        <button onClick={() => setView(view === 'table' ? 'gallery' : 'table')}>
          Switch to {view === 'table' ? 'Gallery' : 'Table'} View
        </button>
      </div>

      <div
        ref={containerRef}
        style={{ height: 600, overflowY: 'auto', border: '1px solid #ccc', padding: 10 }}
      >
        {view === 'table' ? (
          <table width="100%" border="1" cellPadding="5" cellSpacing="0">
            <thead>
              <tr>
                <th>#</th>
                <th>ISBN</th>
                <th>Title</th>
                <th>Author(s)</th>
                <th>Publisher</th>
                <th>Likes</th>
                <th>Reviews</th>
              </tr>
            </thead>
            <tbody>
              {books.map((book) => (
                <tr
                  key={book.index}
                  style={{ cursor: 'pointer' }}
                  onClick={() => alert(JSON.stringify(book.reviews, null, 2))}
                >
                  <td>{book.index}</td>
                  <td>{book.isbn}</td>
                  <td>{book.title}</td>
                  <td>{book.author}</td>
                  <td>{book.publisher}</td>
                  <td>{book.likes}</td>
                  <td>{book.reviews.length}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
            {books.map((book) => (
              <div
                key={book.index}
                style={{
                  border: '1px solid #ccc',
                  borderRadius: 4,
                  padding: 10,
                  width: 150,
                  cursor: 'pointer',
                }}
                onClick={() => alert(`Title: ${book.title}\nAuthor: ${book.author}\nReviews: ${book.reviews.length}`)}
              >
                <img
                  src={book.coverImage}
                  alt={book.title}
                  style={{ width: '100%', height: 200, objectFit: 'cover', marginBottom: 8 }}
                />
                <div><strong>{book.title}</strong></div>
                <div style={{ fontSize: 12 }}>{book.author}</div>
                <div>Likes: {book.likes}</div>
                <div>Reviews: {book.reviews.length}</div>
              </div>
            ))}
          </div>
        )}
        {loading && <p>Loading more books...</p>}
      </div>
    </div>
  );
}
