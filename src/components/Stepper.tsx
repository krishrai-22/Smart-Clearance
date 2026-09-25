import { Check, ChevronRight } from 'lucide-react';

interface StepperProps {
  steps: string[];
  currentStep: number;
}

export function Stepper({ steps, currentStep }: StepperProps) {
  return (
    <div className="flex items-center w-full overflow-x-auto scrollbar-thin pb-2">
      {steps.map((step, index) => {
        const isComplete = index < currentStep;
        const isCurrent = index === currentStep;
        return (
          <div key={step} className="flex items-center flex-shrink-0">
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={`flex items-center justify-center w-9 h-9 rounded-full text-sm font-semibold transition-all duration-300 ${
                  isComplete
                    ? 'bg-brand-600 text-white'
                    : isCurrent
                    ? 'bg-brand-100 text-brand-700 ring-2 ring-brand-500'
                    : 'bg-gray-100 text-gray-400'
                }`}
              >
                {isComplete ? <Check size={18} strokeWidth={3} /> : index + 1}
              </div>
              <span
                className={`text-xs font-medium whitespace-nowrap ${
                  isComplete || isCurrent ? 'text-gray-700' : 'text-gray-400'
                }`}
              >
                {step}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`h-0.5 w-12 sm:w-20 mx-1 transition-all duration-300 ${
                  isComplete ? 'bg-brand-600' : 'bg-gray-200'
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

export function ProgressBar({ value, colorClass = 'bg-brand-500' }: { value?: number; colorClass?: string }) {
  const safeValue = typeof value === 'number' && !Number.isNaN(value) ? Math.min(Math.max(value, 0), 100) : 0;
  return (
    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
      <div
        className={`h-full ${colorClass} rounded-full transition-all duration-1000 ease-out`}
        style={{ width: `${safeValue}%` }}
      />
    </div>
  );
}

export function Breadcrumb({ items }: { items: string[] }) {
  return (
    <nav className="flex items-center gap-1.5 text-sm text-gray-500">
      {items.map((item, index) => (
        <div key={item} className="flex items-center gap-1.5">
          {index > 0 && <ChevronRight size={14} className="text-gray-400" />}
          <span className={index === items.length - 1 ? 'text-gray-900 font-medium' : ''}>{item}</span>
        </div>
      ))}
    </nav>
  );
}
