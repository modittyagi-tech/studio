"use client";
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { MotionDiv } from './motion';

export function ExperienceOverview() {
    const experienceImage = PlaceHolderImages.find(img => img.id === 'experience-1');
    return (
        <section className="py-16 md:py-24 bg-background">
            <div className="container max-w-7xl">
                <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
                    <MotionDiv
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{ duration: 0.8 }}
                    >
                        <h2 className="font-headline text-4xl md:text-5xl text-primary">More Than a Stay, It's an Experience</h2>
                        <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
                            At Glampify, we believe a getaway should be a seamless blend of adventure and serenity. It's about waking up to the gentle sounds of nature without sacrificing an ounce of comfort. It's the taste of coffee brewed over an open fire, the warmth of a private jacuzzi under a blanket of stars, and the feeling of being utterly, peacefully, away from it all.
                        </p>
                        <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
                            We curate every detail to create moments of connection—with nature, with your loved ones, and with yourself.
                        </p>
                    </MotionDiv>
                    <MotionDiv
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{ duration: 0.8 }}
                    >
                        {experienceImage && (
                            <div className="aspect-w-4 aspect-h-3 rounded-lg overflow-hidden shadow-lg">
                                <Image
                                    src={experienceImage.imageUrl}
                                    alt={experienceImage.description}
                                    width={800}
                                    height={600}
                                    className="object-cover"
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
