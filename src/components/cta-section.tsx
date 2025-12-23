"use client";
import { Button } from './ui/button';
import Link from 'next/link';
import { MotionDiv } from './motion';
import Section from './section';

export function CtaSection() {
    return (
        <div className="bg-primary">
            <Section>
                <MotionDiv
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.5 }}
                    transition={{ duration: 0.6 }}
                    className="text-center text-primary-foreground"
                >
                    <h2 className="font-headline text-4xl md:text-5xl">Your Adventure Awaits</h2>
                    <p className="mt-4 max-w-2xl mx-auto text-lg text-primary-foreground/80">
                        Ready to trade the city noise for the whispers of the wild? Your luxury escape is just a click away.
                    </p>
                    <div className="mt-8">
                        <Button size="lg" variant="secondary" asChild>
                            <Link href="#booking">Book Your Stay Now</Link>
                        </Button>
                    </div>
                </MotionDiv>
            </Section>
        </div>
    );
}
