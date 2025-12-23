import { ImageHarmonizerTool } from "@/components/image-harmonizer-tool";
import { PageHeader } from "@/components/page-header";

export default function ImageHarmonizerPage() {
    return (
        <>
            <PageHeader 
                title="Image Harmonizer"
                description="Upload an image to harmonize it with the website's color palette."
            />
            <div className="container max-w-4xl py-16">
                <ImageHarmonizerTool />
            </div>
        </>
    )
}
