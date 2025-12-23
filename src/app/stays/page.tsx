import { PageHeader } from "@/components/page-header";
import { mockStays } from '@/lib/data';
import { StayCard } from '@/components/stay-card';
import Section from "@/components/section";

export default function StaysPage() {
    return (
        <div>
            <PageHeader
                title="Our Stays"
                description="Find your perfect escape. Each stay is a unique blend of comfort and wilderness."
            />
            <Section>
                 <div className="grid md:grid-cols-2 gap-12">
                    {mockStays.map((stay) => (
                        <StayCard key={stay.id} stay={stay} />
                    ))}
                </div>
            </Section>
        </div>
    );
}
