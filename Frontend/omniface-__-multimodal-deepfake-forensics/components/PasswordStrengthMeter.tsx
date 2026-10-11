'use client';

import React from 'react';
import { Check, X, ShieldAlert, ShieldCheck } from 'lucide-react';
import { calculatePasswordStrength } from '@/lib/validations/auth';

interface PasswordStrengthMeterProps {
  password: string;
}

export default function PasswordStrengthMeter({ password }: PasswordStrengthMeterProps) {
  const result = calculatePasswordStrength(password);

  if (!password) {
    return null;
  }

  const bars = [1, 2, 3, 4];

  return (
    <div style={{ marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
      {/* Strength Bar & Label */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          {result.score >= 3 ? (
            <ShieldCheck size={13} style={{ color: result.color }} />
          ) : (
            <ShieldAlert size={13} style={{ color: result.color }} />
          )}
          <span
            style={{
              fontFamily: 'var(--f-mono)',
              fontSize: '11px',
              fontWeight: 600,
              letterSpacing: '0.04em',
              color: result.color,
              textTransform: 'uppercase',
            }}
          >
            STRENGTH: {result.label}
          </span>
        </div>
        <span style={{ fontFamily: 'var(--f-mono)', fontSize: '10px', color: 'rgba(255, 255, 255, 0.45)' }}>
          {result.score}/4
        </span>
      </div>

      {/* 4 Segment Progress Bars */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '4px' }}>
        {bars.map((index) => {
          const isActive = index <= result.score;
          return (
            <div
              key={index}
              style={{
                height: '4px',
                borderRadius: '2px',
                backgroundColor: isActive ? result.color : 'rgba(255, 255, 255, 0.1)',
                boxShadow: isActive ? `0 0 8px ${result.color}66` : 'none',
                transition: 'all 0.25s ease',
              }}
            />
          );
        })}
      </div>

      {/* Real-time Requirement Checks */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '4px 10px',
          marginTop: '2px',
          padding: '6px 8px',
          borderRadius: '6px',
          backgroundColor: 'rgba(255, 255, 255, 0.02)',
          border: '1px solid rgba(255, 255, 255, 0.06)',
        }}
      >
        <RequirementItem label="8+ Characters" met={result.checks.minLength} />
        <RequirementItem label="Uppercase (A-Z)" met={result.checks.hasUpper} />
        <RequirementItem label="Lowercase (a-z)" met={result.checks.hasLower} />
        <RequirementItem label="Number (0-9)" met={result.checks.hasNumber} />
        <RequirementItem label="Special Symbol (!@#$)" met={result.checks.hasSpecial} />
      </div>
    </div>
  );
}

function RequirementItem({ label, met }: { label: string; met: boolean }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
      {met ? (
        <Check size={11} style={{ color: '#10B981', flexShrink: 0 }} />
      ) : (
        <X size={11} style={{ color: 'rgba(255, 255, 255, 0.35)', flexShrink: 0 }} />
      )}
      <span
        style={{
          fontFamily: 'var(--f-sans)',
          fontSize: '10.5px',
          color: met ? '#10B981' : 'rgba(255, 255, 255, 0.45)',
          transition: 'color 0.2s ease',
        }}
      >
        {label}
      </span>
    </div>
  );
}
