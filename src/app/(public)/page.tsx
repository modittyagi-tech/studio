import { Hero } from "@/components/hero";
import { ExperienceOverview } from "@/components/experience-overview";
import { FeaturedStays } from "@/components/featured-stays";
import { LuxuryHighlights } from "@/components/luxury-highlights";
import { Testimonials } from "@/components/testimonials";
import { CtaSection } from "@/components/cta-section";
import { BookingEnquiry } from "@/components/booking-enquiry";

export default function Home() {
  return (
    <>
      <Hero />
      <ExperienceOverview />
      <FeaturedStays />
      <LuxuryHighlights />
      <Testimonials />
      <BookingEnquiry />
      <CtaSection />
    </>
  );
}
