
import type { Stay } from '@/lib/types';
import Image from 'next/image';
import Link from 'next/link';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Button } from './ui/button';
import { ArrowRight, Users, Bed } from 'lucide-react';
import { MotionDiv } from './motion';

export function StayCard({ stay }: { stay: Stay }) {
  const image = PlaceHolderImages.find(img => img.id === stay.images[0]) || {imageUrl: `https://picsum.photos/seed/${stay.id}/600/450`, imageHint: stay.name, description: stay.name};

  return (
    <div className="block group h-full">
        <MotionDiv
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        whileHover={{ y: -6 }}
        className="overflow-hidden rounded-2xl bg-card border h-full flex flex-col transition-shadow duration-300 hover:shadow-xl"
        >
        
        <Link href={`/stays/${stay.slug}`} className="block overflow-hidden">
            <div className="aspect-w-4 aspect-h-3">
                <Image
                src={image.imageUrl}
                alt={stay.name}
                width={600}
                height={450}
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                data-ai-hint={image.imageHint}
                />
            </div>
        </Link>
        
        <div className="p-6 flex flex-col flex-grow">
            <h3 className="font-headline text-2xl">{stay.name}</h3>
            <p className="mt-2 text-muted-foreground flex-grow">{stay.short_description}</p>
            <div className="mt-4 flex items-center space-x-6 text-sm text-muted-foreground">
                <div className="flex items-center">
                    <Users className="h-4 w-4 mr-2 text-primary/70" />
                    <span>{stay.max_guests_per_room} guests</span>
                </div>
            </div>
            <div className="mt-6 pt-4 border-t flex justify-between items-center">
            <p className="text-xl font-bold">
                ${stay.price_per_night}<span className="text-sm font-normal text-muted-foreground">/night</span>
            </p>
            <Link href={`/stays/${stay.slug}`} className="text-primary group-hover:text-primary flex items-center">
                View Details <ArrowRight className="w-4 h-4 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
            </div>
        </div>
        </MotionDiv>
    </div>
  );
}

    