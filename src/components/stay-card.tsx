import type { Stay } from '@/lib/types';
import Image from 'next/image';
import Link from 'next/link';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Button } from './ui/button';
import { ArrowRight, Users, Bed } from 'lucide-react';

export function StayCard({ stay }: { stay: Stay }) {
  const image = PlaceHolderImages.find(img => img.id === stay.images[0]);

  return (
    <div className="bg-card border rounded-lg overflow-hidden shadow-sm transition-shadow hover:shadow-lg h-full flex flex-col">
      {image && (
        <Link href={`/stays/${stay.slug}`} className="block">
          <div className="aspect-w-16 aspect-h-9">
            <Image
              src={image.imageUrl}
              alt={stay.name}
              width={600}
              height={400}
              className="object-cover"
              data-ai-hint={image.imageHint}
            />
          </div>
        </Link>
      )}
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="font-headline text-2xl text-primary">{stay.name}</h3>
        <p className="mt-2 text-muted-foreground flex-grow">{stay.short_description}</p>
        <div className="mt-4 flex items-center space-x-4 text-sm text-muted-foreground">
            <div className="flex items-center">
                <Users className="h-4 w-4 mr-1.5" />
                <span>Up to {stay.max_guests} guests</span>
            </div>
            <div className="flex items-center">
                <Bed className="h-4 w-4 mr-1.5" />
                <span>Queen/King Bed</span>
            </div>
        </div>
        <div className="mt-6 flex justify-between items-center">
          <p className="text-lg font-bold">
            ${stay.price_per_night}<span className="text-sm font-normal text-muted-foreground">/night</span>
          </p>
          <Button asChild variant="ghost" className="text-primary hover:text-primary">
            <Link href={`/stays/${stay.slug}`}>
              Details <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
