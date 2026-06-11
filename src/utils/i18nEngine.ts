import { translations } from '../i18n/translations';
import type { Lang } from '../i18n/translations';

export type { Lang };

const STORAGE_KEY = 'diana-lang';

/**
 * Detects the browser's preferred language.
 * Returns 'es' if navigator.language starts with 'es', otherwise 'en'.
 */
export function detectBrowserLanguage(): Lang {
  try {
    const navLang =
      (typeof navigator !== 'undefined' &&
        (navigator.languages?.[0] || navigator.language)) ||
      '';
    return navLang.toLowerCase().startsWith('es') ? 'es' : 'en';
  } catch {
    return 'en';
  }
}

/**
 * Reads the persisted language choice from localStorage.
 * Returns 'en' or 'es' if valid, null otherwise.
 * Handles localStorage being unavailable gracefully.
 */
export function getPersistedLanguage(): Lang | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'en' || stored === 'es') {
      return stored;
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Persists the selected language to localStorage.
 * Handles localStorage being unavailable gracefully.
 */
export function persistLanguage(lang: Lang): void {
  try {
    localStorage.setItem(STORAGE_KEY, lang);
  } catch {
    // localStorage unavailable — silently ignore
  }
}

/**
 * Applies translations for the given language to all elements with [data-i18n].
 * Also updates the <html lang> attribute.
 */
export function applyTranslations(lang: Lang): void {
  const langTranslations = translations[lang];

  const elements = document.querySelectorAll<HTMLElement>('[data-i18n]');
  elements.forEach((el) => {
    const key = el.getAttribute('data-i18n');
    if (key && key in langTranslations) {
      el.textContent = langTranslations[key as keyof typeof langTranslations];
    }
  });

  document.documentElement.setAttribute('lang', lang);
}

/**
 * Returns the current language: persisted choice if available,
 * otherwise detects from the browser.
 */
export function getCurrentLanguage(): Lang {
  return getPersistedLanguage() ?? detectBrowserLanguage();
}
