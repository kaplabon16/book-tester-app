export default function SeedInput({ value, onChange }) {
  const randomizeSeed = () => {
    const newSeed = Math.floor(Math.random() * 100000)
    onChange(newSeed.toString())
  }

  return (
    <div>
      <label className="block font-medium mb-1">Seed</label>
      <div className="grid grid-cols-1">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-grow border rounded p-2"
        />
        <button
          onClick={randomizeSeed}
          className="ml-2 bg-blue-500 text-white px-3 py-2 rounded"
        >
          Randomize Seed
        </button>
      </div>
    </div>
  )
}
