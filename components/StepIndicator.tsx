'use client';

interface StepIndicatorProps {
  currentStep: 1 | 2 | 3;
}

const steps = [
  { num: 1, label: '議事録の入力' },
  { num: 2, label: '確認・編集' },
  { num: 3, label: 'カンバンボード' },
];

export default function StepIndicator({ currentStep }: StepIndicatorProps) {
  return (
    <div className="flex items-center justify-center gap-0 w-full max-w-lg mx-auto">
      {steps.map((step, i) => {
        const isDone = step.num < currentStep;
        const isActive = step.num === currentStep;
        return (
          <div key={step.num} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-colors
                  ${isDone ? 'bg-blue-500 border-blue-500 text-white' : ''}
                  ${isActive ? 'bg-blue-600 border-blue-600 text-white ring-4 ring-blue-600/20' : ''}
                  ${!isDone && !isActive ? 'bg-slate-800 border-slate-600 text-slate-400' : ''}
                `}
              >
                {isDone ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  step.num
                )}
              </div>
              <span
                className={`mt-1.5 text-xs font-medium whitespace-nowrap
                  ${isActive ? 'text-blue-400' : isDone ? 'text-blue-500' : 'text-slate-500'}
                `}
              >
                {step.label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div
                className={`h-0.5 w-16 mx-1 mb-5 transition-colors ${
                  step.num < currentStep ? 'bg-blue-500' : 'bg-slate-700'
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
