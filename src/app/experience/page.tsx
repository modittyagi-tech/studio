import { PageHeader } from "@/components/page-header";
import { LuxuryHighlights } from "@/components/luxury-highlights";

export default function ExperiencePage() {
    return (
        <div>
            <PageHeader
                title="The Glampify Experience"
                description="More than just a place to sleep, it's a place to live."
            />
            <LuxuryHighlights />
             <div className="container max-w-4xl py-16">
                <p className="text-lg text-muted-foreground">More content coming soon...</p>
            </div>
        </div>
    );
}
