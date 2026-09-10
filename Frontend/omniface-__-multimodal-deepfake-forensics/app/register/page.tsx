'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ShieldCheck, Lock, Mail, User, ArrowRight, AlertCircle, CheckCircle2, Loader2, Sparkles } from 'lucide-react';
import { authService } from '@/lib/api/auth';

export default function StandaloneRegisterPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTOS, setAgreeTOS] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    const user = authService.getCurrentUser();
    if (user) {
      router.replace('/dashboard');
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!name.trim() || name.trim().length < 2) {
      setErrorMessage('Please enter your full name.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }
    if (!password || password.length < 6) {
      setErrorMessage('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }
    if (!agreeTOS) {
      setErrorMessage('You must agree to the Terms of Service and Privacy Policy.');
      return;
    }

    setIsLoading(true);
    const res = await authService.register(name.trim(), email.trim(), password, confirmPassword);
    setIsLoading(false);

    if (res.success) {
      setSuccessMessage('Account created successfully! Launching dashboard...');
      setTimeout(() => {
        router.push('/dashboard');
      }, 600);
    } else {
      setErrorMessage(res.error || 'Failed to register account.');
    }
  };

  return (
    <div style={{
      position: 'relative',
      minHeight: '100vh',
      backgroundColor: '#06080D',
      color: '#FFFFFF',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      overflow: 'hidden',
    }}>
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
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at center, rgba(6,8,13,0.7) 0%, rgba(6,8,13,0.95) 100%)' }} />
      </div>

      {/* Main Card */}
      <div style={{
        position: 'relative',
        zIndex: 10,
        width: '100%',
        maxWidth: '460px',
        backgroundColor: 'rgba(13, 17, 26, 0.88)',
        backdropFilter: 'blur(24px)',
        border: '1px solid rgba(0, 229, 255, 0.25)',
        borderRadius: '20px',
        padding: 'clamp(28px, 4vw, 40px)',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.8), 0 0 30px rgba(0, 229, 255, 0.15)',
      }}>
        {/* Brand */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', textDecoration: 'none', marginBottom: '12px' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              backgroundColor: 'rgba(0, 229, 255, 0.12)',
              border: '1px solid rgba(0, 229, 255, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#00E5FF',
            }}>
              <ShieldCheck size={20} />
            </div>
            <span style={{ fontFamily: 'var(--f-display)', fontSize: '16px', fontWeight: 800, letterSpacing: '0.08em', color: '#FFFFFF' }}>
              OMNIFACE
            </span>
          </Link>

          <h1 style={{ fontFamily: 'var(--f-display)', fontSize: '22px', fontWeight: 800, color: '#FFFFFF', marginBottom: '6px' }}>
            CREATE FORENSIC ACCOUNT
          </h1>
          <p style={{ fontFamily: 'var(--f-sans)', fontSize: '13px', color: 'rgba(255, 255, 255, 0.6)' }}>
            Join the decentralized deepfake detection network
          </p>
        </div>

        {/* Alerts */}
        {errorMessage && (
          <div style={{
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
          }}>
            <AlertCircle size={15} style={{ flexShrink: 0 }} />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div style={{
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
          }}>
            <CheckCircle2 size={15} style={{ flexShrink: 0 }} />
            <span>{successMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={{ display: 'block', fontFamily: 'var(--f-display)', fontSize: '11px', fontWeight: 700, letterSpacing: '0.06em', color: 'rgba(255, 255, 255, 0.75)', textTransform: 'uppercase', marginBottom: '4px' }}>
              Full Name
            </label>
            <div style={{ position: 'relative' }}>
              <User size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255, 255, 255, 0.4)' }} />
              <input
                type="text"
                placeholder="Dr. Evelyn Vance"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isLoading}
                style={{
                  width: '100%',
                  backgroundColor: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: '8px',
                  padding: '10px 14px 10px 38px',
                  color: '#FFFFFF',
                  fontFamily: 'var(--f-sans)',
                  fontSize: '13px',
                  outline: 'none',
                }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontFamily: 'var(--f-display)', fontSize: '11px', fontWeight: 700, letterSpacing: '0.06em', color: 'rgba(255, 255, 255, 0.75)', textTransform: 'uppercase', marginBottom: '4px' }}>
              Email Address
            </label>
            <div style={{ position: 'relative' }}>
              <Mail size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255, 255, 255, 0.4)' }} />
              <input
                type="email"
                placeholder="investigator@agency.gov"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                style={{
                  width: '100%',
                  backgroundColor: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: '8px',
                  padding: '10px 14px 10px 38px',
                  color: '#FFFFFF',
                  fontFamily: 'var(--f-sans)',
                  fontSize: '13px',
                  outline: 'none',
                }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontFamily: 'var(--f-display)', fontSize: '11px', fontWeight: 700, letterSpacing: '0.06em', color: 'rgba(255, 255, 255, 0.75)', textTransform: 'uppercase', marginBottom: '4px' }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <Lock size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255, 255, 255, 0.4)' }} />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                style={{
                  width: '100%',
                  backgroundColor: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: '8px',
                  padding: '10px 14px 10px 38px',
                  color: '#FFFFFF',
                  fontFamily: 'var(--f-sans)',
                  fontSize: '13px',
                  outline: 'none',
                }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontFamily: 'var(--f-display)', fontSize: '11px', fontWeight: 700, letterSpacing: '0.06em', color: 'rgba(255, 255, 255, 0.75)', textTransform: 'uppercase', marginBottom: '4px' }}>
              Confirm Password
            </label>
            <div style={{ position: 'relative' }}>
              <Lock size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255, 255, 255, 0.4)' }} />
              <input
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={isLoading}
                style={{
                  width: '100%',
                  backgroundColor: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: '8px',
                  padding: '10px 14px 10px 38px',
                  color: '#FFFFFF',
                  fontFamily: 'var(--f-sans)',
                  fontSize: '13px',
                  outline: 'none',
                }}
              />
            </div>
          </div>

          {/* Checkbox */}
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', marginTop: '4px' }}>
            <input
              type="checkbox"
              id="tos-check"
              checked={agreeTOS}
              onChange={(e) => setAgreeTOS(e.target.checked)}
              style={{ marginTop: '2px', accentColor: '#00E5FF', cursor: 'pointer' }}
            />
            <label htmlFor="tos-check" style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.7)', cursor: 'pointer' }}>
              I agree to the <span style={{ color: '#00E5FF' }}>Terms of Service</span> and <span style={{ color: '#00E5FF' }}>Privacy Policy</span>.
            </label>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            style={{
              marginTop: '10px',
              width: '100%',
              padding: '12px',
              borderRadius: '8px',
              backgroundColor: '#00E5FF',
              border: 'none',
              color: '#06080D',
              fontFamily: 'var(--f-display)',
              fontSize: '12.5px',
              fontWeight: 800,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxShadow: '0 0 20px rgba(0, 229, 255, 0.35)',
            }}
          >
            {isLoading ? (
              <>
                <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />
                <span>CREATING ACCOUNT...</span>
              </>
            ) : (
              <>
                <span>CREATE ACCOUNT</span>
                <ArrowRight size={15} />
              </>
            )}
          </button>
        </form>

        {/* Switch Link */}
        <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid rgba(255, 255, 255, 0.08)', textAlign: 'center', fontSize: '12.5px', color: 'rgba(255, 255, 255, 0.6)' }}>
          Already have an account?{' '}
          <Link href="/login" style={{ color: '#00E5FF', fontWeight: 600, textDecoration: 'none' }}>
            LOG IN
          </Link>
        </div>
      </div>
    </div>
  );
}
