import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { validateEmail, validateLinkedInUrl, validateMicroForm } from '../../utils/formValidation';

/**
 * Property-based tests for form validation utilities.
 * Validates: Requirements 8.4, 8.5, 8.6
 */
describe('formValidation — property-based tests', () => {
  describe('validateEmail', () => {
    it('never crashes for any arbitrary string', () => {
      fc.assert(
        fc.property(fc.string(), (input) => {
          const result = validateEmail(input);
          expect(typeof result).toBe('boolean');
        }),
        { numRuns: 100 }
      );
    });

    it('well-formed emails pass validation when length <= 254', () => {
      fc.assert(
        fc.property(fc.emailAddress(), (email) => {
          if (email.length <= 254) {
            expect(validateEmail(email)).toBe(true);
          }
        }),
        { numRuns: 100 }
      );
    });

    it('results are deterministic — calling twice returns the same result', () => {
      fc.assert(
        fc.property(fc.string(), (input) => {
          const first = validateEmail(input);
          const second = validateEmail(input);
          expect(first).toBe(second);
        }),
        { numRuns: 100 }
      );
    });
  });

  describe('validateLinkedInUrl', () => {
    it('never crashes for any arbitrary string', () => {
      fc.assert(
        fc.property(fc.string(), (input) => {
          const result = validateLinkedInUrl(input);
          expect(typeof result).toBe('boolean');
        }),
        { numRuns: 100 }
      );
    });

    it('well-formed LinkedIn URLs pass validation', () => {
      fc.assert(
        fc.property(
          fc.stringMatching(/^[a-z0-9\-]{1,150}$/),
          (slug) => {
            const url = `https://linkedin.com/in/${slug}`;
            if (url.length <= 200) {
              expect(validateLinkedInUrl(url)).toBe(true);
            }
          }
        ),
        { numRuns: 100 }
      );
    });

    it('empty string always passes validation', () => {
      expect(validateLinkedInUrl('')).toBe(true);
    });
  });

  describe('validateMicroForm', () => {
    it('returns valid=true with empty errors when all fields are valid', () => {
      fc.assert(
        fc.property(
          fc.record({
            bottleneck: fc.string({ minLength: 1 }).filter((s) => s.trim().length > 0),
            email: fc.emailAddress().filter((e) => e.length <= 254),
            linkedin: fc.constant(''),
          }),
          (data) => {
            const result = validateMicroForm(data);
            expect(result.valid).toBe(true);
            expect(result.errors.bottleneck).toBe('');
            expect(result.errors.email).toBe('');
            expect(result.errors.linkedin).toBe('');
          }
        ),
        { numRuns: 100 }
      );
    });

    it('returns valid=false when any field is invalid', () => {
      // Invalid email makes form invalid
      fc.assert(
        fc.property(
          fc.record({
            bottleneck: fc.string({ minLength: 1 }).filter((s) => s.trim().length > 0),
            email: fc.constant('not-an-email'),
            linkedin: fc.constant(''),
          }),
          (data) => {
            const result = validateMicroForm(data);
            expect(result.valid).toBe(false);
            expect(result.errors.email).not.toBe('');
          }
        ),
        { numRuns: 100 }
      );

      // Empty bottleneck makes form invalid
      fc.assert(
        fc.property(
          fc.record({
            bottleneck: fc.constant('   '),
            email: fc.emailAddress().filter((e) => e.length <= 254),
            linkedin: fc.constant(''),
          }),
          (data) => {
            const result = validateMicroForm(data);
            expect(result.valid).toBe(false);
            expect(result.errors.bottleneck).not.toBe('');
          }
        ),
        { numRuns: 100 }
      );

      // Invalid LinkedIn makes form invalid
      fc.assert(
        fc.property(
          fc.record({
            bottleneck: fc.string({ minLength: 1 }).filter((s) => s.trim().length > 0),
            email: fc.emailAddress().filter((e) => e.length <= 254),
            linkedin: fc.constant('not-a-valid-linkedin-url'),
          }),
          (data) => {
            const result = validateMicroForm(data);
            expect(result.valid).toBe(false);
            expect(result.errors.linkedin).not.toBe('');
          }
        ),
        { numRuns: 100 }
      );
    });
  });
});
