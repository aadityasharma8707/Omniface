'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ShieldCheck, Lock, Mail, User, ArrowRight, AlertCircle, CheckCircle2, Loader2, Clock } from 'lucide-react';
import { authService } from '@/lib/api/auth';
import VerificationScreen from '@/components/VerificationScreen';
import PasswordStrengthMeter from '@/components/PasswordStrengthMeter';
import { registerSchema } from '@/lib/validations/auth';
import {
  HONEYPOT_FIELD_NAME,
  validateHoneypot,
  checkRateLimit,
  recordRateLimitAttempt,
  resetRateLimit,
} from '@/lib/security/botDefense';

export default function StandaloneRegisterPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTOS, setAgreeTOS] = useState(false);

  // Field-specific validation errors & touched tracking
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    agreeTOS?: string;
  }>({});
  const [touched, setTouched] = useState<{
    name?: boolean;
    email?: boolean;
    password?: boolean;
    confirmPassword?: boolean;
    agreeTOS?: boolean;
  }>({});

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [unverifiedEmail, setUnverifiedEmail] = useState<string | null>(null);

  // Spam & Bot Defense State
  const [honeypot, setHoneypot] = useState('');
  const [rateLimitCooldown, setRateLimitCooldown] = useState<number | null>(null);
  const formMountTimeRef = useRef<number>(Date.now());

  // Redirect if already logged in
  useEffect(() => {
    const user = authService.getCurrentUser();
    if (user) {
      window.location.href = '/dashboard';
    }
  }, []);

  // Cooldown countdown timer
  useEffect(() => {
    if (rateLimitCooldown === null || rateLimitCooldown <= 0) return;
    const timer = setInterval(() => {
      setRateLimitCooldown((prev) => {
        if (prev === null || prev <= 1) {
          clearInterval(timer);
          return null;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [rateLimitCooldown]);

  // Real-time inline field validation
  const validateField = (
    field: 'name' | 'email' | 'password' | 'confirmPassword' | 'agreeTOS',
    customValues?: Partial<{
      name: string;
      email: string;
      password: string;
      confirmPassword: string;
      agreeTOS: boolean;
    }>
  ) => {
    const currentValues = {
      name: customValues?.name !== undefined ? customValues.name : name,
      email: customValues?.email !== undefined ? customValues.email : email,
      password: customValues?.password !== undefined ? customValues.password : password,
      confirmPassword:
        customValues?.confirmPassword !== undefined ? customValues.confirmPassword : confirmPassword,
      agreeTOS: customValues?.agreeTOS !== undefined ? customValues.agreeTOS : agreeTOS,
    };

    const result = registerSchema.safeParse(currentValues);

    if (!result.success) {
      const fieldError = result.error.issues.find((issue) => issue.path.includes(field));
      setErrors((prev) => ({
        ...prev,
        [field]: fieldError ? fieldError.message : undefined,
      }));
    } else {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // 1. Honeypot & Bot Sub-millisecond fill check
    const botCheck = validateHoneypot(honeypot, formMountTimeRef.current);
    if (botCheck.isBot) {
      setErrorMessage(botCheck.reason || 'Automated activity detected. Submission denied.');
      return;
    }

    // 2. Sliding Window Rate Limiting Guard
    const rateLimit = checkRateLimit('auth:register', 4, 60000, 90000);
    if (!rateLimit.isAllowed) {
      setRateLimitCooldown(rateLimit.retryAfterSeconds);
      setErrorMessage(
        `Too many registration attempts. Please wait ${rateLimit.retryAfterSeconds}s before retrying.`
      );
      return;
    }

    // 3. Mark all fields as touched and run full Zod schema validation
    setTouched({
      name: true,
      email: true,
      password: true,
      confirmPassword: true,
      agreeTOS: true,
    });

    const validation = registerSchema.safeParse({
      name: name.trim(),
      email: email.trim(),
      password,
      confirmPassword,
      agreeTOS,
    });

    if (!validation.success) {
      const fieldErrors: typeof errors = {};
      for (const issue of validation.error.issues) {
        const fieldKey = issue.path[0] as keyof typeof errors;
        if (fieldKey && !fieldErrors[fieldKey]) {
          fieldErrors[fieldKey] = issue.message;
        }
      }
      setErrors(fieldErrors);
      setErrorMessage('Please resolve the highlighted validation errors below.');
      return;
    }

    // Record rate limit attempt
    recordRateLimitAttempt('auth:register');

    setIsLoading(true);
    const res = await authService.register(name.trim(), email.trim(), password, confirmPassword);
    setIsLoading(false);

    if (res.needsVerification) {
      setUnverifiedEmail(res.email || email.trim());
    } else if (res.success) {
      resetRateLimit('auth:register');
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 50);
    } else {
      setErrorMessage(res.error || 'Failed to register account.');
    }
  };

  const handleGoogleSignIn = async () => {
    setErrorMessage(null);
    setIsLoading(true);
    const res = await authService.loginWithGoogle();
    setIsLoading(false);

    if (res.success) {
      resetRateLimit('auth:register');
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 50);
    } else {
      setErrorMessage(res.error || 'Google sign-in failed. Please try again.');
    }
  };

  return (
    <div
      style={{
        position: 'relative',
        minHeight: '100vh',
        backgroundColor: '#06080D',
        color: '#FFFFFF',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'clamp(14px, 3vw, 24px)',
        overflow: 'hidden',
      }}
    >
      {/* Background Fluid Video */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
        <video
          autoPlay
          loop
          muted
          playsInline
          src="/assets/section2-bg.mp4"
          style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.35, filter: 'brightness(0.6)' }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(circle at center, rgba(6,8,13,0.7) 0%, rgba(6,8,13,0.95) 100%)',
          }}
        />
      </div>

      {/* Main Card */}
      <div
        style={{
          position: 'relative',
          zIndex: 10,
          width: '100%',
          maxWidth: '470px',
          backgroundColor: 'rgba(13, 17, 26, 0.88)',
          backdropFilter: 'blur(24px)',
          border: '1px solid rgba(0, 229, 255, 0.25)',
          borderRadius: '20px',
          padding: 'clamp(20px, 4vw, 36px)',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.8), 0 0 30px rgba(0, 229, 255, 0.15)',
        }}
      >
        {unverifiedEmail ? (
          <div>
            <div style={{ textAlign: 'center', marginBottom: '16px' }}>
              <Link
                href="/"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  textDecoration: 'none',
                  marginBottom: '8px',
                }}
              >
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    backgroundColor: 'rgba(0, 229, 255, 0.12)',
                    border: '1px solid rgba(0, 229, 255, 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#00E5FF',
                  }}
                >
                  <ShieldCheck size={18} />
                </div>
                <span
                  style={{
                    fontFamily: 'var(--f-display)',
                    fontSize: '15px',
                    fontWeight: 800,
                    letterSpacing: '0.08em',
                    color: '#FFFFFF',
                  }}
                >
                  OMNIFACE
                </span>
              </Link>
            </div>
            <VerificationScreen email={unverifiedEmail} loginHref="/login" allowResend={false} />
          </div>
        ) : (
          <>
            {/* Brand Header */}
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <Link
                href="/"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  textDecoration: 'none',
                  marginBottom: '12px',
                }}
              >
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '8px',
                    backgroundColor: 'rgba(0, 229, 255, 0.12)',
                    border: '1px solid rgba(0, 229, 255, 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#00E5FF',
                  }}
                >
                  <ShieldCheck size={20} />
                </div>
                <span
                  style={{
                    fontFamily: 'var(--f-display)',
                    fontSize: '16px',
                    fontWeight: 800,
                    letterSpacing: '0.08em',
                    color: '#FFFFFF',
                  }}
                >
                  OMNIFACE
                </span>
              </Link>

              <h1
                style={{
                  fontFamily: 'var(--f-display)',
                  fontSize: '22px',
                  fontWeight: 800,
                  color: '#FFFFFF',
                  marginBottom: '6px',
                }}
              >
                CREATE FORENSIC ACCOUNT
              </h1>
              <p style={{ fontFamily: 'var(--f-sans)', fontSize: '13px', color: 'rgba(255, 255, 255, 0.6)' }}>
                Join the decentralized deepfake detection network
              </p>
            </div>

            {/* Error Message Alert */}
            {errorMessage && (
              <div
                style={{
                  backgroundColor: 'rgba(239, 68, 68, 0.12)',
                  border: '1px solid rgba(239, 68, 68, 0.35)',
                  borderRadius: '8px',
                  padding: '10px 14px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  color: '#F87171',
                  fontSize: '12.5px',
                  marginBottom: '16px',
                }}
              >
                <AlertCircle size={15} style={{ flexShrink: 0 }} />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Rate Limit Cooldown Notice */}
            {rateLimitCooldown !== null && rateLimitCooldown > 0 && (
              <div
                style={{
                  backgroundColor: 'rgba(245, 158, 11, 0.12)',
                  border: '1px solid rgba(245, 158, 11, 0.35)',
                  borderRadius: '8px',
                  padding: '10px 14px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  color: '#FBBF24',
                  fontSize: '12.5px',
                  marginBottom: '16px',
                }}
              >
                <Clock size={15} style={{ flexShrink: 0 }} />
                <span>Registration rate limit engaged. Unlocking in {rateLimitCooldown}s...</span>
              </div>
            )}

            {successMessage && (
              <div
                style={{
                  backgroundColor: 'rgba(16, 185, 129, 0.12)',
                  border: '1px solid rgba(16, 185, 129, 0.35)',
                  borderRadius: '8px',
                  padding: '10px 14px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  color: '#34D399',
                  fontSize: '12.5px',
                  marginBottom: '16px',
                }}
              >
                <CheckCircle2 size={15} style={{ flexShrink: 0 }} />
                <span>{successMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {/* Invisible Bot Honeypot Field */}
              <div style={{ position: 'absolute', opacity: 0, pointerEvents: 'none', height: 0, width: 0, overflow: 'hidden' }}>
                <input
                  type="text"
                  name={HONEYPOT_FIELD_NAME}
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                />
              </div>

              {/* Full Name */}
              <div>
                <label
                  style={{
                    display: 'block',
                    fontFamily: 'var(--f-display)',
                    fontSize: '11px',
                    fontWeight: 700,
                    letterSpacing: '0.06em',
                    color: 'rgba(255, 255, 255, 0.88)',
                    textTransform: 'uppercase',
                    marginBottom: '4px',
                  }}
                >
                  Full Name
                </label>
                <div style={{ position: 'relative' }}>
                  <User
                    size={15}
                    style={{
                      position: 'absolute',
                      left: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: errors.name ? '#EF4444' : '#94A3B8',
                    }}
                  />
                  <input
                    type="text"
                    placeholder="Dr. Evelyn Vance"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (touched.name) validateField('name', { name: e.target.value });
                    }}
                    onBlur={() => {
                      setTouched((prev) => ({ ...prev, name: true }));
                      validateField('name');
                    }}
                    disabled={isLoading || (rateLimitCooldown !== null && rateLimitCooldown > 0)}
                    style={{
                      width: '100%',
                      backgroundColor: 'rgba(255, 255, 255, 0.04)',
                      border: errors.name
                        ? '1px solid rgba(239, 68, 68, 0.7)'
                        : '1px solid rgba(255, 255, 255, 0.12)',
                      borderRadius: '8px',
                      padding: '10px 14px 10px 38px',
                      color: '#FFFFFF',
                      fontFamily: 'var(--f-sans)',
                      fontSize: '13px',
                      outline: 'none',
                      transition: 'border-color 0.2s ease',
                    }}
                  />
                </div>
                {errors.name && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginTop: '4px', color: '#F87171', fontSize: '11px' }}>
                    <AlertCircle size={12} style={{ flexShrink: 0 }} />
                    <span>{errors.name}</span>
                  </div>
                )}
              </div>

              {/* Email Address */}
              <div>
                <label
                  style={{
                    display: 'block',
                    fontFamily: 'var(--f-display)',
                    fontSize: '11px',
                    fontWeight: 700,
                    letterSpacing: '0.06em',
                    color: 'rgba(255, 255, 255, 0.88)',
                    textTransform: 'uppercase',
                    marginBottom: '4px',
                  }}
                >
                  Email Address
                </label>
                <div style={{ position: 'relative' }}>
                  <Mail
                    size={15}
                    style={{
                      position: 'absolute',
                      left: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: errors.email ? '#EF4444' : '#94A3B8',
                    }}
                  />
                  <input
                    type="email"
                    placeholder="investigator@agency.gov"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (touched.email) validateField('email', { email: e.target.value });
                    }}
                    onBlur={() => {
                      setTouched((prev) => ({ ...prev, email: true }));
                      validateField('email');
                    }}
                    disabled={isLoading || (rateLimitCooldown !== null && rateLimitCooldown > 0)}
                    style={{
                      width: '100%',
                      backgroundColor: 'rgba(255, 255, 255, 0.04)',
                      border: errors.email
                        ? '1px solid rgba(239, 68, 68, 0.7)'
                        : '1px solid rgba(255, 255, 255, 0.12)',
                      borderRadius: '8px',
                      padding: '10px 14px 10px 38px',
                      color: '#FFFFFF',
                      fontFamily: 'var(--f-sans)',
                      fontSize: '13px',
                      outline: 'none',
                      transition: 'border-color 0.2s ease',
                    }}
                  />
                </div>
                {errors.email && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginTop: '4px', color: '#F87171', fontSize: '11px' }}>
                    <AlertCircle size={12} style={{ flexShrink: 0 }} />
                    <span>{errors.email}</span>
                  </div>
                )}
              </div>

              {/* Password */}
              <div>
                <label
                  style={{
                    display: 'block',
                    fontFamily: 'var(--f-display)',
                    fontSize: '11px',
                    fontWeight: 700,
                    letterSpacing: '0.06em',
                    color: 'rgba(255, 255, 255, 0.88)',
                    textTransform: 'uppercase',
                    marginBottom: '4px',
                  }}
                >
                  Password
                </label>
                <div style={{ position: 'relative' }}>
                  <Lock
                    size={15}
                    style={{
                      position: 'absolute',
                      left: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: errors.password ? '#EF4444' : '#94A3B8',
                    }}
                  />
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (touched.password) validateField('password', { password: e.target.value });
                    }}
                    onBlur={() => {
                      setTouched((prev) => ({ ...prev, password: true }));
                      validateField('password');
                    }}
                    disabled={isLoading || (rateLimitCooldown !== null && rateLimitCooldown > 0)}
                    style={{
                      width: '100%',
                      backgroundColor: 'rgba(255, 255, 255, 0.04)',
                      border: errors.password
                        ? '1px solid rgba(239, 68, 68, 0.7)'
                        : '1px solid rgba(255, 255, 255, 0.12)',
                      borderRadius: '8px',
                      padding: '10px 14px 10px 38px',
                      color: '#FFFFFF',
                      fontFamily: 'var(--f-sans)',
                      fontSize: '13px',
                      outline: 'none',
                      transition: 'border-color 0.2s ease',
                    }}
                  />
                </div>
                {errors.password && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginTop: '4px', color: '#F87171', fontSize: '11px' }}>
                    <AlertCircle size={12} style={{ flexShrink: 0 }} />
                    <span>{errors.password}</span>
                  </div>
                )}

                {/* Password Strength Meter */}
                <PasswordStrengthMeter password={password} />
              </div>

              {/* Confirm Password */}
              <div>
                <label
                  style={{
                    display: 'block',
                    fontFamily: 'var(--f-display)',
                    fontSize: '11px',
                    fontWeight: 700,
                    letterSpacing: '0.06em',
                    color: 'rgba(255, 255, 255, 0.88)',
                    textTransform: 'uppercase',
                    marginBottom: '4px',
                  }}
                >
                  Confirm Password
                </label>
                <div style={{ position: 'relative' }}>
                  <Lock
                    size={15}
                    style={{
                      position: 'absolute',
                      left: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: errors.confirmPassword ? '#EF4444' : '#94A3B8',
                    }}
                  />
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      if (touched.confirmPassword) {
                        validateField('confirmPassword', { confirmPassword: e.target.value });
                      }
                    }}
                    onBlur={() => {
                      setTouched((prev) => ({ ...prev, confirmPassword: true }));
                      validateField('confirmPassword');
                    }}
                    disabled={isLoading || (rateLimitCooldown !== null && rateLimitCooldown > 0)}
                    style={{
                      width: '100%',
                      backgroundColor: 'rgba(255, 255, 255, 0.04)',
                      border: errors.confirmPassword
                        ? '1px solid rgba(239, 68, 68, 0.7)'
                        : '1px solid rgba(255, 255, 255, 0.12)',
                      borderRadius: '8px',
                      padding: '10px 14px 10px 38px',
                      color: '#FFFFFF',
                      fontFamily: 'var(--f-sans)',
                      fontSize: '13px',
                      outline: 'none',
                      transition: 'border-color 0.2s ease',
                    }}
                  />
                </div>
                {errors.confirmPassword && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginTop: '4px', color: '#F87171', fontSize: '11px' }}>
                    <AlertCircle size={12} style={{ flexShrink: 0 }} />
                    <span>{errors.confirmPassword}</span>
                  </div>
                )}
              </div>

              {/* Checkbox TOS */}
              <div>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', marginTop: '4px' }}>
                  <input
                    type="checkbox"
                    id="tos-check"
                    checked={agreeTOS}
                    onChange={(e) => {
                      setAgreeTOS(e.target.checked);
                      if (touched.agreeTOS) validateField('agreeTOS', { agreeTOS: e.target.checked });
                    }}
                    disabled={isLoading || (rateLimitCooldown !== null && rateLimitCooldown > 0)}
                    style={{ marginTop: '2px', accentColor: '#00E5FF', cursor: 'pointer' }}
                  />
                  <label htmlFor="tos-check" style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.7)', cursor: 'pointer' }}>
                    I agree to the{' '}
                    <Link
                      href="/terms"
                      className="text-cyan-400 underline underline-offset-4 hover:text-cyan-300"
                      onClick={(e) => e.stopPropagation()}
                    >
                      Terms of Service
                    </Link>{' '}
                    and{' '}
                    <Link
                      href="/privacy"
                      className="text-cyan-400 underline underline-offset-4 hover:text-cyan-300"
                      onClick={(e) => e.stopPropagation()}
                    >
                      Privacy Policy
                    </Link>
                    .
                  </label>
                </div>
                {errors.agreeTOS && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginTop: '4px', color: '#F87171', fontSize: '11px' }}>
                    <AlertCircle size={12} style={{ flexShrink: 0 }} />
                    <span>{errors.agreeTOS}</span>
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading || (rateLimitCooldown !== null && rateLimitCooldown > 0)}
                style={{
                  marginTop: '10px',
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  backgroundColor:
                    rateLimitCooldown !== null && rateLimitCooldown > 0 ? '#4B5563' : '#00E5FF',
                  border: 'none',
                  color: '#06080D',
                  fontFamily: 'var(--f-display)',
                  fontSize: '12.5px',
                  fontWeight: 800,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  cursor:
                    isLoading || (rateLimitCooldown !== null && rateLimitCooldown > 0)
                      ? 'not-allowed'
                      : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow:
                    rateLimitCooldown !== null && rateLimitCooldown > 0
                      ? 'none'
                      : '0 0 20px rgba(0, 229, 255, 0.35)',
                  transition: 'all 0.2s ease',
                }}
              >
                {isLoading ? (
                  <>
                    <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />
                    <span>CREATING ACCOUNT...</span>
                  </>
                ) : rateLimitCooldown !== null && rateLimitCooldown > 0 ? (
                  <>
                    <Clock size={16} />
                    <span>RATE LIMITED ({rateLimitCooldown}S)</span>
                  </>
                ) : (
                  <>
                    <span>CREATE ACCOUNT</span>
                    <ArrowRight size={15} />
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '18px 0 14px 0' }}>
              <div style={{ flex: 1, height: '1px', backgroundColor: 'rgba(255, 255, 255, 0.1)' }} />
              <span style={{ fontSize: '11px', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                OR
              </span>
              <div style={{ flex: 1, height: '1px', backgroundColor: 'rgba(255, 255, 255, 0.1)' }} />
            </div>

            {/* Google Sign-In Button */}
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={isLoading || (rateLimitCooldown !== null && rateLimitCooldown > 0)}
              style={{
                width: '100%',
                padding: '11px 16px',
                borderRadius: '8px',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.14)',
                color: '#FFFFFF',
                fontFamily: 'var(--f-sans)',
                fontSize: '13px',
                fontWeight: 600,
                cursor:
                  isLoading || (rateLimitCooldown !== null && rateLimitCooldown > 0)
                    ? 'not-allowed'
                    : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                transition: 'all 0.2s ease',
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>

            {/* Switch Link */}
            <div
              style={{
                marginTop: '20px',
                paddingTop: '16px',
                borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                textAlign: 'center',
                fontSize: '12.5px',
                color: 'rgba(255, 255, 255, 0.6)',
              }}
            >
              Already have an account?{' '}
              <Link href="/login" style={{ color: '#00E5FF', fontWeight: 600, textDecoration: 'none' }}>
                LOG IN
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
