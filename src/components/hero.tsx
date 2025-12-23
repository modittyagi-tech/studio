"use client";
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { MotionDiv, MotionH1, MotionP } from './motion';

export function Hero() {
  const heroImage = PlaceHolderImages.find(img => img.id === 'hero-1');

  const animationVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <section className="relative h-[85vh] md:h-[90vh] w-full flex items-center justify-center text-white overflow-hidden">
      {heroImage && (
        <Image
          src={heroImage.imageUrl}
          alt={heroImage.description}
          fill
          className="object-cover"
          priority
          data-ai-hint={heroImage.imageHint}
        />
      )}
      <div className="absolute inset-0 bg-black/50" />
      <MotionDiv
        className="relative z-10 text-center px-4"
        initial="hidden"
        animate="visible"
        transition={{ staggerChildren: 0.3 }}
      >
        <MotionH1
          variants={animationVariants}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="font-headline text-5xl md:text-7xl lg:text-8xl drop-shadow-lg"
        >
          Escape to Nature's Embrace
        </MotionH1>
        <MotionP
          variants={animationVariants}
          transition={{ duration: 0.5, ease: 'easeOut', delay: 0.2 }}
          className="mt-4 max-w-2xl mx-auto text-lg md:text-xl drop-shadow-md"
        >
          Discover luxury glamping where comfort meets the wilderness. Unwind, reconnect, and create unforgettable memories.
        </MotionP>
        <MotionDiv
          variants={animationVariants}
          transition={{ duration: 0.5, ease: 'easeOut', delay: 0.4 }}
          className="mt-8"
        >
          <Button size="lg" asChild>
            <Link href="/stays">Explore Our Stays</Link>
          </Button>
        </MotionDiv>
      </MotionDiv>
    </section>
  );
}
