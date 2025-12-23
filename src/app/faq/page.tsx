
"use client";

import { PageHeader } from "@/components/page-header";
import Section from "@/components/section";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { MotionDiv } from "@/components/motion";

const faqData = [
    {
        category: "Booking & Stay",
        questions: [
            {
                id: "q1",
                question: "What time is check-in and check-out?",
                answer: "Check-in is at 3:00 PM, and check-out is at 11:00 AM. We offer a seamless self-check-in process for your convenience.",
            },
            {
                id: "q2",
                question: "Do you allow early check-in or late check-out?",
                answer: "We can sometimes accommodate requests for early check-in or late check-out, depending on our booking schedule. Please contact us a few days before your arrival to inquire.",
            },
            {
                id: "q3",
                question: "How many guests are allowed per stay?",
                answer: "Each of our stays has a specific guest capacity, which is listed on its individual page. Please ensure your party size does not exceed the maximum limit.",
            },
        ],
    },
    {
        category: "Policies",
        questions: [
            {
                id: "q4",
                question: "What is your cancellation policy?",
                answer: "We offer a full refund for cancellations made within 48 hours of booking. For cancellations made up to 14 days before check-in, we offer a 50% refund. Cancellations within 14 days of check-in are non-refundable.",
            },
            {
                id: "q5",
                question: "Are pets allowed?",
                answer: "We love well-behaved pets! Several of our stays are pet-friendly. Please check the amenities list on the stay's page or contact us to confirm before booking.",
            },
        ],
    },
    {
        category: "Experience & Amenities",
        questions: [
            {
                id: "q6",
                question: "Is food included with our stay?",
                answer: "While our stays feature kitchenettes for your own meal preparation, we do not include meals. We can, however, recommend excellent local dining options and private chefs.",
            },
            {
                id: "q7",
                question: "Are the jacuzzis and firepits private?",
                answer: "Yes, all amenities listed for a specific stay, including jacuzzis and firepits, are for your private and exclusive use during your stay.",
            },
        ],
    },
    {
        category: "Location",
        questions: [
            {
                id: "q8",
                question: "How do we get to the property?",
                answer: "Detailed driving directions will be provided upon booking confirmation. The property is accessible by car, and the road is well-maintained.",
            },
            {
                id: "q9",
                question: "Is there parking available?",
                answer: "Yes, each stay includes complimentary private parking for at least one vehicle.",
            },
        ],
    },
];

export default function FaqPage() {
  return (
    <div>
      <PageHeader
        title="Frequently Asked Questions"
        description="Everything you need to know to plan your escape."
      />
      <Section>
        <div className="max-w-4xl mx-auto">
          {faqData.map((category, index) => (
            <MotionDiv
              key={category.category}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: "easeOut", delay: index * 0.1 }}
              className="mb-12 last:mb-0"
            >
              <h2 className="font-headline text-3xl md:text-4xl text-primary mb-8">{category.category}</h2>
              <Accordion type="single" collapsible className="w-full">
                {category.questions.map((faq) => (
                  <AccordionItem key={faq.id} value={faq.id}>
                    <AccordionTrigger className="text-left text-lg hover:no-underline">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground/90 text-base leading-relaxed pt-2">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </MotionDiv>
          ))}
        </div>
      </Section>
    </div>
  );
}
