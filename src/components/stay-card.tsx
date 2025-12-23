import type { Stay } from '@/lib/types';
import Image from 'next/image';
import Link from 'next/link';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Button } from './ui/button';
import { ArrowRight, Users, Bed } from 'lucide-react';
import { MotionDiv } from './motion';

export function StayCard({ stay }: { stay: Stay }) {
  const image = PlaceHolderImages.find(img => img.id === stay.images[0]);

  return (
    <MotionDiv
      whileHover={{ y: -6 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="overflow-hidden rounded-2xl bg-card border h-full flex flex-col group transition-shadow duration-300 hover:shadow-xl"
    >
      {image && (
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
      )}
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="font-headline text-2xl">{stay.name}</h3>
        <p className="mt-2 text-muted-foreground flex-grow">{stay.short_description}</p>
        <div className="mt-4 flex items-center space-x-6 text-sm text-muted-foreground">
            <div className="flex items-center">
                <Users className="h-4 w-4 mr-2 text-primary/70" />
                <span>{stay.max_guests} guests</span>
            </div>
            <div className="flex items-center">
                <Bed className="h-4 w-4 mr-2 text-primary/70" />
                <span>Queen/King</span>
            </div>
        </div>
        <div className="mt-6 pt-4 border-t flex justify-between items-center">
          <p className="text-xl font-bold">
            ${stay.price_per_night}<span className="text-sm font-normal text-muted-foreground">/night</span>
          </p>
          <Button asChild variant="link" className="text-primary hover:text-primary">
            <Link href={`/stays/${stay.slug}`}>
              View Details <ArrowRight className="w-4 h-4 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>
      </div>
    </MotionDiv>
  );
}
