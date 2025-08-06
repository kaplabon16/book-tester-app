import { useState } from "react"

export default function BookTable({ books }) {
  const [expandedIndex, setExpandedIndex] = useState(null)

  const toggleExpand = (index) => {
    setExpandedIndex((prev) => (prev === index ? null : index))
  }

  return (
    <div className="overflow-y-auto max-h-[600px] border rounded">
      <table className="min-w-full table-auto">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-2">#</th>
            <th className="p-2">ISBN</th>
            <th className="p-2">Title</th>
            <th className="p-2">Author</th>
            <th className="p-2">Publisher</th>
          </tr>
        </thead>
        <tbody>
          {books.map((book) => (
            <FragmentWithDetails
              key={book.index}
              book={book}
              isExpanded={expandedIndex === book.index}
              onClick={() => toggleExpand(book.index)}
            />
          ))}
        </tbody>
      </table>
    </div>
  )
}

function FragmentWithDetails({ book, isExpanded, onClick }) {
  return (
    <>
      <tr
        className="border-t hover:bg-gray-50 cursor-pointer"
        onClick={onClick}
      >
        <td className="p-2">{book.index}</td>
        <td className="p-2">{book.isbn}</td>
        <td className="p-2">{book.title}</td>
        <td className="p-2">{book.author}</td>
        <td className="p-2">{book.publisher}</td>
      </tr>
      {isExpanded && (
        <tr className="bg-gray-50 border-b">
          <td colSpan="5" className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="w-40 h-60 bg-gradient-to-br from-purple-400 to-blue-500 text-white font-bold text-center p-2 flex items-center justify-center text-sm rounded shadow">
                <div>
                  <div className="mb-2">{book.title}</div>
                  <div className="text-xs font-normal">by {book.author}</div>
                </div>
              </div>

              <div className="flex-1">
                <h3 className="font-semibold text-lg mb-2">Reviews</h3>
                {book.reviews.length > 0 ? (
                  book.reviews.map((r, i) => (
                    <div key={i} className="mb-2">
                      <p className="text-sm italic">"{r.review}"</p>
                      <p className="text-xs text-gray-600">- {r.reviewer}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500 italic">No reviews</p>
                )}
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  )
}
