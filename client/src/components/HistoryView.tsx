import React, { useState, useEffect } from 'react';
import { History, Trash2, ArrowRight, ShieldCheck, Clock, AlertCircle } from 'lucide-react';
import { SessionHistoryItem } from '../types';
import { fetchHistory, deleteHistorySession, clearAllSessions } from '../lib/api';
import { formatDate, getUrgencyConfig } from '../lib/utils';

interface HistoryViewProps {
  onSelectSession: (id: string) => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({ onSelectSession }) => {
  const [sessions, setSessions] = useState<SessionHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = async () => {
    setIsLoading(true);
    try {
      const data = await fetchHistory();
      setSessions(data);
    } catch (err) {
      console.error('Failed to load session history:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await deleteHistorySession(id);
      setSessions((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      console.error('Failed to delete session:', err);
    }
  };

  const handleClearAll = async () => {
    if (confirm('Are you sure you want to delete all session history from local memory?')) {
      try {
        await clearAllSessions();
        setSessions([]);
      } catch (err) {
        console.error('Failed to clear sessions:', err);
      }
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-card flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-teal-700 bg-teal-50 border border-teal-200 px-3 py-1 rounded-full mb-2">
            <History className="w-3.5 h-3.5 text-teal-600" />
            <span>Privacy-First History</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Analyzed Inquiry Sessions
          </h2>
          <p className="text-xs text-slate-500 mt-1 max-w-lg leading-relaxed">
            Stored in temporary memory for your current session. Raw medical documents, images, and audio notes are automatically discarded immediately after analysis.
          </p>
        </div>

        {sessions.length > 0 && (
          <button
            type="button"
            onClick={handleClearAll}
            className="flex items-center gap-1.5 text-xs text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 px-3.5 py-2 rounded-xl transition-colors font-semibold"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear All History</span>
          </button>
        )}
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <div className="w-8 h-8 border-3 border-brand-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <p className="text-xs text-slate-500">Retrieving session history...</p>
        </div>
      ) : sessions.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-10 text-center text-slate-500 shadow-card">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
            <History className="w-6 h-6" />
          </div>
          <p className="font-semibold text-slate-800 text-sm">No previous sessions in memory</p>
          <p className="text-xs mt-1 text-slate-500 max-w-sm mx-auto">
            When you analyze inquiries or test demo scenarios, summary records appear here for your review.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {sessions.map((session) => {
            const urgency = getUrgencyConfig(session.urgency);
            return (
              <div
                key={session.id}
                onClick={() => onSelectSession(session.id)}
                className="bg-white border border-slate-200 hover:border-brand-300 rounded-2xl p-4 sm:p-5 shadow-card hover:shadow-elevated transition-all cursor-pointer group flex items-center justify-between gap-4"
              >
                <div className="flex-1 space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border ${urgency.badgeClass}`}
                    >
                      {urgency.label}
                    </span>
                    <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                      {session.category}
                    </span>
                    <span className="text-[11px] text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatDate(session.createdAt)}
                    </span>
                  </div>

                  <h3 className="font-semibold text-slate-900 text-sm sm:text-base group-hover:text-brand-900 transition-colors line-clamp-1">
                    {session.inputExcerpt}
                  </h3>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={(e) => handleDelete(session.id, e)}
                    className="p-2 text-slate-400 hover:text-red-600 rounded-lg hover:bg-slate-50 transition-colors"
                    title="Delete session"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <div className="w-8 h-8 rounded-full bg-slate-100 group-hover:bg-brand-600 group-hover:text-white flex items-center justify-center text-slate-600 transition-colors">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
