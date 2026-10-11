import { z } from 'zod';

/**
 * Zod validation schema for Login authentication form.
 */
export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, 'Email address is required')
    .email('Please enter a valid email address (e.g., analyst@forensics.ai)'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(6, 'Password must be at least 6 characters'),
});

export type LoginFormData = z.infer<typeof loginSchema>;

/**
 * Zod validation schema for Register account form.
 * Enforces strong forensic-grade password complexity:
 * - Minimum 8 characters
 * - Uppercase, lowercase, number, and special character
 */
export const registerSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, 'Full name is required')
      .min(2, 'Full name must be at least 2 characters')
      .max(80, 'Full name cannot exceed 80 characters'),
    email: z
      .string()
      .trim()
      .min(1, 'Email address is required')
      .email('Please enter a valid institutional or personal email address'),
    password: z
      .string()
      .min(1, 'Password is required')
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Must contain at least one uppercase letter (A-Z)')
      .regex(/[a-z]/, 'Must contain at least one lowercase letter (a-z)')
      .regex(/[0-9]/, 'Must contain at least one numerical digit (0-9)')
      .regex(/[^A-Za-z0-9]/, 'Must contain at least one special character (!@#$%^&*)'),
    confirmPassword: z
      .string()
      .min(1, 'Please confirm your password'),
    agreeTOS: z
      .boolean()
      .refine((val) => val === true, 'You must agree to the Terms of Service and Privacy Policy'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type RegisterFormData = z.infer<typeof registerSchema>;

/**
 * Password strength evaluation result.
 */
export interface PasswordStrengthResult {
  score: number; // 0 - 4
  label: 'Too Weak' | 'Weak' | 'Fair' | 'Strong' | 'Forensic Grade';
  color: string;
  checks: {
    minLength: boolean;
    hasUpper: boolean;
    hasLower: boolean;
    hasNumber: boolean;
    hasSpecial: boolean;
  };
}

/**
 * Evaluates real-time password strength and requirement checks.
 */
export function calculatePasswordStrength(password: string): PasswordStrengthResult {
  const checks = {
    minLength: password.length >= 8,
    hasUpper: /[A-Z]/.test(password),
    hasLower: /[a-z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSpecial: /[^A-Za-z0-9]/.test(password),
  };

  if (!password) {
    return {
      score: 0,
      label: 'Too Weak',
      color: 'rgba(255, 255, 255, 0.2)',
      checks,
    };
  }

  let passedCriteria = 0;
  if (checks.minLength) passedCriteria++;
  if (checks.hasUpper && checks.hasLower) passedCriteria++;
  if (checks.hasNumber) passedCriteria++;
  if (checks.hasSpecial) passedCriteria++;
  if (password.length >= 14) passedCriteria++;

  if (passedCriteria <= 1) {
    return { score: 1, label: 'Weak', color: '#EF4444', checks };
  }
  if (passedCriteria === 2) {
    return { score: 2, label: 'Fair', color: '#F59E0B', checks };
  }
  if (passedCriteria === 3 || passedCriteria === 4) {
    return { score: 3, label: 'Strong', color: '#00E5FF', checks };
  }
  return { score: 4, label: 'Forensic Grade', color: '#10B981', checks };
}
