import { requireUnAuth } from "@/modules/auth/actions";
import React from "react";

const AuthLayout = async ({ children }: { children: React.ReactNode }) => {
  await requireUnAuth();

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#07070A] flex items-center justify-center">
      {/* Restrained ambient glow */}
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
      >
        <div className="absolute left-1/2 top-0 -translate-x-1/2 h-[350px] w-[600px] rounded-full bg-violet-600/[0.08] blur-[120px]" />
      </div>

      {/* Subtle dot-grid texture */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.025]"
        aria-hidden="true"
        style={{
          backgroundImage: "radial-gradient(circle, #ffffff 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      <div className="relative z-10 w-full">
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;