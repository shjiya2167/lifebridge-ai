import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { EmergencyBanner } from './components/EmergencyBanner';
import { UniversalInput } from './components/UniversalInput';
import { ResultsDashboard } from './components/ResultsDashboard';
import { AnalysisProgress } from './components/AnalysisProgress';
import { ResourceDirectory } from './components/ResourceDirectory';
import { HistoryView } from './components/HistoryView';
import { AboutSafetyView } from './components/AboutSafetyView';
import { SettingsModal } from './components/SettingsModal';
import { AppConfig, GeminiStructuredResponse } from './types';
import { fetchAppConfig, submitAnalysis } from './lib/api';
import { getTranslation } from './lib/translations';
import { AlertCircle, RotateCcw, Shield, Sparkles } from 'lucide-react';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'home' | 'resources' | 'history' | 'about'>('home');
  const [config, setConfig] = useState<AppConfig | null>(null);
  const [currentLanguage, setCurrentLanguage] = useState<string>('en');
  const [analysisResult, setAnalysisResult] = useState<GeminiStructuredResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [highContrast, setHighContrast] = useState<boolean>(false);
  const [fontSize, setFontSize] = useState<'standard' | 'large' | 'extralarge'>('standard');
  const [attachedCount, setAttachedCount] = useState<number>(0);

  const t = getTranslation(currentLanguage);

  useEffect(() => {
    loadConfiguration();
  }, []);

  const loadConfiguration = async () => {
    try {
      const data = await fetchAppConfig();
      setConfig(data);
    } catch (err) {
      console.warn('Could not load config from server; using defaults:', err);
    }
  };

  const handleAnalyze = async (
    text: string,
    files: File[],
    categoryHint?: string,
    demoScenarioId?: string
  ) => {
    setIsLoading(true);
    setAnalysisError(null);
    setAttachedCount(files.length);

    try {
      const formData = new FormData();
      if (text) formData.append('text', text);
      if (currentLanguage) formData.append('language', currentLanguage);
      if (categoryHint) formData.append('categoryHint', categoryHint);
      if (demoScenarioId) formData.append('demoScenarioId', demoScenarioId);

      for (const file of files) {
        formData.append('files', file);
      }

      const res = await submitAnalysis(formData);
      setAnalysisResult(res.analysis);
      setActiveTab('home');
    } catch (err: any) {
      console.error('Analysis failed:', err);
      setAnalysisError(err.message || 'An unexpected error occurred during analysis.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setAnalysisResult(null);
    setAnalysisError(null);
  };

  const handleSelectHistorySession = async (id: string) => {
    try {
      const res = await fetch(`/api/history/${id}`);
      if (res.ok) {
        const data = await res.json();
        if (data.session?.analysis) {
          setAnalysisResult(data.session.analysis);
          setActiveTab('home');
        }
      }
    } catch (err) {
      console.error('Failed to load session details:', err);
    }
  };

  const fontClass =
    fontSize === 'extralarge' ? 'text-lg' : fontSize === 'large' ? 'text-base' : 'text-sm';

  return (
    <div
      className={`min-h-screen flex flex-col bg-slate-50 text-slate-900 ${
        highContrast ? 'high-contrast' : ''
      } ${fontClass}`}
    >
      {/* Persistent Emergency Quick Bar */}
      <EmergencyBanner currentLanguage={currentLanguage} />

      {/* Main Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentLanguage={currentLanguage}
        onLanguageChange={setCurrentLanguage}
        onOpenSettings={() => setIsSettingsOpen(true)}
        isLiveGemini={!!config?.isGeminiConfigured}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-10">
        {activeTab === 'home' && (
          <>
            {isLoading ? (
              <AnalysisProgress
                onCancel={() => setIsLoading(false)}
                attachedFileCount={attachedCount}
              />
            ) : analysisResult ? (
              <ResultsDashboard
                analysis={analysisResult}
                onReset={handleReset}
                currentLanguage={currentLanguage}
              />
            ) : (
              <div className="space-y-8">
                {/* Hero Introduction */}
                <div className="text-center max-w-2xl mx-auto space-y-3 pt-2 sm:pt-4">
                  <div className="inline-flex items-center gap-1.5 bg-brand-50 border border-brand-200/80 text-brand-800 text-xs font-bold px-3 py-1 rounded-full shadow-subtle">
                    <Sparkles className="w-3.5 h-3.5 text-brand-600" />
                    <span>Google Gemini Powered Decision Support</span>
                  </div>
                  <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
                    Translate Messy Crises into{' '}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 via-teal-600 to-sky-600">
                      Clear Action.
                    </span>
                  </h1>
                  <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-xl mx-auto">
                    Type naturally, speak a voice note, or drop confusing medical reports, disaster notices, and accident photos. LifeBridge AI synthesizes verified, prioritized next steps.
                  </p>
                </div>

                {/* Error Banner if analysis failed */}
                {analysisError && (
                  <div className="max-w-2xl mx-auto bg-red-50 border border-red-200 rounded-2xl p-4 text-red-700 text-xs flex items-center justify-between gap-3 shadow-subtle">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-600" />
                      <span>{analysisError}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setAnalysisError(null)}
                      className="px-2.5 py-1 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
                    >
                      Dismiss
                    </button>
                  </div>
                )}

                {/* Universal Central Input Workspace */}
                <UniversalInput
                  onSubmit={handleAnalyze}
                  isLoading={isLoading}
                  demoScenarios={config?.demoScenarios || []}
                  currentLanguage={currentLanguage}
                />
              </div>
            )}
          </>
        )}

        {activeTab === 'resources' && <ResourceDirectory />}
        {activeTab === 'history' && <HistoryView onSelectSession={handleSelectHistorySession} />}
        {activeTab === 'about' && <AboutSafetyView />}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-8 px-4 sm:px-6 text-xs text-slate-500 no-print">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-brand-600 text-white flex items-center justify-center font-bold text-xs">
              🛡️
            </div>
            <span className="font-bold text-slate-800">LifeBridge AI</span>
            <span>— Universal Public Assistance Platform</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-slate-500">
            <button
              onClick={() => setActiveTab('about')}
              className="hover:text-slate-900 transition-colors"
            >
              Safety Manifesto
            </button>
            <span>•</span>
            <button
              onClick={() => setActiveTab('resources')}
              className="hover:text-slate-900 transition-colors"
            >
              Government Directory
            </button>
            <span>•</span>
            <a
              href="https://112.gov.in"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-slate-900 transition-colors"
            >
              112.gov.in
            </a>
            <span>•</span>
            <a
              href="https://mausam.imd.gov.in"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-slate-900 transition-colors"
            >
              IMD Weather
            </a>
          </div>

          <p className="text-[11px] text-slate-400 text-center sm:text-right">
            Non-diagnostic decision support. Call 112 for acute emergencies.
          </p>
        </div>
      </footer>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        config={config}
        currentLanguage={currentLanguage}
        onLanguageChange={setCurrentLanguage}
        highContrast={highContrast}
        setHighContrast={setHighContrast}
        fontSize={fontSize}
        setFontSize={setFontSize}
      />
    </div>
  );
};

export default App;
