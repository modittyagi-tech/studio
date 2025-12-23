import type { Metadata } from 'next';
import './globals.css';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { Toaster } from "@/components/ui/toaster";
import { Inter, Playfair_Display } from 'next/font/google';

export const metadata: Metadata = {
  title: 'Glampify | Luxury Glamping & Hotel',
  description: 'Experience the perfect blend of nature and luxury. Book your unforgettable stay at Glampify.',
};

const fontHeadline = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-headline',
});

const fontBody = Inter({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-body',
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body suppressHydrationWarning className={`font-body antialiased bg-background text-foreground ${fontHeadline.variable} ${fontBody.variable}`}>
        <SiteHeader />
        <main>{children}</main>
        <SiteFooter />
        <Toaster />
      </body>
    </html>
  );
}
