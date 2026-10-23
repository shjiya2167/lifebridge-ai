import React, { useState, useRef } from 'react';
import {
  Paperclip,
  Mic,
  Send,
  FileText,
  Image as ImageIcon,
  Music,
  X,
  Sparkles,
  Info,
  ShieldCheck,
  AlertTriangle
} from 'lucide-react';
import { AttachedFileItem, DemoScenarioMeta } from '../types';
import { AudioRecorder } from './AudioRecorder';
import { formatFileSize } from '../lib/utils';
import { getTranslation } from '../lib/translations';

interface UniversalInputProps {
  onSubmit: (text: string, files: File[], categoryHint?: string, demoScenarioId?: string) => void;
  isLoading: boolean;
  demoScenarios: DemoScenarioMeta[];
  currentLanguage: string;
}

export const UniversalInput: React.FC<UniversalInputProps> = ({
  onSubmit,
  isLoading,
  demoScenarios,
  currentLanguage
}) => {
  const [text, setText] = useState('');
  const [attachedFiles, setAttachedFiles] = useState<AttachedFileItem[]>([]);
  const [isRecordingOpen, setIsRecordingOpen] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const t = getTranslation(currentLanguage);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    addFiles(files);
    e.target.value = ''; // Reset input
  };

  const addFiles = (files: File[]) => {
    setValidationError(null);
    const newItems: AttachedFileItem[] = [];

    for (const file of files) {
      if (attachedFiles.length + newItems.length >= 5) {
        setValidationError('You can attach up to 5 files per inquiry.');
        break;
      }

      if (file.size > 15 * 1024 * 1024) {
        setValidationError(`File "${file.name}" exceeds the 15MB limit.`);
        continue;
      }

      const previewUrl = file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined;

      newItems.push({
        id: 'file_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
        file,
        name: file.name,
        size: file.size,
        type: file.type,
        previewUrl
      });
    }

    setAttachedFiles((prev) => [...prev, ...newItems]);
  };

  const removeFile = (id: string) => {
    setAttachedFiles((prev) => {
      const target = prev.find((f) => f.id === id);
      if (target?.previewUrl) {
        URL.revokeObjectURL(target.previewUrl);
      }
      return prev.filter((f) => f.id !== id);
    });
  };

  const handleAudioRecorded = (audioFile: File) => {
    setIsRecordingOpen(false);
    addFiles([audioFile]);
  };

  const handleFormSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!text.trim() && attachedFiles.length === 0) {
      setValidationError('Please enter a description or attach at least one document, photo, or audio note.');
      return;
    }
    setValidationError(null);
    onSubmit(
      text,
      attachedFiles.map((f) => f.file)
    );
  };

  const handleSelectDemo = (scenario: DemoScenarioMeta) => {
    setText(scenario.suggestedPrompt);
    setAttachedFiles([]);
    setValidationError(null);
    onSubmit(scenario.suggestedPrompt, [], scenario.category, scenario.id);
  };

  const quickPrompts = [
    {
      title: 'Medical Report',
      category: 'health',
      text: 'Please explain these CBC blood test results in simple language. What questions should I ask my doctor?'
    },
    {
      title: 'Waterlogging & Flood',
      category: 'weather',
      text: 'Heavy rain in our area has flooded the road to knee depth. Power lines are flickering. How do we reach safe ground?'
    },
    {
      title: 'Road Accident',
      category: 'traffic',
      text: 'A car has hit a divider on the highway. One person has severe leg bleeding. What immediate first aid and emergency steps are needed?'
    },
    {
      title: 'Ayushman Bharat Card',
      category: 'public_services',
      text: 'How can an elderly low-income relative find out if they are eligible for the Ayushman Bharat PM-JAY 5 lakh health card?'
    }
  ];

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Interactive Demo Scenarios Bar */}
      <div className="bg-gradient-to-r from-brand-50 to-sky-50 border border-brand-200 rounded-2xl p-4 shadow-subtle">
        <div className="flex items-center gap-2 mb-2.5">
          <Sparkles className="w-4 h-4 text-brand-600" />
          <span className="text-xs font-bold uppercase tracking-wider text-brand-800">
            {t.demoScenariosTitle}
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
          {demoScenarios.map((scenario) => (
            <button
              key={scenario.id}
              type="button"
              onClick={() => handleSelectDemo(scenario)}
              disabled={isLoading}
              className="text-left bg-white hover:bg-brand-50 border border-slate-200 hover:border-brand-300 rounded-xl p-2.5 transition-all shadow-subtle group active:scale-[0.98]"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-brand-700 bg-brand-100/70 px-1.5 py-0.5 rounded">
                  {scenario.badge}
                </span>
                {scenario.hasAttachmentPreview && (
                  <Paperclip className="w-3 h-3 text-slate-400 group-hover:text-brand-600" />
                )}
              </div>
              <p className="text-xs font-semibold text-slate-800 group-hover:text-brand-900 line-clamp-1">
                {scenario.name.split(':')[1]?.trim() || scenario.name}
              </p>
              <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                {scenario.suggestedPrompt}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Main Input Form Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-card p-4 sm:p-6 transition-all focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-100">
        <form onSubmit={handleFormSubmit}>
          <div className="relative">
            <textarea
              value={text}
              onChange={(e) => {
                setText(e.target.value);
                if (validationError) setValidationError(null);
              }}
              placeholder={t.inputPlaceholder}
              rows={4}
              disabled={isLoading}
              className="w-full text-slate-800 placeholder-slate-400 text-sm sm:text-base border-0 focus:ring-0 resize-none outline-none leading-relaxed"
            />
          </div>

          {/* Audio Recording Drawer if open */}
          {isRecordingOpen && (
            <AudioRecorder
              onAudioRecorded={handleAudioRecorded}
              onCancel={() => setIsRecordingOpen(false)}
              isHindiOrRegional={currentLanguage === 'hi' || currentLanguage === 'mr'}
            />
          )}

          {/* Attached Files Preview Grid */}
          {attachedFiles.length > 0 && (
            <div className="flex flex-wrap gap-2.5 pt-3 border-t border-slate-100 mb-3">
              {attachedFiles.map((fileItem) => (
                <div
                  key={fileItem.id}
                  className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl p-1.5 pr-2.5 max-w-[240px] text-xs text-slate-700"
                >
                  {fileItem.previewUrl ? (
                    <img
                      src={fileItem.previewUrl}
                      alt={fileItem.name}
                      className="w-7 h-7 object-cover rounded-lg border border-slate-200"
                    />
                  ) : fileItem.type.includes('pdf') ? (
                    <div className="w-7 h-7 rounded-lg bg-red-100 text-red-700 flex items-center justify-center font-bold text-[10px]">
                      PDF
                    </div>
                  ) : fileItem.type.includes('audio') ? (
                    <div className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center">
                      <Music className="w-3.5 h-3.5" />
                    </div>
                  ) : (
                    <div className="w-7 h-7 rounded-lg bg-slate-200 text-slate-700 flex items-center justify-center">
                      <FileText className="w-3.5 h-3.5" />
                    </div>
                  )}

                  <div className="flex-1 truncate">
                    <p className="font-medium truncate">{fileItem.name}</p>
                    <p className="text-[10px] text-slate-400">{formatFileSize(fileItem.size)}</p>
                  </div>

                  <button
                    type="button"
                    onClick={() => removeFile(fileItem.id)}
                    className="w-5 h-5 rounded-full hover:bg-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-700 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Validation Error Banner */}
          {validationError && (
            <div className="flex items-center gap-2 text-xs text-red-600 bg-red-50 border border-red-200 p-2.5 rounded-xl mb-3">
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
              <span>{validationError}</span>
            </div>
          )}

          {/* Controls Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100">
            <div className="flex items-center gap-2">
              {/* Attach File Button */}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                multiple
                accept="image/*,application/pdf,audio/*,text/plain"
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isLoading}
                className="flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-brand-700 bg-slate-100 hover:bg-brand-50 border border-slate-200 hover:border-brand-200 px-3 py-2 rounded-xl transition-colors"
              >
                <Paperclip className="w-3.5 h-3.5" />
                <span>Attach Files</span>
              </button>

              {/* Voice Record Button */}
              <button
                type="button"
                onClick={() => setIsRecordingOpen(true)}
                disabled={isLoading || isRecordingOpen}
                className="flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-brand-700 bg-slate-100 hover:bg-brand-50 border border-slate-200 hover:border-brand-200 px-3 py-2 rounded-xl transition-colors"
              >
                <Mic className="w-3.5 h-3.5 text-red-500" />
                <span>{t.startRecording}</span>
              </button>

              <span className="hidden sm:inline-block text-[11px] text-slate-400">
                Supports Images, PDFs, Audio
              </span>
            </div>

            {/* Submit Action */}
            <button
              type="submit"
              disabled={isLoading}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-xs sm:text-sm text-white shadow-sm transition-all active:scale-95 ${
                isLoading
                  ? 'bg-brand-400 cursor-not-allowed'
                  : 'bg-brand-600 hover:bg-brand-700 hover:shadow-md'
              }`}
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>{t.analyzingButton}</span>
                </>
              ) : (
                <>
                  <span>{t.submitButton}</span>
                  <Send className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Suggested Quick Prompt Chips */}
      <div>
        <p className="text-xs font-semibold text-slate-500 mb-2">{t.quickExamplesTitle}</p>
        <div className="flex flex-wrap gap-2">
          {quickPrompts.map((prompt, i) => (
            <button
              key={i}
              type="button"
              onClick={() => {
                setText(prompt.text);
                setValidationError(null);
              }}
              className="text-xs text-left bg-white hover:bg-slate-50 border border-slate-200 hover:border-brand-300 text-slate-700 hover:text-brand-800 px-3 py-2 rounded-xl transition-all shadow-subtle"
            >
              <span className="font-semibold text-slate-900">{prompt.title}: </span>
              <span className="text-slate-500 truncate">{prompt.text.slice(0, 50)}...</span>
            </button>
          ))}
        </div>
      </div>

      {/* Privacy Guarantee Note */}
      <div className="flex items-start gap-2.5 text-xs text-slate-500 bg-slate-100/70 p-3 rounded-xl border border-slate-200/60">
        <ShieldCheck className="w-4 h-4 text-brand-600 flex-shrink-0 mt-0.5" />
        <p className="leading-relaxed">{t.privacyNotice}</p>
      </div>
    </div>
  );
};
