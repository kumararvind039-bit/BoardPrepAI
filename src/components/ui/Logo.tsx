import React from 'react';

export function Logo({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" className={className}>
      <rect width="256" height="256" rx="60" fill="currentColor"/>
      <path d="M128 40 L40 88 L128 136 L216 88 Z" fill="#ffffff"/>
      <path d="M64 101 V160 C64 180 96 200 128 200 C160 200 192 180 192 160 V101 L128 136 Z" fill="rgba(255,255,255,0.8)"/>
      <circle cx="128" cy="110" r="16" fill="currentColor"/>
      <path d="M116 110 L124 118 L140 102" stroke="#ffffff" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      <path d="M216 88 V152" stroke="#ffffff" strokeWidth="12" strokeLinecap="round"/>
      <circle cx="216" cy="160" r="12" fill="#ffffff"/>
    </svg>
  );
}
