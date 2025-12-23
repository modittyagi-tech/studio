'use server';

/**
 * @fileOverview An AI tool to harmonize uploaded images with the site's color palette.
 *
 * - imageHarmonizer - A function that handles the image harmonization process.
 * - ImageHarmonizerInput - The input type for the imageHarmonizer function.
 * - ImageHarmonizerOutput - The return type for the imageHarmonizer function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ImageHarmonizerInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo to be harmonized with the site's color palette, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  primaryColor: z.string().describe('The primary color of the site (e.g., #228B22).'),
  backgroundColor: z.string().describe('The background color of the site (e.g., #F8F8FF).'),
  accentColor: z.string().describe('The accent color of the site (e.g., #F5F5DC).'),
});
export type ImageHarmonizerInput = z.infer<typeof ImageHarmonizerInputSchema>;

const ImageHarmonizerOutputSchema = z.object({
  harmonizedImageUri: z
    .string()
    .describe(
      'The harmonized image as a data URI, adjusted to fit the site\s color palette.'
    ),
  suggestions: z
    .string()
    .optional()
    .describe(
      'Suggestions for manual image modification if the image is wildly out of sync with the site\s color palette.'
    ),
});
export type ImageHarmonizerOutput = z.infer<typeof ImageHarmonizerOutputSchema>;

export async function imageHarmonizer(input: ImageHarmonizerInput): Promise<ImageHarmonizerOutput> {
  return imageHarmonizerFlow(input);
}

const prompt = ai.definePrompt({
  name: 'imageHarmonizerPrompt',
  input: {schema: ImageHarmonizerInputSchema},
  output: {schema: ImageHarmonizerOutputSchema},
  prompt: `You are an AI assistant that helps harmonize images with a website's color palette.

You will receive an image and the website's primary, background, and accent colors.  Your goal is to suggest modifications to the image so that it fits well with the site's color scheme.

Consider adjustments to brightness, contrast, saturation, and color balance.

Primary Color: {{{primaryColor}}}
Background Color: {{{backgroundColor}}}
Accent Color: {{{accentColor}}}

Here is the image: {{media url=photoDataUri}}

If the image is already well-aligned with the color palette, return the original image. If the image is wildly out of sync, provide suggestions for manual modification in the "suggestions" field. In all cases, return the potentially modified image as a data URI in the "harmonizedImageUri" field.

Output only JSON.`,
});

const imageHarmonizerFlow = ai.defineFlow(
  {
    name: 'imageHarmonizerFlow',
    inputSchema: ImageHarmonizerInputSchema,
    outputSchema: ImageHarmonizerOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
