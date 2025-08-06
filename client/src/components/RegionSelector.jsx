export default function RegionSelector({ value, onChange }) {
  return (
    <div>
      <label className="block font-medium mb-1">Language & Region</label>
      <select
        className="w-full border rounded p-2"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="en_US">English (USA)</option>
        <option value="de_DE">German (Germany)</option>
        <option value="fr_FR">French (France)</option>
        <option value="ja_JP">Japanese (Japan)</option>
      </select>
    </div>
  )
}
