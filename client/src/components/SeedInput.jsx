export default function SeedInput({ value, onChange }) {
  const randomizeSeed = () => {
    const newSeed = Math.floor(Math.random() * 100000)
    onChange(newSeed.toString())
  }

  return (
    <div>
      <label className="block font-medium mb-1">Seed</label>
      <div className="flex">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-grow border rounded p-1"
        />
       </div>
    </div>
  )
}
