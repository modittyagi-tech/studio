"use client";
import { mockTestimonials } from '@/lib/data';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Card, CardContent } from './ui/card';
import { MotionDiv } from './motion';
import { Star } from 'lucide-react';

export function Testimonials() {
  return (
    <section className="py-16 md:py-24 bg-secondary/20">
      <div className="container max-w-7xl">
        <MotionDiv
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="font-headline text-center text-4xl md:text-5xl">Words from Our Guests</h2>
          <p className="mt-4 max-w-2xl mx-auto text-center text-lg text-muted-foreground">
            Don't just take our word for it. Here's what our guests have to say.
          </p>
        </MotionDiv>
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8">
          {mockTestimonials.map((testimonial, index) => {
            const image = PlaceHolderImages.find(img => img.id === testimonial.imageId);
            return (
              <MotionDiv
                key={testimonial.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full">
                  <CardContent className="p-8 h-full flex flex-col justify-center">
                    <div className="flex mb-2">
                        {[...Array(5)].map((_, i) => (
                            <Star key={i} className="h-5 w-5 text-primary fill-primary" />
                        ))}
                    </div>
                    <blockquote className="text-lg text-foreground italic">
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
                  </CardContent>
                </Card>
              </MotionDiv>
            );
          })}
        </div>
      </div>
    </section>
  );
}
