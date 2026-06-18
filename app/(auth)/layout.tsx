import { config } from '@/config/config';
import { requireUnAuth } from '@/modules/auth/actions'
import React from 'react'

const AuthLayout = async ({ children }: { children: React.ReactNode }) => {

  await requireUnAuth();
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-zinc-950 flex items-center justify-center">
      {/* Ambient radial glow — the signature atmospheric element */}
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
      >
        {/* Primary glow: indigo, top-center */}
        <div className="absolute left-1/2 top-0 -translate-x-1/2 h-[420px] w-[720px] rounded-full bg-indigo-600/20 blur-[120px]" />
        {/* Secondary glow: violet, bottom-right for depth */}
        <div className="absolute right-0 bottom-0 h-[300px] w-[500px] rounded-full bg-violet-700/10 blur-[100px]" />
      </div>

      {/* Subtle dot-grid texture */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        aria-hidden="true"
        style={{
          backgroundImage:
            'radial-gradient(circle, #ffffff 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />

      <div className="relative z-10 w-full">
        {children}
      </div>
    </div>
  )
}

export default AuthLayout