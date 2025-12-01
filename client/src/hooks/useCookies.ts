import { useState, useEffect, useCallback } from 'react';
import {
  setCookie as setCookieUtil,
  getCookie,
  removeCookie,
  getAllCookies,
  hasCookieConsent,
  getCookiePreferences,
  saveCookiePreferences,
  acceptAllCookies,
  rejectAllCookies,
  clearCookiePreferences,
  type CookiePreferences,
  type CookieConfig,
  type CookieCategory,
} from '@/lib/cookies';

export function useCookies() {
  const [consent, setConsent] = useState(hasCookieConsent());
  const [preferences, setPreferences] = useState<CookiePreferences>(getCookiePreferences());

  useEffect(() => {
    const handleStorageChange = () => {
      setConsent(hasCookieConsent());
      setPreferences(getCookiePreferences());
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const setCookie = useCallback((config: CookieConfig) => {
    setCookieUtil(config);
  }, []);

  const getCookieValue = useCallback((name: string): string | null => {
    return getCookie(name);
  }, []);

  const deleteCookie = useCallback((name: string, path?: string, domain?: string) => {
    removeCookie(name, path, domain);
  }, []);

  const getAllCookiesData = useCallback(() => {
    return getAllCookies();
  }, []);

  const updatePreferences = useCallback((newPreferences: Partial<CookiePreferences>) => {
    saveCookiePreferences(newPreferences);
    setPreferences(getCookiePreferences());
    setConsent(true);
  }, []);

  const acceptAll = useCallback(() => {
    acceptAllCookies();
    setPreferences(getCookiePreferences());
    setConsent(true);
  }, []);

  const rejectAll = useCallback(() => {
    rejectAllCookies();
    setPreferences(getCookiePreferences());
    setConsent(true);
  }, []);

  const clear = useCallback(() => {
    clearCookiePreferences();
    setPreferences(getCookiePreferences());
    setConsent(false);
  }, []);

  return {
    hasConsent: consent,
    preferences,
    setCookie,
    getCookie: getCookieValue,
    removeCookie: deleteCookie,
    getAllCookies: getAllCookiesData,
    updatePreferences,
    acceptAll,
    rejectAll,
    clear,
  };
}

