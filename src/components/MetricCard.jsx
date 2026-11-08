export default function MetricCard({ titulo, valor, nota }) {
  return (
    <div className="border border-neutral-200 rounded-xl p-4">
      <p className="text-xs text-neutral-500">{titulo}</p>
      <p className="text-2xl font-semibold">{valor}</p>
      {nota && <p className="text-xs text-neutral-500 mt-1">{nota}</p>}
    </div>
  );
}
