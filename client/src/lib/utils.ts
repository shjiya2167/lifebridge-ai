import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { UrgencyLevel, ProblemCategory, VerificationStatus } from '../types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + ' B';
  else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
  else return (bytes / 1048576).toFixed(1) + ' MB';
}

export function formatDate(isoString?: string): string {
  if (!isoString) return 'Just now';
  try {
    const d = new Date(isoString);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ', ' + d.toLocaleDateString();
  } catch {
    return isoString;
  }
}

export function getUrgencyConfig(urgency: UrgencyLevel) {
  switch (urgency) {
    case 'emergency':
      return {
        label: 'Emergency / Immediate Threat',
        badgeClass: 'bg-red-100 text-red-800 border-red-300 animate-pulse',
        borderClass: 'border-red-500',
        bgSubtle: 'bg-red-50',
        textClass: 'text-red-700',
        icon: '🚨'
      };
    case 'urgent':
      return {
        label: 'Urgent Action Required',
        badgeClass: 'bg-orange-100 text-orange-800 border-orange-300',
        borderClass: 'border-orange-500',
        bgSubtle: 'bg-orange-50',
        textClass: 'text-orange-700',
        icon: '⚠️'
      };
    case 'elevated':
      return {
        label: 'Elevated Attention',
        badgeClass: 'bg-amber-100 text-amber-800 border-amber-300',
        borderClass: 'border-amber-500',
        bgSubtle: 'bg-amber-50',
        textClass: 'text-amber-700',
        icon: '⚡'
      };
    case 'routine':
      return {
        label: 'Routine Inquiry',
        badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-300',
        borderClass: 'border-emerald-500',
        bgSubtle: 'bg-emerald-50',
        textClass: 'text-emerald-700',
        icon: '✓'
      };
    case 'unknown':
    default:
      return {
        label: 'Assessment in Progress',
        badgeClass: 'bg-slate-100 text-slate-800 border-slate-300',
        borderClass: 'border-slate-400',
        bgSubtle: 'bg-slate-50',
        textClass: 'text-slate-700',
        icon: 'ℹ️'
      };
  }
}

export function getCategoryConfig(category: ProblemCategory) {
  switch (category) {
    case 'health':
      return { label: 'Health & Medical', icon: 'HeartPulse', color: 'text-rose-600 bg-rose-50 border-rose-200' };
    case 'traffic':
      return { label: 'Traffic & Transport', icon: 'CarAlert', color: 'text-blue-600 bg-blue-50 border-blue-200' };
    case 'weather':
      return { label: 'Weather Alert', icon: 'CloudRain', color: 'text-sky-600 bg-sky-50 border-sky-200' };
    case 'disaster':
      return { label: 'Disaster Safety', icon: 'ShieldAlert', color: 'text-red-600 bg-red-50 border-red-200' };
    case 'public_services':
      return { label: 'Public Services & Schemes', icon: 'Landmark', color: 'text-teal-600 bg-teal-50 border-teal-200' };
    case 'general':
    default:
      return { label: 'General Assistance', icon: 'HelpCircle', color: 'text-slate-600 bg-slate-50 border-slate-200' };
  }
}

export function getVerificationStatusConfig(status: VerificationStatus) {
  switch (status) {
    case 'verified':
      return {
        label: 'Corroborated by Official Sources',
        badgeClass: 'bg-teal-50 text-teal-800 border-teal-300',
        icon: 'CheckCircle2'
      };
    case 'partially_verified':
      return {
        label: 'Partially Verified / Advisory Links',
        badgeClass: 'bg-amber-50 text-amber-800 border-amber-300',
        icon: 'AlertCircle'
      };
    case 'unverified':
    default:
      return {
        label: 'Unverified / AI Interpretation Only',
        badgeClass: 'bg-slate-100 text-slate-700 border-slate-300',
        icon: 'HelpCircle'
      };
  }
}
