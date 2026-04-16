import type { Metadata } from "next";
import "./globals.css";
import { Cloud, Globe, Shield } from "lucide-react";
import Link from 'next/link';

export const metadata: Metadata = {
  title: "S3 Transmit - Professional S3 Upload Service",
  description: "Secure, fast, and professional S3 bucket file upload service.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased font-sans">
        <div className="flex flex-col min-h-screen w-full">
          {/* Header - Centered Flex Container */}
          <header className="sticky top-0 z-50 w-full glass border-b border-border flex justify-center">
            <div className="w-full max-w-7xl px-4 h-16 flex items-center justify-between">
              <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Cloud className="w-6 h-6 text-primary" />
                </div>
                <span className="text-xl font-bold tracking-tight text-foreground whitespace-nowrap">
                  S3<span className="text-primary">Transmit</span>
                </span>
              </Link>
              <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-foreground/70">
                <Link href="/docs" className="hover:text-primary transition-colors">Documentation</Link>
                <Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link>
                <div className="flex items-center gap-1.5 text-accent/80 px-3 py-1 bg-accent/5 rounded-full border border-accent/10">
                  <Shield className="w-3.5 h-3.5" />
                  <span className="text-[10px] uppercase tracking-wider">Secure Channel</span>
                </div>
              </nav>
              <div className="flex items-center gap-4">
                {/* "Connect Bucket" removed to focus on single-bucket model */}
                <div className="text-xs font-medium text-foreground/40 bg-white/5 px-3 py-1.5 rounded-lg border border-white/5">
                  v1.0.4 Stable
                </div>
              </div>
            </div>
          </header>

          {/* Main Content - Centered Flex Container */}
          <main className="flex-grow w-full flex justify-center">
            <div className="w-full max-w-7xl px-4 py-8 md:py-16">
              {children}
            </div>
          </main>

          {/* Footer - Centered Flex Container */}
          <footer className="w-full glass border-t border-border mt-auto flex justify-center">
            <div className="w-full max-w-7xl mx-auto px-4 py-8">
              <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="flex items-center gap-2 opacity-50">
                  <Cloud className="w-5 h-5" />
                  <span className="text-sm font-semibold whitespace-nowrap">S3Transmit &copy; 2026</span>
                </div>
                <div className="flex items-center gap-6">
                  <Globe className="w-5 h-5 text-foreground/50 hover:text-primary transition-colors cursor-pointer" />
                </div>
                <div className="text-sm text-foreground/40 font-medium whitespace-nowrap">
                  Encryption Standard: AES-256
                </div>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
