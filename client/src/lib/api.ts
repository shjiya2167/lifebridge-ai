import {
  AppConfig,
  GeminiStructuredResponse,
  PublicResource,
  SessionHistoryItem
} from '../types';

const getApiBase = (): string => {
  const envUrl = (import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL || '').trim();
  if (!envUrl) {
    return '/api';
  }
  const cleanUrl = envUrl.replace(/\/+$/, '');
  return cleanUrl.endsWith('/api') ? cleanUrl : `${cleanUrl}/api`;
};

export const API_BASE = getApiBase();

export async function fetchAppConfig(): Promise<AppConfig> {
  const res = await fetch(`${API_BASE}/config`);
  if (!res.ok) {
    throw new Error('Failed to load application configuration');
  }
  return res.json();
}

export async function submitAnalysis(
  formData: FormData
): Promise<{ success: boolean; sessionId: string; analysis: GeminiStructuredResponse }> {
  const res = await fetch(`${API_BASE}/analyze`, {
    method: 'POST',
    body: formData
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to process inquiry with LifeBridge AI');
  }

  return res.json();
}

export async function fetchResources(category?: string): Promise<PublicResource[]> {
  const url = category && category !== 'all' ? `${API_BASE}/resources?category=${category}` : `${API_BASE}/resources`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error('Failed to load public resources directory');
  }
  const data = await res.json();
  return data.resources || [];
}

export async function fetchHistory(): Promise<SessionHistoryItem[]> {
  const res = await fetch(`${API_BASE}/history`);
  if (!res.ok) return [];
  const data = await res.json();
  return data.sessions || [];
}

export async function deleteHistorySession(id: string): Promise<boolean> {
  const res = await fetch(`${API_BASE}/history/${id}`, { method: 'DELETE' });
  return res.ok;
}

export async function fetchHistorySession(id: string): Promise<{ success: boolean; session?: { analysis?: GeminiStructuredResponse } }> {
  const res = await fetch(`${API_BASE}/history/${id}`);
  if (!res.ok) {
    throw new Error('Failed to load session details');
  }
  return res.json();
}

export async function clearAllSessions(): Promise<boolean> {
  const res = await fetch(`${API_BASE}/history`, { method: 'DELETE' });
  return res.ok;
}

