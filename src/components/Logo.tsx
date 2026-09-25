interface LogoProps {
  size?: number;
  showText?: boolean;
  textClass?: string;
  iconClass?: string;
}

export function Logo({ size = 36, iconClass = '' }: LogoProps) {
  return (
    <div className={`flex items-center ${iconClass}`}>
      <img
        src="/logo.jpeg"
        alt="SmartClearance"
        className="h-auto w-auto max-w-full object-contain"
        style={{ height: size }}
      />
    </div>
  );
}

export function LogoMark({ size = 36 }: { size?: number }) {
  return <Logo size={size} />;
}
