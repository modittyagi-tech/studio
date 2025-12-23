import { PageHeader } from "@/components/page-header";
import { mockStays } from "@/lib/data";
import { notFound } from "next/navigation";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Amenity } from "@/lib/types";
import { Wifi, Wind, Thermometer, Dog, Flame, Utensils, Tv } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Section from "@/components/section";
import { MotionDiv } from "@/components/motion";


const amenityIcons: Record<Amenity, React.ElementType> = {
    wifi: Wifi,
    jacuzzi: Wind, // Using Wind as a placeholder, since there's no jacuzzi icon
    'pet-friendly': Dog,
    kitchenette: Utensils,
    fireplace: Flame,
    ac: Thermometer,
};

export default function StayDetailPage({ params }: { params: { slug: string } }) {
    const stay = mockStays.find(s => s.slug === params.slug);

    if (!stay) {
        notFound();
    }

    const heroImage = PlaceHolderImages.find(img => img.id === stay.images[0]);
    const galleryImages = stay.images.slice(1).map(id => PlaceHolderImages.find(img => img.id === id)).filter(Boolean);

    return (
        <div>
            <PageHeader
                title={stay.name}
                description={stay.short_description}
            />

            {heroImage && (
                <div className="container max-w-5xl -mt-16 mb-16">
                     <div className="relative aspect-[16/9] rounded-2xl overflow-hidden shadow-lg">
                        <MotionDiv
                            initial={{ scale: 1.05, opacity: 0 }}
                            whileInView={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            viewport={{ once: true }}
                            className="w-full h-full"
                        >
                            <Image
                                src={heroImage.imageUrl}
                                alt={stay.name}
                                fill
                                className="object-cover"
                                data-ai-hint={heroImage.imageHint}
                                priority
                            />
                        </MotionDiv>
                         <div className="absolute inset-0 bg-black/20" />
                    </div>
                </div>
            )}
            
            <Section>
                <div className="grid md:grid-cols-3 gap-16">
                    <div className="md:col-span-2">
                        <MotionDiv
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                        >
                            <h2 className="font-headline text-3xl md:text-4xl text-primary">About Your Stay</h2>
                            <div className="mt-6 space-y-6 text-lg text-muted-foreground/90 leading-relaxed">
                                <p>{stay.long_description}</p>
                            </div>
                        </MotionDiv>

                        {galleryImages.length > 0 && (
                            <MotionDiv 
                                className="mt-16"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8, ease: "easeOut" }}
                            >
                                <h3 className="font-headline text-2xl md:text-3xl text-primary mb-6">A Glimpse Inside</h3>
                                <div className="grid grid-cols-2 gap-4">
                                {galleryImages.map(image => image && (
                                    <div key={image.id} className="relative aspect-w-4 aspect-h-3 rounded-xl overflow-hidden">
                                        <MotionDiv
                                            initial={{ scale: 1.05, opacity: 0 }}
                                            whileInView={{ scale: 1, opacity: 1 }}
                                            transition={{ duration: 0.8, ease: "easeOut" }}
                                            viewport={{ once: true }}
                                            className="w-full h-full"
                                        >
                                            <Image 
                                                src={image.imageUrl}
                                                alt={image.description}
                                                fill
                                                className="object-cover"
                                                data-ai-hint={image.imageHint}
                                            />
                                        </MotionDiv>
                                    </div>
                                ))}
                                </div>
                            </MotionDiv>
                        )}
                    </div>

                    <div className="md:col-span-1">
                        <MotionDiv
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="sticky top-28"
                        >
                            <div className="bg-secondary/30 p-8 rounded-2xl border">
                                <h3 className="font-headline text-2xl text-primary">Details</h3>
                                <ul className="mt-6 space-y-4">
                                    <li className="flex items-center">
                                        <span className="font-bold w-32">Guests:</span>
                                        <span className="text-muted-foreground">{stay.max_guests} people</span>
                                    </li>
                                    <li className="flex items-center">
                                        <span className="font-bold w-32">Price:</span>
                                        <span className="text-muted-foreground">${stay.price_per_night}/night</span>
                                    </li>
                                </ul>
                                
                                <h3 className="font-headline text-2xl text-primary mt-8">Amenities</h3>
                                <div className="mt-6 grid grid-cols-2 gap-4">
                                    {stay.amenities.map(amenity => {
                                        const Icon = amenityIcons[amenity as Amenity];
                                        return (
                                            <div key={amenity} className="flex items-center text-muted-foreground">
                                                {Icon && <Icon className="w-5 h-5 mr-3 text-primary/70" />}
                                                <span className="capitalize">{amenity.replace('-', ' ')}</span>
                                            </div>
                                        )
                                    })}
                                </div>

                                <div className="mt-10 pt-6 border-t">
                                    <Button size="lg" className="w-full" asChild>
                                        <Link href="/contact">Enquire About This Stay</Link>
                                    </Button>
                                </div>
                            </div>
                        </MotionDiv>
                    </div>
                </div>
            </Section>

        </div>
    );
}

export async function generateStaticParams() {
  return mockStays.map((stay) => ({
    slug: stay.slug,
  }));
}
