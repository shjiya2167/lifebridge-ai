import React from 'react';
import { X, ExternalLink, ShieldCheck, Clock, MapPin, AlertCircle, CheckCircle2 } from 'lucide-react';
import { VerifiedSource } from '../types';
import { formatDate } from '../lib/utils';

interface VerifiedSourcesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  sources: VerifiedSource[];
}

export const VerifiedSourcesDrawer: React.FC<VerifiedSourcesDrawerProps> = ({
  isOpen,
  onClose,
  sources
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Verified Authoritative Sources</h3>
              <p className="text-xs text-slate-500">
                {sources.length} official source{sources.length === 1 ? '' : 's'} cross-referenced by LifeBridge AI
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Sources List */}
        <div className="p-5 overflow-y-auto space-y-4">
          {sources.map((source, index) => (
            <div
              key={index}
              className="bg-slate-50 border border-slate-200 rounded-xl p-4 hover:border-brand-300 transition-colors"
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700 bg-teal-100/70 px-2 py-0.5 rounded">
                    {source.publisher}
                  </span>
                  <h4 className="font-semibold text-slate-900 text-sm mt-1">
                    {source.sourceTitle}
                  </h4>
                </div>
                <a
                  href={source.originalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-brand-600 hover:text-brand-800 font-medium bg-white border border-slate-200 px-2.5 py-1 rounded-lg hover:border-brand-300 transition-colors shadow-subtle flex-shrink-0"
                >
                  <span>Visit Portal</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              {/* Claim Supported */}
              <div className="text-xs text-slate-700 bg-white border border-slate-150 p-2.5 rounded-lg mb-2.5">
                <p className="font-semibold text-slate-900 text-[11px] mb-0.5 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />
                  What this source verifies:
                </p>
                <p>{source.claimSupported}</p>
              </div>

              {/* Metadata Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-500 pt-2 border-t border-slate-200/60">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>Coverage: <strong>{source.geographicCoverage}</strong></span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>Retrieved: {formatDate(source.retrievalTimestamp)}</span>
                </div>
              </div>

              {/* Verification Limitations */}
              {source.verificationLimitations && (
                <div className="mt-2.5 flex items-start gap-1.5 text-[11px] text-amber-700 bg-amber-50/70 p-2 rounded-lg border border-amber-200/50">
                  <AlertCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5 text-amber-600" />
                  <p><strong>Limitation:</strong> {source.verificationLimitations}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 rounded-b-2xl">
          <p>Links lead directly to official government or regulatory domains.</p>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white font-medium rounded-xl transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
