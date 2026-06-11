import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { getNextTab, isValidTabId, TAB_ORDER, type TabId } from '../../utils/tabNavigation';

/**
 * Property-based tests for tab navigation utilities.
 * Validates: Requirements 3.3, 3.5, 3.6, 3.7
 */
describe('tabNavigation — property-based tests', () => {
  const validTabIds: TabId[] = ['hero', 'diagnostico', 'validacion', 'contenido'];
  const tabArb = fc.constantFrom(...validTabIds);
  const directionArb = fc.constantFrom<'next' | 'prev'>('next', 'prev');

  describe('getNextTab always returns a valid TabId', () => {
    it('for any valid starting tab and any direction, result is a valid tab ID', () => {
      fc.assert(
        fc.property(tabArb, directionArb, (tab, direction) => {
          const result = getNextTab(tab, direction);
          expect(validTabIds).toContain(result);
        }),
        { numRuns: 100 }
      );
    });
  });

  describe('arbitrary sequence of next/prev always produces a valid tab', () => {
    it('applying a random sequence of directions always yields a valid tab ID', () => {
      fc.assert(
        fc.property(
          tabArb,
          fc.array(directionArb, { minLength: 1, maxLength: 20 }),
          (startTab, directions) => {
            let current: TabId = startTab;
            for (const dir of directions) {
              current = getNextTab(current, dir);
            }
            expect(validTabIds).toContain(current);
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe('cyclic navigation — 4 next steps returns to the same tab', () => {
    it('starting from any tab, 4 next steps returns to the starting tab', () => {
      fc.assert(
        fc.property(tabArb, (startTab) => {
          let current: TabId = startTab;
          for (let i = 0; i < 4; i++) {
            current = getNextTab(current, 'next');
          }
          expect(current).toBe(startTab);
        }),
        { numRuns: 100 }
      );
    });
  });

  describe('cyclic navigation — 4 prev steps returns to the same tab', () => {
    it('starting from any tab, 4 prev steps returns to the starting tab', () => {
      fc.assert(
        fc.property(tabArb, (startTab) => {
          let current: TabId = startTab;
          for (let i = 0; i < 4; i++) {
            current = getNextTab(current, 'prev');
          }
          expect(current).toBe(startTab);
        }),
        { numRuns: 100 }
      );
    });
  });

  describe('isValidTabId returns true only for exact valid IDs', () => {
    it('for any arbitrary string not in TAB_ORDER, isValidTabId returns false', () => {
      fc.assert(
        fc.property(
          fc.string().filter((s) => !TAB_ORDER.includes(s as TabId)),
          (arbitraryStr) => {
            expect(isValidTabId(arbitraryStr)).toBe(false);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('for all valid tab IDs, isValidTabId returns true', () => {
      fc.assert(
        fc.property(tabArb, (tab) => {
          expect(isValidTabId(tab)).toBe(true);
        }),
        { numRuns: 100 }
      );
    });
  });
});
