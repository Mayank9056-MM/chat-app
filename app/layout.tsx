import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter, Nunito_Sans } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { QueryProvider } from "@/components/providers/query-provider";
import { Toaster } from "sonner";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://chat-app-e478-psha64o3j-mayank9056-mms-projects.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),

  title: {
    default: "Neuron — Multi-Model AI Workspace for Developers",
    template: "%s | Neuron",
  },

  description:
    "Neuron is a developer-focused, multi-model AI workspace for technical reasoning, code generation, and persistent conversation history across leading models.",

  keywords: [
    "Neuron AI",
    "Developer AI Workspace",
    "Multi-Model AI",
    "OpenRouter Chat",
    "Code Generation",
    "Technical Reasoning",
    "Next.js AI",
  ],

  authors: [
    {
      name: "Mayank Mahajan",
    },
  ],

  creator: "Mayank Mahajan",
  publisher: "Neuron",
  category: "Developer Tools",

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  openGraph: {
    type: "website",
    locale: "en_US",
    url: baseUrl,
    siteName: "Neuron",
    title: "Neuron — Multi-Model AI Workspace for Developers",
    description:
      "A restrained, developer-first AI workspace built for technical reasoning, coding, and multi-model exploration.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Neuron AI Workspace",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Neuron — Multi-Model AI Workspace",
    description:
      "A restrained, developer-first AI workspace built for technical reasoning and multi-model exploration.",
    images: ["/og-image.png"],
  },

  alternates: {
    canonical: baseUrl,
  },

  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    shortcut: "/favicon.ico",
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
};

const nunitoSansHeading = Nunito_Sans({
  subsets: ["latin"],
  variable: "--font-heading",
});

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn(
        "h-full",
        "antialiased",
        geistSans.variable,
        geistMono.variable,
        "font-sans",
        inter.variable,
        nunitoSansHeading.variable,
      )}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-background text-foreground selection:bg-violet-500/30 selection:text-white">
        <QueryProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <TooltipProvider>
              {children}
              <Toaster
                position="bottom-right"
              />
            </TooltipProvider>
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
