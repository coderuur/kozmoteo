export const getApiUrl = (): string => {
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL.replace(/\/+$/, '');
  }
  return 'http://127.0.0.1:8000';
};

export const getWebSocketUrl = (path: string): string => {
  const apiUrl = getApiUrl();
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  if (apiUrl.startsWith('https://')) {
    return `${apiUrl.replace('https://', 'wss://')}${cleanPath}`;
  }
  return `${apiUrl.replace('http://', 'ws://')}${cleanPath}`;
};
