"use client";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import Image from "next/image";

const SignInPage = () => {
  return (
    <section className="flex flex-col items-center justify-center min-h-screen px-4 py-16">
      {/* Sign-in card */}
      <div className="w-full max-w-sm">

        {/* Logo + wordmark */}
        <div className="flex flex-col items-center gap-y-4 mb-8">
          <div className="relative flex items-center justify-center w-14 h-14 rounded-2xl bg-white/5 border border-white/10 shadow-lg shadow-black/30">
            <Image
              src="/logo.svg"
              alt="Neuron logo"
              width={32}
              height={32}
              className="object-contain"
            />
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-semibold tracking-tight text-white">
              Welcome to Neuron
            </h1>
            <p className="mt-1.5 text-sm text-zinc-400 leading-relaxed">
              Sign in to get started — unlocks higher message limits.
            </p>
          </div>
        </div>

        {/* Card surface */}
        <div className="rounded-2xl border border-white/[0.07] bg-white/[0.04] backdrop-blur-sm p-6 shadow-2xl shadow-black/40">

          {/* GitHub */}
          <Button
            variant="outline"
            className="
              w-full h-11 gap-x-2.5
              bg-white/[0.06] hover:bg-white/[0.10]
              border-white/[0.10] hover:border-white/[0.18]
              text-zinc-100 hover:text-white
              font-medium text-sm
              rounded-xl
              transition-all duration-150
              focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950
            "
            onClick={() =>
              authClient.signIn.social({
                provider: "github",
                callbackURL: "/",
              })
            }
          >
            <Image
              src="/github.svg"
              alt=""
              width={18}
              height={18}
              className="opacity-90"
            />
            Continue with GitHub
          </Button>

          {/* Divider */}
          <div className="flex items-center gap-x-3 my-4" aria-hidden="true">
            <div className="h-px flex-1 bg-white/[0.07]" />
            <span className="text-xs text-zinc-600 font-medium">or</span>
            <div className="h-px flex-1 bg-white/[0.07]" />
          </div>

          {/* Google */}
          <Button
            variant="outline"
            className="
              w-full h-11 gap-x-2.5
              bg-white/[0.06] hover:bg-white/[0.10]
              border-white/[0.10] hover:border-white/[0.18]
              text-zinc-100 hover:text-white
              font-medium text-sm
              rounded-xl
              transition-all duration-150
              focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950
            "
            onClick={() =>
              authClient.signIn.social({
                provider: "google",
                callbackURL: "/",
              })
            }
          >
            <Image
              src="/google.svg"
              alt=""
              width={18}
              height={18}
            />
            Continue with Google
          </Button>
        </div>

        {/* Footer note */}
        <p className="mt-5 text-center text-xs text-zinc-600 leading-relaxed">
          By signing in, you agree to our{' '}
          <span className="text-zinc-500 underline underline-offset-2 decoration-zinc-600 hover:text-zinc-300 cursor-pointer transition-colors">
            Terms
          </span>{' '}
          and{' '}
          <span className="text-zinc-500 underline underline-offset-2 decoration-zinc-600 hover:text-zinc-300 cursor-pointer transition-colors">
            Privacy Policy
          </span>
          .
        </p>
      </div>
    </section>
  );
};

export default SignInPage;