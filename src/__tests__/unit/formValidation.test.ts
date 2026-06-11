import { describe, it, expect } from 'vitest';
import { validateEmail, validateLinkedInUrl, validateMicroForm } from '../../utils/formValidation';

describe('formValidation', () => {
  describe('validateEmail', () => {
    it('accepts valid emails', () => {
      expect(validateEmail('test@example.com')).toBe(true);
      expect(validateEmail('user.name+tag@domain.co')).toBe(true);
    });

    it('rejects empty string', () => {
      expect(validateEmail('')).toBe(false);
    });

    it('rejects email without @ sign', () => {
      expect(validateEmail('no-at-sign')).toBe(false);
    });

    it('rejects email without local part', () => {
      expect(validateEmail('@no-local.com')).toBe(false);
    });

    it('rejects email without domain', () => {
      expect(validateEmail('no-domain@')).toBe(false);
    });

    it('rejects email with spaces', () => {
      expect(validateEmail('spaces @domain.com')).toBe(false);
    });

    it('rejects emails longer than 254 characters', () => {
      const longEmail = 'a'.repeat(244) + '@domain.com'; // 255 chars
      expect(longEmail.length).toBeGreaterThan(254);
      expect(validateEmail(longEmail)).toBe(false);
    });
  });

  describe('validateLinkedInUrl', () => {
    it('accepts empty string (optional field)', () => {
      expect(validateLinkedInUrl('')).toBe(true);
    });

    it('accepts valid LinkedIn URLs', () => {
      expect(validateLinkedInUrl('https://linkedin.com/in/johndoe')).toBe(true);
      expect(validateLinkedInUrl('https://www.linkedin.com/in/jane-doe')).toBe(true);
    });

    it('rejects non-https LinkedIn URLs', () => {
      expect(validateLinkedInUrl('http://linkedin.com/in/test')).toBe(false);
    });

    it('rejects non-LinkedIn URLs', () => {
      expect(validateLinkedInUrl('https://twitter.com/user')).toBe(false);
    });

    it('rejects non-URL strings', () => {
      expect(validateLinkedInUrl('not-a-url')).toBe(false);
    });

    it('rejects URLs longer than 200 characters', () => {
      const longUrl = 'https://linkedin.com/in/' + 'a'.repeat(180);
      expect(longUrl.length).toBeGreaterThan(200);
      expect(validateLinkedInUrl(longUrl)).toBe(false);
    });
  });

  describe('validateMicroForm', () => {
    it('returns valid result when all data is correct', () => {
      const result = validateMicroForm({
        bottleneck: 'Security compliance',
        email: 'test@example.com',
        linkedin: '',
      });
      expect(result).toEqual({
        valid: true,
        errors: { bottleneck: '', email: '', linkedin: '' },
      });
    });

    it('reports error when bottleneck is empty', () => {
      const result = validateMicroForm({
        bottleneck: '',
        email: 'test@example.com',
        linkedin: '',
      });
      expect(result.valid).toBe(false);
      expect(result.errors.bottleneck).not.toBe('');
    });

    it('reports error when email is invalid', () => {
      const result = validateMicroForm({
        bottleneck: 'Security compliance',
        email: 'invalid-email',
        linkedin: '',
      });
      expect(result.valid).toBe(false);
      expect(result.errors.email).not.toBe('');
    });

    it('reports error when LinkedIn URL is invalid', () => {
      const result = validateMicroForm({
        bottleneck: 'Security compliance',
        email: 'test@example.com',
        linkedin: 'not-a-url',
      });
      expect(result.valid).toBe(false);
      expect(result.errors.linkedin).not.toBe('');
    });

    it('accepts empty LinkedIn (optional field)', () => {
      const result = validateMicroForm({
        bottleneck: 'AI automation',
        email: 'valid@email.org',
        linkedin: '',
      });
      expect(result.valid).toBe(true);
      expect(result.errors.linkedin).toBe('');
    });

    it('reports multiple errors simultaneously', () => {
      const result = validateMicroForm({
        bottleneck: '  ',
        email: 'bad',
        linkedin: 'not-valid',
      });
      expect(result.valid).toBe(false);
      expect(result.errors.bottleneck).not.toBe('');
      expect(result.errors.email).not.toBe('');
      expect(result.errors.linkedin).not.toBe('');
    });
  });
});
