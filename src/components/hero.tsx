"use client";
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { MotionDiv, MotionH1, MotionP } from './motion';
import { ArrowDown } from 'lucide-react';

export function Hero() {
  const heroImage = PlaceHolderImages.find(img => img.id === 'hero-1');

  const animationVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <section className="relative h-screen w-full flex items-center justify-center text-white overflow-hidden">
      {heroImage && (
        <MotionDiv 
          className="absolute inset-0"
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <Image
            src={heroImage.imageUrl}
            alt={heroImage.description}
            fill
            className="object-cover"
            priority
            data-ai-hint={heroImage.imageHint}
          />
        </MotionDiv>
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/40 to-transparent" />
      
      <MotionDiv
        className="relative z-10 text-center px-4"
        initial="hidden"
        animate="visible"
        transition={{ staggerChildren: 0.3 }}
      >
        <MotionH1
          variants={animationVariants}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="font-headline text-5xl md:text-7xl lg:text-8xl drop-shadow-lg"
        >
          Escape to Nature's Embrace
        </MotionH1>
        <MotionP
          variants={animationVariants}
          transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
          className="mt-4 max-w-3xl mx-auto text-lg md:text-xl text-white/90 drop-shadow-md"
        >
          Discover luxury glamping where sublime comfort meets the untamed wilderness. Unwind, reconnect, and create unforgettable memories.
        </MotionP>
        <MotionDiv
          variants={animationVariants}
          transition={{ duration: 0.8, ease: 'easeOut', delay: 0.4 }}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Button size="lg" asChild>
            <Link href="/stays">Explore Our Stays</Link>
          </Button>
          <Button size="lg" variant="outline" asChild className="bg-transparent text-white border-white/80 hover:bg-white/10">
            <Link href="#experience">The Experience</Link>
          </Button>
        </MotionDiv>
      </MotionDiv>
       <MotionDiv 
        className="absolute bottom-10 z-10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1, ease: 'easeOut' }}
      >
        <Link href="#experience" aria-label="Scroll down">
          <ArrowDown className="h-8 w-8 text-white/80 animate-bounce" />
        </Link>
      </MotionDiv>
    </section>
  );
}
