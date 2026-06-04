const API_URL = process.env.EXPO_PUBLIC_API_URL;

export async function fetchWithAuth(
  path: string,
  token: string | null,
  options?: RequestInit
) {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      Authorization: token ? `Bearer ${token}` : '',
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });
  return res.json();
}
