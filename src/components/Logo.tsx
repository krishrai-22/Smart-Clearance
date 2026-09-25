interface LogoProps {
  size?: number;
  showText?: boolean;
  textClass?: string;
  iconClass?: string;
}

export function Logo({ size = 36, showText = true, textClass = '', iconClass = '' }: LogoProps) {
  return (
    <div className={`flex items-center gap-3 select-none ${iconClass}`}>
      <div
        className="relative flex items-center justify-center rounded-xl overflow-hidden shadow-xs border border-blue-600/10 flex-shrink-0"
        style={{ width: size, height: size }}
      >
        <img
          src="/logo.png"
          alt="SmartClearance Logo"
          className="w-full h-full object-cover"
        />
      </div>

      {showText && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span className={`font-bold text-gray-900 tracking-tight leading-none ${textClass || 'text-lg'}`}>
              Smart<span className="text-blue-600">Clearance</span>
            </span>
          </div>
          <span className="text-[10px] uppercase font-semibold tracking-wider text-gray-400 leading-tight mt-0.5">
            Single Window Gateway
          </span>
        </div>
      )}
    </div>
  );
}

export function LogoMark({ size = 36 }: { size?: number }) {
  return <Logo size={size} showText={false} />;
}

