export default function RecomendacionCard({ titulo, texto }) {
  return (
    <div className="bg-gray-50 border border-gray-200 rounded-xl p-3 mb-2.5">
      <p className="text-xs font-medium text-gray-500 mb-1">{titulo}</p>
      <p className="text-sm text-gray-900 leading-relaxed">{texto}</p>
    </div>
  );
}