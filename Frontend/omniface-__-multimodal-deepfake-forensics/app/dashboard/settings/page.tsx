'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  User, 
  Mail, 
  Lock, 
  Bell, 
  Moon, 
  Sun,
  Zap,
  AlertTriangle,
  Palette,
  Check,
  ShieldCheck, 
  LogOut, 
  CheckCircle2, 
  Sliders,
  Cpu
} from 'lucide-react';
import { authService, UserProfile } from '@/lib/api/auth';
import { useTheme, ThemeMode, THEMES } from '@/lib/theme/ThemeContext';

export default function SettingsPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  
  // Settings Form States
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const { theme, setTheme } = useTheme();
  const [notifications, setNotifications] = useState(true);
  
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    const u = authService.getCurrentUser();
    if (u) {
      setUser(u);
      setName(u.name || '');
      setEmail(u.email || '');
    }
  }, []);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (user) {
      const updated = { ...user, name, email };
      localStorage.setItem('omniface_auth_user', JSON.stringify(updated));
      setUser(updated);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2500);
    }
  };

  const handleLogout = async () => {
    await authService.logout();
    router.replace('/');
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '32px' }}>
      
      {/* Header */}
      <div>
        <h1 style={{
          fontFamily: 'var(--f-display)',
          fontSize: 'clamp(24px, 3vw, 32px)',
          fontWeight: 800,
          letterSpacing: '-0.02em',
          color: '#FFFFFF',
          marginBottom: '6px',
        }}>
          Account &amp; Engine Settings
        </h1>
        <p style={{
          fontFamily: 'var(--f-sans)',
          fontSize: '14px',
          color: 'rgba(255, 255, 255, 0.65)',
        }}>
          Manage your forensic investigator credentials and detection preferences.
        </p>
      </div>

      {savedSuccess && (
        <div style={{
          backgroundColor: 'rgba(16, 185, 129, 0.12)',
          border: '1px solid rgba(16, 185, 129, 0.35)',
          borderRadius: '8px',
          padding: '12px 16px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          color: '#34D399',
          fontSize: '13.5px',
        }}>
          <CheckCircle2 size={18} />
          <span>Preferences updated successfully.</span>
        </div>
      )}

      {/* 1. Profile Information */}
      <div style={{
        backgroundColor: 'rgba(13, 17, 26, 0.85)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '16px',
        padding: 'clamp(16px, 3vw, 24px)',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '14px' }}>
          <User size={18} color="#00E5FF" />
          <h2 style={{ fontFamily: 'var(--f-display)', fontSize: '16px', fontWeight: 700, color: '#FFFFFF' }}>
            Profile &amp; Identity
          </h2>
        </div>

        <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontFamily: 'var(--f-display)', fontSize: '12px', fontWeight: 600, color: 'rgba(255, 255, 255, 0.7)', marginBottom: '6px' }}>
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{
                width: '100%',
                backgroundColor: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: '8px',
                padding: '10px 14px',
                color: '#FFFFFF',
                fontFamily: 'var(--f-sans)',
                fontSize: '14px',
                outline: 'none',
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontFamily: 'var(--f-display)', fontSize: '12px', fontWeight: 600, color: 'rgba(255, 255, 255, 0.7)', marginBottom: '6px' }}>
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: '100%',
                backgroundColor: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: '8px',
                padding: '10px 14px',
                color: '#FFFFFF',
                fontFamily: 'var(--f-sans)',
                fontSize: '14px',
                outline: 'none',
              }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '8px' }}>
            <button
              type="submit"
              style={{
                padding: '10px 24px',
                borderRadius: '8px',
                backgroundColor: '#00E5FF',
                border: 'none',
                color: '#06080D',
                fontFamily: 'var(--f-display)',
                fontSize: '12px',
                fontWeight: 700,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                cursor: 'pointer',
              }}
            >
              Save Profile
            </button>
          </div>
        </form>
      </div>

      {/* 2. Security & Password */}
      <div style={{
        backgroundColor: 'rgba(13, 17, 26, 0.85)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '16px',
        padding: 'clamp(16px, 3vw, 24px)',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '14px' }}>
          <Lock size={18} color="#00E5FF" />
          <h2 style={{ fontFamily: 'var(--f-display)', fontSize: '16px', fontWeight: 700, color: '#FFFFFF' }}>
            Security &amp; Password
          </h2>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontFamily: 'var(--f-display)', fontSize: '12px', fontWeight: 600, color: 'rgba(255, 255, 255, 0.7)', marginBottom: '6px' }}>
              Current Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              style={{
                width: '100%',
                backgroundColor: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: '8px',
                padding: '10px 14px',
                color: '#FFFFFF',
                fontFamily: 'var(--f-sans)',
                fontSize: '14px',
                outline: 'none',
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontFamily: 'var(--f-display)', fontSize: '12px', fontWeight: 600, color: 'rgba(255, 255, 255, 0.7)', marginBottom: '6px' }}>
              New Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              style={{
                width: '100%',
                backgroundColor: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: '8px',
                padding: '10px 14px',
                color: '#FFFFFF',
                fontFamily: 'var(--f-sans)',
                fontSize: '14px',
                outline: 'none',
              }}
            />
          </div>
        </div>
      </div>

      {/* 3. Detection & Display Preferences */}
      <div style={{
        backgroundColor: 'rgba(13, 17, 26, 0.85)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '16px',
        padding: 'clamp(16px, 3vw, 24px)',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '14px' }}>
          <Sliders size={18} color="#00E5FF" />
          <h2 style={{ fontFamily: 'var(--f-display)', fontSize: '16px', fontWeight: 700, color: '#FFFFFF' }}>
            Detection &amp; Display Preferences
          </h2>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
          {/* Theme Section Header & Lever */}
          <div>
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '12px', marginBottom: '14px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: 700, color: '#FFFFFF' }}>
                  <Palette size={16} color="var(--cyan, #00E5FF)" />
                  <span>System Color Themes</span>
                </div>
                <div style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.6)', marginTop: '2px' }}>
                  Select your forensic inspection environment: Dark (Default), Light, Yellow, or Red.
                </div>
              </div>

              {/* Lever / Segmented Control */}
              <div 
                role="radiogroup" 
                aria-label="Theme Lever Selector"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  backgroundColor: 'rgba(0, 0, 0, 0.6)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: '100px',
                  padding: '4px',
                  gap: '4px',
                  position: 'relative',
                }}
              >
                {(['dark', 'light', 'yellow', 'red'] as ThemeMode[]).map((t) => {
                  const isActive = theme === t;
                  const themeData = THEMES[t];
                  return (
                    <button
                      key={t}
                      type="button"
                      id={`theme-lever-btn-${t}`}
                      onClick={() => setTheme(t)}
                      aria-checked={isActive}
                      role="radio"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '6px 14px',
                        borderRadius: '100px',
                        border: isActive ? `1px solid ${themeData.accentColor}` : '1px solid transparent',
                        backgroundColor: isActive ? 'rgba(255, 255, 255, 0.12)' : 'transparent',
                        color: isActive ? themeData.accentColor : 'rgba(255, 255, 255, 0.65)',
                        fontFamily: 'var(--f-display)',
                        fontSize: '11.5px',
                        fontWeight: isActive ? 700 : 500,
                        cursor: 'pointer',
                        transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                        boxShadow: isActive ? `0 0 14px ${themeData.accentColor}35` : 'none',
                        outline: 'none',
                      }}
                    >
                      <span 
                        style={{
                          width: '8px',
                          height: '8px',
                          borderRadius: '50%',
                          backgroundColor: themeData.accentColor,
                          boxShadow: isActive ? `0 0 6px ${themeData.accentColor}` : 'none',
                        }} 
                      />
                      <span style={{ textTransform: 'capitalize' }}>
                        {t === 'dark' ? 'Dark (Default)' : t}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 4 Theme Interactive Cards Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
              gap: '12px',
            }}>
              {(['dark', 'light', 'yellow', 'red'] as ThemeMode[]).map((t) => {
                const isActive = theme === t;
                const themeData = THEMES[t];
                return (
                  <button
                    key={t}
                    type="button"
                    id={`theme-card-${t}`}
                    onClick={() => setTheme(t)}
                    style={{
                      textAlign: 'left',
                      padding: '14px',
                      borderRadius: '12px',
                      backgroundColor: isActive ? 'rgba(255, 255, 255, 0.07)' : 'rgba(0, 0, 0, 0.35)',
                      border: isActive ? `1.5px solid ${themeData.accentColor}` : '1px solid rgba(255, 255, 255, 0.08)',
                      boxShadow: isActive ? `0 0 16px ${themeData.accentColor}25` : 'none',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      position: 'relative',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '10px',
                    }}
                  >
                    {/* Top Row: Swatches & Active Icon */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        {/* Background Swatch */}
                        <div
                          title="Base Background"
                          style={{
                            width: '20px',
                            height: '20px',
                            borderRadius: '50%',
                            backgroundColor: themeData.bgColor,
                            border: '1.5px solid rgba(255, 255, 255, 0.25)',
                          }}
                        />
                        {/* Accent Swatch */}
                        <div
                          title="Accent Optics"
                          style={{
                            width: '20px',
                            height: '20px',
                            borderRadius: '50%',
                            backgroundColor: themeData.accentColor,
                            boxShadow: `0 0 8px ${themeData.accentColor}`,
                          }}
                        />
                      </div>

                      {isActive ? (
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          color: themeData.accentColor,
                          fontSize: '10px',
                          fontFamily: 'var(--f-mono)',
                          fontWeight: 700,
                          backgroundColor: `${themeData.accentColor}18`,
                          padding: '2px 8px',
                          borderRadius: '100px',
                          border: `1px solid ${themeData.accentColor}40`,
                        }}>
                          <Check size={11} />
                          <span>ACTIVE</span>
                        </div>
                      ) : (
                        <div style={{
                          fontSize: '10px',
                          fontFamily: 'var(--f-mono)',
                          color: 'rgba(255, 255, 255, 0.35)',
                        }}>
                          {t === 'dark' ? 'DEFAULT' : 'SELECT'}
                        </div>
                      )}
                    </div>

                    {/* Theme Details */}
                    <div>
                      <div style={{
                        fontFamily: 'var(--f-display)',
                        fontSize: '13px',
                        fontWeight: 700,
                        color: isActive ? themeData.accentColor : '#FFFFFF',
                        marginBottom: '3px',
                      }}>
                        {themeData.name}
                      </div>
                      <div style={{
                        fontSize: '11px',
                        color: 'rgba(255, 255, 255, 0.55)',
                        lineHeight: 1.35,
                      }}>
                        {themeData.tagline}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Deepfake Alert Notifications Toggle */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingTop: '16px',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Bell size={16} color="rgba(255, 255, 255, 0.6)" />
              <div>
                <div style={{ fontSize: '13.5px', fontWeight: 600, color: '#FFFFFF' }}>Deepfake Alert Notifications</div>
                <div style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.5)' }}>Receive instant email alerts when anomalous media exceeds 90% threshold</div>
              </div>
            </div>
            <input
              type="checkbox"
              id="notifications-checkbox"
              checked={notifications}
              onChange={(e) => setNotifications(e.target.checked)}
              style={{ width: '18px', height: '18px', accentColor: 'var(--cyan, #00E5FF)', cursor: 'pointer' }}
            />
          </div>
        </div>
      </div>

      {/* 4. Logout Action */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '16px',
        padding: 'clamp(16px, 3vw, 24px)',
        backgroundColor: 'rgba(239, 68, 68, 0.05)',
        border: '1px solid rgba(239, 68, 68, 0.2)',
        borderRadius: '16px',
      }}>
        <div>
          <div style={{ fontFamily: 'var(--f-display)', fontSize: '14px', fontWeight: 700, color: '#EF4444' }}>
            Sign Out of OmniFace
          </div>
          <div style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.5)' }}>
            Terminate secure forensic session and return to the public portal.
          </div>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 20px',
            borderRadius: '8px',
            backgroundColor: '#EF4444',
            border: 'none',
            color: '#FFFFFF',
            fontFamily: 'var(--f-display)',
            fontSize: '12px',
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          <LogOut size={14} />
          <span>LOG OUT</span>
        </button>
      </div>

    </div>
  );
}
