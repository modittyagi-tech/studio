import { PageHeader } from "@/components/page-header";
import { mockStays } from "@/lib/data";
import { notFound } from "next/navigation";

export default function StayDetailPage({ params }: { params: { slug: string } }) {
    const stay = mockStays.find(s => s.slug === params.slug);

    if (!stay) {
        notFound();
    }

    return (
        <div>
            <PageHeader
                title={stay.name}
                description={stay.short_description}
            />
            <div className="container max-w-4xl py-16">
                <p className="text-lg text-muted-foreground">{stay.long_description}</p>
                 <p className="text-lg text-muted-foreground mt-8">More details coming soon...</p>
            </div>
        </div>
    );
}

export async function generateStaticParams() {
  return mockStays.map((stay) => ({
    slug: stay.slug,
  }));
}
