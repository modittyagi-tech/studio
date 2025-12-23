"use client";
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { MotionDiv } from './motion';
import { Button } from './ui/button';
import Link from 'next/link';

export function ExperienceOverview() {
    const experienceImage = PlaceHolderImages.find(img => img.id === 'experience-1');
    return (
        <section id="experience" className="py-24 md:py-40 bg-background">
            <div className="container max-w-7xl">
                <div className="grid md:grid-cols-2 gap-12 md:gap-24 items-center">
                    <MotionDiv
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{ duration: 0.8 }}
                    >
                        <h2 className="font-headline text-4xl md:text-5xl lg:text-6xl text-primary">More Than a Stay, It's an Experience</h2>
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
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{ duration: 0.8, delay: 0.1 }}
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
            </div>
        </section>
    );
}
