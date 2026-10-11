'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ShieldCheck, Lock, Mail, ArrowRight, AlertCircle, CheckCircle2, Loader2, Sparkles, Clock } from 'lucide-react';
import { authService } from '@/lib/api/auth';
import VerificationScreen from '@/components/VerificationScreen';
import { loginSchema } from '@/lib/validations/auth';
import {
  HONEYPOT_FIELD_NAME,
  validateHoneypot,
  checkRateLimit,
  recordRateLimitAttempt,
  resetRateLimit,
} from '@/lib/security/botDefense';

export default function StandaloneLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [unverifiedEmail, setUnverifiedEmail] = useState<string | null>(null);

  // Field-specific validation errors & touched states
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [touched, setTouched] = useState<{ email?: boolean; password?: boolean }>({});

  // Bot & Spam Protection State
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
  const validateField = (field: 'email' | 'password', val: string) => {
    const dataToValidate = {
      email: field === 'email' ? val : email,
      password: field === 'password' ? val : password,
    };
    const result = loginSchema.safeParse(dataToValidate);

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

  const handleEmailChange = (val: string) => {
    setEmail(val);
    if (touched.email) {
      validateField('email', val);
    }
  };

  const handlePasswordChange = (val: string) => {
    setPassword(val);
    if (touched.password) {
      validateField('password', val);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // 1. Spam & Bot Protection: Honeypot & latency check
    const botCheck = validateHoneypot(honeypot, formMountTimeRef.current);
    if (botCheck.isBot) {
      setErrorMessage(botCheck.reason || 'Automated activity detected. Submission denied.');
      return;
    }

    // 2. Client-side Rate Limiting Guard
    const rateLimit = checkRateLimit('auth:login', 5, 60000, 60000);
    if (!rateLimit.isAllowed) {
      setRateLimitCooldown(rateLimit.retryAfterSeconds);
      setErrorMessage(
        `Too many login attempts. Rate limit engaged. Please wait ${rateLimit.retryAfterSeconds}s before retrying.`
      );
      return;
    }

    // 3. Mark all fields as touched and run full Zod schema validation
    setTouched({ email: true, password: true });
    const validation = loginSchema.safeParse({ email: email.trim(), password });

    if (!validation.success) {
      const formattedErrors: { email?: string; password?: string } = {};
      for (const issue of validation.error.issues) {
        if (issue.path.includes('email') && !formattedErrors.email) {
          formattedErrors.email = issue.message;
        }
        if (issue.path.includes('password') && !formattedErrors.password) {
          formattedErrors.password = issue.message;
        }
      }
      setErrors(formattedErrors);
      setErrorMessage('Please resolve the highlighted validation errors below.');
      return;
    }

    // Record rate limit attempt
    recordRateLimitAttempt('auth:login');

    setIsLoading(true);
    const res = await authService.login(email.trim(), password);
    setIsLoading(false);

    if (res.needsVerification) {
      setUnverifiedEmail(res.email || email.trim());
    } else if (res.success) {
      resetRateLimit('auth:login');
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 50);
    } else {
      setErrorMessage(res.error || 'Invalid credentials.');
    }
  };

  const handleGoogleSignIn = async () => {
    setErrorMessage(null);
    setIsLoading(true);
    const res = await authService.loginWithGoogle();
    setIsLoading(false);

    if (res.success) {
      resetRateLimit('auth:login');
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 50);
    } else {
      setErrorMessage(res.error || 'Google sign-in failed. Please try again.');
    }
  };

  const handleForgotPassword = async () => {
    setErrorMessage(null);
    setSuccessMessage(null);

    // Validate email field specifically
    const emailResult = loginSchema.shape.email.safeParse(email.trim());
    if (!emailResult.success) {
      setTouched((prev) => ({ ...prev, email: true }));
      setErrors((prev) => ({ ...prev, email: emailResult.error.issues[0]?.message }));
      setErrorMessage('Please enter a valid email address to request password reset.');
      return;
    }

    const rateLimit = checkRateLimit('auth:reset', 3, 60000, 120000);
    if (!rateLimit.isAllowed) {
      setErrorMessage(
        `Too many password reset requests. Please wait ${rateLimit.retryAfterSeconds}s before retrying.`
      );
      return;
    }
    recordRateLimitAttempt('auth:reset');

    setIsLoading(true);
    const res = await authService.sendPasswordReset(email.trim());
    setIsLoading(false);

    if (res.success) {
      setSuccessMessage('Password reset email sent. Please check your inbox.');
    } else {
      setErrorMessage(res.error || 'Failed to send password reset email. Please try again.');
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
          maxWidth: '440px',
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
            <VerificationScreen
              email={unverifiedEmail}
              onLoginClick={() => {
                setUnverifiedEmail(null);
                setErrorMessage(null);
              }}
              loginHref="/login"
              allowResend={false}
            />
          </div>
        ) : (
          <>
            {/* Brand Header */}
            <div style={{ textAlign: 'center', marginBottom: '28px' }}>
              <Link
                href="/"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  textDecoration: 'none',
                  marginBottom: '14px',
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
                  fontSize: '24px',
                  fontWeight: 800,
                  color: '#FFFFFF',
                  marginBottom: '6px',
                }}
              >
                VERIFY WHAT&apos;S REAL.
              </h1>
              <p style={{ fontFamily: 'var(--f-sans)', fontSize: '13px', color: 'rgba(255, 255, 255, 0.6)' }}>
                Sign in to access the deepfake forensic workspace
              </p>
            </div>

            {/* Top Error Alerts */}
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
                  marginBottom: '18px',
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
                  marginBottom: '18px',
                }}
              >
                <Clock size={15} style={{ flexShrink: 0 }} />
                <span>Rate limit engaged. Unlocking in {rateLimitCooldown}s...</span>
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
                  marginBottom: '18px',
                }}
              >
                <CheckCircle2 size={15} style={{ flexShrink: 0 }} />
                <span>{successMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Bot Honeypot Input (Invisible to humans, trapped by spam bots) */}
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

              {/* Email Field with Inline Error */}
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
                    marginBottom: '6px',
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
                    placeholder="analyst@forensics.ai"
                    value={email}
                    onChange={(e) => handleEmailChange(e.target.value)}
                    onBlur={() => {
                      setTouched((prev) => ({ ...prev, email: true }));
                      validateField('email', email);
                    }}
                    disabled={isLoading || (rateLimitCooldown !== null && rateLimitCooldown > 0)}
                    style={{
                      width: '100%',
                      backgroundColor: 'rgba(255, 255, 255, 0.04)',
                      border: errors.email
                        ? '1px solid rgba(239, 68, 68, 0.7)'
                        : '1px solid rgba(255, 255, 255, 0.12)',
                      borderRadius: '8px',
                      padding: '11px 14px 11px 38px',
                      color: '#FFFFFF',
                      fontFamily: 'var(--f-sans)',
                      fontSize: '13.5px',
                      outline: 'none',
                      transition: 'border-color 0.2s ease',
                    }}
                  />
                </div>
                {errors.email && (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px',
                      marginTop: '5px',
                      color: '#F87171',
                      fontSize: '11.5px',
                    }}
                  >
                    <AlertCircle size={12} style={{ flexShrink: 0 }} />
                    <span>{errors.email}</span>
                  </div>
                )}
              </div>

              {/* Password Field with Inline Error */}
              <div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '6px',
                  }}
                >
                  <label
                    style={{
                      fontFamily: 'var(--f-display)',
                      fontSize: '11px',
                      fontWeight: 700,
                      letterSpacing: '0.06em',
                      color: 'rgba(255, 255, 255, 0.88)',
                      textTransform: 'uppercase',
                    }}
                  >
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    disabled={isLoading}
                    style={{
                      background: 'none',
                      border: 'none',
                      fontSize: '11px',
                      color: '#00E5FF',
                      cursor: isLoading ? 'not-allowed' : 'pointer',
                      padding: 0,
                    }}
                  >
                    Forgot Password?
                  </button>
                </div>
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
                    onChange={(e) => handlePasswordChange(e.target.value)}
                    onBlur={() => {
                      setTouched((prev) => ({ ...prev, password: true }));
                      validateField('password', password);
                    }}
                    disabled={isLoading || (rateLimitCooldown !== null && rateLimitCooldown > 0)}
                    style={{
                      width: '100%',
                      backgroundColor: 'rgba(255, 255, 255, 0.04)',
                      border: errors.password
                        ? '1px solid rgba(239, 68, 68, 0.7)'
                        : '1px solid rgba(255, 255, 255, 0.12)',
                      borderRadius: '8px',
                      padding: '11px 14px 11px 38px',
                      color: '#FFFFFF',
                      fontFamily: 'var(--f-sans)',
                      fontSize: '13.5px',
                      outline: 'none',
                      transition: 'border-color 0.2s ease',
                    }}
                  />
                </div>
                {errors.password && (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px',
                      marginTop: '5px',
                      color: '#F87171',
                      fontSize: '11.5px',
                    }}
                  >
                    <AlertCircle size={12} style={{ flexShrink: 0 }} />
                    <span>{errors.password}</span>
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading || (rateLimitCooldown !== null && rateLimitCooldown > 0)}
                style={{
                  marginTop: '8px',
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
                    <span>LOGGING IN...</span>
                  </>
                ) : rateLimitCooldown !== null && rateLimitCooldown > 0 ? (
                  <>
                    <Clock size={16} />
                    <span>RATE LIMITED ({rateLimitCooldown}S)</span>
                  </>
                ) : (
                  <>
                    <span>LOG IN</span>
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

            {/* Demo Fast Track */}
            <div style={{ marginTop: '16px', textAlign: 'center' }}>
              <button
                type="button"
                onClick={() => {
                  setEmail('analyst@omniface.ai');
                  setPassword('password123');
                  setErrors({});
                  setErrorMessage(null);
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'rgba(0, 229, 255, 0.8)',
                  fontSize: '11px',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <Sparkles size={11} />
                <span>Use Demo Investigator Credentials</span>
              </button>
            </div>

            {/* Switch Link */}
            <div
              style={{
                marginTop: '24px',
                paddingTop: '16px',
                borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                textAlign: 'center',
                fontSize: '12.5px',
                color: 'rgba(255, 255, 255, 0.6)',
              }}
            >
              Don&apos;t have an account?{' '}
              <Link href="/register" style={{ color: '#00E5FF', fontWeight: 600, textDecoration: 'none' }}>
                CREATE ACCOUNT
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
