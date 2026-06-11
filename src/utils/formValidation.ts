export interface MicroFormData {
  bottleneck: string;
  email: string;
  linkedin: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: Record<keyof MicroFormData, string>;
}

/**
 * Validates an email address using a simplified RFC 5322 pattern.
 * Returns true if the email matches the pattern AND length ≤ 254 characters.
 */
export function validateEmail(email: string): boolean {
  if (email.length > 254) return false;
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return pattern.test(email);
}

/**
 * Validates a LinkedIn profile URL.
 * Returns true if url is empty (optional field) OR matches the LinkedIn /in/ pattern
 * and length ≤ 200 characters.
 */
export function validateLinkedInUrl(url: string): boolean {
  if (url === '') return true;
  if (url.length > 200) return false;
  const pattern = /^https:\/\/(www\.)?linkedin\.com\/in\/.+$/;
  return pattern.test(url);
}

/**
 * Validates the complete micro form data.
 * Returns a ValidationResult with valid=true only when ALL fields pass,
 * and per-field error messages for invalid fields (empty string for valid ones).
 */
export function validateMicroForm(data: MicroFormData): ValidationResult {
  const errors: Record<keyof MicroFormData, string> = {
    bottleneck: '',
    email: '',
    linkedin: '',
  };

  if (!data.bottleneck.trim()) {
    errors.bottleneck = 'Please select a bottleneck.';
  }

  if (!validateEmail(data.email)) {
    errors.email = 'Please enter a valid email.';
  }

  if (!validateLinkedInUrl(data.linkedin)) {
    errors.linkedin = 'Please enter a valid LinkedIn URL.';
  }

  const valid = errors.bottleneck === '' && errors.email === '' && errors.linkedin === '';

  return { valid, errors };
}
