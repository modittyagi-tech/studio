"use client";

import { PageHeader } from "@/components/page-header";
import Section from "@/components/section";
import { MotionDiv } from "@/components/motion";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { CtaSection } from "@/components/cta-section";

const experiences = [
    {
        title: "Silence & Mountain Views",
        description: "Wake up to nothing but the whisper of the wind and panoramic views of the mountains. Our stays are designed for deep tranquility and a profound connection to the natural world.",
        imageId: "highlight-2",
        align: "left",
    },
    {
        title: "Evenings by the Fire",
        description: "As dusk settles, life slows down. Gather around a private bonfire or a cozy indoor fireplace. It’s a time for quiet conversations, stargazing, and simple comforts.",
        imageId: "experience-1",
        align: "right",
    },
    {
        title: "Relaxation, Uninterrupted",
        description: "Unwind in your private jacuzzi under an open sky, or simply relax on your deck with a good book. Here, you have the permission to do everything, or nothing at all.",
        imageId: "highlight-1",
        align: "left",
    },
];

export default function ExperiencePage() {
    return (
        <div>
            <PageHeader
                title="The Glampify Experience"
                description="More than just a place to sleep, it's a place to live slowly and reconnect."
            />

            {experiences.map((exp, index) => {
                const image = PlaceHolderImages.find(img => img.id === exp.imageId);
                return (
                    <div key={index} className={index % 2 === 1 ? 'bg-secondary/30' : 'bg-background'}>
                        <Section>
                            <div className="grid md:grid-cols-2 gap-12 md:gap-24 items-center">
                                <MotionDiv
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.8, ease: "easeOut" }}
                                    className={exp.align === 'right' ? 'md:order-2' : ''}
                                >
                                    {image && (
                                        <div className="aspect-[4/3] rounded-xl overflow-hidden shadow-lg">
                                            <Image
                                                src={image.imageUrl}
                                                alt={exp.title}
                                                width={800}
                                                height={600}
                                                className="object-cover w-full h-full"
                                                data-ai-hint={image.imageHint}
                                            />
                                        </div>
                                    )}
                                </MotionDiv>

                                <MotionDiv
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.8, ease: "easeOut" }}
                                    className={exp.align === 'right' ? 'md:order-1' : ''}
                                >
                                    <h2 className="font-headline text-4xl md:text-5xl text-primary">{exp.title}</h2>
                                    <p className="mt-6 text-lg text-muted-foreground/90 leading-relaxed">
                                        {exp.description}
                                    </p>
                                </MotionDiv>
                            </div>
                        </Section>
                    </div>
                );
            })}
            
            <div className="bg-primary">
                <Section>
                    <MotionDiv
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="text-center text-primary-foreground"
                    >
                        <h2 className="font-headline text-4xl md:text-5xl">Your Escape Awaits</h2>
                        <p className="mt-4 max-w-2xl mx-auto text-lg text-primary-foreground/80">
                            Ready to trade the city noise for the whispers of the wild? Your luxury escape is just a click away.
                        </p>
                        <div className="mt-8">
                            <Button size="lg" variant="secondary" asChild>
                                <Link href="/stays">View Our Stays</Link>
                            </Button>
                        </div>
                    </MotionDiv>
                </Section>
            </div>

        </div>
    );
}
