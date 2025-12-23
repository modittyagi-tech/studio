import { Logo } from '@/components/logo';
import { footerLinks } from '@/lib/data';
import Link from 'next/link';

export function SiteFooter() {
  return (
    <footer className="bg-secondary/50">
      <div className="container max-w-7xl py-12 px-4 sm:px-6 lg:px-8">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          <div className="space-y-8 xl:col-span-1">
            <Logo />
            <p className="text-muted-foreground text-base">
              The perfect blend of nature and luxury.
            </p>
          </div>
          <div className="mt-12 grid grid-cols-2 gap-8 xl:mt-0 xl:col-span-2">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold text-foreground tracking-wider uppercase font-headline">Company</h3>
                <ul className="mt-4 space-y-4">
                  {footerLinks.company.map((link) => (
                    <li key={link.href}>
                      <Link href={link.href} className="text-base text-muted-foreground hover:text-foreground">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-12 md:mt-0">
                <h3 className="text-sm font-semibold text-foreground tracking-wider uppercase font-headline">Support</h3>
                <ul className="mt-4 space-y-4">
                  {footerLinks.support.map((link) => (
                    <li key={link.href}>
                      <Link href={link.href} className="text-base text-muted-foreground hover:text-foreground">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-12 border-t border-border pt-8">
          <p className="text-base text-muted-foreground xl:text-center">
            &copy; {new Date().getFullYear()} Glampify. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
