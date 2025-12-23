import { PageHeader } from "@/components/page-header";

export default function GalleryPage() {
    return (
        <div>
            <PageHeader
                title="Gallery"
                description="A glimpse into the Glampify experience."
            />
            <div className="container max-w-7xl py-16">
                <p className="text-lg text-muted-foreground">Content coming soon...</p>
            </div>
        </div>
    );
}
