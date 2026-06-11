import { describe, it, expect } from 'vitest';
import { switchTab, getNextTab, isValidTabId, TAB_ORDER } from '../../utils/tabNavigation';
import type { TabId } from '../../utils/tabNavigation';

describe('tabNavigation', () => {
  describe('switchTab', () => {
    it('returns target as activeTab and current as previousTab', () => {
      const result = switchTab('hero', 'diagnostico');
      expect(result.activeTab).toBe('diagnostico');
      expect(result.previousTab).toBe('hero');
    });

    it('handles switching to the same tab', () => {
      const result = switchTab('hero', 'hero');
      expect(result.activeTab).toBe('hero');
      expect(result.previousTab).toBe('hero');
    });

    it('returns correct state for all tab combinations', () => {
      const tabs: TabId[] = ['hero', 'diagnostico', 'validacion', 'contenido'];
      for (const current of tabs) {
        for (const target of tabs) {
          const result = switchTab(current, target);
          expect(result.activeTab).toBe(target);
          expect(result.previousTab).toBe(current);
        }
      }
    });
  });

  describe('getNextTab', () => {
    it('returns next tab in order', () => {
      expect(getNextTab('hero', 'next')).toBe('diagnostico');
      expect(getNextTab('diagnostico', 'next')).toBe('validacion');
      expect(getNextTab('validacion', 'next')).toBe('contenido');
    });

    it('wraps from last to first when going next', () => {
      expect(getNextTab('contenido', 'next')).toBe('hero');
    });

    it('returns previous tab in order', () => {
      expect(getNextTab('contenido', 'prev')).toBe('validacion');
      expect(getNextTab('validacion', 'prev')).toBe('diagnostico');
      expect(getNextTab('diagnostico', 'prev')).toBe('hero');
    });

    it('wraps from first to last when going prev', () => {
      expect(getNextTab('hero', 'prev')).toBe('contenido');
    });
  });

  describe('isValidTabId', () => {
    it('returns true for all valid tab IDs', () => {
      expect(isValidTabId('hero')).toBe(true);
      expect(isValidTabId('diagnostico')).toBe(true);
      expect(isValidTabId('validacion')).toBe(true);
      expect(isValidTabId('contenido')).toBe(true);
    });

    it('returns false for invalid strings', () => {
      expect(isValidTabId('')).toBe(false);
      expect(isValidTabId('home')).toBe(false);
      expect(isValidTabId('Hero')).toBe(false);
      expect(isValidTabId('HERO')).toBe(false);
      expect(isValidTabId('tab1')).toBe(false);
      expect(isValidTabId('diagnostico ')).toBe(false);
    });
  });

  describe('TAB_ORDER', () => {
    it('contains exactly 4 tabs in correct order', () => {
      expect(TAB_ORDER).toEqual(['hero', 'diagnostico', 'validacion', 'contenido']);
      expect(TAB_ORDER).toHaveLength(4);
    });
  });
});
