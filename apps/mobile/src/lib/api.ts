const API_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3000';

export async function apiFetch<T>(
  path: string,
  token: string | null,
  options?: RequestInit
): Promise<{ data?: T; error?: { code: string; message: string } }> {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options?.headers,
  };
  if (token) {
    (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_URL}${path}`, { ...options, headers });
  const json = await res.json();

  if (!res.ok) {
    return { error: json.error ?? { code: 'UNKNOWN', message: 'Request failed' } };
  }

  return { data: json.data };
}

export async function fetchDashboardStats(token: string | null) {
  return apiFetch<{
    total: number;
    normal: number;
    abnormal: number;
    critical: number;
    recent: Array<{
      id: string;
      originalFilename: string;
      status: string;
      reportDate: string | null;
      createdAt: string;
    }>;
  }>('/api/dashboard/stats', token);
}

export async function fetchLabReports(token: string | null) {
  return apiFetch<
    Array<{
      id: string;
      originalFilename: string;
      analysisSummary: string | null;
      status: string;
      reportDate: string | null;
      createdAt: string;
    }>
  >('/api/lab-reports', token);
}

export async function fetchLabReport(
  id: string,
  token: string | null
) {
  return apiFetch<{
    id: string;
    originalFilename: string;
    analysisSummary: string | null;
    analysisDetailed: string | null;
    suggestedQuestions: string[] | null;
    status: string;
    reportDate: string | null;
  }>(`/api/lab-reports/${id}`, token);
}

export async function fetchNotes(
  token: string | null,
  search?: string
) {
  const q = search ? `?q=${encodeURIComponent(search)}` : '';
  return apiFetch<
    Array<{
      id: string;
      title: string;
      content: string;
      tags: string[] | null;
      updatedAt: string;
    }>
  >(`/api/notes${q}`, token);
}

export async function fetchNote(id: string, token: string | null) {
  return apiFetch<{
    id: string;
    title: string;
    content: string;
    tags: string[] | null;
    updatedAt: string;
  }>(`/api/notes/${id}`, token);
}

export async function createNote(
  token: string | null,
  input: { title: string; content: string; tags?: string[] }
) {
  return apiFetch<{ id: string }>('/api/notes', token, {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export async function updateNote(
  id: string,
  token: string | null,
  input: { title?: string; content?: string; tags?: string[] }
) {
  return apiFetch<{ id: string }>(`/api/notes/${id}`, token, {
    method: 'PATCH',
    body: JSON.stringify(input),
  });
}

export async function deleteNote(id: string, token: string | null) {
  return apiFetch<{ id: string }>(`/api/notes/${id}`, token, {
    method: 'DELETE',
  });
}

export async function fetchChatHistory(
  token: string | null,
  reportId?: string
) {
  const q = reportId ? `?reportId=${reportId}` : '';
  return apiFetch<
    Array<{ id: string; role: string; content: string; createdAt: string }>
  >(`/api/chat${q}`, token);
}

export async function sendChatMessage(
  token: string | null,
  input: { content: string; labReportId?: string }
) {
  return apiFetch<{ messageId: string; content: string }>('/api/chat', token, {
    method: 'POST',
    body: JSON.stringify(input),
  });
}
