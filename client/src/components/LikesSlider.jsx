export default function LikesSlider({ value, onChange }) {
  return (
    <div>
      <label className="block font-medium mb-1">
        Avg. Likes: {value.toFixed(1)}
      </label>
      <input
        type="range"
        min="0"
        max="10"
        step="0.1"
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full"
      />
    </div>
  )
}
