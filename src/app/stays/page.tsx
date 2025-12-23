import { PageHeader } from "@/components/page-header";
import { mockStays } from '@/lib/data';
import { StayCard } from '@/components/stay-card';

export default function StaysPage() {
    return (
        <div>
            <PageHeader
                title="Our Stays"
                description="Find your perfect escape. Each stay is a unique blend of comfort and wilderness."
            />
            <div className="container max-w-7xl py-16">
                 <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {mockStays.map((stay) => (
                        <StayCard key={stay.id} stay={stay} />
                    ))}
                </div>
            </div>
        </div>
    );
}
