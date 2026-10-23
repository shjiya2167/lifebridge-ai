import React, { useState } from 'react';
import {
  CheckCircle2,
  AlertTriangle,
  Clock,
  ExternalLink,
  Phone,
  Copy,
  Printer,
  RotateCcw,
  ShieldAlert,
  Info,
  Check,
  Building,
  HeartPulse,
  Car,
  CloudRain,
  Landmark,
  HelpCircle,
  FileSearch,
  Sparkles
} from 'lucide-react';
import { GeminiStructuredResponse, ActionItem, PublicResource } from '../types';
import {
  getUrgencyConfig,
  getCategoryConfig,
  getVerificationStatusConfig
} from '../lib/utils';
import { VerifiedSourcesDrawer } from './VerifiedSourcesDrawer';
import { getTranslation } from '../lib/translations';

interface ResultsDashboardProps {
  analysis: GeminiStructuredResponse;
  onReset: () => void;
  currentLanguage: string;
}

export const ResultsDashboard: React.FC<ResultsDashboardProps> = ({
  analysis,
  onReset,
  currentLanguage
}) => {
  const [completedActions, setCompletedActions] = useState<Record<number, boolean>>({});
  const [isCopied, setIsCopied] = useState(false);
  const [isSourcesDrawerOpen, setIsSourcesDrawerOpen] = useState(false);

  const t = getTranslation(currentLanguage);
  const urgencyConfig = getUrgencyConfig(analysis.urgency);
  const categoryConfig = getCategoryConfig(analysis.category);
  const verificationConfig = getVerificationStatusConfig(analysis.verificationStatus);

  const toggleAction = (index: number) => {
    setCompletedActions((prev) => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const copyActionPlan = () => {
    const textPlan = `LifeBridge AI Action Plan [${urgencyConfig.label.toUpperCase()}]
Summary: ${analysis.summary}

Prioritized Actions:
${analysis.actions
  .map(
    (a, i) =>
      `${i + 1}. [Priority ${a.priority}] ${a.title}\n   - ${a.description}\n   - Why: ${a.reason}`
  )
  .join('\n\n')}

Official Resources:
${analysis.resources.map((r) => `- ${r.name} (${r.contact || r.url || 'Official'})`).join('\n')}
`;
    navigator.clipboard.writeText(textPlan);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Top Banner & Control Actions */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm no-print">
        <div className="flex items-center gap-2">
          <span
            className={`text-xs font-bold px-3 py-1.5 rounded-xl border flex items-center gap-1.5 ${urgencyConfig.badgeClass}`}
          >
            <span>{urgencyConfig.icon}</span>
            <span>{urgencyConfig.label}</span>
          </span>

          <span
            className={`text-xs font-medium px-2.5 py-1 rounded-lg border ${categoryConfig.color}`}
          >
            {categoryConfig.label}
          </span>

          {analysis.isSimulated && (
            <span className="text-[11px] font-semibold text-brand-700 bg-brand-50 border border-brand-200 px-2 py-0.5 rounded-md flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-brand-600" />
              Demo Engine
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={copyActionPlan}
            className="flex items-center gap-1.5 text-xs text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg transition-colors"
          >
            {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{isCopied ? t.copied : t.copyPlan}</span>
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="flex items-center gap-1.5 text-xs text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>{t.printPlan}</span>
          </button>

          <button
            type="button"
            onClick={onReset}
            className="flex items-center gap-1.5 text-xs text-white bg-slate-800 hover:bg-slate-900 px-3.5 py-1.5 rounded-lg transition-colors font-medium shadow-sm"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{t.newInquiry}</span>
          </button>
        </div>
      </div>

      {/* Emergency Guidance Alert if Urgency is Emergency or Urgent */}
      {(analysis.urgency === 'emergency' || analysis.urgency === 'urgent') && (
        <div className="bg-red-500 text-white rounded-2xl p-5 shadow-lg border-2 border-red-600 animate-in fade-in">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <ShieldAlert className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-lg leading-tight">
                  High-Priority Emergency Protocol Active
                </h3>
                <p className="text-xs text-red-100 mt-1 max-w-xl">
                  {analysis.urgency === 'emergency'
                    ? 'Immediate life threat or urgent safety intervention detected. Contact emergency dispatchers without delay.'
                    : 'Time-sensitive situation detected. Please follow prioritized safety actions immediately.'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 w-full sm:w-auto">
              <a
                href="tel:112"
                className="flex-1 sm:flex-initial flex items-center justify-center gap-2 bg-white text-red-600 hover:bg-red-50 font-bold text-sm px-5 py-3 rounded-xl shadow-md transition-all active:scale-95"
              >
                <Phone className="w-4 h-4 fill-red-600" />
                <span>Call 112 (Emergency)</span>
              </a>
              <a
                href="tel:108"
                className="flex-1 sm:flex-initial flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white border border-white/30 font-semibold text-sm px-4 py-3 rounded-xl transition-all"
              >
                <Phone className="w-4 h-4" />
                <span>108 (Ambulance)</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Primary Summary Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-card">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
          Situation Summary
        </h2>
        <p className="text-base sm:text-lg font-medium text-slate-800 leading-relaxed">
          {analysis.summary}
        </p>

        {/* Confidence & Verification Status Bar */}
        <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-500 font-medium">Verification Status:</span>
            <button
              type="button"
              onClick={() => setIsSourcesDrawerOpen(true)}
              className={`font-semibold px-2.5 py-1 rounded-md border flex items-center gap-1.5 transition-colors hover:opacity-90 ${verificationConfig.badgeClass}`}
            >
              <span>{verificationConfig.label}</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>

          {analysis.confidenceExplanation && (
            <p className="text-[11px] text-slate-500 max-w-md italic">
              {analysis.confidenceExplanation}
            </p>
          )}
        </div>
      </div>

      {/* Extracted Key Facts & Corroboration */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-card">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <FileSearch className="w-5 h-5 text-brand-600" />
            <h3 className="font-bold text-slate-900 text-base">{t.keyFactsTitle}</h3>
          </div>
          <span className="text-xs text-slate-400 font-medium">
            {analysis.keyFacts.length} key facts extracted
          </span>
        </div>

        <div className="space-y-2.5">
          {analysis.keyFacts.map((fact, index) => (
            <div
              key={index}
              className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-150 text-sm text-slate-800"
            >
              <div className="w-5 h-5 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                {index + 1}
              </div>
              <div className="flex-1">
                <p className="leading-snug">{fact}</p>
              </div>
              <span className="text-[10px] font-semibold text-teal-700 bg-teal-100/60 px-2 py-0.5 rounded-full flex-shrink-0">
                Corroborated
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Prioritized Action Plan */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-card">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-teal-600" />
            <h3 className="font-bold text-slate-900 text-base">{t.actionPlanTitle}</h3>
          </div>
          <span className="text-xs text-slate-400">
            Ordered by priority and impact
          </span>
        </div>

        <div className="space-y-3.5">
          {analysis.actions.map((action, index) => {
            const isDone = !!completedActions[index];
            const isPriority1 = action.priority === 1;

            return (
              <div
                key={index}
                className={`rounded-2xl border p-4 sm:p-5 transition-all ${
                  isDone
                    ? 'bg-slate-50 border-slate-200 opacity-60'
                    : isPriority1
                    ? 'bg-amber-50/40 border-amber-300 shadow-sm'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-start gap-3 sm:gap-4">
                  {/* Action Checkbox */}
                  <button
                    type="button"
                    onClick={() => toggleAction(index)}
                    className={`w-6 h-6 rounded-lg border flex items-center justify-center transition-all flex-shrink-0 mt-0.5 ${
                      isDone
                        ? 'bg-teal-600 border-teal-600 text-white'
                        : 'border-slate-300 hover:border-teal-500 bg-white'
                    }`}
                    aria-label="Toggle action completion"
                  >
                    {isDone && <Check className="w-4 h-4 stroke-[3]" />}
                  </button>

                  <div className="flex-1 space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                          isPriority1
                            ? 'bg-red-100 text-red-800 border border-red-200'
                            : action.priority === 2
                            ? 'bg-orange-100 text-orange-800 border border-orange-200'
                            : 'bg-blue-100 text-blue-800 border border-blue-200'
                        }`}
                      >
                        Priority {action.priority}
                      </span>

                      {action.humanConfirmationRequired && (
                        <span className="text-[10px] font-medium text-amber-800 bg-amber-100 px-2 py-0.5 rounded-md flex items-center gap-1">
                          <AlertTriangle className="w-2.5 h-2.5" />
                          Human confirmation required
                        </span>
                      )}

                      <h4
                        className={`font-bold text-sm sm:text-base ${
                          isDone ? 'line-through text-slate-500' : 'text-slate-900'
                        }`}
                      >
                        {action.title}
                      </h4>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                      {action.description}
                    </p>

                    {/* Why this matters */}
                    <div className="text-xs text-slate-500 bg-slate-50 p-2.5 rounded-xl border border-slate-100 flex items-start gap-1.5">
                      <Info className="w-3.5 h-3.5 text-brand-600 flex-shrink-0 mt-0.5" />
                      <span>
                        <strong className="text-slate-700">{t.whyThisMatters}:</strong>{' '}
                        {action.reason}
                      </span>
                    </div>

                    {/* Source link if available */}
                    {action.relevantSourceUrl && (
                      <div className="pt-1">
                        <a
                          href={action.relevantSourceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] font-semibold text-brand-600 hover:text-brand-800"
                        >
                          <span>Official Portal Reference</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Official Verified Sources & Public Helplines Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Verified Sources Preview Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-card flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-600" />
                <span>{t.verifiedSourcesTitle}</span>
              </h3>
              <span className="text-xs text-teal-700 bg-teal-50 px-2 py-0.5 rounded font-medium">
                {analysis.verifiedSources?.length || 0} citations
              </span>
            </div>

            <p className="text-xs text-slate-500 mb-3">
              Corroborated through verified government registries and safety directives.
            </p>

            <div className="space-y-2">
              {(analysis.verifiedSources || []).slice(0, 2).map((s, idx) => (
                <div key={idx} className="bg-slate-50 p-2.5 rounded-xl border border-slate-150 text-xs">
                  <p className="font-bold text-slate-800 truncate">{s.publisher}</p>
                  <p className="text-slate-500 text-[11px] line-clamp-1">{s.sourceTitle}</p>
                </div>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsSourcesDrawerOpen(true)}
            className="mt-4 w-full text-xs font-semibold text-brand-700 hover:text-brand-800 bg-brand-50 hover:bg-brand-100/70 border border-brand-200 py-2.5 rounded-xl transition-colors text-center"
          >
            Inspect Source Provenance & Citations
          </button>
        </div>

        {/* Public Resources & Emergency Lines */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-card">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Building className="w-4 h-4 text-blue-600" />
              <span>{t.officialResourcesTitle}</span>
            </h3>
            <span className="text-xs text-slate-400">Official</span>
          </div>

          <div className="space-y-2.5">
            {analysis.resources.map((resource, i) => (
              <div
                key={i}
                className="bg-slate-50 p-3 rounded-xl border border-slate-150 flex items-center justify-between gap-3 text-xs"
              >
                <div>
                  <p className="font-semibold text-slate-800">{resource.name}</p>
                  <p className="text-slate-500 text-[11px]">{resource.notes || resource.category}</p>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  {resource.contact && (
                    <a
                      href={`tel:${resource.contact.split(' ')[0]}`}
                      className="flex items-center gap-1 font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-lg hover:bg-emerald-100 transition-colors"
                    >
                      <Phone className="w-3 h-3" />
                      <span>{resource.contact}</span>
                    </a>
                  )}
                  {resource.url && (
                    <a
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 text-slate-500 hover:text-slate-800 bg-white border border-slate-200 rounded-lg hover:border-slate-300 transition-colors"
                      title="Open portal"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Missing Information & Safety Warnings */}
      {(analysis.missingInformation.length > 0 || analysis.warnings.length > 0) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {analysis.missingInformation.length > 0 && (
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-card">
              <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4 text-amber-500" />
                <span>{t.missingInfoTitle}</span>
              </h4>
              <ul className="list-disc list-inside space-y-1.5 text-xs text-slate-600">
                {analysis.missingInformation.map((info, idx) => (
                  <li key={idx} className="leading-snug">{info}</li>
                ))}
              </ul>
            </div>
          )}

          {analysis.warnings.length > 0 && (
            <div className="bg-amber-50/60 rounded-2xl border border-amber-200 p-5 shadow-card">
              <h4 className="font-bold text-amber-900 text-xs uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span>{t.warningsTitle}</span>
              </h4>
              <ul className="list-disc list-inside space-y-1.5 text-xs text-amber-800">
                {analysis.warnings.map((warn, idx) => (
                  <li key={idx} className="leading-snug">{warn}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Mandatory Medical Disclaimer if present */}
      {analysis.medicalDisclaimer && (
        <div className="bg-slate-100 border border-slate-200 rounded-2xl p-4 text-xs text-slate-600">
          <p className="font-bold text-slate-800 mb-1 flex items-center gap-1.5">
            <HeartPulse className="w-4 h-4 text-rose-600" />
            <span>{t.medicalDisclaimerTitle}</span>
          </p>
          <p className="leading-relaxed">{analysis.medicalDisclaimer}</p>
        </div>
      )}

      {/* Verified Sources Detail Drawer Modal */}
      <VerifiedSourcesDrawer
        isOpen={isSourcesDrawerOpen}
        onClose={() => setIsSourcesDrawerOpen(false)}
        sources={analysis.verifiedSources || []}
      />
    </div>
  );
};
