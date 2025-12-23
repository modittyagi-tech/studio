import { Logo } from '@/components/logo';
import { footerLinks } from '@/lib/data';
import Link from 'next/link';

export function SiteFooter() {
  return (
    <footer className="bg-secondary/30">
      <div className="container max-w-7xl py-16 px-6 sm:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
          
          {/* Left Column: Brand */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <Logo />
            <p className="mt-4 text-muted-foreground text-base max-w-xs">
              The perfect blend of nature and luxury.
            </p>
          </div>

          {/* Middle Column: Company */}
          <div className="text-center md:text-left">
            <h3 className="font-headline text-lg font-semibold text-foreground tracking-wider">Company</h3>
            <ul className="mt-4 space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-base text-muted-foreground hover:text-primary transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Right Column: Support */}
          <div className="text-center md:text-left">
            <h3 className="font-headline text-lg font-semibold text-foreground tracking-wider">Support</h3>
            <ul className="mt-4 space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-base text-muted-foreground hover:text-primary transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

        </div>
        
        {/* Bottom Bar */}
        <div className="mt-16 border-t border-border pt-8 text-center text-sm text-muted-foreground/80">
           <p>&copy; {new Date().getFullYear()} Glampify. All rights reserved.</p>
           <p className="mt-1">Designed by – Modit Tyagi</p>
        </div>
      </div>
    </footer>
  );
}
