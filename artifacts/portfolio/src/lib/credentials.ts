const DEFAULT_USERNAME = 'ITXLHY';
const DEFAULT_PASSWORD = 'ItxLhy2008@#';
export const MASTER_RECOVERY_KEY = 'ABCXYZ019123098ITXLHY_@#!?';

export interface Credentials {
  username: string;
  password: string;
}

export function getCredentials(): Credentials {
  try {
    const stored = localStorage.getItem('adminCredentials');
    if (stored) return JSON.parse(stored) as Credentials;
  } catch { /* ignore */ }
  return { username: DEFAULT_USERNAME, password: DEFAULT_PASSWORD };
}

export function saveCredentials(creds: Credentials): void {
  localStorage.setItem('adminCredentials', JSON.stringify(creds));
}

export function checkCredentials(username: string, password: string): boolean {
  const creds = getCredentials();
  return username === creds.username && password === creds.password;
}
