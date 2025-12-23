
"use client";

import { useState } from "react";
import { PageHeader } from "@/components/page-header";
import Section from "@/components/section";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { MotionDiv } from "@/components/motion";
import Image from "next/image";
import { Dialog, DialogContent } from "@/components/ui/dialog";

const galleryImages = PlaceHolderImages.filter(img => 
  ['stay-1', 'stay-2', 'stay-3', 'highlight-1', 'highlight-2', 'experience-1', 'stay-1-gallery-2', 'stay-2-gallery-1', 'stay-3-gallery-1', 'stay-3-gallery-2'].includes(img.id)
);

export default function GalleryPage() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  return (
    <div>
      <PageHeader
        title="Gallery"
        description="A glimpse into the Glampify experience."
      />
      <Section>
        <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
          {galleryImages.map((image) => (
            <MotionDiv
              key={image.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="break-inside-avoid"
            >
              <div
                className="group relative overflow-hidden rounded-2xl shadow-sm hover:shadow-xl transition-shadow duration-300 cursor-pointer"
                onClick={() => setSelectedImage(image.imageUrl)}
              >
                <Image
                  src={image.imageUrl}
                  alt={image.description}
                  width={800}
                  height={600}
                  className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
                  data-ai-hint={image.imageHint}
                />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
              </div>
            </MotionDiv>
          ))}
        </div>
      </Section>
      
      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-4xl p-0 border-0 bg-transparent">
          {selectedImage && (
            <Image
              src={selectedImage}
              alt="Selected image"
              width={1600}
              height={1200}
              className="w-full h-auto object-contain rounded-lg"
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
