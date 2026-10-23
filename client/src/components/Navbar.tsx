import React, { useState } from 'react';
import {
  Shield,
  Phone,
  Globe,
  Settings,
  History,
  Info,
  BookOpen,
  Menu,
  X
} from 'lucide-react';
import { SupportedLanguages } from '../types';
import { getTranslation } from '../lib/translations';

interface NavbarProps {
  activeTab: 'home' | 'resources' | 'history' | 'about';
  setActiveTab: (tab: 'home' | 'resources' | 'history' | 'about') => void;
  currentLanguage: string;
  onLanguageChange: (lang: string) => void;
  onOpenSettings: () => void;
  isLiveGemini: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  currentLanguage,
  onLanguageChange,
  onOpenSettings,
  isLiveGemini
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const t = getTranslation(currentLanguage);

  const navItems = [
    { id: 'home', label: t.tabs.home },
    { id: 'resources', label: t.tabs.resources },
    { id: 'history', label: t.tabs.history },
    { id: 'about', label: t.tabs.about }
  ] as const;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-subtle no-print">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo & Title */}
        <button
          type="button"
          onClick={() => setActiveTab('home')}
          className="flex items-center gap-2.5 text-left group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-700 via-brand-600 to-sky-600 text-white flex items-center justify-center shadow-md shadow-brand-500/20 group-hover:scale-105 transition-transform">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-slate-900 tracking-tight text-base sm:text-lg">
                LifeBridge<span className="text-brand-600">AI</span>
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-brand-700 bg-brand-100/80 px-1.5 py-0.5 rounded">
                Gemini
              </span>
            </div>
            <p className="text-[10px] text-slate-500 hidden sm:block truncate max-w-[200px]">
              Universal Public Assistance
            </p>
          </div>
        </button>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-100/80 p-1 rounded-xl border border-slate-200/60">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === item.id
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Actions Bar */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Emergency 112 Direct Dial Shortcut */}
          <a
            href="tel:112"
            className="flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-3 py-2 rounded-xl shadow-sm transition-all active:scale-95"
            title="Dial National Emergency Response Service 112"
          >
            <Phone className="w-3.5 h-3.5 fill-white" />
            <span className="hidden sm:inline">Emergency</span>
            <span>112</span>
          </a>

          {/* Language Selector Dropdown */}
          <div className="relative flex items-center">
            <Globe className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 pointer-events-none" />
            <select
              value={currentLanguage}
              onChange={(e) => onLanguageChange(e.target.value)}
              className="pl-8 pr-3 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 text-xs font-semibold rounded-xl appearance-none outline-none cursor-pointer focus:border-brand-500 transition-colors"
              aria-label="Select Language"
            >
              <option value="en">English</option>
              <option value="hi">हिन्दी (Hindi)</option>
              <option value="mr">मराठी (Marathi)</option>
              <option value="bn">বাংলা (Bengali)</option>
              <option value="ta">தமிழ் (Tamil)</option>
              <option value="te">తెలుగు (Telugu)</option>
              <option value="gu">ગુજરાતી (Gujarati)</option>
            </select>
          </div>

          {/* Settings Button */}
          <button
            type="button"
            onClick={onOpenSettings}
            className="w-9 h-9 rounded-xl border border-slate-200 hover:border-slate-300 text-slate-600 hover:text-slate-900 flex items-center justify-center transition-colors bg-white shadow-subtle"
            aria-label="Application Settings"
          >
            <Settings className="w-4 h-4" />
          </button>

          {/* Mobile Menu Toggle Button */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden w-9 h-9 rounded-xl border border-slate-200 text-slate-700 flex items-center justify-center hover:bg-slate-50 transition-colors"
            aria-label="Toggle navigation menu"
          >
            {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 py-3 space-y-1 shadow-lg">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setIsMobileMenuOpen(false);
              }}
              className={`w-full text-left px-3 py-2 rounded-xl text-sm font-semibold transition-colors ${
                activeTab === item.id
                  ? 'bg-brand-50 text-brand-800'
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </header>
  );
};
