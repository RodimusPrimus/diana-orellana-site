import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  detectBrowserLanguage,
  getPersistedLanguage,
  persistLanguage,
  getCurrentLanguage,
} from '../../utils/i18nEngine';

describe('i18nEngine', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('detectBrowserLanguage', () => {
    it("returns 'es' when navigator.language starts with 'es'", () => {
      vi.stubGlobal('navigator', { language: 'es-MX', languages: ['es-MX'] });
      expect(detectBrowserLanguage()).toBe('es');
      vi.unstubAllGlobals();
    });

    it("returns 'en' for French language", () => {
      vi.stubGlobal('navigator', { language: 'fr-FR', languages: ['fr-FR'] });
      expect(detectBrowserLanguage()).toBe('en');
      vi.unstubAllGlobals();
    });

    it("returns 'en' for German language", () => {
      vi.stubGlobal('navigator', { language: 'de-DE', languages: ['de-DE'] });
      expect(detectBrowserLanguage()).toBe('en');
      vi.unstubAllGlobals();
    });

    it("returns 'en' for en-US", () => {
      vi.stubGlobal('navigator', { language: 'en-US', languages: ['en-US'] });
      expect(detectBrowserLanguage()).toBe('en');
      vi.unstubAllGlobals();
    });
  });

  describe('getPersistedLanguage', () => {
    it('returns null when localStorage has no stored language', () => {
      expect(getPersistedLanguage()).toBeNull();
    });

    it("returns 'en' when localStorage has 'en' stored", () => {
      localStorage.setItem('diana-lang', 'en');
      expect(getPersistedLanguage()).toBe('en');
    });

    it("returns 'es' when localStorage has 'es' stored", () => {
      localStorage.setItem('diana-lang', 'es');
      expect(getPersistedLanguage()).toBe('es');
    });

    it('returns null for invalid stored values', () => {
      localStorage.setItem('diana-lang', 'fr');
      expect(getPersistedLanguage()).toBeNull();
    });
  });

  describe('persistLanguage', () => {
    it("stores 'en' to localStorage under key 'diana-lang'", () => {
      persistLanguage('en');
      expect(localStorage.getItem('diana-lang')).toBe('en');
    });

    it("stores 'es' to localStorage under key 'diana-lang'", () => {
      persistLanguage('es');
      expect(localStorage.getItem('diana-lang')).toBe('es');
    });
  });

  describe('getCurrentLanguage', () => {
    it('returns persisted language when available', () => {
      localStorage.setItem('diana-lang', 'es');
      expect(getCurrentLanguage()).toBe('es');
    });

    it('falls back to browser detection when no persisted choice', () => {
      vi.stubGlobal('navigator', { language: 'es-AR', languages: ['es-AR'] });
      expect(getCurrentLanguage()).toBe('es');
      vi.unstubAllGlobals();
    });
  });
});
