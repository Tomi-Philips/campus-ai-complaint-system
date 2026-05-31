import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Campus AI | Intelligent Engagement Platform",
  description: "Transforming campus communication with AI-powered insights, complaint management, and real-time announcements.",
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png" }],
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark h-full" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${spaceGrotesk.variable} font-sans antialiased min-h-full flex flex-col bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950`}
      >
        {/* Background gradient orbs for depth */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-brand-500/20 rounded-full blur-[120px] opacity-30" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-accent-500/20 rounded-full blur-[120px] opacity-30" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-r from-brand-500/5 to-accent-500/5 rounded-full blur-3xl" />
          
          {/* Subtle grid pattern */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cdefs%3E%3Cpattern id=\'grid\' width=\'60\' height=\'60\' patternUnits=\'userSpaceOnUse\'%3E%3Cpath d=\'M 60 0 L 0 0 0 60\' fill=\'none\' stroke=\'rgba(255,255,255,0.02)\' stroke-width=\'0.5\'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width=\'100%\' height=\'100%\' fill=\'url(%23grid)\' /%3E%3C/svg%3E')] opacity-20" />
        </div>

        {/* Main content with relative positioning */}
        <div className="relative z-10 flex-1 flex flex-col">
          {children}
        </div>

        {/* Enhanced Toaster with modern styling */}
        <Toaster
          position="bottom-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: "rgba(15, 23, 42, 0.9)",
              backdropFilter: "blur(12px)",
              color: "#f1f5f9",
              border: "1px solid rgba(59, 130, 246, 0.2)",
              borderRadius: "16px",
              boxShadow: "0 20px 25px -12px rgba(0, 0, 0, 0.3)",
              fontSize: "0.875rem",
              padding: "12px 16px",
            },
            success: {
              style: {
                background: "rgba(16, 185, 129, 0.1)",
                border: "1px solid rgba(16, 185, 129, 0.3)",
              },
              iconTheme: {
                primary: "#10b981",
                secondary: "#0f172a",
              },
            },
            error: {
              style: {
                background: "rgba(239, 68, 68, 0.1)",
                border: "1px solid rgba(239, 68, 68, 0.3)",
              },
              iconTheme: {
                primary: "#ef4444",
                secondary: "#0f172a",
              },
            },
            loading: {
              style: {
                background: "rgba(59, 130, 246, 0.1)",
                border: "1px solid rgba(59, 130, 246, 0.3)",
              },
            },
          }}
        />
      </body>
    </html>
  );
}