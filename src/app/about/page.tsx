
"use client";

import { PageHeader } from "@/components/page-header";
import Section from "@/components/section";
import { MotionDiv } from "@/components/motion";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Heart, Leaf, Mountain } from "lucide-react";

const values = [
    {
        icon: Leaf,
        title: "Harmony with Nature",
        description: "Our spaces are designed to blend seamlessly with the landscape, respecting the environment that hosts us.",
    },
    {
        icon: Mountain,
        title: "Quiet & Seclusion",
        description: "We believe true luxury is uninterrupted peace, offering you a private sanctuary to disconnect and recharge.",
    },
    {
        icon: Heart,
        title: "Thoughtful Comfort",
        description: "Every detail, from the crisp linens to the local artisan coffee, is chosen with your comfort in mind.",
    },
];

export default function AboutPage() {
    const storyImage = PlaceHolderImages.find(p => p.id === 'about-story');
    const locationImage = PlaceHolderImages.find(p => p.id === 'about-location');

    return (
        <div>
            <PageHeader
                title="A Quiet Little Story"
                description="Glampify wasn't built in a boardroom. It grew from a simple belief: that nature holds the key to true restoration, and comfort shouldn't be left behind to find it."
            />
            
            <Section>
                <div className="grid md:grid-cols-2 gap-12 md:gap-24 items-center">
                    <MotionDiv
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                        <h2 className="font-headline text-4xl md:text-5xl text-primary">From a Whisper to a Retreat</h2>
                        <div className="mt-6 space-y-6 text-lg text-muted-foreground/90 leading-relaxed">
                            <p>
                                We started Glampify as an escape for ourselves—a way to trade city noise for the whisper of the wind. We sought a place where mornings were slow, coffee was savored, and the most pressing task was watching the clouds drift by.
                            </p>
                            <p>
                                What we created was more than just a place to stay; it’s a sanctuary designed to quiet the mind and awaken the senses. We invite you to share in this peace.
                            </p>
                        </div>
                    </MotionDiv>
                    <MotionDiv
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                        {storyImage && (
                             <div className="aspect-[4/3] rounded-xl overflow-hidden shadow-lg">
                                <MotionDiv
                                    initial={{ scale: 1.05, opacity: 0 }}
                                    whileInView={{ scale: 1, opacity: 1 }}
                                    transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                                    viewport={{ once: true }}
                                    className="w-full h-full"
                                >
                                    <Image
                                        src={storyImage.imageUrl}
                                        alt={storyImage.description}
                                        width={800}
                                        height={600}
                                        className="object-cover w-full h-full"
                                        data-ai-hint={storyImage.imageHint}
                                    />
                                </MotionDiv>
                            </div>
                        )}
                    </MotionDiv>
                </div>
            </Section>

            <div className="bg-secondary/30">
                <Section>
                    <MotionDiv
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="text-center"
                    >
                        <h2 className="font-headline text-4xl md:text-5xl text-primary">Our Philosophy</h2>
                        <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
                            We believe in simple truths and heartfelt hospitality.
                        </p>
                    </MotionDiv>
                    <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
                        {values.map((value, index) => (
                            <MotionDiv
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8, ease: "easeOut" }}
                            >
                                <div className="flex justify-center mb-4">
                                    <value.icon className="w-10 h-10 text-primary/70" />
                                </div>
                                <h3 className="font-headline text-2xl">{value.title}</h3>
                                <p className="mt-2 text-muted-foreground/90">{value.description}</p>
                            </MotionDiv>
                        ))}
                    </div>
                </Section>
            </div>
            
            <Section>
                <div className="max-w-5xl mx-auto text-center">
                     <MotionDiv
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                        <h2 className="font-headline text-4xl md:text-5xl text-primary">A Place Apart</h2>
                        <p className="mt-4 max-w-3xl mx-auto text-lg text-muted-foreground/90 leading-relaxed">
                            Nestled in a secluded valley, our property is a world away from the everyday. Here, the landscape dictates the rhythm of the day, from the sun rising over the peaks to the vast, starry sky at night. It is a place to simply be.
                        </p>
                    </MotionDiv>
                    <MotionDiv
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="mt-12"
                    >
                        {locationImage && (
                            <div className="aspect-[16/7] rounded-xl overflow-hidden shadow-lg">
                                 <MotionDiv
                                    initial={{ scale: 1.05, opacity: 0 }}
                                    whileInView={{ scale: 1, opacity: 1 }}
                                    transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                                    viewport={{ once: true }}
                                    className="w-full h-full"
                                >
                                    <Image
                                        src={locationImage.imageUrl}
                                        alt={locationImage.description}
                                        width={1600}
                                        height={700}
                                        className="object-cover w-full h-full"
                                        data-ai-hint={locationImage.imageHint}
                                    />
                                </MotionDiv>
                            </div>
                        )}
                    </MotionDiv>
                </div>
            </Section>

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
