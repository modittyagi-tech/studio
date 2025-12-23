import { PageHeader } from "@/components/page-header";

export default function FaqPage() {
    return (
        <div>
            <PageHeader
                title="Frequently Asked Questions"
                description="Your questions, answered."
            />
            <div className="container max-w-4xl py-16">
                <p className="text-lg text-muted-foreground">Content coming soon...</p>
            </div>
        </div>
    );
}
