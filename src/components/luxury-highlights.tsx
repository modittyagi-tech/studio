"use client";
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Image from 'next/image';
import { MotionDiv } from './motion';

const highlights = [
  {
    title: 'Private Jacuzzis',
    description: 'Unwind in your personal hot tub under the open sky, a perfect end to any day.',
    imageId: 'highlight-1',
  },
  {
    title: 'Stunning Views',
    description: 'Each stay offers breathtaking vistas, from serene forests to majestic mountains.',
    imageId: 'highlight-2',
  },
  {
    title: 'Gourmet Experiences',
    description: 'Enjoy chef-prepared meals or cook in your own modern kitchenette.',
    imageId: 'highlight-3',
  },
  {
    title: 'Connected Seclusion',
    description: 'High-speed internet allows you to stay connected, or completely unplug.',
    imageId: 'experience-1',
  }
];

export function LuxuryHighlights() {
  return (
    <section className="py-24 md:py-40 bg-background">
      <div className="container max-w-7xl">
        <MotionDiv
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6 }}
        >
          <h2 className="font-headline text-center text-4xl md:text-5xl lg:text-6xl">Uncompromising Luxury</h2>
          <p className="mt-4 max-w-2xl mx-auto text-center text-lg text-muted-foreground/90">
            We've thought of everything so you don't have to.
          </p>
        </MotionDiv>
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {highlights.map((highlight, index) => {
            const image = PlaceHolderImages.find(img => img.id === highlight.imageId);
            return (
              <MotionDiv
                key={highlight.title}
                className="text-center"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="relative w-full aspect-square rounded-xl overflow-hidden shadow-lg group mx-auto">
                  {image && (
                      <Image 
                        src={image.imageUrl}
                        alt={highlight.title}
                        fill
                        className="object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        data-ai-hint={image.imageHint}
                      />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                  <div className="absolute inset-0 flex items-end p-6">
                      <h3 className="font-headline text-2xl text-white drop-shadow-md">{highlight.title}</h3>
                  </div>
                </div>
                <p className="mt-5 text-muted-foreground/90">{highlight.description}</p>
              </MotionDiv>
            );
          })}
        </div>
      </div>
    </section>
  );
}
