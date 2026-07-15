export default function DatosMarCards({ altura_ola, velocidad_viento, temp_mar }) {
  const datos = [
    { label: "Oleaje", valor: `${altura_ola} m` },
    { label: "Viento", valor: `${velocidad_viento} km/h` },
    { label: "Temp. mar", valor: `${temp_mar}°C` },
  ];

  return (
    <div className="grid grid-cols-3 gap-2 mb-4">
      {datos.map((d) => (
        <div key={d.label} className="bg-gray-50 rounded-lg p-2 text-center">
          <p className="text-xs text-gray-400">{d.label}</p>
          <p className="text-lg font-medium">{d.valor}</p>
        </div>
      ))}
    </div>
  );
}