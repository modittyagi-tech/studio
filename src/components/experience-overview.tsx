"use client";
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { MotionDiv } from './motion';
import { Button } from './ui/button';
import Link from 'next/link';
import Section from './section';

export function ExperienceOverview() {
    const experienceImage = PlaceHolderImages.find(img => img.id === 'experience-1');
    return (
        <Section>
            <div className="grid md:grid-cols-2 gap-12 md:gap-24 items-center">
                <MotionDiv
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    <h2 className="font-headline text-4xl md:text-5xl text-primary">More Than a Stay, It's an Experience</h2>
                    <div className="mt-6 space-y-6 text-lg text-muted-foreground/90 leading-relaxed">
                        <p>
                            At Glampify, a getaway is a seamless blend of raw adventure and refined serenity. It's waking up to the gentle sounds of nature, without sacrificing an ounce of comfort.
                        </p>
                        <p>
                            It's the taste of coffee brewed over an open fire, the warmth of a private jacuzzi under a blanket of stars, and the feeling of being utterly, peacefully, away from it all.
                        </p>
                    </div>
                    <div className="mt-8">
                        <Button size="lg" variant="outline" asChild>
                            <Link href="/experience">Discover The Experience</Link>
                        </Button>
                    </div>
                </MotionDiv>
                <MotionDiv
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    {experienceImage && (
                        <div className="aspect-[4/3] rounded-xl overflow-hidden shadow-2xl shadow-primary/10">
                            <Image
                                src={experienceImage.imageUrl}
                                alt={experienceImage.description}
                                width={800}
                                height={600}
                                className="object-cover w-full h-full"
                                data-ai-hint={experienceImage.imageHint}
                            />
                        </div>
                    )}
                </MotionDiv>
            </div>
        </Section>
    );
}
