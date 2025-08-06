export default function ReviewsInput({ value, onChange }) {
  return (
    <div>
      <label className="block font-medium mb-1">Avg. Reviews</label>
      <input
        type="number"
        step="0.1"
        min="0"
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full border rounded p-2"
      />
    </div>
  )
}
