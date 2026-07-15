export default function Header({ caleta, setCaleta }) {
  const caletas = ["Manta", "Jaramijó", "San Mateo"];

  return (
    <div className="flex justify-between items-center mb-4">
      <div>
        <p className="font-medium text-lg text-gray-900">Pescador inteligente</p>
        <p className="text-xs text-gray-400">
          {new Date().toLocaleDateString("es-EC", { day: "numeric", month: "long" })}
        </p>
      </div>
      <select
        value={caleta}
        onChange={(e) => setCaleta(e.target.value)}
        className="border border-gray-300 rounded-md text-sm px-2 py-1"
      >
        {caletas.map((c) => (
          <option key={c} value={c}>{c}</option>
        ))}
      </select>
    </div>
  );
}