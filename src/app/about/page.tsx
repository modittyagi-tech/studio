import { PageHeader } from "@/components/page-header";

export default function AboutPage() {
    return (
        <div>
            <PageHeader
                title="About Glampify"
                description="Discover the story behind our passion for luxury and nature."
            />
            <div className="container max-w-4xl py-16">
                <p className="text-lg text-muted-foreground">Content coming soon...</p>
            </div>
        </div>
    );
}
