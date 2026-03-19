interface TrustScoreProps {
  company: string;
  score: number;
  maxScore?: number;
}

export default function TrustScore({
  company,
  score,
  maxScore = 10,
}: TrustScoreProps) {
  const pct = (score / maxScore) * 100;
  const color =
    score >= 8 ? "#22c55e" : score >= 6 ? "#2E75B6" : score >= 4 ? "#E8792F" : "#ef4444";

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex justify-between items-center mb-2">
        <h4 className="font-semibold text-[#1B2A4A]">{company}</h4>
        <span className="text-2xl font-bold" style={{ color }}>
          {score.toFixed(1)}
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div
          className="h-2.5 rounded-full transition-all"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
      <p className="text-xs text-gray-400 mt-1">out of {maxScore}</p>
    </div>
  );
}
