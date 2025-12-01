export type CookieCategory = 'essential' | 'analytics' | 'marketing' | 'preferences';

export interface CookiePreferences {
  essential: boolean;
  analytics: boolean;
  marketing: boolean;
  preferences: boolean;
}

export interface CookieConfig {
  name: string;
  value: string;
  expires?: Date | number;
  path?: string;
  domain?: string;
  secure?: boolean;
  sameSite?: 'strict' | 'lax' | 'none';
  category: CookieCategory;
}

const COOKIE_CONSENT_KEY = 'lar-imediato-cookie-consent';
const COOKIE_PREFERENCES_KEY = 'lar-imediato-cookie-preferences';

export function setCookie(config: CookieConfig): void {
  if (typeof document === 'undefined') return;

  if (config.category !== 'essential') {
    const preferences = getCookiePreferences();
    if (!preferences[config.category]) {
      return;
    }
  }

  let cookieString = `${encodeURIComponent(config.name)}=${encodeURIComponent(config.value)}`;

  if (config.expires) {
    const expiresDate = config.expires instanceof Date 
      ? config.expires 
      : new Date(Date.now() + config.expires * 24 * 60 * 60 * 1000);
    cookieString += `; expires=${expiresDate.toUTCString()}`;
  }

  if (config.path) {
    cookieString += `; path=${config.path}`;
  } else {
    cookieString += `; path=/`;
  }

  if (config.domain) {
    cookieString += `; domain=${config.domain}`;
  }

  if (config.secure || window.location.protocol === 'https:') {
    cookieString += `; secure`;
  }

  if (config.sameSite) {
    cookieString += `; samesite=${config.sameSite}`;
  } else {
    cookieString += `; samesite=lax`;
  }

  document.cookie = cookieString;
}

export function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;

  const nameEQ = `${encodeURIComponent(name)}=`;
  const cookies = document.cookie.split(';');

  for (let i = 0; i < cookies.length; i++) {
    let cookie = cookies[i];
    while (cookie.charAt(0) === ' ') {
      cookie = cookie.substring(1, cookie.length);
    }
    if (cookie.indexOf(nameEQ) === 0) {
      return decodeURIComponent(cookie.substring(nameEQ.length, cookie.length));
    }
  }

  return null;
}

export function removeCookie(name: string, path: string = '/', domain?: string): void {
  if (typeof document === 'undefined') return;

  let cookieString = `${encodeURIComponent(name)}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path}`;
  
  if (domain) {
    cookieString += `; domain=${domain}`;
  }

  document.cookie = cookieString;
}

export function getAllCookies(): Record<string, string> {
  if (typeof document === 'undefined') return {};

  const cookies: Record<string, string> = {};
  const cookieStrings = document.cookie.split(';');

  for (const cookieString of cookieStrings) {
    const [name, value] = cookieString.trim().split('=');
    if (name && value) {
      cookies[decodeURIComponent(name)] = decodeURIComponent(value);
    }
  }

  return cookies;
}

export function hasCookieConsent(): boolean {
  if (typeof localStorage === 'undefined') return false;
  return localStorage.getItem(COOKIE_CONSENT_KEY) !== null;
}

export function getCookiePreferences(): CookiePreferences {
  if (typeof localStorage === 'undefined') {
    return {
      essential: true,
      analytics: false,
      marketing: false,
      preferences: false,
    };
  }

  const stored = localStorage.getItem(COOKIE_PREFERENCES_KEY);
  if (stored) {
    try {
      const preferences = JSON.parse(stored) as CookiePreferences;
      return {
        essential: true,
        analytics: preferences.analytics ?? false,
        marketing: preferences.marketing ?? false,
        preferences: preferences.preferences ?? false,
      };
    } catch {
    }
  }

  return {
    essential: true,
    analytics: false,
    marketing: false,
    preferences: false,
  };
}

export function saveCookiePreferences(preferences: Partial<CookiePreferences>): void {
  if (typeof localStorage === 'undefined') return;

  const currentPreferences = getCookiePreferences();
  const newPreferences: CookiePreferences = {
    ...currentPreferences,
    ...preferences,
    essential: true,
  };

  localStorage.setItem(COOKIE_PREFERENCES_KEY, JSON.stringify(newPreferences));
  localStorage.setItem(COOKIE_CONSENT_KEY, 'accepted');
  removeCookiesByCategory(newPreferences);
}

export function removeCookiesByCategory(preferences: CookiePreferences): void {
  if (!preferences.analytics) {
    const analyticsCookies = ['_ga', '_gid', '_gat', '_ga_*'];
    analyticsCookies.forEach(cookie => {
      if (cookie.includes('*')) {
        Object.keys(getAllCookies()).forEach(key => {
          if (key.startsWith(cookie.replace('*', ''))) {
            removeCookie(key);
          }
        });
      } else {
        removeCookie(cookie);
      }
    });
  }

  if (!preferences.marketing) {
    const marketingCookies = ['_fbp', '_fbc', 'fbpixel'];
    marketingCookies.forEach(cookie => removeCookie(cookie));
  }
}

export function acceptAllCookies(): void {
  saveCookiePreferences({
    essential: true,
    analytics: true,
    marketing: true,
    preferences: true,
  });
}

export function rejectAllCookies(): void {
  saveCookiePreferences({
    essential: true,
    analytics: false,
    marketing: false,
    preferences: false,
  });
}

export function clearCookiePreferences(): void {
  if (typeof localStorage === 'undefined') return;
  localStorage.removeItem(COOKIE_CONSENT_KEY);
  localStorage.removeItem(COOKIE_PREFERENCES_KEY);
}

