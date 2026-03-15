const DEFAULT_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:9001/api";

export function createApiClient(backendToken, baseUrl = DEFAULT_BASE_URL) {
  const headers = {
    "Content-Type": "application/json",
    ...(backendToken ? { Authorization: `Bearer ${backendToken}` } : {}),
  };

  async function request(method, path, body) {
    const url = `${baseUrl}${path}`;
    const options = {
      method,
      headers,
      ...(body ? { body: JSON.stringify(body) } : {}),
    };

    const res = await fetch(url, options);

    if (!res.ok) {
      const error = new Error(`API Error: ${res.status} ${res.statusText}`);
      error.status = res.status;
      try {
        error.data = await res.json();
      } catch { }
      throw error;
    }

    if (res.status === 204) return null;
    return res.json();
  }

  return {
    get: (path) => request("GET", path),
    post: (path, body) => request("POST", path, body),
    put: (path, body) => request("PUT", path, body),
    patch: (path, body) => request("PATCH", path, body),
    delete: (path) => request("DELETE", path),
  };
}