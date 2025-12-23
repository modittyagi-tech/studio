"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { imageHarmonizer, ImageHarmonizerOutput } from "@/ai/flows/image-harmonizer";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info } from "lucide-react";

const formSchema = z.object({
  image: z.any()
    .refine((files) => files?.length === 1, "Image is required.")
    .refine((files) => files?.[0]?.size <= 5000000, `Max file size is 5MB.`)
    .refine(
      (files) => ["image/jpeg", "image/png", "image/webp"].includes(files?.[0]?.type),
      ".jpg, .png and .webp files are accepted."
    ),
});

export function ImageHarmonizerTool() {
  const { toast } = useToast();
  const [result, setResult] = useState<ImageHarmonizerOutput | null>(null);
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const fileToDataUri = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        resolve(event.target?.result as string);
      };
      reader.onerror = (error) => {
        reject(error);
      };
      reader.readAsDataURL(file);
    });
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setResult(null);
    setOriginalImage(null);
    
    try {
      const file = values.image[0];
      const photoDataUri = await fileToDataUri(file);
      setOriginalImage(photoDataUri);

      const harmonizedResult = await imageHarmonizer({
        photoDataUri,
        // HSL values from globals.css for the theme
        primaryColor: 'hsl(120 61% 34%)',
        backgroundColor: 'hsl(240 100% 99%)',
        accentColor: 'hsl(60 56% 91%)',
      });

      setResult(harmonizedResult);
      toast({
        title: "Image Harmonized!",
        description: "The AI has processed your image.",
      });
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "An error occurred",
        description: "Could not harmonize the image. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Harmonize Your Image</CardTitle>
      </CardHeader>
      <CardContent className="space-y-8">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Upload Image</FormLabel>
                  <FormControl>
                    <Input 
                      type="file" 
                      accept="image/png, image/jpeg, image/webp"
                      onChange={(e) => field.onChange(e.target.files)}
                    />
                  </FormControl>
                  <FormDescription>
                    Upload a JPG, PNG, or WEBP file (max 5MB).
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Harmonizing..." : "Harmonize Image"}
            </Button>
          </form>
        </Form>
        {isLoading && <p>Harmonizing image, please wait...</p>}
        {result && (
          <div className="mt-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-headline text-xl mb-2">Original Image</h3>
                {originalImage && <Image src={originalImage} alt="Original" width={500} height={500} className="rounded-md border object-contain" />}
              </div>
              <div>
                <h3 className="font-headline text-xl mb-2">Harmonized Image</h3>
                <Image src={result.harmonizedImageUri} alt="Harmonized" width={500} height={500} className="rounded-md border object-contain" />
              </div>
            </div>
            {result.suggestions && (
              <Alert>
                <Info className="h-4 w-4" />
                <AlertTitle>Manual Suggestions</AlertTitle>
                <AlertDescription>
                  {result.suggestions}
                </AlertDescription>
              </Alert>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
