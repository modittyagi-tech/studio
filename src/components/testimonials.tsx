"use client";
import { mockTestimonials } from '@/lib/data';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { MotionDiv } from './motion';
import { Star } from 'lucide-react';
import Section from './section';

export function Testimonials() {
  return (
    <div className="bg-secondary/30">
      <Section>
        <MotionDiv
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <h2 className="font-headline text-center text-4xl md:text-5xl">Words From Our Guests</h2>
          <p className="mt-4 max-w-2xl mx-auto text-center text-lg text-muted-foreground/90">
            Don't just take our word for it. Here's what our guests have to say.
          </p>
        </MotionDiv>
        <div className="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-8">
          {mockTestimonials.map((testimonial, index) => {
            const image = PlaceHolderImages.find(img => img.id === testimonial.imageId);
            return (
              <MotionDiv
                key={testimonial.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              >
                <div className="h-full bg-background/50 rounded-xl p-8 lg:p-12 flex flex-col justify-center border">
                    <div className="flex mb-4">
                        {[...Array(5)].map((_, i) => (
                            <Star key={i} className="h-5 w-5 text-primary fill-current" />
                        ))}
                    </div>
                    <blockquote className="text-lg text-foreground/80 leading-relaxed italic">
                      "{testimonial.quote}"
                    </blockquote>
                    <div className="mt-6 flex items-center">
                      {image && (
                        <Image
                          src={image.imageUrl}
                          alt={testimonial.author}
                          width={48}
                          height={48}
                          className="rounded-full"
                          data-ai-hint={image.imageHint}
                        />
                      )}
                      <div className="ml-4">
                        <p className="font-bold text-foreground">{testimonial.author}</p>
                        <p className="text-sm text-muted-foreground">{testimonial.location}</p>
                      </div>
                    </div>
                  </div>
              </MotionDiv>
            );
          })}
        </div>
      </Section>
    </div>
  );
}
