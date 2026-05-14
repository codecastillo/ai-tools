import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import SiteHeader from '@/components/site-header';
import SiteFooter from '@/components/site-footer';
import CommandPaletteProvider from '@/components/command-palette-provider';
import KeyboardOverlayProvider from '@/components/keyboard-overlay';
import KeyboardShortcuts from '@/components/keyboard-shortcuts';
import StackPill from '@/components/stack-pill';
import OnboardingTour from '@/components/onboarding-tour';
import ParticleBackground from '@/components/particle-background';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
});

const jetbrains = JetBrains_Mono({
  variable: '--font-jetbrains',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'ai.tools · a reference for AI dev tooling',
  description:
    'Install guides, usage tips, and curated stacks for the AI tools real developers ship with.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrains.variable} h-full antialiased`}
    >
      <body className="relative min-h-full">
        <ParticleBackground />
        <CommandPaletteProvider>
          <KeyboardOverlayProvider>
            <div className="relative z-10 flex min-h-full flex-col">
              <SiteHeader />
              <main className="relative z-10 flex-1">{children}</main>
              <SiteFooter />
            </div>
            <KeyboardShortcuts />
            <OnboardingTour />
          </KeyboardOverlayProvider>
        </CommandPaletteProvider>
        <StackPill />
      </body>
    </html>
  );
}
