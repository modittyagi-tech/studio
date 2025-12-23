
export type Amenity = 'wifi' | 'jacuzzi' | 'pet-friendly' | 'kitchenette' | 'fireplace' | 'ac';

export interface Stay {
  id: string;
  name: string;
  slug: string;
  short_description: string;
  long_description: string;
  price_per_night: number;
  max_guests_per_room: number;
  amenities: Amenity[];
  images: string[]; // array of image IDs from placeholder-images.json
  is_featured: boolean;
  total_rooms: number;
}

export interface Testimonial {
    id: string;
    quote: string;
    author: string;
    location: string;
    imageId: string;
}

export interface NavLink {
    href: string;
    label: string;
}

    