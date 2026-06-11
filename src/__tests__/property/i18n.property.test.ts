import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { translations } from '../../i18n/translations';

/**
 * Property-based tests for i18n translation key completeness.
 * Validates: Requirements 10.1, 10.2
 */
describe('i18n translations — property-based tests', () => {
  const enKeys = Object.keys(translations.en);
  const esKeys = Object.keys(translations.es);

  describe('every key in en exists in es with a non-empty string value', () => {
    it('for any random key from en, it exists in es and has a non-empty value', () => {
      fc.assert(
        fc.property(fc.constantFrom(...enKeys), (key) => {
          const esValue = (translations.es as Record<string, string>)[key];
          expect(esValue).toBeDefined();
          expect(typeof esValue).toBe('string');
          expect(esValue.length).toBeGreaterThan(0);
        }),
        { numRuns: enKeys.length * 2 }
      );
    });
  });

  describe('every key in es exists in en with a non-empty string value', () => {
    it('for any random key from es, it exists in en and has a non-empty value', () => {
      fc.assert(
        fc.property(fc.constantFrom(...esKeys), (key) => {
          const enValue = (translations.en as Record<string, string>)[key];
          expect(enValue).toBeDefined();
          expect(typeof enValue).toBe('string');
          expect(enValue.length).toBeGreaterThan(0);
        }),
        { numRuns: esKeys.length * 2 }
      );
    });
  });

  describe('en and es have the same set of keys', () => {
    it('the key sets are identical (same length and same members)', () => {
      const enKeySet = new Set(enKeys);
      const esKeySet = new Set(esKeys);

      expect(enKeySet.size).toBe(esKeySet.size);

      fc.assert(
        fc.property(fc.constantFrom(...enKeys), (key) => {
          expect(esKeySet.has(key)).toBe(true);
        }),
        { numRuns: enKeys.length }
      );

      fc.assert(
        fc.property(fc.constantFrom(...esKeys), (key) => {
          expect(enKeySet.has(key)).toBe(true);
        }),
        { numRuns: esKeys.length }
      );
    });
  });
});
