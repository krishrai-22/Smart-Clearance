interface CircularProgressProps {
  value?: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
  sublabel?: string;
  colorClass?: string;
  trackClass?: string;
  showValue?: boolean;
}

export function CircularProgress({
  value = 0,
  size = 160,
  strokeWidth = 12,
  label,
  sublabel,
  colorClass = 'text-brand-500',
  trackClass = 'text-gray-200',
  showValue = true,
}: CircularProgressProps) {
  const safeValue = typeof value === 'number' && !Number.isNaN(value) ? Math.min(Math.max(value, 0), 100) : 0;
  const safeSize = typeof size === 'number' && !Number.isNaN(size) && size > 0 ? size : 160;
  const safeStrokeWidth = typeof strokeWidth === 'number' && !Number.isNaN(strokeWidth) && strokeWidth > 0 ? strokeWidth : 12;

  const radius = Math.max((safeSize - safeStrokeWidth) / 2, 0);
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (safeValue / 100) * circumference;

  const safeOffset = Number.isNaN(offset) ? 0 : offset;
  const safeCircumference = Number.isNaN(circumference) ? 0 : circumference;

  return (
    <div className="relative flex flex-col items-center justify-center" style={{ width: safeSize, height: safeSize }}>
      <svg width={safeSize} height={safeSize} className="-rotate-90">
        <circle
          cx={safeSize / 2}
          cy={safeSize / 2}
          r={radius}
          fill="none"
          strokeWidth={safeStrokeWidth}
          className={trackClass}
          stroke="currentColor"
        />
        <circle
          cx={safeSize / 2}
          cy={safeSize / 2}
          r={radius}
          fill="none"
          strokeWidth={safeStrokeWidth}
          strokeLinecap="round"
          className={colorClass}
          stroke="currentColor"
          strokeDasharray={safeCircumference}
          strokeDashoffset={safeOffset}
          style={{ transition: 'stroke-dashoffset 1s ease-out' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {showValue && (
          <span className="text-3xl font-bold text-gray-900">
            {safeValue}
            <span className="text-lg text-gray-500">%</span>
          </span>
        )}
        {label && <span className="text-xs font-medium text-gray-500 mt-0.5">{label}</span>}
        {sublabel && <span className="text-[10px] text-gray-400">{sublabel}</span>}
      </div>
    </div>
  );
}
