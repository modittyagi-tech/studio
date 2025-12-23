
import { Logo } from '@/components/logo';
import { footerLinks } from '@/lib/data';
import Link from 'next/link';

export function SiteFooter() {
  return (
    <footer className="bg-background">
      <div className="container max-w-7xl py-12 md:py-16">
        <div className="grid grid-cols-1 gap-10 text-center md:grid-cols-3 md:gap-8 md:text-left">
          
          {/* Left Column: Brand */}
          <div className="flex flex-col items-center md:items-start">
            <Logo />
            <p className="mt-2 text-sm text-muted-foreground">
              The perfect blend of nature and luxury.
            </p>
          </div>

          {/* Middle & Right Columns: Links */}
          <div className="grid grid-cols-2 gap-8 md:col-span-2">
            <div>
              <h3 className="font-semibold text-sm tracking-wider text-foreground">Company</h3>
              <ul className="mt-4 space-y-3">
                {footerLinks.company.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-sm tracking-wider text-foreground">Support</h3>
              <ul className="mt-4 space-y-3">
                {footerLinks.support.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

        </div>
        
        {/* Bottom Bar */}
        <div className="mt-12 border-t border-border pt-8">
           <div className="flex flex-col items-center justify-between gap-2 text-xs text-muted-foreground/80 md:flex-row">
            <p>&copy; {new Date().getFullYear()} Glampify. All rights reserved.</p>
            <p>Designed by – Modit Tyagi</p>
           </div>
        </div>
      </div>
    </footer>
  );
}
