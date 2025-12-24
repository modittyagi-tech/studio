import './globals.css';
import { Alegreya, Belleza } from 'next/font/google';
import { cn } from '@/lib/utils';
import { Toaster } from "@/components/ui/toaster";

const fontBody = Alegreya({
  subsets: ['latin'],
  variable: '--font-body',
});

const fontHeadline = Belleza({
  subsets: ['latin'],
  variable: '--font-headline',
  weight: '400',
});

export const metadata = {
  title: 'Glampify - Luxury Camping Experiences',
  description: 'Escape to nature in style. Discover unique glamping stays with premium amenities.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn('antialiased', fontBody.variable, fontHeadline.variable)}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
