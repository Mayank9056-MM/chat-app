import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter, Nunito_Sans } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { QueryProvider } from "@/components/providers/query-provider";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  metadataBase: new URL("https://chat-app-e478-psha64o3j-mayank9056-mms-projects.vercel.app"),

  title: {
    default: "Neuron — AI Workspace for Thinking, Research & Conversations",
    template: "%s | Neuron",
  },

  description:
    "Neuron is a modern AI workspace that helps you think, research, learn, and create faster. Chat with advanced AI models, organize conversations, and boost productivity in one unified platform.",

  keywords: [
    "Neuron AI",
    "AI Chat",
    "ChatGPT Alternative",
    "Claude Alternative",
    "AI Assistant",
    "AI Workspace",
    "AI Research Tool",
    "Productivity AI",
    "Multi Model AI",
    "Artificial Intelligence",
    "AI Conversations",
    "OpenRouter",
    "Next.js AI App",
    "AI Platform",
    "AI Knowledge Assistant",
  ],

  authors: [
    {
      name: "Mayank Mahajan",
    },
  ],

  creator: "Mayank Mahajan",
  publisher: "Neuron",

  category: "Technology",

  robots: {
    index: true,
    follow: true,
    nocache: false,
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
    url: "https://chat-app-e478-psha64o3j-mayank9056-mms-projects.vercel.app",
    siteName: "Neuron",
    title: "Neuron — AI Workspace for Thinking, Research & Conversations",
    description:
      "A modern AI workspace built for research, learning, productivity, and intelligent conversations.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Neuron AI",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Neuron — AI Workspace",
    description:
      "Chat, research, learn, and create with powerful AI models in one modern workspace.",
    images: ["/og-image.png"],
  },

  alternates: {
    canonical: "https://chat-app-e478-psha64o3j-mayank9056-mms-projects.vercel.app",
  },

  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
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
      <body className="min-h-full flex flex-col">
        <QueryProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <TooltipProvider>{children}
              <Toaster />
            </TooltipProvider>
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
