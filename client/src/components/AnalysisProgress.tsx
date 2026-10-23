import React, { useEffect, useState } from 'react';
import { Loader2, ShieldCheck, Sparkles, CheckCircle2, Search, FileText } from 'lucide-react';

interface AnalysisProgressProps {
  onCancel?: () => void;
  attachedFileCount: number;
}

export const AnalysisProgress: React.FC<AnalysisProgressProps> = ({
  onCancel,
  attachedFileCount
}) => {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      title: 'Validating & Protecting Input',
      desc: attachedFileCount > 0
        ? `Sanitizing prompt and decoding ${attachedFileCount} attached file(s) in secure memory...`
        : 'Sanitizing text prompt and applying safety filters...',
      icon: ShieldCheck
    },
    {
      title: 'Gemini Multimodal Interpretation',
      desc: 'Invoking Google Gemini model for structured reasoning and factual extraction...',
      icon: Sparkles
    },
    {
      title: 'Cross-Referencing Authoritative Sources',
      desc: 'Verifying extracted facts against official portals (IMD, NDMA, MoHFW, India.gov)...',
      icon: Search
    },
    {
      title: 'Synthesizing Action Plan & Safety Guidance',
      desc: 'Ordering actionable steps by priority and formulating emergency escalations...',
      icon: CheckCircle2
    }
  ];

  useEffect(() => {
    const timer1 = setTimeout(() => setCurrentStep(1), 1200);
    const timer2 = setTimeout(() => setCurrentStep(2), 2600);
    const timer3 = setTimeout(() => setCurrentStep(3), 4200);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

  return (
    <div className="w-full max-w-xl mx-auto bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-card text-center animate-in fade-in duration-300 my-8">
      {/* Animated Spinner Icon */}
      <div className="relative w-16 h-16 mx-auto mb-5">
        <div className="absolute inset-0 rounded-full border-4 border-brand-100 animate-pulse" />
        <div className="w-16 h-16 rounded-full border-4 border-brand-600 border-t-transparent animate-spin flex items-center justify-center">
          <Sparkles className="w-6 h-6 text-brand-600 animate-bounce" />
        </div>
      </div>

      <h3 className="font-bold text-slate-900 text-lg sm:text-xl mb-1">
        Analyzing Situation with LifeBridge AI
      </h3>
      <p className="text-xs text-slate-500 mb-6">
        Processing in isolated server memory. Please hold on a moment...
      </p>

      {/* Steps List */}
      <div className="space-y-3 text-left mb-6 max-w-md mx-auto">
        {steps.map((step, idx) => {
          const StepIcon = step.icon;
          const isDone = currentStep > idx;
          const isCurrent = currentStep === idx;

          return (
            <div
              key={idx}
              className={`flex items-start gap-3 p-3 rounded-xl transition-all ${
                isCurrent
                  ? 'bg-brand-50/80 border border-brand-200 shadow-sm'
                  : isDone
                  ? 'bg-slate-50 border border-slate-150 opacity-90'
                  : 'bg-white border border-transparent opacity-40'
              }`}
            >
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 ${
                  isDone
                    ? 'bg-teal-600 text-white'
                    : isCurrent
                    ? 'bg-brand-600 text-white animate-pulse'
                    : 'bg-slate-200 text-slate-500'
                }`}
              >
                {isDone ? (
                  <CheckCircle2 className="w-4 h-4" />
                ) : (
                  <StepIcon className="w-4 h-4" />
                )}
              </div>

              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4
                    className={`text-xs font-bold ${
                      isCurrent ? 'text-brand-900' : isDone ? 'text-slate-800' : 'text-slate-500'
                    }`}
                  >
                    {step.title}
                  </h4>
                  {isCurrent && (
                    <span className="text-[10px] text-brand-700 font-semibold animate-pulse">
                      In progress...
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">{step.desc}</p>
              </div>
            </div>
          );
        })}
      </div>

      {onCancel && (
        <button
          type="button"
          onClick={onCancel}
          className="text-xs text-slate-500 hover:text-slate-800 underline transition-colors"
        >
          Cancel Analysis
        </button>
      )}
    </div>
  );
};
