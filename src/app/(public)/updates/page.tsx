import { PageHeader } from "@/components/page-header";

export default function UpdatesPage() {
    return (
        <div>
            <PageHeader
                title="Updates & News"
                description="The latest happenings at Glampify."
            />
            <div className="container max-w-4xl py-16">
                <p className="text-lg text-muted-foreground">Content coming soon...</p>
            </div>
        </div>
    );
}
