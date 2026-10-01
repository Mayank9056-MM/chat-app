"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { authClient } from "@/lib/auth-client";
import { NeuronMark } from "@/components/brand";

const SignInPage = () => {
  const [loadingProvider, setLoadingProvider] = useState<"github" | "google" | null>(null);

  const handleSignIn = async (provider: "github" | "google") => {
    try {
      setLoadingProvider(provider);
      await authClient.signIn.social({
        provider,
        callbackURL: "/",
      });
    } catch (error) {
      console.error("Sign in failed:", error);
      setLoadingProvider(null);
    }
  };

  return (
    <section className="flex flex-col items-center justify-center min-h-screen px-4 py-16">
      {/* Sign-in card container */}
      <div className="w-full max-w-sm">

        {/* Brand Lockup */}
        <div className="flex flex-col items-center gap-y-3 mb-8">
          <Link href="/" className="focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-violet-500 rounded-xl">
            <div className="relative flex items-center justify-center w-12 h-12 rounded-xl bg-[#0D0D12] border border-[#23232D] shadow-xl shadow-black/40 group">
              <NeuronMark size={28} animated />
            </div>
          </Link>
          <div className="text-center">
            <h1 className="text-xl font-bold tracking-tight text-white">
              Sign in to Neuron
            </h1>
            <p className="mt-1 text-xs text-zinc-400">
              Technical intelligence workspace for developers
            </p>
          </div>
        </div>

        {/* Card Surface */}
        <div className="rounded-xl border border-[#23232D] bg-[#0D0D12]/90 backdrop-blur-md p-6 shadow-2xl shadow-black/50">

          {/* GitHub OAuth Button */}
          <Button
            variant="outline"
            disabled={loadingProvider !== null}
            className="w-full h-10 gap-x-2.5 bg-[#13131A] hover:bg-[#1A1A24] border-[#23232D] hover:border-[#32323F] text-zinc-200 hover:text-white font-medium text-xs rounded-lg transition-all duration-150 focus-visible:ring-1 focus-visible:ring-violet-500"
            onClick={() => handleSignIn("github")}
          >
            {loadingProvider === "github" ? (
              <Spinner className="h-4 w-4 text-zinc-400" />
            ) : (
              <Image
                src="/github.svg"
                alt=""
                width={16}
                height={16}
                className="opacity-90"
              />
            )}
            <span>{loadingProvider === "github" ? "Connecting to GitHub..." : "Continue with GitHub"}</span>
          </Button>

          {/* Divider */}
          <div className="flex items-center gap-x-3 my-3.5" aria-hidden="true">
            <div className="h-px flex-1 bg-[#23232D]" />
            <span className="text-[11px] text-zinc-600 font-mono">or</span>
            <div className="h-px flex-1 bg-[#23232D]" />
          </div>

          {/* Google OAuth Button */}
          <Button
            variant="outline"
            disabled={loadingProvider !== null}
            className="w-full h-10 gap-x-2.5 bg-[#13131A] hover:bg-[#1A1A24] border-[#23232D] hover:border-[#32323F] text-zinc-200 hover:text-white font-medium text-xs rounded-lg transition-all duration-150 focus-visible:ring-1 focus-visible:ring-violet-500"
            onClick={() => handleSignIn("google")}
          >
            {loadingProvider === "google" ? (
              <Spinner className="h-4 w-4 text-zinc-400" />
            ) : (
              <Image
                src="/google.svg"
                alt=""
                width={16}
                height={16}
              />
            )}
            <span>{loadingProvider === "google" ? "Connecting to Google..." : "Continue with Google"}</span>
          </Button>
        </div>

        {/* Footer Note */}
        <p className="mt-4 text-center text-[11px] text-zinc-600 leading-relaxed">
          By signing in, you access multi-model streaming with user-scoped persistence.
        </p>
      </div>
    </section>
  );
};

export default SignInPage;