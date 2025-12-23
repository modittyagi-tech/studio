"use client";
import { mockStays } from '@/lib/data';
import { StayCard } from './stay-card';
import { MotionDiv } from './motion';
import Section from './section';

export function FeaturedStays() {
  const featured = mockStays.filter(stay => stay.is_featured);

  return (
    <div className="bg-secondary/30">
      <Section>
        <MotionDiv
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <h2 className="font-headline text-center text-4xl md:text-5xl text-primary">Featured Stays</h2>
          <p className="mt-4 max-w-2xl mx-auto text-center text-lg text-muted-foreground">
            Hand-picked accommodations that offer a unique and luxurious experience.
          </p>
        </MotionDiv>
        <div className="mt-16 grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featured.map((stay, index) => (
            <MotionDiv
              key={stay.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <StayCard stay={stay} />
            </MotionDiv>
          ))}
        </div>
      </Section>
    </div>
  );
}
