import React from 'react';
import {
  ShieldAlert,
  Sparkles,
  Search,
  CheckCircle2,
  Lock,
  HeartPulse,
  Scale,
  Cpu,
  Layers,
  ArrowRight
} from 'lucide-react';

export const AboutSafetyView: React.FC = () => {
  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 pb-12">
      {/* Hero Banner */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-card">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-brand-700 bg-brand-50 border border-brand-200 px-3 py-1 rounded-full mb-3">
            <Sparkles className="w-3.5 h-3.5 text-brand-600" />
            <span>AI Architecture & Safety Manifesto</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-3">
            How LifeBridge AI Works
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            LifeBridge AI transforms chaotic real-world inputs—unstructured voice notes, confusing medical reports, disaster alerts, or accident photos—into verified, structured, prioritized action plans.
          </p>
        </div>

        {/* Pipeline Diagram */}
        <div className="mt-8 pt-8 border-t border-slate-100">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
            End-to-End Processing Architecture
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Stage 1</span>
              <h4 className="font-bold text-slate-900 text-sm mt-1">Universal Input</h4>
              <p className="text-xs text-slate-500 mt-1">
                Audio voice notes, lab PDFs, disaster photos, or text in 7 Indian languages.
              </p>
            </div>

            <div className="bg-brand-50/70 border border-brand-200 p-4 rounded-2xl">
              <span className="text-[10px] font-bold text-brand-600 uppercase">Stage 2</span>
              <h4 className="font-bold text-brand-900 text-sm mt-1">Gemini Intelligence</h4>
              <p className="text-xs text-slate-600 mt-1">
                Multimodal extraction, entity resolution, and JSON schema-constrained generation.
              </p>
            </div>

            <div className="bg-teal-50/70 border border-teal-200 p-4 rounded-2xl">
              <span className="text-[10px] font-bold text-teal-600 uppercase">Stage 3</span>
              <h4 className="font-bold text-teal-900 text-sm mt-1">Verification Layer</h4>
              <p className="text-xs text-slate-600 mt-1">
                Independent cross-referencing with official portals (IMD, NDMA, MoHFW, India.gov).
              </p>
            </div>

            <div className="bg-slate-900 text-white p-4 rounded-2xl">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Stage 4</span>
              <h4 className="font-bold text-white text-sm mt-1">Actionable Plan</h4>
              <p className="text-xs text-slate-300 mt-1">
                Prioritized next steps, emergency triage, and direct civic/helpline shortcuts.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Safety & Responsible AI Guardrails */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-card space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center">
            <HeartPulse className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-base">Medical & Clinical Boundaries</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            LifeBridge AI strictly explains terminology and extracts lab values for patient literacy. It <strong>never</strong> makes definitive diagnoses, prescribes prescription drugs, or substitutes for an in-person physical examination by a certified physician.
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-card space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-red-100 text-red-700 flex items-center justify-center">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-base">Deterministic Emergency Triage</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Immediate life threats (cardiac symptoms, severe trauma, active drowning, fire) trigger hardcoded deterministic safety rules on the server. The emergency guidance banner and 112 click-to-call links are displayed without delaying for LLM output.
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-card space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-teal-100 text-teal-700 flex items-center justify-center">
            <Search className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-base">No Fabricated Citations</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Unlike chatbots that invent plausible URLs, LifeBridge AI maintains a validated catalog of statutory government services (india.gov.in, 112.gov.in, ndma.gov.in, mohfw.gov.in). If live data cannot be fetched, it clearly declares: <em>"Live verification unavailable"</em>.
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-card space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center">
            <Lock className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-base">Prompt Injection & Ephemeral Privacy</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            All user inputs and documents are wrapped in boundary tokens and treated as untrusted data. Uploads reside in RAM only during model inference and are purged immediately. API keys remain strictly on the backend.
          </p>
        </div>
      </div>

      {/* Guide for Hackathon Judges */}
      <div className="bg-gradient-to-br from-slate-900 to-navy-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl">
        <h3 className="font-bold text-base sm:text-lg mb-2 text-brand-300">
          Guide for Hackathon Judges
        </h3>
        <p className="text-xs text-slate-300 mb-4 leading-relaxed">
          You can test the complete, functional application right now using:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-300">
          <div className="bg-white/10 p-3 rounded-xl border border-white/10">
            <strong className="text-white block mb-0.5">1-Click Test Scenarios:</strong>
            Try the 5 preset scenarios on the home workspace (Medical Lab, Flood Emergency, Road Accident, Public Schemes, Hindi Voice).
          </div>
          <div className="bg-white/10 p-3 rounded-xl border border-white/10">
            <strong className="text-white block mb-0.5">Live Mic Voice Recording:</strong>
            Click the Voice Record button to capture a real audio clip and send it to the backend.
          </div>
          <div className="bg-white/10 p-3 rounded-xl border border-white/10">
            <strong className="text-white block mb-0.5">Multilingual UI & Output:</strong>
            Switch to हिन्दी or मराठी in the header to observe native script responses.
          </div>
          <div className="bg-white/10 p-3 rounded-xl border border-white/10">
            <strong className="text-white block mb-0.5">Live Gemini Key:</strong>
            Add your key to <code>server/.env</code> as <code>GEMINI_API_KEY</code> anytime.
          </div>
        </div>
      </div>
    </div>
  );
};
