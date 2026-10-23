import React from 'react';
import {
  X,
  Settings,
  Shield,
  Eye,
  Type,
  Globe,
  Cpu,
  Trash2,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { AppConfig } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: AppConfig | null;
  currentLanguage: string;
  onLanguageChange: (lang: string) => void;
  highContrast: boolean;
  setHighContrast: (val: boolean) => void;
  fontSize: 'standard' | 'large' | 'extralarge';
  setFontSize: (val: 'standard' | 'large' | 'extralarge') => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  config,
  currentLanguage,
  onLanguageChange,
  highContrast,
  setHighContrast,
  fontSize,
  setFontSize
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Platform Settings</h3>
              <p className="text-xs text-slate-500">Preferences, privacy & intelligence engine</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-5 text-xs text-slate-700">
          {/* Intelligence Engine Status */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-slate-900 flex items-center gap-1.5">
                <Cpu className="w-4 h-4 text-brand-600" />
                AI Engine & Provider Status
              </span>
              {config?.isGeminiConfigured ? (
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  Live Gemini API
                </span>
              ) : (
                <span className="text-[10px] font-bold text-brand-700 bg-brand-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Cpu className="w-3 h-3" />
                  Demo Engine
                </span>
              )}
            </div>

            <div className="text-[11px] text-slate-600 space-y-1">
              <p>Model: <strong className="text-slate-900">{config?.model || 'gemini-2.5-flash'}</strong></p>
              <p>Multimodal Support: <strong>Text, Images, Voice Audio, PDFs</strong></p>
              {!config?.isGeminiConfigured && (
                <p className="text-brand-800 bg-brand-50/80 p-2 rounded-lg border border-brand-200/60 mt-2">
                  <strong>Hackathon Demo Engine Active:</strong> Full end-to-end evaluation with verified sources. Provide <code>GEMINI_API_KEY</code> in <code>server/.env</code> to unlock live model queries.
                </p>
              )}
            </div>
          </div>

          {/* Language Preference */}
          <div>
            <label className="font-bold text-slate-900 block mb-2 flex items-center gap-1.5">
              <Globe className="w-4 h-4 text-slate-500" />
              Primary Interface & Response Language
            </label>
            <select
              value={currentLanguage}
              onChange={(e) => onLanguageChange(e.target.value)}
              className="w-full text-xs font-semibold p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-brand-500"
            >
              <option value="en">English (Default)</option>
              <option value="hi">हिन्दी (Hindi)</option>
              <option value="mr">मराठी (Marathi)</option>
              <option value="bn">বাংলা (Bengali)</option>
              <option value="ta">தமிழ் (Tamil)</option>
              <option value="te">తెలుగు (Telugu)</option>
              <option value="gu">ગુજરાતી (Gujarati)</option>
            </select>
          </div>

          {/* Accessibility Options */}
          <div>
            <h4 className="font-bold text-slate-900 mb-2 flex items-center gap-1.5">
              <Eye className="w-4 h-4 text-slate-500" />
              Accessibility & Visual Display
            </h4>
            <div className="space-y-3">
              <label className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer">
                <div>
                  <span className="font-semibold text-slate-800">High Contrast Mode</span>
                  <p className="text-[11px] text-slate-500">Enhance contrast for readability in direct sunlight or impaired vision</p>
                </div>
                <input
                  type="checkbox"
                  checked={highContrast}
                  onChange={(e) => setHighContrast(e.target.checked)}
                  className="w-4 h-4 text-brand-600 rounded"
                />
              </label>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-slate-800">Typography Scaling</span>
                  <Type className="w-4 h-4 text-slate-400" />
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {(['standard', 'large', 'extralarge'] as const).map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setFontSize(size)}
                      className={`py-1.5 rounded-lg font-semibold text-[11px] capitalize border transition-all ${
                        fontSize === size
                          ? 'bg-slate-900 text-white border-slate-900'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Privacy & Ephemeral Data Control */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
            <h4 className="font-bold text-slate-900 mb-1 flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-brand-600" />
              Privacy & Zero-Retention Architecture
            </h4>
            <p className="text-[11px] text-slate-600 leading-relaxed mb-3">
              All files are stored only in RAM during request processing and deleted immediately afterwards. LifeBridge AI does not build persistent profiles or sell personal data.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-slate-100 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs rounded-xl transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
