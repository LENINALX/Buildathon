export default function MejoresHorarios({ horarios }) {
  return (
    <div className="mb-4">
      <p className="text-sm font-medium text-gray-900 mb-2">Mejores horarios para salir</p>
      <div className="flex gap-2 flex-wrap">
        {horarios.map((h) => (
          <span key={h} className="bg-green-50 text-green-700 text-xs px-3 py-1 rounded-md">
            {h}
          </span>
        ))}
      </div>
    </div>
  );
}