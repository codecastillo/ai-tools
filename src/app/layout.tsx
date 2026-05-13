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
import { ThemeProvider } from '@/components/theme-provider';

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

// Inline script. Runs synchronously before first paint so the correct
// `data-theme` is on `<html>` and we never flash the wrong palette. Mirrors
// the persistence logic in `src/components/theme-provider.tsx`.
const themeBootstrapScript = `(function(){try{var t=localStorage.getItem('aitools_theme');if(t!=='dark'&&t!=='light'){t=window.matchMedia('(prefers-color-scheme: light)').matches?'light':'dark';}document.documentElement.setAttribute('data-theme',t);}catch(e){document.documentElement.setAttribute('data-theme','dark');}})();`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrains.variable} h-full antialiased`}
      data-theme="dark"
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeBootstrapScript }} />
      </head>
      <body className="relative min-h-full">
        <ThemeProvider>
          <CommandPaletteProvider>
            <KeyboardOverlayProvider>
              <div className="flex min-h-full flex-col">
                <SiteHeader />
                <main className="relative z-10 flex-1">{children}</main>
                <SiteFooter />
              </div>
              <KeyboardShortcuts />
              <OnboardingTour />
            </KeyboardOverlayProvider>
          </CommandPaletteProvider>
        </ThemeProvider>
        <StackPill />
      </body>
    </html>
  );
}
